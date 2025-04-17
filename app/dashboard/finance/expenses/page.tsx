export const dynamic = "force-dynamic";

import { 
  DollarSign, 
  TrendingDown, 
  ArrowDownRight,
  Clock,
  Repeat,
  AlertCircle
} from "lucide-react";

// بيانات تجريبية للعرض
const mockData = {
  totalExpenses: 8750,
  fixedExpenses: 5200,
  variableExpenses: 3550,
  monthlyAverage: 8900,
  expenses: [
    {
      id: 1,
      type: "fixed",
      category: "إيجار المشغل",
      amount: 3000,
      date: "2024-04-01",
      recurring: true
    },
    {
      id: 2,
      type: "fixed",
      category: "رواتب الموظفين",
      amount: 2200,
      date: "2024-04-01",
      recurring: true
    },
    {
      id: 3,
      type: "variable",
      category: "مواد خام",
      amount: 2100,
      date: "2024-04-05",
      recurring: false
    },
    {
      id: 4,
      type: "variable",
      category: "مصاريف شحن",
      amount: 1450,
      date: "2024-04-10",
      recurring: false
    }
  ]
};

export default function ExpensesPage() {
  const kpis = [
    {
      title: "إجمالي المصروفات",
      value: `${mockData.totalExpenses} ريال`,
      change: "-2.5%",
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "المصروفات الثابتة",
      value: `${mockData.fixedExpenses} ريال`,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "المصروفات المتغيرة",
      value: `${mockData.variableExpenses} ريال`,
      icon: Repeat,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* ترويسة الصفحة */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">المصروفات والتكاليف</h1>
        <p className="mt-1 text-sm text-gray-500">
          تتبع وإدارة مصروفات المشروع الثابتة والمتغيرة
        </p>
      </div>

      {/* بطاقات المؤشرات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className={`${kpi.bgColor} p-2 rounded-lg`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              {kpi.change && (
                <span className="text-sm font-medium text-red-600 flex items-center gap-1">
                  {kpi.change}
                  <ArrowDownRight className="w-4 h-4" />
                </span>
              )}
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

      {/* جدول المصروفات */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              سجل المصروفات
            </h2>
            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
              إضافة مصروف
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">التصنيف</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">النوع</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">المبلغ</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">التاريخ</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">دورية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockData.expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{expense.category}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${expense.type === 'fixed' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-amber-100 text-amber-800'}`}>
                      {expense.type === 'fixed' ? 'ثابت' : 'متغير'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{expense.amount} ريال</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {expense.recurring ? 'نعم' : 'لا'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}