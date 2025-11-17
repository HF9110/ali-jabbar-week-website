import { useState } from "react";
import { arabCountries } from "../utils/countries.js"; // (جديد)
import { ChevronLeft, ChevronRight } from "lucide-react";

// (جديد) دالة لجلب العلم
const getFlag = (countryName) => {
  const country = arabCountries.find(c => c.name === countryName);
  return country ? country.flag : '🌎';
};

export default function Carousel({ submissions }) {
  const others = submissions ? submissions.sort((a,b)=>(b.votes || 0) - (a.votes || 0)).slice(3) : [];
  const [index, setIndex] = useState(0);

  if (!others.length) return null;

  const next = () => setIndex((i)=> (i+1)%others.length);
  const prev = () => setIndex((i)=> (i-1+others.length)%others.length);

  const current = others[index];

  return (
    <div className="glass-card bg-white/10 backdrop-blur-lg p-4 rounded-xl flex flex-col items-center mb-6 max-w-sm mx-auto shadow-lg border border-white/10">
      <p className="text-white text-xl font-bold mb-2">المركز #{index+4}</p>
      <img src={current.thumbnail_url || "https://placehold.co/600x400/000000/FFFFFF?text=Video&font=cairo"} className="w-48 rounded-md aspect-video object-cover"/>
      <p className="text-white mt-2 text-lg font-semibold">{current.name}</p>
      {current.country && (
         <p className="text-gray-300 text-sm">{getFlag(current.country)} {current.country}</p>
      )}
      <div className="flex gap-4 mt-2">
        <button onClick={prev} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
          <ChevronLeft className="text-white" />
        </button>
        <button onClick={next} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
          <ChevronRight className="text-white" />
        </button>
      </div>
    </div>
  );
}