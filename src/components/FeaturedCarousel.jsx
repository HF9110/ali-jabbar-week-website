// src/components/FeaturedCarousel.jsx
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeaturedCarousel({ items = [] }) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    if (!items.length) return;
    intervalRef.current = setInterval(() => {
      setIndex(i => (i + 1) % items.length);
    }, 4500);
    return () => clearInterval(intervalRef.current);
  }, [items.length]);

  if (!items.length) return null;

  const current = items[index];

  return (
    <div className="glass-card p-4 rounded-2xl shadow-xl border border-white/10">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id || index}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.45 }}
            className="flex gap-6 items-center"
          >
            <div className="w-48 h-80 flex-shrink-0 rounded-lg overflow-hidden bg-black/20 border border-white/10">
              <img src={current.thumbnail_url || `https://placehold.co/400x600/000000/FFFFFF?text=Video`} alt={current.name} className="w-full h-full object-cover"/>
            </div>

            <div className="flex-1">
              <h4 className="text-lg font-bold">{current.name}</h4>
              <p className="text-sm text-gray-300 mt-2 line-clamp-3">{current.description || "وصف قصير للمشاركة."}</p>
              <div className="mt-4 flex gap-3">
                <a href="#" className="px-3 py-2 bg-white/10 rounded-lg text-sm">مشاهدة</a>
                <a href="#" className="px-3 py-2 bg-white/5 rounded-lg text-sm">مشاركة</a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-y-1/2 left-2 -translate-y-1/2">
          <button onClick={() => setIndex(i => (i - 1 + items.length) % items.length)} className="bg-black/40 p-2 rounded-full">
            <ChevronLeft />
          </button>
        </div>
        <div className="absolute inset-y-1/2 right-2 -translate-y-1/2">
          <button onClick={() => setIndex(i => (i + 1) % items.length)} className="bg-black/40 p-2 rounded-full">
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {items.slice(0, 8).map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/30'}`} />
        ))}
      </div>
    </div>
  );
}
