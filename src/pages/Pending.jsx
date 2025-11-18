// src/pages/Pending.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import { Loader2, AlertCircle, Trash2, Check, Edit } from "lucide-react";
import { motion } from "framer-motion";
import ApproveModal from "../components/ApproveModal.jsx";
import { Link } from "react-router-dom";
import { arabCountries } from "../utils/countries.js";

const getFlag = (countryName) => {
  const c = arabCountries.find(x => x.name === countryName);
  return c ? c.flag : "🌎";
};

export default function Pending() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const q = collection(db, "submissions");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pending = [];
      snapshot.forEach(d => {
        const data = d.data();
        if (!data.approved) pending.push({ id: d.id, ...data });
      });
      setSubs(pending);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError("فشل جلب المشاركات.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openApprove = (sub) => {
    setSelected(sub);
    setIsModalOpen(true);
  };

  const handleReject = async (id) => {
    if (!window.confirm("هل أنت متأكد من رفض (حذف) المشاركة؟")) return;
    try {
      await deleteDoc(doc(db, "submissions", id));
    } catch (err) {
      console.error("Reject failed:", err);
      setError("فشل في حذف المشاركة.");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-10"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  }

  return (
    <motion.div className="max-w-5xl mx-auto space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-4">المشاركات المعلقة</h1>

      {error && <div className="p-3 bg-red-700/10 text-red-200 rounded">{error}</div>}

      {subs.length === 0 ? (
        <div className="p-8 bg-white/5 rounded text-gray-300">لا توجد مشاركات معلقة حالياً.</div>
      ) : (
        <div className="space-y-4">
          {subs.map(s => (
            <div key={s.id} className="bg-white/6 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{s.name}</h3>
                {s.country && <p className="text-sm text-gray-300">{getFlag(s.country)} {s.country}</p>}
                <div className="flex gap-2 mt-3 flex-wrap">
                  {(Array.isArray(s.links) ? s.links : [s.tiktok]).map((l,i) => (
                    <a key={i} href={l} target="_blank" rel="noopener noreferrer" className="text-sm bg-white/5 px-3 py-1 rounded">{`رابط ${i+1}`}</a>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openApprove(s)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white flex items-center gap-2"><Check /> موافقة</button>
                <Link to={`/admin/dashboard/manage/${s.id}`} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white flex items-center gap-2"><Edit /> تعديل</Link>
                <button onClick={() => handleReject(s.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white flex items-center gap-2"><Trash2 /> حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selected && (
        <ApproveModal submission={selected} onClose={() => { setIsModalOpen(false); setSelected(null); }} />
      )}
    </motion.div>
  );
}
