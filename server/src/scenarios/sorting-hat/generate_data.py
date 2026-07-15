import random
import json

houses = ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"]

students = []
for i in range(200):
    bravery = random.randint(0, 10)
    cunning = random.randint(0, 10)
    intelligence = random.randint(0, 10)
    loyalty = random.randint(0, 10)
    
    # Simple deterministic rule for generating sensible fake data
    scores = {"Gryffindor": bravery, "Slytherin": cunning, "Ravenclaw": intelligence, "Hufflepuff": loyalty}
    house = max(scores, key=scores.get)
    
    students.append({
        "id": f"student_{i}",
        "bravery": bravery,
        "cunning": cunning,
        "intelligence": intelligence,
        "loyalty": loyalty,
        "house": house
    })

with open("student_data.json", "w") as f:
    json.dump(students, f, indent=2)

print("Generated 200 student records.")
