// src/hooks/useSettings.js
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function useSettings() {
  const [settings, setSettings] = useState({});
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "config", "settings"), snap => {
      setSettings(snap.data() || {});
    });
    return () => unsub();
  }, []);
  return settings;
}
