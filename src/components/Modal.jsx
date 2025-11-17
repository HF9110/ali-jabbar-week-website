import { useState } from "react";
// (تصحيح) المسار يجب أن يخرج من 'components' أولاً
import { db } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function Modal({ submission, onClose }) {
  const [checked, setChecked] = useState(false);
  const [voted, setVoted] = useState(false);

  const handleVote = async () => {
    if (!checked || voted) return;
    const docRef = doc(db, "submissions", submission.id);
    await updateDoc(docRef, { votes: submission.votes + 1 });
    setVoted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-white">X</button>
        <iframe src={`https://www.tiktok.com/embed/${submission.tiktok}`} className="w-full h-64" frameBorder="0"></iframe>
        <p className="text-white mt-2">{submission.name} - {submission.country}</p>
        <div className="flex items-center mt-2">
          <input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)} className="mr-2"/>
          <span className="text-white text-sm">أنا لست روبوت</span>
        </div>
        <button onClick={handleVote} className="bg-green-600 p-2 rounded mt-2 w-full hover:bg-blue-700" disabled={!checked || voted}>
          {voted ? "تم التصويت" : "صوت"}
        </button>
      </div>
    </div>
  );
}