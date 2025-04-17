"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ProductList from "@/components/dashboard/products/ProductList";
import { Suspense } from "react";
import { Package, Plus, FileUp, Filter, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/ui/loading-screen";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        const { data, error } = await supabase
          .from("products")
          .select(`
            *,
            total_cost,
            profit_margin
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [supabase]);

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Package className="w-5 h-5 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              المنتجات
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            إدارة وتتبع منتجات المشروع
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm">
            <FileUp className="w-4 h-4 ml-2" />
            استيراد
          </Button>
          <Link href="/dashboard/products/new">
            <Button size="sm">
              <Plus className="w-4 h-4 ml-2" />
              منتج جديد
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="بحث في المنتجات..."
              className="w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 ml-2" />
              تصفية
            </Button>
            <select className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500">
              <option value="all">جميع المنتجات</option>
              <option value="active">المنتجات النشطة</option>
              <option value="outOfStock">نفذت الكمية</option>
              <option value="draft">مسودة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Suspense fallback={<LoadingScreen />}>
          {loading ? (
            <LoadingScreen />
          ) : (
            <ProductList products={products} />
          )}
        </Suspense>
      </div>
    </div>
  );
}