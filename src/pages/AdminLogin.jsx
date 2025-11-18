// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { auth } from "../firebase/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Users, Loader2 } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-blue-600 rounded-full">
            <Users className="text-white" size={28} />
          </div>
          <h2 className="text-2xl font-bold mt-3">تسجيل دخول المدير</h2>
        </div>

        {error && <div className="p-3 bg-red-700/10 text-red-600 rounded mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-3 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">كلمة المرور</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-3 border rounded" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded font-semibold flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
