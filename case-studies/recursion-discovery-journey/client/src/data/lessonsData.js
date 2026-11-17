export const lessonsData = [
  {
    id: 1,
    title: "What is Recursion?",
    image: "/images/image_1.png",
    story: "When two mirrors face each other, they create repeated reflections. Each reflection contains another smaller reflection.",
    pythonConcept: "Recursion is a technique where a function calls itself to solve a smaller version of a problem.",
    keyIdea: "Recursion means self-reference and repetition."
  },
  {
    id: 2,
    title: "Recursive Call",
    image: "/images/image_2.png",
    story: "Each new reflection comes from the previous reflection. Similarly, a recursive function creates a new function call from itself.",
    pythonConcept: "A function calling itself is called a recursive call.",
    keyIdea: "A recursive function calls itself."
  },
  {
    id: 3,
    title: "Recursive Depth and Call Stack",
    image: "/images/image_3.png",
    story: "Every new reflection creates another layer. In programming, every recursive call adds a new layer to the call stack.",
    pythonConcept: "Recursive depth represents how many times a function calls itself.",
    keyIdea: "Too many recursive calls can cause stack overflow."
  },
  {
    id: 4,
    title: "Base Case",
    image: "/images/image_4.png",
    story: "The mirror journey needs an ending point. Recursion also needs a condition that stops the function.",
    pythonConcept: "The base case stops recursive execution.",
    keyIdea: "Every recursion needs a stopping condition."
  },
  {
    id: 5,
    title: "Recursion Unwinding",
    image: "/images/image_5.png",
    story: "After reaching the final point, recursive calls return in reverse order.",
    pythonConcept: "This process is called stack unwinding.",
    keyIdea: "Recursive calls go deeper and then return back."
  },
  {
    id: 6,
    title: "Python Implementation",
    image: "/images/image_6.png",
    story: "The real-world mirror example can be converted into Python code.",
    pythonConcept: "Combine the base case stopping condition and self-call in Python.",
    keyIdea: "Try running mirror(5) in the coding playground."
  },
  {
    id: 7,
    title: "Recursion Challenge",
    image: "/images/image_7.png",
    story: "You have journeyed through all visual scenes. Test your knowledge!",
    pythonConcept: "Answer 5 multiple choice questions to complete the adventure.",
    keyIdea: "Prove your Python recursion mastery!"
  }
];
