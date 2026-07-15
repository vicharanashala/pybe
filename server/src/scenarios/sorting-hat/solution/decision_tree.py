def classify_student(student):
    """
    A simple hand-coded decision tree.
    """
    if student['bravery'] >= 8:
        if student['cunning'] > 5:
            return 'Slytherin' # Brave but cunning
        else:
            return 'Gryffindor'
    elif student['intelligence'] >= 7:
        return 'Ravenclaw'
    elif student['cunning'] >= 7:
        return 'Slytherin'
    else:
        return 'Hufflepuff'

# Example usage
new_student = {'bravery': 9, 'cunning': 2, 'intelligence': 6, 'loyalty': 8}
house = classify_student(new_student)
print(f"The Sorting Hat says: {house}!")
