import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as accountClient from "./Account/client";
import { setCurrentUser } from "./store/account-reducer.ts";
import LandingPage from './LandingPage';
import AccountRoutes from './Account';
import Navbar from './navbar/navbar';
import Footer from './Footer';
import FAQs from "./Footer/Faqs/faqs";
import TOS from "./Footer/TermsOfService/tos"; 
import PrivacyPolicy from "./Footer/Policy/policy";

<Route path="/faqs" element={<FAQs />} />

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
import { ProtectedRoute } from "./Components/ProtectedRoute";

import './App.css'

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthPage = location.pathname.startsWith('/Account/') &&
    !location.pathname.includes('/Account/profile');

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        console.log("App - Checking authentication status");
        // Call the profile endpoint to check if user is logged in
        const currentUser = await accountClient.profile();
        if (currentUser) {
          console.log("App - User authenticated:", {
            userId: currentUser._id,
            role: currentUser.role
          });
          dispatch(setCurrentUser(currentUser));
        } else {
          // User is not logged in - this is a normal state, not an error
          console.log("App - User not authenticated");
          dispatch(setCurrentUser(null));
        }
      } catch (error) {
        // Handle 401 errors gracefully (user not logged in)
        const err = error as { response?: { status?: number } };
        if (err.response?.status === 401) {
          console.log("App - User not authenticated (401)");
          dispatch(setCurrentUser(null));
        } else {
          // Only log unexpected errors
          console.error("App - Error checking authentication status:", error);
          // Don't clear user on network errors - might be temporary
          // Only clear on actual auth failures
        }
      }
    };
    
    // Check immediately on mount
    checkLoggedIn();

    // Add an interval to periodically check and refresh the session
    // Reduced to 2 minutes to catch session issues faster
    const sessionRefreshInterval = setInterval(checkLoggedIn, 2 * 60 * 1000); // Check every 2 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(sessionRefreshInterval);
  }, [dispatch]);

  return (
    <div className="app-container">
      {!isAuthPage && <Navbar />}
      <div className={isAuthPage ? "page-content" : "content-container page-content"}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Account/*" element={<AccountRoutes />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/terms" element={<TOS />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/my-team" element={<MyTeam />} />
          <Route path="/my-posts" element={
            <ProtectedRoute>
              <MyPosts />
            </ProtectedRoute>
          } />
          <Route path="/my-posts/:postId/pending-offers" element={
            <ProtectedRoute>
              <PendingOffers />
            </ProtectedRoute>
          } />
          <Route path="/create-post" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } />
          <Route path="/edit-post/:id" element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          } />
          <Route path="/post/:id" element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/AllPosts" element={<AllPost />} />
          <Route path="/posts/category/:category" element={<AllPost />} />
          <Route path="/reports" element={
            <ProtectedRoute>
              <ReportedPosts />
            </ProtectedRoute>
          } />
          <Route path="/reports/:postId" element={
            <ProtectedRoute>
              <ReportedPostDetail />
            </ProtectedRoute>
          } />
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

