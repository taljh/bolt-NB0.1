import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // تأكد من أن هذا هو Webhook صالح من سلة (تحقق لاحقاً من التوقيع أو التوكن)
    const body = await req.json();

    const storeHash = req.nextUrl.searchParams.get("store_hash");
    if (!storeHash) {
      return NextResponse.json({ error: "Store hash missing" }, { status: 400 });
    }

    // احصل على بيانات المتجر (لربط الطلب بالتاجر الصحيح)
    const { data: tokenData, error: tokenError } = await supabase
      .from("salla_tokens")
      .select("user_id")
      .eq("store_hash", storeHash)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: "Store not linked" }, { status: 401 });
    }

    const userId = tokenData.user_id;

    // إعداد الطلبات
    const orderPayload = body.data;

    const orderData = {
      user_id: userId,
      order_id: orderPayload.id,
      order_status: orderPayload.status,
      customer_name: orderPayload.customer?.name || null,
      customer_phone: orderPayload.customer?.phone || null,
      city: orderPayload.shipping?.city || null,
      country: orderPayload.shipping?.country || null,
      sku_list: JSON.stringify(orderPayload.items.map((item: any) => item.sku)),
      total_amount: orderPayload.total,
      discount: orderPayload.discount || 0,
      tracking_url: orderPayload.tracking_url || null,
      shipping_cost: orderPayload.shipping_cost || null,
      payment_method: orderPayload.payment_method || null,
      cod_fee: orderPayload.cod_fee || null,
      tax: orderPayload.tax || null,
      grand_total: orderPayload.grand_total,
      order_date: orderPayload.created_at,
      shipping_company: orderPayload.shipping_company || null,
      waybill_number: orderPayload.waybill_number || null,
      address: orderPayload.address || null,
      order_reference: orderPayload.reference || null,
      last_updated: orderPayload.updated_at,
      assigned_to: orderPayload.assigned_to || null
    };

    // upsert لمنع التكرار
    const { error: insertError } = await supabase
      .from("orders")
      .upsert(orderData, { onConflict: "order_id" });

    if (insertError) {
      console.error("❌ Failed to insert order:", insertError);
      return NextResponse.json({ error: "Failed to insert order" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}