import { getDOMPath, getElementClasses } from './domUtils';

interface ComponentInfo {
  componentPath: string;
  fileLocation: string;
}

export function identifyComponent(element: HTMLElement): ComponentInfo {
  const classNames = getElementClasses(element);
  
  // Check for chart components
  if (element instanceof SVGElement) {
    const chartComponent = identifyChartComponent(element);
    if (chartComponent) return chartComponent;
  }

  // Check for UI components
  const uiComponent = identifyUIComponent(element, classNames);
  if (uiComponent) return uiComponent;

  // Default to DOM path if no specific component is identified
  return {
    componentPath: getDOMPath(element),
    fileLocation: 'Cerca il componente che genera questo elemento DOM'
  };
}

function identifyChartComponent(element: Element): ComponentInfo | null {
  const chartWrapper = element.closest('.recharts-wrapper');
  if (chartWrapper) {
    return {
      componentPath: 'components/charts/BarChart',
      fileLocation: 'src/components/charts/BarChart.tsx'
    };
  }
  return null;
}

function identifyUIComponent(element: HTMLElement, classNames: string[]): ComponentInfo | null {
  // Identify stats cards
  if (classNames.includes('bg-white') && 
      classNames.includes('rounded-lg') && 
      classNames.includes('shadow-md')) {
    if (element.querySelector('.text-sm.text-gray-500')) {
      return {
        componentPath: 'components/analysis/stats/RecentMatches',
        fileLocation: 'src/components/analysis/stats/RecentMatches.tsx'
      };
    }
    return {
      componentPath: 'components/analysis/stats/SeasonStats',
      fileLocation: 'src/components/analysis/stats/SeasonStats.tsx'
    };
  }

  // Identify buttons
  if (element.tagName === 'BUTTON' && classNames.includes('flex')) {
    return {
      componentPath: 'components/ui/Button',
      fileLocation: 'src/components/ui/Button.tsx'
    };
  }

  return null;
}