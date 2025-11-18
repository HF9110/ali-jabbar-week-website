// src/components/ConfirmVoteModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function ConfirmVoteModal({ open, onClose, onConfirm, name }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="
          fixed top-1/2 left-1/2 z-50 
          bg-white/10 backdrop-blur-xl border border-white/20 
          p-6 rounded-2xl w-[90%] max-w-md shadow-2xl
        "
        initial={{ opacity: 0, scale: 0.7, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.7, y: -20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-semibold text-white mb-4">
          تأكيد التصويت
        </h2>

        <p className="text-gray-200 mb-6">
          هل أنت متأكد أنك تريد التصويت للمشترك:
          <span className="font-bold text-white"> {name}</span> ؟
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
          >
            إلغاء
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white"
          >
            تأكيد
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
