import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

const SALLA_CLIENT_ID = process.env.SALLA_CLIENT_ID!;
const SALLA_CLIENT_SECRET = process.env.SALLA_CLIENT_SECRET!;
const SALLA_REDIRECT_URI = process.env.SALLA_REDIRECT_URI!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/callback?status=error", APP_URL));
  }

  const tokenRes = await fetch("https://accounts.salla.sa/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: SALLA_CLIENT_ID,
      client_secret: SALLA_CLIENT_SECRET,
      redirect_uri: SALLA_REDIRECT_URI,
    }),
  });

  if (!tokenRes.ok) {
    const error = await tokenRes.json();
    console.error("فشل الحصول على التوكن:", error);
    return NextResponse.redirect(new URL("/callback?status=error", APP_URL));
  }

  const tokenData = await tokenRes.json();
  const { access_token, refresh_token } = tokenData;

  const storeRes = await fetch("https://api.salla.dev/admin/v2/store/info", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!storeRes.ok) {
    const error = await storeRes.json();
    console.error("فشل في جلب بيانات المتجر:", error);
    return NextResponse.redirect(new URL("/callback?status=error", APP_URL));
  }

  const storeData = await storeRes.json();
  const store_hash = storeData.data?.hash || String(storeData.data?.id);

  if (!store_hash) {
    console.error("❌ البيانات غير مكتملة: store_hash مفقود");
    return NextResponse.redirect(new URL("/callback?status=error", APP_URL));
  }

  const supabase = createServerComponentClient({ cookies });

  // 🔒 جلب المستخدم الحالي
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    console.error("❌ لا يوجد مستخدم مسجّل دخول");
    return NextResponse.redirect(new URL("/callback?status=error", APP_URL));
  }

  // 🧠 حفظ الربط مع user_id
  const { error: dbError } = await supabase.from("salla_tokens").upsert({
    user_id: user.id,
    access_token,
    refresh_token,
    store_hash,
    store_name: storeData.data.name,
    domain: storeData.data.domain,
  }, { onConflict: 'store_hash' });

  if (dbError) {
    console.error("❌ فشل الحفظ في قاعدة البيانات", dbError);
    return NextResponse.redirect(new URL("/callback?status=error", APP_URL));
  }

  return NextResponse.redirect(new URL("/salla/success", APP_URL));
}