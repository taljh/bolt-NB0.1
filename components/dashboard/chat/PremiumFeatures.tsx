"use client";

import { motion } from "framer-motion";
import { Crown, Zap, Shield, Clock, BarChart, Bot, MessageSquare, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const premiumFeatures = [
  {
    icon: Bot,
    title: "مساعد شخصي ذكي",
    description: "محادثات طبيعية 100% مع عملائك",
    pro: true
  },
  {
    icon: Clock,
    title: "خدمة 24/7",
    description: "متوفر دائماً للرد على استفسارات عملائك",
    pro: true
  },
  {
    icon: Shield,
    title: "حماية متقدمة",
    description: "تشفير كامل للمحادثات وحماية البيانات",
    pro: true
  },
  {
    icon: BarChart,
    title: "تحليلات متقدمة",
    description: "تقارير تفصيلية عن أداء المحادثات",
    pro: true
  }
];

export function PremiumFeatures() {
  return (
    <div className="relative">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

      <div className="relative z-10 text-center space-y-6 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1 rounded-full">
            <Crown className="w-4 h-4" />
            <span className="text-sm font-medium">متوفر فقط في الباقة المميزة</span>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900">
            اكتشف قوة نسيق يرد برو
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            حول متجرك إلى تجربة تسوق استثنائية مع مساعد خدمة عملاء ذكي يعمل 24/7
          </p>
        </motion.div>

        {/* Premium Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {premiumFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden group">
                {feature.pro && (
                  <div className="absolute top-2 right-2">
                    <Crown className="w-4 h-4 text-amber-500" />
                  </div>
                )}
                <CardHeader>
                  <div className="p-3 rounded-lg bg-indigo-50 w-fit">
                    <feature.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 space-y-4"
        >
          <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600">
            <Zap className="w-5 h-5 ml-2" />
            ترقية إلى برو الآن
          </Button>
          <p className="text-sm text-gray-500">
            ابدأ مجاناً لمدة 14 يوم - لا يلزم بطاقة ائتمان
          </p>
        </motion.div>

        {/* Feature Comparison */}
        <div className="mt-16 border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right">الميزة</th>
                <th className="px-6 py-4">الباقة المجانية</th>
                <th className="px-6 py-4 bg-indigo-50 text-indigo-600">الباقة المميزة</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-6 py-4">عدد المحادثات</td>
                <td className="px-6 py-4">10 شهرياً</td>
                <td className="px-6 py-4 bg-indigo-50">غير محدود</td>
              </tr>
              <tr>
                <td className="px-6 py-4">التخصيص</td>
                <td className="px-6 py-4">محدود</td>
                <td className="px-6 py-4 bg-indigo-50">كامل</td>
              </tr>
              <tr>
                <td className="px-6 py-4">تحليلات متقدمة</td>
                <td className="px-6 py-4">-</td>
                <td className="px-6 py-4 bg-indigo-50">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}