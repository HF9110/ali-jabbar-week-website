import { useEffect, useState } from "react";
// المسار الصحيح: الخروج من 'pages'
import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Settings() {
  const [settings, setSettings] = useState({
    stage: "submission",
    end_date: "",
    logo: "",
    title: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, "contest_settings", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data());
        } else {
          console.warn("Document contest_settings/main not found!");
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError("حدث خطأ أثناء جلب الإعدادات.");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const docRef = doc(db, "contest_settings", "main");
      await setDoc(docRef, settings);
      alert("تم حفظ الإعدادات!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("فشل في حفظ الإعدادات.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <p>جاري تحميل الإعدادات...</p>
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

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl text-white">إعدادات المسابقة</h2>
      <div>
        <label className="text-white">مرحلة المسابقة</label>
        <select
          value={settings.stage}
          onChange={e => setSettings({ ...settings, stage: e.target.value })}
          className="ml-2 p-1 rounded"
        >
          <option value="submission">مرحلة التقديم</option>
          <option value="voting">مرحلة التصويت</option>
        </select>
      </div>
      <div>
        <label className="text-white">تاريخ انتهاء العد التنازلي</label>
        <input
          type="date"
          value={settings.end_date}
          onChange={e => setSettings({ ...settings, end_date: e.target.value })}
          className="ml-2 p-1 rounded"
        />
      </div>
      <div>
        <label className="text-white">عنوان الموقع</label>
        <input
          type="text"
          value={settings.title}
          onChange={e => setSettings({ ...settings, title: e.target.value })}
          className="ml-2 p-1 rounded"
        />
      </div>
      <div>
        <label className="text-white">رابط الشعار</label>
        <input
          type="text"
          value={settings.logo}
          onChange={e => setSettings({ ...settings, logo: e.target.value })}
          className="ml-2 p-1 rounded"
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-600 p-2 rounded mt-2 hover:bg-blue-700 w-32"
      >
        حفظ
      </button>
    </div>
  );
}