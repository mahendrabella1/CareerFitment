/**
 * Class 8 Assessment Questions
 * 60 questions across 8 dimensions
 * Source: class8sheet.xlsx
 */

export interface AssessmentQuestion {
  id: number;
  question: string;
  dimension: string;
  options: string[];
  hint?: string;
}

export const CLASS8_QUESTIONS: AssessmentQuestion[] = [
  // ========== DIMENSION 1: PERSONALITY PREFERENCES (Q1-Q10) ==========
  // 4 options each: A, B, C, D
  {
    id: 1,
    question: 'In a group project, you usually:',
    dimension: 'Personality',
    options: [
      'Take charge and lead the team forward',
      'Focus on keeping the team harmonious and supportive',
      'Analyze the task and plan the best approach',
      'Bring creative ideas and new perspectives',
    ],
  },
  {
    id: 2,
    question: 'When plans change suddenly, you tend to:',
    dimension: 'Personality',
    options: [
      'Quickly adapt and take immediate action',
      'Consider how it affects team morale and cooperation',
      'Carefully evaluate the new situation and implications',
      'See it as an opportunity for innovation and change',
    ],
  },
  {
    id: 3,
    question: 'At a party, you are most likely to:',
    dimension: 'Personality',
    options: [
      'Be the center of attention and energize others',
      'Make everyone feel comfortable and included',
      'Have deep conversations with a few people',
      'Observe and notice creative details around you',
    ],
  },
  {
    id: 4,
    question: 'When solving a problem, you prefer to:',
    dimension: 'Personality',
    options: [
      'Act decisively and find quick solutions',
      'Work collaboratively with others for input',
      'Analyze all angles before deciding',
      'Think outside the box for creative solutions',
    ],
  },
  {
    id: 5,
    question: 'Your ideal weekend looks like:',
    dimension: 'Personality',
    options: [
      'Doing exciting activities and staying active',
      'Spending quality time with family and friends',
      'Reading, learning, or working on projects alone',
      'Exploring new places or trying creative hobbies',
    ],
  },
  {
    id: 6,
    question: 'When receiving feedback, you:',
    dimension: 'Personality',
    options: [
      'Listen briefly and move on to action',
      'Consider how others feel about your work',
      'Ask detailed questions to understand specifics',
      'Think about how to improve and innovate',
    ],
  },
  {
    id: 7,
    question: 'In conflicts, you usually:',
    dimension: 'Personality',
    options: [
      'Take control and find a solution quickly',
      'Try to find a win-win that satisfies everyone',
      'Look at facts and logical outcomes',
      'Look for creative compromises',
    ],
  },
  {
    id: 8,
    question: 'You feel most energized when:',
    dimension: 'Personality',
    options: [
      'Achieving goals and winning',
      'Helping others and making a difference',
      'Understanding how things work',
      'Creating something new and beautiful',
    ],
  },
  {
    id: 9,
    question: 'When making big decisions, you rely most on:',
    dimension: 'Personality',
    options: [
      'Your instinct and confidence',
      'Input from people you trust',
      'Logic and careful analysis',
      'Imagination and possibilities',
    ],
  },
  {
    id: 10,
    question: 'People would describe you as more:',
    dimension: 'Personality',
    options: [
      'Bold and commanding',
      'Kind and supportive',
      'Thoughtful and precise',
      'Creative and imaginative',
    ],
  },

  // ========== DIMENSION 2: RIASEC CAREER INTERESTS (Q11-Q20) ==========
  // 5 options each: A, B, C, D, E
  {
    id: 11,
    question: 'Which task would you enjoy most?',
    dimension: 'RIASEC',
    options: [
      'Building or fixing something with your hands',
      'Researching and discovering new information',
      'Creating art, music, or design',
      'Helping someone solve a personal problem',
      'Starting a business or leading a team',
    ],
  },
  {
    id: 12,
    question: 'In a future job, you would prefer to spend time:',
    dimension: 'RIASEC',
    options: [
      'Working with tools, machines, or equipment',
      'Analyzing data, solving puzzles, or experimenting',
      'Performing, creating, or expressing yourself',
      'Teaching, mentoring, or supporting others',
      'Persuading, negotiating, or making deals',
    ],
  },
  {
    id: 13,
    question: 'Which school subject feels most natural to you?',
    dimension: 'RIASEC',
    options: [
      'Physical Education, Shop, or Technical classes',
      'Science, Math, or Computer classes',
      'Art, Music, Drama, or Literature',
      'Social Studies, Health, or Psychology',
      'Business, Economics, or Public Speaking',
    ],
  },
  {
    id: 14,
    question: 'You feel most proud when you:',
    dimension: 'RIASEC',
    options: [
      'Build or repair something successfully',
      'Discover a solution to a complex problem',
      'Create something beautiful or meaningful',
      'Help someone and make them feel better',
      'Achieve a goal or win something',
    ],
  },
  {
    id: 15,
    question: 'Your ideal work environment is:',
    dimension: 'RIASEC',
    options: [
      'Hands-on, practical, and action-oriented',
      'Quiet and focused for analysis and thinking',
      'Creative and expressive with freedom',
      'Warm and collaborative with good teamwork',
      'Dynamic and competitive with opportunities to lead',
    ],
  },
  {
    id: 16,
    question: 'Which project sounds most exciting to you?',
    dimension: 'RIASEC',
    options: [
      'Fix a broken car or build something from scratch',
      'Conduct a scientific experiment or code a program',
      'Create a short film, design, or write a story',
      'Organize a charity event or support group activity',
      'Plan a startup or develop a marketing strategy',
    ],
  },
  {
    id: 17,
    question: 'You like tasks that involve:',
    dimension: 'RIASEC',
    options: [
      'Physical activity and practical skills',
      'Thinking, reasoning, and problem-solving',
      'Imagination, originality, and self-expression',
      'Empathy, communication, and relationships',
      'Strategy, leadership, and influence',
    ],
  },
  {
    id: 18,
    question: 'When choosing electives, you lean toward:',
    dimension: 'RIASEC',
    options: [
      'Engineering, Trades, or Automotive',
      'STEM electives or Computer Science',
      'Visual Arts, Music, Drama, or Creative Writing',
      'Counseling, Community Service, or Coaching',
      'Business, Entrepreneurship, or Leadership',
    ],
  },
  {
    id: 19,
    question: 'You would rather be known as someone who:',
    dimension: 'RIASEC',
    options: [
      'Can fix or build anything',
      'Is brilliant and understands everything',
      'Is artistic and brings beauty to the world',
      'Cares and helps people',
      'Is ambitious and successful',
    ],
  },
  {
    id: 20,
    question: 'Long-term, you see yourself in a role that is mainly:',
    dimension: 'RIASEC',
    options: [
      'Technical or trade-based',
      'Research or science-based',
      'Creative or artistic',
      'Social service or people-oriented',
      'Business or leadership-focused',
    ],
  },

  // ========== DIMENSION 3: APTITUDE & REASONING (Q21-Q30) ==========
  // 4 options each: A, B, C, D
  {
    id: 21,
    question: 'What is the next number in this sequence? 3, 6, 12, 24, ...',
    dimension: 'Aptitude',
    options: ['36', '48', '50', '60'],
    hint: 'Look at how each number relates to the previous one',
  },
  {
    id: 22,
    question: 'All roses are flowers. Some flowers fade quickly. Therefore:',
    dimension: 'Aptitude',
    options: [
      'All roses fade quickly',
      'Some roses fade quickly',
      'Some roses may not fade quickly',
      'No roses fade quickly',
    ],
  },
  {
    id: 23,
    question: 'A train travels at 60 km/h for 2.5 hours. How far does it travel?',
    dimension: 'Aptitude',
    options: ['120 km', '150 km', '180 km', '200 km'],
  },
  {
    id: 24,
    question: 'Which one does not belong with the others?',
    dimension: 'Aptitude',
    options: ['Apple', 'Carrot', 'Banana', 'Orange'],
    hint: 'Think about categories',
  },
  {
    id: 25,
    question: 'If BOOK → CPPL, then PEN → ?',
    dimension: 'Aptitude',
    options: ['QFO', 'OFN', 'QDM', 'RFO'],
    hint: 'Look at the letter pattern',
  },
  {
    id: 26,
    question: 'What is the next number? 2, 3, 5, 8, 12, ...',
    dimension: 'Aptitude',
    options: ['16', '17', '18', '20'],
    hint: 'Look at the differences between consecutive numbers',
  },
  {
    id: 27,
    question: 'A bag contains 4 red balls and 6 blue balls. What is the probability of drawing a red ball?',
    dimension: 'Aptitude',
    options: ['0.2', '0.4', '0.6', '0.8'],
  },
  {
    id: 28,
    question: 'If all A are B, and some B are C, then:',
    dimension: 'Aptitude',
    options: [
      'All A are C',
      'Some A are C',
      'Some A may be C',
      'No A are C',
    ],
  },
  {
    id: 29,
    question: 'What shape comes next? Triangle, Square, Pentagon, ...',
    dimension: 'Aptitude',
    options: ['Hexagon', 'Heptagon', 'Octagon', 'Nonagon'],
    hint: 'Look at the number of sides',
  },
  {
    id: 30,
    question: 'You have 3 different shirts and 2 different pants. How many outfits can you make?',
    dimension: 'Aptitude',
    options: ['5', '6', '9', '12'],
  },

  // ========== DIMENSION 4: MULTIPLE INTELLIGENCE (Q31-Q38) ==========
  // 5 options each: A, B, C, D, E
  {
    id: 31,
    question: 'You feel strongest when you are:',
    dimension: 'StrengthDomains',
    options: [
      'Writing, speaking, or reading',
      'Solving math problems or analyzing patterns',
      'Drawing, designing, or visualizing',
      'Playing sports, dancing, or moving',
      'Playing music or noticing sounds',
    ],
  },
  {
    id: 32,
    question: 'In group work, your main strength is:',
    dimension: 'StrengthDomains',
    options: [
      'Communicating clearly and explaining ideas',
      'Problem-solving and logical thinking',
      'Creating visual plans or designs',
      'Managing group activities or hands-on tasks',
      'Bringing rhythm and harmony to the team',
    ],
  },
  {
    id: 33,
    question: 'You would rather spend free time:',
    dimension: 'StrengthDomains',
    options: [
      'Reading books or writing stories',
      'Doing puzzles or math challenges',
      'Sketching or creating visual art',
      'Exercising or playing sports',
      'Listening to music or learning an instrument',
    ],
  },
  {
    id: 34,
    question: 'When learning something new, you prefer to:',
    dimension: 'StrengthDomains',
    options: [
      'Read instructions or listen to explanations',
      'Understand the logic and reasoning behind it',
      'See examples and visualize the concept',
      'Practice and get hands-on experience',
      'Notice patterns and rhythmic elements',
    ],
  },
  {
    id: 35,
    question: 'Among your friends, you are known for being:',
    dimension: 'StrengthDomains',
    options: [
      'Good at talking and expressing yourself',
      'Logical and able to figure things out',
      'Creative with good imagination',
      'Athletic and physically coordinated',
      'Musical or having good taste in music',
    ],
  },
  {
    id: 36,
    question: 'You would enjoy a career involving:',
    dimension: 'StrengthDomains',
    options: [
      'Writing, teaching, or public speaking',
      'Engineering, programming, or research',
      'Design, architecture, or visual arts',
      'Athletics, dance, or physical work',
      'Music, sound design, or performance',
    ],
  },
  {
    id: 37,
    question: 'Your ideal subject or skill to develop is:',
    dimension: 'StrengthDomains',
    options: [
      'Literature or foreign languages',
      'Mathematics or computer science',
      'Digital art or graphic design',
      'Physical training or sports',
      'Music theory or instrument playing',
    ],
  },
  {
    id: 38,
    question: 'You feel most fulfilled when:',
    dimension: 'StrengthDomains',
    options: [
      'Expressing your ideas clearly to others',
      'Discovering how something works',
      'Creating something beautiful to look at',
      'Accomplishing a physical challenge',
      'Creating music or appreciating performance',
    ],
  },

  // ========== DIMENSION 5: MOTIVATORS (Q39-Q45) ==========
  {
    id: 39,
    question: 'What drives you the most?',
    dimension: 'Motivators',
    options: [
      'Achieving goals and being successful',
      'Learning new things and understanding more',
      'Helping others and making a difference',
      'Having freedom to do things your own way',
      'Being in charge and leading others',
    ],
  },
  {
    id: 40,
    question: 'You would feel most satisfied if you:',
    dimension: 'Motivators',
    options: [
      'Reached an important goal',
      'Discovered something new',
      'Made someone happy or solved their problem',
      'Had the flexibility to work on your own terms',
      'Were recognized as a leader',
    ],
  },
  {
    id: 41,
    question: 'What concerns you most about your future?',
    dimension: 'Motivators',
    options: [
      'Not being successful or achieving enough',
      'Not having opportunities to learn and grow',
      'Not being able to help others',
      'Losing your independence or freedom',
      'Not having influence or respect',
    ],
  },
  {
    id: 42,
    question: 'You prefer a life that is:',
    dimension: 'Motivators',
    options: [
      'Ambitious and filled with achievements',
      'Exciting with new discoveries',
      'Meaningful and impactful for others',
      'Flexible and independent',
      'Prominent and influential',
    ],
  },
  {
    id: 43,
    question: 'In a job, you would value most:',
    dimension: 'Motivators',
    options: [
      'High salary and recognition',
      'Interesting work and skill development',
      'Making a positive social impact',
      'Work-life balance and autonomy',
      'Opportunities to manage and lead',
    ],
  },
  {
    id: 44,
    question: 'You get frustrated when:',
    dimension: 'Motivators',
    options: [
      'You fail or fall short of your goals',
      'You are not learning or growing',
      'You see others suffering needlessly',
      'Others restrict your freedom',
      'Your contributions are not recognized',
    ],
  },
  {
    id: 45,
    question: 'Your ideal future includes:',
    dimension: 'Motivators',
    options: [
      'Major personal achievements',
      'Continuous learning and mastery',
      'Helping build a better world',
      'Living life on your own terms',
      'Leading and influencing others',
    ],
  },

  // ========== DIMENSION 6: LEARNING STYLE (Q46-Q50) ==========
  // 4 options each: A, B, C, D
  {
    id: 46,
    question: 'You learn best by:',
    dimension: 'LearningStyle',
    options: [
      'Seeing diagrams, charts, and visual demonstrations',
      'Listening to explanations and discussions',
      'Reading notes and written materials',
      'Doing hands-on practice and experiments',
    ],
  },
  {
    id: 47,
    question: 'When studying, you prefer:',
    dimension: 'LearningStyle',
    options: [
      'Using color-coded notes and mind maps',
      'Study groups and verbal review',
      'Textbooks and written summaries',
      'Interactive activities and real-world examples',
    ],
  },
  {
    id: 48,
    question: 'If you forget something, you usually:',
    dimension: 'LearningStyle',
    options: [
      'Try to visualize or draw it',
      'Say it aloud or discuss it with someone',
      'Look it up in your notes or reference materials',
      'Demonstrate it or practice it again',
    ],
  },
  {
    id: 49,
    question: 'You enjoy classes where the teacher:',
    dimension: 'LearningStyle',
    options: [
      'Uses videos, slides, and visual aids',
      'Explains clearly and allows questions',
      'Provides detailed readings and handouts',
      'Includes experiments, projects, and activities',
    ],
  },
  {
    id: 50,
    question: 'For a new skill, you would rather:',
    dimension: 'LearningStyle',
    options: [
      'Watch a video tutorial',
      'Have someone teach you step-by-step',
      'Read the instruction manual',
      'Jump in and learn by trying',
    ],
  },

  // ========== DIMENSION 7: EMOTIONAL & SOCIAL AWARENESS (Q51-Q55) ==========
  // 4 options each: A, B, C, D
  {
    id: 51,
    question: 'You are most aware of:',
    dimension: 'EmotionalAwareness',
    options: [
      'Your own emotions and feelings',
      'How others are feeling around you',
      'Managing emotions in difficult situations',
      'Building strong relationships with others',
    ],
  },
  {
    id: 52,
    question: 'When someone is upset, you:',
    dimension: 'EmotionalAwareness',
    options: [
      'Recognize something is wrong with them',
      'Understand what they might be feeling',
      'Help them manage their emotions',
      'Know how to comfort and support them',
    ],
  },
  {
    id: 53,
    question: 'You handle stress by:',
    dimension: 'EmotionalAwareness',
    options: [
      'Understanding why you feel stressed',
      'Talking to someone who understands you',
      'Managing your emotions consciously',
      'Seeking support from people you trust',
    ],
  },
  {
    id: 54,
    question: 'In conflicts, you:',
    dimension: 'EmotionalAwareness',
    options: [
      'Understand your own feelings first',
      'Understand the other person's perspective',
      'Control your emotions and respond calmly',
      'Work to restore trust and connection',
    ],
  },
  {
    id: 55,
    question: 'With friends, you are known for:',
    dimension: 'EmotionalAwareness',
    options: [
      'Being in touch with your feelings',
      'Understanding and caring for others',
      'Staying calm and composed',
      'Being loyal and trustworthy',
    ],
  },

  // ========== DIMENSION 8: CREATIVITY & FUTURE READINESS (Q56-Q60) ==========
  // 4 options each: A, B, C, D
  {
    id: 56,
    question: 'When facing a problem, you usually:',
    dimension: 'Creativity',
    options: [
      'Think of many different solutions',
      'Stay calm and adapt to the situation',
      'Come up with something completely new',
      'Think about how it affects the future',
    ],
  },
  {
    id: 57,
    question: 'You are best at:',
    dimension: 'Creativity',
    options: [
      'Solving problems in practical ways',
      'Adjusting when things change unexpectedly',
      'Creating or inventing new ideas',
      'Planning for future success',
    ],
  },
  {
    id: 58,
    question: 'When things do not go as planned, you:',
    dimension: 'Creativity',
    options: [
      'Find another way to solve it',
      'Adjust your approach without hesitation',
      'See it as a chance to innovate',
      'Learn from it for future situations',
    ],
  },
  {
    id: 59,
    question: 'You like to:',
    dimension: 'Creativity',
    options: [
      'Work through problems systematically',
      'Quickly shift between different tasks',
      'Explore new and unconventional ideas',
      'Anticipate and prepare for what is coming',
    ],
  },
  {
    id: 60,
    question: 'Your approach to life is mostly:',
    dimension: 'Creativity',
    options: [
      'Thoughtful and methodical',
      'Flexible and open to change',
      'Creative and experimental',
      'Forward-thinking and strategic',
    ],
  },
];

export const DIMENSION_ORDER = [
  'Personality',
  'RIASEC',
  'Aptitude',
  'StrengthDomains',
  'Motivators',
  'LearningStyle',
  'EmotionalAwareness',
  'Creativity',
];

export const DIMENSION_LABELS = {
  Personality: 'Personality Preferences',
  RIASEC: 'Career Interests',
  Aptitude: 'Aptitude & Reasoning',
  StrengthDomains: 'Strength Domains',
  Motivators: 'Motivators & Values',
  LearningStyle: 'Learning Style',
  EmotionalAwareness: 'Emotional Awareness',
  Creativity: 'Creativity & Future Readiness',
};

export const DIMENSION_DESCRIPTIONS = {
  Personality: 'Understand your work style and preferences',
  RIASEC: 'Discover career interests aligned with your passions',
  Aptitude: 'Assess your reasoning and problem-solving abilities',
  StrengthDomains: 'Identify your natural intelligences and strengths',
  Motivators: 'Learn what drives and motivates you',
  LearningStyle: 'Find out how you learn best',
  EmotionalAwareness: 'Explore your emotional and social skills',
  Creativity: 'Assess your creative thinking and adaptability',
};

export const QUESTIONS_PER_DIMENSION = {
  Personality: { start: 1, end: 10, count: 10 },
  RIASEC: { start: 11, end: 20, count: 10 },
  Aptitude: { start: 21, end: 30, count: 10 },
  StrengthDomains: { start: 31, end: 38, count: 8 },
  Motivators: { start: 39, end: 45, count: 7 },
  LearningStyle: { start: 46, end: 50, count: 5 },
  EmotionalAwareness: { start: 51, end: 55, count: 5 },
  Creativity: { start: 56, end: 60, count: 5 },
};
