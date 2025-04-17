"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn } from "react-hook-form";

interface AgentSettingsProps {
  form: UseFormReturn<any>;
  isConnecting: boolean;
}

export function AgentSettings({ form, isConnecting }: AgentSettingsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* إعدادات الوكيل */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">إعدادات الوكيل</h3>
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">اسم الوكيل</label>
            <Input {...form.register("agentName")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">شخصية الوكيل</label>
            <Select
              onValueChange={(value) => form.setValue("personality", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر شخصية الوكيل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">محترف</SelectItem>
                <SelectItem value="friendly">ودود</SelectItem>
                <SelectItem value="formal">رسمي</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* المزيد من الإعدادات */}
        </form>
      </Card>

      {/* إعدادات الواتساب */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">إعدادات الواتساب</h3>
        {/* محتوى إعدادات الواتساب */}
      </Card>
    </motion.div>
  );
}