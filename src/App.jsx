import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const SubmissionProfile = lazy(() => import("./pages/SubmissionProfile"));
const Winners = lazy(() => import("./pages/Winners"));
const FAQ = lazy(() => import("./pages/FAQ"));

<Suspense fallback={<div className="p-10 text-center text-white">جاري التحميل...</div>}>
    <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/submission/:id" element={<SubmissionProfile />} />
       <Route path="/winners" element={<Winners />} />
       <Route path="/faq" element={<FAQ />} />
    </Routes>
</Suspense>
