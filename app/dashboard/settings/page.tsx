import { getCurrentUser } from "@/lib/get-user";
import ProjectSettingsForm from "@/components/dashboard/settings/SettingsForm";
import SallaIntegrationCard from "@/components/dashboard/settings/SallaIntegrationCard";
import { redirect } from "next/navigation";


export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <section>
        <h1 className="text-2xl font-bold text-[#5B5AEC] mb-4">بيانات المستخدم</h1>
        <p className="text-gray-700">الاسم: {user?.name}</p>
        <p className="text-gray-700">البريد: {user?.email}</p>
      </section>

      <SallaIntegrationCard userId={user?.id} />

      <ProjectSettingsForm userId={user?.id} />
    </div>
  );
}