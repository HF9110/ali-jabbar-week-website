import { useEffect, useState } from "react";
import { db } from "../firebase/firebase.js"; // (تصحيح) إضافة .js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AlertCircle, Save, CheckCircle, Palette, Settings as SettingsIcon, Shield, Radio, Edit3 } from 'lucide-react';
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
    // (جديد) حالة الحملة
    stage: "submission", // submission, voting, paused, ended
    // (جديد) إعدادات التصميم
    title: "مسابقة تيك توك",
    logo: "",
    // (جديد) إعدادات استمارة التقديم
    enableCountry: true,
    maxLinks: 1, // 1, 2, or 3
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, "contest_settings", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // (جديد) دمج الإعدادات المحفوظة مع الافتراضية لضمان وجود كل الحقول
          setSettings(prev => ({ ...prev, ...docSnap.data() }));
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
      const docRef = doc(db, "contest_settings", "main");
      // (جديد) تحويل maxLinks إلى رقم
      await setDoc(docRef, {
        ...settings,
        maxLinks: Number(settings.maxLinks)
      }, { merge: true });
      setSuccess("تم حفظ الإعدادات بنجاح!");
      document.title = settings.title;
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("فشل في حفظ الإعدادات.");
    }
  };

  // (جديد) دالة موحدة لتحديث الـ state
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  if (loading) {
    return <p className="text-gray-600">جاري تحميل الإعدادات...</p>;
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

      {/* (جديد) إعدادات حالة المسابقة */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
          <Radio size={20} />
          حالة المسابقة (الحملة)
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">مرحلة المسابقة</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* (جديد) الحالات التي طلبتها */}
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
                  {stageValue === 'paused' && '3. إيقاف مؤقت'}
                  {stageValue === 'ended' && '4. إنهاء المسابقة'}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* (جديد) إعدادات استمارة التقديم */}
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

      {/* إعدادات التصميم */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
          <Palette size={20} />
          إعدادات تصميم الموقع
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الموقع (يظهر في الهيدر)</label>
            <input
              type="text"
              name="title"
              value={settings.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رابط الشعار (Logo URL)</label>
            <input
              type="text"
              name="logo"
              value={settings.logo}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
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