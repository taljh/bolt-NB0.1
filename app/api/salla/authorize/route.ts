import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { access_token, refresh_token, store_hash, store_name, domain } = body.payload || {};

  if (!access_token || !store_hash) {
    return NextResponse.json({ success: false, message: "Missing required data" }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies }); // ✅ هنا الفرق

  const { error } = await supabase.from("salla_tokens").insert({
    access_token,
    refresh_token,
    store_hash,
    store_name,
    domain,
  });

  if (error) {
    console.error("❌ فشل الحفظ في Supabase:", error);
    return NextResponse.redirect(new URL("/callback?status=error", req.url));
  }

  return NextResponse.redirect(new URL("/callback?status=success", req.url));
}