"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Settings,
  Users,
  Phone,
  Bot,
  Save,
  RefreshCw,
  CheckCircle,
  Zap,
  Clock,
  BarChart,
  Shield,
  LucideIcon,
  TrendingUp,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ChatMessages } from "@/components/dashboard/chat/ChatMessages";
import { AgentSettings } from "@/components/dashboard/chat/AgentSettings";
import { ChatAnalytics } from "@/components/dashboard/chat/ChatAnalytics";

// تحسين نموذج التحقق
const settingsFormSchema = z.object({
  agentName: z.string().min(2, "يجب أن يكون الاسم حرفين على الأقل"),
  personality: z.enum(["professional", "friendly", "formal", "casual", "expert"]),
  language: z.enum(["ar", "en", "both"]),
  whatsappNumber: z.string().min(10, "رقم الواتساب غير صالح"),
  customInstructions: z.string().optional(),
  responseStyle: z.enum(["detailed", "concise", "balanced"]),
  workingHours: z.object({
    start: z.string(),
    end: z.string(),
  }),
  autoReply: z.boolean(),
  priorityKeywords: z.array(z.string()).optional(),
  greetingMessage: z.string().min(10, "الرسالة الترحيبية قصيرة جداً"),
  isActive: z.boolean(),
  handlingPreferences: z.object({
    handleOrders: z.boolean(),
    handleComplaints: z.boolean(),
    handleInquiries: z.boolean(),
  }),
});

export default function ChatPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "settings" | "analytics">("chat");
  const [stats, setStats] = useState({
    totalConversations: 0,
    activeChats: 0,
    averageResponseTime: "0",
    satisfactionRate: 0,
    isActive: false,
  });

  const supabase = createClientComponentClient();

  const form = useForm({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      agentName: "",
      personality: "professional",
      language: "ar",
      whatsappNumber: "",
      customInstructions: "",
      responseStyle: "balanced",
      workingHours: {
        start: "09:00",
        end: "21:00",
      },
      autoReply: true,
      priorityKeywords: [],
      greetingMessage: "مرحباً بك! أنا {agentName} مساعدك الشخصي في {storeName}. كيف يمكنني مساعدتك اليوم؟",
      isActive: false,
      handlingPreferences: {
        handleOrders: true,
        handleComplaints: true,
        handleInquiries: true,
      },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="space-y-4 text-center md:text-right max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold">
                نسيق يرد - مساعدك الذكي لتنمية علامتك التجارية
              </h1>
              <p className="text-xl text-indigo-100">
                أكثر من مجرد روبوت محادثة - محترف خدمة عملاء يعمل 24/7 لتنمية أعمالك
              </p>
              {!stats.isActive && (
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
                  <Zap className="w-5 h-5 ml-2" />
                  ابدأ الآن مجاناً
                </Button>
              )}
            </div>
            <div className="flex gap-4">
              <FeatureCard
                icon={TrendingUp}
                title="زيادة المبيعات"
                description="زيادة معدل التحويل بنسبة 35%"
              />
              <FeatureCard
                icon={Clock}
                title="توفير الوقت"
                description="خدمة عملاء 24/7"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Performance Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <PerformanceCard
          title="رضا العملاء"
          value="98%"
          trend="+15%"
          description="معدل رضا أعلى من المتوسط"
        />
        <PerformanceCard
          title="سرعة الرد"
          value="30"
          suffix="ثانية"
          trend="-40%"
          description="أسرع من الخدمة التقليدية"
        />
        <PerformanceCard
          title="معدل التحويل"
          value="35%"
          trend="+25%"
          description="زيادة في نسبة التحويل"
        />
        <PerformanceCard
          title="تكلفة الخدمة"
          value="75%"
          trend="-60%"
          description="وفر في تكاليف خدمة العملاء"
        />
      </motion.div>

      {/* محتوى محسن للترويسة */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Bot className="w-6 h-6 text-indigo-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">نسيق يرد</h1>
              </div>
              <p className="text-sm text-gray-500">
                مساعدك الذكي للتواصل مع العملاء عبر الواتساب
              </p>
            </div>

            {/* إحصائيات سريعة */}
            <div className="flex gap-4">
              <StatsCard
                icon={Users}
                label="محادثات نشطة"
                value={stats.activeChats}
                trend="+12%"
                trendUp={true}
              />
              <StatsCard
                icon={Clock}
                label="متوسط وقت الرد"
                value={stats.averageResponseTime}
                suffix="ثانية"
                trend="-18%"
                trendUp={false}
              />
              <StatsCard
                icon={CheckCircle}
                label="نسبة الرضا"
                value={`${stats.satisfactionRate}%`}
                trend="+5%"
                trendUp={true}
              />
            </div>
          </div>

          {/* شريط التنقل المحسن */}
          <nav className="flex items-center gap-2 border-b border-gray-200 pb-4">
            <TabButton
              active={activeTab === "chat"}
              onClick={() => setActiveTab("chat")}
              icon={MessageSquare}
              label="المحادثات"
            />
            <TabButton
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
              icon={Settings}
              label="الإعدادات"
            />
            <TabButton
              active={activeTab === "analytics"}
              onClick={() => setActiveTab("analytics")}
              icon={BarChart}
              label="التحليلات"
            />
          </nav>
        </div>
      </motion.div>

      {/* المحتوى الرئيسي */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-7xl mx-auto"
        >
          {activeTab === "chat" ? (
            <ChatMessages />
          ) : activeTab === "settings" ? (
            <AgentSettings form={form} isConnecting={isConnecting} />
          ) : (
            <ChatAnalytics stats={stats} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// New Component: Feature Card
const FeatureCard = ({ icon: Icon, title, description }: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 w-48"
  >
    <Icon className="w-8 h-8 mb-2" />
    <h3 className="font-semibold mb-1">{title}</h3>
    <p className="text-sm text-indigo-100">{description}</p>
  </motion.div>
);

// New Component: Performance Card
const PerformanceCard = ({ title, value, trend, description, suffix = "" }: {
  title: string;
  value: string;
  trend: string;
  description: string;
  suffix?: string;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
  >
    <h3 className="text-gray-600 text-sm mb-2">{title}</h3>
    <div className="flex items-baseline gap-2 mb-2">
      <span className="text-3xl font-bold text-gray-900">{value}{suffix}</span>
      <span className={`text-sm font-medium ${
        trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
      }`}>
        {trend}
      </span>
    </div>
    <p className="text-sm text-gray-500">{description}</p>
  </motion.div>
);

// Add interfaces for component props
interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  trend: string;
  trendUp: boolean;
  suffix?: string;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
}

// Update the component definitions
const StatsCard = ({ icon: Icon, label, value, trend, trendUp, suffix = "" }: StatsCardProps) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-gray-50 rounded-lg">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">{value}{suffix}</span>
          <span className={`text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const TabButton = ({ active, onClick, icon: Icon, label }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
      ${active 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'text-gray-600 hover:bg-gray-100'}`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);