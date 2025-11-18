// src/components/Footer.jsx
import React, { useState } from "react";
import GlobalModal from "./GlobalModal.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";

export default function Footer() {
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", body: "" });

  const openFromKey = async (key) => {
    try {
      const ref = doc(db, "contest_settings", "footer");
      const snap = await getDoc(ref);
      const data = snap.exists() ? snap.data() : {};
      const map = {
        terms: "شروط المسابقة",
        about: "القائمون",
        purpose: "لماذا هذه المسابقة؟",
      };
      setModalContent({ title: map[key] || "معلومة", body: data[key] || "لا يوجد محتوى حالياً." });
      setOpen(true);
    } catch (err) {
      setModalContent({ title: "خطأ", body: "تعذر جلب المحتوى الآن." });
      setOpen(true);
    }
  };

  return (
    <>
      <footer className="w-full border-t border-white/10 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} مسابقة تيك توك. جميع الحقوق محفوظه.
          </div>
          <div className="flex items-center gap-4 text-sm">
            <button onClick={() => openFromKey("terms")} className="hover:underline">شروط المسابقة</button>
            <button onClick={() => openFromKey("about")} className="hover:underline">القائمون</button>
            <button onClick={() => openFromKey("purpose")} className="hover:underline">لماذا؟</button>
          </div>
        </div>
      </footer>

      <GlobalModal isOpen={open} title={modalContent.title} onClose={() => setOpen(false)}>
        <div style={{ whiteSpace: "pre-line" }} className="text-gray-200">{modalContent.body}</div>
      </GlobalModal>
    </>
  );
}
