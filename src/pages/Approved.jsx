import { useEffect, useState } from "react";
// المسار الصحيح: الخروج من 'pages'
import { db } from "../firebase/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function Approved() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSubs() {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "submissions"));
        const approved = [];
        snapshot.forEach(d => {
          if (d.data().approved) approved.push({ id: d.id, ...d.data() });
        });
        setSubs(approved);
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء جلب المشاركات.");
      } finally {
        setLoading(false);
      }
    }
    fetchSubs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "submissions", id));
      setSubs(subs.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء حذف المشاركة.");
    }
  };

  if (loading) return <p>جارٍ التحميل...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!subs.length) return <p>لا توجد مشاركات مقبولة حالياً.</p>;

  return (
    <div>
      <h2 className="text-xl mb-4">المشاركات المقبولة</h2>
      <table className="w-full table-auto text-white border-collapse">
        <thead>
          <tr>
            <th className="border px-2">الاسم</th>
            <th className="border px-2">البلد</th>
            <th className="border px-2">حساب تيك توك</th>
            <th className="border px-2">أفعال</th>
          </tr>
        </thead>
        <tbody>
          {subs.map(sub => (
            <tr key={sub.id}>
              <td className="border px-2">{sub.name}</td>
              <td className="border px-2">{sub.country}</td>
              <td className="border px-2">{sub.tiktok}</td>
              <td className="border px-2">
                <button
                  onClick={() => handleDelete(sub.id)}
                  className="bg-red-600 px-2 rounded hover:bg-red-700"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}