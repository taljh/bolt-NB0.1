"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, FileUp, RefreshCw, Package, Filter, Search } from "lucide-react";
import { syncProducts } from "@/lib/sync-products";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("حدث خطأ في جلب المنتجات");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("يجب تسجيل الدخول أولاً");
        return;
      }

      setImporting(true);
      const result = await syncProducts(user.id);

      if (result?.success) {
        toast.success("تمت المزامنة بنجاح", {
          description: `تم مزامنة ${result.count} منتج`
        });
        setLastSyncTime(new Date());
        await fetchProducts();
      } else {
        toast.error("فشلت عملية المزامنة", {
          description: result?.error?.message || "حدث خطأ غير متوقع"
        });
      }
    } catch (error) {
      console.error("Error in sync:", error);
      toast.error("فشلت عملية المزامنة");
    } finally {
      setImporting(false);
    }
  };

  // المزامنة التلقائية كل دقيقة
  useEffect(() => {
    handleSync(); // المزامنة الأولية عند تحميل الصفحة

    // إعداد المزامنة كل دقيقة
    const interval = setInterval(handleSync, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // جلب المنتجات عند تحميل الصفحة
  useEffect(() => {
    fetchProducts();
  }, []);

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
            {lastSyncTime && (
              <span className="mr-2 text-xs text-gray-400">
                (آخر مزامنة: {lastSyncTime.toLocaleString('ar-SA')})
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSync}
            disabled={importing}
          >
            {importing ? (
              <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <FileUp className="w-4 h-4 ml-2" />
            )}
            {importing ? "جاري المزامنة..." : "مزامنة يدوية"}
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
            </select>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white border shadow-sm rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">لا توجد منتجات حالياً</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المنتج
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رمز المنتج
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المصدر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {product.sku || 'لا يوجد'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.source === 'salla' ? 'سلة' : 'يدوي'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        عرض
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}