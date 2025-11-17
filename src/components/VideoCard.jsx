import { useState } from "react";
import Modal from "./Modal.jsx"; // (تصحيح) إضافة .jsx
import { arabCountries } from "../utils/countries.js"; // (جديد)

// (جديد) دالة لجلب العلم
const getFlag = (countryName) => {
  const country = arabCountries.find(c => c.name === countryName);
  return country ? country.flag : '🌎';
};

export default function VideoCard({ submission }) {
  const [open, setOpen] = useState(false);
  if (!submission) return null;

  // (جديد) استخدام الصورة المصغرة المحددة
  const thumbnailUrl = submission.thumbnail_url || `https://placehold.co/600x400/000000/FFFFFF?text=Video&font=cairo`;
  const countryFlag = submission.country ? getFlag(submission.country) : '';

  return (
    <>
      <div
        className="glass-card bg-white/10 backdrop-blur-lg rounded-lg p-3 cursor-pointer shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
        onClick={() => setOpen(true)}
      >
        <div className="w-full aspect-video rounded-md overflow-hidden bg-black/20">
          <img
            src={thumbnailUrl}
            alt={submission.name || "Submission"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-3 flex justify-between items-center">
          <p className="text-lg font-semibold text-white truncate">{submission.name}</p>
          {submission.country && (
            <p className="text-lg text-white" title={submission.country}>{countryFlag}</p>
          )}
        </div>
        <p className="text-lg font-bold text-yellow-400 mt-2">الأصوات: {submission.votes || 0}</p>
      </div>
      
      {open && <Modal submission={submission} onClose={() => setOpen(false)} />}
    </>
  );
}