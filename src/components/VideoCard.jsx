// src/components/VideoCard.jsx
import { useState } from "react";
import { PlayCircle, Heart } from "lucide-react";
import VideoModal from "./VideoModal";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function VideoCard({ item, onVote }) {
  const [openVideo, setOpenVideo] = useState(false);
  const { name, country, thumbnail_url, video_url, votes } = item;

  const handleVoteAction = () => {
    onVote(); // فتح مودال التأكيد
    toast.custom(
      (t) => (
        <div className="bg-black/80 backdrop-blur-md text-white p-3 rounded-lg shadow-xl flex items-center gap-2 animate-fade-in-up">
          <Heart className="text-red-400" size={20} />
          <span className="font-semibold">
            تم اختيار {name} للتصويت. يرجى التأكيد!
          </span>
        </div>
      ),
      { duration: 2000 }
    );
  };

  return (
    <>
      {/* Card (Glassmorphism) */}
      <motion.div
        className="
          bg-white/10 backdrop-blur-xl 
          border border-white/20 
          rounded-2xl p-4 
          shadow-xl hover:shadow-2xl 
          transition-all cursor-pointer
        "
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Video Thumbnail */}
        <div
          className="relative w-full h-52 overflow-hidden rounded-xl bg-black/20"
          onClick={() => setOpenVideo(true)}
        >
          <img
            src={thumbnail_url}
            className="w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/400x400/121212/AAAAAA?text=Video+Thumb";
            }}
          />

          {/* Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle
              size={60}
              className="text-white/90 drop-shadow-lg hover:text-[var(--color-highlight)] transition-colors"
            />
          </div>
        </div>

        {/* Info */}
        <div className="mt-4">
          <h2 className="text-xl text-white font-semibold">{name}</h2>
          <p className="text-gray-300">{country}</p>

          <p className="text-gray-400 mt-2 flex items-center gap-2">
            <Heart size={18} className="text-red-400" />
            الأصوات: <span className="font-bold text-white">{votes}</span>
          </p>

          <button
            onClick={handleVoteAction}
            className="btn-vote mt-3 w-full"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            صوّت الآن
          </button>
        </div>
      </motion.div>

      {/* Video Modal */}
      <VideoModal
        open={openVideo}
        onClose={() => setOpenVideo(false)}
        videoUrl={video_url || item.links[0]}
      />
    </>
  );
}
