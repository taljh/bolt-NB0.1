import { notFound } from "next/navigation";

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  if (!params.id) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">تفاصيل الطلب رقم {params.id}</h1>
      {/* مستقبلاً: هنا يتم جلب بيانات الطلب من قاعدة البيانات وعرضها */}
      <p className="text-gray-600">هنا سيتم عرض تفاصيل الطلب بشكل كامل بناءً على رقم الطلب.</p>
    </div>
  );
}