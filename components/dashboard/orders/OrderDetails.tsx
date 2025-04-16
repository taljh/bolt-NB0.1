"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface OrderDetailsProps {
  id: string;
}

export default function OrderDetails() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", params.id)
        .single();

      if (!error) setOrder(data);
      setLoading(false);
    };

    fetchOrder();
  }, [params.id]);

  if (loading) return <p>جارٍ تحميل تفاصيل الطلب...</p>;
  if (!order) return <p>لم يتم العثور على الطلب.</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">تفاصيل الطلب #{order.order_number}</h2>
      <p><span className="font-semibold">الحالة:</span> {order.status}</p>
      <p><span className="font-semibold">الإجمالي:</span> {order.total} ريال</p>
      <p><span className="font-semibold">تاريخ الطلب:</span> {new Date(order.created_at).toLocaleDateString()}</p>

      {/* أضف المزيد من التفاصيل هنا لاحقًا */}
    </div>
  );
}
