// src/pages/Home.jsx
import React, { useState, useMemo } from "react";
import useSubmissions from "../hooks/useSubmissions";
import VideoCard from "../components/VideoCard";
import ConfirmVoteModal from "../components/ConfirmVoteModal";
import { Search, Globe } from "lucide-react";
import { arabCountries } from "../utils/countries";
import useSettings from "../hooks/useSettings"; // استيراد الإعدادات

// مكون الشريط الجديد
const StageBanner = ({ stage }) => {
  const config = {
    voting: {
      text: "التصويت مفتوح حالياً! سارع بالمشاركة.",
      color: "bg-[var(--color-primary)] text-gray-900",
    },
    submission: {
      text: "باب التقديم مفتوح. سيتم فتح التصويت قريباً!",
      color: "bg-blue-600",
    },
    paused: {
      text: "المسابقة متوقفة مؤقتاً. يرجى الانتظار.",
      color: "bg-red-600",
    },
    ended: { text: "انتهت المسابقة. شكراً لمشاركتكم!", color: "bg-gray-600" },
  };
  const current = config[stage] || config.paused;

  if (stage === "ended") return null;

  return (
    <div
      className={`p-3 text-center mb-8 rounded-xl font-bold text-white shadow-lg ${current.color}`}
      style={{
        backgroundColor: current.color.startsWith("bg-")
          ? undefined
          : current.color,
      }}
    >
      {current.text}
    </div>
  );
};

export default function Home() {
  const submissions = useSubmissions("approved");
  const settings = useSettings(); // جلب الإعدادات

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
      <StageBanner stage={settings.stage} />

      {/* العنوان */}
      <h1
        className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg"
        style={{ fontFamily: "var(--app-font)" }}
      >
        <span className="text-[var(--color-highlight)]">مشاركات</span> مسابقة
        تيك توك
      </h1>

      {/* Search + Country Filter (Glassmorphism) */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 p-4 glass-card rounded-2xl shadow-xl">
        <div className="flex items-center bg-white/10 p-3 rounded-xl border border-white/20 flex-1">
          <Search className="text-[var(--color-primary)] opacity-80" />
          <input
            placeholder="بحث باسم المستخدم..."
            className="bg-transparent w-full px-3 text-white placeholder-gray-400 focus:outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center bg-white/10 p-3 rounded-xl border border-white/20">
          <Globe className="text-[var(--color-primary)] opacity-80" />
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
