// src/pages/AdminDashboard.jsx
import React, { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Pending from "./Pending.jsx";
import Approved from "./Approved.jsx";
import Settings from "./Settings.jsx";
import Dashboard from "./Dashboard.jsx";
import ManageSubmissions from "./ManageSubmissions.jsx";
import { auth } from "../firebase/firebase.js";
import { AnimatePresence } from "framer-motion";
import Logs from "./Logs.jsx";


export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) navigate("/admin");
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <AnimatePresence mode="wait">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pending" element={<Pending />} />
            <Route path="approved" element={<Approved />} />
            <Route path="settings" element={<Settings />} />
            <Route path="manage" element={<ManageSubmissions />} />
            <Route path="manage/:id" element={<ManageSubmissions />} />
            <Route path="logs" element={<Logs />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
