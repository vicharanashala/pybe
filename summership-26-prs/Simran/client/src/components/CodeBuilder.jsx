import { useState, useEffect } from "react";

// Each step shows the code built so far (dimmed) plus the new piece just
// added (highlighted), so nothing ever appears on screen without being
// introduced first — and by the last step, the full program is visible,
// built up in front of the learner instead of dropped on them all at once.
const STEPS = [
  {
    badge: "STEP 1 OF 9 · Starting from nothing",
    storyQuote: "Every bird in the forest is born a Bird first.",
    teach:
      "In Python, we describe \"a kind of thing\" using the word class. Bird is just the name we're giving this blueprint — nothing is inside it yet.",
    codeOld: "",
    codeNew: "class Bird:\n    pass",
  },
  {
    badge: "STEP 2 OF 9 · Giving Bird its first habit",
    storyQuote: "...it knows how to eat...",
    teach:
      "To give Bird an actual behavior, we write a method — a small block of instructions — using def. self just means \"this particular bird.\" print(...) is what happens when eat() runs. (We don't need pass anymore, now that there's real code inside.)",
    codeOld: "class Bird:",
    codeNew: '    def eat(self):\n        print("pecking at seeds")',
  },
  {
    badge: "STEP 3 OF 9 · A second habit, same pattern",
    storyQuote: "...sleep...",
    teach: "We add a second method exactly the same way — same pattern, new name.",
    codeOld: 'class Bird:\n    def eat(self):\n        print("pecking at seeds")',
    codeNew: '\n    def sleep(self):\n        print("resting on a branch")',
  },
  {
    badge: "STEP 4 OF 9 · Bird is complete",
    storyQuote:
      "The eagle chick... simply did what a Bird does — she flew, just like every Bird before her.",
    teach:
      "One more method, fly(). This is the one detail worth remembering — it's the exact method Penguin is going to change later.",
    codeOld:
      'class Bird:\n    def eat(self):\n        print("pecking at seeds")\n\n    def sleep(self):\n        print("resting on a branch")',
    codeNew: '\n    def fly(self):\n        print("gliding through the sky")',
  },
  {
    badge: "STEP 5 OF 9 · Eagle: reusing everything",
    storyQuote: "...she flew, just like every Bird before her.",
    teach:
      "Now we make Eagle. Writing class Eagle(Bird): means \"Eagle is a Bird\" — that one word in parentheses hands Eagle everything we just wrote: eat(), sleep(), fly(). pass just means \"nothing new to add here.\"",
    codeOld:
      'class Bird:\n    def eat(self):\n        print("pecking at seeds")\n\n    def sleep(self):\n        print("resting on a branch")\n\n    def fly(self):\n        print("gliding through the sky")',
    codeNew: "\n\n\nclass Eagle(Bird):\n    pass",
  },
  {
    badge: "STEP 6 OF 9 · Penguin: replacing one habit",
    storyQuote:
      "...he kept the Bird's other habits... but changed the flying part to suit his own life.",
    teach:
      "Penguin(Bird) still inherits everything too. But we write our own fly() inside Penguin — same name as Bird's fly(). Whenever a child writes its own version of a method, Python always uses the child's version instead of the parent's.",
    codeOld:
      'class Bird:\n    def eat(self):\n        print("pecking at seeds")\n\n    def sleep(self):\n        print("resting on a branch")\n\n    def fly(self):\n        print("gliding through the sky")\n\n\nclass Eagle(Bird):\n    pass',
    codeNew:
      '\n\n\nclass Penguin(Bird):\n    def fly(self):\n        print("diving and swimming instead")',
  },
  {
    badge: "STEP 7 OF 9 · Duck: adding something new",
    storyQuote:
      "...it added something special of its own — it could swim with ease while still flying when needed.",
    teach:
      "class Duck(Bird): again means \"Duck is a Bird\" — it gets eat(), sleep(), fly() too. But this time we also write one brand-new method Bird doesn't have at all.",
    codeOld:
      'class Bird:\n    def eat(self):\n        print("pecking at seeds")\n\n    def sleep(self):\n        print("resting on a branch")\n\n    def fly(self):\n        print("gliding through the sky")\n\n\nclass Eagle(Bird):\n    pass\n\n\nclass Penguin(Bird):\n    def fly(self):\n        print("diving and swimming instead")',
    codeNew:
      '\n\n\nclass Duck(Bird):\n    def swim(self):\n        print("swimming across the pond")',
  },
  {
    badge: "STEP 8 OF 9 · Sparrow: adding something new",
    storyQuote:
      "...she picked up a skill of her own that Bird never had: weaving twigs into a nest.",
    teach:
      "class Sparrow(Bird): follows the same pattern as Duck — every Bird habit, plus one brand-new method Bird never had.",
    codeOld:
      'class Bird:\n    def eat(self):\n        print("pecking at seeds")\n\n    def sleep(self):\n        print("resting on a branch")\n\n    def fly(self):\n        print("gliding through the sky")\n\n\nclass Eagle(Bird):\n    pass\n\n\nclass Penguin(Bird):\n    def fly(self):\n        print("diving and swimming instead")\n\n\nclass Duck(Bird):\n    def swim(self):\n        print("swimming across the pond")',
    codeNew:
      '\n\n\nclass Sparrow(Bird):\n    def build_nest(self):\n        print("weaving twigs into a nest")',
  },
  {
    badge: "STEP 9 OF 9 · Owl: building on top, not replacing",
    storyQuote:
      "...he rested on a branch just like every Bird does, and then added his own habit on top: staying alert to hunt through the night.",
    teach:
      "Owl also writes its own sleep() — but the first line inside it, super().sleep(), means \"first, run Bird's original sleep() exactly as it is.\" Only after that does Owl's own new line run.",
    codeOld:
      'class Bird:\n    def eat(self):\n        print("pecking at seeds")\n\n    def sleep(self):\n        print("resting on a branch")\n\n    def fly(self):\n        print("gliding through the sky")\n\n\nclass Eagle(Bird):\n    pass\n\n\nclass Penguin(Bird):\n    def fly(self):\n        print("diving and swimming instead")\n\n\nclass Duck(Bird):\n    def swim(self):\n        print("swimming across the pond")\n\n\nclass Sparrow(Bird):\n    def build_nest(self):\n        print("weaving twigs into a nest")',
    codeNew:
      '\n\n\nclass Owl(Bird):\n    def sleep(self):\n        super().sleep()\n        print("then staying alert to hunt at night")',
  },
];

export default function CodeBuilder({ onDone, onCodeProgress }) {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  useEffect(() => {
  const progress = Math.round(
    ((index + 1) / STEPS.length) * 100
  );

  onCodeProgress(progress);
}, [index, onCodeProgress]);

  function next() {
    if (isLast) onDone();
    else setIndex((i) => i + 1);
  }

  return (
    <div className="card">
      <p className="eyebrow">{step.badge}</p>
      <div className="story-quote-box">
        <p className="story-quote">"{step.storyQuote}"</p>
      </div>
      <p>{step.teach}</p>
      <pre className="code-block small">
        <code>
          {step.codeOld && <span className="code-old">{step.codeOld}</span>}
          {step.codeOld && "\n"}
          <span className="code-new">{step.codeNew}</span>
        </code>
      </pre>
      <button className="btn btn-primary" onClick={next}>
        {isLast ? "Try it myself" : "Next piece"}
      </button>
    </div>
  );
}