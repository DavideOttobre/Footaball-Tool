import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navbar from './components/layout/Navbar';
import ElementInspector from './components/debug/ElementInspector';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
        <ElementInspector />
      </div>
    </BrowserRouter>
  );
}