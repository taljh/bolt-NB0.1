import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SallaProduct, SyncResult } from "@/types/products";

async function fetchSallaProducts(accessToken: string): Promise<SallaProduct[]> {
  try {
    const response = await fetch('https://api.salla.dev/admin/v2/products', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products from Salla');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products from Salla:', error);
    throw error;
  }
}

export async function syncProducts(userId: string): Promise<SyncResult> {
  const supabase = createClientComponentClient();
  
  try {
    // 1. Get the user's Salla token
    const { data: tokenData, error: tokenError } = await supabase
      .from("salla_tokens")
      .select("access_token")
      .eq("user_id", userId)
      .single();

    if (tokenError || !tokenData?.access_token) {
      throw new Error("لم يتم العثور على ربط مع سلة");
    }

    // 2. جلب بيانات التسعير الحالية
    const { data: existingPricings } = await supabase
      .from('pricing_details')
      .select('product_id');
    
    // تحويل إلى Set للبحث السريع
    const pricedProductIds = new Set(existingPricings?.map(p => p.product_id) || []);

    // 3. جلب المنتجات الحالية للحفاظ على SKU
    const { data: existingProducts } = await supabase
      .from('products')
      .select('salla_product_id, sku, has_pricing')
      .eq('user_id', userId);
    
    // تحويل إلى Map للبحث السريع
    const existingProductsMap = new Map(
      existingProducts?.map(p => [p.salla_product_id, { sku: p.sku, has_pricing: p.has_pricing }]) || []
    );

    // 4. Fetch products from Salla
    const products = await fetchSallaProducts(tokenData.access_token);

    // 5. Prepare products for upsert with preserved values
    const productsToUpsert = products.map((product) => {
      const sallaId = String(product.id);
      const existingProduct = existingProductsMap.get(sallaId);
      const hasPricing = existingProductsMap.get(sallaId)?.has_pricing || pricedProductIds.has(sallaId);
      
      return {
        user_id: userId,
        salla_product_id: sallaId,
        name: product.name,
        // نحافظ على الـ SKU من جدول المنتجات أو نستخدم الـ SKU من بيانات سلة إذا كان موجود
        ...(existingProduct?.sku
          ? { sku: existingProduct.sku }
          : product.sku
            ? { sku: product.sku }
            : {}),
        source: 'salla' as const,
        has_pricing: hasPricing,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    // 6. Upsert products
    const { error: upsertError } = await supabase
      .from("products")
      .upsert(productsToUpsert, {
        onConflict: 'user_id,salla_product_id',
        ignoreDuplicates: false
      });

    if (upsertError) {
      throw upsertError;
    }

    return {
      success: true,
      count: products.length
    };

  } catch (error: any) {
    console.error("Error syncing products:", error);
    return {
      success: false,
      error: {
        message: error.message || "حدث خطأ أثناء مزامنة المنتجات"
      }
    };
  }
}