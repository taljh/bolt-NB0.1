import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log('بدء عملية استيراد المنتجات...');
    const supabase = createRouteHandlerClient({ cookies });
    
    // 1. التحقق من المستخدم الحالي
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { message: "غير مصرح" },
        { status: 401 }
      );
    }

    // 2. جلب توكن سلة
    const { data: settings } = await supabase
      .from('project_settings')
      .select('salla_access_token')
      .eq('user_id', user.id)
      .single();

    if (!settings?.salla_access_token) {
      return NextResponse.json(
        { message: "لم يتم ربط متجر سلة" },
        { status: 400 }
      );
    }

    console.log('تم العثور على توكن سلة، جاري جلب المنتجات...');

    // 3. جلب المنتجات من سلة مع دعم الصفحات
    let allProducts: any[] = [];
    let nextPage = 'https://api.salla.dev/admin/v2/products';

    while (nextPage) {
      console.log('جلب المنتجات من:', nextPage);
      const sallaResponse = await fetch(nextPage, {
        headers: {
          'Authorization': `Bearer ${settings.salla_access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!sallaResponse.ok) {
        console.error('خطأ في استجابة سلة:', sallaResponse.status, sallaResponse.statusText);
        throw new Error(`خطأ في API سلة: ${sallaResponse.statusText}`);
      }

      const responseData = await sallaResponse.json();
      console.log(`تم جلب ${responseData.data?.length || 0} منتج من الصفحة الحالية`);
      allProducts = [...allProducts, ...responseData.data];
      nextPage = responseData.pagination?.next_page || null;
    }

    console.log(`إجمالي عدد المنتجات التي تم جلبها: ${allProducts.length}`);

    // 4. تحويل وحفظ المنتجات في قاعدة البيانات
    const productsToInsert = allProducts.map((product: any) => ({
      user_id: user.id,
      salla_id: product.id,
      name: product.name,
      sku: product.sku || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source: 'salla'
    }));

    console.log('جاري حفظ المنتجات في قاعدة البيانات...');

    // 5. استخدام upsert لتحديث المنتجات الموجودة أو إضافة الجديدة
    const { data: insertedProducts, error } = await supabase
      .from('products')
      .upsert(productsToInsert, {
        onConflict: 'salla_id',
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      console.error('خطأ في قاعدة البيانات:', error);
      throw error;
    }

    console.log(`تم حفظ ${insertedProducts?.length || 0} منتج بنجاح`);

    return NextResponse.json({
      success: true,
      count: productsToInsert.length,
      message: `تم استيراد ${productsToInsert.length} منتج بنجاح`
    });

  } catch (error: any) {
    console.error('خطأ في استيراد المنتجات:', error);
    return NextResponse.json(
      { 
        message: error.message || "حدث خطأ أثناء استيراد المنتجات",
        error: error 
      },
      { status: 500 }
    );
  }
}