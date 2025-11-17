import { useEffect, useState } from "react";
import { db } from "../firebase/firebase.js"; // (تصحيح) إضافة .js
import { collection, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { Check, Trash2, AlertCircle, Video, Loader2, Edit } from 'lucide-react';
import { motion } from "framer-motion";
import { arabCountries } from "../utils/countries.js"; // (جديد)
import { Link } from 'react-router-dom';
import ApproveModal from '../components/ApproveModal.jsx'; // (جديد) استيراد النافذة

// (جديد) دالة لجلب العلم
const getFlag = (countryName) => {
  const country = arabCountries.find(c => c.name === countryName);
  return country ? country.flag : '🌎';
};

export default function Pending() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // (جديد) حالات للنافذة
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  useEffect(() => {
    const q = collection(db, "submissions");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pending = [];
      snapshot.forEach(d => {
        if (!d.data().approved) {
          pending.push({ id: d.id, ...d.data() });
        }
      });
      setSubs(pending);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching submissions:", err);
      setError("حدث خطأ أثناء جلب المشاركات.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // (جديد) فتح النافذة عند الضغط على "موافقة"
  const openApproveModal = (submission) => {
    setSelectedSub(submission);
    setIsModalOpen(true);
  };

  const handleReject = async (id) => {
    if (window.confirm("هل أنت متأكد أنك تريد حذف هذه المشاركة؟")) {
      try {
        await deleteDoc(doc(db, "submissions", id));
      } catch (err) {
        console.error("Failed to reject:", err);
        setError("فشل في رفض المشاركة.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">المشاركات المعلقة</h1>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-100 p-4 rounded-lg mb-4">
          <AlertCircle /> {error}
        </div>
      )}

      {subs.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-lg shadow border border-gray-200">
          <p className="text-gray-500">لا توجد مشاركات معلقة حالياً.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {subs.map(sub => (
            <div key={sub.id} className="bg-white p-5 rounded-lg shadow border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{sub.name}</h3>
                {sub.country && (
                  <p className="text-gray-600 flex items-center gap-2">{getFlag(sub.country)} {sub.country}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {(Array.isArray(sub.links) ? sub.links : [sub.tiktok]).map((link, i) => (
                    <a 
                      key={i}
                      href={link.includes('http') ? link : `https://www.tiktok.com/@${link}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                    >
                      <Video size={14} /> رابط {i + 1}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openApproveModal(sub)} // (جديد)
                  className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check size={18} /> موافقة
                </button>
                <Link 
                  to={`/admin/dashboard/manage/${sub.id}`}
                  className="flex items-center gap-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <Edit size={18} /> تعديل
                </Link>
                <button
                  onClick={() => handleReject(sub.id)}
                  className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={18} /> رفض
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* (جديد) عرض النافذة عند الطلب */}
      {isModalOpen && selectedSub && (
        <ApproveModal 
          submission={selectedSub}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </motion.div>
  );
}