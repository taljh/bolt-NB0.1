"use client";

import { useState } from "react";

interface SmartRecommendationCardProps {
  plan: "free" | "pro" | "advanced" | null;
}

export default function SmartRecommendationCard({ plan }: SmartRecommendationCardProps) {
  const [hovered, setHovered] = useState(false);
  const isFreePlan = plan === "free";

  return (
    <div
      className="relative rounded-xl bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9] border border-dashed border-gray-300/60 shadow-inner transition-all duration-500 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* محتوى الكرت */}
      <div
        className={`p-6 transition-opacity duration-300 ${
          isFreePlan && hovered ? "opacity-30" : "opacity-100"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl font-bold text-[#5B5AEC]">🔒 نَسيق يقرّر</span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            ميزة مغلقة
          </span>
        </div>
        <p className="text-gray-800 text-lg font-medium leading-relaxed mb-3">
          تفصيلة وحدة – لو عدّلتها بالشكل الصح،<br />
          هامشك ممكن يقفز{" "}
          <span className="text-[#5B5AEC] font-bold">12%</span>.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">
          النسخة القادمة من نَسيق ما تحلّل لك بس، تقترح، تقرّر، وتعلّمك كيف تنفّذ.
        </p>
        <p className="text-gray-500 text-xs">
          كل توصية مبنية على أرقامك، وتشتغل عشان شيء واحد: <br />
          <span className="font-semibold text-[#5B5AEC]">
            تنمّي مشروعك. تبني براندك.
          </span>
        </p>
      </div>

      {/* زر خاص للمستخدمين بباقات free */}
      {isFreePlan && hovered && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button className="bg-[#5B5AEC] text-white px-6 py-2 rounded-full shadow hover:bg-[#4b4ae0] transition-all">
            🔓 ترقية لفتح الميزة
          </button>
        </div>
      )}

      {/* زر دائم للباقات الأعلى */}
      {!isFreePlan && (
        <div className="absolute bottom-4 left-4 z-10">
          <button className="bg-[#5B5AEC] text-white px-5 py-2 rounded-full shadow hover:bg-[#4b4ae0] transition-all text-sm">
            ✨ استكشاف الميزة
          </button>
        </div>
      )}
    </div>
  );
}