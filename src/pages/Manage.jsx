// src/pages/Manage.jsx
import React from "react";
import useSubmissions from "../hooks/useSubmissions";
import { approvePending, rejectPending } from "../lib/firebaseActions";

export default function Manage() {
  const submissions = useSubmissions("approved");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">إدارة المشاركات</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {submissions.map((item) => (
          <div
            key={item.id}
            className="bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/20"
          >
            <img
              src={item.thumbnail_url}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />

            <h2 className="text-white text-xl">{item.name}</h2>
            <p className="text-gray-300">{item.country}</p>

            <p className="text-green-300 mt-2">الأصوات: {item.votes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
