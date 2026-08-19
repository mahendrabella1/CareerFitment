#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Canonical profession names for the authored interest options.

The problem
-----------
Each interest option carries a list of example careers. Those names are not
decoration: scoring60 feeds them into `interestVotes`, and any name it sees
becomes a candidate in the student's career match.

Natural job titles - "Designer", "Statistician", "Researcher" - mostly are not
in the engine's `professionCluster` table. This affects BOTH sources: the names
we authored and the ones transcribed verbatim from the client workbook, which
uses titles like "Healthcare Professional" and "Smart-City Engineer" that the
engine has never heard of. A profession missing from that table
has NO CLUSTER, so it can win a student's top match while belonging to nothing.
That is where a report saying "Designer (Human & Public Services)" came from:
the title from one place, the cluster from a fallback, agreeing with each other
by accident.

The fix
-------
Map every authored name onto the vocabulary the engine actually knows. These
names are a scoring input, never shown to a student (the generate route strips
`careers` before the questions reach the browser), so canonicalising costs
nothing in readability and makes every vote actually count.

Not a rename of the careers CATALOGUE - that is a separate, student-facing list
in demo_11_12_careers_*.py and keeps its natural titles. This map applies only
to the example-career names inside interest options.

verify_demo_overlay.py fails the build if any authored option emits a name the
engine does not know, so this cannot drift back.
"""

import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
CAREER_MAP = os.path.join(HERE, "..", "data", "career-map-9-10.json")

# authored name -> the engine's name for the same job
CANONICAL = {
    # --- research and science -------------------------------------------
    "Academic": "Research Scientist",
    "Academic Researcher": "Research Scientist",
    "Applied Researcher": "Research Engineer",
    "Biologist": "Research Scientist",
    "Clinical Researcher": "Research Scientist",
    "Discovery Researcher": "Research Scientist",
    "Lab Analyst": "Research Scientist",
    "Mathematician": "Research Scientist",
    "Medical Researcher": "Research Scientist",
    "Scientist": "Research Scientist",
    "Physicist": "Astrophysicist",
    "Theoretical Physicist": "Astrophysicist",
    "Materials Scientist": "Chemist",
    "Quality Scientist": "Chemist",
    "R&D Analyst": "Research Engineer",
    "R&D Engineer": "Research Engineer",
    "Ecologist": "Environmental Scientist",
    "Conservationist": "Wildlife Biologist",
    "Sustainability Analyst": "Environmental Scientist",
    "Food Safety Officer": "Food Technologist",
    "Biomechanist": "Sports Scientist",
    "Behavioural Scientist": "Psychologist",
    # --- engineering ------------------------------------------------------
    "Builder / Maker": "Engineer",
    "Engineering Lead": "Engineer",
    "Systems Engineer": "Engineer",
    "Maker / Prototyper": "Product Engineer",
    "Prototype Engineer": "Product Engineer",
    "Hardware Engineer": "Electronics Engineer",
    "Building Services Engineer": "Civil Engineer",
    "Infrastructure Engineer": "Civil Engineer",
    # --- software and data ------------------------------------------------
    "Software Developer": "Software Engineer",
    "Web Developer": "Software Engineer",
    "Health-tech Developer": "Software Engineer",
    "QA Engineer": "Software Engineer",
    "Test Engineer": "Software Engineer",
    "Technical Architect": "Software Engineer",
    "Systems Architect": "Software Engineer",
    "ML Engineer": "AI Engineer",
    "Data Engineer": "Data Scientist",
    "Health Data Analyst": "Data Analyst",
    "Research Analyst": "Data Analyst",
    "Statistician": "Data Analyst",
    "Systems Analyst": "Business Analyst",
    "UX Engineer": "UX Designer",
    "UX Researcher": "UX Designer",
    "Service Designer": "UX Designer",
    "Experience Designer": "UX Designer",
    # --- health -----------------------------------------------------------
    "Therapist": "Counsellor",
    "Sports Physiotherapist": "Physiotherapist",
    "Epidemiologist": "Public Health Specialist",
    "Public Health Researcher": "Public Health Specialist",
    "Rural Health Officer": "Public Health Specialist",
    "Dietitian": "Dietician",
    # --- design, media, arts ---------------------------------------------
    "Designer": "Graphic Designer",
    "Visual Designer": "Graphic Designer",
    "Information Designer": "Graphic Designer",
    "Communication Designer": "Graphic Designer",
    "Brand Designer": "Graphic Designer",
    "Illustrator": "Graphic Designer",
    "Art Director": "Creative Director",
    "Artist": "Creative Director",
    "Creative Lead": "Creative Director",
    "Design Lead": "Creative Director",
    "Set Designer": "Event Designer",
    "Filmmaker": "Film Maker",
    "Videographer": "Film Maker",
    "Storyteller": "Content Creator",
    "Writer": "Content Creator",
    "Content Strategist": "Content Creator",
    "Data Journalist": "Journalist",
    # --- business ---------------------------------------------------------
    "Analyst": "Business Analyst",
    "Market Researcher": "Business Analyst",
    "Business Developer": "Business Manager",
    "Business Leader": "Business Manager",
    "Product Manager": "Business Manager",
    "Product Leader": "Business Manager",
    "Revenue Manager": "Business Manager",
    "Brand Manager": "Business Manager",
    "Business Owner": "Entrepreneur",
    "Social Entrepreneur": "Entrepreneur",
    "Founder": "Startup Founder",
    "Management Consultant": "Consultant",
    "Strategy Consultant": "Consultant",
    "Marketing Manager": "Digital Marketer",
    "Brand Strategist": "Digital Marketer",
    "Growth Manager": "Digital Marketer",
    "Sports Marketing Manager": "Digital Marketer",
    "Investment Analyst": "Investment Banker",
    "Venture Analyst": "Financial Analyst",
    "Investor": "Financial Planner",
    "Programme Director": "Operations Manager",
    "Team Lead": "Project Manager",
    # --- public service ---------------------------------------------------
    "Anthropologist": "Research Scientist",
    "Sociologist": "Policy Analyst",
    "Social Researcher": "Policy Analyst",
    "Social Scientist": "Policy Analyst",
    "Evaluation Specialist": "Policy Analyst",
    "Programme Officer": "Policy Analyst",
    "Community Manager": "Social Worker",
    "Community Organiser": "Social Worker",
    "HR Specialist": "HR Manager",
    "Education Specialist": "Teacher",
    "University Professor": "Teacher",
    # --- hospitality, sport, lifestyle ------------------------------------
    "Hospitality Manager": "Hotel Manager",
    "Hospitality Entrepreneur": "Hotel Manager",
    "Guest Relations Manager": "Hotel Manager",
    "Catering Manager": "Hotel Manager",
    "Restaurant Manager": "Hotel Manager",
    "Restaurant Owner": "Chef",
    "Culinary Professional": "Chef",
    "Community Sports Officer": "Sports Coach",
    "Performance Manager": "Sports Coach",
    "Team Manager": "Sports Coach",
    "Tour Designer": "Travel Consultant",

    # --- names from the CLIENT's own Q1-Q12 career columns -----------------
    # Transcribed verbatim from the workbook, and equally unknown to the
    # engine. Mapped here rather than edited in the transcription, so the
    # builder stays a faithful copy of the sheet.
    "Biomedical Scientist": "Biomedical Engineer",
    "Business Strategist": "Business Manager",
    "Campaign Strategist": "Digital Marketer",
    "Career Counsellor": "Counsellor",
    "Content Designer": "Graphic Designer",
    "Creative Strategist": "Creative Director",
    "Cybersecurity Specialist": "Cybersecurity Analyst",
    "Developer": "Software Engineer",
    "EdTech Product Manager": "Business Manager",
    "Education Consultant": "Teacher",
    "Education Researcher": "Teacher",
    "Environmental Analyst": "Environmental Scientist",
    "Environmental Researcher": "Environmental Scientist",
    "Healthcare Professional": "Doctor",
    "Healthcare/Social Professional": "Doctor",
    "Media Specialist": "Media Professional",
    "Product Developer": "Product Engineer",
    "Professor": "Teacher",
    "Program Manager": "Project Manager",
    "Public Policy Specialist": "Policy Analyst",
    "Researcher": "Research Scientist",
    "Smart-City Engineer": "Urban Planner",
    "Social Impact Professional": "Social Worker",
    "Social Impact Specialist": "Social Worker",
    "Technology Architect": "Software Engineer",
    "Technology Specialist": "Software Engineer",
    "University Researcher": "Research Scientist",
    "Urban Researcher": "Urban Planner",
}


def known_professions():
    """The names the scoring engine can attach a cluster to."""
    with open(CAREER_MAP, encoding="utf-8") as fh:
        return set(json.load(fh)["professionCluster"])


def canonicalise(names):
    """Map a list of authored career names onto the engine's vocabulary,
    dropping duplicates that collapse onto the same canonical name."""
    out = []
    for name in names:
        mapped = CANONICAL.get(name, name)
        if mapped not in out:
            out.append(mapped)
    return out
