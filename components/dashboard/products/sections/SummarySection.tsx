"use client";

interface SummarySectionProps {
  totalCost?: number;
  finalPrice?: number;
}

export default function SummarySection({ totalCost = 0, finalPrice = 0 }: SummarySectionProps) {
  return (
    <section className="space-y-4 border-t pt-6 mt-6">
      <h2 className="text-lg font-semibold">الملخص</h2>

      <p className="text-gray-700">إجمالي التكاليف: <span className="font-bold">{totalCost} ريال</span></p>
      <p className="text-gray-700">سعر البيع النهائي: <span className="font-bold text-[#5B5AEC]">{finalPrice} ريال</span></p>
    </section>
  );
}