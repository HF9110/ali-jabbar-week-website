// src/components/VoteModal.jsx
import React, { useEffect, useState } from "react";
import { doc, runTransaction, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import { X, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { getOrCreateVoterId } from "../lib/voter.js";

export default function VoteModal({ submission, onClose }) {
  const VOTING_DELAY_SECONDS = 30;
  const [checked, setChecked] = useState(false);
  const [voted, setVoted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");

  const voterId = getOrCreateVoterId();

  useEffect(() => {
    const votedList = JSON.parse(localStorage.getItem("votedSubmissions") || "[]");
    if (votedList.includes(submission.id)) {
      setVoted(true);
      const ts = Number(localStorage.getItem(`voteTime_${submission.id}`) || 0);
      const elapsed = Math.floor((Date.now() - ts) / 1000);
      const remaining = Math.max(0, VOTING_DELAY_SECONDS - elapsed);
      setTimer(remaining);
      if (remaining > 0) {
        const iv = setInterval(() => {
          setTimer(prev => {
            if (prev <= 1) {
              clearInterval(iv);
              setVoted(false);
              return 0;
            }
            return prev - 1;
          })
        }, 1000);
        return () => clearInterval(iv);
      } else {
        setVoted(false);
      }
    }
  }, [submission.id]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const getTikTokEmbed = (url) => {
    try {
      const match = url.match(/(?:tiktok\.com\/.*\/video\/|vm\.tiktok\.com\/)([0-9a-zA-Z]+)/);
      if (match && match[1]) {
        return `https://www.tiktok.com/embed/v2/${match[1]}?embed_video=1`;
      }
    } catch (e) { /* ignore */ }
    return "";
  };

  const videoUrl = (Array.isArray(submission.links) && submission.links[0]) || submission.tiktok || "";
  const embedUrl = getTikTokEmbed(videoUrl);

  const handleVote = async () => {
    setError("");
    if (!checked) {
      setError("الرجاء التأكيد أنك لست روبوت.");
      return;
    }
    if (voted || timer > 0) return;

    try {
      const submissionRef = doc(db, "submissions", submission.id);

      // Transaction: increment votes atomically
      await runTransaction(db, async (t) => {
        const snap = await t.get(submissionRef);
        if (!snap.exists()) throw new Error("Submission not found");
        const cur = snap.data().votes || 0;
        t.update(submissionRef, { votes: cur + 1 });
      });

      // Log vote into vote_logs
      const logsRef = collection(db, "vote_logs");
      await addDoc(logsRef, {
        submissionId: submission.id,
        voterId,
        userAgent: navigator.userAgent || "",
        timestamp: serverTimestamp(),
        method: "client",
      });

      // set voted locally
      setVoted(true);
      setTimer(VOTING_DELAY_SECONDS);
      const arr = JSON.parse(localStorage.getItem("votedSubmissions") || "[]");
      if (!arr.includes(submission.id)) {
        arr.push(submission.id);
        localStorage.setItem("votedSubmissions", JSON.stringify(arr));
      }
      localStorage.setItem(`voteTime_${submission.id}`, Date.now().toString());

    } catch (err) {
      console.error("Vote failed:", err);
      setError("حدث خطأ أثناء التصويت. الرجاء المحاولة لاحقًا.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        className="relative max-w-3xl w-full bg-white/6 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-3 border-b border-white/5">
          <div>
            <h3 className="text-white font-bold">{submission.name}</h3>
            <p className="text-sm text-gray-300">الأصوات: <span className="font-bold text-yellow-300">{submission.votes || 0}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded">
            <X className="text-white" />
          </button>
        </div>

        <div className="p-4 md:p-6">
          <div className="w-full aspect-[9/16] bg-black rounded overflow-hidden mb-4">
            {embedUrl ? (
              <iframe src={embedUrl} className="w-full h-full" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen scrolling="no"></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">لا يمكن عرض الفيديو — رابط غير صالح</div>
            )}
          </div>

          {error && <p className="text-sm text-red-400 mb-2">{error}</p>}

          <div className="flex items-center gap-3">
            <input type="checkbox" id="robotVote" checked={checked} onChange={(e)=>setChecked(e.target.checked)} className="h-5 w-5" disabled={voted} />
            <label htmlFor="robotVote" className="text-white text-sm">أنا لست روبوت</label>
          </div>

          <button
            onClick={handleVote}
            disabled={!checked || voted || timer > 0}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
          >
            {timer > 0 ? <><Clock /> الرجاء الانتظار ({timer}s)</> : (voted ? "تم التصويت" : "صوّت الآن")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
