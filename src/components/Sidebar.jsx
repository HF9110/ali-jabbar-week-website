// src/components/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase.js";
import { LayoutDashboard, Clock, CheckCircle, Settings, LogOut, Users, Edit } from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { name: "نظرة عامة", to: "dashboard", icon: LayoutDashboard },
  { name: "المشاركات المعلقة", to: "pending", icon: Clock },
  { name: "المشاركات المقبولة", to: "approved", icon: CheckCircle },
  { name: "إدارة المشاركات", to: "manage", icon: Edit },
  { name: "الإعدادات", to: "settings", icon: Settings },
  { name: "سجلات التصويت", to: "logs", icon: FileText }
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/admin");
    } catch (err) {
      console.error("Logout failed:", err);
      navigate("/admin");
    }
  };

  return (
    <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-64 bg-white p-4 border-r border-gray-200 min-h-screen">
      <div className="flex items-center gap-3 px-3 py-4 border-b border-gray-100">
        <Users size={28} className="text-blue-600" />
        <div>
          <h2 className="text-lg font-bold text-gray-800">لوحة التحكم</h2>
          <p className="text-sm text-gray-500">إدارة المسابقة</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 mt-4 px-2">
        {navLinks.map(link => {
          const Icon = link.icon;
          return (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              <Icon size={18} /> <span className="font-medium">{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto px-2">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded text-gray-700 hover:bg-red-50">
          <LogOut size={18} /> تسجيل الخروج
        </button>
      </div>
    </motion.aside>
  );
}
