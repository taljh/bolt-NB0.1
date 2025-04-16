export const dynamic = "force-dynamic";
import { getCurrentUser } from "@/lib/get-user";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ProductList from "@/components/dashboard/products/ProductList";

export default async function ProductsPage() {
  const user = await getCurrentUser();
  const supabase = createServerComponentClient({ cookies });

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <ProductList products={products || []} />
  );
}