// src/components/GlobalModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function GlobalModal({ isOpen = false, title = "", children = null, onClose = () => {} }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
          />
          {/* modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ duration: 0.22 }}
            className="relative max-w-3xl mx-auto my-24 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <button onClick={onClose} className="p-2 rounded hover:bg-white/5">
                <X className="text-white" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto text-gray-200">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
