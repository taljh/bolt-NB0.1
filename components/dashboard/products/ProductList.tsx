"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Edit, Eye, Archive, Star, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  sku?: string;
  status?: string;
  total_cost: number;
  profit_margin: number;
  production_status?: string;
  quantity?: number;
}

export default function ProductList({ products }: ProductListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="divide-y divide-gray-200">
      {products.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 transition-colors",
            hoveredId === product.id ? "bg-gray-50" : "bg-white"
          )}
          onMouseEnter={() => setHoveredId(product.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="flex items-center gap-4">
            {/* معلومات المنتج */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {product.sku}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {product.quantity === 0 && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertTriangle className="w-3 h-3 ml-1" />
                      نفذت الكمية
                    </span>
                  )}
                  {product.profit_margin < 20 && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 ml-1" />
                      مراجعة الربحية
                    </span>
                  )}
                </div>
              </div>

              {/* تفاصيل إضافية */}
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">التكلفة</p>
                  <p className="font-medium">
                    {product.total_cost} ريال
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">هامش الربح</p>
                  <p className={cn(
                    "font-medium",
                    product.profit_margin < 20 ? "text-red-600" : "text-green-600"
                  )}>
                    {product.profit_margin}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">حالة الإنتاج</p>
                  <ProductionStatus status={product.production_status} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">الكمية</p>
                  <p className="font-medium">
                    {product.quantity || 0} قطعة
                  </p>
                </div>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/products/${product.id}`}
                className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <Eye className="w-5 h-5" />
              </Link>
              <Link
                href={`/dashboard/products/${product.id}/edit`}
                className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <Edit className="w-5 h-5" />
              </Link>
              <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                <Archive className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ProductionStatus({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    inProgress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800"
  };

  const labels = {
    pending: "قيد الانتظار",
    inProgress: "قيد الإنتاج",
    completed: "مكتمل",
    cancelled: "ملغي"
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
      styles[status as keyof typeof styles]
    )}>
      {labels[status as keyof typeof labels]}
    </span>
  );
}