"use client";

import { useState } from "react";

interface Props {
  userId: string;
}

export default function SettingsForm({ userId }: Props) {
  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "",
    targetAudience: "",
    expectedSales: "",
    defaultProfitMargin: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      projectName: "",
      projectType: "",
      targetAudience: "",
      expectedSales: "",
      defaultProfitMargin: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/project-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...formData }),
      });

      if (!res.ok) throw new Error("فشل حفظ الإعدادات");

      alert("تم حفظ الإعدادات بنجاح");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border border-gray-200 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">إعدادات المشروع</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">اسم المشروع</label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
            placeholder="مثل: راز"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">نوع النشاط</label>
          <select
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
          >
            <option value="">اختر...</option>
            <option value="عبايات">عبايات</option>
            <option value="فساتين">فساتين</option>
            <option value="جلابيات">جلابيات</option>
            <option value="غيره">غيره</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">الفئة المستهدفة</label>
          <select
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
          >
            <option value="">اختر...</option>
            <option value="اقتصادية">اقتصادية</option>
            <option value="يومية">يومية</option>
            <option value="راقية">راقية</option>
            <option value="فاخرة جداً">فاخرة جداً</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">عدد المبيعات المتوقعة شهرياً</label>
          <input
            type="number"
            name="expectedSales"
            value={formData.expectedSales}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
            placeholder="مثال: 100"
          />
        </div>

        <div className="col-span-full">
          <label className="block text-sm text-gray-600 mb-1">نسبة الربح الافتراضية (%)</label>
          <input
            type="number"
            name="defaultProfitMargin"
            value={formData.defaultProfitMargin}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
            placeholder="مثال: 25"
          />
          <p className="text-xs text-gray-500 mt-1">
            سيتم احتسابها افتراضياً عند تسعير منتج جديد، ويمكن تعديلها يدوياً.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <button
          type="submit"
          className="bg-[#5B5AEC] text-white px-6 py-2 rounded-lg hover:bg-[#4a4adc] transition text-sm font-medium"
        >
          حفظ الإعدادات
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-200 transition text-sm"
        >
          استعادة الإعدادات الافتراضية
        </button>
      </div>
    </form>
  );
}