// src/context/ConceptContext.jsx
// Shares the currently active concept across the whole app so
// TopicChatBot can read it without prop drilling.

import { createContext, useContext, useState } from 'react';

const ConceptContext = createContext(null);

export function ConceptProvider({ children }) {
  const [activeConcept, setActiveConcept] = useState(null);
  return (
    <ConceptContext.Provider value={{ activeConcept, setActiveConcept }}>
      {children}
    </ConceptContext.Provider>
  );
}

export function useActiveConcept() {
  return useContext(ConceptContext);
}
