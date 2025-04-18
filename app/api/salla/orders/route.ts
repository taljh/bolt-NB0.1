import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log('Starting orders import process...');
    const supabase = createRouteHandlerClient({ cookies });
    
    // 1. Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    console.log('User authentication check:', user ? 'Successful' : 'Failed');
    if (!user) {
      return NextResponse.json(
        { message: "غير مصرح" },
        { status: 401 }
      );
    }

    // 2. Get the user's Salla token
    const { data: sallaToken } = await supabase
      .from('salla_tokens')
      .select('access_token, store_hash')
      .eq('user_id', user.id)
      .single();
    
    console.log('Salla token check:', sallaToken ? 'Found' : 'Not found');

    if (!sallaToken?.access_token) {
      return NextResponse.json(
        { message: "لم يتم ربط متجر سلة" },
        { status: 400 }
      );
    }

    let allOrders: any[] = [];
    let nextPage = 'https://api.salla.dev/admin/v2/orders';

    // 3. Fetch all orders with pagination
    console.log('Starting to fetch orders from Salla...');
    while (nextPage) {
      console.log('Fetching from:', nextPage);
      const sallaResponse = await fetch(nextPage, {
        headers: {
          'Authorization': `Bearer ${sallaToken.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!sallaResponse.ok) {
        console.error('Salla API error:', sallaResponse.status, sallaResponse.statusText);
        throw new Error(`خطأ في API سلة: ${sallaResponse.statusText}`);
      }

      const responseData = await sallaResponse.json();
      console.log(`Fetched ${responseData.data?.length || 0} orders from current page`);
      allOrders = [...allOrders, ...responseData.data];
      
      // Check if there's a next page
      nextPage = responseData.pagination?.next_page || null;
    }

    console.log(`Total orders fetched: ${allOrders.length}`);

    // 4. Transform and insert orders into our database
    const ordersToInsert = allOrders.map((order: any) => ({
      user_id: user.id,
      salla_id: order.id,
      reference_id: order.reference_id,
      status: order.status.toLowerCase(),
      payment_method: order.payment_method?.name,
      total_price: order.amounts?.total?.amount,
      currency: order.amounts?.total?.currency,
      items: order.items || [],
      customer: {
        name: order.customer?.name,
        email: order.customer?.email,
        mobile: order.customer?.mobile,
      },
      shipping_address: order.shipping?.address || {},
      created_at: order.date?.created || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    console.log('Attempting to insert/update orders in database...');

    // 5. Use upsert to update existing orders or insert new ones
    const { data: insertedOrders, error } = await supabase
      .from('orders')
      .upsert(ordersToInsert, {
        onConflict: 'salla_id',
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`Successfully processed ${insertedOrders?.length || 0} orders`);

    return NextResponse.json({
      success: true,
      count: ordersToInsert.length,
      message: `تم استيراد ${ordersToInsert.length} طلب بنجاح`
    });

  } catch (error: any) {
    console.error('Error importing orders:', error);
    return NextResponse.json(
      { 
        message: error.message || "حدث خطأ أثناء استيراد الطلبات",
        error: error 
      },
      { status: 500 }
    );
  }
}
