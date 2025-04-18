import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function syncProducts(userId: string) {
  const supabase = createClientComponentClient();
  
  try {
    console.log('بدء عملية مزامنة المنتجات للمستخدم:', userId);

    // 1. جلب توكن سلة للمستخدم
    const { data: sallaStore, error: tokenError } = await supabase
      .from('salla_stores')
      .select('access_token')
      .eq('user_id', userId)
      .single();

    if (tokenError) {
      console.error('خطأ في جلب توكن سلة:', tokenError.message);
      return { success: false, error: 'لم نتمكن من الوصول إلى بيانات المتجر' };
    }

    if (!sallaStore?.access_token) {
      console.error('لا يوجد توكن سلة للمستخدم:', userId);
      return { success: false, error: 'لم يتم ربط متجر سلة' };
    }

    console.log('تم العثور على توكن سلة، جاري جلب المنتجات...');

    // 2. جلب المنتجات من سلة
    let allProducts: any[] = [];
    let nextPage = 'https://api.salla.dev/admin/v2/products';

    while (nextPage) {
      console.log('جلب المنتجات من:', nextPage);
      const sallaResponse = await fetch(nextPage, {
        headers: {
          'Authorization': `Bearer ${sallaStore.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!sallaResponse.ok) {
        const errorData = await sallaResponse.json();
        console.error('خطأ في استجابة سلة:', sallaResponse.status, errorData);
        return { 
          success: false, 
          error: `خطأ في API سلة: ${sallaResponse.status} - ${errorData.error || errorData.message || sallaResponse.statusText}` 
        };
      }

      const responseData = await sallaResponse.json();
      if (!responseData.data) {
        console.error('بيانات غير صالحة من API سلة:', responseData);
        return { success: false, error: 'بيانات غير صالحة من API سلة' };
      }

      console.log(`تم جلب ${responseData.data.length} منتج من الصفحة الحالية`);
      allProducts = [...allProducts, ...responseData.data];
      nextPage = responseData.pagination?.next_page || null;
    }

    console.log(`إجمالي عدد المنتجات التي تم جلبها: ${allProducts.length}`);

    if (allProducts.length === 0) {
      console.log('لم يتم العثور على منتجات في المتجر');
      return { success: true, count: 0 };
    }

    // 3. تحضير المنتجات للإدخال
    const productsToUpsert = allProducts.map(product => ({
      user_id: userId,
      salla_id: String(product.id),
      name: product.name,
      sku: product.sku || null,
      source: 'salla',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    console.log('جاري حفظ المنتجات في قاعدة البيانات...');

    // 4. حفظ المنتجات في قاعدة البيانات
    const { error: upsertError } = await supabase
      .from('products')
      .upsert(productsToUpsert, {
        onConflict: 'salla_id',
        ignoreDuplicates: false
      });

    if (upsertError) {
      console.error('خطأ في حفظ المنتجات:', upsertError);
      return { success: false, error: 'فشل في حفظ المنتجات في قاعدة البيانات' };
    }

    console.log(`✅ تمت مزامنة ${productsToUpsert.length} منتج للمستخدم ${userId}`);
    return { success: true, count: productsToUpsert.length };
  } catch (error: any) {
    console.error('❌ خطأ في مزامنة المنتجات:', error);
    return { 
      success: false, 
      error: error.message || 'حدث خطأ غير متوقع أثناء مزامنة المنتجات' 
    };
  }
}