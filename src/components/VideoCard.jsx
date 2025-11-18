// src/components/VideoCard.jsx
import React from "react";
import { Play } from "lucide-react";
import GlassCard from "./GlassCard";

export default function VideoCard({ item, onVote }) {
  return (
    <GlassCard>
      <div className="flex flex-col gap-3">

        <div className="w-full h-56 rounded-xl overflow-hidden">
          <img
            src={item.thumbnail_url || "https://placehold.co/400x600?text=No+Image"}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">{item.name}</h3>
          {item.country && (
            <p className="text-gray-300 text-sm">{item.country}</p>
          )}
        </div>

        <button
          onClick={onVote}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <Play size={16} /> صوّت الآن
        </button>

      </div>
    </GlassCard>
  );
}
