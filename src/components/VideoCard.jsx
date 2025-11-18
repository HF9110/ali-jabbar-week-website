// src/components/VideoCard.jsx
import { useState } from "react";
import { PlayCircle } from "lucide-react";
import VideoModal from "./VideoModal";

export default function VideoCard({
  name,
  country,
  thumbnail_url,
  video_url,
  votes,
  onVote,
}) {
  const [openVideo, setOpenVideo] = useState(false);

  return (
    <>
      {/* Card */}
      <div
        className="
          bg-white/10 backdrop-blur-xl 
          border border-white/20 
          rounded-2xl p-4 
          shadow-xl hover:shadow-2xl 
          transition-all cursor-pointer
        "
      >
        {/* Video Thumbnail */}
        <div
          className="relative w-full h-52 overflow-hidden rounded-xl"
          onClick={() => setOpenVideo(true)}
        >
          <img
            src={thumbnail_url}
            className="w-full h-full object-cover rounded-xl"
          />

          {/* Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle size={60} className="text-white/80 hover:text-white" />
          </div>
        </div>

        {/* Info */}
        <div className="mt-4">
          <h2 className="text-xl text-white font-semibold">{name}</h2>
          <p className="text-gray-300">{country}</p>

          <p className="text-green-300 mt-2">
            الأصوات: <span className="font-bold">{votes}</span>
          </p>

          <button
            onClick={onVote}
            className="
              mt-3 px-4 py-2 rounded-xl 
              bg-purple-600 hover:bg-purple-700 
              text-white w-full
            "
          >
            تصويت
          </button>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        open={openVideo}
        onClose={() => setOpenVideo(false)}
        videoUrl={video_url}
      />
    </>
  );
}
