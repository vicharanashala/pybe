# The Prisoner's Dilemma Case Study

## The Trading Floor

You are building an automated trading system for a competitive market microstructure. Your algorithm will face other algorithmic traders, each with their own strategy and you don't know who you're facing until after the trades execute.

The market is a simplified exchange: at each time step, traders can either **Cooperate** (C) accepting a modest, fair profit or **Defect** (D) attempting to seize a larger profit at the expense of the other trader.

The payoff matrix (what each trader receives based on their combined choices):

```
                    Opponent
                  Cooperate    Defect
You  Cooperate      3, 3        0, 5
You  Defect         5, 0        1, 1
```

- If both cooperate: both get 3 (moderate, fair profit)
- If you cooperate, opponent defects: you get 0 (loss), opponent gets 5 (they exploited you)
- If you defect, opponent cooperates: you get 5 (exploited them), opponent gets 0
- If both defect: both get 1 (market collapses, minimal profit)

## The Market Makers

You will face four types of algorithmic traders. You don't know which type you're facing until after the round:

**1. The Always-Cooperator** Always chooses Cooperate, no matter what. A naive algorithm that assumes good faith.

**2. The Always-Defector** Always chooses Defect. An aggressive algorithm that maximizes short-term gains by exploiting the other player.

**3. The Randomist** Chooses randomly with equal probability. Neither clever nor naive.

**4. The Tit-for-Tatter** Cooperates on the first move, then mirrors your last move. If you cooperated last round, they cooperate. If you defected last round, they defect.

## Your Task

Design a system that:

1. **Models the game** Represent the payoff matrix as a data structure. Create a function that takes both players' choices and returns the appropriate payoff.

2. **Implements strategies** Each of the four opponent types should be a function that takes the history of rounds and returns a choice (C or D).

3. **Runs simulations** Given a specific opponent strategy, simulate 100 rounds and calculate the total payoff for both players.

4. **Discovers the Nash equilibrium** For each opponent type, determine: what strategy yields the best outcome for you?

5. **Explores the paradox** Show that for the Always-Defector, your best response is to also defect even though both cooperating would be better for both of you.

## The Questions

1. Given the payoff matrix, what is your optimal strategy against each opponent type?

2. What is the Nash equilibrium in this one-shot game? Is it Pareto optimal?

3. In the iterated game (100 rounds), does your strategy against Always-Defector change? Why or why not?

4. How does Tit-for-Tat perform against different opponents? What does this reveal about reciprocity?

5. If you could negotiate with your opponent before the game started, what agreement would you try to reach? Is it enforceable?

## The Philosophical Question

The dilemma has no 'right' answer that's what makes it a dilemma. But Python gives you tools to *reason* about it rigorously:

- Data structures to model the payoff matrix
- Functions as first-class objects to implement strategies
- Simulation to explore long-run outcomes
- Pattern matching to find optimal responses

The goal is not to find the 'correct' answer, but to understand *why* the dilemma is hard, and how computational thinking illuminates the structure of strategic interaction.