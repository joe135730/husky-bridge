import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
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
import AuthDebug from "./Account/AuthDebug";

import './App.css'

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthPage = location.pathname.startsWith('/Account/') && 
                    !location.pathname.includes('/Account/profile');

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // First try to get user from localStorage for immediate display
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          dispatch(setCurrentUser(parsedUser));
          console.log("Restored user from localStorage:", parsedUser?.firstName);
        }

        // Then call the profile endpoint to verify and get fresh data
        const currentUser = await accountClient.profile();
        if (currentUser) {
          dispatch(setCurrentUser(currentUser));
          console.log("User authenticated via API:", currentUser.firstName);
        } else {
          // User is not logged in - this is a normal state, not an error
          console.log("User not authenticated");
        }
      } catch (error) {
        // Only log unexpected errors
        console.error("Error checking authentication status:", error);
      }
    };
    checkLoggedIn();
  }, [dispatch]);

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
      {/* Debug component - only show in development or test environments */}
      {import.meta.env.DEV && <AuthDebug />}
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

