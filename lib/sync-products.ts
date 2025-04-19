import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

async function fetchSallaProducts(accessToken: string) {
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

export async function syncProducts(userId: string) {
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

    // 2. Fetch products from Salla
    const products = await fetchSallaProducts(tokenData.access_token);

    // 3. Prepare products for insertion
    const productsToInsert = products.map((product: any) => ({
      user_id: userId,
      name: product.name,
      sku: product.sku || null,
      source: 'salla',
      created_at: new Date().toISOString()
    }));

    // 4. Delete existing Salla products for this user
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("user_id", userId)
      .eq("source", "salla");

    if (deleteError) {
      throw deleteError;
    }

    // 5. Insert new products
    const { error: insertError } = await supabase
      .from("products")
      .insert(productsToInsert);

    if (insertError) {
      throw insertError;
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