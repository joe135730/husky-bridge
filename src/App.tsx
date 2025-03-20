import { useState } from 'react'
import { Route, Routes, BrowserRouter } from "react-router-dom";
import LandingPage from './LandingPage';
import './App.css'
import './global.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Optional secondary route */}
          <Route path="/LandingPage" element={<LandingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

