export const rawModuleText = `# Beat 1 of 18
left-pane : {
    type : "image",
    src: "/assets/image-1.png"
}

right-pane : 
\`\`\`html
<div style="text-align: center; margin-top: auto; margin-bottom: auto;">
  <h3>Case Study on Iteration</h3>
  <p>Finding Raghav in a Dark Movie Theatre.</p>
</div>
\`\`\`

# Beat 2 of 18
left-pane : {
    type : "image",
    src: "/assets/image-2.png"
}



right-pane :
\`\`\`html
Raghav is watching a movie in a large theatre.
<p></p>
Suddenly, there is a complete power failure, and the theatre becomes completely dark.

<p></p>
After a few moments, an announcement is made:
<br>
<z-announcement>
"Please remain seated. It will take 10-15 minutes to fix the problem."
</z-announcement>
\`\`\`

# Beat 3 of 18

left-pane : {
    type : "image",
    src: "/assets/image-3.png"
}


right-pane :
\`\`\`html
Meanwhile, Tarun, Raghav's best friend, enters the theater, and he finds the room dark.
<p></p>
So he calls Raghav and asks:
<br>
<z-question>
"Raghav, in which row are you sitting? I want to sit beside you."
</z-question>
<p></p>
Raghav replies:
<z-reply>
"Tarun, I don't know my row number. I just know that I am sitting in 5th column from the aisle."
</z-reply>

\`\`\`

# Beat 4 of 18
left-pane : {
    type : "image",
    src: "/assets/image-4.png"
}


right-pane :
\`\`\`html
So Tarun decides to find Raghav himself.
<p></p>
He starts from Row 1 and checks the 5th seat to see if Raghav is sitting there.
<br>
Raghav is not there.
<p></p>
So Tarun moves to Row 2 and checks the 5th seat again.
<br>
Raghav is not there either.
<br>
<p></p>
Tarun continues doing the same thing:
<ul>
<li>Goes to Row 3. Checks the 5th seat. Raghav is not there. Moves to next row.</li>
<li>Goes to Row 4. Checks the 5th seat. Raghav is not there. Moves to next row.</li>
and so on...
</ul>
\`\`\`

# Beat 5 of 18
left-pane : {
    type : "image",
    src: "/assets/image-5.png"
}



right-pane :
\`\`\`html
While doing the same repeated action for each row, Tarun reaches row 12.
<p></p>
He checks if Raghav is there, and he finds Raghav sitting in that row.
<br>
<p></p>
So Tarun now knows, that Raghav is sitting in row 12.
<br>
He goes and sits beside Raghav. 

\`\`\`

# Beat 6 of 18
left-pane : {
    type : "image",
    src: "/assets/image-6.png"
}


right-pane :
\`\`\`html
After two minutes, an usher walks through the theater carrying water bottles.
<p></p>
<i>(Note: An <b>usher</b> is a theater staff member who helps and guides the guests.)</i>
<p></p>
She knows the theater has exactly 20 rows.
<p></p>
<ul>
<li>She starts at Row 1 and gives a water bottle to the first person in that row.</li>
<li>She then moves to Row 2 and gives a water bottle to the first person there.</li>
<li>She then moves to Row 3 and gives a water bottle to the first person there.</li>
and so on...
</ul>
<p></p>
She repeats the same action for every other row till Row 20 and then stops.
<p></p>
<br>
After 15 minutes, lights were restored, and the movie continued.

\`\`\`



# Beat 7 of 18
left-pane : {
    type : "text",
    content: \`<h3 style="font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Concept of Iteration</h3>\`
}


right-pane :
\`\`\`html
<h4>Overview</h4>
<p></p>
Did you notice something in the action of Tarun and usher?
<p></p>
They did one common thing : <i>repeating same action again and again.</i>
<p></p>
<z-announcement>
    This is what iteration is!
</z-announcement>
<p></p>
<b>Iteration :</b><i> Repeating certain actions again and again.</i>
<br>
In Programming, iteration is also known as loops.
<p></p>
<br>
Elements of loop/iteration :
<ul>
<li><b>Condition : </b><i>It determines whether the iteration will continue or not. If it is true, the iteration continues. If it becomes false, the iteration stops.</i></li>
<li><b>Repeated Actions: </b><i>The set of actions which repeat in every iteration.</i></li>
<li><b>Update Step: </b><i>Certain values are updated in every iteration to move closer to the loop termination.</i></li>
</ul>

\`\`\`

# Beat 8 of 18
left-pane : {
    type : "text",
    content: \`<h3 style="font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Variety of Loops</h3>\`
}


right-pane :
\`\`\`html
<h4>Types of Loops</h4>
<p></p>
Iteration is used in two types of scenarios :
<ul>
    <li>Scenario 1 : When number of repetition is <b>known</b> beforehand.</li>
    <li>Scenario 2 : When number of repetition is <b>unknown</b> beforehand.</li>
</ul>
<br><br>
<p></p>
These two scenarios are handled by two different types of loop :
<ul>
    <li><b>for</b> loop : used when number of repetition is <i>known</i> .</li>
    <li><b>while</b> loop : used when number of repetition is <i>unknown</i>.</li>
</ul>
\`\`\`

# Beat 9 of 18
left-pane : {
    type : "text",
    content: \`<h3 style="font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Example of while loop</h3>\`
}


right-pane :
\`\`\`html
<h4>While loop</h4>
<p></p>
Let's learn while loop by example of Tarun.
<p></p>
In Tarun 's case :
<ul>
    <li><b>Repeated Action</b> : Checking for Raghav in 5th seat of each row.</li>
    <li><b>Condition</b> : Till Raghav is found.</li>
    <li><b>Update Step</b> : Going to next row.</li>
    <li><b>Number of Repetition</b> : Not known beforehand.</li>
</ul>
<p></p>
Tarun did not know beforehand how many times he has to repeat the action.
<br>
So Tarun 's search is an example of <b>while</b> loop.
\`\`\`

# Beat 10 of 18
left-pane : {
    type : "text",
    content: \`<h3 style="font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Example of for loop</h3>\`
}


right-pane :
\`\`\`html
<h4>For loop</h4>
<p></p>
Let's learn for loop by example of usher.
<p></p>
In usher 's case :
<ul>
    <li><b>Repeated Action</b> : Giving the water bottle to the first person in the row.</li>
    <li><b>Condition</b> : Till she reaches row 20.</li>
    <li><b>Update Step</b> : Going to next row.</li>
    <li><b>Number of Repetition</b> : known beforehand.</li>
</ul>
<p></p>
Usher knew beforehand that she has to repeat the action 20 times - one for each row.
<br>
So usher going to each row and giving water bottle is an example of <b>for</b> loop.
\`\`\`

# Beat 11 of 18
left-pane : {
    type : "text",
    content: \`<h3 style="font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Let's code while loop</h3>\`
}


right-pane :
\`\`\`html
<h4>While Loop Construct</h4>
<p></p>
Let's code Tarun 's search using while loop.
<p></p>
<ol>
    <li><b>What need to be tracked in each iteration?</b> : row number, has raghav been found</li>
    <li><b>What keeps the iteration continuing (condition)</b> : till raghav is found</li>
    <li><b>What is the repeated action</b> : checking if raghav is sitting in 5th seat?</li>
    <li><b>What changes each round</b> : move to next row if not found.</li>
</ol>
<br>
Tarun did not know before how many times he has to repeat.
<br> 
So this is an example of <b>while</b> loop.
<p></p>
<br>
<b>Python code :</b>
<pre><code class="language-python">
    row_number = 1  # starting from first row
    raghav_found = False # starting condition of loop

    while raghav_found == False:  #condition
        if check_person_in_5th_seat(row_number) == "Raghav": #repeated action
            raghav_found = True
        else:
            row_number = row_number + 1 # Update: Move to the next row
</code></pre>
When the loop ends, <code>row_number</code> contains the row in which Raghav is sitting.
\`\`\`


# Beat 12 of 18
left-pane : {
    type : "text",
    content: \`<h3 style="font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Let's code for loop</h3>\`
}


right-pane :
\`\`\`html
<h4>For Loop Construct</h4>
<p></p>
Let's code usher distributing water bottle using for loop.
<p></p>
<ol>
    <li><b>What keeps the iteration continuing (condition)</b> : till row 20 is reached</li>
    <li><b>What is the repeated action</b> : giving water bottle to the first person in the row.</li>
    <li><b>What changes each round</b> : move to next row after giving water bottle.</li>
</ol>
<br>
Usher knew before that she has to repeat 20 times.
<br> 
So this is an example of <b>for</b> loop.
<p></p>
<br>
<b>Python code :</b>
<pre><code class="language-python">
    for row_number in range(20): # repeats 20 times
        give_water_bottle_to_first_person_in_row(row_number) # repeated action
</code></pre>
At the end of each iteration, value of <code>row_number</code> increases (i.e. moves to the next row).
\`\`\`


# Beat 13 of 18
left-pane : {
    type : "text",
    content: \`<h3 style="font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">In a Nutshell</h3>\`
}

right-pane :
\`\`\`html
<h4>Summary</h4>
<p></p>
<b>Iteration : </b><i>Repeating certain actions again and again, for a fixed number of times, or as long as a condition is true.</i>
<br>
<p></p>
Types of loop construct :
<ul>
    <li><b>for loop</b> : used when the iteration has to be repeated for fixed number of times.</li>
    <li><b>while loop</b> : used when the iteration has to be repeated as long as a condition is true (i.e. number of iteration is not fixed).</li>
</ul>

\`\`\`

# Beat 14 of 18
left-pane : {
type : "text",
content: \`<h3 style="font-size:20px; justify-content:center; align-item:center; font-style:italic; font-weight:bold;">Test your Understanding</h3>\`
}

right-pane :
\`\`\`html
<h4>Question 1: </h4>
<p></p>
<z-mcq>
  <z-question>In Tarun's <code>while</code> loop code, which line represents the <b>Update Step</b> that enables him to move to next row?</z-question>
  <z-options>
    <z-option correct="false"><code>raghav_found = False</code></z-option>
    <z-option correct="false"><code>if check_person_in_5th_seat(row_number) == "Raghav":</code></z-option>
    <z-option correct="true"><code>row_number = row_number + 1</code></z-option>
  </z-options>
  <z-explanation>Correct! The Update Step changes the state each round. By adding 1 to the row number, Tarun physically moves to the next row to continue his search.</z-explanation>
</z-mcq>
\`\`\`

# Beat 15 of 18
left-pane : {
type : "text",
content: \`<h3 style="font-size:20px; justify-content:center; align-item:center; font-style:italic; font-weight:bold;">Test your Understanding</h3>\`
}

right-pane :
\`\`\`html
<h4>Question 2: </h4>
<p></p>
<z-mcq>
  <z-question>Why does Tarun's <code>while</code> loop finally stop running?</z-question>
  <z-options>
    <z-option correct="false">Because he reaches Row 20.</z-option>
    <z-option correct="true">Because the variable <code>raghav_found</code> becomes <code>True</code>.</z-option>
    <z-option correct="false">Because the power comes back on in the theater.</z-option>
  </z-options>
  <z-explanation>Exactly! The loop is programmed to run only <i>while</i> <code>raghav_found == False</code>. The moment he finds Raghav, the variable becomes <code>True</code>, the condition breaks, and the loop stops.</z-explanation>
</z-mcq>
\`\`\`


# Beat 16 of 18
left-pane : {
type : "text",
content: \`<h3 style="font-size:20px; justify-content:center; align-item:center; font-style:italic; font-weight:bold;">Test your Understanding</h3>\`
}

right-pane :
\`\`\`html
<h4>Question 3: </h4>
<p></p>
<z-mcq>
  <z-question>A security guard needs to check all 4 emergency exit doors of the theater.<br>Which loop should be used to write a program for this task?</z-question>
  <z-options>
    <z-option correct="true">A <code>for</code> loop.</z-option>
    <z-option correct="false">A <code>while</code> loop.</z-option>
  </z-options>
  <z-explanation>Spot on! Because the exact number of doors (4) is known beforehand, the number of repetitions is fixed. Therefore, a <code>for</code> loop is the best choice.</z-explanation>
</z-mcq>
\`\`\`

# Beat 17 of 18
left-pane : {
type : "text",
content: \`<h3 style="font-size:20px; justify-content:center; align-item:center; font-style:italic; font-weight:bold;">Test your Understanding</h3>\`
}

right-pane :
\`\`\`html
<h4>Question 4: </h4>
<p></p>
<z-mcq>
  <z-question>Raghav wants to eat popcorn from his bucket until the bucket is completely empty. He doesn't know exactly how many popcorn kernels are inside.<br>Which loop is best for this?</z-question>
  <z-options>
    <z-option correct="false">A <code>for</code> loop.</z-option>
    <z-option correct="true">A <code>while</code> loop.</z-option>
  </z-options>
  <z-explanation>Correct! Since the exact number of popcorn kernels (the number of repetitions) is unknown beforehand, he must keep eating <i>while</i> the condition (bucket is not empty) is true.</z-explanation>
</z-mcq>
\`\`\`


# Beat 18 of 18
left-pane : {
    type : "text",
    content: \`<h3 style="font-size:20; justify-content:center; align-item:center; font-style:italics, bold;">Module Completed</h3>\`
}


right-pane :
\`\`\`html
<div style="text-align: center; margin-top: auto; margin-bottom: auto;">
  <h3>Congratulations! You completed the Module.</h3>
  <p>You learned the concepts of iteration.</p>
</div>
\`\`\`
`;
