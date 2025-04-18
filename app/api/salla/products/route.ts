import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // 1. Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Get the user's Salla token
    const { data: settings } = await supabase
      .from('project_settings')
      .select('salla_access_token, salla_merchant_id')
      .eq('user_id', user.id)
      .single();

    if (!settings?.salla_access_token) {
      return NextResponse.json(
        { message: "Salla account not connected" },
        { status: 400 }
      );
    }

    let allProducts: any[] = [];
    let nextPage = 'https://api.salla.dev/admin/v2/products';

    // 3. Fetch all products with pagination
    while (nextPage) {
      const sallaResponse = await fetch(nextPage, {
        headers: {
          'Authorization': `Bearer ${settings.salla_access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!sallaResponse.ok) {
        throw new Error(`Salla API error: ${sallaResponse.statusText}`);
      }

      const responseData = await sallaResponse.json();
      allProducts = [...allProducts, ...responseData.data];
      
      // Check if there's a next page
      nextPage = responseData.pagination?.next_page || null;
    }

    // 4. Transform and insert products into our database
    const productsToInsert = allProducts.map((product: any) => ({
      user_id: user.id,
      salla_id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price?.amount,
      quantity: product.quantity,
      status: product.status === 'active' ? 'active' : 'inactive',
      description: product.description,
      categories: product.categories?.map((cat: any) => cat.name) || [],
      images: product.images?.map((img: any) => img.url) || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // 5. Use upsert to update existing products or insert new ones
    const { data: insertedProducts, error } = await supabase
      .from('products')
      .upsert(productsToInsert, {
        onConflict: 'salla_id',
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      count: productsToInsert.length,
      message: `Successfully imported ${productsToInsert.length} products`
    });

  } catch (error: any) {
    console.error('Error importing products:', error);
    return NextResponse.json(
      { 
        message: error.message || "Error importing products",
        error: error 
      },
      { status: 500 }
    );
  }
}