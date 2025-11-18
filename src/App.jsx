// src/App.jsx
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazy-loaded pages (based on your folder structure)
const Home = lazy(() => import("./pages/Home"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Winners = lazy(() => import("./pages/Winners"));
const SubmissionProfile = lazy(() =>
  import("./pages/SubmissionProfile")
);

// Admin & Dashboard pages
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

// Submissions Management
const Manage = lazy(() => import("./pages/Manage"));
const ManageSubmissions = lazy(() =>
  import("./pages/ManageSubmissions")
);
const Pending = lazy(() => import("./pages/Pending"));
const Approved = lazy(() => import("./pages/Approved"));

// Logs
const AdminLogs = lazy(() => import("./pages/AdminLogs"));
const Logs = lazy(() => import("./pages/Logs"));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div className="text-white p-10">Loading...</div>}>

        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/winners" element={<Winners />} />
          <Route path="/submission/:id" element={<SubmissionProfile />} />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin & Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />

          {/* Submissions Management */}
          <Route path="/manage" element={<Manage />} />
          <Route path="/manage/submissions" element={<ManageSubmissions />} />
          <Route path="/pending" element={<Pending />} />
          <Route path="/approved" element={<Approved />} />

          {/* Logs */}
          <Route path="/logs" element={<Logs />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
        </Routes>

      </Suspense>
    </Router>
  );
}
