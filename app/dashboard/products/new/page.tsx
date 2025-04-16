export const dynamic = "force-dynamic";
import ProductPricingForm from "@/components/dashboard/products/ProductPricingForm";
import { getCurrentUser } from "@/lib/get-user";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function NewProductPage() {
  const user = await getCurrentUser();
  const supabase = createServerComponentClient({ cookies });

  const { data: settings } = await supabase
    .from("project_settings")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">تسعير منتج جديد</h1>
      <ProductPricingForm
  initialSettings={{
    packaging_cost: settings?.packaging_cost ?? 0,
    profit_margin: settings?.profit_margin ?? 0,
    target_segment: settings?.target_segment ?? "اقتصادية",
  }}
/>
    </div>
  );
}