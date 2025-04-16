export const dynamic = "force-dynamic";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ProductPricingForm from "@/components/dashboard/products/ProductPricingForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  const { data: settings } = await supabase
    .from("project_settings")
    .select("*")
    .eq("user_id", product?.user_id)
    .single();

  if (!product) return <div className="p-6">لم يتم العثور على المنتج</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">تعديل المنتج</h1>
      console.log("🚀 بيانات المنتج:", product);
console.log("🆔 ID المنتج:", params.id);
      <ProductPricingForm
        initialSettings={settings}
        initialValues={product}
        productId={product?.id}
      />
    </div>
  );
}