// PyBe Story Data: "THE RAIDURG ADVENTURE" (Exact Slide Counts: Ch1=15 slides, Ch3=20 slides)

export const CHARACTERS = {
  lakshmi: {
    name: 'Lakshmi',
    color: 'from-amber-500 to-orange-600',
    avatarSvg: '👩‍🎓'
  },
  ananya: {
    name: 'Ananya',
    color: 'from-pink-500 to-rose-600',
    avatarSvg: '👩'
  },
  rahul: {
    name: 'Rahul',
    color: 'from-yellow-500 to-amber-600',
    avatarSvg: '👦'
  },
  vikram: {
    name: 'Vikram',
    color: 'from-blue-500 to-indigo-600',
    avatarSvg: '👨‍🎓'
  },
  coordinator: {
    name: 'Event Coordinator',
    color: 'from-purple-500 to-indigo-600',
    avatarSvg: '📋'
  }
};

export const STORY_PARTS = [
  // PROLOGUE: THE MESSAGE
  {
    id: 'prologue',
    title: 'PROLOGUE',
    subtitle: 'The Message',
    location: 'Campus Courtyard, Hyderabad',
    time: 'Friday Afternoon, 4:15 PM',
    slides: [
      {
        type: 'dialogue',
        character: 'lakshmi',
        text: "We need to get to the station before the train leaves.",
        image: '/images/prologue_campus.jpg'
      },
      {
        type: 'dialogue',
        character: 'rahul',
        text: "Can we please walk faster, because I refuse to miss the train again?",
        image: '/images/prologue_campus.jpg',
        frameId: 'phone_close_up'
      },
      {
        type: 'dialogue',
        character: 'vikram',
        text: "The Metro is still our fastest option, so let's head straight there.",
        image: '/images/prologue_campus.jpg',
        frameId: 'metro_route_map'
      },
      {
        type: 'dialogue',
        character: 'ananya',
        text: "Then stop talking and keep walking, because the clock isn't waiting for us.",
        image: '/images/prologue_campus.jpg'
      },
      {
        type: 'choice',
        question: "How should Lakshmi and her friends travel to the fest?",
        options: [
          { text: "Take the City Bus 🚌", correct: false, feedback: "Traffic is completely jammed on Hyderabad roads! Switching to Metro." },
          { text: "Rush to Ameerpet Metro Station 🚇", correct: true, feedback: "Smart choice! Ameerpet Metro is fast & direct." }
        ],
        image: '/images/ameerpet_station.jpg'
      }
    ]
  },

  // CHAPTER 1: THE METRO JOURNEY (EXACTLY 15 STORY SLIDES WITH INTERACTIVE STATIONS)
  {
    id: 'part1',
    title: 'CHAPTER 1 — THE METRO JOURNEY',
    subtitle: 'Ameerpet to Raidurg Station',
    location: 'Ameerpet Metro Station, Hyderabad',
    conceptName: 'WHILE LOOP (Condition-Based Repetition)',
    stations: [
      { name: 'Ameerpet', desc: 'Station Check #1: Not Raidurg!', speaker: 'vikram', reaction: "We haven't reached our destination yet, so let's check the next station." },
      { name: 'Madhura Nagar', desc: 'Station Check #2: Not Raidurg!', speaker: 'lakshmi', reaction: "Madhura Nagar isn't our destination yet, so let's keep going." },
      { name: 'Yusufguda', desc: 'Station Check #3: Not Raidurg!', speaker: 'ananya', reaction: "This still isn't Raidurg, so we need to check the next station." },
      { name: 'Road No 5', desc: 'Station Check #4: Not Raidurg!', speaker: 'rahul', reaction: "Road No 5 is not our stop, so the train makes us check again." },
      { name: 'Check Post', desc: 'Station Check #5: Not Raidurg!', speaker: 'vikram', reaction: "Check Post is not destination, so we continue the same check." },
      { name: 'Peddamma Gudi', desc: 'Station Check #6: Not Raidurg!', speaker: 'lakshmi', reaction: "Peddamma Gudi is still not Raidurg, so we move to the next stop." },
      { name: 'Madhapur', desc: 'Station Check #7: Not Raidurg!', speaker: 'ananya', reaction: "We're in Madhapur now, but we still haven't reached our destination." },
      { name: 'Durgam Cheruvu', desc: 'Station Check #8: Not Raidurg!', speaker: 'rahul', reaction: "Still not our stop, so I guess we keep checking station by station." },
      { name: 'HITEC City', desc: 'Station Check #9: Not Raidurg!', speaker: 'lakshmi', reaction: "HITEC City is the ninth stop, so our destination must be next!" },
      { name: 'Raidurg', desc: 'DESTINATION REACHED ✓', speaker: 'vikram', reaction: "There it is, so we can stop checking because we've reached our destination." }
    ],
    slides: [
      // SLIDE 1 — STORY INTRODUCTION
      {
        type: 'dialogue',
        character: 'lakshmi',
        text: "We need to reach our event before it starts, and we are already running late.",
        image: '/images/prologue_campus.jpg'
      },
      // SLIDE 2 — WHERE THEY NEED TO GO
      {
        type: 'dialogue',
        character: 'vikram',
        text: "The easiest way to get there is by Metro, but we need to hurry.",
        image: '/images/prologue_campus.jpg',
        frameId: 'phone_close_up'
      },
      // SLIDE 3 — THE JOURNEY
      {
        type: 'dialogue',
        character: 'ananya',
        text: "We'll keep checking the stations until we reach the one we need.",
        image: '/images/ameerpet_station.jpg',
        frameId: 'metro_route_map'
      },
      // SLIDE 4 — THE CONDITION
      {
        type: 'dialogue',
        character: 'rahul',
        text: "So we keep checking until the train finally reaches our destination?",
        image: '/images/ameerpet_station.jpg',
        frameId: 'metro_route_map'
      },
      // SLIDE 5 — START THE JOURNEY
      {
        type: 'dialogue',
        character: 'lakshmi',
        text: "Exactly, so let's get on the train and start checking.",
        image: '/images/ameerpet_station.jpg'
      },
      // SLIDE 6 — STATION 1 (Ameerpet)
      {
        type: 'metro_interactive',
        stationIdx: 0,
        image: '/images/metro_interior.jpg'
      },
      // SLIDE 7 — STATION 2 (Madhura Nagar)
      {
        type: 'metro_interactive',
        stationIdx: 1,
        image: '/images/metro_interior.jpg'
      },
      // SLIDE 8 — STATION 3 (Yusufguda)
      {
        type: 'metro_interactive',
        stationIdx: 2,
        image: '/images/metro_interior.jpg'
      },
      // SLIDE 9 — STATION 4 (Road No 5)
      {
        type: 'metro_interactive',
        stationIdx: 3,
        image: '/images/metro_interior.jpg'
      },
      // SLIDE 10 — DESTINATION (Raidurg)
      {
        type: 'metro_interactive',
        stationIdx: 9,
        image: '/images/raidurg_arrival.jpg'
      },
      // SLIDE 11 — LOOK BACK
      {
        type: 'dialogue',
        character: 'lakshmi',
        text: "Wait, we repeated the same check at every station until we arrived.",
        image: '/images/raidurg_arrival.jpg',
        frameId: 'metro_route_map'
      },
      // SLIDE 12 — LEARNER QUESTION
      {
        type: 'choice',
        question: "What caused the friends to keep checking the stations?",
        options: [
          { text: "A. They wanted to check every station forever.", correct: false, feedback: "Incorrect! They stopped as soon as Raidurg was reached." },
          { text: "B. They had not reached their destination yet.", correct: true, feedback: "Correct. The action continued while the condition was true." },
          { text: "C. They randomly chose when to check.", correct: false, feedback: "They checked systematically at every stop." }
        ],
        image: '/images/raidurg_arrival.jpg'
      },
      // SLIDE 13 — DISCOVERY
      {
        type: 'discovery',
        question: "What is the core pattern behind the station checks?",
        answer: "So the same action keeps happening while the condition remains true.",
        flowchart: [
          "WHILE We have NOT reached the destination",
          "↓",
          "CHECK THE NEXT STATION",
          "↓",
          "Check the condition again"
        ],
        conceptTitle: "WHILE LOOP CONDITION",
        conceptText: "So the same action keeps happening while the condition remains true.",
        image: '/images/raidurg_arrival.jpg'
      },
      // SLIDE 14 — WHILE LOOP REVEAL
      {
        type: 'dialogue',
        character: 'vikram',
        text: "That's what a while loop does: it repeats an action while a condition stays true.",
        image: '/images/raidurg_arrival.jpg',
        frameId: 'metro_route_map'
      },
      // SLIDE 15 — PYTHON REVEAL
      {
        type: 'dialogue',
        character: 'rahul',
        text: "So in Python, while station != 'Raidurg': check_next_station() keeps checking until we arrive!",
        image: '/images/raidurg_arrival.jpg'
      }
    ]
  },

  // CHAPTER 2: THE CANTEEN ORDERS (for loop)
  {
    id: 'part2',
    title: 'CHAPTER 2 — THE CANTEEN ORDERS',
    subtitle: 'Feeding the Hungry Crew',
    location: 'Hyderabad College Canteen',
    conceptName: 'FOR LOOP (Sequence Iteration)',
    orders: [
      { name: 'Samosa', icon: '🥟' },
      { name: 'Puff', icon: '🥐' },
      { name: 'Dosa', icon: '🥞' },
      { name: 'Juice', icon: '🧃' },
      { name: 'Biryani', icon: '🍲' }
    ],
    slides: [
      {
        type: 'dialogue',
        character: 'rahul',
        text: "We should get some food from the canteen before we start working on the auditorium setup.",
        image: '/images/canteen_scene.jpg'
      },
      {
        type: 'dialogue',
        character: 'ananya',
        text: "There are five pending orders on the canteen counter that need to be prepared in sequence.",
        image: '/images/canteen_scene.jpg',
        frameId: 'canteen_menu_board'
      },
      {
        type: 'dialogue',
        character: 'vikram',
        text: "The canteen worker is taking each food item from the menu list and preparing it one by one.",
        image: '/images/canteen_scene.jpg'
      },
      {
        type: 'canteen_interactive',
        image: '/images/canteen_scene.jpg'
      },
      {
        type: 'choice',
        question: "What action is being repeated for every food item in the canteen list?",
        options: [
          { text: "Prepare every order in sequence", correct: true, feedback: "Correct! The worker performs 'Prepare' for each item in the list." },
          { text: "Close the canteen early", correct: false, feedback: "No, the hungry students need food!" },
          { text: "Choose only one single dish", correct: false, feedback: "All 5 orders need to be prepared." }
        ],
        image: '/images/canteen_scene.jpg'
      },
      {
        type: 'dialogue',
        character: 'lakshmi',
        text: "By iterating through every item in a collection and applying the same operation, we perform a for loop.",
        image: '/images/canteen_scene.jpg'
      },
      {
        type: 'discovery',
        question: "What did we do with the list of food orders?",
        answer: "We took each item in the collection and performed the exact same preparation action.",
        flowchart: [
          "Samosa ➔ Puff ➔ Dosa ➔ Juice ➔ Biryani"
        ],
        conceptTitle: "FOR LOOP",
        conceptText: "This is a FOR LOOP! It iterates through a collection, carrying out an action for EVERY item.",
        image: '/images/canteen_scene.jpg'
      }
    ]
  },

  // CHAPTER 3: AUDITORIUM SEAT MYSTERY (EXACTLY 12 STORY SLIDES)
  {
    id: 'part3',
    title: 'CHAPTER 3 — AUDITORIUM SEAT MYSTERY',
    subtitle: '"Something is wrong with the seats..."',
    location: 'College Auditorium Main Hall, Hyderabad',
    conceptName: 'NESTED LOOPS (Grid Iteration)',
    rows: 5,
    seatsPerRow: 6,
    slides: [
      // NEW SLIDE 1 — ARRIVAL + SETUP
      {
        type: 'dialogue',
        character: 'lakshmi',
        text: "We finally made it, and this auditorium is much bigger than I expected.",
        image: '/images/auditorium_seats.jpg',
        frameId: 'auditorium_exterior'
      },
      // NEW SLIDE 2 — THE PROBLEM
      {
        type: 'dialogue',
        character: 'coordinator',
        text: "Before the event starts, we need every seat checked in the main hall.",
        image: '/images/auditorium_seats.jpg',
        frameId: 'auditorium_entrance'
      },
      // NEW SLIDE 3 — 5 x 6 = 30 SEATS
      {
        type: 'dialogue',
        character: 'rahul',
        text: "Thirty seats? I thought we came here for the event, not a workout.",
        image: '/images/auditorium_seats.jpg',
        frameId: 'auditorium_wide_shot'
      },
      // NEW SLIDE 4 — RANDOM CHECKING FAILS
      {
        type: 'dialogue',
        character: 'vikram',
        text: "If we check randomly, we could miss seats or check one twice.",
        image: '/images/auditorium_seats.jpg',
        frameId: 'auditorium_random_checking'
      },
      // NEW SLIDE 5 — ROW BY ROW STRATEGY
      {
        type: 'dialogue',
        character: 'vikram',
        text: "Let's check one row at a time, so we don't miss anything.",
        image: '/images/auditorium_seats.jpg',
        frameId: 'auditorium_row1_highlighted'
      },
      // NEW SLIDE 6 — INNER REPETITION
      {
        type: 'dialogue',
        character: 'lakshmi',
        text: "We check every seat in this row before moving to the next.",
        image: '/images/auditorium_seats.jpg',
        frameId: 'auditorium_row1_completed'
      },
      // NEW SLIDE 7 — ADVANCE TO NEXT ROW
      {
        type: 'dialogue',
        character: 'ananya',
        text: "Row one is done, so now we repeat the same process in row two.",
        image: '/images/auditorium_seats.jpg',
        frameId: 'auditorium_row2_highlighted'
      },
      // NEW SLIDE 8 — AHA MOMENT (PATTERN DISCOVERY)
      {
        type: 'dialogue',
        character: 'lakshmi',
        text: "Wait, we're repeating the same seat-checking process for every row.",
        image: '/images/auditorium_seats.jpg',
        frameId: 'auditorium_pattern_comparison'
      },
      // NEW SLIDE 9 — LEARNER QUESTION & CHOICE
      {
        type: 'choice',
        question: "What is happening here?",
        options: [
          { text: "A. One action happens once.", correct: false, feedback: "Incorrect. The seat checks repeat multiple times!" },
          { text: "B. Repetition happens inside another repetition.", correct: true, feedback: "Exactly! Every row repeats the same seat-checking process." },
          { text: "C. The seats are checked randomly.", correct: false, feedback: "No, random checking caused duplicate errors!" }
        ],
        image: '/images/auditorium_seats.jpg',
        frameId: 'auditorium_nested_diagram'
      },
      // NEW SLIDE 10 (ORIGINAL SLIDE 18 — COMPULSORY)
      {
        type: 'seat_interactive',
        image: '/images/auditorium_seats.jpg'
      },
      // NEW SLIDE 11 (ORIGINAL SLIDE 19 — COMPULSORY NESTED LOOP & PYTHON REVEAL)
      {
        type: 'discovery',
        question: "What is a Nested Loop in Python?",
        answer: "Exactly; a nested loop is one loop running inside another loop.",
        flowchart: [
          "for row in range(5):",
          "    for seat in range(6):",
          "        print('Checking row', row, 'seat', seat)"
        ],
        conceptTitle: "NESTED LOOPS IN PYTHON",
        conceptText: "for row in range(5):\n    for seat in range(6):\n        check_seat(row, seat)",
        image: '/images/auditorium_seats.jpg',
        frameId: 'auditorium_nested_concept'
      },
      // NEW SLIDE 12 (ORIGINAL SLIDE 20 — COMPULSORY EVENT CELEBRATION & ENDING)
      {
        type: 'dialogue',
        character: 'rahul',
        text: "Not bad, but next time I'm volunteering for the snack table.",
        image: '/images/auditorium_seats.jpg',
        frameId: 'auditorium_exterior'
      }
    ]
  }
];
