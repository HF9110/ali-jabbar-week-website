import React, { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard";
import Podium from "../components/Podium";
import Carousel from "../components/Carousel";
import VideoCard from "../components/VideoCard";
import { db } from "../firebase/firebase";
// (تعديل) استيراد onSnapshot للاستماع الفوري
import { doc, getDoc, collection, getDocs, onSnapshot } from "firebase/firestore";

export default function Home() {
  const [stage, setStage] = useState("submission");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // (تم التعديل) جلب إعدادات المسابقة بشكل فوري
  useEffect(() => {
    const docRef = doc(db, "contest_settings", "main");
    
    // استخدام onSnapshot بدلاً من getDoc
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStage(data.stage || "submission");
      } else {
        console.warn("Document contest_settings/main not found!");
        setStage("submission");
      }
    }, (error) => {
      console.error("Error fetching settings:", error);
      setStage("submission");
    });

    // تنظيف الاشتراك عند إغلاق الصفحة
    return () => unsubscribe();
  }, []); // سيعمل مرة واحدة عند تحميل الصفحة

  // جلب المشاركات
  useEffect(() => {
    // (ملاحظة: هذا الكود يجلب المشاركات مرة واحدة فقط عند التحميل)
    // (إذا أردت تحديث التصويت بشكل فوري، يجب تحويل هذا إلى onSnapshot أيضاً)
    async function fetchSubmissions() {
      try {
        const querySnapshot = await getDocs(collection(db, "submissions"));
        const data = [];
        querySnapshot.forEach(doc => {
          // جلب المشاركات المقبولة فقط
          if (doc.data().approved) {
            data.push({ id: doc.id, ...doc.data() });
          }
        });
        setSubmissions(data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, [stage]); // (إضافة) إعادة جلب المشاركات عند تغير المرحلة

  if (loading && stage === "submission") {
    // عرض فورم التقديم فوراً إذا كانت مرحلة التقديم
    // هذا يحل مشكلة الانتظار الطويل لتحميل المشاركات
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <GlassCard />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  // مرحلة التقديم
  if (stage === "submission") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <GlassCard />
      </div>
    );
  }

  // مرحلة التصويت
  return (
    <div className="min-h-screen bg-black text-white p-4">
      {submissions.length > 0 ? (
        <>
          <Podium submissions={submissions} />
          <Carousel submissions={submissions} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {submissions.map(sub => (
              <VideoCard key={sub.id} submission={sub} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-white text-lg">لا توجد مشاركات (مقبولة) حالياً</p>
        </div>
      )}
    </div>
  );
}