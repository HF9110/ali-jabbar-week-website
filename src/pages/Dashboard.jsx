// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { CheckCircle, Clock, TrendingUp, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [votes, setVotes] = useState(0);

  useEffect(() => {
    // جلب إحصائيات المشاركات من Firestore
    const unsub = onSnapshot(collection(db, "submissions"), (snap) => {
      let _pending = 0,
        _approved = 0,
        _votes = 0;

      snap.forEach((doc) => {
        const d = doc.data();
        if (d.approved) _approved++;
        else _pending++;

        _votes += d.votes || 0;
      });

      setPending(_pending);
      setApproved(_approved);
      setVotes(_votes);
    });

    return () => unsub();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto p-6 text-white"
    >
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        {/* أيقونة العنوان تستخدم اللون الذهبي الديناميكي */}
        <LayoutDashboard size={28} className="text-[var(--color-highlight)]" />
        الإحصائيات العامة
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Pending Card (Glassmorphism) */}
        <div className="p-6 glass-card rounded-xl border border-white/10 shadow-xl flex items-center gap-4">
          <Clock className="text-yellow-400" size={36} />
          <div>
            <p className="text-gray-400 text-sm">مشاركات معلقة</p>
            <h2 className="text-3xl font-bold text-white">{pending}</h2>
          </div>
        </div>

        {/* Approved Card (Glassmorphism) */}
        <div className="p-6 glass-card rounded-xl border border-white/10 shadow-xl flex items-center gap-4">
          <CheckCircle className="text-green-400" size={36} />
          <div>
            <p className="text-gray-400 text-sm">مشاركات مقبولة</p>
            <h2 className="text-3xl font-bold text-white">{approved}</h2>
          </div>
        </div>

        {/* Votes Card (Glassmorphism) */}
        <div className="p-6 glass-card rounded-xl border border-white/10 shadow-xl flex items-center gap-4">
          <TrendingUp className="text-blue-400" size={36} />
          <div>
            <p className="text-gray-400 text-sm">إجمالي الأصوات</p>
            <h2 className="text-3xl font-bold text-white">{votes}</h2>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
