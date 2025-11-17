import React, { useState } from 'react';
import { db } from '../firebase/firebase.js'; // (تصحيح) إضافة .js
import { doc, updateDoc } from 'firebase/firestore';
import { Loader2, Save, AlertCircle } from 'lucide-react';

export default function ApproveModal({ submission, onClose }) {
  // (جديد) محاولة تخمين الصورة المصغرة من أول رابط
  const defaultThumbnail = submission.thumbnail_url || '';
  const [thumbnail, setThumbnail] = useState(defaultThumbnail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApprove = async () => {
    if (!thumbnail) {
      setError('الرجاء إضافة رابط صورة مصغرة.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const docRef = doc(db, 'submissions', submission.id);
      await updateDoc(docRef, { 
        approved: true,
        thumbnail_url: thumbnail 
      });
      onClose(); // إغلاق النافذة
    } catch (err) {
      console.error("Failed to approve:", err);
      setError('فشل في الموافقة على المشاركة.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-4">الموافقة وإضافة صورة مصغرة</h2>
        <p className="text-sm text-gray-600 mb-4">
          أنت توافق على مشاركة: <strong>{submission.name}</strong>
        </p>
        
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-100 p-3 rounded-lg mb-4">
            <AlertCircle size={18} /> {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            رابط الصورة المصغرة (Thumbnail URL)
          </label>
          <input
            type="url"
            placeholder="https://.../image.jpg"
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            يمكنك جلبها من رابط تيك توك أو رفعها على موقع مثل imgur.com
          </p>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-gray-400"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={18} />}
            موافقة وحفظ
          </button>
        </div>
      </div>
    </div>
  );
}