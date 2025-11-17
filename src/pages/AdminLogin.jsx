import { useState } from "react";
// --- المسار الصحيح: مع لاحقة لملف js ---
import { auth } from "../firebase/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    try {
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("فشل تسجيل الدخول: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl w-96">
        <h2 className="text-2xl font-bold text-white mb-4">لوحة التحكم</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={handleLogin}
          className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700"
        >
          تسجيل الدخول
        </button>
      </div>
    </div>
  );
}