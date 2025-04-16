import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type Database } from "@/types/supabase"; // تأكد إن الملف موجود

export function createSupabaseServerClient() {
  return createServerComponentClient<Database>({ cookies });
}