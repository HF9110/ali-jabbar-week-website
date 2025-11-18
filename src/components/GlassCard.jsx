import { useState } from "react";
import { db } from "../firebase/firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { arabCountries } from "../utils/countries.js";

export default function GlassCard({ settings }) {
  const currentSettings = settings || { enableCountry: true, maxLinks: 1 };
  
  const [name, setName] = useState("");
  const [country, setCountry] = useState(arabCountries[0].name); 
  const [links, setLinks] = useState([""]);
  const [checked, setChecked] = useState(false);
  
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleLinkChange = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };
  
  const addLinkField = () => {
    const maxLinks = Math.min(currentSettings.maxLinks || 1, 3); 
    if (links.length < maxLinks) {
      setLinks([...links, ""]);
    }
  };

  const removeLinkField = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!name) return setError("الرجاء إدخال اسم الحساب.");
    if (currentSettings.enableCountry && country === arabCountries[0].name) return setError("الرجاء اختيار بلدك من القائمة.");
    if (links.some(link => !link)) return setError("الرجاء ملء جميع حقول الروابط.");
    if (!checked) return setError("الرجاء التأكيد أنك لست روبوت.");

    setLoading(true);
    try {
      await addDoc(collection(db, "submissions"), {
        name,
        country: currentSettings.enableCountry && country !== arabCountries[0].name ? country : "",
        links: links.map(link => link.split('?')[0]),
        votes: 0,
        approved: false,
        createdAt: serverTimestamp()
      });
      setSuccess("تم ارسال مشاركتك بنجاح!");
      setName(""); setCountry(arabCountries[0].name); setLinks([""]); setChecked(false);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ. الرجاء المحاولة مرة أخرى.");
    }
    setLoading(false);
  };

  return (
    <motion.div 
      className="glass-card bg-white/5 backdrop-blur-2xl p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-white mb-6 text-center">شارك الآن!</h2>
      {success && <p className="text-green-300 bg-green-900/50 p-3 rounded-lg mb-4 text-center">{success}</p>}
      {error && <p className="text-red-300 bg-red-900/50 p-3 rounded-lg mb-4 text-center">{error}</p>}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* حقل الاسم */}
        <div>
          <label className="text-sm text-gray-300 mb-1 block">اسم الحساب</label>
          <input 
            type="text" 
            placeholder="اسم حسابك" 
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50" 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            disabled={loading}
          />
        </div>

        {/* حقل البلدان (اختياري) */}
        {currentSettings.enableCountry && (
          <div>
            <label className="text-sm text-gray-300 mb-1 block">البلد</label>
            <select
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              value={country}
              onChange={e => setCountry(e.target.value)}
              disabled={loading}
            >
              {arabCountries.map(c => (
                <option key={c.name} value={c.name} className="text-black">
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* حقول الروابط الديناميكية */}
        <div>
          <label className="text-sm text-gray-300 mb-1 block">
            {links.length > 1 ? "روابط المشاركات" : "رابط المشاركة"} (رابط فيديو تيك توك)
          </label>
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input 
                type="url" 
                placeholder="https://www.tiktok.com/..." 
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50" 
                value={link} 
                onChange={e => handleLinkChange(index, e.target.value)} 
                disabled={loading}
              />
              {links.length > 1 && (
                <button type="button" onClick={() => removeLinkField(index)} className="p-2 text-red-400 hover:text-red-300" disabled={loading}>
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
          {/* السماح بإضافة حتى 3 روابط (أو حسب الإعدادات) */}
          {links.length < Math.min(currentSettings.maxLinks || 1, 3) && (
            <button 
              type="button" 
              onClick={addLinkField} 
              className="text-sm text-blue-300 hover:text-blue-200 flex items-center gap-1"
              disabled={loading}
            >
              <Plus size={16} /> إضافة رابط تصميم آخر
            </button>
          )}
        </div>

        {/* زر أنا لست روبوت */}
        <div className="flex items-center mt-4">
          <input 
            type="checkbox" 
            id="robotCheck"
            checked={checked} 
            onChange={e=>setChecked(e.target.checked)} 
            className="mr-2 w-5 h-5"
            disabled={loading}
          />
          <label htmlFor="robotCheck" className="text-white text-sm">أنا لست روبوت</label>
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-600 text-white p-3 rounded-lg mt-2 hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg disabled:bg-gray-500"
          disabled={loading || !checked}
        >
          {loading ? "جاري الإرسال..." : "المشاركة"}
        </button>
      </form>
    </motion.div>
  );
}