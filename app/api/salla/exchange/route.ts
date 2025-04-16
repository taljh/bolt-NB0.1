// app/api/salla/exchange/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const code = body.code;

  if (!code) {
    return NextResponse.json({ success: false, error: "رمز التفويض مفقود." }, { status: 400 });
  }

  const clientId = process.env.SALLA_CLIENT_ID!;
  const clientSecret = process.env.SALLA_CLIENT_SECRET!;
  const redirectUri = process.env.SALLA_REDIRECT_URI!;

  try {
    const res = await fetch("https://accounts.salla.sa/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("❌ فشل التبادل:", result);
      return NextResponse.json({ success: false, error: result }, { status: 500 });
    }

    // ⏺ بإمكانك تخزين التوكن هنا في قاعدة البيانات حسب المتجر
    console.log("✅ تم الحصول على التوكن:", result);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ خطأ في الاتصال بـ سلة:", err);
    return NextResponse.json({ success: false, error: "فشل الاتصال بـ سلة." }, { status: 500 });
  }
}