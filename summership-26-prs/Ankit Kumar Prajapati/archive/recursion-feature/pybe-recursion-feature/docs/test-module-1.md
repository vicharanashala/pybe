# Beat 1 of 10
left-pane : {
    type : "image",
    src: "/assets/image-1.png"
}

right-pane : 
```html
<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Case Study on Recursion</h3><p style:" justify-content:center; align-item:center;">Finding Row Number in Dark Movie Theatre.</p>
```

# Beat 2 of 10
left-pane : {
    type : "image",
    src: "/assets/image-2.png"
}

right-pane :
```html
<h3>Let's hear a story, before learning the concepts.</h3>
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
</z-announcement>
```

# Beat 3 of 10

left-pane : {
    type : "image",
    src: "/assets/image-3.png"
}


right-pane :
```html
While waiting, Raghav becomes curious.
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
</ul>
```

# Beat 4 of 10
left-pane : {
    type : "image",
    src: "/assets/image-4.png"
}


right-pane :
```html
The only option Raghav has is to communicate with the person sitting directly in front of him.
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
This chain of asking questions continues.
```

# Beat 5 of 10
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Ponder</h3><p style:" justify-content:center; align-item:center;">Take a moment and think.</p>`
}


right-pane :
```html
<z-ponder>
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
</z-explanation>
```

# Beat 6 of 10
left-pane : {
    type : "image",
    src: "/assets/image-4.png"
}


right-pane :
```html
This process continues and the question reaches the person sitting in the first row.
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
</z-click>
```

# Beat 7 of 10
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Reflection</h3><p style:" justify-content:center; align-item:center;">Let's ponder over some question to see what happened.</p>`
}


right-pane :
```html
<h4>Reflection 1 :</h4>
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
</z-question-card>
```


# Beat 8 of 10
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Reflection</h3><p style:" justify-content:center; align-item:center;">Let's ponder over some question to see what happened.</p>`
}


right-pane :
```html
<h4>Reflection 2 :</h4>
<z-question-card>
<z-question>
he chain of questions didn't go on forever — it stopped somewhere. What made it stop?
</z-question>
<br>
<z-answer>
It stopped the moment the question reached Row 1, because there was no one sitting in front of him left to ask.
</z-answer>
</z-question-card>
```

# Beat 9 of 10
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Reflection</h3><p style:" justify-content:center; align-item:center;">Let's ponder over some question to see what happened.</p>`
}


right-pane :
```html
<h4>Reflection 3 :</h4>
<z-question-card>
<z-question>
Notice that everyone except the person in Row 1 had to pause before answering. Why couldn't they answer immediately?
</z-question>
<br>
<z-answer>
Because their own row number depended on first knowing the row number of the person in front of them — they couldn't add 1 to a number they didn't have yet.
</z-answer>
</z-question-card>
```



# Beat 10 of 10
left-pane : {
    type : "text",
    content: `<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Module 1 Completed</h3><p style:" justify-content:center; align-item:center;">Case Study on Recursion.</p>`
}


right-pane :
```html
<h3 style:"font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Congratulations!, You completed Module 1.</h3><p style:" justify-content:center; align-item:center;">You just saw the use of recursion in the case study.</p>
```