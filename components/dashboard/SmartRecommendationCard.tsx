"use client";

import { useState } from "react";
import { Sparkles, Lock, ChevronRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartRecommendationCardProps {
  plan: "free" | "pro" | "advanced" | null;
}

export default function SmartRecommendationCard({ plan }: SmartRecommendationCardProps) {
  const [hovered, setHovered] = useState(false);
  const isFreePlan = plan === "free";

  const recommendations = [
    {
      metric: "هامش الربح",
      current: "28%",
      potential: "40%",
      improvement: "+12%",
      description: "تعديل تفصيلة العباية الأساسية"
    },
    {
      metric: "التكلفة",
      current: "180 ريال",
      potential: "155 ريال",
      improvement: "-25 ريال",
      description: "تحسين استهلاك القماش"
    }
  ];

  return (
    <div
      className={cn(
        "relative rounded-2xl transition-all duration-500 overflow-hidden",
        "bg-gradient-to-br from-white via-indigo-50/30 to-white",
        "border border-indigo-100",
        "hover:shadow-lg hover:shadow-indigo-100/50",
        "group"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* المحتوى الرئيسي */}
      <div className={cn(
        "p-6 transition-all duration-300",
        isFreePlan && hovered ? "opacity-30 blur-[2px]" : "opacity-100"
      )}>
        {/* الترويسة */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100/50 text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                توصيات نَسيق الذكية
              </h3>
              <p className="text-sm text-gray-500">
                {isFreePlan ? "ميزة متقدمة" : "تحليل مخصص لمشروعك"}
              </p>
            </div>
          </div>
          {isFreePlan && (
            <Lock className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {/* محتوى التوصيات */}
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <div 
              key={index}
              className="p-4 rounded-xl bg-white/80 border border-indigo-50 hover:border-indigo-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  {rec.metric}
                </span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">{rec.current}</span>
                  <ChevronRight className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold text-indigo-600">{rec.potential}</span>
                  <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full text-xs">
                    {rec.improvement}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{rec.description}</p>
            </div>
          ))}
        </div>

        {/* إحصائية سريعة */}
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span>
            85% من العملاء شافوا تحسن في الأرباح باتباع توصيات نَسيق
          </span>
        </div>
      </div>

      {/* طبقة الترقية للخطة المجانية */}
      {isFreePlan && hovered && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-white/20 backdrop-blur-[2px]">
          <p className="text-lg font-semibold text-gray-900 text-center px-6">
            اكتشف كيف يمكن لنَسيق تحسين أرباح مشروعك
          </p>
          <button className={cn(
            "px-6 py-2.5 rounded-full",
            "bg-indigo-600 text-white",
            "hover:bg-indigo-700 transform hover:scale-105",
            "transition-all duration-300",
            "shadow-lg shadow-indigo-200",
            "flex items-center gap-2"
          )}>
            <Sparkles className="w-4 h-4" />
            ترقية لفتح الميزة
          </button>
        </div>
      )}

      {/* زر للباقات المدفوعة */}
      {!isFreePlan && (
        <div className="px-6 pb-6">
          <button className={cn(
            "w-full px-6 py-2.5 rounded-xl",
            "bg-gradient-to-r from-indigo-600 to-indigo-500",
            "text-white font-medium",
            "hover:from-indigo-500 hover:to-indigo-600",
            "transition-all duration-300",
            "shadow-lg shadow-indigo-200/50",
            "flex items-center justify-center gap-2"
          )}>
            <Sparkles className="w-4 h-4" />
            استكشف التوصيات المخصصة
          </button>
        </div>
      )}
    </div>
  );
}