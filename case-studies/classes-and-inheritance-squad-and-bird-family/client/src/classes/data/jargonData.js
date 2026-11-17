export const jargonExplanations = {
  class: {
    title: "Class",
    subtitle: "The Official Signing Form",
    summary: "A class is the official player-signing form the team designs once — blank fields for Name, Age, and Role. It isn't a player itself, just the form every player gets signed on.",
    details: [
      "Before this, the manager handwrote a fresh 3-line contract for every player. Now the form is designed once, and stays the same forever.",
      "The form bundles what a player HAS (name, age, role) with what happens when someone signs it (the __init__ step below)."
    ],
    example: "class Player:\n    # The signing form — not a player yet, just the blank fields"
  },
  init: {
    title: "__init__ Method",
    subtitle: "What Happens the Moment a Form Is Signed",
    summary: "The instant someone hands in a filled-out copy of the form, this runs automatically — taking their name, age, and role and filing them onto that player's own record.",
    details: [
      "The double underscores just mean 'Python runs this automatically' — the manager never calls it by hand.",
      "It takes the details handed in (name, age, role) and writes them onto the specific copy being signed right now."
    ],
    example: "def __init__(self, name, age, role):\n    self.name = name"
  },
  self: {
    title: "self Keyword",
    subtitle: "Whoever's Copy We're Filling In Right Now",
    summary: "'self' means 'this specific player's copy of the form.' While Rohan's form is being filled, self means Rohan. While Virat's is being filled, self means Virat — the two copies never get mixed up.",
    details: [
      "Every signed player gets their own separate copy of the form, filled with their own details.",
      "That's why Rohan's age changing never touches Virat's record — self always points to one player's own copy."
    ],
    example: "self.name = name  # writes onto THIS player's own copy of the form"
  }
};
