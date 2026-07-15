# The Fellowship's Graph Case Study

## The Road to Kolhapur

It is monsoon season in Maharashtra. The Panchganga and Krishna rivers have breached their banks, and the city of Kolhapur is submerged. Thousands of people are stranded on rooftops and in relief camps. They need medical supplies antibiotics, ORS packets, insulin, surgical kits and they need them now.

You are the logistics coordinator at the Maharashtra State Disaster Management Authority. Your central supply depot is in Mumbai. Your destination is Kolhapur. Between them lie five intermediate cities: Pune, Satara, Sangli, Solapur, and Karad. Each city is connected to others by roads, and each road has two numbers that matter to you.

The first number is **travel time in hours**. This is how long it takes a supply truck to traverse that road under current conditions accounting for traffic, detours, and road quality.

The second number is **risk of failure**. This is the probability, expressed as a decimal between 0 and 1, that the road is impassable collapsed bridge, flooded stretch, landslide. If a truck takes a road with 0.60 risk, there is a 60% chance that the truck will be stopped, its supplies delayed for days, and the people waiting in Kolhapur will go without.

Here is your network:

- **Mumbai to Pune**: 3 hours, 5% risk
- **Mumbai to Solapur**: 7 hours, 10% risk
- **Pune to Satara**: 2 hours, 15% risk
- **Pune to Karad**: 4 hours, 60% risk the bridge at Karad is severely weakened
- **Satara to Kolhapur**: 3 hours, 20% risk
- **Satara to Sangli**: 2 hours, 10% risk
- **Sangli to Kolhapur**: 2 hours, 5% risk
- **Karad to Kolhapur**: 1 hour, 50% risk the road is short but half-flooded
- **Solapur to Sangli**: 3 hours, 8% risk
- **Solapur to Kolhapur**: 5 hours, 3% risk

## What You Must Do

### Task 1: Represent the Network

Before you can find a path, you must represent this network as a data structure. You have seven cities and ten roads. Each road connects two cities and carries two weights. How do you store this so that, given any city, you can instantly look up all the cities it connects to and the cost of each connection?

### Task 2: Find the Fastest Route

Using only the travel time as your cost, find the route from Mumbai to Kolhapur that minimises total travel time. How many hours does it take? Which cities does the truck pass through?

### Task 3: Find the Safest Route

Now ignore time. Using only the risk values as your cost, find the route that minimises the total risk exposure from Mumbai to Kolhapur. Which cities does the truck pass through now? Is it the same route?

### Task 4: Confront the Dilemma

The fastest route takes your truck through roads with significant risk. The safest route takes much longer and people in Kolhapur are running out of insulin. 

There is no route that is simultaneously the fastest AND the safest. You must choose.

Can you construct a combined cost that balances time against risk? If you weight time at 70% importance and risk at 30%, does the optimal route change? What about 50/50? What about 30% time and 70% risk?

Is there a "correct" weighting? Who decides?

### Task 5: The Dynamic Update

News arrives: the Pune-Karad bridge has collapsed entirely. That road is now impassable. How do you update your network? Does the optimal route change? By how much?

## The Deeper Question

Gandalf chose Moria. It was the shortest path. It cost him his life temporarily. Aragorn wanted the longer road. It would have cost them time, and perhaps Frodo's endurance.

Neither was wrong. Both were optimising for different cost functions.

Your algorithm will give you the optimal path for whatever cost function you provide. But the algorithm cannot tell you which cost function is the right one. That decision how much risk is acceptable when lives are at stake is yours.

How do you choose what to optimise?
