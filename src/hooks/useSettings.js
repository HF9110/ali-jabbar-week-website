// src/hooks/useSettings.js
import { useEffect, useState } from "react";
// تأكيد الاستيرادات الأساسية
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function useSettings() {
  const [settings, setSettings] = useState({});
  useEffect(() => {
    // جلب الإعدادات من المسار الموحد: "contest_settings/main"
    const unsub = onSnapshot(doc(db, "contest_settings", "main"), (snap) => {
      // تعيين قيم افتراضية قوية لمتغيرات الثيم
      const defaultSettings = {
        mainColor: "#d4af37", // اللون الأساسي (الذهبي)
        highlightColor: "#fde047", // لون التوهج
        appFont: "Cairo",
        enableGlass: true,
        stage: "paused",
        title: "مسابقة تيك توك",
        logo: "",
      };
      setSettings({ ...defaultSettings, ...snap.data() });
    });
    return () => unsub();
  }, []);
  return settings;
}
