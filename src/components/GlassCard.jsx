import { useState } from "react";
// --- المسار الصحيح: مع لاحقة لملف js ---
import { db } from "../firebase/firebase.js";
import { collection, addDoc } from "firebase/firestore";

export default function GlassCard() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !country || !tiktok) return;
    try {
      await addDoc(collection(db, "submissions"), {
        name,
        country,
        tiktok,
        votes: 0,
        approved: false
      });
      setSuccess("تم ارسال مشاركتك!");
      setName(""); setCountry(""); setTiktok("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl w-96 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-white mb-2">شارك الآن!</h2>
      {success && <p className="text-green-400">{success}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="text" placeholder="الاسم" className="p-2 rounded" value={name} onChange={e=>setName(e.target.value)} />
        <input type="text" placeholder="البلد" className="p-2 rounded" value={country} onChange={e=>setCountry(e.target.value)} />
        <input type="text" placeholder="حساب تيك توك" className="p-2 rounded" value={tiktok} onChange={e=>setTiktok(e.target.value)} />
        <button type="submit" className="bg-blue-600 p-2 rounded mt-2 hover:bg-blue-700">إرسال</button>
      </form>
    </div>
  );
}