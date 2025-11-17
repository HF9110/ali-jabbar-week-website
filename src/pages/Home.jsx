import React, { useEffect, useState } from "react";
// المسار الصحيح: الخروج من 'pages'
import GlassCard from "../components/GlassCard";
import Podium from "../components/Podium";
import Carousel from "../components/Carousel";
import VideoCard from "../components/VideoCard";
import { db } from "../firebase/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [stage, setStage] = useState("submission");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, "contest_settings", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStage(docSnap.data().stage || "submission");
        } else {
          setStage("submission");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        setStage("submission");
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const querySnapshot = await getDocs(collection(db, "submissions"));
        const data = [];
        querySnapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setSubmissions(data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (stage === "submission") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <GlassCard />
      </div>
    );
  }

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
          <p className="text-white text-lg">لا توجد مشاركات حالياً</p>
        </div>
      )}
    </div>
  );
}