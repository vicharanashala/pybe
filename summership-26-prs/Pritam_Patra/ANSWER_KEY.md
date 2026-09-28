# PyBe — Master Answer Key & Authoring Reference

This file tells you exactly what the learner is asked at every step and what counts as the correct answer, so you know what to follow when authoring new acts.

## 1) Every Field an Act Must Have (the schema)

Each act lives inside an arc: `{ "arc": 1, "name": "...", "color": "#...", "acts": [ ... ] }`.
The saga itself has: `id`, `title`, `subtitle`, `icon`, `accent`, `completeMessage`, `characters`, `arcs`.

Act fields (marked `REQUIRED` or `OPTIONAL`):

- **act** (number) — REQUIRED — act number inside the saga (1..n). Used by notes & evaluator.
- **name** (string) — REQUIRED — short act title shown in the chapter card and journal.
- **concept** (string) — REQUIRED — one-line label of what is being discovered (shown in the journal as 'discovery').
- **image** (string) — REQUIRED — background scene image path, e.g. '/images/act1.jpeg'.
- **arcNumber** (number) — OPTIONAL — which arc this act belongs to (used to find arcInfo).
- **narrative** (array) — REQUIRED — dialogue array of { speaker, text }. Speakers must exist in saga.characters.
- **observationPrompt** (string | null) — REQUIRED — the observation prompt. If null, the act skips observation AND the transfer step.
- **observationOptions** (object | absent) — REQUIRED with observationPrompt — { question, options[], answerIndex (0-based), hint }. Learner picks an option until correct.
- **questions** (array) — KEPT for reference — 2–3 open questions originally shown under the observation prompt (legacy, no longer collected as text).
- **expectedInsight** (string) — REQUIRED — the insight the learner must reach.
- **transferScenario** (object | absent) — OPTIONAL — new scenario to test transfer. { title, text, question, options[], answerIndex, hint }. Multiple-choice; shown right after a correct observation, before the MCQ.
- **mcqs** (array) — REQUIRED (unless act skips straight to code) — exactly 3 objects { question, options[], answerIndex (0-based), hint }. Shown one by one, full screen.
- **summaryGuide** (array) — REQUIRED — 3 bullet strings; the summary is auto-built from them and saved to Notes.
- **storyBridge** (array) — OPTIONAL — { speaker, text } dialogues connecting story to Python, shown after the summary.
- **syntaxLesson** (array) — OPTIONAL — code slides shown after the bridge. Each slide: { slideTitle, storyConnection, explanation, code, highlightWords[] }.
- **slidesFile** (string) — OPTIONAL — filename used for the slides window when codeReveal is null.
- **codeReveal** (object | null) — REQUIRED for code acts — { file, template (with ____ blanks), blanks[{placeholder, answer, hint}], explanation }. null when act has no code.
- **codeTask** (object | absent) — OPTIONAL — 'Now write the code yourself' step. { title, instructions, acceptableSubstrings[], modelAnswer }.

## 2) How the app flows for ONE act

This is the exact journey and where each answer is collected:

- **Chapter Card** — Click start.
- **Narrating** — Read the story dialogue.
- **Observation** — Multiple choice (3 options). Learner picks; wrong pick shows an inline Pip hint and lets them re-pick. Must answer correctly to continue.
- **Transfer Scenario** — Correct observation → full-screen new scenario, multiple choice. Wrong pick shows a hint; Continue unlocks only after a correct pick.
- **MCQ (3)** — Three full-screen "Quick Check" questions, one at a time. Wrong pick shows a hint and lets them re-pick. All three correct → summary.
- **Summary / Notes** — A ready-made summary is shown (built from the author-written summaryGuide points); it is auto-saved to /api/sagas/:id/notes and appears in the journal sidebar. No writing required from the learner.
- **Story Bridge** — Priya & Pip connect the story idea to Python.
- **Slide Teach** — Step-by-step syntax slides.
- **Code (fill blanks)** — Learner fills ____ in the template. Correct answers listed in that act below.
- **Now You Write the Code** — Learner writes the file from scratch. CHECKED against the acceptableSubstrings listed for that act below.
- **Success** — Act marked complete, +100 XP.

## 3) Inheritance Saga — Questions & Correct Answers (inheritance.json)

Saga id: `inheritance`  ·  Arc 1: Foundations · Arc 2: Behavior · Arc 3: Family Trees

### Act 1 · “The Pattern”  (Arc 1 · Foundations)

- **Concept discovered:** generalization / base class

#### Observation step (multiple choice, must pick the correct option to continue)

Prompt: `Dr. Priya turns to you and taps her journal.`

Question: **What do the Lion, Eagle, and Dolphin all have in common?**

· Option 0: They all live in the same habitat
✅ **Option 1: They all breathe, move around, and eat** (CORRECT)
· Option 2: They all have the same shape and size

Hint (shown on wrong pick): Priya noticed shared behaviours, not appearances. What actions does every single one of them do every day?

- **Expected insight:** Learner identifies shared/common traits across all animals, generalization thinking, recognizing a base pattern

#### Transfer scenario (multiple choice, full screen, Continue unlocks only on a correct pick)

**Scenario — “A New Field List”**
Priya opens a second page in her journal. This time she is watching three vehicles on the road: a Bicycle, a Car, and a Truck. They look completely different on the outside, but Priya notices every one of them has wheels, carries people or goods, and needs energy to move.

**Question:** Now, using your understanding: what do the Bicycle, the Car, and the Truck all share? What single label would you group them under?

· Option 0: Nothing, they are completely unrelated
✅ **Option 1: They all have wheels, carry people or goods, and need energy, so group them under Vehicles** (CORRECT)
· Option 2: They are all vehicles, but they share no common traits

Hint (shown on wrong pick): Look for the shared needs every one of them has: wheels, carrying things, and energy.

#### MCQs (3 Quick Check questions, full screen, one at a time — correct option highlighted)

Quick Check 1 — Question: **If we group the Lion, Eagle, and Dolphin into one category based on their shared traits, what concept are we applying?**

· Option 0: Specialization
✅ **Option 1: Generalization** (CORRECT)
· Option 2: Randomization

Hint (shown on wrong pick): Think about finding the 'general' pattern that applies to all of them.

Quick Check 2 — Question: **Which label best groups objects that share the same core traits?**

· Option 0: Specialization
✅ **Option 1: Generalization** (CORRECT)
· Option 2: Randomization

Hint (shown on wrong pick): Think about grouping by shared features, not splitting apart.

Quick Check 3 — Question: **The lion, the eagle, and the dolphin share the same core traits. What is the smartest way to record them?**

· Option 0: Write the same traits three times, once per animal
✅ **Option 1: Record the shared traits once under one group label** (CORRECT)
· Option 2: Give each animal completely different traits

Hint (shown on wrong pick): Why write the same behaviour down three times when one group can hold it?

#### Summary panel (a ready-made summary is auto-built from these points and saved to the learner’s Notes — the learner just presses Continue)

- Several different things can share the same core traits.
- When they do, we group them under one shared label.
- In Python, that label becomes a class, the foundation every member builds on.

#### Story bridge (dialogue only)

- **priya:** You found the shared traits, breathe, move, eat. Every animal has them. Now here is something interesting.
- **pip:** Hoo! Programmers face the exact same problem, how to group things that share common traits! They solved it the same way you did!
- **priya:** In programming, a group of shared traits is called a class. The word class means exactly what you just described. Let me show you how to write it.

#### Syntax slides

Slide 1 — **Step 1, Writing a Class**
- Story link: "Every single one of them breathes. Every one of them moves. And every one of them eats.", Dr. Priya
- Explanation: Just like Dr. Priya opened her notebook and wrote the heading 'Animal' to group the lion, eagle, and dolphin, programmers use the keyword 'class' to create a group. 'class Animal:' is the heading of our digital notebook.
Code:
```
class Animal:
    pass  # shared traits go inside here
```

Slide 2 — **Step 2, Adding the Shared Traits**
- Story link: Priya's journal lists three traits every animal has: breathe, move, eat.
- Explanation: Dr. Priya noticed they all breathe, move, and eat. In Python, we define these shared actions using 'def' (short for define). Inside our Animal class, we define breathe, move, and eat so every animal in this group automatically knows how to do them.
Code:
```
class Animal:
    def breathe(self):
        print("breathing...")

    def move(self):
        print("moving...")

    def eat(self):
        print("eating...")
```

Slide 3 — **Step 3, Using the Animal Class**
- Story link: Any animal Priya observes, lion, eagle, dolphin, gets all the shared traits automatically.
- Explanation: Because we defined those actions in the Animal class, the moment we spot a lion and tell Python it is an Animal, it automatically knows how to breathe, move, and eat. The shared pattern works!
Code:
```
lion = Animal()
lion.breathe() # breathing...
lion.move() # moving...
lion.eat() # eating...
```

### Act 2 · “The Eagle's Secret”  (Arc 1 · Foundations)

- **Concept discovered:** child class / is-a relationship

#### Observation step (multiple choice, must pick the correct option to continue)

Prompt: `Priya circles the eagle in her journal.`

Question: **How is the eagle related to the Animal group?**

· Option 0: It is completely different from every animal
✅ **Option 1: It shares all the animal traits and adds flying** (CORRECT)
· Option 2: It only has its flying ability and nothing else

Hint (shown on wrong pick): Look at both parts of the eagle entry: the shared foundation AND the unique ability.

- **Expected insight:** Learner articulates the extension relationship: eagle = shared animal foundation + something uniquely its own (is-a pattern with specialization)

#### Transfer scenario (multiple choice, full screen, Continue unlocks only on a correct pick)

**Scenario — “The Racing Car”**
Back at the workshop, Priya looks at her vehicle notes again. The Racing Car has wheels, carries people, and needs energy, exactly like every vehicle. But it also has a nitro boost that no other vehicle on the list has.

**Question:** Using your understanding, how does the Racing Car build on top of the shared vehicle pattern? What does it keep, and what does it add?

· Option 0: It keeps nothing from the shared vehicle pattern
✅ **Option 1: It keeps wheels, carrying, and energy, and adds a nitro boost** (CORRECT)
· Option 2: It replaces the vehicle pattern completely

Hint (shown on wrong pick): The racing car is still a vehicle first, then it adds something special.

#### MCQs (3 Quick Check questions, full screen, one at a time — correct option highlighted)

Quick Check 1 — Question: **Because the Eagle shares all traits of an Animal but adds flying, we can say that the Eagle...**

· Option 0: is NOT an Animal.
✅ **Option 1: is a specialization of an Animal.** (CORRECT)
· Option 2: replaces the Animal entirely.

Hint (shown on wrong pick): The eagle builds on top of the Animal foundation. It's a specific type of Animal.

Quick Check 2 — Question: **What does the eagle get from the Animal group automatically?**

· Option 0: The ability to fly
✅ **Option 1: Breathing, moving, and eating** (CORRECT)
· Option 2: A new habitat

Hint (shown on wrong pick): The things every single animal can do.

Quick Check 3 — Question: **Saying the eagle is a specialized Animal means...**

✅ **Option 0: The eagle is an Animal plus something extra** (CORRECT)
· Option 1: The eagle is not an Animal at all
· Option 2: The eagle only flies and has nothing else

Hint (shown on wrong pick): Think about the eagle two parts: the shared foundation and its own ability.

#### Summary panel (a ready-made summary is auto-built from these points and saved to the learner’s Notes — the learner just presses Continue)

- A child keeps every trait of the shared group automatically.
- Then it adds its own special ability on top.
- In Python, class Eagle(Animal): says “Eagle IS-A Animal”.

#### Story bridge (dialogue only)

- **priya:** Excellent. The eagle IS an animal, it has the full foundation. And it can fly, that extra ability is its own.
- **pip:** Hoo! Programmers call this a child class! Eagle is the child. Animal is the parent. Child gets everything from parent!
- **priya:** In Python, we write this with just one small thing, Animal in parentheses. That one addition connects Eagle to everything it inherits. Watch.

#### Syntax slides

Slide 1 — **Step 1, Eagle IS-A Animal**
- Story link: "The eagle has everything a general animal has... and then something that belongs only to it.", Dr. Priya
- Explanation: Dr. Priya observed that the eagle has everything an animal has. In Python, we put '(Animal)' right next to 'Eagle' to tell the program exactly what Priya saw: The Eagle is a child of the Animal group, and inherits all its traits.
Code:
```
class Animal:
    def breathe(self):
        ...

    def move(self):
        ...

    def eat(self):
        ...


class Eagle(Animal):  # Eagle IS-A Animal
```

Slide 2 — **Step 2, Eagle Adds Flying**
- Story link: "It flies. The lion doesn't. The dolphin doesn't.", Dr. Priya
- Explanation: Priya didn't write down 'breathes' again for the eagle, she only wrote what makes it special. Python does the same. Inside the Eagle class, we only define 'fly()'. It gets breathe, move, and eat automatically.
Code:
```
class Eagle(Animal):
    def fly(self):
        print("soaring high!")

# Eagle gets from Animal, for free:
# breathe(), move(), eat()
# Eagle adds its own:
# fly()
```

Slide 3 — **Step 3, Eagle Gets Animal's Traits for Free**
- Story link: The eagle never had to learn to breathe, it got that from the Animal group automatically.
- Explanation: Just as the eagle naturally knows how to breathe without learning it, our Python eagle object can use 'eagle.breathe()' even though we only wrote 'fly()'. It inherited the basic traits from the Animal class.
Code:
```
eagle = Eagle()
eagle.breathe() # from Animal ← inherited!
eagle.move() # from Animal ← inherited!
eagle.fly() # Eagle's own ← defined here
```

### Act 3 · “The Word”  (Arc 1 · Foundations)

- **Concept discovered:** the name: Inheritance

#### Observation step (multiple choice, must pick the correct option to continue)

Prompt: `The word hangs in the air. Priya looks at you.`

Question: **Pick the real-world pair that matches the pattern from the story.**

· Option 0: A book and a library shelf
✅ **Option 1: A smartphone, which is a phone with an added touchscreen** (CORRECT)
· Option 2: A lamp and a light bulb

Hint (shown on wrong pick): One thing must inherit everything from another type, then add its own new thing.

- **Expected insight:** Learner can transfer the pattern to a new domain, showing they understand the concept, not just memorized the story

#### Transfer scenario (multiple choice, full screen, Continue unlocks only on a correct pick)

**Scenario — “Phone and Smartphone”**
The next day, Priya finds a simpler example in her pocket. Her old Mobile phone can call, message, and play music. Her new Smartphone can do ALL of that too, and it also has a touchscreen.

**Question:** The Mobile does everything, and the Smartphone does that PLUS adds a touchscreen. What do we call this pattern, in your own words?

· Option 0: It is called skipping, the phone skips its old features
✅ **Option 1: It is inheritance: the smartphone gets everything from the phone and adds its own touchscreen** (CORRECT)
· Option 2: It is copying: the smartphone copies exactly the same features with nothing new

Hint (shown on wrong pick): The pattern got its official name when you used it on a phone pair.

#### MCQs (3 Quick Check questions, full screen, one at a time — correct option highlighted)

Quick Check 1 — Question: **Which of the following is the best real-world example of Inheritance?**

· Option 0: A steering wheel being part of a Car.
✅ **Option 1: A Smartphone inheriting from a general Phone, but adding a touchscreen.** (CORRECT)
· Option 2: A Dog chasing a Cat.

Hint (shown on wrong pick): Look for a relationship where one thing IS A type of another thing, just with more features.

Quick Check 2 — Question: **Animal is the parent and Eagle is the child. Which phrase best describes their relationship?**

· Option 0: They are the same thing
✅ **Option 1: The child receives the parent traits and adds its own** (CORRECT)
· Option 2: The child throws away the parent traits

Hint (shown on wrong pick): Remember the family vocabulary.

Quick Check 3 — Question: **When one type automatically receives all the traits of another and adds its own, what is this called?**

✅ **Option 0: Inheritance** (CORRECT)
· Option 1: Assembly
· Option 2: Isolation

Hint (shown on wrong pick): The single word written in large letters across the page.

#### Summary panel (a ready-made summary is auto-built from these points and saved to the learner’s Notes — the learner just presses Continue)

- When one type automatically receives all the traits of another and adds its own, it is called Inheritance.
- Animal is the parent, Eagle is the child.
- Parent = shared foundation. Child = foundation + its own additions.

#### Story bridge (dialogue only)

- **priya:** You found your own example of inheritance. That means you genuinely understand the pattern, not just the story.
- **pip:** Hoo! Now let's see the full Python picture, with all the right vocabulary!
- **priya:** Parent class. Child class. Inherit. These are the exact words Python uses for everything you have been describing. Let me show you all of it together.

#### Syntax slides

Slide 1 — **Step 1, Parent and Child**
- Story link: Animal is the general group. Eagle is the specific type that builds on it.
- Explanation: The story called this a general group and a specific member. Python uses family names. 'Animal' is the Parent class holding the foundation. 'Eagle' is the Child class that inherits the foundation.
Code:
```
class Animal:  # parent class
    def breathe(self):
        ...


class Eagle(Animal):  # child class
    def fly(self):
        ...
```

Slide 2 — **Step 2, Reading the One Line**
- Story link: "When one type automatically receives all the traits of another, we call this Inheritance.", Dr. Priya
- Explanation: When you read 'class Eagle(Animal):', imagine Dr. Priya drawing an arrow from the Eagle to the Animal group. The parentheses mean 'I inherit from this'. The child gets the parent's traits, and adds its own.
Code:
```
class Eagle(Animal):
# ^ ^
# child parent
#
# Eagle inherits: breathe(), move(), eat()
# Eagle adds own: fly()
```

Slide 3 — **Step 3, The Full Picture**
- Story link: You already understood this from the story. The code just writes it down.
- Explanation: This is the full translation of Dr. Priya's journal into code. The parent class defines the common ground, and the child class inherits it and adds its unique abilities. Look closely at how they connect.
Code:
```
class Animal:  # parent, holds shared traits
    def breathe(self):
        print("breathing...")

    def move(self):
        print("moving...")

    def eat(self):
        print("eating...")


class Eagle(Animal):  # child, inherits + adds
    def fly(self):
        print("soaring high!")
```

### Act 4 · “First Code”  (Arc 1 · Foundations)

- **Concept discovered:** class Eagle(Animal): in Python

- **No observation step** (`observationPrompt` is null) — the act goes straight to the MCQ, then summary.

#### MCQs (3 Quick Check questions, full screen, one at a time — correct option highlighted)

Quick Check 1 — Question: **In the relationship between Animal and Eagle, which one is considered the 'Parent' class?**

· Option 0: Eagle
✅ **Option 1: Animal** (CORRECT)
· Option 2: Both are Parents

Hint (shown on wrong pick): The Parent class is the general one that passes its traits down.

Quick Check 2 — Question: **Which line of code makes the Eagle inherit from Animal?**

✅ **Option 0: class Eagle(Animal):** (CORRECT)
· Option 1: class Animal(Eagle):
· Option 2: eagle = Animal()

Hint (shown on wrong pick): Look at the parentheses right after the class name.

Quick Check 3 — Question: **After class Eagle(Animal):, can the eagle object use eagle.breathe()?**

· Option 0: No, that method is lost
✅ **Option 1: Yes, it inherited breathe() from Animal** (CORRECT)
· Option 2: Only if we rewrite breathe() inside Eagle

Hint (shown on wrong pick): Inheritance sends the traits down automatically.

#### Summary panel (a ready-made summary is auto-built from these points and saved to the learner’s Notes — the learner just presses Continue)

- class Eagle(Animal): means Eagle is a specialization of Animal.
- The parent class holds the shared traits.
- The eagle automatically gets everything Animal defines, and adds its own fly().

#### Story bridge (dialogue only)

- **priya:** You've done it. You saw that lion, eagle, dolphin all breathe, move, and eat, and the eagle builds on top of that foundation with flying. Now let me show you something remarkable.
- **pip:** Hoo! Programmers noticed this exact same pattern long before you picked up this journal, Doctor!
- **priya:** In Python, a group of shared traits is called a class. And when one type extends another, like Eagle extends Animal, Python has a precise way of writing that relationship. Let's build it together, piece by piece.

#### Syntax slides

Slide 1 — **Step 1, Writing the Shared Traits**
- Story link: "Every single one of them breathes. Every one of them moves. And every one of them eats.", Dr. Priya
- Explanation: We start exactly how Priya started her journal, by defining the general Animal group. This class acts as the foundation that every animal will build upon.
Code:
```
class Animal:
    def breathe(self):
        print("breathing...")

    def move(self):
        print("moving...")

    def eat(self):
        print("eating...")
```

Slide 2 — **Step 2, Eagle Joins the Group**
- Story link: "The eagle has everything a general animal has... and then something that belongs only to it.", Dr. Priya
- Explanation: By putting '(Animal)' after Eagle, we tell Python what Priya saw: The Eagle is an Animal, and it gets all those foundational traits automatically without rewriting them.
Code:
```
class Animal:
    def breathe(self):
        ...

    def move(self):
        ...

    def eat(self):
        ...


class Eagle(Animal):  # Eagle IS-A Animal
    def fly(self):
        print("soaring high!")
```

Slide 3 — **Step 3, See It Work**
- Story link: "The eagle never had to learn to breathe, it got that from the Animal group automatically."
- Explanation: Even though we never wrote a breathe action inside the Eagle class, Python checks the Animal parent class and finds it there. The eagle inherited it perfectly.
Code:
```
eagle = Eagle()
eagle.breathe() # inherited from Animal ✓
eagle.move() # inherited from Animal ✓
eagle.fly() # Eagle's own ability ✓
```

#### Fill-in-the-blank code

File: inheritance_basics.py
Template:
```
class Animal:
    def breathe(self):
        print("breathing...")

    def move(self):
        print("moving...")

    def eat(self):
        print("eating...")


class Eagle(____):  # Eagle is-a Animal
    def fly(self):
        print("soaring high!")


eagle = Eagle()
eagle.breathe()  # inherited from Animal ✓
eagle.fly()      # Eagle's own ability ✓
```
Blanks (the exact answers the learner must type):
- 1. placeholder `????` → answer = **`Animal`**  (hint: What group does the Eagle get its shared traits from?)

Explanation shown after solving: class Eagle(Animal): tells Python that Eagle is a specialization of Animal. Eagle automatically gets breathe(), move(), and eat(), just like you described.

#### “Now You Write the Code” — what must be present to pass

Title: Now Try, You Write the Code
Instructions: Write the complete file yourself: define the Animal class with breathe(), move(), and eat(); then define class Eagle(Animal) with fly(); then create an eagle object and call eagle.breathe() and eagle.fly() like in the slides.

**The learner’s code PASSES when it contains ALL of these exact strings:**
- `class Animal`
- `class Eagle(Animal)`
- `def fly`
- `eagle.breathe`
- `eagle.fly`

Model/ideal answer:
```
class Animal:
    def breathe(self):
        print("breathing...")

    def move(self):
        print("moving...")

    def eat(self):
        print("eating...")


class Eagle(Animal):
    def fly(self):
        print("soaring high!")


eagle = Eagle()
eagle.breathe()
eagle.fly()
```

### Act 5 · “The Copycat Problem”  (Arc 2 · Behavior)

- **Concept discovered:** method overriding

#### Observation step (multiple choice, must pick the correct option to continue)

Prompt: `Priya underlines 'eat' in her notes twice.`

Question: **What is the chameleon really doing when it eats with its tongue?**

· Option 0: Adding a completely new behaviour no animal has
✅ **Option 1: Taking the existing eating behaviour and doing it in its own way** (CORRECT)
· Option 2: Forgetting how to eat

Hint (shown on wrong pick): Eating already existed. The chameleon only changed HOW it eats.

- **Expected insight:** Learner understands that the chameleon replaces/specializes an inherited behaviour rather than adding something new, the concept of overriding without the word

#### Transfer scenario (multiple choice, full screen, Continue unlocks only on a correct pick)

**Scenario — “The Penguin's Move”**
Priya watches a penguin at the new exhibit. Penguins are birds, they all have beaks and feathers. But a penguin cannot fly through the air. Instead of flying, it swims through the water, gliding fast with its flippers.

**Question:** The penguin's “move” behaviour looks different from a normal bird. Is the penguin inventing a brand new behaviour, or doing the bird behaviour in its own unique way?

· Option 0: A brand new behaviour invented by the penguin
✅ **Option 1: The bird behaviour done in the penguin own unique way** (CORRECT)
· Option 2: The penguin stops being a bird

Hint (shown on wrong pick): The penguin is still doing the move behaviour, just differently.

#### MCQs (3 Quick Check questions, full screen, one at a time — correct option highlighted)

Quick Check 1 — Question: **When the Chameleon 'eats' differently than a normal Animal, what is it doing to the inherited behavior?**

· Option 0: Deleting it from the parent.
✅ **Option 1: Overriding it with its own custom version.** (CORRECT)
· Option 2: Ignoring it completely.

Hint (shown on wrong pick): The original still exists for other animals, but the Chameleon chooses to use its own version.

Quick Check 2 — Question: **When the chameleon overrides eat(), what happens to the Animal version?**

· Option 0: It disappears forever
✅ **Option 1: It still works for other animals like the lion** (CORRECT)
· Option 2: It gets deleted from the class

Hint (shown on wrong pick): Only the chameleon changed.

Quick Check 3 — Question: **How does Python know the chameleon has its own eat()?**

✅ **Option 0: Because the method has the same name as the parent inside the child class** (CORRECT)
· Option 1: Because the method has a random name
· Option 2: Because you must call something called override

Hint (shown on wrong pick): Same name in the child means override.

#### Summary panel (a ready-made summary is auto-built from these points and saved to the learner’s Notes — the learner just presses Continue)

- The chameleon did not invent eating, it replaced the inherited way with its own version.
- Same method name in the child, different behaviour = overriding.
- The parent's version stays for everyone else.

#### Story bridge (dialogue only)

- **priya:** You saw it. The chameleon isn't inventing something new, eating already existed. It takes that inherited behaviour and replaces it with its own version.
- **pip:** Hoo! Programmers call this overriding! When a child class does a parent's action in its own way, it overrides it!
- **priya:** The key is: eating still works normally for the lion and the dolphin. Only the chameleon's version is different. Let me show you how Python writes this, step by step.

#### Syntax slides

Slide 1 — **Step 1, What Animal Inherits**
- Story link: "Every animal eats. Open mouth, chew, swallow. That's the general pattern.", Dr. Priya
- Explanation: The Animal class already defines a basic 'eat' action. If the Chameleon just inherits this, it will eat like a standard animal, which Priya knows is wrong.
Code:
```
class Animal:
    def eat(self):
        print("opens mouth and swallows")


class Chameleon(Animal):
    pass  # gets Animal's eat() for now
```

Slide 2 — **Step 2, The Chameleon's Own Version**
- Story link: "Its tongue shoots out three times the length of its body... the chameleon never moved its feet.", Narrator
- Explanation: Priya noted the chameleon catches flies with its tongue. To tell Python to use this new way, we write 'def eat(self)' again inside the Chameleon class. Because it has the exact same name, it overrides the parent's version.
Code:
```
class Animal:
    def eat(self):
        print("opens mouth and swallows")


class Chameleon(Animal):
    def eat(self):  # same name = overrides!
        print("tongue-flick! catches fly in 0.07 seconds")
```

Slide 3 — **Step 3, Who Gets Which eat()?**
- Story link: "The original still works for other animals, but the chameleon uses its own version."
- Explanation: The original animal eating method didn't disappear, lions and dolphins still use it. But when a Chameleon eats, Python sees its custom 'eat()' method and uses that instead. The chameleon overrode the default!
Code:
```
c = Chameleon()
c.eat()  # → tongue-flick! (Chameleon's version)

a = Animal()
a.eat()  # → opens mouth and swallows (Animal's still works)
```

#### Fill-in-the-blank code

File: overriding.py
Template:
```
class Animal:
    def eat(self):
        print("opens mouth and swallows")


class Chameleon(Animal):
    def eat(self):  # This ____ the parent's eat()
        print("tongue-flick! catches fly in 0.07 seconds")


c = Chameleon()
c.eat()  # Which eat() runs?
```
Blanks (the exact answers the learner must type):
- 1. placeholder `????` → answer = **`overrides`**  (hint: The chameleon's eat() replaces the Animal's eat(). In programming, this is called ____ing.)

Explanation shown after solving: When a child class defines a method with the same name as a parent's method, it overrides it. The child's version runs instead.

#### “Now You Write the Code” — what must be present to pass

Title: Now Try, You Write the Code
Instructions: Write the file yourself: class Animal with def eat(self) that prints the normal way, and class Chameleon(Animal) that overrides eat() with the tongue-flick version. Then create a chameleon and an animal, and call eat() on both to show each keeps its own version.

**The learner’s code PASSES when it contains ALL of these exact strings:**
- `class Animal`
- `class Chameleon(Animal)`
- `def eat`
- `tongue`
- `c.eat`

Model/ideal answer:
```
class Animal:
    def eat(self):
        print("opens mouth and swallows")


class Chameleon(Animal):
    def eat(self):
        print("tongue-flick! catches fly in 0.07 seconds")


c = Chameleon()
c.eat()
a = Animal()
a.eat()
```

### Act 6 · “Whisper Back to the Elder”  (Arc 2 · Behavior)

- **Concept discovered:** super()

#### Observation step (multiple choice, must pick the correct option to continue)

Prompt: `Priya draws two steps in her journal.`

Question: **How does the chameleon eat, from start to finish?**

· Option 0: It only does the tongue-flick and skips everything else
✅ **Option 1: It opens its mouth first, then does the tongue-flick** (CORRECT)
· Option 2: It never uses its mouth at all

Hint (shown on wrong pick): Two steps, in order: the normal mouth action first, then its own twist.

- **Expected insight:** Learner describes the pattern: first do the inherited behaviour, then layer your own on top, the concept behind super() without the word

#### Transfer scenario (multiple choice, full screen, Continue unlocks only on a correct pick)

**Scenario — “Grandma's Recipe”**
Priya writes down her grandmother's vada recipe. The base recipe says: “make the batter, then fry.” The family’s Special Vada does exactly those two steps first, and ONLY after that does it add its secret spice mix.

**Question:** The Special Vada does the normal recipe first, then layers its own twist on top. Using your understanding, how is this different from replacing the recipe completely? What are the two steps, in order?

· Option 0: It replaces the recipe completely and forgets the base steps
✅ **Option 1: It does the two base steps first, then adds the secret spice mix** (CORRECT)
· Option 2: It adds the spice first, then makes the batter

Hint (shown on wrong pick): Order matters: the base first, then the twist.

#### MCQs (3 Quick Check questions, full screen, one at a time — correct option highlighted)

Quick Check 1 — Question: **Why does the Chameleon use a 'call back' to the elder's behavior?**

· Option 0: To erase the parent's eating method.
✅ **Option 1: To reuse the parent's normal eating method first, before adding its own twist.** (CORRECT)
· Option 2: To become a super animal.

Hint (shown on wrong pick): It wants to keep the shared behavior, not throw it away.

Quick Check 2 — Question: **What does super() do in Python?**

· Option 0: It deletes the parent method
✅ **Option 1: It lets the child call the parent version of a method** (CORRECT)
· Option 2: It creates a brand new class

Hint (shown on wrong pick): Think of whispering back to the elder.

Quick Check 3 — Question: **Why does the chameleon eat() run super().eat() first?**

✅ **Option 0: To reuse the normal eating behaviour before adding the tongue-flick** (CORRECT)
· Option 1: To make the program slower
· Option 2: To erase Animal eat()

Hint (shown on wrong pick): Reuse before extend.

#### Summary panel (a ready-made summary is auto-built from these points and saved to the learner’s Notes — the learner just presses Continue)

- super() is the child whispering to the parent: “do your version first.”
- Then the child adds its own behaviour on top.
- Reuse the inherited behaviour, then extend it.

#### Story bridge (dialogue only)

- **priya:** You described it perfectly, first the foundation, then the twist. Two steps, in order. Not a replacement, an extension of what was inherited.
- **pip:** Hoo! Python has a special tool for exactly this, it's called super(). It lets the child say: do the parent's version first, then I'll add my own!
- **priya:** Think of super() as the chameleon whispering to its elder: 'I'll do what you do first, then I'll add my move.' Let me build it up step by step.

#### Syntax slides

Slide 1 — **Step 1, The Elder's Way**
- Story link: "Before the tongue-flick, it still opens its mouth. Like every animal does.", Dr. Priya
- Explanation: Priya noticed the chameleon still opens its mouth first, just like the elder animals. This basic action lives inside the parent Animal class.
Code:
```
class Animal:
    def eat(self):
        print("opens mouth...")
```

Slide 2 — **Step 2, Call the Elder, Then Extend**
- Story link: "It reuses the foundation it inherited... then extends it.", Dr. Priya
- Explanation: In Python, 'super()' is how the chameleon whispers to its elder. 'super().eat()' tells Python to run the parent's normal eating action first. Then, on the next line, we add the chameleon's special tongue-flick.
Code:
```
class Animal:
    def eat(self):
        print("opens mouth...")


class Chameleon(Animal):
    def eat(self):
        super().eat()  # Step 1: elder's way
        print("...THEN tongue-flick!")  # Step 2: own twist
```

Slide 3 — **Step 3, Both Steps Run**
- Story link: "It does the normal thing first... then adds its twist on top."
- Explanation: When the chameleon eats now, Python follows the two steps Priya drew: first it opens its mouth (the inherited elder way), and THEN it shoots its tongue (the child's extension). Reuse before extending!
Code:
```
c = Chameleon()
c.eat()
# Output:
# opens mouth... ← from Animal via super()
# ...THEN tongue-flick! ← Chameleon's own
```

#### Fill-in-the-blank code

File: super_call.py
Template:
```
class Animal:
    def eat(self):
        print("opens mouth...")


class Chameleon(Animal):
    def eat(self):
        ____().eat()  # Step 1: do what Animal does first
        print("...THEN tongue-flick!")  # Step 2: add own twist


c = Chameleon()
c.eat()
# Output:
# opens mouth...
# ...THEN tongue-flick!
```
Blanks (the exact answers the learner must type):
- 1. placeholder `????` → answer = **`super`**  (hint: This Python keyword lets a child class 'call back' to its parent's version of a method.)

Explanation shown after solving: super() is Python's way of saying 'call the parent class version of this method.' The chameleon uses super().eat() to run Animal's eat() first, then adds its own behaviour after, reuse before extend.

#### “Now You Write the Code” — what must be present to pass

Title: Now Try, You Write the Code
Instructions: Write the file yourself: class Animal with an eat() that prints “opens mouth...”, and class Chameleon(Animal) whose eat() calls super().eat() first and then prints the tongue-flick. Create a chameleon, call eat(), and show the two-line output.

**The learner’s code PASSES when it contains ALL of these exact strings:**
- `class Animal`
- `class Chameleon(Animal)`
- `super().eat()`
- `c.eat`

Model/ideal answer:
```
class Animal:
    def eat(self):
        print("opens mouth...")


class Chameleon(Animal):
    def eat(self):
        super().eat()
        print("...THEN tongue-flick!")


c = Chameleon()
c.eat()
```

### Act 7 · “Born Different”  (Arc 2 · Behavior)

- **Concept discovered:** __init__ / constructor inheritance

#### Observation step (multiple choice, must pick the correct option to continue)

Prompt: `Priya flips back to the eagle's first entry.`

Question: **When a new eagle is recorded, what is the correct order of fields?**

· Option 0: Wingspan first, then name and habitat
✅ **Option 1: Name and habitat first, then wingspan** (CORRECT)
· Option 2: The order does not matter at all

Hint (shown on wrong pick): Foundation fields first, the special one after.

- **Expected insight:** Learner sees that even initialization follows the inheritance pattern, the child's constructor should handle the parent's required fields first, then its own additions

#### Transfer scenario (multiple choice, full screen, Continue unlocks only on a correct pick)

**Scenario — “The Snow Leopard Entry”**
A rare snow leopard is found in the mountains. At the very moment it is discovered, Priya must log three things: its name, its habitat (like every animal), and its fur length (special to snow leopards).

**Question:** In what order should the fields be filled in, and why? Which fields come from the shared animal record, and which are the snow leopard's own?

✅ **Option 0: Fill name and habitat first from the shared animal record, then the fur length** (CORRECT)
· Option 1: Fill the fur length first, then name and habitat
· Option 2: Never fill the shared fields, only the special one

Hint (shown on wrong pick): Standard birth record first, special details after.

#### MCQs (3 Quick Check questions, full screen, one at a time — correct option highlighted)

Quick Check 1 — Question: **When creating a new eagle, why must we call the parent's initialization process before setting the wingspan?**

· Option 0: Because wingspan isn't important.
· Option 1: Because eagles are born first.
✅ **Option 2: Because the standard 'birth record' (name, habitat) must be created before adding custom fields.** (CORRECT)

Hint (shown on wrong pick): We build the foundation before we build the roof.

Quick Check 2 — Question: **What is the special Python birth record method called?**

✅ **Option 0: __init__** (CORRECT)
· Option 1: birth
· Option 2: setup

Hint (shown on wrong pick): It runs the very moment an object is created.

Quick Check 3 — Question: **In the eagle __init__, what must happen before setting self.wingspan?**

· Option 0: Nothing needs to happen
✅ **Option 1: Call super().__init__(name, habitat) to set up the standard fields** (CORRECT)
· Option 2: Delete the parent fields

Hint (shown on wrong pick): Foundation before the roof.

#### Summary panel (a ready-made summary is auto-built from these points and saved to the learner’s Notes — the learner just presses Continue)

- The child's __init__ must set up the parent's fields first.
- super().__init__() handles the shared “birth record.”
- Then the child adds its own fields. Foundation first, then extension.

#### Story bridge (dialogue only)

- **priya:** You got it, the eagle's birth record needs the standard fields first, then its own. Foundation before extension. The exact same pattern, applied to the very moment an object comes into existence.
- **pip:** Hoo! In Python, the 'birth record' is a special method called __init__. It runs the moment you create any object!
- **priya:** And just like Act 6, the child's __init__ calls super() to set up the parent's fields first, before adding its own. Let me show you, layer by layer.

#### Syntax slides

Slide 1 — **Step 1, The Standard Birth Record**
- Story link: "Every animal I log gets a name and a habitat the moment I record it.", Dr. Priya
- Explanation: Priya noticed every single animal gets a name and habitat immediately when recorded. In Python, this 'birth record' is the __init__ method. The Animal class sets up these standard fields first.
Code:
```
class Animal:
    def __init__(self, name, habitat):
        self.name = name
        self.habitat = habitat  # Every Animal needs name + habitat from the start


a = Animal("Leo", "savanna")
print(a.name)     # Leo
print(a.habitat)  # savanna
```

Slide 2 — **Step 2, Eagle's Extended Record**
- Story link: "The eagle needed an extra field right from the start, wingspan.", Dr. Priya
- Explanation: For the eagle, Priya needed to record wingspan right away. In Python, the Eagle's __init__ first calls super().__init__() to fill out the standard animal fields, and THEN adds the wingspan. Foundation first, then extension.
Code:
```
class Eagle(Animal):
    def __init__(self, name, habitat, wingspan):
        super().__init__(name, habitat)  # foundation first ✓
        self.wingspan = wingspan          # then Eagle's own ✓
```

Slide 3 — **Step 3, Creating an Eagle**
- Story link: "Name, habitat, wingspan, all three recorded in the very first entry."
- Explanation: Now, the moment a new Eagle is created in the program, it instantly gets its name and habitat (from the parent's setup) AND its wingspan (from its own setup). All three fields are ready perfectly on time.
Code:
```
e = Eagle("Eddie", "mountains", 2.1)
print(e.name) # Eddie ← from Animal
print(e.habitat) # mountains ← from Animal
print(e.wingspan) # 2.1 ← Eagle's own
```

#### Fill-in-the-blank code

File: constructor_inheritance.py
Template:
```
class Animal:
    def __init__(self, name, habitat):
        self.name = name
        self.habitat = habitat


class Eagle(Animal):
    def __init__(self, name, habitat, wingspan):
        ____.__init__(name, habitat)  # standard fields first
        self.wingspan = wingspan       # then Eagle's extra field


e = Eagle("Eddie", "mountains", 2.1)
print(e.name)      # Eddie ← from Animal
print(e.wingspan)  # 2.1 ← Eagle's own
```
Blanks (the exact answers the learner must type):
- 1. placeholder `????` → answer = **`super()`**  (hint: The same keyword from Act 6, call the parent's __init__ to handle the shared fields before adding your own.)

Explanation shown after solving: super().__init__() calls Animal's constructor to set up the shared fields (name, habitat) before Eagle adds its own (wingspan). The pattern is exactly the same as Act 6, call the elder's setup first, then extend.

#### “Now You Write the Code” — what must be present to pass

Title: Now Try, You Write the Code
Instructions: Write the file yourself: class Animal with __init__(self, name, habitat) that sets both fields, and class Eagle(Animal) whose __init__ calls super().__init__(name, habitat) before setting self.wingspan. Then create an eagle and print its name, habitat, and wingspan.

**The learner’s code PASSES when it contains ALL of these exact strings:**
- `class Animal`
- `class Eagle(Animal)`
- `super().__init__`
- `self.wingspan`
- `e = Eagle(`

Model/ideal answer:
```
class Animal:
    def __init__(self, name, habitat):
        self.name = name
        self.habitat = habitat


class Eagle(Animal):
    def __init__(self, name, habitat, wingspan):
        super().__init__(name, habitat)
        self.wingspan = wingspan


e = Eagle("Eddie", "mountains", 2.1)
print(e.name)
print(e.habitat)
print(e.wingspan)
```

### Act 8 · “The Family Tree Grows”  (Arc 3 · Family Trees)

- **Concept discovered:** multi-level inheritance

#### Observation step (multiple choice, must pick the correct option to continue)

Prompt: `Priya sketches a family tree.`

Question: **Why is Animal to Bird to Eagle better than connecting Eagle straight to Animal?**

· Option 0: Because birds are the only animals that eat
✅ **Option 1: So bird traits like feathers and laying eggs are written once in Bird, and both Eagle and Sparrow get them** (CORRECT)
· Option 2: Because Eagle no longer needs Animal traits

Hint (shown on wrong pick): Where should shared bird traits live so every bird gets them once?

- **Expected insight:** Learner understands multi-level inheritance: a child can inherit from a parent that itself is a child, automatically getting traits from all ancestors.

#### Transfer scenario (multiple choice, full screen, Continue unlocks only on a correct pick)

**Scenario — “The Electric Car”**
Priya is reorganizing the vehicle catalogue: Vehicle → Car → ElectricCar. The ElectricCar has wheels and a frame (from Vehicle), has a steering wheel and seats (from Car, its parent), and adds a battery and charging port (its own).

**Question:** Using your understanding of the family tree: what does the ElectricCar get from each level, Vehicle, the Car, and itself? Does it need to redefine wheels again? Why not?

· Option 0: It must redefine wheels again because each level is separate
✅ **Option 1: It gets wheels and frame from Vehicle, steering and seats from Car, and adds a battery and charging port itself** (CORRECT)
· Option 2: It gets nothing from the whole chain

Hint (shown on wrong pick): One set of traits per level, everything flows down the chain.

#### MCQs (3 Quick Check questions, full screen, one at a time — correct option highlighted)

Quick Check 1 — Question: **If Eagle inherits from Bird, and Bird inherits from Animal, what traits does Eagle automatically get?**

· Option 0: Only Bird's traits.
· Option 1: Only Animal's traits.
✅ **Option 2: Both Bird's and Animal's traits.** (CORRECT)

Hint (shown on wrong pick): Traits pass down through the whole chain.

Quick Check 2 — Question: **Where should the shared bird traits like feathers and laying eggs be written?**

· Option 0: Inside every single bird class
✅ **Option 1: Once inside the Bird class** (CORRECT)
· Option 2: Inside the Eagle class only

Hint (shown on wrong pick): Write once, reused everywhere.

Quick Check 3 — Question: **When the inheritance chain is longer than one step, what is it called?**

✅ **Option 0: Multi-level inheritance** (CORRECT)
· Option 1: Single inheritance
· Option 2: No inheritance

Hint (shown on wrong pick): The family tree has more than one level.

#### Summary panel (a ready-made summary is auto-built from these points and saved to the learner’s Notes — the learner just presses Continue)

- In multi-level inheritance, traits flow down the whole chain.
- Eagle inherits bird traits from Bird AND animal traits from Animal.
- No repetition, write shared traits once, higher up.

#### Story bridge (dialogue only)

- **priya:** You saw the power of the chain. Eagle and Sparrow both share bird-specific traits, write them once in Bird, and both get them automatically. No repetition.
- **pip:** Hoo! And Python passes the baton down the entire chain, Animal to Bird to Eagle, automatically!
- **priya:** Let me grow the family tree piece by piece in Python, starting from the very top and adding each layer, just like we'd sketch it in the field journal.

#### Syntax slides

Slide 1 — **Step 1, The Top: Animal**
- Story link: "Breathing, moving, eating, these are universal. Every creature in the reserve shares them.", Dr. Priya
- Explanation: Priya started her family tree at the very top: the Animal class. This holds universal traits like breathing that every single creature in the reserve shares.
Code:
```
class Animal:
    def breathe(self):
        print("breathing")
```

Slide 2 — **Step 2, The Middle Layer: Bird**
- Story link: "Birds have feathers, lay eggs, and have beaks. Not all animals have those, but all birds do.", Dr. Priya
- Explanation: Next, Priya added a middle layer. 'Bird' inherits all the universal Animal traits, but adds things specific to birds, like laying eggs. It's a child of Animal, but it's about to become a parent itself.
Code:
```
class Animal:
    def breathe(self):
        print("breathing")


class Bird(Animal):  # Bird IS-A Animal
    def lay_eggs(self):
        print("laying eggs")
```

Slide 3 — **Step 3, The Specialist: Eagle**
- Story link: "The eagle is really a specialized Bird, not just a direct specialization of Animal.", Dr. Priya
- Explanation: Finally, Priya placed the Eagle at the bottom. By inheriting from Bird, the Eagle gets the bird traits (laying eggs), AND the chain automatically passes down the Animal traits (breathing) too. Everything flows down.
Code:
```
class Animal:
    def breathe(self):
        print("breathing")


class Bird(Animal):
    def lay_eggs(self):
        print("laying eggs")


class Eagle(Bird):  # Eagle IS-A Bird IS-A Animal
    def soar(self):
        print("soaring")
```

Slide 4 — **Step 4, Everything Flows Down**
- Story link: "The eagle gets 'breathe' from Animal, 'feathers' from Bird, and adds 'sharp talons' itself.", Dr. Priya
- Explanation: The eagle object now has access to three levels of history. It breathes from its grandparent (Animal), lays eggs from its parent (Bird), and soars using its own unique ability. The family tree is complete.
Code:
```
e = Eagle()
e.breathe() # ← from Animal (2 levels up!)
e.lay_eggs() # ← from Bird (1 level up)
e.soar() # ← Eagle's own
```

#### Fill-in-the-blank code

File: multilevel.py
Template:
```
class Animal:
    def breathe(self):
        print("breathing")


class Bird(____):
    def lay_eggs(self):
        print("laying eggs")


class Eagle(Bird):
    def soar(self):
        print("soaring")


e = Eagle()
e.breathe()   # from Animal
e.lay_eggs()  # from Bird
```
Blanks (the exact answers the learner must type):
- 1. placeholder `????` → answer = **`Animal`**  (hint: What does Bird inherit from in the chain?)

Explanation shown after solving: In multi-level inheritance, a class inherits from another derived class. Eagle gets methods from both Bird and Animal automatically.

#### “Now You Write the Code” — what must be present to pass

Title: Now Try, You Write the Code
Instructions: Write the file yourself: class Animal with breathe(), class Bird(Animal) with lay_eggs(), and class Eagle(Bird) with soar(). Then create an eagle and call breathe(), lay_eggs(), and soar() to show the whole chain working.

**The learner’s code PASSES when it contains ALL of these exact strings:**
- `class Animal`
- `class Bird(Animal)`
- `class Eagle(Bird)`
- `e.lay_eggs`
- `e.soar`

Model/ideal answer:
```
class Animal:
    def breathe(self):
        print("breathing")


class Bird(Animal):
    def lay_eggs(self):
        print("laying eggs")


class Eagle(Bird):
    def soar(self):
        print("soaring")


e = Eagle()
e.breathe()
e.lay_eggs()
e.soar()
```

## 3) Polymorphism Saga — Questions & Correct Answers (polymorphism.json)

Saga id: `polymorphism`  ·  Arc 1: Many Forms

### Act 1 · “The Same Request”  (Arc 1 · Many Forms)

- **Concept discovered:** same action / different behavior

#### Observation step (multiple choice, must pick the correct option to continue)

Prompt: `Priya writes three words in her journal: 'same request, different response.'`

Question: **Why did the dog, cat, and bird each answer differently to the same request?**

· Option 0: Because the request was different for each
✅ **Option 1: Because each object responds to the same request in its own way** (CORRECT)
· Option 2: Because the animals copied each other

Hint (shown on wrong pick): Same request, different objects, different responses.

- **Expected insight:** Learner recognizes that the same action or request can produce different behavior depending on the object.

#### Transfer scenario (multiple choice, full screen, Continue unlocks only on a correct pick)

**Scenario — “The Same Instruction”**
In art class, a teacher gives one instruction to three children: “draw a line.” Priya watches, the child with a pencil draws a thin grey line, the child with a pen draws a thin blue line, and the child with a crayon draws a thick red line.

**Question:** The instruction was the same for all three, but the result was different. Using your understanding, why did the same instruction produce different results?

✅ **Option 0: Because each child tool drew differently, even though the instruction was the same** (CORRECT)
· Option 1: Because the teacher gave three different instructions
· Option 2: The results were actually identical

Hint (shown on wrong pick): The instruction was identical; the tool changed the outcome.

#### MCQs (3 Quick Check questions, full screen, one at a time — correct option highlighted)

Quick Check 1 — Question: **What pattern did Priya notice?**

· Option 0: Different requests always produce the same result.
✅ **Option 1: The same request can produce different behavior.** (CORRECT)
· Option 2: Animals must all behave identically.

Hint (shown on wrong pick): Think about what happened when Priya gave all three animals the same request.

Quick Check 2 — Question: **The dog barks, the cat meows, the bird chirps. What produced the different results?**

✅ **Option 0: The different objects that received the same request** (CORRECT)
· Option 1: The weather
· Option 2: The time of day

Hint (shown on wrong pick): Which animal did the request run on?

Quick Check 3 — Question: **If the same instruction can give different results, that means...**

✅ **Option 0: Different objects can behave differently to the same action** (CORRECT)
· Option 1: All objects must behave the same
· Option 2: Instructions are useless

Hint (shown on wrong pick): The request was identical, so the difference came from the objects.

#### Summary panel (a ready-made summary is auto-built from these points and saved to the learner’s Notes — the learner just presses Continue)

- One request was given to three different objects.
- Each object responded in its own way.
- Same action → different behavior.

#### Story bridge (dialogue only)

- **priya:** You saw the pattern, the same request, three completely different responses. The dog barked, the cat meowed, the bird chirped.
- **pip:** Hoo! Programmers noticed the same thing! Different objects can respond to the same kind of request, each in its own way!
- **priya:** In Python, each of these animals is its own type of object, its own class. And classes can hold their own version of an action. Let me show you how they are born as separate things.

#### Syntax slides

Slide 1 — **Step 1, Three Animals, Three Classes**
- Story link: Priya is observing three very different animals, a Dog, a Cat, and a Bird.
- Explanation: Each animal is its own type. In Python we create a type with the word 'class'. For now each class is just its own empty box, three separate kinds of object, waiting to be given their own actions.
Code:
```
class Dog:
    pass


class Cat:
    pass


class Bird:
    pass
```

Slide 2 — **Step 2, Objects of Many Forms**
- Story link: "I want each of you to make your sound.", Dr. Priya
- Explanation: From each class we can create actual objects, a specific dog, a specific cat, a specific bird. They are different kinds of objects, so later they can respond to the same request in different ways.
Code:
```
dog = Dog()
cat = Cat()
bird = Bird()
```

Slide 3 — **Step 3, The Same Request**
- Story link: "I gave exactly the same request... but each animal responded differently.", Dr. Priya
- Explanation: Priya's request was one thing, "make your sound." Whether the response is a bark, a meow, or a chirp depends on which object received the request. Different classes, different behavior.
Code:
```
dog # → bark "Woof!"
cat # → meow "Meow!"
bird # → chirp "Chirp!"
```

### Act 2 · “Different Voices”  (Arc 1 · Many Forms)

- **Concept discovered:** same method name / different implementation

#### Observation step (multiple choice, must pick the correct option to continue)

Prompt: `Priya draws three boxes in her journal: Dog, Cat, and Bird.`

Question: **What do the three classes share, and what is different?**

✅ **Option 0: They share the speak method name, but each has its own behaviour inside** (CORRECT)
· Option 1: They share nothing at all
· Option 2: They share the same behaviour inside every method

Hint (shown on wrong pick): Same name, different voice.

- **Expected insight:** Learner understands that different classes can provide their own implementation of the same method.

#### Transfer scenario (multiple choice, full screen, Continue unlocks only on a correct pick)

**Scenario — “The Reminder App”**
Priya opens a reminder app. The app can send a reminder by Email, by SMS, and by WhatsApp. All three have an action called sendReminder, but each one delivers the message in a different way.

**Question:** All three have the same method name, sendReminder, yet each works differently. Using your understanding, what is the same and what is different?

✅ **Option 0: They all share the sendReminder name, but each sends the message in its own way** (CORRECT)
· Option 1: They all share the exact same sending code
· Option 2: They have different method names

Hint (shown on wrong pick): Same action name, personal delivery.

#### MCQs (3 Quick Check questions, full screen, one at a time — correct option highlighted)

Quick Check 1 — Question: **If Dog, Cat, and Bird all have a speak() method, what can be different?**

· Option 0: The method name must always be different.
✅ **Option 1: The behavior inside the method can be different.** (CORRECT)
· Option 2: Only the Dog can have a speak() method.

Hint (shown on wrong pick): They can share the same action name while responding differently.

Quick Check 2 — Question: **Two classes define a method with the same name. What stays different?**

· Option 0: The method name
✅ **Option 1: The behaviour inside the method** (CORRECT)
· Option 2: The class keyword

Hint (shown on wrong pick): Same name, personal behaviour.

Quick Check 3 — Question: **When cat.speak() runs, which code prints?**

· Option 0: Dog speak()
✅ **Option 1: Cat speak()** (CORRECT)
· Option 2: Every speak() at once

Hint (shown on wrong pick): The object decides.

#### Summary panel (a ready-made summary is auto-built from these points and saved to the learner’s Notes — the learner just presses Continue)

- Different classes can use the SAME method name.
- Each class fills it with its own implementation.
- The name is shared, the behaviour inside is personal.

#### Story bridge (dialogue only)

- **priya:** You noticed it, every animal has a 'make a sound' behaviour, but each one carries it out in its own way. The dog barks, the cat meows, the bird chirps.
- **pip:** Hoo! In Python, every class can define a method, and two different classes can even use the same method name!
- **priya:** Exactly. In Python, different classes can define a method with the same name, and the behaviour inside each one can be completely different. Let me show you.

#### Syntax slides

Slide 1 — **Step 1, Same Method Name, Three Classes**
- Story link: "So the dog has its own sound, the cat has its own sound, and the bird has its own sound!", Pip
- Explanation: All three classes define a method with the SAME name, speak. Python is completely happy with this, because each class keeps its own personal copy.
Code:
```
class Dog:
    def speak(self):
        pass


class Cat:
    def speak(self):
        pass


class Bird:
    def speak(self):
        pass
```

Slide 2 — **Step 2, Different Voices Inside**
- Story link: "They can all have a speak behaviour, but the implementation can be different.", Dr. Priya
- Explanation: The method has the same name everywhere, but each class fills it with its own behavior. Dog prints 'Woof!', Cat prints 'Meow!', Bird prints 'Chirp!'.
Code:
```
class Dog:
    def speak(self):
        print("Woof!")


class Cat:
    def speak(self):
        print("Meow!")


class Bird:
    def speak(self):
        print("Chirp!")
```

Slide 3 — **Step 3, Each Object Uses Its Own**
- Story link: "Hoo! So the dog has its own sound, the cat has its own sound!", Pip
- Explanation: When we call speak() on a Dog object, Python runs Dog's version. On a Cat, Cat's version. Same method name, different result, decided by the object itself.
Code:
```
dog = Dog()
dog.speak()  # Woof!

cat = Cat()
cat.speak()  # Meow!
```

### Act 3 · “One Command”  (Arc 1 · Many Forms)

- **Concept discovered:** polymorphic method call

#### Observation step (multiple choice, must pick the correct option to continue)

Prompt: `Priya points at the animals and writes one command in her journal.`

Question: **When we call speak() on a dog and then a cat, what decides the result?**

✅ **Option 0: The object the method runs on** (CORRECT)
· Option 1: A random choice by Python
· Option 2: The number of animals in the journal

Hint (shown on wrong pick): Which animal did the command run on?

- **Expected insight:** Learner understands that the same method call can trigger different behavior depending on the object.

#### Transfer scenario (multiple choice, full screen, Continue unlocks only on a correct pick)

**Scenario — “The Media Player”**
Priya builds a tiny media player. She calls play() on an audio file, then on a video file, then on a live stream. Every time the command is exactly play(), but each file responds in its own way.

**Question:** The same play() call gives different results. What decides the result, the file object it runs on, or something else? Explain.

✅ **Option 0: The play() command is the same; the file object it runs on decides the result** (CORRECT)
· Option 1: Python guesses what the file wants
· Option 2: Every file must play in exactly the same way

Hint (shown on wrong pick): The command stayed the same, only the object changed.

#### MCQs (3 Quick Check questions, full screen, one at a time — correct option highlighted)

Quick Check 1 — Question: **What happens when we call speak() on different animal objects?**

· Option 0: Every animal must produce the same output.
✅ **Option 1: Each object can perform its own version of speak().** (CORRECT)
· Option 2: Python randomly chooses a method.

Hint (shown on wrong pick): The object determines which implementation of speak() is used.

Quick Check 2 — Question: **When the same method call runs differently on different objects, this behaviour is called...**

✅ **Option 0: Polymorphism** (CORRECT)
· Option 1: Copying
· Option 2: Guessing

Hint (shown on wrong pick): It means many forms, the word you will meet at the end.

Quick Check 3 — Question: **Can we write one command and use it on both a Dog object and a Cat object?**

· Option 0: No, we need two commands
✅ **Option 1: Yes, because both objects provide speak()** (CORRECT)
· Option 2: Only if the objects are the same class

Hint (shown on wrong pick): They both understand the same method name.

#### Summary panel (a ready-made summary is auto-built from these points and saved to the learner’s Notes — the learner just presses Continue)

- The same method call runs on different objects.
- Each object runs its own version of the method.
- The object decides which implementation runs.

#### Story bridge (dialogue only)

- **priya:** You saw it clearly. We give the same command, speak, and each object runs its own version of it.
- **pip:** Hoo! The object decides which implementation runs! Dog gets the woof, Cat gets the meow!
- **priya:** That's the heart of it: the same command, and the result depends on the object you send it to. Let me show you how Python writes it, step by step.

#### Syntax slides

Slide 1 — **Step 1, Different Animals**
- Story link: "The animals all respond to the same kind of request, making a sound, but each one has its own way of doing it.", Dr. Priya
- Explanation: Dog and Cat are separate classes, but both provide a speak() method, each with its own implementation.
Code:
```
class Dog:
    def speak(self):
        print("Woof!")


class Cat:
    def speak(self):
        print("Meow!")
```

Slide 2 — **Step 2, One Method Name**
- Story link: "If each animal understands speak(), maybe I don't need to give each animal a different instruction.", Dr. Priya
- Explanation: Both objects respond to the same method name, speak(). The command doesn't change; only the object we send it to changes.
Code:
```
dog = Dog()
cat = Cat()
dog.speak()
cat.speak()
```

Slide 3 — **Step 3, Different Results**
- Story link: "I gave exactly the same request... but each animal responded differently.", Dr. Priya
- Explanation: Because the objects belong to different classes, the same method name produces different behavior. This is polymorphism in action.
Code:
```
dog.speak() # Woof!
cat.speak() # Meow!
```

#### Fill-in-the-blank code

File: polymorphism_basics.py
Template:
```
class Dog:
    def speak(self):
        print("Woof!")


class Cat:
    def speak(self):
        print("Meow!")


dog = Dog()
cat = Cat()
dog.____()
cat.speak()
# Woof!
# Meow!
```
Blanks (the exact answers the learner must type):
- 1. placeholder `????` → answer = **`speak`**  (hint: What method do both Dog and Cat provide for making their sound?)

Explanation shown after solving: Dog and Cat both provide speak(), but each class implements it differently. The same method call can therefore produce different behavior, your first glimpse of polymorphism.

#### “Now You Write the Code” — what must be present to pass

Title: Now Try, You Write the Code
Instructions: Write the file yourself: class Dog with speak() printing “Woof!”, class Cat with speak() printing “Meow!”. Create a dog and a cat, then call speak() on both to show the same method name giving different results.

**The learner’s code PASSES when it contains ALL of these exact strings:**
- `class Dog`
- `class Cat`
- `def speak`
- `dog.speak`
- `cat.speak`

Model/ideal answer:
```
class Dog:
    def speak(self):
        print("Woof!")


class Cat:
    def speak(self):
        print("Meow!")


dog = Dog()
cat = Cat()
dog.speak()
cat.speak()
```

### Act 4 · “The Forest Loop”  (Arc 1 · Many Forms)

- **Concept discovered:** polymorphism in a loop

#### Observation step (multiple choice, must pick the correct option to continue)

Prompt: `Priya draws a list containing Dog, Cat, and Bird.`

Question: **What must every animal in the list provide so the loop can ask each one to speak?**

✅ **Option 0: The speak() behaviour** (CORRECT)
· Option 1: Its own private loop
· Option 2: Nothing at all

Hint (shown on wrong pick): The one common behaviour the loop needs.

- **Expected insight:** Learner understands that polymorphism allows common code to operate on different object types as long as they provide the expected behavior.

#### Transfer scenario (multiple choice, full screen, Continue unlocks only on a correct pick)

**Scenario — “The Zoo Loop”**
Priya places a Dog, a Cat, and a Bird into one list, then writes a single loop that asks each animal to make its sound. She never checks which animal is which.

**Question:** For that one loop to work with all three animals, what must every animal in the list provide?

✅ **Option 0: Each animal must provide a compatible behaviour the loop calls, like speak()** (CORRECT)
· Option 1: They must all be the exact same class
· Option 2: Nothing, the loop guesses

Hint (shown on wrong pick): One behaviour the loop can always use.

#### MCQs (3 Quick Check questions, full screen, one at a time — correct option highlighted)

Quick Check 1 — Question: **Why can one loop call speak() on Dog, Cat, and Bird?**

· Option 0: Because all objects are secretly the same class.
✅ **Option 1: Because each object provides a compatible speak() behavior.** (CORRECT)
· Option 2: Because Python ignores the class of the object.

Hint (shown on wrong pick): The loop only needs the objects to provide the behavior it wants to use.

Quick Check 2 — Question: **What happens when the loop calls speak() on each animal in one list?**

✅ **Option 0: Each animal runs its own version** (CORRECT)
· Option 1: The loop stops
· Option 2: Only the first animal speaks

Hint (shown on wrong pick): One loop, many voices.

Quick Check 3 — Question: **Why does the loop not need to know the type of each animal?**

✅ **Option 0: Because every animal already provides the speak() behaviour it needs** (CORRECT)
· Option 1: Because types do not exist
· Option 2: Because the loop is too small

Hint (shown on wrong pick): The loop only uses the shared behaviour.

#### Summary panel (a ready-made summary is auto-built from these points and saved to the learner’s Notes — the learner just presses Continue)

- Different objects can be kept in one collection.
- One loop can talk to all of them.
- Every object must provide the behaviour the loop expects.

#### Story bridge (dialogue only)

- **priya:** Now the beauty of it. Because every animal understands speak(), we can handle all of them together.
- **pip:** Hoo! One list, one loop, and speak() works for every single animal inside it!
- **priya:** The loop never needs to know whether the current creature is a Dog, a Cat, or a Bird. It just asks each one to speak.

#### Syntax slides

Slide 1 — **Step 1, Every Animal Understands**
- Story link: "Dog.speak(), Cat.speak(), Bird.speak()... I don't want to keep writing separate instructions.", Dr. Priya
- Explanation: Each class provides its own speak() method, so every animal can answer the same request. That shared behavior is what lets us treat them together.
Code:
```
class Dog:
    def speak(self):
        print("Woof!")


class Cat:
    def speak(self):
        print("Meow!")


class Bird:
    def speak(self):
        print("Chirp!")
```

Slide 2 — **Step 2, One List, Many Animals**
- Story link: "Hoo! What if you put all the animals together?", Pip
- Explanation: Different types of objects can be stored together in one list when they all provide the same behavior. The list doesn't care about their exact type.
Code:
```
animals = [Dog(), Cat(), Bird()]
```

Slide 3 — **Step 3, One Loop Asks Everyone**
- Story link: "Then I could ask every animal to speak using one instruction.", Dr. Priya
- Explanation: The loop doesn't need to check which animal it has. It simply asks the current object to speak(), and each one responds in its own way.
Code:
```
for animal in animals:
    animal.speak()
```

#### Fill-in-the-blank code

File: polymorphism_loop.py
Template:
```
class Dog:
    def speak(self):
        print("Woof!")


class Cat:
    def speak(self):
        print("Meow!")


class Bird:
    def speak(self):
        print("Chirp!")


animals = [Dog(), Cat(), Bird()]

for animal in animals:
    animal.____()

# Woof!
# Meow!
# Chirp!
```
Blanks (the exact answers the learner must type):
- 1. placeholder `????` → answer = **`speak`**  (hint: What common method can every animal in the list perform?)

Explanation shown after solving: Polymorphism lets one piece of code work with different object types. The loop calls speak() on each animal, and each one responds in its own way.

#### “Now You Write the Code” — what must be present to pass

Title: Now Try, You Write the Code
Instructions: Write the file yourself: classes Dog, Cat, and Bird each with speak(), a list containing one of each, and one loop that calls speak() on every animal.

**The learner’s code PASSES when it contains ALL of these exact strings:**
- `class Dog`
- `class Cat`
- `class Bird`
- `animals = [`
- `for animal in animals`

Model/ideal answer:
```
class Dog:
    def speak(self):
        print("Woof!")


class Cat:
    def speak(self):
        print("Meow!")


class Bird:
    def speak(self):
        print("Chirp!")


animals = [Dog(), Cat(), Bird()]

for animal in animals:
    animal.speak()
```

### Act 5 · “The Forest Grows”  (Arc 1 · Many Forms)

- **Concept discovered:** flexibility through polymorphism

#### Observation step (multiple choice, must pick the correct option to continue)

Prompt: `Priya circles the loop in her journal.`

Question: **What did Priya NOT have to do when adding the Lion?**

✅ **Option 0: Rewrite the loop** (CORRECT)
· Option 1: Create the Lion class
· Option 2: Give the Lion a sound

Hint (shown on wrong pick): The loop already knew what to do.

- **Expected insight:** Learner recognizes that polymorphism makes code extensible and reduces the need for type-specific logic.

#### Transfer scenario (multiple choice, full screen, Continue unlocks only on a correct pick)

**Scenario — “The New Payment”**
Priya's checkout app has a list of payment methods, Card, Cash, and Wallet, and one loop that calls pay() on each. The next day she adds a brand new method: UPI. She does not touch the loop at all, and it still works.

**Question:** How is adding UPI like adding the Lion to the zoo loop? What does this tell you about the flexibility polymorphism gives you?

✅ **Option 0: UPI joins without touching the loop, as long as it provides pay()** (CORRECT)
· Option 1: The loop must be rewritten for each new payment method
· Option 2: UPI cannot join the app at all

Hint (shown on wrong pick): Same story as the Lion joining the zoo loop.

#### MCQs (3 Quick Check questions, full screen, one at a time — correct option highlighted)

Quick Check 1 — Question: **What is one advantage of using polymorphism here?**

· Option 0: We need a separate loop for every animal.
✅ **Option 1: We can add new objects without changing the common loop.** (CORRECT)
· Option 2: Every animal must behave identically.

Hint (shown on wrong pick): Think about what happened when Priya added the Lion.

Quick Check 2 — Question: **Adding a new object that provides the expected behaviour means...**

✅ **Option 0: Old code keeps working with no changes** (CORRECT)
· Option 1: Every line must be rewritten
· Option 2: The program crashes

Hint (shown on wrong pick): That is the flexibility payoff.

Quick Check 3 — Question: **The Lion joined and the loop ran without changes. This shows polymorphism makes code...**

✅ **Option 0: Easy to extend** (CORRECT)
· Option 1: Harder to use
· Option 2: Frozen forever

Hint (shown on wrong pick): Think about adding things easily.

#### Summary panel (a ready-made summary is auto-built from these points and saved to the learner’s Notes — the learner just presses Continue)

- New objects can join without changing the existing loop.
- As long as they provide the expected behaviour, old code just works.
- This flexibility is the payoff of polymorphism.

#### Story bridge (dialogue only)

- **priya:** And this is the real payoff. When I added the Lion, nothing in the loop changed.
- **pip:** Hoo! The code that was already written just... kept working!
- **priya:** Exactly. That's what flexibility looks like, new objects join in as long as they provide the behaviour the code expects.

#### Syntax slides

Slide 1 — **Step 1, A New Voice Joins**
- Story link: "I've added a Lion. It can speak too, but its sound is a roar.", Dr. Priya
- Explanation: Lion provides the same speak() method, but with its own behavior. Nothing about Dog, Cat, or Bird changes.
Code:
```
class Lion:
    def speak(self):
        print("Roar!")
```

Slide 2 — **Step 2, The Lion Joins the List**
- Story link: Priya adds the Lion to the list. The same loop handles it automatically.
- Explanation: The Lion can join the existing collection of animals, no list-handling code needs to change.
Code:
```
animals = [Dog(), Cat(), Bird(), Lion()]
```

Slide 3 — **Step 3, The Loop Was Never Touched**
- Story link: "No. That's the beautiful part. The loop already knows what to do.", Dr. Priya
- Explanation: The existing loop works without knowing that Lion was added. Each animal speaks in its own way, including the brand new one.
Code:
```
for animal in animals:
    animal.speak()

# Woof!
# Meow!
# Chirp!
# Roar!
```

#### Fill-in-the-blank code

File: polymorphism_flexible.py
Template:
```
class Dog:
    def speak(self):
        print("Woof!")


class Cat:
    def speak(self):
        print("Meow!")


class Bird:
    def speak(self):
        print("Chirp!")


class Lion:
    def speak(self):
        print("Roar!")


animals = [Dog(), Cat(), Bird(), Lion()]

for animal in animals:
    animal.____()

# Woof!
# Meow!
# Chirp!
# Roar!
```
Blanks (the exact answers the learner must type):
- 1. placeholder `????` → answer = **`speak`**  (hint: The loop needs to call the common behaviour provided by every animal, including the new Lion.)

Explanation shown after solving: Polymorphism makes code easy to extend. Adding the Lion required no changes to the loop, new objects join in when they provide the expected behavior.

#### “Now You Write the Code” — what must be present to pass

Title: Now Try, You Write the Code
Instructions: Write the file yourself: classes Dog, Cat, Bird, and Lion each with speak(), one list with all four, and one loop calling speak(), proving the Lion joins in without touching the loop.

**The learner’s code PASSES when it contains ALL of these exact strings:**
- `class Lion`
- `animals = [`
- `for animal in animals`
- `Roar`

Model/ideal answer:
```
class Dog:
    def speak(self):
        print("Woof!")


class Cat:
    def speak(self):
        print("Meow!")


class Bird:
    def speak(self):
        print("Chirp!")


class Lion:
    def speak(self):
        print("Roar!")


animals = [Dog(), Cat(), Bird(), Lion()]

for animal in animals:
    animal.speak()
```

### Act 6 · “The Word”  (Arc 1 · Many Forms)

- **Concept discovered:** polymorphism

#### Observation step (multiple choice, must pick the correct option to continue)

Prompt: `Priya closes her journal and asks you to explain the pattern in your own words.`

Question: **In your own words, one action, many forms is called...**

✅ **Option 0: Polymorphism** (CORRECT)
· Option 1: Serialization
· Option 2: Repeating

Hint (shown on wrong pick): The single word Priya wrote across the finished page.

- **Expected insight:** Learner explains polymorphism as the ability to use a common interface or method with different object types that provide different implementations.

#### Transfer scenario (multiple choice, full screen, Continue unlocks only on a correct pick)

**Scenario — “The One Remote”**
At the station there is one TV remote. Priya points it at the TV, the AC, and the fan in turn, pressing the same POWER button each time. The TV turns on, the AC starts cooling, the fan starts spinning, three different responses to one button.

**Question:** In your own words, what is this pattern called, and why is it useful when new kinds of devices keep getting added?

✅ **Option 0: Polymorphism: one button, many different responses** (CORRECT)
· Option 1: A wiring problem
· Option 2: Three different buttons disguised as one

Hint (shown on wrong pick): One POWER button, many forms of response.

#### MCQs (3 Quick Check questions, full screen, one at a time — correct option highlighted)

Quick Check 1 — Question: **Which statement best describes polymorphism?**

· Option 0: One class can only have one behavior.
✅ **Option 1: The same method or interface can have different behavior for different objects.** (CORRECT)
· Option 2: Every object must use exactly the same implementation.

Hint (shown on wrong pick): Think: one action, many forms.

Quick Check 2 — Question: **Which sentence best defines polymorphism?**

✅ **Option 0: The same method or interface can behave differently for different objects** (CORRECT)
· Option 1: Every object must use identical code
· Option 2: One class may only have one method

Hint (shown on wrong pick): One action, many forms.

Quick Check 3 — Question: **Why is polymorphism useful when new kinds of devices keep getting added?**

✅ **Option 0: New objects join using the same interface without rewriting existing code** (CORRECT)
· Option 1: It makes the remote heavier
· Option 2: It stops new devices from working

Hint (shown on wrong pick): Remember the remote and the zoo loop.

#### Summary panel (a ready-made summary is auto-built from these points and saved to the learner’s Notes — the learner just presses Continue)

- Polymorphism = one action, many forms.
- Same interface, different behaviour depending on the object.
- New objects can join without rewriting existing code.

#### Story bridge (dialogue only)

- **priya:** One request. Many forms. Different objects, all answering the same command in their own way.
- **pip:** Hoo! That's POLYMORPHISM!
- **priya:** And now you've seen it with your own eyes, the same method call, producing different behavior depending on the object it runs on. Let me show you the whole pattern in Python.

#### Syntax slides

Slide 1 — **Step 1, Different Implementations**
- Story link: "Dog, Cat, Bird, Lion. Different animals. Different implementations.", Dr. Priya
- Explanation: Each animal provides its own implementation of speak(). The method name is shared; the behavior inside is personal.
Code:
```
class Dog:
    def speak(self):
        print("Woof!")


class Cat:
    def speak(self):
        print("Meow!")


class Bird:
    def speak(self):
        print("Chirp!")
```

Slide 2 — **Step 2, One Collection**
- Story link: "But I can ask all of them to perform the same action.", Dr. Priya
- Explanation: Different objects can be grouped together because they all provide speak(). Their difference is what makes the group interesting.
Code:
```
animals = [Dog(), Cat(), Bird()]
```

Slide 3 — **Step 3, One Common Command**
- Story link: "Hoo! One action... many forms!", Pip
- Explanation: The same speak() call produces a different result for each object. That is polymorphism: one interface, many forms.
Code:
```
for animal in animals:
    animal.speak()

# Woof!
# Meow!
# Chirp!
```

#### Fill-in-the-blank code

File: polymorphism_final.py
Template:
```
class Dog:
    def speak(self):
        print("Woof!")


class Cat:
    def speak(self):
        print("Meow!")


class Bird:
    def speak(self):
        print("Chirp!")


animals = [Dog(), Cat(), Bird()]

for animal in animals:
    animal.____()

# Woof!
# Meow!
# Chirp!
```
Blanks (the exact answers the learner must type):
- 1. placeholder `????` → answer = **`speak`**  (hint: What common method is used to ask every animal to make its sound?)

Explanation shown after solving: Polymorphism means that the same method call can produce different behavior depending on the object. Here, every animal responds to speak() in its own way.

#### “Now You Write the Code” — what must be present to pass

Title: Now Try, You Write the Code
Instructions: Write the file yourself to demonstrate polymorphism: classes Dog, Cat, and Bird with speak(), a shared list, and one loop. Then, in a short comment or print, name the pattern this demonstrates.

**The learner’s code PASSES when it contains ALL of these exact strings:**
- `class Dog`
- `class Cat`
- `class Bird`
- `for animal in animals`
- `polymorphism`

Model/ideal answer:
```
class Dog:
    def speak(self):
        print("Woof!")


class Cat:
    def speak(self):
        print("Meow!")


class Bird:
    def speak(self):
        print("Chirp!")


animals = [Dog(), Cat(), Bird()]

for animal in animals:
    animal.speak()

print("This is polymorphism: one action, many forms.")
```
