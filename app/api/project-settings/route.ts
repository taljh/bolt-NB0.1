// /app/api/project-settings/route.ts

import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await req.json();

  const {
    userId,
    projectName,
    projectType,
    targetAudience,
    expectedSales,
    defaultProfitMargin,
  } = body;

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("project_settings")
    .upsert(
      [
        {
          user_id: userId,
          project_name: projectName,
          project_type: projectType,
          target_audience: targetAudience,
          expected_sales: expectedSales,
          default_profit_margin: defaultProfitMargin,
        },
      ],
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: "فشل في حفظ البيانات" }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}