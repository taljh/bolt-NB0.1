export const dynamic = "force-dynamic";

import { ReactNode, Suspense } from "react";
import { redirect } from "next/navigation";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { getCurrentUser } from "@/lib/get-user";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import LoadingScreen from "@/components/ui/loading-screen";

const ibm = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm",
  display: "swap",
  preload: true
});

export default async function DashboardLayout({ 
  children 
}: { 
  children: ReactNode 
}) {
  // التحقق من المستخدم
  let user;
  try {
    user = await getCurrentUser();
    if (!user) {
      redirect("/login");
    }
  } catch (error) {
    console.error("خطأ في جلب بيانات المستخدم:", error);
    redirect("/login");
  }

  return (
    <div className={cn(
      "min-h-screen",
      "bg-gradient-to-br from-[#F8F9FA] via-white to-[#5B5AEC]/10",
      ibm.className
    )}>
      {/* القائمة الجانبية - تظهر في الشاشات الكبيرة فقط */}
      <aside className={cn(
        "fixed top-0 right-0 h-screen",
        "w-full md:w-64 lg:w-72",
        "z-40",
        "transform transition-transform duration-300 ease-in-out",
        "md:translate-x-0",
        "bg-gradient-to-br from-[#5B5AEC] to-[#6C6DFF]",
        "hidden md:block"
      )}>
        <Sidebar userName={user?.name} />
      </aside>

      {/* المحتوى الرئيسي - يتكيف مع حجم الشاشة */}
      <main className={cn(
        "min-h-screen",
        "transition-all duration-300",
        "px-4 sm:px-6 md:px-8",
        "py-6 md:py-8",
        "md:mr-64 lg:mr-72", // مسافة للقائمة الجانبية في الشاشات الكبيرة
        "bg-white/60 backdrop-blur-lg"
      )}>
        <Suspense fallback={<LoadingScreen />}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </Suspense>
      </main>
    </div>
  );
}