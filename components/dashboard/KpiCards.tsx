"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  TrendingUp,
  ShieldCheck,
  Percent,
  BarChart4,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiData {
  totalProducts: number;
  balancedProducts: number;
  maxSafeDiscount: number;
  averageProfit: number;
}

interface ProductData {
  profit_margin: number | null;
}

interface SupabaseResponse {
  data: ProductData[] | null;
  error: any;
}

export default function KpiCards() {
  const [kpiData, setKpiData] = useState<KpiData>({
    totalProducts: 0,
    balancedProducts: 0,
    maxSafeDiscount: 0,
    averageProfit: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        const supabase = createClientComponentClient();
        
        // جلب عدد المنتجات الكلي
        const { count: totalProducts } = await supabase
          .from('products')
          .select('*', { count: 'exact' }) ?? { count: 0 };

        // جلب المنتجات المتوازنة
        const { count: balancedProducts } = await supabase
          .from('products')
          .select('*', { count: 'exact' })
          .gte('profit_margin', 20)
          .lte('profit_margin', 40) ?? { count: 0 };

        // تحسين استرداد وحساب متوسط هامش الربح
        const profitResponse: SupabaseResponse = await supabase
          .from('products')
          .select('profit_margin');

        const profitData = profitResponse.data || [];
        
        // حساب المتوسط بشكل آمن مع التحقق من القيم الفارغة
        const averageProfit = profitData.length > 0
          ? profitData.reduce((acc, curr) => 
              acc + (typeof curr?.profit_margin === 'number' ? curr.profit_margin : 0), 0) / profitData.length
          : 0;

        setKpiData({
          totalProducts: totalProducts ?? 0,
          balancedProducts: balancedProducts ?? 0,
          maxSafeDiscount: 18,
          averageProfit: Math.round(averageProfit)
        });
      } catch (error) {
        console.error('Error fetching KPI data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKpiData();
  }, []);

  const kpis = [
    {
      title: "المنتجات الفعّالة",
      value: loading ? "-" : kpiData.totalProducts.toString(),
      description: "عدد المنتجات المتاحة للبيع حالياً",
      icon: TrendingUp,
      gradient: "from-blue-50 via-blue-100 to-blue-50",
      iconColor: "text-blue-600",
      borderGlow: "before:shadow-[0_0_25px_2px_rgba(59,130,246,0.3)]"
    },
    {
      title: "المنتجات المتوازنة",
      value: loading ? "-" : `${kpiData.balancedProducts}/${kpiData.totalProducts}`,
      description: "منتجات بهامش ربح مثالي (20% - 40%)",
      icon: ShieldCheck,
      gradient: "from-emerald-50 via-emerald-100 to-emerald-50",
      iconColor: "text-emerald-600",
      borderGlow: "before:shadow-[0_0_25px_2px_rgba(16,185,129,0.3)]"
    },
    {
      title: "الخصم الآمن",
      value: loading ? "-" : `${kpiData.maxSafeDiscount}%`,
      description: "أقصى نسبة خصم مع الحفاظ على الربحية",
      icon: Percent,
      gradient: "from-amber-50 via-amber-100 to-amber-50",
      iconColor: "text-amber-600",
      borderGlow: "before:shadow-[0_0_25px_2px_rgba(217,119,6,0.3)]"
    },
    {
      title: "متوسط الربحية",
      value: loading ? "-" : `${kpiData.averageProfit}%`,
      description: "متوسط هامش الربح لجميع المنتجات",
      icon: BarChart4,
      gradient: "from-rose-50 via-rose-100 to-rose-50",
      iconColor: "text-rose-600",
      borderGlow: "before:shadow-[0_0_25px_2px_rgba(225,29,72,0.3)]"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {kpis.map((kpi, i) => (
        <Card
          key={i}
          className={cn(
            "relative overflow-hidden",
            "before:absolute before:inset-0 before:rounded-2xl before:content-['']",
            "transition-all duration-300 hover:scale-[1.02]",
            kpi.borderGlow
          )}
        >
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-80",
            kpi.gradient
          )} />

          <CardHeader className="relative pb-2">
            <div className="flex items-center justify-between">
              <div className={cn(
                "p-2.5 rounded-xl",
                "bg-white/50 backdrop-blur-sm",
                "ring-1 ring-black/5 shadow-lg"
              )}>
                <kpi.icon className={cn("w-5 h-5", kpi.iconColor)} />
              </div>
              <CardTitle className="text-sm font-semibold text-gray-600">
                {kpi.title}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="relative pt-4">
            <div className="flex flex-col gap-1">
              <div className="text-4xl font-bold text-gray-800 tracking-tight">
                {kpi.value}
              </div>
              <CardDescription className="text-sm text-gray-600 mt-1">
                {kpi.description}
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}