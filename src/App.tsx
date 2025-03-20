import { useState } from 'react'
import { Route, Routes, BrowserRouter } from "react-router-dom";
import LandingPage from './LandingPage';
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Optional secondary route */}
          <Route path="/LandingPage" element={<LandingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

