"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SallaSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard/settings");
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-gray-100 rounded-lg shadow-xl p-10 max-w-lg w-full text-center border border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-green-600">🎉 تم ربط المتجر بنجاح</h2>
        <p className="text-gray-700 mb-6">
          يمكنك الآن إدارة متجرك ومزامنة الطلبات مباشرة من خلال لوحة التحكم.
        </p>
        <p className="text-sm text-gray-500">سيتم تحويلك إلى صفحة الإعدادات خلال لحظات...</p>
      </div>
    </div>
  );
}
