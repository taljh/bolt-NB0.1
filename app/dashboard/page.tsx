export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/get-user";
import { Suspense } from "react";
import { Star, TrendingUp, Sparkles } from "lucide-react";
import KpiCards from "@/components/dashboard/KpiCards";
import SmartRecommendationCard from "@/components/dashboard/SmartRecommendationCard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "صباح الخير" : hour < 18 ? "مساء الخير" : "مساء النور";
  const name = user?.name || "ضيف";

  return (
    <div className="space-y-8">
      {/* القسم العلوي */}
      <div className="grid gap-6">
        {/* كرت الترحيب */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {greeting} {name} 👋
              </h1>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                نَسيق معك خطوة بخطوة — خلّك مستعد للقرارات الذكية ✨
              </p>
            </div>
            
            <div className="flex flex-col items-start gap-2">
              <div className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-xl
                ${user?.plan === "free" 
                  ? "bg-gray-100 text-gray-700" 
                  : user?.plan === "pro" 
                  ? "bg-indigo-100 text-indigo-700" 
                  : "bg-emerald-100 text-emerald-700"}
              `}>
                <Star className="w-4 h-4" />
                <span className="font-semibold">
                  {user?.plan === "free" 
                    ? "الخطة المجانية" 
                    : user?.plan === "pro" 
                    ? "خطة برو" 
                    : "الخطة المتقدمة"}
                </span>
              </div>
              
              <span className="text-gray-500 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {user?.plan === "free"
                  ? "ميزات محدودة – جرّب الترقية!"
                  : user?.plan === "pro"
                  ? "استفد من مميزات برو المتقدمة"
                  : "أنت على أعلى باقة 🎯"}
              </span>
            </div>
          </div>
        </div>

        {/* كروت المؤشرات */}
        <Suspense fallback={<div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />}>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-gray-800">
                مؤشرات الأداء الرئيسية
              </h2>
            </div>
            <KpiCards />
          </div>
        </Suspense>

        {/* توصيات نَسيق */}
        <Suspense fallback={<div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />}>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-800">
                توصيات نَسيق الذكية
              </h2>
            </div>
            <SmartRecommendationCard plan={user?.plan} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}