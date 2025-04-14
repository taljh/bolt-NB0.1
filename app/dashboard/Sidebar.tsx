"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, FileText, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "./nav-links";

export default function Sidebar({ userName }: { userName?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div>
        <h2 className="text-4xl font-black text-white text-center tracking-tight leading-tight drop-shadow mb-8">
          نَسيق
        </h2>
        <nav className="flex flex-col gap-2 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-white/30 text-white font-semibold shadow-inner"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
                onClick={() => setIsOpen(false)}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-white/10 text-white/80 text-sm px-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white font-bold shadow-inner">
            {userName?.[0]?.toUpperCase() || "ن"}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white">{userName || "مستخدم"}</p>
            <p className="text-xs text-white/60">مدير النظام</p>
          </div>
          <button
            className="text-white/80 hover:text-red-300 transition flex items-center gap-1 text-sm font-medium"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-4 text-[11px] text-white/40 text-center">
          تم التطوير بواسطة طلال الجهني
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 px-6 py-8 bg-gradient-to-br from-[#5B5AEC] to-[#6C6DFF] text-white shadow-xl rounded-tr-3xl rounded-br-3xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Toggle */}
      <header className="md:hidden fixed top-0 right-0 left-0 p-4 bg-white/80 backdrop-blur flex items-center justify-between z-30 border-b">
        <button onClick={() => setIsOpen(true)} className="text-gray-700 hover:text-[#5B5AEC]">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-[#5B5AEC]">لوحة التحكم</h1>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 w-72 h-full bg-gradient-to-br from-[#5B5AEC] to-[#6C6DFF] text-white px-6 py-8 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 left-4 text-white hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>
        <SidebarContent />
      </div>
    </>
  );
}
