import React from 'react';
import type { Match } from '../../types/Match';
import SimilarMatchesPopup from './SimilarMatchesPopup';

interface MatchesListProps {
  matches: Match[];
  label: string;
}

export default function MatchesList({ matches, label }: MatchesListProps) {
  const [showPopup, setShowPopup] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
      >
        {matches.length} partite simili trovate
      </button>

      {showPopup && (
        <SimilarMatchesPopup
          matches={matches}
          title={label}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}