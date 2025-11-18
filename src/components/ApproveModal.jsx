// src/components/ApproveModal.jsx
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import { Save, X, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Props:
 * - submission: object
 * - onClose: func
 */
export default function ApproveModal({ submission, onClose }) {
  const defaultThumb = submission?.thumbnail_url || "";
  const [thumbnail, setThumbnail] = useState(defaultThumb);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApprove = async () => {
    setError("");
    if (!thumbnail || !thumbnail.startsWith("http")) {
      setError("الرجاء إدخال رابط صالح للصورة المصغرة يبدأ بـ https:// أو http://");
      return;
    }

    setLoading(true);
    try {
      const ref = doc(db, "submissions", submission.id);
      await updateDoc(ref, {
        approved: true,
        thumbnail_url: thumbnail
      });
      // small delay to let UI update smoothly
      setTimeout(() => {
        setLoading(false);
        onClose && onClose();
      }, 300);
    } catch (err) {
      console.error("Approve failed:", err);
      setError("حدث خطأ أثناء الموافقة. الرجاء المحاولة مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.98 }}
        className="relative w-full max-w-md bg-white/6 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">موافقة ونشر المشاركة</h3>
            <p className="text-sm text-gray-300">اسم الحساب: <strong className="text-white">{submission.name}</strong></p>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-white/5">
            <X className="text-white" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 bg-red-700/20 text-red-200 p-3 rounded">
            <AlertCircle /> <span className="text-sm">{error}</span>
          </div>
        )}

        <label className="block text-sm text-gray-300 mt-4">رابط الصورة المصغرة</label>
        <input
          type="url"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          placeholder="https://..."
          className="mt-2 w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
          disabled={loading}
        />

        {/* معاينة الصورة */}
        <div className="mt-4">
          <p className="text-xs text-gray-300 mb-2">معاينة:</p>
          <div className="w-full h-40 rounded-lg overflow-hidden bg-black/20 border border-white/5 flex items-center justify-center">
            {thumbnail ? (
              // img onError fallback to placeholder
              <img src={thumbnail} alt="thumbnail preview" className="w-full h-full object-cover" onError={(e)=>{ e.target.onerror=null; e.target.src='https://placehold.co/400x600/000000/FFFFFF?text=No+Image'; }} />
            ) : (
              <div className="text-gray-400">لا توجد صورة لعرضها</div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} disabled={loading} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white">
            إلغاء
          </button>
          <button onClick={handleApprove} disabled={loading} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={16} />} موافقة ونشر
          </button>
        </div>
      </motion.div>
    </div>
  );
}
