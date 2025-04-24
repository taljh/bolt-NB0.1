'use client';

import ProjectSettingsForm from "@/components/dashboard/operations/project-settings/ProjectSettingsForm";
import { Settings, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function ProjectSettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      {/* Header Section */}
      <motion.div 
        className="mb-8 max-w-4xl mx-auto"
        initial={fadeIn.initial}
        animate={fadeIn.animate}
        transition={fadeIn.transition}
      >
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إعدادات وتكوين المشروع</h1>
                <p className="text-gray-500 text-sm mt-1">قم بضبط إعدادات مشروعك وتكوين المتغيرات الأساسية</p>
              </div>
            </div>

            <div className="grid gap-4 mt-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  قم بتعبئة البيانات أدناه لمساعدتنا في تحديد الأسعار بدقة وذكاء
                </p>
                <ul className="space-y-3">
                  <motion.li 
                    className="flex items-center gap-2 text-sm text-gray-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ArrowRight className="w-4 h-4 text-primary" />
                    حدد تفاصيل مشروعك الأساسية
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-2 text-sm text-gray-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <ArrowRight className="w-4 h-4 text-primary" />
                    أدخل التكاليف الثابتة والمتغيرة
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-2 text-sm text-gray-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <ArrowRight className="w-4 h-4 text-primary" />
                    اضبط هوامش الربح المستهدفة
                  </motion.li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100"
      >
        <ProjectSettingsForm />
      </motion.div>
    </div>
  );
}