import { ReactNode } from "react";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { getCurrentUser } from "@/lib/get-user";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

const ibm = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm"
});

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className={cn("min-h-screen flex bg-gradient-to-br from-[#F8F9FA] via-white to-[#5B5AEC]/10", ibm.className)}>
      <Sidebar userName={user?.name} />
      <main className="flex-1 px-8 py-10 bg-white/60 backdrop-blur-lg">{children}</main>
    </div>
  );
}