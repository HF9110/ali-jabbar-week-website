// src/pages/Approved.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import {
  Loader2,
  Trash2,
  Edit,
  PlusCircle,
  Video,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { arabCountries } from "../utils/countries.js";
import { motion } from "framer-motion";

const getFlag = (countryName) => {
  const c = arabCountries.find((x) => x.name === countryName);
  return c ? c.flag : "🌎";
};

export default function Approved() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = collection(db, "submissions");
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const arr = [];
        snapshot.forEach((d) => {
          const data = d.data();
          if (data.approved) arr.push({ id: d.id, ...data });
        });
        setSubs(arr);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("فشل جلب المشاركات.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف المشاركة نهائياً؟")) return;
    try {
      await deleteDoc(doc(db, "submissions", id));
    } catch (err) {
      console.error("Delete failed:", err);
      setError("فشل حذف المشاركة.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="animate-spin text-[#d4af37]" size={40} />
      </div>
    );

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-6 p-6 text-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CheckCircle size={24} className="text-[#d4af37]" />
          المشاركات المقبولة
        </h1>
        <Link
          to="/admin/dashboard/manage"
          className="bg-[#d4af37] px-4 py-2 rounded text-gray-900 font-semibold flex items-center gap-2 hover:bg-[#fde047] transition-colors"
        >
          <PlusCircle /> إضافة جديدة
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-700/10 text-red-300 rounded border border-red-700">
          {error}
        </div>
      )}

      {subs.length === 0 ? (
        <div className="p-8 glass-card rounded-xl text-gray-400 border border-white/10">
          لا توجد مشاركات مقبولة حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {subs.map((s) => (
            <div
              key={s.id}
              className="glass-card p-4 rounded-xl flex items-center justify-between border border-white/10 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={s.thumbnail_url}
                  alt={s.name}
                  className="w-16 h-16 object-cover rounded-lg border border-white/20"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/100x100/121212/AAA?text=Video";
                  }}
                />
                <div>
                  <h3 className="text-white font-semibold">{s.name}</h3>
                  {s.country && (
                    <p className="text-sm text-gray-400">
                      {getFlag(s.country)} {s.country}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    {(Array.isArray(s.links) ? s.links : [s.tiktok]).map(
                      (l, i) => (
                        <a
                          key={i}
                          href={l}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm bg-white/10 px-3 py-1 rounded flex items-center gap-2 hover:bg-white/20 transition-colors"
                        >
                          <Video size={14} className="text-gray-400" /> رابط{" "}
                          {i + 1}
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/admin/dashboard/manage/${s.id}`}
                  className="bg-yellow-600 px-3 py-2 rounded text-white flex items-center gap-2 hover:bg-yellow-700 transition-colors"
                >
                  <Edit size={16} /> تعديل
                </Link>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-600 px-3 py-2 rounded text-white flex items-center gap-2 hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
