# Convert "class 9 to 10.xlsx" -> balanced sets for 6 parameters, wired to the
# scoring engine. Career clusters + EI option-quality are INFERRED (flagged).
import openpyxl, json, random, re, sys, os
random.seed(910)

XLSX = r"c:/Users/WELCOME/Downloads/onegrasp-assessment-engine/class 9 to 10.xlsx"
BANK = r"c:/Users/WELCOME/Downloads/onegrasp-assessment-engine/project/data/assessment-questions.json"

wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
def sheet_rows(name):
    ws = wb[name]
    out=[]
    for r in ws.iter_rows(min_row=2, values_only=True):
        if r[0] is None: continue
        try: int(r[0])
        except: continue
        out.append([ (c.strip() if isinstance(c,str) else c) for c in r ])
    return out

def clean(s):
    if not isinstance(s,str): return s
    return (s.replace("’","'").replace("‘","'").replace("�","-")
             .replace("“",'"').replace("”",'"').replace("  "," ").strip())

def make_sets(items, nsets):
    """Chunk the (already interleaved) items sequentially so each set keeps the
    balanced spread. Sequential — NOT round-robin — to avoid stride aligning with
    the group count (which would put one whole sub-trait in each set)."""
    per = -(-len(items)//nsets)  # ceil
    sets=[items[i*per:(i+1)*per] for i in range(nsets)]
    return {f"Set {i+1}": s for i,s in enumerate(sets) if s}

def interleave_by(items, keyfn):
    """Group by key, then interleave so any prefix covers all groups evenly."""
    groups={}
    for it in items: groups.setdefault(keyfn(it),[]).append(it)
    for g in groups.values(): random.shuffle(g)
    order=sorted(groups, key=lambda k:-len(groups[k]))
    out=[]; idx={k:0 for k in groups}
    while len(out)<len(items):
        for k in order:
            if idx[k]<len(groups[k]): out.append(groups[k][idx[k]]); idx[k]+=1
    return out

def shuffle_aligned(opts, *arrs):
    idx=list(range(len(opts))); random.shuffle(idx)
    return [opts[i] for i in idx], *([a[i] for i in idx] for a in arrs)

flags={"career_fallback":0, "career_total":0, "ei_scored":0}

# ---------------- PERSONALITY ----------------
def build_personality():
    rows=sheet_rows("Personality 9-10")
    qs=[]
    for r in rows:
        trait_raw=clean(r[1]) or ""
        reverse = "reverse" in trait_raw.lower()
        trait = re.sub(r"\s*\(reverse\)","",trait_raw,flags=re.I).strip()
        sit=clean(r[2]); opts=[clean(r[3]),clean(r[4]),clean(r[5]),clean(r[6])]
        opts=[o for o in opts if o]
        if not sit or len(opts)<2: continue
        pts=[3,2,1,0][:len(opts)]
        if reverse: pts=list(reversed(pts))
        o,p = shuffle_aligned(opts, pts)
        qs.append({"type":"choice4","trait":trait,"reverse":reverse,"text":sit,"options":o,"points":p})
    qs=interleave_by(qs, lambda q:q["trait"])
    for i,q in enumerate(qs): q["q"]=f"Q{i+1}"
    return make_sets(qs, 5)

# ---------------- LEARNING STYLES (VARK by column) ----------------
def build_learning():
    rows=sheet_rows("Learning styles 9-10")
    styles_order=["Visual","Auditory","Reading & Writing","Kinesthetic"]
    qs=[]
    for r in rows:
        sit=clean(r[2]); opts=[clean(r[3]),clean(r[4]),clean(r[5]),clean(r[6])]
        if not sit or any(o is None for o in opts): continue
        o,st = shuffle_aligned(opts, list(styles_order))
        qs.append({"type":"vark","text":sit,"options":o,"styles":st})
    for i,q in enumerate(qs): q["q"]=f"Q{i+1}"
    return make_sets(qs, 5)

# ---------------- MOTIVATORS (domain by column, single-select) ----------------
def build_motivators():
    rows=sheet_rows("motivators 9-10")
    doms=["ST","RB","IN","EX"]  # A Strategic, B Relationship, C Influencing, D Executing
    qs=[]
    for r in rows:
        sit=clean(r[1]); opts=[clean(r[2]),clean(r[3]),clean(r[4]),clean(r[5])]
        if not sit or any(o is None for o in opts): continue
        o,dm = shuffle_aligned(opts, list(doms))
        qs.append({"type":"choice4","text":sit,"options":o,"domains":dm})
    for i,q in enumerate(qs): q["q"]=f"Q{i+1}"
    return make_sets(qs, 5)

# ---------------- MULTIPLE INTELLIGENCE (statements -> Likert) ----------------
MI_NAME={"linguistic":"Linguistic (Words & Language)","logical-mathematical":"Logical–Mathematical",
 "logicalmathematical":"Logical–Mathematical","visual-spatial":"Visual–Spatial","visualspatial":"Visual–Spatial",
 "bodily-kinesthetic":"Bodily–Kinesthetic","bodilykinesthetic":"Bodily–Kinesthetic","musical":"Musical",
 "naturalistic":"Naturalistic (Nature)","interpersonal":"Interpersonal (People)","intrapersonal":"Intrapersonal (Self)"}
LIKERT=["Strongly disagree","Disagree","Neutral","Agree","Strongly agree"]
def build_mi():
    rows=sheet_rows("Multiple Intelligence 9 - 10")
    qs=[]
    for r in rows:
        intel_raw=clean(r[1]) or ""; stmt=clean(r[2])
        key=re.sub(r"[^a-z\-]","",intel_raw.lower())
        name=MI_NAME.get(key) or MI_NAME.get(key.replace("-",""))
        if not stmt or not name: continue
        qs.append({"type":"choice5","intelligence":name,"text":stmt,"options":list(LIKERT)})
    qs=interleave_by(qs, lambda q:q["intelligence"])
    for i,q in enumerate(qs): q["q"]=f"Q{i+1}"
    return make_sets(qs, 6)

# ---------------- CAREER INTEREST (infer cluster per option) ----------------
# weighted keywords per cluster; we score ALL clusters and take the max.
CLUSTER_KW={
 "A":["engineer","construct","machine","mechanical","technical draw","workshop","architect","bridge","factory","how things work","how it works","repair","replace","fix ","build a gadget","build things","building things","build or create","tools","mechanic"],
 "C":["doctor","nurse","health","medicine","medical","physio","hospital","patient","dentist","first aid","human body","blood donation","injur","anatomy","biology or health","check if everyone is safe","everyone is safe","wellbeing"],
 "B":["coding","code ","computer","app","software","game","programming","website","cyber","developer","gadget","hackathon","artificial intelligence"," ai ","ai.","digital","technolog","robot","data","new technology","useful technology"],
 "G":["science","experiment","research","environment","nature","physics","chemistry","agricultur","lab ","plants","animals","biolog","discover","scientific","space","what happened","real cause","why it happened","understand why","find out","find the real","how things work","observe","curious","space or nature"],
 "D":["art","music","video","design","creative","story","draw","paint","fashion","content","film","animation","photo","acting","sing","comic","original","cheer them up","cheer up","new idea","imagine","express","aesthetic"],
 "E":["business","entrepreneur","market","sell","sales","money","finance","manage","startup","profit","trade","invest","company","lead and present","present ideas","organize the team","organize everyone","organize a","plan the","campaign","pitch","successful company","leading a team","lead a team","take charge","in charge"],
 "F":["help","teach","counsel","social","people","law","policy","community","volunteer","serve","support everyone","support them","care for","difference in society","stay with them","make a difference","talk to them","listen to","comfort","guide others"],
 "H":["sport","travel","trip","hotel","event","food","cook","chef","fitness","adventure","play ","tour","culinary","athlet","festival","cultural fest","annual fest","outdoor","host","celebrat"],
}
_PRIO="CBAGDEFH"  # tie-break priority (health/tech/eng/science first)
def classify_cluster(text):
    t=" "+text.lower()+" "
    scores={L:sum(1 for kw in kws if kw in t) for L,kws in CLUSTER_KW.items()}
    best=max(scores.values())
    if best==0: return "",True   # no confident match -> option does not vote
    cands=[L for L in _PRIO if scores.get(L,0)==best]
    return cands[0],False
def build_career():
    rows=sheet_rows("Career interest 9-10")
    qs=[]
    for r in rows:
        sit=clean(r[1]); opts=[clean(r[i]) for i in range(2,7)]
        opts=[o for o in opts if o]
        if not sit or len(opts)<3: continue
        clusters=[]
        for o in opts:
            letter,fb=classify_cluster(o); clusters.append(letter)
            flags["career_total"]+=1; flags["career_fallback"]+= 1 if fb else 0
        o2,cl = shuffle_aligned(opts, clusters)
        qs.append({"type":"choice5" if len(o2)>=5 else "choice4","text":sit,"options":o2,"clusters":cl})
    for i,q in enumerate(qs): q["q"]=f"Q{i+1}"
    return make_sets(qs, 10)

# ---------------- EMOTIONAL INTELLIGENCE (infer option quality 0-3) ----------------
EI_POS=["realis","understand","calm","talk to","ask for help","think about","empath","listen","plan","apolog",
 "reflect","stay positive","communicat","support","acknowledg","take responsibility","learn from","politely",
 "stay focused","breathe","seek help","help them","encourag","fix","review my mistake","own up"]
EI_NEG=["ignore","blame","snap","panic","give up","avoid","hide","quit","lash","gossip","revenge","not my problem",
 "get angry","shout","yell","assume","freeze","worry that","overthink","react without","copy","cheat","laugh at","make fun"]
def ei_score(text):
    t=text.lower()
    if any(k in t for k in EI_POS):
        # strong positive if two markers
        return 3 if sum(k in t for k in EI_POS)>=2 else 3
    if any(k in t for k in EI_NEG): return 0
    return 1  # neutral
def build_ei():
    rows=sheet_rows("Multiple intelligence 9-10")  # mislabeled tab = EI
    qs=[]
    for r in rows:
        dom=clean(r[1]); sit=clean(r[2]); opts=[clean(r[3]),clean(r[4]),clean(r[5]),clean(r[6])]
        opts=[o for o in opts if o]
        if not sit or len(opts)<3: continue
        scores=[ei_score(o) for o in opts]
        if max(scores)==0: scores=[1]+scores[1:]  # ensure a best exists
        o,sc = shuffle_aligned(opts, scores)
        flags["ei_scored"]+=1
        qs.append({"type":"choice4","domain":dom,"text":sit,"options":o,"scores":sc})
    qs=interleave_by(qs, lambda q:q["domain"])
    for i,q in enumerate(qs): q["q"]=f"Q{i+1}"
    return make_sets(qs, 5)

built={
 "personality":build_personality(),
 "career_interest":build_career(),
 "multiple_intelligence":build_mi(),
 "emotional_intelligence":build_ei(),
 "learning_styles":build_learning(),
 "motivators":build_motivators(),
}

# ---- write into the bank ----
bank=json.load(open(BANK,encoding="utf-8"))
for cat,sets in built.items():
    bank[cat]["9-10"]=sets
json.dump(bank, open(BANK,"w",encoding="utf-8"), ensure_ascii=False, indent=1)

# ---- report ----
for cat,sets in built.items():
    n=sum(len(v) for v in sets.values())
    print(f"{cat:24s} sets={len(sets)} total_q={n} per_set={[len(v) for v in sets.values()]}")
print(f"\ncareer cluster fallbacks: {flags['career_fallback']}/{flags['career_total']}")
print("EI questions scored:", flags["ei_scored"])
