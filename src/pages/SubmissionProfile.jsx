/ src/pages/SubmissionProfile.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import useSubmissions from "../hooks/useSubmissions";
import ConfirmVoteModal from "../components/ConfirmVoteModal";
import { Link as LinkIcon, Heart } from 'lucide-react';
import { motion } from "framer-motion";

export default function SubmissionProfile() {
  const { id } = useParams();
  const list = useSubmissions("all");
  const data = list.find(x => x.id === id);

  const [open, setOpen] = React.useState(false);

  if (!data) {
    return <div className="text-center text-white p-10">جاري التحميل...</div>;
  }

  return (
    <motion.div 
        className="max-w-4xl mx-auto p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
    >
      
      {/* Thumb */}
      <div className="rounded-xl overflow-hidden shadow-2xl glass-card mb-6 border border-white/20">
        <img
          src={data.thumbnail_url}
          alt={data.name}
          className="w-full h-96 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x400/121212/AAAAAA?text=Video+Thumb"; }}
        />
      </div>
      
      <div className="bg-black/30 p-6 rounded-xl shadow-xl glass-card border border-white/10">
          <h1 className="text-4xl font-bold text-[#fde047] mb-1">{data.name}</h1>
          <p className="text-gray-300 mb-4">{data.country}</p>

          <div className="flex items-center justify-between pb-4 border-b border-gray-700">
            <p className="text-gray-400 font-semibold flex items-center gap-2">
                <Heart size={20} className="text-red-400" />
                الأصوات: <span className="text-white font-bold">{data.votes}</span>
            </p>

            <button
                onClick={() => setOpen(true)}
                className="btn-vote flex items-center gap-2"
            >
                صوّت الآن
            </button>
          </div>

          <h2 className="text-xl font-bold mt-6 text-white flex items-center gap-2">
            <LinkIcon size={20} className="text-[#d4af37]" />
            روابط الفيديو
          </h2>

          <ul className="mt-3 text-gray-300 space-y-2">
            {(data.links || []).map((l, i) => (
              <li key={i}>
                <a href={l} target="_blank" className="underline hover:text-[#fde047] transition-colors">
                  رابط رقم {i + 1}
                </a>
              </li>
            ))}
          </ul>

          <ConfirmVoteModal
            open={open}
            onClose={() => setOpen(false)}
            userId={data.id}
            userName={data.name}
          />
      </div>
    </motion.div>
  );
}