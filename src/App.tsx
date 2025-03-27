import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import LandingPage from './LandingPage';
import Login from './Account/Login';
import Signup from './Account/Signup';
import Navbar from './navbar/navbar';
import Footer from './Footer';
import MyTeam from "./MyTeam";
import Profile from "./Profile/profile"; 
import EditProfile from "./Profile/EditProfile"; 


import './App.css'

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="app-container">
      {!isAuthPage && <Navbar />}
      <div className={isAuthPage ? "page-content" : "content-container page-content"}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/my-team" element={<MyTeam />} />
          <Route path="/my-profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
 


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

