import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
// (تصحيح) إضافة اللواحق
import Sidebar from "../components/Sidebar.jsx";
import Pending from "./Pending.jsx";
import Approved from "./Approved.jsx";
import Settings from "./Settings.jsx";
import Dashboard from "./Dashboard.jsx"; // (جديد) إضافة صفحة الإحصائيات
import ManageSubmissions from "./ManageSubmissions.jsx"; // (جديد) إضافة صفحة الإضافة/التعديل
import { auth } from "../firebase/firebase.js"; // (تصحيح) إضافة .js
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion"; // (جديد) للأنميشن

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) navigate("/admin");
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    // (تصميم جديد) خلفية رمادية فاتحة
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        {/* (جديد) إضافة أنميشن لتبديل الصفحات */}
        <AnimatePresence mode="wait">
          <Routes>
            {/* (جديد) تحديد صفحة الإحصائيات كصفحة رئيسية */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pending" element={<Pending />} />
            <Route path="approved" element={<Approved />} />
            <Route path="settings" element={<Settings />} />
            {/* (جديد) روت لصفحة الإضافة/التعديل */}
            <Route path="manage" element={<ManageSubmissions />} />
            <Route path="manage/:id" element={<ManageSubmissions />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}