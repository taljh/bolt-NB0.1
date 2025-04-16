"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ProductInfoSection from "./sections/ProductInfoSection";
import FabricSection from "./sections/FabricSection";
import ScarfSection from "./sections/ScarfSection";
import CostSection from "./sections/CostSection";
import PricingSettingsSection from "./sections/PricingSettingsSection";
import SummarySection from "./sections/SummarySection";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const formSchema = z.object({
  name: z.string().min(2, "اسم المنتج مطلوب"),
  sku: z.string().optional(),
  main_fabric_cost: z.number().min(0).optional(),
  secondary_fabric_cost: z.number().min(0).optional(),
  scarf_main_fabric_cost: z.number().min(0).optional(),
  scarf_secondary_fabric_cost: z.number().min(0).optional(),
  sewing_cost: z.number().min(0).optional(),
  delivery_cost: z.number().min(0).optional(),
  extra_expenses: z.number().min(0).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ProductPricingFormProps {
  initialSettings: {
    packaging_cost?: number;
    profit_margin?: number;
    target_segment?: string;
  };
  initialValues?: Partial<FormData>; // 🆕 إضافتها هنا لتمرير بيانات المنتج للتعديل
  productId?: string; // 🆕 لتحديد إذا كان تعديل
}

export default function ProductPricingForm({ initialSettings, initialValues, productId }: ProductPricingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues, // 🆕 استخدام initialValues هنا
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmissionMessage("");
    setIsError(false);
    const supabase = createClientComponentClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSubmissionMessage("حدث خطأ في التحقق من المستخدم.");
      setIsError(true);
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: data.name,
      sku: data.sku,
      user_id: user.id,
      main_fabric_cost: data.main_fabric_cost ?? 0,
      secondary_fabric_cost: data.secondary_fabric_cost ?? 0,
      scarf_main_fabric_cost: data.scarf_main_fabric_cost ?? 0,
      scarf_secondary_fabric_cost: data.scarf_secondary_fabric_cost ?? 0,
      sewing_cost: data.sewing_cost ?? 0,
      packaging_cost: initialSettings.packaging_cost ?? 0,
      delivery_cost: data.delivery_cost ?? 0,
      extra_expenses: data.extra_expenses ?? 0,
      profit_margin: initialSettings.profit_margin ?? 0,
      target_segment: initialSettings.target_segment ?? "",
    };

    console.log("📦 بيانات الإرسال:", payload);
    console.log("🆔 productId:", productId);

    let error;
    if (productId) {
      console.log("✏️ تعديل منتج");
      const { error: updateError } = await supabase
        .from("products")
        .update(payload)
        .eq("id", productId);
      error = updateError;
    } else {
      console.log("➕ إضافة منتج جديد");
      const { error: insertError } = await supabase
        .from("products")
        .insert(payload);
      error = insertError;
    }

    if (error) {
      console.error("❌ خطأ في Supabase:", error);
      setSubmissionMessage("فشل حفظ المنتج. حاول مرة أخرى.");
      setIsError(true);
    } else {
      setSubmissionMessage("تم حفظ المنتج بنجاح ✅");
      setIsError(false);
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <div className="space-y-8">
        <div className="p-6 rounded-lg bg-gray-50 border border-gray-200 shadow-sm">
          <ProductInfoSection register={register} errors={errors} />
        </div>

        <div className="p-6 rounded-lg bg-gray-50 border border-gray-200 shadow-sm">
          <FabricSection register={register} errors={errors} />
        </div>

        <div className="p-6 rounded-lg bg-gray-50 border border-gray-200 shadow-sm">
          <ScarfSection register={register} errors={errors} />
        </div>

        <div className="p-6 rounded-lg bg-gray-50 border border-gray-200 shadow-sm">
          <CostSection register={register} errors={errors} />
        </div>

        <div className="p-6 rounded-lg bg-gray-50 border border-gray-200 shadow-sm">
          <PricingSettingsSection register={register} errors={errors} />
        </div>

        <div className="p-6 rounded-lg bg-gray-50 border border-gray-200 shadow-sm">
          <SummarySection totalCost={0} finalPrice={0} />
        </div>
      </div>

      <div className="text-center pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#5B5AEC] text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-[#4a49d1] transition-all duration-300 shadow-md hover:shadow-lg"
        >
          {isSubmitting ? "جارٍ الحفظ..." : "حفظ المنتج"}
        </button>
      </div>

      {submissionMessage && (
        <p className={`text-center text-sm mt-4 ${isError ? 'text-red-600' : 'text-green-600'}`}>
          {submissionMessage}
        </p>
      )}
    </form>
  );
}
