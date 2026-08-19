# Demo figures - for expert review

Every number below is **authored**, not sourced from a live feed of
salary surveys, fee schedules or exam calendars.

| | |
|---|---|
| Compiled | 2026-08 |
| Basis | Indicative ranges for students entering higher education in India around 2026-2030, authored from general sector knowledge. |
| Confidence | Directional. Salary bands vary widely by city, institution and employer; treat them as orders of magnitude, not quotes. |
| Review needed | yes |

The report shows a caveat beside each of these blocks, so a student is
not invited to read them as measurements. Correct anything wrong here,
then bump `FIGURES['asOf']` in `scripts/demo_11_12_families.py` and
re-run `python scripts/build_demo_careers.py`.

## 1. Salary bands

`family` means the career inherits its family's band rather than
stating its own - correcting it there fixes every career in that family.

| Career | Family | Starting | Mid-career | Senior | Source |
|--------|--------|----------|------------|--------|--------|
| Agribusiness Manager | Agriculture & Environment | Rs 4-10 LPA | Rs 10-28 LPA | Rs 28-70 LPA+ | career |
| Agricultural Scientist | Agriculture & Environment | Rs 3-8 LPA | Rs 8-20 LPA | Rs 20-45 LPA+ (ICAR scientist grade secure) | career |
| Food Technologist | Agriculture & Environment | Rs 3-8 LPA | Rs 8-20 LPA | Rs 20-50 LPA+ | career |
| Forest Officer (IFS) | Agriculture & Environment | Rs 7-12 LPA (plus housing and allowances) | Rs 12-25 LPA | Rs 25-40 LPA | career |
| Horticulturist | Agriculture & Environment | Rs 3-7 LPA | Rs 7-18 LPA | Rs 18-40 LPA+ | career |
| Medical Laboratory Scientist | Allied Health & Therapy | Rs 2.5-6 LPA | Rs 6-14 LPA | Rs 14-30 LPA+ | career |
| Nurse | Allied Health & Therapy | Rs 3-6 LPA | Rs 6-14 LPA | Rs 14-35 LPA+ (far higher abroad) | career |
| Nutritionist / Dietitian | Allied Health & Therapy | Rs 2.5-6 LPA | Rs 6-15 LPA | Rs 15-40 LPA+ (private and sports practice highest) | career |
| Occupational Therapist | Allied Health & Therapy | Rs 3-6 LPA | Rs 6-14 LPA | Rs 14-35 LPA+ | career |
| Optometrist | Allied Health & Therapy | Rs 3-6 LPA | Rs 6-14 LPA | Rs 14-35 LPA+ (own clinic) | career |
| Pharmacist / Pharmaceutical Scientist | Allied Health & Therapy | Rs 3-8 LPA | Rs 8-20 LPA | Rs 20-50 LPA+ | career |
| Physiotherapist | Allied Health & Therapy | Rs 3-6 LPA | Rs 6-15 LPA | Rs 15-40 LPA+ (sports and private practice highest) | career |
| Public Health Specialist | Allied Health & Therapy | Rs 4-10 LPA | Rs 10-25 LPA | Rs 25-60 LPA+ (WHO and global bodies higher) | career |
| Radiographer / Imaging Technologist | Allied Health & Therapy | Rs 3-7 LPA | Rs 7-16 LPA | Rs 16-35 LPA+ | career |
| Sports Scientist / Performance Specialist | Allied Health & Therapy | Rs 3-7 LPA | Rs 7-20 LPA | Rs 20-60 LPA+ (professional teams highest) | career |
| Civil Servant (IAS / IPS / IFS) | Public Service & Policy | Rs 7-12 LPA (plus housing, transport and allowances) | Rs 12-25 LPA | Rs 25-40 LPA | career |
| Defence Services Officer | Public Service & Policy | Rs 8-13 LPA (plus housing, medical and allowances) | Rs 13-25 LPA | Rs 25-45 LPA | career |
| Diplomat / International Affairs Specialist | Public Service & Policy | Rs 7-12 LPA (plus foreign allowances abroad) | Rs 12-25 LPA | Rs 25-45 LPA | career |
| Public Policy Analyst | Public Service & Policy | Rs 4-12 LPA | Rs 12-30 LPA | Rs 30-80 LPA+ (multilateral bodies higher) | career |
| Actuary | Commerce, Finance & Management | Rs 6-14 LPA | Rs 14-40 LPA | Rs 40 LPA-1.5 Cr+ (Fellow) | career |
| Banking Professional | Commerce, Finance & Management | Rs 4-12 LPA | Rs 12-30 LPA | Rs 30-80 LPA+ | career |
| Brand Manager | Commerce, Finance & Management | Rs 6-15 LPA | Rs 15-40 LPA | Rs 40 LPA-1.5 Cr+ | career |
| Business Analyst | Commerce, Finance & Management | Rs 5-14 LPA | Rs 14-35 LPA | Rs 35-90 LPA+ | career |
| Chartered Accountant (CA) | Commerce, Finance & Management | Rs 8-14 LPA (fresh CA) | Rs 14-35 LPA | Rs 35 LPA-1.5 Cr+ (partner) | career |
| Company Secretary (CS) | Commerce, Finance & Management | Rs 5-10 LPA | Rs 10-25 LPA | Rs 25-70 LPA+ | career |
| Compliance & Risk Officer | Commerce, Finance & Management | Rs 5-11 LPA | Rs 11-30 LPA | Rs 30-80 LPA+ | career |
| Cost & Management Accountant (CMA) | Commerce, Finance & Management | Rs 5-10 LPA | Rs 10-24 LPA | Rs 24-60 LPA+ | career |
| Digital Marketing Specialist | Commerce, Finance & Management | Rs 3-9 LPA | Rs 9-25 LPA | Rs 25-70 LPA+ | career |
| Economist | Commerce, Finance & Management | Rs 5-14 LPA | Rs 14-35 LPA | Rs 35 LPA-1 Cr+ | career |
| Entrepreneur / Founder | Commerce, Finance & Management | Often nothing for 1-3 years | Highly variable | Rs 0 to unbounded | career |
| Equity Research Analyst | Commerce, Finance & Management | Rs 8-18 LPA | Rs 18-45 LPA | Rs 45 LPA-2 Cr+ | career |
| Financial Analyst | Commerce, Finance & Management | Rs 5-14 LPA | Rs 14-35 LPA | Rs 35 LPA-1 Cr+ | career |
| Forensic Accountant | Commerce, Finance & Management | Rs 6-12 LPA | Rs 12-30 LPA | Rs 30-80 LPA+ | career |
| Human Resources Manager | Commerce, Finance & Management | Rs 4-10 LPA | Rs 10-28 LPA | Rs 28-90 LPA+ (CHRO) | career |
| Internal Auditor / Risk Analyst | Commerce, Finance & Management | Rs 5-11 LPA | Rs 11-28 LPA | Rs 28-70 LPA+ | career |
| Investment Banker | Commerce, Finance & Management | Rs 12-30 LPA | Rs 30-80 LPA | Rs 80 LPA-5 Cr+ | career |
| Management Consultant | Commerce, Finance & Management | Rs 10-25 LPA | Rs 25-70 LPA | Rs 70 LPA-4 Cr+ (partner) | career |
| Marketing Manager | Commerce, Finance & Management | Rs 4-12 LPA | Rs 12-35 LPA | Rs 35 LPA-1.5 Cr+ (CMO) | career |
| Operations / Supply Chain Manager | Commerce, Finance & Management | Rs 4-12 LPA | Rs 12-32 LPA | Rs 32-90 LPA+ (COO) | career |
| Portfolio / Fund Manager | Commerce, Finance & Management | Rs 10-25 LPA (analyst first) | Rs 25-80 LPA | Rs 80 LPA-5 Cr+ | career |
| Product Manager | Commerce, Finance & Management | Rs 8-25 LPA | Rs 25-60 LPA | Rs 60 LPA-2.5 Cr+ | career |
| Quantitative Analyst | Commerce, Finance & Management | Rs 15-45 LPA | Rs 45 LPA-1.2 Cr | Rs 1-5 Cr+ | career |
| Animator | Design | Rs 3-8 LPA | Rs 8-22 LPA | Rs 22-60 LPA+ | career |
| Architect | Design | Rs 3-8 LPA | Rs 8-22 LPA | Rs 22-70 LPA+ (own practice uncapped) | career |
| Fashion Designer | Design | Rs 3-8 LPA | Rs 8-22 LPA | Rs 22-70 LPA+ (own label uncapped and risky) | career |
| Fine Artist | Design | Highly variable, often supplemented | Rs 5-20 LPA | Rs 20 LPA-uncapped | career |
| Graphic / Communication Designer | Design | Rs 3-9 LPA | Rs 9-24 LPA | Rs 24-60 LPA+ (freelance uncapped) | career |
| Illustrator | Design | Rs 2.5-7 LPA | Rs 7-18 LPA | Rs 18-50 LPA+ (reputation-driven) | career |
| Industrial / Product Designer | Design | Rs 4-12 LPA | Rs 12-30 LPA | Rs 30-75 LPA+ | career |
| Interior Designer | Design | Rs 3-8 LPA | Rs 8-22 LPA | Rs 22-60 LPA+ (own studio) | career |
| Textile Designer | Design | Rs 3-7 LPA | Rs 7-18 LPA | Rs 18-45 LPA+ | career |
| UX / Product Designer | Design | Rs 5-15 LPA | Rs 15-40 LPA | Rs 40 LPA-1.5 Cr+ | career |
| Urban & Regional Planner | Design | Rs 3.5-9 LPA | Rs 9-22 LPA | Rs 22-55 LPA+ | career |
| VFX Artist | Design | Rs 3-9 LPA | Rs 9-25 LPA | Rs 25-70 LPA+ | career |
| Aerospace Engineer | Engineering & Technology | Rs 5-14 LPA | Rs 14-32 LPA | Rs 32-75 LPA+ | career |
| Automotive / EV Engineer | Engineering & Technology | Rs 4-12 LPA | Rs 12-28 LPA | Rs 28-70 LPA+ | career |
| Chemical / Process Engineer | Engineering & Technology | Rs 4-12 LPA | Rs 12-28 LPA | Rs 28-65 LPA+ | career |
| Civil / Structural Engineer | Engineering & Technology | Rs 3-8 LPA | Rs 8-20 LPA | Rs 20-50 LPA+ (own practice or PSU seniority) | career |
| Construction / Project Manager | Engineering & Technology | Rs 4-10 LPA | Rs 10-28 LPA | Rs 28-80 LPA+ | career |
| Electrical & Electronics Engineer | Engineering & Technology | Rs 4-12 LPA | Rs 12-28 LPA | Rs 28-70 LPA+ | career |
| Embedded Systems Engineer | Engineering & Technology | Rs 4-14 LPA | Rs 14-32 LPA | Rs 32-75 LPA+ | career |
| Environmental Engineer | Engineering & Technology | Rs 3.5-9 LPA | Rs 9-22 LPA | Rs 22-55 LPA+ | career |
| Industrial / Systems Engineer | Engineering & Technology | Rs 4-12 LPA | Rs 12-30 LPA | Rs 30-70 LPA+ | career |
| Mechanical Engineer | Engineering & Technology | Rs 3.5-10 LPA | Rs 10-25 LPA | Rs 25-60 LPA+ | career |
| Renewable Energy Engineer | Engineering & Technology | Rs 4-11 LPA | Rs 11-26 LPA | Rs 26-65 LPA+ | career |
| Robotics & Automation Engineer | Engineering & Technology | Rs 5-16 LPA | Rs 16-38 LPA | Rs 38-90 LPA+ | career |
| Chef / Culinary Professional | Hospitality, Tourism & Lifestyle | Rs 2.5-6 LPA | Rs 6-18 LPA | Rs 18-60 LPA+ (own restaurant uncapped and risky) | career |
| Event Manager | Hospitality, Tourism & Lifestyle | Rs 3-7 LPA | Rs 7-20 LPA | Rs 20-60 LPA+ | career |
| Hotel / Hospitality Manager | Hospitality, Tourism & Lifestyle | Rs 3-6 LPA | Rs 6-18 LPA | Rs 18-60 LPA+ (General Manager) | career |
| Sports Coach / Manager | Hospitality, Tourism & Lifestyle | Rs 2.5-6 LPA | Rs 6-18 LPA | Rs 18-60 LPA+ (professional level far higher) | career |
| Travel & Tourism Professional | Hospitality, Tourism & Lifestyle | Rs 2.5-6 LPA | Rs 6-16 LPA | Rs 16-45 LPA+ | career |
| Anthropologist / Sociologist | Humanities & Social Sciences | Rs 3-8 LPA | Rs 8-20 LPA | Rs 20-55 LPA+ (UX research pays notably better) | career |
| Author / Writer | Humanities & Social Sciences | Rarely a full income initially | Rs 4-15 LPA | Rs 15 LPA-uncapped | career |
| Historian / Archivist | Humanities & Social Sciences | Rs 3-7 LPA | Rs 7-18 LPA | Rs 18-40 LPA+ | career |
| Linguist / Language Specialist | Humanities & Social Sciences | Rs 3-8 LPA | Rs 8-22 LPA | Rs 22-60 LPA+ (tech NLP roles highest) | career |
| Museum Curator / Arts Manager | Humanities & Social Sciences | Rs 3-7 LPA | Rs 7-18 LPA | Rs 18-45 LPA+ | career |
| Professor / Academic | Humanities & Social Sciences | Rs 6-12 LPA (Assistant Professor) | Rs 12-22 LPA | Rs 22-40 LPA+ | career |
| Psychologist / Counsellor | Humanities & Social Sciences | Rs 3-7 LPA | Rs 7-20 LPA | Rs 20-60 LPA+ (private practice highest) | career |
| School Teacher | Humanities & Social Sciences | Rs 3-7 LPA | Rs 7-15 LPA | Rs 15-35 LPA+ (international schools higher) | career |
| Social Worker / Development Professional | Humanities & Social Sciences | Rs 3-7 LPA | Rs 7-18 LPA | Rs 18-45 LPA+ (large foundations higher) | career |
| Special Educator | Humanities & Social Sciences | Rs 3-6 LPA | Rs 6-14 LPA | Rs 14-35 LPA+ | career |
| Corporate Lawyer | Law | Rs 12-20 LPA (tier-1 firm) | Rs 20-60 LPA | Rs 60 LPA-3 Cr+ (partner) | career |
| In-house Legal Counsel | Law | Rs 6-14 LPA | Rs 14-40 LPA | Rs 40 LPA-2 Cr+ (General Counsel) | career |
| Judge / Judicial Officer | Law | Rs 8-14 LPA (plus housing and allowances) | Rs 14-25 LPA | Rs 25-40 LPA (High Court and above higher) | career |
| Litigator / Advocate | Law | Rs 1.5-6 LPA (junior in chambers) | Rs 6-30 LPA | Rs 30 LPA-10 Cr+ (senior counsel) | career |
| Advertising Professional | Media, Film & Communication | Rs 3-10 LPA | Rs 10-30 LPA | Rs 30-90 LPA+ | career |
| Art Director | Media, Film & Communication | Rs 4-12 LPA | Rs 12-32 LPA | Rs 32-90 LPA+ | career |
| Cinematographer | Media, Film & Communication | Project-based, Rs 3-8 LPA equivalent | Rs 8-30 LPA | Rs 30 LPA-uncapped | career |
| Content Creator / Digital Storyteller | Media, Film & Communication | Often near zero for 1-2 years | Rs 6-25 LPA | Rs 25 LPA-uncapped | career |
| Editor / Content Strategist | Media, Film & Communication | Rs 3-8 LPA | Rs 8-22 LPA | Rs 22-60 LPA+ | career |
| Filmmaker / Director | Media, Film & Communication | Project-based, often minimal | Rs 8-30 LPA | Rs 30 LPA-uncapped | career |
| Journalist | Media, Film & Communication | Rs 3-7 LPA | Rs 7-20 LPA | Rs 20-60 LPA+ | career |
| Media / Broadcast Manager | Media, Film & Communication | Rs 4-10 LPA | Rs 10-28 LPA | Rs 28-80 LPA+ | career |
| Photographer | Media, Film & Communication | Rs 2.5-7 LPA | Rs 7-20 LPA | Rs 20-60 LPA+ (reputation-driven) | career |
| Public Relations Specialist | Media, Film & Communication | Rs 3-9 LPA | Rs 9-25 LPA | Rs 25-70 LPA+ | career |
| AYUSH Practitioner (BAMS / BHMS / BUMS / BSMS) | Medicine & Health Sciences | Rs 3-7 LPA | Rs 7-18 LPA | Rs 18-50 LPA+ (established practice) | career |
| Dentist | Medicine & Health Sciences | Rs 3-8 LPA | Rs 8-20 LPA | Rs 20-60 LPA+ (own practice) | career |
| Doctor (MBBS) | Medicine & Health Sciences | Rs 6-12 LPA (junior resident) | Rs 12-35 LPA (post-MD) | Rs 35 LPA-1 Cr+ (consultant or private practice) | career |
| Psychiatrist | Medicine & Health Sciences | Rs 8-15 LPA | Rs 15-40 LPA | Rs 40 LPA-1.5 Cr+ | career |
| Surgeon | Medicine & Health Sciences | Rs 8-15 LPA | Rs 20-50 LPA | Rs 50 LPA-3 Cr+ | career |
| Veterinarian | Medicine & Health Sciences | Rs 3-8 LPA | Rs 8-18 LPA | Rs 18-45 LPA+ | career |
| Biochemist | Pure & Applied Sciences | Rs 3-8 LPA | Rs 8-20 LPA | Rs 20-50 LPA+ | career |
| Biotechnologist | Pure & Applied Sciences | Rs 3-9 LPA | Rs 9-24 LPA | Rs 24-60 LPA+ | career |
| Chemist | Pure & Applied Sciences | Rs 3-8 LPA | Rs 8-20 LPA | Rs 20-50 LPA+ | career |
| Environmental Scientist | Pure & Applied Sciences | Rs 3-8 LPA | Rs 8-20 LPA | Rs 20-50 LPA+ (ESG consulting highest) | career |
| Geneticist / Genomics Scientist | Pure & Applied Sciences | Rs 4-10 LPA | Rs 10-26 LPA | Rs 26-65 LPA+ | career |
| Geologist | Pure & Applied Sciences | Rs 3.5-9 LPA | Rs 9-24 LPA | Rs 24-60 LPA+ (oil, gas and mining highest) | career |
| Materials Scientist | Pure & Applied Sciences | Rs 4-10 LPA | Rs 10-26 LPA | Rs 26-70 LPA+ | career |
| Mathematician | Pure & Applied Sciences | Rs 4-12 LPA | Rs 12-35 LPA | Rs 35 LPA-2 Cr+ (quantitative finance highest) | career |
| Medical / Clinical Researcher | Pure & Applied Sciences | Rs 4-10 LPA | Rs 10-28 LPA | Rs 28-70 LPA+ | career |
| Microbiologist | Pure & Applied Sciences | Rs 2.5-7 LPA | Rs 7-18 LPA | Rs 18-45 LPA+ | career |
| Physicist | Pure & Applied Sciences | Rs 4-10 LPA | Rs 10-28 LPA | Rs 28-80 LPA+ (quant finance and semiconductors highest) | career |
| Research Scientist | Pure & Applied Sciences | Rs 4-9 LPA (JRF/SRF stipend during PhD) | Rs 9-22 LPA | Rs 22-60 LPA+ (industry R&D highest) | career |
| Statistician | Pure & Applied Sciences | Rs 5-14 LPA | Rs 14-35 LPA | Rs 35-90 LPA+ | career |
| Wildlife Biologist / Conservationist | Pure & Applied Sciences | Rs 2.5-6 LPA | Rs 6-15 LPA | Rs 15-35 LPA+ | career |
| AI / Machine Learning Engineer | Software & Data | Rs 8-30 LPA | Rs 30-70 LPA | Rs 70 LPA-3 Cr+ | career |
| Cloud / DevOps Engineer | Software & Data | Rs 5-20 LPA | Rs 20-50 LPA | Rs 50 LPA-1.5 Cr+ | career |
| Cybersecurity Analyst | Software & Data | Rs 5-18 LPA | Rs 18-45 LPA | Rs 45 LPA-1.2 Cr+ | career |
| Data Scientist | Software & Data | Rs 6-22 LPA | Rs 22-50 LPA | Rs 50 LPA-1.5 Cr+ | career |
| Game Developer | Software & Data | Rs 4-12 LPA | Rs 12-30 LPA | Rs 30-80 LPA+ | career |
| Software Engineer | Software & Data | Rs 6-25 LPA | Rs 25-60 LPA | Rs 60 LPA-2 Cr+ | career |

## 2. Entrance exams

Windows are the shape of the calendar, not exact dates.

### Agriculture & Environment

| Exam | When | What it opens |
|------|------|---------------|
| ICAR AIEEA-UG | Class 12, Apr-May | Agricultural universities across India |
| State agriculture CETs | Class 12 | State agricultural university seats |
| CUET-UG | Class 12, May | Environmental science and allied programmes |

Careers overriding the above: Forest Officer (IFS)

**Forest Officer (IFS)**

| Exam | When | What it opens |
|------|------|---------------|
| UPSC Indian Forest Service | After graduation in a science or engineering subject | The IFS - prelims shared with Civil Services |

### Allied Health & Therapy

| Exam | When | What it opens |
|------|------|---------------|
| NEET-UG | Class 12, May | Most allied-health degrees at government institutions |
| CUET-UG | Class 12, May | Central-university allied-health and nursing seats |
| Institutional tests (AIIMS, CMC, state paramedical) | Class 12 | Direct allied-health admission |

### Public Service & Policy

| Exam | When | What it opens |
|------|------|---------------|
| UPSC Civil Services | After graduation, prelims in May | IAS, IPS, IFS and central services |
| State PSC | After graduation | State administrative services |
| CUET-UG | Class 12, May | BA Political Science, Public Policy, Economics |

Careers overriding the above: Defence Services Officer, Diplomat / International Affairs Specialist

**Defence Services Officer**

| Exam | When | What it opens |
|------|------|---------------|
| NDA | Class 12, twice a year - the direct route from school | National Defence Academy |
| CDS | After graduation | IMA, INA, AFA and OTA |
| AFCAT / TES / SSB | Class 12 or graduation | Air Force and technical entries |

**Diplomat / International Affairs Specialist**

| Exam | When | What it opens |
|------|------|---------------|
| UPSC Civil Services (IFS) | After graduation | The Indian Foreign Service |

### Commerce, Finance & Management

| Exam | When | What it opens |
|------|------|---------------|
| CUET-UG | Class 12, May | B.Com / BBA at Delhi University and central universities |
| IPMAT (IIM Indore / Rohtak) | Class 12, May | The five-year integrated management programme straight from school |
| NPAT, SET, CHRIST, DU-JAT | Class 12, Apr-Jun | NMIMS, Symbiosis, Christ and similar |
| CA Foundation / CS Executive Entrance / CMA Foundation | After Class 12, Jun & Dec | The professional route, alongside or instead of a degree |

Careers overriding the above: Actuary, Banking Professional, Chartered Accountant (CA), Company Secretary (CS)

**Actuary**

| Exam | When | What it opens |
|------|------|---------------|
| IAI ACET | After Class 12, twice a year | Institute of Actuaries of India student membership |
| IFoA / IAI actuarial exams | Over 5-8 years | Fellowship, and the senior roles that need it |

**Banking Professional**

| Exam | When | What it opens |
|------|------|---------------|
| IBPS PO / SBI PO | After graduation | Public sector bank officer roles |
| RBI Grade B | After graduation | The central bank - among the most sought-after finance jobs in India |

**Chartered Accountant (CA)**

| Exam | When | What it opens |
|------|------|---------------|
| CA Foundation | After Class 12, Jun & Dec | Entry to the ICAI qualification |
| CA Intermediate | After Foundation | Articleship - three years of paid practical training |
| CA Final | After articleship | Membership of ICAI |

**Company Secretary (CS)**

| Exam | When | What it opens |
|------|------|---------------|
| CSEET | After Class 12, four sittings a year | ICSI Executive programme |
| CS Executive & Professional | After CSEET | ICSI membership after practical training |

### Design

| Exam | When | What it opens |
|------|------|---------------|
| UCEED | Class 12, Jan | B.Des at IIT Bombay, Delhi, Guwahati, Hyderabad |
| NID DAT | Class 12, Dec-Jan | National Institute of Design |
| NIFT Entrance | Class 12, Feb | NIFT campuses - fashion and textile design |
| NATA | Class 12, Apr-Jul | B.Arch (architecture route) |

Careers overriding the above: Architect, Fashion Designer

**Architect**

| Exam | When | What it opens |
|------|------|---------------|
| NATA | Class 12, Apr-Jul | B.Arch at most architecture schools |
| JEE Main Paper 2 | Class 12, Jan & Apr | B.Arch at NITs, SPAs and IITs |

**Fashion Designer**

| Exam | When | What it opens |
|------|------|---------------|
| NIFT Entrance | Class 12, Feb | National Institute of Fashion Technology |
| NID DAT | Class 12, Dec-Jan | NID textile and fashion programmes |
| Pearl Academy / Symbiosis entrance | Class 12 | Private design schools |

### Engineering & Technology

| Exam | When | What it opens |
|------|------|---------------|
| JEE Main | Class 12, two sessions (Jan & Apr) | NITs, IIITs, GFTIs, and most state and private engineering colleges |
| JEE Advanced | Class 12, after clearing JEE Main cut-off | The 23 IITs |
| State CETs (MHT-CET, KCET, AP/TS EAMCET, WBJEE) | Class 12, Apr-May | State-quota seats, often at much lower fees |
| BITSAT / VITEEE / SRMJEEE / COMEDK | Class 12, Apr-Jun | BITS Pilani and the larger private universities |

### Hospitality, Tourism & Lifestyle

| Exam | When | What it opens |
|------|------|---------------|
| NCHMCT JEE | Class 12, Apr-May | The Institutes of Hotel Management (IHM) |
| CUET-UG | Class 12, May | Tourism and hospitality degrees at central universities |
| Institutional tests (Oberoi STEP, Taj, WGSHA) | Class 12 or after | Hotel-group training programmes, often with a stipend |

### Humanities & Social Sciences

| Exam | When | What it opens |
|------|------|---------------|
| CUET-UG | Class 12, May | BA programmes at DU, BHU, JNU and central universities |
| Ashoka / Krea / FLAME Aptitude Tests | Class 12, Dec-Apr | Liberal-arts universities, often with substantial aid |
| TISS-BAT / Symbiosis SET | Class 12 | Social sciences and social work |

### Law

| Exam | When | What it opens |
|------|------|---------------|
| CLAT | Class 12, Dec | The 26 National Law Universities |
| AILET | Class 12, Dec | NLU Delhi |
| LSAT-India / SLAT / CUET-UG | Class 12, Jan-May | Jindal, Symbiosis and central-university law schools |

Careers overriding the above: Judge / Judicial Officer

**Judge / Judicial Officer**

| Exam | When | What it opens |
|------|------|---------------|
| State Judicial Services (Civil Judge) | After LLB, varies by state | Entry to the district judiciary |

### Media, Film & Communication

| Exam | When | What it opens |
|------|------|---------------|
| CUET-UG | Class 12, May | BA Journalism / Mass Communication at central universities |
| IIMC Entrance | After graduation | Indian Institute of Mass Communication |
| FTII / SRFTI JET | After Class 12 or graduation | Film and television training |
| Institutional tests (Symbiosis SET, Christ, Xavier's) | Class 12 | Private media schools |

### Medicine & Health Sciences

| Exam | When | What it opens |
|------|------|---------------|
| NEET-UG | Class 12, May - the single gateway | MBBS, BDS, BAMS, BHMS, BVSc, Nursing and most allied-health seats |
| AIIMS / JIPMER (now merged into NEET) | Class 12 | AIIMS and JIPMER seats via NEET rank |
| State counselling (85% state quota) | After NEET result | State medical colleges at far lower fees |

### Pure & Applied Sciences

| Exam | When | What it opens |
|------|------|---------------|
| CUET-UG | Class 12, May | B.Sc at Delhi University, BHU, JNU and other central universities |
| IISER Aptitude Test / NEST | Class 12, Jun | IISERs and NISER - the research-track BS-MS |
| ISI Admission Test / CMI Entrance | Class 12, May | Indian Statistical Institute and Chennai Mathematical Institute |
| State university entrances | Class 12 | State B.Sc seats |

### Software & Data

| Exam | When | What it opens |
|------|------|---------------|
| JEE Main / Advanced | Class 12 | B.Tech CSE at NITs, IIITs and IITs |
| State CETs & BITSAT | Class 12, Apr-Jun | State and private CSE seats |
| CUET-UG | Class 12, May | B.Sc CS / BCA at central universities |
| NPAT / SET / IPU-CET | Class 12 | BCA and B.Sc CS at private universities |

## 3. College lists

Representative institutions, not rankings.

| Family | Institutions |
|--------|-------------|
| Agriculture & Environment | IARI New Delhi; GB Pant University Pantnagar; TNAU Coimbatore; PAU Ludhiana; IRMA Anand; UAS Bengaluru |
| Allied Health & Therapy | AIIMS New Delhi; CMC Vellore; Manipal College of Health Professions; PGIMER Chandigarh; NIMHANS Bengaluru; Armed Forces Medical Services institutions |
| Public Service & Policy | St Stephen's & Hindu College, Delhi; JNU; Presidency Kolkata; TISS Mumbai; Ashoka University; IIT/IIM (many entrants come from here too) |
| Commerce, Finance & Management | Shri Ram College of Commerce (SRCC); Hindu & Hansraj College, Delhi; St Xavier's Mumbai/Kolkata; Narsee Monjee (NMIMS); Christ University Bengaluru; Symbiosis Pune; IIM Indore/Rohtak (IPM) |
| Design | NID Ahmedabad; IIT Bombay IDC; NIFT Delhi; Srishti Manipal Bengaluru; MIT Institute of Design Pune; Pearl Academy |
| Engineering & Technology | IIT Bombay / Delhi / Madras / Kanpur; BITS Pilani; NIT Trichy / Surathkal / Warangal; IIIT Hyderabad; DTU & NSUT Delhi; VIT Vellore; Manipal Institute of Technology |
| Hospitality, Tourism & Lifestyle | IHM Pusa (Delhi); IHM Mumbai; WGSHA Manipal; Oberoi Centre of Learning; Christ University Bengaluru; Amity School of Hospitality |
| Humanities & Social Sciences | St Stephen's & LSR, Delhi; Presidency Kolkata; JNU; Ashoka University; TISS Mumbai; Christ University Bengaluru; Jadavpur University |
| Law | NLSIU Bengaluru; NALSAR Hyderabad; NLU Delhi; WBNUJS Kolkata; NLU Jodhpur; Jindal Global Law School; Faculty of Law, Delhi University (3-year LLB) |
| Media, Film & Communication | IIMC New Delhi; Symbiosis Institute of Media & Communication; Xavier's Mumbai (XIC); ACJ Chennai; FTII Pune; Jamia Millia Islamia (AJK MCRC) |
| Medicine & Health Sciences | AIIMS New Delhi; CMC Vellore; AFMC Pune; Maulana Azad Medical College; JIPMER Puducherry; KGMU Lucknow; Grant Medical College Mumbai |
| Pure & Applied Sciences | IISc Bengaluru; IISER Pune / Kolkata / Mohali; NISER Bhubaneswar; ISI Kolkata; St Stephen's & Hindu College, Delhi; Chennai Mathematical Institute; Fergusson College Pune |
| Software & Data | IIT Bombay / Delhi / Madras; IIIT Hyderabad; BITS Pilani; NIT Trichy / Surathkal; DTU & NSUT Delhi; Chennai Mathematical Institute (for the maths-heavy route) |

### Career-specific college lists

| Career | Institutions |
|--------|-------------|
| Aerospace Engineer | IIT Bombay / Madras / Kanpur (Aerospace); IIST Thiruvananthapuram; MIT Manipal; Amity Institute of Aerospace |
| Agribusiness Manager | IIM Ahmedabad (Food & Agribusiness); IRMA Anand; IARI New Delhi; Symbiosis Institute of International Business |
| Architect | School of Planning & Architecture, Delhi; CEPT Ahmedabad; IIT Roorkee (Architecture); Sir JJ College of Architecture Mumbai; Manipal School of Architecture |
| Chartered Accountant (CA) | ICAI (the qualification itself); SRCC / Hindu, Delhi (for the parallel B.Com); St Xavier's Mumbai / Kolkata; Christ University Bengaluru |
| Economist | Delhi School of Economics; ISI Kolkata; Madras School of Economics; Ashoka University; JNU; IGIDR Mumbai |
| Filmmaker / Director | FTII Pune; SRFTI Kolkata; Whistling Woods Mumbai; Jamia (AJK MCRC); NID Ahmedabad |
| Human Resources Manager | XLRI Jamshedpur (HR); TISS Mumbai; Symbiosis (SCMHRD); Christ University |
| Investment Banker | SRCC Delhi; St Xavier's Mumbai; NMIMS Mumbai; IIM Indore/Rohtak (IPM); Ashoka University |
| Management Consultant | IIM Indore/Rohtak (IPM); SRCC Delhi; NMIMS Mumbai; St Xavier's Mumbai; Ashoka University |
| Mathematician | Chennai Mathematical Institute; ISI Kolkata / Bengaluru; IISc Bengaluru; IIT Kanpur / Bombay; St Stephen's Delhi |
| Psychologist / Counsellor | NIMHANS Bengaluru; TISS Mumbai; Christ University; Delhi University; Ambedkar University Delhi |
| Public Health Specialist | AIIMS New Delhi; PHFI (Indian Institutes of Public Health); TISS Mumbai; JIPMER |
| Public Policy Analyst | TISS Mumbai; Ashoka University (Kautilya); NLSIU Bengaluru; JNU; IIM Bangalore (Public Policy) |
| Quantitative Analyst | ISI Kolkata; Chennai Mathematical Institute; IIT Bombay / Delhi / Kanpur; IISc Bengaluru |
| Social Worker / Development Professional | TISS Mumbai; Delhi School of Social Work; Christ University; Azim Premji University |
| Wildlife Biologist / Conservationist | Wildlife Institute of India, Dehradun; NCBS Bengaluru; FRI Dehradun; Ashoka Trust for Research in Ecology (ATREE) |
