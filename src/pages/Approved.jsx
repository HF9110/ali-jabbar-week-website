import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function Approved() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    async function fetchSubs() {
      const snapshot = await getDocs(collection(db, "submissions"));
      const approved = [];
      snapshot.forEach(d => { if(d.data().approved) approved.push({id:d.id,...d.data()}) });
      setSubs(approved);
    }
    fetchSubs();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "submissions", id));
    setSubs(subs.filter(s=>s.id!==id));
  };

  return (
    <div>
      <h2 className="text-xl mb-4">المشاركات المقبولة</h2>
      <table className="w-full table-auto text-white">
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
                <button onClick={()=>handleDelete(sub.id)} className="bg-red-600 px-2 rounded hover:bg-red-700">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
