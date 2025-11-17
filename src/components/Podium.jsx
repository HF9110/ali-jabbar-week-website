export default function Podium({ submissions }) {
  const top3 = submissions.sort((a,b)=>b.votes - a.votes).slice(0,3);

  return (
    <div className="flex justify-center items-end gap-4 mb-6">
      {top3.map((sub, idx)=>(
        <div key={idx} className={`flex flex-col items-center ${idx===1 ? "order-first" : idx===0 ? "order-2" : "order-last"}`}>
          <div className="bg-yellow-400 p-4 rounded-b-lg w-24 h-24 flex items-center justify-center text-black font-bold text-lg">{idx+1}</div>
          <p className="mt-2 text-white">{sub.name}</p>
        </div>
      ))}
    </div>
  );
}
