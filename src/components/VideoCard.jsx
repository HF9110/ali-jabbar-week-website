import { useState } from "react";
// --- المسار الصحيح: بدون لاحقة للمكونات ---
import Modal from "./Modal";

export default function VideoCard({ submission }) {
  const [open, setOpen] = useState(false);

  if (!submission) return null; // حماية إضافية

  return (
    <>
      <div
        className="bg-white/10 backdrop-blur-lg rounded p-2 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <img
          src={submission.thumbnail_url || "https://via.placeholder.com/150"}
          alt={submission.name || "Submission"}
          className="w-full rounded"
        />
        <p className="mt-2 text-white">{submission.name} - {submission.country}</p>
      </div>
      {open && <Modal submission={submission} onClose={() => setOpen(false)} />}
    </>
  );
}