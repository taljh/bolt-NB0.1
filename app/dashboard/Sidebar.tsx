"use client";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// استيراد المكتبات والأدوات
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  FileText, 
  LogOut, 
  BarChart3, 
  Settings, 
  DollarSign, 
  Calculator, 
  MessageSquare, 
  Lock,
  Package,
  ChevronDown 
} from "lucide-react";
import { cn } from "@/lib/utils";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// تعريف الأنواع
interface SubLink {
  label: string;
  href: string;
  description?: string;
}

interface NavLink {
  label: string;
  href?: string;
  icon: any; // يمكن تحسينها باستخدام نوع أكثر دقة
  description?: string;
  beta?: boolean;
  locked?: boolean;
  subLinks?: SubLink[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// تعريف عناصر القائمة الرئيسية
const navLinks: NavLink[] = [
  {
    label: "الرئيسية",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "لمحة عامة عن المشروع"
  },
  {
    label: "تحليلات نَسيق",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "تحليلات وإحصائيات المشروع"
  },
  {
    label: "تشغيل نَسيق",
    icon: Package,
    subLinks: [
      { label: "المنتجات", href: "/dashboard/products", description: "إدارة المنتجات" },
      { label: "الطلبات", href: "/dashboard/orders", description: "إدارة الطلبات" },
      { label: "الإنتاج", href: "/dashboard/production", description: "متابعة الإنتاج" },
      { label: "الخياطين", href: "/dashboard/tailors", description: "إدارة الخياطين" },
      { label: "المشتريات", href: "/dashboard/purchases", description: "إدارة المشتريات" },
      { label: "المخزون", href: "/dashboard/inventory", description: "إدارة المخزون" },
    ]
  },
  {
    label: "المالية",
    icon: DollarSign,
    subLinks: [
      { label: "الإيرادات", href: "/dashboard/finance/revenue" },
      { label: "المصاريف", href: "/dashboard/finance/expenses" },
      { label: "التقارير المالية", href: "/dashboard/finance/reports" },
    ]
  },
  {
    label: "التسعير الذكي",
    href: "/dashboard/pricing",
    icon: Calculator,
    description: "حاسبة التسعير المتقدمة"
  },
  {
    label: "نَسيق يردّ",
    href: "/dashboard/chat",
    icon: MessageSquare,
    beta: true,
    description: "موظف خدمة العملاء الذكي"
  },
  {
    label: "إعدادات المشروع",
    href: "/dashboard/settings",
    icon: Settings,
    description: "تخصيص إعدادات النظام"
  },
  {
    label: "مزايا مستقبلية",
    href: "/dashboard/premium",
    icon: Lock,
    locked: true,
    description: "ميزات متقدمة قريباً"
  }
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// المكون الرئيسي للقائمة الجانبية
export default function Sidebar({ userName }: { userName?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("خطأ في تسجيل الخروج:", error);
      // يمكن إضافة إشعار للمستخدم هنا
    }
  };

  const toggleSubMenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  const NavItem = ({ link }: { link: NavLink }) => {
    const isActive = pathname === link.href;
    const isExpanded = expandedMenu === link.label;

    const buttonClasses = cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-right", // إضافة text-right
      "hover:bg-white/10",
      {
        "bg-white/20": isActive || isExpanded,
        "text-white font-semibold": isActive,
        "text-white/80": !isActive
      }
    );

    return (
      <div className="group relative">
        {link.href && !link.subLinks ? (
          <Link
            href={link.href}
            className={buttonClasses}
            onClick={() => setIsOpen(false)}
          >
            <link.icon className="w-5 h-5 min-w-[20px]" /> {/* إضافة min-width */}
            <span className="flex-1 text-right">{link.label}</span> {/* إضافة text-right */}
            {link.beta && (
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                تجريبي
              </span>
            )}
            {link.locked && <Lock className="w-4 h-4 opacity-50 min-w-[16px]" />}
          </Link>
        ) : (
          <div>
            <button
              onClick={() => toggleSubMenu(link.label)}
              className={buttonClasses}
            >
              <link.icon className="w-5 h-5 min-w-[20px]" />
              <span className="flex-1 text-right">{link.label}</span>
              <ChevronDown 
                className={cn(
                  "w-4 h-4 transition-transform min-w-[16px]",
                  isExpanded ? "rotate-180" : ""
                )} 
              />
            </button>
            {isExpanded && link.subLinks && (
              <div className="mr-4 mt-1 border-r border-white/10 pr-4 space-y-1">
                {link.subLinks.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={cn(
                      "flex items-center w-full px-4 py-2 text-sm rounded-lg transition-all",
                      "hover:bg-white/10",
                      pathname === sub.href
                        ? "bg-white/20 text-white font-semibold"
                        : "text-white/70"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex-1 text-right">{sub.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // تعديل مكون الشعار والإصدار
  const Logo = () => (
    <div className="p-6 pb-2 text-center">
      <h2 className="text-4xl font-black text-white tracking-tight leading-tight drop-shadow">
        نَسيق
      </h2>
      <div className="mt-1 text-xs text-white/60 font-normal">
        الإصدار 1.0.0 MVP
      </div>
    </div>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <Logo />
      
      {/* القائمة الرئيسية */}
      <div className="flex-1 overflow-y-auto px-6 space-y-2">
        <nav className="flex flex-col gap-2 text-sm font-medium">
          {navLinks.map((link) => (
            <NavItem key={link.label} link={link} />
          ))}
        </nav>
      </div>

      {/* معلومات المستخدم */}
      <div className="pt-6 border-t border-white/10 text-white/80 text-sm px-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white font-bold shadow-inner">
            {userName?.[0]?.toUpperCase() || "ن"}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white">{userName || "مستخدم"}</p>
            <p className="text-xs text-white/60">مدير النظام</p>
          </div>
          <button
            onClick={handleLogout}
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
      {/* نسخة سطح المكتب */}
      <aside className="hidden md:flex flex-col w-72 h-screen fixed right-0 top-0 bg-gradient-to-br from-[#5B5AEC] to-[#6C6DFF] text-white shadow-xl z-40">
        <SidebarContent />
      </aside>

      {/* نسخة الجوال */}
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
