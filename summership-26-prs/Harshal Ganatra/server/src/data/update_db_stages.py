import json

db_path = r"d:\pybe\server\src\data\db.json"

with open(db_path, "r", encoding="utf-8") as f:
    data = json.load(f)

for module in data["modules"]:
    if module["id"] == "morning-routine":
        module["interactive_case_study"]["stages"] = [
            {
                "id": "q1",
                "stage_number": 1,
                "title": "Phase 1: Story-Based Reasoning",
                "type": "mcq",
                "narrative": "You have 20 separate actions to do before leaving for morning lectures at SGSITS (packing books, finding keys, wearing shoes).",
                "question": "What is the most efficient way to handle this every day?",
                "options": [
                    "Group them into a single, repeatable 'Morning Routine'",
                    "Do them randomly each day",
                    "Skip them to save time"
                ],
                "correct_index": 0,
                "companion_response_correct": "Grouping actions is exactly what a function does!",
                "companion_response_incorrect": "Think about how you can reuse the same steps without repeating the effort."
            },
            {
                "id": "q2",
                "stage_number": 2,
                "title": "Phase 1: Story-Based Reasoning",
                "type": "mcq",
                "narrative": "Your routine works perfectly, but the campus security requires your physical student ID card to let you in.",
                "question": "In our function metaphor, what does this physical ID card represent?",
                "options": [
                    "A variable scope",
                    "A syntax error",
                    "A required input or 'parameter' that the routine needs to succeed"
                ],
                "correct_index": 2,
                "companion_response_correct": "Correct! It is a parameter passed into the function.",
                "companion_response_incorrect": "Not quite. What is something you must provide for a process to succeed?"
            },
            {
                "id": "q3",
                "stage_number": 3,
                "title": "Phase 1: Story-Based Reasoning",
                "type": "mcq",
                "narrative": "You start executing your routine and head to the campus.",
                "question": "What happens if you execute your morning routine but forget to hand over the ID card parameter?",
                "options": [
                    "The routine crashes at the gate.",
                    "You get an A in class.",
                    "The gate ignores the error."
                ],
                "correct_index": 0,
                "companion_response_correct": "Exactly! Python will throw a TypeError if a required parameter is missing!",
                "companion_response_incorrect": "Remember the ID card is mandatory. Think about what happens in code when required data is missing."
            },
            {
                "id": "q4",
                "stage_number": 4,
                "title": "Phase 2: Python Syntax Practice",
                "type": "mcq",
                "narrative": "Now let's translate this into code.",
                "question": "In Python, which specific keyword is used to define a new routine (function)?",
                "options": [
                    "func",
                    "define",
                    "def",
                    "function"
                ],
                "correct_index": 2,
                "companion_response_correct": "Correct! The 'def' keyword defines a function.",
                "companion_response_incorrect": "Python uses a short, 3-letter abbreviation for 'define'."
            },
            {
                "id": "q5",
                "stage_number": 5,
                "title": "Phase 2: Python Syntax Practice",
                "type": "mcq",
                "narrative": "You're writing your function definition and need to specify that it requires an ID card.",
                "question": "Where do the required parameters (like your id_card) go when writing the function definition?",
                "options": [
                    "Before the def keyword",
                    "Inside the parentheses immediately following the function name.",
                    "At the very end of the file",
                    "Inside curly braces {}"
                ],
                "correct_index": 1,
                "companion_response_correct": "Spot on. Parameters are placed in parentheses after the function name.",
                "companion_response_incorrect": "Think about how we normally provide arguments to a function like print()."
            },
            {
                "id": "q6",
                "stage_number": 6,
                "title": "Phase 2: Python Syntax Practice",
                "type": "mcq",
                "narrative": "The routine has several steps. Python needs to know which steps belong to the routine.",
                "question": "How does Python know which tasks belong inside your go_to_college routine and which tasks belong to the rest of your day?",
                "options": [
                    "By indenting the code underneath the def statement.",
                    "By surrounding them with tags",
                    "By numbering them",
                    "By coloring the text"
                ],
                "correct_index": 0,
                "companion_response_correct": "Correct! Indentation defines the block of code inside the function.",
                "companion_response_incorrect": "Python is famous for relying on white space instead of brackets. What is that called?"
            },
            {
                "id": "q7",
                "stage_number": 7,
                "title": "Phase 3: Final Code Challenge",
                "type": "fill_in_blank",
                "narrative": "Assemble the complete routine. Fill in the blanks to define the function and pass the required item.",
                "code": "____ go_to_college(________):\n    print(\"Ready for class!\")",
                "options": [
                    "def, id_card",
                    "func, id_card",
                    "def, nothing",
                    "define, id_card"
                ],
                "correct_index": 0,
                "correct_answer": ["def", "id_card"],
                "hints": [
                    "Remember the 3-letter keyword to define a function, and the parameter you need for security.",
                    "Look for the option that combines 'def' and 'id_card'."
                ],
                "explanation": "You use 'def' to start the function definition, and pass 'id_card' in the parentheses as the required parameter."
            }
        ]

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Updated morning-routine with 7 stages.")
