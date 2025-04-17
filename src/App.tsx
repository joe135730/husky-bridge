import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import LandingPage from './LandingPage';
import AccountRoutes from './Account';
import Navbar from './navbar/navbar';
import Footer from './Footer';
import MyTeam from "./MyTeam";
import MyPosts from "./MyPosts/MyPosts";
import CreatePost from "./CreatePost/CreatePost";
import PostDetail from "./PostDetail/PostDetail";
import Chat from "./Chat/Chat";

import './App.css'

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/Account/');

  return (
    <div className="app-container">
      {!isAuthPage && <Navbar />}
      <div className={isAuthPage ? "page-content" : "content-container page-content"}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Account/*" element={<AccountRoutes />} />
          <Route path="/my-team" element={<MyTeam />} />
          <Route path="/all-my-posts" element={<MyPosts />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/messages" element={<Chat />} />
        </Routes>
      </div>
        <hr />
        <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

