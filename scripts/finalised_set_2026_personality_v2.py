# -*- coding: utf-8 -*-
"""Personality Q23-Q34 — Big Five, rewritten as forced choices.

Three defects in the previous version:

  1. Option E was "None of these" on all twelve items. It scored nothing, it was
     visibly the throwaway (13 characters against ~30 for the rest), and it made
     13 of the 60 options dead. A student could answer the whole section with it.
  2. The other options were shorthand notes rather than things a student would
     say — "Clearest, idea most reliable approach".
  3. Nothing cost anything, so the flattering answer was free to pick.

Now every item offers five real positions, each with a downside: the bold idea
might not work, the safe one is dull, asking others means depending on them,
finishing early means handing in less. There is no throwaway and no free answer.

LENGTH IS A DESIGN CONSTRAINT. A student reads 250 options in one sitting; if an
option runs to two lines they stop reading and pick on shape instead of meaning.
Target here is under 46 characters — roughly seven words — which is the band the
shortest existing sections already sit in.

Trait keys are the engine's: O openness, C conscientiousness, E extraversion,
A agreeableness, S emotional stability. An option with no weights is not an
abstention — it is a real low-trait position (keeping to yourself IS evidence
about extraversion) and stays in the denominator. There is no abstainIndex here
any more, because there is no longer an opt-out option.
"""

SOURCE = "forced-choice rewrite"

# (qid, situation, [(text, weights) x5], trait, facet, note)
PERSONALITY = [
    ("Q23", "One weekend to prepare a project on a topic you have never touched. By Saturday night you still have several directions. What do you do?",
     [("Chase the riskiest idea and see.", {"O": 3}),
      ("Take the safest one and finish.", {"C": 3}),
      ("Ask classmates which to pick.", {"E": 2, "A": 2}),
      ("Blend the best bits of each.", {"O": 2, "C": 1}),
      ("Stick with my first instinct.", {"S": 2, "C": 1})],
     "Openness", "Curiosity", ""),

    ("Q24", "Your school exhibition lets you build anything. Which do you go for?",
     [("Something nobody would expect.", {"O": 3}),
      ("Something I have tested and trust.", {"C": 3}),
      ("Something visitors join in with.", {"E": 3, "A": 2}),
      ("Something that simply looks striking.", {"O": 2, "A": 1}),
      ("Whatever I can finish in time.", {"C": 2, "S": 1})],
     "Openness", "Creativity", ""),

    ("Q25", "An assignment is due in two weeks and something unexpected takes your study days away.",
     [("Redo the schedule and follow it.", {"C": 3, "S": 1}),
      ("Rethink the whole approach first.", {"O": 2, "C": 1}),
      ("Work late and push through.", {"C": 2, "S": 1}),
      ("Work with others to keep up.", {"E": 2, "A": 2}),
      ("Hand in less, but on time.", {"S": 2, "C": 1})],
     "Conscientiousness", "Planning", ""),

    ("Q26", "An hour into a hard chapter and it still will not go in. What happens next?",
     [("Try a completely different method.", {"O": 2, "C": 1}),
      ("Leave it and come back later.", {"S": 2}),
      ("Get someone to explain it.", {"E": 2, "A": 1}),
      ("Keep drilling it until it sticks.", {"C": 3}),
      ("Move on and lose those marks.", {"S": 1})],
     "Conscientiousness", "Persistence", ""),

    ("Q27", "Halfway through organising a school event, several things go wrong at once.",
     [("Keep the lists and the order.", {"C": 3}),
      ("Throw new solutions at it.", {"O": 3}),
      ("Keep people calm and moving.", {"E": 3, "A": 2}),
      ("Fix the worst thing first.", {"S": 3, "C": 1}),
      ("Do my own bit properly and stop.", {"C": 2})],
     "Conscientiousness", "Responsibility", ""),

    ("Q28", "You arrive early at a workshop and everyone is already talking.",
     [("Walk over and join in.", {"E": 3, "A": 1}),
      ("Watch for a while first.", {"C": 1, "O": 1}),
      ("Wait for a topic I know.", {"E": 2, "A": 1}),
      ("Keep to myself until it starts.", {}),
      ("Ask someone a direct question.", {"E": 2, "C": 1})],
     "Extraversion", "Initiative",
     "Facet is Initiative rather than Confidence: this is about starting a conversation, which keeps it "
     "distinct from Q29."),

    ("Q29", "You joined a new class this term. By the end of week one, what is true?",
     [("I have met most of the class.", {"E": 3, "A": 2}),
      ("I have spoken when needed.", {"C": 2}),
      ("I have found two or three people.", {"E": 2, "A": 2}),
      ("I have kept my head down.", {"C": 2}),
      ("I have let people come to me.", {"S": 1})],
     "Extraversion", "Social Interaction", ""),

    ("Q30", "Two people in your team disagree about how to do the work.",
     [("Get them to hear each other.", {"A": 3, "S": 1}),
      ("Take the best of both ideas.", {"A": 2, "O": 2}),
      ("Let the group vote and move on.", {"C": 2}),
      ("Pick whichever is more practical.", {"C": 2, "S": 1}),
      ("Stay out of it entirely.", {"S": 1})],
     "Agreeableness", "Cooperation",
     "Facets are the reverse of the old set: old Q30 measured Empathy, old Q31 Cooperation. Mapped to match "
     "these scenarios."),

    ("Q31", "A teammate is falling behind and the deadline is close.",
     [("Back them, but let them do it.", {"A": 3, "S": 1}),
      ("Redivide the work fairly.", {"A": 2, "C": 2}),
      ("Take some of their load.", {"A": 2, "C": 2}),
      ("Finish mine and leave theirs.", {"C": 2}),
      ("Tell the teacher about it.", {"C": 1, "S": 1})],
     "Agreeableness", "Empathy", "See Q30 — facets swapped relative to the old set."),

    ("Q32", "You worked hard and the result came back far lower than you expected.",
     [("Go through my mistakes.", {"S": 3, "C": 2}),
      ("Ask where I went wrong.", {"S": 2, "A": 1, "E": 1}),
      ("Step away, then restart.", {"S": 2}),
      ("Accept it and carry on.", {"S": 1, "C": 1}),
      ("Let it bother me for a while.", {})],
     "Emotional Stability", "Emotional Control", ""),

    ("Q33", "Minutes before presenting, you realise an important part is missing.",
     [("Explain it another way, fast.", {"S": 3, "O": 1}),
      ("Pause, think, then continue.", {"S": 3, "C": 2}),
      ("Ask someone next to me.", {"A": 2, "E": 2, "S": 1}),
      ("Carry on and improvise.", {"S": 2, "C": 1}),
      ("Say it is missing and move on.", {"S": 2})],
     "Emotional Stability", "Composure", ""),

    ("Q34", "Four internships, same pay, same prospects. Which do you take?",
     [("One where I learn something new.", {"O": 3, "C": 2}),
      ("One where I make original things.", {"O": 3, "E": 1}),
      ("One where I work with people.", {"E": 3, "A": 3}),
      ("One where I make systems work.", {"C": 3, "S": 1}),
      ("One with clear hours and rules.", {"C": 2, "S": 2})],
     "Integrated Big Five", "Overall Personality Profile", ""),
]

NOTE = (
    "Every item now offers five real positions with a downside each — the bold idea may not work, the safe one is "
    "dull, asking others means depending on them, finishing early means handing in less. The old 'None of these' "
    "opt-out is gone, which removes 13 dead options and the risk of a student answering the whole section with "
    "it. An option carrying no weights is NOT an abstention: keeping to yourself is real evidence about "
    "extraversion, so it stays in the denominator and correctly pulls the trait down."
)
