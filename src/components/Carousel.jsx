import { useState } from "react";

export default function Carousel({ submissions }) {
  const others = submissions.sort((a,b)=>b.votes - a.votes).slice(3);
  const [index, setIndex] = useState(0);

  if (!others.length) return null;

  const next = () => setIndex((i)=> (i+1)%others.length);
  const prev = () => setIndex((i)=> (i-1+others.length)%others.length);

  const current = others[index];

  return (
    <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl flex flex-col items-center mb-6">
      <p className="text-white mb-2">المركز {index+4}</p>
      <img src={current.thumbnail_url || "https://via.placeholder.com/150"} className="w-48 rounded"/>
      <p className="text-white mt-2">{current.name} - {current.country}</p>
      <div className="flex gap-4 mt-2">
        <button onClick={prev} className="bg-blue-600 p-1 rounded hover:bg-blue-700">❮</button>
        <button onClick={next} className="bg-blue-600 p-1 rounded hover:bg-blue-700">❯</button>
      </div>
    </div>
  );
}
