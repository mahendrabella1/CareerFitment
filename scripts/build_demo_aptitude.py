#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Builds the class 11-12 demo APTITUDE bank.

The client workbook has no aptitude tab, so every question here is authored.
The brief was aptitude "in all aspects, to think deep", so the bank covers six
domains and is weighted towards multi-step items rather than recall:

    Verbal Reasoning       argument, inference and precise language
    Numerical Reasoning    multi-step arithmetic, ratio, rate and percentage
    Logical Reasoning      deduction, ordering, conditional logic
    Abstract Reasoning     rule-finding in sequences
    Spatial Reasoning      mental manipulation of shapes and solids
    Data Interpretation    reading and combining figures from a table

15 questions per sitting, three parallel sets, split
    Verbal 3 - Numerical 3 - Logical 3 - Abstract 2 - Spatial 2 - Data 2

That split matters for the report. The engine shrinks each domain score toward
the student's overall rate in proportion to how few items back it
(scoring60.ts), so 2-3 items per domain gives a readable profile shape, where
the class 9-10 bank's single item per domain could only ever print 0 or 100.

Difficulty is scored by weight (easy 1, medium 2, hard 3), so a hard item
correctly counts for more than an easy one.

Every `correct` index is verified by scripts/verify_demo_aptitude.py, which
re-derives the numerical and data answers arithmetically rather than trusting
what is typed here.

Writes:  data/demo-11-12/aptitude.json

Run:     python scripts/build_demo_aptitude.py
"""

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.join(HERE, "..")
DATA = os.path.join(PROJECT, "data", "demo-11-12")


def q(domain, difficulty, text, options, correct, why, media=None):
    return {
        "type": "mcq",
        "format": "text",
        "domain": domain,
        "difficulty": difficulty,
        "text": text,
        "options": options,
        "svgOptions": False,
        "correct": correct,
        "media": media,
        # Kept server-side only. The generate route strips every answer key
        # before questions reach the browser; this exists so a reviewer can
        # check the bank without re-deriving each item.
        "why": why,
    }


SET_1 = [
    # ---- Verbal -----------------------------------------------------------
    q("Verbal", "medium",
      "A study finds that students who eat breakfast score higher in exams. The principal concludes that serving breakfast will raise the school's results. Which statement, if true, most weakens this conclusion?",
      ["Some students dislike the food that would be served",
       "Students who eat breakfast also tend to come from homes with settled routines and more study support",
       "The study covered only 400 students",
       "Breakfast improves concentration in the first hour of the day"],
      1,
      "The conclusion assumes breakfast CAUSES the higher scores. A common third cause behind both is the classic confound and directly undermines causation. The others question scale or add supporting detail without touching the causal claim."),
    q("Verbal", "hard",
      "'The minister denied that the report had been suppressed.' Which of the following is NOT necessarily implied by this sentence?",
      ["A report exists",
       "Someone had suggested the report was suppressed",
       "The minister spoke about the report",
       "The report was not suppressed"],
      3,
      "A denial is a claim, not proof. Everything else follows from the sentence: the report exists, an accusation prompted the denial, and the minister spoke. Whether the suppression happened is exactly what is left open."),
    q("Verbal", "medium",
      "Choose the pair whose relationship is most similar to CAUTIOUS : RECKLESS.",
      ["Frugal : Thrifty", "Diligent : Careless", "Brave : Heroic", "Silent : Quiet"],
      1,
      "Cautious and reckless are opposites along one dimension of behaviour. Diligent and careless are opposites in the same way. The other three pairs are near-synonyms."),
    # ---- Numerical --------------------------------------------------------
    q("Numerical", "medium",
      "A shopkeeper marks a jacket 40% above cost, then gives a 25% discount on the marked price. What is the profit percentage?",
      ["5%", "10%", "15%", "12.5%"],
      0,
      "Cost 100, marked 140, sold at 140 x 0.75 = 105. Profit = 5 on 100 = 5%."),
    q("Numerical", "hard",
      "A tank is filled by pipe A in 12 hours and by pipe B in 18 hours. Both are opened together, but pipe B is closed 3 hours before the tank is full. How many hours does filling take in total?",
      ["8 hours", "8.4 hours", "9 hours", "7.5 hours"],
      1,
      "Let total time be T. A runs T hours, B runs T-3. T/12 + (T-3)/18 = 1. Multiply by 36: 3T + 2(T-3) = 36, so 5T = 42 and T = 8.4 hours."),
    q("Numerical", "hard",
      "The average age of 11 players is 28 years. When the coach's age is included, the average rises by 1 year. How old is the coach?",
      ["39", "40", "38", "42"],
      1,
      "Total of 11 players = 308. New average 29 over 12 people = 348. Coach = 348 - 308 = 40."),
    # ---- Logical ----------------------------------------------------------
    q("Logical", "medium",
      "All engineers in a firm can code. Some who can code are also designers. Which conclusion definitely follows?",
      ["Some engineers are designers",
       "All designers can code",
       "Some people who can code are engineers",
       "No designer is an engineer"],
      2,
      "'All engineers can code' guarantees that engineers form part of the coding group, so some coders are engineers. The overlap between coders and designers need not include any engineer, so the first is not guaranteed."),
    q("Logical", "hard",
      "Five friends sit in a row of five seats. Ravi is in the middle seat. Sita is immediately to Ravi's right. Uma is immediately to Ravi's left. Tara is at the far left end. Where does Vik sit?",
      ["Second from the left", "At the far right end", "In the middle", "Immediately left of Sita"],
      1,
      "Ravi is seat 3, so Uma is 2 and Sita is 4. Tara is seat 1. The only seat left for Vik is 5, the far right end."),
    q("Logical", "medium",
      "If it rains, the match is cancelled. The match was not cancelled. What follows?",
      ["It rained", "It did not rain", "The match was played in rain", "Nothing follows"],
      1,
      "Denying the consequent of 'if P then Q' gives not-P. Since the match was not cancelled, it did not rain."),
    # ---- Abstract ---------------------------------------------------------
    q("Abstract", "medium",
      "Find the next term: 2, 6, 12, 20, 30, ?",
      ["36", "40", "42", "44"],
      2,
      "Differences are 4, 6, 8, 10, so the next difference is 12: 30 + 12 = 42. Equivalently n(n+1) for n = 1..6 gives 42."),
    q("Abstract", "hard",
      "Find the next term: 3, 7, 16, 35, 74, ?",
      ["135", "142", "153", "157"],
      2,
      "Each term is twice the previous plus a step that grows by 1: 3x2+1=7, 7x2+2=16, 16x2+3=35, 35x2+4=74, 74x2+5=153."),
    # ---- Spatial ----------------------------------------------------------
    q("Spatial", "medium",
      "A cube is painted red on all faces, then cut into 27 identical smaller cubes. How many small cubes have exactly two faces painted?",
      ["8", "12", "6", "24"],
      1,
      "In a 3x3x3 cube the edge positions (not corners) have exactly two painted faces. A cube has 12 edges with one such cube each, so 12."),
    q("Spatial", "hard",
      "A square sheet is folded in half twice (left over right, then top over bottom), and a single hole is punched through all layers near the centre of the folded square. How many holes are there when it is unfolded?",
      ["2", "3", "4", "8"],
      2,
      "Two folds double the layers twice: 1 -> 2 -> 4 layers. One punch through 4 layers gives 4 holes."),
    # ---- Data Interpretation ---------------------------------------------
    q("Data Interpretation", "medium",
      "A school records subject enrolments: Physics 120, Chemistry 150, Biology 90, Maths 140. Students may take more than one subject and the school has 300 students. What percentage of total enrolments is Chemistry? (Round to the nearest whole number.)",
      ["30%", "50%", "25%", "34%"],
      0,
      "Total enrolments = 120 + 150 + 90 + 140 = 500. Chemistry share = 150/500 = 30%. The 300-student figure is a distractor - the question asks about enrolments, not students."),
    q("Data Interpretation", "hard",
      "A shop's sales were Rs 40,000 in April and Rs 50,000 in May; costs were Rs 30,000 and Rs 36,000. In which month was the profit MARGIN (profit as a percentage of sales) higher, and by how many percentage points?",
      ["April, by 3 points", "May, by 3 points", "May, by 5 points", "April, by 5 points"],
      1,
      "April margin = 10,000/40,000 = 25%. May margin = 14,000/50,000 = 28%. May is higher by 3 percentage points."),
]

SET_2 = [
    # ---- Verbal -----------------------------------------------------------
    q("Verbal", "hard",
      "A city introduced a congestion charge and traffic fell 18%. Officials credited the charge. Which finding would most strengthen their claim?",
      ["Traffic also fell 17% in a comparable city with no charge that year",
       "Public transport use rose sharply in the same period",
       "Traffic in comparable cities without the charge was unchanged that year",
       "The charge raised significant revenue"],
      2,
      "A control group that did NOT change is what isolates the charge as the cause. Option 1 would weaken the claim; rising transport use is consistent with either explanation; revenue says nothing about traffic."),
    q("Verbal", "medium",
      "Which word is closest in meaning to EPHEMERAL?",
      ["Fragile", "Short-lived", "Insubstantial", "Unpredictable"],
      1,
      "Ephemeral specifically means lasting a very short time. Fragile and insubstantial concern strength or substance rather than duration."),
    q("Verbal", "medium",
      "'Few students passed the test' and 'A few students passed the test' differ because:",
      ["They mean the same thing",
       "'Few' emphasises how small the number is; 'a few' emphasises that there were some",
       "'A few' means fewer than 'few'",
       "'Few' is plural and 'a few' is singular"],
      1,
      "'Few' carries a negative emphasis (hardly any), while 'a few' carries a positive one (some). The distinction is emphasis, not count."),
    # ---- Numerical --------------------------------------------------------
    q("Numerical", "medium",
      "A train travels 60 km at 30 km/h and the next 60 km at 60 km/h. What is its average speed for the whole journey?",
      ["45 km/h", "40 km/h", "50 km/h", "48 km/h"],
      1,
      "Time = 60/30 + 60/60 = 2 + 1 = 3 hours for 120 km. Average = 120/3 = 40 km/h. The mean of the two speeds (45) is the trap."),
    q("Numerical", "hard",
      "The price of a share falls 20% and then rises 20%. Compared with its original price, it is now:",
      ["Unchanged", "4% lower", "4% higher", "2% lower"],
      1,
      "100 -> 80 -> 96. That is 4% below the original, because the rise applies to the smaller base."),
    q("Numerical", "hard",
      "A sum doubles in 8 years at simple interest. In how many years will it become five times itself at the same rate?",
      ["24 years", "32 years", "40 years", "20 years"],
      1,
      "Doubling means interest equal to the principal in 8 years, so the rate is 12.5% per year. Five times means 4 x principal as interest, needing 4 x 8 = 32 years."),
    # ---- Logical ----------------------------------------------------------
    q("Logical", "hard",
      "Three boxes are labelled 'apples', 'oranges' and 'apples and oranges'. Every label is wrong. You may draw one fruit, without looking, from exactly one box. Which box should you draw from to work out all three contents?",
      ["The box labelled 'apples'", "The box labelled 'oranges'",
       "The box labelled 'apples and oranges'", "Any box gives the answer"],
      2,
      "That box cannot be mixed, so it is purely one fruit and the single draw names it. Each other label then has only one wrong option left, which fixes the remaining two. Drawing from either other box leaves the mixed box ambiguous."),
    q("Logical", "medium",
      "Statement: 'Only members may enter the library.' Which of the following must be true?",
      ["All members enter the library",
       "Anyone who entered the library is a member",
       "Non-members sometimes enter",
       "Members must enter the library"],
      1,
      "'Only members may enter' restricts entry to members - so anyone inside is a member. It does not oblige members to enter."),
    q("Logical", "medium",
      "In a certain code, MONDAY is written as NPOEBZ. How is FRIDAY written?",
      ["GSJEBZ", "GSJFBZ", "GQJEBZ", "GSIEBZ"],
      0,
      "Each letter shifts forward by one: F->G, R->S, I->J, D->E, A->B, Y->Z, giving GSJEBZ."),
    # ---- Abstract ---------------------------------------------------------
    q("Abstract", "medium",
      "Find the missing term: 1, 4, 9, 16, 25, ?, 49",
      ["30", "36", "40", "42"],
      1,
      "Perfect squares: 6 squared = 36."),
    q("Abstract", "hard",
      "Find the next term: 2, 3, 5, 9, 17, 33, ?",
      ["49", "65", "64", "66"],
      1,
      "Each term is the previous doubled minus 1: 2x2-1=3, 3x2-1=5, 5x2-1=9, 9x2-1=17, 17x2-1=33, 33x2-1=65."),
    # ---- Spatial ----------------------------------------------------------
    q("Spatial", "hard",
      "A 4x4x4 cube is painted on all outer faces and cut into 64 unit cubes. How many unit cubes have NO face painted?",
      ["8", "16", "24", "4"],
      0,
      "The unpainted cubes form the inner 2x2x2 core: 8 cubes."),
    q("Spatial", "medium",
      "A standard die has opposite faces summing to 7. If the top face shows 2 and the face towards you shows 3, what is on the bottom face?",
      ["4", "5", "3", "6"],
      1,
      "Opposite faces sum to 7, so the bottom is 7 - 2 = 5. The front face is irrelevant to the question."),
    # ---- Data Interpretation ---------------------------------------------
    q("Data Interpretation", "hard",
      "A company's revenue was Rs 200 cr in 2023 and Rs 250 cr in 2024. Its headcount went from 400 to 625. Revenue per employee has:",
      ["Risen by 20%", "Fallen by 20%", "Stayed the same", "Fallen by 25%"],
      1,
      "2023: 200/400 = Rs 0.50 cr per employee. 2024: 250/625 = Rs 0.40 cr. That is a fall of 0.10 on 0.50 = 20%."),
    q("Data Interpretation", "medium",
      "Monthly rainfall (mm): Jun 180, Jul 240, Aug 200, Sep 100. The monsoon average across these four months is closest to:",
      ["170 mm", "180 mm", "160 mm", "200 mm"],
      1,
      "Total = 720 over 4 months = 180 mm."),
]

SET_3 = [
    # ---- Verbal -----------------------------------------------------------
    q("Verbal", "medium",
      "An advertisement claims: 'Nine out of ten dentists recommend this toothpaste.' Which question most usefully tests the claim?",
      ["How much does the toothpaste cost?",
       "How were the dentists selected, and recommended over what alternative?",
       "How many dentists are there in total?",
       "Does the toothpaste taste pleasant?"],
      1,
      "Sampling method and the comparison baseline are what determine whether the statistic means anything. Cost, total population and taste do not test the claim."),
    q("Verbal", "hard",
      "Which sentence contains a logical, rather than grammatical, flaw?",
      ["Each of the students have submitted their work",
       "Since every successful person reads books, reading books will make you successful",
       "Running quickly, the bus was missed by him",
       "Neither of the answers are correct"],
      1,
      "The second reverses a conditional - a property of successful people is treated as a cause of success. The others are grammatical errors (agreement, dangling modifier, agreement)."),
    q("Verbal", "medium",
      "PAINTER : CANVAS as SCULPTOR : ?",
      ["Chisel", "Marble", "Statue", "Gallery"],
      1,
      "A painter works ON canvas, the material worked upon. A sculptor works on marble. The chisel is the tool and the statue the finished product."),
    # ---- Numerical --------------------------------------------------------
    q("Numerical", "hard",
      "Two friends invest Rs 30,000 and Rs 45,000 in a business. The first stays 12 months, the second 6 months. If the profit is Rs 35,000, what is the first friend's share?",
      ["Rs 20,000", "Rs 15,000", "Rs 17,500", "Rs 22,500"],
      0,
      "Capital-months: 30,000x12 = 360,000 and 45,000x6 = 270,000, a ratio of 4:3. The first friend takes 4/7 of 35,000 = Rs 20,000."),
    q("Numerical", "medium",
      "A mixture of 60 litres has milk and water in the ratio 7:3. How much water must be added to make the ratio 7:5?",
      ["12 litres", "10 litres", "15 litres", "8 litres"],
      0,
      "Milk = 42, water = 18. For 7:5 with milk fixed at 42, water must be 30. So add 12 litres."),
    q("Numerical", "hard",
      "The population of a town rises 10% in the first year and falls 10% in the second. If it is now 49,500, what was it originally?",
      ["50,000", "49,000", "50,505", "51,000"],
      0,
      "P x 1.1 x 0.9 = P x 0.99 = 49,500, so P = 50,000."),
    # ---- Logical ----------------------------------------------------------
    q("Logical", "medium",
      "Five books are stacked. Biology is at the top and English directly below it. Physics is above Chemistry, and Maths is below Chemistry. Which book is at the bottom?",
      ["Chemistry", "Maths", "Physics", "English"],
      1,
      "Biology is 1 and English 2. The remaining three must run Physics, Chemistry, Maths downward, so Maths is at the bottom."),
    q("Logical", "hard",
      "Three people make one true and one false statement each. A says: 'B lies. C tells the truth.' If exactly one of A's statements is true, which must be the case?",
      ["B lies and C lies",
       "B tells the truth and C tells the truth",
       "Either B lies and C lies, or B tells the truth and C tells the truth",
       "B tells the truth and C lies"],
      2,
      "Exactly one of A's two statements is true. If 'B lies' is the true one, then 'C tells the truth' is false, so C lies - giving B lies and C lies. If 'C tells the truth' is the true one, then 'B lies' is false, so B tells the truth - giving both truthful. Both scenarios satisfy the condition."),
    q("Logical", "medium",
      "Pointing at a photograph, a man says: 'She is the daughter of my grandfather's only son.' How is she related to him?",
      ["His niece", "His sister", "His daughter", "His cousin"],
      1,
      "The grandfather's only son is the man's father. The father's daughter is the man's sister."),
    # ---- Abstract ---------------------------------------------------------
    q("Abstract", "hard",
      "Find the next term: 1, 2, 6, 24, 120, ?",
      ["600", "720", "480", "840"],
      1,
      "Factorials: each term is multiplied by the next integer. 120 x 6 = 720."),
    q("Abstract", "medium",
      "Find the odd one out: 8, 27, 64, 100, 125",
      ["27", "64", "100", "125"],
      2,
      "8, 27, 64 and 125 are perfect cubes (2, 3, 4 and 5 cubed). 100 is a perfect square but not a cube."),
    # ---- Spatial ----------------------------------------------------------
    q("Spatial", "medium",
      "How many triangles are there in a triangle divided by joining the midpoints of its three sides?",
      ["4", "5", "6", "8"],
      1,
      "The four small triangles, plus the original large one, gives 5."),
    q("Spatial", "hard",
      "A cube has faces numbered 1 to 6. Three views show: (1 top, 2 front, 3 right), (3 top, 1 front, 5 right), (5 top, 2 front, 4 right). Which number is opposite 2?",
      ["4", "6", "1", "3"],
      1,
      "Face 2 appears as front in views 1 and 3 alongside 1, 3, 5 and 4 - so 2 is adjacent to 1, 3, 4 and 5. The only remaining face is 6, so 6 is opposite 2."),
    # ---- Data Interpretation ---------------------------------------------
    q("Data Interpretation", "hard",
      "Marks in a class: 20 students averaged 60; another 30 students averaged 80. What is the combined average?",
      ["70", "72", "75", "68"],
      1,
      "Total = 20x60 + 30x80 = 1200 + 2400 = 3600 over 50 students = 72. The simple mean of 60 and 80 (70) is the trap."),
    q("Data Interpretation", "medium",
      "A budget allocates: Salaries 45%, Rent 15%, Marketing 20%, Other 20%. If Rent is Rs 3 lakh, what is the Marketing budget?",
      ["Rs 4 lakh", "Rs 5 lakh", "Rs 6 lakh", "Rs 3.5 lakh"],
      0,
      "Rent 15% = 3 lakh, so 1% = 0.2 lakh and the total is 20 lakh. Marketing 20% = 4 lakh."),
]


def main():
    bank = {"11-12-demo": {"Set 1": SET_1, "Set 2": SET_2, "Set 3": SET_3}}
    os.makedirs(DATA, exist_ok=True)
    path = os.path.join(DATA, "aptitude.json")
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(bank, fh, ensure_ascii=False, indent=1)

    print("Aptitude bank")
    for name, qs in bank["11-12-demo"].items():
        doms = {}
        diff = {}
        for item in qs:
            doms[item["domain"]] = doms.get(item["domain"], 0) + 1
            diff[item["difficulty"]] = diff.get(item["difficulty"], 0) + 1
        print("  {}: {} questions".format(name, len(qs)))
        print("     domains: " + ", ".join("{} {}".format(k, v) for k, v in sorted(doms.items())))
        print("     difficulty: " + ", ".join("{} {}".format(k, v) for k, v in sorted(diff.items())))
    print()
    print("Wrote", os.path.relpath(path, PROJECT))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
