// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard";
import Podium from "../components/Podium";
import Carousel from "../components/Carousel";
import VideoCard from "../components/VideoCard";
import { db } from "../firebase/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [stage, setStage] = useState("submission"); // افتراضي مرحلة التقديم
  const [submissions, setSubmissions] = useState([]);

  // جلب إعدادات المسابقة
  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, "contest_settings", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStage(data.stage || "submission");
        } else {
          console.warn("Document contest_settings/main not found!");
          setStage("submission");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        setStage("submission");
      }
    }
    fetchSettings();
  }, []);

  // جلب المشاركات
  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const querySnapshot = await getDocs(collection(db, "submissions"));
        const data = [];
        querySnapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        console.log("Submissions fetched:", data);
        setSubmissions(data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    }
    fetchSubmissions();
  }, []);

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
      <Podium submissions={submissions} />
      <Carousel submissions={submissions} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {submissions.map(sub => (
          <VideoCard key={sub.id} submission={sub} />
        ))}
      </div>
    </div>
  );
}
