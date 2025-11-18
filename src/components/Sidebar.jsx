import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase.js"; // (تصحيح) إضافة .js
import { LayoutDashboard, Clock, CheckCircle, Settings, LogOut, Users, Edit } from 'lucide-react';
import { motion } from "framer-motion"; // (جديد)

export default function Sidebar() {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await auth.signOut();
    navigate("/admin");
  }

  const navLinks = [
    { name: "نظرة عامة", to: "dashboard", icon: LayoutDashboard },
    { name: "المشاركات المعلقة", to: "pending", icon: Clock },
    { name: "المشاركات المقبولة", to: "approved", icon: CheckCircle },
    { name: 'إدارة المشاركات', to: 'manage', icon: Edit },
    { name: "الإعدادات", to: "settings", icon: Settings },
  ];

  const linkClasses = "flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-all duration-200";
  const activeLinkClasses = "bg-blue-600 text-white hover:bg-blue-700 shadow-lg";

  return (
    // (تصميم نهائي) قائمة جانبية بخلفية بيضاء
    <motion.div 
        className="bg-white w-64 p-4 flex flex-col gap-4 shadow-xl border-r border-gray-200 min-h-screen flex-shrink-0"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 p-4 border-b border-gray-200">
        <Users className="text-blue-600" size={28} />
        <h2 className="text-xl font-bold text-gray-800">لوحة التحكم</h2>
      </div>
      
      <nav className="flex flex-col gap-2 flex-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            className={({ isActive }) => 
              `${linkClasses} ${isActive ? activeLinkClasses : ""}`
            }
          >
            <link.icon size={20} className="mr-3 flex-shrink-0" />
            {link.name}
          </NavLink>
        ))}
      </nav>

      <button 
        onClick={handleLogout} 
        className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-700 mt-auto transition-all duration-200"
      >
        <LogOut size={20} className="mr-3" />
        تسجيل الخروج
      </button>
    </motion.div>
  );
}