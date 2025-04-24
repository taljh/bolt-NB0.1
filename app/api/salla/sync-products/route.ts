import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { SallaProduct } from "@/types/products";

export async function POST() {
  console.log("🔄 Step 1: Starting sync process...");
  
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // 1. التحقق من المستخدم
    console.log("👤 Step 2: Authenticating user...");
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("❌ Authentication failed:", userError);
      return NextResponse.json(
        { error: "غير مصرح لك بالمزامنة" },
        { status: 401 }
      );
    }
    console.log("✅ User authenticated:", user.id);

    // 2. جلب توكن سلة
    console.log("🔑 Step 3: Fetching Salla token...");
    const { data: tokenData, error: tokenError } = await supabase
      .from("salla_tokens")
      .select("access_token")
      .eq("user_id", user.id)
      .single();

    if (tokenError || !tokenData?.access_token) {
      console.error("❌ Token fetch failed:", tokenError);
      return NextResponse.json(
        { error: "لم يتم العثور على ربط مع سلة" },
        { status: 400 }
      );
    }
    console.log("✅ Salla token found");

    // 3. جلب المنتجات من سلة
    console.log("📡 Step 4: Fetching products from Salla...");
    const sallaResponse = await fetch("https://api.salla.dev/admin/v2/products", {
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
        "Accept": "application/json"
      }
    });

    if (!sallaResponse.ok) {
      const errorText = await sallaResponse.text();
      console.error("❌ Salla API error:", {
        status: sallaResponse.status,
        statusText: sallaResponse.statusText,
        body: errorText
      });
      return NextResponse.json(
        { error: "فشل في جلب المنتجات من سلة" },
        { status: 502 }
      );
    }

    const sallaData = await sallaResponse.json();
    const sallaProducts = sallaData.data || [];
    console.log("✅ Fetched", sallaProducts.length, "products from Salla");

    // 4. تحويل المنتجات إلى الصيغة المطلوبة
    console.log("🔄 Step 5: Formatting products...");
    const formattedProducts = sallaProducts.map((product: SallaProduct) => ({
      user_id: user.id,
      name: product.name,
      sku: product.sku || null,
      salla_product_id: String(product.id),
      source: "salla" as const,
      has_pricing: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // طباعة مثال على المنتج الأول للتحقق
    console.log("🧪 First product example:", JSON.stringify(formattedProducts[0], null, 2));
    console.log("📊 Total products to upsert:", formattedProducts.length);

    // 5. حفظ المنتجات في قاعدة البيانات
    console.log("💾 Step 6: Upserting to database...");
    const { data: inserted, error: upsertError } = await supabase
      .from("products")
      .upsert(formattedProducts, {
        onConflict: "user_id,salla_product_id",
        ignoreDuplicates: false
      })
      .select();

    if (upsertError) {
      // طباعة تفاصيل الخطأ كاملة
      console.error("❌ Database upsert failed:", {
        code: upsertError.code,
        message: upsertError.message,
        details: upsertError.details,
        hint: upsertError.hint
      });
      
      return NextResponse.json({ 
        error: "فشل في حفظ المنتجات في قاعدة البيانات",
        details: {
          code: upsertError.code,
          message: upsertError.message,
          details: upsertError.details,
          hint: upsertError.hint
        }
      }, { 
        status: 500 
      });
    }

    // 6. إكمال المزامنة بنجاح
    console.log("✅ Step 7: Sync completed successfully!");
    console.log("📝 Inserted/Updated products:", inserted?.length || 0);

    return NextResponse.json({
      success: true,
      message: "تمت المزامنة بنجاح",
      count: formattedProducts.length,
      updated: inserted?.length || 0
    });

  } catch (error) {
    // طباعة الخطأ بتفاصيل كاملة
    console.error("❌ Sync failed with error:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    // إرجاع رسالة خطأ مفصلة للواجهة
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "حدث خطأ أثناء مزامنة المنتجات",
      details: process.env.NODE_ENV === "development" ? error : undefined
    }, {
      status: 500
    });
  }
}