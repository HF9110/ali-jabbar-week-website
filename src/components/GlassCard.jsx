// src/components/GlassCard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function GlassCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-2xl shadow-xl hover:shadow-2xl transition"
    >
      {children}
    </motion.div>
  );
}
