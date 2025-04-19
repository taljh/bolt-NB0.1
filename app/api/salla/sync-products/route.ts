import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// دالة لجلب المنتجات من سلة
async function fetchProducts(accessToken: string) {
  try {
    const response = await fetch('https://api.salla.dev/admin/v2/products', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // جلب بيانات المستخدم الحالي
    const { data: { session }} = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // جلب التوكن من جدول salla_tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from("salla_tokens")
      .select("access_token")
      .eq("user_id", session.user.id)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: "No Salla integration found" },
        { status: 404 }
      );
    }

    // جلب المنتجات من سلة
    const products = await fetchProducts(tokenData.access_token);

    // فلترة وتجهيز المنتجات للإدخال
    const productsToInsert = products
      .filter((product: any) => product.id && product.name)
      .map((product: any) => ({
        user_id: session.user.id,
        salla_product_id: product.id,
        name: product.name,
        sku: product.sku || null,
        created_at: new Date().toISOString()
      }));

    // حذف المنتجات القديمة للمستخدم (اختياري حسب استراتيجيتك)
    await supabase
      .from("products_new")
      .delete()
      .eq("user_id", session.user.id);

    // إدخال المنتجات الجديدة
    const { error: insertError } = await supabase
      .from("products_new")
      .insert(productsToInsert);

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: "تمت مزامنة المنتجات بنجاح",
      count: productsToInsert.length
    });

  } catch (error: any) {
    console.error("Error syncing products:", error);
    return NextResponse.json(
      { error: error.message || "فشل في مزامنة المنتجات" },
      { status: 500 }
    );
  }
}