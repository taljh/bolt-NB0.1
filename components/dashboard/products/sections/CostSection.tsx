"use client";

interface CostSectionProps {
  register: any;
  errors: any;
}

export default function CostSection({ register, errors }: CostSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">التكاليف الإضافية</h2>

      <div>
        <label className="block mb-1 font-medium">تكلفة التغليف</label>
        <input
          type="number"
          step="0.01"
          {...register("packaging_cost")}
          className="w-full border border-gray-300 rounded p-2"
        />
        {errors.packaging_cost && (
          <p className="text-red-500 text-sm mt-1">{errors.packaging_cost.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">تكلفة التوصيل الداخلي</label>
        <input
          type="number"
          step="0.01"
          {...register("delivery_cost", { valueAsNumber: true })}
          className="w-full border border-gray-300 rounded p-2"
        />
        {errors.delivery_cost && (
          <p className="text-red-500 text-sm mt-1">{errors.delivery_cost.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">مصاريف إضافية</label>
        <input
          type="number"
          step="0.01"
          {...register("sewing_cost", { valueAsNumber: true })}
          className="w-full border border-gray-300 rounded p-2"
        />
        {errors.extra_cost && (
          <p className="text-red-500 text-sm mt-1">{errors.extra_cost.message}</p>
        )}
      </div>
    </section>
  );
}