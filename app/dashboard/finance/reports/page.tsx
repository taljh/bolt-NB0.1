export const dynamic = "force-dynamic";

import { 
  BarChart3, 
  Download, 
  Filter,
  TrendingUp,
  DollarSign,
  MinusCircle,
  PieChart
} from "lucide-react";

// بيانات تجريبية
const mockData = {
  profitLoss: 6670,
  revenue: 15420,
  expenses: 8750,
  profit_margin: 43.2,
  reports: [
    {
      id: 1,
      name: "تقرير الربح والخسارة",
      description: "ملخص الإيرادات والمصروفات وصافي الربح",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: 2,
      name: "تقرير التدفقات النقدية",
      description: "حركة الأموال الداخلة والخارجة",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      id: 3,
      name: "تقرير المصروفات",
      description: "تحليل تفصيلي للمصروفات حسب الفئة",
      icon: MinusCircle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      id: 4,
      name: "تقرير هامش الربح",
      description: "تحليل هوامش الربح للمنتجات",
      icon: PieChart,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]
};

export default function FinancialReportsPage() {
  return (
    <div className="space-y-8 p-6">
      {/* ترويسة الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التقارير المالية</h1>
          <p className="mt-1 text-sm text-gray-500">
            تحليل شامل للأداء المالي لمشروعك
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            تصفية
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            <Download className="w-4 h-4" />
            تصدير التقارير
          </button>
        </div>
      </div>

      {/* ملخص مالي */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-medium text-gray-500">صافي الربح</h3>
          </div>
          <p className="mt-4 text-2xl font-bold text-gray-900">
            {mockData.profitLoss} ريال
          </p>
          <div className="mt-1 flex items-center gap-1 text-sm font-medium text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            +12.3%
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-medium text-gray-500">هامش الربح</h3>
          </div>
          <p className="mt-4 text-2xl font-bold text-gray-900">
            {mockData.profit_margin}%
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-500">الإيرادات</h3>
          </div>
          <p className="mt-4 text-2xl font-bold text-gray-900">
            {mockData.revenue} ريال
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <MinusCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-sm font-medium text-gray-500">المصروفات</h3>
          </div>
          <p className="mt-4 text-2xl font-bold text-gray-900">
            {mockData.expenses} ريال
          </p>
        </div>
      </div>

      {/* قائمة التقارير */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockData.reports.map((report) => (
          <button
            key={report.id}
            className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all text-right"
          >
            <div className={`${report.bgColor} p-3 rounded-lg`}>
              <report.icon className={`w-6 h-6 ${report.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{report.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{report.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}