import json

with open('scripts/extracted_questions.json') as f:
    DATA = json.load(f)

AGE_KEYS = ['Class 6-8','Class 9-10','Class 11-12','Graduate 18-21','Early Career 21-25','Professionals 25-55']

# journey_code, journey_name, age_group  (positional match with AGE_KEYS)
JOURNEYS = [
  ('career_discovery',      'Career Discovery',        'Class 6-8'),
  ('stream_selection',      'Stream Selection',        'Class 9-10'),
  ('career_planning',       'Career Planning',         'Class 11-12'),
  ('graduate_readiness',    'Graduate Readiness',      'Graduate 18-21'),
  ('career_growth',         'Career Growth',           'Early Career 21-25'),
  ('leadership_excellence', 'Leadership Excellence',   'Professionals 25-55'),
]

# (journey_code, param_name, weight_pct, question_count, pool_key_or_None)
BLUEPRINTS = {
 'career_discovery': [
   ('Personality',15,18,'Personality'), ('Career Interests',20,24,'CareerInterest'),
   ('Aptitude / Cognitive Ability',20,24,'Aptitude'), ('Learning Style',10,12,'LearningStyle'),
   ('Multiple Intelligences',10,12,'MultipleIntelligences'),
   ('Academic Strengths & Weaknesses',10,12,'AcademicStrengths'),
   ('Subject Preference Mapping',5,6,None), ('Creativity & Innovation',5,6,None),
   ('Self-Esteem & Self-Concept',5,6,None),
 ],
 'stream_selection': [
   ('Personality',15,18,'Personality'), ('Career Interests',18,22,'CareerInterest'),
   ('Aptitude / Cognitive Ability',18,22,'Aptitude'), ('Subject Preference Mapping',10,12,None),
   ('Critical Thinking',8,10,None), ('Problem-Solving Ability',8,10,None),
   ('Emotional Intelligence',5,6,'EmotionalIntelligence'), ('Values / Motivators',5,6,'Motivators'),
   ('Goal Orientation',5,6,None), ('Decision-Making Style',3,4,None),
   ('Time Management',3,4,None), ('Creativity & Innovation',2,2,None),
 ],
 'career_planning': [
   ('Personality',15,18,'Personality'), ('Career Interests',20,24,'CareerInterest'),
   ('Aptitude / Cognitive Ability',20,24,'Aptitude'), ('Emotional Intelligence',10,12,'EmotionalIntelligence'),
   ('Values / Motivators',10,12,'Motivators'), ('Critical Thinking',10,12,None),
   ('Problem-Solving Ability',5,6,None), ('Career Readiness',5,6,None),
   ('Leadership Potential',3,3,None), ('Communication Style',2,3,None),
 ],
 'graduate_readiness': [
   ('Personality',12,14,'Personality'), ('Career Interests',10,12,'CareerInterest'),
   ('Aptitude / Cognitive Ability',12,14,'Aptitude'), ('Employability Skills',15,18,None),
   ('Career Readiness',10,12,None), ('Career Adaptability',8,10,None),
   ('Emotional Intelligence',8,10,'EmotionalIntelligence'), ('Decision-Making Style',8,10,None),
   ('Critical Thinking',7,8,None), ('Problem-Solving Ability',5,6,None),
   ('Leadership Potential',3,3,None), ('Teamwork & Collaboration',2,3,None),
 ],
 'career_growth': [
   ('Emotional Intelligence',15,18,'EmotionalIntelligence'), ('Leadership Potential',15,18,None),
   ('Personality',10,12,'Personality'), ('Employability Skills',10,12,None),
   ('Work Values',10,12,'Motivators'), ('Communication Style',8,10,None),
   ('Teamwork & Collaboration',8,10,None), ('Career Adaptability',8,10,None),
   ('Resilience / Grit',6,7,None), ('Stress Management',4,5,None),
   ('Conflict Management',3,3,None), ('Entrepreneurial Orientation',3,3,None),
 ],
 'leadership_excellence': [
   ('Leadership Competencies',20,24,None), ('Emotional Intelligence',15,18,'EmotionalIntelligence'),
   ('Leadership Style',10,12,None), ('Personality',10,12,'Personality'),
   ('Work Values',10,12,'Motivators'), ('Conflict Management',8,10,None),
   ('Coaching Readiness',7,8,None), ('Work Engagement',5,6,None),
   ('Burnout Risk',5,6,None), ('Career Satisfaction',4,5,None),
   ('Emotional Resilience',3,3,None), ('Life Role Balance',3,4,None),
 ],
}

def esc(s):
    if s is None: return 'NULL'
    return "'" + str(s).replace("'", "''") + "'"

def esc_jsonb(opts):
    if opts is None: return 'NULL'
    return "'" + json.dumps(opts, ensure_ascii=False).replace("'", "''") + "'::jsonb"

out = []
out.append("-- Auto-generated from OneGrasp's real uploaded question banks.")
out.append("-- Run after 0001_init.sql. Idempotent-ish via ON CONFLICT on natural keys;")
out.append("-- re-running will not duplicate journeys/parameters/sub_traits, but WILL")
out.append("-- append duplicate questions if run twice — truncate `questions` first if reseeding.\n")

out.append("begin;\n")

# 1. journeys
out.append("-- ================= JOURNEYS =================")
for code, name, age in JOURNEYS:
    out.append(
      f"insert into journeys (code, name, age_group, total_questions) "
      f"values ({esc(code)}, {esc(name)}, {esc(age)}, 120) "
      f"on conflict (code) do nothing;"
    )
out.append("")

# 2. blueprint_parameters
out.append("-- ================= BLUEPRINT PARAMETERS =================")
for jcode, params in BLUEPRINTS.items():
    for i, (name, weight, qcount, poolkey) in enumerate(params):
        out.append(
          f"insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) "
          f"select id, {esc(name)}, {weight}, {qcount}, {i} from journeys where code = {esc(jcode)} "
          f"on conflict (journey_id, name) do nothing;"
        )
out.append("")

# 3 + 4. sub_traits + questions, driven by the real extracted pools
out.append("-- ================= SUB-TRAITS + QUESTIONS (real data) =================")
age_to_journey = {age: code for code, params in [] for age in []}  # placeholder
age_to_journey = {age: code for (code, name, age) in JOURNEYS}

n_questions = 0
for pool_key, ages in DATA.items():
    for age_key, subtraits in ages.items():
        jcode = age_to_journey.get(age_key)
        if not jcode: continue
        param_names = [p[0] for p in BLUEPRINTS[jcode] if p[3] == pool_key]
        if not param_names: continue
        param_name = param_names[0]
        for subtrait_name, questions in subtraits.items():
            if not questions: continue
            rows = []
            for q in questions:
                qtype = q['type']
                opts = esc_jsonb(q['options']) if q.get('options') else 'NULL'
                answer = esc(q['answer']) if q.get('answer') else 'NULL'
                rows.append(f"({esc(q['text'])}, {esc(qtype)}, {opts}, {answer})")
                n_questions += 1
            values_clause = ",\n  ".join(rows)
            # Single statement: upsert the sub_trait and RETURN its id directly
            # (on conflict do UPDATE, not "do nothing" — plain "do nothing"
            # returns zero rows on conflict, which would silently drop the
            # entire question batch below on any re-run or name collision
            # across journeys that happen to share a sub-trait label).
            out.append(f"""with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, {esc(subtrait_name)}
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = {esc(jcode)} and bp.name = {esc(param_name)}
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  {values_clause}
) as v(question_text, question_type, options, correct_answer);
""")

out.append("commit;")
out.append(f"-- Total questions seeded: {n_questions}")

with open('supabase/seed/seed.sql', 'w') as f:
    f.write("\n".join(out))

print("questions:", n_questions)
print("file size:", __import__('os').path.getsize('supabase/seed/seed.sql'))
