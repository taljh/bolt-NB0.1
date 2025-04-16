import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies });

  // نحصل على المستخدم الحالي
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  // نحصل على توكن الربط من جدول salla_tokens
  const { data: tokenData, error: tokenError } = await supabase
    .from("salla_tokens")
    .select("access_token")
    .eq("user_id", user.id)
    .single();

  if (tokenError || !tokenData?.access_token) {
    return NextResponse.json({ error: "توكن سلة غير موجود لهذا المستخدم" }, { status: 400 });
  }

  const accessToken = tokenData.access_token;

  // نسحب الطلبات من سلة
  const response = await fetch("https://api.salla.dev/admin/v2/orders", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("فشل في جلب الطلبات من سلة:", error);
    return NextResponse.json({ error: "فشل في جلب الطلبات من سلة" }, { status: 500 });
  }

  const orders = await response.json();

  // نحفظ كل طلب في جدول orders
  for (const order of orders.data) {
    await supabase.from("orders").upsert({
      user_id: user.id,
      order_id: order.id,
      status: order.status,
      total: order.total,
      created_at: order.created_at,
      customer_name: order.customer?.name || "غير معروف",
      items: order.products || [],
      source: "salla",
    });
  }

  return NextResponse.json({ success: true, count: orders.data.length });
}
