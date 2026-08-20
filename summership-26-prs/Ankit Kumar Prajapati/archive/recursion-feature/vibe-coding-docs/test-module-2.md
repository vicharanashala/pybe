# Beat 1 of 12
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Learning Recursion</h3>`
}

right-pane : 
```html
<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Key Concepts of Recursion</h3>
```

# Beat 2 of 12
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Connecting to Case Study of Module 1</h3>`
}

right-pane :
```html
In the previous story, every person followed exactly the same strategy to solve the problem.
<p></p>
This type of problem-solving approach has a name.
<p></p>
<h4>It is called <em>recursion</em>.</h4>
```

# Beat 3 of 12
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Meaning of Recursion</h3>`
}

right-pane :
```html
<h4>What is Recursion?</h4>
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
The code is example of recursion, since <code>get_row_number()</code> is calling itself.
```

# Beat 4 of 12
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Stopping Condition</h3>`
}

right-pane :
```html
<h4>Base Case : The Stopping Condition</h4>
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
When the condition <code>is_anyone_sitting_infront_of_me</code> became <code>False</code>, then function returns 1.
```
# Beat 5 of 12
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Moving Closer to Stopping Condition</h3>`
}

right-pane :
```html
<h4>Recursive Case : A Step towards Base Case</h4>
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
Now the function is complete: the base case stops it, and the recursive case moves every other call closer to that stop.
```

# Beat 6 of 12
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Waiting for the Answer</h3>`
}

right-pane :
```html
<h4>Return Phase of Recursion</h4>
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
<i>This pause-and-then-resolve behavior is called the <b>return phase of recursion.</b></i>
```

# Beat 7 of 12
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Summary of the Concepts</h3>`
}

right-pane : 
```html
<h4>Summary</h4>
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
</ol>
```

# Beat 8 of 12
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Test your Understanding</h3>`
}

right-pane :
```html
<h4>Question 1</h4>
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
</z-question-card>
```

# Beat 9 of 12
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Test your Understanding</h3>`
}

right-pane :
```html
<h4>Question 2</h4>
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
</z-question-card>
```

# Beat 10 of 12
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Test your Understanding</h3>`
}

right-pane :
```html
<h4>Question 3</h4>
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
</z-question-card>
```

# Beat 11 of 12
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">When to Apply Recursion?</h3>`
}

right-pane :
```html
<h4>Can every problem be solved using recursion?</h4>
<em>No</em>
<br>
<p></p>
Recursion can be used to solve a problem, only when :
<ul>
    <li>the problem can be divided into a smaller problem of the same kind, and</li>
    <li>there is a clear stopping point (a base case).</li>
</ul>
```

# Beat 12 of 12
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Module 2 Completed</h3><p style:" justify-content:center; align-item:center;">Basic Concepts of Recursion.</p>`
}


right-pane :
```html
<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Congratulations!, You completed Module 2.</h3><p style:" justify-content:center; align-item:center;">You just learned the basic concepts of Recursion.</p>
```