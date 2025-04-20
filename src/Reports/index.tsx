import { Route, Routes } from "react-router-dom";
import ReportedPosts from "./ReportedPosts";
import ReportedPostDetail from "./ReportedPostDetail";

export default function ReportsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ReportedPosts />} />
      <Route path="/:postId" element={<ReportedPostDetail />} />
    </Routes>
  );
}

// Export components for direct import if needed
export { default as ReportedPosts } from "./ReportedPosts";
export { default as ReportedPostDetail } from "./ReportedPostDetail"; 