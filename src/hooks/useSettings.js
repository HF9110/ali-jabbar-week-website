// src/hooks/useSettings.js
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function useSettings() {
  const [settings, setSettings] = useState({});
  useEffect(() => {
    // تم توحيد اسم المستند إلى 'main' ليتوافق مع طريقة الحفظ في Settings.jsx
    const unsub = onSnapshot(doc(db, "contest_settings", "main"), (snap) => {
      setSettings(snap.data() || {});
    });
    return () => unsub();
  }, []);
  return settings;
}
