// components/dashboard/products/ProductList.tsx
"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";

export default function ProductList({ products }: { products: any[] }) {
  if (!products || products.length === 0) {
    return <p className="text-gray-600">ما فيه منتجات حتى الآن.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product}>
          <Link href={`/dashboard/products/${product.id}`}>
            <button className="mt-4 px-4 py-2 bg-[#5B5AEC] text-white rounded hover:bg-[#4a49d1] transition">
              تعديل
            </button>
          </Link>
        </ProductCard>
      ))}
    </div>
  );
}