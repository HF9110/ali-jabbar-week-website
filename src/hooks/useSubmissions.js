// src/hooks/useSubmissions.js
import { useEffect, useState } from "react";
// يجب استيراد جميع الدوال صراحة لحل TypeError
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
    const collectionRef = collection(db, "submissions");
    // تعيين ترتيب افتراضي لكل الاستعلامات
    let q = query(collectionRef, orderBy("created_at", "desc"));

    // تطبيق الفلترة (المنطق الأصلي للملف)
    if (filterType === "approved") {
      // الاستعلام الذي يتطلب فهرسة
      q = query(
        collectionRef,
        where("approved", "==", true),
        orderBy("created_at", "desc")
      );
    } else if (filterType === "pending") {
      // الاستعلام الذي يتطلب فهرسة
      q = query(
        collectionRef,
        where("approved", "==", false),
        orderBy("created_at", "desc")
      );
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
