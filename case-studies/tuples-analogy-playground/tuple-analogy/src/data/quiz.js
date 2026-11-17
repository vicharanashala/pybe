export const QUIZ_DATA = {
  ordered: [
    {
      question: "What does it mean that a Python Tuple is 'Ordered'?",
      options: [
        "Elements are automatically sorted alphabetically",
        "Sequence in which elements are added is preserved",
        "Elements can be accessed randomly without using an index",
        "It only accepts numbers in ascending order"
      ],
      correct: 1,
      explanation: "Tuples remember the exact sequence you put things in."
    },
    {
      question: "If `biscuit_pack = ('Red', 'Green', 'Blue')`, how do you grab the 'Blue' biscuit?",
      options: [
        "biscuit_pack[3]",
        "biscuit_pack.get('Blue')",
        "biscuit_pack[2]",
        "biscuit_pack[Blue]"
      ],
      correct: 2,
      explanation: "Python uses zero-based indexing, so 0 is Red, 1 is Green, and 2 is Blue."
    }
  ],
  heterogeneous: [
    {
      question: "What does it mean that a Tuple is 'Heterogeneous'?",
      options: [
        "It can only store one type of data (like all strings).",
        "It can store a mix of different data types together.",
        "It automatically converts all items to strings.",
        "It cannot store any data at all."
      ],
      correct: 1,
      explanation: "Like a magical shopping bag, it can hold a mix of completely different items."
    },
    {
      question: "Which of the following is a valid heterogeneous tuple in Python?",
      options: [
        "('Apple', 42, True)",
        "['Apple', 42, True]",
        "('Apple', 'Banana', 'Cherry')",
        "{'Apple', 42, True}"
      ],
      correct: 0,
      explanation: "It uses parentheses () and contains a string, an integer, and a boolean."
    }
  ],
  nested: [
    {
      question: "If a tuple contains a list, can you change the items inside that list?",
      options: [
        "No, everything inside a tuple is strictly locked forever.",
        "Yes, but only if you destroy the tuple first.",
        "Yes, because the list itself remains mutable even when stored inside a tuple.",
        "No, the list automatically turns into a tuple."
      ],
      correct: 2,
      explanation: "The tuple protects the 'box', but if the box is open (a list), you can still change its contents!"
    },
    {
      question: "What happens if you try to replace the ENTIRE list inside a tuple with a brand new list?",
      options: [
        "It works perfectly. As we are not changing tuple, we are just replacing list with a new list",
        "It throws a TypeError because you cannot change the tuple's direct references.",
        "The new list merges with the old list.",
        "Python deletes the tuple."
      ],
      correct: 1,
      explanation: "You can change what's INSIDE the list, but you cannot swap the list out for a different one."
    }
  ],
  final: [
    {
      question: "Which of the following best describes a Python Tuple?",
      options: [
        "Unordered, Mutable, Homogeneous",
        "Ordered, Immutable, Heterogeneous",
        "Ordered, Mutable, Heterogeneous",
        "Unordered, Immutable, Homogeneous"
      ],
      correct: 1,
      explanation: "It keeps its order, you can't change it, and it holds mixed items."
    },
    {
      question: "Can you change the order of elements in a tuple after it's created?",
      options: [
        "Yes, by using the .sort() method.",
        "Yes, by using the .shuffle() method.",
        "No, we cannot",
        "Only if the tuple contains integers."
      ],
      correct: 2,
      explanation: "Once a tuple is packed, its sequence is locked forever."
    },
    {
      question: "Is `my_data = (10, 'Hello', [1, 2, 3])` a valid Python tuple?",
      options: [
        "No, you can't mix numbers and strings.",
        "No, you can't put a list inside a tuple.",
        "Yes, it is perfectly valid.",
        "Yes, but the list will be converted into a string."
      ],
      correct: 2,
      explanation: "Tuples don't care what you put inside them."
    },
    {
      question: "If `t = (1, [2, 3])`, what happens if we run `t[1].append(4)`?",
      options: [
        "It throws a TypeError.",
        "The tuple becomes (1, [2, 3, 4]).",
        "The tuple becomes (1, [2, 3], 4).",
        "The list is deleted."
      ],
      correct: 1,
      explanation: "You appended '4' to the mutable list sitting at index 1."
    }
  ]
};