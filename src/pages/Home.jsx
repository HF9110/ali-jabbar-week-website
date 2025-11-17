import React, { useEffect, useState } from "react";
// (تصحيح) إضافة اللواحق .jsx و .js
import Header from "../components/Header.jsx";
import GlassCard from "../components/GlassCard.jsx";
import Podium from "../components/Podium.jsx";
import Carousel from "../components/Carousel.jsx";
import VideoCard from "../components/VideoCard.jsx";
import { db } from "../firebase/firebase.js"; 
import { doc, collection, onSnapshot, query, where } from "firebase/firestore";

// رسائل لحالات التصويت المختلفة
const VotingStatusMessage = ({ status }) => {
  const messages = {
    paused: "التصويت متوقف حالياً. سيعود قريباً!",
    ended: "انتهت المسابقة! شكراً لمشاركتكم.",
  };
  return (
    <div className="flex justify-center items-center" style={{minHeight: '80vh'}}>
      <p className="text-white text-2xl font-bold p-6 bg-white/10 rounded-lg backdrop-blur-md">
        {messages[status] || "المسابقة غير متاحة حالياً"}
      </p>
    </div>
  );
};

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // (تم إصلاح الخلل) جلب إعدادات المسابقة بشكل فوري
  useEffect(() => {
    const docRef = doc(db, "contest_settings", "main");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings(data);
        document.title = data.title || "مسابقة تيك توك";
      } else {
        // (جديد) تعيين قيم افتراضية إذا لم توجد إعدادات
        setSettings({ stage: "submission", title: "مسابقة تيك توك", enableCountry: true, maxLinks: 1 });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching settings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // جلب المشاركات (يعتمد الآن على 'settings')
  useEffect(() => {
    if (!settings || settings.stage !== 'voting') {
      setSubmissions([]);
      return; 
    }

    setLoading(true);
    const q = query(collection(db, "submissions"), where("approved", "==", true));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      // ترتيب النتائج حسب الأصوات
      data.sort((a, b) => (b.votes || 0) - (a.votes || 0));
      setSubmissions(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching submissions:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [settings]);

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  // (جديد) عرض المحتوى بناءً على حالة المسابقة
  const renderContent = () => {
    switch (settings.stage) {
      case 'submission':
        return (
          <div className="flex-1 flex items-center justify-center w-full">
            <GlassCard settings={settings} />
          </div>
        );
      case 'voting':
        return submissions.length > 0 ? (
          <>
            <h2 className="text-center text-3xl font-bold text-white mb-6">النتائج المباشرة</h2>
            {/* حاوية النتائج (المراكز الأولى) */}
            <div className="bg-black/20 rounded-xl p-4 md:p-8 w-full max-w-4xl mx-auto mb-8 shadow-2xl">
                <h3 className="text-center text-xl font-bold text-gray-300 mb-6">حاوية النتائج (المراكز الأولى)</h3>
                <Podium submissions={submissions} />
            </div>
            {/* حاوية المشاركات */}
            <div className="w-full max-w-6xl mx-auto border-t border-white/20 mt-12 pt-6">
              <h3 className="text-center text-2xl font-bold text-white mb-6">المشاركات المتبقية (دوار)</h3>
              <Carousel submissions={submissions} />
              <h3 className="text-center text-2xl font-bold text-white mt-10 mb-6">جميع المشاركات (الصفحات)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {submissions.map(sub => (
                  <VideoCard key={sub.id} submission={sub} />
                ))}
              </div>
               {/* (مطلوب) مكان الفوتر - يظهر هنا */}
               <Footer /> 
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center" style={{minHeight: '80vh'}}>
            <p className="text-white text-lg">لا توجد مشاركات (مقبولة) حالياً</p>
          </div>
        );
      case 'paused':
      case 'ended':
        return <VotingStatusMessage status={settings.stage} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-black text-white p-4">
      <Header />
      {renderContent()}
    </div>
  );
}

// (جديد) مكون الفوتر (Footer) - يحتاج إلى إضافة محتوى النافذة (Modal)
const FooterLink = ({ title, contentKey }) => {
    // (ملاحظة: يحتاج هذا إلى مكون نافذة عام (Global Modal Component) لإظهار المحتوى)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [footerContent, setFooterContent] = useState('');

    useEffect(() => {
        // جلب محتوى الفوتر من الإعدادات
        const docRef = doc(db, "contest_settings", "footer");
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists() && docSnap.data()[contentKey]) {
                setFooterContent(docSnap.data()[contentKey]);
            }
        });
        return () => unsubscribe();
    }, [contentKey]);

    const displayModal = () => {
        if (footerContent) {
            // (ملاحظة: يجب إضافة مكون Modal هنا)
            alert(`${title}:\n\n${footerContent}`); 
        } else {
            alert(`المحتوى لـ ${title} غير متوفر حالياً في الإعدادات.`);
        }
    };
    
    return (
        <button 
            onClick={displayModal}
            className="hover:text-white transition-colors underline"
        >
            {title}
        </button>
    );
};

const Footer = () => (
    <div className="w-full max-w-6xl mx-auto border-t border-white/20 mt-12 pt-6 pb-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-gray-400">
            <FooterLink title="شروط المسابقة" contentKey="terms" />
            <span className="hidden md:block">|</span>
            <FooterLink title="القائمون على المسابقة" contentKey="about" />
            <span className="hidden md:block">|</span>
            <FooterLink title="لماذا هذه المسابقة؟" contentKey="purpose" />
        </div>
        <p className="text-center text-xs mt-4 text-gray-500">
            &copy; 2025. جميع الحقوق محفوظة لـ {settings.title || 'مسابقة تيك توك'}.
        </p>
    </div>
);