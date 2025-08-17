export function getDOMPath(element: HTMLElement): string {
  const path: string[] = [];
  let currentElement: HTMLElement | null = element;
  
  while (currentElement && currentElement.nodeType === Node.ELEMENT_NODE) {
    let selector = currentElement.nodeName.toLowerCase();
    
    if (currentElement.id) {
      selector += `#${currentElement.id}`;
    } else {
      let sibling = currentElement.previousElementSibling;
      let siblingCount = 1;
      
      while (sibling) {
        if (sibling.nodeName.toLowerCase() === selector) {
          siblingCount++;
        }
        sibling = sibling.previousElementSibling;
      }
      
      if (siblingCount > 1) {
        selector += `:nth-child(${siblingCount})`;
      }
    }
    
    path.unshift(selector);
    currentElement = currentElement.parentElement;
  }
  
  return path.join(' > ');
}

export function getElementClasses(element: Element): string[] {
  if (element instanceof SVGElement) {
    return element.className.baseVal.split(/\s+/).filter(Boolean);
  }
  return Array.from(element.classList);
}