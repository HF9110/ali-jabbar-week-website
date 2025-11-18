// src/pages/Pending.jsx
import { useEffect, useState } from "react";

export default function Pending() {
  // دوال وهمية مؤقتة بدلاً من firebaseActions
  const getPendingSubmissions = async () => [
    { id: 1, name: "Ali Jabbar", country: "Iraq", votes: 0 },
    { id: 2, name: "Sara Ahmed", country: "Egypt", votes: 0 },
  ];

  const [pending, setPending] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getPendingSubmissions();
      setPending(data);
    }
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Pending Submissions</h1>
      <div className="space-y-4">
        {pending.map((sub) => (
          <div
            key={sub.id}
            className="bg-white/10 backdrop-blur-xl p-4 rounded-xl"
          >
            <p className="text-white font-semibold">{sub.name}</p>
            <p className="text-gray-300">{sub.country}</p>
            <p className="text-green-300">Votes: {sub.votes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
