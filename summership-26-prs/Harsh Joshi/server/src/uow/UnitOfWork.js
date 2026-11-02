const personalizedRepo = require('../repositories/PersonalizedRepo');

class UnitOfWork {
    constructor() {
        this.repositories = {
            personalized: personalizedRepo,
            // Future user state repositories would be attached here
        };
        this.events = []; // The UoW collects events to be passed to the Message Bus
    }

    async begin() {
        // In a real DB, this would start a transaction
        console.log("[UoW] Transaction started.");
    }

    async commit() {
        // In a real DB, this commits the transaction safely
        console.log("[UoW] Transaction committed safely.");
    }

    async rollback() {
        // Reverts changes if an exception is caught
        console.log("[UoW] Error detected. Transaction rolled back.");
    }

    addEvent(event) {
        this.events.push(event);
    }

    extractEvents() {
        const collectedEvents = [...this.events];
        this.events = [];
        return collectedEvents;
    }
}

module.exports = UnitOfWork;
