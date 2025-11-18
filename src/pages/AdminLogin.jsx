// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { auth } from "../firebase/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Users, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("الرجاء إدخال البريد وكلمة المرور.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("فشل تسجيل الدخول. تأكد من البيانات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-black/40 glass-card p-8 rounded-2xl shadow-2xl border border-white/10"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-[#d4af37] rounded-full">
            <Users className="text-gray-900" size={28} />
          </div>
          <h2 className="text-2xl font-bold mt-3 text-white">
            تسجيل دخول المدير
          </h2>
        </div>

        {error && (
          <div className="p-3 bg-red-700/30 text-red-300 rounded mb-4 border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded border-gray-700 bg-gray-800 text-white focus:ring-[#d4af37] focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded border-gray-700 bg-gray-800 text-white focus:ring-[#d4af37] focus:border-[#d4af37]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 btn-vote rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin text-gray-900" />
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
