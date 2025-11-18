import { useEffect, useState } from "react";
import { db } from "../firebase/firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  AlertCircle,
  Save,
  CheckCircle,
  Palette,
  Radio,
  Edit3,
  Loader2,
  Settings as SettingsIcon,
  Type,
  Codesandbox,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// قائمة خطوط آمنة شائعة
const safeFonts = ["Cairo", "Arial", "Tahoma", "Times New Roman", "Inter"];

const Toggle = ({ label, enabled, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer p-4 glass-card rounded-lg border border-white/10">
    <span className="text-sm font-medium text-gray-300">{label}</span>
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={enabled}
        onChange={onChange}
      />
      {/* استخدام متغيرات CSS لتطبيق اللون الأساسي */}
      <div
        className={`block w-14 h-8 rounded-full ${
          enabled ? "bg-[var(--color-primary)] shadow-lg" : "bg-gray-700"
        }`}
      ></div>
      <div
        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
          enabled ? "translate-x-6" : ""
        }`}
      ></div>
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
    mainColor: "#d4af37", // اللون الأساسي (الذهبي)
    highlightColor: "#fde047", // لون التوهج (الذهبي الفاتح)
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

        const [mainSnap, footerSnap] = await Promise.all([
          getDoc(mainDocRef),
          getDoc(footerDocRef),
        ]);

        if (mainSnap.exists()) {
          setSettings((prev) => ({ ...prev, ...mainSnap.data() }));
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

      // حفظ الإعدادات الديناميكية
      await Promise.all([
        setDoc(
          mainDocRef,
          { ...settings, maxLinks: Number(settings.maxLinks) },
          { merge: true }
        ),
        setDoc(footerDocRef, footerContent, { merge: true }),
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
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
              className="w-full p-3 border rounded border-gray-700 bg-gray-800 text-white focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            />
            <div className="flex items-center gap-2">
              <input
                name="logo"
                value={settings.logo}
                onChange={handleInputChange}
                placeholder="رابط الشعار (Logo URL)"
                className="flex-grow p-3 border rounded border-gray-700 bg-gray-800 text-white focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              />
              {settings.logo && (
                <img
                  src={settings.logo}
                  alt="Logo Preview"
                  className="h-10 w-10 object-contain"
                />
              )}
            </div>
          </div>

          {/* 2. اللون الأساسي (Primary Color) */}
          <div className="flex items-center gap-3 glass-card p-3 rounded-lg border border-white/20">
            <Codesandbox size={18} className="text-gray-400" />
            <label className="text-sm text-gray-300">اللون الأساسي (Hex)</label>
            <input
              type="color"
              name="mainColor"
              value={settings.mainColor}
              onChange={handleInputChange}
              className="w-10 h-10 p-1 border-0 rounded-full cursor-pointer"
            />
          </div>

          {/* 3. لون التوهج (Highlight Color) */}
          <div className="flex items-center gap-3 glass-card p-3 rounded-lg border border-white/20">
            <Codesandbox size={18} className="text-gray-400" />
            <label className="text-sm text-gray-300">لون التوهج (Hex)</label>
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
              className="w-full p-3 border rounded border-gray-700 bg-gray-800 text-white focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            >
              {safeFonts.map((font) => (
                <option key={font} value={font}>
                  {font} (مثال)
                </option>
              ))}
            </select>
          </div>

          {/* 5. تفعيل الأسلوب الزجاجي */}
          <div className="md:col-span-2">
            <Toggle
              label="تفعيل الأسلوب الزجاجي (Glassmorphism)"
              enabled={settings.enableGlass}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  enableGlass: e.target.checked,
                }))
              }
            />
          </div>
        </div>
      </div>
      {/* --- نهاية لوحة تحكم التصميم --- */}

      {/* إعدادات حالة المسابقة */}
      <div className="glass-card p-6 md:p-8 rounded-xl shadow-xl border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-4 flex items-center gap-2">
          <Radio size={20} className="text-[#d4af37]" />
          حالة المسابقة (الحملة)
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              مرحلة المسابقة
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["submission", "voting", "paused", "ended"].map((stageValue) => (
                <label
                  key={stageValue}
                  className={`p-4 border rounded-lg text-center cursor-pointer transition-all ${
                    settings.stage === stageValue
                      ? "bg-[var(--color-primary)] text-gray-900 font-bold border-[var(--color-highlight)] shadow-xl"
                      : "bg-white/10 hover:bg-white/20 border-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="stage"
                    value={stageValue}
                    checked={settings.stage === stageValue}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  {stageValue === "submission" && "1. التقديم"}
                  {stageValue === "voting" && "2. بدء التصويت"}
                  {stageValue === "paused" && "3. إيقاف مؤقتاً"}
                  {stageValue === "ended" && "4. إنهاء المسابقة"}
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
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                enableCountry: e.target.checked,
              }))
            }
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              الحد الأقصى لروابط المشاركة
            </label>
            <select
              name="maxLinks"
              value={settings.maxLinks}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-700 rounded-lg shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-800 text-white"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
          {["terms", "about", "purpose"].map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {key === "terms"
                  ? "شروط المسابقة"
                  : key === "about"
                  ? "القائمون على المسابقة"
                  : "لماذا هذه المسابقة؟"}
              </label>
              <textarea
                name={key}
                rows="4"
                value={footerContent[key]}
                onChange={(e) =>
                  setFooterContent((prev) => ({
                    ...prev,
                    [key]: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-700 rounded-lg shadow-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-gray-800 text-white"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="flex items-center justify-center gap-2 w-full md:w-auto btn-vote px-6 py-3 rounded-lg shadow-lg"
        style={{
          backgroundColor: settings.mainColor,
          color: settings.mainColor ? "black" : "white",
        }}
      >
        <Save size={18} />
        حفظ جميع الإعدادات
      </button>
    </motion.div>
  );
}
