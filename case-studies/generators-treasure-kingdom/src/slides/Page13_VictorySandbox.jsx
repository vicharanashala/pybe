import React from 'react';
import MCQCard from '../components/MCQCard';

export default function Page13_VictorySandbox() {
  return (
    <div className="slide-body" style={{ gap: '16px' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 className="story-title" style={{ color: 'var(--duo-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          🏆 MCQ Quiz
        </h2>
        <p className="story-text" style={{ marginBottom: '4px' }}>
          Test your complete knowledge of Python Iterables, Iterators, and Generators across 6 questions!
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%', maxWidth: '800px' }}>
        <MCQCard
          question="❓ Question 1: Where are items in a Python List (Iterable) kept?"
          options={[
            "Generated on-demand dynamically",
            "Stored together in RAM memory",
            "Written to hard disk files",
            "Deleted after 1 loop cycle"
          ]}
          correctIndex={1}
          explanations={[
            "Generators compute items dynamically, not lists.",
            "Iterables (lists, tuples, dicts) hold all items together in RAM memory!",
            "Iterables reside in RAM memory, not hard disk files.",
            "Lists stay stored in memory until deleted or garbage collected."
          ]}
        />

        <MCQCard
          question="❓ Question 2: Which function creates an Iterator pointer from an Iterable?"
          options={[
            "next(warehouse)",
            "iter(warehouse)",
            "generator(warehouse)",
            "list(warehouse)"
          ]}
          correctIndex={1}
          explanations={[
            "next() fetches the next item from an existing iterator.",
            "iter(warehouse) returns an Iterator pointer!",
            "generator() is not a built-in Python function.",
            "list() creates a new list, not an iterator."
          ]}
        />

        <MCQCard
          question="❓ Question 3: What is the main characteristic of an Iterator in Python?"
          options={[
            "Holds all elements together in memory beforehand",
            "Remembers its current state and yields 1 item at a time using next()",
            "Only works with numerical values",
            "Automatically resets to index 0 after reading"
          ]}
          correctIndex={1}
          explanations={[
            "Lists (Iterables) hold all elements in memory, not Iterators.",
            "An Iterator maintains internal cursor position and yields items 1-by-1 via next().",
            "Iterators work with any Python data type.",
            "Iterators move forward in one direction; they do not auto-reset."
          ]}
        />

        <MCQCard
          question="❓ Question 4: Why does a Generator use almost 0 MB of RAM?"
          options={[
            "Generates items 1-by-1 lazily on-demand",
            "Stores compressed zip files on disk",
            "Deletes variables after compilation",
            "Only works for small numbers"
          ]}
          correctIndex={0}
          explanations={[
            "Generators generate elements dynamically 1-by-1 only when requested!",
            "Generators keep items in memory stream, not hard disk files.",
            "Variables stay active inside the generator object.",
            "Generators work with any data type."
          ]}
        />

        <MCQCard
          question="❓ Question 5: Which keyword pauses a Generator function and remembers state?"
          options={[
            "return",
            "yield",
            "pause",
            "break"
          ]}
          correctIndex={1}
          explanations={[
            "return terminates the function completely.",
            "'yield' yields a value, pauses function execution, and saves state!",
            "pause is not a Python keyword.",
            "break exits loops, it does not yield values."
          ]}
        />

        <MCQCard
          question="❓ Question 6: What exception is raised when next() reaches the end of an Iterator or Generator?"
          options={[
            "IndexError",
            "StopIteration",
            "ValueError",
            "TypeError"
          ]}
          correctIndex={1}
          explanations={[
            "IndexError occurs when indexing a list out of bounds.",
            "'StopIteration' signals to Python loops that the stream is complete.",
            "ValueError occurs for incorrect function argument values.",
            "TypeError occurs when applying operations to wrong data types."
          ]}
        />
      </div>
    </div>
  );
}
