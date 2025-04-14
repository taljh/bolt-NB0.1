import { getCurrentUser } from "@/lib/get-user";

export default async function DashboardPageWrapper() {
  const user = await getCurrentUser();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">مرحبا {user?.name || "مستخدم"} 👋</h1>
      <p className="text-gray-500 mt-2">هذي هي لوحة التحكم الأولى – راح نطورها سوا خطوة خطوة.</p>
    </div>
  );
}