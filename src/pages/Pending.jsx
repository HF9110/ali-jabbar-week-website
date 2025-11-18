// src/pages/Pending.jsx
import React from "react";
import useSubmissions from "../hooks/useSubmissions";
import { approvePending, rejectPending } from "../lib/firebaseActions";

export default function Pending() {
  const pending = useSubmissions("pending");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">قيد المراجعة</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {pending.map((item) => (
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

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => approvePending(item.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
              >
                قبول
              </button>

              <button
                onClick={() => rejectPending(item.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
              >
                رفض
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
