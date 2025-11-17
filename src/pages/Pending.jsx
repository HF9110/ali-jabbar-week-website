import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function Pending() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    async function fetchSubs() {
      const snapshot = await getDocs(collection(db, "submissions"));
      const pending = [];
      snapshot.forEach(d => { if(!d.data().approved) pending.push({id:d.id,...d.data()}) });
      setSubs(pending);
    }
    fetchSubs();
  }, []);

  const handleApprove = async (id) => {
    const docRef = doc(db, "submissions", id);
    await updateDoc(docRef, { approved: true });
    setSubs(subs.filter(s=>s.id!==id));
  };

  const handleReject = async (id) => {
    await deleteDoc(doc(db, "submissions", id));
    setSubs(subs.filter(s=>s.id!==id));
  };

  return (
    <div>
      <h2 className="text-xl mb-4">المشاركات المعلقة</h2>
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
              <td className="border px-2 flex gap-2">
                <button onClick={()=>handleApprove(sub.id)} className="bg-green-600 px-2 rounded hover:bg-green-700">موافقة</button>
                <button onClick={()=>handleReject(sub.id)} className="bg-red-600 px-2 rounded hover:bg-red-700">رفض</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
