"use client";

interface ScarfSectionProps {
  register: any;
  errors: any;
}

export default function ScarfSection({ register, errors }: ScarfSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">تفاصيل الطرحة</h2>

      <div>
        <label className="block mb-1 font-medium">هل تحتوي على طرحة؟</label>
        <select defaultValue="" {...register("has_scarf")} className="w-full border border-gray-300 rounded p-2">
          <option value="no">لا</option>
          <option value="yes">نعم</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">تكلفة قماش الطرحة الأساسي</label>
        <input
          defaultValue=""
          type="number"
          step="0.01"
          {...register("scarf_main_fabric_cost", { valueAsNumber: true })}
          className="w-full border border-gray-300 rounded p-2"
        />
        {errors.scarf_main_fabric_cost && (
          <p className="text-red-500 text-sm mt-1">{errors.scarf_main_fabric_cost.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">تكلفة قماش الطرحة الثانوي (اختياري)</label>
        <input
          defaultValue=""
          type="number"
          step="0.01"
          {...register("scarf_secondary_fabric_cost", { valueAsNumber: true })}
          className="w-full border border-gray-300 rounded p-2"
        />
        {errors.scarf_secondary_fabric_cost && (
          <p className="text-red-500 text-sm mt-1">{errors.scarf_secondary_fabric_cost.message}</p>
        )}
      </div>
    </section>
  );
}