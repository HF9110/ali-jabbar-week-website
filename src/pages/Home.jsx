// src/pages/Home.jsx
import React, { useState, useMemo } from "react";
import useSubmissions from "../hooks/useSubmissions";
import VideoCard from "../components/VideoCard";
import ConfirmVoteModal from "../components/ConfirmVoteModal";
import { Search, Globe } from "lucide-react";

export default function Home() {
  const submissions = useSubmissions("approved");

  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return submissions.filter(item => {
      const matchName = item.name.toLowerCase().includes(search.toLowerCase());
      const matchCountry = countryFilter ? item.country === countryFilter : true;
      return matchName && matchCountry;
    });
  }, [search, countryFilter, submissions]);

  return (
    <div className="max-w-6xl mx-auto p-4">

      {/* Search + Country */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex items-center bg-white/10 backdrop-blur-lg p-3 rounded-xl border border-white/20 flex-1">
          <Search className="text-white opacity-70" />
          <input
            placeholder="بحث باسم المستخدم..."
            className="bg-transparent w-full px-3 text-white"
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center bg-white/10 backdrop-blur-lg p-3 rounded-xl border border-white/20">
          <Globe className="text-white opacity-70" />
          <select
            className="bg-transparent text-white px-3 outline-none"
            onChange={e => setCountryFilter(e.target.value)}
          >
            <option value="">كل الدول</option>
            <option value="العراق">🇮🇶 العراق</option>
            <option value="السعودية">🇸🇦 السعودية</option>
            <option value="الجزائر">🇩🇿 الجزائر</option>
            <option value="مصر">🇪🇬 مصر</option>
            <option value="المغرب">🇲🇦 المغرب</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map(item => (
          <VideoCard
            key={item.id}
            item={item}
            onVote={() => setSelected(item)}
          />
        ))}
      </div>

      {/* Modal */}
      <ConfirmVoteModal
        open={!!selected}
        onClose={() => setSelected(null)}
        userId={selected?.id}
        userName={selected?.name}
      />
    </div>
  );
}
