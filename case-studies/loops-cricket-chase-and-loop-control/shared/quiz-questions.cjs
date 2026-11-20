const quizQuestions = [
  {
    id: "q1",
    scenario: "If the machine finds a torn note, what should it do?",
    correctAnswer: "Skip it and continue counting",
    options: ["Halt immediately", "Skip it and continue counting", "Restart counting", "Alert manager"]
  },
  {
    id: "q2",
    scenario: "If the machine finds a fake note, what should it do?",
    correctAnswer: "Stop immediately",
    options: ["Skip it", "Continue counting", "Stop immediately", "Ignore it"]
  }
];

module.exports = {quizQuestions};
