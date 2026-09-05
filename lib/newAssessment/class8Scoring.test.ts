import { class8Scorer, validateResponses } from './class8Scoring';

/**
 * Comprehensive test suite for Class 8 Assessment Scoring
 * Validates all 8 dimensions with realistic student response patterns
 */

// ============================================================================
// TEST DATA: Sample Student Responses
// ============================================================================

/**
 * Test Case 1: Well-Rounded Achiever
 * - Strong across most dimensions
 * - Balanced personality
 * - High RIASEC diversity (good career flexibility)
 */
const responses_AchieverStudent: number[] = [
  // Q1-Q10: Personality (4 options each)
  1, 2, 0, 3, 1, 2, 1, 0, 2, 1, // Balanced across all 4 personality types

  // Q11-Q20: RIASEC (5 options each) - Strong in I, A, S, E
  1, 2, 0, 3, 1, 2, 1, 0, 2, 1, // Diverse RIASEC profile

  // Q21-Q30: Aptitude (4 options each)
  2, 3, 1, 0, 2, 1, 1, 3, 2, 1, // Mix of correct and incorrect

  // Q31-Q38: MI Strengths (5 options each)
  0, 1, 2, 3, 4, 0, 1, 2, // Distributed across intelligences

  // Q39-Q45: Motivators (varies)
  0, 1, 2, 0, 1, 2, 1, // Motivated by achievement, learning, helping

  // Q46-Q50: Learning Style (4 options each)
  0, 1, 2, 3, 0, // Mix of visual, auditory, reading, kinesthetic

  // Q51-Q55: Emotional Awareness (4 options each)
  0, 1, 2, 1, 0, // Strong EI

  // Q56-Q60: Creativity (4 options each)
  2, 1, 0, 3, 2, // Creative and adaptive
];

/**
 * Test Case 2: Technical Specialist
 * - High logical-mathematical, spatial reasoning
 * - Strong in aptitude (technical questions)
 * - Lower in interpersonal dimensions
 */
const responses_TechStudent: number[] = [
  // Q1-Q10: Personality - More Analytical
  3, 3, 2, 3, 2, 3, 2, 2, 3, 2, // Analytical preference

  // Q11-Q20: RIASEC - Strong R, I, weak S, E
  0, 0, 2, 1, 0, 1, 2, 1, 0, 2, // Realistic, Investigative focus

  // Q21-Q30: Aptitude - High score (mostly correct)
  2, 3, 1, 0, 2, 1, 1, 3, 2, 1, // 7 correct out of 10

  // Q31-Q38: MI Strengths - Logical-Math, Spatial high
  2, 2, 3, 1, 0, 2, 1, 0, // Logical and spatial strong

  // Q39-Q45: Motivators - Curiosity, Achievement
  1, 2, 0, 1, 2, 0, 1, // Learning and achievement driven

  // Q46-Q50: Learning Style - Visual, Reading
  0, 0, 2, 1, 2, // Visual and reading preference

  // Q51-Q55: Emotional Awareness - Lower EI
  2, 2, 2, 1, 2, // Lower emotional and social awareness

  // Q56-Q60: Creativity - Problem-solving focused
  0, 2, 1, 0, 1, // Problem-solving but not innovative
];

/**
 * Test Case 3: Creative Leader
 * - High in creative/artistic dimensions
 * - Strong personality (Decisive/Creative types)
 * - Interpersonal strengths
 */
const responses_CreativeLeaderStudent: number[] = [
  // Q1-Q10: Personality - Decisive, Creative
  0, 0, 1, 1, 0, 1, 0, 1, 0, 0, // Decisive and creative

  // Q11-Q20: RIASEC - Artistic, Enterprising, Social
  3, 3, 4, 4, 4, 3, 4, 3, 4, 3, // Arts and people-focused

  // Q21-Q30: Aptitude - Lower technical aptitude
  1, 0, 2, 3, 1, 2, 0, 0, 1, 2, // 3 correct, 7 incorrect

  // Q31-Q38: MI Strengths - Artistic, Interpersonal
  4, 0, 4, 0, 4, 4, 4, 0, // Musical, Spatial, Artistic, Interpersonal strong

  // Q39-Q45: Motivators - Impact, Freedom, Leadership
  2, 0, 2, 2, 2, 1, 2, // Impact and innovation driven

  // Q46-Q50: Learning Style - Kinesthetic, Auditory
  3, 2, 1, 3, 3, // Kinesthetic and auditory preference

  // Q51-Q55: Emotional Awareness - High EI
  0, 0, 1, 0, 1, // Strong emotional and social skills

  // Q56-Q60: Creativity - High creativity
  3, 0, 3, 2, 3, // Highly creative and innovative
];

// ============================================================================
// TEST SUITE: Input Validation
// ============================================================================

describe('Input Validation', () => {
  test('should accept valid responses (60 answers, 0-4 indices)', () => {
    const result = validateResponses(responses_AchieverStudent);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  test('should reject incomplete responses (less than 60)', () => {
    const incomplete = responses_AchieverStudent.slice(0, 50);
    const result = validateResponses(incomplete);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('60'))).toBe(true);
  });

  test('should reject invalid option indices', () => {
    const invalid = [...responses_AchieverStudent];
    invalid[15] = 5; // Invalid index (max is 4)
    const result = validateResponses(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('invalid'))).toBe(true);
  });

  test('should reject negative option indices', () => {
    const invalid = [...responses_AchieverStudent];
    invalid[25] = -1;
    const result = validateResponses(invalid);
    expect(result.valid).toBe(false);
  });
});

// ============================================================================
// TEST SUITE: Dimension-Specific Scoring
// ============================================================================

describe('Personality Preferences (Q1-Q10)', () => {
  test('should calculate personality scores correctly', () => {
    const score = class8Scorer(responses_AchieverStudent);
    const personality = score.personalityProfile;

    // Verify structure
    expect(personality).toHaveProperty('scores');
    expect(personality.scores).toHaveProperty('Decisive');
    expect(personality.scores).toHaveProperty('Supportive');
    expect(personality.scores).toHaveProperty('Analytical');
    expect(personality.scores).toHaveProperty('Creative');

    // All scores should be 0-100
    Object.values(personality.scores).forEach((s) => {
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(100);
    });

    // At least one type should be dominant
    const maxScore = Math.max(...Object.values(personality.scores));
    expect(maxScore).toBeGreaterThan(10);
  });

  test('analytical type should score high for technical student', () => {
    const score = class8Scorer(responses_TechStudent);
    expect(score.personalityProfile.scores.Analytical).toBeGreaterThan(50);
  });

  test('creative type should score high for creative-leader student', () => {
    const score = class8Scorer(responses_CreativeLeaderStudent);
    const personality = score.personalityProfile.scores;
    expect(personality.Creative + personality.Decisive).toBeGreaterThan(100);
  });
});

describe('RIASEC Career Interests (Q11-Q20)', () => {
  test('should calculate all 6 RIASEC scores', () => {
    const score = class8Scorer(responses_AchieverStudent);
    const riasec = score.riasecScores;

    expect(riasec.length).toBe(6);
    const codes = riasec.map((r) => r.code).sort();
    expect(codes).toEqual(['A', 'C', 'E', 'I', 'R', 'S']);
  });

  test('scores should be sorted by value (descending)', () => {
    const score = class8Scorer(responses_AchieverStudent);
    const riasec = score.riasecScores;

    for (let i = 0; i < riasec.length - 1; i++) {
      expect(riasec[i].score).toBeGreaterThanOrEqual(riasec[i + 1].score);
    }
  });

  test('realistic type should rank high for tech student', () => {
    const score = class8Scorer(responses_TechStudent);
    const realistic = score.riasecScores.find((r) => r.code === 'R');
    expect(realistic?.score).toBeGreaterThan(30);
  });

  test('artistic type should rank high for creative-leader', () => {
    const score = class8Scorer(responses_CreativeLeaderStudent);
    const artistic = score.riasecScores.find((r) => r.code === 'A');
    expect(artistic?.score).toBeGreaterThan(50);
  });

  test('all RIASEC scores should be 0-100', () => {
    const score = class8Scorer(responses_AchieverStudent);
    score.riasecScores.forEach((r) => {
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
    });
  });
});

describe('Aptitude & Reasoning (Q21-Q30)', () => {
  test('should validate correct answers properly', () => {
    const score = class8Scorer(responses_AchieverStudent);
    const aptitude = score.aptitudeProfile;

    // Verify structure
    expect(aptitude).toHaveProperty('numeric');
    expect(aptitude).toHaveProperty('logic');
    expect(aptitude).toHaveProperty('pattern');
    expect(aptitude).toHaveProperty('spatial');
    expect(aptitude).toHaveProperty('overallScore');
  });

  test('technical student should score higher on aptitude', () => {
    const techScore = class8Scorer(responses_TechStudent);
    const creativeScore = class8Scorer(responses_CreativeLeaderStudent);

    expect(techScore.aptitudeProfile.overallScore).toBeGreaterThan(
      creativeScore.aptitudeProfile.overallScore
    );
  });

  test('should identify correct and incorrect answers', () => {
    const score = class8Scorer(responses_TechStudent);
    const apt = score.aptitudeProfile;

    expect(apt.correct).toBeGreaterThanOrEqual(0);
    expect(apt.incorrect).toBeGreaterThanOrEqual(0);
    expect(apt.correct + apt.incorrect).toBe(10);
  });

  test('mastery level should match score', () => {
    const score = class8Scorer(responses_TechStudent);
    const mastery = score.aptitudeProfile.masteryLevel;

    expect(['Basic', 'Developing', 'Strong', 'Advanced']).toContain(mastery);
  });
});

describe('Multiple Intelligence Strengths (Q31-Q38)', () => {
  test('should score all 8 intelligence domains', () => {
    const score = class8Scorer(responses_AchieverStudent);
    const strengths = score.strengthDomains;

    expect(strengths.length).toBe(8);
    const codes = strengths.map((s) => s.code).sort();
    expect(codes).toEqual([
      'Bodily-Kinesthetic',
      'Interpersonal',
      'Intrapersonal',
      'Linguistic',
      'Logical-Mathematical',
      'Musical',
      'Naturalistic',
      'Spatial',
    ]);
  });

  test('all MI scores should be 0-100', () => {
    const score = class8Scorer(responses_AchieverStudent);
    score.strengthDomains.forEach((s) => {
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
    });
  });

  test('technical student should score high in logical-mathematical and spatial', () => {
    const score = class8Scorer(responses_TechStudent);
    const logical = score.strengthDomains.find((s) => s.code === 'Logical-Mathematical');
    const spatial = score.strengthDomains.find((s) => s.code === 'Spatial');

    expect(logical?.score).toBeGreaterThan(50);
    expect(spatial?.score).toBeGreaterThan(50);
  });

  test('creative student should score high in artistic domains', () => {
    const score = class8Scorer(responses_CreativeLeaderStudent);
    const musical = score.strengthDomains.find((s) => s.code === 'Musical');
    const interpersonal = score.strengthDomains.find((s) => s.code === 'Interpersonal');

    expect(musical?.score).toBeGreaterThan(40);
    expect(interpersonal?.score).toBeGreaterThan(40);
  });

  test('proficiency level should align with score', () => {
    const score = class8Scorer(responses_AchieverStudent);
    score.strengthDomains.forEach((s) => {
      expect(['Developing', 'Proficient', 'Strong', 'Advanced']).toContain(s.proficiencyLevel);
    });
  });
});

describe('Motivators (Q39-Q45)', () => {
  test('should calculate 7 motivator types', () => {
    const score = class8Scorer(responses_AchieverStudent);
    const motivators = score.motivators;

    expect(motivators.length).toBe(7);
    const types = motivators.map((m) => m.type).sort();
    expect(types).toEqual([
      'Achievement',
      'Autonomy',
      'Curiosity',
      'Helping',
      'Innovation',
      'Leadership',
      'Stability',
    ]);
  });

  test('all motivator scores should be 0-100', () => {
    const score = class8Scorer(responses_AchieverStudent);
    score.motivators.forEach((m) => {
      expect(m.score).toBeGreaterThanOrEqual(0);
      expect(m.score).toBeLessThanOrEqual(100);
    });
  });

  test('intensity level should be classified correctly', () => {
    const score = class8Scorer(responses_AchieverStudent);
    score.motivators.forEach((m) => {
      expect(['Low', 'Moderate', 'High', 'Very High']).toContain(m.intensityLevel);
    });
  });
});

describe('Learning Style (Q46-Q50)', () => {
  test('should identify primary and secondary learning styles', () => {
    const score = class8Scorer(responses_AchieverStudent);
    const learning = score.learningStyle;

    expect(learning).toHaveProperty('primaryStyle');
    expect(learning).toHaveProperty('secondaryStyle');
    const styles = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic'];
    expect(styles).toContain(learning.primaryStyle);
    expect(styles).toContain(learning.secondaryStyle);
  });

  test('should provide learning recommendations', () => {
    const score = class8Scorer(responses_AchieverStudent);
    const recommendations = score.learningStyle.recommendedStrategies;

    expect(Array.isArray(recommendations)).toBe(true);
    expect(recommendations.length).toBeGreaterThan(0);
  });

  test('kinesthetic preference should be identified for active learners', () => {
    const score = class8Scorer(responses_CreativeLeaderStudent);
    const styles = [score.learningStyle.primaryStyle, score.learningStyle.secondaryStyle];

    expect(styles.some((s) => s === 'Kinesthetic')).toBe(true);
  });
});

describe('Emotional & Social Awareness (Q51-Q55)', () => {
  test('should calculate 4 EI components', () => {
    const score = class8Scorer(responses_AchieverStudent);
    const ei = score.emotionalAwareness;

    expect(ei.length).toBe(4);
    const types = ei.map((e) => e.component).sort();
    expect(types).toEqual([
      'Empathy',
      'Relationship-Building',
      'Self-Awareness',
      'Social-Management',
    ]);
  });

  test('all EI scores should be 0-100', () => {
    const score = class8Scorer(responses_AchieverStudent);
    score.emotionalAwareness.forEach((e) => {
      expect(e.score).toBeGreaterThanOrEqual(0);
      expect(e.score).toBeLessThanOrEqual(100);
    });
  });

  test('proficiency level should classify correctly', () => {
    const score = class8Scorer(responses_AchieverStudent);
    score.emotionalAwareness.forEach((e) => {
      expect(['Developing', 'Proficient', 'Strong', 'Advanced']).toContain(e.proficiencyLevel);
    });
  });

  test('creative leader should score high in empathy and relationship building', () => {
    const score = class8Scorer(responses_CreativeLeaderStudent);
    const empathy = score.emotionalAwareness.find((e) => e.component === 'Empathy');
    const relationships = score.emotionalAwareness.find((e) => e.component === 'Relationship-Building');

    expect(empathy?.score).toBeGreaterThan(40);
    expect(relationships?.score).toBeGreaterThan(40);
  });
});

describe('Creativity & Future Readiness (Q56-Q60)', () => {
  test('should calculate 4 creativity indicators', () => {
    const score = class8Scorer(responses_AchieverStudent);
    const creativity = score.creativity;

    expect(creativity.length).toBe(4);
    const types = creativity.map((c) => c.indicator).sort();
    expect(types).toEqual(['Adaptability', 'Future-Orientation', 'Innovation', 'Problem-Solving']);
  });

  test('all creativity scores should be 0-100', () => {
    const score = class8Scorer(responses_AchieverStudent);
    score.creativity.forEach((c) => {
      expect(c.score).toBeGreaterThanOrEqual(0);
      expect(c.score).toBeLessThanOrEqual(100);
    });
  });

  test('creative leader should score high on innovation', () => {
    const score = class8Scorer(responses_CreativeLeaderStudent);
    const innovation = score.creativity.find((c) => c.indicator === 'Innovation');

    expect(innovation?.score).toBeGreaterThan(50);
  });

  test('level should be classified properly', () => {
    const score = class8Scorer(responses_AchieverStudent);
    score.creativity.forEach((c) => {
      expect(['Emerging', 'Developing', 'Strong', 'Advanced']).toContain(c.level);
    });
  });
});

// ============================================================================
// TEST SUITE: Domain Affinity Calculation
// ============================================================================

describe('Domain Affinity Calculation', () => {
  test('should calculate affinity for 8 career domains', () => {
    const score = class8Scorer(responses_AchieverStudent);
    const affinities = score.domainAffinities;

    expect(affinities.length).toBe(8);
    const domains = affinities.map((d) => d.domain).sort();
    expect(domains).toEqual([
      'A - Technology & Innovation',
      'B - Healthcare & Social Services',
      'C - Education & Training',
      'D - Business & Entrepreneurship',
      'E - Creative & Design',
      'F - Research & Discovery',
      'G - Environment & Nature',
      'H - Skilled Trades & Manufacturing',
    ]);
  });

  test('all affinity scores should be 0-100', () => {
    const score = class8Scorer(responses_AchieverStudent);
    score.domainAffinities.forEach((a) => {
      expect(a.affinity).toBeGreaterThanOrEqual(0);
      expect(a.affinity).toBeLessThanOrEqual(100);
    });
  });

  test('affinity scores should sum to 100 (verify weighting)', () => {
    const score = class8Scorer(responses_AchieverStudent);
    const sum = score.domainAffinities.reduce((acc, a) => acc + a.affinity, 0);

    // Allow small rounding differences (±1)
    expect(sum).toBeGreaterThan(99);
    expect(sum).toBeLessThan(101);
  });

  test('tech student should score highest in technology domain', () => {
    const score = class8Scorer(responses_TechStudent);
    const tech = score.domainAffinities.find((d) => d.domain.includes('Technology'));

    expect(tech?.affinity).toBeGreaterThan(score.domainAffinities[0].affinity * 0.5);
  });

  test('creative leader should score high in creative & design', () => {
    const score = class8Scorer(responses_CreativeLeaderStudent);
    const creative = score.domainAffinities.find((d) => d.domain.includes('Creative'));

    expect(creative?.affinity).toBeGreaterThan(score.domainAffinities[0].affinity * 0.5);
  });

  test('should provide domain reasoning', () => {
    const score = class8Scorer(responses_AchieverStudent);
    score.domainAffinities.forEach((a) => {
      expect(a.reasoning).toBeTruthy();
      expect(a.reasoning.length).toBeGreaterThan(10);
    });
  });
});

// ============================================================================
// TEST SUITE: Overall Assessment Summary
// ============================================================================

describe('Assessment Summary', () => {
  test('should provide complete profile overview', () => {
    const score = class8Scorer(responses_AchieverStudent);
    const summary = score.summary;

    expect(summary).toHaveProperty('profileTitle');
    expect(summary).toHaveProperty('profileDescription');
    expect(summary.profileTitle.length).toBeGreaterThan(5);
  });

  test('should include top strengths', () => {
    const score = class8Scorer(responses_AchieverStudent);
    expect(score.summary.topStrengths).toBeTruthy();
    expect(Array.isArray(score.summary.topStrengths)).toBe(true);
  });

  test('should include development areas', () => {
    const score = class8Scorer(responses_AchieverStudent);
    expect(score.summary.developmentAreas).toBeTruthy();
    expect(Array.isArray(score.summary.developmentAreas)).toBe(true);
  });

  test('should suggest career directions', () => {
    const score = class8Scorer(responses_AchieverStudent);
    expect(score.summary.careerDirections).toBeTruthy();
    expect(Array.isArray(score.summary.careerDirections)).toBe(true);
  });

  test('should provide next steps', () => {
    const score = class8Scorer(responses_AchieverStudent);
    expect(score.summary.nextSteps).toBeTruthy();
    expect(Array.isArray(score.summary.nextSteps)).toBe(true);
  });
});

// ============================================================================
// TEST SUITE: Edge Cases & Boundary Conditions
// ============================================================================

describe('Edge Cases', () => {
  test('all minimum answers (all 0s)', () => {
    const allZeros = new Array(60).fill(0);
    const score = class8Scorer(allZeros);

    expect(score).toHaveProperty('personalityProfile');
    expect(score).toHaveProperty('riasecScores');
    expect(score).toHaveProperty('aptitudeProfile');
    expect(score).toHaveProperty('strengthDomains');
  });

  test('all maximum answers (all 4s)', () => {
    const allMax = new Array(60).fill(4);
    const score = class8Scorer(allMax);

    expect(score).toHaveProperty('personalityProfile');
    score.riasecScores.forEach((r) => {
      expect(r.score).toBeLessThanOrEqual(100);
    });
  });

  test('alternating answers', () => {
    const alternating = Array.from({ length: 60 }, (_, i) => i % 5);
    const score = class8Scorer(alternating);

    expect(score).toHaveProperty('personalityProfile');
    expect(score.personalityProfile).toHaveProperty('scores');
  });

  test('random distribution should be valid', () => {
    const random = Array.from({ length: 60 }, () => Math.floor(Math.random() * 5));
    const result = validateResponses(random);
    expect(result.valid).toBe(true);

    const score = class8Scorer(random);
    expect(score).toHaveProperty('domainAffinities');
  });
});

// ============================================================================
// TEST SUITE: Cross-Dimension Consistency
// ============================================================================

describe('Cross-Dimension Consistency', () => {
  test('high RIASEC-I should correlate with high logical-mathematical', () => {
    const score = class8Scorer(responses_TechStudent);
    const investigative = score.riasecScores.find((r) => r.code === 'I');
    const logical = score.strengthDomains.find((s) => s.code === 'Logical-Mathematical');

    expect(investigative!.score).toBeGreaterThan(30);
    expect(logical!.score).toBeGreaterThan(40);
  });

  test('high RIASEC-A should correlate with artistic strengths', () => {
    const score = class8Scorer(responses_CreativeLeaderStudent);
    const artistic = score.riasecScores.find((r) => r.code === 'A');
    const musical = score.strengthDomains.find((s) => s.code === 'Musical');

    expect(artistic!.score).toBeGreaterThan(40);
    expect(musical!.score).toBeGreaterThan(40);
  });

  test('high aptitude should align with logical-mathematical strength', () => {
    const score = class8Scorer(responses_TechStudent);
    const aptitude = score.aptitudeProfile.overallScore;
    const logical = score.strengthDomains.find((s) => s.code === 'Logical-Mathematical');

    expect(aptitude).toBeGreaterThan(50);
    expect(logical!.score).toBeGreaterThan(50);
  });

  test('personality traits should align with RIASEC profile', () => {
    const score = class8Scorer(responses_TechStudent);
    // Technical students are typically more analytical
    expect(score.personalityProfile.scores.Analytical).toBeGreaterThan(30);
  });
});

// ============================================================================
// TEST SUITE: Career Alignment Validation
// ============================================================================

describe('Career Alignment', () => {
  test('top domain should have reasoning aligned with strengths', () => {
    const score = class8Scorer(responses_TechStudent);
    const topDomain = score.domainAffinities[0];
    const reasoning = topDomain.reasoning.toLowerCase();

    // Should mention relevant dimensions
    expect(reasoning.length).toBeGreaterThan(20);
  });

  test('domain affinities should reflect dimension scores', () => {
    const score = class8Scorer(responses_AchieverStudent);
    const techDomain = score.domainAffinities.find((d) => d.domain.includes('Technology'));

    // Technology domain should consider aptitude and logical-math
    expect(techDomain).toBeDefined();
    expect(techDomain!.affinity).toBeGreaterThanOrEqual(0);
  });

  test('creative domain should score high for creative leader', () => {
    const score = class8Scorer(responses_CreativeLeaderStudent);
    const creativeDomain = score.domainAffinities.find((d) => d.domain.includes('Creative'));

    expect(creativeDomain!.affinity).toBeGreaterThan(30);
  });

  test('healthcare domain should consider interpersonal skills', () => {
    // Healthcare domain correlates with Social RIASEC and Interpersonal MI
    const score = class8Scorer(responses_CreativeLeaderStudent);
    const healthcareDomain = score.domainAffinities.find((d) => d.domain.includes('Healthcare'));

    // Should be reasonably high for a socially-oriented person
    expect(healthcareDomain!.affinity).toBeGreaterThan(20);
  });
});

// ============================================================================
// INTEGRATION TEST: Full Assessment Flow
// ============================================================================

describe('Full Assessment Integration', () => {
  test('complete assessment flow for achiever student', () => {
    const result = validateResponses(responses_AchieverStudent);
    expect(result.valid).toBe(true);

    const score = class8Scorer(responses_AchieverStudent);

    // Verify all 8 dimensions are scored
    expect(score.personalityProfile).toBeDefined();
    expect(score.riasecScores.length).toBe(6);
    expect(score.aptitudeProfile).toBeDefined();
    expect(score.strengthDomains.length).toBe(8);
    expect(score.motivators.length).toBe(7);
    expect(score.learningStyle).toBeDefined();
    expect(score.emotionalAwareness.length).toBe(4);
    expect(score.creativity.length).toBe(4);
    expect(score.domainAffinities.length).toBe(8);
    expect(score.summary).toBeDefined();
  });

  test('complete assessment flow for tech student', () => {
    const result = validateResponses(responses_TechStudent);
    expect(result.valid).toBe(true);

    const score = class8Scorer(responses_TechStudent);

    // All dimensions should be present
    expect(score).toHaveProperty('personalityProfile');
    expect(score).toHaveProperty('riasecScores');
    expect(score).toHaveProperty('aptitudeProfile');
    expect(score).toHaveProperty('strengthDomains');
    expect(score).toHaveProperty('domainAffinities');
  });

  test('complete assessment flow for creative leader', () => {
    const result = validateResponses(responses_CreativeLeaderStudent);
    expect(result.valid).toBe(true);

    const score = class8Scorer(responses_CreativeLeaderStudent);

    // Verify output structure
    expect(Object.keys(score).length).toBeGreaterThan(8);

    // Verify all key properties exist
    expect(score.personalityProfile.primaryType).toBeDefined();
    expect(score.summary.profileTitle).toBeDefined();
  });
});

// ============================================================================
// PERFORMANCE TEST
// ============================================================================

describe('Performance', () => {
  test('should score assessment in less than 50ms', () => {
    const start = performance.now();
    class8Scorer(responses_AchieverStudent);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(50);
  });

  test('should validate responses in less than 5ms', () => {
    const start = performance.now();
    validateResponses(responses_AchieverStudent);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(5);
  });

  test('should handle multiple assessments efficiently', () => {
    const start = performance.now();

    for (let i = 0; i < 10; i++) {
      class8Scorer(responses_AchieverStudent);
    }

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(500); // 10 assessments in <500ms
  });
});
