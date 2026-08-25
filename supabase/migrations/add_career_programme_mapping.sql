-- Create degree families table
CREATE TABLE IF NOT EXISTS degree_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create programmes table
CREATE TABLE IF NOT EXISTS programmes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  degree_family_id UUID NOT NULL REFERENCES degree_families(id),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stream groups table (PCM, PCB, PCMB, Commerce, Humanities, Vocational)
CREATE TABLE IF NOT EXISTS stream_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create programme stream eligibility mapping
CREATE TABLE IF NOT EXISTS programme_stream_eligibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mapping_id TEXT NOT NULL UNIQUE,
  programme_id UUID NOT NULL REFERENCES programmes(id),
  stream_group_id UUID NOT NULL REFERENCES stream_groups(id),
  eligibility_status TEXT NOT NULL CHECK (eligibility_status IN ('GREEN', 'YELLOW', 'RED', 'GREEN_YELLOW', 'RED_YELLOW')),
  status_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(programme_id, stream_group_id)
);

-- Seed degree families
INSERT INTO degree_families (name, description) VALUES
  ('Engineering & Technology', 'B.Tech and Engineering programmes'),
  ('Architecture & Planning', 'Architecture, Planning, and Design programmes'),
  ('Computer & IT Pathways', 'Computer Science and IT-related programmes'),
  ('Medical & Health Sciences', 'Medical, Dental, and Allied Health programmes'),
  ('Pure Sciences', 'Physics, Chemistry, Mathematics, and Science specializations'),
  ('Agriculture & Allied Sciences', 'Agriculture, Forestry, and Agricultural Technology'),
  ('Commerce & Management', 'Commerce and Business Management programmes'),
  ('Professional Commerce', 'CA, CS, CMA, and professional qualifications'),
  ('Law', 'Law and Legal Studies programmes'),
  ('Humanities & Social Sciences', 'Arts and Social Sciences programmes'),
  ('Design', 'Design and Creative programmes')
ON CONFLICT (name) DO NOTHING;

-- Seed stream groups
INSERT INTO stream_groups (code, name, description) VALUES
  ('PCM', 'Physics, Chemistry, Mathematics', 'Science stream with Mathematics focus'),
  ('PCB', 'Physics, Chemistry, Biology', 'Science stream with Biology/Medical focus'),
  ('PCMB', 'Physics, Chemistry, Math & Biology', 'Combined science stream'),
  ('Commerce', 'Commerce Stream', 'Commerce without Mathematics'),
  ('Commerce_Math', 'Commerce with Mathematics', 'Commerce with Mathematics'),
  ('Commerce_No_Math', 'Commerce without Mathematics', 'Commerce without Mathematics'),
  ('Humanities', 'Humanities Stream', 'Arts/Humanities without Mathematics'),
  ('Humanities_Math', 'Humanities with Mathematics', 'Arts/Humanities with Mathematics'),
  ('Humanities_No_Math', 'Humanities without Mathematics', 'Arts/Humanities without Mathematics'),
  ('Vocational', 'Vocational Stream', 'Vocational/Skill-based education')
ON CONFLICT (code) DO NOTHING;

-- Function to get degree family ID
CREATE OR REPLACE FUNCTION get_or_create_degree_family(p_name TEXT) RETURNS UUID AS $$
  INSERT INTO degree_families (name) VALUES (p_name)
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id;
$$ LANGUAGE SQL;

-- Function to get programme ID
CREATE OR REPLACE FUNCTION get_or_create_programme(p_name TEXT, p_family_id UUID) RETURNS UUID AS $$
  INSERT INTO programmes (name, degree_family_id) VALUES (p_name, p_family_id)
  ON CONFLICT (name) DO UPDATE SET degree_family_id = EXCLUDED.degree_family_id
  RETURNING id;
$$ LANGUAGE SQL;

-- Function to get stream group ID
CREATE OR REPLACE FUNCTION get_stream_group_id(p_code TEXT) RETURNS UUID AS $$
  SELECT id FROM stream_groups WHERE code = p_code LIMIT 1;
$$ LANGUAGE SQL;

-- Note: The actual data import from CSV should be done via:
-- COPY programme_stream_eligibility (mapping_id, programme_id, stream_group_id, eligibility_status)
-- FROM STDIN
-- This allows mapping the CSV columns to the database structure properly
