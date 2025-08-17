import React from 'react';
import { useMatchStore } from '../../store/matchStore';
import FirstHalfStrategy from './FirstHalfStrategy';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/Accordion';

interface StrategiesTabProps {
  homeTeam: string;
  awayTeam: string;
}

export default function StrategiesTab({ homeTeam, awayTeam }: StrategiesTabProps) {
  const { matches } = useMatchStore();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">Analisi Strategie</h2>
        
        <Accordion type="single" collapsible>
          <AccordionItem value="over05-first-half">
            <AccordionTrigger>Over 0.5 Gol Primo Tempo</AccordionTrigger>
            <AccordionContent>
              <FirstHalfStrategy 
                matches={matches}
                homeTeam={homeTeam}
                awayTeam={awayTeam}
              />
            </AccordionContent>
          </AccordionItem>
          
          {/* Additional strategy sections will be added here */}
        </Accordion>
      </div>
    </div>
  );
}