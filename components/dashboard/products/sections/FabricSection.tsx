"use client";

import { UseFormRegister } from "react-hook-form";
import { FormData } from "../ProductPricingForm"; // Adjust path if needed

interface FabricSectionProps {
  register: UseFormRegister<FormData>;
  errors: any;
}

export default function FabricSection({ register, errors }: FabricSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">تفاصيل القماش</h2>

      <div>
        <label className="block mb-1 font-medium">تكلفة القماش الأساسي</label>
        <input
          type="number"
          step="0.01"
          {...register("main_fabric_cost", { valueAsNumber: true })}
          className="w-full border border-gray-300 rounded p-2"
        />
        {errors.main_fabric_cost && (
          <p className="text-red-500 text-sm mt-1">{errors.main_fabric_cost.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">تكلفة القماش الثانوي (اختياري)</label>
        <input
          type="number"
          step="0.01"
          {...register("secondary_fabric_cost", { valueAsNumber: true })}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
    </section>
  );
}