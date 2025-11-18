// src/pages/FAQ.jsx
import React from "react";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function FAQ() {
  const faqItems = [
    {
      title: "هل يمكن التصويت أكثر من مرة؟",
      content: "يمكنك التصويت مرة واحدة فقط لكل مستخدم.",
    },
    {
      title: "كيف يتم حساب النتائج؟",
      content: "يتم احتساب النتائج بناءً على عدد الأصوات فقط.",
    },
    {
      title: "هل يمكن إضافة فيديو جديد؟",
      content: "نعم، التقديم مفتوح عبر صفحة المشاركة.",
    },
  ];

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-4xl font-extrabold text-white mb-10 text-center">
        <span className="text-[#fde047]">الأسئلة</span> الشائعة
      </h1>

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="glass-card p-6 rounded-xl border border-white/10 shadow-lg"
          >
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <HelpCircle size={20} className="text-[#d4af37]" />
              {item.title}
            </h2>
            <p className="text-gray-300 pr-7">{item.content}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
