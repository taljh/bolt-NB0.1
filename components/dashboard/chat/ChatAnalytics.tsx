"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  Clock,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatAnalyticsProps {
  stats: {
    totalConversations: number;
    activeChats: number;
    averageResponseTime: string;
    satisfactionRate: number;
  };
}

export function ChatAnalytics({ stats }: ChatAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<string>("week");

  // بيانات تجريبية - سيتم استبدالها بالبيانات الفعلية
  const weeklyData = [
    { day: "السبت", conversations: 45, responseTime: 30, satisfaction: 92 },
    { day: "الأحد", conversations: 52, responseTime: 28, satisfaction: 94 },
    { day: "الاثنين", conversations: 61, responseTime: 25, satisfaction: 95 },
    { day: "الثلاثاء", conversations: 48, responseTime: 32, satisfaction: 91 },
    { day: "الأربعاء", conversations: 55, responseTime: 27, satisfaction: 93 },
    { day: "الخميس", conversations: 67, responseTime: 24, satisfaction: 96 },
    { day: "الجمعة", conversations: 58, responseTime: 26, satisfaction: 94 },
  ];

  const metrics = [
    {
      title: "إجمالي المحادثات",
      value: stats.totalConversations,
      icon: MessageSquare,
      trend: "+12%",
      trendUp: true,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "متوسط وقت الرد",
      value: `${stats.averageResponseTime} ثانية`,
      icon: Clock,
      trend: "-18%",
      trendUp: false,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "نسبة رضا العملاء",
      value: `${stats.satisfactionRate}%`,
      icon: Star,
      trend: "+5%",
      trendUp: true,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* شريط التصفية */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">تحليلات المحادثات</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="اختر الفترة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">اليوم</SelectItem>
            <SelectItem value="week">الأسبوع</SelectItem>
            <SelectItem value="month">الشهر</SelectItem>
            <SelectItem value="quarter">الربع السنوي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* بطاقات المؤشرات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{metric.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span
                      className={`text-sm font-medium ${
                        metric.trendUp ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {metric.trend}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">نشاط المحادثات</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversations" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">مؤشر الأداء</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="satisfaction"
                  stroke="#6366f1"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* تحليلات إضافية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">توزيع المحادثات</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">استفسارات عامة</span>
              <span className="text-sm font-medium">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">طلبات المنتجات</span>
              <span className="text-sm font-medium">30%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">دعم فني</span>
              <span className="text-sm font-medium">15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">شكاوى</span>
              <span className="text-sm font-medium">10%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">أوقات الذروة</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">صباحاً (8-12)</span>
              <span className="text-sm font-medium">35%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ظهراً (12-4)</span>
              <span className="text-sm font-medium">25%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">مساءً (4-8)</span>
              <span className="text-sm font-medium">30%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ليلاً (8-12)</span>
              <span className="text-sm font-medium">10%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}