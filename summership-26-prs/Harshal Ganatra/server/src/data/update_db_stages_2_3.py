import json

db_path = r"d:\pybe\server\src\data\db.json"

with open(db_path, "r", encoding="utf-8") as f:
    data = json.load(f)

for module in data["modules"]:
    if module["id"] == "grocery-run":
        module["interactive_case_study"]["stages"] = [
            {
                "id": "q1",
                "stage_number": 1,
                "title": "Phase 1: Story-Based Reasoning",
                "type": "mcq",
                "narrative": "You are sent to the market to buy tomatoes. You buy them and just yell 'I bought tomatoes!' but leave them at the stall.",
                "question": "What is the problem?",
                "options": [
                    "The stall owner didn't hear you.",
                    "The house doesn't actually receive the tomatoes.",
                    "You yelled too loudly."
                ],
                "correct_index": 1,
                "companion_response_correct": "Correct! Announcing it isn't enough; the items must be brought back.",
                "companion_response_incorrect": "Think about whether you have physically acquired what you need at home."
            },
            {
                "id": "q2",
                "stage_number": 2,
                "title": "Phase 1: Story-Based Reasoning",
                "type": "mcq",
                "narrative": "When coding, we often want a function to do some work and give us the result.",
                "question": "In this metaphor, what does yelling represent?",
                "options": [
                    "Returning the data.",
                    "Printing to the screen.",
                    "Defining a variable."
                ],
                "correct_index": 1,
                "companion_response_correct": "Exactly! Printing just displays text to a screen (like yelling) but doesn't give the data back.",
                "companion_response_incorrect": "Printing only shows text to humans, similar to just making a loud noise."
            },
            {
                "id": "q3",
                "stage_number": 3,
                "title": "Phase 1: Story-Based Reasoning",
                "type": "mcq",
                "narrative": "Your family is waiting at home for dinner.",
                "question": "To actually cook dinner, what must you physically do with the tomatoes?",
                "options": [
                    "Take a photo of them.",
                    "Carry them back and hand them to the kitchen.",
                    "Cook them at the market."
                ],
                "correct_index": 1,
                "companion_response_correct": "Right! You must carry them back, which is exactly how passing data back to the program works.",
                "companion_response_incorrect": "Think about what actually needs to happen for the house to get the food."
            },
            {
                "id": "q4",
                "stage_number": 4,
                "title": "Phase 2: Python Syntax Practice",
                "type": "mcq",
                "narrative": "Let's translate this to Python.",
                "question": "Which Python keyword is the equivalent of physically carrying the data back to where the function was called?",
                "options": [
                    "print",
                    "return",
                    "give",
                    "output"
                ],
                "correct_index": 1,
                "companion_response_correct": "Correct! The 'return' keyword hands data back so the rest of the program can use it.",
                "companion_response_incorrect": "Remember the word that implies 'bringing something back'."
            },
            {
                "id": "q5",
                "stage_number": 5,
                "title": "Phase 2: Python Syntax Practice",
                "type": "mcq",
                "narrative": "Consider the difference between doing something and handing it back.",
                "question": "If a function uses print(\"Tomatoes\") instead of return \"Tomatoes\", what value is actually handed back to the program's memory?",
                "options": [
                    "\"Tomatoes\"",
                    "True",
                    "None",
                    "An error"
                ],
                "correct_index": 2,
                "companion_response_correct": "Correct! If a function has no return statement, it implicitly hands back 'None'.",
                "companion_response_incorrect": "Think about what 'print' actually does. Does it produce data, or just text for the user?"
            },
            {
                "id": "q6",
                "stage_number": 6,
                "title": "Phase 2: Python Syntax Practice",
                "type": "mcq",
                "narrative": "You've successfully handed back the tomatoes.",
                "question": "What happens to the code inside a function immediately AFTER a return statement is executed?",
                "options": [
                    "The function ends immediately, and no further code in it is run.",
                    "The function continues running.",
                    "The function pauses.",
                    "The function restarts."
                ],
                "correct_index": 0,
                "companion_response_correct": "Right! A return statement exits the function immediately.",
                "companion_response_incorrect": "Once you hand the item back and leave, do you keep doing the routine?"
            },
            {
                "id": "q7",
                "stage_number": 7,
                "title": "Phase 3: Final Code Challenge",
                "type": "fill_in_blank",
                "narrative": "Fill in the blanks to correctly hand the data back to the main program.",
                "code": "def market_run(): \n    ________ \"tomatoes\"",
                "options": [
                    "print",
                    "return",
                    "send",
                    "get"
                ],
                "correct_index": 1,
                "correct_answer": "return",
                "hints": [
                    "Which keyword literally means 'bring back'?",
                    "Select the option that doesn't just display text to the screen."
                ],
                "explanation": "Using 'return' successfully hands the 'tomatoes' data back to the main program's memory."
            }
        ]

    if module["id"] == "canteen-order":
        module["interactive_case_study"]["stages"] = [
            {
                "id": "q1",
                "stage_number": 1,
                "title": "Phase 1: Story-Based Reasoning",
                "type": "mcq",
                "narrative": "You order tea at the campus canteen every day. You always want medium sugar.",
                "question": "How can you save time ordering?",
                "options": [
                    "Stop drinking tea.",
                    "Establish a standard order the chef knows by default.",
                    "Shout your order across the room."
                ],
                "correct_index": 1,
                "companion_response_correct": "Correct! Setting a standard baseline saves time on the routine tasks.",
                "companion_response_incorrect": "Think about how regular customers interact with chefs to save effort."
            },
            {
                "id": "q2",
                "stage_number": 2,
                "title": "Phase 1: Story-Based Reasoning",
                "type": "mcq",
                "narrative": "It is exam week and you are stressed. You suddenly need high sugar.",
                "question": "Does having a standard order prevent you from changing it?",
                "options": [
                    "Yes, a standard order can never be changed.",
                    "No, you can still specifically ask for high sugar to override the standard.",
                    "You have to order coffee instead."
                ],
                "correct_index": 1,
                "companion_response_correct": "Exactly! A default fallback is just a suggestion, not a strict rule.",
                "companion_response_incorrect": "What happens when you go to a restaurant and ask for something slightly different than usual?"
            },
            {
                "id": "q3",
                "stage_number": 3,
                "title": "Phase 1: Story-Based Reasoning",
                "type": "mcq",
                "narrative": "This system works wonderfully for you.",
                "question": "What is the main benefit of this fallback system?",
                "options": [
                    "It confuses the chef.",
                    "It takes longer.",
                    "It saves time 90% of the time, but keeps flexibility for the 10%."
                ],
                "correct_index": 2,
                "companion_response_correct": "Spot on. Time savings for the usual, flexibility for the unusual.",
                "companion_response_incorrect": "Think about the balance between everyday routine and exam week needs."
            },
            {
                "id": "q4",
                "stage_number": 4,
                "title": "Phase 2: Python Syntax Practice",
                "type": "mcq",
                "narrative": "Now let's translate this standard order into Python code.",
                "question": "How do you set a default fallback for a parameter in a Python function definition?",
                "options": [
                    "By using the 'default' keyword.",
                    "By using an equals sign, e.g., sugar=\"medium\"",
                    "By putting it in comments.",
                    "By defining it outside the function."
                ],
                "correct_index": 1,
                "companion_response_correct": "Correct! Providing a value with '=' in the parameters sets the default.",
                "companion_response_incorrect": "Python tries to keep things simple with mathematical symbols."
            },
            {
                "id": "q5",
                "stage_number": 5,
                "title": "Phase 2: Python Syntax Practice",
                "type": "mcq",
                "narrative": "You're writing your code and calling the function.",
                "question": "If you define def order_chai(sugar=\"medium\"): and call it using order_chai(), what sugar level is used?",
                "options": [
                    "\"high\"",
                    "\"none\"",
                    "\"medium\"",
                    "It causes an error."
                ],
                "correct_index": 2,
                "companion_response_correct": "Correct! Since no argument was passed, it falls back to the default.",
                "companion_response_incorrect": "Think about what happens when you just say 'tea' without specifying sugar."
            },
            {
                "id": "q6",
                "stage_number": 6,
                "title": "Phase 2: Python Syntax Practice",
                "type": "mcq",
                "narrative": "Finals week approaches. You need to override the default.",
                "question": "If you call the same function using order_chai(sugar=\"high\"), what happens to the default \"medium\"?",
                "options": [
                    "It is ignored and overridden by \"high\".",
                    "It is mixed, resulting in \"medium-high\".",
                    "It throws an error.",
                    "It is still used."
                ],
                "correct_index": 0,
                "companion_response_correct": "Right! Explicitly passing an argument overrides the default.",
                "companion_response_incorrect": "When you specify what you want, the chef ignores the 'usual' order."
            },
            {
                "id": "q7",
                "stage_number": 7,
                "title": "Phase 3: Final Code Challenge",
                "type": "fill_in_blank",
                "narrative": "Fill in the blank to set up a fallback value for the tea order.",
                "code": "def order_chai(________): \n    # brewing logic",
                "options": [
                    "sugar=\"medium\"",
                    "default=\"medium\"",
                    "sugar",
                    "sugar == \"medium\""
                ],
                "correct_index": 0,
                "correct_answer": "sugar=\"medium\"",
                "hints": [
                    "Remember to assign the fallback value using the equals sign inside the parameters.",
                    "You need the parameter name ('sugar') and its default ('medium')."
                ],
                "explanation": "You define a default argument directly in the parameter list with 'sugar=\"medium\"'."
            }
        ]

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Updated grocery-run and canteen-order with 7 stages.")
