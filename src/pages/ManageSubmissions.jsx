// src/pages/ManageSubmissions.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Save, PlusCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { arabCountries } from "../utils/countries";

export default function ManageSubmissions() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [links, setLinks] = useState([""]);
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const isEdit = Boolean(id);

  // Fetch old data if editing
  useEffect(() => {
    if (!isEdit) {
      setFetching(false);
      return;
    }

    const fetchData = async () => {
      try {
        const ref = doc(db, "submissions", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setError("المشاركة غير موجودة.");
          setFetching(false);
          return;
        }

        const data = snap.data();
        setName(data.name || "");
        setCountry(data.country || "");
        setThumbnail(data.thumbnail_url || "");
        setLinks(Array.isArray(data.links) ? data.links : [data.tiktok || ""]);

      } catch (e) {
        setError("خطأ في جلب بيانات المشاركة.");
      }

      setFetching(false);
    };
    fetchData();
  }, [id, isEdit]);

  const handleLinkChange = (index, value) => {
    const updated = [...links];
    updated[index] = value;
    setLinks(updated);
  };

  const handleAddLink = () => {
    setLinks([...links, ""]);
  };

  const handleRemoveLink = (index) => {
    if (links.length === 1) return;
    const updated = [...links];
    updated.splice(index, 1);
    setLinks(updated);
  };

  const validate = () => {
    if (!name.trim()) return "أدخل اسم الحساب.";
    if (!country) return "اختر الدولة.";
    if (links.some(l => !l.trim())) return "يرجى إدخال كل روابط الفيديو أو حذف الحقول الفارغة.";
    if (thumbnail && !thumbnail.startsWith("http")) return "رابط الصورة المصغرة يجب أن يبدأ بـ http أو https.";
    return "";
  };

  const handleSave = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setLoading(true);

    try {
      if (isEdit) {
        const ref = doc(db, "submissions", id);
        await updateDoc(ref, {
          name,
          country,
          links,
          thumbnail_url: thumbnail,
        });
      } else {
        await addDoc(collection(db, "submissions"), {
          name,
          country,
          links,
          thumbnail_url: thumbnail,
          votes: 0,
          approved: false,
          created_at: Date.now(),
        });
      }

      navigate("/admin/dashboard/approved");

    } catch (err) {
      console.error(err);
      setError("فشل حفظ البيانات.");
    }

    setLoading(false);
  };

  if (fetching) {
    return <div className="flex items-center justify-center p-10">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">
          {isEdit ? "تعديل مشاركة" : "إضافة مشاركة جديدة"}
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded"
        >
          <ArrowLeft size={18} /> رجوع
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-red-100 text-red-700 rounded">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Form */}
      <div className="space-y-4">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">اسم الحساب</label>
          <input
            className="w-full p-3 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: TikTokUser"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium mb-1">الدولة</label>
          <select
            className="w-full p-3 border rounded"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">اختر البلد</option>
            {arabCountries.map(c => (
              <option key={c.name} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Links */}
        <div>
          <label className="block text-sm font-medium mb-1">روابط الفيديو</label>

          {links.map((link, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="flex-1 p-3 border rounded"
                value={link}
                onChange={(e) => handleLinkChange(i, e.target.value)}
                placeholder="https://www.tiktok.com/..."
              />
              {links.length > 1 && (
                <button
                  onClick={() => handleRemoveLink(i)}
                  className="px-3 py-2 bg-red-500 text-white rounded"
                >
                  حذف
                </button>
              )}
            </div>
          ))}

          <button
            onClick={handleAddLink}
            className="flex items-center gap-2 mt-2 bg-blue-600 text-white px-3 py-2 rounded"
          >
            <PlusCircle size={18} /> إضافة رابط
          </button>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium mb-1">الصورة المصغرة</label>
          <input
            className="w-full p-3 border rounded"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://image..."
          />

          {thumbnail && (
            <div className="mt-3 w-40 h-56 border rounded overflow-hidden">
              <img
                src={thumbnail}
                alt="thumb preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/300x400/EEE/AAA?text=Invalid+Image";
                }}
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save />}
          حفظ
        </button>
      </div>
    </div>
  );
}
