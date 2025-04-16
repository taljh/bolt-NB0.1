export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/get-user";
import KpiCards from "@/components/dashboard/KpiCards";
import SmartRecommendationCard from "@/components/dashboard/SmartRecommendationCard";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "صباح الخير" : hour < 18 ? "مساء الخير" : "مساء النور";
  const name = user?.name || "ضيف";

  return (
    <div className="p-6 space-y-6">
      {/* كرت الترحيب */}
      <div className="bg-white rounded-xl p-6 shadow text-gray-800">
        <h1 className="text-2xl font-semibold mb-1">{greeting} {name} 👋</h1>
        <div className="inline-flex items-center gap-2 text-sm mt-2">
          <span className={`px-3 py-1 rounded-full text-white font-medium
            ${user?.plan === "free" ? "bg-gray-400" : user?.plan === "pro" ? "bg-indigo-500" : "bg-emerald-600"}`}>
            {user?.plan === "free" ? "الخطة المجانية" : user?.plan === "pro" ? "خطة برو" : "الخطة المتقدمة"}
          </span>
          <span className="text-gray-500 text-xs">
            {user?.plan === "free"
              ? "ميزات محدودة – جرّب الترقية!"
              : user?.plan === "pro"
              ? "استفد من مميزات برو المتقدمة"
              : "أنت على أعلى باقة 🎯"}
          </span>
        </div>
        <p className="text-sm text-gray-600">نَسيق معك خطوة بخطوة — خلّك مستعد للقرارات الذكية ✨</p>
      </div>

      {/* كروت المؤشرات */}
      <KpiCards />

            
      {/* توصيات نَسيق */}
      <SmartRecommendationCard plan={user?.plan} />
    </div>
  );
}