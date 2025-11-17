import { useState, useEffect } from "react";
import { db } from "../firebase/firebase.js"; // (تصحيح) إضافة .js
import { doc, updateDoc, increment } from "firebase/firestore";
import { arabCountries } from "../utils/countries.js"; // (جديد)
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// (جديد) دالة لجلب العلم
const getFlag = (countryName) => {
  const country = arabCountries.find(c => c.name === countryName);
  return country ? country.flag : '🌎';
};

export default function Modal({ submission, onClose }) {
  const [checked, setChecked] = useState(false);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState("");
  // (جديد) لتصفح الروابط
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0);

  // (جديد) نظام منع تكرار التصويت
  useEffect(() => {
    const votedList = JSON.parse(localStorage.getItem('votedSubmissions') || '[]');
    if (votedList.includes(submission.id)) {
      setVoted(true);
    }
  }, [submission.id]);

  const videoLinks = Array.isArray(submission.links) && submission.links.length > 0 
    ? submission.links 
    : [submission.tiktok]; // دعم النظام القديم
    
  const countryFlag = submission.country ? getFlag(submission.country) : '';

  const handleVote = async () => {
    setError("");
    if (!checked) return setError("الرجاء التأكيد أنك لست روبوت.");
    if (voted) return;

    try {
      const docRef = doc(db, "submissions", submission.id);
      await updateDoc(docRef, { votes: increment(1) });
      setVoted(true);
      // (جديد) تخزين التصويت في المتصفح
      const votedList = JSON.parse(localStorage.getItem('votedSubmissions') || '[]');
      votedList.push(submission.id);
      localStorage.setItem('votedSubmissions', JSON.stringify(votedList));
    } catch (e) {
      console.error("Error voting:", e);
      setError("حدث خطأ أثناء التصويت.");
    }
  };

  // (جديد) دوال تصفح الفيديوهات
  const nextVideo = () => setCurrentLinkIndex((i) => (i + 1) % videoLinks.length);
  const prevVideo = () => setCurrentLinkIndex((i) => (i - 1 + videoLinks.length) % videoLinks.length);
  
  // (جديد) استخراج ID الفيديو من الرابط
  const getTikTokEmbedUrl = (url) => {
    try {
      // استخراج ID الفيديو من الرابط (يدعم الروابط العادية وروابط الموبايل)
      const match = url.match(/(?:tiktok\.com\/.*\/video\/|vm\.tiktok\.com\/)([0-9a-zA-Z]+)/);
      if (match && match[1]) {
        return `https://www.tiktok.com/embed/v2/${match[1]}`;
      }
    } catch (e) { console.error("Invalid URL:", url); }
    return ""; // رابط خاطئ
  };
  
  const embedUrl = getTikTokEmbedUrl(videoLinks[currentLinkIndex]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl w-full max-w-lg relative border border-white/20 shadow-2xl">
        <button onClick={onClose} className="absolute top-3 right-3 text-white bg-black/30 rounded-full p-1 hover:bg-black/50 transition-colors z-20">
          <X size={24} />
        </button>
        
        <div className="w-full aspect-[9/16] mb-4 bg-black rounded-lg overflow-hidden relative">
          {embedUrl ? (
            <iframe 
              src={embedUrl}
              className="w-full h-full" 
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              scrolling="no"
            ></iframe>
          ) : (
             <div className="w-full h-full flex items-center justify-center text-white p-4 text-center">
               رابط الفيديو غير صالح أو لا يمكن عرضه.
             </div>
          )}
          
          {/* (جديد) أزرار تصفح */}
          {videoLinks.length > 1 && (
            <>
              <button onClick={prevVideo} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextVideo} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50">
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {currentLinkIndex + 1} / {videoLinks.length}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white">{submission.name}</h3>
          {submission.country && (
            <p className="text-xl" title={submission.country}>{countryFlag}</p>
          )}
        </div>
        
        {error && <p className="text-red-400 my-2">{error}</p>}
        {voted && <p className="text-green-400 my-2">شكراً لتصويتك!</p>}

        <div className="flex items-center mt-4">
          <input 
            type="checkbox" 
            id="robotCheckModal"
            checked={checked} 
            onChange={e=>setChecked(e.target.checked)} 
            className="mr-2 w-5 h-5"
          />
          <label htmlFor="robotCheckModal" className="text-white text-sm">أنا لست روبوت</label>
        </div>
        
        <button 
          onClick={handleVote} 
          className="bg-green-600 text-white p-3 rounded-lg mt-4 w-full hover:bg-green-700 transition-colors font-bold disabled:bg-gray-500 disabled:cursor-not-allowed" 
          disabled={!checked || voted}
        >
          {voted ? "تم التصويت" : "صوّت الآن"}
        </button>
      </div>
    </div>
  );
}