import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAnalysisStore } from '../../store/analysisStore';
import SavedAnalysesList from '../analysis/SavedAnalysesList';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <div className={`
      fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-50
      ${isOpen ? 'w-96' : 'w-0'}
    `}>
      <button
        onClick={onToggle}
        className={`
          absolute top-6 -right-10 p-2 bg-white rounded-r-lg shadow-md
          hover:bg-gray-50 transition-colors
        `}
      >
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </button>

      <div className={`
        h-full overflow-auto transition-all duration-300
        ${isOpen ? 'opacity-100 p-6' : 'opacity-0 p-0'}
      `}>
        <SavedAnalysesList />
      </div>
    </div>
  );
}