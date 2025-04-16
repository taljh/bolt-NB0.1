import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

const SALLA_CLIENT_ID = process.env.SALLA_CLIENT_ID!;
const SALLA_REDIRECT_URI = process.env.SALLA_REDIRECT_URI!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${APP_URL}/login`);
  }

  const state = crypto.randomUUID(); // يمكنك حفظه لاحقًا لو احتجت تحقق CSRF
  const sallaAuthURL = `https://accounts.salla.sa/oauth2/authorize?response_type=code&client_id=${SALLA_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    SALLA_REDIRECT_URI
  )}&state=${state}&scope=offline_access products.read_write settings.read`;

  return NextResponse.redirect(sallaAuthURL);
}
