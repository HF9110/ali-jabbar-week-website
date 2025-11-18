// src/pages/AdminLogs.jsx
import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "logs"),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setLogs(list);
    });

    return () => unsub();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-8">سجل التغييرات</h1>

      <div className="space-y-4">
        {logs.length === 0 && (
          <p className="text-gray-300 text-center">
            لا يوجد أي نشاط حتى الآن.
          </p>
        )}

        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4"
          >
            <p className="text-white text-lg">{log.action}</p>
            <p className="text-gray-300 mt-1 text-sm">{log.details}</p>

            <p className="text-gray-400 text-xs mt-2">
              {new Date(log.timestamp?.toDate()).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
