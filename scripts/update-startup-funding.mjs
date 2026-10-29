// node scripts/update-startup-funding.mjs
//
// Refreshes data/startups/funding.json from CapEasy's funding directory
// (https://www.capeasy.in/schemes/ - CapEasy is OneGrasp's own company and
// shares this list with consent). Reads the programme list the page embeds
// (name, amount, deadline, type, stages, sectors, states, who runs it) and
// the page's totals; only the fields shown publicly on that page are kept.
// Run it whenever the directory changes, then commit the JSON.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE = "https://www.capeasy.in/schemes/";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "startups", "funding.json");

const res = await fetch(SOURCE, { headers: { "User-Agent": "OneGrasp funding sync (support@onegrasp.com)" } });
if (!res.ok) throw new Error(`CapEasy returned ${res.status}`);
const html = await res.text();

// The list is inside a React Server Components chunk: self.__next_f.push([1,"..."]).
let items = null;
let totals = null;
for (const m of html.matchAll(/self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)<\/script>/g)) {
  const s = JSON.parse(`"${m[1]}"`);
  if (!items && s.includes('"items":[') && s.includes('"amount_band"')) {
    const start = s.indexOf('"items":[') + '"items":'.length;
    let depth = 0;
    for (let i = start; i < s.length; i++) {
      if (s[i] === "[") depth++;
      else if (s[i] === "]" && --depth === 0) { items = JSON.parse(s.slice(start, i + 1)); break; }
    }
  }
  const t = !totals && s.match(/"programmes":(\d+),"crore":([\d.]+),"draftable":(\d+),"who":(\{[^}]*\})/);
  if (t) totals = { programmes: Number(t[1]), crore: Number(t[2]), oneClick: Number(t[3]), runBy: JSON.parse(t[4]) };
}
if (!items?.length) throw new Error("Couldn't find the programme list on the page - its markup may have changed.");

const KEEP = ["slug", "name", "amount_band", "amount_max", "deadline_word", "deadline_date", "draftable", "kind", "stages", "sectors", "states", "run_by_kind"];
const programmes = items.map((x) => Object.fromEntries(KEEP.map((k) => [k, x[k] ?? null])));
const fetchedAt = new Date().toISOString().slice(0, 10);
writeFileSync(OUT, `${JSON.stringify({ source: SOURCE, fetchedAt, totals, programmes }, null, 0).replace(/\},\{"slug"/g, '},\n{"slug"')}\n`);
console.log(`Saved ${programmes.length} programmes (${fetchedAt}) to ${OUT}`);
if (totals && totals.programmes !== programmes.length) console.warn(`Note: the page says ${totals.programmes} programmes but lists ${programmes.length}.`);
