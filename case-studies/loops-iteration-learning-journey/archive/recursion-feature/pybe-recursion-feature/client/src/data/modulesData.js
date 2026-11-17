export const modulesData = {
  module1: {
    id: "module1",
    title: "Module 1: Case Study",
    description: "Finding Row Number in Dark Movie Theatre",
    totalBeats: 10,
    beats: [
      {
        beatNumber: 1,
        leftPane: {
          type: "image",
          src: "/assets/image-1.png"
        },
        rightPaneHtml: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Case Study on Recursion</h3><p style:" justify-content:center; align-item:center;">Finding Row Number in Dark Movie Theatre.</p>`
      },
      {
        beatNumber: 2,
        leftPane: {
          type: "image",
          src: "/assets/image-2.png"
        },
        rightPaneHtml: `<h3>Let's hear a story, before learning the concepts.</h3>
<p></p>
Raghav is watching a movie in a very large theater.
<p></p>
Suddenly, there is a complete power failure.

<br>
The theater becomes completely dark, and nothing is visible.
<p></p>
After a few moments, an announcement is made:
<br>
<z-announcement>
"Please remain seated. The emergency lights will turn on shortly."
</z-announcement>`
      },
      {
        beatNumber: 3,
        leftPane: {
          type: "image",
          src: "/assets/image-3.png"
        },
        rightPaneHtml: `While waiting, Raghav becomes curious.
<br>
<z-thinking>
"Which row am I sitting in?"
</z-thinking>
<p></p>
<z-question>
How can Raghav find out his row number?
</z-question>
<p></p>
Unfortunately, Raghav neither see anything nor leave his seat.
<br>
So he cannot :
<ul>
<li>walk up and count the rows himself (since it has been announced to stay seated).</li>
<li>just look from his seat and count (since it is pitch dark).</li>
</ul>`
      },
      {
        beatNumber: 4,
        leftPane: {
          type: "image",
          src: "/assets/image-4.png"
        },
        rightPaneHtml: `The only option Raghav has is to communicate with the person sitting directly in front of him.
<p></p>

So Raghav applies this strategy.
<br>
Raghav asks the person (Tarun) sitting directly in front of him:
<br>
<z-question>
    "What row are you sitting in?"
</z-question>
<p></p>
Tarun does not know his row number either!
<br>
So Tarun asks the person (Amrit) sitting directly in front of him the same question.
<p></p>
But Amrit also does not know his row number.
<br>
So Amrit asks the person sitting in front of him the same question.
<p></p>
This chain of asking questions continues.`
      },
      {
        beatNumber: 5,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Ponder</h3><p style:" justify-content:center; align-item:center;">Take a moment and think.</p>`
        },
        rightPaneHtml: `<z-ponder>
Will this chain of asking question ever stop?
</z-ponder>
<br>
<z-answer>
Yes
</z-answer>
<p></p>
<z-explanation>
When the question reaches the person sitting in the first, he reaches his hand forward to tap the next shoulder.
<br>
But he feels only empty air.
<br>
<p></p>
Because there is no person in front of him, he does not ask the question, and replies immediately : 
<br>
<z-reply>
"I am sitting in Row 1."
</z-reply>
</z-explanation>`
      },
      {
        beatNumber: 6,
        leftPane: {
          type: "image",
          src: "/assets/image-4.png"
        },
        rightPaneHtml: `This process continues and the question reaches the person sitting in the first row.
<p></p>
He turns back and reply :
<br>
<z-reply>
 "I am sitting in Row 1."
</z-reply>
<p></p>
The answer now starts travelling backwards.
<ul>
    <li>Row 1 tells Row 2, <b>"I am in Row 1."</b></li>
    <li>Row 2 says, <b>"Then I must be in Row 2,"</b> and tells Row 3.</li>
    <li>Row 3 says, <b>"Then I must be in Row 3,"</b> and tells Row 4.</li>
</ul>
<p></p>
This continues until Tarun turns back and says to Raghav:
<br>
<z-reply>
<b>"I am in Row 11."</b>
</z-reply>
<p></p>
Raghav immediately knows:
<br>
<z-click>
<b>"Then I must be in Row 12."</b>
</z-click>`
      },
      {
        beatNumber: 7,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Reflection</h3><p style:" justify-content:center; align-item:center;">Let's ponder over some question to see what happened.</p>`
        },
        rightPaneHtml: `<h4>Reflection 1 :</h4>
<z-question-card>
<z-question>
Every person in the theater — Raghav, Tarun, Amrit, and everyone before them — used the exact same approach to find their row number, no matter where they were sitting. What was that one approach?
</z-question>
<br>
<z-answer>
<ul>
<li>If a person already knew their row number (only true for the person in Row 1), they answered directly.</li>
<li>Otherwise, they asked the person in front of them, waited for the reply, and added 1 to it before answering.</li>
</ul>
</z-answer>
</z-question-card>`
      },
      {
        beatNumber: 8,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Reflection</h3><p style:" justify-content:center; align-item:center;">Let's ponder over some question to see what happened.</p>`
        },
        rightPaneHtml: `<h4>Reflection 2 :</h4>
<z-question-card>
<z-question>
he chain of questions didn't go on forever — it stopped somewhere. What made it stop?
</z-question>
<br>
<z-answer>
It stopped the moment the question reached Row 1, because there was no one sitting in front of him left to ask.
</z-answer>
</z-question-card>`
      },
      {
        beatNumber: 9,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Reflection</h3><p style:" justify-content:center; align-item:center;">Let's ponder over some question to see what happened.</p>`
        },
        rightPaneHtml: `<h4>Reflection 3 :</h4>
<z-question-card>
<z-question>
Notice that everyone except the person in Row 1 had to pause before answering. Why couldn't they answer immediately?
</z-question>
<br>
<z-answer>
Because their own row number depended on first knowing the row number of the person in front of them — they couldn't add 1 to a number they didn't have yet.
</z-answer>
</z-question-card>`
      },
      {
        beatNumber: 10,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Module 1 Completed</h3><p style:" justify-content:center; align-item:center;">Case Study on Recursion.</p>`
        },
        rightPaneHtml: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Congratulations!, You completed Module 1.</h3><p style:" justify-content:center; align-item:center;">You just saw the use of recursion in the case study.</p>`
      }
    ]
  },
  module2: {
    id: "module2",
    title: "Module 2: Recursion Concepts",
    description: "Key Concepts & Interactive MCQs",
    totalBeats: 12,
    beats: [
      {
        beatNumber: 1,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Learning Recursion</h3>`
        },
        rightPaneHtml: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Key Concepts of Recursion</h3>`
      },
      {
        beatNumber: 2,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Connecting to Case Study of Module 1</h3>`
        },
        rightPaneHtml: `In the previous story, every person followed exactly the same strategy to solve the problem.
<p></p>
This type of problem-solving approach has a name.
<p></p>
<h4>It is called <em>recursion</em>.</h4>`
      },
      {
        beatNumber: 3,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Meaning of Recursion</h3>`
        },
        rightPaneHtml: `<h4>What is Recursion?</h4>
<em>Recursion is a way of solving a problem by solving a smaller problem of the same kind.</em>
<p></p>
In programming, recursion is implemented by allowing a function to call itself.
<p></p>
Like in the story, Raghav asks Tarun, Tarun asks Amrit, and so on. 
<br>
In code, that "asking" looks like a function calling itself:
<br>
<b>Python Code:</b>
<pre><code class="language-python">
    def get_row_number():
        return get_row_number()
</code></pre>
<br>
The code is example of recursion, since <code>get_row_number()</code> is calling itself.`
      },
      {
        beatNumber: 4,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Stopping Condition</h3>`
        },
        rightPaneHtml: `<h4>Base Case : The Stopping Condition</h4>
In previous page, <code>get_row_number()</code> keeps calling itself forever.
<br>
We need a stopping point.
<p></p>
<br>
<b>In Case Study, can you recall when the chain of asking questions stopped?</b>
<br>
It stopped when the question reached the very last person — the one with no one in front of them.
<p></p>
This is what a base case is!
<br>
<b>Base Case :</b><i>The condition at which the function does not call itself again, and instead returns a value directly.</i>
<p></p>
In the Case Study, the person in Row 1 was the base case. 
<br>
When the question reached him, he did not ask anyone — he replied "Row 1" right away.
<p></p>
<br>
<b>Python Code:</b>
<pre><code class="language-python">
    def get_row_number():
        if is_anyone_sitting_infront_of_me == False:
            return 1
</code></pre>
Here, <code>is_anyone_sitting_infront_of_me == False</code> is the base case.
<br>
When the condition <code>is_anyone_sitting_infront_of_me</code> became <code>False</code>, then function returns 1.`
      },
      {
        beatNumber: 5,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Moving Closer to Stopping Condition</h3>`
        },
        rightPaneHtml: `<h4>Recursive Case : A Step towards Base Case</h4>
<b>In the Case Study, can you recall what made the chain of questions eventually reach Row 1?</b>
<br>
Every time a person asked the question, it moved one step closer to the front — closer to the base case.
<br>
<i>This is what a <b>recursive case</b> is.</i>
<p></p>
<br>
<b>Recursive Case:</b><i>The part where the function solves the same problem again, but in a smaller form that moves closer to the base case.</i>
<br>
In the Case Study,<i>"ask the person in front, then add 1"</i> is the recursive case. 
<p></p>
<br>
<b>Python Code:</b>
<pre><code class="language-python">
    def get_row_number():
        if is_anyone_sitting_infront_of_me == False:
            return 1
        return 1 + get_row_number()
</code></pre>
Now the function is complete: the base case stops it, and the recursive case moves every other call closer to that stop.`
      },
      {
        beatNumber: 6,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Waiting for the Answer</h3>`
        },
        rightPaneHtml: `<h4>Return Phase of Recursion</h4>
<b>In the Case Study, can you recall that everyone except the person in Row 1 had to pause and wait before they could answer.</b>
<br>
<i>This waiting matters.</i>
<p></p>
<b>Python Code:</b>
<pre><code class="language-python">
    return 1 + get_row_number()
</code></pre>
The <b>+ 1</b> cannot be computed until <code>get_row_number()</code> on the right actually finishes and returns a value — just like Raghav couldn't say "Row 12" until Tarun replied "Row 11," and Tarun couldn't reply until Amrit replied.
<br>
<p></p>
<i>This pause-and-then-resolve behavior is called the <b>return phase of recursion.</b></i>`
      },
      {
        beatNumber: 7,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Summary of the Concepts</h3>`
        },
        rightPaneHtml: `<h4>Summary</h4>
Concepts Summary :
<br>
<ul>
    <li>Function Calling Itself - <b>Recursion</b></li>
    <li>Stopping Condition - <b>Base Case</b></li>
    <li>Moving Closer to Base Case - <b>Recursive Case</b></li>
    <li>Waiting Before Returning the Answer - <b>Return Phase</b></li>
</ul>
<br>
Let's map the concepts learned back to the case study:
<ol>
    <li>Everyone asking their row number from the person in front of them - <b>Recursion</b></li>
    <li>The condition where a person has no one in front to ask, and answers directly - <b>Base Case</b></li>
    <li>Each person asking the person in front of them, moving the question closer to Row 1 - <b>Recursive Case</b></li>
    <li>Everyone (except Row 1) pausing until they receive an answer before replying - <b>Waiting / Return Phase</b></li>
</ol>`
      },
      {
        beatNumber: 8,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Test your Understanding</h3>`
        },
        rightPaneHtml: `<h4>Question 1</h4>
<z-question-card>
<z-question>
    What is the purpose of the base case?
</z-question>
<z-options>
    <li>to call the function again.</li>
    <li><z-correct-answer>to stop the recursion chain.</z-correct-answer></li>
    <li>to terminate the program.</li>
</z-options>
<z-explanation>
    The base case is the condition where the function does not call itself again — it returns a value directly instead. Without it, the recursion would never stop, like a chain of questions with no first row.
</z-explanation>
</z-question-card>`
      },
      {
        beatNumber: 9,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Test your Understanding</h3>`
        },
        rightPaneHtml: `<h4>Question 2</h4>
<z-question-card>
<z-question>
    What is the purpose of the recursive case?
</z-question>
<z-options>
    <li>to move away from the base case.</li>
    <li><z-correct-answer>to move towards the base case.</z-correct-answer></li>
    <li>to neither move away nor towards the base case.</li>
</z-options>
<z-explanation>
    Each recursive call must bring the problem closer to the base case (e.g., asking the person one seat closer to Row 1). If it moved away instead, the recursion would never stop.
</z-explanation>
</z-question-card>`
      },
      {
        beatNumber: 10,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Test your Understanding</h3>`
        },
        rightPaneHtml: `<h4>Question 3</h4>
<z-question-card>
<z-question>
    What is the main idea of solving a problem via recursion?
</z-question>
<z-options>
    <li><z-correct-answer>solve a problem by dividing it into a smaller problem of the same nature.</z-correct-answer></li>
    <li>solve a problem entirely at once.</li>
    <li>solve a problem by converting it into a completely different form.</li>
</z-options>
<z-explanation>
    Every person in the theater solved the exact same problem — "what is my row number?" — just for a smaller/closer seat. That's the core idea of recursion.
</z-explanation>
</z-question-card>`
      },
      {
        beatNumber: 11,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">When to Apply Recursion?</h3>`
        },
        rightPaneHtml: `<h4>Can every problem be solved using recursion?</h4>
<em>No</em>
<br>
<p></p>
Recursion can be used to solve a problem, only when :
<ul>
    <li>the problem can be divided into a smaller problem of the same kind, and</li>
    <li>there is a clear stopping point (a base case).</li>
</ul>`
      },
      {
        beatNumber: 12,
        leftPane: {
          type: "text",
          content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Module 2 Completed</h3><p style:" justify-content:center; align-item:center;">Basic Concepts of Recursion.</p>`
        },
        rightPaneHtml: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Congratulations!, You completed Module 2.</h3><p style:" justify-content:center; align-item:center;">You just learned the basic concepts of Recursion.</p>`
      }
    ]
  }
};
