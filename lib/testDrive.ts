/**
 * Career Test-Drive - a 15-minute "day in the job" a student plays before
 * choosing a career. A drive is generated once per career by AI (grounded in
 * OneGrasp's roadmap for that role when one exists), stored in
 * testDrives/{slug}, and reused for every student. A student's result -
 * how much they enjoyed each moment - is saved on their own profile
 * (users/{uid}.testDrives.{slug}) and shown to their school.
 */

export interface TestDriveChoice { text: string; outcome: string; skill: string; best: boolean }
export interface TestDriveScene { time: string; title: string; situation: string; choices: TestDriveChoice[] }

export interface TestDrive {
  slug: string;
  career: string;
  intro: string;
  scenes: TestDriveScene[];
  reality: { pros: string[]; cons: string[]; facts: string[] };
  nextSteps: string[];
  generatedAt: number;
  model: string;
}

export interface TestDriveResult {
  career: string;
  /** 1-5 per scene: how much they'd enjoy that moment. */
  ratings: number[];
  /** Index of the choice made in each scene. */
  choices: number[];
  /** Average enjoyment, 1-5 (one decimal). */
  enjoyment: number;
  /** Share of scenes where they picked the most effective choice. */
  judgementPct: number;
  completedAt: number;
}

export function testDriveSlug(career: string): string {
  return career.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "career";
}

export function enjoymentLabel(avg: number): string {
  if (avg >= 4.2) return "Loved it";
  if (avg >= 3.4) return "Enjoyed it";
  if (avg >= 2.6) return "Mixed feelings";
  return "Not for me";
}

/** Strict check of a generated drive - anything malformed is rejected, never shown. */
export function validTestDrive(x: unknown): x is Omit<TestDrive, "slug" | "career" | "generatedAt" | "model"> {
  const d = x as Partial<TestDrive>;
  const str = (s: unknown) => typeof s === "string" && s.trim().length > 0;
  return !!d && str(d.intro) && Array.isArray(d.scenes) && d.scenes.length >= 4 && d.scenes.length <= 7
    && d.scenes.every((s) => str(s?.time) && str(s?.title) && str(s?.situation) && Array.isArray(s?.choices) && s.choices.length >= 2 && s.choices.length <= 4
      && s.choices.every((c) => str(c?.text) && str(c?.outcome) && str(c?.skill) && typeof c?.best === "boolean") && s.choices.some((c) => c.best))
    && !!d.reality && Array.isArray(d.reality.pros) && Array.isArray(d.reality.cons) && Array.isArray(d.reality.facts)
    && Array.isArray(d.nextSteps);
}
