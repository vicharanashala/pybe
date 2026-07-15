# The Nashika Taal Engine Case Study

## The Three Drummers

It is the evening of Ganesh Chaturthi in Pune. Three Nashik Dhol players stand in formation at the head of a procession that stretches back six city blocks. Ten thousand people move behind them. The energy of the crowd rises and falls with the rhythm of the drums. When the three players strike together when their independent patterns converge on the same beat the sound is thunderous and the crowd erupts.

You are building a simulation engine that models this rhythmic interplay.

**Player 1** strikes the dhol on every **2nd beat**. Beat 2, beat 4, beat 6, beat 8 a steady, driving pulse. This is the heartbeat of the ensemble, the foundation that keeps the procession moving.

**Player 2** strikes on every **3rd beat**. Beat 3, beat 6, beat 9, beat 12. This player adds complexity, a cross-rhythm that weaves between Player 1's steady pulse. When Player 1 and Player 2 strike together on beat 6, the sound thickens.

**Player 3** strikes on every **5th beat**. Beat 5, beat 10, beat 15, beat 20. This is the accent player sparse, powerful, placed for maximum impact. When all three strike together, the crowd knows it.

## Task 1: The Synchronisation Point

Your first question is mathematical but essential: on which beat do all three players strike simultaneously for the first time? Given their intervals of 2, 3, and 5 beats, when does the convergence happen?

This is not just a number. In the procession, this is the moment when the crowd surges forward. In your simulation, this is the reset point of the cycle. Every pattern repeats from this moment.

Find the first synchronisation beat. Then find the next five synchronisation points. Is there a pattern?

## Task 2: The Million-Beat Simulation

The Ganesh Chaturthi procession runs for hours. Your simulation must model one million beats. For each beat, you must record which players are active. 

Here is your constraint: your simulation environment has **64 megabytes of RAM**. Not a gigabyte. Not half a gigabyte. Sixty-four megabytes the kind of constraint you face on an embedded device, a Raspberry Pi controlling actual stage lighting, or a mobile app running alongside fifty other processes.

If you store every beat in a list one million entries, each containing the beat number and which players are active how much memory does that consume? Can it fit in 64 megabytes? What if the procession runs longer and you need ten million beats?

You need a way to produce beats one at a time, processing each one and moving on, without holding the entire sequence in memory. The drummer does not remember every beat of a three-hour procession. The drummer holds the pattern and generates the next beat from the rule.

How do you make your code work like the drummer?

## Task 3: The Ensemble Coordination

Now the problem gets real. In a live performance, the three players do not take turns. They play simultaneously. Player 1 does not wait for Player 2 to finish before starting. All three are running their own independent loops at the same time, and they coordinate through the shared pulse of the taal.

You must simulate this concurrency. Each player runs independently processing their own beat pattern at their own pace. But at the synchronisation points, they must align. If Player 1 reaches beat 30 while Player 2 is still on beat 27, Player 1 must wait.

How do you run three independent loops at the same time? How do you make them wait for each other at specific points? How do you prevent them from stepping on each other's data?

## Task 4: The Rolling Window

The sound engineer at the procession does not care about beat 1 when the procession is at beat 500,000. She cares about the last 100 beats the recent history that tells her whether the rhythm is stable, whether the players are drifting, whether the energy is building or fading.

You need a data structure that holds exactly the last N beats and automatically discards older ones. When a new beat arrives, the oldest beat falls away. The size never grows. The memory never exceeds the window.

What data structure does this?

## The Deeper Question

A drummer who tried to memorise every individual beat of a three-hour performance would fail. The human mind does not work that way. Instead, the drummer internalises the rule the taal and generates each beat from the rule in real time.

A programme that tries to store every individual value of a million-item sequence may succeed, but it is wasteful. It stores what it could generate. It remembers what it could re-derive. It uses memory where it could use computation.

When is it better to hold the formula than to hold the data?
