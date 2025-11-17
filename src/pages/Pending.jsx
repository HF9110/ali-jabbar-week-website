import { useEffect, useState } from "react";
// --- المسار الصحيح: مع لاحقة لملف js ---
import { db } from "../firebase/firebase.js";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function Pending() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ... باقي الكود ...
  // (الكود الداخلي للمكون لم يتغير)
  // ... (Gist: fetches pending submissions, allows approve/reject)

  useEffect(() => {
    async function fetchSubs() {
      try {
        const snapshot = await getDocs(collection(db, "submissions"));
        const pending = [];
        snapshot.forEach(d => {
          if (!d.data().approved) pending.push({ id: d.id, ...d.data() });
        });
        setSubs(pending);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("حدث خطأ أثناء جلب المشاركات.");
      } finally {
        setLoading(false);
      }
    }
    fetchSubs();
  }, []);

  const handleApprove = async (id) => {
    try {
      const docRef = doc(db, "submissions", id);
      await updateDoc(docRef, { approved: true });
      setSubs(subs.filter(s => s.id !== id));
    } catch (err) {
      console.error("Failed to approve:", err);
      setError("فشل في الموافقة على المشاركة.");
    }
  };

  const handleReject = async (id) => {
    try {
      await deleteDoc(doc(db, "submissions", id));
      setSubs(subs.filter(s => s.id !== id));
    } catch (err) {
      console.error("Failed to reject:", err);
      setError("فشل في رفض المشاركة.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <p>جاري تحميل المشاركات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (subs.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <p>لا توجد مشاركات معلقة حالياً.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4 text-white">المشاركات المعلقة</h2>
      <table className="w-full table-auto text-white border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1">الاسم</th>
            <th className="border px-2 py-1">البلد</th>
            <th className="border px-2 py-1">حساب تيك توك</th>
            <th className="border px-2 py-1">أفعال</th>
          </tr>
        </thead>
        <tbody>
          {subs.map(sub => (
            <tr key={sub.id}>
              <td className="border px-2 py-1">{sub.name}</td>
              <td className="border px-2 py-1">{sub.country}</td>
              <td className="border px-2 py-1">{sub.tiktok}</td>
              <td className="border px-2 py-1 flex gap-2">
                <button
                  onClick={() => handleApprove(sub.id)}
                  className="bg-green-600 px-2 rounded hover:bg-green-700"
                >
                  موافقة
                </button>
                <button
                  onClick={() => handleReject(sub.id)}
                  className="bg-red-600 px-2 rounded hover:bg-red-700"
                >
                  رفض
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}