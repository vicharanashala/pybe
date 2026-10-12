/**
 * Domain Commands for PyBe
 * Commands capture user intent and are handled by specific Command Handlers.
 */

class StartJourney {
    constructor(userId, themeId) {
        this.name = 'StartJourney';
        this.userId = userId;
        this.themeId = themeId;
    }
}

class SubmitPracticeAnswer {
    constructor(userId, topic, isCorrect) {
        this.name = 'SubmitPracticeAnswer';
        this.userId = userId;
        this.topic = topic;
        this.isCorrect = isCorrect;
    }
}

module.exports = {
    StartJourney,
    SubmitPracticeAnswer
};
