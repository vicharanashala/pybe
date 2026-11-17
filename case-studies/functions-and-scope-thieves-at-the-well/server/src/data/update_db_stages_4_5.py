import json

db_path = r"d:\pybe\server\src\data\db.json"

with open(db_path, "r", encoding="utf-8") as f:
    data = json.load(f)

for module in data["modules"]:
    if module["id"] == "pocket-money":
        module["interactive_case_study"]["stages"] = [
            {
                "id": "q1",
                "stage_number": 1,
                "title": "Phase 1: Story-Based Reasoning",
                "type": "mcq",
                "narrative": "You have ₹50,000 in a joint family bank account. You go to a cafe with a ₹500 note in your wallet.",
                "question": "If you spend ₹200 at the cafe, does the cashier take it directly from the joint bank account?",
                "options": [
                    "Yes, they connect directly to the bank.",
                    "No, the cafe only sees and takes from your local wallet.",
                    "They take it from a global loan."
                ],
                "correct_index": 1,
                "companion_response_correct": "Correct! The cafe only interacts with the money you brought with you locally.",
                "companion_response_incorrect": "Think about what physical money you are handing to the cashier."
            },
            {
                "id": "q2",
                "stage_number": 2,
                "title": "Phase 1: Story-Based Reasoning",
                "type": "mcq",
                "narrative": "There is a reason you don't take the family checkbook to a small cafe.",
                "question": "Why is it safer to take a local wallet to the cafe instead of giving the barista direct access to your global family bank account?",
                "options": [
                    "It protects the larger global funds from accidental overspending or mistakes.",
                    "The barista prefers cash.",
                    "It is faster to write a check."
                ],
                "correct_index": 0,
                "companion_response_correct": "Exactly! Limiting scope protects global data from being accidentally modified.",
                "companion_response_incorrect": "What happens if a mistake is made and the wrong amount is charged?"
            },
            {
                "id": "q3",
                "stage_number": 3,
                "title": "Phase 1: Story-Based Reasoning",
                "type": "mcq",
                "narrative": "You finish your coffee and head home.",
                "question": "When you leave the cafe and go home, what happens to the concept of the 'cafe wallet'?",
                "options": [
                    "It ceases to be relevant; you are back in the global household.",
                    "You must report every expense.",
                    "It becomes a global bank."
                ],
                "correct_index": 0,
                "companion_response_correct": "Right! Local context disappears once you leave the location (or function).",
                "companion_response_incorrect": "Think about whether you need a special cafe wallet when you are sitting in your living room."
            },
            {
                "id": "q4",
                "stage_number": 4,
                "title": "Phase 2: Python Syntax Practice",
                "type": "mcq",
                "narrative": "Let's apply this to code.",
                "question": "If a variable is created strictly inside a Python function, where can it be accessed?",
                "options": [
                    "Anywhere in the entire program.",
                    "Only inside that specific function (Local Scope).",
                    "In any other function.",
                    "In the global scope."
                ],
                "correct_index": 1,
                "companion_response_correct": "Correct! Variables defined inside a function are strictly local to it.",
                "companion_response_incorrect": "If your wallet is local to the cafe, where else can you use it without explicitly taking it there?"
            },
            {
                "id": "q5",
                "stage_number": 5,
                "title": "Phase 2: Python Syntax Practice",
                "type": "mcq",
                "narrative": "You attempt to change the global bank balance directly from the function.",
                "question": "What happens if a function tries to modify a global variable without explicitly declaring it as global first?",
                "options": [
                    "It successfully modifies the global variable.",
                    "It crashes the whole program.",
                    "Python creates a new, separate local variable with the same name instead.",
                    "It deletes the global variable."
                ],
                "correct_index": 2,
                "companion_response_correct": "Spot on. Python assumes you want a safe local copy unless you use the 'global' keyword.",
                "companion_response_incorrect": "Python prioritizes safety. It won't let you accidentally overwrite global data."
            },
            {
                "id": "q6",
                "stage_number": 6,
                "title": "Phase 2: Python Syntax Practice",
                "type": "mcq",
                "narrative": "You have a global 'money' and a local 'money'.",
                "question": "Which variable takes priority if a local variable and a global variable share the exact same name inside a function?",
                "options": [
                    "The local variable.",
                    "The global variable.",
                    "They merge.",
                    "An error is thrown."
                ],
                "correct_index": 0,
                "companion_response_correct": "Correct! The function prioritizes its own local context first.",
                "companion_response_incorrect": "If you are in a specific room, do you prioritize what's in the room or what's outside?"
            },
            {
                "id": "q7",
                "stage_number": 7,
                "title": "Phase 3: Final Code Challenge",
                "type": "fill_in_blank",
                "narrative": "Fill in the blanks to create a local variable and return it, leaving the global bank alone.",
                "code": "family_bank = 50000 \ndef cafe_visit(): \n    ________ = 500 \n    return ________",
                "options": [
                    "wallet, wallet",
                    "family_bank, wallet",
                    "wallet, family_bank",
                    "global, wallet"
                ],
                "correct_index": 0,
                "correct_answer": ["wallet", "wallet"],
                "hints": [
                    "You need a new name for the local money, and you must return that specific local variable.",
                    "Both blanks should refer to your local source of funds."
                ],
                "explanation": "You define a local variable 'wallet' to protect the global 'family_bank', and then return that 'wallet'."
            }
        ]

    if module["id"] == "lost-keys":
        module["interactive_case_study"]["stages"] = [
            {
                "id": "q1",
                "stage_number": 1,
                "title": "Phase 1: Story-Based Reasoning",
                "type": "mcq",
                "narrative": "You are looking for your ID card. You open your bag and find a smaller zipped pouch.",
                "question": "Instead of inventing a whole new searching method, what do you do?",
                "options": [
                    "Apply the exact same searching method to the smaller pouch.",
                    "Give up and buy a new ID.",
                    "Empty the entire bag on the floor."
                ],
                "correct_index": 0,
                "companion_response_correct": "Correct! You reuse the same searching logic on a smaller section.",
                "companion_response_incorrect": "Think about what is the most organized way to handle nested pockets."
            },
            {
                "id": "q2",
                "stage_number": 2,
                "title": "Phase 1: Story-Based Reasoning",
                "type": "mcq",
                "narrative": "You dive deeper into the bag.",
                "question": "You keep opening smaller and smaller pockets. What is the specific condition that finally makes you stop searching?",
                "options": [
                    "You get bored.",
                    "You either find the ID card, or you run out of pockets.",
                    "Your hands get tired."
                ],
                "correct_index": 1,
                "companion_response_correct": "Exactly! There must be an end condition, otherwise you'd search forever.",
                "companion_response_incorrect": "What are the logical endpoints to searching for a physical item?"
            },
            {
                "id": "q3",
                "stage_number": 3,
                "title": "Phase 1: Story-Based Reasoning",
                "type": "mcq",
                "narrative": "Imagine a theoretical infinite bag.",
                "question": "If you never find the ID card and never run out of pockets (a magic infinite bag), what happens?",
                "options": [
                    "You magically find it eventually.",
                    "The bag explodes.",
                    "You get stuck opening pockets forever."
                ],
                "correct_index": 2,
                "companion_response_correct": "Right. Without an end condition, a repeating task loops endlessly.",
                "companion_response_incorrect": "If there are infinite pockets, when will you finish?"
            },
            {
                "id": "q4",
                "stage_number": 4,
                "title": "Phase 2: Python Syntax Practice",
                "type": "mcq",
                "narrative": "Let's translate this repeating pocket-search into code.",
                "question": "What is the programming term for a function that calls its own name from within its own code block?",
                "options": [
                    "Iteration",
                    "Recursion",
                    "Inception",
                    "Looping"
                ],
                "correct_index": 1,
                "companion_response_correct": "Correct! Recursion is when a function calls itself.",
                "companion_response_incorrect": "It's a specific mathematical term that sounds like 'recurring'."
            },
            {
                "id": "q5",
                "stage_number": 5,
                "title": "Phase 2: Python Syntax Practice",
                "type": "mcq",
                "narrative": "Recursion needs a way to stop.",
                "question": "In a recursive function, what is the 'base case'?",
                "options": [
                    "The starting point of the function.",
                    "The bottom of the file.",
                    "The condition that stops the function from calling itself again, preventing an infinite loop.",
                    "The lowest variable value."
                ],
                "correct_index": 2,
                "companion_response_correct": "Spot on. The base case breaks the chain of recursive calls.",
                "companion_response_incorrect": "Think about the condition from earlier (finding the ID or running out of pockets)."
            },
            {
                "id": "q6",
                "stage_number": 6,
                "title": "Phase 2: Python Syntax Practice",
                "type": "mcq",
                "narrative": "What if you forget to include a base case in your code?",
                "question": "What happens if a recursive function in Python does not have a base case?",
                "options": [
                    "It runs forever silently in the background.",
                    "It hits a maximum recursion depth error and crashes the program.",
                    "It creates a new bag.",
                    "Python automatically stops it at a logical point."
                ],
                "correct_index": 1,
                "companion_response_correct": "Right! Python has a safety net called maximum recursion depth to prevent complete system lockups.",
                "companion_response_incorrect": "Python has a built-in limit to how many times a function can call itself to protect the computer."
            },
            {
                "id": "q7",
                "stage_number": 7,
                "title": "Phase 3: Final Code Challenge",
                "type": "fill_in_blank",
                "narrative": "Fill in the blank to make the function call itself if the card is not found.",
                "code": "def search_bag(pocket): \n    if pocket.has_id(): \n        return \"Found it!\" \n    ________(pocket.next_zipper)",
                "options": [
                    "return search_bag",
                    "loop",
                    "search_bag",
                    "return find"
                ],
                "correct_index": 0,
                "correct_answer": "return search_bag",
                "hints": [
                    "You need to return the result of calling the same function again.",
                    "What is the name of the function you are currently inside?"
                ],
                "explanation": "To continue searching, you must return the result of calling the function's own name (`search_bag`) on the next pocket."
            }
        ]

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Updated pocket-money and lost-keys with 7 stages.")
