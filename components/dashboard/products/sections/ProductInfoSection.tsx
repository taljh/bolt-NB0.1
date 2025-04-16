"use client";

interface ProductInfoSectionProps {
  register: any;
  errors: any;
}

export default function ProductInfoSection({ register, errors }: ProductInfoSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">معلومات المنتج</h2>

      <div>
        <label className="block mb-1 font-medium">اسم المنتج</label>
        <input
          type="text"
          {...register("name")}
          className="w-full border border-gray-300 rounded p-2"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">رمز المنتج (اختياري)</label>
        <input
          type="text"
          {...register("sku")}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
    </section>
  );
}