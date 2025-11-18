// src/pages/Home.jsx
import React, { useState, useMemo } from "react";
import useSubmissions from "../hooks/useSubmissions";
import VideoCard from "../components/VideoCard";
import ConfirmVoteModal from "../components/ConfirmVoteModal";
import { Search, Globe } from "lucide-react";
import { arabCountries } from "../utils/countries";

export default function Home() {
  const submissions = useSubmissions("approved");

  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return submissions.filter((item) => {
      const matchName = item.name.toLowerCase().includes(search.toLowerCase());
      const matchCountry = countryFilter
        ? item.country === countryFilter
        : true;
      return matchName && matchCountry;
    });
  }, [search, countryFilter, submissions]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* العنوان */}
      <h1 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg">
        <span className="text-[#fde047]">مشاركات</span> مسابقة تيك توك
      </h1>

      {/* Search + Country Filter (Glassmorphism) */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 p-4 glass-card rounded-2xl shadow-xl">
        <div className="flex items-center bg-white/10 p-3 rounded-xl border border-white/20 flex-1">
          <Search className="text-[#fde047] opacity-80" />
          <input
            placeholder="بحث باسم المستخدم..."
            className="bg-transparent w-full px-3 text-white placeholder-gray-400 focus:outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center bg-white/10 p-3 rounded-xl border border-white/20">
          <Globe className="text-[#fde047] opacity-80" />
          <select
            className="bg-transparent text-white px-3 outline-none appearance-none bg-black/0"
            onChange={(e) => setCountryFilter(e.target.value)}
            style={{ color: countryFilter ? "white" : "#9ca3af" }}
          >
            {arabCountries.map((c) => (
              <option
                key={c.name}
                value={c.name}
                className="bg-gray-900 text-white"
              >
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <VideoCard
              key={item.id}
              item={item}
              onVote={() => setSelected(item)}
              // يُفترض أن VideoCard موجود ومُصمم بأسلوب متناسق
            />
          ))
        ) : (
          <p className="text-gray-400 text-center text-xl col-span-full">
            لا توجد مشاركات مطابقة لمعايير البحث حالياً.
          </p>
        )}
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
