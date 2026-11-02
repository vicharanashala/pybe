/**
 * PyBe Contradiction Engine (MVP)
 * Tracks user mental models in localStorage to trigger productive struggle scenarios.
 */
export const ContradictionEngine = {
    recordMastery: (concept) => {
        let mastered = JSON.parse(localStorage.getItem('pybe_mastered_concepts') || '[]');
        if (!mastered.includes(concept)) {
            mastered.push(concept);
            localStorage.setItem('pybe_mastered_concepts', JSON.stringify(mastered));
        }
    },
    
    detectContradiction: (newConcept) => {
        const mastered = JSON.parse(localStorage.getItem('pybe_mastered_concepts') || '[]');
        
        // Contradiction Rule 1: Variables vs Lists
        if (mastered.includes('variables') && newConcept === 'lists') {
            return {
                triggered: true,
                title: "Wait... A Mental Contradiction Detected!",
                description: "You previously learned that a 'variable' holds exactly one value. But this new scenario requires storing many items together. How can one container hold many things? Your previous rule is breaking!",
                productive_struggle: "Resolve this contradiction: A list is just a variable that points to a sequence of memory slots, rather than a single isolated value."
            };
        }
        
        return { triggered: false };
    }
};
