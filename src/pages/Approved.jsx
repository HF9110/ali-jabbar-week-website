import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'; // (جديد)
import { db } from "../firebase/firebase.js"; // (تصحيح) إضافة .js
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { Trash2, AlertCircle, Video, Loader2, Edit, PlusCircle } from 'lucide-react';
import { motion } from "framer-motion";
import { arabCountries } from "../utils/countries.js"; // (جديد)

// (جديد) دالة لجلب العلم
const getFlag = (countryName) => {
  const country = arabCountries.find(c => c.name === countryName);
  return country ? country.flag : '🌎';
};

export default function Approved() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = collection(db, "submissions");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const approved = [];
      snapshot.forEach(d => {
        if (d.data().approved) {
          approved.push({ id: d.id, ...d.data() });
        }
      });
      setSubs(approved);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError("حدث خطأ أثناء جلب المشاركات.");
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد أنك تريد حذف هذه المشاركة؟ هذا الإجراء لا يمكن التراجع عنه.")) {
      try {
        await deleteDoc(doc(db, "submissions", id));
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء حذف المشاركة.");
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
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">المشاركات المقبولة</h1>
        <Link 
          to="/admin/dashboard/manage"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow"
        >
          <PlusCircle size={20} />
          إضافة مشاركة جديدة
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-100 p-4 rounded-lg mb-4">
          <AlertCircle /> {error}
        </div>
      )}

      {subs.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-lg shadow border border-gray-200">
          <p className="text-gray-500">لا توجد مشاركات مقبولة حالياً.</p>
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
                <Link 
                  to={`/admin/dashboard/manage/${sub.id}`}
                  className="flex items-center gap-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <Edit size={18} /> تعديل
                </Link>
                <button
                  onClick={() => handleDelete(sub.id)}
                  className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={18} /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}