[Step-3 start]
[Designing-Recursion start]

Now that you know what recursion is, let's learn how to design a recursive function.

Problem : Find the sum of the first **n** natural numbers using recursion.

Example:

- Sum of first 1 natural number = **1**
- Sum of first 3 natural numbers = **1 + 2 + 3 = 6**
- Sum of first 5 natural numbers = **1 + 2 + 3 + 4 + 5 = 15**


Whenever you design a recursive function, ask yourself these three questions:

1. **What should my function return?**
2. **What is the smallest problem I can solve directly?**
3. **How can I reduce the current problem into one smaller problem of the same kind?**

Step 1: Write the function definition.

Ask yourself, What should the function return?
In this problem, the function should return the sum of the first **n** natural numbers.

So, write the function definition.
```python
def natural_number_sum(n):
```
Step 2: Write base case

What is the smallest problem that can be solved directly?
If **n = 1**, the sum is 1.


```python
if n==1:
    return 1
```

Step-3 : Write recursive case :

 How can the current problem become one smaller problem?
 Sum of n natural number can be written as = n + sum of (n-1) natural number

```python
sum = n + natural_number_sum(n-1)
```

Step 4 : Combine base case and recursive case using if else.
> Every recursive function must have a base case and a recursive case. They are commonly written using an if statement.

```python
if n==1:
    return 1
else :
    result = n + natural_number_sum(n-1)
```

Step 5 : Combine the function definition and the code, and return the sum in else part.

```python
def natural_number_sum(n):
    if n==1:
        return 1
    else :
        result = n + natural_number_sum(n-1)
        return result
```

A more simplified code would be to use a single if:
```python
def natural_number_sum(n):
    if n==1:
        return 1
    return  n + natural_number_sum(n-1)
```

[Designing-Recursion end]
[Play-with-Recursion Start]
Fill the blank in the code snippet with the code line.

```python
def factorial(n):
    if ____ : # Base Case
        return 1
    return n * ______

1. `n==0`
2. `factorial(n-1)`
```




Whenever you design a recursive function, follow these steps:
1. Write function definition.
2. Write base case.
3. Write recursive case.
4. Combine  base case and recursive case into function definition.

[Play-with-Recursion End]

Congratulation, you have completed the module of recusion.



[Youtube-section Start]
Optional : Go through this 7 min youtube video, to see the recursion visusally.

https://www.youtube.com/watch?v=vLhHyGTkjCs

> Though it is in javascript, but the concepts remain same and you will able to get it :)
[Youtube-section End]

[Step-3 end]