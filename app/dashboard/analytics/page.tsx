"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// البيانات التجريبية
const mockData = {
  revenue: 54280,
  revenueChange: 12.3,
  orders: 186,
  ordersChange: 8.1,
  customers: 142,
  customersChange: 15.4,
  avgOrderValue: 291.83,
  avgOrderChange: 3.2,
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<string>("week");
  const [showPredictions, setShowPredictions] = useState<boolean>(false);

  const metrics = [
    {
      title: "إجمالي الإيرادات",
      value: `${mockData.revenue.toLocaleString()} ريال`,
      change: mockData.revenueChange,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "عدد الطلبات",
      value: mockData.orders,
      change: mockData.ordersChange,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "العملاء النشطون",
      value: mockData.customers,
      change: mockData.customersChange,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "متوسط قيمة الطلب",
      value: `${mockData.avgOrderValue.toLocaleString()} ريال`,
      change: mockData.avgOrderChange,
      icon: TrendingUp,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    }
  ];

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      {/* ترويسة الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">تحليلات نَسيق</h1>
          <p className="text-sm text-gray-500">
            تحليلات متقدمة لأداء مشروعك مع توقعات ذكية
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={showPredictions}
              onCheckedChange={setShowPredictions}
            />
            <span className="text-sm text-gray-600">التوقعات الذكية</span>
          </div>
          <Select 
            value={timeRange} 
            onValueChange={handleTimeRangeChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="اختر الفترة الزمنية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">آخر أسبوع</SelectItem>
              <SelectItem value="month">آخر شهر</SelectItem>
              <SelectItem value="quarter">آخر 3 شهور</SelectItem>
              <SelectItem value="year">آخر سنة</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* بطاقات المؤشرات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <Card key={i}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className={`${metric.bgColor} p-2 rounded-lg`}>
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium
                  ${metric.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {metric.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">{metric.title}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* حاوية الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                تحليل الإيرادات
              </h3>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 ml-2" />
                تخصيص الفترة
              </Button>
            </div>
            <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-500">قريباً - الرسم البياني للإيرادات</p>
            </div>
          </div>
        </Card>
        
        <Card className="lg:col-span-1">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              المنتجات الأكثر مبيعاً
            </h3>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-500">قريباً - إحصائيات المنتجات</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
