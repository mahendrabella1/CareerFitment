/**
 * The rich, 5-phase, 15-year roadmap per standard cluster - the Career
 * Selector page's deep-dive, built at the CLUSTER level (16 total, not per
 * domain or per individual career - see careerfit1112.ts's Career1112.cluster
 * comment for why). Phases follow the "I AM HERE / I CAN STUDY / I CAN
 * SPECIALIZE / I CAN START AS / I CAN GROW INTO" shape the user supplied as
 * a reference sample (their own Financial & Investment Planning roadmap).
 *
 * Course/degree/professional-qualification names here are real, existing
 * Indian programmes (B.Tech, B.Com, B.Des, BA LLB, MBBS, etc.), cross-checked
 * against the same real typicalDegree fields already used on the 332
 * CAREERS_1112 entries in this cluster - not invented. Role names in each
 * phase are drawn from actual CAREERS_1112 entries belonging to that
 * cluster, so "possible roles" always resolves to something real in the
 * report's own data, not aspirational filler.
 */
import type { StandardCluster } from "@/lib/report/careerfit1112";

export interface RoadmapSection {
  heading: string;
  items: string[];
}
export interface ClusterRoadmapPhase {
  code: string; // "01"
  name: string; // "I AM HERE"
  stage: string; // "Class 12 | Year 1"
  sections: RoadmapSection[];
}
export interface ClusterRoadmap {
  title: string;
  phases: ClusterRoadmapPhase[];
  longTermJourney: string[];
}

function phase1(focus: string[], strengthen: string[], explore: string[]): ClusterRoadmapPhase {
  return {
    code: "01", name: "I AM HERE", stage: "Class 12 | Year 1",
    sections: [
      { heading: "My focus", items: focus },
      { heading: "I should strengthen", items: strengthen },
      { heading: "I should explore", items: explore },
    ],
  };
}
function phase2(courses: string[], during: string[], skills: string[]): ClusterRoadmapPhase {
  return {
    code: "02", name: "I CAN STUDY", stage: "Graduation | Years 2–4",
    sections: [
      { heading: "Courses I can explore", items: courses },
      { heading: "During graduation", items: during },
      { heading: "Skills I acquire", items: skills },
    ],
  };
}
function phase3(choose: string[], higherStudies: string[], quals: string[], skills: string[]): ClusterRoadmapPhase {
  return {
    code: "03", name: "I CAN SPECIALIZE", stage: "Postgraduation / Professional Qualification | Years 5–7",
    sections: [
      { heading: "I can choose", items: choose },
      { heading: "Higher studies", items: higherStudies },
      { heading: "Professional qualifications", items: quals },
      { heading: "Skills I develop", items: skills },
    ],
  };
}
function phase4(roles: string[], skills: string[], goal: string): ClusterRoadmapPhase {
  return {
    code: "04", name: "I CAN START AS", stage: "Early Career | Years 8–12",
    sections: [
      { heading: "Possible roles", items: roles },
      { heading: "Skills I build", items: skills },
      { heading: "My goal", items: [goal] },
    ],
  };
}
function phase5(senior: string[], leadership: string[], skills: string[]): ClusterRoadmapPhase {
  return {
    code: "05", name: "I CAN GROW INTO", stage: "Senior Career & Leadership | Years 13–15+",
    sections: [
      { heading: "Senior roles", items: senior },
      { heading: "Leadership possibilities", items: leadership },
      { heading: "Leadership skills", items: skills },
    ],
  };
}

export const CLUSTER_ROADMAPS: Record<StandardCluster, ClusterRoadmap> = {
  "STEM": {
    title: "STEM (Science, Technology, Engineering & Mathematics) - 15-Year Career Roadmap",
    phases: [
      phase1(
        ["Understand engineering, physical/life sciences, maths and research as career paths", "Identify whether I enjoy building things, solving equations, or investigating how the world works", "Explore mechanical/civil/electronics vs. pure-science vs. research-track options"],
        ["Physics", "Chemistry", "Mathematics", "Problem-solving", "Lab technique", "Technical writing"],
        ["Engineering (Mechanical/Civil/Electronics/Robotics)", "Biotechnology", "Physics/Chemistry", "Applied Mathematics/Statistics", "Academic Research"],
      ),
      phase2(
        ["B.Tech (Mechanical/Civil/Electronics/Robotics/Chemical)", "B.Sc (Physics/Chemistry/Mathematics)", "B.Tech Biotechnology", "B.Stat/B.Sc Statistics"],
        ["JEE/CET-based admission into a core branch", "Vacation training at a plant, lab or research institute", "A real project or paper, not just coursework"],
        ["CAD and one analysis/simulation tool", "Lab technique and data analysis", "Technical writing and presentation"],
      ),
      phase3(
        ["Structural/Petroleum/Nuclear/Renewable Energy Engineering", "Molecular Biology / Genomics", "Astrophysics / Materials Science", "Applied Mathematics / Actuarial Science", "Academic Research (PhD track)"],
        ["M.Tech (your branch)", "M.Sc (Physics/Chemistry/Life Sciences)", "Integrated PhD at an IISER/NISER/IIT"],
        ["GATE (for M.Tech/PSU recruitment)", "A green-building (LEED/IGBC) or Six Sigma credential where relevant"],
        ["Deep technical specialisation in one sub-field", "Independent research or design ownership", "Mentoring juniors on a project"],
      ),
      phase4(
        ["Mechanical/Civil/Robotics Engineer", "Research Scientist", "Biostatistician", "Materials Scientist", "R&D Engineer"],
        ["Independent project ownership", "Cross-functional collaboration", "Publishing or patenting real work"],
        "Build deep technical credibility in one specialisation, not broad but shallow exposure.",
      ),
      phase5(
        ["Chief Engineer", "Principal Scientist", "R&D Team Lead", "Senior Research Fellow"],
        ["VP Engineering", "CTO", "Lab/Institute Director", "Deep-tech Founder"],
        ["Strategic technical decision-making", "Team and budget leadership", "Translating research into real-world products"],
      ),
    ],
    longTermJourney: ["Class 12", "Engineering/Science Degree", "Specialisation (M.Tech/M.Sc/PhD)", "Professional Experience", "Senior Engineer/Scientist", "Director / CTO / Founder"],
  },

  "Information Technology": {
    title: "Information Technology - 15-Year Career Roadmap",
    phases: [
      phase1(
        ["Understand software, data, cloud and cybersecurity as distinct career paths", "Identify whether I enjoy coding, systems design, security, or working with data", "Explore different tech specialisations before committing to one"],
        ["Mathematics", "Computer Science / Informatics Practices", "Logical reasoning", "English/communication"],
        ["Web/App development", "Data Science & AI/ML", "Cybersecurity", "Cloud infrastructure"],
      ),
      phase2(
        ["B.Tech Computer Science / IT", "BCA", "B.Sc Computer Science"],
        ["Build 2–3 real personal projects, not just coursework", "At least one internship", "Contribute to one open-source project"],
        ["One language deeply (Python/Java/JavaScript)", "Git/version control", "Data structures & algorithms", "Basic cloud (AWS/Azure fundamentals)"],
      ),
      phase3(
        ["Cloud Architecture", "Cybersecurity", "AI / Machine Learning", "Data Engineering", "DevOps / Site Reliability"],
        ["M.Tech CSE", "MS abroad (if pursuing global roles)"],
        ["AWS/Azure/GCP architect certification", "CISSP or CEH (security track)", "Specific ML/data certifications"],
        ["System design at scale", "Security-first engineering thinking", "Mentoring and code review"],
      ),
      phase4(
        ["Software Engineer", "Full-Stack Developer", "Cybersecurity Analyst", "Data Scientist", "Cloud Architect", "DevOps Engineer"],
        ["Ownership of a real production system", "Cross-team technical communication", "Staying current as the stack changes"],
        "Go deep in one area (security, ML, cloud) - depth is what actually differentiates pay and role at this stage.",
      ),
      phase5(
        ["Principal Engineer", "Engineering Manager", "Security Architect", "Staff Data Scientist"],
        ["CTO", "VP Engineering", "Head of Data / AI", "Tech Founder"],
        ["Technical strategy across teams", "Hiring and building engineering culture", "Translating business goals into technical roadmaps"],
      ),
    ],
    longTermJourney: ["Class 12", "CS/IT Degree", "Specialisation + Certifications", "Professional Experience", "Principal Engineer / Architect", "CTO / VP Engineering / Founder"],
  },

  "Health Science": {
    title: "Health Science (Medicine & Allied Health) - 15-Year Career Roadmap",
    phases: [
      phase1(
        ["Master Biology and Chemistry fundamentals deeply, not just for exams", "Volunteer or shadow at a clinic, hospital or pharmacy to test the reality of the work", "Decide early between MBBS, dentistry, nursing, pharmacy and allied health"],
        ["Biology", "Chemistry", "Physics", "Patient communication and empathy"],
        ["Clinical medicine", "Allied health (physiotherapy/nutrition)", "Nursing", "Pharmacy", "Public health"],
      ),
      phase2(
        ["MBBS", "BDS", "B.Sc Nursing", "BPT (Physiotherapy)", "B.Pharm"],
        ["Clear NEET-UG (or the relevant allied-health entrance)", "Treat clinical rotations as the real classroom", "Build genuine patient-communication skills"],
        ["Clinical examination and diagnosis basics", "Patient communication", "Medical documentation"],
      ),
      phase3(
        ["A clinical speciality (Cardiology, Surgery, Pediatrics, etc.)", "Physiotherapy or nutrition specialisation", "Public health / hospital administration", "Research or teaching track"],
        ["MD/MS via NEET-PG", "PG diplomas for allied-health roles"],
        ["Medical Council of India / NMC registration", "Speciality board certification"],
        ["Deep clinical expertise in one speciality", "Case-load and time management under pressure", "Supervising junior clinicians"],
      ),
      phase4(
        ["Doctor (MBBS)", "Surgeon", "Physiotherapist", "Nurse", "Pharmacist", "Nutritionist/Dietician"],
        ["Independent clinical decision-making", "Building a patient/referral base", "Continuing medical education"],
        "Build real clinical reputation and a genuine specialisation, whether in a hospital or your own practice.",
      ),
      phase5(
        ["Senior Consultant", "Department Head", "Senior Clinical Specialist"],
        ["Medical Superintendent", "Hospital Director", "Chief Medical Officer", "Own clinic/diagnostics centre"],
        ["Hospital/department administration", "Clinical governance and quality", "Mentoring the next generation of clinicians"],
      ),
    ],
    longTermJourney: ["Class 12", "MBBS / Allied Health Degree", "PG Specialisation (NEET-PG)", "Clinical Practice", "Senior Consultant / Department Head", "Medical Director / Own Practice"],
  },

  "Finance": {
    title: "Finance - 15-Year Career Roadmap",
    phases: [
      phase1(
        ["Understand accounting, markets, banking and financial planning as distinct paths", "Track your own money like a CFO for a month - every rupee, in a sheet", "Follow real markets casually - one company's stock story a week"],
        ["Mathematics", "Accountancy", "Economics", "Statistics", "Communication"],
        ["Investment & markets", "Banking", "Chartered Accountancy", "Corporate finance", "Financial planning"],
      ),
      phase2(
        ["B.Com (Finance)", "BBA Finance", "B.Sc Finance"],
        ["Start CA Foundation/articleship if going the CA route", "Intern at a bank, brokerage or accounting firm", "Get genuinely comfortable in Excel financial modelling"],
        ["Financial statement analysis", "Excel modelling", "Basic valuation", "Market awareness"],
      ),
      phase3(
        ["Investment Banking", "Equity Research", "Risk Management", "Auditing & Taxation", "Corporate Finance"],
        ["MBA Finance", "M.Com"],
        ["CA (via ICAI articleship)", "CFA", "CMA", "FRM (risk track)"],
        ["Investment analysis and valuation", "Portfolio/risk management", "Advanced financial modelling"],
      ),
      phase4(
        ["Financial Analyst", "Investment Banker", "Chartered Accountant", "Portfolio Manager", "Risk Analyst"],
        ["Client/stakeholder communication", "Deal or audit execution", "Regulatory awareness"],
        "Build genuine expertise and a track record of real analysis/deals, not just a qualification on paper.",
      ),
      phase5(
        ["Finance Manager", "Senior Portfolio Manager", "Senior Auditor / Partner-track"],
        ["CFO", "Head of Investments", "Fund Manager (CIO)", "Financial-services Entrepreneur"],
        ["Strategic financial decision-making", "Team and P&L leadership", "Client/investor relationship management"],
      ),
    ],
    longTermJourney: ["Class 12", "Finance Degree", "CA / CFA / MBA Finance", "Professional Experience", "Senior Analyst / Manager", "CFO / Fund Manager / Entrepreneur"],
  },

  "Business Management & Administration": {
    title: "Business Management & Administration - 15-Year Career Roadmap",
    phases: [
      phase1(
        ["Run something small, for real - a stall, a reselling page, an event - and track the numbers", "Learn Excel/Sheets properly; business fluency starts there", "Follow real businesses: read one founder story or annual report a month"],
        ["Communication", "Basic Economics/Accountancy", "Excel", "Leadership through school/college activities"],
        ["General management", "Operations", "Marketing", "HR", "Entrepreneurship"],
      ),
      phase2(
        ["BBA / BMS (via CUET UG or a university's own entrance)", "B.Com + electives (via CUET UG)", "Any degree + a real internship or side venture"],
        ["Internships in sales, marketing or operations", "One measurable win you can talk about: grew X, sold Y, saved Z", "Deliberate networking - deals and roles both travel through people"],
        ["Project management basics", "Communication and negotiation", "Data-driven decision-making"],
      ),
      phase3(
        ["General Management", "Marketing", "Operations", "HR", "Strategy Consulting"],
        ["MBA (via CAT/GMAT - accelerates consulting/leadership tracks)"],
        ["PMP (project management) where relevant"],
        ["Owning a target, not just a task - a territory, a brand, a budget", "Cross-functional leadership", "Strategic thinking"],
      ),
      phase4(
        ["Business Manager", "Operations Manager", "HR Manager", "Product Manager", "Business Consultant"],
        ["Team leadership", "Budget ownership", "Stakeholder management"],
        "Move from executing to owning outcomes for a real team, product or P&L.",
      ),
      phase5(
        ["General Manager", "Director of Operations", "Senior Consultant / Partner-track"],
        ["CEO", "COO", "Founder"],
        ["Organisational strategy", "P&L and board-level accountability", "Building and scaling teams"],
      ),
    ],
    longTermJourney: ["Class 12", "BBA/Any Degree", "MBA (optional)", "Professional Experience", "General Manager / Director", "CEO / COO / Founder"],
  },

  "Law, Public Safety, Corrections & Security": {
    title: "Law, Public Safety, Corrections & Security - 15-Year Career Roadmap",
    phases: [
      phase1(
        ["Debate, MUN and school leadership to build the core muscles this field needs", "Read the newspaper daily - current affairs is the raw material of this field", "Shadow a lawyer, judge or police officer to see the real work"],
        ["English/reading comprehension", "General knowledge/current affairs", "Logical reasoning", "Public speaking"],
        ["Corporate law", "Litigation", "Judiciary/civil services", "Policing and public safety"],
      ),
      phase2(
        ["BA LLB (5-year integrated, via CLAT)", "Any bachelor's degree (for the civil-services/judiciary route)"],
        ["Internships with courts, law firms or NGOs", "Moot court participation", "Start UPSC/judiciary prep only after understanding the real commitment"],
        ["Legal research and drafting", "Argumentation", "Case analysis"],
      ),
      phase3(
        ["Corporate Law", "Litigation", "Constitutional/Human Rights Law", "Cyber Law", "Judiciary / Civil Services"],
        ["LLM (India or abroad)"],
        ["Bar Council enrolment", "State judiciary exam (if pursuing a judgeship)"],
        ["Deep expertise in one practice area", "Client/case management", "Negotiation and advocacy"],
      ),
      phase4(
        ["Corporate Lawyer", "Litigation Lawyer", "Judge / Judicial Services", "Advocate"],
        ["Case-load management", "Client relationship building", "Courtroom/negotiation presence"],
        "Build a real reputation and track record in one practice area, not a scattered generalist profile.",
      ),
      phase5(
        ["Senior Associate", "Partner-track Counsel", "District/Sessions Judge"],
        ["Senior Partner", "High Court Judge", "General Counsel (corporate)"],
        ["Firm/practice leadership", "Institutional and policy influence", "Mentoring junior lawyers"],
      ),
    ],
    longTermJourney: ["Class 12", "BA LLB / Bachelor's Degree", "LLM / Judiciary Prep", "Practice / Judicial Service", "Senior Counsel / Judge", "Senior Partner / High Court Judge"],
  },

  "Human Services": {
    title: "Human Services (Psychology & Social Work) - 15-Year Career Roadmap",
    phases: [
      phase1(
        ["Tutor a younger student or explain a tough topic to a classmate weekly", "Read one book on how people think, even a popular one", "Volunteer at a school event, camp or peer-support initiative"],
        ["Psychology basics (if offered)", "Sociology/current affairs", "Communication and empathy"],
        ["Clinical/counselling psychology", "Social work", "Organisational psychology", "Community development"],
      ),
      phase2(
        ["BA Psychology (via CUET UG)", "BSW - Social Work (via CUET UG or a university's own entrance)"],
        ["Supervised counselling or field-work placements - non-negotiable for this field", "Volunteer with an NGO or helpline"],
        ["Active listening", "Basic assessment tools", "Case documentation"],
      ),
      phase3(
        ["Clinical Psychology", "Counselling Psychology", "Organisational Psychology", "Social Work Practice"],
        ["MA/M.Sc Psychology", "MSW"],
        ["RCI registration (for clinical/rehabilitation practice)"],
        ["Therapeutic technique in one modality", "Crisis intervention", "Supervision and referral judgement"],
      ),
      phase4(
        ["Clinical Psychologist", "Counselling Psychologist", "Social Researcher", "NGO Programme Manager"],
        ["Building a client/case caseload", "Ethical practice and confidentiality", "Programme or intervention design"],
        "Build a real, RCI-recognised practice or a programme track record - mental-health demand is real and growing here.",
      ),
      phase5(
        ["Senior Clinical Psychologist", "Programme Director (NGO)", "Senior Social Researcher"],
        ["Head of Department (Psychology/Counselling)", "NGO Executive Director", "Private Practice Owner"],
        ["Clinical/programme supervision", "Organisational leadership", "Policy or systems-level influence"],
      ),
    ],
    longTermJourney: ["Class 12", "BA Psychology / BSW", "MA/MSW + RCI Registration", "Clinical/Field Practice", "Senior Psychologist / Programme Director", "Department Head / NGO Director"],
  },

  "Arts, A/V Technology & Communications": {
    title: "Arts, Design & Communications - 15-Year Career Roadmap",
    phases: [
      phase1(
        ["Create weekly - sketches, writing, edits, mock-ups - and save it all", "Learn one tool deeply (Figma/CAD/a drawing tool) instead of five shallowly", "Start a public portfolio on Behance, Instagram or a blog"],
        ["Art/design fundamentals", "Writing", "Visual literacy", "Basic software tools"],
        ["UX/UI and product design", "Graphic/visual design", "Journalism and mass communication", "Film and video"],
      ),
      phase2(
        ["B.Des (via NID DAT/UCEED)", "BA Journalism & Mass Communication"],
        ["Freelance small: logos, edits, college fests - real briefs teach fastest", "Intern at a studio, agency or publication", "Build a public portfolio, not just coursework"],
        ["Design/editing software mastery", "Storytelling", "Client/brief interpretation"],
      ),
      phase3(
        ["UX/UI Design", "Graphic/Brand Design", "Journalism", "Film/Video Production"],
        ["M.Des", "MA Mass Communication"],
        ["Portfolio-based - no fixed licensure in this field"],
        ["A distinctive personal style/voice", "Client and stakeholder management", "Leading a small creative team"],
      ),
      phase4(
        ["UX/UI Designer", "Graphic Designer", "Journalist", "Film/Video Producer"],
        ["Building a name for a specific style or beat", "Managing bigger briefs/stories", "Freelance vs. in-house judgement"],
        "Get known for a specific lane - your taste and portfolio are the asset now.",
      ),
      phase5(
        ["Senior Designer", "Senior Editor", "Lead Producer"],
        ["Creative Director", "Editor-in-Chief", "Studio Owner/Founder"],
        ["Creative team leadership", "Client/brand strategy", "Building and protecting a personal or studio brand"],
      ),
    ],
    longTermJourney: ["Class 12", "B.Des / Mass Comm Degree", "Specialisation + Portfolio", "Professional Practice", "Senior Designer / Editor", "Creative Director / Studio Owner"],
  },

  "Architecture & Construction": {
    title: "Architecture & Construction - 15-Year Career Roadmap",
    phases: [
      phase1(
        ["Build weekly - sketches, models, small structures - and keep a portfolio", "Visit a construction site or architecture firm to see the real work", "Strengthen maths and spatial visualisation"],
        ["Mathematics", "Drawing/sketching", "Spatial reasoning", "Basic design software"],
        ["Residential/commercial architecture", "Urban planning", "Interior design", "Green/sustainable building"],
      ),
      phase2(
        ["B.Arch (via NATA/JEE Paper 2)"],
        ["Internship at an architecture or construction firm", "Live-project studio work, not just theoretical design", "Build a physical/digital portfolio"],
        ["CAD and 3D modelling tools", "Structural fundamentals", "Site documentation"],
      ),
      phase3(
        ["Urban Planning", "Interior Design", "Green/Sustainable Building", "Construction Project Management"],
        ["M.Arch"],
        ["Council of Architecture (CoA) registration"],
        ["Design leadership on real projects", "Client and contractor coordination", "Regulatory/code compliance"],
      ),
      phase4(
        ["Architect", "Urban Planner", "Interior Designer", "Construction Project Manager"],
        ["Independent project ownership", "Client presentation and negotiation", "Site supervision"],
        "Build a portfolio of real, built (or under-construction) work - that's what actually differentiates architects.",
      ),
      phase5(
        ["Principal Architect", "Senior Project Head", "Senior Urban Planner"],
        ["Design Director", "Founding Partner (own practice)", "Head of Design at a developer"],
        ["Practice/firm leadership", "Large-scale project strategy", "Mentoring junior architects"],
      ),
    ],
    longTermJourney: ["Class 12", "B.Arch", "M.Arch / CoA Registration", "Professional Practice", "Principal Architect", "Design Director / Own Practice"],
  },

  "Government & Public Administration": {
    title: "Government & Public Administration - 15-Year Career Roadmap",
    phases: [
      phase1(
        ["Read the newspaper daily - current affairs is the core material of this field", "Take physical fitness seriously if considering a defence route", "Volunteer or intern with a government office, NGO or local body"],
        ["General knowledge/current affairs", "English and essay writing", "Physics/Chemistry/Maths (for NDA/defence-technical routes)"],
        ["Civil services (IAS/IPS/IFS)", "State administrative services", "Defence services", "Public policy"],
      ),
      phase2(
        ["Any bachelor's degree (civil services keep this deliberately open)", "NDA (Class-12 direct entry for defence route)"],
        ["Start UPSC/State PCS prep seriously only after understanding the real, multi-year commitment", "Intern with a government office or policy think tank", "Build genuine, wide reading habits, not just test-prep"],
        ["Analytical writing", "Current-affairs synthesis", "Interview/personality presentation"],
      ),
      phase3(
        ["Civil Services (IAS/IPS/IFS/IRS)", "State Civil Services", "Public Policy"],
        ["MA Public Administration/Political Science (optional, not required)"],
        ["UPSC Civil Services Examination (Prelims → Mains → Interview)", "State PCS examinations"],
        ["Administrative decision-making", "Crisis and stakeholder management", "Policy analysis"],
      ),
      phase4(
        ["IAS/IPS/IFS Officer", "District-level Administrative Officer", "Policy Analyst"],
        ["Field administration experience", "Public communication", "Cross-department coordination"],
        "Build a genuine record of field postings and real administrative decisions - that's what shapes the career from here.",
      ),
      phase5(
        ["Joint Secretary (Centre)", "Deputy Inspector General (Police)", "Divisional Commissioner"],
        ["Secretary to Government", "Director General of Police", "Cabinet Secretary-track"],
        ["Policy-setting at scale", "Inter-departmental leadership", "Institutional governance"],
      ),
    ],
    longTermJourney: ["Class 12", "Bachelor's Degree", "UPSC/State PCS/NDA", "Field Administration", "Joint Secretary / DIG", "Secretary / DGP"],
  },

  "Hospitality & Tourism": {
    title: "Hospitality & Tourism - 15-Year Career Roadmap",
    phases: [
      phase1(
        ["Plan and host one small event end-to-end for friends or family", "Study one great hotel, restaurant or trip and list what makes it work", "Build basic service, fitness and people skills"],
        ["Communication", "Basic accounting", "A foreign language (an asset in this field)"],
        ["Hotel management", "Culinary arts", "Event management", "Travel & tourism"],
      ),
      phase2(
        ["BHM (Bachelor of Hotel Management, via NCHM JEE)", "Culinary school", "BA Travel & Tourism"],
        ["Hands-on training in a hotel, restaurant or travel company - reputation starts there", "Certifications: event management, sommelier, or IATA (travel)"],
        ["Guest service and communication", "Operations management", "Culinary/event execution skills"],
      ),
      phase3(
        ["Culinary Arts", "Event Management", "Front Office/Operations", "Travel & Tourism Management"],
        ["MBA Hospitality Management"],
        ["NCHMCT-linked certifications"],
        ["Multi-department operations management", "Vendor and guest relationship management", "Team leadership under pressure"],
      ),
      phase4(
        ["Hotel Manager", "Chef", "Event Manager", "Travel Consultant"],
        ["Moving up: sous chef, duty manager, senior planner", "International postings accelerate pay here", "Building a personal brand - this industry runs on reputation"],
        "Build a real, verifiable service record - guest reviews and repeat business are the currency here.",
      ),
      phase5(
        ["General Manager (Hotel)", "Executive Chef", "Senior Event/Tourism Manager"],
        ["VP Operations (hotel chain)", "Regional Director", "Own restaurant/agency"],
        ["Multi-property/regional operations", "Brand and guest-experience strategy", "P&L ownership"],
      ),
    ],
    longTermJourney: ["Class 12", "BHM / Culinary / Travel Degree", "Certifications + Field Training", "Operations Experience", "General Manager / Executive Chef", "VP Operations / Own Business"],
  },

  "Agriculture, Food & Natural Resources": {
    title: "Agriculture, Food & Natural Resources - 15-Year Career Roadmap",
    phases: [
      phase1(
        ["Grow something and keep real records - yield, inputs, problems, fixes", "Visit a farm, hatchery or agri-lab to see the work up close", "Strengthen Biology and Chemistry fundamentals"],
        ["Biology", "Chemistry", "Basic statistics", "Environmental awareness"],
        ["Agricultural science", "Horticulture/agronomy", "Environmental science", "Food technology"],
      ),
      phase2(
        ["B.Sc Agriculture (Hons)", "B.Sc Environmental Science", "B.Tech Food Technology"],
        ["Field or lab internships - real data collection, not just observation", "ICAR NTS-UG scholarship if studying outside your home state"],
        ["Field data collection", "Lab technique", "Basic agri-economics"],
      ),
      phase3(
        ["Agronomy/Horticulture", "Environmental Consulting/ESG", "Food Technology", "Agricultural Economics"],
        ["M.Sc Agriculture / Environmental Science"],
        ["ICAR-linked postgraduate programmes"],
        ["Applied research design", "Sustainability/ESG assessment", "Agribusiness fundamentals"],
      ),
      phase4(
        ["Agricultural Scientist", "Environmental Consultant", "Food Technologist", "Sustainability Manager"],
        ["Running a real pilot project or field trial", "Client/farmer-facing communication", "Data-driven recommendations"],
        "Build a real, field-tested track record - this sector genuinely rewards demonstrated on-ground results.",
      ),
      phase5(
        ["Principal Scientist", "Senior Sustainability Manager", "Farm Enterprise Owner"],
        ["Director (agricultural research institute)", "Agribusiness CEO", "ESG Leadership (corporate)"],
        ["Research programme leadership", "Enterprise/business strategy", "Policy influence on food security or climate"],
      ),
    ],
    longTermJourney: ["Class 12", "B.Sc Agriculture/Environmental Science", "M.Sc + Specialisation", "Field/Research Experience", "Principal Scientist / Enterprise Owner", "Director / Agribusiness CEO"],
  },

  "Education & Training": {
    title: "Education & Training - 15-Year Career Roadmap",
    phases: [
      phase1(
        ["Tutor a younger student or explain a tough topic to a classmate weekly", "Read one book on how people learn, even a popular one", "Volunteer at a school event or peer-mentoring initiative"],
        ["Subject-matter strength in what you'd like to teach", "Communication", "Patience and empathy"],
        ["School teaching", "Curriculum design", "Special education", "Ed-tech"],
      ),
      phase2(
        ["Integrated BA/B.Sc B.Ed (via CUET UG or the university's own B.Ed entrance)", "Any bachelor's degree + B.Ed after (B.Ed entrance varies by state/university)"],
        ["Teaching-practice placements - non-negotiable for this field", "Volunteer teaching or mentoring alongside coursework"],
        ["Lesson planning", "Classroom management", "Assessment design"],
      ),
      phase3(
        ["Subject-specialist Teaching", "Special Education", "Curriculum Development", "Ed-tech / Instructional Design"],
        ["M.Ed"],
        ["CTET / state TET"],
        ["Curriculum design at scale", "Differentiated instruction", "Mentoring newer teachers"],
      ),
      phase4(
        ["Primary/Secondary School Teacher", "Curriculum Developer", "Instructional Designer"],
        ["Building a genuine classroom track record", "Parent and student communication", "Continuing professional development"],
        "Build real teaching impact and a subject-specialist reputation, not just a credential.",
      ),
      phase5(
        ["Senior Teacher", "Vice Principal", "Senior Curriculum Lead"],
        ["Principal", "Education Director (school group)", "Ed-tech Leadership"],
        ["School/institutional leadership", "Staff development and mentoring", "Academic strategy and outcomes"],
      ),
    ],
    longTermJourney: ["Class 12", "B.Ed / Integrated Degree", "M.Ed + CTET/TET", "Classroom Experience", "Senior Teacher / Vice Principal", "Principal / Education Director"],
  },

  "Marketing": {
    title: "Marketing - 15-Year Career Roadmap",
    phases: [
      phase1(
        ["Run a small campaign for real - a college event, a small business, a social cause", "Study brands you admire and note what makes their marketing work", "Build basic content-creation and analytics literacy"],
        ["Communication", "Basic Economics/Statistics", "Creative thinking"],
        ["Digital marketing", "Brand management", "Market research", "Advertising"],
      ),
      phase2(
        ["BBA Marketing (via CUET UG or a university's own entrance)", "B.Com + marketing electives (via CUET UG)"],
        ["Internships at an agency, brand team or startup", "Run a real campaign (even a small one) and measure its results"],
        ["Digital marketing tools (SEO/SEM/social)", "Basic analytics", "Content and campaign planning"],
      ),
      phase3(
        ["Digital Marketing", "Brand Management", "Market Research/Analytics"],
        ["MBA Marketing"],
        ["Google/Meta marketing certifications"],
        ["Campaign strategy end-to-end", "Budget management", "Data-driven marketing decisions"],
      ),
      phase4(
        ["Marketing Manager", "Digital Marketing Specialist", "SEO Specialist"],
        ["Owning a brand or product's marketing", "Cross-functional work with sales/product", "Measuring real ROI on campaigns"],
        "Build a portfolio of campaigns with real, measurable results - that's the actual currency in this field.",
      ),
      phase5(
        ["Senior Brand Manager", "Head of Digital Marketing"],
        ["CMO", "VP Marketing", "Marketing/Brand Consultancy Founder"],
        ["Brand and growth strategy", "Team and agency leadership", "Board-level marketing accountability"],
      ),
    ],
    longTermJourney: ["Class 12", "BBA Marketing", "MBA + Certifications", "Campaign Experience", "Senior Brand Manager", "CMO / VP Marketing / Founder"],
  },

  "Manufacturing": {
    title: "Manufacturing - 15-Year Career Roadmap",
    phases: [
      phase1(
        ["Get strong in physics and maths - the entry ticket to every manufacturing/production branch", "Build something physical: a model, a kit, a small mechanism", "Visit a factory or production plant to see the work up close"],
        ["Physics", "Mathematics", "Basic mechanical/technical aptitude"],
        ["Production engineering", "Quality engineering", "Process/automation engineering"],
      ),
      phase2(
        ["B.Tech Production / Industrial / Mechanical Engineering"],
        ["Clear JEE/state CET into a production/industrial branch", "Vacation training at a manufacturing plant or PSU", "Learn one quality/process tool well before final year"],
        ["CAD and process-analysis tools", "Quality-control fundamentals", "Production planning basics"],
      ),
      phase3(
        ["Process/Quality Engineering", "Automation & Robotics", "Plant/Operations Management"],
        ["M.Tech (Production/Industrial)"],
        ["Six Sigma / Lean Manufacturing certification"],
        ["Process optimisation at scale", "Quality-systems leadership", "Cross-line production management"],
      ),
      phase4(
        ["Production Engineer", "Quality Engineer", "Process Engineer"],
        ["Taking charge of production lines early - responsibility compounds", "Quality-audit and root-cause analysis", "Cross-functional coordination with design/procurement"],
        "Own measurable process/quality improvements - that's what actually gets you promoted here.",
      ),
      phase5(
        ["Plant Manager", "Senior Process/Quality Lead"],
        ["VP Manufacturing", "Plant Head", "Operations Director"],
        ["Multi-plant operations strategy", "Cost and efficiency leadership", "Supply-chain and vendor management"],
      ),
    ],
    longTermJourney: ["Class 12", "B.Tech Production/Industrial", "M.Tech + Lean/Six Sigma", "Production Experience", "Plant Manager", "VP Manufacturing / Operations Director"],
  },

  "Transportation, Distribution & Logistics": {
    title: "Transportation, Distribution & Logistics - 15-Year Career Roadmap",
    phases: [
      phase1(
        ["Take physical fitness seriously and consistently - assessed everywhere in this field", "Study one real aviation/maritime/logistics story and understand the training pipeline", "Strengthen physics and maths - both flying and engineering routes need them"],
        ["Physics", "Mathematics", "Physical fitness", "Discipline/reliability"],
        ["Commercial aviation", "Merchant navy", "Supply chain & logistics management"],
      ),
      phase2(
        ["Indian Naval Academy 10+2 B.Tech (funded)", "B.Sc Nautical Science (via IMU-CET)", "BBA Logistics/Supply Chain", "Commercial Pilot License track (via a DGCA-approved flying school, after 12th)"],
        ["Clear the relevant entrance (IMU-CET / flying-school selection / BBA admission)", "Build required flying/sea-time hours or a real logistics internship", "Clear medical and fitness standards early - strict and non-negotiable"],
        ["Technical/navigation fundamentals", "Operational discipline", "Supply-chain planning basics"],
      ),
      phase3(
        ["Airline Operations", "Merchant Navy Command Track", "Supply Chain & Logistics Management"],
        ["MBA Logistics/Supply Chain Management"],
        ["DGCA Commercial Pilot Licence", "IMU competency certifications (for sea-going ranks)"],
        ["Command-level decision-making under pressure", "Fleet/route/network planning", "Regulatory compliance"],
      ),
      phase4(
        ["Commercial/Airline Pilot", "Merchant Navy Officer", "Logistics Manager", "Supply Chain Manager"],
        ["Logging flight hours / sea time / delivery-network experience", "Operational reliability under real constraints", "Cross-border/regulatory awareness"],
        "Build real, logged experience (flight hours, sea time, or network scale) - that's the literal currency for advancement here.",
      ),
      phase5(
        ["Senior Captain", "Chief Officer / Master (Merchant Navy)", "Senior Fleet/Network Manager"],
        ["VP Operations (airline/shipping/logistics)", "Director of Flight/Fleet Operations", "Own logistics enterprise"],
        ["Multi-fleet/multi-route strategy", "Safety and regulatory leadership", "Large-scale operations management"],
      ),
    ],
    longTermJourney: ["Class 12", "Naval Academy / IMU / CPL / BBA Logistics", "Command Qualification / MBA", "Operational Experience", "Senior Captain / Fleet Manager", "VP Operations / Own Enterprise"],
  },
};
