const smartLibraryDoor = {
  id: 'conditionals-smart-library-door',
  concept: 'Conditionals',
  title: 'The Smart Library Door',
  description: 'Discover how access decisions work through a smart library entrance.',
  icon: '📚',
  fallbackImage: '/images/stories/smartlibrary/smartLibraryScene1.jpg',
  introduction: 'Follow Riya as a smart library entrance makes a decision based on her ID card.',
  scenes: [
    {
      id: 'arrival',
      label: 'Scene 1',
      text: "Riya arrives at the college library. The library has a special entry system that checks whether a student's ID card is valid.",
      image: '/images/stories/smartlibrary/smartLibraryScene1.jpg',
      imageAlt: 'Riya arriving at the smart library entrance'
    },
    {
      id: 'scan',
      label: 'Scene 2',
      text: 'Riya places her ID card on the scanner. The system now needs to make a decision.',
      image: '/images/stories/smartlibrary/smartLibraryScene2.jpg',
      imageAlt: 'Riya scanning her ID card at the library door'
    },
    {
      id: 'door-open',
      label: 'Scene 3',
      text: 'If the ID is valid, the door opens and Riya can enter the library.',
      image: '/images/stories/smartlibrary/smartLibraryScene3.jpg',
      imageAlt: 'Riya entering the library after her ID is accepted'
    },
    {
      id: 'access-denied',
      label: 'Scene 4',
      text: 'Otherwise, the door remains closed and the system asks Riya to contact the librarian.',
      image: '/images/stories/smartlibrary/smartLibraryScene4.jpg',
      imageAlt: 'Riya waiting outside after her ID is rejected'
    }
  ],
  quiz: [
    {
      id: 'entry-condition',
      question: 'What determines whether Riya can enter the library?',
      options: ['The weather', 'Whether her ID is valid', 'The number of books', 'The time of day'],
      correctAnswer: 'Whether her ID is valid'
    },
    {
      id: 'valid-result',
      question: "What happens when Riya's ID is valid?",
      options: ['The door opens', 'The lights turn off', 'The library closes', 'Her ID disappears'],
      correctAnswer: 'The door opens'
    },
    {
      id: 'invalid-result',
      question: 'What happens if the ID is not valid?',
      options: ['The door opens', 'The system gives an access denied message', 'Riya gets a book', 'The scanner stops permanently'],
      correctAnswer: 'The system gives an access denied message'
    }
  ],
  mapping: {
    conditionPrompt: "Is Riya's ID valid?",
    pythonCondition: 'if id_valid:',
    truePath: {
      title: 'If the condition is True',
      story: 'Open the door',
      python: 'print("Door opened")'
    },
    falsePath: {
      title: 'Otherwise',
      story: 'Keep the door closed',
      python: 'print("Access denied")'
    }
  },
  code: 'id_valid = True\n\nif id_valid:\n    print("Door opened")\nelse:\n    print("Access denied")',
  explanation: [
    '`id_valid` stores whether the ID is valid.',
    '`if` checks a condition.',
    'If the condition is True, Python runs the first block.',
    'If the condition is False, Python runs the `else` block.'
  ],
  storyConnection: 'The code makes the same decision as the Smart Library Door: a valid ID opens the door, and an invalid ID leads to access denied.'
};

const smartTrafficSignal = {
  id: 'conditionals-smart-traffic-signal',
  concept: 'Conditionals',
  title: 'The Smart Traffic Signal',
  description: 'Learn how decisions guide actions at a traffic signal.',
  icon: '🚦',
  fallbackImage: '/images/stories/traffic/scene1.jpg',
  introduction: 'Follow Aarav as a traffic signal helps him decide when it is safe to cross.',
  scenes: [
    { id: 'traffic-arrival', label: 'Scene 1', text: 'Aarav is walking to college and reaches a busy road with a smart traffic signal.', image: '/images/stories/traffic/scene1.jpg', imageAlt: 'Aarav arriving at a busy road near a traffic signal' },
    { id: 'traffic-signal', label: 'Scene 2', text: 'Before crossing, Aarav looks at the signal. The color of the light determines what he should do next.', image: '/images/stories/traffic/scene2.jpg', imageAlt: 'Aarav checking the traffic signal before crossing' },
    { id: 'traffic-cross', label: 'Scene 3', text: 'If the signal is green, Aarav can safely cross the road.', image: '/images/stories/traffic/scene3.jpg', imageAlt: 'Aarav crossing the road when the signal is green' },
    { id: 'traffic-wait', label: 'Scene 4', text: 'Otherwise, Aarav must stop and wait until it is safe to cross.', image: '/images/stories/traffic/scene4.jpg', imageAlt: 'Aarav waiting at the crossing when the signal is red' }
  ],
  quiz: [
    { id: 'traffic-condition', question: 'What determines whether Aarav crosses the road?', options: ['The weather', 'The traffic signal', 'The number of cars he owns', 'The time he woke up'], correctAnswer: 'The traffic signal' },
    { id: 'traffic-green', question: 'What happens when the signal is green?', options: ['Aarav stops', 'Aarav crosses the road', 'The road disappears', 'Aarav goes home'], correctAnswer: 'Aarav crosses the road' },
    { id: 'traffic-not-green', question: 'What should Aarav do when the signal is not green?', options: ['Cross immediately', 'Stop and wait', 'Close his eyes', 'Run home'], correctAnswer: 'Stop and wait' }
  ],
  mapping: {
    conditionPrompt: 'Is the signal green?', pythonCondition: 'if signal == "green":',
    truePath: { title: 'If the condition is True', story: 'Aarav crosses the road.', python: 'print("You can cross the road")' },
    falsePath: { title: 'Otherwise', story: 'Aarav waits.', python: 'print("Wait for the green signal")' }
  },
  code: 'signal = "green"\n\nif signal == "green":\n    print("You can cross the road")\nelse:\n    print("Wait for the green signal")',
  explanation: ['`signal` stores the current traffic light color.', '`if` checks whether the signal is green.', 'If it is green, Python prints that Aarav can cross.', 'Otherwise, Python tells him to wait.'],
  storyConnection: 'The code follows the same safety decision as Aarav: a green signal allows crossing, and every other signal means wait.'
};

const smartUmbrella = {
  id: 'conditionals-smart-umbrella', concept: 'Conditionals', title: 'The Smart Umbrella',
  description: 'See how everyday weather decisions connect to programming logic.', icon: '☔',
  fallbackImage: '/images/stories/umbrella/scene1.jpg',
  introduction: 'Follow Meera as she checks the weather before choosing what to carry.',
  scenes: [
    { id: 'umbrella-clouds', label: 'Scene 1', text: 'Meera is getting ready to leave for college when she notices dark clouds outside her window.', image: '/images/stories/umbrella/scene1.jpg', imageAlt: 'Meera looking outside at dark rain clouds' },
    { id: 'umbrella-rain', label: 'Scene 2', text: 'Before leaving, Meera checks whether it is raining.', image: '/images/stories/umbrella/scene2.jpg', imageAlt: 'Meera checking whether it is raining' },
    { id: 'umbrella-carry', label: 'Scene 3', text: 'If it is raining, Meera takes her umbrella with her.', image: '/images/stories/umbrella/scene3.jpg', imageAlt: 'Meera walking in the rain with an umbrella' },
    { id: 'umbrella-sun', label: 'Scene 4', text: 'Otherwise, she leaves without an umbrella and enjoys the pleasant weather.', image: '/images/stories/umbrella/scene4.jpg', imageAlt: 'Meera walking outside without an umbrella' }
  ],
  quiz: [
    { id: 'umbrella-check', question: 'What does Meera check before deciding what to carry?', options: ['Whether it is raining', 'Her favourite colour', 'The number of books', 'Her phone battery'], correctAnswer: 'Whether it is raining' },
    { id: 'umbrella-rainy', question: 'What does Meera do when it is raining?', options: ['Takes an umbrella', 'Stays in bed', 'Buys a bicycle', 'Goes back to sleep'], correctAnswer: 'Takes an umbrella' },
    { id: 'umbrella-dry', question: 'What happens when it is not raining?', options: ['Meera takes multiple umbrellas', 'Meera leaves without an umbrella', 'Meera cancels college', 'Meera calls the library'], correctAnswer: 'Meera leaves without an umbrella' }
  ],
  mapping: {
    conditionPrompt: 'Is it raining?', pythonCondition: 'if is_raining:',
    truePath: { title: 'If the condition is True', story: 'Take an umbrella.', python: 'print("Take an umbrella")' },
    falsePath: { title: 'Otherwise', story: 'Leave without an umbrella.', python: 'print("Enjoy the weather")' }
  },
  code: 'is_raining = True\n\nif is_raining:\n    print("Take an umbrella")\nelse:\n    print("Enjoy the weather")',
  explanation: ['`is_raining` stores whether rain is falling.', '`if` checks that weather condition.', 'If it is True, Python prints a reminder to take an umbrella.', 'Otherwise, Python prints that Meera can enjoy the weather.'],
  storyConnection: 'The code makes Meera\'s everyday choice: rain means take an umbrella, and no rain means leave without one.'
};

const movieTicketCheck = {
  id: 'conditionals-movie-ticket', concept: 'Conditionals', title: 'The Movie Ticket Check',
  description: 'Understand how validation determines access.', icon: '🎬',
  fallbackImage: '/images/stories/movieTicket/scene1.jpg',
  introduction: 'Follow Kabir as cinema staff checks his ticket before letting him enter.',
  scenes: [
    { id: 'cinema-arrival', label: 'Scene 1', text: 'Kabir arrives at a cinema to watch a movie he has been excited about all week.', image: '/images/stories/movieTicket/scene1.jpg', imageAlt: 'Kabir arriving at the cinema' },
    { id: 'ticket-scan', label: 'Scene 2', text: 'Before entering the theatre, the staff checks whether Kabir has a valid movie ticket.', image: '/images/stories/movieTicket/scene2.jpg', imageAlt: 'Kabir showing his movie ticket to cinema staff' },
    { id: 'cinema-entry', label: 'Scene 3', text: 'If Kabir has a valid ticket, he is allowed to enter the theatre.', image: '/images/stories/movieTicket/scene3.jpg', imageAlt: 'Kabir entering the cinema after his ticket is approved' },
    { id: 'ticket-problem', label: 'Scene 4', text: 'Otherwise, the staff politely asks him to purchase or correct his ticket before entering.', image: '/images/stories/movieTicket/scene4.jpg', imageAlt: 'Kabir speaking with cinema staff about a ticket problem' }
  ],
  quiz: [
    { id: 'ticket-condition', question: 'What determines whether Kabir can enter the theatre?', options: ['His favourite movie', 'Whether his ticket is valid', 'The colour of his clothes', 'The weather'], correctAnswer: 'Whether his ticket is valid' },
    { id: 'ticket-valid', question: 'What happens when Kabir has a valid ticket?', options: ['He enters the theatre', 'He goes home', 'The movie stops', 'The lights turn off'], correctAnswer: 'He enters the theatre' },
    { id: 'ticket-invalid', question: 'What happens if Kabir does not have a valid ticket?', options: ['He enters for free', 'He is asked to correct or purchase a valid ticket', 'The cinema closes', 'The movie starts again'], correctAnswer: 'He is asked to correct or purchase a valid ticket' }
  ],
  mapping: {
    conditionPrompt: 'Does Kabir have a valid ticket?', pythonCondition: 'if ticket_valid:',
    truePath: { title: 'If the condition is True', story: 'Kabir enters the theatre.', python: 'print("Welcome to the movie!")' },
    falsePath: { title: 'Otherwise', story: 'Kabir needs to check his ticket.', python: 'print("Please check your ticket")' }
  },
  code: 'ticket_valid = True\n\nif ticket_valid:\n    print("Welcome to the movie!")\nelse:\n    print("Please check your ticket")',
  explanation: ['`ticket_valid` stores whether Kabir has a valid ticket.', '`if` checks the ticket condition.', 'If it is True, Python welcomes Kabir into the theatre.', 'Otherwise, Python asks him to check his ticket.'],
  storyConnection: 'The code follows the same access check as the cinema staff: a valid ticket allows entry, and an invalid ticket needs attention.'
};

const conditionalStories = [smartLibraryDoor, smartTrafficSignal, smartUmbrella, movieTicketCheck];

export { conditionalStories };
export default conditionalStories;
