import {
  Package, MessageSquare, Calculator, GitBranch, Repeat, Settings2,
  List, Lock, BookOpen, Blend, Type, Folder, Sparkles,
  Terminal, Blocks, Box, ShieldCheck, GitFork, Layers
} from 'lucide-react';

// Concept.icon is stored in MongoDB as a plain string (a lucide icon name,
// e.g. "Package") rather than an emoji — Mongo can't store a React
// component, so this map is how a name turns into the real icon everywhere
// a concept is shown (Sidebar, ModulesPage, NotesPage, ...).
const ICONS = {
  Terminal,       // hello world
  Package,        // variables
  MessageSquare,  // input & output
  Calculator,     // operators
  GitBranch,      // conditions
  Repeat,         // loops
  Settings2,      // functions
  List,           // lists
  Lock,           // tuples
  BookOpen,       // dictionaries
  Blend,          // sets
  Type,           // string handling
  Folder,         // file handling
  Blocks,         // classes
  Box,            // objects
  ShieldCheck,    // access modifiers
  GitFork,        // inheritance
  Layers,         // abstraction
};

export function ConceptIcon({ name, size = 18, className = '' }) {
  const Icon = ICONS[name] || Sparkles;
  return <Icon size={size} className={className} />;
}
