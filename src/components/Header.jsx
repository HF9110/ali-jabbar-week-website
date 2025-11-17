import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase.js'; // (تصحيح) إضافة .js

export default function Header() {
  const [settings, setSettings] = useState({ title: 'مسابقة', logo: '' });

  // جلب الإعدادات بشكل فوري
  useEffect(() => {
    const docRef = doc(db, "contest_settings", "main");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="w-full max-w-6xl mx-auto p-4 flex justify-between items-center">
      <h1 className="text-2xl md:text-3xl font-bold text-white">
        {settings.title || 'مسابقة تيك توك'}
      </h1>
      {settings.logo && (
        <img 
          src={settings.logo} 
          alt="Logo" 
          className="h-12 md:h-16 max-w-[200px] object-contain"
          onError={(e) => e.target.style.display = 'none'} // إخفاء الصورة إذا فشل التحميل
        />
      )}
    </header>
  );
}