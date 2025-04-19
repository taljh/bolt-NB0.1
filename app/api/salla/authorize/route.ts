import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

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
    return [];
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { access_token, refresh_token, store_hash, store_name, domain } = body.payload || {};

  if (!access_token || !store_hash) {
    return NextResponse.json({ success: false, message: "Missing required data" }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });

  // حفظ التوكن في قاعدة البيانات
  const { error: tokenError } = await supabase.from("salla_tokens").insert({
    access_token,
    refresh_token,
    store_hash,
    store_name,
    domain,
  });

  if (tokenError) {
    console.error("❌ فشل الحفظ في Supabase:", tokenError);
    return NextResponse.redirect(new URL("/callback?status=error", req.url));
  }

  // سحب المنتجات من سلة
  const products = await fetchProducts(access_token);

  // حفظ المنتجات في قاعدة البيانات
  if (products.length > 0) {
    const productsToInsert = products.map((product: any) => ({
      name: product.name,
      sku: product.sku || null
    }));

    const { error: productsError } = await supabase
      .from("products_new")
      .insert(productsToInsert);

    if (productsError) {
      console.error("❌ فشل حفظ المنتجات:", productsError);
      // نستمر في العملية حتى لو فشل حفظ المنتجات
    }
  }

  return NextResponse.redirect(new URL("/callback?status=success", req.url));
}