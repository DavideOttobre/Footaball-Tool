interface Position {
  x: number;
  y: number;
}

export function calculateChartPosition(
  event: React.MouseEvent, 
  containerRef: HTMLDivElement | null
): Position {
  if (!containerRef) return { x: 0, y: 0 };

  const containerRect = containerRef.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Calculate center position
  let x = viewportWidth / 2;
  
  // Calculate vertical position
  let y = event.clientY;
  
  // Ensure chart stays within viewport bounds
  const CHART_WIDTH = 500; // Width of the chart
  const CHART_HEIGHT = 300; // Height of the chart
  const MARGIN = 20; // Margin from viewport edges
  
  // Adjust horizontal position if needed
  x = Math.min(Math.max(x, CHART_WIDTH / 2 + MARGIN), viewportWidth - CHART_WIDTH / 2 - MARGIN);
  
  // Adjust vertical position if needed
  if (y + CHART_HEIGHT + MARGIN > viewportHeight) {
    y = Math.max(MARGIN, viewportHeight - CHART_HEIGHT - MARGIN);
  }
  
  return { x, y };
}