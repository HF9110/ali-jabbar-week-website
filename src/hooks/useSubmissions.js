// src/hooks/useSubmissions.js
import { useEffect, useState } from "react";
// إضافة 'query' هنا غير ضرورية لكن تم التأكد من الاستيرادات الأساسية
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function useSubmissions(filterType = "approved") {
  const [list, setList] = useState([]);

  useEffect(() => {
    // التأكد من أن 'collection' موجودة ومستخدمة بشكل صحيح
    const unsub = onSnapshot(collection(db, "submissions"), (snap) => {
      const arr = [];
      snap.forEach((doc) => {
        const d = doc.data();
        if (filterType === "approved" && d.approved)
          arr.push({ id: doc.id, ...d });
        if (filterType === "pending" && !d.approved)
          arr.push({ id: doc.id, ...d });
        if (filterType === "all") arr.push({ id: doc.id, ...d });
      });
      setList(arr);
    });

    return () => unsub();
  }, [filterType]);

  return list;
}
