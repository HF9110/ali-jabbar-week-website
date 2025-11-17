import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import Podium from "../components/Podium";
import Carousel from "../components/Carousel";
import VideoCard from "../components/VideoCard";

export default function Home() {
  const [stage, setStage] = useState("submission");
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    async function fetchSettings() {
      const snapshot = await getDocs(collection(db, "contest_settings"));
      snapshot.forEach(d => {
        setStage(d.data().stage);
      });
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    async function fetchSubmissions() {
      const querySnapshot = await getDocs(collection(db, "submissions"));
      const data = [];
      querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setSubmissions(data);
    }
    fetchSubmissions();
  }, []);

  if (stage === "submission") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <GlassCard />
      </div>
    );
  }

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
