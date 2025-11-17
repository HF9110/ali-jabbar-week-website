import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

export default function Settings() {
  const [settings, setSettings] = useState({
    stage: "submission",
    end_date: "",
    logo: "",
    title: ""
  });

  useEffect(() => {
    async function fetchSettings() {
      const docRef = doc(db, "contest_settings", "main");
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()) setSettings(docSnap.data());
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    const docRef = doc(db, "contest_settings", "main");
    await setDoc(docRef, settings);
    alert("تم حفظ الإعدادات!");
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl">إعدادات المسابقة</h2>
      <div>
        <label>مرحلة المسابقة</label>
        <select value={settings.stage} onChange={e=>setSettings({...settings, stage:e.target.value})} className="ml-2 p-1 rounded">
          <option value="submission">مرحلة التقديم</option>
          <option value="voting">مرحلة التصويت</option>
        </select>
      </div>
      <div>
        <label>تاريخ انتهاء العد التنازلي</label>
        <input type="date" value={settings.end_date} onChange={e=>setSettings({...settings, end_date:e.target.value})} className="ml-2 p-1 rounded"/>
      </div>
      <div>
        <label>عنوان الموقع</label>
        <input type="text" value={settings.title} onChange={e=>setSettings({...settings, title:e.target.value})} className="ml-2 p-1 rounded"/>
      </div>
      <div>
        <label>رابط الشعار</label>
        <input type="text" value={settings.logo} onChange={e=>setSettings({...settings, logo:e.target.value})} className="ml-2 p-1 rounded"/>
      </div>
      <button onClick={handleSave} className="bg-blue-600 p-2 rounded mt-2 hover:bg-blue-700 w-32">حفظ</button>
    </div>
  );
}
