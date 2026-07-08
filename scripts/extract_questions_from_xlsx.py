import openpyxl, re, json, os

SRC = '/mnt/user-data/uploads'  # path to Mahiiii's original xlsx uploads
AGE_KEYS = ['Class 6-8','Class 9-10','Class 11-12','Graduate 18-21','Early Career 21-25','Professionals 25-55']

def rows_of(fname, sheet):
    wb = openpyxl.load_workbook(os.path.join(SRC,fname), data_only=True)
    return list(wb[sheet].iter_rows(values_only=True))

def is_meta(s):
    return isinstance(s,str) and s.strip().startswith(('Category:','Group:','Method:','Instrument:','Class:'))

def parse_sectioned(rows):
    """Trait-sectioned sheets: section header row (col1 empty, optional '(N)'),
    then a 'Question' header row, then data rows (2-col Likert or 6-col MCQ).
    Falls back to a content heuristic (short label ending in '(N)', not a
    question) for the one sheet where the header/data columns are offset by
    one row (Personality '25-55')."""
    n = len(rows)
    out = {}
    current = None
    i = 0
    while i < n:
        row = rows[i]
        c0 = row[0] if len(row)>0 else None
        if c0 is None or (isinstance(c0,str) and not c0.strip()):
            i += 1; continue
        if is_meta(c0):
            i += 1; continue
        s = c0.strip() if isinstance(c0,str) else c0
        if s == 'Question':
            i += 1; continue
        c1 = row[1] if len(row)>1 else None
        m = re.search(r'\((\d+)\)\s*$', s) if isinstance(s,str) else None
        looks_header = (c1 is None or c1=='') or (m and len(s) < 90 and not s.rstrip().endswith('?'))
        if looks_header:
            current = re.sub(r'\s*\(\d+\)\s*$','', s)
            out.setdefault(current, [])
            i += 1; continue
        # data row
        if current is None:
            i += 1; continue
        if len(row) >= 6 and row[1] is not None and row[4] is not None:
            # MCQ: Question, A, B, C, D, Correct
            out[current].append({"text": row[0], "type":"mcq", "options":[row[1],row[2],row[3],row[4]], "answer": row[5]})
        else:
            # Likert / scale row: col0 = question text, col1 = scale label (ignore label)
            out[current].append({"text": row[0], "type":"likert5", "options": None, "answer": None})
        i += 1
    return out

def parse_riasec(rows):
    """CareerInterest style: header line (no count) followed by 'Question' marker, then Yes/No rows."""
    n = len(rows)
    out = {}
    current = None
    for idx in range(n):
        row = rows[idx]
        c0 = row[0] if len(row)>0 else None
        if c0 is None or (isinstance(c0,str) and not c0.strip()):
            continue
        s = c0.strip() if isinstance(c0,str) else c0
        if is_meta(s): continue
        if s == 'Question': continue
        nxt = idx+1
        while nxt < n and (rows[nxt][0] is None or rows[nxt][0]==''):
            nxt += 1
        is_header = nxt < n and isinstance(rows[nxt][0],str) and rows[nxt][0].strip()=='Question'
        if is_header:
            # clean trait code label e.g. "R — Realistic (...)" -> "R - Realistic"
            m = re.match(r'^([A-Z])\s*[—-]\s*([A-Za-z]+)', s)
            current = f"{m.group(1)}-{m.group(2)}" if m else s
            out.setdefault(current, [])
            continue
        if current:
            out[current].append({"text": row[0], "type":"yes_no", "options": None, "answer": None})
    return out

def parse_flat(rows, group_col, skill_col, q_col, opt_cols, answer_col, fixed_group=None):
    """Flat table (one header row): each row explicitly tagged with group/skill columns."""
    out = {}  # {(group): {skill: [q,...]}}
    header = rows[0]
    for row in rows[1:]:
        if row[0] is None: continue
        group = fixed_group if fixed_group else row[group_col]
        skill = row[skill_col]
        opts = [row[c] for c in opt_cols]
        q = {"text": row[q_col], "type":"mcq", "options": opts, "answer": row[answer_col]}
        out.setdefault(group, {}).setdefault(skill, []).append(q)
    return out

DATA = {k: {age: {} for age in AGE_KEYS} for k in
        ['Personality','CareerInterest','Aptitude','LearningStyle','MultipleIntelligences',
         'AcademicStrengths','EmotionalIntelligence','Motivators']}

# ---- Personality ----
pmap = {'Personality_Class6-8':'Class 6-8','class 9-10':'Class 9-10','11-12':'Class 11-12',
        'Graduates 18-21':'Graduate 18-21','Early careers 21-25':'Early Career 21-25','25-55':'Professionals 25-55'}
for sheet, age in pmap.items():
    DATA['Personality'][age] = parse_sectioned(rows_of('Personality.xlsx', sheet))

# ---- Career Interest ----
for age in AGE_KEYS:
    DATA['CareerInterest'][age] = parse_riasec(rows_of('CareerInterest_All_Groups.xlsx', age))

# ---- Aptitude ----
DATA['Aptitude']['Class 6-8'] = parse_sectioned(rows_of('Aptitude_Cognitive_Class6-8_200Q.xlsx','Class 6-8'))
DATA['Aptitude']['Class 9-10'] = parse_sectioned(rows_of('Aptitude_Cognitive_Class9-10_200Q.xlsx','Class 9-10'))
DATA['Aptitude']['Class 11-12'] = parse_sectioned(rows_of('Aptitude_Cognitive_Class11-12_200Q__1_.xlsx','Class 11-12'))
DATA['Aptitude']['Graduate 18-21'] = parse_sectioned(rows_of('Aptitude_Cognitive_All_Groups.xlsx','Graduate 18-21'))
# EarlyCareer: one sheet per subtrait
ec_wb_sheets = ['Numerical Reasoning','Verbal Reasoning','Abstract - Inductive Reasoning','Spatial - Mechanical Reasoning','Checking - Clerical Speed & Acc']
ec_out = {}
for sh in ec_wb_sheets:
    rws = rows_of('EarlyCareer_Aptitude_QuestionBank.xlsx', sh)
    qs = []
    for row in rws[1:]:
        if row[0] is None: continue
        qs.append({"text": row[1], "type":"mcq", "options":[row[2],row[3],row[4],row[5]], "answer": row[6]})
    ec_out[sh] = qs
DATA['Aptitude']['Early Career 21-25'] = ec_out
# Professionals SHL
shl_rows = rows_of('Professionals_SHL_Promotion_QuestionBank_200.xlsx','SHL Promotion QBank')
DATA['Aptitude']['Professionals 25-55'] = parse_flat(shl_rows, group_col=None, skill_col=1, q_col=2, opt_cols=[3,4,5,6], answer_col=7, fixed_group='Professionals 25-55')['Professionals 25-55']

# ---- Learning Style ----
for age in AGE_KEYS:
    DATA['LearningStyle'][age] = parse_sectioned(rows_of('LearningStyles_All_Groups.xlsx', age))

# ---- Multiple Intelligences ----
for age in AGE_KEYS:
    DATA['MultipleIntelligences'][age] = parse_sectioned(rows_of('Multiple_Intelligences_All_Groups.xlsx', age))

# ---- Emotional Intelligence ----
for age in AGE_KEYS:
    DATA['EmotionalIntelligence'][age] = parse_sectioned(rows_of('Emotional_Intelligence_All_Groups.xlsx', age))

# ---- Motivators ----
for age in AGE_KEYS:
    DATA['Motivators'][age] = parse_sectioned(rows_of('Motivators_All_Groups.xlsx', age))

# ---- Academic Strengths & Weaknesses ----
sw_rows = rows_of('Strengths_Weaknesses_All_Groups.xlsx','Academic QBank')
flat = parse_flat(sw_rows, group_col=1, skill_col=2, q_col=3, opt_cols=[4,5,6,7], answer_col=8)
for age in AGE_KEYS:
    DATA['AcademicStrengths'][age] = flat.get(age, {})

# ---- sanity totals ----
for param, ages in DATA.items():
    for age, subs in ages.items():
        total = sum(len(v) for v in subs.values())
        print(f"{param:24s} {age:22s} subtraits={len(subs):2d} total_q={total}")

with open('/home/claude/extract/full_data.json','w') as f:
    json.dump(DATA, f, ensure_ascii=False)
print("saved, size=", os.path.getsize('/home/claude/extract/full_data.json'))
