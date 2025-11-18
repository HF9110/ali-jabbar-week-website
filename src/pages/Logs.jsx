// src/pages/Logs.jsx
import React, { useEffect, useState } from "react";
// تم التأكد من استيراد الدوال كاملة وصحيحة
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import { downloadCSV, toCSV } from "../lib/helpers.js";
import { motion } from "framer-motion";
import { FileText, Loader2, AlertCircle } from "lucide-react";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // استخدام دالة query المستوردة بشكل صريح
    const q = query(
      collection(db, "vote_logs"),
      orderBy("timestamp", "desc"),
      limit(200)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr = [];
        snap.forEach((doc) => arr.push({ id: doc.id, ...doc.data() }));
        setLogs(arr);
        setLoading(false);
      },
      (err) => {
        console.error("logs onSnapshot error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const exportAll = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "vote_logs"),
        orderBy("timestamp", "desc")
      );
      const snap = await getDocs(q);
      const arr = [];
      snap.forEach((d) => {
        const data = d.data();
        arr.push({
          id: d.id,
          submissionId: data.submissionId || "",
          voterId: data.voterId || "",
          userAgent: data.userAgent || "",
          method: data.method || "",
          timestamp: data.timestamp
            ? data.timestamp.toDate().toISOString()
            : "",
        });
      });

      const csv = toCSV(arr, [
        { key: "id", label: "id" },
        { key: "submissionId", label: "submissionId" },
        { key: "voterId", label: "voterId" },
        { key: "userAgent", label: "userAgent" },
        { key: "method", label: "method" },
        { key: "timestamp", label: "timestamp" },
      ]);
      downloadCSV(
        `vote_logs_${new Date().toISOString().slice(0, 19)}.csv`,
        csv
      );
    } catch (err) {
      console.error(err);
      alert("فشل تصدير السجلات.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin text-[#d4af37]" size={36} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6 text-white"
    >
      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText size={24} className="text-[#fde047]" />
          سجل التصويت
        </h1>
        <button
          onClick={exportAll}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          <FileText size={18} /> تصدير CSV
        </button>
      </div>

      <div className="bg-black/40 glass-card rounded-xl border border-white/10 overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left bg-white/10">
            <tr>
              <th className="p-3">الوقت</th>
              <th className="p-3">submissionId</th>
              <th className="p-3">voterId</th>
              <th className="p-3">userAgent</th>
              <th className="p-3">method</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr
                key={l.id}
                className="border-t border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-3">
                  {l.timestamp
                    ? l.timestamp.toDate
                      ? l.timestamp.toDate().toLocaleString()
                      : new Date(l.timestamp).toLocaleString()
                    : "-"}
                </td>
                <td className="p-3">{l.submissionId}</td>
                <td className="p-3">{l.voterId}</td>
                <td className="p-3 truncate max-w-xs">{l.userAgent}</td>
                <td className="p-3">{l.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
