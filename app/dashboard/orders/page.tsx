"use client";

import OrderList from "@/components/dashboard/orders/OrderList";
import { Button } from "@/components/ui/button";
import { Plus, Download, RefreshCw, Filter } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">قائمة الطلبات</h1>
          <p className="text-sm text-muted-foreground">
            هنا تقدر تتابع، تضيف أو تسترجع طلباتك
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" /> فلتر
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> تصدير
          </Button>
          <Button
            onClick={async () => {
              try {
                console.log("بدء عملية استيراد الطلبات من سلة...");
                const res = await fetch("/api/salla/orders", { method: "POST" });
                const data = await res.json();
                
                console.log("استجابة API:", { status: res.status, data });
                
                if (res.ok && data.success) {
                  console.log(`✅ تم استيراد ${data.count} طلب/طلبات بنجاح`);
                  alert(`✅ تم استيراد ${data.count || "الطلبات"} بنجاح!`);
                  // تحديث الصفحة لعرض الطلبات الجديدة
                  window.location.reload();
                } else {
                  console.error("⚠️ فشل استيراد الطلبات من سلة:", data?.error || data);
                  alert("❌ فشل في استيراد الطلبات من سلة." + (data?.message ? `\n${data.message}` : ""));
                }
              } catch (error) {
                console.error("❌ خطأ غير متوقع:", error);
                alert("❌ حدث خطأ غير متوقع أثناء استيراد الطلبات.");
              }
            }}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> استرداد من سلة
          </Button>
          <Link href="/dashboard/orders/manual">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" /> إضافة يدوي
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white border shadow-sm rounded-xl overflow-hidden">
        <OrderList />
      </div>
    </div>
  );
}