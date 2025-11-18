import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const SubmissionProfile = lazy(() => import("./pages/SubmissionProfile"));
const Winners = lazy(() => import("./pages/Winners"));
const FAQ = lazy(() => import("./pages/FAQ"));

export default function App() {
  return (
    <Suspense fallback={<div className="text-white p-10">جاري التحميل...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submission/:id" element={<SubmissionProfile />} />
        <Route path="/winners" element={<Winners />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </Suspense>
  );
}
