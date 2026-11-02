# Database & Storage Schema (`database_schema.md`)

This document defines the schema for the local JSON file storage (`server/src/data/personalized_templates.json`) used in the current prototype, along with the equivalent Mongoose NoSQL schemas for future database migrations. It reflects our **5-Topic Architecture** and our pivot to immersive storytelling supporting **up to 500 words using simple, easy-to-understand language**.

---

## 1. Local JSON File Schema (`personalized_templates.json`)

The data layer is decoupled into two primary objects: `master_archetypes` (containing exactly 1 generic story template for each of our 5 core Python topics) and `thematic_dictionaries` (which allows infinite scalability across learning categories without modifying code). This architectural separation achieves extreme efficiency: **5 topics -> 5 templates of stories × 50 categories of 50 subcategories -> 250 stories with under 100 KB of storage!**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "PersonalizedTemplatesSchema",
  "type": "object",
  "required": ["master_archetypes", "thematic_dictionaries"],
  "properties": {
    "master_archetypes": {
      "type": "object",
      "description": "Object mapping the 5 core Python topic IDs to their story templates (supporting up to 500 words using simple language).",
      "required": [
        "variables_identity",
        "conditional_gatekeeper",
        "loop_depletion",
        "lists_inventory",
        "functions_reusability"
      ],
      "additionalProperties": {
        "type": "object",
        "required": ["concept", "description", "story_layer", "discovery_layer", "application_layer"],
        "properties": {
          "concept": { "type": "string", "example": "variables" },
          "description": { "type": "string", "example": "Teaches how we store and change data." },
          "story_layer": {
            "type": "string",
            "description": "Immersive narrative template supporting up to 500 words using simple language with string interpolation placeholders.",
            "example": "In the beautiful and vast place called {domain}, there was someone very special named {character}..."
          },
          "discovery_layer": {
            "type": "object",
            "description": "Key-value pairs representing plain-English pseudocode logic or state storage mappings."
          },
          "application_layer": {
            "type": "string",
            "description": "Code template implementing the 95/5 rule with target blanks.",
            "example": "{state_variable} = {initial_value}\n# Fill in the blank to change the state!\n{state_variable} = _________"
          }
        }
      }
    },
    "thematic_dictionaries": {
      "type": "object",
      "description": "Thematic vocabulary mappings keyed by category/niche ID. Easily scales to 50+ or infinite categories.",
      "additionalProperties": {
        "type": "object",
        "required": ["allowed_archetype", "domain", "character"],
        "properties": {
          "allowed_archetype": {
            "type": "string",
            "enum": [
              "variables_identity",
              "conditional_gatekeeper",
              "loop_depletion",
              "lists_inventory",
              "functions_reusability"
            ]
          },
          "domain": { "type": "string", "example": "the Hogwarts Great Hall" },
          "character": { "type": "string", "example": "a brave first-year student" }
        }
      }
    }
  }
}
```

---

## 2. Future NoSQL Migration: Mongoose Schema Definitions

When migrating to MongoDB, the following Mongoose schemas will replace the local JSON file read operations in `PersonalizedRepo.js`:

```javascript
import mongoose from 'mongoose';
const { Schema } = mongoose;

// 1. Archetype Schema (Supporting up to 500 words in storyLayer)
const ArchetypeSchema = new Schema({
  archetypeId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true,
    enum: [
      'variables_identity',
      'conditional_gatekeeper',
      'loop_depletion',
      'lists_inventory',
      'functions_reusability'
    ]
  },
  concept: { type: String, required: true },
  description: { type: String, required: true },
  storyLayer: { type: String, required: true, maxlength: 3500 }, // Allows up to ~500 words in simple language
  discoveryLayer: { type: Schema.Types.Mixed, required: true },
  applicationLayer: { type: String, required: true }
}, { timestamps: true });

// 2. Thematic Dictionary Schema (Scales infinitely to any interest domain)
const ThematicDictionarySchema = new Schema({
  themeId: { type: String, required: true, unique: true, index: true },
  allowedArchetype: { type: String, required: true, ref: 'Archetype' },
  domain: { type: String, required: true },
  character: { type: String, required: true },
  vocabulary: { type: Map, of: String, default: {} }
}, { timestamps: true });

// 3. User Belief & Reflection State Schema
const UserBeliefStateSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  activeBeliefs: [{ type: String }],
  completedThemes: [{
    themeId: { type: String, ref: 'ThematicDictionary' },
    completedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const Archetype = mongoose.model('Archetype', ArchetypeSchema);
export const ThematicDictionary = mongoose.model('ThematicDictionary', ThematicDictionarySchema);
export const UserBeliefState = mongoose.model('UserBeliefState', UserBeliefStateSchema);
```
