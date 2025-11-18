// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Users, CheckCircle, Clock, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [votes, setVotes] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "submissions"), snap => {
      let _pending = 0,
          _approved = 0,
          _votes = 0;

      snap.forEach(doc => {
        const d = doc.data();
        if (d.approved) _approved++;
        else _pending++;

        _votes += d.votes || 0;
      });

      setPending(_pending);
      setApproved(_approved);
      setVotes(_votes);
    });

    return () => unsub();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">الإحصائيات العامة</h1>

      <div className="grid md:grid-cols-3 gap-6">

        {/* Pending */}
        <div className="p-6 bg-white rounded-xl border shadow-sm flex items-center gap-4">
          <Clock className="text-yellow-500" size={36} />
          <div>
            <p className="text-gray-500 text-sm">مشاركات معلقة</p>
            <h2 className="text-2xl font-bold">{pending}</h2>
          </div>
        </div>

        {/* Approved */}
        <div className="p-6 bg-white rounded-xl border shadow-sm flex items-center gap-4">
          <CheckCircle className="text-green-600" size={36} />
          <div>
            <p className="text-gray-500 text-sm">مشاركات مقبولة</p>
            <h2 className="text-2xl font-bold">{approved}</h2>
          </div>
        </div>

        {/* Votes */}
        <div className="p-6 bg-white rounded-xl border shadow-sm flex items-center gap-4">
          <TrendingUp className="text-blue-600" size={36} />
          <div>
            <p className="text-gray-500 text-sm">إجمالي الأصوات</p>
            <h2 className="text-2xl font-bold">{votes}</h2>
          </div>
        </div>

      </div>
    </div>
  );
}
