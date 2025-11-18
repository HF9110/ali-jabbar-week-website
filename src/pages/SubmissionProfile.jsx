// src/pages/SubmissionProfile.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import useSubmissions from "../hooks/useSubmissions";
import ConfirmVoteModal from "../components/ConfirmVoteModal";

export default function SubmissionProfile() {
  const { id } = useParams();
  const list = useSubmissions("all");
  const data = list.find(x => x.id === id);

  const [open, setOpen] = React.useState(false);

  if (!data) {
    return <div className="text-center text-white p-10">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Thumb */}
      <div className="rounded-xl overflow-hidden shadow-xl mb-4">
        <img
          src={data.thumbnail_url}
          alt={data.name}
          className="w-full h-80 object-cover"
        />
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">{data.name}</h1>
      <p className="text-gray-300 mb-2">{data.country}</p>

      <p className="text-gray-400 mb-4">الأصوات: {data.votes}</p>

      <button
        onClick={() => setOpen(true)}
        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
      >
        صوّت الآن
      </button>

      <h2 className="text-xl font-bold mt-6 text-white">روابط الفيديو</h2>

      <ul className="mt-3 text-blue-300">
        {(data.links || []).map((l, i) => (
          <li key={i}>
            <a href={l} target="_blank" className="underline">
              رابط رقم {i + 1}
            </a>
          </li>
        ))}
      </ul>

      <ConfirmVoteModal
        open={open}
        onClose={() => setOpen(false)}
        userId={data.id}
        userName={data.name}
      />
    </div>
  );
}
