[Step-2 Start]
In the previous story, every person followed exactly the same strategy to solve the problem.

This type of problem-solving approach has a name.

It is called recursion.

[Concept-1 Start]
What is recursion (in simple language)?

Recursion is a way of solving a problem by solving a smaller problem of the same kind.

> In programming, recursion is implemented by allowing a function to call itself.


Like in the story, Raghav asks Tarun, Tarun ask Amrit, and so on. 

```python
def get_row_number():
    # code
    get_row_number()

```
The code is example of recursion, since get_row_number() is calling itself.
[Concept-1 End]

[Concept-2 Start]
Can you recall when the chain of asking question stopped? It stopped when there the question reached the last person.

This is what known as base case.

Base Case : The condition at which the function will not call itself, and will return a value instead.

Like in the story, the first person was the base case. When question reached him, he did not ask anyone, rather he replied "row 1".


```python
def get_row_number():
    if is_anyone_sitting_infront_of_me == False:
        return 1
    # code
    get_row_number()

```
When the condition `is_anyone_sitting_infront_of_me` became False, then it is the base case, and function returns 1.

[Concept-2 End]

[Concept-3 Start]
What was the reason as why this chain of asking question would stopped? 
It stopped because, every time a person asked question, the question moved closer to the person sitting in first row (base case).

So this is what is known as recursive case.
Recursive case is the part where the same problem is solved again, but in a smaller form that moves closer to the base case..

```python
def get_row_number():
    if is_anyone_sitting_infront_of_me == False:
        return 1
    return 1+get_row_number()

```



[Concept-3 End]

[Summary-Section Start]
Lets map the concepts leaner to the story
1. Each person asking their row number from the person infront of them - Recursion
2. Each time a person ask the question to person infront of him, the question moves closer to first row - Recursive Case
3. Question reaching the person in the first row? - Base case
[Summary-Section End]

[Question-section Start]
1. What is the purpose of base case?
    - to call the function again.
    - to stop the recursion chain.
    - to terminate the program.

2. What is the purpose of recursive case?
    - to move away from base case.
    - to move towards base case.
    - to neither move away nor towards the base case.

3. What is the main idea solving a problem via recursion?
    - solve a problem by dividing the into smaller problem of same nature.
    - solve a problem at once.
    - solve a problem by converting the problem into another form.

[Question-section End]

[Fact Start]
Can every problem be solved using recursion?

No.

Recursion is useful when:

• the problem can be divided a smaller problem of the same kind
• there is a clear stopping point
[Fact End]
[Step-2 End]