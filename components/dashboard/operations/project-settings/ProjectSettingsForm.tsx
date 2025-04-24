"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useForm, UseFormWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import CostBreakdownEditor from "./CostBreakdownEditor";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, Building2, Users, Percent, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { UnsavedChangesAlert } from "./UnsavedChangesAlert";

const supabase = createClientComponentClient<Database>();

const formSchema = z.object({
  project_name: z.string().min(2, "اسم المشروع مطلوب"),
  project_type: z.string().min(2, "نوع المشروع مطلوب"),
  target_audience: z.enum(["economic", "medium", "luxury"], {
    required_error: "الرجاء اختيار الفئة المستهدفة"
  }),
  default_profit_margin: z.number()
    .min(0, "يجب أن تكون النسبة أكبر من 0")
    .max(100, "يجب أن تكون النسبة أقل من 100")
    .transform(val => Number(val.toFixed(2))), // تقريب لرقمين عشريين
  monthly_fixed_costs: z.number()
    .min(0, "يجب أن تكون التكاليف أكبر من 0"),
  estimated_monthly_units: z.number()
    .min(1, "يجب إدخال عدد المنتجات المتوقع")
    .int("يجب أن يكون العدد صحيحاً"),
  fixed_cost_breakdown: z.array(z.object({
    label: z.string(),
    amount: z.number()
  })).optional()
});

type FormData = z.infer<typeof formSchema>;

const CostBreakdownEditorMemo = React.memo(CostBreakdownEditor);

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
};

const slideIn = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3 }
};

// في نفس ملف ProjectSettingsForm.tsx
// تعديل دالة useFormChanges
const useFormChanges = (
  watch: UseFormWatch<FormData>, 
  initialData: FormData | null, 
  setHasUnsavedChanges: (value: boolean) => void
) => {
  const debounceTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const subscription = watch((value) => {
      if (!initialData) return;

      // إلغاء المؤقت السابق
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // تأخير تحديث حالة التغييرات
      debounceTimeout.current = setTimeout(() => {
        const currentValue = JSON.stringify(value);
        const initialValue = JSON.stringify(initialData);
        setHasUnsavedChanges(currentValue !== initialValue);
      }, 300);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [watch, initialData, setHasUnsavedChanges]);
};

const useFormProgress = (getValues: any, requiredFields: readonly string[]) => {
  return useMemo(() => {
    const filledFields = requiredFields.filter(field => {
      const value = getValues(field);
      return value !== undefined && value !== '';
    });
    return Math.round((filledFields.length / requiredFields.length) * 100);
  }, [getValues, requiredFields]);
};

// تحديث واجهة ProjectSettings
interface ProjectSettings {
  profit_margin: number;
  target_audience: 'economic' | 'medium' | 'luxury';
  price_ranges: {
    economic: { min: number; max: number };
    medium: { min: number; max: number };
    luxury: { min: number; max: number };
  };
}

// 2. تعديل في المكون الرئيسي
export default function ProjectSettingsForm() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<FormData | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [totalFixedCosts, setTotalFixedCosts] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      target_audience: "medium",
      default_profit_margin: 30,
      estimated_monthly_units: 100
    }
  });

  const requiredFields = useMemo(() => [
    'project_name',
    'project_type',
    'target_audience',
    'default_profit_margin',
    'monthly_fixed_costs',
    'estimated_monthly_units'
  ] as const, []);

  const progressValue = useFormProgress(getValues, requiredFields);
  useFormChanges(watch, initialData, setHasUnsavedChanges);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();

        const user_id = session?.user?.id;
        if (!user_id) {
          toast.error("يرجى تسجيل الدخول أولاً");
          return;
        }

        const { data, error } = await supabase
          .from("project_settings")
          .select("*")
          .eq("user_id", user_id)
          .single();

        if (error && error.code !== 'PGRST116') { // Not Found error
          throw error;
        }

        if (data) {
          setInitialData(data);
          reset(data);
          // إذا كان هناك تكاليف ثابتة، نحدث الإجمالي
          if (data.fixed_cost_breakdown) {
            const total = data.fixed_cost_breakdown.reduce(
              (sum: number, item: any) => sum + (item.amount || 0), 
              0
            );
            setTotalFixedCosts(total);
          }
        }

      } catch (error) {
        console.error('خطأ في استرجاع البيانات:', error);
        toast.error("حدث خطأ أثناء تحميل البيانات");
      }
    };

    fetchSettings();
  }, [reset]);

  useEffect(() => {
    // التحقق من حالة المصادقة عند تحميل المكون
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error("يرجى تسجيل الدخول أولاً");
        // يمكنك هنا إضافة توجيه للمستخدم لصفحة تسجيل الدخول
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        const message = "لديك تغييرات غير محفوظة. هل أنت متأكد من المغادرة؟";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    // New implementation for route change protection
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);

      // Create a custom event for handling navigation
      const handleNavigation = (url: string) => {
        if (hasUnsavedChanges) {
          if (window.confirm("لديك تغييرات غير محفوظة. هل أنت متأكد من المغادرة؟")) {
            router.push(url);
          }
        }
      };

      // Add listener for next/link navigation
      window.addEventListener('popstate', () => {
        if (hasUnsavedChanges) {
          if (window.confirm("لديك تغييرات غير محفوظة. هل أنت متأكد من المغادرة؟")) {
            router.back();
          } else {
            window.history.pushState(null, '', pathname);
          }
        }
      });

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', () => {});
      };
    }
  }, [hasUnsavedChanges, router, pathname]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // إضافة مرجع للتحكم في التحديثات
  const isSubmitting = useRef(false);

  // تعديل دالة onSubmit
  const onSubmit = async (data: FormData) => {
    try {
      isSubmitting.current = true;
      setIsLoading(true);
      
      // 1. التحقق من وجود المستخدم
      const { data: { session } } = await supabase.auth.getSession();
      const user_id = session?.user?.id;
      
      if (!user_id) {
        toast.error("عذراً، يجب تسجيل الدخول أولاً");
        return;
      }
  
      // 2. تحضير البيانات مع التحقق من الأرقام
      const settingsData = {
        ...data,
        user_id,
        monthly_fixed_costs: Number(data.monthly_fixed_costs),
        default_profit_margin: Number(data.default_profit_margin),
        estimated_monthly_units: Number(data.estimated_monthly_units),
        updated_at: new Date().toISOString()
      };
  
      console.log('Saving data:', settingsData); // للتأكد من البيانات
  
      // 3. محاولة الحفظ في قاعدة البيانات
      const { error: upsertError } = await supabase
        .from('project_settings')
        .upsert([settingsData]) // تم تغييرها لتكون مصفوفة
        .select();
  
      if (upsertError) {
        console.error('Upsert error:', upsertError);
        throw new Error(upsertError.message);
      }
  
      // 4. جلب البيانات المحدثة
      const { data: updatedData, error: fetchError } = await supabase
        .from('project_settings')
        .select('*')
        .eq('user_id', user_id)
        .single();
  
      if (fetchError) {
        console.error('Fetch error:', fetchError);
        throw new Error(fetchError.message);
      }
  
      // 5. تحديث النموذج بالبيانات الجديدة
      if (updatedData) {
        reset(updatedData);
        setTotalFixedCosts(updatedData.monthly_fixed_costs || 0);
      }
  
      // 6. إظهار رسالة النجاح
      toast.success("تم حفظ الإعدادات بنجاح", {
        duration: 3000,
        position: 'top-center'
      });

      // Update initial data after successful save
      setInitialData(settingsData);
      // تأخير إزالة حالة التغييرات غير المحفوظة
      setTimeout(() => {
        setHasUnsavedChanges(false);
      }, 100);
  
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error(
        error instanceof Error ? error.message : "حدث خطأ أثناء حفظ البيانات",
        {
          duration: 3000,
          position: 'top-center'
        }
      );
    } finally {
      setIsLoading(false);
      isSubmitting.current = false;
    }
  };

  // تعديل عرض رسالة التغييرات غير المحفوظة
  return (
    <>
      <UnsavedChangesAlert 
        isVisible={hasUnsavedChanges && !isSubmitting.current} 
      />

      <div className="space-y-6">
        <motion.div
          {...fadeIn}
          layout="position"
          className="bg-white rounded-xl shadow-sm"
        >
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-semibold text-gray-900">
              المعلومات الأساسية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Progress Bar */}
            <div className="mb-4 bg-gray-100 h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progressValue}%` }}
                transition={{ duration: 0.3 }}
                layout
              />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form Fields */}
                {[
                  {
                    name: "project_name",
                    label: "اسم المشروع",
                    icon: <Building2 className="w-4 h-4 text-primary" />,
                    placeholder: "أدخل اسم المشروع",
                    type: "text",
                    error: errors.project_name?.message
                  },
                  {
                    name: "project_type",
                    label: "نوع المشروع",
                    icon: <Settings2 className="w-4 h-4 text-primary" />,
                    placeholder: "نوع المشروع",
                    type: "text",
                    error: errors.project_type?.message
                  },
                  {
                    name: "target_audience",
                    label: "الفئة المستهدفة",
                    icon: <Users className="w-4 h-4 text-primary" />,
                    type: "select",
                    options: [
                      { value: "economic", label: "اقتصادية" },
                      { value: "medium", label: "متوسطة" },
                      { value: "luxury", label: "فاخرة" }
                    ],
                    error: errors.target_audience?.message
                  },
                  {
                    name: "default_profit_margin",
                    label: "نسبة الربح الافتراضية (%)",
                    icon: <Percent className="w-4 h-4 text-primary" />,
                    placeholder: "أدخل النسبة",
                    type: "number",
                    error: errors.default_profit_margin?.message
                  },
                  {
                    name: "estimated_monthly_units",
                    label: "عدد المنتجات المتوقع بيعها شهريًا",
                    icon: <Package className="w-4 h-4 text-primary" />,
                    placeholder: "العدد التقديري",
                    type: "number",
                    error: errors.estimated_monthly_units?.message
                  }
                ].map((field, index) => (
                  <motion.div
                    key={field.name}
                    {...slideIn}
                    transition={{ delay: index * 0.1 }}
                    layout
                    className="space-y-2"
                  >
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      {field.icon}
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select 
                        {...register(field.name as keyof FormData)} 
                        className="w-full border border-gray-200 rounded-md h-10 px-3 focus:border-primary/50 outline-none"
                      >
                        {field.options?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input 
                        type={field.type}
                        {...register(field.name as keyof FormData, { valueAsNumber: field.type === "number" })}
                        className="border-gray-200 focus:border-primary/50"
                        placeholder={field.placeholder}
                      />
                    )}
                    {field.error && (
                      <p className="text-sm text-red-500">{field.error}</p>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* CostBreakdownEditor */}
              <motion.div layout className="mt-8">
                <CostBreakdownEditorMemo
                  value={watch('fixed_cost_breakdown') || []}
                  onChange={(items) => {
                    setValue('fixed_cost_breakdown', items, { 
                      shouldDirty: true,
                      shouldTouch: true 
                    });
                  }}
                  onTotalChange={(total) => {
                    // تحديث إجمالي التكاليف الثابتة
                    setValue('monthly_fixed_costs', total, {
                      shouldDirty: true,
                      shouldTouch: true
                    });
                  }}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div layout className="flex justify-end pt-4 border-t">
                <Button 
                  type="submit"
                  disabled={isLoading || !hasUnsavedChanges}
                  className={cn(
                    "min-w-[120px]",
                    !hasUnsavedChanges ? "bg-gray-300" : 
                    isLoading ? "bg-gray-400" : "bg-primary hover:bg-primary/90"
                  )}
                >
                  {isLoading ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </motion.div>
      </div>
    </>
  );
}
