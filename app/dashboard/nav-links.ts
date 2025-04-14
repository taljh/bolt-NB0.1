import { LayoutDashboard, FileText } from "lucide-react";

export const navLinks = [
  { name: "الرئيسية", href: "/dashboard", icon: LayoutDashboard },
  { name: "تحليلات نَسيق", href: "/dashboard/analytics", icon: FileText },
  { name: "المنتجات", href: "/dashboard/products", icon: FileText },
  { name: "الطلبات والإنتاج", href: "/dashboard/orders", icon: FileText },
  { name: "المخزون", href: "/dashboard/inventory", icon: FileText },
  { name: "المالية", href: "/dashboard/finance", icon: FileText },
  { name: "إعداد المشروع", href: "/dashboard/settings", icon: FileText },
  { name: "مزيد من الأدوات الذكية 🔒", href: "/dashboard/tools", icon: FileText },
];
