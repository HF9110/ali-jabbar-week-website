// src/components/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase.js";
import {
  LayoutDashboard,
  Clock,
  CheckCircle,
  Settings,
  LogOut,
  Users,
  Edit,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { name: "نظرة عامة", to: "dashboard", icon: LayoutDashboard },
  { name: "المشاركات المعلقة", to: "pending", icon: Clock },
  { name: "المشاركات المقبولة", to: "approved", icon: CheckCircle },
  { name: "إدارة المشاركات", to: "manage", icon: Edit },
  { name: "الإعدادات", to: "settings", icon: Settings },
  { name: "سجلات التصويت", to: "logs", icon: FileText },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-black/50 backdrop-blur-md p-4 border-l border-white/10 min-h-screen flex flex-col"
    >
      <div className="flex items-center gap-3 px-3 py-4 border-b border-gray-700">
        <Users size={28} className="text-[#fde047]" />
        <div>
          <h2 className="text-lg font-bold text-white">لوحة التحكم</h2>
          <p className="text-sm text-gray-400">إدارة المسابقة</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 mt-4 px-2 flex-grow">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                  isActive
                    ? "bg-[#d4af37] text-gray-900 shadow-md font-bold"
                    : "text-gray-300 hover:bg-white/10"
                }`
              }
            >
              <Icon size={18} />{" "}
              <span className="font-medium">{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-4 px-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-red-300 bg-red-900/20 hover:bg-red-900/40 transition-colors"
        >
          <LogOut size={18} /> تسجيل الخروج
        </button>
      </div>
    </motion.aside>
  );
}
