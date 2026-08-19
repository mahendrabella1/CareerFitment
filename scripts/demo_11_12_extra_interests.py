#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AUTHORED interest questions for the class 11-12 demo.

Why these exist
---------------
The client's 24 interest questions are structurally lopsided. Every single one
carries exactly one Arts (D), one Business (E) and one Science (G) option, plus
two drawn from Engineering, IT, Health and Public Services. Sport/Hospitality
(H) appears nowhere at all.

That is not a rounding error, it is a measurable bias in the instrument. A
student who picks the SAME cluster every time it is offered - the strongest
possible signal they can send - ended up with:

    D / E / G   ceiling 71     (offered 9-12 times per paper)
    A B C F     ceiling 57-67  (offered 4-6 times)
    H           ceiling 50     (offered 0 times in the client bank)

So a student genuinely, maximally drawn to hospitality could never outscore a
student mildly drawn to business. Chef, Hotel Manager, Event Manager, Travel
Consultant, Sports Coach and Sports Scientist were unreachable regardless of
how anybody answered.

What these questions do
-----------------------
Every question below offers exactly the five STARVED clusters:

    A  Core Engineering & Infrastructure
    B  Information Technology
    C  Health Science
    F  Human & Public Services
    H  Sports, Hospitality & Lifestyle

None offers D, E or G. That is deliberate: those three are already saturated by
the client's questions, and adding more would widen the gap rather than close
it. Paired with the 6-client + 6-authored set construction in
build_demo_11_12.py, this brings every cluster to 6-10 offers per paper and the
ceiling spread down from 19 points to about 4.

An earlier version of this file had only ten questions and spread their options
across all eight clusters, which reinforced the very imbalance it was meant to
correct (D6 E7 G6 against F4 A3).

Format matches the workbook: five options, one cluster each at +5, a RIASEC
primary at 3 and an optional secondary at 1. Example careers use the scoring
engine's own vocabulary - see demo_11_12_professions.py for why that matters.

Kept separate from the transcription in build_demo_11_12.py so a reviewer can
always tell the client's questions from ours. If the client supplies their own
H-bearing questions, remove from here in equal measure.
"""

# (question, [(option text, cluster, riasec primary, riasec secondary, careers)])
# Cluster order is rotated between questions so the same cluster is not always
# option A - students pattern-match faster than people expect.
EXTRA_INTERESTS = [
    ("Q25", "Your school is running a large public event and you can take charge of one part of it. Which would you choose?", [
        ("Build the rigging, the wiring and the power supply.",
         "A", "R", "I", ["Electrical Engineer", "Construction Manager", "Engineer"]),
        ("Build the registration website and a live dashboard for the day.",
         "B", "I", "R", ["Software Engineer", "Mobile App Developer", "Data Analyst"]),
        ("Organise the first-aid cover and make sure the crowd stays safe.",
         "C", "S", "R", ["Paramedic", "Nurse", "Doctor"]),
        ("Recruit and brief the volunteers, and make sure nobody is left out.",
         "F", "S", "E", ["Social Worker", "Teacher", "Public Speaker"]),
        ("Run the catering, the seating and how guests are looked after.",
         "H", "S", "E", ["Event Manager", "Hotel Manager", "Chef"]),
    ]),
    ("Q26", "A hospital wants to improve what it is like to be a patient there. Which part would you want to work on?", [
        ("Follow the clinicians and understand the medical steps a patient goes through.",
         "C", "S", "I", ["Doctor", "Nurse", "Radiologist"]),
        ("Build an app that shows live waiting times and appointment updates.",
         "B", "I", "R", ["Software Engineer", "Mobile App Developer", "UX Designer"]),
        ("Talk to people and their families about what actually distresses them during a visit.",
         "F", "S", "A", ["Counsellor", "Social Worker", "Psychologist"]),
        ("Fix the lifts, the ventilation and the equipment that keeps failing.",
         "A", "R", "I", ["Electrical Engineer", "Biomedical Engineer", "Engineer"]),
        ("Improve the food, the comfort and the everyday hospitality of a long stay.",
         "H", "S", "C", ["Hotel Manager", "Chef", "Dietician"]),
    ]),
    ("Q27", "You get a summer working with a professional sports team. Which role appeals most?", [
        ("Work with the physiotherapists on injury recovery and rehabilitation.",
         "C", "S", "R", ["Physiotherapist", "Doctor", "Occupational Therapist"]),
        ("Build the performance-tracking software the coaches use.",
         "B", "I", "R", ["Software Engineer", "Data Scientist", "Data Analyst"]),
        ("Coach the players and plan the training sessions.",
         "H", "S", "E", ["Sports Coach", "Fitness Trainer", "Sports Scientist"]),
        ("Build and maintain the equipment, kit and training machines.",
         "A", "R", "I", ["Product Engineer", "Mechanical Engineer", "Engineer"]),
        ("Run the outreach programme that reaches children from poorer schools.",
         "F", "S", "E", ["Teacher", "Social Worker", "Public Speaker"]),
    ]),
    ("Q28", "A new restaurant is opening and the owner asks for your help. Which part would you take on?", [
        ("Develop the menu, the kitchen workflow and what the meal feels like to eat.",
         "H", "S", "R", ["Chef", "Hotel Manager", "Event Manager"]),
        ("Install the extraction, the refrigeration and the gas systems.",
         "A", "R", "I", ["Mechanical Engineer", "Electrical Engineer", "Engineer"]),
        ("Build the online ordering and delivery system.",
         "B", "I", "R", ["Software Engineer", "Mobile App Developer", "Cloud Engineer"]),
        ("Make sure the food is safe, hygienic and nutritionally sound.",
         "C", "I", "S", ["Nutritionist", "Public Health Specialist", "Doctor"]),
        ("Hire and train the staff, and make it a decent place to work.",
         "F", "S", "E", ["HR Manager", "Technical Trainer", "Teacher"]),
    ]),
    ("Q29", "Your city wants more people to be physically active. Which approach would you want to lead?", [
        ("Design and build safe cycling lanes and running routes.",
         "A", "R", "I", ["Civil Engineer", "Structural Engineer", "Construction Manager"]),
        ("Organise leagues, fitness events and community coaching.",
         "H", "S", "E", ["Sports Coach", "Fitness Trainer", "Event Manager"]),
        ("Screen people for the health problems that stop them exercising.",
         "C", "S", "I", ["Doctor", "Physiotherapist", "Public Health Specialist"]),
        ("Work with schools and neighbourhoods to reach the people being left out.",
         "F", "S", "E", ["Social Worker", "Teacher", "Civil Services Officer"]),
        ("Build an app that tracks activity and rewards people for it.",
         "B", "I", "R", ["Software Engineer", "Mobile App Developer", "Data Scientist"]),
    ]),
    ("Q30", "A travel company wants to grow. Which part of the problem interests you most?", [
        ("Design the trips themselves and what guests experience day to day.",
         "H", "S", "E", ["Travel Consultant", "Hotel Manager", "Event Manager"]),
        ("Rebuild the online booking platform so it stops losing bookings.",
         "B", "I", "R", ["Software Engineer", "Cloud Engineer", "UX Designer"]),
        ("Keep the vehicles, boats and equipment maintained and safe.",
         "A", "R", "I", ["Mechanical Engineer", "Automation Engineer", "Engineer"]),
        ("Prepare travellers for altitude, heat and the illnesses they may meet.",
         "C", "S", "I", ["Doctor", "Nurse", "Public Health Specialist"]),
        ("Work with local communities so they benefit rather than being displaced.",
         "F", "S", "E", ["Social Worker", "Policy Analyst", "Civil Services Officer"]),
    ]),
    ("Q31", "You are given a small budget to improve health in a rural district. What would you do first?", [
        ("Run clinics and treat people directly.",
         "C", "S", "R", ["Doctor", "Nurse", "Paramedic"]),
        ("Train local volunteers and organise the community around it.",
         "F", "S", "E", ["Public Health Specialist", "Social Worker", "Teacher"]),
        ("Build the water supply and sanitation that stops people getting ill.",
         "A", "R", "I", ["Civil Engineer", "Environmental Engineer", "Engineer"]),
        ("Set up a simple digital records system that works without reliable internet.",
         "B", "I", "R", ["Software Engineer", "Network Engineer", "Data Analyst"]),
        ("Start sports and fitness programmes so people are active in the first place.",
         "H", "S", "E", ["Sports Coach", "Dietician", "Fitness Trainer"]),
    ]),
    ("Q32", "A hotel chain asks for your ideas. Which would you most want to work on?", [
        ("How guests are looked after from the moment they arrive to the moment they leave.",
         "H", "S", "E", ["Hotel Manager", "Event Manager", "Travel Consultant"]),
        ("Re-engineering the heating, water and power systems so it uses far less energy.",
         "A", "R", "I", ["Electrical Engineer", "Renewable Energy Engineer", "Engineer"]),
        ("The app that handles check-in, keys and room service.",
         "B", "I", "R", ["Software Engineer", "Mobile App Developer", "Cloud Engineer"]),
        ("The spa and wellness side, and getting the health claims right.",
         "C", "S", "I", ["Physiotherapist", "Nutritionist", "Occupational Therapist"]),
        ("Staff welfare, training and progression for people who rarely get either.",
         "F", "S", "E", ["HR Manager", "Technical Trainer", "Social Worker"]),
    ]),
    ("Q33", "You have a year to work on something that makes everyday life better. Which problem would you pick?", [
        ("A physical product that solves a practical annoyance properly.",
         "A", "R", "I", ["Product Engineer", "Mechanical Engineer", "Robotics Engineer"]),
        ("A piece of software that thousands of people would use every day.",
         "B", "I", "R", ["Software Engineer", "Mobile App Developer", "Data Scientist"]),
        ("A health condition that affects a great many people.",
         "C", "S", "I", ["Doctor", "Nurse", "Pharmacist"]),
        ("Something that is going wrong between people in your community.",
         "F", "S", "A", ["Social Worker", "Counsellor", "Teacher"]),
        ("A place people genuinely enjoy visiting - a cafe, a gym, a venue.",
         "H", "E", "S", ["Chef", "Hotel Manager", "Fitness Trainer"]),
    ]),
    ("Q34", "Which of these achievements would you be proudest of?", [
        ("The machine I built has run for ten years without failing.",
         "A", "R", "I", ["Mechanical Engineer", "Automation Engineer", "Engineer"]),
        ("The software I wrote handles a million people without breaking.",
         "B", "I", "R", ["Software Engineer", "Cloud Engineer", "Network Engineer"]),
        ("The treatment I helped develop is now standard practice.",
         "C", "I", "S", ["Doctor", "Pharmacist", "Surgeon"]),
        ("The programme I ran changed things for my community.",
         "F", "S", "E", ["Social Worker", "Civil Services Officer", "Teacher"]),
        ("People travel across the city to eat at the restaurant I opened.",
         "H", "E", "S", ["Chef", "Hotel Manager", "Event Manager"]),
    ]),
    ("Q35", "The school canteen is crowded, slow and the food is poor. Which part would you fix?", [
        ("Rebuild the servery counter and replace the equipment that jams.",
         "A", "R", "I", ["Product Engineer", "Mechanical Engineer", "Engineer"]),
        ("Build a pre-order app so the queue stops forming at all.",
         "B", "I", "R", ["Software Engineer", "Mobile App Developer", "UX Designer"]),
        ("Rework the recipes so they are nutritionally sound.",
         "C", "I", "S", ["Nutritionist", "Dietician", "Public Health Specialist"]),
        ("Make sure the students who cannot afford it still eat properly.",
         "F", "S", "E", ["Social Worker", "Counsellor", "Civil Services Officer"]),
        ("Change what is cooked and how the room feels to sit in.",
         "H", "S", "E", ["Chef", "Hotel Manager", "Event Manager"]),
    ]),
    ("Q36", "A relief camp is set up after a flood. Where would you be most useful?", [
        ("Getting shelter, clean water and power working.",
         "A", "R", "I", ["Civil Engineer", "Electrical Engineer", "Environmental Engineer"]),
        ("Set up the digital register that tracks who is here and what they need.",
         "B", "I", "R", ["Software Engineer", "Data Analyst", "Network Engineer"]),
        ("Treating the injured and preventing disease spreading.",
         "C", "S", "R", ["Doctor", "Nurse", "Paramedic"]),
        ("Sitting with families, finding the missing and calming the panic.",
         "F", "S", "A", ["Counsellor", "Social Worker", "Psychologist"]),
        ("Running the kitchen and getting three meals a day to everybody.",
         "H", "S", "E", ["Chef", "Event Manager", "Hotel Manager"]),
    ]),
    ("Q37", "A care home for elderly residents asks for help. Which would you take on?", [
        ("Fit safe flooring, handrails and lifts that actually work.",
         "A", "R", "I", ["Civil Engineer", "Product Engineer", "Construction Manager"]),
        ("Install sensors and software that detect a fall immediately.",
         "B", "I", "R", ["Software Engineer", "Cybersecurity Analyst", "Data Scientist"]),
        ("Manage the medication, mobility and daily health of residents.",
         "C", "S", "R", ["Nurse", "Doctor", "Physiotherapist"]),
        ("Spend time with residents who have nobody visiting them.",
         "F", "S", "A", ["Social Worker", "Counsellor", "Psychologist"]),
        ("Improve the meals, the outings and what there is to look forward to.",
         "H", "S", "E", ["Chef", "Event Manager", "Dietician"]),
    ]),
    ("Q38", "Your school wants to cut the waste it produces. Which part would you lead?", [
        ("Build the bins, the composting and the collection system.",
         "A", "R", "I", ["Environmental Engineer", "Product Engineer", "Engineer"]),
        ("Track what is thrown away with sensors and a dashboard.",
         "B", "I", "R", ["Data Scientist", "Software Engineer", "Data Analyst"]),
        ("Study what the waste is doing to health in the surrounding area.",
         "C", "I", "S", ["Public Health Specialist", "Doctor", "Nurse"]),
        ("Persuade students to actually change what they do.",
         "F", "S", "E", ["Public Speaker", "Teacher", "Social Worker"]),
        ("Change what the canteen buys, cooks and serves.",
         "H", "S", "C", ["Chef", "Hotel Manager", "Dietician"]),
    ]),
    ("Q39", "Your city is hosting a marathon. Which job would you want?", [
        ("Build the timing gantries, barriers and road closures.",
         "A", "R", "I", ["Civil Engineer", "Structural Engineer", "Construction Manager"]),
        ("Build the timing, tracking and registration software.",
         "B", "I", "R", ["Software Engineer", "Data Analyst", "Cloud Engineer"]),
        ("Staff the medical stations along the route.",
         "C", "S", "R", ["Paramedic", "Doctor", "Physiotherapist"]),
        ("Coordinate two thousand volunteers and keep them looked after.",
         "F", "S", "E", ["HR Manager", "Public Speaker", "Social Worker"]),
        ("Look after the runners, the food and the finish-line festival.",
         "H", "S", "E", ["Event Manager", "Sports Coach", "Chef"]),
    ]),
    ("Q40", "A new community centre is being built in your area. Which part interests you?", [
        ("Designing and constructing the building itself.",
         "A", "R", "I", ["Civil Engineer", "Construction Manager", "Structural Engineer"]),
        ("The booking, membership and access systems.",
         "B", "I", "R", ["Software Engineer", "Mobile App Developer", "Network Engineer"]),
        ("The health clinic that will run inside it.",
         "C", "S", "I", ["Doctor", "Nurse", "Physiotherapist"]),
        ("The programmes for people who are isolated or struggling.",
         "F", "S", "A", ["Social Worker", "Counsellor", "Teacher"]),
        ("The cafe, the gym and the events that make people want to come.",
         "H", "S", "E", ["Hotel Manager", "Fitness Trainer", "Event Manager"]),
    ]),
    ("Q41", "A family friend runs a small hotel that is struggling. What would you offer to do?", [
        ("Repair the building, the plumbing and the equipment.",
         "A", "R", "I", ["Civil Engineer", "Electrical Engineer", "Engineer"]),
        ("Get them online with a booking system and a proper website.",
         "B", "I", "R", ["Software Engineer", "UX Designer", "Mobile App Developer"]),
        ("Sort out food safety and the staff's health and injuries.",
         "C", "I", "S", ["Public Health Specialist", "Nurse", "Occupational Therapist"]),
        ("Sort out the staffing, the training and the way people are managed.",
         "F", "S", "E", ["HR Manager", "Technical Trainer", "Counsellor"]),
        ("Rethink the rooms, the food and what staying there feels like.",
         "H", "S", "E", ["Hotel Manager", "Chef", "Travel Consultant"]),
    ]),
    ("Q42", "Your class is planning a long trip abroad. Which responsibility would you take?", [
        ("Transport, luggage systems and everything that has to physically work.",
         "A", "R", "C", ["Engineer", "Automation Engineer", "Construction Manager"]),
        ("The tracking app and the shared itinerary everyone uses.",
         "B", "I", "R", ["Mobile App Developer", "Software Engineer", "Data Analyst"]),
        ("Vaccinations, medical kits and what to do if someone falls ill.",
         "C", "S", "I", ["Doctor", "Nurse", "Paramedic"]),
        ("Making it affordable so nobody is quietly left behind.",
         "F", "S", "E", ["Social Worker", "Teacher", "Counsellor"]),
        ("The itinerary, the food and what everyone will remember.",
         "H", "S", "E", ["Travel Consultant", "Event Manager", "Hotel Manager"]),
    ]),
    ("Q43", "Which kind of problem would hold your attention longest?", [
        ("Something mechanical that has to work every single time.",
         "A", "R", "I", ["Mechanical Engineer", "Robotics Engineer", "Automation Engineer"]),
        ("Something digital that has to work for millions at once.",
         "B", "I", "R", ["Software Engineer", "Cloud Engineer", "Data Scientist"]),
        ("Something going wrong inside the human body.",
         "C", "I", "S", ["Doctor", "Surgeon", "Pharmacist"]),
        ("Something going wrong between people.",
         "F", "S", "A", ["Psychologist", "Counsellor", "Social Worker"]),
        ("Something about how a place feels to be in.",
         "H", "S", "E", ["Hotel Manager", "Chef", "Event Manager"]),
    ]),
    ("Q44", "Where would you rather spend a working day?", [
        ("In a workshop or on a site, with tools and machines.",
         "A", "R", "I", ["Mechanical Engineer", "Construction Manager", "Engineer"]),
        ("At a screen, writing software that runs.",
         "B", "I", "R", ["Software Engineer", "Data Scientist", "Game Developer"]),
        ("In a clinic or a ward, with patients.",
         "C", "S", "R", ["Doctor", "Nurse", "Physiotherapist"]),
        ("In a classroom or a community hall, with people who need something.",
         "F", "S", "A", ["Teacher", "Social Worker", "Counsellor"]),
        ("In a kitchen, a hotel or out on a field.",
         "H", "S", "E", ["Chef", "Hotel Manager", "Sports Coach"]),
    ]),
    ("Q45", "Which club would you actually turn up to every week?", [
        ("Robotics and workshop.",
         "A", "R", "I", ["Robotics Engineer", "Mechanical Engineer", "Product Engineer"]),
        ("Coding and game development.",
         "B", "I", "R", ["Software Engineer", "Game Developer", "AI Engineer"]),
        ("First aid and human biology.",
         "C", "S", "I", ["Doctor", "Nurse", "Paramedic"]),
        ("Debate and community service.",
         "F", "S", "E", ["Public Speaker", "Social Worker", "Policy Analyst"]),
        ("The sports team or the culinary club.",
         "H", "S", "R", ["Sports Coach", "Chef", "Athlete"]),
    ]),
    ("Q46", "Which compliment would mean the most to you at work?", [
        ("It works, and it has not broken once.",
         "A", "R", "C", ["Mechanical Engineer", "Automation Engineer", "Engineer"]),
        ("The software is fast, and it never goes down.",
         "B", "I", "R", ["Software Engineer", "Cloud Engineer", "Data Scientist"]),
        ("The patient recovered.",
         "C", "S", "I", ["Doctor", "Nurse", "Physiotherapist"]),
        ("This community trusts you.",
         "F", "S", "E", ["Social Worker", "Civil Services Officer", "Counsellor"]),
        ("Everybody had a wonderful time.",
         "H", "S", "E", ["Event Manager", "Hotel Manager", "Chef"]),
    ]),
    ("Q47", "You are offered a month of work experience. Which would you pick?", [
        ("A manufacturing plant.",
         "A", "R", "I", ["Mechanical Engineer", "Automation Engineer", "Product Engineer"]),
        ("A software company.",
         "B", "I", "R", ["Software Engineer", "Data Scientist", "Cybersecurity Analyst"]),
        ("A hospital.",
         "C", "S", "I", ["Doctor", "Nurse", "Radiologist"]),
        ("A school or an NGO.",
         "F", "S", "A", ["Teacher", "Social Worker", "Counsellor"]),
        ("A hotel or a sports club.",
         "H", "S", "E", ["Hotel Manager", "Sports Coach", "Chef"]),
    ]),
    ("Q48", "Something in your neighbourhood is badly broken. Which would you most want to be the one to fix?", [
        ("The road, the drainage and the street lighting.",
         "A", "R", "I", ["Civil Engineer", "Electrical Engineer", "Construction Manager"]),
        ("The council website that nobody can use.",
         "B", "I", "R", ["UX Designer", "Software Engineer", "Mobile App Developer"]),
        ("The clinic where people queue outside for hours.",
         "C", "S", "I", ["Doctor", "Nurse", "Public Health Specialist"]),
        ("The fact that newcomers are shut out of everything.",
         "F", "S", "A", ["Social Worker", "Counsellor", "Civil Services Officer"]),
        ("The park and the sports ground nobody looks after any more.",
         "H", "S", "R", ["Sports Coach", "Fitness Trainer", "Event Manager"]),
    ]),
]

from demo_11_12_professions import canonicalise  # noqa: E402


def as_bank_questions():
    """The extra questions in the same v2 shape the builder emits."""
    out = []
    for qno, text, options in EXTRA_INTERESTS:
        clusters, riasec, careers, opt_text = [], [], [], []
        for option, cluster, primary, secondary, examples in options:
            opt_text.append(option)
            clusters.append({cluster: 5})
            vec = {primary: 3}
            if secondary:
                vec[secondary] = 1
            riasec.append(vec)
            careers.append(canonicalise(examples))
        out.append({
            "type": "choice{}".format(len(options)),
            "q": qno,
            "text": text,
            "options": opt_text,
            "riasec": riasec,
            "clusterWeights": clusters,
            "careers": careers,
            "mappingAuthored": True,
            # Distinguishes "we mapped the client's question" from "we wrote the
            # question too". Only these carry questionAuthored, and the set
            # builder uses it to balance each paper.
            "questionAuthored": True,
        })
    return out
