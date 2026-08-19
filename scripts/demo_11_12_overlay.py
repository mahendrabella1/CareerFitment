#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AUTHORED mappings for the class 11-12 demo bank.

Everything in build_demo_11_12.py is transcribed from the client workbook.
Everything in THIS file was written by us because the workbook leaves it blank.
The split is deliberate: when the client sends a corrected sheet, the builder
output changes and this file is what has to be re-reviewed against it.

What is missing in the workbook
-------------------------------
The Interests tab holds 24 questions but only Q1-Q12 carry the four mapping
columns (Career Cluster, Cluster Weights, RIASEC, Example Careers). Q13-Q24
have the question and five options and nothing else.

Interests carry 40% of the career-match weight (dimensionWeights in
career-map-9-10.json), so leaving those twelve unscored would either halve the
interest signal or force every student onto one identical interest set. Both
are worse than mapping them.

How they were mapped
--------------------
Q13-Q24 reuse, option for option, the same five archetypes the mapped block
already uses, and the mapping follows that block conventions rather than
inventing new ones:

    A  investigate / evidence / scientific explanation  -> G, RIASEC I
    B  build / test / technology                        -> B when the option is
                                                           software or digital,
                                                           A when it is a
                                                           machine or system
    C  people                                           -> C when the option
                                                           names health or
                                                           development,
                                                           F otherwise
    D  design / communicate / create                    -> D, RIASEC A
    E  strategy / market / venture                      -> E, RIASEC E+C

Cluster weight is +5 on a single cluster throughout, exactly as Q1-Q12 do.
Letters: A Core Engineering, B Information Technology, C Health Science,
D Arts/Media/Design, E Business & Marketing, F Human & Public Services,
G Science/Nature/Agriculture, H Sports/Hospitality/Lifestyle.

These readings are ours, not the client scoring. They are the first thing to
check if interest results ever look skewed.
"""

# Per question: one entry per option A-E, in order.
#   (cluster letter, RIASEC primary, RIASEC secondary or None, example careers)
INTEREST_OVERLAY = {
    "Q13": [
        ("G", "I", None, ["Research Scientist", "Data Analyst", "Statistician"]),
        ("B", "I", "R", ["Software Engineer", "Data Scientist", "ML Engineer"]),
        ("F", "S", "I", ["Sociologist", "Policy Analyst", "UX Researcher"]),
        ("D", "A", "E", ["Information Designer", "Data Journalist", "Visual Designer"]),
        ("E", "E", "C", ["Business Analyst", "Product Manager", "Strategy Consultant"]),
    ],
    "Q14": [
        ("G", "I", None, ["Research Scientist", "Materials Scientist", "Lab Analyst"]),
        ("A", "R", "I", ["Mechanical Engineer", "Product Engineer", "Systems Engineer"]),
        ("F", "S", "I", ["UX Researcher", "Education Specialist", "Service Designer"]),
        ("D", "A", "E", ["Product Designer", "UX Designer", "Brand Designer"]),
        ("E", "E", "C", ["Product Manager", "Growth Manager", "Entrepreneur"]),
    ],
    "Q15": [
        ("G", "I", None, ["Research Scientist", "Physicist", "Biologist"]),
        ("A", "R", "I", ["Robotics Engineer", "Mechanical Engineer", "Hardware Engineer"]),
        ("F", "S", "I", ["Psychologist", "Counsellor", "Social Researcher"]),
        ("D", "A", None, ["Creative Director", "Filmmaker", "Designer"]),
        ("E", "E", "C", ["Management Consultant", "Investment Analyst", "Founder"]),
    ],
    "Q16": [
        ("G", "I", None, ["Research Scientist", "University Professor", "Biotechnologist"]),
        ("A", "R", "I", ["Mechanical Engineer", "Electronics Engineer", "Product Engineer"]),
        ("C", "S", "I", ["Doctor", "Physiotherapist", "Clinical Psychologist"]),
        ("D", "A", "E", ["Architect", "Filmmaker", "Communication Designer"]),
        ("E", "E", "C", ["Entrepreneur", "Business Leader", "Venture Analyst"]),
    ],
    "Q17": [
        ("G", "I", None, ["Research Scientist", "R&D Analyst", "Quality Scientist"]),
        ("B", "I", "R", ["Software Engineer", "Systems Analyst", "QA Engineer"]),
        ("F", "S", "I", ["UX Researcher", "Market Researcher", "Service Designer"]),
        ("D", "A", "E", ["Brand Strategist", "Communication Designer", "Content Strategist"]),
        ("E", "E", "C", ["Business Analyst", "Marketing Manager", "Strategy Consultant"]),
    ],
    "Q18": [
        ("G", "I", None, ["Research Scientist", "Environmental Scientist", "Physicist"]),
        ("B", "I", "R", ["Software Engineer", "AI Engineer", "Robotics Engineer"]),
        ("C", "S", "I", ["Doctor", "Public Health Specialist", "Therapist"]),
        ("D", "A", None, ["Product Designer", "Creative Director", "Animator"]),
        ("E", "E", "C", ["Entrepreneur", "Product Manager", "Business Developer"]),
    ],
    "Q19": [
        ("G", "I", None, ["Research Scientist", "Analyst", "Academic Researcher"]),
        ("A", "R", "I", ["Engineer", "Maker / Prototyper", "Applied Researcher"]),
        ("F", "S", "I", ["Anthropologist", "UX Researcher", "Journalist"]),
        ("D", "A", "E", ["Illustrator", "Science Communicator", "Designer"]),
        ("E", "E", "C", ["Consultant", "Product Manager", "Entrepreneur"]),
    ],
    "Q20": [
        ("G", "I", None, ["Research Scientist", "Data Analyst", "Economist"]),
        ("A", "R", "I", ["Software Engineer", "Mechanical Engineer", "Systems Engineer"]),
        ("F", "S", None, ["Counsellor", "Teacher", "Social Worker"]),
        ("D", "A", None, ["Designer", "Filmmaker", "Creative Director"]),
        ("E", "E", "C", ["Entrepreneur", "Growth Manager", "Investor"]),
    ],
    "Q21": [
        ("G", "I", None, ["Research Scientist", "Analyst", "Evaluation Specialist"]),
        ("A", "R", "I", ["Engineering Lead", "Technical Architect", "Product Engineer"]),
        ("F", "S", "I", ["UX Researcher", "Service Designer", "Programme Officer"]),
        ("D", "A", "E", ["Design Lead", "Art Director", "Experience Designer"]),
        ("E", "E", "C", ["Project Manager", "Strategy Consultant", "Operations Manager"]),
    ],
    "Q22": [
        ("G", "I", None, ["Research Scientist", "Theoretical Physicist", "Mathematician"]),
        ("A", "R", "I", ["R&D Engineer", "Robotics Engineer", "Prototype Engineer"]),
        ("F", "S", "I", ["Psychologist", "UX Researcher", "Social Scientist"]),
        ("D", "A", None, ["Creative Director", "Designer", "Writer"]),
        ("E", "E", "C", ["Entrepreneur", "Venture Analyst", "Product Manager"]),
    ],
    "Q23": [
        ("G", "I", None, ["Research Analyst", "Scientist", "Auditor"]),
        ("A", "R", "I", ["Software Engineer", "Mechanical Engineer", "Test Engineer"]),
        ("F", "S", "A", ["HR Specialist", "Counsellor", "Community Manager"]),
        ("D", "A", "E", ["Creative Lead", "Communication Designer", "Storyteller"]),
        ("E", "E", "C", ["Team Lead", "Project Manager", "Founder"]),
    ],
    "Q24": [
        ("G", "I", None, ["Research Scientist", "Academic", "Discovery Researcher"]),
        ("A", "R", "I", ["Engineer", "Software Developer", "Builder / Maker"]),
        ("F", "S", "I", ["Counsellor", "Teacher", "Social Worker"]),
        ("D", "A", None, ["Artist", "Filmmaker", "Designer"]),
        ("E", "E", "C", ["Entrepreneur", "Business Owner", "Product Leader"]),
    ],
}


from demo_11_12_professions import canonicalise  # noqa: E402


def overlay_for(qno):
    """Return (clusterWeights, riasec, careers) lists for a question, or None."""
    spec = INTEREST_OVERLAY.get(qno)
    if not spec:
        return None
    clusters, riasec, careers = [], [], []
    for cluster, primary, secondary, examples in spec:
        clusters.append({cluster: 5})
        vec = {primary: 3}
        if secondary:
            vec[secondary] = 1
        riasec.append(vec)
        # Canonicalised because these names are a SCORING input: any name the
        # engine does not know enters the match with no cluster at all.
        careers.append(canonicalise(examples))
    return clusters, riasec, careers
