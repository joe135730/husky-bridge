import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as accountClient from "./Account/client";
import { setCurrentUser } from "./store/account-reducer.ts";
import LandingPage from './LandingPage';
import AccountRoutes from './Account';
import Navbar from './navbar/navbar';
import Footer from './Footer';
import MyTeam from "./MyTeam";
import MyPosts from "./MyPosts/MyPosts";
import PendingOffers from "./MyPosts/PendingOffers";
import CreatePost from "./CreatePost/CreatePost";
import EditPost from "./CreatePost/EditPost";
import PostDetail from "./PostDetail/PostDetail";
import Chat from "./Chat/Chat";
import AllPost from "./AllPosts/AllPost";
import ReportedPosts from "./Reports/ReportedPosts";
import ReportedPostDetail from "./Reports/ReportedPostDetail";

import './App.css'

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const isAuthPage = location.pathname.startsWith('/Account/') && 
                    !location.pathname.includes('/Account/profile');

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        setLoading(true);
        // Call the profile endpoint to check if user is logged in
        const currentUser = await accountClient.profile();
        if (currentUser) {
          console.log("User authenticated:", currentUser.email);
          dispatch(setCurrentUser(currentUser));
        }
      } catch (error) {
        console.log("Not logged in - silent error expected on initial load");
        // This is normal for non-logged in users, don't show errors
      } finally {
        setLoading(false);
      }
    };
    
    // Check auth status on initial load
    checkLoggedIn();
    
    // Set up event listener for storage changes (detecting login/logout in other tabs)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'auth_status') {
        checkLoggedIn();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch]);

  if (loading && isAuthPage) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="app-container">
      {!isAuthPage && <Navbar />}
      <div className={isAuthPage ? "page-content" : "content-container page-content"}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Account/*" element={<AccountRoutes />} />
          <Route path="/my-team" element={<MyTeam />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/my-posts/:postId/pending-offers" element={<PendingOffers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/messages" element={<Chat />} />
          <Route path="/AllPosts" element={<AllPost />} />
          <Route path="/posts/category/:category" element={<AllPost />} />
          <Route path="/reports" element={<ReportedPosts />} />
          <Route path="/reports/:postId" element={<ReportedPostDetail />} />
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

