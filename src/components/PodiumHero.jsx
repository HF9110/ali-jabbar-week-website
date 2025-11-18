// src/components/PodiumHero.jsx
import React from "react";
import { motion } from "framer-motion";

const PodiumCard = ({ rank, submission, style }) => {
  if (!submission) {
    return (
      <div className={`flex flex-col items-center ${style.container} opacity-30`}>
        <div className={`w-40 ${style.height} rounded-t-lg ${style.bg} flex items-center justify-center border-4`} />
        <p className="mt-3 text-sm text-gray-300">مركز {rank}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: rank * 0.08, duration: 0.4 }}
      className={`flex flex-col items-center ${style.container} select-none`}
    >
      <div className="w-44 mb-3">
        <div className="w-full aspect-[9/16] rounded-lg overflow-hidden bg-black/20 border border-white/10">
          <img src={submission.thumbnail_url || `https://placehold.co/400x600/000000/FFFFFF?text=Video`} alt={submission.name} className="w-full h-full object-cover"/>
        </div>
      </div>

      <div className={`flex items-center justify-center w-44 ${style.height} rounded-t-lg ${style.bg} border-4 border-white/10`}>
        <span className={`${style.text} font-extrabold text-white`}>{rank}</span>
      </div>
      <p className="mt-3 text-center truncate w-44 text-white font-semibold">{submission.name}</p>
      <p className="text-sm text-gray-300 mt-1">الأصوات: <span className="font-bold text-yellow-300">{submission.votes || 0}</span></p>
    </motion.div>
  );
};

export default function PodiumHero({ top3 = [] }) {
  // styles for 2,1,3 arrangement
  const styles = [
    { container: "order-2", height: "h-44 md:h-56", bg: "bg-gray-400", text: "text-5xl" }, // second
    { container: "order-1 -mt-6 md:-mt-10", height: "h-64 md:h-80", bg: "bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-lg", text: "text-6xl" }, // first
    { container: "order-3", height: "h-32 md:h-40", bg: "bg-yellow-800", text: "text-4xl" }, // third
  ];

  const arranged = [top3[1] || null, top3[0] || null, top3[2] || null];

  return (
    <div className="glass-card p-6 rounded-3xl shadow-2xl border border-white/10">
      <h3 className="text-xl font-bold mb-4">المراكز الأولى</h3>
      <div className="flex items-end justify-center gap-6 md:gap-10">
        {arranged.map((sub, idx) => (
          <PodiumCard key={idx} rank={idx === 1 ? 1 : (idx === 0 ? 2 : 3)} submission={sub} style={styles[idx]} />
        ))}
      </div>
    </div>
  );
}
