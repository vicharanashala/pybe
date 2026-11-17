import json
import os

db_path = r"d:\pybe\server\src\data\db.json"

new_data = {
  "modules": [
    {
      "id": "morning-routine",
      "concept": "Definition & Parameters (def)",
      "interactive_case_study": {
        "title": "Packing for College",
        "description": "You are rushing to get ready for morning lectures at SGSITS. Instead of repeating 50 separate actions, you group them. Learn to define go_to_college(tiffin_box) and see how packing a physical lunchbox perfectly mirrors passing a parameter into a function.",
        "stages": [
          {
            "id": "think_it_through",
            "stage_number": 1,
            "title": "Think It Through",
            "type": "mcq",
            "narrative": "The sun rises. The day's quest begins. You must prepare your inventory for the long journey to campus.",
            "question": "To survive the day, which essential item must be passed into your morning routine?",
            "options": [
              "A steel tiffin box",
              "A television remote",
              "A pillow"
            ],
            "correct_index": 0,
            "companion_response_correct": "Exactly! By defining the routine and passing the tiffin box, you ensure you have the fuel you need for the day.",
            "companion_response_incorrect": "Not quite. Think about what will give you energy for afternoon lectures."
          },
          {
            "id": "concept_unlock",
            "stage_number": 2,
            "title": "Concept Unlock: Function Definition (def)",
            "type": "companion_lesson",
            "sections": [
              {
                "companion_avatar": "💡",
                "companion_title": "Concept Unlocked!",
                "companion_type": "concept",
                "text": "The solution is a Python **Function**. \n\nA function is like a morning routine. You define it once, and reuse it by calling its name and giving it new inputs (arguments)."
              },
              {
                "companion_avatar": "🔧",
                "companion_title": "The def Syntax",
                "companion_type": "concept",
                "text": "Here is how you build one:\n\n```python\ndef go_to_college(tiffin_box):\n    print(\"Ready for lectures with: \" + tiffin_box)\n```\n\n• **def**: Tells Python you are defining a function.\n• **go_to_college**: The name you give it.\n• **(tiffin_box)**: The parameters (inputs) the function expects."
              }
            ]
          },
          {
            "id": "the_execution",
            "stage_number": 3,
            "title": "The Execution: Define the Calculator",
            "type": "fill_in_blank",
            "narrative": "Complete the blueprint to start your day right.",
            "code": "def go_to_college(________):\n    return 'Energy ready for the day'",
            "options": [
              "tiffin_box",
              "television_remote",
              "pillow",
              "nothing"
            ],
            "correct_index": 0,
            "correct_answer": "tiffin_box",
            "hints": [
              "What physical item mirrors passing a parameter to give you energy?",
              "Look at the question from stage 1."
            ],
            "explanation": "Passing 'tiffin_box' acts as a parameter to your function, providing the necessary input (energy) to complete your routine."
          }
        ],
        "image_prompt": "Cinematic, realistic, overhead shot of a heavy steel tiffin box resting on a wooden table, morning light streaming in, college backpack nearby."
      }
    },
    {
      "id": "grocery-run",
      "concept": "Return Values (return vs. print)",
      "interactive_case_study": {
        "title": "The Market Run",
        "description": "You are sent to the local market to buy vegetables. If your function just prints 'Bought tomatoes', you come home empty-handed. You must return the groceries so they actually end up in your kitchen's memory.",
        "stages": [
          {
            "id": "think_it_through",
            "stage_number": 1,
            "title": "Think It Through",
            "type": "mcq",
            "narrative": "Your mom sends you to the market to buy tomatoes for dinner. You could just shout 'Bought tomatoes!' at the market, but that won't help cook the meal.",
            "question": "Why is just saying (printing) you bought something useless for actually cooking dinner?",
            "options": [
              "A) You need to speak louder.",
              "B) Saying it just produces sound; it doesn't bring the physical item back to the kitchen to be used.",
              "C) The market is too noisy.",
              "D) Python doesn't have a print command."
            ],
            "correct_index": 1,
            "companion_response_correct": "Correct! Just like shouting doesn't bring food home, `print` only shows text. You need `return` to bring the data back to where it can be used.",
            "companion_response_incorrect": "Not quite. Think about how the kitchen gets the actual ingredients."
          },
          {
            "id": "concept_unlock",
            "stage_number": 2,
            "title": "Concept Unlock: Return Values",
            "type": "companion_lesson",
            "sections": [
              {
                "companion_avatar": "💡",
                "companion_title": "Concept Unlocked!",
                "companion_type": "concept",
                "text": "Printing is for humans. **Returning** is for machines.\n\nWhen a function uses `return`, it hands a piece of data back to the rest of the program so it can be used, stored, or checked."
              },
              {
                "companion_avatar": "🔧",
                "companion_title": "Return vs Print",
                "companion_type": "concept",
                "text": "```python\ndef bad_market_run():\n    print('Tomatoes') # Just text on a screen\n\ndef good_market_run():\n    return 'Tomatoes' # Real data you can use!\n\nkitchen_counter = good_market_run()\n```"
              }
            ]
          },
          {
            "id": "the_execution",
            "stage_number": 3,
            "title": "The Execution: Return the Data",
            "type": "fill_in_blank",
            "narrative": "Make sure the tomatoes actually make it back to the kitchen.",
            "code": "def market_run():\n    ________ 'tomatoes'",
            "options": [
              "print",
              "output",
              "return",
              "send"
            ],
            "correct_index": 2,
            "correct_answer": "return",
            "hints": [
              "Remember, shouting at the market doesn't bring the veggies home. You need to hand them back.",
              "What keyword gives data back to the program?"
            ],
            "explanation": "You must 'return' the groceries so they are handed back into memory. Using 'print' just displays text, leaving you empty-handed."
          }
        ]
      }
    },
    {
      "id": "canteen-order",
      "concept": "Default Arguments",
      "interactive_case_study": {
        "title": "The Canteen Chai",
        "description": "You order the same tea every day. Build order_chai(sugar='medium'). See how a default fallback saves you time, but leaves the door open to override it with sugar='high' during stressful exam weeks.",
        "stages": [
          {
            "id": "think_it_through",
            "stage_number": 1,
            "title": "Think It Through",
            "type": "mcq",
            "narrative": "Every day between classes, you visit the college canteen and order chai. 95% of the time, you want medium sugar. It gets tiring specifying 'medium sugar' every single day.",
            "question": "How could you speed up your ordering process while still being able to get extra sugar during finals?",
            "options": [
              "A) Stop drinking chai.",
              "B) Order black tea instead.",
              "C) Assume the order is 'medium sugar' by default, so you only specify when you want something else.",
              "D) Yell your order."
            ],
            "correct_index": 2,
            "companion_response_correct": "Spot on. By assigning a default value, you save time on a normal day but leave the door open to override it when needed.",
            "companion_response_incorrect": "Not quite. Think about how to save time without losing flexibility."
          },
          {
            "id": "concept_unlock",
            "stage_number": 2,
            "title": "Concept Unlock: Default Arguments",
            "type": "companion_lesson",
            "sections": [
              {
                "companion_avatar": "💡",
                "companion_title": "Concept Unlocked!",
                "companion_type": "concept",
                "text": "In Python, you can give a function parameter a **Default Argument**.\n\nIf the user provides a value, Python uses it. If they don't, Python falls back to the default. It's the ultimate time-saver."
              },
              {
                "companion_avatar": "🔧",
                "companion_title": "The Syntax",
                "companion_type": "concept",
                "text": "Just use an equals sign in the `def` statement:\n\n```python\ndef order_chai(sugar='medium'):\n    print(f'Brewing chai with {sugar} sugar')\n\n# We don't have to provide the argument!\norder_chai()\n# Output: Brewing chai with medium sugar\n```"
              }
            ]
          },
          {
            "id": "the_execution",
            "stage_number": 3,
            "title": "The Execution: Set the Default",
            "type": "fill_in_blank",
            "narrative": "Save time at the canteen by setting a default fallback for your chai order.",
            "code": "def order_chai(________):\n    # brewing logic",
            "options": [
              "sugar = 'medium'",
              "sugar='medium'",
              "sugar == 'medium'",
              "default sugar"
            ],
            "correct_index": 1,
            "correct_answer": "sugar='medium'",
            "hints": [
              "To set a default argument, assign it in the parameter list using a single equals sign.",
              "Check the syntax in the Concept Unlock. Spaces aren't usually needed around the equals sign in parameters."
            ],
            "explanation": "Default arguments save time for standard executions by providing a fallback value automatically, while leaving the door open to override it when needed."
          }
        ]
      }
    },
    {
      "id": "pocket-money",
      "concept": "Variable Scope (Local vs. Global)",
      "interactive_case_study": {
        "title": "The Local Wallet",
        "description": "You have a global family bank account, but when you go out, you use a local wallet. Learn data isolation by spending your local cash without accidentally draining the global family funds.",
        "stages": [
          {
            "id": "think_it_through",
            "stage_number": 1,
            "title": "Think It Through",
            "type": "mcq",
            "narrative": "Your family has a shared bank account with ₹50,000 for household expenses. You head out to a cafe. When you pay for coffee, you shouldn't deduct it directly from the shared bank account.",
            "question": "How do you ensure you only spend your own pocket money without touching the family funds?",
            "options": [
              "A) Spend the family funds anyway.",
              "B) Create a contained, isolated local source (a Local Wallet) just for your cafe visit.",
              "C) Don't go to the cafe.",
              "D) Wash dishes to pay."
            ],
            "correct_index": 1,
            "companion_response_correct": "Correct! Containment is key. In programming, if a function needs a variable, it should define it locally inside the function, not globally. This prevents the function from messing up the rest of the application.",
            "companion_response_incorrect": "Not quite. Think about keeping your own money separate."
          },
          {
            "id": "concept_unlock",
            "stage_number": 2,
            "title": "Concept Unlock: Local Variable Scope",
            "type": "companion_lesson",
            "sections": [
              {
                "companion_avatar": "💡",
                "companion_title": "Concept Unlocked!",
                "companion_type": "concept",
                "text": "In Python, a variable created inside a function belongs ONLY to that function. This is called **Local Scope**.\n\nA local variable is like a contained wallet. It does its job, and when the function finishes, the local variable vanishes, keeping the rest of the program safe."
              },
              {
                "companion_avatar": "🔧",
                "companion_title": "Data Isolation",
                "companion_type": "concept",
                "text": "```python\nfamily_bank = 50000 # Global\n\ndef cafe_visit():\n    wallet = 500 # Local!\n    print(f'Spending {wallet} at the cafe')\n\ncafe_visit()\nprint(family_bank) # Still safely 50000!\n```"
              }
            ]
          },
          {
            "id": "the_execution",
            "stage_number": 3,
            "title": "The Execution: Isolate the Wallet",
            "type": "fill_in_blank",
            "narrative": "Create a local variable to safely spend money without draining the family account.",
            "code": "family_bank = 50000 \n\ndef cafe_visit():\n    ________ = 500 \n    return wallet",
            "options": [
              "family_bank",
              "global family_bank",
              "wallet",
              "money"
            ],
            "correct_index": 2,
            "correct_answer": "wallet",
            "hints": [
              "We need to create a new local variable that matches what the function returns.",
              "Look at the return statement on the next line to see what variable name is expected."
            ],
            "explanation": "Creating a new variable `wallet` inside the function makes it a local variable. This isolated data executes its task without overwriting the global `family_bank` variable."
          }
        ]
      }
    },
    {
      "id": "lost-keys",
      "concept": "Recursion",
      "interactive_case_study": {
        "title": "Searching the Backpack",
        "description": "You lost your ID card. You write a search_bag() function that calls its own name to open smaller and smaller zippered pockets inside your backpack until it finally hits the base case and finds the card.",
        "stages": [
          {
            "id": "think_it_through",
            "stage_number": 1,
            "title": "Think It Through",
            "type": "mcq",
            "narrative": "You're at the college gate and can't find your ID card. You open your main backpack, but inside there are smaller pouches. Inside those are even smaller pockets.",
            "question": "What is the core action you are performing as you dig through the bag?",
            "options": [
              "A) Doing a completely different task for every pocket.",
              "B) Applying the exact same 'open and search' logic over and over on smaller pockets until the card is found.",
              "C) Buying a new ID card.",
              "D) Going home."
            ],
            "correct_index": 1,
            "companion_response_correct": "Exactly! It's the same task repeated, feeding the result into the next step. In Python, when a function solves a problem by calling *itself* on a smaller piece of the puzzle, we call that Recursion.",
            "companion_response_incorrect": "Not quite. Think about the repetitive nature of searching nested pockets."
          },
          {
            "id": "concept_unlock",
            "stage_number": 2,
            "title": "Concept Unlock: Recursion",
            "type": "companion_lesson",
            "sections": [
              {
                "companion_avatar": "💡",
                "companion_title": "Concept Unlocked!",
                "companion_type": "concept",
                "text": "**Recursion** is when a function calls itself from inside its own body.\n\nIt sounds like an infinite loop, but it's brilliant for breaking down a sequence (like nested pockets). You just need a **Base Case** (finding the ID) to tell it when to stop."
              },
              {
                "companion_avatar": "🔧",
                "companion_title": "The Base Case and Recursive Call",
                "companion_type": "concept",
                "text": "```python\ndef search_bag(pocket):\n    if pocket == 'ID Card':        # BASE CASE (Stop!)\n        return 'Found it!'\n    else:                    # RECURSIVE CALL (Keep going)\n        return search_bag(pocket.next_pocket)\n```"
              }
            ]
          },
          {
            "id": "the_execution",
            "stage_number": 3,
            "title": "The Execution: Route the Call",
            "type": "fill_in_blank",
            "narrative": "Search the pockets recursively until the ID card is found.",
            "code": "def search_bag(pocket):\n    if found:\n        return 'ID Card'\n    ________(next_pocket)",
            "options": [
              "search_bag",
              "return search_bag",
              "call",
              "next"
            ],
            "correct_index": 1,
            "correct_answer": "return search_bag",
            "hints": [
              "To perform recursion, the function must call its own name.",
              "Remember to 'return' the result of the recursive call so the found ID reaches all the way back up!"
            ],
            "explanation": "The function calls its own name (`search_bag`) to traverse the pockets repeatedly until the base case is met. Using `return` ensures the found item is passed back up the chain."
          }
        ]
      }
    }
  ]
}

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(new_data, f, indent=2)

print("db.json updated successfully.")
