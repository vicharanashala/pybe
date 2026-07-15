const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not set. Add your MongoDB Atlas connection string to backend/.env (see .env.example).');
  process.exit(1);
}

const Concept = require('../models/Concept');

const concepts = [
  { title: 'Hello World', slug: 'hello-world', order: 1, difficulty: 'easy', icon: 'Terminal', description: 'Write your first Python program and learn how to print output to the screen.' },
  { title: 'Variables', slug: 'variables', order: 2, difficulty: 'easy', icon: 'Package', description: 'Store and manipulate data using variables and understand Python\'s dynamic typing.' },
  { title: 'Input & Output', slug: 'input-output', order: 3, difficulty: 'easy', icon: 'MessageSquare', description: 'Interact with users through print statements and input functions.' },
  { title: 'Operators', slug: 'operators', order: 4, difficulty: 'easy', icon: 'Calculator', description: 'Perform arithmetic, comparison, and logical operations in Python.' },
  { title: 'Conditions', slug: 'conditions', order: 5, difficulty: 'easy', icon: 'GitBranch', description: 'Control program flow using if, elif, and else statements.' },
  { title: 'Loops', slug: 'loops', order: 6, difficulty: 'easy', icon: 'Repeat', description: 'Repeat actions with for and while loops, and master iteration.' },
  { title: 'Functions', slug: 'functions', order: 7, difficulty: 'medium', icon: 'Settings2', description: 'Define reusable blocks of code and understand scope and arguments.' },
  { title: 'Lists', slug: 'lists', order: 8, difficulty: 'medium', icon: 'List', description: 'Work with ordered, mutable collections and list operations.' },
  { title: 'Tuples', slug: 'tuples', order: 9, difficulty: 'medium', icon: 'Lock', description: 'Use immutable sequences and understand when to prefer tuples over lists.' },
  { title: 'Dictionaries', slug: 'dictionaries', order: 10, difficulty: 'medium', icon: 'BookOpen', description: 'Map keys to values and leverage Python\'s powerful dict operations.' },
  { title: 'Sets', slug: 'sets', order: 11, difficulty: 'medium', icon: 'Blend', description: 'Work with unique collections and perform set operations like union and intersection.' },
  { title: 'String Handling', slug: 'string-handling', order: 12, difficulty: 'medium', icon: 'Type', description: 'Manipulate text with slicing, formatting, and built-in string methods.' },
  { title: 'File Handling', slug: 'file-handling', order: 13, difficulty: 'medium', icon: 'Folder', description: 'Read from and write to files, and manage file streams safely.' },
  { title: 'Classes', slug: 'classes', order: 14, difficulty: 'medium', icon: 'Blocks', description: 'Define blueprints for objects using Python\'s class syntax.' },
  { title: 'Objects', slug: 'objects', order: 15, difficulty: 'medium', icon: 'Box', description: 'Create instances of a class and work with their attributes and methods.' },
  { title: 'Access Modifiers', slug: 'access-modifiers', order: 16, difficulty: 'medium', icon: 'ShieldCheck', description: 'Control visibility of attributes and methods using public, private, and protected conventions.' },
  { title: 'Inheritance', slug: 'inheritance', order: 17, difficulty: 'medium', icon: 'GitFork', description: 'Extend and reuse behavior by deriving new classes from existing ones.' },
  { title: 'Abstraction', slug: 'abstraction', order: 18, difficulty: 'medium', icon: 'Layers', description: 'Hide implementation details and expose only the essential features of an object.' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Concept.deleteMany({});
    console.log('Cleared existing concepts');

    await Concept.insertMany(concepts);
    console.log(`Seeded ${concepts.length} concepts`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
