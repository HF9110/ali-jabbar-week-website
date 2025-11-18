import { useEffect, useState } from "react";
import { db } from "../firebase/firebase.js"; // (تصحيح) إضافة .js
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { AlertCircle, Save, CheckCircle, Palette, Settings as SettingsIcon, Shield, Radio, Edit3, Loader2 } from 'lucide-react';
import { motion } from "framer-motion";

// (جديد) مفتاح تبديل (Toggle)
const Toggle = ({ label, enabled, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg border border-gray-200">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={enabled} onChange={onChange} />
      <div className={`block w-14 h-8 rounded-full ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
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
  });
  const [footerContent, setFooterContent] = useState({
    terms: "أدخل شروط المسابقة هنا.",
    about: "أدخل معلومات القائمين هنا.",
    purpose: "أدخل محتوى لماذا هذه المسابقة هنا.",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // جلب الإعدادات (العامة والفوتر)
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
      
      // حفظ المستندين في وقت واحد
      await Promise.all([
        setDoc(mainDocRef, { ...settings, maxLinks: Number(settings.maxLinks) }, { merge: true }),
        setDoc(footerDocRef, footerContent, { merge: true })
      ]);

      setSuccess("تم حفظ الإعدادات بنجاح!");
      document.title = settings.title;
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("فشل في حفظ الإعدادات.");
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
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-3xl mx-auto space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-gray-800">الإعدادات</h1>
      
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-100 p-4 rounded-lg">
          <AlertCircle /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-green-600 bg-green-100 p-4 rounded-lg">
          <CheckCircle /> {success}
        </div>
      )}

      {/* إعدادات حالة المسابقة */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
          <Radio size={20} />
          حالة المسابقة (الحملة)
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">مرحلة المسابقة</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['submission', 'voting', 'paused', 'ended'].map(stageValue => (
                <label key={stageValue} className={`p-4 border rounded-lg text-center cursor-pointer transition-all ${settings.stage === stageValue ? 'bg-blue-600 text-white border-blue-700 shadow-lg' : 'bg-gray-50 hover:bg-gray-100'}`}>
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

      {/* إعدادات استمارة التقديم */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
          <Edit3 size={20} />
          إعدادات استمارة التقديم
        </h2>
        <div className="space-y-6">
          <Toggle
            label="تفعيل حقل البلد"
            enabled={settings.enableCountry}
            onChange={(e) => setSettings(prev => ({...prev, enableCountry: e.target.checked}))}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الحد الأقصى لروابط المشاركة</label>
            <select
              name="maxLinks"
              value={settings.maxLinks}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
        </div>
      </div>

      {/* إعدادات محتوى الفوتر */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
          <Palette size={20} />
          محتوى الروابط السفلية (الفوتر)
        </h2>
        <div className="space-y-6">
          {['terms', 'about', 'purpose'].map(key => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {key === 'terms' ? 'شروط المسابقة' : key === 'about' ? 'القائمون على المسابقة' : 'لماذا هذه المسابقة؟'}
              </label>
              <textarea
                name={key}
                rows="4"
                value={footerContent[key]}
                onChange={(e) => setFooterContent(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="flex items-center justify-center gap-2 w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
      >
        <Save size={18} />
        حفظ جميع الإعدادات
      </button>
    </motion.div>
  );
}