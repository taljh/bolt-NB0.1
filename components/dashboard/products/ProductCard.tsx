// components/dashboard/products/ProductCard.tsx
import { Card } from "@/components/ui/card";

export default function ProductCard({ product, children }: { product: any; children?: React.ReactNode }) {
  if (!product?.name) {
    return <div className="text-red-500">خطأ: لم يتم تمرير بيانات المنتج بشكل صحيح.</div>;
  }

  return (
    <Card className="p-4 space-y-2 shadow-md border border-gray-200 bg-white">
      <h2 className="text-lg font-semibold text-[#5B5AEC]">{product.name}</h2>
      {product.sku && <p className="text-sm text-gray-500">رمز المنتج: {product.sku}</p>}
      <p className="text-sm text-gray-600">التكلفة: {product.main_fabric_cost ?? 0} ريال</p>
      {children && <div className="pt-2">{children}</div>}
    </Card>
  );
}