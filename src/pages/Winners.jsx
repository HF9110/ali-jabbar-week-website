// src/pages/Winners.jsx
import React from "react";
import useSubmissions from "../hooks/useSubmissions";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

const PodiumCard = ({ item, rank, isFirst }) => {
  // تحديد الألوان والأحجام لكل مركز
  const rankConfig =
    [
      {
        color: "text-[#fde047]",
        borderColor: "border-yellow-400",
        shadow: "shadow-yellow-600/50",
        size: "h-48 w-48",
        iconSize: 48,
        order: isFirst ? "order-2" : "",
      }, // 1st
      {
        color: "text-gray-400",
        borderColor: "border-gray-400",
        shadow: "shadow-gray-500/50",
        size: "h-40 w-40",
        iconSize: 40,
        order: "order-1",
      }, // 2nd
      {
        color: "text-amber-600",
        borderColor: "border-amber-600",
        shadow: "shadow-amber-700/50",
        size: "h-40 w-40",
        iconSize: 40,
        order: "order-3",
      }, // 3rd
    ][rank - 1] || {};

  const glowClass = rank === 1 ? "animate-glow" : "";

  return (
    <motion.div
      className={`flex flex-col items-center p-4 glass-card rounded-2xl transition-all duration-500 ${rankConfig.order}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.1 }}
    >
      <div
        className={`p-3 rounded-full border-4 ${rankConfig.borderColor} ${glowClass} mb-4`}
      >
        <Trophy
          size={rankConfig.iconSize}
          className={`${rankConfig.color} ${glowClass}`}
        />
      </div>

      <img
        src={item.thumbnail_url}
        className={`object-cover rounded-lg mb-3 border-2 ${rankConfig.borderColor} ${glowClass} ${rankConfig.size}`}
        alt={item.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/300x400/121212/AAAAAA?text=Video+Thumb";
        }}
      />

      <h2 className={`text-2xl font-bold text-white mb-1 ${glowClass}`}>
        {item.name}
      </h2>
      <p className="text-gray-400 text-sm">{item.country}</p>
      <p className="text-white mt-3 font-semibold text-xl">
        الأصوات: <span className="text-[#d4af37]">{item.votes}</span>
      </p>
    </motion.div>
  );
};

export default function Winners() {
  const list = useSubmissions("approved");

  const sorted = [...list].sort((a, b) => b.votes - a.votes);
  const topThree = sorted.slice(0, 3);
  const remaining = sorted.slice(3);

  return (
    <div className="max-w-6xl mx-auto p-6 text-center" dir="rtl">
      <h1 className="text-4xl font-extrabold text-white mb-12 drop-shadow-lg">
        <span className="text-[#fde047]">منصة</span> التتويج
      </h1>

      {/* Podium Layout */}
      <div className="flex justify-center items-end gap-8 mb-16 flex-wrap lg:flex-nowrap">
        {/* 2nd Place */}
        {topThree[1] && (
          <PodiumCard item={topThree[1]} rank={2} isFirst={false} />
        )}
        {/* 1st Place */}
        {topThree[0] && (
          <PodiumCard item={topThree[0]} rank={1} isFirst={true} />
        )}
        {/* 3rd Place */}
        {topThree[2] && (
          <PodiumCard item={topThree[2]} rank={3} isFirst={false} />
        )}
      </div>

      {/* Remaining Participants List */}
      {remaining.length > 0 && (
        <div className="mt-10">
          <h2 className="text-3xl font-bold text-white mb-6">بقية المشاركات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {remaining.map((item, index) => (
              <motion.div
                key={item.id}
                className="p-4 glass-card rounded-xl border border-white/10 flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-gray-400 w-8">
                    #{index + 4}
                  </span>
                  <img
                    src={item.thumbnail_url}
                    className="w-16 h-16 object-cover rounded-lg border-2 border-[#d4af37]/50"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/100x100/121212/AAAAAA?text=Thumb";
                    }}
                  />
                  <div>
                    <h3 className="text-white font-semibold">{item.name}</h3>
                    <p className="text-gray-400 text-sm">{item.country}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-[#fde047]">
                  {item.votes} صوت
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
