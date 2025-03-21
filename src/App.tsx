import { useState } from 'react'
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import LandingPage from './LandingPage';
import Login from './Login';
import Navbar from './navbar/navbar';
import Footer from './Footer';
import './App.css'

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app-container">
      {!isLoginPage && <Navbar />}
      <div className={isLoginPage ? "page-content" : "content-container page-content"}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/LandingPage" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
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

