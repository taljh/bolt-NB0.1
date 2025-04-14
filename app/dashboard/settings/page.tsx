import { getCurrentUser } from "@/lib/get-user";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold mb-4">الإعدادات</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500">الاسم</p>
          <p className="font-medium text-gray-800">{user?.name || "غير متوفر"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">البريد الإلكتروني</p>
          <p className="font-medium text-gray-800">{user?.email || "غير متوفر"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">الخطة</p>
          <p className="font-medium text-gray-800">{user?.plan || "غير محددة"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">الصلاحية</p>
          <p className="font-medium text-gray-800">{user?.role || "مستخدم"}</p>
        </div>
      </div>
    </div>
  );
}