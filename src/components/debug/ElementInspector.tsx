import React, { useState, useEffect } from 'react';
import { Copy, X } from 'lucide-react';

interface HoveredInfo {
  componentPath: string;
  filePath: string;
}

export default function ElementInspector() {
  const [isActive, setIsActive] = useState(false);
  const [hoveredInfo, setHoveredInfo] = useState<HoveredInfo | null>(null);
  const [lastHighlightedElement, setLastHighlightedElement] = useState<HTMLElement | null>(null);

  const handleMouseOver = (e: MouseEvent) => {
    if (!isActive) return;
    
    const target = e.target as HTMLElement;
    if (target.closest('.inspector-info-panel')) return;
    
    // Rimuovi l'evidenziazione dall'ultimo elemento
    if (lastHighlightedElement && lastHighlightedElement !== target) {
      lastHighlightedElement.style.outline = '';
    }
    
    // Evidenzia il nuovo elemento
    target.style.outline = '2px solid #3b82f6';
    setLastHighlightedElement(target);

    // Determina il componente e il percorso del file
    const componentInfo = identifyComponent(target);
    setHoveredInfo(componentInfo);
  };

  const handleMouseOut = (e: MouseEvent) => {
    if (!isActive) return;
    
    const target = e.target as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement;
    
    if (relatedTarget?.closest('.inspector-info-panel')) return;
    
    target.style.outline = '';
    if (!relatedTarget?.closest('.inspector-info-panel')) {
      setHoveredInfo(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (isActive) {
      document.addEventListener('mouseover', handleMouseOver);
      document.addEventListener('mouseout', handleMouseOut);
    } else {
      // Rimuovi l'evidenziazione quando disattivi il debug
      if (lastHighlightedElement) {
        lastHighlightedElement.style.outline = '';
      }
      setHoveredInfo(null);
    }

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isActive]);

  return (
    <>
      <button
        onClick={() => setIsActive(!isActive)}
        className={`
          fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg
          ${isActive ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}
        `}
      >
        {isActive ? <X className="w-5 h-5" /> : 'Debug'}
      </button>

      {hoveredInfo && (
        <div className="fixed bottom-20 right-4 z-50 bg-white p-4 rounded-lg shadow-xl border border-gray-200 max-w-md inspector-info-panel">
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Componente</span>
                <button
                  onClick={() => copyToClipboard(hoveredInfo.componentPath)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <code className="text-sm bg-gray-50 px-2 py-1 rounded block mt-1">
                {hoveredInfo.componentPath}
              </code>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">File</span>
                <button
                  onClick={() => copyToClipboard(hoveredInfo.filePath)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <code className="text-sm bg-gray-50 px-2 py-1 rounded block mt-1">
                {hoveredInfo.filePath}
              </code>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function identifyComponent(element: HTMLElement): HoveredInfo {
  // Identifica il componente in base alle classi e alla struttura
  const classes = Array.from(element.classList);
  const tagName = element.tagName.toLowerCase();

  // Mappa dei componenti noti
  const componentMap: Record<string, HoveredInfo> = {
    // Componenti di analisi
    'stats-card': {
      componentPath: 'StatsCard',
      filePath: 'src/components/stats/StatsCard.tsx'
    },
    'chart-container': {
      componentPath: 'GoalDistributionChart',
      filePath: 'src/components/analysis/goals/GoalDistributionChart.tsx'
    },
    // Componenti UI
    'button': {
      componentPath: 'Button',
      filePath: 'src/components/ui/Button.tsx'
    },
    'input': {
      componentPath: 'Input',
      filePath: 'src/components/ui/Input.tsx'
    },
    // Layout components
    'navbar': {
      componentPath: 'Navbar',
      filePath: 'src/components/layout/Navbar.tsx'
    },
    'sidebar': {
      componentPath: 'Sidebar',
      filePath: 'src/components/layout/Sidebar.tsx'
    }
  };

  // Cerca corrispondenze nelle classi
  for (const className of classes) {
    if (componentMap[className]) {
      return componentMap[className];
    }
  }

  // Cerca corrispondenze nei tag
  if (componentMap[tagName]) {
    return componentMap[tagName];
  }

  // Analizza la struttura del DOM per identificare il componente
  let currentElement: HTMLElement | null = element;
  let path = '';
  
  while (currentElement && currentElement !== document.body) {
    const elementId = currentElement.id ? `#${currentElement.id}` : '';
    const elementClasses = Array.from(currentElement.classList)
      .filter(c => !c.startsWith('text-') && !c.startsWith('bg-') && !c.startsWith('p-'))
      .map(c => `.${c}`)
      .join('');
    
    path = `${currentElement.tagName.toLowerCase()}${elementId}${elementClasses}${path ? ' > ' + path : ''}`;
    currentElement = currentElement.parentElement;
  }

  // Se non troviamo una corrispondenza esatta, restituisci un'identificazione basata sul DOM
  return {
    componentPath: path,
    filePath: `src/components/${path.split(' > ')[0]}.tsx`
  };
}