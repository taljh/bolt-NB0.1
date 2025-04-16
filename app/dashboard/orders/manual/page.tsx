"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ManualOrderPage() {
  const [orderData, setOrderData] = useState({
    order_number: "",
    status: "pending",
    total: "",
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("orders").insert({
      ...orderData,
      total: Number(orderData.total),
      user_id: user?.id,
    });

    if (error) {
      setMessage("حدث خطأ أثناء حفظ الطلب.");
    } else {
      setMessage("✅ تم إضافة الطلب بنجاح.");
      setOrderData({ order_number: "", status: "pending", total: "" });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h1 className="text-xl font-bold mb-6">إضافة طلب يدوي</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">رقم الطلب</label>
          <input
            type="text"
            name="order_number"
            value={orderData.order_number}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">الحالة</label>
          <select
            name="status"
            value={orderData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="pending">قيد المعالجة</option>
            <option value="processing">جاري التنفيذ</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">الإجمالي (ريال)</label>
          <input
            type="number"
            name="total"
            value={orderData.total}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#5B5AEC] text-white py-2 rounded hover:bg-[#4a49d1] transition"
        >
          {isSubmitting ? "جاري الحفظ..." : "إضافة الطلب"}
        </button>

        {message && <p className="text-center mt-4 text-sm">{message}</p>}
      </form>
    </div>
  );
}