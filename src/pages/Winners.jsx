// src/pages/Winners.jsx
import React from "react";
import useSubmissions from "../hooks/useSubmissions";

export default function Winners() {
  const list = useSubmissions("approved");

  const sorted = [...list].sort((a, b) => b.votes - a.votes).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">

      <h1 className="text-3xl font-bold text-white mb-8">الفائزون</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {sorted.map((item, index) => (
          <div
            key={item.id}
            className="p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20"
          >
            <h2 className="text-xl font-bold text-white mb-2">
              المركز {index + 1}
            </h2>

            <img
              src={item.thumbnail_url}
              className="w-full h-56 object-cover rounded-lg mb-3"
            />

            <h3 className="text-white text-lg">{item.name}</h3>
            <p className="text-gray-300">{item.country}</p>

            <p className="text-green-400 mt-2">الأصوات: {item.votes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
