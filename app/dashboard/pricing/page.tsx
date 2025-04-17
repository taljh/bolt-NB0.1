"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Calculator,
  Tags,
  Sparkles,
  ArrowRight,
  PlusCircle,
  MinusCircle,
  AlertCircle,
  TrendingUp,
  Save,
  RefreshCw
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// تحسين مخطط التحقق
const formSchema = z.object({
  name: z.string().min(2, "اسم المنتج مطلوب").max(100, "الاسم طويل جداً"),
  sku: z.string().optional(),
  mainFabricCost: z.number().min(0, "القيمة يجب أن تكون 0 أو أكثر"),
  hasSecondaryFabric: z.boolean(),
  secondaryFabricCost: z.number().min(0).optional(),
  hasScarf: z.boolean(),
  scarfMainFabricCost: z.number().min(0).optional(),
  hasSecondaryScarf: z.boolean(),
  scarfSecondaryFabricCost: z.number().min(0).optional(),
  sewingCost: z.number().min(0),
  packagingCost: z.number().min(0),
  deliveryType: z.enum(["local", "international"]),
  extraExpenses: z.number().min(0).optional(),
  profitMargin: z.number().min(0).max(100),
  targetSegment: z.enum(["economic", "medium", "luxury"])
});

type FormData = z.infer<typeof formSchema>;

// القيم الافتراضية المؤقتة لحين ربط قاعدة البيانات
const TEMP_DEFAULT_SETTINGS = {
  default_profit_margin: 40,
  target_segment: "medium",
  packaging_cost: 25,
  monthly_fixed_costs: 3000,
  // تم تعطيل جلب الإعدادات من قاعدة البيانات مؤقتاً
};

const ProductSection = ({ title, icon: Icon, children }: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
  >
    <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-gray-500" />
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </motion.section>
);

export default function SmartPricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  // تم تعطيل جلب الإعدادات من قاعدة البيانات مؤقتاً
  const [projectSettings] = useState(TEMP_DEFAULT_SETTINGS);
  const supabase = createClientComponentClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profitMargin: TEMP_DEFAULT_SETTINGS.default_profit_margin,
      targetSegment: TEMP_DEFAULT_SETTINGS.target_segment as "economic" | "medium" | "luxury",
      packagingCost: TEMP_DEFAULT_SETTINGS.packaging_cost,
      deliveryType: "local" as const,
      hasSecondaryFabric: false,
      hasScarf: false,
      hasSecondaryScarf: false
    }
  });

  const watchAllFields = watch();

  // تعديل معالجة تقديم النموذج لتكون مؤقتة
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const costs = calculateCosts();
      
      // تم تعطيل حفظ البيانات مؤقتاً
      console.log("بيانات المنتج:", { ...data, costs });
      toast.success("تم معالجة البيانات بنجاح (وضع تجريبي)");
      
      // في الوضع الفعلي سيتم حفظ البيانات في قاعدة البيانات
      /* 
      const { error } = await supabase
        .from('products')
        .insert({
          ...data,
          total_cost: costs.totalCosts,
          final_price: costs.finalPrice,
          created_at: new Date().toISOString()
        });
      */

    } catch (error) {
      console.error("Error processing data:", error);
      toast.error("حدث خطأ أثناء معالجة البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  // تعديل حساب التكاليف ليستخدم القيم المؤقتة
  const calculateCosts = () => {
    const directCosts = [
      Number(watchAllFields.mainFabricCost) || 0,
      watchAllFields.hasSecondaryFabric ? (Number(watchAllFields.secondaryFabricCost) || 0) : 0,
      watchAllFields.hasScarf ? (Number(watchAllFields.scarfMainFabricCost) || 0) : 0,
      watchAllFields.hasSecondaryScarf ? (Number(watchAllFields.scarfSecondaryFabricCost) || 0) : 0,
      Number(watchAllFields.sewingCost) || 0,
      Number(watchAllFields.packagingCost) || 0,
      Number(watchAllFields.extraExpenses) || 0
    ].reduce((a, b) => a + b, 0);

    // استخدام القيمة الافتراضية للتكاليف الثابتة
    const fixedCosts = TEMP_DEFAULT_SETTINGS.monthly_fixed_costs / 30;
    const totalCosts = directCosts + fixedCosts;
    const profitMargin = Number(watchAllFields.profitMargin) || 0;
    const profitAmount = totalCosts * (profitMargin / 100);
    const finalPrice = totalCosts + profitAmount;

    return {
      directCosts,
      fixedCosts,
      totalCosts,
      profitAmount,
      finalPrice,
      suggestedPrice: getSuggestedPrice(totalCosts, watchAllFields.targetSegment)
    };
  };

  // حساب السعر المقترح
  const getSuggestedPrice = (totalCosts: number, segment: string) => {
    const margins = {
      economic: 30,
      medium: 45,
      luxury: 70
    };
    return totalCosts * (1 + (margins[segment as keyof typeof margins] / 100));
  };

  const costs = calculateCosts();

  // تم تعطيل useEffect لجلب الإعدادات
  /* 
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('project_settings')
        .select('*')
        .single();

      if (!error && data) {
        setProjectSettings(data);
      }
    };

    fetchSettings();
  }, []);
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto p-6">
        {/* ترويسة محسنة */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <Calculator className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                التسعير الذكي
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                حساب السعر المثالي لمنتجك بناءً على التكاليف والسوق
              </p>
            </div>
          </div>
          <Button
            type="submit"
            disabled={!isDirty || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="w-4 h-4 ml-2" />
            {isLoading ? "جارٍ الحفظ..." : "حفظ المنتج"}
          </Button>
        </motion.div>

        {/* محتوى النموذج */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* معلومات المنتج */}
            <ProductSection title="معلومات المنتج" icon={Tags}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    اسم المنتج
                  </label>
                  <Input
                    {...register("name")}
                    placeholder="أدخل اسم المنتج"
                    className="w-full"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    رمز المنتج
                  </label>
                  <Input
                    {...register("sku")}
                    placeholder="SKU (اختياري)"
                    className="w-full"
                  />
                </div>
              </div>
            </ProductSection>

            {/* تكاليف الأقمشة */}
            <ProductSection title="تكاليف الأقمشة والخياطة" icon={Calculator}>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      تكلفة القماش الأساسي
                    </label>
                    <Input
                      type="number"
                      {...register("mainFabricCost")}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      تكلفة الخياطة
                    </label>
                    <Input
                      type="number"
                      {...register("sewingCost")}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* القماش الثانوي والطرحة */}
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      إضافة قماش ثانوي
                    </label>
                    <Switch
                      checked={watchAllFields.hasSecondaryFabric}
                      onCheckedChange={(checked) => setValue("hasSecondaryFabric", checked)}
                    />
                  </div>
                  {/* ... المزيد من الحقول ... */}
                </div>
              </div>
            </ProductSection>
          </div>

          {/* ملخص التسعير */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-6 space-y-6"
            >
              <PricingSummary costs={costs} />
              <PricingRecommendations costs={costs} targetSegment={watchAllFields.targetSegment} />
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
}

// مكونات إضافية
interface PricingSummaryProps {
  costs: {
    directCosts: number;
    fixedCosts: number;
    totalCosts: number;
    profitAmount: number;
    finalPrice: number;
    suggestedPrice: number;
  };
}

interface PricingRecommendationsProps {
  costs: PricingSummaryProps['costs'];
  targetSegment: "economic" | "medium" | "luxury";
}

const PricingSummary = ({ costs }: PricingSummaryProps) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
      <h3 className="font-medium text-gray-900">ملخص التكاليف</h3>
    </div>
    <div className="p-6 space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">التكاليف المباشرة</span>
        <span className="font-medium">{costs.directCosts} ريال</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">التكاليف الثابتة</span>
        <span className="font-medium">{costs.fixedCosts} ريال</span>
      </div>
      <div className="flex justify-between text-sm font-medium text-indigo-600">
        <span>السعر النهائي</span>
        <span>{costs.finalPrice} ريال</span>
      </div>
    </div>
  </div>
);

const PricingRecommendations = ({ costs, targetSegment }: PricingRecommendationsProps) => (
  <div className="bg-gradient-to-br from-indigo-50/50 via-white to-indigo-50/50 rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-indigo-100/50">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <h3 className="font-medium text-gray-900">توصيات نَسيق</h3>
      </div>
    </div>
    <div className="p-6">
      {/* ... محتوى التوصيات ... */}
    </div>
  </div>
);