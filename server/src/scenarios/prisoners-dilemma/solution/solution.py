"""
The Prisoner's Dilemma Solution
==================================
Game Theory, Strategic Decision Making, and Multi-Agent Simulation

This solution demonstrates how to model strategic interactions between agents
using Python data structures, functions as first-class objects, and simulation.

The core insight: individual rationality (defection) leads to collective
irrationality (both defecting = 1+1=2) when cooperation would yield (3+3=6).
The Nash equilibrium is stable but suboptimal.
"""

import random
from typing import Callable, Tuple, List, Dict

# ============================================================================
# PART 1: Modeling the Payoff Matrix
# ============================================================================

print("=" * 70)
print("PART 1: The Payoff Matrix")
print("=" * 70)

"""
The payoff matrix maps strategy pairs to outcomes.
We represent this as a nested dictionary for clarity:
    payoff_matrix[your_choice][opponent_choice] = (your_score, opponent_score)
"""

PAYOFF_MATRIX = {
    'C': {  # You cooperate
        'C': (3, 3),   # Both cooperate: 3, 3
        'D': (0, 5),   # You cooperate, they defect: 0, 5
    },
    'D': {  # You defect
        'C': (5, 0),   # You defect, they cooperate: 5, 0
        'D': (1, 1),   # Both defect: 1, 1
    },
}

def get_payoff(your_choice: str, opponent_choice: str) -> Tuple[int, int]:
    """
    Look up the payoff for a given pair of choices.

    Returns:
        Tuple of (your_score, opponent_score)
    """
    return PAYOFF_MATRIX[your_choice][opponent_choice]


print("\nPayoff Matrix:")
print("              Opponent")
print("              Cooperate  Defect")
for my_choice in ['Cooperate', 'Defect']:
    c, d = PAYOFF_MATRIX[my_choice[0]]
    print(f"  You {my_choice:9}  {c}, {d}     {d}, {c}")

print(f"\n{'='*70}")
print("INTERPRETATION")
print("{'='*70}")
print("""
If BOTH cooperate: total = 3 + 3 = 6 (BEST collective outcome)
If BOTH defect:    total = 1 + 1 = 2 (WORST collective outcome)
One defects:       total = 0 + 5 OR 5 + 0 = 5 (intermediate)
""")


# ============================================================================
# PART 2: Strategy Functions Functions as First-Class Objects
# ============================================================================

print("=" * 70)
print("PART 2: Strategy Functions")
print("=" * 70)

"""
In Python, functions are first-class objects they can be passed as
arguments, returned from functions, and stored in data structures.

Each strategy is a function that takes:
    - history: List of (my_choice, opponent_choice) tuples
  and returns:
    - 'C' or 'D'

This is the Strategy Pattern: different algorithms, interchangeable.
"""

History = List[Tuple[str, str]]
Strategy = Callable[[History], str]


def always_cooperate(history: History) -> str:
    """The naive strategy: always cooperate, no matter what."""
    return 'C'


def always_defect(history: History) -> str:
    """The aggressive strategy: always defect, exploit if possible."""
    return 'D'


def random_choice(history: History) -> str:
    """The unpredictable strategy: 50/50 random."""
    return random.choice(['C', 'D'])


def tit_for_tat(history: History) -> str:
    """
    The reciprocal strategy: cooperate on first move, then mirror opponent.

    Strategy analysis:
    - Against cooperators: cooperate always = good
    - Against defectors: retaliate = limit losses
    - Against random: intermediate
    - Against self: stable (C,C,C or D,D,D depending on first move)
    """
    if not history:
        return 'C'  # Cooperate on first move
    else:
        # Mirror opponent's last move
        last_round = history[-1]
        opponent_last = last_round[1]  # opponent's choice
        return opponent_last


def tit_for_tat_with_forgiveness(history: History) -> str:
    """
    Variant: occasionally cooperate even if opponent defected last time.
    This prevents endless cycles of mutual defection.
    """
    if not history:
        return 'C'
    last_round = history[-1]
    opponent_last = last_round[1]
    if opponent_last == 'D':
        # 10% chance of forgiveness
        return random.choice(['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'D'])
    return 'C'


def suspicious_tit_for_tat(history: History) -> str:
    """Start with defect, then mirror. Useful against always-cooperate."""
    if not history:
        return 'D'  # Start by testing
    last_round = history[-1]
    opponent_last = last_round[1]
    return opponent_last


def grim_trigger(history: History) -> str:
    """
    Cooperate until opponent defects, then always defect.
    A harsh but stable strategy.
    """
    if not history:
        return 'C'
    # Check if opponent ever defected
    for my_choice, opp_choice in history:
        if opp_choice == 'D':
            return 'D'
    return 'C'


def pavlov(history: History) -> str:
    """
    Win-stay, lose-shift: if you got a bad outcome last round, switch strategy.
    """
    if not history:
        return 'C'
    last_round = history[-1]
    my_last, opp_last = last_round
    my_payoff, _ = get_payoff(my_last, opp_last)
    # Pavlov rule: if you got 0 or 1 (bad), switch
    if my_payoff <= 1:
        return 'D' if my_last == 'C' else 'C'
    return my_last


print("\nDefined strategies:")
strategies = {
    'Always Cooperate': always_cooperate,
    'Always Defect': always_defect,
    'Random': random_choice,
    'Tit-for-Tat': tit_for_tat,
    'Tit-for-Tat with Forgiveness': tit_for_tat_with_forgiveness,
    'Suspicious Tit-for-Tat': suspicious_tit_for_tat,
    'Grim Trigger': grim_trigger,
    'Pavlov': pavlov,
}
for name in strategies:
    print(f"  - {name}")


# ============================================================================
# PART 3: Running Simulations
# ============================================================================

print("\n" + "=" * 70)
print("PART 3: Simulation Engine")
print("=" * 70)


def play_round(my_strategy: Strategy, opponent_strategy: Strategy,
               history: History) -> Tuple[str, str, Tuple[int, int]]:
    """Play one round, returning (my_choice, opponent_choice, payoff)."""
    my_choice = my_strategy(history)
    opponent_choice = opponent_strategy(history)
    payoff = get_payoff(my_choice, opponent_choice)
    return my_choice, opponent_choice, payoff


def simulate(my_strategy: Strategy, opponent_strategy: Strategy,
             rounds: int = 100) -> Dict:
    """
    Run a simulation of multiple rounds.

    Returns:
        Dictionary with scores, history, and statistics
    """
    history = []
    my_total = 0
    opp_total = 0

    for _ in range(rounds):
        my_choice, opp_choice, (my_payoff, opp_payoff) = play_round(
            my_strategy, opponent_strategy, history
        )
        history.append((my_choice, opp_choice))
        my_total += my_payoff
        opp_total += opp_payoff

    return {
        'my_total': my_total,
        'opponent_total': opp_total,
        'combined_total': my_total + opp_total,
        'avg_per_round': my_total / rounds,
        'history': history,
        'defect_rate': history.count('D') / len(history) * 2 / 2,  # normalize
    }


def tournament(strategies: Dict[str, Strategy], rounds: int = 100) -> Dict:
    """
    Run a round-robin tournament: every strategy plays every other strategy.

    Returns a ranking of strategies by total score.
    """
    results = {name: 0 for name in strategies}

    names = list(strategies.keys())
    for i, name1 in enumerate(names):
        for name2 in names[i+1:]:
            # Play once with each as 'my' strategy
            sim1 = simulate(strategies[name1], strategies[name2], rounds)
            sim2 = simulate(strategies[name2], strategies[name1], rounds)

            # Add scores
            results[name1] += sim1['my_total']
            results[name2] += sim2['my_total']

    # Sort by score
    ranking = sorted(results.items(), key=lambda x: -x[1])
    return ranking


# Run pairwise simulations
print("\nRunning pairwise simulations (100 rounds each):\n")

pairwise_results = [
    ("Always Cooperate", "Always Defect"),
    ("Tit-for-Tat", "Always Defect"),
    ("Tit-for-Tat", "Random"),
    ("Tit-for-Tat", "Always Cooperate"),
    ("Always Defect", "Always Defect"),
]

for my_name, opp_name in pairwise_results:
    sim = simulate(strategies[my_name], strategies[opp_name], 100)
    print(f"  {my_name} vs {opp_name}:")
    print(f"    Your total: {sim['my_total']}, Opponent total: {sim['opponent_total']}")
    print(f"    Combined welfare: {sim['combined_total']} (best possible: 600)")
    print()


# ============================================================================
# PART 4: Finding the Nash Equilibrium
# ============================================================================

print("=" * 70)
print("PART 4: Nash Equilibrium Analysis")
print("=" * 70)

"""
A Nash equilibrium is a strategy profile where no player can improve
their outcome by unilaterally changing strategy.

In the one-shot Prisoner's Dilemma:
- (D, D) is the Nash equilibrium
- But (C, C) Pareto dominates (D, D)

This is the tragedy: the stable outcome is not the best outcome.
"""

print("\nOne-Shot Game Analysis:")
print("  Nash Equilibrium: (Defect, Defect)")
print("  Payoff at Nash: (1, 1)")
print("  Pareto Optimal: (Cooperate, Cooperate)")
print("  Payoff at Pareto Optimal: (3, 3)")
print("\n  The dilemma: (D, D) is stable but suboptimal.")
print("  (C, C) is better but unstable -- either player has incentive to deviate.")


def find_best_response(opponent_strategy: Strategy, my_strategies: Dict) -> str:
    """Find which strategy maximizes your score against a given opponent."""
    best_name = None
    best_score = -float('inf')

    for name, strategy in my_strategies.items():
        sim = simulate(strategy, opponent_strategy, 100)
        if sim['my_total'] > best_score:
            best_score = sim['my_total']
            best_name = name

    return best_name, best_score


print("\nBest Response Analysis (against each opponent, 100 rounds):\n")
for opp_name in ['Always Cooperate', 'Always Defect', 'Random', 'Tit-for-Tat']:
    best_name, best_score = find_best_response(strategies[opp_name], strategies)
    print(f"  Against {opp_name}: best response is '{best_name}' (score: {best_score})")


# ============================================================================
# PART 5: The Paradox in Code
# ============================================================================

print("\n" + "=" * 70)
print("PART 5: The Prisoner's Dilemma Paradox")
print("=" * 70)

"""
THE PARADOX ILLUSTRATED:
Against Always-Defect, your best response IS to also defect.
Even though BOTH cooperating (impossible against Always-Defect) would give 300 each.
"""

print("\nAgainst Always-Defect:")
print("  If you Cooperate: you get 0 per round = 0 total")
print("  If you Defect:    you get 1 per round = 100 total")
print("\n  Your optimal choice: DEFECT")
print("  But if BOTH were to cooperate, you'd get 3 per round = 300 total!")
print("\n  This is the prisoner's dilemma in code:")
print("  Individual rationality (defect) <-> Collective rationality (cooperate)")


# Demonstrate with simulation
sim_cooperate = simulate(always_cooperate, always_defect, 100)
sim_defect = simulate(always_defect, always_defect, 100)

print(f"\n  Simulation: Always Cooperate vs Always Defect")
print(f"    Your score: {sim_cooperate['my_total']}")
print(f"  Simulation: Always Defect vs Always Defect")
print(f"    Your score: {sim_defect['my_total']}")
print(f"\n  Best response against Always-Defect: Defect (100 > 0)")


# ============================================================================
# PART 6: The Iterated Dilemma
# ============================================================================

print("\n" + "=" * 70)
print("PART 6: The Iterated Prisoner's Dilemma")
print("=" * 70)

"""
In the ITERATED (repeated) Prisoner's Dilemma, the story changes.
Robert Axelrod's tournament found that TIT-FOR-TAT was optimal against
a diverse set of strategies because it:
1. Starts with cooperation (nice)
2. Retaliates when defected against (not naive)
3. Forgives after one round of retaliation (not spiteful)

The Folk Theorem: In repeated games, any payoff in the 'collectively
irrational' range can be sustained as an equilibrium with trigger strategies.
"""

print("\nRunning round-robin tournament (100 rounds each)...\n")

ranking = tournament(strategies, 100)

print("TOURNAMENT RANKING (by total score across all matchups):\n")
for i, (name, score) in enumerate(ranking, 1):
    print(f"  {i}. {name}: {score} points")


# ============================================================================
# PART 7: Strategy Analysis Dashboard
# ============================================================================

print("\n" + "=" * 70)
print("PART 7: Strategy Comparison")
print("=" * 70)

# Comprehensive comparison
print("\n{:<30} {:>10} {:>10} {:>12}".format(
    "Strategy", "vscoop", "vsdefect", "Combined"))
print("-" * 65)

for name, strategy in [
    ("Always Cooperate", always_cooperate),
    ("Always Defect", always_defect),
    ("Random", random_choice),
    ("Tit-for-Tat", tit_for_tat),
    ("Tit-for-Tat w/ Forgiveness", tit_for_tat_with_forgiveness),
    ("Suspicious TFT", suspicious_tit_for_tat),
    ("Grim Trigger", grim_trigger),
    ("Pavlov", pavlov),
]:
    coop = simulate(strategy, always_cooperate, 100)['my_total']
    defect = simulate(strategy, always_defect, 100)['my_total']
    combined = simulate(strategy, always_cooperate, 100)['combined_total'] + \
               simulate(strategy, always_defect, 100)['combined_total']
    print(f"{name:<30} {coop:>10} {defect:>10} {combined:>12}")


# ============================================================================
# PART 8: Building a Strategy Selector
# ============================================================================

print("\n" + "=" * 70)
print("PART 8: Adaptive Strategy Selection")
print("=" * 70)

"""
In the real market, you don't know your opponent type upfront.
An adaptive strategy observes the opponent and adjusts.
"""

def adaptive_strategy(history: History) -> str:
    """
    Try to detect opponent type from history and respond optimally.
    Uses Bayesian-style reasoning.
    """
    if len(history) < 5:
        return tit_for_tat(history)  # Default to TFT

    # Count opponent defections
    opp_choices = [h[1] for h in history]
    defection_rate = opp_choices.count('D') / len(opp_choices)

    # Detect strategy
    if defection_rate < 0.1:
        # Likely Always-Cooperate: exploit with occasional defection
        return random.choice(['C', 'C', 'D'])
    elif defection_rate > 0.9:
        # Likely Always-Defect: minimize losses with TFT
        return tit_for_tat(history)
    else:
        # Unknown or mixed: be predictable
        return tit_for_tat(history)


print("\nAdaptive Strategy vs different opponents (100 rounds):\n")
for opp_name in ['Always Cooperate', 'Always Defect', 'Random', 'Tit-for-Tat']:
    sim = simulate(adaptive_strategy, strategies[opp_name], 100)
    print(f"  Adaptive vs {opp_name}: score = {sim['my_total']}")


# ============================================================================
# The Philosophical Conclusion
# ============================================================================

print("\n" + "=" * 70)
print("THE PRISONER'S DILEMMA LESSON")
print("=" * 70)

print("""
The dilemma reveals a fundamental truth about strategic interaction:

1. INDIVIDUAL RATIONALITY =/= COLLECTIVE RATIONALITY
   Doing what's best for yourself can make everyone worse off.

2. STABILITY =/= OPTIMALITY
   The Nash equilibrium (D, D) is stable -- no one wants to deviate --
   but (C, C) would make both players happier.

3. REPEAT INTERACTION CHANGES EVERYTHING
   In one-shot games, defection dominates.
   In iterated games, cooperation can emerge and be stable.

4. THE STRATEGY PATTERN IN PYTHON
   Different strategies as functions -- interchangeable at runtime --
   models how agents with different decision rules interact.

5. THE PARETO FRONTIER
   (C, C) Pareto dominates (D, D). But Pareto optimality is not
   the same as stability. The 'best' outcome requires trust.

In Python: functions as first-class objects let you model this elegantly.
The game is a data structure. The strategies are functions.
The simulation explores what rational agents actually do vs what they should do.
""")


# ============================================================================
# Demonstration
# ============================================================================

if __name__ == "__main__":
    print("\n" + "#" * 70)
    print("RUNNING DEMONSTRATION")
    print("#" * 70)

    # Quick tournament
    print("\nQuick Tournament Results:")
    ranking = tournament(strategies, 50)
    for i, (name, score) in enumerate(ranking[:3], 1):
        print(f"  {i}. {name}: {score} points")

    # The paradox
    print("\nThe Paradox:")
    print(f"  Best response to Always-Defect: Defect (score 100)")
    print(f"  But mutual cooperation would give: 300 each")
    print(f"  Individual rationality wins in the short term.")