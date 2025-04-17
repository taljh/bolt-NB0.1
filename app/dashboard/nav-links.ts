import { 
  LayoutDashboard, 
  BarChart3, 
  MessageSquare, 
  Package, 
  DollarSign,
  Settings,
  Lock,
  ShoppingBag,
  Truck,
  Box
} from "lucide-react";

interface SubLink {
  name: string;
  href: string;
  description?: string;
}

interface NavLink {
  name: string;
  href?: string;
  icon: any;
  description?: string;
  beta?: boolean;
  locked?: boolean;
  subLinks?: SubLink[];
}

export const navLinks: NavLink[] = [
  {
    name: "الرئيسية",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "لمحة عامة عن المشروع"
  },
  {
    name: "تحليلات نَسيق",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "تحليلات وإحصائيات المشروع"
  },
  {
    name: "تشغيل نَسيق",
    icon: Package,
    description: "إدارة العمليات اليومية",
    subLinks: [
      { 
        name: "المنتجات", 
        href: "/dashboard/products",
        description: "إدارة المنتجات"
      },
      { 
        name: "الطلبات والإنتاج", 
        href: "/dashboard/orders",
        description: "متابعة الطلبات والإنتاج"
      },
      { 
        name: "المخزون", 
        href: "/dashboard/inventory",
        description: "إدارة المخزون والمواد"
      }
    ]
  },
  {
    name: "المالية",
    icon: DollarSign,
    description: "إدارة الجوانب المالية",
    subLinks: [
      { 
        name: "الإيرادات", 
        href: "/dashboard/finance/revenue",
        description: "متابعة إيرادات المشروع"
      },
      { 
        name: "المصاريف", 
        href: "/dashboard/finance/expenses",
        description: "إدارة مصاريف المشروع"
      },
      { 
        name: "الربحية", 
        href: "/dashboard/finance/profitability",
        description: "تحليل ربحية المشروع"
      }
    ]
  },
  {
    name: "نَسيق يردّ",
    href: "/dashboard/chat",
    icon: MessageSquare,
    description: "موظف خدمة العملاء الذكي",
    beta: true
  },
  {
    name: "إعداد المشروع",
    href: "/dashboard/settings",
    icon: Settings,
    description: "تخصيص إعدادات النظام"
  },
  {
    name: "مزايا متقدمة",
    href: "/dashboard/tools",
    icon: Lock,
    description: "ميزات إضافية قريباً",
    locked: true
  }
];
