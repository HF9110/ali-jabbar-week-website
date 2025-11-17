import { useState } from "react";
import Modal from "./Modal.jsx";

export default function VideoCard({ submission }) {
  const [open, setOpen] = useState(false);

  if (!submission) return null;

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