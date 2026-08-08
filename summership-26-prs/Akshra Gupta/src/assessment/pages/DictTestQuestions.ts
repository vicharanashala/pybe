import type { QuizQuestion } from '../types';

export const DICT_TEST_QUESTIONS: QuizQuestion[] = [
  // --- PREDICT THE OUTPUT ---
  {
    id: 'dict-test-predict-1',
    type: 'predict',
    question: '1. Predict the Output: What will print(scores["Math"]) output?',
    codeSnippet: `scores = {"Math": 0, "English": 25}\nscores["Math"] = 100\nprint(scores["Math"])`,
    options: [
      'A) 0',
      'B) 100',
      'C) [0, 100]',
      'D) KeyError'
    ],
    correctOptionIndex: 1,
    explanation: 'Assigning scores["Math"] = 100 updates the value paired with Key "Math" from 0 to 100.',
    whyReasoning: `Step 1: The dictionary is initialized with {"Math": 0, "English": 25}.\nStep 2: scores["Math"] = 100 overwrites the existing Key "Math" value from 0 to 100.\nStep 3: Accessing scores["Math"] returns the updated value 100.`
  },
  {
    id: 'dict-test-predict-2',
    type: 'predict',
    question: '2. Predict the Output: What does dict.get() return for a missing Key?',
    codeSnippet: `pocket = {"Door": "Dial destination"}\nresult = pocket.get("Copter", "Not Available")\nprint(result)`,
    options: [
      'A) KeyError',
      'B) None',
      'C) "Not Available"',
      'D) "Door"'
    ],
    correctOptionIndex: 2,
    explanation: 'The .get(key, default) method safely returns the custom default value "Not Available" when the key is missing.',
    whyReasoning: `Step 1: pocket contains only Key "Door".\nStep 2: pocket.get("Copter", "Not Available") looks for Key "Copter". Since it is missing, instead of crashing with KeyError, it returns the provided fallback "Not Available".`
  },

  // --- TRUE / FALSE ---
  {
    id: 'dict-tf-1',
    type: 'true_false',
    question: '3. True or False: Multiple keys in a dictionary can have duplicate values, but all keys must be unique.',
    options: [
      'A) True — Keys must be unique; Values can repeat',
      'B) False — Neither keys nor values can repeat in a dictionary'
    ],
    correctOptionIndex: 0,
    explanation: 'True! Dictionary Keys MUST be unique, but multiple different Keys can store identical Values (e.g. {"Nobita": 0, "Gian": 0}).',
    whyReasoning: `Keys act as unique identifiers (like passport numbers), so no two keys can be identical. However, values are just associated data and can repeat as much as needed! For example: {'Nobita': 0, 'Suneo': 0} is completely valid.`
  },
  {
    id: 'dict-tf-2',
    type: 'true_false',
    question: '4. True or False: Accessing my_dict["missing_key"] returns None by default.',
    options: [
      'A) True — It safely returns None',
      'B) False — Direct bracket lookup for missing keys raises a KeyError crash'
    ],
    correctOptionIndex: 1,
    explanation: 'False! Direct bracket access `my_dict["missing_key"]` raises a KeyError. Only `my_dict.get("missing_key")` returns None safely.',
    whyReasoning: `Direct bracket syntax dict[key] requires the Key to exist; otherwise Python raises a KeyError crash. To safely handle missing keys without crashing, always use dict.get(key).`
  },

  // --- MULTIPLE CHOICE QUESTIONS (MCQs) ---
  {
    id: 'dict-mcq-1',
    type: 'mcq',
    question: '5. MCQ: Which data type CANNOT be used as a Key in a Python Dictionary?',
    options: [
      'A) String ("name")',
      'B) Integer (42)',
      'C) List (["a", "b"])',
      'D) Tuple (("x", "y"))'
    ],
    correctOptionIndex: 2,
    explanation: 'Lists are mutable (can change), so they cannot be hashed. Using a List as a Key raises `TypeError: unhashable type: "list"`.',
    whyReasoning: `Dictionary Keys require Hash Table stability, meaning Keys must be IMMUTABLE (hashable). Strings, integers, and tuples are immutable. Lists can be modified, so attempting to use a List as a key raises TypeError: unhashable type: 'list'.`
  }
];
