// src/pages/Manage.jsx
import { useEffect, useState } from "react";

export default function Manage() {
  // دوال وهمية مؤقتة بدلاً من firebaseActions
  const getSubmissions = async () => [
    { id: 1, name: "Ali Jabbar", country: "Iraq", votes: 12 },
    { id: 2, name: "Sara Ahmed", country: "Egypt", votes: 7 },
  ];
  const approveSubmission = async (id) => {
    console.log(`Approved submission ${id}`);
  };
  const rejectSubmission = async (id) => {
    console.log(`Rejected submission ${id}`);
  };

  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getSubmissions();
      setSubmissions(data);
    }
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Manage Submissions</h1>
      <div className="space-y-4">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="bg-white/10 backdrop-blur-xl p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <p className="text-white font-semibold">{sub.name}</p>
              <p className="text-gray-300">{sub.country}</p>
              <p className="text-green-300">Votes: {sub.votes}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => approveSubmission(sub.id)}
                className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white"
              >
                Approve
              </button>
              <button
                onClick={() => rejectSubmission(sub.id)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
