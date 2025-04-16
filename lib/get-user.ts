// lib/get-user.ts

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const userId = authUser?.id;
  if (!userId) return null;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("خطأ في جلب المستخدم:", error);
    return null;
  }

  return user;
}