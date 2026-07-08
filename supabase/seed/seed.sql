-- Auto-generated from OneGrasp's real uploaded question banks.
-- Run after 0001_init.sql. Idempotent-ish via ON CONFLICT on natural keys;
-- re-running will not duplicate journeys/parameters/sub_traits, but WILL
-- append duplicate questions if run twice — truncate `questions` first if reseeding.

begin;

-- ================= JOURNEYS =================
insert into journeys (code, name, age_group, total_questions) values ('career_discovery', 'Career Discovery', 'Class 6-8', 120) on conflict (code) do nothing;
insert into journeys (code, name, age_group, total_questions) values ('stream_selection', 'Stream Selection', 'Class 9-10', 120) on conflict (code) do nothing;
insert into journeys (code, name, age_group, total_questions) values ('career_planning', 'Career Planning', 'Class 11-12', 120) on conflict (code) do nothing;
insert into journeys (code, name, age_group, total_questions) values ('graduate_readiness', 'Graduate Readiness', 'Graduate 18-21', 120) on conflict (code) do nothing;
insert into journeys (code, name, age_group, total_questions) values ('career_growth', 'Career Growth', 'Early Career 21-25', 120) on conflict (code) do nothing;
insert into journeys (code, name, age_group, total_questions) values ('leadership_excellence', 'Leadership Excellence', 'Professionals 25-55', 120) on conflict (code) do nothing;

-- ================= BLUEPRINT PARAMETERS =================
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Personality', 15, 18, 0 from journeys where code = 'career_discovery' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Career Interests', 20, 24, 1 from journeys where code = 'career_discovery' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Aptitude / Cognitive Ability', 20, 24, 2 from journeys where code = 'career_discovery' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Learning Style', 10, 12, 3 from journeys where code = 'career_discovery' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Multiple Intelligences', 10, 12, 4 from journeys where code = 'career_discovery' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Academic Strengths & Weaknesses', 10, 12, 5 from journeys where code = 'career_discovery' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Subject Preference Mapping', 5, 6, 6 from journeys where code = 'career_discovery' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Creativity & Innovation', 5, 6, 7 from journeys where code = 'career_discovery' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Self-Esteem & Self-Concept', 5, 6, 8 from journeys where code = 'career_discovery' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Personality', 15, 18, 0 from journeys where code = 'stream_selection' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Career Interests', 18, 22, 1 from journeys where code = 'stream_selection' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Aptitude / Cognitive Ability', 18, 22, 2 from journeys where code = 'stream_selection' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Subject Preference Mapping', 10, 12, 3 from journeys where code = 'stream_selection' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Critical Thinking', 8, 10, 4 from journeys where code = 'stream_selection' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Problem-Solving Ability', 8, 10, 5 from journeys where code = 'stream_selection' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Emotional Intelligence', 5, 6, 6 from journeys where code = 'stream_selection' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Values / Motivators', 5, 6, 7 from journeys where code = 'stream_selection' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Goal Orientation', 5, 6, 8 from journeys where code = 'stream_selection' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Decision-Making Style', 3, 4, 9 from journeys where code = 'stream_selection' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Time Management', 3, 4, 10 from journeys where code = 'stream_selection' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Creativity & Innovation', 2, 2, 11 from journeys where code = 'stream_selection' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Personality', 15, 18, 0 from journeys where code = 'career_planning' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Career Interests', 20, 24, 1 from journeys where code = 'career_planning' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Aptitude / Cognitive Ability', 20, 24, 2 from journeys where code = 'career_planning' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Emotional Intelligence', 10, 12, 3 from journeys where code = 'career_planning' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Values / Motivators', 10, 12, 4 from journeys where code = 'career_planning' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Critical Thinking', 10, 12, 5 from journeys where code = 'career_planning' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Problem-Solving Ability', 5, 6, 6 from journeys where code = 'career_planning' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Career Readiness', 5, 6, 7 from journeys where code = 'career_planning' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Leadership Potential', 3, 3, 8 from journeys where code = 'career_planning' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Communication Style', 2, 3, 9 from journeys where code = 'career_planning' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Personality', 12, 14, 0 from journeys where code = 'graduate_readiness' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Career Interests', 10, 12, 1 from journeys where code = 'graduate_readiness' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Aptitude / Cognitive Ability', 12, 14, 2 from journeys where code = 'graduate_readiness' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Employability Skills', 15, 18, 3 from journeys where code = 'graduate_readiness' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Career Readiness', 10, 12, 4 from journeys where code = 'graduate_readiness' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Career Adaptability', 8, 10, 5 from journeys where code = 'graduate_readiness' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Emotional Intelligence', 8, 10, 6 from journeys where code = 'graduate_readiness' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Decision-Making Style', 8, 10, 7 from journeys where code = 'graduate_readiness' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Critical Thinking', 7, 8, 8 from journeys where code = 'graduate_readiness' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Problem-Solving Ability', 5, 6, 9 from journeys where code = 'graduate_readiness' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Leadership Potential', 3, 3, 10 from journeys where code = 'graduate_readiness' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Teamwork & Collaboration', 2, 3, 11 from journeys where code = 'graduate_readiness' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Emotional Intelligence', 15, 18, 0 from journeys where code = 'career_growth' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Leadership Potential', 15, 18, 1 from journeys where code = 'career_growth' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Personality', 10, 12, 2 from journeys where code = 'career_growth' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Employability Skills', 10, 12, 3 from journeys where code = 'career_growth' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Work Values', 10, 12, 4 from journeys where code = 'career_growth' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Communication Style', 8, 10, 5 from journeys where code = 'career_growth' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Teamwork & Collaboration', 8, 10, 6 from journeys where code = 'career_growth' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Career Adaptability', 8, 10, 7 from journeys where code = 'career_growth' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Resilience / Grit', 6, 7, 8 from journeys where code = 'career_growth' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Stress Management', 4, 5, 9 from journeys where code = 'career_growth' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Conflict Management', 3, 3, 10 from journeys where code = 'career_growth' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Entrepreneurial Orientation', 3, 3, 11 from journeys where code = 'career_growth' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Leadership Competencies', 20, 24, 0 from journeys where code = 'leadership_excellence' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Emotional Intelligence', 15, 18, 1 from journeys where code = 'leadership_excellence' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Leadership Style', 10, 12, 2 from journeys where code = 'leadership_excellence' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Personality', 10, 12, 3 from journeys where code = 'leadership_excellence' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Work Values', 10, 12, 4 from journeys where code = 'leadership_excellence' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Conflict Management', 8, 10, 5 from journeys where code = 'leadership_excellence' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Coaching Readiness', 7, 8, 6 from journeys where code = 'leadership_excellence' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Work Engagement', 5, 6, 7 from journeys where code = 'leadership_excellence' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Burnout Risk', 5, 6, 8 from journeys where code = 'leadership_excellence' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Career Satisfaction', 4, 5, 9 from journeys where code = 'leadership_excellence' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Emotional Resilience', 3, 3, 10 from journeys where code = 'leadership_excellence' on conflict (journey_id, name) do nothing;
insert into blueprint_parameters (journey_id, name, weight_pct, question_count, sort_order) select id, 'Life Role Balance', 3, 4, 11 from journeys where code = 'leadership_excellence' on conflict (journey_id, name) do nothing;

-- ================= SUB-TRAITS + QUESTIONS (real data) =================
with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Extraversion'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Do you enjoy talking to many different people at school?', 'likert5', NULL, NULL),
  ('Do you like being the center of attention in a group?', 'likert5', NULL, NULL),
  ('Do you enjoy meeting new classmates?', 'likert5', NULL, NULL),
  ('Do you like to organize games for your friends?', 'likert5', NULL, NULL),
  ('Do you feel excited when you''re with a big group of people?', 'likert5', NULL, NULL),
  ('Do you enjoy performing in front of your class?', 'likert5', NULL, NULL),
  ('Do you make friends easily?', 'likert5', NULL, NULL),
  ('Do you like going to parties or get-togethers?', 'likert5', NULL, NULL),
  ('Do you enjoy group projects more than working alone?', 'likert5', NULL, NULL),
  ('Do you like to be the one who starts a conversation?', 'likert5', NULL, NULL),
  ('Do you enjoy speaking up in class discussions?', 'likert5', NULL, NULL),
  ('Do you like trying new activities with a group of friends?', 'likert5', NULL, NULL),
  ('Do you feel happy when you''re surrounded by lots of people?', 'likert5', NULL, NULL),
  ('Do you enjoy telling jokes or funny stories to your friends?', 'likert5', NULL, NULL),
  ('Do you like joining clubs or teams at school?', 'likert5', NULL, NULL),
  ('Do you enjoy cheering loudly at games or events?', 'likert5', NULL, NULL),
  ('Do you like inviting friends over to your house?', 'likert5', NULL, NULL),
  ('Do you enjoy being chosen as a team captain?', 'likert5', NULL, NULL),
  ('Do you like to dance or sing in front of others?', 'likert5', NULL, NULL),
  ('Do you find it easy to talk to people you''ve just met?', 'likert5', NULL, NULL),
  ('Do you enjoy outdoor games with many players?', 'likert5', NULL, NULL),
  ('Do you like sharing your ideas out loud in class?', 'likert5', NULL, NULL),
  ('Do you enjoy planning surprise parties for friends?', 'likert5', NULL, NULL),
  ('Do you like being part of a big, noisy group of friends?', 'likert5', NULL, NULL),
  ('Do you enjoy volunteering to answer questions in class?', 'likert5', NULL, NULL),
  ('Do you prefer reading a book alone rather than playing with friends?', 'likert5', NULL, NULL),
  ('Do you feel tired after spending a long time with lots of people?', 'likert5', NULL, NULL),
  ('Do you like having just one or two close friends rather than many?', 'likert5', NULL, NULL),
  ('Do you prefer working on projects by yourself?', 'likert5', NULL, NULL),
  ('Do you feel shy when you meet someone new?', 'likert5', NULL, NULL),
  ('Do you like spending your free time alone in your room?', 'likert5', NULL, NULL),
  ('Do you avoid speaking up in front of the whole class?', 'likert5', NULL, NULL),
  ('Do you prefer quiet activities like drawing or puzzles?', 'likert5', NULL, NULL),
  ('Do you feel nervous before a class presentation?', 'likert5', NULL, NULL),
  ('Do you like staying home instead of going to a crowded event?', 'likert5', NULL, NULL),
  ('Do you find it hard to start a conversation with strangers?', 'likert5', NULL, NULL),
  ('Do you prefer listening rather than talking in a group?', 'likert5', NULL, NULL),
  ('Do you like playing games that only need one or two players?', 'likert5', NULL, NULL),
  ('Do you feel more comfortable writing your thoughts than saying them aloud?', 'likert5', NULL, NULL),
  ('Do you avoid large gatherings if you can?', 'likert5', NULL, NULL),
  ('Do you like to observe a new game before joining in?', 'likert5', NULL, NULL),
  ('Do you prefer eating lunch with one friend rather than a big group?', 'likert5', NULL, NULL),
  ('Do you feel uncomfortable when everyone is looking at you?', 'likert5', NULL, NULL),
  ('Do you like quiet weekends rather than busy ones?', 'likert5', NULL, NULL),
  ('Do you take time to warm up before joining new groups?', 'likert5', NULL, NULL),
  ('Do you prefer texting or messaging over talking on the phone?', 'likert5', NULL, NULL),
  ('Do you like to think things through alone before sharing them?', 'likert5', NULL, NULL),
  ('Do you feel relieved when a group activity ends?', 'likert5', NULL, NULL),
  ('Do you prefer working in a quiet corner of the classroom?', 'likert5', NULL, NULL),
  ('Do you like spending recess reading rather than playing?', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Neuroticism / Emotional Stability'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Do you worry a lot about your school tests?', 'likert5', NULL, NULL),
  ('Do you feel upset easily when things don''t go your way?', 'likert5', NULL, NULL),
  ('Do you often feel nervous for no clear reason?', 'likert5', NULL, NULL),
  ('Do you find it hard to fall asleep when you''re worried?', 'likert5', NULL, NULL),
  ('Do you feel sad more often than your friends do?', 'likert5', NULL, NULL),
  ('Do you get angry quickly when someone teases you?', 'likert5', NULL, NULL),
  ('Do you feel scared before trying something new?', 'likert5', NULL, NULL),
  ('Do you often think about things that might go wrong?', 'likert5', NULL, NULL),
  ('Do you cry easily when you''re upset?', 'likert5', NULL, NULL),
  ('Do you feel nervous when your teacher calls on you suddenly?', 'likert5', NULL, NULL),
  ('Do you often feel like nobody understands you?', 'likert5', NULL, NULL),
  ('Do you get embarrassed easily in front of others?', 'likert5', NULL, NULL),
  ('Do you feel restless when you have to sit still for a long time?', 'likert5', NULL, NULL),
  ('Do you worry about what your friends think of you?', 'likert5', NULL, NULL),
  ('Do you feel overwhelmed when you have too much homework?', 'likert5', NULL, NULL),
  ('Do you often feel tired even after a full night''s sleep?', 'likert5', NULL, NULL),
  ('Do you get jealous when your friend does better than you?', 'likert5', NULL, NULL),
  ('Do you feel anxious before a school trip or event?', 'likert5', NULL, NULL),
  ('Do you find it hard to calm down after getting upset?', 'likert5', NULL, NULL),
  ('Do you often feel left out, even when you''re with friends?', 'likert5', NULL, NULL),
  ('Do you worry about making mistakes in front of others?', 'likert5', NULL, NULL),
  ('Do you feel hurt easily by jokes or teasing?', 'likert5', NULL, NULL),
  ('Do you get frustrated quickly when something is difficult?', 'likert5', NULL, NULL),
  ('Do you often imagine bad things happening before they do?', 'likert5', NULL, NULL),
  ('Do you feel nervous when plans change suddenly?', 'likert5', NULL, NULL),
  ('Do you stay calm even when things go wrong?', 'likert5', NULL, NULL),
  ('Do you find it easy to bounce back after a bad day?', 'likert5', NULL, NULL),
  ('Do you feel relaxed most of the time?', 'likert5', NULL, NULL),
  ('Do you stay calm during a test, even a hard one?', 'likert5', NULL, NULL),
  ('Do you usually feel good about yourself?', 'likert5', NULL, NULL),
  ('Do you handle criticism without getting upset?', 'likert5', NULL, NULL),
  ('Do you stay calm when your plans suddenly change?', 'likert5', NULL, NULL),
  ('Do you sleep well most nights?', 'likert5', NULL, NULL),
  ('Do you feel confident trying something new?', 'likert5', NULL, NULL),
  ('Do you stay cheerful even on a busy day?', 'likert5', NULL, NULL),
  ('Do you forgive your friends quickly after an argument?', 'likert5', NULL, NULL),
  ('Do you feel okay making small mistakes?', 'likert5', NULL, NULL),
  ('Do you stay calm when someone disagrees with you?', 'likert5', NULL, NULL),
  ('Do you handle losing a game without getting upset for long?', 'likert5', NULL, NULL),
  ('Do you feel settled and steady most days?', 'likert5', NULL, NULL),
  ('Do you stay relaxed when speaking in front of the class?', 'likert5', NULL, NULL),
  ('Do you recover quickly after feeling embarrassed?', 'likert5', NULL, NULL),
  ('Do you feel secure even when things are uncertain?', 'likert5', NULL, NULL),
  ('Do you stay patient when things take longer than expected?', 'likert5', NULL, NULL),
  ('Do you feel proud of yourself most of the time?', 'likert5', NULL, NULL),
  ('Do you stay calm when you get unexpected news?', 'likert5', NULL, NULL),
  ('Do you handle teasing without feeling hurt for long?', 'likert5', NULL, NULL),
  ('Do you feel at ease meeting your teacher for the first time?', 'likert5', NULL, NULL),
  ('Do you stay focused even when there''s noise around you?', 'likert5', NULL, NULL),
  ('Do you feel good about how you handle problems?', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Lie Scale / Social Desirability'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Have you ever told a small lie?', 'likert5', NULL, NULL),
  ('Do you always listen to your parents the first time they ask?', 'likert5', NULL, NULL),
  ('Have you ever felt jealous of a friend?', 'likert5', NULL, NULL),
  ('Do you always do your homework without being reminded?', 'likert5', NULL, NULL),
  ('Have you ever said something unkind about a friend?', 'likert5', NULL, NULL),
  ('Do you always share your things with everyone?', 'likert5', NULL, NULL),
  ('Have you ever broken a promise?', 'likert5', NULL, NULL),
  ('Do you always tell the truth, even when it''s hard?', 'likert5', NULL, NULL),
  ('Have you ever felt like not going to school?', 'likert5', NULL, NULL),
  ('Do you always finish everything on your plate?', 'likert5', NULL, NULL),
  ('Have you ever blamed someone else for your mistake?', 'likert5', NULL, NULL),
  ('Do you always keep your room perfectly tidy?', 'likert5', NULL, NULL),
  ('Have you ever felt angry at a teacher?', 'likert5', NULL, NULL),
  ('Do you always wait your turn without getting impatient?', 'likert5', NULL, NULL),
  ('Have you ever pretended to be sick to skip something?', 'likert5', NULL, NULL),
  ('Do you always follow every school rule?', 'likert5', NULL, NULL),
  ('Have you ever argued with a friend or sibling?', 'likert5', NULL, NULL),
  ('Do you always feel happy, no matter what happens?', 'likert5', NULL, NULL),
  ('Have you ever wished you could skip a class?', 'likert5', NULL, NULL),
  ('Do you never get bored, even during long lessons?', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'RIASEC – Realistic'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I like building things with blocks, Lego, or kits.', 'likert5', NULL, NULL),
  ('I enjoy fixing broken toys or gadgets.', 'likert5', NULL, NULL),
  ('I like working with tools like a hammer or screwdriver.', 'likert5', NULL, NULL),
  ('I enjoy outdoor activities like camping or hiking.', 'likert5', NULL, NULL),
  ('I like taking things apart to see how they work.', 'likert5', NULL, NULL),
  ('I enjoy playing sports that need physical strength.', 'likert5', NULL, NULL),
  ('I like gardening or growing plants.', 'likert5', NULL, NULL),
  ('I enjoy working with my hands more than reading.', 'likert5', NULL, NULL),
  ('I like making things out of wood, clay, or metal.', 'likert5', NULL, NULL),
  ('I enjoy riding bikes or skateboards.', 'likert5', NULL, NULL),
  ('I like helping repair things around the house.', 'likert5', NULL, NULL),
  ('I enjoy animal care, like feeding or training a pet.', 'likert5', NULL, NULL),
  ('I like machines and how they move.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'RIASEC – Investigative'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I like asking ''why'' and ''how'' questions about things.', 'likert5', NULL, NULL),
  ('I enjoy doing science experiments.', 'likert5', NULL, NULL),
  ('I like solving puzzles and brain teasers.', 'likert5', NULL, NULL),
  ('I enjoy reading about space, animals, or how things work.', 'likert5', NULL, NULL),
  ('I like figuring out math problems.', 'likert5', NULL, NULL),
  ('I enjoy researching topics I''m curious about.', 'likert5', NULL, NULL),
  ('I like using a microscope or magnifying glass to explore things.', 'likert5', NULL, NULL),
  ('I enjoy thinking about how the world works.', 'likert5', NULL, NULL),
  ('I like collecting facts about my favorite topics.', 'likert5', NULL, NULL),
  ('I enjoy computer or coding activities.', 'likert5', NULL, NULL),
  ('I like testing my own ideas to see if they work.', 'likert5', NULL, NULL),
  ('I enjoy watching documentaries about nature or science.', 'likert5', NULL, NULL),
  ('I like figuring out patterns in numbers or shapes.', 'likert5', NULL, NULL),
  ('I enjoy quiz competitions or trivia games.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'RIASEC – Artistic'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I like drawing or painting pictures.', 'likert5', NULL, NULL),
  ('I enjoy writing stories or poems.', 'likert5', NULL, NULL),
  ('I like singing or playing a musical instrument.', 'likert5', NULL, NULL),
  ('I enjoy acting or performing in plays.', 'likert5', NULL, NULL),
  ('I like designing my own clothes or accessories.', 'likert5', NULL, NULL),
  ('I enjoy making up new games or stories.', 'likert5', NULL, NULL),
  ('I like dancing to music.', 'likert5', NULL, NULL),
  ('I enjoy decorating my room or notebooks.', 'likert5', NULL, NULL),
  ('I like taking photos or making videos.', 'likert5', NULL, NULL),
  ('I enjoy crafting things like cards or jewelry.', 'likert5', NULL, NULL),
  ('I like imagining new worlds or characters.', 'likert5', NULL, NULL),
  ('I enjoy expressing my feelings through art.', 'likert5', NULL, NULL),
  ('I like creating things that nobody has made before.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'RIASEC – Social'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I like helping my classmates with their work.', 'likert5', NULL, NULL),
  ('I enjoy taking care of younger children.', 'likert5', NULL, NULL),
  ('I like listening to my friends when they have problems.', 'likert5', NULL, NULL),
  ('I enjoy teaching others something I know.', 'likert5', NULL, NULL),
  ('I like working in groups to help each other.', 'likert5', NULL, NULL),
  ('I enjoy volunteering for community activities.', 'likert5', NULL, NULL),
  ('I like comforting a friend who is sad.', 'likert5', NULL, NULL),
  ('I enjoy organizing fun activities for others.', 'likert5', NULL, NULL),
  ('I like making new people feel welcome.', 'likert5', NULL, NULL),
  ('I enjoy taking part in charity events.', 'likert5', NULL, NULL),
  ('I like giving advice to my friends.', 'likert5', NULL, NULL),
  ('I enjoy spending time with my grandparents or elders.', 'likert5', NULL, NULL),
  ('I like working with animals that need care.', 'likert5', NULL, NULL),
  ('I enjoy cheering up someone who is upset.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'RIASEC – Enterprising'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I like being the leader of a group project.', 'likert5', NULL, NULL),
  ('I enjoy convincing my friends to try my ideas.', 'likert5', NULL, NULL),
  ('I like planning events like school functions.', 'likert5', NULL, NULL),
  ('I enjoy selling things, like at a school fair.', 'likert5', NULL, NULL),
  ('I like setting goals and working hard to reach them.', 'likert5', NULL, NULL),
  ('I enjoy competing to win in games or contests.', 'likert5', NULL, NULL),
  ('I like organizing my friends to do an activity together.', 'likert5', NULL, NULL),
  ('I enjoy giving speeches or presentations.', 'likert5', NULL, NULL),
  ('I like coming up with new business ideas.', 'likert5', NULL, NULL),
  ('I enjoy negotiating to get a better deal.', 'likert5', NULL, NULL),
  ('I like taking charge when something needs to be done.', 'likert5', NULL, NULL),
  ('I enjoy debating about topics I care about.', 'likert5', NULL, NULL),
  ('I like being in charge of decisions in group games.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'RIASEC – Conventional'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I like organizing my books and notes neatly.', 'likert5', NULL, NULL),
  ('I enjoy following a clear set of instructions.', 'likert5', NULL, NULL),
  ('I like keeping my study schedule organized.', 'likert5', NULL, NULL),
  ('I enjoy counting or sorting things.', 'likert5', NULL, NULL),
  ('I like making lists and checking them off.', 'likert5', NULL, NULL),
  ('I enjoy keeping my desk and things tidy.', 'likert5', NULL, NULL),
  ('I like following step-by-step recipes.', 'likert5', NULL, NULL),
  ('I enjoy filling in worksheets and forms accurately.', 'likert5', NULL, NULL),
  ('I like double-checking my homework for mistakes.', 'likert5', NULL, NULL),
  ('I enjoy maintaining a diary or planner.', 'likert5', NULL, NULL),
  ('I like rules that help things run smoothly.', 'likert5', NULL, NULL),
  ('I enjoy arranging things in proper order.', 'likert5', NULL, NULL),
  ('I like keeping track of my pocket money carefully.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Conscientiousness'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I complete my homework and assignments on time.', 'likert5', NULL, NULL),
  ('I plan my study schedule in advance.', 'likert5', NULL, NULL),
  ('I keep my study materials organized.', 'likert5', NULL, NULL),
  ('I set clear goals for my exams and try to achieve them.', 'likert5', NULL, NULL),
  ('I finish tasks I start, even when they get difficult.', 'likert5', NULL, NULL),
  ('I pay close attention to detail in my work.', 'likert5', NULL, NULL),
  ('I prepare for tests well ahead of time.', 'likert5', NULL, NULL),
  ('I keep promises and commitments I make to others.', 'likert5', NULL, NULL),
  ('I follow through on my responsibilities at home and school.', 'likert5', NULL, NULL),
  ('I think carefully before making decisions.', 'likert5', NULL, NULL),
  ('I double-check my work for errors before submitting.', 'likert5', NULL, NULL),
  ('I manage my time well between studies and other activities.', 'likert5', NULL, NULL),
  ('I stay disciplined even without someone reminding me.', 'likert5', NULL, NULL),
  ('I take my duties seriously, like class responsibilities.', 'likert5', NULL, NULL),
  ('I keep my room and belongings tidy.', 'likert5', NULL, NULL),
  ('I work hard to achieve long-term goals, not just quick results.', 'likert5', NULL, NULL),
  ('I avoid procrastinating on important tasks.', 'likert5', NULL, NULL),
  ('I stick to a routine that helps me stay productive.', 'likert5', NULL, NULL),
  ('I am reliable when others depend on me.', 'likert5', NULL, NULL),
  ('I review my mistakes to improve next time.', 'likert5', NULL, NULL),
  ('I often forget to complete my homework on time.', 'likert5', NULL, NULL),
  ('I leave my study material disorganized.', 'likert5', NULL, NULL),
  ('I tend to procrastinate until the last minute.', 'likert5', NULL, NULL),
  ('I get distracted easily while studying.', 'likert5', NULL, NULL),
  ('I often lose track of my deadlines.', 'likert5', NULL, NULL),
  ('I find it hard to stick to a study plan.', 'likert5', NULL, NULL),
  ('I start tasks but don''t always finish them.', 'likert5', NULL, NULL),
  ('I am careless about small details in my work.', 'likert5', NULL, NULL),
  ('I often forget commitments I''ve made.', 'likert5', NULL, NULL),
  ('I make decisions quickly without thinking them through.', 'likert5', NULL, NULL),
  ('I rarely check my work before submitting it.', 'likert5', NULL, NULL),
  ('I struggle to balance studies with other activities.', 'likert5', NULL, NULL),
  ('I need reminders to stay on track with tasks.', 'likert5', NULL, NULL),
  ('I sometimes ignore responsibilities that feel boring.', 'likert5', NULL, NULL),
  ('I keep my things scattered rather than organized.', 'likert5', NULL, NULL),
  ('I prefer quick results over long-term effort.', 'likert5', NULL, NULL),
  ('I put off important tasks until they become urgent.', 'likert5', NULL, NULL),
  ('I find routines difficult to maintain.', 'likert5', NULL, NULL),
  ('I am sometimes unreliable when others count on me.', 'likert5', NULL, NULL),
  ('I rarely reflect on mistakes to improve.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Extraversion'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy being around large groups of people.', 'likert5', NULL, NULL),
  ('I feel energized after spending time with friends.', 'likert5', NULL, NULL),
  ('I like taking the lead in group activities.', 'likert5', NULL, NULL),
  ('I enjoy meeting new people at school events.', 'likert5', NULL, NULL),
  ('I speak up confidently in class discussions.', 'likert5', NULL, NULL),
  ('I enjoy being the center of attention sometimes.', 'likert5', NULL, NULL),
  ('I like participating in school functions and events.', 'likert5', NULL, NULL),
  ('I find it easy to start conversations with strangers.', 'likert5', NULL, NULL),
  ('I enjoy lively, high-energy environments.', 'likert5', NULL, NULL),
  ('I like expressing my opinions openly in a group.', 'likert5', NULL, NULL),
  ('I enjoy team sports or group activities.', 'likert5', NULL, NULL),
  ('I feel comfortable performing or presenting in public.', 'likert5', NULL, NULL),
  ('I like socializing during breaks rather than being alone.', 'likert5', NULL, NULL),
  ('I enjoy organizing or hosting get-togethers.', 'likert5', NULL, NULL),
  ('I feel confident introducing myself to new people.', 'likert5', NULL, NULL),
  ('I like being part of clubs or extracurricular groups.', 'likert5', NULL, NULL),
  ('I enjoy debating or discussing topics with others.', 'likert5', NULL, NULL),
  ('I feel comfortable being assertive about what I want.', 'likert5', NULL, NULL),
  ('I like working in a busy, social environment.', 'likert5', NULL, NULL),
  ('I enjoy cheering and being enthusiastic in group settings.', 'likert5', NULL, NULL),
  ('I prefer spending time alone rather than in groups.', 'likert5', NULL, NULL),
  ('I feel drained after socializing for a long time.', 'likert5', NULL, NULL),
  ('I prefer to follow rather than lead in group settings.', 'likert5', NULL, NULL),
  ('I feel nervous meeting new people.', 'likert5', NULL, NULL),
  ('I prefer listening over speaking in class.', 'likert5', NULL, NULL),
  ('I avoid being the center of attention.', 'likert5', NULL, NULL),
  ('I prefer smaller, quieter gatherings over big events.', 'likert5', NULL, NULL),
  ('I find it hard to start a conversation with someone new.', 'likert5', NULL, NULL),
  ('I prefer calm, quiet environments over busy ones.', 'likert5', NULL, NULL),
  ('I keep my opinions to myself in group settings.', 'likert5', NULL, NULL),
  ('I prefer individual activities over team sports.', 'likert5', NULL, NULL),
  ('I feel anxious about public speaking or presenting.', 'likert5', NULL, NULL),
  ('I prefer spending breaks alone or with one friend.', 'likert5', NULL, NULL),
  ('I avoid organizing or hosting events.', 'likert5', NULL, NULL),
  ('I feel shy introducing myself to new people.', 'likert5', NULL, NULL),
  ('I prefer staying out of clubs with large groups.', 'likert5', NULL, NULL),
  ('I avoid debates or confrontational discussions.', 'likert5', NULL, NULL),
  ('I find it hard to assert what I want.', 'likert5', NULL, NULL),
  ('I prefer working in a quiet, low-key environment.', 'likert5', NULL, NULL),
  ('I stay reserved rather than enthusiastic in groups.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Agreeableness'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I try to understand others'' feelings before judging them.', 'likert5', NULL, NULL),
  ('I enjoy helping classmates who are struggling.', 'likert5', NULL, NULL),
  ('I find it easy to forgive people who''ve upset me.', 'likert5', NULL, NULL),
  ('I cooperate well with others in group projects.', 'likert5', NULL, NULL),
  ('I trust people until they give me a reason not to.', 'likert5', NULL, NULL),
  ('I try to avoid conflicts with friends.', 'likert5', NULL, NULL),
  ('I am considerate of other people''s feelings.', 'likert5', NULL, NULL),
  ('I enjoy doing kind things for others without expecting anything back.', 'likert5', NULL, NULL),
  ('I listen carefully when a friend needs to talk.', 'likert5', NULL, NULL),
  ('I try to see things from another person''s point of view.', 'likert5', NULL, NULL),
  ('I am patient with people who are different from me.', 'likert5', NULL, NULL),
  ('I avoid criticizing others harshly.', 'likert5', NULL, NULL),
  ('I am willing to compromise to keep peace in a group.', 'likert5', NULL, NULL),
  ('I treat everyone with respect, regardless of background.', 'likert5', NULL, NULL),
  ('I enjoy working as part of a team rather than competing.', 'likert5', NULL, NULL),
  ('I try to comfort friends who are going through a hard time.', 'likert5', NULL, NULL),
  ('I give others the benefit of the doubt.', 'likert5', NULL, NULL),
  ('I am generous with my time and things.', 'likert5', NULL, NULL),
  ('I avoid gossiping about others.', 'likert5', NULL, NULL),
  ('I try to make new students feel included.', 'likert5', NULL, NULL),
  ('I find it hard to trust people easily.', 'likert5', NULL, NULL),
  ('I often question other people''s intentions.', 'likert5', NULL, NULL),
  ('I get irritated quickly when others disagree with me.', 'likert5', NULL, NULL),
  ('I prefer competing over cooperating in group work.', 'likert5', NULL, NULL),
  ('I find it difficult to forgive people who''ve hurt me.', 'likert5', NULL, NULL),
  ('I speak my mind even if it might hurt someone''s feelings.', 'likert5', NULL, NULL),
  ('I am skeptical of people who are overly friendly.', 'likert5', NULL, NULL),
  ('I prefer to look out for myself first.', 'likert5', NULL, NULL),
  ('I find it hard to be patient with people I disagree with.', 'likert5', NULL, NULL),
  ('I sometimes criticize others without softening it.', 'likert5', NULL, NULL),
  ('I avoid compromising when I feel strongly about something.', 'likert5', NULL, NULL),
  ('I find it hard to relate to people very different from me.', 'likert5', NULL, NULL),
  ('I keep my distance from people I don''t know well.', 'likert5', NULL, NULL),
  ('I am cautious about being too kind to strangers.', 'likert5', NULL, NULL),
  ('I prefer working alone rather than as part of a team.', 'likert5', NULL, NULL),
  ('I find it hard to comfort someone who is upset.', 'likert5', NULL, NULL),
  ('I tend to assume the worst about people''s motives.', 'likert5', NULL, NULL),
  ('I am not very generous with my time for others.', 'likert5', NULL, NULL),
  ('I sometimes get drawn into talking about others.', 'likert5', NULL, NULL),
  ('I find it hard to include people outside my friend group.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Neuroticism / Emotional Stability'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I get stressed easily before exams.', 'likert5', NULL, NULL),
  ('I often overthink small mistakes I make.', 'likert5', NULL, NULL),
  ('I feel anxious about how others perceive me.', 'likert5', NULL, NULL),
  ('I get irritated quickly when things don''t go as planned.', 'likert5', NULL, NULL),
  ('I worry about my future more than my friends seem to.', 'likert5', NULL, NULL),
  ('I find it hard to relax even during free time.', 'likert5', NULL, NULL),
  ('I feel overwhelmed when I have multiple deadlines.', 'likert5', NULL, NULL),
  ('I often feel insecure about my abilities.', 'likert5', NULL, NULL),
  ('I get upset easily by criticism from teachers or parents.', 'likert5', NULL, NULL),
  ('I have mood swings that are hard to control.', 'likert5', NULL, NULL),
  ('I feel nervous in unfamiliar social situations.', 'likert5', NULL, NULL),
  ('I dwell on negative experiences for a long time.', 'likert5', NULL, NULL),
  ('I feel pressured by comparisons with other students.', 'likert5', NULL, NULL),
  ('I get easily discouraged when I fail at something.', 'likert5', NULL, NULL),
  ('I often feel tense without a clear reason.', 'likert5', NULL, NULL),
  ('I worry about disappointing my parents or teachers.', 'likert5', NULL, NULL),
  ('I find change stressful, even small changes.', 'likert5', NULL, NULL),
  ('I often feel like things are out of my control.', 'likert5', NULL, NULL),
  ('I get defensive when someone points out my mistakes.', 'likert5', NULL, NULL),
  ('I struggle to calm down after an argument.', 'likert5', NULL, NULL),
  ('I stay calm under exam pressure.', 'likert5', NULL, NULL),
  ('I don''t dwell too long on small mistakes.', 'likert5', NULL, NULL),
  ('I feel secure about how others see me.', 'likert5', NULL, NULL),
  ('I handle unexpected changes in plans well.', 'likert5', NULL, NULL),
  ('I feel optimistic about my future.', 'likert5', NULL, NULL),
  ('I find it easy to relax during my free time.', 'likert5', NULL, NULL),
  ('I manage multiple deadlines without feeling overwhelmed.', 'likert5', NULL, NULL),
  ('I feel confident in my own abilities.', 'likert5', NULL, NULL),
  ('I take criticism from teachers or parents constructively.', 'likert5', NULL, NULL),
  ('I keep my emotions steady most of the time.', 'likert5', NULL, NULL),
  ('I feel comfortable in unfamiliar social situations.', 'likert5', NULL, NULL),
  ('I move on quickly from negative experiences.', 'likert5', NULL, NULL),
  ('I don''t compare myself too much to other students.', 'likert5', NULL, NULL),
  ('I bounce back quickly after failing at something.', 'likert5', NULL, NULL),
  ('I generally feel relaxed and at ease.', 'likert5', NULL, NULL),
  ('I don''t feel overly pressured to please my parents or teachers.', 'likert5', NULL, NULL),
  ('I adapt well to small changes in routine.', 'likert5', NULL, NULL),
  ('I feel like I''m generally in control of my life.', 'likert5', NULL, NULL),
  ('I stay open when someone points out my mistakes.', 'likert5', NULL, NULL),
  ('I calm down quickly after an argument.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Conscientiousness'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I feel capable of handling difficult academic challenges.', 'likert5', NULL, NULL),
  ('I keep my study materials and notes well organized.', 'likert5', NULL, NULL),
  ('I take my responsibilities to teachers and family seriously.', 'likert5', NULL, NULL),
  ('I push myself to achieve top results, not just pass.', 'likert5', NULL, NULL),
  ('I stay disciplined with my study plan even when bored.', 'likert5', NULL, NULL),
  ('I think carefully before committing to a decision.', 'likert5', NULL, NULL),
  ('I prepare a structured timetable for entrance exam preparation.', 'likert5', NULL, NULL),
  ('I follow through on long-term academic projects.', 'likert5', NULL, NULL),
  ('I take pride in completing tasks to a high standard.', 'likert5', NULL, NULL),
  ('I avoid distractions when I have important work to do.', 'likert5', NULL, NULL),
  ('I weigh pros and cons before making major choices, like stream/college selection.', 'likert5', NULL, NULL),
  ('I keep track of deadlines for applications and exams.', 'likert5', NULL, NULL),
  ('I hold myself accountable when I underperform.', 'likert5', NULL, NULL),
  ('I maintain consistent effort across all my subjects.', 'likert5', NULL, NULL),
  ('I plan backup options in case my first choice doesn''t work out.', 'likert5', NULL, NULL),
  ('I rarely leave important tasks until the last moment.', 'likert5', NULL, NULL),
  ('I follow rules and guidelines set by my school or exam boards.', 'likert5', NULL, NULL),
  ('I set high personal standards for my academic performance.', 'likert5', NULL, NULL),
  ('I stay committed to long-term goals despite short-term setbacks.', 'likert5', NULL, NULL),
  ('I carefully review my application forms before submitting them.', 'likert5', NULL, NULL),
  ('I doubt my ability to handle difficult academic challenges.', 'likert5', NULL, NULL),
  ('I often misplace my study materials or notes.', 'likert5', NULL, NULL),
  ('I sometimes neglect responsibilities to teachers or family.', 'likert5', NULL, NULL),
  ('I am satisfied with just passing rather than excelling.', 'likert5', NULL, NULL),
  ('I find it hard to stay disciplined when bored.', 'likert5', NULL, NULL),
  ('I make decisions quickly without fully thinking them through.', 'likert5', NULL, NULL),
  ('I don''t follow a structured timetable for exam preparation.', 'likert5', NULL, NULL),
  ('I struggle to follow through on long-term projects.', 'likert5', NULL, NULL),
  ('I am okay with average-quality work if it saves time.', 'likert5', NULL, NULL),
  ('I get distracted easily when I have important work to do.', 'likert5', NULL, NULL),
  ('I make stream/college decisions without weighing all the options.', 'likert5', NULL, NULL),
  ('I lose track of deadlines for applications and exams.', 'likert5', NULL, NULL),
  ('I rarely hold myself accountable when I underperform.', 'likert5', NULL, NULL),
  ('My effort varies a lot across different subjects.', 'likert5', NULL, NULL),
  ('I don''t plan backup options for important decisions.', 'likert5', NULL, NULL),
  ('I often leave important tasks until the last moment.', 'likert5', NULL, NULL),
  ('I sometimes overlook school or exam board guidelines.', 'likert5', NULL, NULL),
  ('I don''t hold myself to particularly high academic standards.', 'likert5', NULL, NULL),
  ('I lose commitment to long-term goals after a setback.', 'likert5', NULL, NULL),
  ('I rarely review my application forms carefully before submitting.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Extraversion'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I warm up to new classmates or teachers quickly.', 'likert5', NULL, NULL),
  ('I enjoy spending time in large social groups.', 'likert5', NULL, NULL),
  ('I assert my opinion confidently in group discussions.', 'likert5', NULL, NULL),
  ('I prefer staying active and busy over relaxing.', 'likert5', NULL, NULL),
  ('I seek out exciting or adventurous experiences.', 'likert5', NULL, NULL),
  ('I generally feel cheerful and upbeat.', 'likert5', NULL, NULL),
  ('I make friends easily in new environments, like coaching classes.', 'likert5', NULL, NULL),
  ('I enjoy being part of large school or college events.', 'likert5', NULL, NULL),
  ('I speak up when I disagree with a group decision.', 'likert5', NULL, NULL),
  ('I like juggling multiple activities (academics, sports, clubs) at once.', 'likert5', NULL, NULL),
  ('I enjoy trying thrilling or high-energy activities.', 'likert5', NULL, NULL),
  ('I express enthusiasm openly when good things happen.', 'likert5', NULL, NULL),
  ('I show genuine interest when meeting new people.', 'likert5', NULL, NULL),
  ('I prefer busy, lively settings over quiet ones.', 'likert5', NULL, NULL),
  ('I take charge confidently when a group needs direction.', 'likert5', NULL, NULL),
  ('I like to stay constantly engaged in projects or activities.', 'likert5', NULL, NULL),
  ('I enjoy competitive or high-stakes situations.', 'likert5', NULL, NULL),
  ('I find it easy to stay positive even during stressful periods.', 'likert5', NULL, NULL),
  ('I am quick to build warm relationships with mentors or seniors.', 'likert5', NULL, NULL),
  ('I enjoy social gatherings like fests, reunions, or events.', 'likert5', NULL, NULL),
  ('I take time to warm up to new classmates or teachers.', 'likert5', NULL, NULL),
  ('I prefer smaller groups over large social gatherings.', 'likert5', NULL, NULL),
  ('I find it hard to assert my opinion in group discussions.', 'likert5', NULL, NULL),
  ('I prefer relaxing over staying constantly active.', 'likert5', NULL, NULL),
  ('I avoid exciting or adventurous experiences.', 'likert5', NULL, NULL),
  ('I don''t often feel particularly cheerful or upbeat.', 'likert5', NULL, NULL),
  ('I find it hard to make friends in new environments.', 'likert5', NULL, NULL),
  ('I avoid large school or college events when possible.', 'likert5', NULL, NULL),
  ('I rarely speak up when I disagree with a group decision.', 'likert5', NULL, NULL),
  ('I prefer focusing on one activity rather than juggling many.', 'likert5', NULL, NULL),
  ('I avoid thrilling or high-energy activities.', 'likert5', NULL, NULL),
  ('I keep my excitement low-key, even about good news.', 'likert5', NULL, NULL),
  ('I find it hard to show interest when meeting new people.', 'likert5', NULL, NULL),
  ('I prefer quiet settings over busy, lively ones.', 'likert5', NULL, NULL),
  ('I avoid taking charge unless absolutely necessary.', 'likert5', NULL, NULL),
  ('I prefer not to be constantly engaged in multiple projects.', 'likert5', NULL, NULL),
  ('I avoid competitive or high-stakes situations.', 'likert5', NULL, NULL),
  ('I find it hard to stay positive during stressful periods.', 'likert5', NULL, NULL),
  ('I take time to build relationships with mentors or seniors.', 'likert5', NULL, NULL),
  ('I avoid social gatherings like fests or reunions when I can.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Agreeableness'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I generally trust my classmates and teachers.', 'likert5', NULL, NULL),
  ('I am honest and direct in how I communicate.', 'likert5', NULL, NULL),
  ('I go out of my way to help a struggling classmate.', 'likert5', NULL, NULL),
  ('I am willing to compromise to avoid unnecessary conflict.', 'likert5', NULL, NULL),
  ('I don''t feel the need to boast about my achievements.', 'likert5', NULL, NULL),
  ('I feel sympathy for people facing hardship, even strangers.', 'likert5', NULL, NULL),
  ('I give people the benefit of the doubt.', 'likert5', NULL, NULL),
  ('I avoid manipulating others to get my way.', 'likert5', NULL, NULL),
  ('I volunteer my time for causes I believe in.', 'likert5', NULL, NULL),
  ('I accept group decisions even when I''d prefer otherwise.', 'likert5', NULL, NULL),
  ('I downplay my accomplishments around others.', 'likert5', NULL, NULL),
  ('I am moved by stories of others'' suffering or struggle.', 'likert5', NULL, NULL),
  ('I assume good intentions in others'' actions.', 'likert5', NULL, NULL),
  ('I say what I mean without hidden agendas.', 'likert5', NULL, NULL),
  ('I support friends emotionally, even without being asked.', 'likert5', NULL, NULL),
  ('I follow group norms rather than insisting on my own way.', 'likert5', NULL, NULL),
  ('I let my actions speak rather than seeking praise.', 'likert5', NULL, NULL),
  ('I feel for others'' pain, even in difficult or unfamiliar situations.', 'likert5', NULL, NULL),
  ('I rarely doubt the sincerity of people close to me.', 'likert5', NULL, NULL),
  ('I am upfront about my intentions in group settings.', 'likert5', NULL, NULL),
  ('I am cautious about trusting classmates or teachers too quickly.', 'likert5', NULL, NULL),
  ('I sometimes soften the truth to avoid conflict.', 'likert5', NULL, NULL),
  ('I rarely go out of my way to help a struggling classmate.', 'likert5', NULL, NULL),
  ('I find it hard to compromise once I''ve made up my mind.', 'likert5', NULL, NULL),
  ('I enjoy sharing my achievements with others.', 'likert5', NULL, NULL),
  ('I find it hard to feel sympathy for people I don''t know.', 'likert5', NULL, NULL),
  ('I am quick to suspect others'' motives.', 'likert5', NULL, NULL),
  ('I sometimes use persuasion to get my way.', 'likert5', NULL, NULL),
  ('I rarely volunteer my time unless required.', 'likert5', NULL, NULL),
  ('I push for my own preference even when the group disagrees.', 'likert5', NULL, NULL),
  ('I am comfortable highlighting my accomplishments.', 'likert5', NULL, NULL),
  ('I am not easily moved by others'' hardship stories.', 'likert5', NULL, NULL),
  ('I question others'' intentions before accepting their actions.', 'likert5', NULL, NULL),
  ('I sometimes keep my real intentions to myself.', 'likert5', NULL, NULL),
  ('I wait to be asked before offering emotional support.', 'likert5', NULL, NULL),
  ('I prefer doing things my way over following group norms.', 'likert5', NULL, NULL),
  ('I appreciate recognition for the things I do well.', 'likert5', NULL, NULL),
  ('I find it hard to relate to others'' struggles I haven''t faced.', 'likert5', NULL, NULL),
  ('I sometimes doubt the sincerity of people close to me.', 'likert5', NULL, NULL),
  ('I keep my real intentions private in group settings.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Neuroticism / Emotional Stability'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I feel anxious about choosing the right stream or college.', 'likert5', NULL, NULL),
  ('I get irritated quickly when plans don''t go my way.', 'likert5', NULL, NULL),
  ('I feel low when I compare my results to top-performing peers.', 'likert5', NULL, NULL),
  ('I feel self-conscious when speaking in front of a large class.', 'likert5', NULL, NULL),
  ('I act impulsively when frustrated, even if I regret it later.', 'likert5', NULL, NULL),
  ('I feel overwhelmed when facing back-to-back exams.', 'likert5', NULL, NULL),
  ('I worry excessively about my entrance exam performance.', 'likert5', NULL, NULL),
  ('I get defensive when my opinions are challenged.', 'likert5', NULL, NULL),
  ('I feel discouraged easily after a poor test result.', 'likert5', NULL, NULL),
  ('I worry about being judged for my career choices.', 'likert5', NULL, NULL),
  ('I find it hard to resist reacting emotionally under stress.', 'likert5', NULL, NULL),
  ('I feel fragile when facing multiple academic pressures at once.', 'likert5', NULL, NULL),
  ('I often feel tense about uncertain outcomes, like results.', 'likert5', NULL, NULL),
  ('I get angry quickly when criticized by teachers or parents.', 'likert5', NULL, NULL),
  ('I feel persistently low when things aren''t going well.', 'likert5', NULL, NULL),
  ('I feel embarrassed easily in front of classmates.', 'likert5', NULL, NULL),
  ('I make hasty decisions when emotionally charged.', 'likert5', NULL, NULL),
  ('I struggle to cope when several stressors hit at once.', 'likert5', NULL, NULL),
  ('I feel anxious in unfamiliar academic or exam settings.', 'likert5', NULL, NULL),
  ('I hold onto frustration for a long time after conflicts.', 'likert5', NULL, NULL),
  ('I feel confident about choosing the right stream or college.', 'likert5', NULL, NULL),
  ('I stay calm when plans don''t go my way.', 'likert5', NULL, NULL),
  ('I don''t feel low when comparing my results to peers.', 'likert5', NULL, NULL),
  ('I feel comfortable speaking in front of a large class.', 'likert5', NULL, NULL),
  ('I stay composed even when frustrated.', 'likert5', NULL, NULL),
  ('I manage back-to-back exams without feeling overwhelmed.', 'likert5', NULL, NULL),
  ('I stay calm about my entrance exam performance.', 'likert5', NULL, NULL),
  ('I stay open when my opinions are challenged.', 'likert5', NULL, NULL),
  ('I bounce back quickly after a poor test result.', 'likert5', NULL, NULL),
  ('I feel secure about my career choices, regardless of others'' opinions.', 'likert5', NULL, NULL),
  ('I respond thoughtfully rather than emotionally under stress.', 'likert5', NULL, NULL),
  ('I feel resilient even when facing multiple academic pressures.', 'likert5', NULL, NULL),
  ('I stay relaxed about uncertain outcomes, like results.', 'likert5', NULL, NULL),
  ('I stay calm when criticized by teachers or parents.', 'likert5', NULL, NULL),
  ('I generally maintain a steady, positive mood.', 'likert5', NULL, NULL),
  ('I feel comfortable, not embarrassed, in front of classmates.', 'likert5', NULL, NULL),
  ('I make thoughtful decisions even when emotional.', 'likert5', NULL, NULL),
  ('I cope well when several stressors hit at once.', 'likert5', NULL, NULL),
  ('I feel at ease in unfamiliar academic or exam settings.', 'likert5', NULL, NULL),
  ('I let go of frustration quickly after conflicts.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Conscientiousness'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I manage my coursework, internships, and personal goals systematically.', 'likert5', NULL, NULL),
  ('I set measurable targets for my academic and career milestones.', 'likert5', NULL, NULL),
  ('I follow through on internship or project commitments reliably.', 'likert5', NULL, NULL),
  ('I prepare thoroughly for interviews and placement processes.', 'likert5', NULL, NULL),
  ('I prioritize tasks effectively when juggling multiple deadlines.', 'likert5', NULL, NULL),
  ('I maintain consistent quality in my academic and professional work.', 'likert5', NULL, NULL),
  ('I take ownership of mistakes and correct them proactively.', 'likert5', NULL, NULL),
  ('I plan my career steps (skills, certifications) well in advance.', 'likert5', NULL, NULL),
  ('I keep a structured resume and portfolio updated regularly.', 'likert5', NULL, NULL),
  ('I track my progress toward graduation and career requirements.', 'likert5', NULL, NULL),
  ('I follow up diligently after interviews or networking conversations.', 'likert5', NULL, NULL),
  ('I budget my time carefully between academics, internships, and personal life.', 'likert5', NULL, NULL),
  ('I complete group project responsibilities without needing reminders.', 'likert5', NULL, NULL),
  ('I research companies thoroughly before applying or interviewing.', 'likert5', NULL, NULL),
  ('I set realistic deadlines for myself and meet them consistently.', 'likert5', NULL, NULL),
  ('I double-check important documents like resumes and applications.', 'likert5', NULL, NULL),
  ('I stay committed to a skill-building plan, even when it''s tedious.', 'likert5', NULL, NULL),
  ('I take detailed notes during internships to track my learning.', 'likert5', NULL, NULL),
  ('I follow professional etiquette in emails and meetings.', 'likert5', NULL, NULL),
  ('I plan contingencies in case my first-choice job or grad school falls through.', 'likert5', NULL, NULL),
  ('I struggle to manage my coursework, internships, and personal goals together.', 'likert5', NULL, NULL),
  ('I rarely set measurable academic or career targets.', 'likert5', NULL, NULL),
  ('I sometimes don''t follow through on internship or project commitments.', 'likert5', NULL, NULL),
  ('I prepare minimally for interviews and placement processes.', 'likert5', NULL, NULL),
  ('I find it hard to prioritize tasks when juggling multiple deadlines.', 'likert5', NULL, NULL),
  ('My quality of work fluctuates between academic and professional settings.', 'likert5', NULL, NULL),
  ('I avoid taking ownership when I make mistakes.', 'likert5', NULL, NULL),
  ('I rarely plan my career steps in advance.', 'likert5', NULL, NULL),
  ('I let my resume or portfolio go outdated for long periods.', 'likert5', NULL, NULL),
  ('I lose track of my progress toward graduation requirements.', 'likert5', NULL, NULL),
  ('I rarely follow up after interviews or networking conversations.', 'likert5', NULL, NULL),
  ('I struggle to budget my time between academics and internships.', 'likert5', NULL, NULL),
  ('I need reminders to complete my share of group project work.', 'likert5', NULL, NULL),
  ('I apply to companies without researching them thoroughly.', 'likert5', NULL, NULL),
  ('I often miss self-imposed deadlines.', 'likert5', NULL, NULL),
  ('I rarely double-check important documents before submitting them.', 'likert5', NULL, NULL),
  ('I lose commitment to skill-building plans when they get tedious.', 'likert5', NULL, NULL),
  ('I don''t take detailed notes during internships.', 'likert5', NULL, NULL),
  ('I am sometimes careless about professional etiquette in emails or meetings.', 'likert5', NULL, NULL),
  ('I rarely plan contingencies for my career or grad school choices.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Extraversion'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I actively network with professionals and alumni in my field.', 'likert5', NULL, NULL),
  ('I enjoy presenting my work to faculty, panels, or recruiters.', 'likert5', NULL, NULL),
  ('I take initiative in group assignments or college committees.', 'likert5', NULL, NULL),
  ('I am comfortable reaching out to companies for internships directly.', 'likert5', NULL, NULL),
  ('I enjoy collaborative team-based academic projects.', 'likert5', NULL, NULL),
  ('I feel confident participating in case competitions or hackathons.', 'likert5', NULL, NULL),
  ('I build rapport easily with new batchmates or colleagues.', 'likert5', NULL, NULL),
  ('I enjoy representing my college or team at external events.', 'likert5', NULL, NULL),
  ('I am energized by career fairs and recruitment events.', 'likert5', NULL, NULL),
  ('I speak up confidently during interviews and group discussions.', 'likert5', NULL, NULL),
  ('I enjoy leading student clubs or organizing campus events.', 'likert5', NULL, NULL),
  ('I find it easy to start conversations with recruiters or speakers.', 'likert5', NULL, NULL),
  ('I thrive in fast-paced, collaborative work environments.', 'likert5', NULL, NULL),
  ('I enjoy mentoring junior students or new interns.', 'likert5', NULL, NULL),
  ('I am comfortable cold-emailing professionals for advice or opportunities.', 'likert5', NULL, NULL),
  ('I enjoy participating in panel discussions or group debates.', 'likert5', NULL, NULL),
  ('I like being visible and active in my college community.', 'likert5', NULL, NULL),
  ('I express enthusiasm openly during group brainstorming sessions.', 'likert5', NULL, NULL),
  ('I enjoy pitching ideas to a group or audience.', 'likert5', NULL, NULL),
  ('I feel comfortable being assertive in negotiations, like internship terms.', 'likert5', NULL, NULL),
  ('I prefer focusing on academics over networking with professionals.', 'likert5', NULL, NULL),
  ('I feel uneasy presenting my work to faculty, panels, or recruiters.', 'likert5', NULL, NULL),
  ('I prefer to follow rather than lead in group assignments.', 'likert5', NULL, NULL),
  ('I avoid reaching out to companies directly for internships.', 'likert5', NULL, NULL),
  ('I prefer working independently over collaborative team projects.', 'likert5', NULL, NULL),
  ('I feel anxious participating in case competitions or hackathons.', 'likert5', NULL, NULL),
  ('I take time to build rapport with new batchmates or colleagues.', 'likert5', NULL, NULL),
  ('I avoid representing my college or team at external events.', 'likert5', NULL, NULL),
  ('I find career fairs and recruitment events draining.', 'likert5', NULL, NULL),
  ('I feel nervous speaking up during interviews or group discussions.', 'likert5', NULL, NULL),
  ('I avoid leading student clubs or organizing campus events.', 'likert5', NULL, NULL),
  ('I find it hard to start conversations with recruiters or speakers.', 'likert5', NULL, NULL),
  ('I prefer calm, low-key work environments over fast-paced ones.', 'likert5', NULL, NULL),
  ('I avoid mentoring junior students or new interns.', 'likert5', NULL, NULL),
  ('I feel uncomfortable cold-emailing professionals for advice.', 'likert5', NULL, NULL),
  ('I avoid panel discussions or group debates when possible.', 'likert5', NULL, NULL),
  ('I prefer staying low-profile within my college community.', 'likert5', NULL, NULL),
  ('I keep my enthusiasm low-key during group brainstorming.', 'likert5', NULL, NULL),
  ('I feel nervous pitching ideas to a group or audience.', 'likert5', NULL, NULL),
  ('I find it hard to be assertive in negotiations, like internship terms.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Agreeableness'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I support team members even when our roles aren''t equally rewarded.', 'likert5', NULL, NULL),
  ('I value collaborative success over individual recognition in projects.', 'likert5', NULL, NULL),
  ('I consider diverse viewpoints before finalizing group decisions.', 'likert5', NULL, NULL),
  ('I am approachable and easy to work with in project teams.', 'likert5', NULL, NULL),
  ('I give constructive, not harsh, feedback to peers.', 'likert5', NULL, NULL),
  ('I am willing to mentor or guide juniors in my field.', 'likert5', NULL, NULL),
  ('I handle disagreements in group work calmly and fairly.', 'likert5', NULL, NULL),
  ('I am considerate of cultural or background differences in teams.', 'likert5', NULL, NULL),
  ('I help classmates prepare for interviews or exams without expecting anything back.', 'likert5', NULL, NULL),
  ('I trust my professors'' and mentors'' guidance unless proven otherwise.', 'likert5', NULL, NULL),
  ('I share useful resources or contacts with my peers freely.', 'likert5', NULL, NULL),
  ('I am patient with team members who learn or work differently from me.', 'likert5', NULL, NULL),
  ('I avoid taking credit for work that was a team effort.', 'likert5', NULL, NULL),
  ('I listen carefully when a friend is stressed about placements.', 'likert5', NULL, NULL),
  ('I try to see things from a recruiter''s or professor''s point of view too.', 'likert5', NULL, NULL),
  ('I include quieter group members in discussions and decisions.', 'likert5', NULL, NULL),
  ('I give classmates the benefit of the doubt during conflicts.', 'likert5', NULL, NULL),
  ('I am generous with my time when peers need academic help.', 'likert5', NULL, NULL),
  ('I avoid gossiping about classmates'' internship or grade outcomes.', 'likert5', NULL, NULL),
  ('I try to make new students or interns feel welcome.', 'likert5', NULL, NULL),
  ('I find it hard to support team members when roles feel unequal.', 'likert5', NULL, NULL),
  ('I prioritize individual recognition over collaborative success.', 'likert5', NULL, NULL),
  ('I sometimes dismiss viewpoints that differ from mine in group decisions.', 'likert5', NULL, NULL),
  ('I can come across as difficult to work with in project teams.', 'likert5', NULL, NULL),
  ('I am blunt when giving feedback, even if it stings.', 'likert5', NULL, NULL),
  ('I rarely mentor or guide juniors in my field.', 'likert5', NULL, NULL),
  ('I find it hard to stay calm during disagreements in group work.', 'likert5', NULL, NULL),
  ('I find it hard to relate to teammates from very different backgrounds.', 'likert5', NULL, NULL),
  ('I rarely help classmates prepare for interviews or exams.', 'likert5', NULL, NULL),
  ('I am skeptical of my professors'' or mentors'' guidance.', 'likert5', NULL, NULL),
  ('I am cautious about sharing useful resources or contacts.', 'likert5', NULL, NULL),
  ('I find it hard to be patient with teammates who work differently from me.', 'likert5', NULL, NULL),
  ('I sometimes take more credit than I deserve for team efforts.', 'likert5', NULL, NULL),
  ('I find it hard to listen when a friend is stressed about placements.', 'likert5', NULL, NULL),
  ('I rarely consider a recruiter''s or professor''s point of view.', 'likert5', NULL, NULL),
  ('I let quieter group members get overlooked in discussions.', 'likert5', NULL, NULL),
  ('I assume the worst about classmates during conflicts.', 'likert5', NULL, NULL),
  ('I am cautious about giving my time when peers need academic help.', 'likert5', NULL, NULL),
  ('I sometimes get drawn into discussing classmates'' grades or outcomes.', 'likert5', NULL, NULL),
  ('I find it hard to make new students or interns feel welcome.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Neuroticism / Emotional Stability'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I manage stress poorly during placement or internship season.', 'likert5', NULL, NULL),
  ('I feel anxious during high-pressure interviews.', 'likert5', NULL, NULL),
  ('I feel overwhelmed by ambiguity about my career path.', 'likert5', NULL, NULL),
  ('I take a long time to recover from a rejected application or failed interview.', 'likert5', NULL, NULL),
  ('I feel emotionally unsteady when juggling academic and career pressure.', 'likert5', NULL, NULL),
  ('I let comparison with peers'' offers affect my self-worth.', 'likert5', NULL, NULL),
  ('I get rattled when facing unexpected changes in plans (internship, project).', 'likert5', NULL, NULL),
  ('I feel anxious about my future even when things are going well.', 'likert5', NULL, NULL),
  ('I worry excessively about not having a ''perfect'' career plan.', 'likert5', NULL, NULL),
  ('I get defensive when receiving critical interview feedback.', 'likert5', NULL, NULL),
  ('I feel discouraged easily after one bad semester or evaluation.', 'likert5', NULL, NULL),
  ('I dwell on rejected applications for a long time.', 'likert5', NULL, NULL),
  ('I feel pressured comparing my progress to classmates'' achievements.', 'likert5', NULL, NULL),
  ('I struggle to stay calm during group project conflicts.', 'likert5', NULL, NULL),
  ('I feel tense before every important presentation or pitch.', 'likert5', NULL, NULL),
  ('I worry about disappointing my family with my career choices.', 'likert5', NULL, NULL),
  ('I find change in plans (e.g., internship falling through) very stressful.', 'likert5', NULL, NULL),
  ('I feel like things are often out of my control during placement season.', 'likert5', NULL, NULL),
  ('I get irritated quickly when facing setbacks in applications.', 'likert5', NULL, NULL),
  ('I struggle to separate my self-worth from my career outcomes.', 'likert5', NULL, NULL),
  ('I manage stress well during placement or internship season.', 'likert5', NULL, NULL),
  ('I stay composed during high-pressure interviews.', 'likert5', NULL, NULL),
  ('I handle ambiguity about my career path without excessive anxiety.', 'likert5', NULL, NULL),
  ('I bounce back quickly from a rejected application or failed interview.', 'likert5', NULL, NULL),
  ('I stay emotionally steady when juggling academic and career pressure.', 'likert5', NULL, NULL),
  ('I don''t let comparison with peers'' offers affect my self-worth.', 'likert5', NULL, NULL),
  ('I remain calm when facing unexpected changes in plans (internship, project).', 'likert5', NULL, NULL),
  ('I feel generally secure about my future, even with some uncertainty.', 'likert5', NULL, NULL),
  ('I don''t feel the need for a ''perfect'' career plan to feel at ease.', 'likert5', NULL, NULL),
  ('I take critical interview feedback constructively.', 'likert5', NULL, NULL),
  ('I stay motivated even after a difficult semester or evaluation.', 'likert5', NULL, NULL),
  ('I move on relatively quickly from rejected applications.', 'likert5', NULL, NULL),
  ('I focus on my own progress rather than comparing to classmates.', 'likert5', NULL, NULL),
  ('I stay calm during group project conflicts.', 'likert5', NULL, NULL),
  ('I feel relatively at ease before important presentations or pitches.', 'likert5', NULL, NULL),
  ('I feel confident in my career choices, regardless of family pressure.', 'likert5', NULL, NULL),
  ('I adapt well when plans change unexpectedly (e.g., internship falls through).', 'likert5', NULL, NULL),
  ('I generally feel in control of my career direction.', 'likert5', NULL, NULL),
  ('I stay even-tempered when facing setbacks in applications.', 'likert5', NULL, NULL),
  ('I separate my self-worth from my career outcomes.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Ambition — drive and leadership orientation'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I actively pursue opportunities for promotion or skill growth.', 'likert5', NULL, NULL),
  ('I set ambitious targets for my career progression.', 'likert5', NULL, NULL),
  ('I enjoy taking on leadership roles in projects, even informally.', 'likert5', NULL, NULL),
  ('I am driven to outperform expectations in my role.', 'likert5', NULL, NULL),
  ('I seek out challenging assignments rather than staying comfortable.', 'likert5', NULL, NULL),
  ('I am motivated by visible recognition for my achievements.', 'likert5', NULL, NULL),
  ('I take initiative without waiting to be asked.', 'likert5', NULL, NULL),
  ('I enjoy setting and chasing stretch goals at work.', 'likert5', NULL, NULL),
  ('I volunteer for high-visibility projects.', 'likert5', NULL, NULL),
  ('I push myself to grow faster than my peers.', 'likert5', NULL, NULL),
  ('I actively seek mentorship to accelerate my career.', 'likert5', NULL, NULL),
  ('I enjoy competing for top performance rankings.', 'likert5', NULL, NULL),
  ('I am comfortable asking for more responsibility.', 'likert5', NULL, NULL),
  ('I track my career progress against clear milestones.', 'likert5', NULL, NULL),
  ('I am content staying in my current role without seeking advancement.', 'likert5', NULL, NULL),
  ('I set modest, easily achievable career targets.', 'likert5', NULL, NULL),
  ('I avoid taking on leadership roles, even informally.', 'likert5', NULL, NULL),
  ('I am satisfied meeting expectations rather than exceeding them.', 'likert5', NULL, NULL),
  ('I prefer staying within my comfort zone at work.', 'likert5', NULL, NULL),
  ('Recognition for my achievements doesn''t motivate me much.', 'likert5', NULL, NULL),
  ('I wait to be asked before taking initiative.', 'likert5', NULL, NULL),
  ('I avoid setting stretch goals for myself.', 'likert5', NULL, NULL),
  ('I avoid volunteering for high-visibility projects.', 'likert5', NULL, NULL),
  ('I am comfortable growing at the same pace as my peers.', 'likert5', NULL, NULL),
  ('I rarely seek mentorship to accelerate my career.', 'likert5', NULL, NULL),
  ('I am indifferent to performance rankings.', 'likert5', NULL, NULL),
  ('I hesitate to ask for more responsibility.', 'likert5', NULL, NULL),
  ('I don''t track my career progress against specific milestones.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Sociability — enjoyment of social interaction'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy building relationships with colleagues across teams.', 'likert5', NULL, NULL),
  ('I am energized by team meetings and collaborative work.', 'likert5', NULL, NULL),
  ('I initiate conversations with new colleagues or clients easily.', 'likert5', NULL, NULL),
  ('I enjoy networking at professional or industry events.', 'likert5', NULL, NULL),
  ('I prefer working in socially interactive environments over isolated ones.', 'likert5', NULL, NULL),
  ('I actively participate in workplace social or team-building activities.', 'likert5', NULL, NULL),
  ('I enjoy collaborating with people outside my immediate team.', 'likert5', NULL, NULL),
  ('I look forward to meeting new clients or stakeholders.', 'likert5', NULL, NULL),
  ('I find it easy to make small talk with coworkers.', 'likert5', NULL, NULL),
  ('I enjoy brainstorming sessions with a large group.', 'likert5', NULL, NULL),
  ('I volunteer to represent my team in cross-functional meetings.', 'likert5', NULL, NULL),
  ('I enjoy mentoring or onboarding new colleagues.', 'likert5', NULL, NULL),
  ('I feel comfortable speaking up in large team settings.', 'likert5', NULL, NULL),
  ('I enjoy organizing or attending office social events.', 'likert5', NULL, NULL),
  ('I prefer working independently over building relationships with colleagues.', 'likert5', NULL, NULL),
  ('I find team meetings draining rather than energizing.', 'likert5', NULL, NULL),
  ('I find it hard to initiate conversations with new colleagues or clients.', 'likert5', NULL, NULL),
  ('I avoid networking at professional or industry events.', 'likert5', NULL, NULL),
  ('I prefer quiet, low-interaction work environments.', 'likert5', NULL, NULL),
  ('I avoid workplace social or team-building activities when I can.', 'likert5', NULL, NULL),
  ('I prefer sticking to my immediate team rather than collaborating widely.', 'likert5', NULL, NULL),
  ('I feel neutral or apprehensive about meeting new clients or stakeholders.', 'likert5', NULL, NULL),
  ('I find small talk with coworkers uncomfortable.', 'likert5', NULL, NULL),
  ('I prefer smaller, focused discussions over large group brainstorming.', 'likert5', NULL, NULL),
  ('I avoid representing my team in cross-functional meetings.', 'likert5', NULL, NULL),
  ('I avoid mentoring or onboarding new colleagues.', 'likert5', NULL, NULL),
  ('I stay quiet in large team settings.', 'likert5', NULL, NULL),
  ('I avoid office social events when possible.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Interpersonal Sensitivity — warmth and tact'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I am tactful when delivering difficult feedback to colleagues.', 'likert5', NULL, NULL),
  ('I notice when a colleague is upset, even if they don''t say so.', 'likert5', NULL, NULL),
  ('I adjust my communication style based on who I''m speaking to.', 'likert5', NULL, NULL),
  ('I maintain positive relationships even after workplace disagreements.', 'likert5', NULL, NULL),
  ('I am perceived by colleagues as easy to approach and work with.', 'likert5', NULL, NULL),
  ('I consider others'' emotional reactions before making decisions.', 'likert5', NULL, NULL),
  ('I check in on colleagues who seem stressed.', 'likert5', NULL, NULL),
  ('I am diplomatic when navigating office politics.', 'likert5', NULL, NULL),
  ('I read the room before raising sensitive topics in meetings.', 'likert5', NULL, NULL),
  ('I make an effort to understand a colleague''s perspective before reacting.', 'likert5', NULL, NULL),
  ('I am gentle when correcting a junior colleague''s mistake.', 'likert5', NULL, NULL),
  ('I build trust with coworkers over time through consistent behavior.', 'likert5', NULL, NULL),
  ('I am mindful of how my tone comes across in emails or messages.', 'likert5', NULL, NULL),
  ('I try to repair strained relationships at work proactively.', 'likert5', NULL, NULL),
  ('I am direct, even blunt, when delivering difficult feedback.', 'likert5', NULL, NULL),
  ('I don''t always notice when a colleague is upset.', 'likert5', NULL, NULL),
  ('I communicate the same way regardless of who I''m speaking to.', 'likert5', NULL, NULL),
  ('I find it hard to maintain relationships after workplace disagreements.', 'likert5', NULL, NULL),
  ('Colleagues sometimes find me difficult to approach.', 'likert5', NULL, NULL),
  ('I focus on the task at hand rather than others'' emotional reactions.', 'likert5', NULL, NULL),
  ('I rarely check in on colleagues who seem stressed.', 'likert5', NULL, NULL),
  ('I find office politics frustrating to navigate diplomatically.', 'likert5', NULL, NULL),
  ('I raise sensitive topics in meetings without much hesitation.', 'likert5', NULL, NULL),
  ('I react quickly without first understanding a colleague''s perspective.', 'likert5', NULL, NULL),
  ('I am straightforward when correcting a junior colleague''s mistake.', 'likert5', NULL, NULL),
  ('I don''t put much extra effort into building trust with coworkers.', 'likert5', NULL, NULL),
  ('I don''t pay much attention to tone in emails or messages.', 'likert5', NULL, NULL),
  ('I let strained work relationships resolve on their own.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Prudence — reliability and risk management'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I follow organizational processes and policies carefully.', 'likert5', NULL, NULL),
  ('I double-check my work before submitting it to avoid errors.', 'likert5', NULL, NULL),
  ('I plan my tasks methodically rather than acting impulsively.', 'likert5', NULL, NULL),
  ('I am consistently reliable in meeting deadlines.', 'likert5', NULL, NULL),
  ('I think through risks carefully before making work decisions.', 'likert5', NULL, NULL),
  ('I maintain high standards of accuracy in my deliverables.', 'likert5', NULL, NULL),
  ('I keep thorough documentation of my work.', 'likert5', NULL, NULL),
  ('I follow compliance and process guidelines without cutting corners.', 'likert5', NULL, NULL),
  ('I plan ahead to avoid last-minute scrambles at work.', 'likert5', NULL, NULL),
  ('I stick to agreed timelines even under pressure.', 'likert5', NULL, NULL),
  ('I am careful about confidentiality and data handling at work.', 'likert5', NULL, NULL),
  ('I review my own work critically before calling it done.', 'likert5', NULL, NULL),
  ('I take a structured approach to solving workplace problems.', 'likert5', NULL, NULL),
  ('I avoid taking unnecessary shortcuts on important tasks.', 'likert5', NULL, NULL),
  ('I sometimes bend organizational processes if it gets things done faster.', 'likert5', NULL, NULL),
  ('I rarely double-check my work before submitting it.', 'likert5', NULL, NULL),
  ('I tend to act on impulse rather than plan methodically.', 'likert5', NULL, NULL),
  ('I am inconsistent about meeting deadlines.', 'likert5', NULL, NULL),
  ('I make work decisions quickly without weighing risks carefully.', 'likert5', NULL, NULL),
  ('I am sometimes careless about accuracy in my deliverables.', 'likert5', NULL, NULL),
  ('I keep minimal documentation of my work.', 'likert5', NULL, NULL),
  ('I sometimes skip steps in compliance or process guidelines.', 'likert5', NULL, NULL),
  ('I often find myself scrambling at the last minute.', 'likert5', NULL, NULL),
  ('I adjust agreed timelines if I''m under pressure.', 'likert5', NULL, NULL),
  ('I am occasionally careless with confidentiality or data handling.', 'likert5', NULL, NULL),
  ('I rarely review my own work critically before calling it done.', 'likert5', NULL, NULL),
  ('I solve workplace problems in an ad hoc rather than structured way.', 'likert5', NULL, NULL),
  ('I sometimes take shortcuts on important tasks to save time.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Inquisitive — curiosity and strategic thinking'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy exploring new tools, technologies, or methods at work.', 'likert5', NULL, NULL),
  ('I ask probing questions to understand the root of a problem.', 'likert5', NULL, NULL),
  ('I enjoy thinking about big-picture strategy, not just daily tasks.', 'likert5', NULL, NULL),
  ('I seek out feedback to continuously improve my skills.', 'likert5', NULL, NULL),
  ('I enjoy tackling unconventional or ambiguous problems.', 'likert5', NULL, NULL),
  ('I actively read about trends shaping my industry.', 'likert5', NULL, NULL),
  ('I enjoy proposing new ideas, even if they challenge the status quo.', 'likert5', NULL, NULL),
  ('I like understanding how my work connects to broader business goals.', 'likert5', NULL, NULL),
  ('I enjoy researching best practices from other companies or industries.', 'likert5', NULL, NULL),
  ('I get energized by solving complex, open-ended problems.', 'likert5', NULL, NULL),
  ('I question existing processes if I see a better way.', 'likert5', NULL, NULL),
  ('I enjoy experimenting with new approaches before they''re proven.', 'likert5', NULL, NULL),
  ('I like exploring ''what if'' scenarios for future strategy.', 'likert5', NULL, NULL),
  ('I seek out cross-functional knowledge beyond my role.', 'likert5', NULL, NULL),
  ('I prefer using tools and methods I''m already familiar with.', 'likert5', NULL, NULL),
  ('I rarely ask probing questions beyond what''s needed to complete a task.', 'likert5', NULL, NULL),
  ('I focus on my daily tasks rather than big-picture strategy.', 'likert5', NULL, NULL),
  ('I rarely seek out feedback unless it''s required.', 'likert5', NULL, NULL),
  ('I prefer well-defined problems over ambiguous ones.', 'likert5', NULL, NULL),
  ('I rarely follow trends shaping my industry.', 'likert5', NULL, NULL),
  ('I rarely propose new ideas that challenge the status quo.', 'likert5', NULL, NULL),
  ('I focus on my own role rather than broader business goals.', 'likert5', NULL, NULL),
  ('I rarely research practices from other companies or industries.', 'likert5', NULL, NULL),
  ('I prefer routine tasks over complex, open-ended problems.', 'likert5', NULL, NULL),
  ('I rarely question existing processes, even if there''s a better way.', 'likert5', NULL, NULL),
  ('I prefer proven approaches over experimenting with new ones.', 'likert5', NULL, NULL),
  ('I rarely think through ''what if'' scenarios for future strategy.', 'likert5', NULL, NULL),
  ('I stay focused on my role rather than seeking cross-functional knowledge.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Learning Approach — motivation to learn'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I proactively seek training to fill gaps in my skills.', 'likert5', NULL, NULL),
  ('I enjoy learning new software or processes required for my role.', 'likert5', NULL, NULL),
  ('I stay updated with industry certifications or courses.', 'likert5', NULL, NULL),
  ('I learn quickly from constructive feedback.', 'likert5', NULL, NULL),
  ('I am motivated to learn skills outside my immediate job scope.', 'likert5', NULL, NULL),
  ('I view mistakes as learning opportunities rather than failures.', 'likert5', NULL, NULL),
  ('I seek out a mentor or coach to accelerate my growth.', 'likert5', NULL, NULL),
  ('I enjoy reading or taking courses related to my field in my own time.', 'likert5', NULL, NULL),
  ('I apply lessons from one project to the next.', 'likert5', NULL, NULL),
  ('I am open to unlearning outdated habits when better methods emerge.', 'likert5', NULL, NULL),
  ('I track my own skill development over time.', 'likert5', NULL, NULL),
  ('I ask colleagues to teach me skills I don''t yet have.', 'likert5', NULL, NULL),
  ('I welcome stretch assignments even if I''m not fully prepared.', 'likert5', NULL, NULL),
  ('I reflect regularly on what I could improve in my work.', 'likert5', NULL, NULL),
  ('I rarely seek training unless it''s mandatory.', 'likert5', NULL, NULL),
  ('I find it tedious to learn new software or processes for my role.', 'likert5', NULL, NULL),
  ('I rarely pursue industry certifications or courses.', 'likert5', NULL, NULL),
  ('I find it hard to apply feedback to improve quickly.', 'likert5', NULL, NULL),
  ('I focus mainly on skills required for my immediate job.', 'likert5', NULL, NULL),
  ('I see mistakes mainly as failures rather than learning opportunities.', 'likert5', NULL, NULL),
  ('I rarely seek out a mentor or coach for my growth.', 'likert5', NULL, NULL),
  ('I rarely read or take courses related to my field outside of work hours.', 'likert5', NULL, NULL),
  ('I don''t often apply lessons from one project to the next.', 'likert5', NULL, NULL),
  ('I find it hard to let go of familiar habits, even when better methods emerge.', 'likert5', NULL, NULL),
  ('I don''t track my own skill development over time.', 'likert5', NULL, NULL),
  ('I rarely ask colleagues to teach me skills I lack.', 'likert5', NULL, NULL),
  ('I avoid stretch assignments unless I feel fully prepared.', 'likert5', NULL, NULL),
  ('I rarely reflect on what I could improve in my work.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Validity / Consistency Check'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I have never made a mistake at work.', 'likert5', NULL, NULL),
  ('I always meet every deadline without exception.', 'likert5', NULL, NULL),
  ('I get along perfectly with every colleague I''ve ever worked with.', 'likert5', NULL, NULL),
  ('I have never felt frustrated at my job.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Excitable — volatile, over-reactive under stress'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('My mood can shift quickly when projects don''t go as planned.', 'likert5', NULL, NULL),
  ('I sometimes lose enthusiasm for initiatives I was once excited about.', 'likert5', NULL, NULL),
  ('I can become visibly frustrated when under sustained pressure.', 'likert5', NULL, NULL),
  ('My confidence can dip sharply after a high-profile setback.', 'likert5', NULL, NULL),
  ('I get easily discouraged when a major initiative is criticized.', 'likert5', NULL, NULL),
  ('I sometimes overreact to minor setbacks at work.', 'likert5', NULL, NULL),
  ('My enthusiasm for a project can collapse quickly if leadership doesn''t back it.', 'likert5', NULL, NULL),
  ('I find it hard to hide disappointment when things don''t go my way.', 'likert5', NULL, NULL),
  ('I have walked away from initiatives after one bad review.', 'likert5', NULL, NULL),
  ('I stay enthusiastic about a project even after early setbacks.', 'likert5', NULL, NULL),
  ('My mood stays fairly steady, even under sustained pressure.', 'likert5', NULL, NULL),
  ('I keep my confidence steady after a high-profile setback.', 'likert5', NULL, NULL),
  ('I rarely overreact to minor setbacks at work.', 'likert5', NULL, NULL),
  ('My enthusiasm for a project doesn''t depend much on leadership''s reaction.', 'likert5', NULL, NULL),
  ('I keep disappointment from showing, even when things don''t go my way.', 'likert5', NULL, NULL),
  ('I rarely abandon initiatives after a single bad review.', 'likert5', NULL, NULL),
  ('I stay engaged with a project even when it''s being criticized.', 'likert5', NULL, NULL),
  ('I handle repeated setbacks on the same project without losing motivation.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Skeptical — distrustful of others'' motives'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I tend to question the motives behind organizational decisions.', 'likert5', NULL, NULL),
  ('I am cautious about trusting colleagues until they prove reliable.', 'likert5', NULL, NULL),
  ('I notice when others might be acting in their own self-interest.', 'likert5', NULL, NULL),
  ('I sometimes suspect hidden agendas in workplace politics.', 'likert5', NULL, NULL),
  ('I find it hard to fully trust leadership''s stated reasons for decisions.', 'likert5', NULL, NULL),
  ('I often wonder if colleagues are taking credit unfairly.', 'likert5', NULL, NULL),
  ('I assume people may not be telling me the full picture at work.', 'likert5', NULL, NULL),
  ('I am wary when colleagues are unusually friendly or cooperative.', 'likert5', NULL, NULL),
  ('I double-check what people tell me before acting on it.', 'likert5', NULL, NULL),
  ('I generally trust colleagues'' stated intentions.', 'likert5', NULL, NULL),
  ('I assume good faith in leadership''s decisions, even when unclear.', 'likert5', NULL, NULL),
  ('I rarely suspect hidden agendas in workplace politics.', 'likert5', NULL, NULL),
  ('I don''t often wonder if colleagues are taking credit unfairly.', 'likert5', NULL, NULL),
  ('I take people''s explanations at face value most of the time.', 'likert5', NULL, NULL),
  ('I don''t feel wary when colleagues are friendly or cooperative.', 'likert5', NULL, NULL),
  ('I rarely feel the need to double-check what colleagues tell me.', 'likert5', NULL, NULL),
  ('I extend trust to new colleagues fairly quickly.', 'likert5', NULL, NULL),
  ('I rarely question the motives behind routine organizational decisions.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Cautious — risk-avoidant, fear of criticism'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I avoid taking risks that could expose me to criticism or blame.', 'likert5', NULL, NULL),
  ('I prefer not to make decisions without extensive analysis first.', 'likert5', NULL, NULL),
  ('I hesitate before proposing ideas that could be unpopular.', 'likert5', NULL, NULL),
  ('I worry about being judged for mistakes more than most colleagues.', 'likert5', NULL, NULL),
  ('I delay decisions to avoid the risk of being wrong.', 'likert5', NULL, NULL),
  ('I avoid volunteering for initiatives that could fail publicly.', 'likert5', NULL, NULL),
  ('I prefer the safe option even if it limits potential upside.', 'likert5', NULL, NULL),
  ('I find it hard to commit to a decision without exhaustive evidence.', 'likert5', NULL, NULL),
  ('I avoid sharing unfinished ideas for fear of criticism.', 'likert5', NULL, NULL),
  ('I am comfortable taking calculated risks even if I might be criticized.', 'likert5', NULL, NULL),
  ('I am willing to make decisions without extensive analysis when needed.', 'likert5', NULL, NULL),
  ('I propose ideas confidently, even if they could be unpopular.', 'likert5', NULL, NULL),
  ('I don''t worry excessively about being judged for mistakes.', 'likert5', NULL, NULL),
  ('I make timely decisions rather than delaying to avoid risk.', 'likert5', NULL, NULL),
  ('I volunteer for initiatives even when they could fail publicly.', 'likert5', NULL, NULL),
  ('I am willing to choose the bold option over the safe one.', 'likert5', NULL, NULL),
  ('I commit to decisions without needing exhaustive evidence.', 'likert5', NULL, NULL),
  ('I share unfinished ideas openly without fear of criticism.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Reserved — detached, indifferent to others'' feelings'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I prefer keeping my opinions to myself in larger meetings.', 'likert5', NULL, NULL),
  ('I find it hard to share difficult news with my team.', 'likert5', NULL, NULL),
  ('I avoid drawing attention to my own contributions.', 'likert5', NULL, NULL),
  ('I keep my distance emotionally from coworkers I don''t know well.', 'likert5', NULL, NULL),
  ('I find it tiring to manage others'' feelings during difficult conversations.', 'likert5', NULL, NULL),
  ('I focus on the work itself rather than team morale.', 'likert5', NULL, NULL),
  ('I rarely check in with team members about how they''re feeling.', 'likert5', NULL, NULL),
  ('I prefer communicating through written messages over face-to-face talks.', 'likert5', NULL, NULL),
  ('I find it draining to be the one comforting a struggling team member.', 'likert5', NULL, NULL),
  ('I speak up readily in larger meetings.', 'likert5', NULL, NULL),
  ('I find it easy to share difficult news with my team.', 'likert5', NULL, NULL),
  ('I make sure my contributions are visible to others.', 'likert5', NULL, NULL),
  ('I build close working relationships with coworkers I don''t know well yet.', 'likert5', NULL, NULL),
  ('I am comfortable managing others'' feelings during difficult conversations.', 'likert5', NULL, NULL),
  ('I pay close attention to team morale, not just the work itself.', 'likert5', NULL, NULL),
  ('I regularly check in with team members about how they''re feeling.', 'likert5', NULL, NULL),
  ('I prefer face-to-face conversations over written messages for sensitive topics.', 'likert5', NULL, NULL),
  ('I find it natural to comfort a struggling team member.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Leisurely — passive resistance to others'' demands'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I can become quietly resistant when asked to change my approach.', 'likert5', NULL, NULL),
  ('I prioritize my own pace over urgent requests from others.', 'likert5', NULL, NULL),
  ('I sometimes delay tasks I privately disagree with.', 'likert5', NULL, NULL),
  ('I find it difficult to adjust my schedule for others'' deadlines.', 'likert5', NULL, NULL),
  ('I agree to deadlines I don''t actually intend to fully honor.', 'likert5', NULL, NULL),
  ('I quietly push back on instructions I think are unnecessary.', 'likert5', NULL, NULL),
  ('I take my time responding to requests I see as low priority, even if others see them as urgent.', 'likert5', NULL, NULL),
  ('I resist being micromanaged, even when it slows down collaboration.', 'likert5', NULL, NULL),
  ('I sometimes let agreed-upon commitments slip without saying anything.', 'likert5', NULL, NULL),
  ('I adjust my approach willingly when asked, even if I''d prefer otherwise.', 'likert5', NULL, NULL),
  ('I prioritize others'' urgent requests over my own pace when needed.', 'likert5', NULL, NULL),
  ('I complete tasks I privately disagree with as promptly as agreed.', 'likert5', NULL, NULL),
  ('I adjust my schedule readily to meet others'' deadlines.', 'likert5', NULL, NULL),
  ('I honor deadlines I''ve agreed to, even under pressure.', 'likert5', NULL, NULL),
  ('I voice disagreement openly rather than quietly resisting instructions.', 'likert5', NULL, NULL),
  ('I respond promptly to requests, even ones I see as lower priority.', 'likert5', NULL, NULL),
  ('I accept closer oversight without resisting, when it''s needed.', 'likert5', NULL, NULL),
  ('I flag it clearly if I think I won''t meet a commitment, rather than letting it slip.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Bold — overconfident, entitled'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I am confident asserting my opinion, even against senior leaders.', 'likert5', NULL, NULL),
  ('I sometimes overestimate how much my ideas will succeed.', 'likert5', NULL, NULL),
  ('I expect to be recognized for my contributions to a project.', 'likert5', NULL, NULL),
  ('I find it hard to accept that I might be wrong in a debate.', 'likert5', NULL, NULL),
  ('I believe my judgment is usually better than most of my peers''.', 'likert5', NULL, NULL),
  ('I get frustrated when others don''t recognize my expertise.', 'likert5', NULL, NULL),
  ('I am comfortable taking charge, even without being asked.', 'likert5', NULL, NULL),
  ('I assume my approach is the right one until proven otherwise.', 'likert5', NULL, NULL),
  ('I feel I deserve more credit than I usually get.', 'likert5', NULL, NULL),
  ('I stay open to the possibility that senior leaders'' views are right.', 'likert5', NULL, NULL),
  ('I am realistic, sometimes cautious, about how my ideas will land.', 'likert5', NULL, NULL),
  ('I don''t expect special recognition for doing my job well.', 'likert5', NULL, NULL),
  ('I readily accept when I''m wrong in a debate.', 'likert5', NULL, NULL),
  ('I value others'' judgment as much as my own.', 'likert5', NULL, NULL),
  ('I stay calm when others don''t immediately recognize my expertise.', 'likert5', NULL, NULL),
  ('I wait to be asked before taking charge of a situation.', 'likert5', NULL, NULL),
  ('I consider other approaches before assuming mine is correct.', 'likert5', NULL, NULL),
  ('I feel satisfied with appropriate, not excessive, credit.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Mischievous — rule-bending, risk-taking for excitement'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy testing boundaries or pushing against established rules.', 'likert5', NULL, NULL),
  ('I sometimes take calculated risks without informing others first.', 'likert5', NULL, NULL),
  ('I am drawn to unconventional approaches, even when discouraged.', 'likert5', NULL, NULL),
  ('I enjoy a bit of competitive maneuvering to get ahead.', 'likert5', NULL, NULL),
  ('I sometimes bend the rules if I think the outcome justifies it.', 'likert5', NULL, NULL),
  ('I get a thrill from situations with some risk involved.', 'likert5', NULL, NULL),
  ('I have stretched the truth slightly to make a deal work.', 'likert5', NULL, NULL),
  ('I enjoy finding loopholes in rigid processes.', 'likert5', NULL, NULL),
  ('I sometimes act first and ask for permission later.', 'likert5', NULL, NULL),
  ('I prefer working within established rules rather than testing them.', 'likert5', NULL, NULL),
  ('I inform others before taking risks that affect the team.', 'likert5', NULL, NULL),
  ('I prefer conventional, proven approaches over unconventional ones.', 'likert5', NULL, NULL),
  ('I avoid competitive maneuvering that could be seen as unfair.', 'likert5', NULL, NULL),
  ('I stick to the rules even if bending them seems harmless.', 'likert5', NULL, NULL),
  ('I don''t seek out risk for its own sake.', 'likert5', NULL, NULL),
  ('I am always fully accurate, even in informal conversations to close a deal.', 'likert5', NULL, NULL),
  ('I respect rigid processes rather than looking for loopholes.', 'likert5', NULL, NULL),
  ('I ask for permission before acting in ambiguous situations.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Colorful — attention-seeking, dramatic'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy being the center of attention in meetings or presentations.', 'likert5', NULL, NULL),
  ('I like my work or ideas to stand out visibly to leadership.', 'likert5', NULL, NULL),
  ('I sometimes dramatize a point to make it more memorable.', 'likert5', NULL, NULL),
  ('I seek recognition for the impact of my contributions.', 'likert5', NULL, NULL),
  ('I enjoy being seen as the most engaging person in the room.', 'likert5', NULL, NULL),
  ('I like to make a strong impression in client or stakeholder meetings.', 'likert5', NULL, NULL),
  ('I find it hard to stay in the background during important moments.', 'likert5', NULL, NULL),
  ('I enjoy telling stories that highlight my own achievements.', 'likert5', NULL, NULL),
  ('I like injecting personality and flair into formal presentations.', 'likert5', NULL, NULL),
  ('I am comfortable staying in the background during meetings or presentations.', 'likert5', NULL, NULL),
  ('I don''t need my work to stand out visibly to leadership.', 'likert5', NULL, NULL),
  ('I present facts plainly without dramatizing them.', 'likert5', NULL, NULL),
  ('I don''t actively seek recognition for my contributions.', 'likert5', NULL, NULL),
  ('I am content not being the most engaging person in the room.', 'likert5', NULL, NULL),
  ('I focus on substance over making a strong impression in meetings.', 'likert5', NULL, NULL),
  ('I am comfortable staying in the background during important moments.', 'likert5', NULL, NULL),
  ('I avoid highlighting my own achievements when telling stories.', 'likert5', NULL, NULL),
  ('I keep formal presentations straightforward rather than flashy.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Imaginative — eccentric, unconventional thinking'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I often think in unconventional or unusual ways compared to peers.', 'likert5', NULL, NULL),
  ('I sometimes propose ideas that others find too abstract or unusual.', 'likert5', NULL, NULL),
  ('I get bored with routine, predictable tasks quickly.', 'likert5', NULL, NULL),
  ('I prefer big, original ideas over incremental improvements.', 'likert5', NULL, NULL),
  ('I find conventional thinking limiting in solving real problems.', 'likert5', NULL, NULL),
  ('My ideas are sometimes seen as impractical by colleagues.', 'likert5', NULL, NULL),
  ('I enjoy exploring ideas that seem far ahead of current practice.', 'likert5', NULL, NULL),
  ('I find it hard to stick with a plan once I think of a better one.', 'likert5', NULL, NULL),
  ('I am drawn to unusual or experimental solutions over tested ones.', 'likert5', NULL, NULL),
  ('I tend to think in conventional, practical ways like most peers.', 'likert5', NULL, NULL),
  ('My ideas are usually grounded and easy for others to follow.', 'likert5', NULL, NULL),
  ('I don''t mind routine, predictable tasks.', 'likert5', NULL, NULL),
  ('I prefer incremental, proven improvements over big original ideas.', 'likert5', NULL, NULL),
  ('I find conventional thinking useful for solving most problems.', 'likert5', NULL, NULL),
  ('My ideas are generally seen as practical by colleagues.', 'likert5', NULL, NULL),
  ('I focus on ideas relevant to current practice, not far-future concepts.', 'likert5', NULL, NULL),
  ('I stick with a plan once it''s set, even if a new idea comes up.', 'likert5', NULL, NULL),
  ('I prefer tested solutions over unusual or experimental ones.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Diligent — perfectionistic, over-controlling'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I hold myself and others to very high standards of perfection.', 'likert5', NULL, NULL),
  ('I find it hard to delegate tasks unless I''m sure they''ll be done my way.', 'likert5', NULL, NULL),
  ('I can become overly focused on small details at the expense of deadlines.', 'likert5', NULL, NULL),
  ('I struggle to stop double-checking work even when it''s already correct.', 'likert5', NULL, NULL),
  ('I find it hard to move on once I see a way to improve something further.', 'likert5', NULL, NULL),
  ('I get frustrated when others don''t meet my standard of thoroughness.', 'likert5', NULL, NULL),
  ('I sometimes redo others'' work because it isn''t done my way.', 'likert5', NULL, NULL),
  ('I find it difficult to say a piece of work is ''good enough.''', 'likert5', NULL, NULL),
  ('I closely monitor details that others might consider minor.', 'likert5', NULL, NULL),
  ('I am comfortable with good-enough quality when timelines are tight.', 'likert5', NULL, NULL),
  ('I delegate tasks readily and trust others to do them their way.', 'likert5', NULL, NULL),
  ('I keep small details in proportion to overall deadlines.', 'likert5', NULL, NULL),
  ('I know when to stop double-checking work that''s already correct.', 'likert5', NULL, NULL),
  ('I can move on once a piece of work is solid, even if not perfect.', 'likert5', NULL, NULL),
  ('I accept that others'' standard of thoroughness may differ from mine.', 'likert5', NULL, NULL),
  ('I let others'' work stand even if I would have done it differently.', 'likert5', NULL, NULL),
  ('I am comfortable calling a piece of work ''good enough'' when it meets the bar.', 'likert5', NULL, NULL),
  ('I don''t feel the need to monitor every minor detail myself.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Dutiful — excessive deference to authority'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I find it difficult to disagree openly with senior leadership.', 'likert5', NULL, NULL),
  ('I prioritize pleasing my manager over voicing my own concerns.', 'likert5', NULL, NULL),
  ('I avoid conflict with authority figures even when I disagree.', 'likert5', NULL, NULL),
  ('I tend to go along with decisions from above rather than challenge them.', 'likert5', NULL, NULL),
  ('I hesitate to push back on a senior leader''s flawed plan.', 'likert5', NULL, NULL),
  ('I find it hard to say no to my manager''s requests, even unreasonable ones.', 'likert5', NULL, NULL),
  ('I avoid raising concerns that could be seen as criticizing leadership.', 'likert5', NULL, NULL),
  ('I generally defer to authority rather than trust my own judgment.', 'likert5', NULL, NULL),
  ('I worry more about how a senior leader perceives me than about being right.', 'likert5', NULL, NULL),
  ('I disagree openly with senior leadership when I have good reason to.', 'likert5', NULL, NULL),
  ('I voice my own concerns even when it might not please my manager.', 'likert5', NULL, NULL),
  ('I am comfortable with some conflict with authority figures when needed.', 'likert5', NULL, NULL),
  ('I challenge decisions from above when I think they''re wrong.', 'likert5', NULL, NULL),
  ('I push back on a senior leader''s plan if I see a flaw in it.', 'likert5', NULL, NULL),
  ('I am comfortable saying no to unreasonable requests from my manager.', 'likert5', NULL, NULL),
  ('I raise concerns even if they could be seen as critical of leadership.', 'likert5', NULL, NULL),
  ('I trust my own judgment over automatically deferring to authority.', 'likert5', NULL, NULL),
  ('I prioritize being right over how a senior leader perceives me.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Validity Check'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Personality'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I have never disagreed with a manager in my entire career.', 'likert5', NULL, NULL),
  ('I have never made a decision I later regretted at work.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'R-Realistic'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I like building things with Lego, blocks, or kits.', 'yes_no', NULL, NULL),
  ('I enjoy fixing broken toys or gadgets at home.', 'yes_no', NULL, NULL),
  ('I like working outdoors, like in a garden or field.', 'yes_no', NULL, NULL),
  ('I enjoy activities like carpentry, pottery, or craft-making.', 'yes_no', NULL, NULL),
  ('I like taking machines or devices apart to see how they work.', 'yes_no', NULL, NULL),
  ('I enjoy playing physical sports like football, kabaddi, or athletics.', 'yes_no', NULL, NULL),
  ('I like feeding, grooming, or training animals.', 'yes_no', NULL, NULL),
  ('I enjoy hiking, trekking, or outdoor adventure activities.', 'yes_no', NULL, NULL),
  ('I like assembling or building model kits (cars, robots, planes).', 'yes_no', NULL, NULL),
  ('I enjoy using tools like a hammer, screwdriver, or drill.', 'yes_no', NULL, NULL),
  ('I like cooking or baking as a hands-on activity.', 'yes_no', NULL, NULL),
  ('I enjoy making things from wood, clay, or metal.', 'yes_no', NULL, NULL),
  ('I like riding bikes, skateboards, or working with wheels.', 'yes_no', NULL, NULL),
  ('I enjoy planting seeds and watching things grow.', 'yes_no', NULL, NULL),
  ('I like helping repair things around the house.', 'yes_no', NULL, NULL),
  ('I enjoy activities where I use my hands more than my brain.', 'yes_no', NULL, NULL),
  ('I like building circuits or doing simple electronics projects.', 'yes_no', NULL, NULL),
  ('I enjoy physical activity more than sitting and reading.', 'yes_no', NULL, NULL),
  ('I like making useful objects rather than decorating them.', 'yes_no', NULL, NULL),
  ('I enjoy projects where I can see and touch my final result.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'I-Investigative'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy doing science experiments, even at home.', 'yes_no', NULL, NULL),
  ('I like reading about space, planets, or how the universe works.', 'yes_no', NULL, NULL),
  ('I enjoy solving tricky maths or logic puzzles.', 'yes_no', NULL, NULL),
  ('I like asking ''why'' and ''how'' about things I observe.', 'yes_no', NULL, NULL),
  ('I enjoy researching topics I''m curious about online or in books.', 'yes_no', NULL, NULL),
  ('I like figuring out how animals or plants behave in nature.', 'yes_no', NULL, NULL),
  ('I enjoy quiz competitions or trivia games about facts.', 'yes_no', NULL, NULL),
  ('I like coding or trying out simple programming activities.', 'yes_no', NULL, NULL),
  ('I enjoy collecting and organizing facts about my favorite topics.', 'yes_no', NULL, NULL),
  ('I like watching science or nature documentaries.', 'yes_no', NULL, NULL),
  ('I enjoy thinking about experiments to test my own ideas.', 'yes_no', NULL, NULL),
  ('I like figuring out patterns in numbers, shapes, or sequences.', 'yes_no', NULL, NULL),
  ('I enjoy making observations and writing what I notice.', 'yes_no', NULL, NULL),
  ('I like working with a microscope, magnifying glass, or telescope.', 'yes_no', NULL, NULL),
  ('I enjoy reading about inventions or famous scientists.', 'yes_no', NULL, NULL),
  ('I like learning about the human body and how it works.', 'yes_no', NULL, NULL),
  ('I enjoy thinking through problems step by step before solving them.', 'yes_no', NULL, NULL),
  ('I like analyzing data from a simple survey or experiment.', 'yes_no', NULL, NULL),
  ('I enjoy asking questions even when no one else does.', 'yes_no', NULL, NULL),
  ('I like learning about math, science, or technology for fun.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'A-Artistic'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy drawing, sketching, or painting pictures.', 'yes_no', NULL, NULL),
  ('I like writing stories, poems, or scripts.', 'yes_no', NULL, NULL),
  ('I enjoy singing, playing a musical instrument, or composing music.', 'yes_no', NULL, NULL),
  ('I like acting in plays, skits, or short films.', 'yes_no', NULL, NULL),
  ('I enjoy designing my own clothes, accessories, or room décor.', 'yes_no', NULL, NULL),
  ('I like making up new characters, games, or imaginary worlds.', 'yes_no', NULL, NULL),
  ('I enjoy dancing or performing in front of others.', 'yes_no', NULL, NULL),
  ('I like taking photos or making short videos.', 'yes_no', NULL, NULL),
  ('I enjoy crafting things like handmade cards, jewelry, or origami.', 'yes_no', NULL, NULL),
  ('I like expressing my feelings or ideas through art rather than words.', 'yes_no', NULL, NULL),
  ('I enjoy decorating my notebooks, walls, or personal space.', 'yes_no', NULL, NULL),
  ('I like experimenting with new art styles or creative techniques.', 'yes_no', NULL, NULL),
  ('I enjoy making posters, banners, or visual displays for school.', 'yes_no', NULL, NULL),
  ('I like creating digital art or designs on a computer or tablet.', 'yes_no', NULL, NULL),
  ('I enjoy telling stories through pictures, comics, or graphic styles.', 'yes_no', NULL, NULL),
  ('I like being part of drama, choir, or any performance group.', 'yes_no', NULL, NULL),
  ('I enjoy making things that are unique — that nobody else has made.', 'yes_no', NULL, NULL),
  ('I like mixing colors, sounds, or words in creative ways.', 'yes_no', NULL, NULL),
  ('I enjoy looking at art, design, or architecture for inspiration.', 'yes_no', NULL, NULL),
  ('I like imagining alternate worlds or storylines in my free time.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'S-Social'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy helping classmates who are struggling with their studies.', 'yes_no', NULL, NULL),
  ('I like listening to my friends when they have problems.', 'yes_no', NULL, NULL),
  ('I enjoy taking care of younger children or siblings.', 'yes_no', NULL, NULL),
  ('I like teaching others a skill or subject I know well.', 'yes_no', NULL, NULL),
  ('I enjoy volunteering for community service or charity drives.', 'yes_no', NULL, NULL),
  ('I like organizing group activities or team games.', 'yes_no', NULL, NULL),
  ('I enjoy comforting a friend who is upset or sad.', 'yes_no', NULL, NULL),
  ('I like making new students or newcomers feel welcome.', 'yes_no', NULL, NULL),
  ('I enjoy participating in group discussions and sharing ideas.', 'yes_no', NULL, NULL),
  ('I like advising friends when they need help making a decision.', 'yes_no', NULL, NULL),
  ('I enjoy activities that involve teamwork and mutual support.', 'yes_no', NULL, NULL),
  ('I like visiting elderly relatives and spending time with them.', 'yes_no', NULL, NULL),
  ('I enjoy working with animals that need care or protection.', 'yes_no', NULL, NULL),
  ('I like being a class monitor or prefect to help others.', 'yes_no', NULL, NULL),
  ('I enjoy cheering up people who are going through a hard time.', 'yes_no', NULL, NULL),
  ('I like explaining things to others in a way they can understand.', 'yes_no', NULL, NULL),
  ('I enjoy being part of a support group or community activity.', 'yes_no', NULL, NULL),
  ('I like helping organize school events for the benefit of others.', 'yes_no', NULL, NULL),
  ('I enjoy being kind and generous without expecting anything back.', 'yes_no', NULL, NULL),
  ('I like understanding why people behave the way they do.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'E-Enterprising'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy being the leader of a group project or team.', 'yes_no', NULL, NULL),
  ('I like convincing my friends to try out my ideas.', 'yes_no', NULL, NULL),
  ('I enjoy planning and organizing events, like school fests.', 'yes_no', NULL, NULL),
  ('I like setting goals for myself and working hard to reach them.', 'yes_no', NULL, NULL),
  ('I enjoy competing to win, in games, quizzes, or sports.', 'yes_no', NULL, NULL),
  ('I like selling things, like at a school fundraiser or fair.', 'yes_no', NULL, NULL),
  ('I enjoy negotiating to get a better deal or outcome.', 'yes_no', NULL, NULL),
  ('I like taking charge when a group needs direction.', 'yes_no', NULL, NULL),
  ('I enjoy giving speeches, presentations, or debates.', 'yes_no', NULL, NULL),
  ('I like coming up with ideas for new products or businesses.', 'yes_no', NULL, NULL),
  ('I enjoy motivating others to work toward a shared goal.', 'yes_no', NULL, NULL),
  ('I like being recognized for my achievements.', 'yes_no', NULL, NULL),
  ('I enjoy taking on challenges that feel a little risky.', 'yes_no', NULL, NULL),
  ('I like having responsibility for an outcome or result.', 'yes_no', NULL, NULL),
  ('I enjoy leading discussions where I share my point of view.', 'yes_no', NULL, NULL),
  ('I like pitching ideas and getting people excited about them.', 'yes_no', NULL, NULL),
  ('I enjoy strategizing to win a game or solve a group challenge.', 'yes_no', NULL, NULL),
  ('I like keeping score or tracking who is winning.', 'yes_no', NULL, NULL),
  ('I enjoy representing my class or school at competitions.', 'yes_no', NULL, NULL),
  ('I like being the decision-maker in group situations.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'C-Conventional'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy organizing my books, notes, and stationery neatly.', 'yes_no', NULL, NULL),
  ('I like following step-by-step instructions carefully.', 'yes_no', NULL, NULL),
  ('I enjoy making to-do lists and checking items off.', 'yes_no', NULL, NULL),
  ('I like keeping track of my pocket money or expenses.', 'yes_no', NULL, NULL),
  ('I enjoy filling in worksheets or forms with accuracy.', 'yes_no', NULL, NULL),
  ('I like sorting or categorizing objects into groups.', 'yes_no', NULL, NULL),
  ('I enjoy following rules that help everything run smoothly.', 'yes_no', NULL, NULL),
  ('I like double-checking my homework for mistakes.', 'yes_no', NULL, NULL),
  ('I enjoy maintaining a diary, planner, or timetable.', 'yes_no', NULL, NULL),
  ('I like arranging things in a specific, orderly way.', 'yes_no', NULL, NULL),
  ('I enjoy work that has clear right-or-wrong answers.', 'yes_no', NULL, NULL),
  ('I like keeping my desk, room, or bag neatly organized.', 'yes_no', NULL, NULL),
  ('I enjoy counting, tallying, or measuring things precisely.', 'yes_no', NULL, NULL),
  ('I like tasks where I need to follow a procedure exactly.', 'yes_no', NULL, NULL),
  ('I enjoy filing or organizing papers and records.', 'yes_no', NULL, NULL),
  ('I like checking that rules are being followed in group activities.', 'yes_no', NULL, NULL),
  ('I enjoy data entry, record-keeping, or tracking activities.', 'yes_no', NULL, NULL),
  ('I like preparing neatly formatted notes or summaries.', 'yes_no', NULL, NULL),
  ('I enjoy activities that reward precision and attention to detail.', 'yes_no', NULL, NULL),
  ('I like keeping systems consistent rather than changing them often.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'R-Realistic'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Repairing a bicycle or motorbike.', 'yes_no', NULL, NULL),
  ('Building a working model of a bridge or structure.', 'yes_no', NULL, NULL),
  ('Learning to operate heavy machinery or equipment.', 'yes_no', NULL, NULL),
  ('Working on a farm or in a nursery growing crops.', 'yes_no', NULL, NULL),
  ('Carrying out practical lab experiments rather than writing reports.', 'yes_no', NULL, NULL),
  ('Assembling electronic circuits or devices.', 'yes_no', NULL, NULL),
  ('Operating construction or engineering tools on a site.', 'yes_no', NULL, NULL),
  ('Training animals for work or performance.', 'yes_no', NULL, NULL),
  ('Working in a workshop making furniture or metal objects.', 'yes_no', NULL, NULL),
  ('Setting up electrical wiring in a building.', 'yes_no', NULL, NULL),
  ('Using surveying equipment to measure land.', 'yes_no', NULL, NULL),
  ('Operating a 3D printer or CNC machine.', 'yes_no', NULL, NULL),
  ('Maintaining and servicing vehicles or engines.', 'yes_no', NULL, NULL),
  ('Working in a kitchen preparing food in large quantities.', 'yes_no', NULL, NULL),
  ('Building robots or mechanical devices from scratch.', 'yes_no', NULL, NULL),
  ('Installing plumbing or pipework in a building.', 'yes_no', NULL, NULL),
  ('Working as a chef, baker, or food technologist.', 'yes_no', NULL, NULL),
  ('Doing fieldwork in geology, geography, or environmental science.', 'yes_no', NULL, NULL),
  ('Operating audio-visual or stage equipment for events.', 'yes_no', NULL, NULL),
  ('Working in sports coaching or physical training.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'I-Investigative'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Conducting a science experiment to test a hypothesis.', 'yes_no', NULL, NULL),
  ('Analyzing data from a survey or scientific study.', 'yes_no', NULL, NULL),
  ('Reading academic papers or research articles for interest.', 'yes_no', NULL, NULL),
  ('Figuring out the root cause of a technical problem.', 'yes_no', NULL, NULL),
  ('Designing a coding project to solve a real-world problem.', 'yes_no', NULL, NULL),
  ('Exploring patterns in mathematics or statistics.', 'yes_no', NULL, NULL),
  ('Studying how diseases spread and how they can be prevented.', 'yes_no', NULL, NULL),
  ('Investigating the causes of a historical or social event.', 'yes_no', NULL, NULL),
  ('Developing a new theory or testing an existing one.', 'yes_no', NULL, NULL),
  ('Working in a laboratory analyzing chemical or biological samples.', 'yes_no', NULL, NULL),
  ('Using logic and reasoning to solve complex puzzles.', 'yes_no', NULL, NULL),
  ('Researching a topic deeply before forming an opinion.', 'yes_no', NULL, NULL),
  ('Studying astronomy, physics, or advanced mathematics.', 'yes_no', NULL, NULL),
  ('Writing a research report or investigative essay.', 'yes_no', NULL, NULL),
  ('Analyzing maps, geological formations, or satellite data.', 'yes_no', NULL, NULL),
  ('Diagnosing what''s wrong with a broken device or system.', 'yes_no', NULL, NULL),
  ('Studying animal behavior in natural or controlled environments.', 'yes_no', NULL, NULL),
  ('Designing an experiment to test an idea you had.', 'yes_no', NULL, NULL),
  ('Working with AI, machine learning, or data science tools.', 'yes_no', NULL, NULL),
  ('Exploring how economic or political systems work.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'A-Artistic'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Writing an original short story, poem, or screenplay.', 'yes_no', NULL, NULL),
  ('Composing or producing music using instruments or software.', 'yes_no', NULL, NULL),
  ('Designing a logo, brand identity, or poster.', 'yes_no', NULL, NULL),
  ('Acting in a play, film, or YouTube production.', 'yes_no', NULL, NULL),
  ('Creating an animation or motion graphics video.', 'yes_no', NULL, NULL),
  ('Illustrating a graphic novel or comic book.', 'yes_no', NULL, NULL),
  ('Designing the layout of a magazine or website.', 'yes_no', NULL, NULL),
  ('Directing a short film or documentary.', 'yes_no', NULL, NULL),
  ('Creating fashion designs or textile patterns.', 'yes_no', NULL, NULL),
  ('Performing in a dance recital or cultural event.', 'yes_no', NULL, NULL),
  ('Curating an art exhibition or photography portfolio.', 'yes_no', NULL, NULL),
  ('Designing the set or costumes for a school production.', 'yes_no', NULL, NULL),
  ('Writing and publishing a blog or social media content series.', 'yes_no', NULL, NULL),
  ('Creating digital illustrations using design software.', 'yes_no', NULL, NULL),
  ('Expressing a social message through visual art or street art.', 'yes_no', NULL, NULL),
  ('Designing the user interface of a mobile app.', 'yes_no', NULL, NULL),
  ('Writing lyrics for a song and setting them to music.', 'yes_no', NULL, NULL),
  ('Translating a poem from one language to another creatively.', 'yes_no', NULL, NULL),
  ('Creating a sculpture, installation, or 3D artwork.', 'yes_no', NULL, NULL),
  ('Developing a personal artistic style in any creative medium.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'S-Social'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Teaching younger students a subject you''re strong in.', 'yes_no', NULL, NULL),
  ('Counseling a classmate going through personal difficulties.', 'yes_no', NULL, NULL),
  ('Volunteering at a hospital, shelter, or community kitchen.', 'yes_no', NULL, NULL),
  ('Organizing awareness campaigns for social or health issues.', 'yes_no', NULL, NULL),
  ('Facilitating a group discussion or student meeting.', 'yes_no', NULL, NULL),
  ('Mentoring students who are struggling academically.', 'yes_no', NULL, NULL),
  ('Working with children who have learning difficulties.', 'yes_no', NULL, NULL),
  ('Translating or interpreting for people who can''t communicate.', 'yes_no', NULL, NULL),
  ('Running a peer support group for students.', 'yes_no', NULL, NULL),
  ('Educating families in rural areas about health or hygiene.', 'yes_no', NULL, NULL),
  ('Coordinating volunteers for a social cause or event.', 'yes_no', NULL, NULL),
  ('Listening to and documenting people''s stories for awareness.', 'yes_no', NULL, NULL),
  ('Working as a sports coach, yoga instructor, or therapist.', 'yes_no', NULL, NULL),
  ('Supporting the elderly or specially abled in daily activities.', 'yes_no', NULL, NULL),
  ('Designing programs to help students with mental health.', 'yes_no', NULL, NULL),
  ('Organizing inter-school events and managing student relations.', 'yes_no', NULL, NULL),
  ('Being a school representative for student welfare issues.', 'yes_no', NULL, NULL),
  ('Training others in first aid, safety, or life skills.', 'yes_no', NULL, NULL),
  ('Facilitating conflict resolution between classmates.', 'yes_no', NULL, NULL),
  ('Working as a guide, interpreter, or cultural ambassador.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'E-Enterprising'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Starting and running a small business or side-project.', 'yes_no', NULL, NULL),
  ('Pitching an idea to teachers, judges, or investors.', 'yes_no', NULL, NULL),
  ('Campaigning for a leadership role in the student council.', 'yes_no', NULL, NULL),
  ('Organizing a fundraiser or school event from scratch.', 'yes_no', NULL, NULL),
  ('Negotiating a deal or agreement between two groups.', 'yes_no', NULL, NULL),
  ('Managing a team of people to deliver a project.', 'yes_no', NULL, NULL),
  ('Developing a marketing plan for a product or cause.', 'yes_no', NULL, NULL),
  ('Debating in competitions against other schools or teams.', 'yes_no', NULL, NULL),
  ('Motivating teammates who are underperforming.', 'yes_no', NULL, NULL),
  ('Creating a plan to grow a club, team, or initiative.', 'yes_no', NULL, NULL),
  ('Identifying gaps in the market and proposing solutions.', 'yes_no', NULL, NULL),
  ('Representing your school or group in external competitions.', 'yes_no', NULL, NULL),
  ('Making strategic decisions under time pressure.', 'yes_no', NULL, NULL),
  ('Winning a competition by persuading others of your idea.', 'yes_no', NULL, NULL),
  ('Building and managing social media accounts for a cause.', 'yes_no', NULL, NULL),
  ('Evaluating which of two business plans is better and why.', 'yes_no', NULL, NULL),
  ('Leading a protest, petition, or student rights campaign.', 'yes_no', NULL, NULL),
  ('Creating a startup pitch deck for a new product idea.', 'yes_no', NULL, NULL),
  ('Setting and tracking monthly goals for a personal project.', 'yes_no', NULL, NULL),
  ('Running a mock stock market or business simulation game.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'C-Conventional'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Maintaining detailed records or accounts for a school club.', 'yes_no', NULL, NULL),
  ('Data entry and organizing information in spreadsheets.', 'yes_no', NULL, NULL),
  ('Proofreading and formatting a school magazine or newsletter.', 'yes_no', NULL, NULL),
  ('Managing schedules, calendars, or timetables for an event.', 'yes_no', NULL, NULL),
  ('Filing and archiving documents for a project or office.', 'yes_no', NULL, NULL),
  ('Auditing expenses and checking for errors in financial records.', 'yes_no', NULL, NULL),
  ('Preparing structured reports from collected data.', 'yes_no', NULL, NULL),
  ('Following strict protocols in a legal or medical setting.', 'yes_no', NULL, NULL),
  ('Ensuring regulatory compliance for a school event.', 'yes_no', NULL, NULL),
  ('Creating and maintaining databases of students or resources.', 'yes_no', NULL, NULL),
  ('Processing and verifying forms or applications.', 'yes_no', NULL, NULL),
  ('Coordinating logistics for a school trip or function.', 'yes_no', NULL, NULL),
  ('Tracking inventory or supplies for a lab or library.', 'yes_no', NULL, NULL),
  ('Designing forms, templates, or checklists for a system.', 'yes_no', NULL, NULL),
  ('Cross-checking information for accuracy before publishing.', 'yes_no', NULL, NULL),
  ('Writing clear, structured minutes of a meeting.', 'yes_no', NULL, NULL),
  ('Producing financial summaries or budget breakdowns.', 'yes_no', NULL, NULL),
  ('Managing a library, archive, or records system.', 'yes_no', NULL, NULL),
  ('Applying strict quality checks to a product or output.', 'yes_no', NULL, NULL),
  ('Handling administrative paperwork for an organization.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SDS — R (Realistic)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Designing and building a prototype for an engineering project.', 'yes_no', NULL, NULL),
  ('Operating technical equipment in a lab or field setting.', 'yes_no', NULL, NULL),
  ('Working with precision tools to manufacture or repair something.', 'yes_no', NULL, NULL),
  ('Studying civil or mechanical engineering at university.', 'yes_no', NULL, NULL),
  ('Doing vocational training in electrical, plumbing, or construction.', 'yes_no', NULL, NULL),
  ('Taking up agriculture or environmental science as a career.', 'yes_no', NULL, NULL),
  ('Joining the military, police, or paramilitary as a profession.', 'yes_no', NULL, NULL),
  ('Learning to drive and operate heavy vehicles or aircraft.', 'yes_no', NULL, NULL),
  ('Working in sports science, physiotherapy, or physical training.', 'yes_no', NULL, NULL),
  ('Pursuing a career in culinary arts or hospitality management.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SDS — I (Investigative)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Pursuing research in physics, chemistry, or biology.', 'yes_no', NULL, NULL),
  ('Studying medicine, dentistry, or pharmacy at university.', 'yes_no', NULL, NULL),
  ('Analyzing data for a science or economics project.', 'yes_no', NULL, NULL),
  ('Developing software or algorithms for solving problems.', 'yes_no', NULL, NULL),
  ('Investigating environmental or climate-related issues.', 'yes_no', NULL, NULL),
  ('Studying psychology, neuroscience, or behavioral science.', 'yes_no', NULL, NULL),
  ('Researching the causes and cures of diseases.', 'yes_no', NULL, NULL),
  ('Building mathematical models to explain real-world phenomena.', 'yes_no', NULL, NULL),
  ('Pursuing a career in data science, AI, or machine learning.', 'yes_no', NULL, NULL),
  ('Working in forensic science or criminal investigation.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SDS — A (Artistic)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Pursuing a degree in fine arts, design, or architecture.', 'yes_no', NULL, NULL),
  ('Studying film-making, scriptwriting, or media production.', 'yes_no', NULL, NULL),
  ('Building a portfolio for fashion design or textile arts.', 'yes_no', NULL, NULL),
  ('Working as a content creator, animator, or UI/UX designer.', 'yes_no', NULL, NULL),
  ('Writing and publishing original fiction or journalism.', 'yes_no', NULL, NULL),
  ('Performing or composing music as a career path.', 'yes_no', NULL, NULL),
  ('Pursuing theatre, dance, or dramatic arts at university.', 'yes_no', NULL, NULL),
  ('Designing brand identities or advertising campaigns.', 'yes_no', NULL, NULL),
  ('Working in game design or interactive media.', 'yes_no', NULL, NULL),
  ('Studying literature, creative writing, or linguistics.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SDS — S (Social)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Studying education to become a teacher or school counselor.', 'yes_no', NULL, NULL),
  ('Pursuing social work, community development, or NGO work.', 'yes_no', NULL, NULL),
  ('Working in healthcare as a nurse, doctor, or therapist.', 'yes_no', NULL, NULL),
  ('Studying psychology to help people with mental health.', 'yes_no', NULL, NULL),
  ('Becoming a career counselor, life coach, or mentor.', 'yes_no', NULL, NULL),
  ('Working in nonprofit or development sector organizations.', 'yes_no', NULL, NULL),
  ('Studying law to defend or support people in need.', 'yes_no', NULL, NULL),
  ('Pursuing public health, epidemiology, or community medicine.', 'yes_no', NULL, NULL),
  ('Becoming a sports coach, physical education teacher, or trainer.', 'yes_no', NULL, NULL),
  ('Volunteering as a first responder or disaster relief worker.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SDS — E (Enterprising)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Starting a business or entrepreneurial venture after school.', 'yes_no', NULL, NULL),
  ('Pursuing a degree in business, management, or economics.', 'yes_no', NULL, NULL),
  ('Working in marketing, public relations, or advertising.', 'yes_no', NULL, NULL),
  ('Studying law for corporate or commercial practice.', 'yes_no', NULL, NULL),
  ('Taking on leadership roles in college or corporate settings.', 'yes_no', NULL, NULL),
  ('Working in politics, governance, or public administration.', 'yes_no', NULL, NULL),
  ('Pursuing sales, real estate, or financial advising.', 'yes_no', NULL, NULL),
  ('Running campaigns, events, or initiatives for a cause.', 'yes_no', NULL, NULL),
  ('Studying finance, investment banking, or consulting.', 'yes_no', NULL, NULL),
  ('Working in media, journalism, or broadcasting.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SDS — C (Conventional)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Pursuing a degree in accounting, finance, or economics.', 'yes_no', NULL, NULL),
  ('Working in banking, insurance, or tax consultancy.', 'yes_no', NULL, NULL),
  ('Studying library science, records management, or archiving.', 'yes_no', NULL, NULL),
  ('Working as an administrative officer or government employee.', 'yes_no', NULL, NULL),
  ('Pursuing a career in auditing, compliance, or quality assurance.', 'yes_no', NULL, NULL),
  ('Managing databases, inventories, or logistics systems.', 'yes_no', NULL, NULL),
  ('Working in secretarial, paralegal, or court administration roles.', 'yes_no', NULL, NULL),
  ('Studying statistics or actuarial science for a career.', 'yes_no', NULL, NULL),
  ('Working in operations management or supply chain.', 'yes_no', NULL, NULL),
  ('Pursuing civil services or government administrative exams.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SII — R (Realistic — Occupational Themes)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Working as a civil engineer designing roads or bridges.', 'yes_no', NULL, NULL),
  ('Being an aircraft pilot or aviation technician.', 'yes_no', NULL, NULL),
  ('Working as an agricultural scientist or soil conservationist.', 'yes_no', NULL, NULL),
  ('Becoming a marine engineer or ship navigation officer.', 'yes_no', NULL, NULL),
  ('Working as an auto technician or robotic systems engineer.', 'yes_no', NULL, NULL),
  ('Being a surveyor mapping land for construction projects.', 'yes_no', NULL, NULL),
  ('Working as a forest ranger or wildlife conservation officer.', 'yes_no', NULL, NULL),
  ('Becoming an electrician or power systems engineer.', 'yes_no', NULL, NULL),
  ('Working as a chef or executive chef in a luxury hotel.', 'yes_no', NULL, NULL),
  ('Becoming a fitness trainer or sports rehabilitation specialist.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SII — I (Investigative — Occupational Themes)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Working as a research scientist in a university or lab.', 'yes_no', NULL, NULL),
  ('Becoming a medical doctor specializing in diagnostics.', 'yes_no', NULL, NULL),
  ('Being a data analyst or quantitative researcher.', 'yes_no', NULL, NULL),
  ('Working as a software engineer at a tech company.', 'yes_no', NULL, NULL),
  ('Becoming a forensic expert or crime scene investigator.', 'yes_no', NULL, NULL),
  ('Working as an economist analyzing government policy.', 'yes_no', NULL, NULL),
  ('Becoming a biologist studying ecosystems or genetics.', 'yes_no', NULL, NULL),
  ('Working as a statistician designing surveys or models.', 'yes_no', NULL, NULL),
  ('Being a pharmacist researching drug efficacy.', 'yes_no', NULL, NULL),
  ('Becoming a neurologist or psychiatrist studying the brain.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SII — A (Artistic — Occupational Themes)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Working as an architect designing public spaces or homes.', 'yes_no', NULL, NULL),
  ('Becoming a film director or screenwriter.', 'yes_no', NULL, NULL),
  ('Working as a graphic designer or visual communication expert.', 'yes_no', NULL, NULL),
  ('Becoming a musician, composer, or music producer.', 'yes_no', NULL, NULL),
  ('Working as a fashion stylist or costume designer.', 'yes_no', NULL, NULL),
  ('Becoming a game designer or creative director at a studio.', 'yes_no', NULL, NULL),
  ('Working as a UX designer crafting digital experiences.', 'yes_no', NULL, NULL),
  ('Becoming an interior designer or set designer.', 'yes_no', NULL, NULL),
  ('Working as a novelist, editor, or literary journalist.', 'yes_no', NULL, NULL),
  ('Becoming a choreographer or performing arts director.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SII — S (Social — Occupational Themes)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Working as a high school teacher in your favorite subject.', 'yes_no', NULL, NULL),
  ('Becoming a school counselor or educational psychologist.', 'yes_no', NULL, NULL),
  ('Working as a social welfare officer in a state government.', 'yes_no', NULL, NULL),
  ('Becoming a hospital nurse or patient care coordinator.', 'yes_no', NULL, NULL),
  ('Working as a speech therapist or occupational therapist.', 'yes_no', NULL, NULL),
  ('Becoming a child psychologist or play therapist.', 'yes_no', NULL, NULL),
  ('Working as a nonprofit director running social programs.', 'yes_no', NULL, NULL),
  ('Becoming a family mediator or community legal aid worker.', 'yes_no', NULL, NULL),
  ('Working as a yoga or wellness instructor.', 'yes_no', NULL, NULL),
  ('Becoming a career guidance counselor at a university.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SII — E (Enterprising — Occupational Themes)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Becoming a startup founder in a field you''re passionate about.', 'yes_no', NULL, NULL),
  ('Working as a management consultant advising companies.', 'yes_no', NULL, NULL),
  ('Becoming a marketing director at a consumer brand.', 'yes_no', NULL, NULL),
  ('Working as a TV anchor, journalist, or media presenter.', 'yes_no', NULL, NULL),
  ('Becoming a real estate developer or property consultant.', 'yes_no', NULL, NULL),
  ('Working as a venture capitalist or angel investor.', 'yes_no', NULL, NULL),
  ('Becoming a politician or policy advisor.', 'yes_no', NULL, NULL),
  ('Working as a brand strategist for a large corporation.', 'yes_no', NULL, NULL),
  ('Becoming a motivational speaker or corporate trainer.', 'yes_no', NULL, NULL),
  ('Working as a talent manager or sports agent.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SII — C (Conventional — Occupational Themes)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Becoming a chartered accountant or CPA.', 'yes_no', NULL, NULL),
  ('Working as an IAS or IRS officer in the civil services.', 'yes_no', NULL, NULL),
  ('Becoming an actuary calculating financial risk.', 'yes_no', NULL, NULL),
  ('Working as a compliance officer in a bank or corporation.', 'yes_no', NULL, NULL),
  ('Becoming a court reporter or legal document specialist.', 'yes_no', NULL, NULL),
  ('Working as a quality control manager in manufacturing.', 'yes_no', NULL, NULL),
  ('Becoming a librarian or records management professional.', 'yes_no', NULL, NULL),
  ('Working as a payroll specialist or HR administrator.', 'yes_no', NULL, NULL),
  ('Becoming a tax consultant or customs officer.', 'yes_no', NULL, NULL),
  ('Working as a logistics coordinator or supply chain analyst.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SDS Standard — R (Realistic)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Designing and building physical prototypes or systems.', 'yes_no', NULL, NULL),
  ('Working with precision instruments in a lab or field.', 'yes_no', NULL, NULL),
  ('Pursuing engineering, manufacturing, or construction roles.', 'yes_no', NULL, NULL),
  ('Operating or programming robotics and automation equipment.', 'yes_no', NULL, NULL),
  ('Working in agriculture, forestry, or environmental conservation.', 'yes_no', NULL, NULL),
  ('Performing hands-on repairs or maintenance of equipment.', 'yes_no', NULL, NULL),
  ('Pursuing vocational or technical certification as a career strategy.', 'yes_no', NULL, NULL),
  ('Working outdoors in fieldwork, mining, or surveying roles.', 'yes_no', NULL, NULL),
  ('Joining defense, paramilitary, or emergency services.', 'yes_no', NULL, NULL),
  ('Pursuing sports science, kinesiology, or physical rehabilitation.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SDS Standard — I (Investigative)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Designing research studies and analyzing outcomes.', 'yes_no', NULL, NULL),
  ('Working in data science, bioinformatics, or computational modeling.', 'yes_no', NULL, NULL),
  ('Pursuing graduate research in a STEM field.', 'yes_no', NULL, NULL),
  ('Diagnosing technical, medical, or organizational problems.', 'yes_no', NULL, NULL),
  ('Studying or working in economics, behavioral science, or policy research.', 'yes_no', NULL, NULL),
  ('Developing algorithms or software for complex problem-solving.', 'yes_no', NULL, NULL),
  ('Publishing academic papers or presenting research findings.', 'yes_no', NULL, NULL),
  ('Investigating financial, legal, or forensic questions methodically.', 'yes_no', NULL, NULL),
  ('Working in pharmaceutical research or clinical trials.', 'yes_no', NULL, NULL),
  ('Pursuing a PhD or research fellowship in your discipline.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SDS Standard — A (Artistic)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Building a portfolio of creative or design work for employers.', 'yes_no', NULL, NULL),
  ('Pursuing a career in UI/UX design, animation, or digital media.', 'yes_no', NULL, NULL),
  ('Writing for publications, brands, or content platforms.', 'yes_no', NULL, NULL),
  ('Directing or producing video, film, or podcast content.', 'yes_no', NULL, NULL),
  ('Designing brand identities, campaigns, or visual communications.', 'yes_no', NULL, NULL),
  ('Working in architecture, interior design, or spatial design.', 'yes_no', NULL, NULL),
  ('Composing, producing, or performing music professionally.', 'yes_no', NULL, NULL),
  ('Pursuing fashion, textile, or product design as a career.', 'yes_no', NULL, NULL),
  ('Working in performing arts as an actor, dancer, or director.', 'yes_no', NULL, NULL),
  ('Creating educational content, games, or interactive media.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SDS Standard — S (Social)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Teaching at a school, college, or training institution.', 'yes_no', NULL, NULL),
  ('Working in student affairs, campus counseling, or academic advising.', 'yes_no', NULL, NULL),
  ('Pursuing social work, community development, or public health.', 'yes_no', NULL, NULL),
  ('Working as a therapist, counselor, or mental health professional.', 'yes_no', NULL, NULL),
  ('Designing and running programs for NGOs or international organizations.', 'yes_no', NULL, NULL),
  ('Facilitating workshops, training, or capacity-building programs.', 'yes_no', NULL, NULL),
  ('Working as a doctor, nurse, or allied health professional.', 'yes_no', NULL, NULL),
  ('Pursuing law to advocate for underserved communities.', 'yes_no', NULL, NULL),
  ('Working as an HR professional focused on employee well-being.', 'yes_no', NULL, NULL),
  ('Running peer mentoring or youth leadership programs.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SDS Standard — E (Enterprising)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Starting a venture or joining a startup in an early-stage role.', 'yes_no', NULL, NULL),
  ('Working in sales, business development, or account management.', 'yes_no', NULL, NULL),
  ('Pursuing product management or growth roles at tech companies.', 'yes_no', NULL, NULL),
  ('Working in consulting, strategy, or financial advisory.', 'yes_no', NULL, NULL),
  ('Managing projects, teams, or clients in a fast-paced environment.', 'yes_no', NULL, NULL),
  ('Pursuing marketing, brand management, or PR.', 'yes_no', NULL, NULL),
  ('Running a student organization or entrepreneurship cell.', 'yes_no', NULL, NULL),
  ('Working in investment banking, private equity, or venture capital.', 'yes_no', NULL, NULL),
  ('Leading initiatives that require persuasion and influence.', 'yes_no', NULL, NULL),
  ('Pursuing policy work, lobbying, or public affairs roles.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SDS Standard — C (Conventional)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Working in accounting, financial analysis, or audit.', 'yes_no', NULL, NULL),
  ('Pursuing roles in banking operations, compliance, or risk management.', 'yes_no', NULL, NULL),
  ('Working in government administration or civil services.', 'yes_no', NULL, NULL),
  ('Managing data, records, or information systems at an organization.', 'yes_no', NULL, NULL),
  ('Working in HR operations, payroll, or employee records.', 'yes_no', NULL, NULL),
  ('Pursuing roles in quality assurance, regulatory affairs, or standards.', 'yes_no', NULL, NULL),
  ('Working as a paralegal, court clerk, or legal administrator.', 'yes_no', NULL, NULL),
  ('Pursuing actuarial science, statistics, or operations research.', 'yes_no', NULL, NULL),
  ('Working in logistics, supply chain, or procurement.', 'yes_no', NULL, NULL),
  ('Pursuing tax consulting, customs, or government finance roles.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SII — R (Occupational Themes at Graduate Level)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Product design or manufacturing engineering at a firm.', 'yes_no', NULL, NULL),
  ('Civil or structural engineering on infrastructure projects.', 'yes_no', NULL, NULL),
  ('Marine, aviation, or aerospace engineering.', 'yes_no', NULL, NULL),
  ('Agricultural science or agronomy research and extension.', 'yes_no', NULL, NULL),
  ('Environmental science field consulting or monitoring.', 'yes_no', NULL, NULL),
  ('Sports coaching, physiotherapy, or athletic training.', 'yes_no', NULL, NULL),
  ('Culinary arts management or food technology research.', 'yes_no', NULL, NULL),
  ('Robotics engineering or mechatronics systems design.', 'yes_no', NULL, NULL),
  ('Petroleum, chemical, or process engineering.', 'yes_no', NULL, NULL),
  ('Military officer or defense research role.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SII — I (Occupational Themes at Graduate Level)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Biomedical research or clinical pharmacology.', 'yes_no', NULL, NULL),
  ('Machine learning engineering or AI research.', 'yes_no', NULL, NULL),
  ('Financial econometrics or quantitative analysis.', 'yes_no', NULL, NULL),
  ('Epidemiology or global health research.', 'yes_no', NULL, NULL),
  ('Cognitive science or behavioral economics research.', 'yes_no', NULL, NULL),
  ('Forensic accounting or fraud investigation.', 'yes_no', NULL, NULL),
  ('Astrophysics, quantum physics, or materials science.', 'yes_no', NULL, NULL),
  ('Neuroscience research or neurological diagnostics.', 'yes_no', NULL, NULL),
  ('Cybersecurity research or ethical hacking.', 'yes_no', NULL, NULL),
  ('Environmental chemistry or geoscience research.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SII — A (Occupational Themes at Graduate Level)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Creative direction at an advertising or design agency.', 'yes_no', NULL, NULL),
  ('Screenwriting or narrative design for film and games.', 'yes_no', NULL, NULL),
  ('Urban planning or architectural design.', 'yes_no', NULL, NULL),
  ('Independent music production or sound engineering.', 'yes_no', NULL, NULL),
  ('Fashion design or textile engineering for brands.', 'yes_no', NULL, NULL),
  ('Editorial journalism or long-form investigative writing.', 'yes_no', NULL, NULL),
  ('Illustration, concept art, or visual development for media.', 'yes_no', NULL, NULL),
  ('UX research and experience design for products.', 'yes_no', NULL, NULL),
  ('Performing arts direction or cultural programming.', 'yes_no', NULL, NULL),
  ('Documentary filmmaking or photojournalism.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SII — S (Occupational Themes at Graduate Level)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('School teaching or academic instruction in your subject.', 'yes_no', NULL, NULL),
  ('University student counseling or career advising.', 'yes_no', NULL, NULL),
  ('Community health outreach or public health education.', 'yes_no', NULL, NULL),
  ('Speech-language pathology or occupational therapy.', 'yes_no', NULL, NULL),
  ('International development or humanitarian aid work.', 'yes_no', NULL, NULL),
  ('Clinical psychology or mental health counseling.', 'yes_no', NULL, NULL),
  ('Youth worker, social services officer, or probation officer.', 'yes_no', NULL, NULL),
  ('Corporate L&D or organizational training specialist.', 'yes_no', NULL, NULL),
  ('Diversity, equity, and inclusion program manager.', 'yes_no', NULL, NULL),
  ('Refugee or migrant support services coordinator.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SII — E (Occupational Themes at Graduate Level)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Product management at a technology startup.', 'yes_no', NULL, NULL),
  ('Brand management or category management at an FMCG company.', 'yes_no', NULL, NULL),
  ('Strategy consulting at a management or boutique consultancy.', 'yes_no', NULL, NULL),
  ('Investment banking analyst or private equity associate.', 'yes_no', NULL, NULL),
  ('Venture capital analyst or startup scout.', 'yes_no', NULL, NULL),
  ('Digital marketing manager or performance growth lead.', 'yes_no', NULL, NULL),
  ('Public affairs and government relations specialist.', 'yes_no', NULL, NULL),
  ('Real estate investment analyst or developer.', 'yes_no', NULL, NULL),
  ('Campus placement officer or talent acquisition specialist.', 'yes_no', NULL, NULL),
  ('Political campaign manager or policy communications lead.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'SII — C (Occupational Themes at Graduate Level)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Career Interests'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Chartered accountant or CPA at a Big 4 firm.', 'yes_no', NULL, NULL),
  ('Compliance analyst at a bank or financial institution.', 'yes_no', NULL, NULL),
  ('Government budget analyst or public finance officer.', 'yes_no', NULL, NULL),
  ('Data governance or master data management specialist.', 'yes_no', NULL, NULL),
  ('Legal operations analyst or contract management associate.', 'yes_no', NULL, NULL),
  ('Insurance underwriter or risk analyst.', 'yes_no', NULL, NULL),
  ('Supply chain analyst or logistics operations coordinator.', 'yes_no', NULL, NULL),
  ('Payroll manager or benefits administrator in HR.', 'yes_no', NULL, NULL),
  ('Tax consultant or indirect tax specialist.', 'yes_no', NULL, NULL),
  ('Quality management systems auditor or ISO compliance officer.', 'yes_no', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Numerical Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('What is 45 + 78?', 'mcq', '["123", "125", "122", "133"]'::jsonb, 'A'),
  ('What is 123 + 256?', 'mcq', '["381", "379", "378", "389"]'::jsonb, 'B'),
  ('What is 389 + 214?', 'mcq', '["603", "613", "602", "605"]'::jsonb, 'A'),
  ('What is 560 + 275?', 'mcq', '["834", "845", "835", "837"]'::jsonb, 'C'),
  ('What is 834 − 256?', 'mcq', '["580", "588", "578", "575"]'::jsonb, 'C'),
  ('What is 701 − 348?', 'mcq', '["363", "355", "350", "353"]'::jsonb, 'D'),
  ('What is 12 × 15?', 'mcq', '["190", "180", "170", "192"]'::jsonb, 'B'),
  ('What is 23 × 14?', 'mcq', '["332", "345", "312", "322"]'::jsonb, 'D'),
  ('What is 18 × 17?', 'mcq', '["316", "296", "324", "306"]'::jsonb, 'D'),
  ('What is 25 × 16?', 'mcq', '["425", "400", "390", "410"]'::jsonb, 'B'),
  ('What is 144 ÷ 12?', 'mcq', '["12", "11", "13", "14"]'::jsonb, 'A'),
  ('What is 196 ÷ 14?', 'mcq', '["16", "14", "13", "15"]'::jsonb, 'B'),
  ('What is 15% of 200?', 'mcq', '["40", "30", "35", "25"]'::jsonb, 'B'),
  ('What is 25% of 160?', 'mcq', '["50", "35", "45", "40"]'::jsonb, 'D'),
  ('What is 10% of 450?', 'mcq', '["50", "45", "40", "55"]'::jsonb, 'B'),
  ('What is 20% of 350?', 'mcq', '["80", "70", "75", "65"]'::jsonb, 'B'),
  ('What is 40% of 125?', 'mcq', '["55", "60", "50", "45"]'::jsonb, 'C'),
  ('What is 5% of 600?', 'mcq', '["25", "40", "35", "30"]'::jsonb, 'D'),
  ('What is 1/4 of 200?', 'mcq', '["60", "50", "45", "40"]'::jsonb, 'B'),
  ('What is 3/5 of 150?', 'mcq', '["80", "95", "85", "90"]'::jsonb, 'D'),
  ('Add: 1/2 + 1/4', 'mcq', '["5/8", "1/6", "3/4", "2/6"]'::jsonb, 'C'),
  ('What is 0.5 + 0.25?', 'mcq', '["0.75", "0.8", "0.7", "1.0"]'::jsonb, 'A'),
  ('What is 2.5 × 4?', 'mcq', '["9", "11", "10", "12"]'::jsonb, 'C'),
  ('Which fraction is greater: 3/4 or 5/8?', 'mcq', '["Cannot say", "3/4", "5/8", "They are equal"]'::jsonb, 'B'),
  ('If 8 pens cost ₹96, what is the cost of 1 pen?', 'mcq', '["13", "12", "10", "11"]'::jsonb, 'B'),
  ('A recipe needs 2 cups flour for 6 cookies. How many cups for 18 cookies?', 'mcq', '["4", "5", "6", "8"]'::jsonb, 'C'),
  ('The ratio of boys to girls in a class is 3:2. If there are 12 boys, how many girls are there?', 'mcq', '["10", "8", "9", "6"]'::jsonb, 'B'),
  ('Divide 60 sweets between two friends in the ratio 2:3. How many does the second friend get?', 'mcq', '["24", "30", "40", "36"]'::jsonb, 'D'),
  ('A car travels 150 km using 10 litres of fuel. How far can it travel on 4 litres?', 'mcq', '["50", "45", "60", "70"]'::jsonb, 'C'),
  ('If 5 books cost ₹250, what do 8 books cost?', 'mcq', '["350", "400", "375", "450"]'::jsonb, 'B'),
  ('Which number comes next in the series: 2, 4, 8, 16, __?', 'mcq', '["32", "28", "36", "24"]'::jsonb, 'A'),
  ('Which number comes next in the series: 5, 10, 15, 20, __?', 'mcq', '["30", "24", "22", "25"]'::jsonb, 'D'),
  ('Which number comes next in the series: 1, 4, 9, 16, __?', 'mcq', '["24", "30", "25", "20"]'::jsonb, 'C'),
  ('Which number comes next in the series: 3, 6, 12, 24, __?', 'mcq', '["36", "50", "48", "40"]'::jsonb, 'C'),
  ('Which number comes next in the series: 100, 90, 80, 70, __?', 'mcq', '["65", "60", "55", "50"]'::jsonb, 'B'),
  ('Which number comes next in the series: 2, 5, 10, 17, __?', 'mcq', '["24", "25", "28", "26"]'::jsonb, 'D'),
  ('A rectangle has length 12 cm and width 5 cm. What is its area?', 'mcq', '["65", "60", "55", "70"]'::jsonb, 'B'),
  ('A square has a side of 9 cm. What is its perimeter?', 'mcq', '["36", "45", "32", "40"]'::jsonb, 'A'),
  ('A rectangle has length 15 m and width 4 m. What is its perimeter?', 'mcq', '["36", "40", "42", "38"]'::jsonb, 'D'),
  ('A square has an area of 49 cm². What is the length of one side?', 'mcq', '["9", "7", "8", "6"]'::jsonb, 'B'),
  ('A triangle has a base of 10 cm and height of 6 cm. What is its area?', 'mcq', '["40", "25", "35", "30"]'::jsonb, 'D'),
  ('How many sides does a hexagon have?', 'mcq', '["6", "5", "8", "7"]'::jsonb, 'A'),
  ('A train travels 60 km in 1 hour. How far will it travel in 3.5 hours?', 'mcq', '["210", "180", "220", "200"]'::jsonb, 'A'),
  ('A car covers 240 km in 4 hours. What is its speed in km/h?', 'mcq', '["70", "60", "55", "50"]'::jsonb, 'B'),
  ('Ravi walks 5 km in 1 hour. How long will he take to walk 15 km at the same speed?', 'mcq', '["4", "3", "5", "2"]'::jsonb, 'B'),
  ('A bus travels at 45 km/h. How far does it travel in 2 hours?', 'mcq', '["85", "90", "100", "80"]'::jsonb, 'B'),
  ('If a cyclist covers 12 km in 40 minutes, what is his speed in km/h?', 'mcq', '["16", "18", "20", "15"]'::jsonb, 'B'),
  ('A plane travels 900 km in 1.5 hours. What is its speed in km/h?', 'mcq', '["650", "600", "550", "500"]'::jsonb, 'B'),
  ('Find the average of 10, 20, and 30.', 'mcq', '["15", "25", "20", "18"]'::jsonb, 'C'),
  ('Find the average of 4, 8, 12, and 16.', 'mcq', '["12", "8", "9", "10"]'::jsonb, 'D'),
  ('A shopkeeper buys a toy for ₹80 and sells it for ₹100. What is his profit?', 'mcq', '["20", "10", "25", "15"]'::jsonb, 'A'),
  ('A book bought for ₹150 is sold for ₹120. What is the loss?', 'mcq', '["30", "35", "20", "25"]'::jsonb, 'A'),
  ('Sara has 24 chocolates and shares them equally among 6 friends. How many does each get?', 'mcq', '["3", "4", "6", "5"]'::jsonb, 'B'),
  ('There are 45 students in a class. If 18 are girls, how many are boys?', 'mcq', '["25", "28", "30", "27"]'::jsonb, 'D'),
  ('What is the HCF of 12 and 18?', 'mcq', '["4", "6", "3", "9"]'::jsonb, 'B'),
  ('What is 7² − 4²?', 'mcq', '["30", "25", "33", "35"]'::jsonb, 'C'),
  ('What is the square root of 81?', 'mcq', '["7", "8", "10", "9"]'::jsonb, 'D'),
  ('What is 2³ (2 cubed)?', 'mcq', '["4", "8", "6", "10"]'::jsonb, 'B'),
  ('If x + 5 = 12, what is x?', 'mcq', '["6", "8", "5", "7"]'::jsonb, 'D'),
  ('If 3x = 21, what is x?', 'mcq', '["9", "7", "6", "8"]'::jsonb, 'B')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Verbal Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Choose the word that means the same as ''HAPPY'':', 'mcq', '["Sad", "Tired", "Joyful", "Angry"]'::jsonb, 'C'),
  ('Choose the word that means the same as ''BEGIN'':', 'mcq', '["Finish", "Stop", "Start", "Pause"]'::jsonb, 'C'),
  ('Choose the word that means the same as ''BIG'':', 'mcq', '["Tiny", "Short", "Large", "Narrow"]'::jsonb, 'C'),
  ('Choose the word that means the same as ''QUICK'':', 'mcq', '["Weak", "Slow", "Fast", "Lazy"]'::jsonb, 'C'),
  ('Choose the word that means the same as ''BRAVE'':', 'mcq', '["Courageous", "Weak", "Shy", "Fearful"]'::jsonb, 'A'),
  ('Choose the word that means the same as ''SILENT'':', 'mcq', '["Noisy", "Talkative", "Loud", "Quiet"]'::jsonb, 'D'),
  ('Choose the word that means the same as ''SMART'':', 'mcq', '["Intelligent", "Dull", "Foolish", "Careless"]'::jsonb, 'A'),
  ('Choose the word that means the same as ''HAPPY-GO-LUCKY'':', 'mcq', '["Angry", "Serious", "Cheerful", "Gloomy"]'::jsonb, 'C'),
  ('Choose the word that means the same as ''ANCIENT'':', 'mcq', '["Recent", "Modern", "New", "Old"]'::jsonb, 'D'),
  ('Choose the word that means the same as ''GIGANTIC'':', 'mcq', '["Average", "Huge", "Tiny", "Small"]'::jsonb, 'B'),
  ('Choose the word that means the opposite of ''HOT'':', 'mcq', '["Boiling", "Cold", "Warm", "Mild"]'::jsonb, 'B'),
  ('Choose the word that means the opposite of ''HAPPY'':', 'mcq', '["Pleased", "Sad", "Cheerful", "Glad"]'::jsonb, 'B'),
  ('Choose the word that means the opposite of ''TALL'':', 'mcq', '["Long", "High", "Short", "Big"]'::jsonb, 'C'),
  ('Choose the word that means the opposite of ''EASY'':', 'mcq', '["Plain", "Basic", "Simple", "Difficult"]'::jsonb, 'D'),
  ('Choose the word that means the opposite of ''HEAVY'':', 'mcq', '["Light", "Bulky", "Dense", "Solid"]'::jsonb, 'A'),
  ('Choose the word that means the opposite of ''BRAVE'':', 'mcq', '["Bold", "Cowardly", "Fearless", "Daring"]'::jsonb, 'B'),
  ('Choose the word that means the opposite of ''ANCIENT'':', 'mcq', '["Modern", "Old", "Aged", "Antique"]'::jsonb, 'A'),
  ('Choose the word that means the opposite of ''GENEROUS'':', 'mcq', '["Kind", "Stingy", "Giving", "Charitable"]'::jsonb, 'B'),
  ('Choose the word that means the opposite of ''ARRIVE'':', 'mcq', '["Depart", "Reach", "Land", "Enter"]'::jsonb, 'A'),
  ('Choose the word that means the opposite of ''INCREASE'':', 'mcq', '["Grow", "Expand", "Decrease", "Rise"]'::jsonb, 'C'),
  ('Dog is to Puppy as Cat is to ___?', 'mcq', '["Calf", "Kitten", "Cub", "Foal"]'::jsonb, 'B'),
  ('Doctor is to Hospital as Teacher is to ___?', 'mcq', '["Garage", "School", "Kitchen", "Farm"]'::jsonb, 'B'),
  ('Foot is to Shoe as Hand is to ___?', 'mcq', '["Belt", "Glove", "Scarf", "Hat"]'::jsonb, 'B'),
  ('Bird is to Sky as Fish is to ___?', 'mcq', '["Land", "Tree", "Water", "Sand"]'::jsonb, 'C'),
  ('Pen is to Write as Knife is to ___?', 'mcq', '["Draw", "Paint", "Cut", "Read"]'::jsonb, 'C'),
  ('Author is to Book as Painter is to ___?', 'mcq', '["Movie", "Song", "Poem", "Painting"]'::jsonb, 'D'),
  ('Cow is to Milk as Bee is to ___?', 'mcq', '["Wool", "Wax", "Honey", "Silk"]'::jsonb, 'C'),
  ('Eye is to See as Ear is to ___?', 'mcq', '["Smell", "Hear", "Touch", "Taste"]'::jsonb, 'B'),
  ('Find the odd one out: Apple, Banana, Carrot, Mango', 'mcq', '["Apple", "Banana", "Carrot", "Mango"]'::jsonb, 'C'),
  ('Find the odd one out: Dog, Cat, Table, Horse', 'mcq', '["Horse", "Table", "Cat", "Dog"]'::jsonb, 'B'),
  ('Find the odd one out: Red, Blue, Green, Heavy', 'mcq', '["Red", "Blue", "Green", "Heavy"]'::jsonb, 'D'),
  ('Find the odd one out: Circle, Square, Triangle, Happy', 'mcq', '["Circle", "Square", "Happy", "Triangle"]'::jsonb, 'C'),
  ('Find the odd one out: Guitar, Piano, Drum, Chair', 'mcq', '["Guitar", "Piano", "Chair", "Drum"]'::jsonb, 'C'),
  ('Find the odd one out: Rose, Lily, Sunflower, Cabbage', 'mcq', '["Rose", "Cabbage", "Lily", "Sunflower"]'::jsonb, 'B'),
  ('Find the odd one out: Delhi, Mumbai, Chennai, India', 'mcq', '["India", "Delhi", "Chennai", "Mumbai"]'::jsonb, 'A'),
  ('Find the odd one out: Cricket, Football, Hockey, Novel', 'mcq', '["Cricket", "Novel", "Football", "Hockey"]'::jsonb, 'B'),
  ('Find the odd one out: Ant, Bee, Butterfly, Sparrow', 'mcq', '["Butterfly", "Ant", "Sparrow", "Bee"]'::jsonb, 'C'),
  ('She ___ to school every day.', 'mcq', '["walk", "walking", "walked", "walks"]'::jsonb, 'D'),
  ('They ___ playing football when it started to rain.', 'mcq', '["was", "were", "are", "is"]'::jsonb, 'B'),
  ('This is the ___ book I have ever read.', 'mcq', '["good", "well", "best", "better"]'::jsonb, 'C'),
  ('He is ___ than his brother.', 'mcq', '["taller", "tall", "tallest", "tall-er"]'::jsonb, 'A'),
  ('I have ___ finished my homework.', 'mcq', '["never", "still", "already", "yet"]'::jsonb, 'C'),
  ('The sun ___ in the east.', 'mcq', '["rising", "rises", "rose", "rise"]'::jsonb, 'B'),
  ('We ___ our friends yesterday.', 'mcq', '["visited", "visiting", "visits", "visit"]'::jsonb, 'A'),
  ('Which is the correctly spelled word?', 'mcq', '["Neccessary", "Necesary", "Necessary", "Neccesary"]'::jsonb, 'C'),
  ('Which is the correctly spelled word?', 'mcq', '["Definitly", "Defenitely", "Definately", "Definitely"]'::jsonb, 'D'),
  ('Which is the correctly spelled word?', 'mcq', '["Seperate", "Separate", "Separete", "Seprate"]'::jsonb, 'B'),
  ('Which is the correctly spelled word?', 'mcq', '["Beautifull", "Beautiful", "Beutiful", "Beautyful"]'::jsonb, 'B'),
  ('Which is the correctly spelled word?', 'mcq', '["Governement", "Governmant", "Government", "Goverment"]'::jsonb, 'C'),
  ('Which is the correctly spelled word?', 'mcq', '["Imediately", "Immediately", "Immediatly", "Imediatley"]'::jsonb, 'B'),
  ('If CAT is coded as DBU, how is DOG coded?', 'mcq', '["EPI", "DPH", "EPH", "FQI"]'::jsonb, 'C'),
  ('If A=1, B=2, C=3, what does the code 3-1-20 stand for?', 'mcq', '["CAP", "BAT", "CAT", "CAR"]'::jsonb, 'C'),
  ('In a code, PEN is written as OFO. How is BOOK written?', 'mcq', '["CPPL", "APPJ", "ANNJ", "APOJ"]'::jsonb, 'B'),
  ('If ''RAIN'' is coded as ''SBJO'', how is ''SNOW'' coded?', 'mcq', '["SOPX", "TNPX", "TOPX", "TOPW"]'::jsonb, 'C'),
  ('If BOOK is coded as CPPL, how is PAGE coded?', 'mcq', '["QBHE", "QAHF", "PBHF", "QBHF"]'::jsonb, 'D'),
  ('If 1=A, 2=B, 3=C ... then what word does 4-15-7 spell?', 'mcq', '["DOG", "FOG", "DOT", "COG"]'::jsonb, 'A'),
  ('Pointing to a boy, a woman said, ''He is the son of my mother''s only daughter.'' How is the boy related to the woman?', 'mcq', '["Brother", "Nephew", "Grandson", "Son"]'::jsonb, 'D'),
  ('Reena''s mother is the only daughter of Meera''s father. How is Meera related to Reena?', 'mcq', '["Aunt", "Grandmother", "Sister", "Mother"]'::jsonb, 'A'),
  ('If Ravi is Meena''s brother and Meena is Suresh''s sister, how is Ravi related to Suresh?', 'mcq', '["Uncle", "Father", "Cousin", "Brother"]'::jsonb, 'D'),
  ('A is the father of B. B is the sister of C. How is A related to C?', 'mcq', '["Uncle", "Grandfather", "Father", "Brother"]'::jsonb, 'C')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Spatial / Pattern Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Square, Circle, Square, Circle, Square, ___?', 'mcq', '["Star", "Circle", "Triangle", "Square"]'::jsonb, 'B'),
  ('Triangle, Triangle, Square, Triangle, Triangle, Square, Triangle, Triangle, ___?', 'mcq', '["Star", "Square", "Triangle", "Circle"]'::jsonb, 'B'),
  ('Star, Moon, Star, Moon, Star, ___?', 'mcq', '["Moon", "Star", "Cloud", "Sun"]'::jsonb, 'A'),
  ('△, ▢, ○, △, ▢, ○, △, ▢, ___?', 'mcq', '["▢", "○", "△", "☆"]'::jsonb, 'B'),
  ('1 dot, 2 dots, 3 dots, 4 dots, ___ dots?', 'mcq', '["5", "3", "4", "6"]'::jsonb, 'A'),
  ('Red, Blue, Red, Blue, Red, Blue, ___?', 'mcq', '["Green", "Blue", "Red", "Yellow"]'::jsonb, 'C'),
  ('Big circle, Small circle, Big circle, Small circle, ___?', 'mcq', '["No circle", "Big circle", "Small circle", "Medium circle"]'::jsonb, 'B'),
  ('A, AB, ABC, ABCD, ___?', 'mcq', '["ABCE", "ABCDD", "ABCDEF", "ABCDE"]'::jsonb, 'D'),
  ('☆☆, ☆☆☆, ☆☆☆☆, ___?', 'mcq', '["☆☆☆☆☆☆", "☆", "☆☆☆☆☆", "☆☆☆"]'::jsonb, 'C'),
  ('One arrow pointing up, two arrows pointing up, three arrows pointing up — how many arrows come next?', 'mcq', '["6", "3", "4", "5"]'::jsonb, 'C'),
  ('Circle inside a square, Square inside a circle, Circle inside a square, ___?', 'mcq', '["Square inside a circle", "Square inside a square", "Triangle inside a circle", "Circle inside a square"]'::jsonb, 'A'),
  ('XOXO XOXO XO___?', 'mcq', '["OO", "OX", "XO", "XX"]'::jsonb, 'C'),
  ('When you look at the letter ''b'' in a mirror, which letter does it resemble?', 'mcq', '["d", "p", "b", "q"]'::jsonb, 'A'),
  ('When you look at the word ''MOM'' in a mirror, how does it appear?', 'mcq', '["WOW", "MOW", "MOM (it stays the same)", "WOM"]'::jsonb, 'C'),
  ('If the time on a clock is 3:00 and you view it in a mirror, what time does it appear to show?', 'mcq', '["6:00", "12:00", "3:00", "9:00"]'::jsonb, 'D'),
  ('The mirror image of the numeral ''2'' looks most like which shape turned around?', 'mcq', '["The number 5", "The number 7", "The letter S", "A backward 2"]'::jsonb, 'D'),
  ('Which letter looks the same when reflected in a mirror: A, F, or G?', 'mcq', '["G", "None of them", "F", "A"]'::jsonb, 'D'),
  ('If you write ''TOY'' and hold it up to a mirror, which letter would be hardest to recognise reversed?', 'mcq', '["None, all look normal", "O", "T", "Y"]'::jsonb, 'D'),
  ('A clock shows 6:00. What will its mirror image show?', 'mcq', '["12:00", "9:00", "6:00", "3:00"]'::jsonb, 'C'),
  ('Which of these words reads the same forwards and in a mirror if written in capital letters: TOOT, BOOK, or CHAIR?', 'mcq', '["TOOT", "CHAIR", "BOOK", "None of them"]'::jsonb, 'A'),
  ('A square piece of paper is folded exactly in half. What shape is formed?', 'mcq', '["Rectangle", "Circle", "Pentagon", "Triangle"]'::jsonb, 'A'),
  ('A square paper is folded diagonally in half. What shape is formed?', 'mcq', '["Hexagon", "Triangle", "Rectangle", "Circle"]'::jsonb, 'B'),
  ('A cube has how many faces?', 'mcq', '["5", "8", "4", "6"]'::jsonb, 'D'),
  ('A cube has how many edges?', 'mcq', '["10", "12", "8", "14"]'::jsonb, 'B'),
  ('A cube has how many corners (vertices)?', 'mcq', '["10", "12", "8", "6"]'::jsonb, 'C'),
  ('If a cube is cut exactly in half through the middle, parallel to one face, what shape is each new face?', 'mcq', '["Triangle", "Square", "Rectangle (non-square)", "Circle"]'::jsonb, 'B'),
  ('A rectangular sheet of paper is rolled into a tube. What 3D shape does it resemble?', 'mcq', '["Cylinder", "Cone", "Sphere", "Cube"]'::jsonb, 'A'),
  ('How many flat faces does a cylinder have?', 'mcq', '["1", "0", "3", "2"]'::jsonb, 'D'),
  ('If you face North and turn 90° to your right, which direction are you now facing?', 'mcq', '["East", "North", "West", "South"]'::jsonb, 'A'),
  ('If you face South and turn 180°, which direction are you now facing?', 'mcq', '["North", "East", "West", "South"]'::jsonb, 'A'),
  ('Ramesh walks 5 km North, then turns right and walks 3 km. Which direction is he now facing?', 'mcq', '["East", "South", "West", "North"]'::jsonb, 'A'),
  ('If you face East and turn 90° to your left, which direction are you now facing?', 'mcq', '["East", "South", "North", "West"]'::jsonb, 'C'),
  ('A clock''s minute hand moves from 12 to 6. How many degrees has it turned?', 'mcq', '["360°", "180°", "90°", "270°"]'::jsonb, 'B'),
  ('If North-East is to your front, what direction is directly behind you?', 'mcq', '["South-East", "North-West", "North", "South-West"]'::jsonb, 'D'),
  ('Priya starts walking North, turns left, then left again. Which direction is she now facing?', 'mcq', '["North", "South", "West", "East"]'::jsonb, 'B'),
  ('A square is rotated 90° clockwise. Does its shape change?', 'mcq', '["No, it still looks like a square", "Yes, it becomes a circle", "Yes, it becomes a rectangle", "Yes, it becomes a triangle"]'::jsonb, 'A'),
  ('How many straight sides does a pentagon have?', 'mcq', '["5", "4", "7", "6"]'::jsonb, 'A'),
  ('How many straight sides does an octagon have?', 'mcq', '["6", "9", "7", "8"]'::jsonb, 'D'),
  ('A figure has 3 sides and 3 angles. What shape is it?', 'mcq', '["Pentagon", "Triangle", "Circle", "Square"]'::jsonb, 'B'),
  ('A shape has 4 equal sides and 4 right angles. What shape is it?', 'mcq', '["Rectangle", "Square", "Trapezium", "Rhombus"]'::jsonb, 'B')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Mechanical Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Which simple machine is a see-saw an example of?', 'mcq', '["Pulley", "Lever", "Wheel and axle", "Inclined plane"]'::jsonb, 'B'),
  ('A pair of scissors works using which simple machine?', 'mcq', '["Wedge", "Lever", "Pulley", "Screw"]'::jsonb, 'B'),
  ('In a lever, the fixed point on which it turns is called the ___?', 'mcq', '["Axle", "Anchor", "Fulcrum", "Hinge"]'::jsonb, 'C'),
  ('Which tool uses a lever to pull out nails?', 'mcq', '["Screwdriver", "Wrench", "Drill", "Claw hammer"]'::jsonb, 'D'),
  ('A wheelbarrow is an example of which type of simple machine?', 'mcq', '["Screw", "Pulley", "Wedge", "Lever"]'::jsonb, 'D'),
  ('Moving the fulcrum of a lever closer to the load makes lifting it ___?', 'mcq', '["Easier", "Harder", "Impossible", "No different"]'::jsonb, 'A'),
  ('A bottle opener works on the principle of a ___?', 'mcq', '["Wheel", "Lever", "Pulley", "Wedge"]'::jsonb, 'B'),
  ('Which of these is NOT an example of a lever?', 'mcq', '["A crowbar", "A ramp for wheelchairs", "A see-saw", "Scissors"]'::jsonb, 'B'),
  ('A pulley is mainly used to ___?', 'mcq', '["Cut objects", "Store energy", "Measure weight", "Lift heavy loads more easily"]'::jsonb, 'D'),
  ('A flag is raised up a flagpole using which simple machine?', 'mcq', '["Wedge", "Screw", "Lever", "Pulley"]'::jsonb, 'D'),
  ('What is the main advantage of using a pulley system with multiple wheels?', 'mcq', '["It removes the need for a rope", "It makes the load heavier", "It increases the load''s weight", "It reduces the effort needed to lift a load"]'::jsonb, 'D'),
  ('A well with a bucket and rope over a wheel uses which simple machine?', 'mcq', '["Inclined plane", "Screw", "Wedge", "Pulley"]'::jsonb, 'D'),
  ('In a crane, which simple machine helps lift heavy construction materials?', 'mcq', '["Lever only", "Screw", "Wedge", "Pulley"]'::jsonb, 'D'),
  ('A fixed pulley changes the ___ of the force needed to lift an object.', 'mcq', '["Weight", "Colour", "Direction", "Amount"]'::jsonb, 'C'),
  ('Curtains are usually opened and closed using which simple machine?', 'mcq', '["Lever", "Pulley", "Screw", "Wedge"]'::jsonb, 'B'),
  ('A doorknob works using which simple machine?', 'mcq', '["Pulley", "Lever", "Wedge", "Wheel and axle"]'::jsonb, 'D'),
  ('Bicycle pedals connected to a wheel are an example of ___?', 'mcq', '["Inclined plane", "Screw", "Wedge", "Wheel and axle"]'::jsonb, 'D'),
  ('When two gears of different sizes are connected, the smaller gear turns ___ than the larger gear.', 'mcq', '["Faster", "Not at all", "Slower", "At the same speed"]'::jsonb, 'A'),
  ('What is the main purpose of gears in a machine?', 'mcq', '["To measure temperature", "To generate light", "To transfer motion and change speed or force", "To store water"]'::jsonb, 'C'),
  ('A steering wheel in a car uses which simple machine principle?', 'mcq', '["Wheel and axle", "Pulley", "Screw", "Wedge"]'::jsonb, 'A'),
  ('If two gears are meshed together and one turns clockwise, the other will turn ___?', 'mcq', '["It will not move", "In the same direction", "Clockwise", "Anticlockwise"]'::jsonb, 'D'),
  ('Which everyday object best demonstrates a wheel and axle?', 'mcq', '["A ramp", "A knife", "A nail", "A doorknob"]'::jsonb, 'D'),
  ('A ramp used to load boxes into a truck is an example of ___?', 'mcq', '["Wheel and axle", "Inclined plane", "Lever", "Pulley"]'::jsonb, 'B'),
  ('An axe blade works using which simple machine?', 'mcq', '["Pulley", "Lever", "Wedge", "Screw"]'::jsonb, 'C'),
  ('A screw is basically an inclined plane wrapped around a ___?', 'mcq', '["Cube", "Sphere", "Cylinder", "Cone"]'::jsonb, 'C'),
  ('Why do we use ramps instead of steps for wheelchairs?', 'mcq', '["They use more force but save time", "They are only for decoration", "They are shorter than stairs", "They reduce the force needed to move up, though over a longer distance"]'::jsonb, 'D'),
  ('A knife cutting through an apple works using which simple machine?', 'mcq', '["Screw", "Pulley", "Wedge", "Lever"]'::jsonb, 'C'),
  ('What is the purpose of the threads on a screw?', 'mcq', '["To reflect light", "To hold materials together as it is twisted in", "To generate electricity", "To measure length"]'::jsonb, 'B'),
  ('A doorstop shaped like a triangle prism is an example of which simple machine?', 'mcq', '["Lever", "Wedge", "Pulley", "Wheel and axle"]'::jsonb, 'B'),
  ('Why does it take more effort to push a heavy box across a rough floor than a smooth one?', 'mcq', '["Gravity is different on rough floors", "Smooth floors have more friction", "Friction is greater on a rough floor", "Rough floors are heavier"]'::jsonb, 'C'),
  ('Which shape rolls most easily on the ground?', 'mcq', '["A pyramid", "A sphere (ball)", "A cube", "A cone lying flat"]'::jsonb, 'B'),
  ('Two gears are connected by a chain, like on a bicycle. If you pedal the front gear, what happens to the back wheel?', 'mcq', '["It turns backward only", "Nothing happens", "It turns and moves the bicycle forward", "It stays still"]'::jsonb, 'C'),
  ('Why do bridges often use triangular frameworks (trusses)?', 'mcq', '["Triangles look decorative", "Triangles are very strong and resist bending", "Triangles are cheaper to paint", "Triangles use less steel than any shape"]'::jsonb, 'B'),
  ('A ball is dropped from a height. What force pulls it toward the ground?', 'mcq', '["Gravity", "Friction", "Air pressure", "Magnetism"]'::jsonb, 'A'),
  ('Why does oil help machine parts move more smoothly?', 'mcq', '["It cools the machine only", "It makes parts magnetic", "It increases the weight of parts", "It reduces friction between moving parts"]'::jsonb, 'D'),
  ('A spring is compressed and then released. What kind of energy does it use to spring back?', 'mcq', '["Stored (elastic potential) energy", "Light energy", "Electrical energy", "Heat energy"]'::jsonb, 'A'),
  ('Which everyday tool uses two levers joined at a pivot to cut through material?', 'mcq', '["Scissors", "Screwdriver", "Pulley", "Hammer"]'::jsonb, 'A'),
  ('A see-saw is balanced when heavier and lighter children sit on it. What helps balance it?', 'mcq', '["Removing the fulcrum", "Adding more weight to the lighter side", "Moving the heavier child further from the fulcrum", "Moving the heavier child closer to the fulcrum"]'::jsonb, 'D'),
  ('Why are door hinges placed near the edge of a door rather than the middle?', 'mcq', '["It stops the door from closing", "It is only for decoration", "It allows the door to swing open and closed easily with less force", "It makes the door heavier"]'::jsonb, 'C'),
  ('A wheelbarrow makes lifting heavy loads easier mainly because of its ___?', 'mcq', '["Large size", "Extra weight", "Handle colour", "Wheel acting as a pivot point (lever action)"]'::jsonb, 'D')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Numerical Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('What percentage is 45 of 180?', 'mcq', '["25%", "35%", "30%", "20%"]'::jsonb, 'A'),
  ('What percentage is 72 of 240?', 'mcq', '["25%", "35%", "30%", "40%"]'::jsonb, 'C'),
  ('A number increased by 20% becomes 180. What was the original number?', 'mcq', '["150", "160", "170", "140"]'::jsonb, 'A'),
  ('A number decreased by 15% becomes 170. What was the original number?', 'mcq', '["200", "210", "180", "190"]'::jsonb, 'A'),
  ('The average of 5 numbers is 24. If one number is removed, the average becomes 22. What was the removed number?', 'mcq', '["30", "34", "28", "32"]'::jsonb, 'D'),
  ('The average of 6 numbers is 15. If a 7th number, 22, is added, what is the new average?', 'mcq', '["17", "18", "16", "15"]'::jsonb, 'C'),
  ('A student scores 45 out of 60 in a test. What is the percentage score?', 'mcq', '["65%", "70%", "75%", "80%"]'::jsonb, 'C'),
  ('A shopkeeper sells at 20% profit. If the cost price is ₹250, what is the selling price?', 'mcq', '["₹310", "₹280", "₹300", "₹290"]'::jsonb, 'C'),
  ('An article bought for ₹800 is sold for ₹680. What is the loss percentage?', 'mcq', '["10%", "12%", "15%", "20%"]'::jsonb, 'C'),
  ('A 25% discount brings the price of an item to ₹600. What was the original price?', 'mcq', '["₹800", "₹850", "₹750", "₹900"]'::jsonb, 'A'),
  ('What is the simple interest on ₹5000 at 8% per annum for 3 years?', 'mcq', '["₹1100", "₹1300", "₹1200", "₹1000"]'::jsonb, 'C'),
  ('What is the simple interest on ₹12000 at 5% per annum for 2 years?', 'mcq', '["₹1200", "₹1300", "₹1000", "₹1100"]'::jsonb, 'A'),
  ('What is the compound interest on ₹10,000 at 10% p.a. for 2 years?', 'mcq', '["₹2,000", "₹2,100", "₹2,200", "₹1,900"]'::jsonb, 'B'),
  ('A car depreciates by 20% per year. If bought at ₹1,00,000, what is its value after 2 years?', 'mcq', '["₹64,000", "₹60,000", "₹70,000", "₹80,000"]'::jsonb, 'A'),
  ('An item marked at ₹1200 is sold after two successive discounts of 10% and 10%. What is the final selling price?', 'mcq', '["₹980", "₹1000", "₹960", "₹972"]'::jsonb, 'D'),
  ('A trader marks goods 40% above cost price and gives a 10% discount. What is his profit percentage?', 'mcq', '["24%", "30%", "20%", "26%"]'::jsonb, 'D'),
  ('The ratio of boys to girls in a class is 3:2. If there are 30 boys, how many girls are there?', 'mcq', '[20, 15, 25, 18]'::jsonb, 'A'),
  ('Two numbers are in the ratio 5:7. Their sum is 144. Find the larger number.', 'mcq', '[70, 80, 60, 84]'::jsonb, 'D'),
  ('Divide ₹720 between A and B in the ratio 5:4. What is A''s share?', 'mcq', '[380, 420, 360, 400]'::jsonb, 'D'),
  ('The ratio of two numbers is 4:5, and their HCF is 6. Find the larger number.', 'mcq', '[24, 36, 30, 20]'::jsonb, 'C'),
  ('If a:b = 2:3 and b:c = 4:5, find a:c.', 'mcq', '["8:15", "2:5", "6:15", "4:15"]'::jsonb, 'A'),
  ('If A can do a job in 10 days and B in 15 days, how many days will they take together?', 'mcq', '[5, 4, 6, 8]'::jsonb, 'C'),
  ('A pipe fills a tank in 6 hours. Another pipe empties it in 9 hours. If both are open, how long will it take to fill the tank?', 'mcq', '[12, 16, 18, 15]'::jsonb, 'C'),
  ('A can finish a task in 12 days, B in 24 days. Working together, how many days will they take?', 'mcq', '[6, 9, 10, 8]'::jsonb, 'D'),
  ('15 workers can complete a wall in 8 days. How many days would 10 workers take to complete the same wall?', 'mcq', '[12, 10, 16, 14]'::jsonb, 'A'),
  ('A tap fills a tank in 5 hours. Due to a leak, it takes 6 hours. How long would the leak alone take to empty a full tank?', 'mcq', '[36, 24, 25, 30]'::jsonb, 'D'),
  ('A train 150 m long passes a pole in 15 seconds. What is its speed?', 'mcq', '["15 m/s", "10 m/s", "12 m/s", "8 m/s"]'::jsonb, 'B'),
  ('If speed is doubled, the time taken to cover the same distance is:', 'mcq', '["Halved", "Tripled", "Same", "Doubled"]'::jsonb, 'A'),
  ('A car travels 180 km in 3 hours, then 120 km in 2 hours. What is its average speed for the whole journey?', 'mcq', '["50 km/h", "65 km/h", "60 km/h", "55 km/h"]'::jsonb, 'C'),
  ('Two trains 100 m and 150 m long run in opposite directions at 30 km/h and 20 km/h. How long will they take to cross each other?', 'mcq', '["18 seconds", "25 seconds", "15 seconds", "20 seconds"]'::jsonb, 'A'),
  ('A boat travels at 12 km/h in still water. The speed of the current is 3 km/h. What is its downstream speed?', 'mcq', '["12 km/h", "9 km/h", "18 km/h", "15 km/h"]'::jsonb, 'D'),
  ('A man walks at 5 km/h and reaches his office 6 minutes late. Walking at 6 km/h, he reaches 2 minutes early. What is the distance to his office?', 'mcq', '["3 km", "5 km", "4 km", "6 km"]'::jsonb, 'C'),
  ('A cyclist covers 45 km in 3 hours. At the same speed, how long will he take to cover 75 km?', 'mcq', '["5 hours", "4 hours", "4.5 hours", "6 hours"]'::jsonb, 'A'),
  ('Find the value of x: 3x + 7 = 28', 'mcq', '[6, 8, 5, 7]'::jsonb, 'D'),
  ('Solve for x: 5x − 9 = 21', 'mcq', '[8, 6, 5, 7]'::jsonb, 'B'),
  ('If 2(x + 3) = 16, find x.', 'mcq', '[6, 4, 5, 7]'::jsonb, 'C'),
  ('Solve: x² − 9 = 0. What is a positive value of x?', 'mcq', '[4, 9, 3, 2]'::jsonb, 'C'),
  ('If x + y = 10 and x − y = 4, find the value of x.', 'mcq', '[5, 8, 7, 6]'::jsonb, 'C'),
  ('Simplify: 4x + 3x − 2x', 'mcq', '["5x", "6x", "9x", "4x"]'::jsonb, 'A'),
  ('If 3x = 21, what is the value of 2x + 5?', 'mcq', '[21, 15, 17, 19]'::jsonb, 'D'),
  ('Solve for x: (x/4) + 3 = 8', 'mcq', '[22, 20, 16, 18]'::jsonb, 'B'),
  ('What is the square root of 0.0625?', 'mcq', '["0.0025", "0.25", "0.025", "2.5"]'::jsonb, 'B'),
  ('A cube has a total surface area of 150 cm². What is the length of one side?', 'mcq', '["5 cm", "6 cm", "7 cm", "4 cm"]'::jsonb, 'A'),
  ('A right triangle has legs of 6 cm and 8 cm. What is the length of the hypotenuse?', 'mcq', '["10 cm", "14 cm", "9 cm", "12 cm"]'::jsonb, 'A'),
  ('A circle has a radius of 7 cm. What is its circumference? (use π = 22/7)', 'mcq', '["40 cm", "35 cm", "48 cm", "44 cm"]'::jsonb, 'D'),
  ('The volume of a cube with side 5 cm is:', 'mcq', '["100 cm³", "150 cm³", "75 cm³", "125 cm³"]'::jsonb, 'D'),
  ('What is the LCM of 12 and 18?', 'mcq', '[30, 24, 48, 36]'::jsonb, 'D'),
  ('What is the HCF of 36 and 60?', 'mcq', '[18, 24, 6, 12]'::jsonb, 'D'),
  ('Which of these is a prime number?', 'mcq', '["45", "47", "48", "51"]'::jsonb, 'B'),
  ('What is the sum of the first 10 natural numbers?', 'mcq', '[45, 55, 60, 50]'::jsonb, 'B')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Verbal Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Choose the word most similar to ''AMBIGUOUS'':', 'mcq', '["Vague", "Certain", "Precise", "Clear"]'::jsonb, 'A'),
  ('Choose the word most similar to ''DILIGENT'':', 'mcq', '["Slow", "Hardworking", "Careless", "Lazy"]'::jsonb, 'B'),
  ('Choose the word most similar to ''BENEVOLENT'':', 'mcq', '["Kind", "Harsh", "Cruel", "Selfish"]'::jsonb, 'A'),
  ('Choose the word most similar to ''CANDID'':', 'mcq', '["Deceptive", "Vague", "Secretive", "Honest"]'::jsonb, 'D'),
  ('Choose the word most similar to ''METICULOUS'':', 'mcq', '["Hasty", "Careful", "Careless", "Sloppy"]'::jsonb, 'B'),
  ('Choose the word most similar to ''TRANQUIL'':', 'mcq', '["Turbulent", "Noisy", "Peaceful", "Chaotic"]'::jsonb, 'C'),
  ('Choose the word most similar to ''ABUNDANT'':', 'mcq', '["Plentiful", "Rare", "Limited", "Scarce"]'::jsonb, 'A'),
  ('Choose the word most similar to ''AUTHENTIC'':', 'mcq', '["Artificial", "Genuine", "Counterfeit", "Fake"]'::jsonb, 'B'),
  ('Choose the word most similar to ''ELOQUENT'':', 'mcq', '["Well-spoken", "Tongue-tied", "Silent", "Confused"]'::jsonb, 'A'),
  ('Choose the word most similar to ''RESILIENT'':', 'mcq', '["Fragile", "Tough", "Weak", "Delicate"]'::jsonb, 'B'),
  ('Choose the word opposite to ''VERBOSE'':', 'mcq', '["Loud", "Concise", "Wordy", "Talkative"]'::jsonb, 'B'),
  ('Choose the word opposite to ''LENIENT'':', 'mcq', '["Calm", "Strict", "Easy", "Mild"]'::jsonb, 'B'),
  ('Choose the word opposite to ''OPTIMISTIC'':', 'mcq', '["Pessimistic", "Hopeful", "Positive", "Confident"]'::jsonb, 'A'),
  ('Choose the word opposite to ''VOLUNTARY'':', 'mcq', '["Willing", "Chosen", "Compulsory", "Free"]'::jsonb, 'C'),
  ('Choose the word opposite to ''TRANSPARENT'':', 'mcq', '["Clear", "Obvious", "Opaque", "Visible"]'::jsonb, 'C'),
  ('Choose the word opposite to ''ABUNDANT'':', 'mcq', '["Scarce", "Rich", "Ample", "Plentiful"]'::jsonb, 'A'),
  ('Choose the word opposite to ''HUMBLE'':', 'mcq', '["Shy", "Modest", "Arrogant", "Simple"]'::jsonb, 'C'),
  ('Choose the word opposite to ''FRUGAL'':', 'mcq', '["Extravagant", "Careful", "Thrifty", "Economical"]'::jsonb, 'A'),
  ('Choose the word opposite to ''RELUCTANT'':', 'mcq', '["Hesitant", "Willing", "Unwilling", "Reserved"]'::jsonb, 'B'),
  ('Choose the word opposite to ''SCATTERED'':', 'mcq', '["Spread out", "Dispersed", "Concentrated", "Diffuse"]'::jsonb, 'C'),
  ('Complete the analogy — Sculptor : Chisel :: Painter : ___?', 'mcq', '["Brush", "Frame", "Easel", "Canvas"]'::jsonb, 'A'),
  ('Complete the analogy — Illiterate : Read :: Blind : ___?', 'mcq', '["Speak", "Hear", "Walk", "See"]'::jsonb, 'D'),
  ('Complete the analogy — Pen : Write :: Knife : ___?', 'mcq', '["Build", "Draw", "Cut", "Paint"]'::jsonb, 'C'),
  ('Complete the analogy — Doctor : Patient :: Lawyer : ___?', 'mcq', '["Jury", "Judge", "Witness", "Client"]'::jsonb, 'D'),
  ('Complete the analogy — Author : Novel :: Composer : ___?', 'mcq', '["Play", "Symphony", "Sculpture", "Painting"]'::jsonb, 'B'),
  ('Complete the analogy — Thermometer : Temperature :: Barometer : ___?', 'mcq', '["Pressure", "Speed", "Weight", "Humidity"]'::jsonb, 'A'),
  ('Complete the analogy — Herbivore : Plants :: Carnivore : ___?', 'mcq', '["Vegetables", "Meat", "Fruits", "Grains"]'::jsonb, 'B'),
  ('Find the odd one out: Anxious, Worried, Nervous, Delighted', 'mcq', '["Delighted", "Nervous", "Worried", "Anxious"]'::jsonb, 'A'),
  ('Find the odd one out: Mercury, Venus, Earth, Moon', 'mcq', '["Venus", "Earth", "Moon", "Mercury"]'::jsonb, 'C'),
  ('Find the odd one out: Novel, Poem, Essay, River', 'mcq', '["Essay", "Poem", "River", "Novel"]'::jsonb, 'C'),
  ('Find the odd one out: Generous, Charitable, Stingy, Kind', 'mcq', '["Stingy", "Charitable", "Kind", "Generous"]'::jsonb, 'A'),
  ('Find the odd one out: Whisper, Murmur, Shout, Mutter', 'mcq', '["Mutter", "Murmur", "Shout", "Whisper"]'::jsonb, 'C'),
  ('Find the odd one out: Triangle, Square, Pentagon, Sphere', 'mcq', '["Square", "Pentagon", "Sphere", "Triangle"]'::jsonb, 'C'),
  ('Which sentence is in the passive voice?', 'mcq', '["The cat was chased by the dog.", "The cat chases the dog.", "The dog chased the cat.", "The dog is chasing the cat."]'::jsonb, 'A'),
  ('Which sentence is correctly punctuated?', 'mcq', '["Its'' a lovely day.", "It''s a lovely day.", "Its a lovely day.", "Its a lovely, day."]'::jsonb, 'B'),
  ('Identify the subject in: ''The tall trees in the forest swayed in the wind.''', 'mcq', '["forest", "wind", "trees", "swayed"]'::jsonb, 'C'),
  ('Complete: ''Neither the students nor the teacher ___ present.''', 'mcq', '["are", "is", "was", "were"]'::jsonb, 'C'),
  ('Choose the correctly formed question: ___', 'mcq', '["Where you went yesterday?", "Where did you go yesterday?", "Where went you yesterday?", "Where you did go yesterday?"]'::jsonb, 'B'),
  ('Which sentence uses the past perfect tense correctly?', 'mcq', '["She has finished her homework before dinner.", "She had finished her homework before dinner.", "She finishes her homework before dinner.", "She finished her homework before dinner."]'::jsonb, 'B'),
  ('Choose the correctly punctuated sentence.', 'mcq', '["Although it was raining, we went for a walk.", "Although it was raining we went for a walk,", "Although, it was raining we went for a walk.", "Although it was raining we went, for a walk."]'::jsonb, 'A'),
  ('Identify the correct plural form of ''analysis''.', 'mcq', '["Analysises", "Analysis''s", "Analyses", "Analysiss"]'::jsonb, 'C'),
  ('Choose the correct meaning of the idiom ''bite the bullet'':', 'mcq', '["To endure pain bravely", "To fight back", "To eat fast", "To shoot someone"]'::jsonb, 'A'),
  ('Identify the literary device: ''The wind whispered through the trees.''', 'mcq', '["Metaphor", "Alliteration", "Personification", "Simile"]'::jsonb, 'C'),
  ('What does the idiom ''spill the beans'' mean?', 'mcq', '["To argue loudly", "To reveal a secret", "To cook food", "To make a mess"]'::jsonb, 'B'),
  ('Identify the figure of speech: ''Her smile was as bright as the sun.''', 'mcq', '["Metaphor", "Hyperbole", "Personification", "Simile"]'::jsonb, 'D'),
  ('What does the idiom ''once in a blue moon'' mean?', 'mcq', '["Every night", "Very often", "Very rarely", "During a full moon"]'::jsonb, 'C'),
  ('Choose the word that best completes the sentence: ''Despite the heavy rain, the match was ___ as scheduled.''', 'mcq', '["holding", "held", "hold", "holds"]'::jsonb, 'B'),
  ('Choose the word that best fits: ''The scientist''s discovery was truly ___, changing how we understand the universe.''', 'mcq', '["trivial", "forgettable", "groundbreaking", "ordinary"]'::jsonb, 'C'),
  ('Choose the correct word: ''The committee could not reach a ___ decision after hours of debate.''', 'mcq', '["single", "silent", "unanimous", "divided"]'::jsonb, 'C'),
  ('Choose the word that best fits: ''Her ___ attitude made her popular among classmates.''', 'mcq', '["aloof", "amiable", "hostile", "arrogant"]'::jsonb, 'B')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Abstract / Logical Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('What comes next in the series: 1, 3, 7, 15, 31, __?', 'mcq', '["47", "63", "55", "71"]'::jsonb, 'B'),
  ('What comes next in the series: 2, 6, 12, 20, 30, __?', 'mcq', '["38", "44", "40", "42"]'::jsonb, 'D'),
  ('What comes next in the series: 0, 1, 1, 2, 3, 5, 8, __?', 'mcq', '["13", "12", "11", "14"]'::jsonb, 'A'),
  ('What comes next in the series: 4, 9, 16, 25, __, 49', 'mcq', '["34", "38", "32", "36"]'::jsonb, 'D'),
  ('What comes next in the series: 3, 6, 11, 18, 27, __?', 'mcq', '["34", "40", "38", "36"]'::jsonb, 'C'),
  ('What comes next in the series: 1, 4, 9, 16, 25, __?', 'mcq', '["30", "32", "40", "36"]'::jsonb, 'D'),
  ('What comes next in the series: 2, 3, 5, 8, 13, __?', 'mcq', '["21", "23", "19", "18"]'::jsonb, 'A'),
  ('What comes next in the series: 5, 10, 20, 40, 80, __?', 'mcq', '["160", "180", "140", "120"]'::jsonb, 'A'),
  ('What comes next in the series: 100, 81, 64, 49, __?', 'mcq', '["32", "40", "36", "42"]'::jsonb, 'C'),
  ('What comes next in the series: 7, 14, 28, 56, __?', 'mcq', '["100", "120", "98", "112"]'::jsonb, 'D'),
  ('Complete the series: AZ, BY, CX, DW, __?', 'mcq', '["EV", "EW", "FV", "EU"]'::jsonb, 'A'),
  ('Complete the series: A, C, F, J, __?', 'mcq', '["O", "N", "P", "M"]'::jsonb, 'A'),
  ('Complete the series: B, D, G, K, __?', 'mcq', '["P", "Q", "N", "O"]'::jsonb, 'A'),
  ('Complete the series: Z, X, V, T, __?', 'mcq', '["R", "P", "Q", "S"]'::jsonb, 'A'),
  ('Complete the series: J, F, M, A, M, J, __?', 'mcq', '["K", "L", "A", "J"]'::jsonb, 'D'),
  ('Complete the series: AB, DE, GH, JK, __?', 'mcq', '["MN", "NO", "KL", "LM"]'::jsonb, 'A'),
  ('All dogs are animals. All animals eat food. Therefore:', 'mcq', '["Dogs are not animals", "Some animals are dogs", "All food is eaten by dogs", "All dogs eat food"]'::jsonb, 'D'),
  ('All teachers are graduates. Priya is a teacher. Therefore Priya is:', 'mcq', '["A student", "Not a graduate", "A professor", "A graduate"]'::jsonb, 'D'),
  ('If A > B and B > C, then:', 'mcq', '["C > B", "A > C", "C > A", "B > A"]'::jsonb, 'B'),
  ('If all Bloops are Razzles and all Razzles are Lazzles, then:', 'mcq', '["All Lazzles are Bloops", "No Bloops are Lazzles", "Some Bloops are Lazzles", "All Bloops are Lazzles"]'::jsonb, 'D'),
  ('All squares are rectangles. All rectangles are quadrilaterals. Therefore:', 'mcq', '["Some rectangles are not quadrilaterals", "All quadrilaterals are squares", "All squares are quadrilaterals", "No squares are quadrilaterals"]'::jsonb, 'C'),
  ('Some flowers are red. All red things fade in sunlight. Therefore:', 'mcq', '["Some flowers fade in sunlight", "No flowers fade in sunlight", "All flowers fade in sunlight", "All red things are flowers"]'::jsonb, 'A'),
  ('No fish are mammals. All whales are mammals. Therefore:', 'mcq', '["All whales are fish", "No whales are fish", "All fish are whales", "Some whales are fish"]'::jsonb, 'B'),
  ('Every athlete is disciplined. Rahul is disciplined. Therefore:', 'mcq', '["Rahul is definitely not an athlete", "We cannot conclude Rahul is an athlete", "All disciplined people are athletes", "Rahul is definitely an athlete"]'::jsonb, 'B'),
  ('If MANGO is coded as NBOHP, how is APPLE coded?', 'mcq', '["BQQMF", "BQBMF", "BQPMF", "CQQMF"]'::jsonb, 'A'),
  ('If COLD is coded as WARM''s opposite pattern and DARK is coded as LIGHT, then FAST is coded as:', 'mcq', '["Quick", "Rapid", "Speed", "Slow"]'::jsonb, 'D'),
  ('In a certain code, TABLE is written as UBCMF. How is CHAIR written?', 'mcq', '["DIAJS", "DIBJS", "DHBJS", "DIBIS"]'::jsonb, 'B'),
  ('If in a code language, PAPER is written as QBQFS, how is PENCIL written?', 'mcq', '["QEODJM", "QFODJM", "PFODJM", "QFODIM"]'::jsonb, 'B'),
  ('If 5 * 3 = 34, 6 * 4 = 52, then 7 * 2 = ?', 'mcq', '["51", "45", "49", "53"]'::jsonb, 'D'),
  ('If FRIEND is coded as HTKGPF (each letter shifted by 2), how is CANDLE coded?', 'mcq', '["ECOFNG", "EDPFNG", "ECPFMG", "ECPFNG"]'::jsonb, 'D'),
  ('If in a certain code, ''ROSE'' is written as ''URVH'', how is ''LOTUS'' written in that code?', 'mcq', '["NQVWU", "PRWXV", "ORWXV", "ORWWV"]'::jsonb, 'C'),
  ('P is the brother of Q. Q is the sister of R. R is the son of S. How is P related to S?', 'mcq', '["Grandson", "Nephew", "Daughter", "Son"]'::jsonb, 'D'),
  ('Pointing to a photo, Meena said, ''He is the only son of my grandfather''s only daughter.'' Who is he to Meena?', 'mcq', '["Nephew", "Brother", "Uncle", "Cousin"]'::jsonb, 'B'),
  ('If South-East becomes North and North-East becomes West, what does South become?', 'mcq', '["East", "North", "West", "South-West"]'::jsonb, 'A'),
  ('In a row of students, Ravi is 7th from the left and 12th from the right. How many students are in the row?', 'mcq', '["19", "20", "18", "17"]'::jsonb, 'C'),
  ('Aman is taller than Bala but shorter than Chetan. Deepak is shorter than Bala. Who is the tallest?', 'mcq', '["Aman", "Chetan", "Deepak", "Bala"]'::jsonb, 'B'),
  ('A is the father of B. C is the sister of B. D is the mother of C. How is D related to A?', 'mcq', '["Daughter", "Wife", "Sister", "Mother"]'::jsonb, 'B'),
  ('Walking 5 km South and then 3 km East, a man reaches a point. In which direction is he from the starting point?', 'mcq', '["South-West", "South-East", "North-West", "North-East"]'::jsonb, 'B'),
  ('Which number is the odd one out: 16, 25, 36, 48, 49?', 'mcq', '["49", "16", "25", "48"]'::jsonb, 'D'),
  ('Which number does not belong: 2, 3, 5, 9, 11?', 'mcq', '["9", "3", "5", "2"]'::jsonb, 'A'),
  ('Which number does not belong: 121, 144, 169, 200?', 'mcq', '["200", "169", "121", "144"]'::jsonb, 'A'),
  ('Which does not belong with the others: 8, 27, 64, 90, 125?', 'mcq', '["90", "27", "8", "125"]'::jsonb, 'A'),
  ('Which number is the odd one out: 6, 10, 14, 15, 18?', 'mcq', '["14", "10", "6", "15"]'::jsonb, 'D'),
  ('Which does not belong: 3, 5, 7, 9, 11?', 'mcq', '["7", "9", "3", "5"]'::jsonb, 'B'),
  ('A 3×3 matrix follows this pattern — Row 1: ○ □ △, Row 2: □ △ ○, Row 3: △ ○ __? What completes the matrix?', 'mcq', '["□", "△", "◇", "○"]'::jsonb, 'A'),
  ('A pattern repeats every 3 steps: Red, Blue, Green, Red, Blue, Green... What is the 20th shape''s colour?', 'mcq', '["Green", "Red", "Yellow", "Blue"]'::jsonb, 'D'),
  ('In a matrix, each row''s numbers increase by 2 and each column''s numbers increase by 5. If the top-left value is 1, what is the value at row 2, column 2?', 'mcq', '["7", "9", "6", "8"]'::jsonb, 'D'),
  ('A sequence of shapes doubles in number every step: 1 circle, 2 circles, 4 circles, 8 circles. How many circles come next?', 'mcq', '["16", "18", "14", "12"]'::jsonb, 'A'),
  ('A grid pattern shows numbers increasing left to right by 3 and top to bottom by 4. If the top-left cell is 2, what is the value directly below and one to the right?', 'mcq', '["8", "7", "9", "10"]'::jsonb, 'C'),
  ('A 2×2 matrix has 4, 9 in the top row and 16, __ in the bottom row, following a squares pattern (2², 3², 4², 5²). What is missing?', 'mcq', '["20", "30", "24", "25"]'::jsonb, 'D')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Spatial Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('How many surfaces does a cylinder have?', 'mcq', '["2", "4", "5", "3"]'::jsonb, 'D'),
  ('A cube has a total surface area of 150 cm². What is the length of one side?', 'mcq', '["6 cm", "5 cm", "4 cm", "7 cm"]'::jsonb, 'B'),
  ('If you rotate the letter ''p'' by 180°, you get:', 'mcq', '["n", "q", "d", "b"]'::jsonb, 'C'),
  ('Which 3D shape has a circular base and comes to a single point?', 'mcq', '["Cylinder", "Sphere", "Pyramid", "Cone"]'::jsonb, 'D'),
  ('A rectangular piece of paper is folded in half twice. How many layers are there?', 'mcq', '["5", "2", "3", "4"]'::jsonb, 'D'),
  ('What is the minimum number of colours needed to colour a cube''s faces so no adjacent faces share a colour?', 'mcq', '["2", "3", "5", "4"]'::jsonb, 'B'),
  ('If north is to your right and you face east, which direction is directly behind you?', 'mcq', '["West", "East", "South", "North"]'::jsonb, 'A'),
  ('A shape has 5 faces, 9 edges and 6 vertices. What is it?', 'mcq', '["Square pyramid", "Triangular prism", "Cube", "Tetrahedron"]'::jsonb, 'B'),
  ('A cube is painted red on all faces and then cut into 27 equal smaller cubes. How many small cubes have exactly 2 painted faces?', 'mcq', '["24", "12", "8", "6"]'::jsonb, 'B'),
  ('A tetrahedron has how many triangular faces?', 'mcq', '["5", "4", "3", "6"]'::jsonb, 'B'),
  ('A square sheet of paper is folded in half diagonally, then in half again. How many layers of paper are there?', 'mcq', '["2", "8", "4", "3"]'::jsonb, 'C'),
  ('Which solid has the same number of faces, edges, and vertices related by Euler''s formula (F + V − E = 2)? Choose an example that satisfies this for a cube (F=6, V=8, E=12).', 'mcq', '["6 + 8 − 12 = 4", "6 + 8 − 12 = 0", "6 + 8 − 12 = 1", "6 + 8 − 12 = 2"]'::jsonb, 'D'),
  ('A cuboid has dimensions 4 cm × 3 cm × 2 cm. How many faces does it have?', 'mcq', '["6", "8", "5", "4"]'::jsonb, 'A'),
  ('A dice (standard cube) has opposite faces summing to 7. If the top face shows 3, what does the bottom face show?', 'mcq', '["6", "3", "4", "5"]'::jsonb, 'C'),
  ('If you view a 3D cube from directly above, what 2D shape do you see?', 'mcq', '["Rectangle", "Triangle", "Square", "Circle"]'::jsonb, 'C'),
  ('How many edges does a square pyramid have?', 'mcq', '["8", "6", "10", "12"]'::jsonb, 'A'),
  ('A rectangular block is cut into two equal halves along its length. What shape are the new exposed faces?', 'mcq', '["Circle", "Triangle", "Rectangle", "Square"]'::jsonb, 'C'),
  ('If a clock''s hour hand moves from 12 to 4, through how many degrees has it rotated?', 'mcq', '["100°", "120°", "150°", "90°"]'::jsonb, 'B'),
  ('A wheel completes one full rotation. Through how many degrees has it turned?', 'mcq', '["300°", "180°", "270°", "360°"]'::jsonb, 'D'),
  ('Which of these nets, when folded, forms a cube: a cross-shaped arrangement of 6 squares, or a straight line of 6 squares?', 'mcq', '["Neither arrangement forms a cube", "The straight line of 6 squares", "Both arrangements form a cube equally well", "The cross-shaped arrangement of 6 squares"]'::jsonb, 'D'),
  ('A person walks 4 km North, then 3 km East. What is the straight-line (shortest) distance back to the starting point?', 'mcq', '["7 km", "4 km", "5 km", "6 km"]'::jsonb, 'C'),
  ('A cube''s volume is 64 cm³. What is the length of one edge?', 'mcq', '["3 cm", "5 cm", "6 cm", "4 cm"]'::jsonb, 'D'),
  ('Which 2D shape, when rotated around one of its sides, forms a cylinder?', 'mcq', '["Triangle", "Circle", "Pentagon", "Rectangle"]'::jsonb, 'D'),
  ('A regular hexagon is divided by its diagonals from the centre. How many equal triangles are formed?', 'mcq', '["8", "5", "6", "4"]'::jsonb, 'C'),
  ('If you fold a square piece of paper into quarters (in half, then in half again), how many smaller squares of paper result when unfolded?', 'mcq', '["4", "2", "3", "8"]'::jsonb, 'A')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Clerical Speed & Accuracy'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Which pair of numbers is identical? A: 8742-8742  B: 8724-8742  C: 8742-8724  D: 7842-8742', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'A'),
  ('Spot the error in the sequence: 1, 4, 9, 16, 24, 36', 'mcq', '["1", "9", "24", "36"]'::jsonb, 'C'),
  ('Which word is spelled correctly? A: Necesary  B: Necessary  C: Neccessary  D: Necessery', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'B'),
  ('Arrange in ascending order: 0.75, 3/4, 0.07, 7/8', 'mcq', '["0.07 < 0.75 = 3/4 < 7/8", "3/4 < 7/8 < 0.75 < 0.07", "0.07 < 7/8 < 0.75 < 3/4", "0.75 < 0.07 < 3/4 < 7/8"]'::jsonb, 'A'),
  ('Which row contains a repeated item? Row A: 14 41 114 141 | Row B: 22 222 22 2222 | Row C: 33 333 3333 33333 | Row D: 12 21 121 211', 'mcq', '["Row A", "Row B", "Row C", "Row D"]'::jsonb, 'B'),
  ('How many times does the letter ''e'' appear in this sentence: ''The elephant entered the enormous enclosure''?', 'mcq', '["7", "8", "9", "10"]'::jsonb, 'C'),
  ('Which code-pair does NOT match? A: KL–LK  B: MN–MN  C: OP–OP  D: QR–QR', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'A'),
  ('Which pair is identical? A: 45231-45231  B: 45213-45231  C: 45231-45213  D: 42531-45231', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'A'),
  ('Find the number that does NOT match the given code: 3456 → 3456, 7891 → 7891, 2345 → 2354, 6789 → 6789', 'mcq', '["3456", "7891", "2345", "6789"]'::jsonb, 'C'),
  ('How many times does the digit ''7'' appear in this list: 17, 27, 37, 47, 57, 67, 71, 72, 77?', 'mcq', '["9", "10", "11", "12"]'::jsonb, 'C'),
  ('Which pair of words is identical? A: Assessment-Assessment  B: Assessment-Assesment  C: Asessment-Assessment  D: Assessmant-Assessment', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'A'),
  ('Spot the odd item out in the list: XY12, XY12, XY12, YX12', 'mcq', '["1st XY12", "2nd XY12", "3rd XY12", "YX12"]'::jsonb, 'D'),
  ('Which set of letters is arranged in alphabetical order? A: BCAD  B: ABCD  C: ACBD  D: DCBA', 'mcq', '["Set A", "Set B", "Set C", "Set D"]'::jsonb, 'B'),
  ('Count how many times the number ''5'' appears: 512, 255, 350, 555, 105', 'mcq', '["6", "7", "8", "9"]'::jsonb, 'C'),
  ('Which pair does NOT match? A: 7823-7823  B: 4519-4519  C: 6284-6284  D: 3157-3175', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'D'),
  ('Arrange in descending order: 45, 4.5, 450, 0.45', 'mcq', '["450 > 45 > 4.5 > 0.45", "45 > 450 > 4.5 > 0.45", "450 > 4.5 > 45 > 0.45", "0.45 > 4.5 > 45 > 450"]'::jsonb, 'A'),
  ('How many pairs of consecutive numbers appear in this series: 3, 4, 8, 9, 15, 16, 20?', 'mcq', '["2", "3", "4", "1"]'::jsonb, 'B'),
  ('Which of these words appears twice in the list: Apple, Mango, Banana, Grape, Mango, Orange?', 'mcq', '["Apple", "Mango", "Banana", "Grape"]'::jsonb, 'B'),
  ('Identify the correctly matched code pair: A: 425-524  B: 425-425  C: 245-425  D: 524-245', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'B'),
  ('Which row has all numbers in increasing order? A: 12, 9, 15, 20  B: 5, 10, 15, 20  C: 20, 15, 10, 5  D: 15, 12, 18, 9', 'mcq', '["Row A", "Row B", "Row C", "Row D"]'::jsonb, 'B'),
  ('How many vowels are there in the word ''ORGANIZATION''?', 'mcq', '["6", "5", "7", "4"]'::jsonb, 'A'),
  ('Which pair of symbols is identical? A: @#$%-@#$%  B: @#$%-@#%$  C: @#%$-@#$%  D: @$#%-@#$%', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'A'),
  ('In the list 62, 26, 62, 26, 62, which number appears more often?', 'mcq', '["62", "26", "Both appear equally", "Neither appears"]'::jsonb, 'A'),
  ('Which of these is the correctly matched pair of codes? A: AB12-AB12  B: AB12-BA12  C: AB21-AB12  D: A1B2-AB12', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'A'),
  ('How many times does the pattern ''an'' appear in the word ''BANANA''?', 'mcq', '["2", "1", "3", "0"]'::jsonb, 'A')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Numerical Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('A shopkeeper marks an item 40% above cost price and allows a discount of 25%. Find his profit percentage.', 'mcq', '["5%", "10%", "15%", "20%"]'::jsonb, 'A'),
  ('The price of an article is increased by 20% and then decreased by 20%. What is the net percentage change?', 'mcq', '["4% decrease", "4% increase", "2% decrease", "No change"]'::jsonb, 'A'),
  ('A trader allows a discount of 10% and still makes a profit of 8%. If the cost price is ₹500, find the marked price.', 'mcq', '["₹580", "₹600", "₹620", "₹640"]'::jsonb, 'B'),
  ('Two successive discounts of 20% and 10% are equivalent to a single discount of:', 'mcq', '["28%", "30%", "32%", "26%"]'::jsonb, 'A'),
  ('A man sells two articles at ₹990 each. On one he gains 10% and on the other he loses 10%. What is his overall gain or loss percentage?', 'mcq', '["No profit no loss", "1% loss", "1% profit", "2% loss"]'::jsonb, 'B'),
  ('The population of a town increases by 10% every year. If the present population is 26,620, what was the population two years ago?', 'mcq', '["20,000", "21,000", "22,000", "23,000"]'::jsonb, 'C'),
  ('A retailer buys goods at a discount of 20% on the list price and sells them at the list price. Find his profit percentage.', 'mcq', '["20%", "25%", "30%", "15%"]'::jsonb, 'B'),
  ('The cost price of 15 articles is equal to the selling price of 12 articles. Find the profit percentage.', 'mcq', '["20%", "25%", "30%", "15%"]'::jsonb, 'B'),
  ('Find the compound interest on ₹15,000 at 10% per annum for 2 years, compounded annually.', 'mcq', '["₹3,000", "₹3,100", "₹3,150", "₹3,200"]'::jsonb, 'C'),
  ('The simple interest on a sum for 2 years at 12% p.a. is ₹1,800. Find the sum.', 'mcq', '["₹7,000", "₹7,500", "₹8,000", "₹6,500"]'::jsonb, 'B'),
  ('At what rate percent per annum will a sum of ₹8,000 amount to ₹9,800 in 3 years at simple interest?', 'mcq', '["6%", "7%", "7.5%", "8%"]'::jsonb, 'C'),
  ('The difference between compound interest and simple interest on a sum for 2 years at 10% p.a. is ₹150. Find the sum.', 'mcq', '["₹12,000", "₹15,000", "₹18,000", "₹10,000"]'::jsonb, 'B'),
  ('If a:b = 3:4 and b:c = 5:6, find a:b:c.', 'mcq', '["15:20:24", "12:16:20", "9:12:15", "10:15:18"]'::jsonb, 'A'),
  ('₹3,900 is divided among A, B and C in the ratio 3:4:6. Find C''s share.', 'mcq', '["₹1,600", "₹1,700", "₹1,800", "₹1,900"]'::jsonb, 'C'),
  ('Two numbers are in the ratio 4:7. If 12 is subtracted from each, the new ratio becomes 1:2. Find the two numbers.', 'mcq', '["36 and 63", "48 and 84", "40 and 70", "44 and 77"]'::jsonb, 'B'),
  ('If x:y = 2:3, find the value of (3x + 2y):(2x + 5y).', 'mcq', '["12:19", "10:17", "14:21", "9:16"]'::jsonb, 'A'),
  ('A can complete a work in 20 days and B in 30 days. They work together for 5 days, and then A leaves. In how many days will B finish the remaining work?', 'mcq', '["15 days", "17.5 days", "18 days", "20 days"]'::jsonb, 'B'),
  ('A, B and C can complete a piece of work in 10, 15 and 30 days respectively. In how many days can they complete it working together?', 'mcq', '["5 days", "6 days", "4 days", "7 days"]'::jsonb, 'A'),
  ('A pipe can fill a tank in 8 hours and another can empty it in 12 hours. If both are opened together, in how many hours will the tank be full?', 'mcq', '["20 hours", "24 hours", "18 hours", "16 hours"]'::jsonb, 'B'),
  ('12 men can complete a project in 18 days. How many men are needed to complete it in 8 days?', 'mcq', '["24", "27", "30", "32"]'::jsonb, 'B'),
  ('A is twice as efficient as B. Together they finish a work in 12 days. In how many days can A alone finish the work?', 'mcq', '["16 days", "18 days", "20 days", "24 days"]'::jsonb, 'B'),
  ('6 women can do a piece of work in 15 days, and 10 men can do the same work in 6 days. Find the ratio of the work efficiency of a man to a woman.', 'mcq', '["3:2", "2:3", "5:3", "4:3"]'::jsonb, 'A'),
  ('A train 240 m long crosses a platform 260 m long in 25 seconds. Find the speed of the train in km/h.', 'mcq', '["60 km/h", "66 km/h", "72 km/h", "78 km/h"]'::jsonb, 'C'),
  ('A boat covers 32 km upstream in 8 hours and the same distance downstream in 4 hours. Find the speed of the boat in still water.', 'mcq', '["5 km/h", "6 km/h", "7 km/h", "8 km/h"]'::jsonb, 'B'),
  ('Two stations A and B are 330 km apart. A train starts from A at 8 a.m. at 60 km/h towards B, and another starts from B at 9 a.m. at 75 km/h towards A. At what time will they meet?', 'mcq', '["10 a.m.", "10:30 a.m.", "11 a.m.", "11:30 a.m."]'::jsonb, 'C'),
  ('A car covers a distance in 6 hours at 50 km/h. At what speed should it travel to cover the same distance in 5 hours?', 'mcq', '["55 km/h", "60 km/h", "65 km/h", "70 km/h"]'::jsonb, 'B'),
  ('Excluding stoppages, a bus travels at 60 km/h, and including stoppages it travels at 45 km/h. For how many minutes does the bus stop per hour?', 'mcq', '["10 minutes", "12 minutes", "15 minutes", "18 minutes"]'::jsonb, 'C'),
  ('A man rows 15 km downstream in 3 hours and returns upstream in 5 hours. Find the speed of the stream.', 'mcq', '["1 km/h", "1.5 km/h", "2 km/h", "2.5 km/h"]'::jsonb, 'A'),
  ('Solve for x: 2x² − 7x + 3 = 0. Find the larger root.', 'mcq', '["3", "1/2", "-3", "7/2"]'::jsonb, 'A'),
  ('If x + 1/x = 5, find the value of x² + 1/x².', 'mcq', '["21", "23", "25", "27"]'::jsonb, 'B'),
  ('The 5th term of an AP is 18 and the 10th term is 33. Find the common difference.', 'mcq', '["2", "3", "4", "5"]'::jsonb, 'B'),
  ('Find the sum of the first 15 terms of the AP: 3, 7, 11, 15, …', 'mcq', '["450", "465", "480", "495"]'::jsonb, 'B'),
  ('The 3rd term of a GP is 12 and the 6th term is 96. Find the common ratio.', 'mcq', '["2", "3", "4", "1.5"]'::jsonb, 'A'),
  ('If f(x) = 2x² − 3x + 1, find f(2).', 'mcq', '["2", "3", "4", "5"]'::jsonb, 'B'),
  ('Solve the inequality: 3x − 5 > 4. What is the solution?', 'mcq', '["x > 3", "x < 3", "x > 9", "x < 9"]'::jsonb, 'A'),
  ('If 3^(x+1) = 81, find the value of x.', 'mcq', '["2", "3", "4", "5"]'::jsonb, 'B'),
  ('In how many ways can the letters of the word ''TABLE'' be arranged?', 'mcq', '["100", "110", "120", "130"]'::jsonb, 'C'),
  ('How many 3-digit numbers can be formed using digits 1, 2, 3, 4, 5 without repetition?', 'mcq', '["50", "60", "70", "80"]'::jsonb, 'B'),
  ('In how many ways can a committee of 3 be selected from 8 people?', 'mcq', '["48", "56", "64", "72"]'::jsonb, 'B'),
  ('A bag contains 5 red and 3 blue balls. If one ball is drawn at random, what is the probability that it is blue?', 'mcq', '["1/3", "3/8", "5/8", "3/5"]'::jsonb, 'B'),
  ('Two dice are thrown together. What is the probability of getting a sum of 7?', 'mcq', '["1/6", "1/9", "1/12", "1/4"]'::jsonb, 'A'),
  ('From a deck of 52 cards, one card is drawn at random. What is the probability that it is a king or a queen?', 'mcq', '["1/13", "2/13", "1/26", "4/13"]'::jsonb, 'B'),
  ('Find the volume of a cylinder with radius 7 cm and height 10 cm. (use π = 22/7)', 'mcq', '["1450 cm³", "1500 cm³", "1540 cm³", "1600 cm³"]'::jsonb, 'C'),
  ('The curved surface area of a cone with radius 7 cm and slant height 10 cm is: (π = 22/7)', 'mcq', '["200 cm²", "210 cm²", "220 cm²", "230 cm²"]'::jsonb, 'C'),
  ('Find the volume of a sphere with radius 6 cm. (π = 22/7, rounded to the nearest whole number)', 'mcq', '["850 cm³", "880 cm³", "905 cm³", "930 cm³"]'::jsonb, 'C'),
  ('The area of a trapezium with parallel sides 12 cm and 8 cm and height 5 cm is:', 'mcq', '["45 cm²", "50 cm²", "55 cm²", "60 cm²"]'::jsonb, 'B'),
  ('If log₂ x = 5, find the value of x.', 'mcq', '["16", "25", "32", "64"]'::jsonb, 'C'),
  ('Simplify: (2³ × 2⁴) ÷ 2⁵', 'mcq', '["2", "4", "8", "16"]'::jsonb, 'B'),
  ('Find the value of sin 30° + cos 60°.', 'mcq', '["0.5", "1", "1.5", "2"]'::jsonb, 'B'),
  ('If tan θ = 1, and θ is acute, find the value of θ.', 'mcq', '["30°", "45°", "60°", "90°"]'::jsonb, 'B')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Verbal Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Choose the word most similar to ''EPHEMERAL'':', 'mcq', '["Permanent", "Fleeting", "Eternal", "Enduring"]'::jsonb, 'B'),
  ('Choose the word most similar to ''OBSTINATE'':', 'mcq', '["Stubborn", "Flexible", "Compliant", "Yielding"]'::jsonb, 'A'),
  ('Choose the word most similar to ''PRAGMATIC'':', 'mcq', '["Idealistic", "Practical", "Impractical", "Whimsical"]'::jsonb, 'B'),
  ('Choose the word most similar to ''AUDACIOUS'':', 'mcq', '["Timid", "Bold", "Cowardly", "Shy"]'::jsonb, 'B'),
  ('Choose the word most similar to ''FRUGALITY'':', 'mcq', '["Extravagance", "Thriftiness", "Wastefulness", "Excess"]'::jsonb, 'B'),
  ('Choose the word most similar to ''INNATE'':', 'mcq', '["Acquired", "Learned", "Inborn", "External"]'::jsonb, 'C'),
  ('Choose the word most similar to ''CANDOUR'':', 'mcq', '["Deception", "Honesty", "Secrecy", "Ambiguity"]'::jsonb, 'B'),
  ('Choose the word most similar to ''VOLATILE'':', 'mcq', '["Stable", "Unpredictable", "Calm", "Constant"]'::jsonb, 'B'),
  ('Choose the word opposite to ''MAGNANIMOUS'':', 'mcq', '["Generous", "Petty", "Kind", "Noble"]'::jsonb, 'B'),
  ('Choose the word opposite to ''AMBIGUOUS'':', 'mcq', '["Vague", "Clear", "Uncertain", "Confusing"]'::jsonb, 'B'),
  ('Choose the word opposite to ''PROLIFIC'':', 'mcq', '["Productive", "Barren", "Fertile", "Abundant"]'::jsonb, 'B'),
  ('Choose the word opposite to ''TRANSIENT'':', 'mcq', '["Temporary", "Permanent", "Brief", "Fleeting"]'::jsonb, 'B'),
  ('Choose the word opposite to ''BENEVOLENT'':', 'mcq', '["Kind", "Malevolent", "Generous", "Compassionate"]'::jsonb, 'B'),
  ('Choose the word opposite to ''SCRUPULOUS'':', 'mcq', '["Careless", "Careful", "Meticulous", "Honest"]'::jsonb, 'A'),
  ('Choose the word opposite to ''VERACITY'':', 'mcq', '["Truthfulness", "Falsehood", "Accuracy", "Honesty"]'::jsonb, 'B'),
  ('Choose the word opposite to ''ELOQUENT'':', 'mcq', '["Well-spoken", "Inarticulate", "Fluent", "Persuasive"]'::jsonb, 'B'),
  ('Complete the analogy — Doctor : Stethoscope :: Carpenter : ___?', 'mcq', '["Saw", "Needle", "Brush", "Scale"]'::jsonb, 'A'),
  ('Complete the analogy — Optimist : Hope :: Pessimist : ___?', 'mcq', '["Joy", "Despair", "Faith", "Confidence"]'::jsonb, 'B'),
  ('Complete the analogy — Miser : Generosity :: Coward : ___?', 'mcq', '["Fear", "Courage", "Weakness", "Anxiety"]'::jsonb, 'B'),
  ('Complete the analogy — Author : Manuscript :: Sculptor : ___?', 'mcq', '["Chisel", "Statue", "Museum", "Marble"]'::jsonb, 'B'),
  ('Complete the analogy — Frugal : Miserly :: Confident : ___?', 'mcq', '["Humble", "Arrogant", "Timid", "Cautious"]'::jsonb, 'B'),
  ('Complete the analogy — Library : Books :: Museum : ___?', 'mcq', '["Paintings", "Artifacts", "Visitors", "Curator"]'::jsonb, 'B'),
  ('Find the odd one out:', 'mcq', '["Ecstatic", "Elated", "Jubilant", "Melancholic"]'::jsonb, 'D'),
  ('Find the odd one out:', 'mcq', '["Jupiter", "Saturn", "Sirius", "Neptune"]'::jsonb, 'C'),
  ('Find the odd one out:', 'mcq', '["Sonnet", "Ballad", "Elegy", "Novel"]'::jsonb, 'D'),
  ('Find the odd one out:', 'mcq', '["Frugal", "Thrifty", "Economical", "Lavish"]'::jsonb, 'D'),
  ('Choose the one word for: A person who is unable to sleep.', 'mcq', '["Insomniac", "Narcoleptic", "Anorexic", "Amnesiac"]'::jsonb, 'A'),
  ('Choose the one word for: A person who loves and collects books.', 'mcq', '["Bibliophile", "Philanthropist", "Bibliographer", "Linguist"]'::jsonb, 'A'),
  ('Choose the one word for: One who believes that human welfare is the highest goal.', 'mcq', '["Philanthropist", "Humanist", "Altruist", "Idealist"]'::jsonb, 'B'),
  ('Choose the one word for: A statement that seems self-contradictory but may be true.', 'mcq', '["Paradox", "Oxymoron", "Anomaly", "Irony"]'::jsonb, 'A'),
  ('What does the idiom ''burn the midnight oil'' mean?', 'mcq', '["To waste time", "To work late into the night", "To relax", "To cause a fire"]'::jsonb, 'B'),
  ('What does the idiom ''a blessing in disguise'' mean?', 'mcq', '["A hidden curse", "Something good that seemed bad at first", "An obvious gift", "A disguised threat"]'::jsonb, 'B'),
  ('What does the idiom ''to take something with a pinch of salt'' mean?', 'mcq', '["To season food", "To believe something completely", "To be skeptical about something", "To ignore completely"]'::jsonb, 'C'),
  ('What does the idiom ''to hit the nail on the head'' mean?', 'mcq', '["To make a mistake", "To do something exactly right", "To injure someone", "To waste effort"]'::jsonb, 'B'),
  ('What does the idiom ''to read between the lines'' mean?', 'mcq', '["To read carefully word by word", "To understand the hidden meaning", "To skip parts of text", "To read quickly"]'::jsonb, 'B'),
  ('What does the idiom ''to be on the fence'' mean?', 'mcq', '["To be undecided", "To be very certain", "To avoid people", "To break rules"]'::jsonb, 'A'),
  ('Choose the grammatically correct sentence.', 'mcq', '["Neither of the boys have finished their homework.", "Neither of the boys has finished his homework.", "Neither of the boys has finished their homework.", "Neither of the boy has finished his homework."]'::jsonb, 'B'),
  ('Identify the correctly punctuated sentence.', 'mcq', '["Having finished the report, John submitted it to his manager.", "Having finished the report John submitted it to his manager.", "Having, finished the report, John submitted it to his manager.", "Having finished the report; John submitted it to his manager."]'::jsonb, 'A'),
  ('Choose the sentence with the correct use of the subjunctive mood.', 'mcq', '["If I was rich, I would travel the world.", "If I were rich, I would travel the world.", "If I am rich, I would travel the world.", "If I would be rich, I will travel the world."]'::jsonb, 'B'),
  ('Which sentence correctly uses a semicolon?', 'mcq', '["I have a big test tomorrow; I can''t go out tonight.", "I have a big test tomorrow, I can''t go out tonight.", "I have a big test tomorrow: I can''t go out tonight.", "I have a big test tomorrow I can''t go out tonight."]'::jsonb, 'A'),
  ('Choose the sentence free from redundancy.', 'mcq', '["She returned back home late at night.", "She returned home late at night.", "She again returned back home late.", "She returned back to home late."]'::jsonb, 'B'),
  ('Identify the sentence with correct parallel structure.', 'mcq', '["She likes reading, writing, and to paint.", "She likes reading, writing, and painting.", "She likes to read, writing, and painting.", "She likes reading, to write, and painting."]'::jsonb, 'B'),
  ('Statement: ''All successful entrepreneurs take calculated risks.'' Conclusion: ''Anyone who takes calculated risks will become a successful entrepreneur.'' Is the conclusion valid?', 'mcq', '["Valid, since risk-taking guarantees success", "Invalid, because the statement does not imply the reverse", "Valid, because all risks lead to success", "Invalid, because entrepreneurs never take risks"]'::jsonb, 'B'),
  ('Statement: ''If it rains, the match will be cancelled.'' It did not rain. What can be concluded?', 'mcq', '["The match was definitely cancelled", "The match was definitely held", "No definite conclusion can be drawn about the match", "The match was postponed"]'::jsonb, 'C'),
  ('Statement: ''Most students who study regularly score well in exams. Ravi scored well in his exam.'' What can be concluded?', 'mcq', '["Ravi definitely studied regularly", "We cannot conclude Ravi studied regularly, since scoring well can have other causes", "Ravi never studies", "All students who score well study regularly"]'::jsonb, 'B'),
  ('Argument: ''The new policy will reduce traffic congestion because fewer cars will be allowed downtown.'' Which statement, if true, would most weaken this argument?', 'mcq', '["The policy takes effect next month", "Public transport ridership will increase as a result", "Drivers will simply park just outside the restricted zone and walk in, causing congestion nearby", "The city council approved the policy unanimously"]'::jsonb, 'C'),
  ('Passage: Renewable energy sources such as solar and wind are becoming increasingly cost-competitive with fossil fuels. However, their intermittent nature — the sun does not always shine, and the wind does not always blow — means that energy storage solutions remain essential for a reliable power grid. According to the passage, what is a key challenge of renewable energy?', 'mcq', '["High cost compared to fossil fuels", "Intermittency requiring storage solutions", "Lack of consumer interest", "Difficulty in manufacturing solar panels"]'::jsonb, 'B'),
  ('Based on the same passage, what does ''intermittent'' most nearly mean?', 'mcq', '["Continuous", "Occasional or irregular", "Expensive", "Renewable"]'::jsonb, 'B'),
  ('Based on the same passage, which of the following can be inferred?', 'mcq', '["Fossil fuels will soon be banned", "Energy storage technology is important for renewable energy to be reliable", "Solar energy is more reliable than wind energy", "Renewable energy is no longer cost-competitive"]'::jsonb, 'B'),
  ('The passage above primarily discusses:', 'mcq', '["The history of fossil fuels", "The economics and challenges of renewable energy", "How to build a wind turbine", "Government policies on energy"]'::jsonb, 'B')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Abstract / Logical Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('What comes next in the series: 2, 5, 11, 23, 47, __?', 'mcq', '["92", "94", "95", "96"]'::jsonb, 'C'),
  ('What comes next in the series: 6, 11, 21, 41, 81, __?', 'mcq', '["159", "160", "161", "162"]'::jsonb, 'C'),
  ('What comes next in the series: 1, 2, 6, 24, 120, __?', 'mcq', '["600", "700", "720", "740"]'::jsonb, 'C'),
  ('What comes next in the series: 3, 8, 15, 24, 35, __?', 'mcq', '["46", "47", "48", "49"]'::jsonb, 'C'),
  ('What comes next in the series: 5, 9, 17, 33, 65, __?', 'mcq', '["125", "127", "129", "131"]'::jsonb, 'C'),
  ('What comes next in the series: 2, 3, 5, 8, 13, 21, __?', 'mcq', '["29", "31", "34", "36"]'::jsonb, 'C'),
  ('What comes next in the series: 7, 26, 63, 124, 215, __?', 'mcq', '["330", "336", "342", "350"]'::jsonb, 'C'),
  ('What comes next in the series: 4, 6, 9, 13.5, __?', 'mcq', '["18", "19.5", "20.25", "21"]'::jsonb, 'C'),
  ('Complete the series: CE, FH, IK, LN, __?', 'mcq', '["OQ", "PR", "NQ", "OP"]'::jsonb, 'A'),
  ('Complete the series: ZYXW, VUTS, RQPO, __?', 'mcq', '["NMLK", "MLKJ", "NMLJ", "LKJI"]'::jsonb, 'A'),
  ('Complete the series: AB, DEF, HIJK, __?', 'mcq', '["MNOPQ", "LMNOP", "MNOPR", "NOPQR"]'::jsonb, 'A'),
  ('Complete the series: J9, L11, N13, P15, __?', 'mcq', '["R17", "Q16", "R16", "S17"]'::jsonb, 'A'),
  ('Complete the series: B2, D6, F12, H20, __?', 'mcq', '["J30", "J28", "I30", "J32"]'::jsonb, 'A'),
  ('Complete the series: Y, W, T, P, __?', 'mcq', '["K", "L", "J", "M"]'::jsonb, 'A'),
  ('Statements: All pens are pencils. Some pencils are erasers. Conclusion: Some pens are erasers.', 'mcq', '["Definitely true", "Definitely false", "Cannot be determined", "True only if all pencils are erasers"]'::jsonb, 'C'),
  ('Statements: No cups are plates. All plates are dishes. Conclusion: No cups are dishes.', 'mcq', '["True", "False", "Cannot be determined", "Partially true"]'::jsonb, 'C'),
  ('Statements: All roses are flowers. All flowers are plants. Conclusion: All roses are plants.', 'mcq', '["True", "False", "Cannot be determined", "Only some roses are plants"]'::jsonb, 'A'),
  ('Statements: Some doctors are engineers. All engineers are graduates. Conclusion: Some doctors are graduates.', 'mcq', '["True", "False", "Cannot be determined", "Contradictory"]'::jsonb, 'A'),
  ('Statements: All A are B. No B is C. Conclusion: No A is C.', 'mcq', '["True", "False", "Cannot be determined", "Partially true"]'::jsonb, 'A'),
  ('Statements: Some books are pens. Some pens are tables. Conclusion: Some books are tables.', 'mcq', '["True", "False", "Cannot be determined", "Both true and false"]'::jsonb, 'C'),
  ('Statements: All squares are rectangles. Some rectangles are circles. Conclusion I: Some squares are circles. Conclusion II: Some circles are squares.', 'mcq', '["Only I follows", "Only II follows", "Neither follows", "Both follow"]'::jsonb, 'C'),
  ('Statements: All fish live in water. Some water bodies are polluted. Conclusion: Some fish live in polluted water bodies.', 'mcq', '["True", "False", "Cannot be determined", "Definitely true"]'::jsonb, 'C'),
  ('If in a code, ''BOOK'' is written as ''CPPL'' (each letter shifted forward by 1), how is ''PAGE'' written?', 'mcq', '["QBHF", "QBHG", "PBHF", "QCHF"]'::jsonb, 'A'),
  ('If ''FLOWER'' is coded as ''EKNVDQ'' (each letter shifted back by 1), how is ''GARDEN'' coded?', 'mcq', '["FZQCDM", "FZQDCM", "GZQCDM", "FZPCDM"]'::jsonb, 'A'),
  ('In a certain code, ''TIGER'' is written as ''UJHFS'' (each letter shifted forward by 1). How is ''LION'' written in the same code?', 'mcq', '["MJPO", "MJOP", "LJPO", "MKPO"]'::jsonb, 'A'),
  ('If ''345'' means ''good sweet mango'', ''367'' means ''good ripe fruit'', and ''489'' means ''sweet ripe orange'', which digit means ''good''?', 'mcq', '["3", "4", "5", "None of these"]'::jsonb, 'A'),
  ('If the code for ''COMPUTER'' is ''RETUPMOC'' (letters reversed), what is the code for ''NETWORK''?', 'mcq', '["KROWTEN", "KROWTNE", "NROWTEK", "KRWOTEN"]'::jsonb, 'A'),
  ('If 5 # 3 = 22, and 8 # 2 = 62, then 6 # 4 = ?', 'mcq', '["30", "32", "34", "36"]'::jsonb, 'B'),
  ('Pointing to a man, a woman says, ''His mother is the only daughter of my mother.'' How is the woman related to the man?', 'mcq', '["Mother", "Sister", "Aunt", "Daughter"]'::jsonb, 'A'),
  ('A is B''s sister. C is B''s mother. D is C''s father. How is A related to D?', 'mcq', '["Grandmother", "Grandfather", "Granddaughter", "Daughter"]'::jsonb, 'C'),
  ('Introducing a boy, a girl said, ''He is the son of my mother''s only brother.'' How is the boy related to the girl?', 'mcq', '["Cousin", "Brother", "Nephew", "Uncle"]'::jsonb, 'A'),
  ('P is Q''s brother. R is Q''s mother. S is R''s father. T is S''s mother. How is P related to T?', 'mcq', '["Great-grandson", "Grandson", "Grandfather", "Son"]'::jsonb, 'A'),
  ('A is the son of B. B is the sister of C. C has a son D and a daughter E. How is A related to D?', 'mcq', '["Cousin", "Brother", "Nephew", "Uncle"]'::jsonb, 'A'),
  ('In a family, X is the husband of Y. Y is the mother of Z. Z is the sister of W. How is X related to W?', 'mcq', '["Father", "Uncle", "Brother", "Grandfather"]'::jsonb, 'A'),
  ('A man walks 6 km East, then turns South and walks 8 km, then turns West and walks 6 km. How far is he from his starting point?', 'mcq', '["6 km", "8 km", "10 km", "14 km"]'::jsonb, 'B'),
  ('Starting from a point, a man walks 10 m North, then turns right and walks 10 m, then turns right again and walks 10 m. In which direction is he now from the starting point?', 'mcq', '["North", "South", "East", "West"]'::jsonb, 'C'),
  ('A boy starts walking facing East. He turns 135° clockwise, then 180°. In which direction is he facing now?', 'mcq', '["North-East", "South-West", "North-West", "South-East"]'::jsonb, 'A'),
  ('A man walks 5 km South, then turns left and walks 10 km, then turns left again and walks 5 km. How far and in which direction is he from the starting point?', 'mcq', '["5 km East", "10 km East", "5 km West", "10 km West"]'::jsonb, 'B'),
  ('Which number is the odd one out: 8, 27, 64, 100, 125?', 'mcq', '["100", "64", "27", "125"]'::jsonb, 'A'),
  ('Which number does not belong: 49, 64, 81, 90, 121?', 'mcq', '["49", "90", "121", "64"]'::jsonb, 'B'),
  ('Find the missing number in the series: 2, 6, 12, 20, 30, __, 56', 'mcq', '["38", "40", "42", "44"]'::jsonb, 'C'),
  ('A 3×3 matrix follows an arithmetic pattern: Row 1: 4, 8, 12; Row 2: 16, 20, 24; Row 3: 28, 32, __. What completes the matrix?', 'mcq', '["34", "35", "36", "38"]'::jsonb, 'C'),
  ('A number pattern shows: 1, 8, 27, 64, 125, … What is the next term?', 'mcq', '["196", "216", "225", "243"]'::jsonb, 'B'),
  ('Which set of numbers does NOT follow the same pattern as the others? Set A: 3,6,9,12  Set B: 5,10,15,21  Set C: 2,4,6,8  Set D: 7,14,21,28', 'mcq', '["Set A", "Set B", "Set C", "Set D"]'::jsonb, 'B'),
  ('Five friends A, B, C, D, E sit in a row. B is to the right of A. C is to the left of A. D is to the right of B. E is between C and A. What is the order from left to right?', 'mcq', '["C, E, A, B, D", "A, E, C, B, D", "C, A, E, B, D", "E, C, A, B, D"]'::jsonb, 'A'),
  ('In a group of five people P, Q, R, S, T: P is taller than Q but shorter than R. S is taller than R but shorter than T. Who is the tallest?', 'mcq', '["T", "R", "S", "P"]'::jsonb, 'A'),
  ('Statement: ''All the students who scored above 90% were awarded scholarships. Ramesh was awarded a scholarship.'' Which conclusion is valid?', 'mcq', '["Ramesh scored above 90%", "Ramesh definitely scored above 90%, since only high scorers get scholarships", "We cannot be certain Ramesh scored above 90%, as other criteria might also grant scholarships", "Ramesh scored below 90%"]'::jsonb, 'C'),
  ('Five boxes are stacked one above another. Box C is above Box A but below Box E. Box B is at the very bottom. Box D is between C and E. What is the order from top to bottom?', 'mcq', '["E, D, C, A, B", "E, C, D, A, B", "B, A, C, D, E", "A, B, C, D, E"]'::jsonb, 'A'),
  ('If the word ''MONEY'' is reversed and then each letter is shifted forward by 1, what code results?', 'mcq', '["ZFOPN", "ZFPON", "YFOPN", "ZFOPM"]'::jsonb, 'A'),
  ('Four people sit around a circular table facing the centre. A is opposite B. C is to the immediate right of A. D is to the immediate left of A. Who is opposite D?', 'mcq', '["A", "B", "C", "Cannot be determined"]'::jsonb, 'C')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Spatial Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('A cube is painted on all six faces and cut into 64 equal smaller cubes (4×4×4). How many of the smaller cubes have exactly one face painted?', 'mcq', '["16", "20", "24", "28"]'::jsonb, 'C'),
  ('In the same 4×4×4 cube, how many smaller cubes have no face painted at all?', 'mcq', '["4", "6", "8", "12"]'::jsonb, 'C'),
  ('In the same 4×4×4 cube, how many smaller cubes have exactly two faces painted?', 'mcq', '["12", "20", "24", "36"]'::jsonb, 'C'),
  ('In the same 4×4×4 cube, how many smaller cubes have exactly three faces painted?', 'mcq', '["4", "6", "8", "12"]'::jsonb, 'C'),
  ('A clock''s reflection in a mirror shows 4:20. What is the actual time?', 'mcq', '["7:20", "7:40", "8:40", "7:50"]'::jsonb, 'B'),
  ('Which letter, when reflected in a vertical mirror, looks exactly the same as itself?', 'mcq', '["F", "G", "A", "S"]'::jsonb, 'C'),
  ('A standard die has opposite faces summing to 7. If 1 is on top and the right face shows 3, the die is rolled 90° to the right so the right face becomes the new top. What number is now on top?', 'mcq', '["2", "3", "4", "5"]'::jsonb, 'B'),
  ('A cube''s opposite faces sum to 7. If 5 is on the bottom, what number is on top?', 'mcq', '["1", "2", "3", "4"]'::jsonb, 'B'),
  ('A square sheet of paper is folded in half twice, forming 4 layers. A hole is punched through all layers near one corner, not on a fold line. How many holes appear when the paper is fully unfolded?', 'mcq', '["2", "3", "4", "8"]'::jsonb, 'C'),
  ('A rectangular strip of paper is folded in half four times successively. How many layers of paper are there in total?', 'mcq', '["8", "12", "16", "20"]'::jsonb, 'C'),
  ('A net made of six squares arranged in a single straight line (1×6). Can it be folded into a cube?', 'mcq', '["Yes, always", "No, a straight line of 6 squares cannot fold into a cube", "Only if squares are different colours", "Yes, but only diagonally"]'::jsonb, 'B'),
  ('If you view a cone from directly above (top view), what 2D shape do you see?', 'mcq', '["Triangle", "Circle", "Square", "Ellipse"]'::jsonb, 'B'),
  ('If you view a cylinder from the side (front view), what 2D shape do you see?', 'mcq', '["Circle", "Rectangle", "Triangle", "Oval"]'::jsonb, 'B'),
  ('A cube is viewed from a corner, looking straight along its body diagonal. What shape is the outline seen?', 'mcq', '["Square", "Triangle", "Regular hexagon", "Circle"]'::jsonb, 'C'),
  ('A figure is rotated 90° clockwise. If the original figure had a dot in the top-left corner, where will the dot be after rotation?', 'mcq', '["Top-right", "Bottom-right", "Bottom-left", "Top-left"]'::jsonb, 'A'),
  ('A figure is rotated 180°. An arrow originally pointing North will now point:', 'mcq', '["East", "West", "South", "North"]'::jsonb, 'C'),
  ('A figure is reflected across a horizontal axis. A point originally in the top-right corner will now appear in the:', 'mcq', '["Top-left", "Bottom-right", "Bottom-left", "Top-right"]'::jsonb, 'B'),
  ('How many edges does a triangular prism have?', 'mcq', '["6", "9", "12", "15"]'::jsonb, 'B'),
  ('How many vertices does an octahedron have?', 'mcq', '["6", "8", "10", "12"]'::jsonb, 'A'),
  ('A cube''s volume is 216 cm³. What is the length of one edge?', 'mcq', '["5 cm", "6 cm", "7 cm", "8 cm"]'::jsonb, 'B'),
  ('Walking 8 km North, then 6 km East, then 8 km South, a person reaches a point. What is the shortest distance to the starting point?', 'mcq', '["6 km", "8 km", "10 km", "14 km"]'::jsonb, 'A'),
  ('A person walks 3 km East, 4 km North, then 3 km West. How far and in which direction is he from the starting point?', 'mcq', '["4 km North", "3 km East", "5 km North-East", "7 km North"]'::jsonb, 'A'),
  ('A cube of side 3 cm is painted on all faces and cut into 27 unit cubes. How many cubes have paint on exactly one face?', 'mcq', '["4", "6", "8", "12"]'::jsonb, 'B'),
  ('In the same 3 cm cube (27 pieces), how many cubes have no paint at all?', 'mcq', '["0", "1", "2", "4"]'::jsonb, 'B'),
  ('Which 3D solid is formed when a right-angled triangle is rotated fully about one of its perpendicular sides?', 'mcq', '["Sphere", "Cylinder", "Cone", "Pyramid"]'::jsonb, 'C')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Clerical Speed & Accuracy'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Which pair of numbers is identical? A: 837462-837462  B: 837426-837462  C: 837462-834762  D: 873462-837462', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'A'),
  ('Spot the error in the sequence: 2, 4, 8, 16, 30, 64, 128', 'mcq', '["8", "16", "30", "64"]'::jsonb, 'C'),
  ('Which word is spelled correctly? A: Accomodate  B: Acommodate  C: Accommodate  D: Acomodate', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'C'),
  ('Arrange in ascending order: 0.6, 3/5, 0.65, 13/20', 'mcq', '["0.6 = 3/5 < 0.65 = 13/20", "3/5 < 0.6 < 13/20 < 0.65", "0.65 < 13/20 < 0.6 < 3/5", "13/20 < 0.65 < 3/5 < 0.6"]'::jsonb, 'A'),
  ('Which row contains a repeated item? Row A: 245 425 254 452 | Row B: 118 181 811 118 | Row C: 367 376 637 673 | Row D: 902 920 209 290', 'mcq', '["Row A", "Row B", "Row C", "Row D"]'::jsonb, 'B'),
  ('How many times does the letter ''s'' appear in this sentence: ''Successful students possess strong assessment skills''?', 'mcq', '["14", "15", "16", "17"]'::jsonb, 'C'),
  ('Which code-pair does NOT match? A: RS–SR  B: TU–TU  C: VW–VW  D: XY–XY', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'A'),
  ('Which pair is identical? A: 638291-638291  B: 638291-638921  C: 683291-638291  D: 638219-638291', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'A'),
  ('Find the number that does NOT match the given code: 4821 → 4821, 5932 → 5932, 6743 → 6473, 8912 → 8912', 'mcq', '["4821", "5932", "6743", "8912"]'::jsonb, 'C'),
  ('How many times does the digit ''3'' appear in this list: 13, 23, 33, 34, 35, 63, 73, 83, 93?', 'mcq', '["9", "10", "11", "12"]'::jsonb, 'B'),
  ('Which pair of words is identical? A: Correspondence-Correspondance  B: Correspondence-Correspondence  C: Corespondence-Correspondence  D: Correspondance-Correspondence', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'B'),
  ('Spot the odd item out in the list: AB34, AB34, AB43, AB34', 'mcq', '["1st AB34", "2nd AB34", "3rd AB43", "4th AB34"]'::jsonb, 'C'),
  ('Which set of letters is arranged in alphabetical order? A: MNPO  B: MNOP  C: NMOP  D: PONM', 'mcq', '["Set A", "Set B", "Set C", "Set D"]'::jsonb, 'B'),
  ('Count how many times the number ''4'' appears: 414, 244, 440, 444, 104', 'mcq', '["9", "10", "11", "12"]'::jsonb, 'B'),
  ('Which pair does NOT match? A: 91827-91827  B: 65473-65473  C: 38291-38291  D: 47382-47328', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'D'),
  ('Arrange in descending order: 78, 7.8, 780, 0.78', 'mcq', '["780 > 78 > 7.8 > 0.78", "78 > 780 > 7.8 > 0.78", "780 > 7.8 > 78 > 0.78", "0.78 > 7.8 > 78 > 780"]'::jsonb, 'A'),
  ('How many pairs of consecutive numbers appear in this series: 4, 5, 9, 10, 16, 17, 25, 30?', 'mcq', '["2", "3", "4", "5"]'::jsonb, 'B'),
  ('Which of these words appears twice in the list: Delta, Sigma, Omega, Theta, Sigma, Beta?', 'mcq', '["Delta", "Sigma", "Omega", "Theta"]'::jsonb, 'B'),
  ('Identify the correctly matched code pair: A: 637-736  B: 637-637  C: 367-637  D: 736-367', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'B'),
  ('Which row has all numbers in decreasing order? A: 45,60,30,15  B: 80,65,50,35  C: 20,40,60,80  D: 15,45,30,60', 'mcq', '["Row A", "Row B", "Row C", "Row D"]'::jsonb, 'B'),
  ('How many vowels are there in the word ''EXAMINATION''?', 'mcq', '["5", "6", "7", "8"]'::jsonb, 'B'),
  ('Which pair of symbols is identical? A: &*%$-&*%$  B: &*%$-&%*$  C: &%*$-&*%$  D: &$*%-&*%$', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'A'),
  ('In the list 84, 48, 84, 48, 84, 84, which number appears more often?', 'mcq', '["84", "48", "Both appear equally", "Neither"]'::jsonb, 'A'),
  ('Which of these is the correctly matched pair of codes? A: CD34-CD34  B: CD34-DC34  C: CD43-CD34  D: C3D4-CD34', 'mcq', '["Option A", "Option B", "Option C", "Option D"]'::jsonb, 'A'),
  ('How many times does the pattern ''is'' appear in the word ''MISSISSIPPI''?', 'mcq', '["1", "2", "3", "4"]'::jsonb, 'B')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Numerical Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('A stock rises 20% then falls 20%. Net change?', 'mcq', '["-4%", "-2%", "0%", "+4%"]'::jsonb, 'A'),
  ('If 3 workers complete a task in 12 days, how many days for 4 workers?', 'mcq', '["7", "8", "9", "10"]'::jsonb, 'C'),
  ('A data set: 10, 20, 30, 40, 50. What is the standard deviation?', 'mcq', '["√100", "√200", "10√2", "Both B and C"]'::jsonb, 'D'),
  ('₹20,000 invested at 12% compounded quarterly for 1 year. Final amount?', 'mcq', '["₹22,400", "₹22,520", "₹22,438", "₹22,300"]'::jsonb, 'C'),
  ('A salesman earns 5% commission on first ₹50,000 of sales and 8% on the rest. On sales of ₹80,000, he earns:', 'mcq', '["₹4,900", "₹5,500", "₹4,900", "₹3,900"]'::jsonb, 'A'),
  ('Sets A and B have 30 and 40 elements. A∩B has 10. How many in A∪B?', 'mcq', '["60", "70", "80", "90"]'::jsonb, 'A'),
  ('If the mean of 5 numbers is 18, and a 6th number is added making the mean 20, what is the 6th number?', 'mcq', '["25", "28", "30", "32"]'::jsonb, 'C'),
  ('A car uses 8 litres/100 km. Petrol costs ₹100/litre. Cost to drive 450 km?', 'mcq', '["₹3,200", "₹3,400", "₹3,600", "₹3,800"]'::jsonb, 'C'),
  ('What is the remainder when 2^100 is divided by 3?', 'mcq', '["0", "1", "2", "Cannot determine"]'::jsonb, 'B'),
  ('Pipe A fills a tank in 3 hrs, B in 4 hrs, C empties in 6 hrs. All open: time to fill?', 'mcq', '["3 hrs", "4 hrs", "4.5 hrs", "5 hrs"]'::jsonb, 'B'),
  ('Find the number of ways to arrange 4 people in a row.', 'mcq', '["12", "16", "24", "36"]'::jsonb, 'C'),
  ('A shopkeeper marks up goods by 40% and gives a 20% discount. Profit %?', 'mcq', '["12%", "14%", "16%", "18%"]'::jsonb, 'A'),
  ('The sides of a right triangle are in ratio 3:4:5. If the hypotenuse is 20 cm, the area is:', 'mcq', '["90 cm²", "96 cm²", "100 cm²", "120 cm²"]'::jsonb, 'B'),
  ('What is the next prime number after 97?', 'mcq', '["99", "101", "103", "107"]'::jsonb, 'B'),
  ('In how many ways can a committee of 3 be chosen from 8 people?', 'mcq', '["28", "42", "56", "70"]'::jsonb, 'C')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Verbal Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Choose the word most similar to ''Sycophant'':', 'mcq', '["Critic", "Flatterer", "Leader", "Rebel"]'::jsonb, 'B'),
  ('Identify the error: ''The committee have reached their decision.''', 'mcq', '["The", "committee", "have", "their"]'::jsonb, 'C'),
  ('What does the idiom ''burn the midnight oil'' mean?', 'mcq', '["Work late into the night", "Start a fire", "Be irresponsible", "Waste energy"]'::jsonb, 'A'),
  ('Complete the analogy: Choreography : Dance :: Screenplay : __?', 'mcq', '["Film", "Novel", "Stage", "Director"]'::jsonb, 'A'),
  ('Find the odd one out: Simile, Metaphor, Rhyme, Hyperbole, Onomatopoeia', 'mcq', '["Simile", "Rhyme", "Metaphor", "Hyperbole"]'::jsonb, 'B'),
  ('Which sentence uses a dangling modifier?', 'mcq', '["Running to the bus, his bag fell.", "She quickly ran to the bus.", "He grabbed his bag and ran.", "The bus arrived late."]'::jsonb, 'A'),
  ('Choose the word most opposite to ''Parsimonious'':', 'mcq', '["Thrifty", "Generous", "Frugal", "Miserly"]'::jsonb, 'B'),
  ('Which best describes an ''inference''?', 'mcq', '["A stated fact", "A conclusion drawn from evidence", "A direct quotation", "A definition"]'::jsonb, 'B'),
  ('Identify the rhetorical device: ''I have a dream that one day this nation will rise up.''', 'mcq', '["Anaphora", "Assonance", "Alliteration", "Paradox"]'::jsonb, 'A'),
  ('Select the correct sentence:', 'mcq', '["Neither of them are coming.", "Neither of them is coming.", "Neither of them were coming.", "Neither of them have come."]'::jsonb, 'B'),
  ('What does ''moot point'' mean?', 'mcq', '["A valid argument", "An irrelevant or debatable issue", "A proven fact", "A court verdict"]'::jsonb, 'B'),
  ('Identify the tone: ''The administration''s complete disregard for student welfare is nothing short of criminal.''', 'mcq', '["Neutral", "Appreciative", "Indignant", "Humorous"]'::jsonb, 'C'),
  ('Which word completes the analogy: Gregarious : Sociable :: Taciturn : __?', 'mcq', '["Talkative", "Reserved", "Energetic", "Curious"]'::jsonb, 'B'),
  ('Which of these is a complex sentence?', 'mcq', '["He ran and she walked.", "She ran fast.", "Because it rained, the match was cancelled.", "Run fast!"]'::jsonb, 'C'),
  ('What is the main purpose of a ''thesis statement'' in an essay?', 'mcq', '["To summarize the conclusion", "To state the central argument", "To introduce the topic", "To cite sources"]'::jsonb, 'B')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Logical / Abstract Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Find the next: 1, 8, 27, 64, 125, __?', 'mcq', '["196", "210", "216", "225"]'::jsonb, 'C'),
  ('If all Managers are Leaders and no Leaders are Followers, then:', 'mcq', '["All Managers are Followers", "No Managers are Followers", "Some Followers are Managers", "Some Managers are Followers"]'::jsonb, 'B'),
  ('What is the value of: 2^10 ÷ 2^7?', 'mcq', '["4", "6", "8", "16"]'::jsonb, 'C'),
  ('A is taller than B but shorter than C. D is taller than C. Who is the shortest?', 'mcq', '["A", "B", "C", "D"]'::jsonb, 'B'),
  ('If DELHI is coded as 73541 and CALCUTTA is 82589662, how is CALICUT coded?', 'mcq', '["8259896", "8251986", "8251896", "8215896"]'::jsonb, 'C'),
  ('Series: 2, 3, 5, 7, 11, 13, __?', 'mcq', '["14", "15", "16", "17"]'::jsonb, 'D'),
  ('Statements: All pens are pencils. No pencil is a marker. Conclusions: (i) No pen is a marker. (ii) Some pens are markers. Which is valid?', 'mcq', '["Only (i)", "Only (ii)", "Both", "Neither"]'::jsonb, 'A'),
  ('A clock shows 6:30. What angle do the hands form?', 'mcq', '["0°", "10°", "15°", "20°"]'::jsonb, 'C'),
  ('Find the odd one out: 1, 4, 9, 16, 23, 25', 'mcq', '["4", "9", "16", "23"]'::jsonb, 'D'),
  ('If the first day of a year is Sunday, what is the last day of that year (non-leap)?', 'mcq', '["Sunday", "Monday", "Tuesday", "Saturday"]'::jsonb, 'A'),
  ('If ♦ = 2, ★ = 3, then what is ★ × ♦ + ★²?', 'mcq', '["13", "14", "15", "16"]'::jsonb, 'C'),
  ('Find the missing term: 5, 11, 23, 47, __?', 'mcq', '["85", "95", "97", "101"]'::jsonb, 'B'),
  ('A shopkeeper sells item A at 25% profit and B at 20% loss. He earns same rupee profit/loss on both. Ratio of cost price A:B is?', 'mcq', '["4:5", "5:4", "3:4", "4:3"]'::jsonb, 'A'),
  ('All students who study hard pass. Ram did not pass. What must be true?', 'mcq', '["Ram did not study hard", "Ram studied hard", "Ram is not a student", "Ram will pass next time"]'::jsonb, 'A'),
  ('What number replaces ?: 3×7=42, 5×4=45, 6×3=__?', 'mcq', '["36", "39", "42", "48"]'::jsonb, 'B')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Spatial Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('How many unit cubes make up a 3×3×3 cube if the outer layer is removed?', 'mcq', '["1", "4", "8", "27"]'::jsonb, 'A'),
  ('A cylinder has radius 7 cm and height 10 cm. Its total surface area is:', 'mcq', '["594π cm²", "374π cm²", "298π cm²", "240π cm²"]'::jsonb, 'B'),
  ('If you look at a rectangular box from above, what do you see?', 'mcq', '["A square", "A rectangle", "A circle", "A cube"]'::jsonb, 'B'),
  ('Which 2D cross-section of a sphere is always a:', 'mcq', '["Triangle", "Square", "Circle", "Ellipse"]'::jsonb, 'C'),
  ('An object is reflected across the y-axis. The point (3, -4) maps to:', 'mcq', '["(-3, -4)", "(3, 4)", "(-3, 4)", "(3, -4)"]'::jsonb, 'A'),
  ('A cone and a cylinder have the same base and height. Ratio of their volumes is:', 'mcq', '["1:3", "1:2", "2:3", "3:1"]'::jsonb, 'A'),
  ('If a shape has rotational symmetry of order 4, it maps onto itself every __ degrees?', 'mcq', '["45°", "60°", "90°", "120°"]'::jsonb, 'C'),
  ('How many triangles are there in a regular hexagon divided by all its diagonals?', 'mcq', '["6", "8", "12", "24"]'::jsonb, 'C')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Domain-Specific Screener — AMCAT / CoCubes Style'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Aptitude / Cognitive Ability'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('[Engineering/Tech] Which data structure uses LIFO?', 'mcq', '["Queue", "Stack", "Array", "Linked List"]'::jsonb, 'B'),
  ('[Engineering/Tech] What does HTTP stand for?', 'mcq', '["HyperText Transfer Protocol", "High Transfer Text Protocol", "Hyper Transfer Text Process", "HyperText Transport Program"]'::jsonb, 'A'),
  ('[Management/Commerce] Which ratio measures a company''s ability to pay short-term obligations?', 'mcq', '["Debt-equity ratio", "Current ratio", "Profit margin", "Asset turnover"]'::jsonb, 'B'),
  ('[Science] What is Avogadro''s number?', 'mcq', '["6.022 × 10²³", "6.022 × 10²¹", "9.022 × 10²³", "3.022 × 10²³"]'::jsonb, 'A'),
  ('[General Aptitude] A project requires 400 man-days. 10 people work for 20 days, then 5 leave. How many more days for the rest to finish?', 'mcq', '["40", "45", "48", "50"]'::jsonb, 'C'),
  ('[Data/Analytics] In a normal distribution, approximately what % of data falls within 2 standard deviations of the mean?', 'mcq', '["68%", "90%", "95%", "99%"]'::jsonb, 'C'),
  ('[Critical Thinking] A manager says: ''Sales increased because we hired more staff.'' Which assumption does this make?', 'mcq', '["More staff always increases sales", "Sales were low before", "Staff costs nothing", "The market is growing"]'::jsonb, 'A')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Visual'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Learning Style'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I find it easy to remember things when the teacher writes them on the board.', 'likert5', NULL, NULL),
  ('I prefer studying science lessons that have colorful diagrams and maps.', 'likert5', NULL, NULL),
  ('I like to use different colored pens to highlight important facts in my notes.', 'likert5', NULL, NULL),
  ('I learn best by watching educational videos or animations about history.', 'likert5', NULL, NULL),
  ('I prefer looking at charts and tables rather than reading long paragraphs.', 'likert5', NULL, NULL),
  ('I like to draw cartoons or sketches to help me remember classroom rules.', 'likert5', NULL, NULL),
  ('I prefer flashcards with pictures on them when learning new English vocabulary.', 'likert5', NULL, NULL),
  ('I enjoy matching shapes, pictures, and words in learning games.', 'likert5', NULL, NULL),
  ('I like when the teacher uses slide presentations during geography lessons.', 'likert5', NULL, NULL),
  ('I find that drawing a timeline helps me understand history sequences easily.', 'likert5', NULL, NULL),
  ('I prefer looking at photos of animals rather than just reading about them.', 'likert5', NULL, NULL),
  ('I like to close my eyes and visualize words to help me spell them correctly.', 'likert5', NULL, NULL),
  ('I learn math better when the teacher draws pictures of numbers and fractions.', 'likert5', NULL, NULL),
  ('I prefer studying in a brightly lit room where I can see everything clearly.', 'likert5', NULL, NULL),
  ('I find it helpful to look at models or maps when studying for geography tests.', 'likert5', NULL, NULL),
  ('I like when textbooks have lots of photographs and illustrations.', 'likert5', NULL, NULL),
  ('I remember faces much better than I remember names.', 'likert5', NULL, NULL),
  ('I like to create visual mind-maps on paper to organize my study ideas.', 'likert5', NULL, NULL),
  ('I enjoy playing computer games that show step-by-step visual guides.', 'likert5', NULL, NULL),
  ('I prefer watching a science experiment demonstration over reading the steps.', 'likert5', NULL, NULL),
  ('I remember the color of the pages where I read important notes.', 'likert5', NULL, NULL),
  ('I find it useful to look at poster boards in the classroom.', 'likert5', NULL, NULL),
  ('I look at diagrams to make science labs much easier for me.', 'likert5', NULL, NULL),
  ('I like using stickers or symbols to mark key notes.', 'likert5', NULL, NULL),
  ('I prefer drawing a picture to explain a story.', 'likert5', NULL, NULL),
  ('I see patterns to help me solve math puzzles quickly.', 'likert5', NULL, NULL),
  ('I like to see the teacher''s facial expressions when they explain things.', 'likert5', NULL, NULL),
  ('I find that watching animations helps me understand how machinery works.', 'likert5', NULL, NULL),
  ('I prefer to have my desk facing a wall with a calendar or whiteboard.', 'likert5', NULL, NULL),
  ('I visualize a scene to help me understand English literature.', 'likert5', NULL, NULL),
  ('I like to color-code my folders for different school subjects.', 'likert5', NULL, NULL),
  ('I find that lists arranged in bullet points help me remember them.', 'likert5', NULL, NULL),
  ('I prefer textbooks that have large, clear headings and subheadings.', 'likert5', NULL, NULL),
  ('I learn computer coding better when the software color-codes the text.', 'likert5', NULL, NULL),
  ('I enjoy tracing designs on paper to understand their structure.', 'likert5', NULL, NULL),
  ('I prefer slides with diagrams over text-heavy handouts.', 'likert5', NULL, NULL),
  ('I find it helpful to look at photos of historical artifacts.', 'likert5', NULL, NULL),
  ('I draw shapes to help me remember geometry definitions.', 'likert5', NULL, NULL),
  ('I like to look at the menu on the board before choosing lunch.', 'likert5', NULL, NULL),
  ('I prefer visual guides when assembling simple models.', 'likert5', NULL, NULL),
  ('I enjoy watching science TV shows that explain natural disasters.', 'likert5', NULL, NULL),
  ('I draw cartoon strips to help me plan my stories.', 'likert5', NULL, NULL),
  ('I find that visual patterns in math are satisfying to discover.', 'likert5', NULL, NULL),
  ('I like to look at the blackboard when the teacher is explaining.', 'likert5', NULL, NULL),
  ('I prefer worksheets that leave blank spaces for drawings.', 'likert5', NULL, NULL),
  ('I find that seeing the spelling of a word helps me pronounce it.', 'likert5', NULL, NULL),
  ('I enjoy playing matching games that connect pictures with terms.', 'likert5', NULL, NULL),
  ('I look at architectural blueprints with great interest.', 'likert5', NULL, NULL),
  ('I prefer when my teacher shows a sample of a finished project first.', 'likert5', NULL, NULL),
  ('I find that a clean layout of study notes makes me feel organized.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Auditory'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Learning Style'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I learn best when I listen to the teacher explain lessons in class.', 'likert5', NULL, NULL),
  ('I prefer listening to audiobooks or podcasts rather than reading printed books.', 'likert5', NULL, NULL),
  ('I find it helpful to read my notes out loud when studying at home.', 'likert5', NULL, NULL),
  ('I enjoy participating in classroom discussions and sharing my opinions.', 'likert5', NULL, NULL),
  ('I like when the teacher tells interesting stories during history class.', 'likert5', NULL, NULL),
  ('I remember spelling words better after saying them out loud several times.', 'likert5', NULL, NULL),
  ('I prefer discussing homework answers with a classmate rather than working silently.', 'likert5', NULL, NULL),
  ('I learn a new song or melody easily just by hearing it once.', 'likert5', NULL, NULL),
  ('I like when my parents ask me questions out loud to test my memory.', 'likert5', NULL, NULL),
  ('I prefer teachers who explain things clearly using examples and voice tones.', 'likert5', NULL, NULL),
  ('I find it easy to pay attention when someone is talking to me.', 'likert5', NULL, NULL),
  ('I enjoy listening to sound effects or music clips in educational apps.', 'likert5', NULL, NULL),
  ('I prefer working in study groups where we can talk about the solutions.', 'likert5', NULL, NULL),
  ('I like repeating definitions out loud to memorize them before tests.', 'likert5', NULL, NULL),
  ('I find that listening to background classical music helps me focus.', 'likert5', NULL, NULL),
  ('I remember names much better than I remember faces.', 'likert5', NULL, NULL),
  ('I enjoy giving oral presentations in front of my class.', 'likert5', NULL, NULL),
  ('I prefer class debates over writing essays to explain my thoughts.', 'likert5', NULL, NULL),
  ('I like when instructions for projects are explained to me verbally.', 'likert5', NULL, NULL),
  ('I find that saying a phone number out loud helps me write it down correctly.', 'likert5', NULL, NULL),
  ('I learn more from a radio program than from reading a newspaper.', 'likert5', NULL, NULL),
  ('I like to study by talking about the topic with a study partner.', 'likert5', NULL, NULL),
  ('I find it helpful when teachers read the textbook passages out loud.', 'likert5', NULL, NULL),
  ('I remember jokes and riddles better when I hear them spoken.', 'likert5', NULL, NULL),
  ('I prefer listening to a lecture over reading a text presentation.', 'likert5', NULL, NULL),
  ('I enjoy playing spelling games where we speak the letters.', 'likert5', NULL, NULL),
  ('I find it easy to remember song lyrics after hearing them a few times.', 'likert5', NULL, NULL),
  ('I like when my friends explain how to play a game to me.', 'likert5', NULL, NULL),
  ('I prefer when math steps are explained verbally as they are written.', 'likert5', NULL, NULL),
  ('I enjoy participating in school choir or band rehearsals.', 'likert5', NULL, NULL),
  ('I find that verbal encouragement from teachers makes me study harder.', 'likert5', NULL, NULL),
  ('I like to repeat key facts to myself to make sure I understand them.', 'likert5', NULL, NULL),
  ('I prefer classrooms that have regular discussions and group conversations.', 'likert5', NULL, NULL),
  ('I find that background noise, like whispering, distracts me easily.', 'likert5', NULL, NULL),
  ('I enjoy listening to educational sound bytes or history speeches.', 'likert5', NULL, NULL),
  ('I remember what my teacher said in class better than what I wrote down.', 'likert5', NULL, NULL),
  ('I like to explain my project ideas to my parents before starting.', 'likert5', NULL, NULL),
  ('I prefer when science laws are explained using spoken analogies.', 'likert5', NULL, NULL),
  ('I enjoy listening to interviews of famous authors or scientists.', 'likert5', NULL, NULL),
  ('I find that oral tests are easier for me than written exams.', 'likert5', NULL, NULL),
  ('I like to ask for verbal hints when I get stuck on a puzzle.', 'likert5', NULL, NULL),
  ('I prefer learning about instruments by hearing their sounds first.', 'likert5', NULL, NULL),
  ('I find that recording my voice and playing it back helps me revise.', 'likert5', NULL, NULL),
  ('I enjoy listening to poetry readings and dramatic storytelling.', 'likert5', NULL, NULL),
  ('I prefer listening to guest speakers in class over doing worksheets.', 'likert5', NULL, NULL),
  ('I find that talking through my confusion with a teacher resolves it quickly.', 'likert5', NULL, NULL),
  ('I enjoy playing word association games verbally with my family.', 'likert5', NULL, NULL),
  ('I prefer listening to a detailed podcast summary of a book.', 'likert5', NULL, NULL),
  ('I find it easy to follow directions when someone gives them step-by-step.', 'likert5', NULL, NULL),
  ('I believe that hearing different voices helps me understand different points.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Read/Write'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Learning Style'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I learn best by reading printed textbooks and study guides.', 'likert5', NULL, NULL),
  ('I enjoy taking detailed written notes during classroom lectures.', 'likert5', NULL, NULL),
  ('I prefer writing out my vocabulary words multiple times to memorize them.', 'likert5', NULL, NULL),
  ('I like to look up definition of words in dictionaries or glossaries.', 'likert5', NULL, NULL),
  ('I prefer written instructions for assignments over verbal explanations.', 'likert5', NULL, NULL),
  ('I enjoy writing summaries or book reports for my English class.', 'likert5', NULL, NULL),
  ('I like reading handouts, worksheets, and printed articles for science.', 'likert5', NULL, NULL),
  ('I find it helpful to make a written checklist of my daily homework.', 'likert5', NULL, NULL),
  ('I prefer search engines where I can read text articles for my projects.', 'likert5', NULL, NULL),
  ('I like to copy definitions from the board into my notebooks.', 'likert5', NULL, NULL),
  ('I enjoy reading manuals and instructions before playing a new board game.', 'likert5', NULL, NULL),
  ('I find it easy to remember facts when I write them down on index cards.', 'likert5', NULL, NULL),
  ('I prefer essay-type questions on tests over drawing diagrams.', 'likert5', NULL, NULL),
  ('I enjoy keeping a written diary or journal of my thoughts and lessons.', 'likert5', NULL, NULL),
  ('I like reading historical documents and biographies for social studies.', 'likert5', NULL, NULL),
  ('I prefer classrooms that have quiet reading corners.', 'likert5', NULL, NULL),
  ('I find that writing my goals down on paper helps me achieve them.', 'likert5', NULL, NULL),
  ('I enjoy reading online articles, blogs, and text summaries for fun.', 'likert5', NULL, NULL),
  ('I prefer taking text-based quizzes over visual or verbal quizzes.', 'likert5', NULL, NULL),
  ('I find it helpful to write comments or underlines in my textbooks.', 'likert5', NULL, NULL),
  ('I like to read the captions under pictures in my textbooks.', 'likert5', NULL, NULL),
  ('I prefer writing my answers on paper to verify my thinking.', 'likert5', NULL, NULL),
  ('I enjoy reading books about science and nature during my free time.', 'likert5', NULL, NULL),
  ('I find it useful to keep a list of key words and definitions.', 'likert5', NULL, NULL),
  ('I prefer text-heavy websites over pages with mostly images.', 'likert5', NULL, NULL),
  ('I enjoy doing crosswords and word-search puzzles on paper.', 'likert5', NULL, NULL),
  ('I like to read recipe books before attempting to cook.', 'likert5', NULL, NULL),
  ('I find that writing a summary page for exams is highly effective.', 'likert5', NULL, NULL),
  ('I prefer written feedback from my teachers on my schoolwork.', 'likert5', NULL, NULL),
  ('I enjoy reading classical novels and poetry for my English assignments.', 'likert5', NULL, NULL),
  ('I find it easy to study when I write questions and answers on cards.', 'likert5', NULL, NULL),
  ('I like to look up spelling rules and grammar guidelines.', 'likert5', NULL, NULL),
  ('I prefer reading the script of a play before watching it live.', 'likert5', NULL, NULL),
  ('I enjoy making list of chores and checking them off.', 'likert5', NULL, NULL),
  ('I find that writing helps me organize my thoughts before speaking.', 'likert5', NULL, NULL),
  ('I prefer reading encyclopedia articles to discover new facts.', 'likert5', NULL, NULL),
  ('I like to print out worksheets instead of doing them on screen.', 'likert5', NULL, NULL),
  ('I find that reading written handouts makes me feel well-prepared.', 'likert5', NULL, NULL),
  ('I enjoy taking written quizzes in children''s magazines.', 'likert5', NULL, NULL),
  ('I prefer when teachers distribute printed notes before a lecture.', 'likert5', NULL, NULL),
  ('I like to read instructions step-by-step to build Lego kits.', 'likert5', NULL, NULL),
  ('I find that reading silent stories is the best way to relax.', 'likert5', NULL, NULL),
  ('I enjoy writing short stories or letters to my friends.', 'likert5', NULL, NULL),
  ('I prefer writing my math steps clearly to avoid calculation errors.', 'likert5', NULL, NULL),
  ('I like to read about how gadgets work in technical manuals.', 'likert5', NULL, NULL),
  ('I find that copying key quotes helps me write better essays.', 'likert5', NULL, NULL),
  ('I prefer written tests because they let me organize my sentences.', 'likert5', NULL, NULL),
  ('I enjoy checking the index of a book to find specific topics.', 'likert5', NULL, NULL),
  ('I find that reading instructions twice makes tasks much easier.', 'likert5', NULL, NULL),
  ('I believe that writing notes by hand is the key to good grades.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Kinesthetic'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Learning Style'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I learn science best by doing hands-on experiments in the lab.', 'likert5', NULL, NULL),
  ('I prefer physical activities, sports, or dance over sitting in a classroom.', 'likert5', NULL, NULL),
  ('I enjoy building physical models out of cardboard, clay, or plastic blocks.', 'likert5', NULL, NULL),
  ('I learn how things work by taking them apart and putting them together.', 'likert5', NULL, NULL),
  ('I prefer school field trips to museums, zoos, or parks over lectures.', 'likert5', NULL, NULL),
  ('I enjoy playing active learning games that require moving around the room.', 'likert5', NULL, NULL),
  ('I find it hard to sit still for more than thirty minutes while studying.', 'likert5', NULL, NULL),
  ('I like to use physical objects, like counting beads, to solve math problems.', 'likert5', NULL, NULL),
  ('I prefer craft activities like pottery, wood carving, or sewing in school.', 'likert5', NULL, NULL),
  ('I learn best by trial and error, trying things out rather than reading guides.', 'likert5', NULL, NULL),
  ('I like to stand up and walk around the room while reading my notes.', 'likert5', NULL, NULL),
  ('I enjoy role-playing historical events or acting in school plays.', 'likert5', NULL, NULL),
  ('I prefer typing on a computer keyboard or using a touchscreen to study.', 'likert5', NULL, NULL),
  ('I find that writing or drawing physically on a whiteboard helps me learn.', 'likert5', NULL, NULL),
  ('I enjoy participating in sports rules by playing a practice game immediately.', 'likert5', NULL, NULL),
  ('I feel more focused when I can touch and hold objects related to the lesson.', 'likert5', NULL, NULL),
  ('I prefer coding simple projects where I can see immediate actions.', 'likert5', NULL, NULL),
  ('I like to use gestures or hand movements when explaining my ideas.', 'likert5', NULL, NULL),
  ('I enjoy drawing patterns, cutting paper, and assembling science models.', 'likert5', NULL, NULL),
  ('I find that taking regular physical activity breaks helps me study better.', 'likert5', NULL, NULL),
  ('I prefer learning to play a musical instrument by pressing keys immediately.', 'likert5', NULL, NULL),
  ('I enjoy field biology sessions where we collect leaves and soil samples.', 'likert5', NULL, NULL),
  ('I find that holding a pen and writing keeps me awake during study.', 'likert5', NULL, NULL),
  ('I prefer classrooms that have space for active demonstrations.', 'likert5', NULL, NULL),
  ('I enjoy building treehouses, forts, or physical structures for fun.', 'likert5', NULL, NULL),
  ('I learn how to tie knots by practicing with a real rope.', 'likert5', NULL, NULL),
  ('I prefer participating in interactive exhibitions over looking at displays.', 'likert5', NULL, NULL),
  ('I find that walking while listening to audio helps me retain details.', 'likert5', NULL, NULL),
  ('I enjoy cooking, baking, and mixing ingredients in the kitchen.', 'likert5', NULL, NULL),
  ('I learn math concepts better when using physical models of shapes.', 'likert5', NULL, NULL),
  ('I prefer active sports like gymnastics, martial arts, or cycling.', 'likert5', NULL, NULL),
  ('I find that tracing shapes in the air helps me remember them.', 'likert5', NULL, NULL),
  ('I enjoy physical geography tasks, like building clay mountain models.', 'likert5', NULL, NULL),
  ('I prefer playing learning games on a tablet that respond to touch.', 'likert5', NULL, NULL),
  ('I want to participate in school gardening tasks and plant seeds.', 'likert5', NULL, NULL),
  ('I learn how tools work by using them under supervision.', 'likert5', NULL, NULL),
  ('I feel restless when I have to watch a video without doing anything.', 'likert5', NULL, NULL),
  ('I enjoy puzzle maps where I have to physically place country shapes.', 'likert5', NULL, NULL),
  ('I prefer classes that mix lecture time with physical exercises.', 'likert5', NULL, NULL),
  ('I find that typing my notes helps my fingers remember the words.', 'likert5', NULL, NULL),
  ('I enjoy physical science tasks, like measuring speed with toy cars.', 'likert5', NULL, NULL),
  ('I prefer building models of historical landmarks out of wood.', 'likert5', NULL, NULL),
  ('I want to learn skills like carpentry, pottery, or model assembly.', 'likert5', NULL, NULL),
  ('I find that active drama rehearsals are my favorite school activity.', 'likert5', NULL, NULL),
  ('I enjoy field studies in nature reserves and forests.', 'likert5', NULL, NULL),
  ('I prefer testing components physically to see why a machine broke.', 'likert5', NULL, NULL),
  ('I find that typing on calculators is satisfying when solving equations.', 'likert5', NULL, NULL),
  ('I enjoy physical design and sculpture tasks in art class.', 'likert5', NULL, NULL),
  ('I prefer playing yard games over playing video games at home.', 'likert5', NULL, NULL),
  ('I believe that physical interaction with objects is the best way to study.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Linguistic'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Multiple Intelligences'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy reading long texts or articles in the classroom or playground.', 'likert5', NULL, NULL),
  ('I find it easy to explain complex ideas to my classmates in writing.', 'likert5', NULL, NULL),
  ('I regularly discuss opinions and facts with my classmates.', 'likert5', NULL, NULL),
  ('I enjoy writing journals, logs, or essays about homework and class projects.', 'likert5', NULL, NULL),
  ('I listen carefully when my teachers or parents explain new terms.', 'likert5', NULL, NULL),
  ('I play word games or vocabulary crosswords to relax.', 'likert5', NULL, NULL),
  ('I try to handle critical parameters during physical education class to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I find it easy to track homework and class projects during class hours.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate homework and class projects during physical education class.', 'likert5', NULL, NULL),
  ('I regularly coordinate critical parameters in the school library.', 'likert5', NULL, NULL),
  ('When working with my classmates, I focus on coordinateing critical parameters.', 'likert5', NULL, NULL),
  ('I feel comfortable to review my routine plans when facing grades adjustments.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate group outcomes in my notebooks.', 'likert5', NULL, NULL),
  ('I try to handle group outcomes at home with my family to achieve group outcomes.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on manageing critical parameters.', 'likert5', NULL, NULL),
  ('I prefer to manage school assignments during handling daily schedules.', 'likert5', NULL, NULL),
  ('I find it easy to handle my routine plans during class hours.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle homework and class projects when working with my classmates.', 'likert5', NULL, NULL),
  ('I regularly manage group outcomes during physical education class.', 'likert5', NULL, NULL),
  ('I regularly track group outcomes during class hours.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate group outcomes in my notebooks.', 'likert5', NULL, NULL),
  ('I regularly track my routine plans during physical education class.', 'likert5', NULL, NULL),
  ('I try to review my routine plans during physical education class to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I regularly manage group outcomes in my notebooks.', 'likert5', NULL, NULL),
  ('I find it easy to review group outcomes in my notebooks.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Logical-Mathematical'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Multiple Intelligences'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy solving logic puzzles or data boards in the classroom or playground.', 'likert5', NULL, NULL),
  ('I find it easy to calculate financial balances or budgets related to homework and class projects.', 'likert5', NULL, NULL),
  ('I try to find structured patterns when researching homework and class projects.', 'likert5', NULL, NULL),
  ('I prefer to analyze facts and data tables before drawing conclusions.', 'likert5', NULL, NULL),
  ('I ask detailed questions about how machines or scientific systems work.', 'likert5', NULL, NULL),
  ('I enjoy sorting information into structured files or computer sheets.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate group outcomes during physical education class.', 'likert5', NULL, NULL),
  ('I regularly track school assignments in my notebooks.', 'likert5', NULL, NULL),
  ('I find it easy to examine homework and class projects during physical education class.', 'likert5', NULL, NULL),
  ('I prefer to examine group outcomes during handling daily schedules.', 'likert5', NULL, NULL),
  ('I regularly review school assignments at home with my family.', 'likert5', NULL, NULL),
  ('I regularly coordinate my routine plans at home with my family.', 'likert5', NULL, NULL),
  ('When facing grades adjustments, I focus on evaluateing my routine plans.', 'likert5', NULL, NULL),
  ('I feel comfortable to review group outcomes when handling daily schedules.', 'likert5', NULL, NULL),
  ('I prefer to evaluate critical parameters during handling daily schedules.', 'likert5', NULL, NULL),
  ('When facing grades adjustments, I focus on handleing my routine plans.', 'likert5', NULL, NULL),
  ('I try to manage critical parameters in the school library to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle homework and class projects when working with my classmates.', 'likert5', NULL, NULL),
  ('I regularly evaluate group outcomes during physical education class.', 'likert5', NULL, NULL),
  ('I try to handle school assignments in my notebooks to achieve school assignments.', 'likert5', NULL, NULL),
  ('When working with my classmates, I focus on handleing group outcomes.', 'likert5', NULL, NULL),
  ('I try to manage group outcomes at home with my family to achieve group outcomes.', 'likert5', NULL, NULL),
  ('When working with my classmates, I focus on tracking group outcomes.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage homework and class projects when facing grades adjustments.', 'likert5', NULL, NULL),
  ('I regularly manage homework and class projects during physical education class.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Spatial'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Multiple Intelligences'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I can easily visualize maps, layouts, or 3D blueprints.', 'likert5', NULL, NULL),
  ('I prefer studying notes that use color-coded mind maps or visual diagrams.', 'likert5', NULL, NULL),
  ('I enjoy sketching layout designs or drawing schemas in the classroom or playground.', 'likert5', NULL, NULL),
  ('I find that visual demonstrations make it easy to learn about homework and class projects.', 'likert5', NULL, NULL),
  ('I easily navigate around new areas using GPS maps or diagrams.', 'likert5', NULL, NULL),
  ('I pay close attention to graphic layouts and visual slides.', 'likert5', NULL, NULL),
  ('When working with my classmates, I focus on coordinateing my routine plans.', 'likert5', NULL, NULL),
  ('I prefer to coordinate group outcomes during handling daily schedules.', 'likert5', NULL, NULL),
  ('I regularly track group outcomes in the school library.', 'likert5', NULL, NULL),
  ('I regularly track critical parameters during class hours.', 'likert5', NULL, NULL),
  ('I regularly evaluate school assignments in my notebooks.', 'likert5', NULL, NULL),
  ('I prefer to evaluate homework and class projects during handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate group outcomes when facing grades adjustments.', 'likert5', NULL, NULL),
  ('I regularly examine homework and class projects during physical education class.', 'likert5', NULL, NULL),
  ('I find it easy to track critical parameters at home with my family.', 'likert5', NULL, NULL),
  ('I regularly evaluate critical parameters at home with my family.', 'likert5', NULL, NULL),
  ('I feel comfortable to track school assignments when handling daily schedules.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on evaluateing group outcomes.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage homework and class projects when handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to manage school assignments during physical education class to achieve school assignments.', 'likert5', NULL, NULL),
  ('I prefer to handle school assignments during handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to review homework and class projects when handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to examine group outcomes during physical education class to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I find it easy to manage my routine plans at home with my family.', 'likert5', NULL, NULL),
  ('When working with my classmates, I focus on evaluateing my routine plans.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Bodily-Kinesthetic'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Multiple Intelligences'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I learn best when performing physical hands-on setups for homework and class projects.', 'likert5', NULL, NULL),
  ('I participate in active sports, workouts, or physical exercises.', 'likert5', NULL, NULL),
  ('I find it hard to sit still for hours without going for active walks.', 'likert5', NULL, NULL),
  ('I enjoy building physical models, crafts, or prototypes with my hands.', 'likert5', NULL, NULL),
  ('I use hand gestures and body language to explain things to my classmates.', 'likert5', NULL, NULL),
  ('I enjoy fixing hardware tools or adjusting mechanical setups.', 'likert5', NULL, NULL),
  ('I prefer to review group outcomes during working with my classmates.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage homework and class projects when working with my classmates.', 'likert5', NULL, NULL),
  ('I find it easy to examine school assignments during class hours.', 'likert5', NULL, NULL),
  ('When facing grades adjustments, I focus on handleing group outcomes.', 'likert5', NULL, NULL),
  ('I prefer to coordinate homework and class projects during working with my classmates.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on manageing critical parameters.', 'likert5', NULL, NULL),
  ('I find it easy to track group outcomes at home with my family.', 'likert5', NULL, NULL),
  ('When facing grades adjustments, I focus on examineing critical parameters.', 'likert5', NULL, NULL),
  ('I try to handle group outcomes during class hours to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I prefer to examine my routine plans during working with my classmates.', 'likert5', NULL, NULL),
  ('I try to coordinate group outcomes at home with my family to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I try to examine group outcomes at home with my family to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I try to review critical parameters in my notebooks to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I try to examine my routine plans in the school library to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I regularly manage my routine plans during physical education class.', 'likert5', NULL, NULL),
  ('I find it easy to examine group outcomes in my notebooks.', 'likert5', NULL, NULL),
  ('I find it easy to track my routine plans in my notebooks.', 'likert5', NULL, NULL),
  ('I prefer to review my routine plans during facing grades adjustments.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle group outcomes when facing grades adjustments.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Musical'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Multiple Intelligences'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I hum, tap, or sing along to musical rhythms when working.', 'likert5', NULL, NULL),
  ('I find that listening to background music increases my focus on homework and class projects.', 'likert5', NULL, NULL),
  ('I can easily recognize different instrument sounds or pitch variations.', 'likert5', NULL, NULL),
  ('I enjoy studying sound waves, musical chords, or acoustic properties.', 'likert5', NULL, NULL),
  ('I play a musical instrument or participate in musical ensembles.', 'likert5', NULL, NULL),
  ('I remember the rhythm and melodies of songs very quickly.', 'likert5', NULL, NULL),
  ('I try to review my routine plans during class hours to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I find it easy to handle critical parameters during class hours.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on coordinateing group outcomes.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate my routine plans when working with my classmates.', 'likert5', NULL, NULL),
  ('I regularly coordinate critical parameters in the school library.', 'likert5', NULL, NULL),
  ('I prefer to track homework and class projects during handling daily schedules.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate group outcomes during class hours.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine school assignments when facing grades adjustments.', 'likert5', NULL, NULL),
  ('I try to track my routine plans during class hours to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I find it easy to examine my routine plans in my notebooks.', 'likert5', NULL, NULL),
  ('I regularly review group outcomes during class hours.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate group outcomes at home with my family.', 'likert5', NULL, NULL),
  ('When working with my classmates, I focus on tracking school assignments.', 'likert5', NULL, NULL),
  ('I try to handle my routine plans during class hours to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate my routine plans when facing grades adjustments.', 'likert5', NULL, NULL),
  ('I try to review critical parameters at home with my family to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I regularly review my routine plans in the school library.', 'likert5', NULL, NULL),
  ('I try to manage group outcomes at home with my family to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I regularly handle homework and class projects at home with my family.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Interpersonal'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Multiple Intelligences'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy working on group assignments and projects with my classmates.', 'likert5', NULL, NULL),
  ('I find it easy to resolve arguments or conflicts among my classmates.', 'likert5', NULL, NULL),
  ('I like mentoring or tutoring my classmates in subjects I understand.', 'likert5', NULL, NULL),
  ('I can tell how a colleague or friend is feeling by reading their face.', 'likert5', NULL, NULL),
  ('I organize social team activities or event runs in the classroom or playground.', 'likert5', NULL, NULL),
  ('I seek opinions from my classmates before making decisions.', 'likert5', NULL, NULL),
  ('I try to examine homework and class projects in my notebooks to achieve homework and class projects.', 'likert5', NULL, NULL),
  ('I regularly handle critical parameters in my notebooks.', 'likert5', NULL, NULL),
  ('When facing grades adjustments, I focus on reviewing school assignments.', 'likert5', NULL, NULL),
  ('I prefer to handle group outcomes during handling daily schedules.', 'likert5', NULL, NULL),
  ('I prefer to coordinate my routine plans during handling daily schedules.', 'likert5', NULL, NULL),
  ('When facing grades adjustments, I focus on manageing group outcomes.', 'likert5', NULL, NULL),
  ('I try to handle homework and class projects in my notebooks to achieve homework and class projects.', 'likert5', NULL, NULL),
  ('When working with my classmates, I focus on reviewing school assignments.', 'likert5', NULL, NULL),
  ('I find it easy to handle school assignments during physical education class.', 'likert5', NULL, NULL),
  ('I regularly handle my routine plans in the school library.', 'likert5', NULL, NULL),
  ('I prefer to handle critical parameters during handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to coordinate homework and class projects at home with my family to achieve homework and class projects.', 'likert5', NULL, NULL),
  ('I regularly evaluate group outcomes in my notebooks.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle my routine plans when handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to track my routine plans in the school library to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I try to coordinate group outcomes during class hours to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I try to evaluate school assignments during physical education class to achieve school assignments.', 'likert5', NULL, NULL),
  ('I try to track my routine plans in my notebooks to achieve my routine plans.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on reviewing homework and class projects.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Intrapersonal'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Multiple Intelligences'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I spend time alone to reflect on my goals and progress.', 'likert5', NULL, NULL),
  ('I know exactly what my professional strengths and limitations are.', 'likert5', NULL, NULL),
  ('I manage my study or work timelines independently without supervision.', 'likert5', NULL, NULL),
  ('I research career options that align with my personal values.', 'likert5', NULL, NULL),
  ('I write in a goal planner to record my personal thoughts.', 'likert5', NULL, NULL),
  ('I evaluate my mistakes after a test or task to perform better.', 'likert5', NULL, NULL),
  ('I try to handle critical parameters during physical education class to achieve critical parameters.', 'likert5', NULL, NULL),
  ('When working with my classmates, I focus on evaluateing homework and class projects.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on manageing my routine plans.', 'likert5', NULL, NULL),
  ('When facing grades adjustments, I focus on reviewing school assignments.', 'likert5', NULL, NULL),
  ('I try to track homework and class projects in the school library to achieve homework and class projects.', 'likert5', NULL, NULL),
  ('When working with my classmates, I focus on examineing homework and class projects.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate school assignments when facing grades adjustments.', 'likert5', NULL, NULL),
  ('When working with my classmates, I focus on reviewing school assignments.', 'likert5', NULL, NULL),
  ('I regularly coordinate school assignments during physical education class.', 'likert5', NULL, NULL),
  ('I prefer to coordinate critical parameters during handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle school assignments when working with my classmates.', 'likert5', NULL, NULL),
  ('I regularly track group outcomes at home with my family.', 'likert5', NULL, NULL),
  ('I regularly evaluate my routine plans in my notebooks.', 'likert5', NULL, NULL),
  ('I feel comfortable to track school assignments when facing grades adjustments.', 'likert5', NULL, NULL),
  ('I prefer to manage my routine plans during handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle homework and class projects when facing grades adjustments.', 'likert5', NULL, NULL),
  ('When working with my classmates, I focus on manageing homework and class projects.', 'likert5', NULL, NULL),
  ('When working with my classmates, I focus on tracking my routine plans.', 'likert5', NULL, NULL),
  ('I regularly evaluate homework and class projects in my notebooks.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Naturalist'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Multiple Intelligences'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy outdoor activities like hiking, camping, or gardening.', 'likert5', NULL, NULL),
  ('I prefer outdoor ecological fieldwork over indoor lecture halls.', 'likert5', NULL, NULL),
  ('I find it easy to classify botanical plants or animal species.', 'likert5', NULL, NULL),
  ('I volunteer for environmental protection or recycling drives.', 'likert5', NULL, NULL),
  ('I pay close attention to weather trends and environmental changes.', 'likert5', NULL, NULL),
  ('I like learning about wildlife habitats and biological sciences.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle group outcomes when working with my classmates.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle my routine plans when working with my classmates.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on coordinateing my routine plans.', 'likert5', NULL, NULL),
  ('I regularly handle school assignments during class hours.', 'likert5', NULL, NULL),
  ('I regularly review homework and class projects during class hours.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate group outcomes when handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to evaluate critical parameters during class hours to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I prefer to manage critical parameters during working with my classmates.', 'likert5', NULL, NULL),
  ('I find it easy to review my routine plans in my notebooks.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle school assignments when facing grades adjustments.', 'likert5', NULL, NULL),
  ('I try to examine my routine plans at home with my family to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I try to review critical parameters at home with my family to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I try to manage critical parameters in my notebooks to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I regularly review school assignments in my notebooks.', 'likert5', NULL, NULL),
  ('I prefer to evaluate my routine plans during facing grades adjustments.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle my routine plans when handling daily schedules.', 'likert5', NULL, NULL),
  ('I prefer to review school assignments during facing grades adjustments.', 'likert5', NULL, NULL),
  ('I try to coordinate group outcomes during class hours to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I prefer to examine homework and class projects during working with my classmates.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Foundational Literacy'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Academic Strengths & Weaknesses'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Choose the word that means the same as ''happy'':', 'mcq', '["Sad", "Joyful", "Angry", "Tired"]'::jsonb, 'B'),
  ('Choose the word that means the same as ''huge'':', 'mcq', '["Tiny", "Large", "Narrow", "Short"]'::jsonb, 'B'),
  ('Choose the word that means the same as ''begin'':', 'mcq', '["End", "Start", "Stop", "Pause"]'::jsonb, 'B'),
  ('Choose the word that means the same as ''quick'':', 'mcq', '["Slow", "Lazy", "Fast", "Heavy"]'::jsonb, 'C'),
  ('Choose the word that means the same as ''brave'':', 'mcq', '["Fearful", "Courageous", "Weak", "Shy"]'::jsonb, 'B'),
  ('Choose the word that means the same as ''difficult'':', 'mcq', '["Easy", "Simple", "Challenging", "Boring"]'::jsonb, 'C'),
  ('Choose the word that means the same as ''gather'':', 'mcq', '["Scatter", "Collect", "Break", "Waste"]'::jsonb, 'B'),
  ('Choose the word that means the same as ''shout'':', 'mcq', '["Whisper", "Yell", "Murmur", "Sigh"]'::jsonb, 'B'),
  ('Choose the word opposite to ''ancient'':', 'mcq', '["Old", "Modern", "Historic", "Aged"]'::jsonb, 'B'),
  ('Choose the word opposite to ''generous'':', 'mcq', '["Kind", "Selfish", "Giving", "Caring"]'::jsonb, 'B'),
  ('Choose the word opposite to ''brave'':', 'mcq', '["Bold", "Fearless", "Cowardly", "Daring"]'::jsonb, 'C'),
  ('Choose the word opposite to ''increase'':', 'mcq', '["Grow", "Rise", "Decrease", "Expand"]'::jsonb, 'C'),
  ('Choose the word opposite to ''arrive'':', 'mcq', '["Reach", "Come", "Depart", "Enter"]'::jsonb, 'C'),
  ('Choose the word opposite to ''permit'':', 'mcq', '["Allow", "Forbid", "Grant", "Approve"]'::jsonb, 'B'),
  ('Choose the word opposite to ''genuine'':', 'mcq', '["Real", "True", "Fake", "Honest"]'::jsonb, 'C'),
  ('Identify the correctly spelled word:', 'mcq', '["Recieve", "Receive", "Receeve", "Receve"]'::jsonb, 'B'),
  ('Identify the correctly spelled word:', 'mcq', '["Definately", "Definitely", "Definitly", "Definetely"]'::jsonb, 'B'),
  ('Identify the correctly spelled word:', 'mcq', '["Seperate", "Separate", "Seperete", "Sepparate"]'::jsonb, 'B'),
  ('Identify the correctly spelled word:', 'mcq', '["Occured", "Ocurred", "Occurred", "Occureed"]'::jsonb, 'C'),
  ('Identify the correctly spelled word:', 'mcq', '["Neccessary", "Necessary", "Necesary", "Neccesary"]'::jsonb, 'B'),
  ('Choose the sentence with correct punctuation:', 'mcq', '["Lets go, said Mom.", "\"Let''s go,\" said Mom.", "Lets go said Mom", "\"Let''s go said Mom.\""]'::jsonb, 'B'),
  ('Choose the grammatically correct sentence:', 'mcq', '["She don''t like apples.", "She doesn''t like apples.", "She not like apples.", "She do not likes apples."]'::jsonb, 'B'),
  ('Choose the sentence with correct capitalization:', 'mcq', '["we visited Paris last summer.", "We visited paris last summer.", "We visited Paris last summer.", "We Visited Paris Last summer."]'::jsonb, 'C'),
  ('Choose the correctly punctuated sentence:', 'mcq', '["I have three pets a dog a cat and a fish.", "I have three pets: a dog, a cat, and a fish.", "I have three pets, a dog a cat and a fish.", "I have three pets: a dog a cat and a fish."]'::jsonb, 'B'),
  ('Choose the sentence that uses an apostrophe correctly:', 'mcq', '["The dog''s bone is missing.", "The dogs'' bone is missing (one dog).", "The dogs bone'' is missing.", "The dog bone''s is missing."]'::jsonb, 'A'),
  ('Passage: Riya forgot her umbrella and got soaked walking home. The next day, she checked the weather before leaving. What lesson does Riya learn?', 'mcq', '["Always run home", "Plan ahead by checking the weather", "Never leave the house", "Buy a new umbrella"]'::jsonb, 'B'),
  ('Based on the same passage, what happened to Riya on the first day?', 'mcq', '["She stayed dry", "She got soaked in the rain", "She lost her umbrella", "She stayed home"]'::jsonb, 'B'),
  ('Passage: The school library introduced a new rule allowing students to borrow up to five books at a time, instead of the previous limit of two. Many students were excited about the change. What was the library''s new rule?', 'mcq', '["Students can borrow up to two books", "Students can borrow up to five books", "Students cannot borrow any books", "Students must return books daily"]'::jsonb, 'B'),
  ('Based on the same passage, how did most students react to the change?', 'mcq', '["They were upset", "They were indifferent", "They were excited", "They ignored it"]'::jsonb, 'C'),
  ('Passage: A farmer planted seeds in early spring and watered them daily. By summer, the seeds had grown into tall sunflowers that faced the sun. What did the farmer do to help the seeds grow?', 'mcq', '["Watered them daily", "Ignored them", "Planted them in winter", "Covered them with soil only once"]'::jsonb, 'A'),
  ('Based on the same passage, what did the sunflowers do as they grew?', 'mcq', '["Faced away from the sun", "Faced the sun", "Stayed in the ground", "Turned into vegetables"]'::jsonb, 'B'),
  ('Passage: Aman practiced the piano for 30 minutes every day for a month. At his recital, he played his piece without a single mistake. What helped Aman succeed at his recital?', 'mcq', '["Luck", "Daily practice", "A new piano", "Skipping practice"]'::jsonb, 'B'),
  ('Based on the same passage, how long did Aman practice each day?', 'mcq', '["10 minutes", "20 minutes", "30 minutes", "60 minutes"]'::jsonb, 'C'),
  ('Based on the same passage, what was the result of Aman''s recital?', 'mcq', '["He made many mistakes", "He played without any mistakes", "He forgot the piece", "He did not perform"]'::jsonb, 'B'),
  ('Based on the sunflower passage, in which season did the farmer plant the seeds?', 'mcq', '["Winter", "Early spring", "Autumn", "Late summer"]'::jsonb, 'B')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Basic Numeracy'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Academic Strengths & Weaknesses'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('What is 1/4 + 2/4?', 'mcq', '["3/5", "4/4", "3/4", "2/4"]'::jsonb, 'C'),
  ('What is 2/7 + 3/7?', 'mcq', '["6/7", "4/7", "5/8", "5/7"]'::jsonb, 'D'),
  ('What is 3/8 + 2/8?', 'mcq', '["6/8", "5/8", "5/9", "4/8"]'::jsonb, 'B'),
  ('What is 1/5 + 2/5?', 'mcq', '["3/6", "2/5", "3/5", "4/5"]'::jsonb, 'C'),
  ('What is 4/9 + 3/9?', 'mcq', '["6/9", "7/9", "8/9", "7/10"]'::jsonb, 'B'),
  ('What is 20% of 50?', 'mcq', '["15", "20", "10", "5"]'::jsonb, 'C'),
  ('What is 10% of 80?', 'mcq', '["3", "18", "13", "8"]'::jsonb, 'D'),
  ('What is 25% of 60?', 'mcq', '["25", "15", "20", "10"]'::jsonb, 'B'),
  ('What is 50% of 40?', 'mcq', '["15", "25", "20", "30"]'::jsonb, 'C'),
  ('What is 15% of 60?', 'mcq', '["4", "19", "14", "9"]'::jsonb, 'D'),
  ('Apples cost ₹5 each. What is the total cost of 8 apples?', 'mcq', '["₹50", "₹40", "₹35", "₹45"]'::jsonb, 'B'),
  ('Apples cost ₹7 each. What is the total cost of 6 apples?', 'mcq', '["₹52", "₹37", "₹47", "₹42"]'::jsonb, 'D'),
  ('Apples cost ₹9 each. What is the total cost of 4 apples?', 'mcq', '["₹46", "₹41", "₹36", "₹31"]'::jsonb, 'C'),
  ('Apples cost ₹12 each. What is the total cost of 3 apples?', 'mcq', '["₹31", "₹46", "₹36", "₹41"]'::jsonb, 'C'),
  ('Apples cost ₹6 each. What is the total cost of 9 apples?', 'mcq', '["₹49", "₹64", "₹59", "₹54"]'::jsonb, 'D'),
  ('Solve using the correct order of operations: 15 − 6 × 2 = ?', 'mcq', '["3", "15", "1", "5"]'::jsonb, 'A'),
  ('Solve using the correct order of operations: 20 − 4 × 3 = ?', 'mcq', '["8", "10", "20", "6"]'::jsonb, 'A'),
  ('Solve using the correct order of operations: 30 − 5 × 2 = ?', 'mcq', '["22", "20", "30", "18"]'::jsonb, 'B'),
  ('Solve using the correct order of operations: 25 − 3 × 4 = ?', 'mcq', '["15", "13", "11", "25"]'::jsonb, 'B'),
  ('Solve using the correct order of operations: 18 − 2 × 5 = ?', 'mcq', '["10", "18", "6", "8"]'::jsonb, 'D'),
  ('₹40 is divided between two friends in the ratio 3:5. What is the larger share?', 'mcq', '["₹25", "₹30", "₹20", "₹35"]'::jsonb, 'A'),
  ('₹60 is divided between two friends in the ratio 2:4. What is the larger share?', 'mcq', '["₹35", "₹40", "₹50", "₹45"]'::jsonb, 'B'),
  ('₹80 is divided between two friends in the ratio 3:5. What is the larger share?', 'mcq', '["₹60", "₹45", "₹55", "₹50"]'::jsonb, 'D'),
  ('₹100 is divided between two friends in the ratio 2:3. What is the larger share?', 'mcq', '["₹65", "₹60", "₹70", "₹55"]'::jsonb, 'B'),
  ('₹90 is divided between two friends in the ratio 4:5. What is the larger share?', 'mcq', '["₹55", "₹50", "₹45", "₹60"]'::jsonb, 'B'),
  ('A rectangular garden is 8 m long and 5 m wide. What is its perimeter?', 'mcq', '["30 m", "22 m", "28 m", "26 m"]'::jsonb, 'D'),
  ('A rectangular garden is 10 m long and 6 m wide. What is its perimeter?', 'mcq', '["32 m", "28 m", "36 m", "34 m"]'::jsonb, 'A'),
  ('A rectangular garden is 12 m long and 7 m wide. What is its perimeter?', 'mcq', '["38 m", "34 m", "40 m", "42 m"]'::jsonb, 'A'),
  ('A rectangular garden is 9 m long and 4 m wide. What is its perimeter?', 'mcq', '["28 m", "22 m", "30 m", "26 m"]'::jsonb, 'D'),
  ('A rectangular garden is 15 m long and 8 m wide. What is its perimeter?', 'mcq', '["42 m", "46 m", "48 m", "50 m"]'::jsonb, 'B'),
  ('Convert 0.5 into a fraction in its simplest form.', 'mcq', '["1/3", "1/4", "2/5", "1/2"]'::jsonb, 'D'),
  ('Convert 0.25 into a fraction in its simplest form.', 'mcq', '["1/4", "3/4", "1/2", "1/5"]'::jsonb, 'A'),
  ('Convert 0.75 into a fraction in its simplest form.', 'mcq', '["4/5", "1/2", "3/4", "2/3"]'::jsonb, 'C'),
  ('Convert 0.2 into a fraction in its simplest form.', 'mcq', '["1/4", "1/10", "1/5", "2/5"]'::jsonb, 'C'),
  ('Convert 0.1 into a fraction in its simplest form.', 'mcq', '["1/5", "1/4", "1/10", "1/2"]'::jsonb, 'C')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Executive Functioning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_discovery' and bp.name = 'Academic Strengths & Weaknesses'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('Put these steps in the correct order to make tea: (1) Pour water into a cup (2) Boil water (3) Add tea leaves (4) Drink the tea.', 'mcq', '["1, 2, 3, 4", "2, 1, 3, 4", "2, 3, 1, 4", "3, 2, 1, 4"]'::jsonb, 'B'),
  ('Put these steps in order for getting ready for school: (1) Eat breakfast (2) Wake up (3) Brush teeth (4) Wear the school uniform.', 'mcq', '["2, 3, 1, 4", "1, 2, 3, 4", "2, 1, 4, 3", "3, 2, 1, 4"]'::jsonb, 'A'),
  ('Put these steps in order for writing a book report: (1) Read the book (2) Write the report (3) Choose a book (4) Take notes while reading.', 'mcq', '["1, 2, 3, 4", "3, 1, 4, 2", "2, 3, 1, 4", "4, 1, 3, 2"]'::jsonb, 'B'),
  ('Put these steps in order for planting a seed: (1) Water it (2) Dig a hole (3) Place the seed in the hole (4) Cover it with soil.', 'mcq', '["2, 3, 4, 1", "1, 2, 3, 4", "3, 2, 4, 1", "2, 1, 3, 4"]'::jsonb, 'A'),
  ('Put these steps in order for solving a math homework page: (1) Check your answers (2) Read the instructions (3) Solve each problem (4) Submit the homework.', 'mcq', '["2, 3, 1, 4", "1, 2, 3, 4", "3, 2, 1, 4", "2, 1, 4, 3"]'::jsonb, 'A'),
  ('Put these steps in order for packing a school bag: (1) Check the next day''s timetable (2) Pack the required books (3) Zip the bag (4) Pack stationery.', 'mcq', '["1, 2, 4, 3", "2, 1, 4, 3", "1, 4, 2, 3", "4, 1, 2, 3"]'::jsonb, 'A'),
  ('You are given a shopping list of 5 items: milk, bread, eggs, butter, jam. What is the 3rd item on the list?', 'mcq', '["Milk", "Bread", "Eggs", "Butter"]'::jsonb, 'C'),
  ('Read this list once: pencil, ruler, eraser, sharpener. Without looking back, which item was mentioned second?', 'mcq', '["Pencil", "Ruler", "Eraser", "Sharpener"]'::jsonb, 'B'),
  ('A teacher gives 4 instructions: stand up, push in your chair, walk to the door, wait quietly. What is the last instruction?', 'mcq', '["Stand up", "Push in your chair", "Walk to the door", "Wait quietly"]'::jsonb, 'D'),
  ('You are told to remember these numbers in order: 7, 2, 9, 4. What is the number in the 2nd position?', 'mcq', '["7", "2", "9", "4"]'::jsonb, 'B'),
  ('A recipe lists 4 steps: mix flour and sugar, add eggs, pour into a pan, bake for 20 minutes. What is the 3rd step?', 'mcq', '["Mix flour and sugar", "Add eggs", "Pour into a pan", "Bake for 20 minutes"]'::jsonb, 'C'),
  ('You hear a list of 5 colors: red, blue, green, yellow, purple. Which color was mentioned right after ''blue''?', 'mcq', '["Red", "Green", "Yellow", "Purple"]'::jsonb, 'B'),
  ('You have 3 tasks: homework due tomorrow, a fun video to watch, and a room to tidy with no deadline. What should you do first?', 'mcq', '["Watch the video", "Tidy the room", "Finish the homework", "Nothing"]'::jsonb, 'C'),
  ('You have one hour before dinner. You need to finish 20 minutes of homework and want to play for the rest of the time. What is the best plan?', 'mcq', '["Play for the full hour", "Do homework first, then play", "Skip homework entirely", "Ask someone else to do the homework"]'::jsonb, 'B'),
  ('Your teacher assigns a project due in one week. What is the best first step?', 'mcq', '["Start writing the final report immediately", "Wait until the night before it is due", "Break the project into smaller steps and make a plan", "Ask a friend to do it for you"]'::jsonb, 'C'),
  ('You have a test tomorrow and also want to watch your favorite show tonight. What is the smartest choice?', 'mcq', '["Watch the whole show and skip studying", "Study first, then watch the show if time allows", "Skip both", "Watch the show while trying to study at the same time"]'::jsonb, 'B'),
  ('You are asked to complete three chores: wash dishes (urgent), water plants (not urgent), and organize your desk (not urgent). Which should you do first?', 'mcq', '["Organize your desk", "Water plants", "Wash the dishes", "None, since none are urgent"]'::jsonb, 'C'),
  ('You have a group project and each member has a different task. What is the best way to make sure the project finishes on time?', 'mcq', '["Wait for others to finish first", "Set a shared timeline and check progress regularly", "Do the entire project alone", "Ignore deadlines"]'::jsonb, 'B'),
  ('Spot the number that is different: 4829, 4829, 4892, 4829', 'mcq', '["1st", "2nd", "3rd", "4th"]'::jsonb, 'C'),
  ('Which word is spelled differently from the rest: apple, apple, appel, apple?', 'mcq', '["1st", "2nd", "3rd", "4th"]'::jsonb, 'C'),
  ('In the sequence 15, 16, 17, 19, 20 — which number breaks the pattern?', 'mcq', '["15", "17", "19", "20"]'::jsonb, 'C'),
  ('Which pair of codes is NOT identical? A: XY12-XY12  B: AB34-AB43  C: CD56-CD56  D: EF78-EF78', 'mcq', '["A", "B", "C", "D"]'::jsonb, 'B'),
  ('Count how many times the letter ''e'' appears in the word ''ELEPHANT''.', 'mcq', '["1", "2", "3", "4"]'::jsonb, 'B'),
  ('Which row has a repeated number? Row A: 3 5 7 9 | Row B: 2 4 2 6 | Row C: 1 3 5 7 | Row D: 8 6 4 2', 'mcq', '["Row A", "Row B", "Row C", "Row D"]'::jsonb, 'B'),
  ('While studying, your phone keeps buzzing with messages. What is the best self-regulation strategy?', 'mcq', '["Reply immediately every time", "Turn off notifications until a break", "Give up studying", "Study with the phone in hand"]'::jsonb, 'B'),
  ('You feel frustrated because a math problem is hard. What is the best thing to do?', 'mcq', '["Give up right away", "Take a short break, then try again calmly", "Throw the notebook", "Copy someone else''s answer"]'::jsonb, 'B'),
  ('Your friend is talking during class while the teacher is explaining something important. What should you do?', 'mcq', '["Talk back loudly", "Politely ask them to wait until after class", "Ignore the teacher too", "Get up and leave"]'::jsonb, 'B'),
  ('You made a mistake on a test and feel upset. What is the healthiest response?', 'mcq', '["Blame the teacher", "Accept the mistake and learn from it", "Stop trying in that subject", "Hide the test from your parents"]'::jsonb, 'B'),
  ('You want to play a video game, but you still have homework left. What shows good self-control?', 'mcq', '["Playing the game and ignoring homework", "Finishing homework before playing", "Doing both at the same time", "Asking someone else to finish your homework"]'::jsonb, 'B'),
  ('During a group activity, another student disagrees with your idea. What is the best response?', 'mcq', '["Get angry and argue loudly", "Listen calmly and discuss the difference respectfully", "Ignore them completely", "Refuse to work with them"]'::jsonb, 'B')
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Intrapersonal'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I feel comfortable explaining my emotional needs to subject teachers or advisors.', 'likert5', NULL, NULL),
  ('I have a positive, confident attitude toward board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I know exactly which situations trigger my academic anxieties.', 'likert5', NULL, NULL),
  ('I can stand up for my beliefs even under peer pressure.', 'likert5', NULL, NULL),
  ('I accept my personal style and professional values.', 'likert5', NULL, NULL),
  ('I regularly coordinate group outcomes at my home study desk.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine critical parameters when working with my school friends.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on manageing extracurricular club activities.', 'likert5', NULL, NULL),
  ('I try to evaluate extracurricular club activities at my home study desk to achieve extracurricular club activities.', 'likert5', NULL, NULL),
  ('I regularly handle my routine plans during study sessions.', 'likert5', NULL, NULL),
  ('I prefer to handle my routine plans during working with my school friends.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate critical parameters when handling daily schedules.', 'likert5', NULL, NULL),
  ('I find it easy to examine my routine plans during school events.', 'likert5', NULL, NULL),
  ('I try to evaluate critical parameters during school events to achieve critical parameters.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on coordinateing critical parameters.', 'likert5', NULL, NULL),
  ('I prefer to evaluate extracurricular club activities during facing report card marks adjustments.', 'likert5', NULL, NULL),
  ('I regularly manage extracurricular club activities during study sessions.', 'likert5', NULL, NULL),
  ('I regularly manage extracurricular club activities at my home study desk.', 'likert5', NULL, NULL),
  ('I prefer to examine group outcomes during facing report card marks adjustments.', 'likert5', NULL, NULL),
  ('I find it easy to manage board exam prep and school streams during school events.', 'likert5', NULL, NULL),
  ('I regularly handle critical parameters at my home study desk.', 'likert5', NULL, NULL),
  ('I regularly review critical parameters in science club activities.', 'likert5', NULL, NULL),
  ('When working with my school friends, I focus on coordinateing board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I regularly coordinate critical parameters during school events.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on evaluateing group outcomes.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on reviewing board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I try to examine extracurricular club activities in geometry class to achieve extracurricular club activities.', 'likert5', NULL, NULL),
  ('I try to manage board exam prep and school streams in science club activities to achieve board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I prefer to examine my routine plans during facing report card marks adjustments.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine group outcomes when working with my school friends.', 'likert5', NULL, NULL),
  ('I try to coordinate board exam prep and school streams in geometry class to achieve board exam prep and school streams.', 'likert5', NULL, NULL),
  ('When facing report card marks adjustments, I focus on tracking board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I find it easy to review extracurricular club activities during school events.', 'likert5', NULL, NULL),
  ('I try to examine my routine plans in science club activities to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I regularly track group outcomes at my home study desk.', 'likert5', NULL, NULL),
  ('I regularly coordinate critical parameters at my home study desk.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate board exam prep and school streams during school events.', 'likert5', NULL, NULL),
  ('I prefer to evaluate group outcomes during facing report card marks adjustments.', 'likert5', NULL, NULL),
  ('When facing report card marks adjustments, I focus on coordinateing board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I regularly evaluate my routine plans in science club activities.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Interpersonal'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I build supportive, long-term friendships with my school friends.', 'likert5', NULL, NULL),
  ('I listen to other points of view during class debates.', 'likert5', NULL, NULL),
  ('I enjoy helping my school friends with difficult assignments.', 'likert5', NULL, NULL),
  ('I coordinate easily with diverse study circles on projects.', 'likert5', NULL, NULL),
  ('I communicate my ideas in a warm, welcoming manner.', 'likert5', NULL, NULL),
  ('I prefer to track board exam prep and school streams during working with my school friends.', 'likert5', NULL, NULL),
  ('I regularly examine board exam prep and school streams during school events.', 'likert5', NULL, NULL),
  ('I try to evaluate group outcomes at my home study desk to achieve group outcomes.', 'likert5', NULL, NULL),
  ('When facing report card marks adjustments, I focus on handleing board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I regularly manage critical parameters during study sessions.', 'likert5', NULL, NULL),
  ('I regularly evaluate board exam prep and school streams in science club activities.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine my routine plans when handling daily schedules.', 'likert5', NULL, NULL),
  ('I prefer to coordinate extracurricular club activities during handling daily schedules.', 'likert5', NULL, NULL),
  ('I regularly examine extracurricular club activities in geometry class.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on manageing my routine plans.', 'likert5', NULL, NULL),
  ('I prefer to examine extracurricular club activities during handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine board exam prep and school streams when handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate group outcomes when handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to manage my routine plans in science club activities to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I try to review my routine plans during study sessions to achieve my routine plans.', 'likert5', NULL, NULL),
  ('When facing report card marks adjustments, I focus on manageing my routine plans.', 'likert5', NULL, NULL),
  ('I find it easy to track my routine plans in science club activities.', 'likert5', NULL, NULL),
  ('I feel comfortable to review extracurricular club activities when working with my school friends.', 'likert5', NULL, NULL),
  ('I prefer to examine my routine plans during working with my school friends.', 'likert5', NULL, NULL),
  ('I prefer to handle group outcomes during facing report card marks adjustments.', 'likert5', NULL, NULL),
  ('I try to examine board exam prep and school streams during study sessions to achieve board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I regularly review my routine plans during school events.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate extracurricular club activities when working with my school friends.', 'likert5', NULL, NULL),
  ('I prefer to evaluate board exam prep and school streams during facing report card marks adjustments.', 'likert5', NULL, NULL),
  ('I regularly handle critical parameters in science club activities.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate extracurricular club activities at my home study desk.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate board exam prep and school streams during study sessions.', 'likert5', NULL, NULL),
  ('I regularly review board exam prep and school streams in geometry class.', 'likert5', NULL, NULL),
  ('When working with my school friends, I focus on examineing board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I find it easy to handle group outcomes in science club activities.', 'likert5', NULL, NULL),
  ('I prefer to review critical parameters during working with my school friends.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate extracurricular club activities when handling daily schedules.', 'likert5', NULL, NULL),
  ('When working with my school friends, I focus on handleing critical parameters.', 'likert5', NULL, NULL),
  ('I feel comfortable to track group outcomes when working with my school friends.', 'likert5', NULL, NULL),
  ('I regularly evaluate extracurricular club activities at my home study desk.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Stress Management'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I stay calm and focused when exam results or report card marks are out.', 'likert5', NULL, NULL),
  ('I organize my schedules to avoid last-minute panic.', 'likert5', NULL, NULL),
  ('I use relaxation methods to manage physical tension.', 'likert5', NULL, NULL),
  ('I control my temper when others disagree with my workflow.', 'likert5', NULL, NULL),
  ('I separate personal worries from my focus on board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I regularly handle my routine plans at my home study desk.', 'likert5', NULL, NULL),
  ('I try to track my routine plans during study sessions to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I try to review my routine plans in geometry class to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I regularly track my routine plans in geometry class.', 'likert5', NULL, NULL),
  ('I try to track critical parameters in geometry class to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I try to examine board exam prep and school streams in science club activities to achieve board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine my routine plans when handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to examine critical parameters during study sessions to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I find it easy to handle group outcomes in geometry class.', 'likert5', NULL, NULL),
  ('I prefer to coordinate extracurricular club activities during handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine my routine plans when working with my school friends.', 'likert5', NULL, NULL),
  ('I prefer to examine extracurricular club activities during handling daily schedules.', 'likert5', NULL, NULL),
  ('I find it easy to review group outcomes at my home study desk.', 'likert5', NULL, NULL),
  ('I regularly review board exam prep and school streams during school events.', 'likert5', NULL, NULL),
  ('I try to review board exam prep and school streams in science club activities to achieve board exam prep and school streams.', 'likert5', NULL, NULL),
  ('When working with my school friends, I focus on manageing critical parameters.', 'likert5', NULL, NULL),
  ('I find it easy to manage critical parameters at my home study desk.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on handleing board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I prefer to coordinate critical parameters during handling daily schedules.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate critical parameters at my home study desk.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine board exam prep and school streams when facing report card marks adjustments.', 'likert5', NULL, NULL),
  ('I feel comfortable to review my routine plans when working with my school friends.', 'likert5', NULL, NULL),
  ('When facing report card marks adjustments, I focus on tracking extracurricular club activities.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate my routine plans when handling daily schedules.', 'likert5', NULL, NULL),
  ('I find it easy to track extracurricular club activities during study sessions.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate critical parameters when handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate group outcomes when facing report card marks adjustments.', 'likert5', NULL, NULL),
  ('I try to handle board exam prep and school streams at my home study desk to achieve board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I regularly handle extracurricular club activities during school events.', 'likert5', NULL, NULL),
  ('I try to review extracurricular club activities during study sessions to achieve extracurricular club activities.', 'likert5', NULL, NULL),
  ('I regularly examine my routine plans in science club activities.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate extracurricular club activities when handling daily schedules.', 'likert5', NULL, NULL),
  ('When working with my school friends, I focus on coordinateing critical parameters.', 'likert5', NULL, NULL),
  ('I prefer to evaluate my routine plans during working with my school friends.', 'likert5', NULL, NULL),
  ('I find it easy to manage my routine plans during school events.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Adaptability'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I adjust my study routines quickly when system rules change.', 'likert5', NULL, NULL),
  ('I can adapt easily to different leadership or teaching styles.', 'likert5', NULL, NULL),
  ('I solve scientific problems logically even when feeling tired.', 'likert5', NULL, NULL),
  ('I change my plans without frustration when unexpected tasks pop up.', 'likert5', NULL, NULL),
  ('I treat failures as inputs to modify my schedules.', 'likert5', NULL, NULL),
  ('I regularly track critical parameters during study sessions.', 'likert5', NULL, NULL),
  ('I prefer to handle board exam prep and school streams during facing report card marks adjustments.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on tracking board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I find it easy to manage critical parameters in geometry class.', 'likert5', NULL, NULL),
  ('I prefer to handle my routine plans during working with my school friends.', 'likert5', NULL, NULL),
  ('I feel comfortable to review board exam prep and school streams when handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to review extracurricular club activities in geometry class to achieve extracurricular club activities.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate my routine plans in geometry class.', 'likert5', NULL, NULL),
  ('I find it easy to review board exam prep and school streams in geometry class.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle extracurricular club activities when working with my school friends.', 'likert5', NULL, NULL),
  ('I prefer to review my routine plans during handling daily schedules.', 'likert5', NULL, NULL),
  ('I regularly examine extracurricular club activities during study sessions.', 'likert5', NULL, NULL),
  ('When facing report card marks adjustments, I focus on examineing my routine plans.', 'likert5', NULL, NULL),
  ('I try to review board exam prep and school streams in science club activities to achieve board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I try to evaluate extracurricular club activities during study sessions to achieve extracurricular club activities.', 'likert5', NULL, NULL),
  ('I prefer to manage board exam prep and school streams during handling daily schedules.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on manageing critical parameters.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on tracking critical parameters.', 'likert5', NULL, NULL),
  ('I regularly manage extracurricular club activities at my home study desk.', 'likert5', NULL, NULL),
  ('When facing report card marks adjustments, I focus on evaluateing extracurricular club activities.', 'likert5', NULL, NULL),
  ('I regularly review board exam prep and school streams in science club activities.', 'likert5', NULL, NULL),
  ('I find it easy to manage board exam prep and school streams in science club activities.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine board exam prep and school streams when facing report card marks adjustments.', 'likert5', NULL, NULL),
  ('I feel comfortable to track group outcomes when handling daily schedules.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate extracurricular club activities during study sessions.', 'likert5', NULL, NULL),
  ('I regularly handle my routine plans in geometry class.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on tracking extracurricular club activities.', 'likert5', NULL, NULL),
  ('When working with my school friends, I focus on evaluateing my routine plans.', 'likert5', NULL, NULL),
  ('I regularly track my routine plans during study sessions.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on reviewing group outcomes.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on examineing board exam prep and school streams.', 'likert5', NULL, NULL),
  ('When facing report card marks adjustments, I focus on coordinateing board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage board exam prep and school streams when handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to track critical parameters at my home study desk to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I feel comfortable to review critical parameters when handling daily schedules.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'General Mood'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I maintain an optimistic, positive view of my future choices.', 'likert5', NULL, NULL),
  ('I feel happy and satisfied with my life as a student.', 'likert5', NULL, NULL),
  ('I approach my daily routines with high energy.', 'likert5', NULL, NULL),
  ('I can easily motivate myself after a poor score on a task.', 'likert5', NULL, NULL),
  ('I try to spread encouraging energy among my school friends.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on reviewing my routine plans.', 'likert5', NULL, NULL),
  ('I regularly track critical parameters during study sessions.', 'likert5', NULL, NULL),
  ('I prefer to handle extracurricular club activities during working with my school friends.', 'likert5', NULL, NULL),
  ('I find it easy to handle critical parameters in science club activities.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on evaluateing my routine plans.', 'likert5', NULL, NULL),
  ('I prefer to manage group outcomes during working with my school friends.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate extracurricular club activities when facing report card marks adjustments.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on manageing my routine plans.', 'likert5', NULL, NULL),
  ('I try to handle group outcomes during school events to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I prefer to handle board exam prep and school streams during handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to review board exam prep and school streams when handling daily schedules.', 'likert5', NULL, NULL),
  ('When working with my school friends, I focus on evaluateing extracurricular club activities.', 'likert5', NULL, NULL),
  ('I regularly examine board exam prep and school streams in science club activities.', 'likert5', NULL, NULL),
  ('I try to review my routine plans during study sessions to achieve my routine plans.', 'likert5', NULL, NULL),
  ('When working with my school friends, I focus on tracking group outcomes.', 'likert5', NULL, NULL),
  ('I try to track group outcomes in geometry class to achieve group outcomes.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on tracking critical parameters.', 'likert5', NULL, NULL),
  ('I regularly handle my routine plans in science club activities.', 'likert5', NULL, NULL),
  ('I prefer to review my routine plans during facing report card marks adjustments.', 'likert5', NULL, NULL),
  ('I regularly manage board exam prep and school streams in geometry class.', 'likert5', NULL, NULL),
  ('When facing report card marks adjustments, I focus on handleing extracurricular club activities.', 'likert5', NULL, NULL),
  ('I try to handle critical parameters during study sessions to achieve critical parameters.', 'likert5', NULL, NULL),
  ('When facing report card marks adjustments, I focus on manageing extracurricular club activities.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate extracurricular club activities at my home study desk.', 'likert5', NULL, NULL),
  ('I prefer to coordinate board exam prep and school streams during working with my school friends.', 'likert5', NULL, NULL),
  ('I find it easy to manage board exam prep and school streams during study sessions.', 'likert5', NULL, NULL),
  ('I try to examine critical parameters at my home study desk to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I try to coordinate board exam prep and school streams in geometry class to achieve board exam prep and school streams.', 'likert5', NULL, NULL),
  ('I regularly manage extracurricular club activities in science club activities.', 'likert5', NULL, NULL),
  ('I find it easy to handle board exam prep and school streams at my home study desk.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate my routine plans when handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to track extracurricular club activities during school events to achieve extracurricular club activities.', 'likert5', NULL, NULL),
  ('I try to review my routine plans during school events to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I regularly evaluate board exam prep and school streams during study sessions.', 'likert5', NULL, NULL),
  ('I prefer to track board exam prep and school streams during facing report card marks adjustments.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Intrapersonal'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I feel comfortable explaining my emotional needs to coaching mentors or professors.', 'likert5', NULL, NULL),
  ('I have a positive, confident attitude toward competitive tests like JEE/NEET and college majors.', 'likert5', NULL, NULL),
  ('I know exactly which situations trigger my academic anxieties.', 'likert5', NULL, NULL),
  ('I can stand up for my beliefs even under peer pressure.', 'likert5', NULL, NULL),
  ('I accept my personal style and professional values.', 'likert5', NULL, NULL),
  ('I regularly examine competitive tests like JEE/NEET and college majors in advanced classes.', 'likert5', NULL, NULL),
  ('I find it easy to examine group outcomes during final revisions.', 'likert5', NULL, NULL),
  ('I try to review competitive tests like JEE/NEET and college majors in admissions briefings to achieve competitive tests like JEE/NEET and college majors.', 'likert5', NULL, NULL),
  ('I try to evaluate my routine plans in admissions briefings to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I try to review group outcomes in advanced classes to achieve group outcomes.', 'likert5', NULL, NULL),
  ('When working with my study peers, I focus on handleing advanced entrance exam coaching.', 'likert5', NULL, NULL),
  ('I try to coordinate advanced entrance exam coaching in advanced classes to achieve advanced entrance exam coaching.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle advanced entrance exam coaching when working with my study peers.', 'likert5', NULL, NULL),
  ('I regularly examine critical parameters in advanced classes.', 'likert5', NULL, NULL),
  ('When facing mock rankings adjustments, I focus on evaluateing group outcomes.', 'likert5', NULL, NULL),
  ('I find it easy to manage my routine plans in advanced classes.', 'likert5', NULL, NULL),
  ('I try to evaluate competitive tests like JEE/NEET and college majors during final revisions to achieve competitive tests like JEE/NEET and college majors.', 'likert5', NULL, NULL),
  ('I try to examine my routine plans in admissions briefings to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I regularly review group outcomes at my quiet study table.', 'likert5', NULL, NULL),
  ('I prefer to track critical parameters during working with my study peers.', 'likert5', NULL, NULL),
  ('I prefer to handle advanced entrance exam coaching during working with my study peers.', 'likert5', NULL, NULL),
  ('I regularly coordinate critical parameters in admissions briefings.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage my routine plans when working with my study peers.', 'likert5', NULL, NULL),
  ('I find it easy to track critical parameters during final revisions.', 'likert5', NULL, NULL),
  ('When working with my study peers, I focus on examineing critical parameters.', 'likert5', NULL, NULL),
  ('I regularly review group outcomes in advanced classes.', 'likert5', NULL, NULL),
  ('I regularly examine competitive tests like JEE/NEET and college majors at my quiet study table.', 'likert5', NULL, NULL),
  ('I prefer to manage my routine plans during handling daily schedules.', 'likert5', NULL, NULL),
  ('I regularly examine advanced entrance exam coaching during final revisions.', 'likert5', NULL, NULL),
  ('I find it easy to review my routine plans in advanced classes.', 'likert5', NULL, NULL),
  ('I try to manage critical parameters at my quiet study table to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage competitive tests like JEE/NEET and college majors when handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate my routine plans when facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I feel comfortable to review my routine plans when facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I prefer to evaluate my routine plans during facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I try to track critical parameters during final revisions to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine critical parameters when handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to track competitive tests like JEE/NEET and college majors when facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I find it easy to track advanced entrance exam coaching at my quiet study table.', 'likert5', NULL, NULL),
  ('I find it easy to track critical parameters in admissions briefings.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Interpersonal'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I build supportive, long-term friendships with my study peers.', 'likert5', NULL, NULL),
  ('I listen to other points of view during class debates.', 'likert5', NULL, NULL),
  ('I enjoy helping my study peers with difficult assignments.', 'likert5', NULL, NULL),
  ('I coordinate easily with diverse study circles on projects.', 'likert5', NULL, NULL),
  ('I communicate my ideas in a warm, welcoming manner.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate my routine plans when facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I prefer to review advanced entrance exam coaching during working with my study peers.', 'likert5', NULL, NULL),
  ('I try to examine critical parameters in admissions briefings to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I find it easy to manage group outcomes at my quiet study table.', 'likert5', NULL, NULL),
  ('I find it easy to review group outcomes at my quiet study table.', 'likert5', NULL, NULL),
  ('I find it easy to track advanced entrance exam coaching during final revisions.', 'likert5', NULL, NULL),
  ('When facing mock rankings adjustments, I focus on manageing advanced entrance exam coaching.', 'likert5', NULL, NULL),
  ('I try to manage advanced entrance exam coaching in advanced classes to achieve advanced entrance exam coaching.', 'likert5', NULL, NULL),
  ('I try to handle advanced entrance exam coaching during final revisions to achieve advanced entrance exam coaching.', 'likert5', NULL, NULL),
  ('I find it easy to examine competitive tests like JEE/NEET and college majors at my quiet study table.', 'likert5', NULL, NULL),
  ('I prefer to evaluate critical parameters during working with my study peers.', 'likert5', NULL, NULL),
  ('I find it easy to examine advanced entrance exam coaching at my quiet study table.', 'likert5', NULL, NULL),
  ('I regularly review competitive tests like JEE/NEET and college majors during college entrance coaching.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine my routine plans when working with my study peers.', 'likert5', NULL, NULL),
  ('I prefer to manage critical parameters during facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I try to handle my routine plans in advanced classes to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I find it easy to examine group outcomes in advanced classes.', 'likert5', NULL, NULL),
  ('I find it easy to manage competitive tests like JEE/NEET and college majors during college entrance coaching.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage critical parameters when facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate group outcomes during college entrance coaching.', 'likert5', NULL, NULL),
  ('I prefer to manage competitive tests like JEE/NEET and college majors during facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I regularly handle my routine plans during final revisions.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine group outcomes when facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I prefer to handle group outcomes during working with my study peers.', 'likert5', NULL, NULL),
  ('I prefer to examine competitive tests like JEE/NEET and college majors during working with my study peers.', 'likert5', NULL, NULL),
  ('When working with my study peers, I focus on tracking group outcomes.', 'likert5', NULL, NULL),
  ('When working with my study peers, I focus on handleing critical parameters.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate advanced entrance exam coaching in admissions briefings.', 'likert5', NULL, NULL),
  ('I regularly manage competitive tests like JEE/NEET and college majors in advanced classes.', 'likert5', NULL, NULL),
  ('I find it easy to examine group outcomes at my quiet study table.', 'likert5', NULL, NULL),
  ('I regularly examine critical parameters during college entrance coaching.', 'likert5', NULL, NULL),
  ('I find it easy to examine advanced entrance exam coaching in advanced classes.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle critical parameters when facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I prefer to examine advanced entrance exam coaching during facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I regularly track advanced entrance exam coaching during final revisions.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Stress Management'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I stay calm and focused when exam results or mock rankings are out.', 'likert5', NULL, NULL),
  ('I organize my schedules to avoid last-minute panic.', 'likert5', NULL, NULL),
  ('I use relaxation methods to manage physical tension.', 'likert5', NULL, NULL),
  ('I control my temper when others disagree with my workflow.', 'likert5', NULL, NULL),
  ('I separate personal worries from my focus on competitive tests like JEE/NEET and college majors.', 'likert5', NULL, NULL),
  ('I find it easy to handle competitive tests like JEE/NEET and college majors in admissions briefings.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate my routine plans when facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I prefer to evaluate competitive tests like JEE/NEET and college majors during working with my study peers.', 'likert5', NULL, NULL),
  ('When facing mock rankings adjustments, I focus on manageing group outcomes.', 'likert5', NULL, NULL),
  ('I try to review my routine plans in admissions briefings to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate advanced entrance exam coaching in advanced classes.', 'likert5', NULL, NULL),
  ('I prefer to manage group outcomes during handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to handle competitive tests like JEE/NEET and college majors in admissions briefings to achieve competitive tests like JEE/NEET and college majors.', 'likert5', NULL, NULL),
  ('I find it easy to examine advanced entrance exam coaching at my quiet study table.', 'likert5', NULL, NULL),
  ('I regularly manage group outcomes in admissions briefings.', 'likert5', NULL, NULL),
  ('I find it easy to track my routine plans in admissions briefings.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on manageing competitive tests like JEE/NEET and college majors.', 'likert5', NULL, NULL),
  ('I regularly handle competitive tests like JEE/NEET and college majors during college entrance coaching.', 'likert5', NULL, NULL),
  ('I prefer to track critical parameters during working with my study peers.', 'likert5', NULL, NULL),
  ('I prefer to manage critical parameters during facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate advanced entrance exam coaching when working with my study peers.', 'likert5', NULL, NULL),
  ('I prefer to handle my routine plans during working with my study peers.', 'likert5', NULL, NULL),
  ('I prefer to coordinate my routine plans during facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I regularly review competitive tests like JEE/NEET and college majors at my quiet study table.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate critical parameters during final revisions.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate group outcomes when working with my study peers.', 'likert5', NULL, NULL),
  ('I regularly review my routine plans during college entrance coaching.', 'likert5', NULL, NULL),
  ('When facing mock rankings adjustments, I focus on evaluateing advanced entrance exam coaching.', 'likert5', NULL, NULL),
  ('I find it easy to examine my routine plans in advanced classes.', 'likert5', NULL, NULL),
  ('When working with my study peers, I focus on tracking group outcomes.', 'likert5', NULL, NULL),
  ('I find it easy to track group outcomes during college entrance coaching.', 'likert5', NULL, NULL),
  ('I prefer to handle competitive tests like JEE/NEET and college majors during handling daily schedules.', 'likert5', NULL, NULL),
  ('I prefer to examine competitive tests like JEE/NEET and college majors during working with my study peers.', 'likert5', NULL, NULL),
  ('When facing mock rankings adjustments, I focus on coordinateing advanced entrance exam coaching.', 'likert5', NULL, NULL),
  ('I find it easy to manage competitive tests like JEE/NEET and college majors in advanced classes.', 'likert5', NULL, NULL),
  ('I prefer to coordinate group outcomes during facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I regularly handle advanced entrance exam coaching during final revisions.', 'likert5', NULL, NULL),
  ('I prefer to coordinate my routine plans during working with my study peers.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage competitive tests like JEE/NEET and college majors when facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on tracking advanced entrance exam coaching.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Adaptability'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I adjust my study routines quickly when system rules change.', 'likert5', NULL, NULL),
  ('I can adapt easily to different leadership or teaching styles.', 'likert5', NULL, NULL),
  ('I solve scientific problems logically even when feeling tired.', 'likert5', NULL, NULL),
  ('I change my plans without frustration when unexpected tasks pop up.', 'likert5', NULL, NULL),
  ('I treat failures as inputs to modify my schedules.', 'likert5', NULL, NULL),
  ('I regularly handle group outcomes in admissions briefings.', 'likert5', NULL, NULL),
  ('I try to examine advanced entrance exam coaching during college entrance coaching to achieve advanced entrance exam coaching.', 'likert5', NULL, NULL),
  ('I try to review competitive tests like JEE/NEET and college majors at my quiet study table to achieve competitive tests like JEE/NEET and college majors.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine critical parameters when facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I find it easy to track advanced entrance exam coaching during final revisions.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate group outcomes at my quiet study table.', 'likert5', NULL, NULL),
  ('I try to track group outcomes during final revisions to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I prefer to handle advanced entrance exam coaching during facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate competitive tests like JEE/NEET and college majors when working with my study peers.', 'likert5', NULL, NULL),
  ('I regularly coordinate critical parameters at my quiet study table.', 'likert5', NULL, NULL),
  ('I find it easy to handle competitive tests like JEE/NEET and college majors during final revisions.', 'likert5', NULL, NULL),
  ('When facing mock rankings adjustments, I focus on tracking critical parameters.', 'likert5', NULL, NULL),
  ('I find it easy to handle group outcomes during college entrance coaching.', 'likert5', NULL, NULL),
  ('I feel comfortable to track advanced entrance exam coaching when handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to evaluate critical parameters in admissions briefings to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I regularly review competitive tests like JEE/NEET and college majors during college entrance coaching.', 'likert5', NULL, NULL),
  ('I regularly coordinate advanced entrance exam coaching during college entrance coaching.', 'likert5', NULL, NULL),
  ('I prefer to evaluate my routine plans during working with my study peers.', 'likert5', NULL, NULL),
  ('I regularly coordinate group outcomes during final revisions.', 'likert5', NULL, NULL),
  ('When working with my study peers, I focus on evaluateing my routine plans.', 'likert5', NULL, NULL),
  ('I prefer to evaluate advanced entrance exam coaching during working with my study peers.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage my routine plans when handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle competitive tests like JEE/NEET and college majors when facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I try to evaluate advanced entrance exam coaching during college entrance coaching to achieve advanced entrance exam coaching.', 'likert5', NULL, NULL),
  ('I prefer to coordinate competitive tests like JEE/NEET and college majors during working with my study peers.', 'likert5', NULL, NULL),
  ('I regularly track my routine plans at my quiet study table.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on examineing competitive tests like JEE/NEET and college majors.', 'likert5', NULL, NULL),
  ('I regularly evaluate critical parameters in advanced classes.', 'likert5', NULL, NULL),
  ('I regularly evaluate critical parameters at my quiet study table.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on examineing critical parameters.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate my routine plans when handling daily schedules.', 'likert5', NULL, NULL),
  ('I prefer to examine my routine plans during handling daily schedules.', 'likert5', NULL, NULL),
  ('When working with my study peers, I focus on manageing my routine plans.', 'likert5', NULL, NULL),
  ('I try to track my routine plans in admissions briefings to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I regularly manage group outcomes during college entrance coaching.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'General Mood'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I maintain an optimistic, positive view of my future choices.', 'likert5', NULL, NULL),
  ('I feel happy and satisfied with my life as a student.', 'likert5', NULL, NULL),
  ('I approach my daily routines with high energy.', 'likert5', NULL, NULL),
  ('I can easily motivate myself after a poor score on a task.', 'likert5', NULL, NULL),
  ('I try to spread encouraging energy among my study peers.', 'likert5', NULL, NULL),
  ('I prefer to examine group outcomes during working with my study peers.', 'likert5', NULL, NULL),
  ('I try to track my routine plans at my quiet study table to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate group outcomes at my quiet study table.', 'likert5', NULL, NULL),
  ('I prefer to handle advanced entrance exam coaching during facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I try to review competitive tests like JEE/NEET and college majors during college entrance coaching to achieve competitive tests like JEE/NEET and college majors.', 'likert5', NULL, NULL),
  ('I find it easy to handle critical parameters at my quiet study table.', 'likert5', NULL, NULL),
  ('When working with my study peers, I focus on handleing competitive tests like JEE/NEET and college majors.', 'likert5', NULL, NULL),
  ('I prefer to manage group outcomes during facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I prefer to manage advanced entrance exam coaching during working with my study peers.', 'likert5', NULL, NULL),
  ('I try to track critical parameters in admissions briefings to achieve critical parameters.', 'likert5', NULL, NULL),
  ('When working with my study peers, I focus on evaluateing critical parameters.', 'likert5', NULL, NULL),
  ('I try to handle competitive tests like JEE/NEET and college majors in admissions briefings to achieve competitive tests like JEE/NEET and college majors.', 'likert5', NULL, NULL),
  ('I find it easy to examine group outcomes during college entrance coaching.', 'likert5', NULL, NULL),
  ('I regularly review group outcomes in admissions briefings.', 'likert5', NULL, NULL),
  ('I find it easy to review my routine plans in admissions briefings.', 'likert5', NULL, NULL),
  ('I try to coordinate group outcomes in admissions briefings to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I find it easy to track critical parameters at my quiet study table.', 'likert5', NULL, NULL),
  ('I find it easy to manage my routine plans in admissions briefings.', 'likert5', NULL, NULL),
  ('I find it easy to review competitive tests like JEE/NEET and college majors in admissions briefings.', 'likert5', NULL, NULL),
  ('When working with my study peers, I focus on coordinateing my routine plans.', 'likert5', NULL, NULL),
  ('I regularly coordinate competitive tests like JEE/NEET and college majors in advanced classes.', 'likert5', NULL, NULL),
  ('I regularly manage my routine plans during college entrance coaching.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate critical parameters at my quiet study table.', 'likert5', NULL, NULL),
  ('When working with my study peers, I focus on examineing competitive tests like JEE/NEET and college majors.', 'likert5', NULL, NULL),
  ('I feel comfortable to track my routine plans when handling daily schedules.', 'likert5', NULL, NULL),
  ('When facing mock rankings adjustments, I focus on reviewing advanced entrance exam coaching.', 'likert5', NULL, NULL),
  ('I try to evaluate advanced entrance exam coaching at my quiet study table to achieve advanced entrance exam coaching.', 'likert5', NULL, NULL),
  ('I regularly coordinate competitive tests like JEE/NEET and college majors during college entrance coaching.', 'likert5', NULL, NULL),
  ('I regularly manage competitive tests like JEE/NEET and college majors in advanced classes.', 'likert5', NULL, NULL),
  ('I regularly manage critical parameters in admissions briefings.', 'likert5', NULL, NULL),
  ('I feel comfortable to review my routine plans when facing mock rankings adjustments.', 'likert5', NULL, NULL),
  ('I feel comfortable to track competitive tests like JEE/NEET and college majors when handling daily schedules.', 'likert5', NULL, NULL),
  ('I regularly track advanced entrance exam coaching in admissions briefings.', 'likert5', NULL, NULL),
  ('When working with my study peers, I focus on examineing group outcomes.', 'likert5', NULL, NULL),
  ('I regularly coordinate my routine plans at my quiet study table.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Perceiving Emotions'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I can accurately read subtle changes in my university campus peers''s expressions.', 'likert5', NULL, NULL),
  ('I notice patterns in how my body reacts to fear or excitement.', 'likert5', NULL, NULL),
  ('I can sense when a group meeting or call is tense.', 'likert5', NULL, NULL),
  ('I easily perceive the emotional tone of written emails.', 'likert5', NULL, NULL),
  ('I pay close attention to body language during presentations.', 'likert5', NULL, NULL),
  ('I try to manage my routine plans in my dorm study space to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I try to coordinate group outcomes in university seminars to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine critical parameters when working with my university campus peers.', 'likert5', NULL, NULL),
  ('I find it easy to manage critical parameters at campus placement drives.', 'likert5', NULL, NULL),
  ('I try to examine critical parameters in university seminars to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I prefer to manage group outcomes during facing GPA scores adjustments.', 'likert5', NULL, NULL),
  ('I prefer to coordinate thesis papers and internship hunt during handling daily schedules.', 'likert5', NULL, NULL),
  ('I prefer to evaluate research lab projects during handling daily schedules.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on handleing my routine plans.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate critical parameters when handling daily schedules.', 'likert5', NULL, NULL),
  ('I find it easy to review my routine plans in university seminars.', 'likert5', NULL, NULL),
  ('I try to review thesis papers and internship hunt in my dorm study space to achieve thesis papers and internship hunt.', 'likert5', NULL, NULL),
  ('I feel comfortable to review research lab projects when handling daily schedules.', 'likert5', NULL, NULL),
  ('When working with my university campus peers, I focus on coordinateing critical parameters.', 'likert5', NULL, NULL),
  ('I try to review critical parameters during research blocks to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I prefer to review my routine plans during working with my university campus peers.', 'likert5', NULL, NULL),
  ('I try to review research lab projects during research blocks to achieve research lab projects.', 'likert5', NULL, NULL),
  ('I regularly manage my routine plans during research blocks.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on tracking research lab projects.', 'likert5', NULL, NULL),
  ('I try to evaluate my routine plans in my dorm study space to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage research lab projects when facing GPA scores adjustments.', 'likert5', NULL, NULL),
  ('I try to track critical parameters at campus placement drives to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I prefer to coordinate research lab projects during handling daily schedules.', 'likert5', NULL, NULL),
  ('I regularly coordinate critical parameters at campus placement drives.', 'likert5', NULL, NULL),
  ('When working with my university campus peers, I focus on manageing group outcomes.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate my routine plans when facing GPA scores adjustments.', 'likert5', NULL, NULL),
  ('I find it easy to track thesis papers and internship hunt in university seminars.', 'likert5', NULL, NULL),
  ('I prefer to track critical parameters during working with my university campus peers.', 'likert5', NULL, NULL),
  ('I prefer to manage my routine plans during handling daily schedules.', 'likert5', NULL, NULL),
  ('I prefer to handle group outcomes during facing GPA scores adjustments.', 'likert5', NULL, NULL),
  ('I try to examine thesis papers and internship hunt during internships to achieve thesis papers and internship hunt.', 'likert5', NULL, NULL),
  ('I regularly coordinate group outcomes in my dorm study space.', 'likert5', NULL, NULL),
  ('I prefer to handle critical parameters during working with my university campus peers.', 'likert5', NULL, NULL),
  ('I try to track critical parameters in university seminars to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I try to coordinate my routine plans in university seminars to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I find it easy to review my routine plans during research blocks.', 'likert5', NULL, NULL),
  ('I find it easy to handle critical parameters during research blocks.', 'likert5', NULL, NULL),
  ('I regularly review critical parameters in my dorm study space.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on tracking group outcomes.', 'likert5', NULL, NULL),
  ('I find it easy to handle thesis papers and internship hunt in my dorm study space.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate research lab projects at campus placement drives.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate thesis papers and internship hunt during internships.', 'likert5', NULL, NULL),
  ('I regularly coordinate research lab projects at campus placement drives.', 'likert5', NULL, NULL),
  ('When working with my university campus peers, I focus on examineing research lab projects.', 'likert5', NULL, NULL),
  ('I try to manage research lab projects during internships to achieve research lab projects.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Facilitating Thought'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I use my positive emotions to generate creative project ideas.', 'likert5', NULL, NULL),
  ('I can shift my focus and mood to suit the task I must do.', 'likert5', NULL, NULL),
  ('I find that feeling calm helps me analyze complex data files.', 'likert5', NULL, NULL),
  ('I harness nervous energy to deliver dynamic project pitches.', 'likert5', NULL, NULL),
  ('I let my personal values guide my choices regarding thesis papers and internship hunt.', 'likert5', NULL, NULL),
  ('I try to manage thesis papers and internship hunt during research blocks to achieve thesis papers and internship hunt.', 'likert5', NULL, NULL),
  ('I try to examine research lab projects during research blocks to achieve research lab projects.', 'likert5', NULL, NULL),
  ('When working with my university campus peers, I focus on evaluateing group outcomes.', 'likert5', NULL, NULL),
  ('I try to examine critical parameters in university seminars to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I find it easy to examine thesis papers and internship hunt during internships.', 'likert5', NULL, NULL),
  ('When working with my university campus peers, I focus on tracking my routine plans.', 'likert5', NULL, NULL),
  ('I prefer to manage group outcomes during facing GPA scores adjustments.', 'likert5', NULL, NULL),
  ('I try to handle research lab projects at campus placement drives to achieve research lab projects.', 'likert5', NULL, NULL),
  ('I find it easy to track group outcomes during internships.', 'likert5', NULL, NULL),
  ('I prefer to manage group outcomes during handling daily schedules.', 'likert5', NULL, NULL),
  ('I prefer to evaluate group outcomes during working with my university campus peers.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine research lab projects when facing GPA scores adjustments.', 'likert5', NULL, NULL),
  ('I prefer to track thesis papers and internship hunt during facing GPA scores adjustments.', 'likert5', NULL, NULL),
  ('I try to review group outcomes during research blocks to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I regularly evaluate critical parameters in my dorm study space.', 'likert5', NULL, NULL),
  ('I try to review research lab projects during research blocks to achieve research lab projects.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate research lab projects in my dorm study space.', 'likert5', NULL, NULL),
  ('I prefer to review my routine plans during handling daily schedules.', 'likert5', NULL, NULL),
  ('I find it easy to review my routine plans during internships.', 'likert5', NULL, NULL),
  ('I regularly evaluate critical parameters during internships.', 'likert5', NULL, NULL),
  ('I find it easy to manage research lab projects in my dorm study space.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine group outcomes when working with my university campus peers.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage research lab projects when facing GPA scores adjustments.', 'likert5', NULL, NULL),
  ('I regularly review group outcomes at campus placement drives.', 'likert5', NULL, NULL),
  ('I prefer to examine my routine plans during working with my university campus peers.', 'likert5', NULL, NULL),
  ('I regularly handle research lab projects in my dorm study space.', 'likert5', NULL, NULL),
  ('I regularly evaluate thesis papers and internship hunt at campus placement drives.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate group outcomes during internships.', 'likert5', NULL, NULL),
  ('I regularly track group outcomes at campus placement drives.', 'likert5', NULL, NULL),
  ('I prefer to manage my routine plans during handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to review group outcomes in university seminars to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I regularly coordinate group outcomes in my dorm study space.', 'likert5', NULL, NULL),
  ('I find it easy to manage thesis papers and internship hunt during internships.', 'likert5', NULL, NULL),
  ('I try to handle thesis papers and internship hunt during research blocks to achieve thesis papers and internship hunt.', 'likert5', NULL, NULL),
  ('I feel comfortable to review research lab projects when working with my university campus peers.', 'likert5', NULL, NULL),
  ('I regularly examine my routine plans during research blocks.', 'likert5', NULL, NULL),
  ('When facing GPA scores adjustments, I focus on evaluateing research lab projects.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on reviewing group outcomes.', 'likert5', NULL, NULL),
  ('I feel comfortable to track thesis papers and internship hunt when facing GPA scores adjustments.', 'likert5', NULL, NULL),
  ('When working with my university campus peers, I focus on examineing research lab projects.', 'likert5', NULL, NULL),
  ('I try to review group outcomes during internships to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I regularly review research lab projects during research blocks.', 'likert5', NULL, NULL),
  ('I regularly track thesis papers and internship hunt in university seminars.', 'likert5', NULL, NULL),
  ('I try to review my routine plans at campus placement drives to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I try to examine group outcomes in my dorm study space to achieve group outcomes.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Understanding Emotions'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I understand how minor frustrations can escalate into anger.', 'likert5', NULL, NULL),
  ('I can explain why academic setbacks trigger feelings of anxiety.', 'likert5', NULL, NULL),
  ('I predict how my criticism will impact my university campus peers''s confidence.', 'likert5', NULL, NULL),
  ('I trace my emotional changes back to their environmental causes.', 'likert5', NULL, NULL),
  ('I recognize that feeling overwhelmed is a sign of needing rest.', 'likert5', NULL, NULL),
  ('I regularly examine thesis papers and internship hunt at campus placement drives.', 'likert5', NULL, NULL),
  ('I regularly handle research lab projects during research blocks.', 'likert5', NULL, NULL),
  ('I feel comfortable to track my routine plans when working with my university campus peers.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate my routine plans in my dorm study space.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on examineing thesis papers and internship hunt.', 'likert5', NULL, NULL),
  ('I find it easy to handle my routine plans in my dorm study space.', 'likert5', NULL, NULL),
  ('I prefer to evaluate thesis papers and internship hunt during working with my university campus peers.', 'likert5', NULL, NULL),
  ('I find it easy to handle thesis papers and internship hunt in university seminars.', 'likert5', NULL, NULL),
  ('I try to review critical parameters during research blocks to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I try to manage thesis papers and internship hunt in university seminars to achieve thesis papers and internship hunt.', 'likert5', NULL, NULL),
  ('I regularly examine research lab projects in university seminars.', 'likert5', NULL, NULL),
  ('I prefer to examine critical parameters during working with my university campus peers.', 'likert5', NULL, NULL),
  ('I try to track research lab projects in my dorm study space to achieve research lab projects.', 'likert5', NULL, NULL),
  ('I find it easy to track my routine plans at campus placement drives.', 'likert5', NULL, NULL),
  ('I try to examine research lab projects during internships to achieve research lab projects.', 'likert5', NULL, NULL),
  ('I feel comfortable to review group outcomes when handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to track critical parameters during research blocks to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I regularly evaluate thesis papers and internship hunt in my dorm study space.', 'likert5', NULL, NULL),
  ('I regularly handle thesis papers and internship hunt in university seminars.', 'likert5', NULL, NULL),
  ('When facing GPA scores adjustments, I focus on reviewing research lab projects.', 'likert5', NULL, NULL),
  ('I regularly track research lab projects in university seminars.', 'likert5', NULL, NULL),
  ('I prefer to handle critical parameters during handling daily schedules.', 'likert5', NULL, NULL),
  ('I prefer to manage my routine plans during handling daily schedules.', 'likert5', NULL, NULL),
  ('When facing GPA scores adjustments, I focus on coordinateing my routine plans.', 'likert5', NULL, NULL),
  ('I try to evaluate group outcomes in university seminars to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle critical parameters when handling daily schedules.', 'likert5', NULL, NULL),
  ('I find it easy to review research lab projects during research blocks.', 'likert5', NULL, NULL),
  ('I prefer to coordinate thesis papers and internship hunt during facing GPA scores adjustments.', 'likert5', NULL, NULL),
  ('I try to coordinate group outcomes in my dorm study space to achieve group outcomes.', 'likert5', NULL, NULL),
  ('When working with my university campus peers, I focus on manageing research lab projects.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine my routine plans when working with my university campus peers.', 'likert5', NULL, NULL),
  ('I feel comfortable to review research lab projects when working with my university campus peers.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine thesis papers and internship hunt when handling daily schedules.', 'likert5', NULL, NULL),
  ('I find it easy to manage critical parameters during research blocks.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate my routine plans at campus placement drives.', 'likert5', NULL, NULL),
  ('I find it easy to examine group outcomes in university seminars.', 'likert5', NULL, NULL),
  ('I prefer to manage critical parameters during handling daily schedules.', 'likert5', NULL, NULL),
  ('When working with my university campus peers, I focus on tracking critical parameters.', 'likert5', NULL, NULL),
  ('I prefer to handle my routine plans during working with my university campus peers.', 'likert5', NULL, NULL),
  ('I prefer to examine research lab projects during facing GPA scores adjustments.', 'likert5', NULL, NULL),
  ('I try to review thesis papers and internship hunt during research blocks to achieve thesis papers and internship hunt.', 'likert5', NULL, NULL),
  ('I regularly coordinate research lab projects at campus placement drives.', 'likert5', NULL, NULL),
  ('I try to examine my routine plans in university seminars to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I find it easy to examine thesis papers and internship hunt in my dorm study space.', 'likert5', NULL, NULL),
  ('I regularly coordinate group outcomes during internships.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Managing Emotions'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'graduate_readiness' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I manage my frustration when research or work steps go wrong.', 'likert5', NULL, NULL),
  ('I stay calm and lead the group during a project crisis.', 'likert5', NULL, NULL),
  ('I help my university campus peers regulate their stress levels before tests.', 'likert5', NULL, NULL),
  ('I can separate my feelings from the facts to think clearly.', 'likert5', NULL, NULL),
  ('I handle constructive criticisms without getting defensive.', 'likert5', NULL, NULL),
  ('I regularly examine thesis papers and internship hunt at campus placement drives.', 'likert5', NULL, NULL),
  ('I regularly track thesis papers and internship hunt at campus placement drives.', 'likert5', NULL, NULL),
  ('I prefer to track my routine plans during handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to review research lab projects at campus placement drives to achieve research lab projects.', 'likert5', NULL, NULL),
  ('I regularly review research lab projects during internships.', 'likert5', NULL, NULL),
  ('I try to examine critical parameters in university seminars to achieve critical parameters.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on coordinateing my routine plans.', 'likert5', NULL, NULL),
  ('When facing GPA scores adjustments, I focus on manageing group outcomes.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on manageing my routine plans.', 'likert5', NULL, NULL),
  ('I feel comfortable to review thesis papers and internship hunt when working with my university campus peers.', 'likert5', NULL, NULL),
  ('I feel comfortable to review research lab projects when handling daily schedules.', 'likert5', NULL, NULL),
  ('I prefer to manage thesis papers and internship hunt during facing GPA scores adjustments.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate research lab projects in my dorm study space.', 'likert5', NULL, NULL),
  ('I prefer to track thesis papers and internship hunt during facing GPA scores adjustments.', 'likert5', NULL, NULL),
  ('I regularly evaluate group outcomes in my dorm study space.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle research lab projects when handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to review critical parameters during research blocks to achieve critical parameters.', 'likert5', NULL, NULL),
  ('When working with my university campus peers, I focus on manageing critical parameters.', 'likert5', NULL, NULL),
  ('I regularly coordinate my routine plans in my dorm study space.', 'likert5', NULL, NULL),
  ('I try to evaluate research lab projects in my dorm study space to achieve research lab projects.', 'likert5', NULL, NULL),
  ('I prefer to examine critical parameters during working with my university campus peers.', 'likert5', NULL, NULL),
  ('I prefer to examine thesis papers and internship hunt during working with my university campus peers.', 'likert5', NULL, NULL),
  ('I find it easy to manage group outcomes in university seminars.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage my routine plans when handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle group outcomes when handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle thesis papers and internship hunt when facing GPA scores adjustments.', 'likert5', NULL, NULL),
  ('I find it easy to manage research lab projects during internships.', 'likert5', NULL, NULL),
  ('I prefer to track critical parameters during working with my university campus peers.', 'likert5', NULL, NULL),
  ('I find it easy to review thesis papers and internship hunt in university seminars.', 'likert5', NULL, NULL),
  ('I find it easy to track research lab projects in university seminars.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate research lab projects during research blocks.', 'likert5', NULL, NULL),
  ('I prefer to evaluate my routine plans during working with my university campus peers.', 'likert5', NULL, NULL),
  ('I feel comfortable to review research lab projects when working with my university campus peers.', 'likert5', NULL, NULL),
  ('I regularly evaluate research lab projects in my dorm study space.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate thesis papers and internship hunt in university seminars.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate my routine plans at campus placement drives.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate research lab projects at campus placement drives.', 'likert5', NULL, NULL),
  ('I try to coordinate thesis papers and internship hunt in my dorm study space to achieve thesis papers and internship hunt.', 'likert5', NULL, NULL),
  ('I regularly review research lab projects during research blocks.', 'likert5', NULL, NULL),
  ('I try to review group outcomes during internships to achieve group outcomes.', 'likert5', NULL, NULL),
  ('When working with my university campus peers, I focus on evaluateing my routine plans.', 'likert5', NULL, NULL),
  ('I prefer to review thesis papers and internship hunt during working with my university campus peers.', 'likert5', NULL, NULL),
  ('I feel comfortable to track my routine plans when facing GPA scores adjustments.', 'likert5', NULL, NULL),
  ('When working with my university campus peers, I focus on coordinateing thesis papers and internship hunt.', 'likert5', NULL, NULL),
  ('I try to coordinate critical parameters during research blocks to achieve critical parameters.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Self-Awareness'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I can tell when I am starting to feel angry or upset.', 'likert5', NULL, NULL),
  ('I know what activities make me feel excited or happy.', 'likert5', NULL, NULL),
  ('I can explain my feelings clearly using descriptive words.', 'likert5', NULL, NULL),
  ('I notice how my body reacts, like my chest tightening, under stress.', 'likert5', NULL, NULL),
  ('I understand how my mood affects how I treat my work teammates.', 'likert5', NULL, NULL),
  ('I feel comfortable to review assigned daily tickets when handling daily schedules.', 'likert5', NULL, NULL),
  ('When facing performance reviews adjustments, I focus on evaluateing group outcomes.', 'likert5', NULL, NULL),
  ('I try to manage onboarding and entry-level projects at my office desk to achieve onboarding and entry-level projects.', 'likert5', NULL, NULL),
  ('I regularly evaluate group outcomes in team sprint meetings.', 'likert5', NULL, NULL),
  ('I try to track assigned daily tickets at my office desk to achieve assigned daily tickets.', 'likert5', NULL, NULL),
  ('I try to examine group outcomes during client calls to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I regularly examine assigned daily tickets in corporate training sessions.', 'likert5', NULL, NULL),
  ('I regularly coordinate my routine plans at my office desk.', 'likert5', NULL, NULL),
  ('I find it easy to review critical parameters at my office desk.', 'likert5', NULL, NULL),
  ('I find it easy to handle onboarding and entry-level projects at my office desk.', 'likert5', NULL, NULL),
  ('I find it easy to handle critical parameters at my office desk.', 'likert5', NULL, NULL),
  ('I regularly track critical parameters during client calls.', 'likert5', NULL, NULL),
  ('I prefer to coordinate group outcomes during facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('I try to handle assigned daily tickets during project check-ins to achieve assigned daily tickets.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on tracking critical parameters.', 'likert5', NULL, NULL),
  ('I prefer to manage assigned daily tickets during working with my work teammates.', 'likert5', NULL, NULL),
  ('I regularly examine critical parameters in team sprint meetings.', 'likert5', NULL, NULL),
  ('When facing performance reviews adjustments, I focus on coordinateing assigned daily tickets.', 'likert5', NULL, NULL),
  ('When working with my work teammates, I focus on reviewing onboarding and entry-level projects.', 'likert5', NULL, NULL),
  ('I prefer to manage my routine plans during handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate group outcomes when facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate critical parameters in team sprint meetings.', 'likert5', NULL, NULL),
  ('I prefer to review critical parameters during facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('I try to track onboarding and entry-level projects during project check-ins to achieve onboarding and entry-level projects.', 'likert5', NULL, NULL),
  ('I try to track assigned daily tickets during project check-ins to achieve assigned daily tickets.', 'likert5', NULL, NULL),
  ('I regularly track my routine plans during project check-ins.', 'likert5', NULL, NULL),
  ('I try to coordinate critical parameters during client calls to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle onboarding and entry-level projects when working with my work teammates.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Awareness of Others'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I notice when a coworker is feeling overwhelmed by their workload.', 'likert5', NULL, NULL),
  ('I pay attention to the body language of my team members.', 'likert5', NULL, NULL),
  ('I listen actively to my colleagues without interrupting.', 'likert5', NULL, NULL),
  ('I show empathy for the personal challenges of my peers.', 'likert5', NULL, NULL),
  ('I validate the feelings of colleagues who are stressed.', 'likert5', NULL, NULL),
  ('When working with my work teammates, I focus on tracking my routine plans.', 'likert5', NULL, NULL),
  ('I regularly coordinate critical parameters in corporate training sessions.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on handleing my routine plans.', 'likert5', NULL, NULL),
  ('I prefer to evaluate my routine plans during working with my work teammates.', 'likert5', NULL, NULL),
  ('I prefer to track assigned daily tickets during facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate group outcomes at my office desk.', 'likert5', NULL, NULL),
  ('I feel comfortable to review group outcomes when handling daily schedules.', 'likert5', NULL, NULL),
  ('I regularly examine my routine plans in corporate training sessions.', 'likert5', NULL, NULL),
  ('When working with my work teammates, I focus on reviewing my routine plans.', 'likert5', NULL, NULL),
  ('When facing performance reviews adjustments, I focus on examineing critical parameters.', 'likert5', NULL, NULL),
  ('I regularly coordinate onboarding and entry-level projects during client calls.', 'likert5', NULL, NULL),
  ('I try to handle onboarding and entry-level projects in team sprint meetings to achieve onboarding and entry-level projects.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on handleing group outcomes.', 'likert5', NULL, NULL),
  ('I find it easy to examine critical parameters at my office desk.', 'likert5', NULL, NULL),
  ('I find it easy to manage my routine plans during client calls.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate group outcomes when facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('I try to coordinate onboarding and entry-level projects at my office desk to achieve onboarding and entry-level projects.', 'likert5', NULL, NULL),
  ('I feel comfortable to track my routine plans when facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on reviewing assigned daily tickets.', 'likert5', NULL, NULL),
  ('I feel comfortable to review group outcomes when facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('I try to track group outcomes during client calls to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I prefer to evaluate critical parameters during working with my work teammates.', 'likert5', NULL, NULL),
  ('When facing performance reviews adjustments, I focus on evaluateing assigned daily tickets.', 'likert5', NULL, NULL),
  ('I regularly track my routine plans at my office desk.', 'likert5', NULL, NULL),
  ('I regularly track critical parameters at my office desk.', 'likert5', NULL, NULL),
  ('When working with my work teammates, I focus on tracking onboarding and entry-level projects.', 'likert5', NULL, NULL),
  ('I try to review onboarding and entry-level projects in team sprint meetings to achieve onboarding and entry-level projects.', 'likert5', NULL, NULL),
  ('I regularly manage my routine plans during project check-ins.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Authenticity'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I express my professional opinions honestly and politely.', 'likert5', NULL, NULL),
  ('I feel comfortable admitting to my team when I make mistakes.', 'likert5', NULL, NULL),
  ('I align my workplace behaviors with my personal values.', 'likert5', NULL, NULL),
  ('I communicate my work limits clearly to my reporting managers or supervisors.', 'likert5', NULL, NULL),
  ('I represent my project status accurately without inflation.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on reviewing my routine plans.', 'likert5', NULL, NULL),
  ('I find it easy to examine critical parameters in corporate training sessions.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on examineing my routine plans.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage onboarding and entry-level projects when facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine group outcomes when handling daily schedules.', 'likert5', NULL, NULL),
  ('When working with my work teammates, I focus on examineing assigned daily tickets.', 'likert5', NULL, NULL),
  ('I regularly manage critical parameters in corporate training sessions.', 'likert5', NULL, NULL),
  ('When facing performance reviews adjustments, I focus on reviewing critical parameters.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate my routine plans in corporate training sessions.', 'likert5', NULL, NULL),
  ('I find it easy to track onboarding and entry-level projects during project check-ins.', 'likert5', NULL, NULL),
  ('When facing performance reviews adjustments, I focus on reviewing my routine plans.', 'likert5', NULL, NULL),
  ('I regularly manage group outcomes in corporate training sessions.', 'likert5', NULL, NULL),
  ('I regularly evaluate my routine plans in corporate training sessions.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate critical parameters when working with my work teammates.', 'likert5', NULL, NULL),
  ('I prefer to handle my routine plans during working with my work teammates.', 'likert5', NULL, NULL),
  ('I find it easy to manage assigned daily tickets in team sprint meetings.', 'likert5', NULL, NULL),
  ('I prefer to manage assigned daily tickets during facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('I prefer to handle onboarding and entry-level projects during handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine my routine plans when facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage assigned daily tickets when handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle my routine plans when handling daily schedules.', 'likert5', NULL, NULL),
  ('I prefer to coordinate assigned daily tickets during working with my work teammates.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate assigned daily tickets when working with my work teammates.', 'likert5', NULL, NULL),
  ('I prefer to coordinate my routine plans during facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('I regularly track group outcomes during project check-ins.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate assigned daily tickets during project check-ins.', 'likert5', NULL, NULL),
  ('I prefer to handle critical parameters during working with my work teammates.', 'likert5', NULL, NULL),
  ('I feel comfortable to review assigned daily tickets when working with my work teammates.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Emotional Reasoning'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I consider team morale when proposing workflow updates.', 'likert5', NULL, NULL),
  ('I balance logical facts with team feelings to make choices.', 'likert5', NULL, NULL),
  ('I gather input from colleagues before deciding on strategy.', 'likert5', NULL, NULL),
  ('I assess how client concerns affect our delivery plans.', 'likert5', NULL, NULL),
  ('I involve coworkers in brainstorming to ensure commitment.', 'likert5', NULL, NULL),
  ('I try to evaluate onboarding and entry-level projects in team sprint meetings to achieve onboarding and entry-level projects.', 'likert5', NULL, NULL),
  ('I try to review my routine plans in corporate training sessions to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate critical parameters in corporate training sessions.', 'likert5', NULL, NULL),
  ('I prefer to examine critical parameters during facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('I regularly examine assigned daily tickets during project check-ins.', 'likert5', NULL, NULL),
  ('I prefer to review my routine plans during facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('I try to evaluate my routine plans in team sprint meetings to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I try to examine onboarding and entry-level projects in team sprint meetings to achieve onboarding and entry-level projects.', 'likert5', NULL, NULL),
  ('I prefer to examine group outcomes during working with my work teammates.', 'likert5', NULL, NULL),
  ('I try to handle onboarding and entry-level projects during client calls to achieve onboarding and entry-level projects.', 'likert5', NULL, NULL),
  ('When facing performance reviews adjustments, I focus on examineing critical parameters.', 'likert5', NULL, NULL),
  ('I regularly evaluate group outcomes at my office desk.', 'likert5', NULL, NULL),
  ('When working with my work teammates, I focus on evaluateing my routine plans.', 'likert5', NULL, NULL),
  ('I feel comfortable to track critical parameters when handling daily schedules.', 'likert5', NULL, NULL),
  ('I find it easy to review onboarding and entry-level projects at my office desk.', 'likert5', NULL, NULL),
  ('I regularly track group outcomes in corporate training sessions.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate critical parameters when handling daily schedules.', 'likert5', NULL, NULL),
  ('I prefer to review my routine plans during working with my work teammates.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate assigned daily tickets at my office desk.', 'likert5', NULL, NULL),
  ('I try to handle my routine plans at my office desk to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I find it easy to handle assigned daily tickets during client calls.', 'likert5', NULL, NULL),
  ('I find it easy to examine assigned daily tickets at my office desk.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate my routine plans at my office desk.', 'likert5', NULL, NULL),
  ('When facing performance reviews adjustments, I focus on evaluateing assigned daily tickets.', 'likert5', NULL, NULL),
  ('I try to evaluate assigned daily tickets during project check-ins to achieve assigned daily tickets.', 'likert5', NULL, NULL),
  ('When working with my work teammates, I focus on reviewing group outcomes.', 'likert5', NULL, NULL),
  ('I find it easy to examine onboarding and entry-level projects during client calls.', 'likert5', NULL, NULL),
  ('I try to coordinate onboarding and entry-level projects in team sprint meetings to achieve onboarding and entry-level projects.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Self-Management'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I can calm myself down when I feel frustrated in the office environment.', 'likert5', NULL, NULL),
  ('I think before I react when I am angry with a peer.', 'likert5', NULL, NULL),
  ('I can stay focused on my studies even when distractions exist.', 'likert5', NULL, NULL),
  ('I handle unexpected setbacks without losing my temper.', 'likert5', NULL, NULL),
  ('I bounce back quickly after receiving disappointing performance reviews.', 'likert5', NULL, NULL),
  ('I prefer to manage onboarding and entry-level projects during working with my work teammates.', 'likert5', NULL, NULL),
  ('I regularly handle onboarding and entry-level projects during project check-ins.', 'likert5', NULL, NULL),
  ('I find it easy to handle group outcomes in team sprint meetings.', 'likert5', NULL, NULL),
  ('I regularly examine assigned daily tickets in corporate training sessions.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on manageing my routine plans.', 'likert5', NULL, NULL),
  ('I try to track critical parameters during project check-ins to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I try to evaluate group outcomes during project check-ins to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I regularly manage critical parameters in corporate training sessions.', 'likert5', NULL, NULL),
  ('I find it easy to track onboarding and entry-level projects at my office desk.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on handleing assigned daily tickets.', 'likert5', NULL, NULL),
  ('I feel comfortable to track assigned daily tickets when working with my work teammates.', 'likert5', NULL, NULL),
  ('When facing performance reviews adjustments, I focus on tracking onboarding and entry-level projects.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on tracking critical parameters.', 'likert5', NULL, NULL),
  ('I try to handle assigned daily tickets in team sprint meetings to achieve assigned daily tickets.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage my routine plans when handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine onboarding and entry-level projects when facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('When facing performance reviews adjustments, I focus on examineing group outcomes.', 'likert5', NULL, NULL),
  ('I prefer to track critical parameters during working with my work teammates.', 'likert5', NULL, NULL),
  ('I try to evaluate critical parameters at my office desk to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate assigned daily tickets when working with my work teammates.', 'likert5', NULL, NULL),
  ('I feel comfortable to review assigned daily tickets when working with my work teammates.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine onboarding and entry-level projects when working with my work teammates.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on reviewing critical parameters.', 'likert5', NULL, NULL),
  ('I try to evaluate assigned daily tickets at my office desk to achieve assigned daily tickets.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on reviewing group outcomes.', 'likert5', NULL, NULL),
  ('I regularly track group outcomes at my office desk.', 'likert5', NULL, NULL),
  ('When facing performance reviews adjustments, I focus on coordinateing critical parameters.', 'likert5', NULL, NULL),
  ('I find it easy to track group outcomes during project check-ins.', 'likert5', NULL, NULL),
  ('I feel comfortable to review critical parameters when handling daily schedules.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Positive Influence'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I help my colleagues resolve conflicts through dialogue.', 'likert5', NULL, NULL),
  ('I provide verbal encouragement to stressed team members.', 'likert5', NULL, NULL),
  ('I create a positive, collaborative mood in my workspace.', 'likert5', NULL, NULL),
  ('I celebrate team wins and individual achievements.', 'likert5', NULL, NULL),
  ('I help teammates stay focused during organizational changes.', 'likert5', NULL, NULL),
  ('I prefer to handle assigned daily tickets during facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('I prefer to track group outcomes during facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('I try to coordinate onboarding and entry-level projects during project check-ins to achieve onboarding and entry-level projects.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate onboarding and entry-level projects when handling daily schedules.', 'likert5', NULL, NULL),
  ('When working with my work teammates, I focus on tracking group outcomes.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage assigned daily tickets when working with my work teammates.', 'likert5', NULL, NULL),
  ('I feel comfortable to track onboarding and entry-level projects when handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to handle onboarding and entry-level projects in corporate training sessions to achieve onboarding and entry-level projects.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on manageing assigned daily tickets.', 'likert5', NULL, NULL),
  ('I find it easy to review onboarding and entry-level projects in corporate training sessions.', 'likert5', NULL, NULL),
  ('When facing performance reviews adjustments, I focus on handleing group outcomes.', 'likert5', NULL, NULL),
  ('I regularly examine my routine plans in team sprint meetings.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on evaluateing critical parameters.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate group outcomes when handling daily schedules.', 'likert5', NULL, NULL),
  ('I find it easy to review onboarding and entry-level projects during project check-ins.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage critical parameters when handling daily schedules.', 'likert5', NULL, NULL),
  ('I prefer to examine assigned daily tickets during facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine onboarding and entry-level projects when facing performance reviews adjustments.', 'likert5', NULL, NULL),
  ('I find it easy to review critical parameters during client calls.', 'likert5', NULL, NULL),
  ('I find it easy to manage group outcomes during project check-ins.', 'likert5', NULL, NULL),
  ('I find it easy to handle assigned daily tickets at my office desk.', 'likert5', NULL, NULL),
  ('When facing performance reviews adjustments, I focus on handleing critical parameters.', 'likert5', NULL, NULL),
  ('I find it easy to manage assigned daily tickets in corporate training sessions.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate assigned daily tickets when working with my work teammates.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine onboarding and entry-level projects when working with my work teammates.', 'likert5', NULL, NULL),
  ('I prefer to coordinate onboarding and entry-level projects during working with my work teammates.', 'likert5', NULL, NULL),
  ('When working with my work teammates, I focus on manageing critical parameters.', 'likert5', NULL, NULL),
  ('I try to evaluate onboarding and entry-level projects in corporate training sessions to achieve onboarding and entry-level projects.', 'likert5', NULL, NULL),
  ('I regularly evaluate critical parameters during project check-ins.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Self-Perception'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I have a clear understanding of my leadership strengths.', 'likert5', NULL, NULL),
  ('I feel confident in my ability to guide division strategies.', 'likert5', NULL, NULL),
  ('I regularly reflect on my professional self-worth and impact.', 'likert5', NULL, NULL),
  ('I accept my professional limitations and work to improve.', 'likert5', NULL, NULL),
  ('I feel self-directed in my executive decision-making.', 'likert5', NULL, NULL),
  ('I prefer to evaluate strategic decisions and division budgets during facing company metrics adjustments.', 'likert5', NULL, NULL),
  ('I regularly examine organizational restructuring in corporate audits.', 'likert5', NULL, NULL),
  ('I prefer to handle organizational restructuring during handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage group outcomes when facing company metrics adjustments.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on examineing my routine plans.', 'likert5', NULL, NULL),
  ('I find it easy to manage organizational restructuring in executive coaching sessions.', 'likert5', NULL, NULL),
  ('I regularly handle group outcomes in corporate audits.', 'likert5', NULL, NULL),
  ('I find it easy to track group outcomes in corporate audits.', 'likert5', NULL, NULL),
  ('I try to evaluate my routine plans during divisional restructures to achieve my routine plans.', 'likert5', NULL, NULL),
  ('When working with my division directors and colleagues, I focus on coordinateing critical parameters.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate organizational restructuring at board meetings.', 'likert5', NULL, NULL),
  ('I regularly track critical parameters during strategic planning.', 'likert5', NULL, NULL),
  ('When working with my division directors and colleagues, I focus on reviewing strategic decisions and division budgets.', 'likert5', NULL, NULL),
  ('I find it easy to examine organizational restructuring during strategic planning.', 'likert5', NULL, NULL),
  ('I regularly evaluate organizational restructuring in corporate audits.', 'likert5', NULL, NULL),
  ('I find it easy to track strategic decisions and division budgets in corporate audits.', 'likert5', NULL, NULL),
  ('I try to coordinate strategic decisions and division budgets during divisional restructures to achieve strategic decisions and division budgets.', 'likert5', NULL, NULL),
  ('I regularly track critical parameters in corporate audits.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on evaluateing organizational restructuring.', 'likert5', NULL, NULL),
  ('I prefer to handle strategic decisions and division budgets during handling daily schedules.', 'likert5', NULL, NULL),
  ('I prefer to evaluate strategic decisions and division budgets during working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I prefer to manage critical parameters during facing company metrics adjustments.', 'likert5', NULL, NULL),
  ('I try to manage strategic decisions and division budgets during divisional restructures to achieve strategic decisions and division budgets.', 'likert5', NULL, NULL),
  ('I regularly manage critical parameters during divisional restructures.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on tracking strategic decisions and division budgets.', 'likert5', NULL, NULL),
  ('I feel comfortable to review strategic decisions and division budgets when handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to review my routine plans when working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I regularly track strategic decisions and division budgets at board meetings.', 'likert5', NULL, NULL),
  ('I prefer to review my routine plans during working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I prefer to evaluate strategic decisions and division budgets during handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to track strategic decisions and division budgets when facing company metrics adjustments.', 'likert5', NULL, NULL),
  ('I feel comfortable to track my routine plans when working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I regularly evaluate critical parameters in executive coaching sessions.', 'likert5', NULL, NULL),
  ('When working with my division directors and colleagues, I focus on tracking organizational restructuring.', 'likert5', NULL, NULL),
  ('I find it easy to manage group outcomes in executive coaching sessions.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Self-Expression'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I express my executive decisions clearly and confidently.', 'likert5', NULL, NULL),
  ('I advocate for my division''s needs in board meetings.', 'likert5', NULL, NULL),
  ('I state my ethical concerns directly to senior executives.', 'likert5', NULL, NULL),
  ('I express appreciation to my team in an authentic way.', 'likert5', NULL, NULL),
  ('I defend my strategic proposals when they are challenged.', 'likert5', NULL, NULL),
  ('I try to evaluate organizational restructuring during divisional restructures to achieve organizational restructuring.', 'likert5', NULL, NULL),
  ('I try to handle critical parameters at board meetings to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I prefer to handle critical parameters during working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I prefer to manage my routine plans during working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I try to manage strategic decisions and division budgets in executive coaching sessions to achieve strategic decisions and division budgets.', 'likert5', NULL, NULL),
  ('I prefer to coordinate strategic decisions and division budgets during working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('When working with my division directors and colleagues, I focus on coordinateing strategic decisions and division budgets.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate organizational restructuring when handling daily schedules.', 'likert5', NULL, NULL),
  ('I regularly handle critical parameters during strategic planning.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on examineing strategic decisions and division budgets.', 'likert5', NULL, NULL),
  ('I try to review critical parameters in executive coaching sessions to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I try to track my routine plans during divisional restructures to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I regularly review group outcomes at board meetings.', 'likert5', NULL, NULL),
  ('I regularly handle strategic decisions and division budgets in corporate audits.', 'likert5', NULL, NULL),
  ('I find it easy to review group outcomes at board meetings.', 'likert5', NULL, NULL),
  ('I prefer to coordinate my routine plans during handling daily schedules.', 'likert5', NULL, NULL),
  ('I find it easy to examine my routine plans during strategic planning.', 'likert5', NULL, NULL),
  ('When facing company metrics adjustments, I focus on reviewing critical parameters.', 'likert5', NULL, NULL),
  ('I try to examine organizational restructuring during divisional restructures to achieve organizational restructuring.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on coordinateing strategic decisions and division budgets.', 'likert5', NULL, NULL),
  ('I find it easy to handle critical parameters during strategic planning.', 'likert5', NULL, NULL),
  ('I find it easy to review organizational restructuring in corporate audits.', 'likert5', NULL, NULL),
  ('I prefer to review my routine plans during working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I prefer to coordinate critical parameters during facing company metrics adjustments.', 'likert5', NULL, NULL),
  ('I prefer to track group outcomes during working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('When working with my division directors and colleagues, I focus on evaluateing my routine plans.', 'likert5', NULL, NULL),
  ('I find it easy to manage critical parameters at board meetings.', 'likert5', NULL, NULL),
  ('I try to manage organizational restructuring in executive coaching sessions to achieve organizational restructuring.', 'likert5', NULL, NULL),
  ('I find it easy to track my routine plans in executive coaching sessions.', 'likert5', NULL, NULL),
  ('When working with my division directors and colleagues, I focus on tracking organizational restructuring.', 'likert5', NULL, NULL),
  ('I find it easy to handle group outcomes during divisional restructures.', 'likert5', NULL, NULL),
  ('I find it easy to examine group outcomes in executive coaching sessions.', 'likert5', NULL, NULL),
  ('I try to review my routine plans at board meetings to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I prefer to manage group outcomes during working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I try to track strategic decisions and division budgets in corporate audits to achieve strategic decisions and division budgets.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Interpersonal'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I build supportive, long-term friendships with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I listen to other points of view during class debates.', 'likert5', NULL, NULL),
  ('I enjoy helping my division directors and colleagues with difficult assignments.', 'likert5', NULL, NULL),
  ('I coordinate easily with diverse study circles on projects.', 'likert5', NULL, NULL),
  ('I communicate my ideas in a warm, welcoming manner.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on reviewing my routine plans.', 'likert5', NULL, NULL),
  ('I regularly examine organizational restructuring in executive coaching sessions.', 'likert5', NULL, NULL),
  ('When working with my division directors and colleagues, I focus on examineing my routine plans.', 'likert5', NULL, NULL),
  ('When working with my division directors and colleagues, I focus on handleing group outcomes.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on evaluateing my routine plans.', 'likert5', NULL, NULL),
  ('I regularly track organizational restructuring at board meetings.', 'likert5', NULL, NULL),
  ('I try to track strategic decisions and division budgets during divisional restructures to achieve strategic decisions and division budgets.', 'likert5', NULL, NULL),
  ('I regularly coordinate critical parameters during divisional restructures.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate group outcomes when handling daily schedules.', 'likert5', NULL, NULL),
  ('I regularly review organizational restructuring during strategic planning.', 'likert5', NULL, NULL),
  ('I try to manage critical parameters in executive coaching sessions to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I feel comfortable to handle strategic decisions and division budgets when working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('When working with my division directors and colleagues, I focus on manageing critical parameters.', 'likert5', NULL, NULL),
  ('I prefer to track strategic decisions and division budgets during handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate critical parameters when working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I regularly manage critical parameters in corporate audits.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate critical parameters when working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I find it easy to evaluate critical parameters at board meetings.', 'likert5', NULL, NULL),
  ('I prefer to handle strategic decisions and division budgets during facing company metrics adjustments.', 'likert5', NULL, NULL),
  ('I try to handle organizational restructuring at board meetings to achieve organizational restructuring.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage critical parameters when facing company metrics adjustments.', 'likert5', NULL, NULL),
  ('I feel comfortable to track critical parameters when handling daily schedules.', 'likert5', NULL, NULL),
  ('I regularly evaluate organizational restructuring at board meetings.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on handleing group outcomes.', 'likert5', NULL, NULL),
  ('When facing company metrics adjustments, I focus on handleing critical parameters.', 'likert5', NULL, NULL),
  ('I find it easy to manage organizational restructuring in corporate audits.', 'likert5', NULL, NULL),
  ('I find it easy to review strategic decisions and division budgets in corporate audits.', 'likert5', NULL, NULL),
  ('I regularly evaluate strategic decisions and division budgets during strategic planning.', 'likert5', NULL, NULL),
  ('I regularly manage critical parameters during strategic planning.', 'likert5', NULL, NULL),
  ('I regularly evaluate group outcomes during divisional restructures.', 'likert5', NULL, NULL),
  ('I regularly examine my routine plans at board meetings.', 'likert5', NULL, NULL),
  ('I regularly review critical parameters during divisional restructures.', 'likert5', NULL, NULL),
  ('I find it easy to handle critical parameters in corporate audits.', 'likert5', NULL, NULL),
  ('I feel comfortable to evaluate my routine plans when facing company metrics adjustments.', 'likert5', NULL, NULL),
  ('I prefer to examine critical parameters during working with my division directors and colleagues.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Decision Making'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I remain objective and logical during business crises.', 'likert5', NULL, NULL),
  ('I solve systemic problems by analyzing their root causes.', 'likert5', NULL, NULL),
  ('I control my impulses to make hasty project changes.', 'likert5', NULL, NULL),
  ('I analyze all potential risks before launching a project.', 'likert5', NULL, NULL),
  ('I balance analytical statistics with team feedback.', 'likert5', NULL, NULL),
  ('I prefer to evaluate strategic decisions and division budgets during facing company metrics adjustments.', 'likert5', NULL, NULL),
  ('I feel comfortable to examine critical parameters when facing company metrics adjustments.', 'likert5', NULL, NULL),
  ('I regularly examine organizational restructuring in executive coaching sessions.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on handleing critical parameters.', 'likert5', NULL, NULL),
  ('I regularly handle critical parameters during strategic planning.', 'likert5', NULL, NULL),
  ('I try to coordinate critical parameters during strategic planning to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I regularly coordinate organizational restructuring during strategic planning.', 'likert5', NULL, NULL),
  ('I try to track my routine plans during divisional restructures to achieve my routine plans.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on evaluateing critical parameters.', 'likert5', NULL, NULL),
  ('I prefer to coordinate my routine plans during handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to examine organizational restructuring in executive coaching sessions to achieve organizational restructuring.', 'likert5', NULL, NULL),
  ('I find it easy to examine organizational restructuring in executive coaching sessions.', 'likert5', NULL, NULL),
  ('I try to handle organizational restructuring during strategic planning to achieve organizational restructuring.', 'likert5', NULL, NULL),
  ('When working with my division directors and colleagues, I focus on reviewing strategic decisions and division budgets.', 'likert5', NULL, NULL),
  ('I regularly review my routine plans during strategic planning.', 'likert5', NULL, NULL),
  ('I try to evaluate organizational restructuring at board meetings to achieve organizational restructuring.', 'likert5', NULL, NULL),
  ('I prefer to coordinate organizational restructuring during handling daily schedules.', 'likert5', NULL, NULL),
  ('I prefer to handle strategic decisions and division budgets during facing company metrics adjustments.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on reviewing strategic decisions and division budgets.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate group outcomes in executive coaching sessions.', 'likert5', NULL, NULL),
  ('I prefer to evaluate critical parameters during working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I feel comfortable to manage critical parameters when facing company metrics adjustments.', 'likert5', NULL, NULL),
  ('When facing company metrics adjustments, I focus on evaluateing critical parameters.', 'likert5', NULL, NULL),
  ('When working with my division directors and colleagues, I focus on evaluateing strategic decisions and division budgets.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on examineing organizational restructuring.', 'likert5', NULL, NULL),
  ('I try to handle organizational restructuring in executive coaching sessions to achieve organizational restructuring.', 'likert5', NULL, NULL),
  ('I prefer to evaluate strategic decisions and division budgets during handling daily schedules.', 'likert5', NULL, NULL),
  ('I regularly track my routine plans in executive coaching sessions.', 'likert5', NULL, NULL),
  ('I prefer to evaluate critical parameters during facing company metrics adjustments.', 'likert5', NULL, NULL),
  ('I try to manage group outcomes in executive coaching sessions to achieve group outcomes.', 'likert5', NULL, NULL),
  ('I prefer to examine organizational restructuring during working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I find it easy to track my routine plans in executive coaching sessions.', 'likert5', NULL, NULL),
  ('I prefer to coordinate group outcomes during working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I prefer to examine strategic decisions and division budgets during handling daily schedules.', 'likert5', NULL, NULL),
  ('When facing company metrics adjustments, I focus on manageing organizational restructuring.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Stress Management'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Emotional Intelligence'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I stay calm and focused when exam results or company metrics are out.', 'likert5', NULL, NULL),
  ('I organize my schedules to avoid last-minute panic.', 'likert5', NULL, NULL),
  ('I use relaxation methods to manage physical tension.', 'likert5', NULL, NULL),
  ('I control my temper when others disagree with my workflow.', 'likert5', NULL, NULL),
  ('I separate personal worries from my focus on strategic decisions and division budgets.', 'likert5', NULL, NULL),
  ('I try to handle organizational restructuring during divisional restructures to achieve organizational restructuring.', 'likert5', NULL, NULL),
  ('I regularly track group outcomes in corporate audits.', 'likert5', NULL, NULL),
  ('I prefer to examine group outcomes during working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I prefer to track strategic decisions and division budgets during facing company metrics adjustments.', 'likert5', NULL, NULL),
  ('I prefer to coordinate my routine plans during facing company metrics adjustments.', 'likert5', NULL, NULL),
  ('I prefer to examine group outcomes during handling daily schedules.', 'likert5', NULL, NULL),
  ('I find it easy to track critical parameters during divisional restructures.', 'likert5', NULL, NULL),
  ('I try to evaluate my routine plans in corporate audits to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I try to examine critical parameters at board meetings to achieve critical parameters.', 'likert5', NULL, NULL),
  ('I regularly review group outcomes during strategic planning.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate group outcomes in corporate audits.', 'likert5', NULL, NULL),
  ('When working with my division directors and colleagues, I focus on reviewing strategic decisions and division budgets.', 'likert5', NULL, NULL),
  ('I regularly evaluate organizational restructuring in executive coaching sessions.', 'likert5', NULL, NULL),
  ('I prefer to track strategic decisions and division budgets during working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I prefer to review my routine plans during handling daily schedules.', 'likert5', NULL, NULL),
  ('I feel comfortable to coordinate strategic decisions and division budgets when working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I feel comfortable to review critical parameters when working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I prefer to review organizational restructuring during handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to handle organizational restructuring at board meetings to achieve organizational restructuring.', 'likert5', NULL, NULL),
  ('I regularly manage my routine plans during divisional restructures.', 'likert5', NULL, NULL),
  ('I feel comfortable to review strategic decisions and division budgets when handling daily schedules.', 'likert5', NULL, NULL),
  ('When handling daily schedules, I focus on manageing organizational restructuring.', 'likert5', NULL, NULL),
  ('I regularly review my routine plans in executive coaching sessions.', 'likert5', NULL, NULL),
  ('I find it easy to coordinate strategic decisions and division budgets in corporate audits.', 'likert5', NULL, NULL),
  ('I prefer to manage critical parameters during working with my division directors and colleagues.', 'likert5', NULL, NULL),
  ('I regularly examine my routine plans in corporate audits.', 'likert5', NULL, NULL),
  ('I find it easy to review my routine plans during strategic planning.', 'likert5', NULL, NULL),
  ('I prefer to track organizational restructuring during handling daily schedules.', 'likert5', NULL, NULL),
  ('I try to track my routine plans during strategic planning to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I try to handle my routine plans during divisional restructures to achieve my routine plans.', 'likert5', NULL, NULL),
  ('I try to examine strategic decisions and division budgets during strategic planning to achieve strategic decisions and division budgets.', 'likert5', NULL, NULL),
  ('When facing company metrics adjustments, I focus on coordinateing organizational restructuring.', 'likert5', NULL, NULL),
  ('I regularly manage my routine plans in corporate audits.', 'likert5', NULL, NULL),
  ('I regularly review critical parameters during divisional restructures.', 'likert5', NULL, NULL),
  ('I regularly examine critical parameters in executive coaching sessions.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Altruism'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want a career where I can make a meaningful difference in society.', 'likert5', NULL, NULL),
  ('I feel motivated when I help classmates solve academic problems.', 'likert5', NULL, NULL),
  ('I prefer volunteer projects that benefit the local community.', 'likert5', NULL, NULL),
  ('I value careers in medicine, teaching, or charity work.', 'likert5', NULL, NULL),
  ('I feel successful when my efforts improve someone else''s well-being.', 'likert5', NULL, NULL),
  ('I want to spend my career protecting the environment or wildlife.', 'likert5', NULL, NULL),
  ('I enjoy participating in school-led social service activities.', 'likert5', NULL, NULL),
  ('I think helping others is more important than earning a high salary.', 'likert5', NULL, NULL),
  ('I want to design solutions for people with physical disabilities.', 'likert5', NULL, NULL),
  ('I enjoy volunteering at local shelters, clinics, or food drives.', 'likert5', NULL, NULL),
  ('I value working in a team where we focus on helping the public.', 'likert5', NULL, NULL),
  ('I feel proud when I stand up for someone who is being treated unfairly.', 'likert5', NULL, NULL),
  ('I want to write articles or stories that raise awareness of social issues.', 'likert5', NULL, NULL),
  ('I enjoy mentoring junior students who are struggling with school adjustment.', 'likert5', NULL, NULL),
  ('I prefer group assignments where the goal is to solve community problems.', 'likert5', NULL, NULL),
  ('I want to work for organizations that prioritize charity over profit.', 'likert5', NULL, NULL),
  ('I feel inspired when I read about historical figures who fought for human rights.', 'likert5', NULL, NULL),
  ('I want to build software or apps that help people connect and support each other.', 'likert5', NULL, NULL),
  ('I value campaigns that promote health, education, and safety in schools.', 'likert5', NULL, NULL),
  ('I feel fulfilled when I donate my pocket money or belongings to charity.', 'likert5', NULL, NULL),
  ('I want to work in public services, counseling, or social advocacy.', 'likert5', NULL, NULL),
  ('I enjoy sharing my knowledge and resources with classmates for free.', 'likert5', NULL, NULL),
  ('I want to choose a stream in high school that leads to helping professions.', 'likert5', NULL, NULL),
  ('I feel motivated when my class works together to clean the school campus.', 'likert5', NULL, NULL),
  ('I believe a job is only satisfying if it leaves the world a better place.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Creativity'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy coming up with original ideas for school projects.', 'likert5', NULL, NULL),
  ('I want a job where I can design, build, or write original content.', 'likert5', NULL, NULL),
  ('I feel bored when I have to follow repetitive routines at school.', 'likert5', NULL, NULL),
  ('I prefer artistic expression (drawing, music, writing) over memorizing facts.', 'likert5', NULL, NULL),
  ('I like to find unique solutions to mathematical or scientific problems.', 'likert5', NULL, NULL),
  ('I want to work in fields like advertising, media, design, or architecture.', 'likert5', NULL, NULL),
  ('I enjoy decorating presentations, reports, or school banners.', 'likert5', NULL, NULL),
  ('I value having the freedom to write essays on open-ended topics.', 'likert5', NULL, NULL),
  ('I like to experiment with coding to build my own games or websites.', 'likert5', NULL, NULL),
  ('I enjoy taking photos, editing videos, or creating graphic designs.', 'likert5', NULL, NULL),
  ('I want to invent new products or tools that solve daily challenges.', 'likert5', NULL, NULL),
  ('I feel motivated when I can express my personal style through my work.', 'likert5', NULL, NULL),
  ('I enjoy participating in creative writing, drama, or debate competitions.', 'likert5', NULL, NULL),
  ('I want to learn how to compose digital music or create animations.', 'likert5', NULL, NULL),
  ('I prefer working on projects that do not have a single correct answer.', 'likert5', NULL, NULL),
  ('I enjoy brainstorming wild ideas before filtering them for school projects.', 'likert5', NULL, NULL),
  ('I like to customize my study materials to make them visually appealing.', 'likert5', NULL, NULL),
  ('I enjoy theater, performing arts, or public speaking in school.', 'likert5', NULL, NULL),
  ('I want to explore careers in culinary arts, fashion, or filmmaking.', 'likert5', NULL, NULL),
  ('I feel proud when I create a hand-crafted model or prototype.', 'likert5', NULL, NULL),
  ('I like to think about what the future will look like in 50 years.', 'likert5', NULL, NULL),
  ('I prefer assignments that let me choose between writing, drawing, or speaking.', 'likert5', NULL, NULL),
  ('I enjoy visiting design fairs, art galleries, and technology expos.', 'likert5', NULL, NULL),
  ('I want to learn how to illustrate digital characters and concepts.', 'likert5', NULL, NULL),
  ('I feel satisfied when I find a non-traditional way to solve a standard task.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Intellectual Stimulation'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy learning about complex scientific theories just for fun.', 'likert5', NULL, NULL),
  ('I want a career where I am constantly learning new information.', 'likert5', NULL, NULL),
  ('I like solving logical puzzles, riddles, or math brainteasers.', 'likert5', NULL, NULL),
  ('I prefer reading analytical books or articles over fiction.', 'likert5', NULL, NULL),
  ('I enjoy debating school subjects with teachers or classmates.', 'likert5', NULL, NULL),
  ('I want to work in research, engineering, data science, or academia.', 'likert5', NULL, NULL),
  ('I like to question why things are the way they are in nature.', 'likert5', NULL, NULL),
  ('I feel satisfied when I finally understand a difficult academic concept.', 'likert5', NULL, NULL),
  ('I prefer school subjects that require reasoning over simple memorization.', 'likert5', NULL, NULL),
  ('I enjoy coding algorithms or analyzing databases for school tasks.', 'likert5', NULL, NULL),
  ('I want to spend my career analyzing data to find hidden trends.', 'likert5', NULL, NULL),
  ('I like to watch educational documentaries on science, space, and history.', 'likert5', NULL, NULL),
  ('I enjoy attending science fairs and intellectual discussions.', 'likert5', NULL, NULL),
  ('I prefer assignments that require digging deep into historical databases.', 'likert5', NULL, NULL),
  ('I like to analyze the pros and cons of arguments before making a decision.', 'likert5', NULL, NULL),
  ('I enjoy playing strategy games like chess or complex board games.', 'likert5', NULL, NULL),
  ('I want to write research reports on subjects that interest me.', 'likert5', NULL, NULL),
  ('I feel energized when a classroom discussion gets highly intellectual.', 'likert5', NULL, NULL),
  ('I like to explore topics outside of my standard school syllabus.', 'likert5', NULL, NULL),
  ('I want to learn how advanced technology like machine learning works.', 'likert5', NULL, NULL),
  ('I value classes that challenge me to defend my opinions with facts.', 'likert5', NULL, NULL),
  ('I enjoy studying how economic markets or societies function.', 'likert5', NULL, NULL),
  ('I prefer working on math problems that have multiple steps to solve.', 'likert5', NULL, NULL),
  ('I want to work in an environment where everyone is highly analytical.', 'likert5', NULL, NULL),
  ('I feel bored when school assignments do not require critical thinking.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Independence'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I prefer studying alone in a quiet room rather than in study groups.', 'likert5', NULL, NULL),
  ('I want a career where I can set my own working hours.', 'likert5', NULL, NULL),
  ('I value having the freedom to complete tasks my own way.', 'likert5', NULL, NULL),
  ('I feel suffocated when teachers check my work every ten minutes.', 'likert5', NULL, NULL),
  ('I want to be my own boss or run my own business in the future.', 'likert5', NULL, NULL),
  ('I prefer writing individual reports over working on group essays.', 'likert5', NULL, NULL),
  ('I like to solve personal and academic problems without asking for help.', 'likert5', NULL, NULL),
  ('I want a job that allows me to work from home or travel frequently.', 'likert5', NULL, NULL),
  ('I feel comfortable making major study decisions on my own.', 'likert5', NULL, NULL),
  ('I prefer taking responsibility for my own successes and failures.', 'likert5', NULL, NULL),
  ('I enjoy working on self-paced online courses or tutorials.', 'likert5', NULL, NULL),
  ('I want a workplace where I am left alone to do my assignments.', 'likert5', NULL, NULL),
  ('I prefer setting my own academic goals over following teacher expectations.', 'likert5', NULL, NULL),
  ('I enjoy managing my own pocket money and budget.', 'likert5', NULL, NULL),
  ('I want to study in a college that offers flexible learning schedules.', 'likert5', NULL, NULL),
  ('I prefer planning my schedule without my parents'' intervention.', 'likert5', NULL, NULL),
  ('I enjoy writing code or designing art independently without team consensus.', 'likert5', NULL, NULL),
  ('I want a career that does not require constant collaboration with others.', 'likert5', NULL, NULL),
  ('I feel happy when I can research a topic entirely on my own.', 'likert5', NULL, NULL),
  ('I prefer working on a project from start to finish by myself.', 'likert5', NULL, NULL),
  ('I want to learn how to manage tasks using personal productivity apps.', 'likert5', NULL, NULL),
  ('I feel comfortable speaking my mind even if my friends disagree.', 'likert5', NULL, NULL),
  ('I prefer classes where the instructor acts as a guide, not a manager.', 'likert5', NULL, NULL),
  ('I want to choose my career path based on my own wishes, not others''.', 'likert5', NULL, NULL),
  ('I value having personal time to process thoughts before joining a group.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Achievement'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I feel satisfied when I finish a major school project successfully.', 'likert5', NULL, NULL),
  ('I want a career where I can see the direct results of my work.', 'likert5', NULL, NULL),
  ('I enjoy setting high academic goals and working hard to reach them.', 'likert5', NULL, NULL),
  ('I feel motivated when I master a difficult school subject.', 'likert5', NULL, NULL),
  ('I want to be recognized as one of the top performers in my class.', 'likert5', NULL, NULL),
  ('I prefer clear grading rubrics so I know how to achieve an ''A''.', 'likert5', NULL, NULL),
  ('I feel proud when I complete all tasks on my study checklist.', 'likert5', NULL, NULL),
  ('I want a career that allows me to continuously build new skills.', 'likert5', NULL, NULL),
  ('I enjoy competing in quizzes, spelling bees, or sports tournaments.', 'likert5', NULL, NULL),
  ('I want to work in an environment where success is based on performance.', 'likert5', NULL, NULL),
  ('I feel energized when I overcome a major setback in my schoolwork.', 'likert5', NULL, NULL),
  ('I want to create products or write papers that get published.', 'likert5', NULL, NULL),
  ('I enjoy polishing my work until it is as perfect as possible.', 'likert5', NULL, NULL),
  ('I prefer challenging tasks because they make me feel accomplished.', 'likert5', NULL, NULL),
  ('I want to build a career where I can rise to the top of my field.', 'likert5', NULL, NULL),
  ('I enjoy keeping track of my grades and marks over the semesters.', 'likert5', NULL, NULL),
  ('I feel happy when my parents and teachers acknowledge my hard work.', 'likert5', NULL, NULL),
  ('I want to represent my school in inter-school competitions.', 'likert5', NULL, NULL),
  ('I enjoy learning how to use professional software and tools.', 'likert5', NULL, NULL),
  ('I feel motivated when I see my name on the school merit list.', 'likert5', NULL, NULL),
  ('I prefer working in structured environments that reward hard work.', 'likert5', NULL, NULL),
  ('I want to earn certificates and badges for completing online courses.', 'likert5', NULL, NULL),
  ('I enjoy working late to ensure my assignments are of high quality.', 'likert5', NULL, NULL),
  ('I want to choose a high school stream that has high academic standards.', 'likert5', NULL, NULL),
  ('I feel successful when I solve a problem that others struggled with.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Economic Returns'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want a career that pays a high starting salary.', 'likert5', NULL, NULL),
  ('I think earning a lot of money is a primary goal of working.', 'likert5', NULL, NULL),
  ('I prefer school streams that lead to high-paying jobs like tech or finance.', 'likert5', NULL, NULL),
  ('I want to be able to afford luxury items, travel, and a nice house.', 'likert5', NULL, NULL),
  ('I feel motivated by financial incentives, scholarships, or cash prizes.', 'likert5', NULL, NULL),
  ('I want a job that offers annual bonuses and stock options.', 'likert5', NULL, NULL),
  ('I prefer careers in corporate sectors over government or charity work.', 'likert5', NULL, NULL),
  ('I want to learn how to invest money and build wealth at an early age.', 'likert5', NULL, NULL),
  ('I enjoy playing business games or learning about stock markets.', 'likert5', NULL, NULL),
  ('I want to choose a college major based on its average graduate salary.', 'likert5', NULL, NULL),
  ('I think career success is measured by financial status and assets.', 'likert5', NULL, NULL),
  ('I want a job that pays me extra for working overtime.', 'likert5', NULL, NULL),
  ('I prefer working in fields where the demand for professionals is very high.', 'likert5', NULL, NULL),
  ('I want to start a side business to earn extra pocket money.', 'likert5', NULL, NULL),
  ('I enjoy reading about wealthy entrepreneurs and how they built businesses.', 'likert5', NULL, NULL),
  ('I want to work in major financial hubs or metropolitan cities.', 'likert5', NULL, NULL),
  ('I prefer careers where hard work translates directly into salary increases.', 'likert5', NULL, NULL),
  ('I want to study finance, business administration, or corporate law.', 'likert5', NULL, NULL),
  ('I feel motivated when I think about financial independence in my twenties.', 'likert5', NULL, NULL),
  ('I want a workplace that provides great monetary allowances and perks.', 'likert5', NULL, NULL),
  ('I enjoy negotiating and finding ways to get the best financial deals.', 'likert5', NULL, NULL),
  ('I want to choose high school streams that have the highest return on investment.', 'likert5', NULL, NULL),
  ('I feel successful when I save money or make profit on small trades.', 'likert5', NULL, NULL),
  ('I believe that financial security is the foundation of a happy life.', 'likert5', NULL, NULL),
  ('I want to work in a field where high performance leads to quick promotions.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Security'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I prefer jobs that offer long-term stability and job security.', 'likert5', NULL, NULL),
  ('I want a career in government or large corporations with low layoff risks.', 'likert5', NULL, NULL),
  ('I value having a predictable monthly income over variable bonuses.', 'likert5', NULL, NULL),
  ('I prefer working in safe, structured, and regulated environments.', 'likert5', NULL, NULL),
  ('I want a job that provides health insurance and retirement benefits.', 'likert5', NULL, NULL),
  ('I feel uneasy when considering starting a risky business of my own.', 'likert5', NULL, NULL),
  ('I prefer school streams that have clear, stable career paths.', 'likert5', NULL, NULL),
  ('I like to know my exact job duties and responsibilities in advance.', 'likert5', NULL, NULL),
  ('I feel motivated when I have a stable daily routine at work.', 'likert5', NULL, NULL),
  ('I want to work in an industry that is not affected by economic recessions.', 'likert5', NULL, NULL),
  ('I prefer staying in one company for a long time rather than job-hopping.', 'likert5', NULL, NULL),
  ('I value safe career paths (e.g., banking, administration) over freelancing.', 'likert5', NULL, NULL),
  ('I want to work in a company with clear, fair, and documented policies.', 'likert5', NULL, NULL),
  ('I prefer having a senior manager guide my work tasks daily.', 'likert5', NULL, NULL),
  ('I feel comfortable when my school schedule is fixed and never changes.', 'likert5', NULL, NULL),
  ('I want to choose a college that has a history of high campus placements.', 'likert5', NULL, NULL),
  ('I prefer studying subjects that have clear, step-by-step career outcomes.', 'likert5', NULL, NULL),
  ('I like to have savings and emergency funds set aside at all times.', 'likert5', NULL, NULL),
  ('I prefer working in a secure office building rather than traveling constantly.', 'likert5', NULL, NULL),
  ('I feel relaxed when I know exactly what is expected of me every day.', 'likert5', NULL, NULL),
  ('I want to choose a field where job automation is highly unlikely.', 'likert5', NULL, NULL),
  ('I enjoy working in roles that have standard 9-to-5 working hours.', 'likert5', NULL, NULL),
  ('I prefer taking standard exams (like civil services) that guarantee placement.', 'likert5', NULL, NULL),
  ('I value stable working relationships with coworkers and supervisors.', 'likert5', NULL, NULL),
  ('I believe that job safety is more important than career prestige.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Prestige / Recognition'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'stream_selection' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want a career that commands high respect from my family and society.', 'likert5', NULL, NULL),
  ('I enjoy being the leader or representative of my class or school club.', 'likert5', NULL, NULL),
  ('I want to work for a world-famous company or institution.', 'likert5', NULL, NULL),
  ('I feel motivated when my name is announced in school assemblies.', 'likert5', NULL, NULL),
  ('I want a job title that sounds impressive (e.g., Director, Chief, Expert).', 'likert5', NULL, NULL),
  ('I prefer school streams that are considered prestigious by my peers.', 'likert5', NULL, NULL),
  ('I want to win prestigious awards and trophies in my professional field.', 'likert5', NULL, NULL),
  ('I feel successful when people look up to me and ask for my advice.', 'likert5', NULL, NULL),
  ('I want to work in a profession that is highly regarded in the media.', 'likert5', NULL, NULL),
  ('I enjoy wearing a professional uniform or business suit to work.', 'likert5', NULL, NULL),
  ('I want to give presentations in front of large audiences.', 'likert5', NULL, NULL),
  ('I feel motivated when I receive certificates and medals for my achievements.', 'likert5', NULL, NULL),
  ('I want to build a public reputation as an expert in my subject.', 'likert5', NULL, NULL),
  ('I enjoy being in the spotlight during school events or performances.', 'likert5', NULL, NULL),
  ('I want to work in a high-profile office located in a famous skyscraper.', 'likert5', NULL, NULL),
  ('I prefer careers where my work will be publicly credited and signed.', 'likert5', NULL, NULL),
  ('I want to choose a college that has a famous brand name globally.', 'likert5', NULL, NULL),
  ('I feel proud when my achievements are shared on school social media.', 'likert5', NULL, NULL),
  ('I want to manage a large team of people who report directly to me.', 'likert5', NULL, NULL),
  ('I enjoy being introduced as a top performer or representative.', 'likert5', NULL, NULL),
  ('I want to write books, publish papers, or appear in news articles.', 'likert5', NULL, NULL),
  ('I prefer careers that involve representing my country or community.', 'likert5', NULL, NULL),
  ('I feel motivated when classmates ask to partner with me due to my reputation.', 'likert5', NULL, NULL),
  ('I believe that professional status is a key indicator of career success.', 'likert5', NULL, NULL),
  ('I want to work in an environment that has a clear hierarchy and titles.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Achievement'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I feel motivated when I master a highly complex subject for entrance exams.', 'likert5', NULL, NULL),
  ('I want a career where advancement is based purely on merit and performance.', 'likert5', NULL, NULL),
  ('I enjoy setting ambitious academic targets and pushing myself to reach them.', 'likert5', NULL, NULL),
  ('I feel satisfied when I solve a difficult coding, math, or logic problem.', 'likert5', NULL, NULL),
  ('I want to work in a field where I can produce tangible, high-quality results.', 'likert5', NULL, NULL),
  ('I enjoy testing my knowledge against top students in national exams.', 'likert5', NULL, NULL),
  ('I want to continuously build specialized expertise in my chosen field.', 'likert5', NULL, NULL),
  ('I feel proud when I complete a difficult project ahead of schedule.', 'likert5', NULL, NULL),
  ('I prefer roles that require high competence and problem-solving skills.', 'likert5', NULL, NULL),
  ('I want to work in an environment that challenges me to perform at my best.', 'likert5', NULL, NULL),
  ('I enjoy presenting my research or projects to experts for feedback.', 'likert5', NULL, NULL),
  ('I feel successful when I develop a system or tool that works efficiently.', 'likert5', NULL, NULL),
  ('I want a career that allows me to learn new skills and technologies daily.', 'likert5', NULL, NULL),
  ('I enjoy competing in national level academic Olympiads or tournaments.', 'likert5', NULL, NULL),
  ('I prefer working late to polish my projects rather than submitting average work.', 'likert5', NULL, NULL),
  ('I want to be known as the go-to person for solving complex tasks.', 'likert5', NULL, NULL),
  ('I feel energized when I overcome a major challenge in my studies.', 'likert5', NULL, NULL),
  ('I want to earn professional certifications that prove my capabilities.', 'likert5', NULL, NULL),
  ('I enjoy analyzing my past performance to find areas of improvement.', 'likert5', NULL, NULL),
  ('I believe that personal mastery of a skill is the greatest reward of working.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Altruism'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want a career dedicated to improving the lives of disadvantaged people.', 'likert5', NULL, NULL),
  ('I feel motivated when my academic work helps my classmates succeed.', 'likert5', NULL, NULL),
  ('I want to work for organizations that prioritize social welfare over profit.', 'likert5', NULL, NULL),
  ('I prefer projects that address major global issues like climate change or poverty.', 'likert5', NULL, NULL),
  ('I feel fulfilled when I spend my weekends doing community service.', 'likert5', NULL, NULL),
  ('I want to develop technology or medicine that saves lives.', 'likert5', NULL, NULL),
  ('I value career paths in healthcare, public policy, or social work.', 'likert5', NULL, NULL),
  ('I think helping others succeed is a key measure of career satisfaction.', 'likert5', NULL, NULL),
  ('I want to write research papers that help solve community challenges.', 'likert5', NULL, NULL),
  ('I enjoy sharing my study resources and notes with peers who need them.', 'likert5', NULL, NULL),
  ('I want to join non-profit organizations or social enterprise clubs in college.', 'likert5', NULL, NULL),
  ('I feel proud when my work contributes to safety and equality in society.', 'likert5', NULL, NULL),
  ('I want to work in an environment where empathy and care are core values.', 'likert5', NULL, NULL),
  ('I prefer research topics that analyze social issues and human rights.', 'likert5', NULL, NULL),
  ('I feel inspired by scientists who made their discoveries open and free.', 'likert5', NULL, NULL),
  ('I want to mentor junior students and help them navigate school challenges.', 'likert5', NULL, NULL),
  ('I value volunteer positions at local hospitals, clinics, or food banks.', 'likert5', NULL, NULL),
  ('I want to use my skills to build public infrastructure or free education tools.', 'likert5', NULL, NULL),
  ('I feel happiest when my team''s goal is to protect and support people.', 'likert5', NULL, NULL),
  ('I believe that contributing to the common good is the main purpose of work.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Creativity'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy creating original art, music, or literature in my free time.', 'likert5', NULL, NULL),
  ('I want a career where I can design new products, systems, or media.', 'likert5', NULL, NULL),
  ('I feel stifled when I have to follow rigid, pre-defined procedures.', 'likert5', NULL, NULL),
  ('I prefer open-ended design challenges over standardized testing.', 'likert5', NULL, NULL),
  ('I like to find unconventional solutions to scientific or logical problems.', 'likert5', NULL, NULL),
  ('I want to work in fields like UI/UX design, marketing, or creative writing.', 'likert5', NULL, NULL),
  ('I enjoy brainstorming unique themes for school events or campaigns.', 'likert5', NULL, NULL),
  ('I feel motivated when I can express my personal style through my assignments.', 'likert5', NULL, NULL),
  ('I want to invent new tools that make daily tasks easier or more fun.', 'likert5', NULL, NULL),
  ('I enjoy experimenting with digital media, photography, and video editing.', 'likert5', NULL, NULL),
  ('I prefer writing an original code application over fixing existing bugs.', 'likert5', NULL, NULL),
  ('I want to study in a college program that emphasizes design thinking.', 'likert5', NULL, NULL),
  ('I enjoy acting in plays, debate societies, or public speaking groups.', 'likert5', NULL, NULL),
  ('I like to create visual designs, logos, or slides for group projects.', 'likert5', NULL, NULL),
  ('I want to explore careers in media production, game design, or writing.', 'likert5', NULL, NULL),
  ('I feel satisfied when I turn a raw idea into a working prototype.', 'likert5', NULL, NULL),
  ('I like to think about creative ways to explain complex topics.', 'likert5', NULL, NULL),
  ('I prefer tasks where I can experiment with different styles and methods.', 'likert5', NULL, NULL),
  ('I want to work in a culture that values innovation and accepts failures.', 'likert5', NULL, NULL),
  ('I believe that creative freedom is essential for my career satisfaction.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Economic Returns'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want a college major that guarantees a high starting salary.', 'likert5', NULL, NULL),
  ('I think building financial wealth is a primary goal of my career.', 'likert5', NULL, NULL),
  ('I prefer streams that lead to careers in investment banking or tech management.', 'likert5', NULL, NULL),
  ('I want a job that pays high bonuses, stock options, and commissions.', 'likert5', NULL, NULL),
  ('I feel motivated by high-paying internships and corporate sponsorships.', 'likert5', NULL, NULL),
  ('I want to be financially independent shortly after graduating from university.', 'likert5', NULL, NULL),
  ('I prefer working in fast-paced corporate sectors with high compensation.', 'likert5', NULL, NULL),
  ('I want to learn about personal finance, stocks, and real estate investments.', 'likert5', NULL, NULL),
  ('I feel successful when my academic achievements lead to cash scholarships.', 'likert5', NULL, NULL),
  ('I want a career that allows me to afford luxury travel and lifestyle.', 'likert5', NULL, NULL),
  ('I think career success is best measured by salary and net worth.', 'likert5', NULL, NULL),
  ('I want a job that pays extra allowances for relocation or travel.', 'likert5', NULL, NULL),
  ('I prefer working in fields where demand drives high professional fees.', 'likert5', NULL, NULL),
  ('I want to build a startup that can scale and generate significant profit.', 'likert5', NULL, NULL),
  ('I enjoy reading biographies of successful business leaders and founders.', 'likert5', NULL, NULL),
  ('I want to work in major economic hubs like Mumbai, London, or New York.', 'likert5', NULL, NULL),
  ('I prefer positions that offer performance-linked monetary bonuses.', 'likert5', NULL, NULL),
  ('I want to master high-paying skills like finance or machine learning.', 'likert5', NULL, NULL),
  ('I feel motivated when I think about financial security for my family.', 'likert5', NULL, NULL),
  ('I believe that maximizing income should be a key factor in career choice.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Independence'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I prefer studying alone at my own pace rather than in study groups.', 'likert5', NULL, NULL),
  ('I want a career that allows for flexible working hours or remote work.', 'likert5', NULL, NULL),
  ('I value having the authority to make decisions on my projects.', 'likert5', NULL, NULL),
  ('I feel uncomfortable when teachers or mentors manage my daily routine.', 'likert5', NULL, NULL),
  ('I want to be an entrepreneur, consultant, or freelancer in the future.', 'likert5', NULL, NULL),
  ('I prefer writing individual reports over coordinating team presentations.', 'likert5', NULL, NULL),
  ('I like to solve academic and personal challenges without seeking help.', 'likert5', NULL, NULL),
  ('I want a job that lets me manage my schedule without constant approval.', 'likert5', NULL, NULL),
  ('I feel confident making major decisions about my stream and college.', 'likert5', NULL, NULL),
  ('I prefer setting my own academic goals over following rigid checklists.', 'likert5', NULL, NULL),
  ('I enjoy learning through self-guided online courses and books.', 'likert5', NULL, NULL),
  ('I want a career where I am evaluated on my output, not my hours.', 'likert5', NULL, NULL),
  ('I prefer assignments that let me work independently from start to finish.', 'likert5', NULL, NULL),
  ('I enjoy managing my own study budget and choosing my own materials.', 'likert5', NULL, NULL),
  ('I want to attend a college that gives students high academic flexibility.', 'likert5', NULL, NULL),
  ('I prefer working in fields that do not require constant meetings and syncs.', 'likert5', NULL, NULL),
  ('I feel happy when I can research a topic deeply by myself.', 'likert5', NULL, NULL),
  ('I want to choose my career path based entirely on my own passion.', 'likert5', NULL, NULL),
  ('I value having personal time to process ideas before presenting them.', 'likert5', NULL, NULL),
  ('I believe that self-reliance is the most important quality for success.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Prestige'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want a career that is highly respected by my community and family.', 'likert5', NULL, NULL),
  ('I enjoy being the president or coordinator of school clubs or societies.', 'likert5', NULL, NULL),
  ('I want to work for a globally famous organization or brand.', 'likert5', NULL, NULL),
  ('I feel motivated when I receive public recognition or awards.', 'likert5', NULL, NULL),
  ('I want a job title that signals authority, like Director or Lead.', 'likert5', NULL, NULL),
  ('I prefer competitive streams that are highly valued by society.', 'likert5', NULL, NULL),
  ('I want to win national or international awards in my field.', 'likert5', NULL, NULL),
  ('I feel successful when others look up to me and seek my guidance.', 'likert5', NULL, NULL),
  ('I want to work in a high-profile industry that is regularly in the news.', 'likert5', NULL, NULL),
  ('I enjoy representing my school or college at national conferences.', 'likert5', NULL, NULL),
  ('I want to build a public reputation as a thought leader or expert.', 'likert5', NULL, NULL),
  ('I enjoy presenting my work in front of large, formal audiences.', 'likert5', NULL, NULL),
  ('I want to work in a high-status office in a prominent metropolitan area.', 'likert5', NULL, NULL),
  ('I prefer careers where my name will be credited on published products.', 'likert5', NULL, NULL),
  ('I want to graduate from a university with an elite, famous brand.', 'likert5', NULL, NULL),
  ('I feel proud when my achievements are shared on official platforms.', 'likert5', NULL, NULL),
  ('I want to manage a team and direct the work of other professionals.', 'likert5', NULL, NULL),
  ('I enjoy being introduced as a top performer or selected representative.', 'likert5', NULL, NULL),
  ('I want to write books, give public lectures, or publish expert articles.', 'likert5', NULL, NULL),
  ('I believe that social status and prestige are vital for career satisfaction.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Security'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I prefer careers that offer long-term job security, like government roles.', 'likert5', NULL, NULL),
  ('I want a stable monthly income that I can rely on for years.', 'likert5', NULL, NULL),
  ('I prefer working in established organizations with low risk of layoffs.', 'likert5', NULL, NULL),
  ('I value jobs that offer comprehensive medical and retirement benefits.', 'likert5', NULL, NULL),
  ('I feel nervous about the instability of starting a new business.', 'likert5', NULL, NULL),
  ('I prefer fields with clear, traditional career trajectories (e.g., law, banking).', 'likert5', NULL, NULL),
  ('I like knowing my exact duties, working hours, and expectations.', 'likert5', NULL, NULL),
  ('I feel motivated by a structured and predictable work environment.', 'likert5', NULL, NULL),
  ('I want to work in an industry that is resilient to economic downturns.', 'likert5', NULL, NULL),
  ('I prefer staying in one stable role over moving between startups.', 'likert5', NULL, NULL),
  ('I want to work in a company with clear, fair, and unionized policies.', 'likert5', NULL, NULL),
  ('I prefer having a senior mentor who provides regular, structured guidance.', 'likert5', NULL, NULL),
  ('I feel relaxed when my exam and study schedules are fixed well in advance.', 'likert5', NULL, NULL),
  ('I want to choose a college that has a consistent track record of placements.', 'likert5', NULL, NULL),
  ('I prefer studying subjects with a direct, predictable link to employment.', 'likert5', NULL, NULL),
  ('I like to maintain a clear distinction between study time and home life.', 'likert5', NULL, NULL),
  ('I want to work in a secure office location with standard 9-to-5 hours.', 'likert5', NULL, NULL),
  ('I prefer standardized examinations that offer secure career entry.', 'likert5', NULL, NULL),
  ('I value having a safe, organized workspace with clear safety protocols.', 'likert5', NULL, NULL),
  ('I believe that career stability is far more important than high-risk rewards.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Supervisory Relations'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I prefer working under teachers or mentors who give clear, supportive feedback.', 'likert5', NULL, NULL),
  ('I want a manager who is fair, approachable, and treats everyone equally.', 'likert5', NULL, NULL),
  ('I feel motivated when my supervisors show genuine care for my career growth.', 'likert5', NULL, NULL),
  ('I value having regular one-on-one meetings with mentors to discuss progress.', 'likert5', NULL, NULL),
  ('I want to work with leaders who explain the reasons behind their decisions.', 'likert5', NULL, NULL),
  ('I prefer supervisors who act as coaches rather than strict bosses.', 'likert5', NULL, NULL),
  ('I feel productive when my teachers set clear, achievable expectations.', 'likert5', NULL, NULL),
  ('I want to work in a company where management is highly supportive of employees.', 'likert5', NULL, NULL),
  ('I appreciate leaders who recognize and praise good work privately and publicly.', 'likert5', NULL, NULL),
  ('I prefer working in a system where I can voice my concerns to managers easily.', 'likert5', NULL, NULL),
  ('I want to work with a supervisor who protects the team from external pressure.', 'likert5', NULL, NULL),
  ('I feel motivated when my mentor trusts me with important tasks.', 'likert5', NULL, NULL),
  ('I prefer teachers who are patient and take time to explain difficult concepts.', 'likert5', NULL, NULL),
  ('I want to work for a company known for its ethical and fair leadership.', 'likert5', NULL, NULL),
  ('I value having supervisors who listen to employee suggestions and ideas.', 'likert5', NULL, NULL),
  ('I feel secure when my manager is highly competent and organized.', 'likert5', NULL, NULL),
  ('I prefer receiving constructive criticism that helps me improve my skills.', 'likert5', NULL, NULL),
  ('I want a supervisor who helps resolve conflicts within the team fairly.', 'likert5', NULL, NULL),
  ('I feel energized when my mentor encourages me to take on new challenges.', 'likert5', NULL, NULL),
  ('I believe that a good relationship with my boss is critical for job satisfaction.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Surroundings'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I prefer working in a clean, modern, and quiet study environment.', 'likert5', NULL, NULL),
  ('I want an office that is air-conditioned, well-lit, and ergonomically designed.', 'likert5', NULL, NULL),
  ('I value having a dedicated, personal desk or workspace at school/college.', 'likert5', NULL, NULL),
  ('I prefer schools that have beautiful campuses, green spaces, and parks.', 'likert5', NULL, NULL),
  ('I want to work in a visually appealing building with nice architecture.', 'likert5', NULL, NULL),
  ('I feel distracted when my study environment is noisy or messy.', 'likert5', NULL, NULL),
  ('I prefer working in locations that are easily accessible by public transport.', 'likert5', NULL, NULL),
  ('I want to work in an office that has great cafeteria and recreational spaces.', 'likert5', NULL, NULL),
  ('I value having high-quality computer screens and technology at my desk.', 'likert5', NULL, NULL),
  ('I feel relaxed when my study space is decorated with plants and art.', 'likert5', NULL, NULL),
  ('I prefer working in a smoke-free, eco-friendly office environment.', 'likert5', NULL, NULL),
  ('I want a workplace that provides quiet rooms for focus and relaxation.', 'likert5', NULL, NULL),
  ('I feel motivated when my school library is spacious, silent, and clean.', 'likert5', NULL, NULL),
  ('I prefer working in city centers with nearby shops, cafes, and restaurants.', 'likert5', NULL, NULL),
  ('I want an office with large windows that let in natural sunlight.', 'likert5', NULL, NULL),
  ('I value working in a safe neighborhood with well-lit streets.', 'likert5', NULL, NULL),
  ('I feel productive when my desk is organized exactly to my liking.', 'likert5', NULL, NULL),
  ('I prefer working in standard offices over industrial factories or labs.', 'likert5', NULL, NULL),
  ('I want a workplace that respects physical comfort and offers flexible seating.', 'likert5', NULL, NULL),
  ('I believe that a comfortable physical workplace directly improves my focus.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Variety'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_planning' and bp.name = 'Values / Motivators'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I feel bored when I have to study the same subject for a whole week.', 'likert5', NULL, NULL),
  ('I want a career that involves a wide range of different tasks and projects.', 'likert5', NULL, NULL),
  ('I enjoy working in dynamic environments where every day is different.', 'likert5', NULL, NULL),
  ('I prefer job roles that require rotating between departments or teams.', 'likert5', NULL, NULL),
  ('I want a career that involves travel and meeting different clients.', 'likert5', NULL, NULL),
  ('I enjoy taking elective courses in diverse subjects (e.g., science and art).', 'likert5', NULL, NULL),
  ('I prefer working on multiple projects at the same time to keep things fresh.', 'likert5', NULL, NULL),
  ('I want to learn a variety of skills rather than specializing in just one.', 'likert5', NULL, NULL),
  ('I feel energized when my study schedule is packed with different activities.', 'likert5', NULL, NULL),
  ('I prefer troubleshooting unpredictable issues over doing repetitive tasks.', 'likert5', NULL, NULL),
  ('I want to work in a startup where I have to wear multiple hats.', 'likert5', NULL, NULL),
  ('I enjoy learning about different industries and business sectors.', 'likert5', NULL, NULL),
  ('I prefer assignment formats that change, from essays to presentations.', 'likert5', NULL, NULL),
  ('I want to work with diverse groups of people from different backgrounds.', 'likert5', NULL, NULL),
  ('I enjoy hobbies that are completely unrelated to my school stream.', 'likert5', NULL, NULL),
  ('I prefer roles that allow me to solve new problems every day.', 'likert5', NULL, NULL),
  ('I feel motivated when I have to learn new tools and software frequently.', 'likert5', NULL, NULL),
  ('I want a job that combines office work, field visits, and group meetings.', 'likert5', NULL, NULL),
  ('I enjoy reading about a wide range of topics from technology to sociology.', 'likert5', NULL, NULL),
  ('I believe that constant change and variety are key to career happiness.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Altruism'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want a career where I can make a positive social impact daily.', 'likert5', NULL, NULL),
  ('I feel motivated when my company participates in charity programs.', 'likert5', NULL, NULL),
  ('I prefer job roles that help improve the safety or health of people.', 'likert5', NULL, NULL),
  ('I want to work for organizations that prioritize ethical business practices.', 'likert5', NULL, NULL),
  ('I feel fulfilled when I help my coworkers solve professional challenges.', 'likert5', NULL, NULL),
  ('I want to use my technical skills to solve community problems.', 'likert5', NULL, NULL),
  ('I value working in sectors like healthcare, education, or social services.', 'likert5', NULL, NULL),
  ('I believe that helping clients succeed is more important than my personal commissions.', 'likert5', NULL, NULL),
  ('I enjoy mentoring new interns and onboarding junior colleagues.', 'likert5', NULL, NULL),
  ('I want to work for a company that donates a portion of its profits to charity.', 'likert5', NULL, NULL),
  ('I prefer projects that address environmental sustainability and green energy.', 'likert5', NULL, NULL),
  ('I feel proud when our product makes customers'' daily lives easier.', 'likert5', NULL, NULL),
  ('I want to participate in company volunteer days and community outreach.', 'likert5', NULL, NULL),
  ('I enjoy working in environments where empathy is a core cultural value.', 'likert5', NULL, NULL),
  ('I want to build software or tools that support non-profit organizations.', 'likert5', NULL, NULL),
  ('I feel motivated when my team''s goal is to serve public interest.', 'likert5', NULL, NULL),
  ('I prefer research topics that focus on improving safety and equality.', 'likert5', NULL, NULL),
  ('I want to use my professional network to support social justice initiatives.', 'likert5', NULL, NULL),
  ('I feel satisfied when I help resolve conflicts between team members.', 'likert5', NULL, NULL),
  ('I believe that contributing to the public good is a key marker of career success.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Affiliation'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want a job where I can collaborate closely with my team members.', 'likert5', NULL, NULL),
  ('I prefer open-plan offices that encourage spontaneous conversations.', 'likert5', NULL, NULL),
  ('I enjoy participating in office social events, happy hours, and retreats.', 'likert5', NULL, NULL),
  ('I feel motivated when my coworkers become my personal friends.', 'likert5', NULL, NULL),
  ('I value having a warm, collaborative, and friendly team culture.', 'likert5', NULL, NULL),
  ('I want to work in an environment that has regular team-building activities.', 'likert5', NULL, NULL),
  ('I prefer solving problems through group brainstorming over solo analysis.', 'likert5', NULL, NULL),
  ('I feel energized when I work in a busy, collaborative office setting.', 'likert5', NULL, NULL),
  ('I want to build a large professional network across different departments.', 'likert5', NULL, NULL),
  ('I prefer working on cross-functional projects that require team coordination.', 'likert5', NULL, NULL),
  ('I value having friendly, supportive relationships with my managers.', 'likert5', NULL, NULL),
  ('I want to work for a company that emphasizes teamwork over individual rivalry.', 'likert5', NULL, NULL),
  ('I feel happy when my team celebrates birthdays and professional milestones.', 'likert5', NULL, NULL),
  ('I enjoy checking in with my colleagues daily to chat about non-work topics.', 'likert5', NULL, NULL),
  ('I prefer joining professional associations and networking clubs.', 'likert5', NULL, NULL),
  ('I want to work in a culture that values collective success over solo wins.', 'likert5', NULL, NULL),
  ('I enjoy organizing office celebrations, lunch outings, or sports clubs.', 'likert5', NULL, NULL),
  ('I feel motivated when my team coordinates smoothly on complex tasks.', 'likert5', NULL, NULL),
  ('I want a job that involves client relationship management and social interaction.', 'likert5', NULL, NULL),
  ('I believe that strong team bonds are essential for my workplace happiness.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Commerce'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want a job that pays high performance-linked bonuses and commissions.', 'likert5', NULL, NULL),
  ('I think driving business profit and growth is the main goal of work.', 'likert5', NULL, NULL),
  ('I prefer working in sectors like sales, investment banking, or trading.', 'likert5', NULL, NULL),
  ('I want to earn a high salary that allows me to build personal wealth quickly.', 'likert5', NULL, NULL),
  ('I feel motivated when my work directly increases company revenue.', 'likert5', NULL, NULL),
  ('I want a career that involves negotiating deals and commercial contracts.', 'likert5', NULL, NULL),
  ('I enjoy tracking financial metrics, sales numbers, and market share.', 'likert5', NULL, NULL),
  ('I want to learn how businesses scale and generate return on investment.', 'likert5', NULL, NULL),
  ('I feel successful when I meet or exceed my monthly sales targets.', 'likert5', NULL, NULL),
  ('I want to choose roles that offer fast-track career progression and high pay.', 'likert5', NULL, NULL),
  ('I think career success is measured by financial compensation and assets.', 'likert5', NULL, NULL),
  ('I want a job that offers stock options and profit-sharing benefits.', 'likert5', NULL, NULL),
  ('I enjoy playing business simulation games or analyzing financial news.', 'likert5', NULL, NULL),
  ('I want to work in highly competitive commercial markets.', 'likert5', NULL, NULL),
  ('I prefer positions where my output translates directly into salary growth.', 'likert5', NULL, NULL),
  ('I want to master commercial skills like marketing, finance, and valuation.', 'likert5', NULL, NULL),
  ('I feel motivated by cash prizes, luxury trips, and material rewards.', 'likert5', NULL, NULL),
  ('I want to work in major financial districts or commercial hubs.', 'likert5', NULL, NULL),
  ('I enjoy pitch presentations to prospective clients and investors.', 'likert5', NULL, NULL),
  ('I believe that financial returns should be the primary factor in career moves.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Security'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I prefer job security and long-term stability over high-risk startups.', 'likert5', NULL, NULL),
  ('I want a predictable monthly salary that is always paid on time.', 'likert5', NULL, NULL),
  ('I prefer working in large, established corporations with low layoff histories.', 'likert5', NULL, NULL),
  ('I value comprehensive health, dental, and retirement plan benefits.', 'likert5', NULL, NULL),
  ('I feel nervous about the instability of starting a business or freelancing.', 'likert5', NULL, NULL),
  ('I prefer roles that have clear, stable, and documented career paths.', 'likert5', NULL, NULL),
  ('I like to know my exact duties, working hours, and expectations in advance.', 'likert5', NULL, NULL),
  ('I feel motivated when I have a stable and structured daily routine.', 'likert5', NULL, NULL),
  ('I want to work in an industry that is resilient to economic market shifts.', 'likert5', NULL, NULL),
  ('I prefer staying in one stable job for several years over frequent hops.', 'likert5', NULL, NULL),
  ('I want a workplace that has transparent, fair, and documented HR policies.', 'likert5', NULL, NULL),
  ('I prefer having a senior manager who provides clear, structured directions.', 'likert5', NULL, NULL),
  ('I feel comfortable when project timelines and goals are set weeks in advance.', 'likert5', NULL, NULL),
  ('I want to choose a field where job automation is highly unlikely.', 'likert5', NULL, NULL),
  ('I prefer working in secure office buildings rather than traveling constantly.', 'likert5', NULL, NULL),
  ('I feel relaxed when my work expectations are clear and consistent.', 'likert5', NULL, NULL),
  ('I want a job that has standard working hours and respects my weekends.', 'likert5', NULL, NULL),
  ('I value having a safe, organized workspace with clear safety guidelines.', 'likert5', NULL, NULL),
  ('I prefer working for companies that have strong financial balance sheets.', 'likert5', NULL, NULL),
  ('I believe that job stability is the most critical foundation for my career.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Power & Influence'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want a career where I can lead teams and direct strategic projects.', 'likert5', NULL, NULL),
  ('I feel motivated when I have the authority to make critical business decisions.', 'likert5', NULL, NULL),
  ('I enjoy competing with colleagues to see who can deliver the best results.', 'likert5', NULL, NULL),
  ('I want a position that offers high influence over company policies.', 'likert5', NULL, NULL),
  ('I prefer roles where I manage budgets, resources, and timelines.', 'likert5', NULL, NULL),
  ('I want to climb the corporate ladder quickly to reach executive levels.', 'likert5', NULL, NULL),
  ('I feel energized when I pitch my strategies to senior leadership.', 'likert5', NULL, NULL),
  ('I want to be known as a key driver of change in my organization.', 'likert5', NULL, NULL),
  ('I enjoy negotiating terms and influencing client decisions.', 'likert5', NULL, NULL),
  ('I want to manage high-impact projects that get corporate attention.', 'likert5', NULL, NULL),
  ('I feel successful when my recommendations are adopted by the board.', 'likert5', NULL, NULL),
  ('I want a career that allows me to supervise and mentor other employees.', 'likert5', NULL, NULL),
  ('I enjoy taking charge of meetings and directing discussions.', 'likert5', NULL, NULL),
  ('I prefer competitive environments that reward assertive leadership.', 'likert5', NULL, NULL),
  ('I want to control resources and distribute tasks among team members.', 'likert5', NULL, NULL),
  ('I feel motivated when I am given ownership of a new department or product.', 'likert5', NULL, NULL),
  ('I want to write company policies and set operational guidelines.', 'likert5', NULL, NULL),
  ('I enjoy representing my company in high-stakes negotiations.', 'likert5', NULL, NULL),
  ('I prefer working in fields where I can outpace my competition.', 'likert5', NULL, NULL),
  ('I believe that gaining power and authority is the best sign of success.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Recognition'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want to work for a company that has a famous, prestigious brand name.', 'likert5', NULL, NULL),
  ('I feel motivated when my achievements are publicly praised by executives.', 'likert5', NULL, NULL),
  ('I want a job title that sounds impressive to my friends and family.', 'likert5', NULL, NULL),
  ('I enjoy receiving trophies, certificates, and badges for my performance.', 'likert5', NULL, NULL),
  ('I want to be featured in company newsletters or professional articles.', 'likert5', NULL, NULL),
  ('I feel successful when my name is on the top performer leaderboard.', 'likert5', NULL, NULL),
  ('I want to build a strong public profile on platforms like LinkedIn.', 'likert5', NULL, NULL),
  ('I enjoy presenting my project results to large corporate audiences.', 'likert5', NULL, NULL),
  ('I want a career where my work is directly credited and signed by me.', 'likert5', NULL, NULL),
  ('I prefer roles that have high corporate status and visibility.', 'likert5', NULL, NULL),
  ('I want to win prestigious industry awards in my specific field.', 'likert5', NULL, NULL),
  ('I feel proud when clients praise my work to my supervisors.', 'likert5', NULL, NULL),
  ('I want to wear formal business suits and work in high-end offices.', 'likert5', NULL, NULL),
  ('I enjoy being selected as a representative for industry conferences.', 'likert5', NULL, NULL),
  ('I want to publish expert articles or speak at panel discussions.', 'likert5', NULL, NULL),
  ('I feel motivated when I receive positive reviews on public feedback sites.', 'likert5', NULL, NULL),
  ('I want my family to feel proud of the company I work for.', 'likert5', NULL, NULL),
  ('I prefer high-profile projects that are noticed by senior management.', 'likert5', NULL, NULL),
  ('I enjoy being introduced as an expert or high achiever in my field.', 'likert5', NULL, NULL),
  ('I believe that professional recognition is a key driver of my career.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Science & Tech'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I enjoy analyzing databases and finding trends to solve problems.', 'likert5', NULL, NULL),
  ('I want a career that involves using cutting-edge technology daily.', 'likert5', NULL, NULL),
  ('I feel motivated when I build software, code models, or run lab tests.', 'likert5', NULL, NULL),
  ('I prefer making business decisions based on data rather than intuition.', 'likert5', NULL, NULL),
  ('I want to work in fields like engineering, IT, or data analytics.', 'likert5', NULL, NULL),
  ('I enjoy learning how new technologies work under the hood.', 'likert5', NULL, NULL),
  ('I prefer roles where I write scripts or automate manual tasks.', 'likert5', NULL, NULL),
  ('I enjoy researching technical papers and academic studies.', 'likert5', NULL, NULL),
  ('I want to work with advanced equipment, software, or machinery.', 'likert5', NULL, NULL),
  ('I feel energized when solving complex logical or coding challenges.', 'likert5', NULL, NULL),
  ('I want to build a career as a technical specialist or developer.', 'likert5', NULL, NULL),
  ('I enjoy attending tech conferences, hackathons, or scientific fests.', 'likert5', NULL, NULL),
  ('I prefer working in industries like biotech, aerospace, or software.', 'likert5', NULL, NULL),
  ('I want to design algorithms that optimize business operations.', 'likert5', NULL, NULL),
  ('I feel satisfied when I build an automated dashboard that track metrics.', 'likert5', NULL, NULL),
  ('I enjoy reading about artificial intelligence, space, or biotech updates.', 'likert5', NULL, NULL),
  ('I prefer jobs where the main tasks require scientific reasoning.', 'likert5', NULL, NULL),
  ('I want to write technical documentations or system architectures.', 'likert5', NULL, NULL),
  ('I enjoy learning new programming languages or software tools.', 'likert5', NULL, NULL),
  ('I believe that data-driven, logical thinking is the key to business progress.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Aesthetics'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want a career where I can design visually appealing products or interfaces.', 'likert5', NULL, NULL),
  ('I enjoy decorating slides, reports, and marketing materials beautifully.', 'likert5', NULL, NULL),
  ('I prefer working in fields like UI/UX design, fashion, or advertising.', 'likert5', NULL, NULL),
  ('I feel motivated when I create art, write copy, or design websites.', 'likert5', NULL, NULL),
  ('I want to work in visually stunning office environments with modern art.', 'likert5', NULL, NULL),
  ('I enjoy editing photos, making graphics, or designing video layouts.', 'likert5', NULL, NULL),
  ('I prefer roles that require creative thinking and artistic expression.', 'likert5', NULL, NULL),
  ('I enjoy visiting design fairs, museum galleries, and architecture expos.', 'likert5', NULL, NULL),
  ('I want to create brand logos, product packaging, or advertising banners.', 'likert5', NULL, NULL),
  ('I feel satisfied when I customize my digital workspace to look elegant.', 'likert5', NULL, NULL),
  ('I want to learn about design principles, typography, and color theory.', 'likert5', NULL, NULL),
  ('I enjoy writing creative stories, articles, or social media copy.', 'likert5', NULL, NULL),
  ('I want to work with creative professionals like directors, artists, or writers.', 'likert5', NULL, NULL),
  ('I feel proud when clients compliment the aesthetic design of my projects.', 'likert5', NULL, NULL),
  ('I prefer working on branding guidelines and creative guidelines.', 'likert5', NULL, NULL),
  ('I enjoy brainstorming visual themes for company events or product launches.', 'likert5', NULL, NULL),
  ('I want to build a career in media production, photography, or copywriting.', 'likert5', NULL, NULL),
  ('I prefer tasks where I can experiment with visual styles and formats.', 'likert5', NULL, NULL),
  ('I feel inspired by companies that make design a primary competitive advantage.', 'likert5', NULL, NULL),
  ('I believe that aesthetic appeal is crucial for product and service success.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Hedonism / Lifestyle'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want a career that respects my personal life and personal hobbies.', 'likert5', NULL, NULL),
  ('I feel motivated when I have plenty of paid time off and vacation days.', 'likert5', NULL, NULL),
  ('I prefer companies that offer flexible start/end times and remote work.', 'likert5', NULL, NULL),
  ('I want a job that has low stress levels and avoids working late.', 'likert5', NULL, NULL),
  ('I value having time to travel, exercise, and socialize after work.', 'likert5', NULL, NULL),
  ('I prefer roles that offer standard, predictable working hours.', 'likert5', NULL, NULL),
  ('I want a workplace that provides recreational areas, games, and snacks.', 'likert5', NULL, NULL),
  ('I feel energized when my company organizes fun social events and fests.', 'likert5', NULL, NULL),
  ('I want to work in location-independent roles like digital nomad setups.', 'likert5', NULL, NULL),
  ('I enjoy taking regular breaks during my work hours to clear my mind.', 'likert5', NULL, NULL),
  ('I prefer a relaxed, dress-down office environment over formal wear.', 'likert5', NULL, NULL),
  ('I want a job that does not require taking phone calls on weekends.', 'likert5', NULL, NULL),
  ('I feel proud when I maintain a healthy work-life balance.', 'likert5', NULL, NULL),
  ('I want to work in a culture that values happiness and fun.', 'likert5', NULL, NULL),
  ('I enjoy taking long weekends and planning outdoor adventure trips.', 'likert5', NULL, NULL),
  ('I prefer working in creative, informal spaces over traditional cubicles.', 'likert5', NULL, NULL),
  ('I want a job that offers health, fitness, and wellness allowances.', 'likert5', NULL, NULL),
  ('I enjoy light-hearted chat with colleagues rather than serious politics.', 'likert5', NULL, NULL),
  ('I feel refreshed when I separate my work life from my personal time.', 'likert5', NULL, NULL),
  ('I believe that personal happiness and lifestyle are more important than job titles.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Tradition / Stability'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'career_growth' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want to work for a company that has a long history and strong heritage.', 'likert5', NULL, NULL),
  ('I prefer working in organizations with clear hierarchy and respect for authority.', 'likert5', NULL, NULL),
  ('I feel comfortable when there are established procedures for every task.', 'likert5', NULL, NULL),
  ('I value loyalty and want to stay with one company for a long time.', 'likert5', NULL, NULL),
  ('I want to work in industries with stable regulations, like banking or law.', 'likert5', NULL, NULL),
  ('I prefer learning from experienced senior leaders who follow proven methods.', 'likert5', NULL, NULL),
  ('I feel secure when my company has a clear code of conduct and values.', 'likert5', NULL, NULL),
  ('I want to work in a culture that respects traditional business models.', 'likert5', NULL, NULL),
  ('I prefer roles that have predictable duties over constantly changing tasks.', 'likert5', NULL, NULL),
  ('I value having a structured career path with clear tenure-based promotions.', 'likert5', NULL, NULL),
  ('I enjoy participating in annual company traditions and ceremonies.', 'likert5', NULL, NULL),
  ('I want a job that aligns with standard corporate and societal norms.', 'likert5', NULL, NULL),
  ('I feel relaxed when my team follows standard, pre-approved guidelines.', 'likert5', NULL, NULL),
  ('I want to work in a firm that has a solid reputation for loyalty to employees.', 'likert5', NULL, NULL),
  ('I prefer projects that build on existing company successes rather than risky pivots.', 'likert5', NULL, NULL),
  ('I value working in teams where members respect seniority and experience.', 'likert5', NULL, NULL),
  ('I want a workspace that uses traditional and standardized office methods.', 'likert5', NULL, NULL),
  ('I feel motivated when I know my career matches established professional standards.', 'likert5', NULL, NULL),
  ('I enjoy reading about corporate history and institutional heritage.', 'likert5', NULL, NULL),
  ('I believe that respect for organizational tradition is key to stability.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Altruistic (Work Culture)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I prioritize mentoring and developing junior talent within my organization.', 'likert5', NULL, NULL),
  ('I value company strategies that balance profit with social and environmental impact.', 'likert5', NULL, NULL),
  ('I feel most successful when my team''s projects improve the lives of our clients.', 'likert5', NULL, NULL),
  ('I advocate for ethical corporate policies, even if they delay project timelines.', 'likert5', NULL, NULL),
  ('I want to lead corporate social responsibility (CSR) programs and charities.', 'likert5', NULL, NULL),
  ('I prefer working for organizations that have a clear mission to serve society.', 'likert5', NULL, NULL),
  ('I feel motivated when our products solve real-world problems for customers.', 'likert5', NULL, NULL),
  ('I value corporate transparency and open communication over internal competition.', 'likert5', NULL, NULL),
  ('I actively support diversity, equity, and inclusion initiatives in my department.', 'likert5', NULL, NULL),
  ('I enjoy volunteering my professional expertise for non-profit organizations.', 'likert5', NULL, NULL),
  ('I prefer working in environments where manager empathy is a core value.', 'likert5', NULL, NULL),
  ('I want my leadership legacy to be built on how I supported and grew my team.', 'likert5', NULL, NULL),
  ('I prioritize safety and well-being of employees above short-term business wins.', 'likert5', NULL, NULL),
  ('I want to design technologies that make education or healthcare more accessible.', 'likert5', NULL, NULL),
  ('I feel fulfilled when I help resolve conflicts between senior executives.', 'likert5', NULL, NULL),
  ('I want to work for a company that respects local communities and environments.', 'likert5', NULL, NULL),
  ('I prefer projects that address long-term community development.', 'likert5', NULL, NULL),
  ('I enjoy mentoring entrepreneurs and sharing my business experience for free.', 'likert5', NULL, NULL),
  ('I feel motivated when my company sponsors local social service programs.', 'likert5', NULL, NULL),
  ('I believe that corporate success is hollow if it does not contribute to the public good.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Affiliation (Collaboration)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I prefer working in highly collaborative, cross-functional project teams.', 'likert5', NULL, NULL),
  ('I value having close, friendly relationships with my fellow executives.', 'likert5', NULL, NULL),
  ('I feel motivated when my company culture encourages open networking.', 'likert5', NULL, NULL),
  ('I prioritize team consensus over pushing through my individual decisions.', 'likert5', NULL, NULL),
  ('I enjoy organizing and participating in executive team-building retreats.', 'likert5', NULL, NULL),
  ('I want to work in an organization that values collective success over solo wins.', 'likert5', NULL, NULL),
  ('I prefer solving corporate challenges through interactive workshops.', 'likert5', NULL, NULL),
  ('I feel energized when working in active, connected corporate environments.', 'likert5', NULL, NULL),
  ('I prioritize building strong client relationships and professional networks.', 'likert5', NULL, NULL),
  ('I want a leadership role that involves regular collaboration across departments.', 'likert5', NULL, NULL),
  ('I value having approachable, open-door relationships with senior executives.', 'likert5', NULL, NULL),
  ('I want to build a team culture that is warm, supportive, and inclusive.', 'likert5', NULL, NULL),
  ('I enjoy celebrating department milestones and employee achievements.', 'likert5', NULL, NULL),
  ('I prefer working in systems where team dynamics are regularly audited.', 'likert5', NULL, NULL),
  ('I want to participate in industry associations and corporate forums.', 'likert5', NULL, NULL),
  ('I feel motivated when my department acts as a cohesive unit.', 'likert5', NULL, NULL),
  ('I enjoy regular, informal syncs with colleagues to check on team health.', 'likert5', NULL, NULL),
  ('I want to lead projects that require coordinating diverse global teams.', 'likert5', NULL, NULL),
  ('I value organizations that have low levels of internal politics.', 'likert5', NULL, NULL),
  ('I believe that strong professional relationships are key to executive longevity.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Commerce (Business Drive)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I prioritize growing company revenue and profit margins above other metrics.', 'likert5', NULL, NULL),
  ('I want a position that offers high bonuses, stock options, and equity.', 'likert5', NULL, NULL),
  ('I enjoy managing budgets, analyzing financial reports, and cutting costs.', 'likert5', NULL, NULL),
  ('I feel motivated when my strategic decisions lead to high returns on investment.', 'likert5', NULL, NULL),
  ('I want a career in high-growth commercial sectors like tech or finance.', 'likert5', NULL, NULL),
  ('I prefer roles that involve business development, sales, or mergers.', 'likert5', NULL, NULL),
  ('I think corporate success is best measured by market share and valuation.', 'likert5', NULL, NULL),
  ('I want to lead negotiations for high-value client contracts.', 'likert5', NULL, NULL),
  ('I feel successful when my department exceeds its annual financial targets.', 'likert5', NULL, NULL),
  ('I enjoy reading about market trends, economics, and competitor growth.', 'likert5', NULL, NULL),
  ('I want to choose roles that offer maximum financial compensation.', 'likert5', NULL, NULL),
  ('I prefer working in environments where performance rewards are monetary.', 'likert5', NULL, NULL),
  ('I want to master financial strategies, pricing models, and valuation.', 'likert5', NULL, NULL),
  ('I enjoy pitch presentations to prospective corporate investors.', 'likert5', NULL, NULL),
  ('I feel motivated by executive perks, bonuses, and high-end benefits.', 'likert5', NULL, NULL),
  ('I want to manage high-budget business units and drive profitability.', 'likert5', NULL, NULL),
  ('I prefer positions where my output directly affects the company''s stock price.', 'likert5', NULL, NULL),
  ('I want to build new business models that disrupt existing commercial markets.', 'likert5', NULL, NULL),
  ('I enjoy analyzing marketing metrics and optimizing customer acquisition costs.', 'likert5', NULL, NULL),
  ('I believe that maximizing profit is the primary responsibility of business leaders.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Security (Career Stability)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I prefer long-term career stability over high-risk business ventures.', 'likert5', NULL, NULL),
  ('I want a reliable, predictable monthly compensation and bonus structure.', 'likert5', NULL, NULL),
  ('I prefer working in established multinational firms with low layoff records.', 'likert5', NULL, NULL),
  ('I value comprehensive health, life, and executive retirement plans.', 'likert5', NULL, NULL),
  ('I feel nervous about leaving a secure job to start a new business.', 'likert5', NULL, NULL),
  ('I prefer roles that have clear, stable, and documented job duties.', 'likert5', NULL, NULL),
  ('I feel motivated when my company has a structured and calm daily routine.', 'likert5', NULL, NULL),
  ('I want to work in an industry that is highly resilient to market cycles.', 'likert5', NULL, NULL),
  ('I prefer staying in one stable firm for many years over moving to startups.', 'likert5', NULL, NULL),
  ('I want a workplace that has transparent, fair, and documented policies.', 'likert5', NULL, NULL),
  ('I prefer having clear directions and performance metrics from the board.', 'likert5', NULL, NULL),
  ('I feel comfortable when corporate goals are set months in advance.', 'likert5', NULL, NULL),
  ('I want to choose a field where market disruption is unlikely to affect my role.', 'likert5', NULL, NULL),
  ('I prefer working in secure corporate offices rather than traveling constantly.', 'likert5', NULL, NULL),
  ('I feel relaxed when my team''s workload is predictable and steady.', 'likert5', NULL, NULL),
  ('I want a job that respects my weekends and personal boundaries.', 'likert5', NULL, NULL),
  ('I value having a safe, organized workspace with clear safety guidelines.', 'likert5', NULL, NULL),
  ('I prefer working for firms that have strong cash reserves.', 'likert5', NULL, NULL),
  ('I believe that career stability is the most critical foundation for my leadership.', 'likert5', NULL, NULL),
  ('I prefer roles that have standard, predictable timelines over chaotic pivots.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Power (Leadership & Impact)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want a position that gives me full authority over team hiring and budgets.', 'likert5', NULL, NULL),
  ('I feel motivated when I direct high-stakes corporate strategies.', 'likert5', NULL, NULL),
  ('I enjoy competing with other business units to deliver the best metrics.', 'likert5', NULL, NULL),
  ('I want an executive role that has significant influence over company policies.', 'likert5', NULL, NULL),
  ('I prefer roles where I am responsible for managing a large team.', 'likert5', NULL, NULL),
  ('I want to climb to C-suite levels (CEO, CFO, COO) in my company.', 'likert5', NULL, NULL),
  ('I feel energized when presenting my strategies to the board of directors.', 'likert5', NULL, NULL),
  ('I want to be known as a major leader of corporate transformations.', 'likert5', NULL, NULL),
  ('I enjoy leading negotiations and influencing key client stakeholders.', 'likert5', NULL, NULL),
  ('I want to control resources and distribute tasks across departments.', 'likert5', NULL, NULL),
  ('I feel successful when my department''s decisions set industry trends.', 'likert5', NULL, NULL),
  ('I want a career that allows me to represent the company publicly.', 'likert5', NULL, NULL),
  ('I enjoy leading mergers, acquisitions, or major expansions.', 'likert5', NULL, NULL),
  ('I prefer highly competitive environments that reward strong leadership.', 'likert5', NULL, NULL),
  ('I want to write company policies and set standard guidelines.', 'likert5', NULL, NULL),
  ('I feel motivated when I am given sole ownership of a new business unit.', 'likert5', NULL, NULL),
  ('I enjoy managing high-stakes client relationships and corporate accounts.', 'likert5', NULL, NULL),
  ('I prefer working in sectors where I can outpace my main competitors.', 'likert5', NULL, NULL),
  ('I believe that gaining authority and status is the best sign of success.', 'likert5', NULL, NULL),
  ('I want a leadership role that allows me to shape the future of the industry.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Recognition (Status & Prestige)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want to work for a company that has a famous, prestigious brand name.', 'likert5', NULL, NULL),
  ('I feel motivated when my accomplishments are publicly praised by executives.', 'likert5', NULL, NULL),
  ('I want a job title that denotes seniority, like Director or Vice President.', 'likert5', NULL, NULL),
  ('I enjoy receiving industry awards, certifications, and public honors.', 'likert5', NULL, NULL),
  ('I want to be featured in corporate newsletters, press releases, or news.', 'likert5', NULL, NULL),
  ('I feel successful when my team is ranked number one on corporate leaderboards.', 'likert5', NULL, NULL),
  ('I want to build a strong personal brand as an expert on networks like LinkedIn.', 'likert5', NULL, NULL),
  ('I enjoy speaking at industry panels, webinars, and national conferences.', 'likert5', NULL, NULL),
  ('I want a career where my research or systems are credited under my name.', 'likert5', NULL, NULL),
  ('I prefer high-profile roles that have executive status and visibility.', 'likert5', NULL, NULL),
  ('I want to win prestigious business awards in my specific industry.', 'likert5', NULL, NULL),
  ('I feel proud when clients write commendation letters about my leadership.', 'likert5', NULL, NULL),
  ('I want to work in a prominent, high-end corporate office in a major city.', 'likert5', NULL, NULL),
  ('I enjoy being selected as a key representative for board meetings.', 'likert5', NULL, NULL),
  ('I want to publish expert papers, books, or articles in business journals.', 'likert5', NULL, NULL),
  ('I feel motivated when my executive profile is highlighted on the company site.', 'likert5', NULL, NULL),
  ('I want my family to feel proud of my company and title.', 'likert5', NULL, NULL),
  ('I prefer high-profile projects that get noticed by senior shareholders.', 'likert5', NULL, NULL),
  ('I enjoy being introduced as an industry veteran or high-achieving leader.', 'likert5', NULL, NULL),
  ('I believe that professional status and recognition drive my motivation.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Science (Data & Analytics)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I prioritize data analysis and metric tracking over subjective intuition.', 'likert5', NULL, NULL),
  ('I want a leadership role that involves using cutting-edge technology.', 'likert5', NULL, NULL),
  ('I feel motivated when building software, code models, or automated tests.', 'likert5', NULL, NULL),
  ('I prefer making business decisions based on statistical data.', 'likert5', NULL, NULL),
  ('I want to work in technology-driven fields like engineering or IT.', 'likert5', NULL, NULL),
  ('I enjoy learning how new corporate tech tools work under the hood.', 'likert5', NULL, NULL),
  ('I prefer roles where I automate manual workflows using scripting.', 'likert5', NULL, NULL),
  ('I enjoy researching technical papers and corporate data studies.', 'likert5', NULL, NULL),
  ('I want to manage teams that build databases, software, or machinery.', 'likert5', NULL, NULL),
  ('I feel energized when solving complex analytical or logical challenges.', 'likert5', NULL, NULL),
  ('I want to build a career as a technical manager or systems architect.', 'likert5', NULL, NULL),
  ('I enjoy attending technology summits, hackathons, or tech forums.', 'likert5', NULL, NULL),
  ('I prefer working in sectors like fintech, biotech, or clean energy.', 'likert5', NULL, NULL),
  ('I want to design algorithms that optimize logistics and supply chains.', 'likert5', NULL, NULL),
  ('I feel satisfied when I build an automated system that monitors business metrics.', 'likert5', NULL, NULL),
  ('I enjoy reading about machine learning, artificial intelligence, and data tech.', 'likert5', NULL, NULL),
  ('I prefer jobs where the main tasks require scientific reasoning.', 'likert5', NULL, NULL),
  ('I want to write technical design manuals or system requirements.', 'likert5', NULL, NULL),
  ('I enjoy learning new programming languages or software tools.', 'likert5', NULL, NULL),
  ('I believe that data-driven, logical thinking is the key to corporate growth.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Aesthetics (Innovation & Design)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want to lead projects that design visually appealing products or interfaces.', 'likert5', NULL, NULL),
  ('I enjoy reviewing and polishing graphic designs, reports, and templates.', 'likert5', NULL, NULL),
  ('I prefer working in fields like UI/UX design, marketing, or branding.', 'likert5', NULL, NULL),
  ('I feel motivated when I create art, write copy, or design websites.', 'likert5', NULL, NULL),
  ('I want to work in visually stunning office environments with modern art.', 'likert5', NULL, NULL),
  ('I enjoy editing videos, making graphics, or designing presentation layouts.', 'likert5', NULL, NULL),
  ('I prefer roles that require creative thinking and artistic expression.', 'likert5', NULL, NULL),
  ('I enjoy visiting design fairs, museum galleries, and architecture expos.', 'likert5', NULL, NULL),
  ('I want to design brand logos, product packaging, or advertising campaigns.', 'likert5', NULL, NULL),
  ('I feel satisfied when I customize my digital workspace to look elegant.', 'likert5', NULL, NULL),
  ('I want to learn about design principles, typography, and color theory.', 'likert5', NULL, NULL),
  ('I enjoy writing creative stories, press releases, or marketing copy.', 'likert5', NULL, NULL),
  ('I want to work with creative professionals like designers, artists, or writers.', 'likert5', NULL, NULL),
  ('I feel proud when clients compliment the aesthetic appeal of our projects.', 'likert5', NULL, NULL),
  ('I prefer working on branding guidelines and creative standards.', 'likert5', NULL, NULL),
  ('I enjoy brainstorming visual themes for company events or product launches.', 'likert5', NULL, NULL),
  ('I want to build a career in media production, photography, or copywriting.', 'likert5', NULL, NULL),
  ('I prefer tasks where I can experiment with visual styles and formats.', 'likert5', NULL, NULL),
  ('I feel inspired by companies that make design a primary competitive advantage.', 'likert5', NULL, NULL),
  ('I believe that aesthetic appeal is crucial for product and service success.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Hedonism (Work-Life Harmony)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I prioritize personal well-being and family time over career advancement.', 'likert5', NULL, NULL),
  ('I want an executive role that respects my boundaries and personal time.', 'likert5', NULL, NULL),
  ('I prefer companies that offer flexible start/end times and remote work.', 'likert5', NULL, NULL),
  ('I want a job that has low stress levels and avoids working late.', 'likert5', NULL, NULL),
  ('I value having time to travel, exercise, and socialize after work.', 'likert5', NULL, NULL),
  ('I prefer roles that offer standard, predictable working hours.', 'likert5', NULL, NULL),
  ('I want a workplace that provides recreational areas, games, and snacks.', 'likert5', NULL, NULL),
  ('I feel energized when my company organizes fun social events and fests.', 'likert5', NULL, NULL),
  ('I want to work in location-independent roles like digital nomad setups.', 'likert5', NULL, NULL),
  ('I enjoy taking regular breaks during my work hours to clear my mind.', 'likert5', NULL, NULL),
  ('I prefer a relaxed, dress-down office environment over formal wear.', 'likert5', NULL, NULL),
  ('I want a job that does not require taking phone calls on weekends.', 'likert5', NULL, NULL),
  ('I feel proud when I maintain a healthy work-life balance.', 'likert5', NULL, NULL),
  ('I want to work in a culture that values happiness and fun.', 'likert5', NULL, NULL),
  ('I enjoy taking long weekends and planning outdoor adventure trips.', 'likert5', NULL, NULL),
  ('I prefer working in creative, informal spaces over traditional cubicles.', 'likert5', NULL, NULL),
  ('I want a job that offers health, fitness, and wellness allowances.', 'likert5', NULL, NULL),
  ('I enjoy light-hearted chat with colleagues rather than serious politics.', 'likert5', NULL, NULL),
  ('I feel refreshed when I separate my work life from my personal time.', 'likert5', NULL, NULL),
  ('I believe that personal happiness and lifestyle are more important than job titles.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

with st as (
  insert into sub_traits (parameter_id, name)
  select bp.id, 'Tradition (Organizational Loyalty)'
  from blueprint_parameters bp
  join journeys j on j.id = bp.journey_id
  where j.code = 'leadership_excellence' and bp.name = 'Work Values'
  on conflict (parameter_id, name) do update set name = excluded.name
  returning id
)
insert into questions (sub_trait_id, question_text, question_type, options, correct_answer)
select st.id, v.question_text, v.question_type, v.options, v.correct_answer
from st, (values
  ('I want to work for a company that has a long history and strong heritage.', 'likert5', NULL, NULL),
  ('I prefer working in organizations with clear hierarchy and respect for authority.', 'likert5', NULL, NULL),
  ('I feel comfortable when there are established procedures for every task.', 'likert5', NULL, NULL),
  ('I value loyalty and want to stay with one company for a long time.', 'likert5', NULL, NULL),
  ('I want to work in industries with stable regulations, like banking or law.', 'likert5', NULL, NULL),
  ('I prefer learning from experienced senior leaders who follow proven methods.', 'likert5', NULL, NULL),
  ('I feel secure when my company has a clear code of conduct and values.', 'likert5', NULL, NULL),
  ('I want to work in a culture that respects traditional business models.', 'likert5', NULL, NULL),
  ('I prefer roles that have predictable duties over constantly changing tasks.', 'likert5', NULL, NULL),
  ('I value having a structured career path with clear tenure-based promotions.', 'likert5', NULL, NULL),
  ('I enjoy participating in annual company traditions and ceremonies.', 'likert5', NULL, NULL),
  ('I want a job that aligns with standard corporate and societal norms.', 'likert5', NULL, NULL),
  ('I feel relaxed when my team follows standard, pre-approved guidelines.', 'likert5', NULL, NULL),
  ('I want to work in a firm that has a solid reputation for loyalty to employees.', 'likert5', NULL, NULL),
  ('I prefer projects that build on existing company successes rather than risky pivots.', 'likert5', NULL, NULL),
  ('I value working in teams where members respect seniority and experience.', 'likert5', NULL, NULL),
  ('I want a workspace that uses traditional and standardized office methods.', 'likert5', NULL, NULL),
  ('I feel motivated when I know my career matches established professional standards.', 'likert5', NULL, NULL),
  ('I enjoy reading about corporate history and institutional heritage.', 'likert5', NULL, NULL),
  ('I believe that respect for organizational tradition is key to stability.', 'likert5', NULL, NULL)
) as v(question_text, question_type, options, correct_answer);

commit;
-- Total questions seeded: 4492