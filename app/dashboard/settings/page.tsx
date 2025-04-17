export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/get-user";
import ProjectSettingsForm from "@/components/dashboard/settings/SettingsForm";
import SallaIntegrationCard from "@/components/dashboard/settings/SallaIntegrationCard";
import { redirect } from "next/navigation";
import { Settings, User, Store, ShieldCheck } from "lucide-react";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const sections = [
    {
      id: "user",
      title: "بيانات المستخدم",
      icon: User,
      content: (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm text-gray-500">الاسم</label>
            <p className="font-medium text-gray-900">
              {user.name || 'لم يتم تحديد الاسم'}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-500">البريد الإلكتروني</label>
            <p className="font-medium text-gray-900">
              {user.email || 'لم يتم تحديد البريد'}
            </p>
          </div>
        </div>
      )
    },
    {
      id: "integration",
      title: "تكامل المتجر",
      icon: Store,
      content: <SallaIntegrationCard userId={user?.id} />
    },
    {
      id: "settings",
      title: "إعدادات المشروع",
      icon: Settings,
      content: <ProjectSettingsForm userId={user?.id} />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* ترويسة الصفحة */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                إعدادات المشروع
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                إدارة إعدادات المشروع والتكامل مع المنصات
              </p>
            </div>
          </div>
        </div>

        {/* الأقسام */}
        <div className="space-y-6">
          {sections.map((section) => (
            <section
              key={section.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <section.icon className="w-5 h-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}