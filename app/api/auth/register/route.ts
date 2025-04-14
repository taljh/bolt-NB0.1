import { createClient } from "@supabase/supabase-js";
// @ts-ignore
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
); // نستخدم service role key لأنه يحتاج صلاحيات أكبر للتسجيل

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // تأكد ما في حساب بنفس الإيميل
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      );
    }

    // 1. إنشاء حساب جديد في Supabase Auth
    const { data: authUser, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (signUpError || !authUser.user) {
      console.error("signUp error:", signUpError);
      return NextResponse.json(
        { error: "فشل إنشاء المستخدم في auth" },
        { status: 500 }
      );
    }

    const userId = authUser.user.id;

    // 2. إضافة بيانات المستخدم في جدول users
    const { error: insertError } = await supabase.from("users").insert([
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
      return NextResponse.json(
        { error: "فشل حفظ بيانات المستخدم" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "تم إنشاء الحساب بنجاح" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الحساب" },
      { status: 500 }
    );
  }
}