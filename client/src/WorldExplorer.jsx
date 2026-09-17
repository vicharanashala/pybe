import React, { useEffect, useState } from 'react';
import {
  Globe2,
  Map,
  Rocket,
  Trophy,
  FlaskConical,
  CircleDot,
  TreePine,
  ArrowRight,
  CheckCircle2,
  X,
  BookOpen,
  Brain,
  Code2,
  BarChart3,
  Layers
} from 'lucide-react';

const READ_TIME = 20;

const missions = [
  {
    id: 1,
    title: 'Indian States',
    domain: 'India',
    icon: Map,
    concept: 'Lists',
    difficulty: 'Beginner',
    description:
      'Explore Indian states and learn how Python lists organize collections of data.'
  },
  {
    id: 2,
    title: 'Indian Capitals',
    domain: 'India',
    icon: Map,
    concept: 'Dictionaries',
    difficulty: 'Beginner',
    description:
      'Connect states with their capitals using Python dictionaries.'
  },
  {
    id: 3,
    title: 'Indian Independence',
    domain: 'India',
    icon: Trophy,
    concept: 'Conditions',
    difficulty: 'Beginner',
    description:
      'Use conditions to understand important events and dates.'
  },
  {
    id: 4,
    title: 'Countries & Continents',
    domain: 'World',
    icon: Globe2,
    concept: 'Dictionaries',
    difficulty: 'Explorer',
    description:
      'Organize countries and continents using key-value pairs.'
  },
  {
    id: 5,
    title: 'World Population',
    domain: 'World',
    icon: Globe2,
    concept: 'Loops',
    difficulty: 'Explorer',
    description:
      'Work with population data and discover the power of Python loops.'
  },
  {
    id: 6,
    title: 'Famous Landmarks',
    domain: 'World',
    icon: Globe2,
    concept: 'Strings',
    difficulty: 'Beginner',
    description:
      'Explore famous landmarks while practicing Python strings.'
  },
  {
    id: 7,
    title: 'Solar System',
    domain: 'Science',
    icon: Rocket,
    concept: 'Lists & Indexing',
    difficulty: 'Explorer',
    description:
      'Explore the planets and learn how indexing works.'
  },
  {
    id: 8,
    title: 'Space Missions',
    domain: 'Science',
    icon: Rocket,
    concept: 'Functions',
    difficulty: 'Builder',
    description:
      'Turn repeated space calculations into reusable Python functions.'
  },
  {
    id: 9,
    title: 'Scientific Measurements',
    domain: 'Science',
    icon: FlaskConical,
    concept: 'Calculations',
    difficulty: 'Explorer',
    description:
      'Use Python to work with real scientific measurements.'
  },
  {
    id: 10,
    title: 'Cricket Scores',
    domain: 'Sports',
    icon: CircleDot,
    concept: 'Lists & Loops',
    difficulty: 'Explorer',
    description:
      'Analyze cricket scores using lists and loops.'
  },
  {
    id: 11,
    title: 'Player Statistics',
    domain: 'Sports',
    icon: Trophy,
    concept: 'Dictionaries',
    difficulty: 'Builder',
    description:
      'Represent player statistics using dictionaries.'
  },
  {
    id: 12,
    title: 'Tournament Results',
    domain: 'Sports',
    icon: Trophy,
    concept: 'Sorting',
    difficulty: 'Builder',
    description:
      'Sort tournament results and discover Python sorting.'
  },
  {
    id: 13,
    title: 'Wildlife Explorer',
    domain: 'Environment',
    icon: TreePine,
    concept: 'Sets',
    difficulty: 'Explorer',
    description:
      'Explore wildlife and understand unique values using sets.'
  },
  {
    id: 14,
    title: 'Temperature Data',
    domain: 'Environment',
    icon: FlaskConical,
    concept: 'Functions',
    difficulty: 'Builder',
    description:
      'Build functions to analyze temperature data.'
  },
  {
    id: 15,
    title: 'Final Knowledge Challenge',
    domain: 'Final Challenge',
    icon: Trophy,
    concept: 'Multiple Concepts',
    difficulty: 'Builder',
    description:
      'Combine everything you learned in one final challenge.'
  }
];

const missionContent = Object.fromEntries(
  missions.filter((mission) => mission.id <= 6).map((mission) => [
    mission.id,
    {
      badge: `${mission.domain.toUpperCase()} • MISSION ${String(mission.id).padStart(2, '0')}`,
      title: mission.title,
      label: 'READ & UNDERSTAND',
      story: [mission.description]
    }
  ])
);

missionContent[1] = {
  badge: 'INDIA • MISSION 01',
  title: 'Indian States',
  label: 'READ & UNDERSTAND',
  story: [
    'India is a diverse country with 28 states, each with its own culture, language and geography.',
    'Imagine you are building a Python program that needs to store the names of several Indian states.'
  ]
};

missionContent[3] = {
  badge: 'INDIA • MISSION 03',
  title: 'Indian Independence',
  label: 'READ & UNDERSTAND',
  story: [
    'India became independent on 15 August 1947 after a long struggle for freedom.',
    'Imagine you are building a Python program that checks an important year and decides which historical message should be displayed.'
  ]
};

missionContent[4] = {
  badge: 'WORLD • MISSION 04',
  title: 'Countries & Continents',
  label: 'READ & UNDERSTAND',
  story: [
    'The world is divided into continents, and each continent contains many countries.',
    'Imagine you are building a Python program that should quickly tell you which continent a country belongs to.'
  ]
};

missionContent[5] = {
  badge: 'WORLD • MISSION 05',
  title: 'World Population',
  label: 'READ & UNDERSTAND',
  story: [
    'Different countries have different population sizes. A program may need to examine the population of many countries instead of checking each one manually.',
    'Imagine you are analyzing population data and want Python to process every value automatically.'
  ]
};

missionContent[6] = {
  badge: 'WORLD • MISSION 06',
  title: 'Famous Landmarks',
  label: 'READ & UNDERSTAND',
  story: [
    'Famous landmarks such as the Taj Mahal, Eiffel Tower and Great Wall of China attract visitors from around the world.',
    'Imagine you are building a Python program that needs to process and inspect landmark names stored as text.'
  ]
};

const advancedMissions = {
  7: {
    badge: 'SCIENCE • MISSION 07',
    title: 'Solar System',
    label: 'READ & UNDERSTAND',
    concept: 'Lists & Indexing',
    difficulty: 'Advanced',
    story: [
      'Our solar system contains eight planets arranged around the Sun.',
      'Imagine you are building a Python program that stores the planets and retrieves a specific planet using its position.'
    ],
    question: 'Which Python structure is best for storing the planets in their order?',
    options: ['Dictionary', 'List', 'Boolean', 'Integer'],
    answer: 'List',
    code: `planets = ["Mercury", "Venus", "Earth", "Mars"]\nprint(planets[2])`,
    reasoningQuestion: 'What will this program print?',
    reasoningOptions: ['Mercury', 'Venus', 'Earth', 'Mars'],
    reasoningAnswer: 'Earth',
    debugCode: `planets = ["Mercury", "Venus", "Earth"]\nprint(planets[3])`,
    debugOptions: ['Lists cannot store planets', 'Index 3 does not exist', 'print() cannot use lists', 'Earth must be index 3'],
    debugAnswer: 'Index 3 does not exist'
  },
  8: {
    badge: 'SCIENCE • MISSION 08',
    title: 'Space Missions',
    label: 'READ & UNDERSTAND',
    concept: 'Functions',
    difficulty: 'Advanced',
    story: [
      'Space agencies perform many calculations during missions.',
      'Imagine that the same calculation is needed repeatedly. Instead of rewriting the code, you can create a reusable Python function.'
    ],
    question: 'Which Python feature allows you to create reusable blocks of code?',
    options: ['List', 'Dictionary', 'Function', 'String'],
    answer: 'Function',
    code: `def calculate_distance(speed, time):\n    return speed * time\n\nprint(calculate_distance(10, 5))`,
    reasoningQuestion: 'What value will calculate_distance(10, 5) return?',
    reasoningOptions: ['15', '50', '5', '100'],
    reasoningAnswer: '50',
    debugCode: `def calculate_distance(speed, time)\n    return speed * time`,
    debugOptions: ['Functions cannot have parameters', 'The function is missing :', 'return cannot be used', 'speed must be a string'],
    debugAnswer: 'The function is missing :'
  },
  9: {
    badge: 'SCIENCE • MISSION 09',
    title: 'Scientific Measurements',
    label: 'READ & UNDERSTAND',
    concept: 'Calculations',
    difficulty: 'Advanced',
    story: [
      'Scientists collect measurements such as distance, temperature and mass.',
      'Python can process these numerical values and perform calculations automatically.'
    ],
    question: 'Which Python type is most suitable for storing a measurement such as 36.5?',
    options: ['String', 'Float', 'Boolean', 'List'],
    answer: 'Float',
    code: `temperature = 36.5\nchange = 2.5\nresult = temperature + change\nprint(result)`,
    reasoningQuestion: 'What will the program print?',
    reasoningOptions: ['34.0', '36.5', '39.0', '40.5'],
    reasoningAnswer: '39.0',
    debugCode: `temperature = "36.5"\nresult = temperature + 2.5`,
    debugOptions: ['Strings and numbers cannot be added directly', '36.5 is invalid', 'Python cannot store decimals', 'result must be a list'],
    debugAnswer: 'Strings and numbers cannot be added directly'
  },
  10: {
    badge: 'SPORTS • MISSION 10',
    title: 'Cricket Scores',
    label: 'READ & UNDERSTAND',
    concept: 'Lists & Loops',
    difficulty: 'Advanced',
    story: [
      'A cricket team records the runs scored by players during a match.',
      'Imagine you need to process every score and calculate the team\'s total.'
    ],
    question: 'Which combination is best for processing every score?',
    options: ['List + for loop', 'String only', 'Boolean only', 'Dictionary only'],
    answer: 'List + for loop',
    code: `scores = [45, 32, 67, 21]\ntotal = 0\n\nfor score in scores:\n    total += score\n\nprint(total)`,
    reasoningQuestion: 'What is the total score?',
    reasoningOptions: ['145', '155', '165', '175'],
    reasoningAnswer: '165',
    debugCode: `scores = [45, 32, 67]\nfor score in scores\n    print(score)`,
    debugOptions: ['scores must be a dictionary', 'The loop is missing :', 'score cannot be used', 'print cannot be inside a loop'],
    debugAnswer: 'The loop is missing :'
  },
  11: {
    badge: 'SPORTS • MISSION 11',
    title: 'Player Statistics',
    label: 'READ & UNDERSTAND',
    concept: 'Dictionaries',
    difficulty: 'Advanced+',
    story: [
      'A cricket player has several statistics such as runs, wickets and matches.',
      'A dictionary can organize these values using meaningful keys.'
    ],
    question: 'Which structure is best for connecting a statistic name with its value?',
    options: ['Dictionary', 'Boolean', 'Float', 'String'],
    answer: 'Dictionary',
    code: `player = {\n    "runs": 1250,\n    "wickets": 25\n}\n\nprint(player["runs"])`,
    reasoningQuestion: 'What will the program print?',
    reasoningOptions: ['25', '1250', 'runs', 'Error'],
    reasoningAnswer: '1250',
    debugCode: `player = {"runs": 1250}\nprint(player["Runs"])`,
    debugOptions: ['Dictionary keys are case-sensitive', '1250 is invalid', 'Dictionaries cannot contain numbers', 'print is invalid'],
    debugAnswer: 'Dictionary keys are case-sensitive'
  },
  12: {
    badge: 'SPORTS • MISSION 12',
    title: 'Tournament Results',
    label: 'READ & UNDERSTAND',
    concept: 'Sorting',
    difficulty: 'Advanced+',
    story: [
      'Tournament organizers need to rank teams according to their scores.',
      'Python can sort collections of numbers so results can be displayed in the correct order.'
    ],
    question: 'Which Python method can sort a list in place?',
    options: ['append()', 'sort()', 'find()', 'count()'],
    answer: 'sort()',
    code: `scores = [45, 82, 61, 90]\nscores.sort()\nprint(scores)`,
    reasoningQuestion: 'What is the sorted list?',
    reasoningOptions: ['[90, 82, 61, 45]', '[45, 61, 82, 90]', '[82, 45, 90, 61]', '[45, 82, 61, 90]'],
    reasoningAnswer: '[45, 61, 82, 90]',
    debugCode: `scores = [45, 82, 61]\nscores.sorted()`,
    debugOptions: ['sort() is the correct list method', 'Lists cannot be sorted', 'scores must be a dictionary', 'Numbers cannot be sorted'],
    debugAnswer: 'sort() is the correct list method'
  },
  13: {
    badge: 'ENVIRONMENT • MISSION 13',
    title: 'Wildlife Explorer',
    label: 'READ & UNDERSTAND',
    concept: 'Sets',
    difficulty: 'Advanced+',
    story: [
      'Wildlife researchers may record the same animal species multiple times.',
      'They need a collection that automatically keeps only unique species.'
    ],
    question: 'Which Python structure automatically stores unique values?',
    options: ['List', 'Set', 'String', 'Float'],
    answer: 'Set',
    code: `animals = {"Tiger", "Elephant", "Tiger", "Deer"}\nprint(len(animals))`,
    reasoningQuestion: 'How many unique animals are stored?',
    reasoningOptions: ['2', '3', '4', '1'],
    reasoningAnswer: '3',
    debugCode: `animals = {"Tiger", "Elephant"}\nanimals.add(["Deer"])`,
    debugOptions: ['Sets cannot store lists because lists are unhashable', 'Sets cannot store strings', 'add() does not exist', 'Deer is invalid'],
    debugAnswer: 'Sets cannot store lists because lists are unhashable'
  },
  14: {
    badge: 'ENVIRONMENT • MISSION 14',
    title: 'Temperature Data',
    label: 'READ & UNDERSTAND',
    concept: 'Functions & Data Analysis',
    difficulty: 'Expert',
    story: [
      'Scientists collect temperature readings throughout the day.',
      'A reusable function can analyze these readings and calculate useful results such as the average.'
    ],
    question: 'Why would a function be useful for analyzing temperature data?',
    options: ['It makes code reusable', 'It removes all numbers', 'It converts Python into another language', 'It prevents calculations'],
    answer: 'It makes code reusable',
    code: `def average(values):\n    return sum(values) / len(values)\n\ntemperatures = [30, 32, 31, 35]\nprint(average(temperatures))`,
    reasoningQuestion: 'What does average(temperatures) calculate?',
    reasoningOptions: ['The largest temperature', 'The smallest temperature', 'The average temperature', 'The number of temperatures'],
    reasoningAnswer: 'The average temperature',
    debugCode: `def average(values):\n    return sum(values) / len`,
    debugOptions: ['len needs to receive values', 'sum cannot be used', 'functions cannot return values', 'values must be a string'],
    debugAnswer: 'len needs to receive values'
  },
  15: {
    badge: 'FINAL • BOSS CHALLENGE',
    title: 'Final Knowledge Challenge',
    label: 'READ & UNDERSTAND',
    concept: 'Multiple Concepts',
    difficulty: 'BOSS',
    story: [
      'You have explored countries, science, sports, history and the environment.',
      'Now you must combine your Python knowledge to solve a real-world data problem using multiple concepts.'
    ],
    question: 'Which approach is best for analyzing a collection of data and producing a result?',
    options: ['Use only a string', 'Combine data structures, loops and functions', 'Use only print()', 'Use only a Boolean'],
    answer: 'Combine data structures, loops and functions',
    code: `def total_scores(scores):\n    total = 0\n    for score in scores:\n        total += score\n    return total\n\nscores = [80, 75, 90, 85]\nprint(total_scores(scores))`,
    reasoningQuestion: 'What will the function return?',
    reasoningOptions: ['320', '330', '340', '350'],
    reasoningAnswer: '330',
    debugCode: `def total_scores(scores)\n    total = 0\n    for score in scores:\n        total += score\n    return total`,
    debugOptions: ['The function definition needs :', 'for loops cannot be used in functions', 'return is invalid', 'scores cannot be a list'],
    debugAnswer: 'The function definition needs :'
  }
};

const domains = [
  'All',
  'India',
  'World',
  'Science',
  'Sports',
  'Environment'
];

const categories = [
  {
    id: 'India',
    title: 'India',
    emoji: '🇮🇳',
    description: 'Discover India and learn Python through states, capitals and history.',
    missions: [1, 2, 3]
  },
  {
    id: 'World',
    title: 'World',
    emoji: '🌍',
    description: 'Explore countries, populations and famous landmarks.',
    missions: [4, 5, 6]
  },
  {
    id: 'Science',
    title: 'Science',
    emoji: '🚀',
    description: 'Explore space, scientific measurements and real-world data.',
    missions: [7, 8, 9]
  },
  {
    id: 'Sports',
    title: 'Sports',
    emoji: '🏏',
    description: 'Use Python to analyze scores, players and tournaments.',
    missions: [10, 11, 12]
  },
  {
    id: 'Environment',
    title: 'Environment',
    emoji: '🌱',
    description: 'Explore wildlife and environmental data using Python.',
    missions: [13, 14, 15]
  }
];

const learningDomains = [
  {
    id: 'India',
    title: 'India',
    emoji: '🇮🇳',
    badge: '3 Missions',
    description: 'Discover India and learn Python through states, capitals, culture and history.',
    button: 'Explore India',
    className: 'domain-india'
  },
  {
    id: 'World',
    title: 'World',
    emoji: '🌍',
    badge: '3 Missions',
    description: 'Explore countries, populations, famous landmarks and global facts using Python.',
    button: 'Explore World',
    className: 'domain-world'
  },
  {
    id: 'Science',
    title: 'Science',
    emoji: '🚀',
    badge: '3 Missions',
    description: 'Explore space, scientific measurements and real-world data using Python.',
    button: 'Explore Science',
    className: 'domain-science'
  },
  {
    id: 'Sports',
    title: 'Sports',
    emoji: '🏏',
    badge: '3 Missions',
    description: 'Use Python to analyze scores, players, tournaments and sports statistics.',
    button: 'Explore Sports',
    className: 'domain-sports'
  },
  {
    id: 'Environment',
    title: 'Environment',
    emoji: '🌱',
    badge: '3 Missions',
    description: 'Explore nature, wildlife and environmental data using Python.',
    button: 'Explore Environment',
    className: 'domain-environment'
  }
];

function IndiaMap() {
  return (
    <div className="india-map" aria-hidden="true">
      <svg
        viewBox="0 0 220 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="
          M88 10
          L104 20
          L119 18
          L129 30
          L143 38
          L153 53
          L166 61
          L159 77
          L174 89
          L169 104
          L184 116
          L178 132
          L187 145
          L176 157
          L181 174
          L168 188
          L158 207
          L148 225
          L137 244
          L126 266
          L115 286
          L105 271
          L96 250
          L87 230
          L75 213
          L66 195
          L55 179
          L47 161
          L38 146
          L45 131
          L39 115
          L51 101
          L48 84
          L61 72
          L67 56
          L75 42
          L80 27
          Z
          "
        />

        {/* Internal state-like divisions */}
        <path
          d="M67 56 L95 72 L120 68 L143 82"
          fill="none"
        />

        <path
          d="M51 101 L82 108 L112 101 L150 113"
          fill="none"
        />

        <path
          d="M45 131 L76 137 L105 130 L137 143 L178 132"
          fill="none"
        />

        <path
          d="M55 161 L86 166 L117 158 L150 174"
          fill="none"
        />

        <path
          d="M66 195 L94 201 L124 190 L158 207"
          fill="none"
        />

        <path
          d="M87 230 L111 221 L137 244"
          fill="none"
        />
      </svg>
    </div>
  );
}

export default function WorldExplorer({ onBackToDashboard }) {
  const [activeDomain, setActiveDomain] = useState(null);

  const [completed, setCompleted] = useState(
    JSON.parse(localStorage.getItem('pybe-world-progress') || '[]')
  );

  const [activeMission, setActiveMission] = useState(null);

  const [step, setStep] = useState('read');

  const [timeLeft, setTimeLeft] = useState(READ_TIME);

  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [challengeAnswers, setChallengeAnswers] = useState([]);
  const [reasoningAnswer, setReasoningAnswer] = useState('');
  const [capitalAnswer, setCapitalAnswer] = useState('');
  const [capitalDebugAnswer, setCapitalDebugAnswer] = useState('');
  const [populationReasoningAnswer, setPopulationReasoningAnswer] = useState('');
  const [populationDebugAnswer, setPopulationDebugAnswer] = useState('');
  const [landmarkReasoningAnswer, setLandmarkReasoningAnswer] = useState('');
  const [landmarkDebugAnswer, setLandmarkDebugAnswer] = useState('');
  const [debugAnswer, setDebugAnswer] = useState('');

  const [code, setCode] = useState('');

  const [evaluation, setEvaluation] = useState(null);

  const content = activeMission
    ? missionContent[activeMission.id] || advancedMissions[activeMission.id]
    : null;

  /* -----------------------------------------
     READING TIMER
     ----------------------------------------- */

  useEffect(() => {
    if (!activeMission || step !== 'read') {
      return;
    }

    if (timeLeft <= 0) {
      setStep('question');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeMission, step, timeLeft]);

  /* -----------------------------------------
     OPEN MISSION
     ----------------------------------------- */

  const openMission = (mission) => {
    setActiveMission(mission);
    setStep('read');
    setTimeLeft(READ_TIME);
    setSelectedAnswer('');
    setCode('');
    setEvaluation(null);
    setChallengeIndex(0);
    setScore(0);
    setChallengeAnswers([]);
    setReasoningAnswer('');
    setCapitalAnswer('');
    setCapitalDebugAnswer('');
    setPopulationReasoningAnswer('');
    setPopulationDebugAnswer('');
    setLandmarkReasoningAnswer('');
    setLandmarkDebugAnswer('');
    setDebugAnswer('');
  };

  const openCategory = (category) => {
    setActiveDomain(category.id);
  };

  const backToCategories = () => {
    setActiveDomain(null);
  };

  /* -----------------------------------------
     CLOSE MISSION
     ----------------------------------------- */

  const closeMission = () => {
    setActiveMission(null);
    setStep('read');
    setTimeLeft(READ_TIME);
    setSelectedAnswer('');
    setCode('');
    setEvaluation(null);
  };

  /* -----------------------------------------
     QUESTION
     ----------------------------------------- */

  const continueFromQuestion = () => {
    if (!selectedAnswer) return;

    if (selectedAnswer === 'list') {
      setStep('reasoning');
      setSelectedAnswer('');
      setReasoningAnswer('');
    } else {
      setEvaluation({
        type: 'question-error',
        title: 'Not quite!',
        message: 'Think about a Python structure that can store multiple values together.'
      });
    }
  };

  /* -----------------------------------------
     CODE EVALUATION
     ----------------------------------------- */

  const evaluateCode = () => {
    if (advancedMissions[activeMission.id]) {
      const mission = advancedMissions[activeMission.id];
      const normalizedCode = code.toLowerCase();

      const conceptWords = mission.concept
        .toLowerCase()
        .split(/[\s&]+/)
        .filter((word) => word.length > 2);

      const hasConcept =
        conceptWords.some((word) => normalizedCode.includes(word)) ||
        normalizedCode.includes('print');

      const hasCode =
        normalizedCode.includes('=') &&
        normalizedCode.includes('print');

      if (hasConcept && hasCode) {
        setScore((current) => current + 40);

        const updated = completed.includes(activeMission.id)
          ? completed
          : [...completed, activeMission.id];

        setCompleted(updated);

        localStorage.setItem(
          'pybe-world-progress',
          JSON.stringify(updated)
        );

        setEvaluation({
          type: 'success',
          title: activeMission.id === 15 ? 'BOSS DEFEATED!' : 'Mission Complete!',
          message:
            activeMission.id === 15
              ? 'Outstanding! You combined multiple Python concepts to solve the final challenge.'
              : `Excellent! You completed ${mission.title}.`,
          concept: mission.concept,
          xp: activeMission.id === 15 ? 500 : 100
        });

        setStep('evaluation');
      } else {
        setEvaluation({
          type: 'code-error',
          title: 'Almost There!',
          message: `Use the required Python concept: ${mission.concept}.`
        });
      }

      return;
    }

    if (activeMission.id === 6) {
      const normalizedCode = code.toLowerCase();

      const hasLandmark =
        normalizedCode.includes('landmark');

      const hasString =
        normalizedCode.includes('"') ||
        normalizedCode.includes("'");

      const hasUpper =
        normalizedCode.includes('.upper()') ||
        normalizedCode.includes('.lower()');

      const hasPrint =
        normalizedCode.includes('print');

      if (
        hasLandmark &&
        hasString &&
        hasUpper &&
        hasPrint
      ) {
        setScore((current) => current + 40);

        const updated = completed.includes(6)
          ? completed
          : [...completed, 6];

        setCompleted(updated);

        localStorage.setItem(
          'pybe-world-progress',
          JSON.stringify(updated)
        );

        setEvaluation({
          type: 'success',
          title: 'Mission Complete!',
          message:
            'Excellent! You successfully processed a landmark name using Python strings.',
          concept: 'Python Strings',
          xp: 100
        });

        setStep('evaluation');
      } else {
        setEvaluation({
          type: 'code-error',
          title: 'Almost There!',
          message:
            'Create a landmark string and use .upper() or .lower() before printing it.'
        });
      }

      return;
    }

    if (activeMission.id === 5) {
      const normalizedCode = code.toLowerCase();

      const hasPopulation =
        normalizedCode.includes('populations');

      const hasList =
        normalizedCode.includes('[') &&
        normalizedCode.includes(']');

      const hasLoop =
        normalizedCode.includes('for') &&
        normalizedCode.includes('in');

      const hasTotal =
        normalizedCode.includes('total');

      const hasPrint =
        normalizedCode.includes('print');

      if (
        hasPopulation &&
        hasList &&
        hasLoop &&
        hasTotal &&
        hasPrint
      ) {
        setScore((current) => current + 40);

        const updated = completed.includes(5)
          ? completed
          : [...completed, 5];

        setCompleted(updated);

        localStorage.setItem(
          'pybe-world-progress',
          JSON.stringify(updated)
        );

        setEvaluation({
          type: 'success',
          title: 'Mission Complete!',
          message:
            'Excellent! You used a Python for loop to process population data.',
          concept: 'Python for Loops',
          xp: 100
        });

        setStep('evaluation');
      } else {
        setEvaluation({
          type: 'code-error',
          title: 'Almost There!',
          message:
            'Create a populations list, use a for loop to process each value, calculate the total, and print it.'
        });
      }

      return;
    }

    if (activeMission.id === 4) {
      const normalizedCode = code.toLowerCase();

      const hasContinents = normalizedCode.includes('continents');

      const hasDictionary =
        normalizedCode.includes('{') &&
        normalizedCode.includes('}') &&
        normalizedCode.includes(':');

      const hasCountry =
        normalizedCode.includes('india') ||
        normalizedCode.includes('france') ||
        normalizedCode.includes('brazil');

      const hasPrint =
        normalizedCode.includes('print') &&
        normalizedCode.includes('continents[');

      if (hasContinents && hasDictionary && hasCountry && hasPrint) {
        setScore((current) => current + 40);

        const updated = completed.includes(4)
          ? completed
          : [...completed, 4];

        setCompleted(updated);

        localStorage.setItem(
          'pybe-world-progress',
          JSON.stringify(updated)
        );

        setEvaluation({
          type: 'success',
          title: 'Mission Complete!',
          message:
            'Excellent! You used a dictionary to connect countries with continents.',
          concept: 'Python Dictionaries',
          xp: 100
        });

        setStep('evaluation');
      } else {
        setEvaluation({
          type: 'code-error',
          title: 'Almost There!',
          message:
            'Create a dictionary called continents with country-continent pairs and print one continent using its country key.'
        });
      }

      return;
    }

    if (activeMission.id === 3) {
      const normalizedCode = code.toLowerCase();

      const hasYear = normalizedCode.includes('year');
      const hasCondition =
        normalizedCode.includes('if') &&
        normalizedCode.includes('1947');

      const hasPrint = normalizedCode.includes('print');

      if (hasYear && hasCondition && hasPrint) {
        setScore((current) => current + 40);

        const updated = completed.includes(3)
          ? completed
          : [...completed, 3];

        setCompleted(updated);

        localStorage.setItem(
          'pybe-world-progress',
          JSON.stringify(updated)
        );

        setEvaluation({
          type: 'success',
          title: 'Mission Complete!',
          message:
            'Excellent! You used a Python condition to identify the independence year.',
          concept: 'if / elif / else',
          xp: 100
        });

        setStep('evaluation');
      } else {
        setEvaluation({
          type: 'code-error',
          title: 'Almost There!',
          message:
            'Create a variable called year, check whether it equals 1947 using if, and print a message.'
        });
      }

      return;
    }

    if (activeMission.id === 2) {
      const normalizedCode = code.toLowerCase();

      const hasCapitals = normalizedCode.includes('capitals');
      const hasDictionary =
        normalizedCode.includes('{') &&
        normalizedCode.includes('}') &&
        normalizedCode.includes(':');

      const hasStates =
        normalizedCode.includes('uttar pradesh') ||
        normalizedCode.includes('rajasthan') ||
        normalizedCode.includes('punjab') ||
        normalizedCode.includes('gujarat') ||
        normalizedCode.includes('maharashtra');

      const hasPrint =
        normalizedCode.includes('print') &&
        normalizedCode.includes('capitals[');

      if (hasCapitals && hasDictionary && hasStates && hasPrint) {
        setScore((current) => current + 40);

        const updated = completed.includes(2)
          ? completed
          : [...completed, 2];

        setCompleted(updated);
        localStorage.setItem(
          'pybe-world-progress',
          JSON.stringify(updated)
        );

        setEvaluation({
          type: 'success',
          title: 'Excellent Work!',
          message:
            'You successfully created and used a Python dictionary for Indian capitals.',
          concept: 'Python Dictionaries',
          xp: 100
        });

        setStep('evaluation');
      } else {
        setEvaluation({
          type: 'code-error',
          title: 'Almost There!',
          message:
            'Create a dictionary called capitals with state-capital pairs and print one capital using its key.'
        });
      }

      return;
    }

    const normalizedCode = code.toLowerCase();

    const hasStatesVariable =
      normalizedCode.includes('states');

    const hasList =
      normalizedCode.includes('[') &&
      normalizedCode.includes(']');

    const hasIndianState =
      normalizedCode.includes('uttar pradesh') ||
      normalizedCode.includes('rajasthan') ||
      normalizedCode.includes('punjab') ||
      normalizedCode.includes('maharashtra') ||
      normalizedCode.includes('gujarat') ||
      normalizedCode.includes('bihar');

    if (hasStatesVariable && hasList && hasIndianState) {
      const updated = completed.includes(1)
        ? completed
        : [...completed, 1];

      setCompleted(updated);

      localStorage.setItem(
        'pybe-world-progress',
        JSON.stringify(updated)
      );

      setEvaluation({
        type: 'success',
        title: 'Excellent Work!',
        message:
          'You correctly created a Python list containing Indian states.',
        concept: 'Python Lists',
        xp: 100
      });

      setStep('evaluation');
    } else {
      setEvaluation({
        type: 'code-error',
        title: 'Almost there!',
        message:
          'Create a variable called states and store Indian state names inside square brackets.'
      });
    }
  };

  return (
    <section className="world-explorer">
      {!activeDomain ? (
        <div className="domain-landing">
          <button
            className="back-dashboard-btn"
            onClick={onBackToDashboard}
          >
            ← Back to Dashboard
          </button>

          <div className="domain-heading">
            <div className="world-window-badge">🌐 WORLD EXPLORER</div>
            <h1>Choose Your <span>Learning Domain</span></h1>
            <p>
              Explore fascinating topics and turn real-world knowledge
              into Python skills.
            </p>
          </div>

          <div className="domain-grid">
            {learningDomains.map((domain) => (
              <div key={domain.id} className={`domain-card ${domain.className}`}>
                <div className="domain-card-top">
                  <div className="domain-icon">{domain.emoji}</div>
                  <div className="mission-count">◈ {domain.badge}</div>
                </div>

                <div className="domain-card-content">
                  <h2>{domain.title}</h2>
                  <p>{domain.description}</p>
                  <button
                    className="explore-domain-btn"
                    onClick={() => setActiveDomain(domain.id)}
                  >
                    {domain.button}
                    <ArrowRight size={20} />
                  </button>
                </div>

                <div className="domain-decoration">
                  {domain.id === 'India' && 'INDIA'}
                  {domain.id === 'World' && '🌐'}
                  {domain.id === 'Science' && '🪐'}
                  {domain.id === 'Sports' && '🏏'}
                  {domain.id === 'Environment' && '🌲'}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="domain-missions">
          <button
            className="back-domain-btn"
            onClick={() => setActiveDomain(null)}
          >
            ← Back to Learning Domains
          </button>

          <div className="mission-heading">
            <div className="world-window-badge">🌐 {activeDomain.toUpperCase()}</div>
            <h1>{activeDomain} Missions</h1>
            <p>
              Complete these interactive missions and turn
              real-world knowledge into Python skills.
            </p>
          </div>

          <div className="mission-grid">
            {missions
              .filter((mission) => mission.domain === activeDomain)
              .map((mission) => {
                const Icon = mission.icon;
                const isCompleted = completed.includes(mission.id);

                return (
                  <article key={mission.id} className="mission-card">
                    <div className="mission-card-icon">
                      <Icon size={28} />
                    </div>

                    <div className="mission-card-content">
                      <span className="mission-domain">{mission.domain}</span>
                      <h3>{mission.title}</h3>
                      <p>{mission.description}</p>

                      <div className="mission-meta">
                        <span>{mission.concept}</span>
                        <span>{mission.difficulty}</span>
                      </div>

                      <button
                        className="mission-start-btn"
                        onClick={() => openMission(mission)}
                      >
                        {isCompleted ? 'Replay Mission' : 'Start Mission'}
                        <ArrowRight size={18} />
                      </button>
                    </div>

                    {isCompleted && (
                      <div className="mission-completed">
                        <CheckCircle2 size={22} />
                      </div>
                    )}
                  </article>
                );
              })}
          </div>
        </div>
      )}


      {/* =========================================
          MISSION EXPERIENCE
          ========================================= */}

      {activeMission && (

        <div className="mission-overlay">

          <div className="mission-window">

            <button
              className="mission-close"
              onClick={closeMission}
            >
              <X size={22} />
            </button>


            {/* =====================================
                MISSION PROGRESS
                ===================================== */}

            <div className="mission-step-header">

              <div className="mission-step-number">
                <span>
                  STEP {
                    step === 'read'
                      ? '1'
                      : step === 'question'
                      ? '2'
                      : step === 'reasoning' || step === 'capitalReasoning' || step === 'independenceReasoning' || step === 'countryReasoning' || step === 'populationReasoning' || step === 'landmarkReasoning'
                      ? '3'
                      : step === 'debugging' || step === 'capitalDebugging' || step === 'independenceDebugging' || step === 'countryDebugging' || step === 'populationDebugging' || step === 'landmarkDebugging'
                      ? '4'
                      : step === 'coding'
                      ? '5'
                      : '6'
                  } / 6
                </span>
                <strong>
                  {step === 'read'
                    ? 'Read'
                    : step === 'question'
                    ? 'Question'
                    : step === 'advancedReasoning' || step === 'reasoning' || step === 'capitalReasoning' || step === 'independenceReasoning' || step === 'countryReasoning' || step === 'populationReasoning' || step === 'landmarkReasoning'
                    ? 'Reasoning'
                    : step === 'advancedDebugging' || step === 'debugging' || step === 'capitalDebugging' || step === 'independenceDebugging' || step === 'countryDebugging' || step === 'populationDebugging' || step === 'landmarkDebugging'
                    ? 'Debugging'
                    : step === 'coding'
                    ? 'Code'
                    : 'Result'}
                </strong>
              </div>

              <div className="mission-step-track">

                <span className={step !== 'read' ? 'done' : 'active'} />

                <span
                  className={
                    step === 'question'
                      ? 'active'
                      : ['advancedReasoning', 'reasoning', 'capitalReasoning', 'independenceReasoning', 'countryReasoning', 'populationReasoning', 'landmarkReasoning', 'advancedDebugging', 'debugging', 'capitalDebugging', 'independenceDebugging', 'countryDebugging', 'populationDebugging', 'landmarkDebugging', 'coding', 'evaluation'].includes(step)
                      ? 'done'
                      : ''
                  }
                />

                <span
                  className={
                    ['advancedReasoning', 'reasoning', 'capitalReasoning', 'independenceReasoning', 'countryReasoning', 'populationReasoning', 'landmarkReasoning'].includes(step)
                      ? 'active'
                      : ['advancedDebugging', 'debugging', 'capitalDebugging', 'independenceDebugging', 'countryDebugging', 'populationDebugging', 'landmarkDebugging', 'coding', 'evaluation'].includes(step)
                      ? 'done'
                      : ''
                  }
                />

                <span
                  className={
                    ['advancedDebugging', 'debugging', 'capitalDebugging', 'independenceDebugging', 'countryDebugging', 'populationDebugging', 'landmarkDebugging'].includes(step)
                      ? 'active'
                      : ['coding', 'evaluation'].includes(step)
                      ? 'done'
                      : ''
                  }
                />

                <span
                  className={
                    step === 'coding'
                      ? 'active'
                      : step === 'evaluation'
                      ? 'done'
                      : ''
                  }
                />

                <span className={step === 'evaluation' ? 'active' : ''} />

              </div>

            </div>


            {/* =====================================
                STEP 1 — READ
                ===================================== */}

            {step === 'read' && (
              <div className="mission-page">
                <div className="mission-page-icon">
                  <BookOpen size={30} />
                </div>

                <div className="mission-window-badge">
                  {content?.badge}
                </div>

                <h2>
                  {content?.title}
                </h2>

                <p className="mission-page-label">
                  {content?.label}
                </p>

                <div className="story-card">
                  {content?.story.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="reading-timer">
                  <div className="timer-circle">
                    <strong>{timeLeft}</strong>
                    <span>SEC</span>
                  </div>

                  <div>
                    <strong>Read carefully</strong>
                    <p>
                      Understand the situation before moving to the question.
                    </p>
                  </div>
                </div>
              </div>
            )}


            {/* =====================================
                STEP 2 — QUESTION
                ===================================== */}

            {step === 'question' && (
              <div className="mission-page">
                <div className="mission-page-icon">
                  <Brain size={30} />
                </div>

                <div className="mission-window-badge">
                  STEP 2 • THINK
                </div>

                <h2>Think Like a Developer</h2>

                <p className="question-text">
                  {advancedMissions[activeMission.id]
                    ? advancedMissions[activeMission.id].question
                    : activeMission.id === 6
                    ? 'Which Python data type is best for storing a landmark name such as "Taj Mahal"?'
                    : activeMission.id === 5
                    ? 'Which Python concept is best for processing every value in a collection automatically?'
                    : activeMission.id === 4
                    ? 'Which Python data structure is best for connecting a country with its continent?'
                    : activeMission.id === 3
                    ? 'Which Python concept is best for checking different conditions and choosing different outcomes?'
                    : activeMission.id === 2
                    ? 'Which Python data structure is best for storing a state together with its capital?'
                    : 'What would be the best way to store multiple Indian state names together in Python?'}
                </p>

                <div className="answer-options">
                  {advancedMissions[activeMission.id] ? (
                    advancedMissions[activeMission.id].options.map((option, index) => (
                      <button
                        key={option}
                        className={
                          selectedAnswer === option
                            ? 'answer-option selected'
                            : 'answer-option'
                        }
                        onClick={() => setSelectedAnswer(option)}
                      >
                        <span>{String.fromCharCode(65 + index)}</span>
                        {option}
                      </button>
                    ))
                  ) : activeMission.id === 6 ? (
                    <>
                      <button
                        className={selectedAnswer === 'string' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('string')}
                      >
                        <span>A</span> String
                      </button>

                      <button
                        className={selectedAnswer === 'list' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('list')}
                      >
                        <span>B</span> List
                      </button>

                      <button
                        className={selectedAnswer === 'loop' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('loop')}
                      >
                        <span>C</span> Loop
                      </button>

                      <button
                        className={selectedAnswer === 'dictionary' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('dictionary')}
                      >
                        <span>D</span> Dictionary
                      </button>
                    </>
                  ) : activeMission.id === 5 ? (
                    <>
                      <button
                        className={selectedAnswer === 'if' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('if')}
                      >
                        <span>A</span> if
                      </button>

                      <button
                        className={selectedAnswer === 'loop' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('loop')}
                      >
                        <span>B</span> for loop
                      </button>

                      <button
                        className={selectedAnswer === 'dictionary' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('dictionary')}
                      >
                        <span>C</span> Dictionary
                      </button>

                      <button
                        className={selectedAnswer === 'input' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('input')}
                      >
                        <span>D</span> input()
                      </button>
                    </>
                  ) : activeMission.id === 4 ? (
                    <>
                      <button
                        className={selectedAnswer === 'list' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('list')}
                      >
                        <span>A</span> List
                      </button>

                      <button
                        className={selectedAnswer === 'dictionary' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('dictionary')}
                      >
                        <span>B</span> Dictionary
                      </button>

                      <button
                        className={selectedAnswer === 'boolean' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('boolean')}
                      >
                        <span>C</span> Boolean
                      </button>

                      <button
                        className={selectedAnswer === 'integer' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('integer')}
                      >
                        <span>D</span> Integer
                      </button>
                    </>
                  ) : activeMission.id === 3 ? (
                    <>
                      <button
                        className={selectedAnswer === 'list' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('list')}
                      >
                        <span>A</span> List
                      </button>

                      <button
                        className={selectedAnswer === 'condition' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('condition')}
                      >
                        <span>B</span> if / elif / else
                      </button>

                      <button
                        className={selectedAnswer === 'dictionary' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('dictionary')}
                      >
                        <span>C</span> Dictionary
                      </button>

                      <button
                        className={selectedAnswer === 'loop' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('loop')}
                      >
                        <span>D</span> Loop
                      </button>
                    </>
                  ) : activeMission.id === 2 ? (
                    <>
                      <button
                        className={selectedAnswer === 'list' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('list')}
                      >
                        <span>A</span>List
                      </button>

                      <button
                        className={selectedAnswer === 'integer' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('integer')}
                      >
                        <span>B</span>Integer
                      </button>

                      <button
                        className={selectedAnswer === 'dictionary' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('dictionary')}
                      >
                        <span>C</span>Dictionary
                      </button>

                      <button
                        className={selectedAnswer === 'boolean' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('boolean')}
                      >
                        <span>D</span>Boolean
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={selectedAnswer === 'integer' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('integer')}
                      >
                        <span>A</span>Integer
                      </button>

                      <button
                        className={selectedAnswer === 'list' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('list')}
                      >
                        <span>B</span>List
                      </button>

                      <button
                        className={selectedAnswer === 'boolean' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('boolean')}
                      >
                        <span>C</span>Boolean
                      </button>

                      <button
                        className={selectedAnswer === 'string' ? 'answer-option selected' : 'answer-option'}
                        onClick={() => setSelectedAnswer('string')}
                      >
                        <span>D</span>String
                      </button>
                    </>
                  )}
                </div>

                {evaluation?.type === 'question-error' && (
                  <div className="mission-feedback error">
                    ⚠ {evaluation.message}
                  </div>
                )}

                <button
                  className="mission-check"
                  disabled={!selectedAnswer}
                  onClick={() => {
                    if (advancedMissions[activeMission.id]) {
                      const mission = advancedMissions[activeMission.id];

                      if (selectedAnswer === mission.answer) {
                        setScore((current) => current + 10);
                        setEvaluation(null);
                        setStep('advancedReasoning');
                      } else {
                        setEvaluation({
                          type: 'question-error',
                          message: `Think about the Python concept used for ${mission.concept}.`
                        });
                      }

                      return;
                    }

                    if (
                      (activeMission.id === 1 && selectedAnswer === 'list') ||
                      (activeMission.id === 2 && selectedAnswer === 'dictionary') ||
                      (activeMission.id === 3 && selectedAnswer === 'condition') ||
                      (activeMission.id === 4 && selectedAnswer === 'dictionary') ||
                      (activeMission.id === 5 && selectedAnswer === 'loop') ||
                      (activeMission.id === 6 && selectedAnswer === 'string')
                    ) {
                      setScore((current) => current + 10);
                      setEvaluation(null);

                      if (activeMission.id === 6) {
                        setStep('landmarkReasoning');
                      } else if (activeMission.id === 5) {
                        setStep('populationReasoning');
                      } else if (activeMission.id === 4) {
                        setStep('countryReasoning');
                      } else if (activeMission.id === 3) {
                        setStep('independenceReasoning');
                      } else if (activeMission.id === 2) {
                        setStep('capitalReasoning');
                      } else {
                        setStep('reasoning');
                      }
                    } else {
                      setEvaluation({
                        type: 'question-error',
                        message:
                          activeMission.id === 6
                            ? 'Think about a Python data type used to store text.'
                            : activeMission.id === 5
                            ? 'Think about a Python concept that processes each item in a collection.'
                            : activeMission.id === 4
                            ? 'Think about a structure that connects keys with their corresponding values.'
                            : activeMission.id === 3
                            ? 'Think about a Python concept that checks conditions and chooses between outcomes.'
                            : activeMission.id === 2
                            ? 'Think about a structure that stores information as key-value pairs.'
                            : 'Think about a Python structure that can store multiple values together.'
                      });
                    }
                  }}
                >
                  Check Answer
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {activeMission &&
              advancedMissions[activeMission.id] &&
              step === 'advancedReasoning' && (
                <div className="mission-page">
                  <div className="mission-page-icon">
                    <Brain size={30} />
                  </div>

                  <div className="mission-window-badge">
                    STEP 3 • REASONING
                  </div>

                  <h2>Think Like a Developer</h2>

                  <p className="question-text">
                    {advancedMissions[activeMission.id].reasoningQuestion}
                  </p>

                  <div className="code-question">
                    <pre>{advancedMissions[activeMission.id].code}</pre>
                  </div>

                  <div className="answer-options">
                    {advancedMissions[activeMission.id].reasoningOptions.map(
                      (option, index) => (
                        <button
                          key={option}
                          className={
                            selectedAnswer === `advanced-${option}`
                              ? 'answer-option selected'
                              : 'answer-option'
                          }
                          onClick={() => setSelectedAnswer(`advanced-${option}`)}
                        >
                          <span>{String.fromCharCode(65 + index)}</span>
                          {option}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    className="mission-check"
                    disabled={!selectedAnswer}
                    onClick={() => {
                      const mission = advancedMissions[activeMission.id];
                      const correct =
                        selectedAnswer === `advanced-${mission.reasoningAnswer}`;

                      if (correct) {
                        setScore((current) => current + 20);
                        setEvaluation(null);
                        setStep('advancedDebugging');
                      } else {
                        setEvaluation({
                          type: 'advanced-reasoning-error',
                          message: 'Look carefully at the code and trace it step by step.'
                        });
                      }
                    }}
                  >
                    Check Reasoning
                    <ArrowRight size={18} />
                  </button>

                  {evaluation?.type === 'advanced-reasoning-error' && (
                    <div className="mission-feedback error">
                      ⚠ {evaluation.message}
                    </div>
                  )}
                </div>
              )}

            {activeMission &&
              advancedMissions[activeMission.id] &&
              step === 'advancedDebugging' && (
                <div className="mission-page">
                  <div className="mission-page-icon">
                    <Code2 size={30} />
                  </div>

                  <div className="mission-window-badge">
                    STEP 4 • DEBUGGING
                  </div>

                  <h2>Find the Bug</h2>

                  <p className="question-text">
                    Study the code and identify the problem.
                  </p>

                  <div className="code-question">
                    <pre>{advancedMissions[activeMission.id].debugCode}</pre>
                  </div>

                  <div className="answer-options">
                    {advancedMissions[activeMission.id].debugOptions.map(
                      (option, index) => (
                        <button
                          key={option}
                          className={
                            selectedAnswer === `debug-${option}`
                              ? 'answer-option selected'
                              : 'answer-option'
                          }
                          onClick={() => setSelectedAnswer(`debug-${option}`)}
                        >
                          <span>{String.fromCharCode(65 + index)}</span>
                          {option}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    className="mission-check"
                    disabled={!selectedAnswer}
                    onClick={() => {
                      const mission = advancedMissions[activeMission.id];

                      if (selectedAnswer === `debug-${mission.debugAnswer}`) {
                        setScore((current) => current + 20);
                        setEvaluation(null);
                        setStep('coding');
                      } else {
                        setEvaluation({
                          type: 'advanced-debug-error',
                          message: 'Not quite. Carefully inspect the code.'
                        });
                      }
                    }}
                  >
                    Fix the Bug
                    <ArrowRight size={18} />
                  </button>

                  {evaluation?.type === 'advanced-debug-error' && (
                    <div className="mission-feedback error">
                      ⚠ {evaluation.message}
                    </div>
                  )}
                </div>
              )}


            {step === 'reasoning' && (
              <div className="mission-page">
                <div className="mission-page-icon">
                  <Brain size={30} />
                </div>

                <div className="mission-window-badge">
                  STEP 2 • REASONING
                </div>

                <h2>Predict the Output</h2>

                <p className="question-text">
                  Look carefully at the Python code and predict what it will print.
                </p>

                <div className="code-question">
                  <pre>{`states = ["UP", "Rajasthan", "Punjab", "Gujarat"]
print(states[2])`}</pre>
                </div>

                <div className="answer-options">
                  {[
                    ['up', 'UP'],
                    ['rajasthan', 'Rajasthan'],
                    ['punjab', 'Punjab'],
                    ['gujarat', 'Gujarat']
                  ].map(([value, label], index) => (
                    <button
                      key={value}
                      className={
                        reasoningAnswer === value
                          ? 'answer-option selected'
                          : 'answer-option'
                      }
                      onClick={() => setReasoningAnswer(value)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  className="mission-check"
                  disabled={!reasoningAnswer}
                  onClick={() => {
                    if (reasoningAnswer === 'punjab') {
                      setScore((current) => current + 20);
                      setStep('debugging');
                      setReasoningAnswer('');
                    } else {
                      setEvaluation({
                        type: 'reasoning-error',
                        title: 'Think Again',
                        message: 'Python list indexing starts from 0. states[2] refers to the third item.'
                      });
                    }
                  }}
                >
                  Check Answer
                  <ArrowRight size={18} />
                </button>

                {evaluation?.type === 'reasoning-error' && (
                  <div className="mission-feedback error">
                    ⚠ {evaluation.message}
                  </div>
                )}
              </div>
            )}

            {step === 'debugging' && (
              <div className="mission-page">
                <div className="mission-page-icon">
                  <Code2 size={30} />
                </div>

                <div className="mission-window-badge">
                  STEP 3 • DEBUGGING
                </div>

                <h2>Find the Bug</h2>

                <p className="question-text">
                  A student wants to add Kerala to a list of Indian states,
                  but the code below produces an error.
                  What is wrong?
                </p>

                <div className="code-question">
                  <pre>{`states = ["UP", "Rajasthan", "Punjab"]
states.add("Kerala")`}</pre>
                </div>

                <div className="answer-options">

                  <button
                    className={
                      debugAnswer === 'a'
                        ? 'answer-option selected'
                        : 'answer-option'
                    }
                    onClick={() => setDebugAnswer('a')}
                  >
                    <span>A</span>
                    Lists cannot contain strings
                  </button>

                  <button
                    className={
                      debugAnswer === 'b'
                        ? 'answer-option selected'
                        : 'answer-option'
                    }
                    onClick={() => setDebugAnswer('b')}
                  >
                    <span>B</span>
                    <code>add()</code> is not used with Python lists
                  </button>

                  <button
                    className={
                      debugAnswer === 'c'
                        ? 'answer-option selected'
                        : 'answer-option'
                    }
                    onClick={() => setDebugAnswer('c')}
                  >
                    <span>C</span>
                    "Kerala" is not valid
                  </button>

                  <button
                    className={
                      debugAnswer === 'd'
                        ? 'answer-option selected'
                        : 'answer-option'
                    }
                    onClick={() => setDebugAnswer('d')}
                  >
                    <span>D</span>
                    Lists cannot be modified
                  </button>

                </div>

                {evaluation?.type === 'debug-error' && (
                  <div className="mission-feedback error">
                    ⚠ {evaluation.message}
                  </div>
                )}

                <button
                  className="mission-check"
                  disabled={!debugAnswer}
                  onClick={() => {
                    if (debugAnswer === 'b') {
                      setScore((current) => current + 20);
                      setEvaluation(null);
                      setStep('coding');
                    } else {
                      setEvaluation({
                        type: 'debug-error',
                        message:
                          'Python lists use append() to add a new item. The add() method is not a list method.'
                      });
                    }
                  }}
                >
                  Fix the Bug
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {step === 'capitalReasoning' && (
              <div className="mission-page">
                <div className="mission-page-icon">
                  <Brain size={30} />
                </div>

                <div className="mission-window-badge">
                  STEP 3 • REASONING
                </div>

                <h2>Predict the Output</h2>

                <p className="question-text">
                  Look carefully at the dictionary and predict what Python will print.
                </p>

                <div className="code-question">
                  <pre>{`capitals = {
    "UP": "Lucknow",
    "Rajasthan": "Jaipur",
    "Punjab": "Chandigarh"
}

print(capitals["Rajasthan"])`}</pre>
                </div>

                <div className="answer-options">
                  {[
                    ['up', 'UP'],
                    ['lucknow', 'Lucknow'],
                    ['rajasthan', 'Rajasthan'],
                    ['jaipur', 'Jaipur']
                  ].map(([value, label], index) => (
                    <button
                      key={value}
                      className={
                        capitalAnswer === value
                          ? 'answer-option selected'
                          : 'answer-option'
                      }
                      onClick={() => setCapitalAnswer(value)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  className="mission-check"
                  disabled={!capitalAnswer}
                  onClick={() => {
                    if (capitalAnswer === 'jaipur') {
                      setScore((current) => current + 20);
                      setEvaluation(null);
                      setStep('capitalDebugging');
                    } else {
                      setEvaluation({
                        type: 'capital-reasoning-error',
                        message:
                          'A dictionary uses a key to retrieve its corresponding value. The key "Rajasthan" gives "Jaipur".'
                      });
                    }
                  }}
                >
                  Check Answer
                  <ArrowRight size={18} />
                </button>

                {evaluation?.type === 'capital-reasoning-error' && (
                  <div className="mission-feedback error">
                    ⚠ {evaluation.message}
                  </div>
                )}
              </div>
            )}

            {step === 'capitalDebugging' && (
              <div className="mission-page">
                <div className="mission-page-icon">
                  <Code2 size={30} />
                </div>

                <div className="mission-window-badge">
                  STEP 4 • DEBUGGING
                </div>

                <h2>Find the Bug</h2>

                <p className="question-text">
                  A student wants to find the capital of Punjab.
                  Look carefully at the dictionary and identify the problem.
                </p>

                <div className="code-question">
                  <pre>{`capitals = {
    "UP": "Lucknow",
    "Rajasthan": "Jaipur"
}

print(capitals["Punjab"])`}</pre>
                </div>

                <div className="answer-options">
                  {[
                    ['a', 'Dictionaries cannot store strings'],
                    ['b', '"Punjab" is not a key in the dictionary'],
                    ['c', 'print() cannot be used with dictionaries'],
                    ['d', 'Dictionaries cannot be accessed with []']
                  ].map(([value, label], index) => (
                    <button
                      key={value}
                      className={
                        capitalDebugAnswer === value
                          ? 'answer-option selected'
                          : 'answer-option'
                      }
                      onClick={() => setCapitalDebugAnswer(value)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {label}
                    </button>
                  ))}
                </div>

                {evaluation?.type === 'capital-debug-error' && (
                  <div className="mission-feedback error">
                    ⚠ {evaluation.message}
                  </div>
                )}

                <button
                  className="mission-check"
                  disabled={!capitalDebugAnswer}
                  onClick={() => {
                    if (capitalDebugAnswer === 'b') {
                      setScore((current) => current + 20);
                      setEvaluation(null);
                      setStep('coding');
                    } else {
                      setEvaluation({
                        type: 'capital-debug-error',
                        message:
                          'The key "Punjab" does not exist in the dictionary. Python cannot retrieve a value for a missing key.'
                      });
                    }
                  }}
                >
                  Fix the Bug
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {step === 'independenceReasoning' && (
              <div className="mission-page">
                <div className="mission-page-icon">
                  <Brain size={30} />
                </div>

                <div className="mission-window-badge">
                  STEP 3 • REASONING
                </div>

                <h2>Think Like a Developer</h2>

                <p className="question-text">
                  What will this Python program print?
                </p>

                <div className="code-question">
                  <pre>{`year = 1947

if year == 1947:
    print("India became independent")
else:
    print("Different year")`}</pre>
                </div>

                <div className="answer-options">
                  {[
                    ['a', 'Different year'],
                    ['b', '1947'],
                    ['c', 'India became independent'],
                    ['d', 'Error']
                  ].map(([value, label], index) => (
                    <button
                      key={value}
                      className={
                        selectedAnswer === `ind-${value}`
                          ? 'answer-option selected'
                          : 'answer-option'
                      }
                      onClick={() => setSelectedAnswer(`ind-${value}`)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  className="mission-check"
                  disabled={!selectedAnswer}
                  onClick={() => {
                    if (selectedAnswer === 'ind-c') {
                      setScore((current) => current + 20);
                      setEvaluation(null);
                      setStep('independenceDebugging');
                    } else {
                      setEvaluation({
                        type: 'independence-error',
                        message: 'Check the condition: year == 1947.'
                      });
                    }
                  }}
                >
                  Check Reasoning
                  <ArrowRight size={18} />
                </button>

                {evaluation?.type === 'independence-error' && (
                  <div className="mission-feedback error">
                    ⚠ {evaluation.message}
                  </div>
                )}
              </div>
            )}

            {step === 'independenceDebugging' && (
              <div className="mission-page">
                <div className="mission-page-icon">
                  <Code2 size={30} />
                </div>

                <div className="mission-window-badge">
                  STEP 4 • DEBUGGING
                </div>

                <h2>Find the Bug</h2>

                <p className="question-text">
                  A student wants to check whether a year is India's independence year.
                  What is wrong with this code?
                </p>

                <div className="code-question">
                  <pre>{`year = 1947

if year = 1947:
    print("India became independent")`}</pre>
                </div>

                <div className="answer-options">
                  {[
                    ['a', 'Use == instead of ='],
                    ['b', 'Use a list'],
                    ['c', 'Remove the if statement'],
                    ['d', 'Use a dictionary']
                  ].map(([value, label], index) => (
                    <button
                      key={value}
                      className={
                        selectedAnswer === `debug-${value}`
                          ? 'answer-option selected'
                          : 'answer-option'
                      }
                      onClick={() => setSelectedAnswer(`debug-${value}`)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  className="mission-check"
                  disabled={!selectedAnswer}
                  onClick={() => {
                    if (selectedAnswer === 'debug-a') {
                      setScore((current) => current + 20);
                      setEvaluation(null);
                      setStep('coding');
                    } else {
                      setEvaluation({
                        type: 'independence-debug-error',
                        message: 'Use == when comparing two values in Python.'
                      });
                    }
                  }}
                >
                  Fix the Bug
                  <ArrowRight size={18} />
                </button>

                {evaluation?.type === 'independence-debug-error' && (
                  <div className="mission-feedback error">
                    ⚠ {evaluation.message}
                  </div>
                )}
              </div>
            )}

            {step === 'countryReasoning' && (
              <div className="mission-page">
                <div className="mission-page-icon">
                  <Brain size={30} />
                </div>

                <div className="mission-window-badge">
                  STEP 3 • REASONING
                </div>

                <h2>Think Like a Developer</h2>

                <p className="question-text">
                  What will this program print?
                </p>

                <div className="code-question">
                  <pre>{`continents = {
    "India": "Asia",
    "France": "Europe",
    "Brazil": "South America"
}

print(continents["France"])`}</pre>
                </div>

                <div className="answer-options">
                  {[
                    ['a', 'Asia'],
                    ['b', 'Europe'],
                    ['c', 'France'],
                    ['d', 'Error']
                  ].map(([value, label], index) => (
                    <button
                      key={value}
                      className={
                        selectedAnswer === `country-${value}`
                          ? 'answer-option selected'
                          : 'answer-option'
                      }
                      onClick={() => setSelectedAnswer(`country-${value}`)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  className="mission-check"
                  disabled={!selectedAnswer}
                  onClick={() => {
                    if (selectedAnswer === 'country-b') {
                      setScore((current) => current + 20);
                      setEvaluation(null);
                      setStep('countryDebugging');
                    } else {
                      setEvaluation({
                        type: 'country-error',
                        message: 'The key "France" maps to the value "Europe".'
                      });
                    }
                  }}
                >
                  Check Reasoning
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {step === 'countryDebugging' && (
              <div className="mission-page">
                <div className="mission-page-icon">
                  <Code2 size={30} />
                </div>

                <div className="mission-window-badge">
                  STEP 4 • DEBUGGING
                </div>

                <h2>Find the Bug</h2>

                <p className="question-text">
                  A student wants to find India's continent. What is wrong?
                </p>

                <div className="code-question">
                  <pre>{`continents = {
    "India": "Asia",
    "France": "Europe"
}

print(continents["india"])`}</pre>
                </div>

                <div className="answer-options">
                  {[
                    ['a', 'Dictionary cannot store countries'],
                    ['b', 'The key is case-sensitive: "India" is different from "india"'],
                    ['c', 'print() cannot access dictionaries'],
                    ['d', 'Asia is not a string']
                  ].map(([value, label], index) => (
                    <button
                      key={value}
                      className={
                        selectedAnswer === `country-debug-${value}`
                          ? 'answer-option selected'
                          : 'answer-option'
                      }
                      onClick={() => setSelectedAnswer(`country-debug-${value}`)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  className="mission-check"
                  disabled={!selectedAnswer}
                  onClick={() => {
                    if (selectedAnswer === 'country-debug-b') {
                      setScore((current) => current + 20);
                      setEvaluation(null);
                      setStep('coding');
                    } else {
                      setEvaluation({
                        type: 'country-debug-error',
                        message: 'Python dictionary keys are case-sensitive.'
                      });
                    }
                  }}
                >
                  Fix the Bug
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {step === 'populationReasoning' && (
              <div className="mission-page">
                <div className="mission-page-icon">
                  <Brain size={30} />
                </div>

                <div className="mission-window-badge">
                  STEP 3 • REASONING
                </div>

                <h2>Think Like a Developer</h2>

                <p className="question-text">
                  What will this Python program print?
                </p>

                <div className="code-question">
                  <pre>{`populations = [10, 20, 30, 40]

total = 0

for population in populations:
    total = total + population

print(total)`}</pre>
                </div>

                <div className="answer-options">
                  {[
                    ['a', '40'],
                    ['b', '60'],
                    ['c', '100'],
                    ['d', '10']
                  ].map(([value, label], index) => (
                    <button
                      key={value}
                      className={
                        populationReasoningAnswer === value
                          ? 'answer-option selected'
                          : 'answer-option'
                      }
                      onClick={() => setPopulationReasoningAnswer(value)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  className="mission-check"
                  disabled={!populationReasoningAnswer}
                  onClick={() => {
                    if (populationReasoningAnswer === 'c') {
                      setScore((current) => current + 20);
                      setEvaluation(null);
                      setStep('populationDebugging');
                    } else {
                      setEvaluation({
                        type: 'population-reasoning-error',
                        message: 'Add 10 + 20 + 30 + 40 and check the final total.'
                      });
                    }
                  }}
                >
                  Check Reasoning
                  <ArrowRight size={18} />
                </button>

                {evaluation?.type === 'population-reasoning-error' && (
                  <div className="mission-feedback error">
                    ⚠ {evaluation.message}
                  </div>
                )}
              </div>
            )}

            {step === 'populationDebugging' && (
              <div className="mission-page">
                <div className="mission-page-icon">
                  <Code2 size={30} />
                </div>

                <div className="mission-window-badge">
                  STEP 4 • DEBUGGING
                </div>

                <h2>Find the Bug</h2>

                <p className="question-text">
                  A student wants to print every population value. What is wrong with this code?
                </p>

                <div className="code-question">
                  <pre>{`populations = [10, 20, 30]

for population in populations
    print(population)`}</pre>
                </div>

                <div className="answer-options">
                  {[
                    ['a', 'The list cannot contain numbers'],
                    ['b', 'The for statement is missing :'],
                    ['c', 'print() cannot be used inside a loop'],
                    ['d', 'population must be a dictionary']
                  ].map(([value, label], index) => (
                    <button
                      key={value}
                      className={
                        populationDebugAnswer === value
                          ? 'answer-option selected'
                          : 'answer-option'
                      }
                      onClick={() => setPopulationDebugAnswer(value)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  className="mission-check"
                  disabled={!populationDebugAnswer}
                  onClick={() => {
                    if (populationDebugAnswer === 'b') {
                      setScore((current) => current + 20);
                      setEvaluation(null);
                      setStep('coding');
                    } else {
                      setEvaluation({
                        type: 'population-debug-error',
                        message: 'Python for loops require a colon (:) at the end of the statement.'
                      });
                    }
                  }}
                >
                  Fix the Bug
                  <ArrowRight size={18} />
                </button>

                {evaluation?.type === 'population-debug-error' && (
                  <div className="mission-feedback error">
                    ⚠ {evaluation.message}
                  </div>
                )}
              </div>
            )}

            {step === 'landmarkReasoning' && (
              <div className="mission-page">
                <div className="mission-page-icon">
                  <Brain size={30} />
                </div>

                <div className="mission-window-badge">
                  STEP 3 • REASONING
                </div>

                <h2>Think Like a Developer</h2>

                <p className="question-text">
                  What will this Python program print?
                </p>

                <div className="code-question">
                  <pre>{`landmark = "Taj Mahal"

print(landmark[0])`}</pre>
                </div>

                <div className="answer-options">
                  {[
                    ['a', 'T'],
                    ['b', 'a'],
                    ['c', 'Taj Mahal'],
                    ['d', 'Error']
                  ].map(([value, label], index) => (
                    <button
                      key={value}
                      className={
                        landmarkReasoningAnswer === value
                          ? 'answer-option selected'
                          : 'answer-option'
                      }
                      onClick={() => setLandmarkReasoningAnswer(value)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  className="mission-check"
                  disabled={!landmarkReasoningAnswer}
                  onClick={() => {
                    if (landmarkReasoningAnswer === 'a') {
                      setScore((current) => current + 20);
                      setEvaluation(null);
                      setStep('landmarkDebugging');
                    } else {
                      setEvaluation({
                        type: 'landmark-reasoning-error',
                        message: 'Python strings use index 0 for their first character.'
                      });
                    }
                  }}
                >
                  Check Reasoning
                  <ArrowRight size={18} />
                </button>

                {evaluation?.type === 'landmark-reasoning-error' && (
                  <div className="mission-feedback error">
                    ⚠ {evaluation.message}
                  </div>
                )}
              </div>
            )}

            {step === 'landmarkDebugging' && (
              <div className="mission-page">
                <div className="mission-page-icon">
                  <Code2 size={30} />
                </div>

                <div className="mission-window-badge">
                  STEP 4 • DEBUGGING
                </div>

                <h2>Find the Bug</h2>

                <p className="question-text">
                  A student wants to convert a landmark name to uppercase. What is wrong?
                </p>

                <div className="code-question">
                  <pre>{`landmark = "taj mahal"

print(landmark.upper)`}</pre>
                </div>

                <div className="answer-options">
                  {[
                    ['a', 'Strings cannot use upper'],
                    ['b', 'upper should be called with ()'],
                    ['c', 'print() cannot print strings'],
                    ['d', 'The variable must be a list']
                  ].map(([value, label], index) => (
                    <button
                      key={value}
                      className={
                        landmarkDebugAnswer === value
                          ? 'answer-option selected'
                          : 'answer-option'
                      }
                      onClick={() => setLandmarkDebugAnswer(value)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  className="mission-check"
                  disabled={!landmarkDebugAnswer}
                  onClick={() => {
                    if (landmarkDebugAnswer === 'b') {
                      setScore((current) => current + 20);
                      setEvaluation(null);
                      setStep('coding');
                    } else {
                      setEvaluation({
                        type: 'landmark-debug-error',
                        message: 'upper is a string method, so it must be called using ().'
                      });
                    }
                  }}
                >
                  Fix the Bug
                  <ArrowRight size={18} />
                </button>

                {evaluation?.type === 'landmark-debug-error' && (
                  <div className="mission-feedback error">
                    ⚠ {evaluation.message}
                  </div>
                )}
              </div>
            )}

            {/* =====================================
                STEP 4 — CODING
                ===================================== */}

            {step === 'coding' && (

              <div className="mission-page">

                <div className="mission-page-icon">
                  <Code2 size={30} />
                </div>

                <div className="mission-window-badge">
                  {advancedMissions[activeMission.id]
                    ? 'STEP 5 • CODE'
                    : activeMission.id === 6
                    ? 'STEP 5 • CODE'
                    : activeMission.id === 5
                    ? 'STEP 5 • CODE'
                    : activeMission.id === 4
                    ? 'STEP 5 • CODE'
                    : activeMission.id === 3
                    ? 'STEP 5 • CODE'
                    : activeMission.id === 2
                    ? 'STEP 5 • CODE'
                    : 'STEP 3 • CODE'}
                </div>

                <h2>
                  {advancedMissions[activeMission.id]
                    ? content.title
                    : activeMission.id === 6
                    ? 'Process a Landmark Name'
                    : activeMission.id === 5
                    ? 'Analyze Population Data'
                    : activeMission.id === 4
                    ? 'Map Countries to Continents'
                    : activeMission.id === 3
                    ? 'Check the Independence Year'
                    : activeMission.id === 2
                    ? 'Create Your Dictionary'
                    : 'Create Your Python List'}
                </h2>

                <p className="question-text">
                  {advancedMissions[activeMission.id] ? (
                    <>Use the configured Python concept for <strong>{content.concept}</strong> and print a result.</>
                  ) : activeMission.id === 6 ? (
                    <>Create a string called <strong>landmark</strong> and use <strong>.upper()</strong> or <strong>.lower()</strong> before printing it.</>
                  ) : activeMission.id === 5 ? (
                    <>Create a list called <strong>populations</strong> containing at least five numbers.
                    Use a for loop to calculate the total population value and print the result.</>
                  ) : activeMission.id === 4 ? (
                    <>Create a dictionary called <strong>continents</strong>
                    with country-continent pairs and print one continent using its country key.</>
                  ) : activeMission.id === 3 ? (
                    <>Create a variable called <strong>year</strong>, check whether it equals 1947 using <strong>if</strong>, and print a message.</>
                  ) : activeMission.id === 2 ? (
                    <>Create a dictionary called <strong>capitals</strong>.
                    Add at least 3 Indian states and their capitals, then
                    retrieve and print the capital of one state.</>
                  ) : (
                    <>Create a variable called <strong>states</strong>
                    and store at least three Indian states
                    inside a Python list.</>
                  )}
                </p>

                <div className="concept-highlight">
                  Python <strong>
                    {advancedMissions[activeMission.id]
                      ? content.concept
                      : activeMission.id === 6
                      ? 'Strings'
                      : activeMission.id === 5
                      ? 'for Loop'
                      : activeMission.id === 4
                      ? 'Dictionary'
                      : activeMission.id === 3
                      ? 'Conditions'
                      : activeMission.id === 2
                      ? 'Dictionary'
                      : 'List'}
                  </strong>
                </div>


                <textarea
                  className="mission-code-editor"
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value)
                  }
                  placeholder={
                    advancedMissions[activeMission.id]
                      ? content.code
                      : activeMission.id === 6
                      ? `landmark = "taj mahal"\nprint(landmark.upper())`
                      : activeMission.id === 5
                      ? `populations = [10, 20, 30, 40, 50]\n\ntotal = 0\n\nfor population in populations:\n    total = total + population\n\nprint(total)`
                      : activeMission.id === 4
                      ? `continents = {"India": "Asia", "France": "Europe", "Brazil": "South America"}`
                      : activeMission.id === 3
                      ? `year = 1947\n\nif year == 1947:\n    print("India became independent")`
                      : activeMission.id === 2
                      ? `capitals = {"Uttar Pradesh": "Lucknow", "Rajasthan": "Jaipur", "Punjab": "Chandigarh"}`
                      : `states = ["Uttar Pradesh", "Rajasthan", "Punjab"]`
                  }
                  spellCheck="false"
                />


                {evaluation?.type === 'code-error' && (

                  <div className="mission-feedback error">
                    ⚠ {evaluation.message}
                  </div>

                )}


                <button
                  className="mission-check"
                  onClick={evaluateCode}
                >
                  Check Code
                </button>

              </div>

            )}


            {step === 'evaluation' && evaluation && (

              <div className="mission-page">

                <div className="mission-page-icon">
                  {evaluation.type === 'success' ? (
                    <Trophy size={30} />
                  ) : (
                    <FlaskConical size={30} />
                  )}
                </div>

                <div className="mission-window-badge">
                  {evaluation.type === 'success' ? 'MISSION COMPLETE' : 'TRY AGAIN'}
                </div>

                <h2>
                  {evaluation.title}
                </h2>

                <div
                  className={
                    evaluation.type === 'success'
                      ? 'mission-feedback success'
                      : 'mission-feedback error'
                  }
                >
                  {evaluation.message}
                </div>

                {evaluation.concept && (
                  <div className="mission-summary">
                    <strong>Concept:</strong> {evaluation.concept}
                    {evaluation.xp ? (
                      <>
                        <span>•</span>
                        <strong>XP:</strong> {evaluation.xp}
                      </>
                    ) : null}
                  </div>
                )}

                <button
                  className="mission-check"
                  onClick={closeMission}
                >
                  {evaluation.type === 'success' ? 'Back to Missions' : 'Try Again'}
                  <ArrowRight size={18} />
                </button>

              </div>

            )}

          </div>

        </div>

      )}

    </section>
  );
}