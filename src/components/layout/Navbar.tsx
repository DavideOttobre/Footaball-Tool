import React from 'react';
import { BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Soccer Stats
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-blue-50 text-blue-600"
            >
              <BarChart2 className="w-5 h-5" />
              <span>Analisi</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}