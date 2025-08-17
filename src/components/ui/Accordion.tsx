import React, { createContext, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AccordionContext = createContext<{
  value: string | null;
  onChange: (value: string) => void;
}>({
  value: null,
  onChange: () => {},
});

interface AccordionProps {
  type: 'single';
  collapsible?: boolean;
  children: React.ReactNode;
}

export function Accordion({ children, type = 'single', collapsible = false }: AccordionProps) {
  const [value, setValue] = useState<string | null>(null);

  return (
    <AccordionContext.Provider
      value={{
        value,
        onChange: (newValue) => {
          if (collapsible && value === newValue) {
            setValue(null);
          } else {
            setValue(newValue);
          }
        },
      }}
    >
      <div className="space-y-2">{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
}

export function AccordionItem({ children, value }: AccordionItemProps) {
  return (
    <div className="border rounded-lg">
      <div data-value={value}>{children}</div>
    </div>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
}

export function AccordionTrigger({ children }: AccordionTriggerProps) {
  const { value, onChange } = useContext(AccordionContext);
  const itemValue = (children as any).props?.['data-value'] || '';

  return (
    <button
      className="flex items-center justify-between w-full p-4 text-left"
      onClick={() => onChange(itemValue)}
    >
      <span className="text-sm font-medium">{children}</span>
      <ChevronDown
        className={`w-4 h-4 transition-transform ${
          value === itemValue ? 'transform rotate-180' : ''
        }`}
      />
    </button>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
}

export function AccordionContent({ children }: AccordionContentProps) {
  const { value } = useContext(AccordionContext);
  const itemValue = (children as any).props?.['data-value'] || '';

  if (value !== itemValue) return null;

  return <div className="p-4 pt-0">{children}</div>;
}