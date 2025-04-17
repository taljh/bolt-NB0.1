"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  Bot,
  TrendingUp,
  Brain,
  Target,
  BarChart2,
  Shield,
  Zap,
  Globe,
  Users,
  MessageCircle,
  BadgeCheck,
  Share2,
  Heart,
  Star,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// مصفوفة المميزات المستقبلية
const futureFeatures = [
  {
    icon: Brain,
    title: "ذكاء عاطفي متقدم",
    description: "يفهم مشاعر عملائك ويتفاعل معها بذكاء",
    comingSoon: true,
  },
  {
    icon: Globe,
    title: "دعم 16 لغة",
    description: "تواصل مع عملائك بلغتهم المفضلة",
    comingSoon: true,
  },
  {
    icon: Share2,
    title: "تكامل مع منصات التواصل",
    description: "إدارة جميع قنوات التواصل من مكان واحد",
    comingSoon: false,
  },
];

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 py-16"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full mb-8">
            <Rocket className="w-4 h-4" />
            <span className="text-sm font-medium">مستقبل خدمة العملاء</span>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            نحول متجرك إلى علامة تجارية رائدة
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نسيق يرد ليس مجرد روبوت محادثة - إنه شريكك في النمو والنجاح. مصمم خصيصاً لتحويل متجرك إلى تجربة استثنائية.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <StatsCard
            icon={Users}
            value="2.5x"
            label="زيادة في رضا العملاء"
            description="مقارنة بالخدمة التقليدية"
          />
          <StatsCard
            icon={TrendingUp}
            value="45%"
            label="زيادة في المبيعات"
            description="عبر التحويل الذكي للمحادثات"
          />
          <StatsCard
            icon={MessageCircle}
            value="24/7"
            label="خدمة عملاء متواصلة"
            description="بدون توقف أو إجازات"
          />
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {futureFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all">
                {feature.comingSoon && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">
                      قريباً
                    </span>
                  </div>
                )}
                <CardHeader>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 w-fit">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Advanced Features Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-12 mb-16">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="relative z-10 text-white">
            <h2 className="text-3xl font-bold mb-8">امتلك مستقبل متجرك اليوم</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AdvancedFeature
                icon={Brain}
                title="تعلم مستمر"
                description="يتعلم من كل محادثة ليصبح أكثر ذكاءً"
              />
              <AdvancedFeature
                icon={Target}
                title="تخصيص متقدم"
                description="يتكيف مع هوية علامتك التجارية"
              />
              <AdvancedFeature
                icon={BarChart2}
                title="تحليلات عميقة"
                description="فهم سلوك العملاء واتجاهات السوق"
              />
              <AdvancedFeature
                icon={Shield}
                title="حماية فائقة"
                description="أمان وخصوصية بمعايير عالمية"
              />
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 py-16"
        >
          <h2 className="text-3xl font-bold">ابدأ رحلة النمو مع نسيق يرد</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            انضم إلى قائمة الانتظار واحصل على عرض حصري عند الإطلاق
          </p>
          <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600">
            <Zap className="w-5 h-5 ml-2" />
            انضم إلى قائمة الانتظار
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  description: string;
}

interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

// مكون بطاقة الإحصائيات
const StatsCard = ({ icon: Icon, value, label, description }: StatsCardProps) => (
  <Card className="border-none shadow-lg">
    <CardContent className="pt-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
          </div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// مكون الميزات المتقدمة
const AdvancedFeature = ({ icon: Icon, title, description }: FeatureProps) => (
  <div className="space-y-3">
    <Icon className="w-8 h-8" />
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-indigo-100">{description}</p>
  </div>
);