// Ottiene il percorso DOM dell'elemento
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

// Genera selettori CSS unici per l'elemento
export function getUniqueSelectors(element: HTMLElement): string[] {
  const selectors: string[] = [];
  
  // ID selector
  if (element.id) {
    selectors.push(`#${element.id}`);
  }
  
  // Class selectors
  if (element.classList.length > 0) {
    selectors.push(`.${Array.from(element.classList).join('.')}`);
  }
  
  // Attribute selectors
  const attributes = element.attributes;
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i];
    if (attr.name !== 'class' && attr.name !== 'id') {
      selectors.push(`[${attr.name}="${attr.value}"]`);
    }
  }
  
  // Position selector
  const positionSelector = getDOMPath(element);
  selectors.push(positionSelector);
  
  return selectors;
}