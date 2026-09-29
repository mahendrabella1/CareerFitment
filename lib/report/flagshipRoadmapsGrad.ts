// Undergraduate (UG) flagship domain roadmaps - real, independently-authored
// content transcribed from CareerFitment_UG_Domain_Roadmaps_2026.docx
// (17 of the 18 real CAREER_CLUSTERS_18 entries; "Personal Care, Beauty &
// Wellness" is not covered by the source document and falls back to the
// existing generic clusterRoadmapsGrad.ts content).
//
// UG-scoped and deliberately NOT shared with lib/report/flagshipRoadmaps1112.ts
// - per this project's class-group separation (see CLAUDE.md), Graduates
// gets its own independent data file/interface even though the shape is
// conceptually similar, because a change meant for one stage should never
// silently reach another.
//
// Unlike Class 11-12 (which starts from "no stream chosen yet"), a UG
// student has already picked a degree/course, so this roadmap starts from
// "what should I build now" rather than repeating subject/entrance-exam
// selection - see UgYearLogicRow below for the Year 1-4 framing the source
// document itself uses.

export interface GradYearPlan {
  stage: string;
  technical: string;
  nonTechnical: string;
  evidence: string;
}

export interface GradInternshipTrack {
  track: string;
  targets: string;
  prepare: string;
}

export interface GradCertification {
  name: string;
  bestFor: string;
}

export interface GradAbroadCountry {
  country: string;
  detail: string;
}

export interface FlagshipDomainRoadmapGrad {
  careerFamilies: string[];
  howToUseNote: string;
  yearPlan: GradYearPlan[];
  technicalSkillsChecklist: string[];
  nonTechnicalSkills: string[];
  internshipTracks: GradInternshipTrack[];
  internshipQualityNote: string;
  certifications: GradCertification[];
  certificationNote: string;
  careersHiredAs: string[];
  jobSearchNote: string;
  pgIndia: string;
  pgIndiaChecklist: string[];
  abroadCountries: GradAbroadCountry[];
  abroadApplicationNote: string;
  careerAdvancement: string[];
  careerEvidence: string[];
  domainCaution: string;
}

export const FLAGSHIP_ROADMAPS_GRAD: Partial<Record<string, FlagshipDomainRoadmapGrad>> = {
  "Engineering, Technology & Computing": {
    "careerFamilies": [
      "Software & Application Engineering",
      "AI, ML & Data",
      "Cloud, DevOps & Platform",
      "Cybersecurity & Networks",
      "Electronics, VLSI & Embedded Systems",
      "Mechanical/Civil/Chemical/Electrical Engineering",
      "Robotics, Automation & Mechatronics",
      "Semiconductor & Advanced Technology"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "strengthen mathematics/engineering fundamentals; one programming language; Git/GitHub; Linux; Excel; technical writing; basic CAD or domain software where relevant.",
        "nonTechnical": "communication, teamwork, time management, problem decomposition, presentation, professional email/LinkedIn.",
        "evidence": "2 small projects, GitHub/portfolio, one technical club or competition."
      },
      {
        "stage": "Year 2",
        "technical": "choose a career family; build intermediate domain depth; learn SQL/data handling; APIs/tools; testing/documentation; start cloud or hardware lab exposure as relevant.",
        "nonTechnical": "requirements gathering, peer code/design review, interview communication, project planning, networking.",
        "evidence": "one substantial project + public documentation + first targeted internship."
      },
      {
        "stage": "Year 3",
        "technical": "production-grade projects, system/design thinking, domain tools, security/quality, cloud/automation or advanced engineering methods; solve real industry problems.",
        "nonTechnical": "stakeholder communication, leadership, estimation, technical presentations, mentoring juniors.",
        "evidence": "8–12 week industry/research internship, portfolio with measurable outcomes, role-specific certification if useful."
      },
      {
        "stage": "Final Year",
        "technical": "capstone aligned to target job; interview-level DSA/core engineering; deployment/testing/validation; specialization depth.",
        "nonTechnical": "resume tailoring, interviews, negotiation, professional networking, project storytelling.",
        "evidence": "capstone, internship/project proof, 2–3 strong portfolio pieces, placement/PG application plan."
      }
    ],
    "technicalSkillsChecklist": [
      "strengthen mathematics/engineering fundamentals",
      "one programming language",
      "Git/GitHub",
      "Linux",
      "Excel",
      "technical writing",
      "basic CAD or domain software where relevant",
      "choose a career family",
      "build intermediate domain depth",
      "learn SQL/data handling",
      "APIs/tools",
      "testing/documentation",
      "start cloud or hardware lab exposure as relevant",
      "production-grade projects",
      "system/design thinking",
      "domain tools",
      "security/quality",
      "cloud/automation or advanced engineering methods"
    ],
    "nonTechnicalSkills": [
      "communication",
      "teamwork",
      "time management",
      "problem decomposition",
      "presentation",
      "professional email/LinkedIn",
      "requirements gathering",
      "peer code/design review",
      "interview communication",
      "project planning",
      "networking",
      "stakeholder communication",
      "leadership",
      "estimation"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "AICTE National Internship Portal; ISRO internships/student project trainee scheme; DRDO lab internships; C-DAC/MeitY opportunities when advertised; CSIR/IIT/IISc lab projects; NITI Aayog for technology/policy crossover.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "Startup/product-company project internships; open-source programmes; engineering design firms; semiconductor/electronics startups; cloud/data internships; university-industry labs. Use AICTE portal and company career pages; never pay an employer for an internship.",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "AWS Certified Cloud Practitioner / Solutions Architect Associate",
        "bestFor": "cloud roles"
      },
      {
        "name": "Microsoft Azure Fundamentals / Azure Administrator",
        "bestFor": "cloud roles"
      },
      {
        "name": "Google Cloud Associate Cloud Engineer",
        "bestFor": "cloud roles"
      },
      {
        "name": "Cisco CCNA",
        "bestFor": "networking"
      },
      {
        "name": "CompTIA Security+",
        "bestFor": "entry cybersecurity"
      },
      {
        "name": "Linux Foundation/Kubernetes credentials",
        "bestFor": "platform/cloud roles"
      },
      {
        "name": "Autodesk/SolidWorks/CATIA credentials",
        "bestFor": "mechanical/design pathways"
      },
      {
        "name": "Professional Scrum Master I or CAPM",
        "bestFor": "project-oriented technical roles"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Software Engineer",
      "Backend/Frontend/Full-Stack Developer",
      "AI/ML Engineer",
      "Data Engineer",
      "Cloud Engineer",
      "DevOps Engineer",
      "Cybersecurity Analyst",
      "Network Engineer",
      "Embedded Engineer",
      "VLSI/Design Engineer",
      "Automation/Robotics Engineer",
      "Mechanical/Civil/Electrical/Chemical Engineer",
      "Systems Engineer",
      "Technical Support/Implementation Engineer"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "M.Tech/M.E. in engineering specialisation; M.S./MSc in CS, AI, Data Science, Cybersecurity, Robotics, VLSI, Embedded, Energy, Mechanical, Civil etc.; MBA/PGDM for product/technology management. India examples: IITs, IISc, IIIT Hyderabad, IISERs for research-linked computing/science, NITs, BITS Pilani, top state universities. Funding: GATE-linked assistantships where applicable, institute assistantships, UGC/NSP schemes, project-funded research positions.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "USA",
        "detail": "MIT, Stanford, Carnegie Mellon, Georgia Tech, UIUC, UC Berkeley; scholarships/assistantships: university TA/RA, Fulbright-Nehru for eligible fields/years."
      },
      {
        "country": "UK",
        "detail": "Imperial, Oxford, Cambridge, UCL, Manchester; Chevening/Commonwealth plus university awards."
      },
      {
        "country": "Germany",
        "detail": "TUM, RWTH Aachen, KIT, TU Berlin; DAAD and university/research assistantships."
      },
      {
        "country": "Canada",
        "detail": "Toronto, UBC, Waterloo, McGill; university funding/RA/TA and Mitacs pathways."
      },
      {
        "country": "Australia",
        "detail": "Melbourne, UNSW, Monash, ANU, Sydney; university scholarships and research scholarships."
      },
      {
        "country": "Netherlands",
        "detail": "TU Delft, Eindhoven, University of Twente; university scholarships and Erasmus Mundus for joint programmes."
      },
      {
        "country": "France",
        "detail": "Paris-Saclay, PSL, Grenoble INP, Institut Polytechnique de Paris; Eiffel for eligible master's/doctoral fields."
      },
      {
        "country": "Japan/South Korea",
        "detail": "University of Tokyo, Kyoto, Osaka; KAIST, SNU, POSTECH; MEXT/GKS respectively."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Early career → Senior Engineer/Analyst → Lead/Staff/Principal → Engineering/Architecture/Technical Manager → Director/Head/VP.",
      "Research route: strong UG project → MSc/MTech/MS → research assistantship → PhD → Scientist/Research Engineer/Professor/R&D leadership.",
      "Technology management route: technical role → product/project/engineering management → director/VP; MBA can be considered when management becomes the target."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "Engineering is a family, not one career. The roadmap must branch by target role; a software engineer and a civil engineer should not receive the same skill checklist."
  },
  "Science, Mathematics & Research": {
    "careerFamilies": [
      "Physics & Astrophysics",
      "Chemistry & Materials",
      "Biology & Life Sciences",
      "Mathematics",
      "Statistics & Data",
      "Earth/Geosciences",
      "Environmental Science",
      "Scientific Computing & Interdisciplinary Research"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "calculus, linear algebra, statistics, scientific programming (Python/R/Julia/Matlab as relevant), laboratory safety, scientific writing, literature search.",
        "nonTechnical": "curiosity, lab discipline, documentation, critical reading, presentation, research ethics.",
        "evidence": "reproduce one published/simple experiment, maintain a lab/research notebook, attend seminars."
      },
      {
        "stage": "Year 2",
        "technical": "choose subfield; experimental methods or mathematical modelling; statistics; data visualization; literature review; instrument/software exposure.",
        "nonTechnical": "research question framing, collaboration, scientific communication, poster/presentation skills.",
        "evidence": "mini research project, faculty mentorship, summer research application."
      },
      {
        "stage": "Year 3",
        "technical": "advanced methods; reproducible analysis; research design; domain tools; coding or laboratory technique; start conference/poster/paper-quality work.",
        "nonTechnical": "peer review, scientific argument, project planning, research networking.",
        "evidence": "research internship, poster/preprint/report, recommendation from faculty."
      },
      {
        "stage": "Final Year",
        "technical": "independent dissertation/capstone; advanced statistics/computation; thesis writing; publication-quality figures/data; prepare for MSc/PhD/R&D.",
        "nonTechnical": "research presentation, grant/proposal basics, academic CV, interview communication.",
        "evidence": "dissertation + research portfolio + postgraduate/research applications."
      }
    ],
    "technicalSkillsChecklist": [
      "calculus",
      "linear algebra",
      "statistics",
      "scientific programming (Python/R/Julia/Matlab as relevant)",
      "laboratory safety",
      "scientific writing",
      "literature search",
      "choose subfield",
      "experimental methods or mathematical modelling",
      "data visualization",
      "literature review",
      "instrument/software exposure",
      "advanced methods",
      "reproducible analysis",
      "research design",
      "domain tools",
      "coding or laboratory technique",
      "start conference/poster/paper-quality work"
    ],
    "nonTechnicalSkills": [
      "curiosity",
      "lab discipline",
      "documentation",
      "critical reading",
      "presentation",
      "research ethics",
      "research question framing",
      "collaboration",
      "scientific communication",
      "poster/presentation skills",
      "peer review",
      "scientific argument",
      "project planning",
      "research networking"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "ISRO internship/project trainee; CSIR laboratories; DRDO research internships; ICMR/DBT-linked institutes for life sciences; DST/INSPIRE ecosystem; IISc/IIT/IISER faculty labs; government research institutes when calls are advertised.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "Biotech/pharma R&D; analytical labs; environmental testing; scientific instrumentation companies; data-science research teams; university-industry labs; open research projects. Look for faculty referrals and company research internships rather than generic certificate internships.",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "GCP/ICH training",
        "bestFor": "clinical research pathways"
      },
      {
        "name": "Biostatistics/SAS or R credentials where employer-recognised",
        "bestFor": "clinical/data roles"
      },
      {
        "name": "GIS certification",
        "bestFor": "earth/environment pathways"
      },
      {
        "name": "Lab quality/ISO 17025 training",
        "bestFor": "analytical laboratory roles"
      },
      {
        "name": "Data/ML professional credentials",
        "bestFor": "computational science"
      },
      {
        "name": "Scientific computing/HPC training",
        "bestFor": "research computing"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Research Assistant",
      "Laboratory Analyst",
      "Research Associate",
      "Scientific Data Analyst",
      "Statistician",
      "Biostatistician",
      "Data Scientist",
      "Scientific Programmer",
      "Laboratory Technologist",
      "Research Technician",
      "Quality/Validation Analyst",
      "Junior Scientist (where eligibility permits)"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "MSc/Integrated MSc/BS-MS/MS in Physics, Chemistry, Mathematics, Statistics, Biology, Biotechnology, Geology, Materials, Computational Science; PhD for independent research/academic scientist routes. India examples: IISc, IISERs, IITs, ISI, TIFR, NISER, central universities, CSIR labs/universities. Funding: INSPIRE-SHE, UGC/CSIR fellowships, institute assistantships, project-funded JRF/RA roles.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "USA",
        "detail": "MIT, Harvard, Stanford, Caltech, Princeton, UC Berkeley; RA/TA and university fellowships; Fulbright-Nehru in eligible fields."
      },
      {
        "country": "UK",
        "detail": "Oxford, Cambridge, Imperial, Edinburgh, UCL; Commonwealth/Chevening for eligible programmes."
      },
      {
        "country": "Germany",
        "detail": "Heidelberg, LMU Munich, TUM, Göttingen; DAAD and research institute funding."
      },
      {
        "country": "Canada",
        "detail": "Toronto, UBC, McGill, Alberta; RA/TA and university scholarships."
      },
      {
        "country": "Australia",
        "detail": "ANU, Melbourne, Sydney, Monash; RTP/university research scholarships."
      },
      {
        "country": "Netherlands",
        "detail": "Leiden, Utrecht, Delft, Amsterdam; Erasmus Mundus/university scholarships."
      },
      {
        "country": "France",
        "detail": "PSL, Paris-Saclay, Sorbonne, Grenoble Alpes; Eiffel for eligible fields."
      },
      {
        "country": "Japan/Korea",
        "detail": "University of Tokyo, Kyoto, Osaka; KAIST, SNU, POSTECH; MEXT/GKS."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Research assistant → Scientist/Research Associate → Senior Scientist → Principal Scientist/Research Lead → R&D leadership.",
      "Academic route: MSc/MS → PhD → Postdoc (where needed) → faculty/research scientist. Industry route can move into R&D, analytics, data, regulatory or scientific product roles."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "For research careers, research output, methods, faculty references and evidence of scientific work often matter more than collecting unrelated certificates."
  },
  "Healthcare & Medicine": {
    "careerFamilies": [
      "Medicine",
      "Dentistry",
      "Nursing",
      "Pharmacy",
      "Physiotherapy & Rehabilitation",
      "Occupational Therapy",
      "Allied Health/Lab/Imaging",
      "Public Health",
      "Clinical Research",
      "Healthcare Administration",
      "Health Informatics/Digital Health",
      "Nutrition & Dietetics",
      "Biomedical Engineering",
      "Mental/Behavioural Health"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "anatomy/physiology or core discipline foundations; clinical/lab safety; evidence-based practice; medical terminology; basic statistics/data literacy.",
        "nonTechnical": "empathy, patient communication, teamwork, ethics, confidentiality, reflective practice.",
        "evidence": "skills log, supervised exposure where permitted, one evidence-summary project."
      },
      {
        "stage": "Year 2",
        "technical": "core clinical/lab competencies; pharmacology/pathology or discipline-specific subjects; research methods; documentation; digital health basics where relevant.",
        "nonTechnical": "patient interviewing, teamwork, case presentation, cultural sensitivity, stress management.",
        "evidence": "supervised practical/clinical exposure + research/health project."
      },
      {
        "stage": "Year 3",
        "technical": "advanced clinical/technical skills; evidence appraisal; quality improvement; clinical research/GCP for research tracks; health informatics for digital track.",
        "nonTechnical": "multidisciplinary collaboration, case communication, leadership, professional boundaries.",
        "evidence": "major clinical/research internship, audit/QI project."
      },
      {
        "stage": "Final Year",
        "technical": "internship/clinical rotations, specialty preparation, dissertation/project, licensing/registration requirements; advanced data or administration skills for non-clinical tracks.",
        "nonTechnical": "professional conduct, handover, interview readiness, documentation.",
        "evidence": "internship/clinical completion, portfolio, PG/licensing plan."
      }
    ],
    "technicalSkillsChecklist": [
      "anatomy/physiology or core discipline foundations",
      "clinical/lab safety",
      "evidence-based practice",
      "medical terminology",
      "basic statistics/data literacy",
      "core clinical/lab competencies",
      "pharmacology/pathology or discipline-specific subjects",
      "research methods",
      "documentation",
      "digital health basics where relevant",
      "advanced clinical/technical skills",
      "evidence appraisal",
      "quality improvement",
      "clinical research/GCP for research tracks",
      "health informatics for digital track",
      "internship/clinical rotations",
      "specialty preparation",
      "dissertation/project"
    ],
    "nonTechnicalSkills": [
      "empathy",
      "patient communication",
      "teamwork",
      "ethics",
      "confidentiality",
      "reflective practice",
      "patient interviewing",
      "case presentation",
      "cultural sensitivity",
      "stress management",
      "multidisciplinary collaboration",
      "case communication",
      "leadership",
      "professional boundaries"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "AIIMS/central government hospitals and institutes; ICMR institutes; CSIR/DBT labs; National Health Mission/state health departments; ESIC/CGHS/Railways/defence health services where student opportunities are advertised; ISRO/DRDO for biomedical/health-tech research.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "Hospitals, diagnostic labs, pharma companies, CROs, health-tech startups, digital health firms, medical device companies, nutrition/wellness organisations. Prefer supervised and legally appropriate roles.",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "BLS/ACLS where role and training body require it",
        "bestFor": "Role-specific"
      },
      {
        "name": "Good Clinical Practice (ICH-GCP)",
        "bestFor": "clinical research"
      },
      {
        "name": "Clinical Data Management/SAS",
        "bestFor": "clinical research/data"
      },
      {
        "name": "CPHQ",
        "bestFor": "healthcare quality"
      },
      {
        "name": "Lean Six Sigma",
        "bestFor": "hospital operations"
      },
      {
        "name": "Health informatics credentials/HL7-FHIR training",
        "bestFor": "digital health"
      },
      {
        "name": "Medical coding credentials (e.g., CPC)",
        "bestFor": "coding/billing pathways"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Resident/Intern roles subject to professional qualification",
      "Staff Nurse",
      "Pharmacist",
      "Physiotherapist",
      "Occupational Therapist",
      "Medical Laboratory Technologist",
      "Radiology/Imaging Technologist",
      "Clinical Research Coordinator",
      "Public Health Associate",
      "Healthcare Operations Executive",
      "Health Data Analyst",
      "Medical Coding Specialist"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "MBBS → MD/MS/DNB; BDS → MDS; Nursing → MSc Nursing; Pharmacy → MPharm/PharmD/MBA; allied health → relevant MSc/MPT/MOT; Public Health → MPH; Healthcare administration → MHA/MBA; research → MSc/MTech/PhD. India examples: AIIMS, PGIMER, JIPMER, NIMHANS, TISS/PHFI-linked programmes, Manipal, CMC Vellore, JSS and other recognised institutions. Funding varies by programme; use NSP, institute aid, research assistantships and government fellowships.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "USA",
        "detail": "Johns Hopkins, Harvard, Stanford, UCSF, University of Michigan; note professional licensing differs for clinical practice."
      },
      {
        "country": "UK",
        "detail": "Imperial, UCL, King's, Edinburgh, Oxford; clinical professions require UK registration."
      },
      {
        "country": "Canada",
        "detail": "Toronto, McGill, UBC, Alberta; professional licensing applies."
      },
      {
        "country": "Australia",
        "detail": "Melbourne, Sydney, Monash, Queensland; AHPRA/discipline-specific registration for regulated practice."
      },
      {
        "country": "Germany",
        "detail": "Heidelberg, Charité, LMU; language/licensing can be critical for clinical practice."
      },
      {
        "country": "Netherlands",
        "detail": "Amsterdam, Erasmus University Rotterdam, Utrecht; regulated practice requirements."
      },
      {
        "country": "Singapore",
        "detail": "NUS, NTU, Duke-NUS; local registration for clinical roles."
      },
      {
        "country": "Japan/Korea",
        "detail": "University of Tokyo/Kyoto; SNU/KAIST/POSTECH; language/licensing varies."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Clinical route: internship/registration → entry-level clinician → specialist training → consultant/senior practitioner → clinical leadership.",
      "Research route: UG → MSc/MPH/MSc research → PhD → scientist/faculty/R&D.",
      "Administration route: UG clinical/allied degree → MHA/MBA/MPH → operations/quality → hospital leadership."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "Clinical and regulated professions require country- and profession-specific registration/licensing. A master's degree alone does not automatically confer the right to practise medicine or another regulated profession."
  },
  "Psychology, Humanities & Social Sciences": {
    "careerFamilies": [
      "Psychology & Counselling",
      "Sociology & Anthropology",
      "Economics",
      "Political Science & International Relations",
      "History & Heritage",
      "Philosophy",
      "Development Studies",
      "Social Research & Policy",
      "Human Services/Community Work"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "academic writing, research methods, statistics, qualitative methods, psychology/social theory foundations, citation/reference management.",
        "nonTechnical": "active listening, interviewing, cultural awareness, facilitation, public speaking, reflective practice.",
        "evidence": "literature review + small survey/interview project."
      },
      {
        "stage": "Year 2",
        "technical": "choose area; SPSS/R/Python or qualitative analysis; survey design; field methods; policy/impact analysis; basic programme evaluation.",
        "nonTechnical": "stakeholder interviews, teamwork, ethical judgement, communication across perspectives.",
        "evidence": "field/research project and faculty mentorship."
      },
      {
        "stage": "Year 3",
        "technical": "advanced methods, data analysis, research design, policy writing, intervention/programme evaluation, domain tools.",
        "nonTechnical": "client/stakeholder communication, facilitation, negotiation, professional boundaries.",
        "evidence": "serious internship in research/NGO/policy/HR/market research or supervised psychology setting."
      },
      {
        "stage": "Final Year",
        "technical": "dissertation/capstone, advanced analysis, publication/report writing, specialisation preparation.",
        "nonTechnical": "interview readiness, professional writing, networking, portfolio presentation.",
        "evidence": "dissertation + policy/research portfolio + PG or employment plan."
      }
    ],
    "technicalSkillsChecklist": [
      "academic writing",
      "research methods",
      "statistics",
      "qualitative methods",
      "psychology/social theory foundations",
      "citation/reference management",
      "choose area",
      "SPSS/R/Python or qualitative analysis",
      "survey design",
      "field methods",
      "policy/impact analysis",
      "basic programme evaluation",
      "advanced methods",
      "data analysis",
      "research design",
      "policy writing",
      "intervention/programme evaluation",
      "domain tools"
    ],
    "nonTechnicalSkills": [
      "active listening",
      "interviewing",
      "cultural awareness",
      "facilitation",
      "public speaking",
      "reflective practice",
      "stakeholder interviews",
      "teamwork",
      "ethical judgement",
      "communication across perspectives",
      "client/stakeholder communication",
      "negotiation",
      "professional boundaries",
      "interview readiness"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "NITI Aayog internships; government ministries/departments; National/State commissions; public universities/research centres; district administration/urban local bodies; public health and social-development programmes when openings are advertised.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "Research agencies, consulting firms, HR/people analytics, NGOs, CSR teams, edtech, mental-health organisations, market research, think tanks, social enterprises. For psychology, use supervised/legally appropriate roles.",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "SPSS/R/data analysis credentials",
        "bestFor": "research/analytics"
      },
      {
        "name": "Qualitative research/M&E training",
        "bestFor": "development sector"
      },
      {
        "name": "Google/PMI project credentials",
        "bestFor": "programme management"
      },
      {
        "name": "CIPP/privacy or compliance credentials",
        "bestFor": "policy/data governance"
      },
      {
        "name": "People analytics credentials",
        "bestFor": "HR pathway"
      },
      {
        "name": "Specialised counselling/psychology training only where aligned with recognised professional requirements",
        "bestFor": "Role-specific"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Research Assistant",
      "Social Researcher",
      "Policy Research Assistant",
      "Programme Associate",
      "NGO Programme Coordinator",
      "Community Development Officer",
      "HR/People Analytics Analyst",
      "Market Research Analyst",
      "Content/Editorial Researcher",
      "Policy Analyst (entry-level)",
      "Case/Support roles where eligibility permits"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "MA/MSc Psychology, Counselling, Social Work, Sociology, Economics, Public Policy, Development Studies, International Relations, Anthropology, History; law/management as adjacent routes. India examples: TISS, JNU, DU, University of Hyderabad, JMI, BHU, Ashoka, Azim Premji, FLAME, OP Jindal. Funding through institute aid, UGC/NSP, research assistantships and fellowships.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "USA",
        "detail": "Harvard, Columbia, Chicago, Michigan, NYU; university funding/assistantships."
      },
      {
        "country": "UK",
        "detail": "LSE, Oxford, Cambridge, UCL, Edinburgh; Chevening/Commonwealth where eligible."
      },
      {
        "country": "Canada",
        "detail": "Toronto, UBC, McGill, Waterloo, Queen's; RA/TA/university awards."
      },
      {
        "country": "Germany",
        "detail": "Humboldt, LMU, Heidelberg, Freie Universität Berlin; DAAD."
      },
      {
        "country": "Netherlands",
        "detail": "Leiden, Amsterdam, Erasmus Rotterdam, Utrecht; Erasmus Mundus/university awards."
      },
      {
        "country": "France",
        "detail": "Sciences Po, PSL, Paris 1 Panthéon-Sorbonne; Eiffel for eligible fields."
      },
      {
        "country": "Australia",
        "detail": "ANU, Melbourne, Sydney, UNSW; university scholarships."
      },
      {
        "country": "Singapore/Japan/Korea",
        "detail": "NUS, NTU; University of Tokyo/Kyoto; SNU/Korea University; university/GKS/MEXT where applicable."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Research/academia: UG → master's → research assistant → PhD → academic/research career.",
      "Policy: research/programme associate → analyst → senior analyst/manager → policy/programme leadership.",
      "Psychology: follow the specific regulated/professional pathway in the country; do not promise clinical practice from a generic psychology degree."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "Psychology is especially important to separate from counselling/clinical practice. Use the exact current professional eligibility rules for regulated titles."
  },
  "Sports, Fitness & Human Performance": {
    "careerFamilies": [
      "Sports Coaching",
      "Strength & Conditioning",
      "Sports Science",
      "Sports Psychology",
      "Sports Nutrition",
      "Physiotherapy & Rehabilitation",
      "Performance Analysis & Sports Data",
      "Sports Management",
      "Physical Education",
      "Sports Media & Event Operations"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "anatomy, physiology, biomechanics basics; fitness assessment; sport-specific fundamentals; Excel/data basics.",
        "nonTechnical": "coaching communication, motivation, observation, teamwork, athlete safety, professionalism.",
        "evidence": "training log + basic athlete assessment project + volunteer with a sports team."
      },
      {
        "stage": "Year 2",
        "technical": "exercise prescription, strength training, nutrition basics, performance testing, video analysis, statistics.",
        "nonTechnical": "feedback delivery, session planning, leadership, safeguarding, communication with athletes/coaches.",
        "evidence": "supervised coaching/fitness internship + performance analysis project."
      },
      {
        "stage": "Year 3",
        "technical": "advanced strength/conditioning, sports science, rehab support boundaries, GPS/video/data analytics, sport psychology principles, event operations depending on track.",
        "nonTechnical": "multidisciplinary teamwork, client management, reporting, ethical conduct.",
        "evidence": "major internship with academy/club/lab + measurable performance project."
      },
      {
        "stage": "Final Year",
        "technical": "dissertation/capstone, advanced testing/analysis, sport-specific specialisation, professional credential preparation.",
        "nonTechnical": "athlete/stakeholder communication, presentation, career networking, entrepreneurship basics.",
        "evidence": "performance portfolio + internship + PG/professional certification plan."
      }
    ],
    "technicalSkillsChecklist": [
      "anatomy",
      "physiology",
      "biomechanics basics",
      "fitness assessment",
      "sport-specific fundamentals",
      "Excel/data basics",
      "exercise prescription",
      "strength training",
      "nutrition basics",
      "performance testing",
      "video analysis",
      "statistics",
      "advanced strength/conditioning",
      "sports science",
      "rehab support boundaries",
      "GPS/video/data analytics",
      "sport psychology principles",
      "event operations depending on track"
    ],
    "nonTechnicalSkills": [
      "coaching communication",
      "motivation",
      "observation",
      "teamwork",
      "athlete safety",
      "professionalism",
      "feedback delivery",
      "session planning",
      "leadership",
      "safeguarding",
      "communication with athletes/coaches",
      "multidisciplinary teamwork",
      "client management",
      "reporting"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "Sports Authority of India and its centres; Khelo India ecosystem; state sports authorities; university sports departments; government academies and sports science labs when internships/volunteering are advertised.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "Sports academies, professional clubs, gyms, fitness chains, sports-tech startups, athlete management companies, sports analytics firms, nutrition/wellness companies, event organisers.",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "NSCA CSCS",
        "bestFor": "strength & conditioning (eligibility applies)"
      },
      {
        "name": "ACSM certifications",
        "bestFor": "fitness/exercise pathways"
      },
      {
        "name": "ISAK anthropometry",
        "bestFor": "sports science/nutrition support"
      },
      {
        "name": "FIFA/IOC/recognised sport-specific coaching courses where relevant",
        "bestFor": "Role-specific"
      },
      {
        "name": "Data analytics certifications",
        "bestFor": "performance analysis"
      },
      {
        "name": "Sports nutrition credentials from recognised bodies",
        "bestFor": "nutrition pathway"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Strength & Conditioning Assistant",
      "Sports Performance Analyst",
      "Sports Data Analyst",
      "Fitness Trainer",
      "Sports Coach",
      "PE/Activity Instructor",
      "Sports Event Coordinator",
      "Sports Operations Executive",
      "Sports Marketing Executive",
      "Sports Science Assistant",
      "Sports Nutrition Assistant (within scope/qualification)",
      "Sports Psychology Assistant/Research Assistant (professional eligibility applies)"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "MSc Sports Science, Exercise Physiology, Strength & Conditioning, Sports Psychology, Sports Nutrition, Physiotherapy, Sports Management, MBA Sports Management. India examples: SAI/National Sports University, LNIPE, Manipal, Bharati Vidyapeeth, select universities with sports science programmes. Funding through institute scholarships, sports quotas where applicable, NSP and research assistantships.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "USA",
        "detail": "University of North Carolina, Michigan, Florida State, Stanford; sport science/management options."
      },
      {
        "country": "UK",
        "detail": "Loughborough, Birmingham, Edinburgh, Bath; Commonwealth/Chevening where eligible."
      },
      {
        "country": "Australia",
        "detail": "Queensland, Sydney, Deakin, Australian Catholic University; university scholarships."
      },
      {
        "country": "Canada",
        "detail": "UBC, Toronto, Alberta, McMaster; university funding."
      },
      {
        "country": "Germany",
        "detail": "German Sport University Cologne, Leipzig University; DAAD."
      },
      {
        "country": "Netherlands",
        "detail": "Vrije Universiteit Amsterdam, Groningen, Maastricht; Erasmus Mundus/university awards."
      },
      {
        "country": "Japan/Korea",
        "detail": "Waseda, University of Tokyo; Korea University, Yonsei; MEXT/GKS where applicable."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Coach/performance route → senior coach/performance lead → head of performance → performance director.",
      "Analytics route → analyst → senior analyst → performance/data lead → sports science/analytics manager.",
      "Management route → coordinator → manager → head of operations/club administration. Research route → MSc → PhD → sports scientist/academic."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "Clinical sports roles such as physiotherapy, psychology and dietetics require the relevant professional qualification/registration; do not collapse all sports careers into 'fitness trainer'."
  },
  "Agriculture, Food & Life Sciences": {
    "careerFamilies": [
      "Agriculture & Crop Science",
      "Horticulture",
      "Food Science & Technology",
      "Agribusiness",
      "Animal Science/Veterinary",
      "Fisheries & Aquaculture",
      "Forestry",
      "Biotechnology",
      "Food Safety & Quality",
      "AgriTech & Precision Agriculture",
      "Agricultural Economics & Rural Development"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "biology/chemistry/statistics foundations; soil/crop/food/lab basics; Excel; scientific writing; GIS or programming orientation.",
        "nonTechnical": "field observation, teamwork, farmer/community communication, documentation, problem solving.",
        "evidence": "field/lab notebook + crop/food/process mini-project."
      },
      {
        "stage": "Year 2",
        "technical": "specialisation; agronomy/food processing/biotech/animal science; statistics; GIS/remote sensing; quality systems; Python/data where relevant.",
        "nonTechnical": "field interviews, project planning, technical presentation, stakeholder communication.",
        "evidence": "field/lab internship or faculty research project."
      },
      {
        "stage": "Year 3",
        "technical": "advanced domain methods; food safety/quality, precision agriculture, supply chain, molecular methods, animal production or environmental systems depending on track.",
        "nonTechnical": "professional reporting, leadership, entrepreneurship, cross-functional collaboration.",
        "evidence": "8–12 week industry/research/field internship + applied project."
      },
      {
        "stage": "Final Year",
        "technical": "dissertation/capstone, advanced analytics/research, product/process development, business case or field trial.",
        "nonTechnical": "client/farmer communication, presentation, interview skills, career planning.",
        "evidence": "thesis/project + role-specific certification + PG/job plan."
      }
    ],
    "technicalSkillsChecklist": [
      "biology/chemistry/statistics foundations",
      "soil/crop/food/lab basics",
      "Excel",
      "scientific writing",
      "GIS or programming orientation",
      "specialisation",
      "agronomy/food processing/biotech/animal science",
      "statistics",
      "GIS/remote sensing",
      "quality systems",
      "Python/data where relevant",
      "advanced domain methods",
      "food safety/quality",
      "precision agriculture",
      "supply chain",
      "molecular methods",
      "animal production or environmental systems depending on track",
      "dissertation/capstone"
    ],
    "nonTechnicalSkills": [
      "field observation",
      "teamwork",
      "farmer/community communication",
      "documentation",
      "problem solving",
      "field interviews",
      "project planning",
      "technical presentation",
      "stakeholder communication",
      "professional reporting",
      "leadership",
      "entrepreneurship",
      "cross-functional collaboration",
      "client/farmer communication"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "ICAR institutes; agricultural universities; Ministry/State Agriculture departments; NABARD-linked programmes; FSSAI; MoFPI; food research institutes; forestry/fisheries departments; DBT/biotech labs; CSIR labs.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "AgriTech startups, seed companies, food processors, FMCG, dairy, fertilizer/agrochemical firms, agri-finance/insurance, food labs, cold-chain companies, farm-tech and precision-agriculture firms.",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "HACCP",
        "bestFor": "food safety"
      },
      {
        "name": "ISO 22000/food safety lead auditor training",
        "bestFor": "food industry"
      },
      {
        "name": "GIS/remote sensing credentials",
        "bestFor": "precision agriculture"
      },
      {
        "name": "Drone/RPAS certification as required under DGCA rules",
        "bestFor": "agri-drone roles"
      },
      {
        "name": "Data analytics/cloud credentials",
        "bestFor": "AgriTech"
      },
      {
        "name": "Lean Six Sigma",
        "bestFor": "food/process manufacturing"
      },
      {
        "name": "PMP/CAPM",
        "bestFor": "project/programme roles"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Agronomist",
      "Agricultural Officer/Field Associate",
      "Food Technologist",
      "Food Safety/Quality Executive",
      "AgriTech Analyst",
      "Precision Agriculture Specialist",
      "Agribusiness Associate",
      "Supply Chain/Procurement Associate",
      "Research Assistant",
      "Laboratory Analyst",
      "Seed/Plant Breeding Assistant",
      "Rural Development/Extension Associate"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "MSc/MTech Agriculture, Horticulture, Food Technology, Biotechnology, Animal Science, Forestry, Fisheries, Agricultural Economics; MBA Agribusiness; MPH/Environmental science for adjacent tracks. India examples: IARI, TNAU, PAU, UAS Bengaluru, ANGRAU, NIFTEM, CFTRI-linked pathways, IVRI, ICAR institutes. Funding: ICAR scholarships/fellowships, NSP, institute assistantships.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "USA",
        "detail": "Cornell, UC Davis, Iowa State, Texas A&M; assistantships/USDA-linked research."
      },
      {
        "country": "Canada",
        "detail": "Guelph, Saskatchewan, Alberta, UBC; research assistantships."
      },
      {
        "country": "Netherlands",
        "detail": "Wageningen University & Research; major agri/food ecosystem, scholarships vary."
      },
      {
        "country": "Germany",
        "detail": "Hohenheim, Göttingen, TUM; DAAD."
      },
      {
        "country": "UK",
        "detail": "Reading, Nottingham, Cranfield, Harper Adams; Commonwealth/Chevening where eligible."
      },
      {
        "country": "Australia",
        "detail": "Queensland, Melbourne, Sydney, Agriculture/food programmes; university scholarships."
      },
      {
        "country": "France",
        "detail": "AgroParisTech, Paris-Saclay, Montpellier; Eiffel for eligible areas."
      },
      {
        "country": "Japan/Korea",
        "detail": "University of Tokyo, Kyoto; Seoul National, Korea University; MEXT/GKS."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Technical/field route → specialist → senior agronomist/food technologist/quality lead → technical manager/director.",
      "Research route → MSc → PhD → scientist/plant breeder/food researcher/faculty.",
      "Business route → agribusiness associate → manager → category/business head → agribusiness leadership/entrepreneurship."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "Veterinary and some food/health professions are regulated. AgriTech can also be entered from engineering/data backgrounds, so cross-domain pathways should be visible."
  },
  "Environment, Energy & Sustainability": {
    "careerFamilies": [
      "Environmental Science & Management",
      "Renewable Energy",
      "Energy Engineering & Management",
      "Climate & Sustainability",
      "Water Resources",
      "Waste & Circular Economy",
      "Environmental Impact & Compliance",
      "ESG & Sustainability Reporting",
      "Conservation & Ecology",
      "Green Buildings & Sustainable Infrastructure"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "environmental chemistry/ecology or engineering fundamentals; statistics; Excel; GIS orientation; energy basics; scientific/report writing.",
        "nonTechnical": "stakeholder engagement, field safety, communication, systems thinking, ethical reasoning.",
        "evidence": "campus sustainability audit + basic GIS/energy/waste project."
      },
      {
        "stage": "Year 2",
        "technical": "choose environment/energy/ESG; GIS/remote sensing; carbon accounting basics; environmental sampling; renewable systems; LCA or data analysis.",
        "nonTechnical": "policy reading, stakeholder interviewing, project planning, presentation.",
        "evidence": "field/lab project + internship application portfolio."
      },
      {
        "stage": "Year 3",
        "technical": "advanced LCA/ESG/carbon/GIS/energy modelling/environmental compliance; domain software; data analytics.",
        "nonTechnical": "consulting communication, client reporting, teamwork, negotiation.",
        "evidence": "major internship with measurable sustainability outcome + technical report."
      },
      {
        "stage": "Final Year",
        "technical": "capstone/impact assessment/energy model/ESG report; advanced analysis; professional standards; PG preparation.",
        "nonTechnical": "consulting case presentation, proposal writing, networking, interview readiness.",
        "evidence": "capstone + professional portfolio + certification where relevant."
      }
    ],
    "technicalSkillsChecklist": [
      "environmental chemistry/ecology or engineering fundamentals",
      "statistics",
      "Excel",
      "GIS orientation",
      "energy basics",
      "scientific/report writing",
      "choose environment/energy/ESG",
      "GIS/remote sensing",
      "carbon accounting basics",
      "environmental sampling",
      "renewable systems",
      "LCA or data analysis",
      "advanced LCA/ESG/carbon/GIS/energy modelling/environmental compliance",
      "domain software",
      "data analytics",
      "capstone/impact assessment/energy model/ESG report",
      "advanced analysis",
      "professional standards"
    ],
    "nonTechnicalSkills": [
      "stakeholder engagement",
      "field safety",
      "communication",
      "systems thinking",
      "ethical reasoning",
      "policy reading",
      "stakeholder interviewing",
      "project planning",
      "presentation",
      "consulting communication",
      "client reporting",
      "teamwork",
      "negotiation",
      "consulting case presentation"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "MoEFCC and state environment departments; CPCB/SPCB; TERI and public research ecosystem; MNRE-linked organisations; CEEW/other policy research organisations; municipal bodies; water/forest agencies; public sector energy companies.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "Renewable energy firms, ESG/sustainability consultancies, environmental labs, engineering consultancies, waste/circular-economy companies, green-building firms, climate-tech startups, corporate sustainability teams.",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "LEED Green Associate/AP",
        "bestFor": "green buildings"
      },
      {
        "name": "GRI professional training",
        "bestFor": "sustainability reporting"
      },
      {
        "name": "ISO 14001 auditor/EMS training",
        "bestFor": "environmental management"
      },
      {
        "name": "GHG Protocol/carbon accounting training",
        "bestFor": "climate/ESG"
      },
      {
        "name": "Energy management/BEE-linked credentials",
        "bestFor": "energy roles"
      },
      {
        "name": "NEBOSH Environmental Management Certificate",
        "bestFor": "EHS/environment roles"
      },
      {
        "name": "GIS credentials",
        "bestFor": "environment/geospatial roles"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Environmental Analyst",
      "Sustainability Analyst",
      "ESG Analyst",
      "Energy Analyst",
      "Renewable Energy Engineer",
      "Environmental Consultant",
      "EHS Associate",
      "Carbon Accounting Analyst",
      "GIS Analyst",
      "Environmental Scientist",
      "Waste/Circular Economy Associate",
      "Climate Research Assistant"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "MSc/MTech Environmental Science/Engineering, Renewable Energy, Energy Management, Climate Science, Sustainability, Water Resources, GIS/Remote Sensing, Environmental Economics, ESG. India examples: IITs, IISc, TERI School of Advanced Studies, IISERs, central universities, NITs. Funding: GATE assistantships, institute scholarships, UGC/NSP, project-funded research.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "USA",
        "detail": "Stanford, UC Berkeley, MIT, Columbia, Michigan; university fellowships/assistantships."
      },
      {
        "country": "UK",
        "detail": "Imperial, Oxford, Cambridge, UCL, Edinburgh; Chevening/Commonwealth."
      },
      {
        "country": "Germany",
        "detail": "TUM, RWTH, Freiburg, Heidelberg; DAAD."
      },
      {
        "country": "Netherlands",
        "detail": "Wageningen, TU Delft, Utrecht, Eindhoven; Erasmus Mundus."
      },
      {
        "country": "Sweden",
        "detail": "KTH, Chalmers, Lund; Swedish Institute scholarships where eligible."
      },
      {
        "country": "France",
        "detail": "Paris-Saclay, PSL, Grenoble; Eiffel for eligible fields."
      },
      {
        "country": "Australia",
        "detail": "ANU, Melbourne, UNSW, Queensland; university scholarships."
      },
      {
        "country": "Canada",
        "detail": "UBC, Toronto, Waterloo, McGill; university research funding."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Analyst/engineer → senior specialist/consultant → project/technical manager → sustainability/environment/energy director.",
      "Research route → MSc/MS → PhD → climate scientist/energy researcher/academic.",
      "ESG route → analyst → manager → sustainability/ESG head → strategy leadership."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "Sustainability is cross-disciplinary: engineering, science, economics, policy, finance and data backgrounds can all enter through different roles."
  },
  "Architecture, Construction & Built Environment": {
    "careerFamilies": [
      "Architecture",
      "Civil/Structural Engineering",
      "Construction Management",
      "BIM & Digital Construction",
      "Quantity Surveying/Cost Management",
      "Urban & Regional Planning",
      "Interior/Spatial Design",
      "Landscape Architecture",
      "Real Estate Development",
      "Building Services/MEP",
      "Infrastructure & Transportation",
      "Sustainable Built Environment"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "drawing, structures/materials basics, CAD/BIM orientation, surveying or design fundamentals; Excel; communication.",
        "nonTechnical": "design critique, teamwork, site safety, client communication, presentation.",
        "evidence": "drawing/model portfolio + site visit log + basic CAD/BIM project."
      },
      {
        "stage": "Year 2",
        "technical": "specialise in architecture/civil/BIM/QS/planning; Revit/AutoCAD/SketchUp/STAAD/ETABS/Civil 3D/Primavera as relevant.",
        "nonTechnical": "design presentation, estimation communication, coordination, documentation.",
        "evidence": "integrated design/construction project + summer site/office internship."
      },
      {
        "stage": "Year 3",
        "technical": "advanced BIM, structures, planning, contracts, cost, project controls, GIS, sustainability depending on track.",
        "nonTechnical": "multidisciplinary coordination, site communication, stakeholder management.",
        "evidence": "major industry internship + construction/design portfolio."
      },
      {
        "stage": "Final Year",
        "technical": "capstone/thesis; professional documentation; project scheduling/costing; licensing/registration preparation where applicable.",
        "nonTechnical": "client pitch, negotiation, tender communication, interview readiness.",
        "evidence": "professional portfolio + capstone + job/PG plan."
      }
    ],
    "technicalSkillsChecklist": [
      "drawing",
      "structures/materials basics",
      "CAD/BIM orientation",
      "surveying or design fundamentals",
      "Excel",
      "communication",
      "specialise in architecture/civil/BIM/QS/planning",
      "Revit/AutoCAD/SketchUp/STAAD/ETABS/Civil 3D/Primavera as relevant",
      "advanced BIM",
      "structures",
      "planning",
      "contracts",
      "project controls",
      "sustainability depending on track",
      "capstone/thesis",
      "professional documentation",
      "project scheduling/costing",
      "licensing/registration preparation where applicable"
    ],
    "nonTechnicalSkills": [
      "design critique",
      "teamwork",
      "site safety",
      "client communication",
      "presentation",
      "design presentation",
      "estimation communication",
      "coordination",
      "documentation",
      "multidisciplinary coordination",
      "site communication",
      "stakeholder management",
      "client pitch",
      "negotiation"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "CPWD, NHAI, Railways, AAI, MoRTH, MoHUA, NBCC, RITES, IRCON, HUDCO, state PWDs/urban authorities, municipal bodies and government design/planning organisations.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "L&T, Tata Projects, Shapoorji Pallonji, Godrej Properties, DLF, design studios, EPC firms, real-estate developers, BIM consultancies, project-management firms. Apply through official careers; openings vary.",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "Autodesk/Revit credentials",
        "bestFor": "BIM/design"
      },
      {
        "name": "Primavera P6",
        "bestFor": "project controls"
      },
      {
        "name": "LEED/IGBC credentials",
        "bestFor": "sustainable buildings"
      },
      {
        "name": "RICS pathways/credentials",
        "bestFor": "quantity surveying/cost where applicable"
      },
      {
        "name": "PMP/CAPM",
        "bestFor": "project management"
      },
      {
        "name": "NEBOSH/IOSH",
        "bestFor": "construction safety"
      },
      {
        "name": "GIS credentials",
        "bestFor": "planning/infrastructure"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Architectural Assistant",
      "Site Engineer",
      "Civil/Structural Engineer",
      "BIM Modeler/Engineer",
      "Planning Engineer",
      "Quantity Surveyor/Cost Engineer",
      "Project Coordinator",
      "Construction Manager (after experience)",
      "Urban Planning Assistant",
      "Interior/Spatial Designer",
      "Landscape Designer",
      "Real Estate Analyst"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "M.Arch, M.Plan, M.Tech Civil/Structural/Transportation/Geotechnical/Construction, MBA Construction/Real Estate, MSc BIM/Digital Construction, urban design/planning. India examples: SPA Delhi/Bhopal/Vijayawada, IITs, CEPT, NITs, NICMAR, selected architecture/planning institutes. Scholarships/assistantships depend on institution and programme.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "USA",
        "detail": "MIT, Cornell, Georgia Tech, UC Berkeley; assistantships."
      },
      {
        "country": "UK",
        "detail": "UCL Bartlett, Cambridge, Manchester, Edinburgh; Chevening/Commonwealth."
      },
      {
        "country": "Canada",
        "detail": "Toronto, UBC, McGill, Waterloo; RA/TA."
      },
      {
        "country": "Germany",
        "detail": "TUM, RWTH, TU Berlin, KIT; DAAD."
      },
      {
        "country": "Netherlands",
        "detail": "TU Delft, Eindhoven, Wageningen for built environment/sustainability; Erasmus Mundus/university."
      },
      {
        "country": "Australia",
        "detail": "UNSW, Melbourne, Sydney, Queensland; university scholarships."
      },
      {
        "country": "Singapore",
        "detail": "NUS, NTU; university scholarships."
      },
      {
        "country": "Japan",
        "detail": "University of Tokyo, Kyoto; MEXT."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Design route → architect/designer → project architect/lead → associate/principal.",
      "Construction route → site/project engineer → planning/project manager → project director → construction leadership.",
      "BIM route → BIM engineer → BIM coordinator → BIM manager → digital construction director.",
      "Research route → master's → PhD → built-environment researcher/academic."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "Architecture is a regulated profession in many jurisdictions. A B.Arch/recognised professional qualification and local registration rules matter for the title/practice."
  },
  "Business, Finance & Entrepreneurship": {
    "careerFamilies": [
      "Finance & Investment",
      "Accounting & Audit",
      "Banking",
      "FinTech",
      "Business Analytics",
      "Marketing & Sales",
      "Human Resources",
      "Operations & Strategy",
      "Entrepreneurship",
      "Consulting",
      "International Business",
      "Product/Project Management"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "accounting/economics/statistics basics; Excel; PowerPoint; business writing; basic SQL/data literacy; financial statement reading.",
        "nonTechnical": "communication, presentation, teamwork, networking, problem solving, professional etiquette.",
        "evidence": "company analysis + Excel model/dashboard + one student organisation role."
      },
      {
        "stage": "Year 2",
        "technical": "choose finance/marketing/HR/analytics/operations; financial modelling, SQL/Power BI, digital marketing, HR analytics, operations methods as relevant.",
        "nonTechnical": "stakeholder management, negotiation, sales communication, interview skills.",
        "evidence": "live project/client project + first internship."
      },
      {
        "stage": "Year 3",
        "technical": "advanced role-specific tools; analytics/valuation/marketing performance/operations/HR systems; domain certification prep.",
        "nonTechnical": "leadership, business storytelling, consulting problem solving, networking.",
        "evidence": "8–12 week internship + quantified business project."
      },
      {
        "stage": "Final Year",
        "technical": "capstone; advanced modelling/analytics; role-specific interview prep; entrepreneurship financial plan where relevant.",
        "nonTechnical": "negotiation, case interviews, executive presentation, job search strategy.",
        "evidence": "placement-ready portfolio + PG/MBA/credential decision."
      }
    ],
    "technicalSkillsChecklist": [
      "accounting/economics/statistics basics",
      "Excel",
      "PowerPoint",
      "business writing",
      "basic SQL/data literacy",
      "financial statement reading",
      "choose finance/marketing/HR/analytics/operations",
      "financial modelling",
      "SQL/Power BI",
      "digital marketing",
      "HR analytics",
      "operations methods as relevant",
      "advanced role-specific tools",
      "analytics/valuation/marketing performance/operations/HR systems",
      "domain certification prep",
      "capstone",
      "advanced modelling/analytics",
      "role-specific interview prep"
    ],
    "nonTechnicalSkills": [
      "communication",
      "presentation",
      "teamwork",
      "networking",
      "problem solving",
      "professional etiquette",
      "stakeholder management",
      "negotiation",
      "sales communication",
      "interview skills",
      "leadership",
      "business storytelling",
      "consulting problem solving",
      "case interviews"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "RBI, SEBI, NABARD, public-sector banks, NITI Aayog, government finance/economic departments, PSU corporate functions and public policy/economic research internships when advertised.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "Banks, fintechs, consulting, FMCG, startups, accounting firms, market research, SaaS, e-commerce, corporate finance/HR/marketing teams. Free/low-cost virtual experiences can be used for early exploration, but should not be represented as employment.",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "CFA",
        "bestFor": "investment/portfolio pathway"
      },
      {
        "name": "FRM",
        "bestFor": "risk"
      },
      {
        "name": "ACCA/CA/CMA",
        "bestFor": "accounting/finance pathways"
      },
      {
        "name": "NISM certifications",
        "bestFor": "Indian securities-market roles"
      },
      {
        "name": "Google Analytics/Ads",
        "bestFor": "marketing"
      },
      {
        "name": "Microsoft/Power BI or Tableau credentials",
        "bestFor": "analytics"
      },
      {
        "name": "CAPM/PMP later",
        "bestFor": "project management"
      },
      {
        "name": "SAP/ERP credentials",
        "bestFor": "finance/operations/enterprise roles"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Financial Analyst",
      "Investment/Research Analyst",
      "Credit Analyst",
      "Risk Analyst",
      "Business Analyst",
      "Data/BI Analyst",
      "Accountant/Audit Associate",
      "Banking Operations Associate",
      "Marketing Analyst",
      "Digital Marketing Executive",
      "HR/People Analytics Analyst",
      "Operations Analyst",
      "Consulting Analyst",
      "Sales/Business Development Executive",
      "Product/Project Coordinator",
      "Founder/Entrepreneur"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "M.Com, MSc Finance/Economics/Data, MBA/PGDM Finance/Marketing/HR/Operations/Analytics, MFM/MMS, specialised fintech/financial economics programmes. India examples: IIMs, FMS Delhi, XLRI, MDI, SPJIMR, IIT management schools, DU commerce/economics, ISB for later-career MBA. Funding: institute scholarships, education loans, employer sponsorship, NSP/UGC schemes, assistantships where available.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "USA",
        "detail": "Wharton, MIT Sloan, Chicago Booth, NYU Stern, Columbia; university scholarships/assistantships."
      },
      {
        "country": "UK",
        "detail": "LBS, Oxford Saïd, Cambridge Judge, Imperial, LSE; Chevening/Commonwealth where eligible."
      },
      {
        "country": "Canada",
        "detail": "Rotman, Ivey, Schulich, McGill; university awards."
      },
      {
        "country": "France",
        "detail": "HEC Paris, INSEAD, ESSEC, ESCP; Eiffel for eligible management/economics fields."
      },
      {
        "country": "Germany",
        "detail": "Mannheim, TUM, Frankfurt School; DAAD/university."
      },
      {
        "country": "Netherlands",
        "detail": "Rotterdam School of Management, Tilburg, Amsterdam; Erasmus Mundus/university."
      },
      {
        "country": "Singapore",
        "detail": "NUS, NTU, SMU; university scholarships."
      },
      {
        "country": "Australia",
        "detail": "Melbourne, UNSW, Sydney, Monash; university awards."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Analyst/associate → senior analyst/associate → manager → senior manager/director → business/function leadership.",
      "Finance: analyst → senior analyst → manager → director → CFO/finance leadership.",
      "Entrepreneurship: idea → validation → MVP → revenue → team/scale; postgraduate study is optional, not mandatory."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "Do not make an MBA the default answer for every business student. Role evidence, internships and quantitative/functional skills should determine whether an MBA/PG is useful."
  },
  "Law, Legal & Compliance": {
    "careerFamilies": [
      "Litigation & Advocacy",
      "Corporate/Commercial Law",
      "Banking & Financial Regulation",
      "Tax",
      "Intellectual Property",
      "Technology/Cyber Law",
      "Data Privacy",
      "Compliance & Ethics",
      "Company Secretarial/Governance",
      "Legal Operations",
      "Policy & Regulatory Affairs"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "legal research, case reading, constitutional/legal foundations, citation, drafting basics, legal databases, Excel/data literacy for compliance.",
        "nonTechnical": "writing, argumentation, client communication, negotiation, listening, professional ethics.",
        "evidence": "case brief portfolio + legal research memo."
      },
      {
        "stage": "Year 2",
        "technical": "choose practice area; contract drafting, corporate law, IP, tax, cyber/privacy, compliance, competition etc.; learn SCC/Manupatra/Westlaw/Lexis or local databases.",
        "nonTechnical": "mooting, negotiation, interviewing, teamwork.",
        "evidence": "clinic/moot + targeted internship."
      },
      {
        "stage": "Year 3",
        "technical": "advanced drafting, due diligence, regulatory research, contract review, compliance controls, legal tech depending on path.",
        "nonTechnical": "client management, presentation, negotiation, professional networking.",
        "evidence": "law-firm/company/tribunal/regulator internship + drafting portfolio."
      },
      {
        "stage": "Final Year",
        "technical": "specialisation, dissertation, practice-area depth, legal-tech/compliance tools; bar/qualification preparation where applicable.",
        "nonTechnical": "professional judgement, case strategy, negotiation, interview readiness.",
        "evidence": "repeated internships + strong writing/drafting portfolio + qualification plan."
      }
    ],
    "technicalSkillsChecklist": [
      "legal research",
      "case reading",
      "constitutional/legal foundations",
      "citation",
      "drafting basics",
      "legal databases",
      "Excel/data literacy for compliance",
      "choose practice area",
      "contract drafting",
      "corporate law",
      "cyber/privacy",
      "compliance",
      "competition etc",
      "learn SCC/Manupatra/Westlaw/Lexis or local databases",
      "advanced drafting",
      "due diligence",
      "regulatory research",
      "contract review"
    ],
    "nonTechnicalSkills": [
      "writing",
      "argumentation",
      "client communication",
      "negotiation",
      "listening",
      "professional ethics",
      "mooting",
      "interviewing",
      "teamwork",
      "client management",
      "presentation",
      "professional networking",
      "professional judgement",
      "case strategy"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "NITI Aayog/ministries; legal services authorities; courts/tribunals; SEBI/RBI/CCI and regulators where internships are advertised; police/forensic/cyber units for relevant legal-policy tracks; government law departments.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "[\"Law firms, in-house legal teams, compliance departments, legal-tech startups, banks/fintech, consulting, Big Four risk/compliance, privacy teams. Do not pay for a 'guaranteed' internship.\"]",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "CIPP/E or CIPP/US",
        "bestFor": "privacy/data protection depending on jurisdiction"
      },
      {
        "name": "CAMS",
        "bestFor": "AML/compliance"
      },
      {
        "name": "ISO 37301 compliance management training",
        "bestFor": "compliance"
      },
      {
        "name": "ISO 27001 awareness/lead auditor",
        "bestFor": "privacy/security crossover"
      },
      {
        "name": "Contract management credentials",
        "bestFor": "legal operations/procurement"
      },
      {
        "name": "Company secretary qualification (ICSI)",
        "bestFor": "corporate governance route"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Legal Associate",
      "Legal Researcher",
      "Contract Analyst",
      "Compliance Analyst",
      "Legal Operations Analyst",
      "Company Secretarial Trainee/Associate",
      "Privacy Analyst",
      "AML/KYC Analyst",
      "Regulatory Affairs Associate",
      "IP Analyst",
      "Policy/Regulatory Research Associate"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "LLM in Corporate, Commercial, IP, Technology, International, Constitutional, Criminal, Tax, Banking/Finance etc.; MBA for legal/business leadership; specialised compliance/privacy programmes. India examples: NLSIU, NALSAR, NLU Delhi, WBNUJS, NLU Jodhpur, GNLU, NLU Odisha; private Jindal, Symbiosis, Christ. Scholarships vary by institution; consider merit/need aid and research assistantships.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "UK",
        "detail": "Oxford, Cambridge, LSE, King's, UCL; Chevening/Commonwealth for eligible programmes."
      },
      {
        "country": "USA",
        "detail": "Harvard, Columbia, NYU, Berkeley, Georgetown; Fulbright only for eligible fields and annual call."
      },
      {
        "country": "Canada",
        "detail": "Toronto, McGill, UBC, Osgoode/York; local qualification rules for practice."
      },
      {
        "country": "Australia",
        "detail": "Melbourne, Sydney, UNSW, ANU; local admission/qualification rules."
      },
      {
        "country": "Netherlands",
        "detail": "Leiden, Amsterdam, Erasmus; EU/international law."
      },
      {
        "country": "France",
        "detail": "Sciences Po, Paris 1, PSL; Eiffel includes law/political science."
      },
      {
        "country": "Germany",
        "detail": "Heidelberg, Humboldt, LMU; German legal qualification is a separate path."
      },
      {
        "country": "Singapore",
        "detail": "NUS, SMU; strong corporate/compliance focus."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Law firm: trainee/associate → senior associate → counsel/partner.",
      "In-house: legal/compliance analyst → counsel/manager → legal/compliance head → GC/chief compliance officer.",
      "Regulatory/policy: research associate → regulatory analyst → senior policy/legal role → leadership. Practice rights depend on jurisdiction and professional admission."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "A law degree does not automatically equal courtroom practice. Keep advocacy, corporate law, in-house, compliance, legal operations and policy as distinct pathways."
  },
  "Government, Public Administration & Policy": {
    "careerFamilies": [
      "Civil & Administrative Services",
      "Public Policy",
      "Economic/Public Finance",
      "Urban Governance",
      "Rural/Development Administration",
      "Regulation",
      "E-Governance",
      "Social Policy",
      "Environment/Resource Governance",
      "Legislative/Parliamentary Affairs",
      "Public Sector Management",
      "International Development"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "public policy basics, economics/statistics, Excel, research methods, government data sources, writing.",
        "nonTechnical": "communication, civic awareness, structured reasoning, stakeholder listening, presentation.",
        "evidence": "policy brief + government scheme analysis."
      },
      {
        "stage": "Year 2",
        "technical": "choose governance/policy/economics/data/urban/development; learn R/Python/SQL/Power BI or GIS as relevant.",
        "nonTechnical": "stakeholder mapping, field interviewing, project management, policy communication.",
        "evidence": "district/municipal/scheme evaluation project + internship."
      },
      {
        "stage": "Year 3",
        "technical": "advanced policy analysis, cost-benefit, programme evaluation, public finance, GIS/e-governance or sector specialisation.",
        "nonTechnical": "negotiation, facilitation, briefing senior stakeholders, leadership.",
        "evidence": "government/think-tank/public policy internship + publishable policy report."
      },
      {
        "stage": "Final Year",
        "technical": "dissertation/capstone, data analysis, policy memo writing, competitive-exam preparation if applicable.",
        "nonTechnical": "interviews, public speaking, networking, ethical judgement.",
        "evidence": "policy portfolio + applications for jobs/PG/competitive exams."
      }
    ],
    "technicalSkillsChecklist": [
      "public policy basics",
      "economics/statistics",
      "Excel",
      "research methods",
      "government data sources",
      "writing",
      "choose governance/policy/economics/data/urban/development",
      "learn R/Python/SQL/Power BI or GIS as relevant",
      "advanced policy analysis",
      "cost-benefit",
      "programme evaluation",
      "public finance",
      "GIS/e-governance or sector specialisation",
      "dissertation/capstone",
      "data analysis",
      "policy memo writing",
      "competitive-exam preparation if applicable"
    ],
    "nonTechnicalSkills": [
      "communication",
      "civic awareness",
      "structured reasoning",
      "stakeholder listening",
      "presentation",
      "stakeholder mapping",
      "field interviewing",
      "project management",
      "policy communication",
      "negotiation",
      "facilitation",
      "briefing senior stakeholders",
      "leadership",
      "interviews"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "NITI Aayog internship; ministries/departments; state government internships; municipal bodies; public-sector policy/research units; Parliament-related research opportunities; regulatory institutions when calls are advertised.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "Think tanks, public policy consultancies, development organisations, CSR, social-impact firms, government-tech/e-governance companies, research organisations, consulting firms.",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "CAPM/PMP later",
        "bestFor": "programme management"
      },
      {
        "name": "Power BI/SQL",
        "bestFor": "public data/e-governance"
      },
      {
        "name": "GIS/QGIS/ArcGIS",
        "bestFor": "urban/environment policy"
      },
      {
        "name": "Data analytics/R/Python",
        "bestFor": "policy evaluation"
      },
      {
        "name": "Public procurement training",
        "bestFor": "procurement/governance"
      },
      {
        "name": "Monitoring & Evaluation credentials",
        "bestFor": "development sector"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Policy Research Assistant",
      "Programme Associate",
      "Public Affairs Associate",
      "Government Relations Analyst",
      "Development Programme Associate",
      "Research Analyst",
      "Policy/Data Analyst",
      "Urban Governance Associate",
      "Monitoring & Evaluation Associate",
      "Public Sector Consultant"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "MPP, MPA, MA Public Policy, Development Studies, Economics, International Relations, Urban Planning, Public Finance, Social Policy, Governance/Data Policy. India examples: IIPA ecosystem, JNU, TISS, NLSIU, IIT public policy programmes, ISB/Indian School of Business public policy programmes, NIPFP-linked research ecosystem, Ashoka/OP Jindal. Funding through institute aid, NSP/UGC and research assistantships.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "USA",
        "detail": "Harvard Kennedy, Princeton SPIA, Columbia SIPA, Georgetown, Michigan; university funding/Fulbright where eligible."
      },
      {
        "country": "UK",
        "detail": "LSE, Oxford Blavatnik, Cambridge, UCL; Chevening/Commonwealth."
      },
      {
        "country": "Canada",
        "detail": "Toronto Munk, McGill, UBC, Carleton; university awards."
      },
      {
        "country": "France",
        "detail": "Sciences Po, Paris 1, PSL; Eiffel law/politics/economics areas."
      },
      {
        "country": "Germany",
        "detail": "Hertie School, Freie Universität, Heidelberg; DAAD/university."
      },
      {
        "country": "Netherlands",
        "detail": "Leiden, Erasmus Rotterdam, Amsterdam; Erasmus Mundus/university."
      },
      {
        "country": "Australia",
        "detail": "ANU, Melbourne, Sydney; university scholarships."
      },
      {
        "country": "Singapore",
        "detail": "NUS, NTU, SMU; university awards."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Programme/policy associate → analyst → senior analyst/manager → policy/programme director.",
      "Civil services route: UG → competitive examination → service training → field/secretariat roles → senior administrative leadership subject to service rules.",
      "Research route: master's → PhD → policy research/academia."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "UPSC/State PSC and other government recruitment are separate competitive routes; no single UG degree guarantees entry. Eligibility and notifications must be checked for the specific exam."
  },
  "Education & Learning": {
    "careerFamilies": [
      "School Teaching",
      "Higher Education & Academia",
      "Teacher Education",
      "Educational Psychology/Student Support",
      "Curriculum & Instructional Design",
      "EdTech",
      "Corporate Learning & Development",
      "Assessment & Examination",
      "Academic Administration",
      "Special & Inclusive Education",
      "Vocational/Skill Training",
      "Education Research & Policy"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "subject mastery; learning science; basic pedagogy; digital tools; academic writing; presentation; assessment basics.",
        "nonTechnical": "empathy, facilitation, classroom communication, feedback, teamwork, professionalism.",
        "evidence": "5–10 lesson/learning designs + tutoring/peer-teaching experience."
      },
      {
        "stage": "Year 2",
        "technical": "instructional design, assessment design, LMS, multimedia learning, research methods, data literacy; choose school/EdTech/L&D/research track.",
        "nonTechnical": "facilitation, learner communication, stakeholder management, public speaking.",
        "evidence": "micro-course/module + teaching/tutoring or EdTech project."
      },
      {
        "stage": "Year 3",
        "technical": "advanced pedagogy, curriculum, learning analytics, inclusive education or corporate L&D methods; portfolio development.",
        "nonTechnical": "classroom management, coaching, workshop delivery, leadership.",
        "evidence": "substantial practicum/internship + measurable learner outcome."
      },
      {
        "stage": "Final Year",
        "technical": "capstone/dissertation, curriculum/product portfolio, assessment design, professional qualification preparation.",
        "nonTechnical": "interview/demo lesson, stakeholder communication, networking.",
        "evidence": "20+ polished learning artefacts or equivalent professional portfolio."
      }
    ],
    "technicalSkillsChecklist": [
      "subject mastery",
      "learning science",
      "basic pedagogy",
      "digital tools",
      "academic writing",
      "presentation",
      "assessment basics",
      "instructional design",
      "assessment design",
      "multimedia learning",
      "research methods",
      "data literacy",
      "choose school/EdTech/L&D/research track",
      "advanced pedagogy",
      "curriculum",
      "learning analytics",
      "inclusive education or corporate L&D methods",
      "portfolio development"
    ],
    "nonTechnicalSkills": [
      "empathy",
      "facilitation",
      "classroom communication",
      "feedback",
      "teamwork",
      "professionalism",
      "learner communication",
      "stakeholder management",
      "public speaking",
      "classroom management",
      "coaching",
      "workshop delivery",
      "leadership",
      "interview/demo lesson"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "NCERT/SCERT internships; Ministry of Education and education departments; DIET/teacher education institutions; public universities; government schools/programmes; National Skill Development/sector skill organisations when openings are advertised.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "Schools, edtech companies, publishers, learning design firms, corporate L&D, assessment companies, tutoring/learning platforms, NGOs working in education.",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "Google/Adobe/Microsoft educator credentials where relevant",
        "bestFor": "Role-specific"
      },
      {
        "name": "Instructional design/LMS credentials",
        "bestFor": "EdTech/L&D"
      },
      {
        "name": "Learning analytics/data credentials",
        "bestFor": "education analytics"
      },
      {
        "name": "CAPM",
        "bestFor": "L&D/project roles"
      },
      {
        "name": "Special education certifications only through recognised institutions",
        "bestFor": "Role-specific"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Teacher/Teaching Associate (eligibility applies)",
      "Instructional Designer",
      "Curriculum Developer",
      "Learning Experience Designer",
      "Academic Coordinator",
      "Assessment Associate",
      "EdTech Content Specialist",
      "Learning & Development Associate",
      "Student Success/Academic Support Associate",
      "Education Research Assistant",
      "Education Programme Associate"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "M.Ed, MA Education, MA/MSc Psychology, Instructional Design/Learning Sciences, Educational Leadership, Education Technology, Assessment, Special Education, Public Policy/Education Policy. India examples: TISS, NCERT/RIE, DU, JMI, BHU, Azim Premji University, Christ and recognised teacher-education institutions. Funding: institute aid, NSP/UGC, research assistantships.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "USA",
        "detail": "Harvard Graduate School of Education, Stanford, Columbia Teachers College, Penn GSE; assistantships/Fulbright where eligible."
      },
      {
        "country": "UK",
        "detail": "UCL IOE, Oxford, Cambridge, Edinburgh; Chevening/Commonwealth."
      },
      {
        "country": "Canada",
        "detail": "Toronto OISE, UBC, McGill; RA/TA."
      },
      {
        "country": "Australia",
        "detail": "Melbourne, Monash, Queensland, Sydney; university awards."
      },
      {
        "country": "Netherlands",
        "detail": "Utrecht, Leiden, Amsterdam; Erasmus Mundus."
      },
      {
        "country": "Germany",
        "detail": "LMU, Humboldt, Heidelberg; DAAD."
      },
      {
        "country": "Singapore",
        "detail": "NUS/NTU education-adjacent programmes."
      },
      {
        "country": "Finland",
        "detail": "University of Helsinki, Tampere; university scholarships (availability varies)."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Teacher → senior teacher/lead → coordinator/principal/academic leader; qualification rules apply.",
      "Instructional design → ID → senior ID → learning design lead → L&D/learning product leadership.",
      "Academia/research → master's → NET/eligibility where applicable → PhD → faculty/research."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "Teaching is regulated by qualification/recruitment rules that differ by school system. CTET/TET and B.Ed requirements depend on the target role; do not treat a short certificate as a substitute."
  },
  "Media, Communication, Arts & Design": {
    "careerFamilies": [
      "Graphic/Visual Design",
      "UI/UX",
      "Animation/VFX",
      "Film/Video",
      "Journalism & News",
      "Advertising & PR",
      "Digital Content/Social Media",
      "Photography",
      "Audio/Music",
      "Publishing/Writing",
      "Performing Arts",
      "Fine Arts",
      "Fashion/Lifestyle Media",
      "Game Art & Interactive Media"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "design fundamentals, typography, composition, writing, photography/video/audio basics; Figma/Adobe/Blender or domain tools.",
        "nonTechnical": "critique, communication, collaboration, storytelling, client understanding, time management.",
        "evidence": "portfolio foundation with 6–10 strong pieces."
      },
      {
        "stage": "Year 2",
        "technical": "choose medium; advanced design/video/audio/animation/UX research/copywriting; portfolio website; basic analytics for digital media.",
        "nonTechnical": "creative briefing, pitching, feedback, project management.",
        "evidence": "2–3 substantial projects and first industry/agency internship."
      },
      {
        "stage": "Year 3",
        "technical": "professional workflow, brand systems, UX case studies, showreel, editing, production, research, audience analytics depending on track.",
        "nonTechnical": "client management, creative direction, collaboration, deadlines.",
        "evidence": "serious internship/freelance/commissioned project + portfolio refresh."
      },
      {
        "stage": "Final Year",
        "technical": "final portfolio/showreel, advanced specialisation, production standards, rights/licensing basics, entrepreneurship.",
        "nonTechnical": "pitching, negotiation, personal branding, networking, presentation.",
        "evidence": "professional portfolio + capstone + target employer list/PG plan."
      }
    ],
    "technicalSkillsChecklist": [
      "design fundamentals",
      "typography",
      "composition",
      "writing",
      "photography/video/audio basics",
      "Figma/Adobe/Blender or domain tools",
      "choose medium",
      "advanced design/video/audio/animation/UX research/copywriting",
      "portfolio website",
      "basic analytics for digital media",
      "professional workflow",
      "brand systems",
      "UX case studies",
      "showreel",
      "editing",
      "production",
      "research",
      "audience analytics depending on track"
    ],
    "nonTechnicalSkills": [
      "critique",
      "communication",
      "collaboration",
      "storytelling",
      "client understanding",
      "time management",
      "creative briefing",
      "pitching",
      "feedback",
      "project management",
      "client management",
      "creative direction",
      "deadlines",
      "negotiation"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "Prasar Bharati/Doordarshan/AIR opportunities when advertised; public museums/cultural institutions; government media units; PIB/communication roles; state cultural bodies; public universities and film/design institutes.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "Design studios, advertising agencies, production houses, OTT/media companies, publishing, gaming studios, UX agencies, brand teams, creator businesses. Portfolio-first applications are critical.",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "Adobe Certified Professional",
        "bestFor": "design/media"
      },
      {
        "name": "Autodesk/Maya/Blender credentials",
        "bestFor": "3D/animation"
      },
      {
        "name": "Google UX certificate",
        "bestFor": "entry UX learning, not a substitute for portfolio"
      },
      {
        "name": "Meta/Google digital marketing credentials",
        "bestFor": "digital media"
      },
      {
        "name": "HubSpot content/social certifications",
        "bestFor": "supporting credentials"
      },
      {
        "name": "Project management certification",
        "bestFor": "production/creative operations"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Graphic Designer",
      "UI/UX Designer",
      "Motion Designer",
      "3D/Animation Artist",
      "Video Editor",
      "Assistant Producer",
      "Content Writer/Editor",
      "Journalist/Researcher",
      "Social Media Executive",
      "Copywriter",
      "PR/Communications Associate",
      "Photographer",
      "Sound/Audio Assistant",
      "Game Artist",
      "Creative Producer"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "M.Des, MFA, MA Mass Communication/Journalism, Film/TV, Animation/VFX, UX/HCI, Communication Design, Creative Writing, Music/Audio, Media Management. India examples: NID, FTII, SRFTI, Srishti Manipal, JMI, DU, MIT Institute of Design, Whistling Woods and other recognised institutions. Scholarships vary; portfolio admissions are common.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "USA",
        "detail": "RISD, Parsons, ArtCenter, SCAD, NYU Tisch; university scholarships."
      },
      {
        "country": "UK",
        "detail": "RCA, UAL, Goldsmiths, Glasgow School of Art; Chevening for eligible master's."
      },
      {
        "country": "Canada",
        "detail": "OCAD, Toronto, Emily Carr, Concordia; university awards."
      },
      {
        "country": "Germany",
        "detail": "UdK Berlin, Bauhaus Weimar, HfG/arts schools; DAAD."
      },
      {
        "country": "Netherlands",
        "detail": "Design Academy Eindhoven, TU Delft, HKU; Erasmus Mundus/university."
      },
      {
        "country": "France",
        "detail": "ENSAD/PSL, Gobelins, Paris universities; Eiffel for eligible fields."
      },
      {
        "country": "Australia",
        "detail": "RMIT, UTS, Melbourne, UNSW; university awards."
      },
      {
        "country": "Japan/Korea",
        "detail": "Kyoto University of the Arts/University of Tokyo related programmes; KAIST/SNU/arts universities; MEXT/GKS."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Designer/creator → senior → lead/art director/creative director.",
      "Journalism/content → reporter/writer → senior/editor → editor/content lead.",
      "UX → junior designer → product designer → senior/lead → design manager/director.",
      "Independent route: portfolio → freelance/creator studio → clients/products/IP → creative entrepreneurship."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "For creative careers, portfolio quality, process evidence and real work samples usually matter more than accumulating many generic certificates."
  },
  "Manufacturing & Industrial Production": {
    "careerFamilies": [
      "Mechanical & Production Engineering",
      "Industrial Engineering",
      "Manufacturing Systems",
      "Automation & Robotics",
      "CNC/Machining",
      "CAD/CAM/CAE",
      "Automotive Manufacturing",
      "Aerospace Manufacturing",
      "Semiconductor Manufacturing",
      "Materials & Metallurgy",
      "Quality Engineering",
      "Maintenance & Reliability",
      "Lean Manufacturing",
      "PPC/Production Planning",
      "Manufacturing Analytics",
      "Additive Manufacturing"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "engineering mathematics, physics, workshop practice, CAD, Excel, basic programming, engineering drawing.",
        "nonTechnical": "safety, teamwork, technical communication, problem solving, shop-floor discipline.",
        "evidence": "CAD model + workshop/3D-printing project."
      },
      {
        "stage": "Year 2",
        "technical": "manufacturing processes, materials, metrology, quality, CNC, PLC/automation or CAE depending on path; basic SQL/data where useful.",
        "nonTechnical": "root-cause thinking, process documentation, presentation, coordination.",
        "evidence": "manufacturing/automation project + short industrial exposure."
      },
      {
        "stage": "Year 3",
        "technical": "advanced manufacturing, Lean, SPC, FMEA, GD&T, robotics/PLC, MES/ERP or manufacturing analytics; choose industry.",
        "nonTechnical": "stakeholder management, reporting, leadership, continuous-improvement mindset.",
        "evidence": "major plant/industrial internship + measurable improvement project."
      },
      {
        "stage": "Final Year",
        "technical": "capstone aligned to target role; digital manufacturing, quality, design or process specialisation; interview/core preparation.",
        "nonTechnical": "technical interview, project storytelling, negotiation, professional networking.",
        "evidence": "capstone + industry internship + role-specific credential."
      }
    ],
    "technicalSkillsChecklist": [
      "engineering mathematics",
      "physics",
      "workshop practice",
      "Excel",
      "basic programming",
      "engineering drawing",
      "manufacturing processes",
      "materials",
      "metrology",
      "quality",
      "PLC/automation or CAE depending on path",
      "basic SQL/data where useful",
      "advanced manufacturing",
      "robotics/PLC",
      "MES/ERP or manufacturing analytics",
      "choose industry",
      "capstone aligned to target role",
      "digital manufacturing"
    ],
    "nonTechnicalSkills": [
      "safety",
      "teamwork",
      "technical communication",
      "problem solving",
      "shop-floor discipline",
      "root-cause thinking",
      "process documentation",
      "presentation",
      "coordination",
      "stakeholder management",
      "reporting",
      "leadership",
      "continuous-improvement mindset",
      "technical interview"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "DRDO internships; ISRO student project trainee/internship; public-sector engineering organisations; CSIR labs; Railways; HAL/BEL/BHEL and other PSUs when advertised; AICTE National Internship Portal.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "Automotive, aerospace, electronics, semiconductor, machine-tool, FMCG, pharma, industrial automation and EPC companies; manufacturing startups; quality/engineering consultancies.",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "Six Sigma Green Belt",
        "bestFor": "quality/process improvement"
      },
      {
        "name": "GD&T certification",
        "bestFor": "design/manufacturing"
      },
      {
        "name": "Autodesk/SolidWorks/CATIA/NX credentials",
        "bestFor": "CAD/CAM"
      },
      {
        "name": "Siemens/PLC training",
        "bestFor": "automation"
      },
      {
        "name": "Primavera P6",
        "bestFor": "manufacturing project planning"
      },
      {
        "name": "SAP/ERP credentials",
        "bestFor": "production/materials"
      },
      {
        "name": "ASQ credentials where eligibility permits",
        "bestFor": "quality"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Manufacturing Engineer",
      "Production Engineer",
      "Industrial Engineer",
      "Process Engineer",
      "Quality Engineer",
      "Supplier Quality Engineer",
      "Maintenance Engineer",
      "Reliability Engineer",
      "Automation/Controls Engineer",
      "CAD/CAM Engineer",
      "CNC Programmer",
      "PPC Engineer",
      "Manufacturing Data Analyst",
      "Materials Engineer"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "M.Tech Manufacturing/Production/Industrial/Mechanical/Automation/Robotics/Materials; MBA Operations/Supply Chain/Manufacturing; MSc Industrial Engineering/Digital Manufacturing. India examples: IITs, NITs, IISc, BITS, NITIE/operations ecosystem now under IIM Mumbai, state engineering universities. Funding: GATE assistantships, institute scholarships, project-funded research.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "USA",
        "detail": "MIT, Georgia Tech, Purdue, Michigan, Carnegie Mellon; RA/TA."
      },
      {
        "country": "Germany",
        "detail": "RWTH Aachen, TUM, KIT, TU Berlin; DAAD."
      },
      {
        "country": "UK",
        "detail": "Imperial, Cambridge, Cranfield, Sheffield; Chevening/Commonwealth."
      },
      {
        "country": "Canada",
        "detail": "Toronto, Waterloo, McMaster, UBC; RA/TA."
      },
      {
        "country": "Netherlands",
        "detail": "TU Delft, Eindhoven, Twente; Erasmus Mundus/university."
      },
      {
        "country": "Sweden",
        "detail": "KTH, Chalmers, Lund; Swedish Institute where eligible."
      },
      {
        "country": "Japan",
        "detail": "University of Tokyo, Osaka, Tohoku; MEXT."
      },
      {
        "country": "South Korea",
        "detail": "KAIST, POSTECH, SNU; GKS."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Manufacturing/production engineer → senior → manufacturing/plant manager → operations director/plant head.",
      "Automation → controls/automation engineer → lead → automation manager → smart-factory leadership.",
      "Quality → quality engineer → senior → quality manager → quality head.",
      "Research → master's → PhD → advanced manufacturing/materials/robotics researcher."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "Manufacturing should not be reduced to Mechanical Engineering. Industrial engineering, automation, semiconductor, materials, quality and manufacturing analytics are separate pathways."
  },
  "Supply Chain, Procurement & Logistics": {
    "careerFamilies": [
      "Supply Chain Management",
      "Procurement & Sourcing",
      "Logistics",
      "Warehouse & Distribution",
      "Inventory & Demand Planning",
      "Shipping/Maritime",
      "Freight Forwarding & Customs",
      "Aviation/Airport Logistics",
      "E-commerce/Last Mile",
      "Cold Chain",
      "Supply Chain Analytics",
      "Operations Improvement"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "Excel, statistics, accounting/business basics, inventory concepts, logistics terminology, data visualisation.",
        "nonTechnical": "communication, negotiation basics, coordination, documentation, time management.",
        "evidence": "inventory/warehouse simulation or supply-chain case project."
      },
      {
        "stage": "Year 2",
        "technical": "SQL/Power BI, forecasting, inventory optimisation, procurement, ERP/WMS/TMS exposure, operations research basics.",
        "nonTechnical": "vendor communication, negotiation, process mapping, problem solving.",
        "evidence": "analytics project + first logistics/procurement internship."
      },
      {
        "stage": "Year 3",
        "technical": "advanced planning, S&OP, sourcing, cost analysis, network design, ERP, Lean/Six Sigma, supply-chain analytics.",
        "nonTechnical": "supplier negotiation, stakeholder management, leadership, reporting.",
        "evidence": "8–12 week supply-chain internship + measurable cost/service project."
      },
      {
        "stage": "Final Year",
        "technical": "capstone on forecasting/network/inventory/procurement; advanced analytics; ERP exposure; interview preparation.",
        "nonTechnical": "case interviews, negotiation, business communication, career networking.",
        "evidence": "portfolio + internship + role-specific credential."
      }
    ],
    "technicalSkillsChecklist": [
      "Excel",
      "statistics",
      "accounting/business basics",
      "inventory concepts",
      "logistics terminology",
      "data visualisation",
      "SQL/Power BI",
      "forecasting",
      "inventory optimisation",
      "procurement",
      "ERP/WMS/TMS exposure",
      "operations research basics",
      "advanced planning",
      "sourcing",
      "cost analysis",
      "network design",
      "Lean/Six Sigma",
      "supply-chain analytics"
    ],
    "nonTechnicalSkills": [
      "communication",
      "negotiation basics",
      "coordination",
      "documentation",
      "time management",
      "vendor communication",
      "negotiation",
      "process mapping",
      "problem solving",
      "supplier negotiation",
      "stakeholder management",
      "leadership",
      "reporting",
      "case interviews"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "Indian Railways, AAI, ports, CONCOR, India Post, FCI, Central Warehousing Corporation, state warehousing bodies, NHAI, AICTE internship portal and public-sector procurement/logistics units.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "Amazon, DHL, FedEx, UPS, Delhivery, Blue Dart, Flipkart, 3PLs, FMCG, pharma, automotive, e-commerce and manufacturing supply-chain teams; openings vary.",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "ASCM/APICS CPIM",
        "bestFor": "planning/inventory"
      },
      {
        "name": "ASCM CSCP",
        "bestFor": "end-to-end supply chain"
      },
      {
        "name": "CIPS qualifications",
        "bestFor": "procurement"
      },
      {
        "name": "Six Sigma",
        "bestFor": "process improvement"
      },
      {
        "name": "SAP S/4HANA procurement/materials credentials",
        "bestFor": "ERP"
      },
      {
        "name": "Power BI/SQL credentials",
        "bestFor": "analytics"
      },
      {
        "name": "IATA cargo training",
        "bestFor": "air cargo pathway"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Supply Chain Analyst",
      "Procurement Analyst",
      "Buyer/Purchasing Executive",
      "Sourcing Analyst",
      "Demand Planner",
      "Inventory Analyst",
      "Logistics Coordinator",
      "Warehouse Operations Executive",
      "Transport Planner",
      "Freight Forwarding Associate",
      "Operations Analyst",
      "Supply Chain Consultant"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "MBA/PGDM Supply Chain/Operations, MSc Logistics/Supply Chain, MBA Procurement, Operations Research/Analytics, Maritime Logistics. India examples: IIM Mumbai, IIMs, IIT operations programmes, NITIE/IIM Mumbai ecosystem, IMU, Symbiosis, NMIMS, SCMHRD and logistics-focused universities. Funding: institute aid, scholarships, education loans, employer sponsorship.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "USA",
        "detail": "MIT Center for Transportation & Logistics, Michigan State, Penn State, Georgia Tech; university funding."
      },
      {
        "country": "UK",
        "detail": "Cranfield, Warwick, Manchester, Leeds; Chevening/Commonwealth."
      },
      {
        "country": "Canada",
        "detail": "McGill, Toronto, UBC, Waterloo; university awards."
      },
      {
        "country": "Germany",
        "detail": "TUM, RWTH, Kühne Logistics University; DAAD/university."
      },
      {
        "country": "Netherlands",
        "detail": "Erasmus University Rotterdam, TU Delft, Tilburg; Erasmus Mundus."
      },
      {
        "country": "Singapore",
        "detail": "NUS, NTU, Singapore Management University; university awards."
      },
      {
        "country": "Australia",
        "detail": "Monash, Melbourne, Sydney, UNSW; university scholarships."
      },
      {
        "country": "France",
        "detail": "Paris-Saclay, Grenoble, logistics/management schools; Eiffel for eligible fields."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Supply chain analyst → senior analyst → planning/procurement/operations manager → supply-chain head.",
      "Procurement → buyer → category/sourcing manager → procurement director.",
      "Logistics → coordinator → operations manager → regional/network head.",
      "Analytics → analyst → senior → supply-chain analytics lead → digital supply-chain leadership."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "Students should distinguish procurement, planning, logistics and supply-chain analytics; the tools and interview questions differ."
  },
  "Travel, Tourism, Hospitality & Transport": {
    "careerFamilies": [
      "Hotel & Resort Management",
      "Food & Beverage",
      "Culinary",
      "Travel & Tourism",
      "Events & Conferences",
      "Hospitality Sales/Marketing",
      "Revenue Management",
      "Aviation/Airport Services",
      "Cruise/Luxury",
      "Destination & Sustainable Tourism",
      "Transport Operations",
      "Hospitality Analytics"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "hospitality/tourism operations, Excel, customer-service systems, PMS/POS orientation, communication, tourism geography.",
        "nonTechnical": "service mindset, grooming/professionalism, conflict handling, teamwork, intercultural communication.",
        "evidence": "service project/event volunteering + basic operations case."
      },
      {
        "stage": "Year 2",
        "technical": "choose hotel/F&B/travel/events/revenue/aviation; Opera/PMS or travel systems; revenue metrics; digital marketing; event budgeting.",
        "nonTechnical": "customer recovery, sales communication, vendor coordination, leadership.",
        "evidence": "industry internship/part-time/volunteer experience."
      },
      {
        "stage": "Year 3",
        "technical": "advanced revenue/operations, event production, travel technology, analytics, sustainability; role-specific systems.",
        "nonTechnical": "client handling, negotiation, crisis management, team leadership.",
        "evidence": "major hotel/travel/event internship + measurable service/revenue/operations project."
      },
      {
        "stage": "Final Year",
        "technical": "capstone, revenue/analytics/operations specialisation, professional systems, business plan.",
        "nonTechnical": "management interviews, presentation, networking, career mobility planning.",
        "evidence": "management-track internship/project + PG or employment plan."
      }
    ],
    "technicalSkillsChecklist": [
      "hospitality/tourism operations",
      "Excel",
      "customer-service systems",
      "PMS/POS orientation",
      "communication",
      "tourism geography",
      "choose hotel/F&B/travel/events/revenue/aviation",
      "Opera/PMS or travel systems",
      "revenue metrics",
      "digital marketing",
      "event budgeting",
      "advanced revenue/operations",
      "event production",
      "travel technology",
      "analytics",
      "sustainability",
      "role-specific systems",
      "capstone"
    ],
    "nonTechnicalSkills": [
      "service mindset",
      "grooming/professionalism",
      "conflict handling",
      "teamwork",
      "intercultural communication",
      "customer recovery",
      "sales communication",
      "vendor coordination",
      "leadership",
      "client handling",
      "negotiation",
      "crisis management",
      "team leadership",
      "management interviews"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "Ministry of Tourism, State Tourism Departments, ITDC, tourism boards, airport/transport authorities, public convention centres and government hospitality organisations when internships are advertised.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "Taj/IHCL, ITC Hotels, Oberoi, Marriott, Hilton, Hyatt, Accor, Radisson, Lemon Tree; travel companies, airlines, cruise, event agencies, MICE firms. Apply via official careers.",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "AHLEI hospitality credentials",
        "bestFor": "hotel operations"
      },
      {
        "name": "IATA travel/cargo credentials",
        "bestFor": "travel/aviation"
      },
      {
        "name": "Amadeus/Sabre/GDS training",
        "bestFor": "travel operations"
      },
      {
        "name": "Revenue management credentials",
        "bestFor": "hotel revenue"
      },
      {
        "name": "WSET/food safety credentials where role appropriate",
        "bestFor": "Role-specific"
      },
      {
        "name": "CAPM",
        "bestFor": "events/project management"
      },
      {
        "name": "Google/Meta marketing credentials",
        "bestFor": "hospitality marketing"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Hotel Management Trainee",
      "Front Office Executive",
      "F&B Executive",
      "Guest Relations Executive",
      "Travel Consultant",
      "Tour Operations Executive",
      "Event Coordinator",
      "MICE Executive",
      "Revenue Analyst",
      "Reservations Executive",
      "Hospitality Sales Executive",
      "Airport Operations/Passenger Services Executive",
      "Hospitality Data Analyst"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "MHM/MSc Hospitality, MBA Hospitality/Tourism, MSc Tourism, Event Management, Luxury Management, Revenue/Hotel Analytics, Aviation Management. India examples: NCHMCT/IHMs, Christ, MAHE/Manipal, Welcomgroup Graduate School, IHM Pusa/Mumbai/Bengaluru/Hyderabad, tourism universities. Funding: institute aid, NSP where eligible.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "Switzerland",
        "detail": "EHL, Les Roches, Glion (private tuition; scholarships vary)."
      },
      {
        "country": "UK",
        "detail": "University of Surrey, Bournemouth, Oxford Brookes; Chevening where eligible."
      },
      {
        "country": "Australia",
        "detail": "Griffith, UQ, Blue Mountains/industry-linked programmes; university awards."
      },
      {
        "country": "USA",
        "detail": "Cornell Hotel School, UNLV, Florida International; university scholarships."
      },
      {
        "country": "Canada",
        "detail": "Toronto Metropolitan, Guelph, UBC-related tourism; awards."
      },
      {
        "country": "Netherlands",
        "detail": "Breda University, NHL Stenden; Erasmus/university awards."
      },
      {
        "country": "Singapore",
        "detail": "NUS/NTU/SHATEC-related ecosystem; institution-specific."
      },
      {
        "country": "France",
        "detail": "emlyon/ESSEC hospitality/luxury ecosystem; Eiffel for eligible fields."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Hotel operations → executive/management trainee → supervisor → department manager → hotel GM.",
      "Revenue/analytics → analyst → revenue manager → commercial director.",
      "Events → coordinator → event manager → senior producer/agency leadership.",
      "Tourism → operations executive → destination/product manager → tourism leadership/entrepreneurship."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "Hospitality careers are experience-heavy. Customer-facing roles often value internships, language skills, service recovery and operational competence more than academic credentials alone."
  },
  "Defence, Security & Emergency Services": {
    "careerFamilies": [
      "Defence Officer Careers",
      "Military Technology",
      "Cybersecurity & Cyber Defence",
      "Intelligence & Security Analysis",
      "Police/Public Safety",
      "Emergency & Disaster Management",
      "Fire & Rescue",
      "Forensics",
      "Aviation/Maritime Security",
      "Security Management",
      "Critical Infrastructure Protection"
    ],
    "howToUseNote": "Do not treat the domain as one job. First identify the student's career family, then select the role-specific skills, internship target, certification and PG pathway. The student can change family after evidence from projects/internships.",
    "yearPlan": [
      {
        "stage": "Year 1",
        "technical": "domain foundations; cybersecurity students build networking/Linux; forensic students build science/lab skills; disaster students learn GIS/basic emergency management.",
        "nonTechnical": "discipline, teamwork, physical fitness where role requires, communication, ethics, stress-aware decision making.",
        "evidence": "fitness/leadership activities + domain project."
      },
      {
        "stage": "Year 2",
        "technical": "choose defence/security/forensics/cyber/disaster; build technical tools, GIS, digital forensics, incident response, emergency planning or engineering skills.",
        "nonTechnical": "briefing, situational awareness, leadership, report writing.",
        "evidence": "relevant internship/volunteering/cadet/technical project."
      },
      {
        "stage": "Year 3",
        "technical": "advanced cyber/forensics/security/defence engineering; threat analysis; incident response; emergency simulation; professional tools.",
        "nonTechnical": "command/teamwork, crisis communication, stakeholder coordination.",
        "evidence": "serious internship/research project + role-specific portfolio."
      },
      {
        "stage": "Final Year",
        "technical": "capstone aligned to cyber/forensics/security/defence engineering; competitive-entry preparation where applicable.",
        "nonTechnical": "interview/SSB-style communication for officer routes, professional writing, leadership.",
        "evidence": "project + physical/medical/eligibility preparation where relevant + applications."
      }
    ],
    "technicalSkillsChecklist": [
      "domain foundations",
      "cybersecurity students build networking/Linux",
      "forensic students build science/lab skills",
      "disaster students learn GIS/basic emergency management",
      "choose defence/security/forensics/cyber/disaster",
      "build technical tools",
      "digital forensics",
      "incident response",
      "emergency planning or engineering skills",
      "advanced cyber/forensics/security/defence engineering",
      "threat analysis",
      "emergency simulation",
      "professional tools",
      "capstone aligned to cyber/forensics/security/defence engineering",
      "competitive-entry preparation where applicable"
    ],
    "nonTechnicalSkills": [
      "discipline",
      "teamwork",
      "physical fitness where role requires",
      "communication",
      "ethics",
      "stress-aware decision making",
      "briefing",
      "situational awareness",
      "leadership",
      "report writing",
      "command/teamwork",
      "crisis communication",
      "stakeholder coordination",
      "interview/SSB-style communication for officer routes"
    ],
    "internshipTracks": [
      {
        "track": "Government / public / no-fee routes",
        "targets": "DRDO internships; ISRO for space/security technology; Indian Army/Navy/Air Force entries and internships where officially notified; police/state police internships; NFSU/forensic labs; BPR&D; disaster-management authorities; AICTE National Internship Portal government missions.",
        "prepare": "1-page CV, transcript, recommendation where needed, one relevant project, short statement"
      },
      {
        "track": "Private / free or no-fee routes",
        "targets": "Cybersecurity firms, SOCs, security consultancies, critical infrastructure firms, risk consulting, digital forensics companies, safety/emergency technology startups, defence suppliers. Avoid any employer asking students to pay for a job/internship.",
        "prepare": "Role-specific CV, portfolio/research sample, LinkedIn profile, 10–20 targeted applications"
      },
      {
        "track": "Research / faculty route",
        "targets": "University faculty labs, public research institutes, domain conferences, research assistant projects",
        "prepare": "Literature/research sample, methods, faculty email and a short project proposal"
      }
    ],
    "internshipQualityNote": "Prefer a real deliverable, supervisor and outcome over a certificate-only internship. If a company asks the student to pay a large fee for a 'guaranteed internship/job', treat it as a warning sign and verify the employer independently.",
    "certifications": [
      {
        "name": "CompTIA Security+",
        "bestFor": "entry cybersecurity"
      },
      {
        "name": "Cisco CCNA",
        "bestFor": "networking"
      },
      {
        "name": "eJPT/other practical entry cyber credentials",
        "bestFor": "hands-on security"
      },
      {
        "name": "EC-Council credentials where employer-recognised; evaluate carefully",
        "bestFor": "Role-specific"
      },
      {
        "name": "GIAC credentials",
        "bestFor": "advanced/high-cost cybersecurity"
      },
      {
        "name": "ISO 27001 auditor/lead implementer",
        "bestFor": "security governance"
      },
      {
        "name": "Business continuity/disaster credentials",
        "bestFor": "emergency/resilience"
      }
    ],
    "certificationNote": "Choose 0–2 credentials that directly support the target role. For regulated professions, use recognised professional/licensing pathways rather than generic online certificates.",
    "careersHiredAs": [
      "Cybersecurity Analyst",
      "SOC Analyst",
      "Digital Forensics Assistant",
      "Security Analyst",
      "Risk Analyst",
      "GRC Analyst",
      "Defence Systems Engineer",
      "Aerospace/Embedded Engineer",
      "Emergency Management Associate",
      "Disaster Risk Reduction Associate",
      "Safety Officer",
      "Security Operations Coordinator",
      "Forensic Laboratory Assistant"
    ],
    "jobSearchNote": "Map each role to a minimum skill set and evidence. A student should be able to answer: 'What have I built, analysed, researched, designed, delivered or improved that proves I can do this job?'",
    "pgIndia": "M.Tech/MSc Cybersecurity, Forensics, Defence Technology, Aerospace, Electronics, Disaster Management, Security Studies, International Security, Emergency Management. India examples: NFSU, IITs, DRDO-linked institutes, JNU/strategic studies, defence universities and recognised public universities. Funding: GATE assistantships, institute aid, government fellowships.",
    "pgIndiaChecklist": [
      "Match the curriculum, labs and specialisation to the target role.",
      "Check professional recognition/licensing where relevant.",
      "Compare total cost, assistantships, scholarship eligibility and living costs.",
      "For research programmes, examine faculty, current projects, laboratories and funding.",
      "Do not assume that a higher degree is necessary for every entry-level role; use the career target to decide."
    ],
    "abroadCountries": [
      {
        "country": "USA",
        "detail": "Johns Hopkins SAIS, Carnegie Mellon, Georgia Tech, Maryland, MIT security/technology programmes; funding varies and some security programmes have restrictions."
      },
      {
        "country": "UK",
        "detail": "King's College London, Cranfield, UCL, Imperial; Chevening/Commonwealth where eligible."
      },
      {
        "country": "Canada",
        "detail": "Toronto, Waterloo, Carleton, UBC; university funding."
      },
      {
        "country": "Germany",
        "detail": "TUM, RWTH, Bonn, Saarland; DAAD."
      },
      {
        "country": "Netherlands",
        "detail": "Leiden, TU Delft, Radboud; Erasmus Mundus/university."
      },
      {
        "country": "France",
        "detail": "Sciences Po, Paris-Saclay, Grenoble; Eiffel for eligible fields."
      },
      {
        "country": "Japan",
        "detail": "University of Tokyo, Kyoto, Tohoku; MEXT."
      },
      {
        "country": "South Korea",
        "detail": "KAIST, POSTECH, SNU; GKS."
      }
    ],
    "abroadApplicationNote": "Start roughly 9–15 months before intake where possible. Prepare transcripts, CV, statement of purpose, references, English test if required, portfolio/research sample where relevant, funding plan and visa documents.",
    "careerAdvancement": [
      "Cyber: SOC analyst → security engineer/incident responder → senior/lead → security manager/CISO track.",
      "Defence engineering: engineer → senior/project lead → programme manager/R&D leadership.",
      "Emergency management: programme associate → emergency/disaster manager → resilience leadership.",
      "Military/police officer pathways follow separate government recruitment, training, promotion and service rules."
    ],
    "careerEvidence": [
      "Updated CV and LinkedIn profile",
      "Portfolio / project / research evidence",
      "Internship certificates plus actual deliverables",
      "Academic transcript and relevant course projects",
      "Faculty/industry references where appropriate",
      "A record of tools, methods and measurable outcomes",
      "A target-role list reviewed every 6–12 months"
    ],
    "domainCaution": "Security and defence roles may have citizenship, clearance, age, medical and background requirements. Overseas defence/security employment is especially jurisdiction-specific; a foreign master's does not automatically confer eligibility for national-security jobs."
  },
};

export function flagshipRoadmapForGrad(cluster: string): FlagshipDomainRoadmapGrad | null {
  return FLAGSHIP_ROADMAPS_GRAD[cluster] ?? null;
}

// ---------------------------------------------------------------------
// Shared front matter - common to ALL 17 clusters above, shown once
// rather than repeated per cluster (the source document itself
// structures it this way: one shared "how UG roadmaps work" section,
// then 17 per-cluster sections).
// ---------------------------------------------------------------------

export const UG_ROADMAP_PURPOSE = "A practical roadmap for students who are already inside an undergraduate degree. It focuses on what to build during the remaining UG years, where to gain experience, which role-specific credentials may help, what jobs can be targeted, and how to plan PG study in India or abroad.";
export const UG_ROADMAP_STARTING_POINT = "The student has already entered a degree. Therefore, this roadmap does not repeat stream selection, UG entrance-exam selection, or generic 'choose a college' advice. It starts from the student's current degree/year and asks: What should I build now to become employable or ready for PG/research?";
export const UG_ROADMAP_PRINCIPLES: string[] = [
  "The roadmap is domain-first, but it must branch into career families and roles. A student in Business is not automatically a Finance student; a student in Engineering is not automatically a Software Engineer.",
  "Every year contains technical/domain skills, non-technical skills, evidence to build, and an experience target.",
  "Internships are separated into government/public opportunities and private/no-fee opportunities. 'Free' means the student is not charged a placement/internship fee; it does not mean every opportunity is unpaid.",
  "Certifications are paid and role-specific. They are not a substitute for projects, internships, grades, licensing or professional experience.",
  "PG advice separates India from overseas study and includes courses, representative institutions, funding routes and scholarship families.",
  "Long-term progression shows both employment growth and research/PhD routes where relevant.",
  "Professional and regulated careers require separate licensing/registration rules. A degree alone should never be presented as an automatic practice licence."
];

export interface UgYearLogicRow { stage: string; question: string; output: string; }
export const UG_YEAR_LOGIC: UgYearLogicRow[] = [
  {
    "stage": "Year 1",
    "question": "What could fit me?",
    "output": "Exploration, foundations, small projects, exposure"
  },
  {
    "stage": "Year 2",
    "question": "Which direction should I seriously investigate?",
    "output": "Specialisation hypothesis, stronger project, first targeted internship"
  },
  {
    "stage": "Year 3",
    "question": "Am I becoming career-ready?",
    "output": "Deep skills, major internship/research, portfolio, role-specific credential"
  },
  {
    "stage": "Final Year",
    "question": "What path should I execute next?",
    "output": "Capstone, placement/PG/research applications, interview readiness"
  },
  {
    "stage": "5-year / integrated / professional degree",
    "question": "How does the sequence shift?",
    "output": "Extend the Year 3 depth stage and use the final year for capstone + launch"
  }
];
export const UG_ALREADY_IN_LATER_YEAR: string[] = [
  "Do not restart the roadmap from Year 1. Jump directly to the relevant stage and backfill only missing prerequisites.",
  "Year 2 students should prioritise one career family and a serious project.",
  "Year 3 students should prioritise internship/research evidence and role-specific tools.",
  "Final-year students should prioritise a job/PG/research decision, capstone alignment, interviews and applications.",
  "Students in regulated professional programmes should follow their programme's statutory internship/clinical/practical requirements first."
];

export interface CommonInternshipResource { name: string; usefulFor: string; note: string; }
export const COMMON_INTERNSHIP_RESOURCES_GRAD: CommonInternshipResource[] = [
  {
    "name": "AICTE National Internship Portal",
    "usefulFor": "Government, PSU, local-body and private internship listings; student registration is free",
    "note": "Openings and eligibility vary; apply through the official portal"
  },
  {
    "name": "NITI Aayog Internship Scheme",
    "usefulFor": "Government/public-policy exposure for eligible UG/PG/research students",
    "note": "Eligibility, application windows and selection depend on the current scheme"
  },
  {
    "name": "ISRO Internship & Student Project Trainee",
    "usefulFor": "Science/technology research and project exposure",
    "note": "Current official page specifies eligibility, duration and academic conditions"
  },
  {
    "name": "DRDO Skill-Seeker / lab internship notices",
    "usefulFor": "Engineering/science defence R&D internships",
    "note": "Individual labs publish separate notices; some are paid and deadlines vary"
  },
  {
    "name": "National Scholarship Portal (NSP)",
    "usefulFor": "Central/state/welfare scholarship schemes",
    "note": "Eligibility is scheme-specific; OTR is required for NSP applications"
  },
  {
    "name": "Institute scholarships / assistantships",
    "usefulFor": "Tuition support, fee waivers, RA/TA support",
    "note": "Check the exact institution and programme rules every cycle"
  },
  {
    "name": "Employer sponsorship",
    "usefulFor": "PG study support after joining an organisation",
    "note": "Usually role/tenure/performance dependent; not guaranteed"
  }
];
export const VERIFIED_RESOURCE_LINKS_GRAD: { name: string; url: string }[] = [
  {
    "name": "AICTE National Internship Portal",
    "url": "https://internship.aicte-india.org/"
  },
  {
    "name": "NITI Aayog Internship Scheme",
    "url": "https://workforindia.niti.gov.in/intern/InternshipEntry/"
  },
  {
    "name": "ISRO Internships & Student Projects",
    "url": "https://www.isro.gov.in/InternshipAndProjects.html"
  },
  {
    "name": "DRDO Skill-Seeker / Internship notices",
    "url": "https://drdo.gov.in/drdo/en/skill-seeker"
  },
  {
    "name": "National Scholarship Portal",
    "url": "https://scholarships.gov.in/"
  },
  {
    "name": "Fulbright-Nehru Fellowships (USIEF)",
    "url": "https://www.usief.org.in/fulbright-fellowships/fellowships-for-indian-citizen/fulbright-nehru-masters-fellowships/"
  },
  {
    "name": "Chevening – India",
    "url": "https://www.chevening.org/scholarship/india/"
  },
  {
    "name": "Commonwealth Master's Scholarships",
    "url": "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/"
  },
  {
    "name": "France Excellence Eiffel",
    "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program"
  },
  {
    "name": "Global Korea Scholarship / Study in Korea",
    "url": "https://studyinkorea.go.kr/"
  }
];

export interface ScholarshipFamily { region: string; family: string; use: string; caution: string; }
export const INTERNATIONAL_SCHOLARSHIP_FAMILIES_GRAD: ScholarshipFamily[] = [
  {
    "region": "USA",
    "family": "Fulbright-Nehru; university fellowships; RA/TA",
    "use": "Selected master's/research pathways",
    "caution": "Field, experience and annual eligibility are specific"
  },
  {
    "region": "UK",
    "family": "Chevening; Commonwealth; university awards",
    "use": "Master's and selected postgraduate study",
    "caution": "Awards have their own eligibility and conditions"
  },
  {
    "region": "Germany",
    "family": "DAAD; university/research assistantships",
    "use": "Master's/research",
    "caution": "Programme and nationality eligibility varies"
  },
  {
    "region": "EU",
    "family": "Erasmus Mundus Joint Masters; university funding",
    "use": "Joint master's across countries",
    "caution": "Each consortium has its own eligibility and deadline"
  },
  {
    "region": "France",
    "family": "Eiffel; university scholarships",
    "use": "Master's/doctoral study in priority fields",
    "caution": "Eiffel applications are submitted by French institutions"
  },
  {
    "region": "Sweden",
    "family": "Swedish Institute and university scholarships",
    "use": "Selected master's programmes",
    "caution": "Nationality/programme/work-experience rules apply"
  },
  {
    "region": "Australia",
    "family": "University scholarships; RTP for research degrees",
    "use": "Master's/research/PhD",
    "caution": "Government awards are country/programme specific"
  },
  {
    "region": "Canada",
    "family": "University awards; RA/TA; selected national/provincial schemes",
    "use": "Master's/research/PhD",
    "caution": "Funding is institution/programme dependent"
  },
  {
    "region": "Japan",
    "family": "MEXT; university scholarships",
    "use": "Graduate study/research",
    "caution": "Embassy/university routes and timelines differ"
  },
  {
    "region": "South Korea",
    "family": "Global Korea Scholarship; university scholarships",
    "use": "Graduate and undergraduate study",
    "caution": "Annual quota, route and eligibility vary"
  }
];
export const SCHOLARSHIP_CAUTION_GRAD = "Scholarship names and deadlines change. A scholarship listed here is a route to investigate, not a promise of eligibility or funding. The current official call should always be checked before the student applies.";
