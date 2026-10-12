# PyBe Product Specification: The Royal Decoder

## Problem Statement
Standard Python tutorials teach strings by having learners print `"Hello World"`. This is abstract, lacks urgency, and fails to explain *why* we manipulate text. Learners struggle with the concept of immutability and often do not grasp the sheer variety of string methods available to them (`.strip()`, `.split()`, `.join()`, etc.).

## Socratic Solution
We place the learner in a scenario where text manipulation has immediate, high-stakes consequences: Decoding intercepted enemy scrolls in wartime. 

## The 4-Stage Learning Flow (Shravana to Prayoga)

### 1. Shravana (Listening/Context)
The Master Spy presents chaotic, scrambled text. The learner is introduced to the need for "cleaning" and "formatting" data before it can be parsed.

### 2. Manana (Reflection/Choices)
The learner discovers methods like `.strip()` and `.lower()` to clean the "muddy" scroll. They then discover inspection methods like `.startswith()` and `.count()` to assess the priority of a warning without changing it.

### 3. Nididhyasana (Deep Understanding)
The learner uses `.replace()`, `.title()`, and `.upper()` to decode a cipher. They learn that the dot `.` represents a command given to the string, and they must reassign the variable (`msg = ...`) reinforcing the concept of string immutability in Python natively.

### 4. Prayoga (Application)
In the final phase, the learner bridges the gap between Strings and Lists using `.split(',')` to break coordinates apart, and `' - '.join()` to stitch them back together, mastering the complete string manipulation lifecycle.

## Technical Design
- **Vanilla JS Engine:** Fast, zero-dependency engine.
- **State Object:** `state.messageState` tracks the live decryption.
- **Terminal Simulator:** Uses regex to validate syntax and provide granular hints if they forget parentheses, use wrong quotes, or forget to reassign the variable.
