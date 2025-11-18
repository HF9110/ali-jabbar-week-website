// src/pages/FAQ.jsx
import React from "react";

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">الأسئلة الشائعة</h1>

      <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl border mb-4">
        <h2 className="text-xl font-bold mb-2">هل يمكن التصويت أكثر من مرة؟</h2>
        <p className="text-gray-300">يمكنك التصويت مرة واحدة فقط لكل مستخدم.</p>
      </div>

      <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl border mb-4">
        <h2 className="text-xl font-bold mb-2">كيف يتم حساب النتائج؟</h2>
        <p className="text-gray-300">يتم احتساب النتائج بناءً على عدد الأصوات فقط.</p>
      </div>

      <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl border mb-4">
        <h2 className="text-xl font-bold mb-2">هل يمكن إضافة فيديو جديد؟</h2>
        <p className="text-gray-300">نعم، التقديم مفتوح عبر صفحة المشاركة.</p>
      </div>
    </div>
  );
}
