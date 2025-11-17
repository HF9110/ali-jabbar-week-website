import { Routes, Route, useNavigate } from "react-router-dom";
// المسار الصحيح: الخروج من 'pages'
import Sidebar from "../components/Sidebar";
// المسار الصحيح: في نفس المجلد
import Pending from "./Pending";
import Approved from "./Approved";
import Settings from "./Settings";
// المسار الصحيح: الخروج من 'pages'
import { auth } from "../firebase/firebase";
import { useEffect } from "react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) navigate("/admin");
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-6">
        <Routes>
          <Route path="pending" element={<Pending />} />
          <Route path="approved" element={<Approved />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}