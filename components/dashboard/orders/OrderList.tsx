"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
}

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const supabase = createClientComponentClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, status, total, created_at")
        .eq("user_id", user?.id);

      if (!error && data) setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      {loading ? (
        <p>جارٍ التحميل...</p>
      ) : orders.length === 0 ? (
        <p>لا توجد طلبات بعد.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full text-right text-sm">
            <thead className="bg-gray-100 font-semibold text-gray-700">
              <tr>
                <th className="px-6 py-3 border-b">رقم الطلب</th>
                <th className="px-6 py-3 border-b">الحالة</th>
                <th className="px-6 py-3 border-b">الإجمالي</th>
                <th className="px-6 py-3 border-b">التاريخ</th>
                <th className="px-6 py-3 border-b">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{order.order_number}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-600">{order.total} ريال</td>
                  <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/orders/${order.id}`} className="text-indigo-600 hover:underline">
                      عرض
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
