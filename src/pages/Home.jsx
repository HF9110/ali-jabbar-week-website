// src/pages/Home.jsx
import { useState } from "react";
import VideoCard from "../components/VideoCard";
import VideoModal from "../components/VideoModal";
import ConfirmVoteModal from "../components/ConfirmVoteModal";

const mockResults = [
  { name: "Ali", country: "Iraq", thumbnail_url: "/thumbnails/1.jpg", video_url: "/videos/1.mp4", votes: 12 },
  { name: "Sara", country: "Jordan", thumbnail_url: "/thumbnails/2.jpg", video_url: "/videos/2.mp4", votes: 8 },
];

const mockParticipants = [
  { name: "Ahmed", country: "Egypt", thumbnail_url: "/thumbnails/3.jpg", video_url: "/videos/3.mp4", votes: 5 },
  { name: "Lina", country: "Lebanon", thumbnail_url: "/thumbnails/4.jpg", video_url: "/videos/4.mp4", votes: 7 },
];

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [voteModalOpen, setVoteModalOpen] = useState(false);

  const handleVote = (participant) => {
    setVoteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* الشعار */}
      <header className="py-6 text-center text-3xl font-bold">🏆 مسابقة الفيديو الأسبوعية</header>

      {/* النتائج المباشرة */}
      <section className="px-4">
        <h2 className="text-2xl font-semibold mb-4">النتائج المباشرة</h2>
        <div className="space-y-4">
          {mockResults.map((p, idx) => (
            <VideoCard key={idx} {...p} onVote={() => handleVote(p)} />
          ))}
        </div>
      </section>

      <hr className="my-8 border-gray-700" />

      {/* المشاركات */}
      <section className="px-4">
        <h2 className="text-2xl font-semibold mb-4">المشاركات</h2>
        <div className="space-y-4">
          {mockParticipants.map((p, idx) => (
            <VideoCard key={idx} {...p} onVote={() => handleVote(p)} />
          ))}
        </div>
      </section>

      {/* شروط المسابقة */}
      <section className="px-4 mt-8 mb-4">
        <button
          className="text-purple-400 hover:underline"
          onClick={() => setVoteModalOpen(true)}
        >
          شروط المسابقة / لماذا هذه المسابقة
        </button>
      </section>

      {/* الفوتر */}
      <footer className="text-center py-4 border-t border-gray-700">
        جميع الحقوق محفوظة &copy; 2025
      </footer>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          open={!!selectedVideo}
          videoUrl={selectedVideo.video_url}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Confirm Vote Modal */}
      <ConfirmVoteModal
        open={voteModalOpen}
        onClose={() => setVoteModalOpen(false)}
        onConfirm={() => {
          alert("تم التصويت!");
          setVoteModalOpen(false);
        }}
      />
    </div>
  );
}
