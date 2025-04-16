"use client";

interface PricingSettingsSectionProps {
  register: any;
  errors: any;
}

export default function PricingSettingsSection({ register, errors }: PricingSettingsSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">إعدادات التسعير</h2>

      <div>
        <label className="block mb-1 font-medium">نسبة الربح (٪)</label>
        <input
          type="number"
          step="0.01"
          {...register("profit_margin")}
          className="w-full border border-gray-300 rounded p-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          سيتم استخدامها تلقائيًا عند تسعير المنتج، ويمكن تعديلها يدويًا.
        </p>
      </div>

      <div>
        <label className="block mb-1 font-medium">الفئة المستهدفة</label>
        <select {...register("target_segment")} className="w-full border border-gray-300 rounded p-2">
          <option value="اقتصادية">اقتصادية</option>
          <option value="يومية">يومية</option>
          <option value="راقية">راقية</option>
          <option value="فاخرة جداً">فاخرة جداً</option>
        </select>
      </div>
    </section>
  );
}