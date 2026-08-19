/**
 * Class 11-12 demo: comparing the career a student SAID they wanted against
 * what the assessment actually found.
 *
 * This is the part of the demo report the client specifically asked for. The
 * student names a desired career before sitting the paper; afterwards the
 * report has to say, in plain terms, whether the two agree — and be useful
 * either way:
 *
 *   they agree      -> confirm it, and give the detailed roadmap for it
 *   they part ways  -> say so directly, explain what the assessment found
 *                      instead and why, and then give BOTH roadmaps so the
 *                      student can decide, rather than being told to abandon
 *                      what they came in wanting
 *
 * The second case is the one that matters. A student who is told only "you
 * should do X instead" has been overruled by a 60-question test, which is not
 * what a 60-question test can support. So the wording below never instructs;
 * it reports the disagreement, quantifies it, and hands back the decision.
 */

import type { AssessmentSummary } from "@/lib/auth/AuthProvider";
import { domainFit } from "@/lib/report/knowledge";
import { getCareer, alternativesFor, careersForCombination, type Career } from "./catalogue";

/** How the desired career compares with the assessment result. */
export type AlignmentVerdict =
  | "strong"      // the desired career is the top result, or all but
  | "partial"     // same cluster, different specific career
  | "divergent";  // different cluster entirely

export interface Alignment {
  verdict: AlignmentVerdict;
  /** What the student said they wanted, before sitting the paper. */
  desired: { id: string; title: string; cluster: string; clusterName: string };
  /** The strongest career the assessment itself points at. */
  measured: { title: string; cluster: string | null; clusterName: string | null; fitmentPct: number | null };
  /**
 * Blended fit for the field the desired career sits in, 0-100 - the SAME
 * number and scale the report's "Your best-fit fields" prints for it.
 */
  desiredClusterScore: number | null;
  /** Where the desired career ranks in the student's own result list, 1-based. */
  desiredRank: number | null;
  /** Headline sentence for the report. */
  headline: string;
  /** Two to four sentences explaining the comparison honestly. */
  explanation: string;
  /** What to actually do next, given the verdict. */
  nextSteps: string[];
}

const ALL_CLUSTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

/**
 * The blended fit for every cluster, ranked - the SAME numbers and the same
 * order the report's "Your best-fit fields" shows.
 *
 * This used to read the interest themes directly, while the dashboard ranked
 * the same eight clusters with domainFit, which blends interests, aptitude,
 * intelligences and drivers. The two disagreed, so one page could say
 * "best-fit field #1: Sports, Hospitality & Lifestyle" and, a few centimetres
 * below, "what the assessment found: Entrepreneur (Business & Marketing)".
 * Two answers to the same question makes the whole report look invented.
 *
 * There is now one ranking and every part of the page reads from it.
 */
function clusterFit(summary: AssessmentSummary): { letter: string; name: string; fit: number }[] {
  const byLetter = new Map(domainFit(summary).map((d) => [d.key, d]));
  return ALL_CLUSTERS.map((letter) => ({
    letter,
    name: byLetter.get(letter)?.name ?? letter,
    fit: byLetter.get(letter)?.fit ?? 0,
  })).sort((a, b) => b.fit - a.fit);
}

/** Cluster letter -> its blended fit, every letter present. */
function clusterScores(summary: AssessmentSummary): Record<string, number> {
  const out: Record<string, number> = {};
  for (const letter of ALL_CLUSTERS) out[letter] = 0;
  for (const d of clusterFit(summary)) out[d.letter] = d.fit;
  return out;
}

/** Loose title comparison: "Psychologist" should match "Psychologist / Counsellor". */
function titleKey(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function titlesMatch(a: string, b: string): boolean {
  const x = titleKey(a);
  const y = titleKey(b);
  if (!x || !y) return false;
  return x === y || x.includes(y) || y.includes(x);
}

/**
 * The cluster the report itself puts first. Taken from the same ranking the
 * dashboard renders, so "what the assessment found" can never name a different
 * field from the one printed at the top of "Your best-fit fields".
 */
function measuredCluster(summary: AssessmentSummary): { letter: string | null; name: string | null } {
  const top = clusterFit(summary)[0];
  return top ? { letter: top.letter, name: top.name } : { letter: null, name: null };
}

function pct(n: number | null): string {
  return n == null ? "not measured" : `${Math.round(n)}%`;
}

export function computeAlignment(
  summary: AssessmentSummary,
  desiredCareerId: string,
  combination: string
): Alignment | null {
  const desired = getCareer(desiredCareerId);
  if (!desired) return null;

  const scores = clusterScores(summary);
  const desiredClusterScore = scores[desired.cluster];
  const measured = measuredCluster(summary);
  const topMatch = summary.matches?.[0] ?? null;

  // Ranked over all eight clusters, so a zero-scoring cluster still gets an
  // honest rank of 8 rather than dropping out of the list and reading as null.
  const rankedClusters = ALL_CLUSTERS
    .map((letter) => ({ letter, score: scores[letter] }))
    .sort((a, b) => b.score - a.score);
  const desiredRank = rankedClusters.findIndex((t) => t.letter === desired.cluster);

  // The assessment names professions, not our career ids, so agreement is
  // judged at CLUSTER level with an exact title match promoted to "strong".
  // Cluster is the honest granularity here: this paper can tell "you lean
  // towards health science" apart from "you lean towards business" far more
  // reliably than it can tell a surgeon apart from a physiotherapist.
  const matches = summary.matches ?? [];
  // Only the TOP match can confirm the student's choice. Accepting a hit
  // anywhere in the top six produced a false "your assessment agrees" for a
  // student who scored 0% on the desired cluster and ranked it 7th of 8 — the
  // career appeared low in their list on the strength of other dimensions, and
  // the report read that as agreement.
  const topTitleMatch = matches[0] ? titlesMatch(matches[0].title, desired.title) : false;
  const namedInTopThree = matches.slice(0, 3).some((m) => titlesMatch(m.title, desired.title));
  const sameCluster = measured.letter != null && measured.letter === desired.cluster;
  // Top three of eight. Nothing below that can honestly be called agreement,
  // whatever the match list says.
  const clusterStandsUp = desiredRank >= 0 && desiredRank <= 2;

  let verdict: AlignmentVerdict;
  if (clusterStandsUp && (topTitleMatch || (sameCluster && desiredRank === 0))) verdict = "strong";
  else if (sameCluster || namedInTopThree || clusterStandsUp) verdict = "partial";
  else verdict = "divergent";

  const desiredName = desired.title;
  // The career named to the student is the one measuredCareerFor resolves, so
  // the name, its cluster and the roadmap shown below all describe one thing.
  const measuredCareer = measuredCareerFor(summary, combination);
  const measuredName = measuredCareer?.title ?? topMatch?.title ?? "the profile above";

  let headline: string;
  let explanation: string;
  let nextSteps: string[];

  if (verdict === "strong") {
    // Only claim the exact career when the engine actually named it. When the
    // agreement is at cluster level, say "direction" - the previous wording
    // announced "agrees with: Chartered Accountant" and then named
    // Entrepreneur as the top match two lines later.
    headline = topTitleMatch
      ? `Your assessment agrees with the career you chose: ${desiredName}.`
      : `Your assessment backs the direction you chose: ${desiredName} sits in your strongest cluster.`;
    explanation =
      `Before the test you said you wanted to become a ${desiredName}. ` +
      `Your answers point to the same place: ${desired.clusterName} is your strongest field ` +
      `at ${pct(desiredClusterScore)} blended fit, and the career it points to is ${measuredName}. ` +
      `That is a genuine agreement rather than a coincidence — the interest, aptitude and personality ` +
      `sections were scored separately and independently arrived at the same cluster. ` +
      `The roadmap below is therefore the one to follow.`;
    nextSteps = [
      `Treat the ${desiredName} roadmap below as your plan, not as one option among many.`,
      "Lock the entrance exams into your class 11-12 calendar now — they are the real deadline.",
      "Start the 'begin this year' items immediately; they are what separates a plan from an intention.",
    ];
  } else if (verdict === "partial") {
    headline = `Your choice of ${desiredName} is close to what the assessment found, but not identical.`;
    explanation =
      `You chose ${desiredName}, which sits in ${desired.clusterName}. ` +
      `Your blended fit for ${desired.clusterName} is ${pct(desiredClusterScore)}` +
      (desiredRank >= 0 ? ` (your number ${desiredRank + 1} cluster of eight)` : "") +
      `, so the pull towards it is real. Where it differs is the specific role: the strongest single ` +
      `match from your answers is ${measuredName}` +
      (topMatch?.fitmentPct != null ? ` at ${topMatch.fitmentPct}% profile alignment` : "") +
      `. ` +
      (sameCluster
        ? `These are neighbouring careers rather than opposed ones — they draw on much the same ` +
          `interests and abilities, and the same subjects in class 11-12 keep both open. `
        : `They sit in different clusters, so this is a genuine difference of direction rather than ` +
          `two versions of the same job — but ${desired.clusterName} scored high enough on your ` +
          `profile that it cannot be dismissed either. `) +
      `Nothing here says drop ${desiredName}; it says look closely at ${measuredName} before you commit.`;
    nextSteps = [
      `Read both roadmaps below — ${desiredName} and ${measuredName} — and note where they overlap.`,
      "The overlapping entrance exams and subjects are your safest immediate priority.",
      `Talk to someone working as a ${desiredName} and someone working as ${measuredName} before deciding.`,
      "You do not have to choose today. You do have to keep both routes open, which the shared subjects do.",
    ];
  } else {
    headline = `Your assessment points somewhere different from the career you chose.`;
    explanation =
      `You told us you wanted to become a ${desiredName}, which sits in ${desired.clusterName}. ` +
      `Your blended fit for that field is ${pct(desiredClusterScore)}` +
      (desiredRank >= 0 ? ` (number ${desiredRank + 1} of your eight clusters)` : "") +
      `, while your strongest cluster is ${measured.name ?? "a different one"} and your top single match ` +
      `is ${measuredName}` +
      (topMatch?.fitmentPct != null ? ` at ${topMatch.fitmentPct}% profile alignment` : "") +
      `. ` +
      (desiredRank >= 0 && desiredRank <= 2
        ? `It is worth saying that ${desired.clusterName} still came out among your top three clusters, so the pull is not absent, only not strongest. `
        : "") +
      `That is a real disagreement and it is worth taking seriously — but it is not a verdict. ` +
      `A 60-question assessment measures what interests and suits you TODAY; it cannot measure how much ` +
      `you want something, what you are willing to work for, or what you have not yet been exposed to. ` +
      `Plenty of people succeed in a career their aptitude profile did not predict, because motivation ` +
      `closed the gap. What this result does tell you is that ${desiredName} will likely ask more ` +
      `deliberate effort from you than it would from someone whose profile matched it, and that ` +
      `${measuredName} would come more naturally. Both roadmaps are below so you can weigh that yourself.`;
    nextSteps = [
      `Read the ${desiredName} roadmap first — if you still want it after seeing what it demands, that answer counts for a great deal.`,
      `Then read the ${measuredName} roadmap. You may find it describes work you had simply never been shown.`,
      `Ask yourself honestly what draws you to ${desiredName}: the work itself, or the salary, status, or someone else's expectation. Only the first survives a decade.`,
      "Choose class 11-12 subjects that keep both routes open where possible — that is the cheapest insurance available to you right now.",
      "Speak to a counsellor about this specific gap. It is exactly the conversation this report is meant to start.",
    ];
  }

  return {
    verdict,
    desired: {
      id: desired.id,
      title: desired.title,
      cluster: desired.cluster,
      clusterName: desired.clusterName,
    },
    measured: {
      title: measuredName,
      cluster: measured.letter,
      clusterName: measured.name,
      // The alignment figure for the career actually named. Reading
      // matches[0] here printed one career's percentage beside another
      // career's name.
      fitmentPct:
        (summary.matches ?? []).find((m) => titlesMatch(m.title, measuredName))?.fitmentPct ??
        scores[measured.letter ?? ""] ??
        null,
    },
    desiredClusterScore,
    desiredRank: desiredRank >= 0 ? desiredRank + 1 : null,
    headline,
    explanation,
    nextSteps,
  };
}

/**
 * The career the assessment points at, resolved to one in OUR catalogue that
 * the student's stream can actually reach.
 *
 * The scoring engine's profession list and the demo catalogue are different
 * vocabularies, so an exact title match is tried first and a cluster match used
 * as the fallback. Restricting to reachable careers is the important part: the
 * report must never hand a commerce student a roadmap to MBBS.
 */
export function measuredCareerFor(
  summary: AssessmentSummary,
  combination: string
): Career | null {
  const offered = careersForCombination(combination).filter((c) => c.verdict !== "red");
  if (!offered.length) return null;

  // Walk the clusters in the report's own order and take the first one the
  // student can actually study into.
  //
  // Previously this scanned the engine's match list first and only fell back to
  // clusters, so the career it named routinely belonged to a different field
  // from the one printed at the top of "Your best-fit fields" - the report said
  // "Sports, Hospitality & Lifestyle, 88%" and then "the assessment found:
  // Entrepreneur (Business & Marketing)". The cluster leads now; the match list
  // only chooses WHICH career inside that cluster to name.
  for (const cluster of clusterFit(summary)) {
    const inCluster = offered.filter((c) => c.cluster === cluster.letter);
    if (!inCluster.length) continue;
    for (const match of summary.matches ?? []) {
      const hit = inCluster.find((c) => titlesMatch(c.title, match.title));
      if (hit) return getCareer(hit.id) ?? null;
    }
    return getCareer(inCluster[0].id) ?? null;
  }
  return getCareer(offered[0].id) ?? null;
}

export { alternativesFor };
