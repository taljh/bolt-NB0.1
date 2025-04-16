"use client";

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
} from "lucide-react";

const kpis = [
  {
    title: "المنتجات الفعّالة",
    value: "24",
    description: "عدد المنتجات اللي تم تسعيرها وجاهزة للبيع.",
    icon: TrendingUp,
    bg: "bg-gradient-to-br from-blue-100/80 to-blue-300/50",
    borderColor: "border-blue-300/60",
  },
  {
    title: "المنتجات المتوازنة 🧬",
    value: "19",
    description: "منتجات تحقق هامش ربح آمن، وتوازن بين التكاليف والسعر النهائي.",
    icon: ShieldCheck,
    bg: "bg-gradient-to-br from-green-100/80 to-green-300/50",
    borderColor: "border-green-300/60",
  },
  {
    title: "أعلى خصم آمن",
    value: "18%",
    description: "النسبة القصوى اللي تقدر تعطيها خصم بدون ما تخسر.",
    icon: Percent,
    bg: "bg-gradient-to-br from-yellow-100/80 to-yellow-300/50",
    borderColor: "border-yellow-300/60",
  },
  {
    title: "متوسط هامش الربح",
    value: "38%",
    description: "متوسط الربح الصافي بعد الخياطة، القماش، والتكاليف.",
    icon: BarChart4,
    bg: "bg-gradient-to-br from-rose-100/80 to-rose-300/50",
    borderColor: "border-rose-300/60",
  },
];

export default function KpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {kpis.map((kpi, i) => (
        <Card
          key={i}
          className={`${kpi.bg} ${kpi.borderColor} border backdrop-blur-md rounded-xl shadow-xl hover:scale-[1.02] transition-all duration-300 p-4 overflow-hidden relative`}
        >
          <div className="absolute inset-0 rounded-xl pointer-events-none bg-white/10 ring-1 ring-inset ring-white/10 shadow-inner" />

          <CardHeader className="relative z-10 flex flex-row justify-between items-center">
            <div className="bg-white/30 p-2 rounded-full shadow">
              <kpi.icon className="w-5 h-5 text-gray-800" />
            </div>
            <CardTitle className="text-gray-700 text-base font-bold">{kpi.title}</CardTitle>
          </CardHeader>

          <CardContent className="relative z-10 mt-4">
            <div className="text-5xl font-extrabold text-gray-900 tracking-tight mb-2">{kpi.value}</div>
            <CardDescription className="text-sm text-gray-700">{kpi.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}