// src/components/VideoModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function VideoModal({ open, onClose, videoUrl }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="
          fixed top-1/2 left-1/2 z-50 
          bg-black/20 backdrop-blur-xl border border-white/20 
          rounded-2xl shadow-2xl 
          w-[95%] max-w-3xl 
          p-4
        "
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-red-300"
        >
          <X size={26} />
        </button>

        {/* Video Content */}
        <div className="w-full h-[60vh] md:h-[70vh] rounded-xl overflow-hidden">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
