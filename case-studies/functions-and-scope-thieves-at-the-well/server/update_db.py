import json
import os

def get_hint_and_exp(text):
    text_lower = text.lower()
    hint = "Review the core concepts in the documentation."
    exp = "This answer follows the standard Python syntax and rules."
    
    if "while" in text_lower:
        hint = "Remember that a while loop runs until its condition becomes False. Watch out for infinite loops!"
        exp = "The condition dictates the loop's execution. Without a proper update, it causes an infinite loop."
    elif "def " in text_lower or "function" in text_lower or "return" in text_lower:
        hint = "Functions use the 'def' keyword and send data back using 'return'."
        exp = "Functions allow code reusability. Parameters pass data in, and return passes data out."
    elif "class " in text_lower or "object" in text_lower or "self" in text_lower:
        hint = "Think about Object-Oriented principles. 'self' refers to the instance."
        exp = "Classes are blueprints, and objects are instances of those blueprints."
    elif "[" in text_lower or "list" in text_lower or "append" in text_lower:
        hint = "Lists are ordered, mutable collections. Remember they are 0-indexed."
        exp = "Python lists allow dynamic resizing and index-based access."
    elif "{" in text_lower or "dict" in text_lower or "key" in text_lower:
        hint = "Dictionaries use key-value pairs and require unique, immutable keys."
        exp = "Dictionaries provide fast lookups using keys rather than indices."
    elif "tuple" in text_lower or "set" in text_lower:
        hint = "Tuples are immutable (cannot be changed). Sets only store unique items."
        exp = "Choosing the right data structure (tuple for fixed data, set for uniqueness) improves performance."
    elif "open(" in text_lower or "file" in text_lower or "read(" in text_lower:
        hint = "File modes like 'r' (read), 'w' (write), and 'a' (append) dictate permissions."
        exp = "Always use the 'with' statement when opening files to ensure they close automatically."
    elif "if " in text_lower or "else" in text_lower or "elif" in text_lower:
        hint = "Conditionals execute blocks of code based on True/False boolean evaluations."
        exp = "The 'if/elif/else' structure allows branching logic paths in your program."
    elif "=" in text_lower or "variable" in text_lower or "float" in text_lower or "int" in text_lower:
        hint = "Variables store data. Python automatically infers types like string, int, or float."
        exp = "Variable assignment evaluates the right side and stores it in the left side identifier."
    elif "for " in text_lower or "range" in text_lower:
        hint = "A for loop iterates over a sequence. The range() function is commonly used for fixed iterations."
        exp = "For loops are ideal when the number of iterations is known ahead of time."
        
    return hint, exp

db_path = 'src/data/db.json'
with open(db_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for module in data.get('modules', []):
    evals = module.get('evaluations', {})
    for tier in ['rookie', 'intermediate', 'programmer']:
        items = evals.get(tier, [])
        new_items = []
        for item in items:
            if isinstance(item, str):
                hint, exp = get_hint_and_exp(item)
                new_items.append({
                    "question": item,
                    "hint": hint,
                    "explanation": exp
                })
            else:
                new_items.append(item)
        evals[tier] = new_items

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated db.json successfully!")
