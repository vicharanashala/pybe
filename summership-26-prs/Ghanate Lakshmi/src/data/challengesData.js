// Challenges Data for PyBe Final Interactive Game & Python Sandbox (3 Core Topics)

export const SCENARIO_QUIZ = [
  {
    id: 1,
    question: 'Lakshmi wants to keep checking station after station UNTIL the station name becomes "Raidurg". Which loop construct fits best?',
    options: ['WHILE LOOP', 'FOR LOOP', 'NESTED LOOPS'],
    correct: 'WHILE LOOP',
    explanation: 'A `while` loop repeats as long as a condition (station != "Raidurg") evaluates to True.'
  },
  {
    id: 2,
    question: 'The canteen worker has a list of 5 food orders: ["Samosa", "Puff", "Dosa", "Juice", "Biryani"]. To prepare each dish in sequence, which loop fits best?',
    options: ['WHILE LOOP', 'FOR LOOP', 'NESTED LOOPS'],
    correct: 'FOR LOOP',
    explanation: 'A `for` loop iterates directly through each item in a collection or list.'
  },
  {
    id: 3,
    question: 'The auditorium has 5 rows, and each row has 6 seats. To check every seat in every row (30 seats total), which loop pattern fits best?',
    options: ['WHILE LOOP', 'FOR LOOP', 'NESTED LOOPS'],
    correct: 'NESTED LOOPS',
    explanation: 'An outer `for` loop over rows combined with an inner `for` loop over seats iterates through a 2D matrix.'
  }
];

export const CODING_CHALLENGES = [
  {
    id: 'c1',
    title: 'Challenge 1: Help Lakshmi Reach Raidurg (while loop)',
    description: 'Use a `while` loop to check stations from Ameerpet until Raidurg is reached.',
    testType: 'while_metro',
    initialCode: `# Help Lakshmi reach Raidurg station using a while loop!
stations = [
    "Ameerpet",
    "Madhura Nagar",
    "Yusufguda",
    "Road No. 5 Jubilee Hills",
    "Jubilee Hills Check Post",
    "Peddamma Gudi",
    "Madhapur",
    "Durgam Cheruvu",
    "HITEC City",
    "Raidurg"
]

destination = "Raidurg"
index = 0

# WRITE YOUR WHILE LOOP BELOW:
while index < len(stations):
    current = stations[index]
    print("Checking station:", current)
    if current == destination:
        print("Reached Raidurg!")
    index += 1
`,
    hint: 'Use `while index < len(stations):` and increment `index += 1`!'
  },
  {
    id: 'c2',
    title: 'Challenge 2: Prepare Canteen Orders (for loop)',
    description: 'Use a `for` loop to prepare every food dish in the canteen order list.',
    testType: 'for_friends',
    initialCode: `# Prepare every canteen food order using a for loop
orders = ["Samosa", "Puff", "Dosa", "Juice", "Biryani"]

# WRITE YOUR FOR LOOP BELOW:
for dish in orders:
    print("Preparing dish:", dish)
`,
    hint: 'Use `for dish in orders:` and `print(dish)`!'
  },
  {
    id: 'c3',
    title: 'Challenge 3: Check All Auditorium Seats (nested loops)',
    description: 'Use nested `for` loops to check 5 rows x 6 seats (30 total seats).',
    testType: 'nested_seats',
    initialCode: `# Check all 30 auditorium seats using nested for loops
rows = [1, 2, 3, 4, 5]
seats = [1, 2, 3, 4, 5, 6]

# WRITE YOUR NESTED LOOPS BELOW:
for r in rows:
    for s in seats:
        print("Row", r, "Seat", s, "checked")
`,
    hint: 'Outer `for r in rows:` loop, inner `for s in seats:` loop!'
  }
];
