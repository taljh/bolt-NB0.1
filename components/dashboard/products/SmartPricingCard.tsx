"use client";

import { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface SmartPricingCardProps {
  directCosts: number;
  finalPrice: number;
  profitMargin: number;
  targetSegment: "economic" | "medium" | "luxury";
  suggestedPrice: number;
  isPriceInRange: boolean;
}

const segmentRanges = {
  economic: { min: 100, max: 300, color: "green" },
  medium: { min: 301, max: 700, color: "blue" },
  luxury: { min: 701, max: 1500, color: "purple" }
};

export default function SmartPricingCard({
  directCosts,
  finalPrice,
  profitMargin,
  targetSegment,
  suggestedPrice,
  isPriceInRange
}: SmartPricingCardProps) {
  const [animate, setAnimate] = useState(false);
  
  // التحرك انيميشن عند تغير السعر النهائي
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [finalPrice]);

  // حساب النسبة المئوية للسعر ضمن نطاق الفئة المستهدفة
  const pricePercentage = useMemo(() => {
    const range = segmentRanges[targetSegment];
    const totalRange = range.max - range.min;
    const position = Math.min(Math.max(finalPrice - range.min, 0), totalRange);
    return (position / totalRange) * 100;
  }, [finalPrice, targetSegment]);

  // تحديد حالة السعر (منخفض، مناسب، مرتفع)
  const priceStatus = useMemo(() => {
    const range = segmentRanges[targetSegment];
    if (finalPrice < range.min) return "low";
    if (finalPrice > range.max) return "high";
    return "optimal";
  }, [finalPrice, targetSegment]);

  // تحديد لون ورسالة النصيحة
  const advice = useMemo(() => {
    const range = segmentRanges[targetSegment];
    
    if (priceStatus === "low") {
      return {
        color: "amber",
        message: `السعر منخفض للفئة المستهدفة. حاول زيادة هامش الربح أو مراجعة التكاليف.`
      };
    } else if (priceStatus === "high") {
      return {
        color: "red",
        message: `السعر مرتفع للفئة المستهدفة. فكر في تخفيض هامش الربح أو التكاليف.`
      };
    } else {
      const position = finalPrice / range.max;
      if (position < 0.33) {
        return {
          color: "emerald",
          message: "السعر مناسب في النطاق الأدنى للفئة المستهدفة."
        };
      } else if (position < 0.66) {
        return {
          color: "emerald",
          message: "السعر مثالي في منتصف النطاق للفئة المستهدفة."
        };
      } else {
        return {
          color: "emerald",
          message: "السعر في النطاق الأعلى للفئة المستهدفة."
        };
      }
    }
  }, [finalPrice, priceStatus, targetSegment]);

  // الوان بناء على الفئة المستهدفة
  const segmentColor = segmentRanges[targetSegment].color;
  const segmentColorMap = {
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      light: "text-green-600",
      progress: "bg-green-500",
      gradient: "from-green-500/10 to-green-500/5"
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200", 
      text: "text-blue-800",
      light: "text-blue-600",
      progress: "bg-blue-500",
      gradient: "from-blue-500/10 to-blue-500/5"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-800",
      light: "text-purple-600",
      progress: "bg-purple-500",
      gradient: "from-purple-500/10 to-purple-500/5"
    }
  };

  const colors = segmentColorMap[segmentColor as keyof typeof segmentColorMap];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`overflow-hidden border-2 ${colors.border} shadow-lg`}>
        {/* رأس البطاقة مع التدرج */}
        <div className={`bg-gradient-to-r ${colors.gradient} p-6`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={colors.light}><circle cx="12" cy="12" r="10"/><path d="M15.3 8.7a2.5 2.5 0 0 0-4.6 0"/><path d="M10 13h.01"/><path d="M14 13h.01"/><path d="M9 16a3 3 0 0 0 6 0"/></svg>
                تحليل التسعير الذكي
              </h3>
              <p className="text-sm text-gray-600">التسعير المقترح للفئة المستهدفة</p>
            </div>
            
            <Badge className={`${colors.bg} ${colors.text} border px-3 py-1 rounded-full font-semibold`}>
              {targetSegment === 'economic' ? 'اقتصادية' : targetSegment === 'medium' ? 'متوسطة' : 'فاخرة'}
            </Badge>
          </div>
          
          {/* مقياس مؤشر السعر ضمن النطاق */}
          <div className="pt-2 mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{segmentRanges[targetSegment].min} ريال</span>
              <span>{segmentRanges[targetSegment].max} ريال</span>
            </div>
            <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="w-1/3 border-r border-white/20"></div>
                <div className="w-1/3 border-r border-white/20"></div>
                <div className="w-1/3"></div>
              </div>
              
              {/* شريط المؤشر */}
              <motion.div 
                className={`absolute h-full ${isPriceInRange ? colors.progress : 'bg-red-500'} opacity-80`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(pricePercentage, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              
              {/* مؤشر السعر النهائي */}
              <motion.div 
                className={`absolute top-0 bottom-0 w-0.5 bg-white shadow-sm`}
                style={{ 
                  left: `${Math.min(pricePercentage, 100)}%`, 
                  filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.3))' 
                }}
                animate={{ 
                  scale: animate ? [1, 1.5, 1] : 1,
                  opacity: animate ? [1, 0.8, 1] : 1 
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-6 h-6 -ml-3 -mt-3 rounded-full bg-white border-2 border-indigo-500 shadow absolute top-0"></div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* جسم البطاقة مع التفاصيل */}
        <div className="p-6 bg-white">
          <div className="space-y-5">
            {/* عرض السعر النهائي والمقترح */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                animate={animate ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <p className="text-sm text-gray-500 mb-1">السعر النهائي</p>
                <p className={`text-xl font-bold ${isPriceInRange ? 'text-gray-900' : 'text-red-600'}`}>
                  {finalPrice.toFixed(2)} ريال
                </p>
              </motion.div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">السعر المقترح</p>
                <p className="text-xl font-bold text-gray-900">
                  {suggestedPrice.toFixed(2)} ريال
                </p>
              </div>
            </div>
            
            {/* التحليل والنصيحة */}
            <div className={`p-4 rounded-lg border bg-${advice.color}-50 border-${advice.color}-100 text-${advice.color}-700`}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 p-1.5 rounded-full bg-${advice.color}-100`}>
                  {priceStatus === "optimal" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
                  ) : priceStatus === "low" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{advice.message}</p>
                  {targetSegment === "economic" && (
                    <p className="text-xs mt-1 opacity-80">الفئة المستهدفة: اقتصادية (100-300 ريال)</p>
                  )}
                  {targetSegment === "medium" && (
                    <p className="text-xs mt-1 opacity-80">الفئة المستهدفة: متوسطة (301-700 ريال)</p>
                  )}
                  {targetSegment === "luxury" && (
                    <p className="text-xs mt-1 opacity-80">الفئة المستهدفة: فاخرة (701-1500 ريال)</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* تفاصيل إضافية - التكاليف وهامش الربح */}
            <div className="grid grid-cols-2 gap-4 text-center pt-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">إجمالي التكاليف</p>
                <p className="font-semibold">{directCosts.toFixed(2)} ريال</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">هامش الربح</p>
                <p className="font-semibold">{profitMargin}%</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}