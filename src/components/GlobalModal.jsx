import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalModal({ isOpen, onClose, title, content }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
        <motion.div 
          className="bg-white p-6 rounded-xl w-full max-w-lg relative border border-gray-200 shadow-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition-colors z-20">
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">{title}</h2>
          
          <div className="text-gray-700 max-h-96 overflow-y-auto">
            <p className="whitespace-pre-line">{content}</p> 
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}