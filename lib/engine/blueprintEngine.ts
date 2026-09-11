import { Allocation } from "./types";

/**
 * Distributes `totalNeeded` questions across sub-traits, honoring the
 * standard blueprint rule: min 4 / ideal 6 / max 8 per sub-trait.
 *
 * If the math can't work (too many sub-traits for too few questions —
 * this genuinely happens, e.g. Personality in Career Discovery has 9
 * sub-traits but only an 18-question budget, so a 4-per-sub-trait floor
 * would need 36) it flags the conflict and falls back to a proportional
 * split using largest-remainder (Hamilton) apportionment, which is the
 * one guaranteed to sum back to `totalNeeded` exactly — naive per-trait
 * rounding does not, and that's the kind of bug that only shows up when
 * someone counts the generated session and finds 15 questions where the
 * blueprint promised 12.
 *
 * `subtraitSizes` maps sub_trait_id -> how many questions exist in that
 * sub-trait's pool (used both to weight the split and to cap allocation
 * at what's actually available).
 */
export function distributeAcrossSubtraits(
  totalNeeded: number,
  subtraitSizes: Record<string, number>,
  minQ = 4,
  idealQ = 6,
  maxQ = 8
): Allocation {
  const traits = Object.keys(subtraitSizes);
  const k = traits.length;
  const result: Record<string, number> = {};
  const warnings: string[] = [];

  if (k === 0) {
    return { alloc: {}, warnings: ["No sub-traits available for this parameter."] };
  }

  const minRequired = k * minQ;

  if (totalNeeded < minRequired) {
    warnings.push(
      `Blueprint conflict: ${k} sub-traits x min ${minQ}/each = ${minRequired} required, ` +
        `but only ${totalNeeded} questions allocated to this parameter. Falling back to a ` +
        `proportional split (min-per-subtrait rule cannot be honored as written).`
    );

    const poolTotal = traits.reduce((s, t) => s + subtraitSizes[t], 0);
    const raw = traits.map((t) => (poolTotal > 0 ? totalNeeded * (subtraitSizes[t] / poolTotal) : 0));
    const floors = raw.map(Math.floor);
    const used = floors.reduce((a, b) => a + b, 0);
    let remainder = totalNeeded - used;

    const order = traits
      .map((_, i) => ({ i, frac: raw[i] - floors[i] }))
      .sort((a, b) => b.frac - a.frac);

    for (let j = 0; remainder > 0 && j < traits.length; j++) {
      floors[order[j % traits.length].i]++;
      remainder--;
    }

    traits.forEach((t, i) => {
      result[t] = Math.max(0, Math.min(floors[i], subtraitSizes[t]));
    });
    return { alloc: result, warnings };
  }

  // Normal path: everyone starts at the floor, remainder raised toward
  // ideal (weighted by pool size), then mopped up round-robin toward max.
  traits.forEach((t) => (result[t] = minQ));
  let remaining = totalNeeded - minRequired;
  const poolTotal = traits.reduce((s, t) => s + subtraitSizes[t], 0);

  for (const t of traits) {
    if (remaining <= 0) break;
    const room = idealQ - result[t];
    if (room <= 0) continue;
    const share = poolTotal > 0 ? Math.ceil(remaining * (subtraitSizes[t] / poolTotal)) : 0;
    const take = Math.max(0, Math.min(room, share, remaining));
    result[t] += take;
    remaining -= take;
  }

  let i = 0;
  const safetyLimit = traits.length * (maxQ + 2);
  while (remaining > 0 && i < safetyLimit) {
    const t = traits[i % traits.length];
    if (result[t] < maxQ && result[t] < subtraitSizes[t]) {
      result[t]++;
      remaining--;
    }
    i++;
  }

  if (remaining > 0) {
    warnings.push(
      `Could not allocate all ${totalNeeded} questions within the max-${maxQ}-per-subtrait cap ` +
        `and available pool sizes; ${remaining} question(s) short. Consider raising max-per-subtrait ` +
        `or expanding the pool.`
    );
  }

  return { alloc: result, warnings };
}
