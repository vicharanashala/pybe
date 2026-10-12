/**
 * Domain Events for PyBe
 * Events capture intent and facts about past occurrences in the system.
 */

class ConceptMastered {
    constructor(userId, concept) {
        this.name = 'ConceptMastered';
        this.userId = userId;
        this.concept = concept; // e.g., 'variables_identity'
        this.timestamp = new Date();
    }
}

class ContradictionTriggered {
    constructor(userId, previousConcept, newConcept, message) {
        this.name = 'ContradictionTriggered';
        this.userId = userId;
        this.previousConcept = previousConcept;
        this.newConcept = newConcept;
        this.message = message;
        this.timestamp = new Date();
    }
}

module.exports = {
    ConceptMastered,
    ContradictionTriggered
};
