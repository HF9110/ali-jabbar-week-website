import { NavLink } from "react-router-dom";
// --- المسار الصحيح: مع لاحقة لملف js ---
import { auth } from "../firebase/firebase.js";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await auth.signOut();
    navigate("/admin");
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg w-64 p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-white mb-4">لوحة التحكم</h2>
      <NavLink to="pending" className="text-white hover:underline">المشاركات المعلقة</NavLink>
      <NavLink to="approved" className="text-white hover:underline">المشاركات المقبولة</NavLink>
      <NavLink to="settings" className="text-white hover:underline">الإعدادات</NavLink>
      <button onClick={handleLogout} className="mt-auto bg-red-600 p-2 rounded hover:bg-red-700">تسجيل الخروج</button>
    </div>
  );
}