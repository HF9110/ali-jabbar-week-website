import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase.js'; // (تصحيح) إضافة .js
import { doc, getDoc, setDoc, addDoc, collection, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Save, ArrowLeft, Loader2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { arabCountries } from '../utils/countries.js'; // (جديد)

export default function ManageSubmissions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    country: arabCountries[0].name,
    links: [''], // (جديد) استخدام 'links' بدلاً من 'tiktok'
    thumbnail_url: '',
    votes: 0,
    approved: true,
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditing);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const docRef = doc(db, 'submissions', id);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            // (جديد) التأكد من أن 'links' هي مصفوفة
            setFormData({
              ...data,
              links: Array.isArray(data.links) && data.links.length > 0 ? data.links : [data.tiktok || ''],
            });
          } else {
            setError('المشاركة غير موجودة.');
          }
        })
        .catch(() => setError('فشل في جلب البيانات.'))
        .finally(() => setPageLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
    }));
  };
  
  // (جديد) دوال التحكم بالروابط
  const handleLinkChange = (index, value) => {
    const newLinks = [...formData.links];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, links: newLinks }));
  };

  const addLinkField = () => {
    if (formData.links.length < 3) { // الحد الأقصى 3
      setFormData(prev => ({ ...prev, links: [...prev.links, ''] }));
    }
  };

  const removeLinkField = (index) => {
    setFormData(prev => ({
      ...prev,
      links: formData.links.filter((_, i) => i !== index),
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || (settings.enableCountry && !formData.country) || formData.links.some(l => !l)) {
      setError('الرجاء ملء جميع الحقول المطلوبة (الاسم، البلد، والروابط).');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const dataToSave = {
        ...formData,
        links: formData.links.map(link => link.split('?')[0]), // تنظيف الروابط
      };

      if (isEditing) {
        const docRef = doc(db, 'submissions', id);
        await updateDoc(docRef, dataToSave);
      } else {
        await addDoc(collection(db, 'submissions'), {
          ...dataToSave,
          createdAt: serverTimestamp(),
        });
      }
      navigate('/admin/dashboard/approved');
    } catch (err) {
      console.error(err);
      setError('فشل حفظ المشاركة.');
    } finally {
      setLoading(false);
    }
  };

  // (جديد) جلب الإعدادات لتحديد الحقول
  const [settings, setSettings] = useState({ enableCountry: true });
  useEffect(() => {
    getDoc(doc(db, "contest_settings", "main")).then(docSnap => {
      if (docSnap.exists()) setSettings(docSnap.data());
    });
  }, []);


  if (pageLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={18} />
        الرجوع
      </button>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditing ? 'تعديل المشاركة' : 'إضافة مشاركة جديدة'}
      </h1>

      <div className="bg-white p-8 rounded-lg shadow border border-gray-200">
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-100 p-4 rounded-lg mb-4">
            <AlertCircle /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" required />
          </div>
          
          {settings.enableCountry && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البلد</label>
              <select
                name="country"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={formData.country}
                onChange={handleChange}
              >
                {arabCountries.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              روابط المشاركات (بحد أقصى {settings.maxLinks || 1})
            </label>
            {formData.links.map((link, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input 
                  type="url" 
                  placeholder="https://www.tiktok.com/..." 
                  className="w-full p-2 border border-gray-300 rounded-lg" 
                  value={link} 
                  onChange={e => handleLinkChange(index, e.target.value)} 
                />
                {formData.links.length > 1 && (
                  <button type="button" onClick={() => removeLinkField(index)} className="p-2 text-red-500 hover:text-red-700">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
            {formData.links.length < (settings.maxLinks || 1) && (
              <button 
                type="button" 
                onClick={addLinkField} 
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus size={16} /> إضافة رابط
              </button>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رابط صورة مصغرة (Thumbnail URL)</label>
            <input type="text" name="thumbnail_url" value={formData.thumbnail_url} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عدد الأصوات</label>
            <input type="number" name="votes" value={formData.votes} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="approved" id="approvedCheck" checked={formData.approved} onChange={handleChange} className="h-4 w-4" />
            <label htmlFor="approvedCheck" className="text-sm font-medium text-gray-700">مقبولة (Approved)</label>
          </div>
          
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            {isEditing ? 'حفظ التعديلات' : 'إضافة المشاركة'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}