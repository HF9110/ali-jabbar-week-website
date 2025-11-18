// src/pages/Approved.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import { Loader2, Trash2, Edit, PlusCircle, Video, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { arabCountries } from "../utils/countries.js";
import { motion } from "framer-motion";

const getFlag = (countryName) => {
  const c = arabCountries.find(x => x.name === countryName);
  return c ? c.flag : "🌎";
};

export default function Approved() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = collection(db, "submissions");
    const unsubscribe = onSnapshot(q, snapshot => {
      const arr = [];
      snapshot.forEach(d => {
        const data = d.data();
        if (data.approved) arr.push({ id: d.id, ...data });
      });
      setSubs(arr);
      setLoading(false);
    }, err => {
      console.error(err);
      setError("فشل جلب المشاركات.");
      setLoading(false);
    });
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

  if (loading) return <div className="flex items-center justify-center p-10"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <motion.div className="max-w-6xl mx-auto space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">المشاركات المقبولة</h1>
        <Link to="/admin/dashboard/manage" className="bg-blue-600 px-4 py-2 rounded text-white flex items-center gap-2"><PlusCircle /> إضافة</Link>
      </div>

      {error && <div className="p-3 bg-red-700/10 text-red-200 rounded">{error}</div>}

      {subs.length === 0 ? (
        <div className="p-8 bg-white/5 rounded text-gray-300">لا توجد مشاركات قبول حالياً.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {subs.map(s => (
            <div key={s.id} className="bg-white/6 p-4 rounded flex items-center justify-between border border-white/6">
              <div>
                <h3 className="text-white font-semibold">{s.name}</h3>
                {s.country && <p className="text-sm text-gray-300">{getFlag(s.country)} {s.country}</p>}
                <div className="flex gap-2 mt-2">
                  {(Array.isArray(s.links) ? s.links : [s.tiktok]).map((l,i)=>(
                    <a key={i} href={l} target="_blank" rel="noreferrer" className="text-sm bg-white/5 px-3 py-1 rounded flex items-center gap-2"><Video /> رابط {i+1}</a>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/dashboard/manage/${s.id}`} className="bg-yellow-500 px-3 py-2 rounded text-white flex items-center gap-2"><Edit /> تعديل</Link>
                <button onClick={() => handleDelete(s.id)} className="bg-red-600 px-3 py-2 rounded text-white flex items-center gap-2"><Trash2 /> حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
