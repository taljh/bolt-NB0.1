export const dynamic = "force-dynamic";

import { DollarSign, TrendingUp, Package } from "lucide-react";

// بيانات تجريبية
const mockData = {
  totalRevenue: 15420,
  ordersCount: 45,
  averageOrder: 342.67,
};

export default function RevenuePage() {
  const kpis = [
    {
      title: "إجمالي الإيرادات",
      value: `${mockData.totalRevenue} ريال`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "عدد الطلبات",
      value: mockData.ordersCount,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "متوسط الطلب",
      value: `${mockData.averageOrder} ريال`,
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* ترويسة الصفحة */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الإيرادات والمبيعات</h1>
        <p className="mt-1 text-sm text-gray-500">
          تتبع وتحليل أداء مبيعات مشروعك
        </p>
      </div>

      {/* بطاقات المؤشرات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <div className={`${kpi.bgColor} p-2 rounded-lg w-fit`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">{kpi.title}</h3>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {kpi.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* محتوى مؤقت */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="text-center py-12 text-gray-500">
          <p>سيتم إضافة الرسوم البيانية والتحليلات التفصيلية قريباً</p>
        </div>
      </div>
    </div>
  );
}