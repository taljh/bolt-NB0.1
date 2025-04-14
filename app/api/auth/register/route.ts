import { createClient } from "@supabase/supabase-js";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 400 });
    }

    const { data: authUser, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (signUpError || !authUser.user) {
      console.error("signUp error:", signUpError);
      return NextResponse.json({ error: "فشل إنشاء المستخدم في auth" }, { status: 500 });
    }

    const userId = authUser.user.id;

    const { error: insertError } = await supabaseAdmin.from("users").insert([
      {
        id: userId,
        name,
        email,
        role: "user",
        plan: "free",
        features: ["basic_pricing", "basic_analytics"],
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: "فشل حفظ بيانات المستخدم" }, { status: 500 });
    }

    // تسجيل الدخول الفوري بعد الإنشاء
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error("Sign-in error:", signInError);
      return NextResponse.json({ error: "تم إنشاء الحساب لكن فشل تسجيل الدخول" }, { status: 500 });
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء الحساب" }, { status: 500 });
  }
}