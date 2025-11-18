import { useEffect, useState } from "react";
import { db } from "../firebase/firebase.js"; 
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AlertCircle, Save, CheckCircle, Palette, Radio, Edit3, Loader2, Settings as SettingsIcon, Type, Image, Codesandbox } from 'lucide-react';
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// قائمة خطوط آمنة شائعة
const safeFonts = ['Cairo', 'Arial', 'Tahoma', 'Times New Roman'];

const Toggle = ({ label, enabled, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer p-4 glass-card rounded-lg border border-white/10">
    <span className="text-sm font-medium text-gray-300">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={enabled} onChange={onChange} />
      <div className={`block w-14 h-8 rounded-full ${enabled ? 'bg-[var(--color-primary)] shadow-lg' : 'bg-gray-700'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enabled ? 'translate-x-6' : ''}`}></div>
    </div>
  </label>
);

export default function Settings() {
  const [settings, setSettings] = useState({
    stage: "submission", 
    title: "مسابقة تيك توك",
    logo: "",
    enableCountry: true,
    maxLinks: 1,
    // --- حقول التحكم بالثيمات الجديدة ---
    mainColor: "#d4af37", // الذهبي
    highlightColor: "#fde047", // الذهبي الفاتح للتوهج
    appFont: "Cairo",
    enableGlass: true,
  });
  const [footerContent, setFooterContent] = useState({
    terms: "أدخل شروط المسابقة هنا.",
    about: "أدخل معلومات القائمين هنا.",
    purpose: "أدخل محتوى لماذا هذه المسابقة هنا.",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const mainDocRef = doc(db, "contest_settings", "main");
        const footerDocRef = doc(db, "contest_settings", "footer");
        
        const [mainSnap, footerSnap] = await Promise.all([getDoc(mainDocRef), getDoc(footerDocRef)]);

        if (mainSnap.exists()) {
          setSettings(prev => ({ ...prev, ...mainSnap.data() }));
        }
        if (footerSnap.exists()) {
          setFooterContent(footerSnap.data());
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError("حدث خطأ أثناء جلب الإعدادات.");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setError("");
    setSuccess("");
    try {
      const mainDocRef = doc(db, "contest_settings", "main");
      const footerDocRef = doc(db, "contest_settings", "footer");
      
      await Promise.all([
        setDoc(mainDocRef, { ...settings, maxLinks: Number(settings.maxLinks) }, { merge: true }),
        setDoc(footerDocRef, footerContent, { merge: true })
      ]);

      setSuccess("تم حفظ الإعدادات بنجاح!");
      toast.success("تم حفظ الإعدادات بنجاح!");
      document.title = settings.title;
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("فشل في حفظ الإعدادات.");
      toast.error("فشل في حفظ الإعدادات.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="animate-spin text-yellow-500" size={40} />
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-3xl mx-auto space-y-8 p-6 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-white flex items-center gap-2">
        <SettingsIcon size={24} className="text-[#d4af37]" />
        الإعدادات العامة
      </h1>
      
      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-800/20 p-4 rounded-lg border border-red-700">
          <AlertCircle /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-green-400 bg-green-800/20 p-4 rounded-lg border border-green-700">
          <CheckCircle /> {success}
        </div>
      )}

      {/* --- لوحة تحكم التصميم والبراند --- */}
      <div className="glass-card p-6 md:p-8 rounded-xl shadow-xl border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-4 flex items-center gap-2">
          <Palette size={20} className="text-[#d4af37]" />
          التحكم الكامل بالتصميم والهوية
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* 1. اسم العنوان والشعار */}
          <div className="md:col-span-2 space-y-4">
            <input
              name="title"
              value={settings.title}
              onChange={handleInputChange}
              placeholder="عنوان المسابقة"
              className="w-full p-3 border rounded border-gray-700 bg-gray-800 text-white focus:ring-[#d4af37] focus:border-[#d4af37]"
            />
            <div className="flex items-center gap-2">
                <input
                  name="logo"
                  value={settings.logo}
                  onChange={handleInputChange}
                  placeholder="رابط الشعار (Logo URL)"
                  className="flex-grow p-3 border rounded border-gray-700 bg-gray-800 text-white focus:ring-[#d4af37] focus:border-[#d4af37]"
                />
                {settings.logo && <img src={settings.logo} alt="Logo Preview" className="h-10 w-10 object-contain" />}
            </div>
          </div>
          
          {/* 2. اللون الأساسي */}
          <div className="flex items-center gap-3 glass-card p-3 rounded-lg border border-white/20">
            <Codesandbox size={18} className="text-gray-400" />
            <label className="text-sm text-gray-300">اللون الأساسي</label>
            <input
              type="color"
              name="mainColor"
              value={settings.mainColor}
              onChange={handleInputChange}
              className="w-10 h-10 p-1 border-0 rounded-full cursor-pointer"
            />
          </div>

          {/* 3. اللون الاحتياطي/التوهج */}
          <div className="flex items-center gap-3 glass-card p-3 rounded-lg border border-white/20">
            <Codesandbox size={18} className="text-gray-400" />
            <label className="text-sm text-gray-300">لون التوهج</label>
            <input
              type="color"
              name="highlightColor"
              value={settings.highlightColor}
              onChange={handleInputChange}
              className="w-10 h-10 p-1 border-0 rounded-full cursor-pointer"
            />
          </div>

          {/* 4. الخط العام */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <Type size={18} className="text-gray-400" />
                الخط العام (Font Family)
            </label>
            <select
                name="appFont"
                value={settings.appFont}
                onChange={handleInputChange}
                className="w-full p-3 border rounded border-gray-700 bg-gray-800 text-white focus:ring-[#d4af37] focus:border-[#d4af37]"
            >
                {safeFonts.map(font => <option key={font} value={font}>{font} (مثال)</option>)}
            </select>
          </div>
          
          {/* 5. تفعيل الأسلوب الزجاجي */}
          <div className="md:col-span-2">
            <Toggle
              label="تفعيل الأسلوب الزجاجي (Glassmorphism)"
              enabled={settings.enableGlass}
              onChange={(e) => setSettings(prev => ({...prev, enableGlass: e.target.checked}))}
            />
          </div>

        </div>
      </div>
      {/* --- نهاية لوحة تحكم التصميم --- */}


      {/* إعدادات حالة المسابقة */}
      <div className="glass-card p-6 md:p-8 rounded-xl shadow-xl border border-white/10">
        {/* ... (بقية الحقول الحالية مثل Stage, MaxLinks, Footer Content) ... */}
        <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-4 flex items-center gap-2">
          <Radio size={20} className="text-[#d4af37]" />
          حالة المسابقة (الحملة)
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">مرحلة المسابقة</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['submission', 'voting', 'paused', 'ended'].map(stageValue => (
                <label key={stageValue} className={`p-4 border rounded-lg text-center cursor-pointer transition-all ${settings.stage === stageValue ? 'bg-[var(--color-primary)] text-gray-900 font-bold border-[var(--color-highlight)] shadow-xl' : 'bg-white/10 hover:bg-white/20 border-gray-700'}`}>
                  <input
                    type="radio"
                    name="stage"
                    value={stageValue}
                    checked={settings.stage === stageValue}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  {stageValue === 'submission' && '1. التقديم'}
                  {stageValue === 'voting' && '2. بدء التصويت'}
                  {stageValue === 'paused' && '3. إيقاف مؤقتاً'}
                  {stageValue === 'ended' && '4. إنهاء المسابقة'}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* إعدادات محتوى الفوتر وروابط المشاركة */}
      <div className="glass-card p-6 md:p-8 rounded-xl shadow-xl border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-4 flex items-center gap-2">
          <Edit3 size={20} className="text-[#d4af37]" />
          إعدادات الروابط والمحتوى
        </h2>
        <div className="space-y-6">
            <Toggle
                label="تفعيل حقل البلد"
                enabled={settings.enableCountry}
                onChange={(e) => setSettings(prev => ({...prev, enableCountry: e.target.checked}))}
            />
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">الحد الأقصى لروابط المشاركة</label>
                <select
                name="maxLinks"
                value={settings.maxLinks}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-700 rounded-lg shadow-sm focus:ring-[#d4af37] focus:border-[#d4af37] bg-gray-800 text-white"
                >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                </select>
            </div>
            {['terms', 'about', 'purpose'].map(key => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {key === 'terms' ? 'شروط المسابقة' : key === 'about' ? 'القائمون على المسابقة' : 'لماذا هذه المسابقة؟'}
              </label>
              <textarea
                name={key}
                rows="4"
                value={footerContent[key]}
                onChange={(e) => setFooterContent(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full p-3 border border-gray-700 rounded-lg shadow-sm focus:ring-[#d4af37] focus:border-[#d4af37] bg-gray-800 text-white"
              />
            </div>
            ))}
        </div>
      </div>


      <button
        onClick={handleSave}
        className="flex items-center justify-center gap-2 w-full md:w-auto btn-vote px-6 py-3 rounded-lg shadow-lg"
      >
        <Save size={18} />
        حفظ جميع الإعدادات
      </button>
    </motion.div>
  );
}
```eof

### 2. التعديلات الأساسية لـ App.jsx (لتطبيق الثيم)

هذا التعديل هو الأهم؛ حيث يقرأ الإعدادات الديناميكية ويطبقها على كامل التطبيق عبر متغيرات CSS (CSS Variables).


```javascript:App Router Setup:src/App.jsx
// src/App.jsx
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Award, HelpCircle, Users } from 'lucide-react';
import useSettings from "./hooks/useSettings"; // <-- استيراد الهوك

// Lazy-loaded pages (based on your folder structure)
const Home = lazy(() => import("./pages/Home"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Winners = lazy(() => import("./pages/Winners"));
const SubmissionProfile = lazy(() =>
  import("./pages/SubmissionProfile")
);

// Admin & Dashboard pages
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

// Submissions Management
const Manage = lazy(() => import("./pages/Manage"));
const ManageSubmissions = lazy(() =>
  import("./pages/ManageSubmissions")
);
const Pending = lazy(() => import("./pages/Pending"));
const Approved = lazy(() => import("./pages/Approved"));

// Logs
const AdminLogs = lazy(() => import("./pages/AdminLogs"));
const Logs = lazy(() => import("./pages/Logs"));

// مكون شريط التنقل العلوي - موحد التصميم
const Header = () => (
    <header className="sticky top-0 z-40 w-full bg-black/60 backdrop-blur-md shadow-xl border-b border-gray-700/50">
        <nav className="max-w-6xl mx-auto flex items-center justify-between p-4" dir="rtl">
            
            {/* الشعار */}
            <Link to="/" className="text-2xl font-extrabold text-[var(--color-primary)]">
                تصويت المسابقة
            </Link>

            <div className="flex items-center space-x-6 space-x-reverse text-sm font-semibold">
                <Link to="/" className="text-gray-300 hover:text-[var(--color-highlight)] transition-colors flex items-center gap-2">
                   <Users size={18} /> المشاركات
                </Link>
                <Link to="/winners" className="text-gray-300 hover:text-[var(--color-highlight)] transition-colors flex items-center gap-2">
                    <Award size={18} /> الفائزون
                </Link>
                <Link to="/faq" className="text-gray-300 hover:text-[var(--color-highlight)] transition-colors flex items-center gap-2">
                    <HelpCircle size={18} /> الأسئلة الشائعة
                </Link>
                <Link to="/admin/login" className="text-gray-500 hover:text-gray-300 transition-colors text-xs">
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
        '--color-primary': settings.mainColor || '#d4af37',
        '--color-highlight': settings.highlightColor || '#fde047',
        '--font-family': settings.appFont || 'Cairo, sans-serif',
        // كلاس الـ glass-card يستخدم متغيرات Tailwind (hardcoded)
    };

    return (
        <Router>
            {/* تطبيق المتغيرات على مستوى جذر التطبيق */}
            <div style={dynamicStyle}> 
                <Routes>
                    <Route path="/admin/*" element={<Suspense fallback={<div className="text-white p-10">جاري التحميل...</div>}><AdminRoutes /></Suspense>} />
                    <Route path="/*" element={<PublicRoutes />} />
                </Routes>
            </div>
        </Router>
    );
}

// المسارات العامة (تشمل الهيدر)
const PublicRoutes = () => (
    <Suspense fallback={<div className="text-white p-10 text-center">جاري التحميل...</div>}>
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
```