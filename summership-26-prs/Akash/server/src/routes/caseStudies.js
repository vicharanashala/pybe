const express = require('express');
const router = express.Router();

const caseStudies = [
  {
    id: 'cs-1',
    title: 'Blueprint to Build',
    concept: 'Python Classes & Objects',
    level: 'Beginner',
    type: 'interactive',
    problemStatement: "Learning Class & Object through a Samsung factory story",
    stages: [
      {
        id: 'scenario', stageNum: 1, title: 'Scenario', icon: '🎬',
        kicker: '🎬 Scenario', heading: 'The Galaxy S26 Blueprint',
        story: `At Samsung's design lab in Suwon, engineers spent months creating the perfect <strong>blueprint</strong> for the new Galaxy S26 — exact specs for screen size, camera modules, battery capacity, and chip layout. This blueprint is not a phone you can hold or make a call with. It's just a detailed plan sitting on a server somewhere.\n\nOnce the blueprint was approved, the factory used it to manufacture <strong>millions of actual Galaxy S26 phones</strong>. Every phone that rolled off the line shared the same screen size and camera setup defined in the blueprint — but each one got its <strong>own unique serial number</strong>, its own IMEI, and its own battery charge level the moment it was switched on.`,
        promptText: 'Read the story above, then continue when it makes sense to you.'
      },
      {
        id: 'think', stageNum: 2, title: 'Think', icon: '🤔',
        kicker: '🤔 Think', heading: 'What does the blueprint remind you of?',
        promptText: "Pick whichever option feels closest to how you'd describe it.",
        options: [
          { key: 'recipe', letter: 'A', text: 'The blueprint is like a recipe' },
          { key: 'class', letter: 'B', text: 'The blueprint is like a class' },
          { key: 'variable', letter: 'C', text: 'The blueprint is like a variable' },
          { key: 'function', letter: 'D', text: 'The blueprint is like a function' }
        ],
        responses: {
          recipe: "Close! A recipe and a blueprint are similar — both are plans, not the finished thing itself. You can't eat a recipe, and you can't make a call with a blueprint. In programming, this kind of plan is exactly what we call a <strong>class</strong>.",
          class: "Exactly right! A blueprint is a plan that describes what something should have and be able to do — without being that thing itself. That's precisely what a <strong>class</strong> is in programming.",
          variable: "Not quite — a variable just stores one piece of data, like a single number or word. A blueprint describes an entire structure with many pieces of data and behaviors. That structure is called a <strong>class</strong>.",
          function: "Good instinct, but not quite — a function is a set of steps that runs and finishes. A blueprint isn't a set of steps, it's a full description of a <em>thing</em> — its data and its abilities. That's a <strong>class</strong>."
        }
      },
      {
        id: 'discover', stageNum: 3, title: 'Discover', icon: '❓',
        kicker: '❓ Discover', heading: 'Quick check',
        questions: [
          { id: 'q1', text: "Q1. In the story, things like screen size, camera, and battery capacity — defined once in the blueprint — are called the class's ___.", options: [{ text: 'Objects', correct: false }, { text: 'Attributes', correct: true }, { text: 'Methods', correct: false }, { text: 'Instances', correct: false }] },
          { id: 'q2', text: "Q2. Each individual phone that comes off the factory line — with its own serial number — is called a(n) ___.", options: [{ text: 'Class', correct: false }, { text: 'Object', correct: true }, { text: 'Method', correct: false }, { text: 'Blueprint', correct: false }] }
        ]
      },
      {
        id: 'reveal', stageNum: 4, title: 'Reveal', icon: '💡',
        kicker: '💡 Reveal', heading: 'The Blueprint → class mapping',
        description: "Here's exactly how the Samsung story maps onto real code:",
        mapping: [
          { story: 'The approved design plan itself', code: 'class Phone:', term: 'class' },
          { story: 'Screen size, camera, battery capacity — specs every phone shares', code: 'self.screen_size, self.camera', term: 'attribute' },
          { story: 'Things a phone can do — make a call, take a photo', code: 'make_call(), take_photo()', term: 'method' },
          { story: 'One actual manufactured phone with its own serial number', code: 'phone1 = Phone(...)', term: 'object / instance' },
          { story: 'The unique serial number, IMEI, battery level of that one phone', code: 'phone1.serial_number', term: 'instance data' }
        ],
        conclusion: 'One blueprint. Unlimited phones. Every phone follows the same design, but each one lives its own independent life.'
      },
      {
        id: 'learn', stageNum: 5, title: 'Learn', icon: '📖',
        kicker: '📖 Learn', heading: 'The vocabulary, properly defined',
        concepts: [
          { term: 'class', definition: 'A blueprint for creating objects. It defines what attributes and methods every object built from it will have — but a class itself is not a usable "thing," just the plan.' },
          { term: 'object / instance', definition: 'One actual "thing" built from a class. Every object built from the same class shares the same structure but holds its own independent data.' },
          { term: 'attribute', definition: 'A piece of data that belongs to an object — like screen_size or serial_number. Defined in the class, filled in per object.' },
          { term: 'method', definition: 'A function that belongs to a class and defines something its objects can do — like make_call().' },
          { term: 'constructor (__init__)', definition: "The special method that runs automatically when a new object is created." },
          { term: 'self', definition: 'Inside a class, self refers to "this particular object" — the one specific phone currently being built or used, not the blueprint.' }
        ],
        chips: ['class', 'object', 'instance', 'attribute', 'method', 'constructor', 'self']
      },
      {
        id: 'code', stageNum: 6, title: 'Code', icon: '💻',
        kicker: '💻 Code', heading: 'The Phone blueprint, in Python',
        promptText: 'Click any line to see it explained in plain English.',
        codeLines: [
          { code: 'class Phone:', explain: "This line starts the blueprint. From here on, everything indented underneath belongs to the Phone class — it's not a phone yet, just the plan for one." },
          { code: '    def __init__(self, serial_number, battery_level):', explain: "The constructor. This runs automatically every time a new Phone object is created — like the moment a phone comes off the factory line and gets its starting values." },
          { code: '        self.serial_number = serial_number', explain: "Stamps in this specific phone's serial number. 'self' means 'this particular phone', not every phone ever made." },
          { code: '        self.battery_level = battery_level', explain: "Sets this phone's starting battery percentage — unique to this one object, just like in the story." },
          { code: '        self.screen_size = 6.8', explain: "Every phone built from this blueprint gets the same screen size, because it's part of the shared design, not something passed in per phone." },
          { code: '        self.camera = "200MP"', explain: "Same idea — the camera spec is fixed by the blueprint itself, shared by every phone made from this class." },
          { code: '', explain: '' },
          { code: '    def make_call(self):', explain: "A method — something a Phone object can DO. Only phones (objects), not the blueprint itself, can actually make a call." },
          { code: '        print(f"Calling from phone {self.serial_number}")', explain: "Uses this specific phone's own serial number when it prints — proof that each object carries its own data." },
          { code: '', explain: '' },
          { code: 'phone1 = Phone("SN12345", 87)', explain: "This is where an actual object gets built — like one phone rolling off the factory line with serial number SN12345 and 87% battery." },
          { code: 'phone2 = Phone("SN67890", 45)', explain: "A second, completely separate object — same blueprint, totally independent data. Changing phone2 never affects phone1." },
          { code: 'phone1.make_call()', explain: 'Calls the method on phone1 specifically. Output: "Calling from phone SN12345" — because self refers to phone1 here.' }
        ]
      },
      {
        id: 'practice', stageNum: 7, title: 'Practice', icon: '⚡',
        kicker: '⚡ Practice', heading: 'Build the class yourself',
        promptText: 'Click a tile below, then click the slot where it belongs. Fill every slot, then hit Run Code.',
        slots: [
          { ln: 1, answerId: 't1', prefix: '' },
          { ln: 2, answerId: 't2', prefix: '' },
          { ln: 3, answerId: 't3', prefix: '        ' },
          { ln: 4, answerId: 't4', prefix: '        ' },
          { ln: 5, answerId: 't5', prefix: '' },
          { ln: 6, answerId: 't6', prefix: '    ' },
          { ln: 7, answerId: 't7', prefix: '        ' }
        ],
        tiles: [
          { id: 't1', text: 'class Car:' },
          { id: 't2', text: '    def __init__(self, model, color):' },
          { id: 't3', text: 'self.model = model' },
          { id: 't4', text: 'self.color = color' },
          { id: 't5', text: 'car1 = Car("Ioniq 6", "blue")' },
          { id: 't6', text: 'def honk(self):' },
          { id: 't7', text: 'print(f"{self.model} says beep!")' }
        ],
        finalQuestion: { text: 'One last check — if you create car2 = Car("Ioniq 6", "silver"), what happens to car1?', options: [{ text: 'car1 is deleted and replaced', correct: false }, { text: "car1's color changes to silver too", correct: false }, { text: "car1 is untouched — it's a separate object with its own data", correct: true }] },
        successOutput: 'Ioniq 6 says beep!\nCar object created successfully — car1 is a real, independent instance of Car.'
      },
      { id: 'trophy', stageNum: 8, title: 'Complete', icon: '🏆', heading: "You've got it — Class & Object, unlocked.", conclusion: "The blueprint plans it. The object lives it. Every object built from a class shares its structure, but carries its own independent data — just like every Galaxy S26 shares a design, but has its own serial number.", badges: ['✓ Scenario understood', '✓ Concept connected', '✓ Vocabulary learned', '✓ Code read', '✓ Code built'] }
    ]
  },
  {
    id: 'cs-2',
    title: 'Sealed Battery',
    concept: 'Encapsulation',
    level: 'Beginner',
    type: 'interactive',
    problemStatement: "Learning Encapsulation through a Samsung battery story",
    stages: [
      {
        id: 'scenario', stageNum: 1, title: 'Scenario', icon: '🎬',
        kicker: '🎬 Scenario', heading: "What's Inside Your Galaxy S26?",
        story: "When you hold a Galaxy S26, you cannot touch the battery directly. You cannot poke the charging circuit. You cannot manually adjust the power management chip. All of those are <strong>sealed inside the phone case</strong> — hidden, protected, and inaccessible from the outside.<br><br>Yet you can still interact with the battery perfectly: you <strong>plug in the charger</strong> to charge it, and you <strong>glance at the battery icon</strong> on screen to read the current level. You do not need to know how the charging circuit works — you just use the port and the indicator.<br><br>The internal state (battery level, charging status, temperature sensors) is <strong>private</strong> — shielded from the outside world. The charger port and battery icon are <strong>public interfaces</strong> — the only controlled ways to interact with that hidden state.",
        promptText: 'Read the story, then continue.'
      },
      {
        id: 'think', stageNum: 2, title: 'Think', icon: '🤔',
        kicker: '🤔 Think', heading: 'What does the sealed phone battery remind you of?',
        promptText: "Pick whichever feels closest to how you'd describe it.",
        options: [
          { key: 'safe', letter: 'A', text: 'A locked safe — the valuables are inside, but you interact through a specific keyhole' },
          { key: 'variable', letter: 'B', text: 'A variable — it just stores a number that anyone can read or change directly' },
          { key: 'vending', letter: 'C', text: 'A vending machine — complex internals, but you only interact via buttons and a slot' },
          { key: 'openbox', letter: 'D', text: 'An open box — everything visible and freely accessible to anyone' }
        ],
        responses: {
          safe: "Great instinct! A locked safe is a perfect analogy — valuables inside, access only through a specific controlled mechanism. In OOP, this is exactly what <strong>encapsulation</strong> does: it locks the data inside the object and only exposes controlled access methods.",
          variable: "Not quite — a variable is just a named storage slot that anyone can read or change. Encapsulation is the opposite: it restricts access to data, hiding it and controlling how it can be modified.",
          vending: "Excellent analogy! A vending machine has motors, sensors, and cash handling inside — all hidden. You interact only through buttons and a slot. That controlled public interface over hidden internals is exactly <strong>encapsulation</strong>.",
          openbox: "That's the opposite of encapsulation — if everything is open and freely accessible, there's no protection. Encapsulation specifically means closing things off and controlling access carefully."
        }
      },
      {
        id: 'discover', stageNum: 3, title: 'Discover', icon: '❓',
        kicker: '❓ Discover', heading: 'Quick check',
        questions: [
          { id: 'q1', text: "Q1. The phone battery is sealed inside — you can't touch it directly, only charge via port and read via the icon. This design principle in programming is called ___.", options: [{ text: 'Inheritance', correct: false }, { text: 'Encapsulation', correct: true }, { text: 'Polymorphism', correct: false }, { text: 'Abstraction', correct: false }] },
          { id: 'q2', text: "Q2. In Python, to make an attribute private (hidden from code outside the class), you prefix it with ___.", options: [{ text: 'A single underscore _name', correct: false }, { text: 'Double underscore __name (name-mangling)', correct: true }, { text: 'The keyword private before the name', correct: false }, { text: 'Wrapping it in lock()', correct: false }] }
        ]
      },
      {
        id: 'reveal', stageNum: 4, title: 'Reveal', icon: '💡',
        kicker: '💡 Reveal', heading: 'The Phone battery → __battery mapping',
        description: "Here's exactly how the Samsung story maps onto real code:",
        mapping: [
          { story: 'The battery sealed inside — nobody touches it directly', code: 'self.__battery = 100', term: 'private attribute' },
          { story: 'The charging port — the only controlled way to charge', code: 'def charge(self):', term: 'public method' },
          { story: 'The battery icon on screen — read-only display of level', code: 'def get_battery(self):', term: 'getter method' },
          { story: "You can't pull out the battery and write a number on it", code: 'phone.__battery → AttributeError!', term: 'access violation' },
          { story: 'The phone controls what you can do to the battery', code: 'Only the class can modify __battery', term: 'data protection' }
        ],
        conclusion: 'Encapsulation bundles data and the methods that control it — and hides the data from everything outside the class.'
      },
      {
        id: 'learn', stageNum: 5, title: 'Learn', icon: '📖',
        kicker: '📖 Learn', heading: 'Encapsulation — the vocabulary',
        concepts: [
          { term: 'Encapsulation', definition: "Bundling an object's data (attributes) and the methods that operate on that data together inside a class — and restricting direct access to the data from outside." },
          { term: 'Private attribute (__name)', definition: 'An attribute prefixed with double underscore. Python applies name-mangling so it cannot be accessed directly from outside the class. Like the sealed battery.' },
          { term: 'Public method', definition: "A method that outside code is allowed to call — the 'port' through which the outside world interacts with private internal state in a controlled way." },
          { term: 'Getter method', definition: "A public method whose only job is to return the value of a private attribute. It lets you read the data without giving direct access to it." },
          { term: 'Setter method', definition: "A public method that lets you update a private attribute — but with validation. You decide what values are allowed, protecting the data from corruption." },
          { term: 'Why it matters', definition: "Without encapsulation, any code could set phone.battery = -999. With it, the class enforces rules — just like the phone won't let you overcharge the battery." }
        ],
        chips: ['encapsulation', '__private', 'getter', 'setter', 'public method', 'data protection']
      },
      {
        id: 'code', stageNum: 6, title: 'Code', icon: '💻',
        kicker: '💻 Code', heading: 'The Phone with a private battery, in Python',
        promptText: 'Click any line to see it explained in plain English.',
        codeLines: [
          { code: 'class Phone:', explain: "Start the blueprint — we're defining the Phone class." },
          { code: '    def __init__(self, model):', explain: "Constructor — runs the moment a new Phone object is created. Takes a model name." },
          { code: '        self.model = model', explain: "Public attribute — the model name is visible and readable from outside the class." },
          { code: '        self.__battery = 100', explain: "PRIVATE attribute. The double underscore means this cannot be accessed directly from outside. Like the sealed battery — untouchable." },
          { code: '        self.__is_charging = False', explain: "Another private attribute. The charging status is internal state — controlled only by the class itself." },
          { code: '', explain: '' },
          { code: '    def charge(self):', explain: "Public method — the 'charging port'. Outside code can call this, but can't touch __battery directly." },
          { code: '        self.__is_charging = True', explain: "Only the class itself can update private attributes. This is the whole point of encapsulation." },
          { code: '        self.__battery = 100', explain: "Charging complete — private battery updated internally. No outside code touched __battery directly." },
          { code: '        print(f"{self.model} is now fully charged!")', explain: "Public feedback — what the battery indicator shows." },
          { code: '', explain: '' },
          { code: '    def get_battery(self):', explain: "Getter method — the 'battery icon'. Returns the level but doesn't let anyone change it directly." },
          { code: '        return self.__battery', explain: "Reads the private attribute and returns its value. Read-only access from outside." },
          { code: '', explain: '' },
          { code: 'phone = Phone("Galaxy S26")', explain: "Create one Phone object — __battery is now privately set to 100 inside." },
          { code: 'phone.charge()', explain: "Call the public method. Works perfectly — this is the controlled interface." },
          { code: 'print(phone.get_battery())', explain: "Read battery level through the getter. Output: 100" },
          { code: '# print(phone.__battery)  → AttributeError!', explain: "Direct access to __battery fails! Python hides it using name mangling. Encapsulation enforced." }
        ]
      },
      {
        id: 'practice', stageNum: 7, title: 'Practice', icon: '⚡',
        kicker: '⚡ Practice', heading: 'Build a BankAccount class yourself',
        promptText: 'Click a tile, then click the slot where it belongs. Fill every slot, then hit Run Code.',
        slots: [
          { ln: 1, answerId: 'es1', prefix: '' },
          { ln: 2, answerId: 'es2', prefix: '' },
          { ln: 3, answerId: 'es3', prefix: '        ' },
          { ln: 4, answerId: 'es4', prefix: '        ' },
          { ln: 5, answerId: 'es5', prefix: '' },
          { ln: 6, answerId: 'es6', prefix: '        ' },
          { ln: 7, answerId: 'es7', prefix: '' }
        ],
        tiles: [
          { id: 'es1', text: 'class BankAccount:' },
          { id: 'es2', text: '    def __init__(self, owner):' },
          { id: 'es3', text: 'self.owner = owner' },
          { id: 'es4', text: 'self.__balance = 0' },
          { id: 'es5', text: '    def deposit(self, amount):' },
          { id: 'es6', text: 'self.__balance += amount' },
          { id: 'es7', text: '    def get_balance(self):' },
          { id: 'dx1', text: '    def __balance(self):' },
          { id: 'dx2', text: 'self.balance = 0' }
        ],
        finalQuestion: { text: "One last check — why can't outside code do account.__balance = 99999?", options: [{ text: "Because Python doesn't allow numbers in attribute names", correct: false }, { text: 'Because the class deleted the attribute after setting it', correct: false }, { text: 'Because __balance is name-mangled — it becomes _BankAccount__balance internally', correct: true }] },
        successOutput: 'BankAccount object created!\nowner = Akash  (public)\n__balance = 0  (private — sealed inside)\nAfter deposit: balance = 5000\nDirect __balance access → blocked!'
      },
      { id: 'trophy', stageNum: 8, title: 'Complete', icon: '🏆', heading: 'Encapsulation — unlocked.', conclusion: "The battery is sealed for a reason. Private data, public interface — that's the heart of encapsulation. Your objects now protect their own state, just like every Galaxy S26 phone.", badges: ['✓ Scenario understood', '✓ Concept connected', '✓ Vocabulary learned', '✓ Code read', '✓ Code built'] }
    ]
  },
  {
    id: 'cs-3',
    title: 'Galaxy Family Tree',
    concept: 'Inheritance',
    level: 'Beginner',
    type: 'interactive',
    problemStatement: "Learning Inheritance through the Samsung Galaxy family",
    stages: [
      {
        id: 'scenario', stageNum: 1, title: 'Scenario', icon: '🎬',
        kicker: '🎬 Scenario', heading: 'The Galaxy Family Tree',
        story: "Samsung's engineers first built one <strong>base phone design</strong> — a foundation with the most essential phone features: the ability to make calls, send texts, connect to Wi-Fi, and take photos. Every Samsung phone must be able to do these things.<br><br>Then they created specialised models on top of that foundation. The <strong>Galaxy S26</strong> took the base design and added AI photo editing, satellite connectivity, and a titanium frame. The <strong>Galaxy A35</strong> took the same base design and added a long-life battery optimised for budget users. The <strong>Galaxy Z Fold 6</strong> took it and added a foldable display mechanism.<br><br>Samsung did not re-design calling, texting, and Wi-Fi from scratch for each model. Every model <strong>inherited</strong> those features from the base design — and simply extended it with what makes each model unique.",
        promptText: 'Read the story, then continue.'
      },
      {
        id: 'think', stageNum: 2, title: 'Think', icon: '🤔',
        kicker: '🤔 Think', heading: 'What does building on top of a base design remind you of?',
        promptText: "Pick whichever feels closest.",
        options: [
          { key: 'child', letter: 'A', text: "A child inheriting traits from a parent — they get the family features automatically, then add their own personality" },
          { key: 'copy', letter: 'B', text: 'Copy-pasting all the code — write the same thing again for every new phone model' },
          { key: 'scratch', letter: 'C', text: 'Starting from scratch each time — every model is designed with no connection to earlier ones' },
          { key: 'delete', letter: 'D', text: 'Deleting the old design and replacing it entirely with a new one' }
        ],
        responses: {
          child: "Perfect analogy! A child inherits their parent's eye colour, height tendencies, and other traits automatically. In Python, a child class automatically gets all the parent class's methods and attributes — that's <strong>inheritance</strong>.",
          copy: "Copy-pasting is actually what inheritance helps you avoid! Instead of duplicating all the shared code in every model, you write it once in the parent class and every child gets it automatically.",
          scratch: "Starting from scratch would mean rewriting calling, texting, and Wi-Fi code for every Galaxy model — enormously wasteful. Inheritance lets each model build on the existing foundation.",
          delete: "Not quite — inheritance preserves the parent. The parent class still exists; child classes simply extend it. Nothing gets deleted or replaced."
        }
      },
      {
        id: 'discover', stageNum: 3, title: 'Discover', icon: '❓',
        kicker: '❓ Discover', heading: 'Quick check',
        questions: [
          { id: 'q1', text: "Q1. Galaxy S26 gets calling and texting from the base phone design without Samsung rewriting that code. In programming, this mechanism is called ___.", options: [{ text: 'Encapsulation', correct: false }, { text: 'Polymorphism', correct: false }, { text: 'Inheritance', correct: true }, { text: 'Abstraction', correct: false }] },
          { id: 'q2', text: "Q2. In Python, how do you make GalaxyS inherit from Phone?", options: [{ text: 'class GalaxyS inherits Phone:', correct: false }, { text: 'class GalaxyS(Phone):', correct: true }, { text: 'GalaxyS = Phone.extend()', correct: false }, { text: 'class GalaxyS from Phone:', correct: false }] }
        ]
      },
      {
        id: 'reveal', stageNum: 4, title: 'Reveal', icon: '💡',
        kicker: '💡 Reveal', heading: 'The Galaxy Family → Python Inheritance mapping',
        description: "Here's exactly how the Samsung story maps onto real code:",
        mapping: [
          { story: 'The base phone design — all common features', code: 'class Phone:', term: 'parent class' },
          { story: 'Galaxy S inherits base design and adds AI', code: 'class GalaxyS(Phone):', term: 'child class' },
          { story: "Galaxy S re-uses calling without rewriting it", code: 's26.make_call() — from parent', term: 'inherited method' },
          { story: "Galaxy S's special AI photo feature", code: 'def ai_edit(self): — in child only', term: 'extended method' },
          { story: "Calling the base phone's setup from within Galaxy S", code: 'super().__init__(model)', term: 'super()' },
          { story: 'Galaxy Z changes how display works (foldable)', code: 'Override def display(self): in child', term: 'method override' }
        ],
        conclusion: 'One base class. Many child classes. Each child inherits everything from the parent — and can add or change what it needs.'
      },
      {
        id: 'learn', stageNum: 5, title: 'Learn', icon: '📖',
        kicker: '📖 Learn', heading: 'Inheritance — the vocabulary',
        concepts: [
          { term: 'Inheritance', definition: "A child class automatically gets all the attributes and methods of its parent class — without any code being copied. It can then add new ones or change existing ones." },
          { term: 'Parent class (superclass)', definition: 'The class being inherited from. It defines the shared foundation. In our story: the base Phone class.' },
          { term: 'Child class (subclass)', definition: "The class that inherits. Written as class Child(Parent):. It automatically has everything the parent has." },
          { term: 'super()', definition: "Inside a child class, super() lets you call the parent class's methods — most importantly super().__init__() to run the parent's constructor first." },
          { term: 'Method override', definition: "When a child class defines a method with the same name as one in the parent, it replaces the parent's version for that child." },
          { term: 'Why it matters', definition: "Write shared code once in the parent. Every child gets it for free. Change the parent — all children update automatically. No copy-paste, no duplicated bugs." }
        ],
        chips: ['inheritance', 'parent class', 'child class', 'super()', 'override', 'subclass']
      },
      {
        id: 'code', stageNum: 6, title: 'Code', icon: '💻',
        kicker: '💻 Code', heading: 'The Galaxy family in Python',
        promptText: 'Click any line to see it explained in plain English.',
        codeLines: [
          { code: 'class Phone:', explain: "The parent class — the base Samsung phone design with features every model shares." },
          { code: '    def __init__(self, model):', explain: "Parent constructor — runs when any Phone (or child of Phone) is created." },
          { code: '        self.model = model', explain: "Shared attribute — every Galaxy model has a model name." },
          { code: '    def make_call(self):', explain: "Shared method — defined once in the parent. All child classes get this for free." },
          { code: '        print(f"{self.model}: Calling...")', explain: "Works for any Galaxy model — phone, tablet, fold — because it's inherited." },
          { code: '', explain: '' },
          { code: 'class GalaxyS(Phone):', explain: "Child class — inherits from Phone. Gets make_call() and __init__ automatically." },
          { code: '    def __init__(self, model):', explain: "Galaxy S has its own constructor — but we still need to call the parent's constructor too." },
          { code: '        super().__init__(model)', explain: "super() calls the parent Phone.__init__ — sets self.model. Essential: don't skip this!" },
          { code: '        self.ai_features = True', explain: "Galaxy S exclusive feature — added on top of inherited Phone features." },
          { code: '    def satellite_call(self):', explain: "Method unique to GalaxyS — not in the parent Phone class. Extends the base blueprint." },
          { code: '        print(f"{self.model}: Satellite connected!")', explain: "Only GalaxyS objects can do this — not plain Phone objects." },
          { code: '', explain: '' },
          { code: 's26 = GalaxyS("Galaxy S26")', explain: "Create a GalaxyS object — triggers GalaxyS.__init__ which calls super().__init__." },
          { code: 's26.make_call()', explain: "Inherited method! We never wrote make_call() in GalaxyS — it came from Phone." },
          { code: 's26.satellite_call()', explain: "GalaxyS-only method. Output: 'Galaxy S26: Satellite connected!'" }
        ]
      },
      {
        id: 'practice', stageNum: 7, title: 'Practice', icon: '⚡',
        kicker: '⚡ Practice', heading: 'Build an Animal → Dog class hierarchy',
        promptText: 'Click a tile, then click the slot where it belongs. Fill every slot, then hit Run Code.',
        slots: [
          { ln: 1, answerId: 'is1', prefix: '' },
          { ln: 2, answerId: 'is2', prefix: '' },
          { ln: 3, answerId: 'is3', prefix: '        ' },
          { ln: 4, answerId: 'is4', prefix: '' },
          { ln: 5, answerId: 'is5', prefix: '' },
          { ln: 6, answerId: 'is6', prefix: '        ' },
          { ln: 7, answerId: 'is7', prefix: '        ' }
        ],
        tiles: [
          { id: 'is1', text: 'class Animal:' },
          { id: 'is2', text: '    def __init__(self, name):' },
          { id: 'is3', text: 'self.name = name' },
          { id: 'is4', text: 'class Dog(Animal):' },
          { id: 'is5', text: '    def speak(self):' },
          { id: 'is6', text: 'super().__init__(name)' },
          { id: 'is7', text: 'print(f"{self.name}: Woof!")' },
          { id: 'ix1', text: 'class Dog:' },
          { id: 'ix2', text: 'class Dog extends Animal:' }
        ],
        finalQuestion: { text: "One last check — if Dog inherits from Animal and doesn't override breathe(), what happens when you call dog1.breathe()?", options: [{ text: "It raises an error — Dog must define every method itself", correct: false }, { text: "Python finds breathe() in the parent Animal class and runs it", correct: true }, { text: "It silently does nothing", correct: false }] },
        successOutput: 'Dog object created!\ndog1.name = Rex  (inherited from Animal)\ndog1.speak() -> Rex: Woof!\nInheritance confirmed: Dog IS-A Animal'
      },
      { id: 'trophy', stageNum: 8, title: 'Complete', icon: '🏆', heading: 'Inheritance — unlocked.', conclusion: "Design once, reuse everywhere. Every Galaxy model inherited from one base Phone — and each added exactly what it needed without repeating a single shared line of code.", badges: ['✓ Scenario understood', '✓ Concept connected', '✓ Vocabulary learned', '✓ Code read', '✓ Code built'] }
    ]
  },
  {
    id: 'cs-4',
    title: 'One Command, Three Reactions',
    concept: 'Polymorphism',
    level: 'Beginner',
    type: 'interactive',
    problemStatement: "Learning Polymorphism through Samsung devices",
    stages: [
      {
        id: 'scenario', stageNum: 1, title: 'Scenario', icon: '🎬',
        kicker: '🎬 Scenario', heading: 'One Command. Three Different Reactions.',
        story: "Samsung makes three types of devices: the <strong>Galaxy S26 phone</strong>, the <strong>Galaxy Tab S9 tablet</strong>, and the <strong>Galaxy Watch 7</strong>. Imagine you press a \"Show Dashboard\" button connected to all three simultaneously.<br><br>The <strong>phone</strong> reacts by lighting up its home screen — recent apps, notifications, camera shortcut.<br>The <strong>tablet</strong> reacts by launching a landscape multi-window layout — big screen, side-by-side apps.<br>The <strong>watch</strong> reacts by showing health rings, heart rate, and step count on its tiny circular screen.<br><br>You sent <strong>the exact same command</strong> — \"Show Dashboard\" — to all three. But each device responded <strong>in its own way</strong>, based on what makes sense for it. The command is identical. The behaviour is completely different.",
        promptText: 'Read the story, then continue.'
      },
      {
        id: 'think', stageNum: 2, title: 'Think', icon: '🤔',
        kicker: '🤔 Think', heading: 'What does "same command, different result" remind you of?',
        promptText: "Pick whichever feels closest.",
        options: [
          { key: 'remote', letter: 'A', text: 'The word "charge!" — it means different things to a soldier, a battery, and a credit card company' },
          { key: 'same', letter: 'B', text: 'All three devices showing the exact same screen — same input, identical output' },
          { key: 'replace', letter: 'C', text: 'Replacing one device with another entirely new device for each command' },
          { key: 'copy', letter: 'D', text: 'Making three separate remote controls, each with completely different buttons' }
        ],
        responses: {
          remote: "Brilliant analogy! The word 'charge!' means completely different things in different contexts — a soldier charges forward, a battery charges with electricity, a credit card gets charged with a purchase. Same word, totally different action. That's <strong>polymorphism</strong>.",
          same: "The whole point of polymorphism is that the output is NOT identical! Same command — but each object responds in its own specific way.",
          replace: "Not quite — polymorphism keeps all objects and just sends them the same command. No replacement involved.",
          copy: "Three separate remote controls would be the opposite of polymorphism — you'd need to know which remote to use for which device. Polymorphism means one command works for all."
        }
      },
      {
        id: 'discover', stageNum: 3, title: 'Discover', icon: '❓',
        kicker: '❓ Discover', heading: 'Quick check',
        questions: [
          { id: 'q1', text: "Q1. You call .show_dashboard() on a Phone, a Tablet, and a Watch. Each reacts differently. This ability of different objects to respond to the same method call in their own way is called ___.", options: [{ text: 'Encapsulation', correct: false }, { text: 'Inheritance', correct: false }, { text: 'Polymorphism', correct: true }, { text: 'Abstraction', correct: false }] },
          { id: 'q2', text: "Q2. When a child class defines a method with the same name as the parent but with different behaviour, it's called ___.", options: [{ text: 'Overloading', correct: false }, { text: 'Overriding', correct: true }, { text: 'Overwriting the class', correct: false }, { text: 'Inheriting', correct: false }] }
        ]
      },
      {
        id: 'reveal', stageNum: 4, title: 'Reveal', icon: '💡',
        kicker: '💡 Reveal', heading: 'The Three Devices → Python Polymorphism mapping',
        description: "Here's exactly how the Samsung story maps onto real code:",
        mapping: [
          { story: 'All devices can "Show Dashboard" — shared command', code: 'def show_dashboard(self): in parent', term: 'polymorphic method' },
          { story: 'Phone shows home screen when commanded', code: 'Phone class overrides show_dashboard', term: 'method override' },
          { story: 'Tablet shows landscape layout for same command', code: 'Tablet class overrides show_dashboard', term: 'method override' },
          { story: 'Watch shows health data for same command', code: 'Watch class overrides show_dashboard', term: 'method override' },
          { story: 'One loop sending "Show Dashboard" to all devices', code: 'for d in devices: d.show_dashboard()', term: 'polymorphic call' }
        ],
        conclusion: 'Polymorphism means "many forms." One method name — many different implementations depending on which object receives the call.'
      },
      {
        id: 'learn', stageNum: 5, title: 'Learn', icon: '📖',
        kicker: '📖 Learn', heading: 'Polymorphism — the vocabulary',
        concepts: [
          { term: 'Polymorphism', definition: 'From Greek — "poly" (many) + "morph" (form). The ability of different objects to respond to the same method call, each in their own way.' },
          { term: 'Method overriding', definition: "A child class defines a method with the same name as one in its parent — replacing the parent's version for that child's objects. Same name, different body." },
          { term: 'Polymorphic call', definition: 'Calling the same method on a list of different object types. Python figures out at runtime which version to use based on the actual type of each object.' },
          { term: 'Duck typing', definition: "If it walks like a duck and quacks like a duck, it's a duck. In Python, you don't need a shared parent — if an object has the method, you can call it." },
          { term: 'Runtime dispatch', definition: 'Python decides which version of an overridden method to call at the moment the code runs — based on the actual object, not the variable name.' },
          { term: 'Why it matters', definition: "Write for d in devices: d.show_dashboard() once — it works for all device types, even new ones added later. Your calling code never has to change." }
        ],
        chips: ['polymorphism', 'override', 'duck typing', 'runtime dispatch', 'many forms']
      },
      {
        id: 'code', stageNum: 6, title: 'Code', icon: '💻',
        kicker: '💻 Code', heading: 'Three Samsung devices, one method call',
        promptText: 'Click any line to see it explained in plain English.',
        codeLines: [
          { code: 'class Device:', explain: "The parent class — all Samsung devices share this base." },
          { code: '    def __init__(self, name):', explain: "Every device has a name — shared by all child classes." },
          { code: '        self.name = name', explain: "Shared attribute for all Device objects." },
          { code: '    def show_dashboard(self):', explain: "Default method in the parent — a fallback if a child doesn't override." },
          { code: '        print(f"{self.name}: Showing dashboard...")', explain: "Generic default — child classes will replace this with their own version." },
          { code: '', explain: '' },
          { code: 'class Phone(Device):', explain: "Phone inherits from Device." },
          { code: '    def show_dashboard(self):', explain: "OVERRIDE — Phone replaces the parent's show_dashboard with its own version." },
          { code: '        print(f"{self.name}: Home screen")', explain: "Same method name — completely different behaviour specific to Phone." },
          { code: '', explain: '' },
          { code: 'class Watch(Device):', explain: "Watch also inherits from Device." },
          { code: '    def show_dashboard(self):', explain: "OVERRIDE — Watch replaces show_dashboard with its own watch-specific version." },
          { code: '        print(f"{self.name}: Health rings")', explain: "Same method name — different content, right for a watch screen." },
          { code: '', explain: '' },
          { code: 'devices = [Phone("S26"), Watch("Watch7")]', explain: "A list of different object types — totally valid in Python." },
          { code: 'for d in devices:', explain: "One loop — Python figures out which object is which at runtime." },
          { code: '    d.show_dashboard()', explain: "Polymorphic call — same line of code, different output for Phone vs Watch. That's polymorphism!" }
        ]
      },
      {
        id: 'practice', stageNum: 7, title: 'Practice', icon: '⚡',
        kicker: '⚡ Practice', heading: 'Build a Shape → Circle polymorphism',
        promptText: 'Click a tile, then click the slot where it belongs. Fill every slot, then hit Run Code.',
        slots: [
          { ln: 1, answerId: 'ps1', prefix: '' },
          { ln: 2, answerId: 'ps2', prefix: '' },
          { ln: 3, answerId: 'ps3', prefix: '        ' },
          { ln: 4, answerId: 'ps4', prefix: '' },
          { ln: 5, answerId: 'ps5', prefix: '    ' },
          { ln: 6, answerId: 'ps6', prefix: '        ' },
          { ln: 7, answerId: 'ps7', prefix: '    ' }
        ],
        tiles: [
          { id: 'ps1', text: 'class Shape:' },
          { id: 'ps2', text: '    def describe(self):' },
          { id: 'ps3', text: 'print("I am a generic shape")' },
          { id: 'ps4', text: 'class Circle(Shape):' },
          { id: 'ps5', text: 'def describe(self):' },
          { id: 'ps6', text: 'print("I am a Circle")' },
          { id: 'ps7', text: 'def area(self): return 0' },
          { id: 'px1', text: 'class Circle:' },
          { id: 'px2', text: 'class Circle extends Shape:' }
        ],
        finalQuestion: { text: "One last check — you add a new class Triangle(Shape) with its own describe(). You add a Triangle to your shapes list. What happens to your for s in shapes: s.describe() loop?", options: [{ text: "The loop breaks because it doesn't know how to handle Triangle", correct: false }, { text: "You must rewrite the loop to add a special case for Triangle", correct: false }, { text: "The loop works perfectly — Python automatically calls Triangle's describe() for that object", correct: true }] },
        successOutput: 'Polymorphism in action!\nshapes = [Shape(), Circle()]\nShape  -> I am a generic shape\nCircle -> I am a Circle\nSame .describe() call — different result!'
      },
      { id: 'trophy', stageNum: 8, title: 'Complete', icon: '🏆', heading: 'Polymorphism — unlocked.', conclusion: "One command. Three devices. Three different reactions. Your code can now send the same message to any object and trust that each object will respond in its own correct way.", badges: ['✓ Scenario understood', '✓ Concept connected', '✓ Vocabulary learned', '✓ Code read', '✓ Code built'] }
    ]
  },
  {
    id: 'cs-5',
    title: 'The Hidden Call',
    concept: 'Abstraction',
    level: 'Beginner',
    type: 'interactive',
    problemStatement: "Learning Abstraction through the Samsung call button",
    stages: [
      {
        id: 'scenario', stageNum: 1, title: 'Scenario', icon: '🎬',
        kicker: '🎬 Scenario', heading: 'What Really Happens When You Press "Call"?',
        story: "You pick up your Galaxy S26, find a contact, and tap <strong>\"Call\"</strong>. That's it. One tap.<br><br>But behind that one tap, the phone silently does dozens of things you never see: it authenticates your SIM card, selects the best radio frequency, locates the nearest cell tower, performs a handshake with the tower, negotiates a voice codec, encodes your voice into digital packets, routes those packets through the network, and decodes the incoming packets at the other end — all within milliseconds.<br><br>You did not need to know any of that. Samsung <strong>hid all of it</strong> behind a simple, clearly defined interface: a green phone icon. You know what it does (makes a call) — you don't need to know how it does it. The complexity has been <strong>abstracted away</strong> from you.",
        promptText: 'Read the story, then continue.'
      },
      {
        id: 'think', stageNum: 2, title: 'Think', icon: '🤔',
        kicker: '🤔 Think', heading: 'What does hiding complex details behind a simple interface remind you of?',
        promptText: "Pick whichever feels closest.",
        options: [
          { key: 'switch', letter: 'A', text: "A light switch — you flip it and the room lights up. You don't need to understand circuits, wiring, or voltage" },
          { key: 'manual', letter: 'B', text: 'Reading the full engineering manual before turning on any device — know everything before doing anything' },
          { key: 'copy', letter: 'C', text: 'Copying the exact internal circuitry into every room so each room works independently' },
          { key: 'open', letter: 'D', text: 'Leaving all wires exposed so anyone can see and touch exactly how everything is connected' }
        ],
        responses: {
          switch: "Perfect! A light switch is the classic abstraction example. You know exactly what it does (toggles light) but the electrical circuitry behind it is completely hidden. Simple interface, hidden complexity — that's <strong>abstraction</strong>.",
          manual: "That's the opposite of abstraction — requiring everyone to understand all the internals before using something. Abstraction exists specifically so you don't need to read the engineering manual.",
          copy: "Copying internals everywhere is the opposite of abstraction — it exposes and duplicates complexity instead of hiding it.",
          open: "Leaving wires exposed means users must understand every internal detail. Abstraction deliberately hides those internals behind a clean, simple interface."
        }
      },
      {
        id: 'discover', stageNum: 3, title: 'Discover', icon: '❓',
        kicker: '❓ Discover', heading: 'Quick check',
        questions: [
          { id: 'q1', text: "Q1. Tapping \"Call\" triggers dozens of internal processes — but you only see a green button. Hiding complex implementation behind a simple, well-defined interface is called ___.", options: [{ text: 'Encapsulation', correct: false }, { text: 'Inheritance', correct: false }, { text: 'Polymorphism', correct: false }, { text: 'Abstraction', correct: true }] },
          { id: 'q2', text: "Q2. In Python, to define an abstract class that cannot be instantiated directly, you use ___.", options: [{ text: 'class Payment(Abstract):', correct: false }, { text: 'from abc import ABC, abstractmethod then class Payment(ABC):', correct: true }, { text: 'class Payment(Interface):', correct: false }, { text: 'abstract class Payment:', correct: false }] }
        ]
      },
      {
        id: 'reveal', stageNum: 4, title: 'Reveal', icon: '💡',
        kicker: '💡 Reveal', heading: 'The "Call" Button → Python Abstraction mapping',
        description: "Here's exactly how the Samsung story maps onto real code:",
        mapping: [
          { story: 'The green "Call" button — simple interface, no internals visible', code: '@abstractmethod\ndef connect(self): pass', term: 'abstract method' },
          { story: "The phone itself — can't call without a real device model", code: "class Device(ABC): — can't be used directly", term: 'abstract class' },
          { story: 'Galaxy S26 — the real phone that actually makes the call', code: 'class GalaxyS(Device):\n  def connect(self): # real code', term: 'concrete class' },
          { story: "You don't rewire the phone — you just press \"Call\"", code: 'Caller uses device.connect() — no internals needed', term: 'abstracted interface' },
          { story: "Every Samsung device must have a \"Call\" button — it's the contract", code: 'Every subclass must implement connect()', term: 'enforced contract' }
        ],
        conclusion: "Abstraction hides how things work and exposes only what they do. It also enforces a contract — every concrete class must implement the abstract methods."
      },
      {
        id: 'learn', stageNum: 5, title: 'Learn', icon: '📖',
        kicker: '📖 Learn', heading: 'Abstraction — the vocabulary',
        concepts: [
          { term: 'Abstraction', definition: "Hiding how something works and only exposing what it does. Users of your class interact with a simple interface — the complex implementation is invisible." },
          { term: 'Abstract class (ABC)', definition: "A class that defines abstract methods — but cannot be instantiated itself. It's a contract: 'every class that inherits from me must implement these methods.'" },
          { term: '@abstractmethod', definition: "A decorator that marks a method as abstract — it has no body (just pass). Subclasses must provide the real implementation or Python raises a TypeError." },
          { term: 'Concrete class', definition: "A class that inherits from an abstract class and implements all its abstract methods. This is the 'real' class you can actually create objects from." },
          { term: 'Encap. vs Abstraction', definition: "Encapsulation hides data (using private attributes). Abstraction hides implementation (using abstract methods). Both are about hiding — but different things." },
          { term: 'Why it matters', definition: "You can swap implementations without breaking calling code. Replace GalaxyS.connect() internals completely — anything calling device.connect() still works perfectly." }
        ],
        chips: ['abstraction', 'ABC', '@abstractmethod', 'concrete class', 'interface contract']
      },
      {
        id: 'code', stageNum: 6, title: 'Code', icon: '💻',
        kicker: '💻 Code', heading: 'Payment abstraction — in Python',
        promptText: 'Click any line to see it explained in plain English.',
        codeLines: [
          { code: 'from abc import ABC, abstractmethod', explain: "Import the tools we need. ABC = Abstract Base Class. abstractmethod = the decorator for abstract methods." },
          { code: '', explain: '' },
          { code: 'class Payment(ABC):', explain: "Abstract class — inherits from ABC. This is a contract. You CANNOT create a Payment() object directly." },
          { code: '    @abstractmethod', explain: "Decorator — marks the next method as abstract. Every subclass MUST implement it." },
          { code: '    def pay(self, amount):', explain: "Abstract method — just the interface, no body. Says 'every Payment type must have a pay() method'." },
          { code: '        pass', explain: "No implementation here — that's the point. The 'how' is left to concrete subclasses." },
          { code: '', explain: '' },
          { code: 'class CreditCard(Payment):', explain: "Concrete class — inherits Payment (ABC). Must implement pay() or Python refuses to create objects from it." },
          { code: '    def pay(self, amount):', explain: "Real implementation of the abstract method. CreditCard's specific way of paying." },
          { code: '        print(f"Credit card charged: {amount}")', explain: "The actual logic — hidden from the outside. Callers just call pay()." },
          { code: '', explain: '' },
          { code: 'class UPI(Payment):', explain: "Another concrete class — different payment method, same abstract interface." },
          { code: '    def pay(self, amount):', explain: "Different implementation — UPI does very different things internally than a credit card." },
          { code: '        print(f"UPI transfer: {amount} sent")', explain: "But the caller doesn't need to know. They just call pay() on any Payment object." },
          { code: '', explain: '' },
          { code: 'for method in [CreditCard(), UPI()]:', explain: "Works with any Payment subclass — existing or future ones." },
          { code: '    method.pay(500)', explain: "Same call — different hidden implementations. Abstraction in action!" }
        ]
      },
      {
        id: 'practice', stageNum: 7, title: 'Practice', icon: '⚡',
        kicker: '⚡ Practice', heading: 'Build a Shape abstraction',
        promptText: 'Click a tile, then click the slot where it belongs. Fill every slot, then hit Run Code.',
        slots: [
          { ln: 1, answerId: 'as1', prefix: '' },
          { ln: 2, answerId: 'as2', prefix: '' },
          { ln: 3, answerId: 'as3', prefix: '    ' },
          { ln: 4, answerId: 'as4', prefix: '    ' },
          { ln: 5, answerId: 'as5', prefix: '        ' },
          { ln: 6, answerId: 'as6', prefix: '' },
          { ln: 7, answerId: 'as7', prefix: '    ' }
        ],
        tiles: [
          { id: 'as1', text: 'from abc import ABC, abstractmethod' },
          { id: 'as2', text: 'class Shape(ABC):' },
          { id: 'as3', text: '@abstractmethod' },
          { id: 'as4', text: 'def area(self): pass' },
          { id: 'as5', text: 'pass' },
          { id: 'as6', text: 'class Circle(Shape):' },
          { id: 'as7', text: 'def area(self): return 3.14 * self.r * self.r' },
          { id: 'ax1', text: 'class Shape:' },
          { id: 'ax2', text: 'class Circle:' }
        ],
        finalQuestion: { text: "One last check — what happens if you try s = Shape() (instantiating the abstract class directly)?", options: [{ text: "It works fine and creates an empty Shape object", correct: false }, { text: "Python raises a TypeError — you cannot instantiate an abstract class", correct: true }, { text: "Python creates a Shape with all abstract methods returning None", correct: false }] },
        successOutput: "Abstract class enforced!\nShape() -> TypeError: Can't instantiate abstract class\nCircle created -> area = 78.5\nAbstraction contract fulfilled!"
      },
      { id: 'trophy', stageNum: 8, title: 'Complete', icon: '🏆', heading: 'Abstraction — unlocked.', conclusion: "You press \"Call\" — that's all you need to know. The rocket science behind it stays hidden. Your abstract classes now enforce a contract, hide the complexity, and let implementations change freely underneath.", badges: ['✓ Scenario understood', '✓ Concept connected', '✓ Vocabulary learned', '✓ Code read', '✓ Code built'] }
    ]
  }
];

router.get('/', (req, res) => {
  res.json(caseStudies);
});

router.get('/:id', (req, res) => {
  const study = caseStudies.find((cs) => cs.id === req.params.id);
  if (!study) return res.status(404).json({ error: 'Case study not found' });
  res.json(study);
});

module.exports = router;
