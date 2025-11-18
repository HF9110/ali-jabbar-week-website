// src/App.jsx
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Award, HelpCircle, Users } from "lucide-react";
import useSettings from "./hooks/useSettings"; // <-- استيراد الهوك

// Lazy-loaded pages (based on your folder structure)
const Home = lazy(() => import("./pages/Home"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Winners = lazy(() => import("./pages/Winners"));
const SubmissionProfile = lazy(() => import("./pages/SubmissionProfile"));

// Admin & Dashboard pages
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

// Submissions Management
const Manage = lazy(() => import("./pages/Manage"));
const ManageSubmissions = lazy(() => import("./pages/ManageSubmissions"));
const Pending = lazy(() => import("./pages/Pending"));
const Approved = lazy(() => import("./pages/Approved"));

// Logs
const AdminLogs = lazy(() => import("./pages/AdminLogs"));
const Logs = lazy(() => import("./pages/Logs"));

// مكون شريط التنقل العلوي - موحد التصميم
const Header = () => (
  <header className="sticky top-0 z-40 w-full bg-black/60 backdrop-blur-md shadow-xl border-b border-gray-700/50">
    <nav
      className="max-w-6xl mx-auto flex items-center justify-between p-4"
      dir="rtl"
    >
      {/* الشعار - يستخدم اللون الأساسي */}
      <Link
        to="/"
        className="text-2xl font-extrabold"
        style={{ color: "var(--color-primary)", fontFamily: "var(--app-font)" }}
      >
        تصويت المسابقة
      </Link>

      <div className="flex items-center space-x-6 space-x-reverse text-sm font-semibold">
        <Link
          to="/"
          className="text-gray-300 transition-colors flex items-center gap-2 hover:text-[var(--color-highlight)]"
        >
          <Users size={18} /> المشاركات
        </Link>
        <Link
          to="/winners"
          className="text-gray-300 transition-colors flex items-center gap-2 hover:text-[var(--color-highlight)]"
        >
          <Award size={18} /> الفائزون
        </Link>
        <Link
          to="/faq"
          className="text-gray-300 transition-colors flex items-center gap-2 hover:text-[var(--color-highlight)]"
        >
          <HelpCircle size={18} /> الأسئلة الشائعة
        </Link>
        <Link
          to="/admin/login"
          className="text-gray-500 hover:text-gray-300 transition-colors text-xs"
        >
          (إدارة)
        </Link>
      </div>
    </nav>
  </header>
);

export default function App() {
  const settings = useSettings(); // جلب الإعدادات

  // بناء متغيرات CSS ديناميكياً
  const dynamicStyle = {
    "--color-primary": settings.mainColor || "#d4af37",
    "--color-highlight": settings.highlightColor || "#fde047",
    "--app-font": settings.appFont || "Cairo, sans-serif",
    fontFamily: settings.appFont || "Cairo, sans-serif", // تطبيق الخط مباشرة على الـ div
  };

  return (
    <Router>
      {/* تطبيق المتغيرات على مستوى جذر التطبيق */}
      <div style={dynamicStyle} className="min-h-screen">
        <Routes>
          <Route
            path="/admin/*"
            element={
              <Suspense
                fallback={
                  <div className="text-white p-10">جاري التحميل...</div>
                }
              >
                <AdminRoutes />
              </Suspense>
            }
          />
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </div>
    </Router>
  );
}

// المسارات العامة (تشمل الهيدر)
const PublicRoutes = () => (
  <Suspense
    fallback={
      <div className="text-white p-10 text-center">جاري التحميل...</div>
    }
  >
    <Header />
    <main className="min-h-screen pt-4 pb-16">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/winners" element={<Winners />} />
        <Route path="/submission/:id" element={<SubmissionProfile />} />
      </Routes>
    </main>
  </Suspense>
);

// مسارات الإدارة
const AdminRoutes = () => (
  <Routes>
    <Route path="/login" element={<AdminLogin />} />
    <Route path="/" element={<AdminDashboard />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/manage" element={<Manage />} />
    <Route path="/manage/submissions" element={<ManageSubmissions />} />
    <Route path="/pending" element={<Pending />} />
    <Route path="/approved" element={<Approved />} />
    <Route path="/logs" element={<Logs />} />
    <Route path="/admin/logs" element={<AdminLogs />} />
  </Routes>
);
