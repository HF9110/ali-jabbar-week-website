// src/pages/AdminLogs.jsx
import { useEffect, useState } from "react";

export default function AdminLogs() {
  // دالة وهمية لجلب السجلات
  const getLogs = async () => [
    { id: 1, action: "User voted", user: "Ali", time: "2025-11-18 12:00" },
    { id: 2, action: "Submission approved", user: "Sara", time: "2025-11-18 12:10" },
  ];

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getLogs();
      setLogs(data);
    }
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Admin Logs</h1>
      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-white/10 backdrop-blur-xl p-4 rounded-xl"
          >
            <p className="text-white">{log.action}</p>
            <p className="text-gray-300">{log.user}</p>
            <p className="text-green-300">{log.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
