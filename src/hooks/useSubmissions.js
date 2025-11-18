// src/hooks/useSubmissions.js
import { useEffect, useState } from "react";
// تم التأكد من استيراد الدوال الأساسية المطلوبة للـ Hook
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function useSubmissions(filterType = "approved") {
  const [list, setList] = useState([]);

  useEffect(() => {
    // تم إصلاح الاستيرادات لضمان عمل هذا الـ Hook بشكل صحيح
    const collectionRef = collection(db, "submissions");
    let q = collectionRef;

    // تطبيق الفلترة (المنطق الأصلي للملف)
    if (filterType === "approved") {
      q = query(
        collectionRef,
        where("approved", "==", true),
        orderBy("created_at", "desc")
      );
    } else if (filterType === "pending") {
      q = query(
        collectionRef,
        where("approved", "==", false),
        orderBy("created_at", "desc")
      );
    } else if (filterType === "all") {
      q = query(collectionRef, orderBy("created_at", "desc"));
    }

    const unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach((doc) => arr.push({ id: doc.id, ...doc.data() }));
      setList(arr);
    });

    return () => unsub();
  }, [filterType]);

  return list;
}
