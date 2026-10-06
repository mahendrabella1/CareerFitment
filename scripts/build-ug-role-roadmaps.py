"""Build the Graduates (UG) role-specific roadmaps from the Word files.

    python scripts/build-ug-role-roadmaps.py <repo> <file1.docx> [<file2.docx> ...]

Every run reads ALL the given Word files and rewrites the outputs, so pass
every batch received so far (1-150.docx, 151-300.docx, ...).

Writes:
  public/roadmaps/ug/<slug>.json            one roadmap per file, loaded by the
                                            report only when a student picks
                                            that career (kept out of page code)
  public/roadmaps/ug/index.json             dropdown role -> roadmap versions, and
                                            what each version was written for
                                            (degree/course), loaded on demand
  data/graduates/ROLE_ROADMAPS_REPORT.md    review sheet: matched, needs review,
                                            duplicates, what was dropped

How a file is read (no heading styles are used, so structure comes from the
text): a paragraph in 16pt+ starts a new roadmap; bold "Step N" / "N." lines
start sections; other short bold lines are sub-headings; bold "Label: text"
lines are notes; Word bullets become lists (in the few files without
bullets, runs of short lines do); "A → B → C" chains and lines joined by "↓"
become a progression; tables keep their header, rows and real links
(tracking parameters removed).

Dropped as not roadmap content: the "Skill-gap engine" section (placeholder
"Not assessed" tables - the report has its own skill-gap page), "Could not
verify" research notes, "Footer:" / "Largest gap:" lines, "↓" separators and
empty lines. "VERIFY" placeholders are reworded into plain guidance.
"""
import json
import os
import re
import sys
from difflib import get_close_matches

import docx
from docx.table import Table
from docx.text.paragraph import Paragraph

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
R_ID = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"

# ---------------------------------------------------------------- text cleanup

LINK_ARTIFACT = re.compile(r"url([^]*)([^\s]*)?")


def clean_url(url):
    url = re.sub(r"[?&]utm_source=chatgpt\.com", "", url or "")
    return url.rstrip("?&")


def clean_text(t):
    t = LINK_ARTIFACT.sub(lambda m: m.group(1), t or "")
    t = re.sub(r"[-]", "", t)          # any other private-use leftovers
    t = t.replace("**", "")
    t = re.sub(r"[ \t ]+", " ", t)
    t = re.sub(r"\s*\n\s*", "\n", t).strip()
    # Notes the author left for the database, not for students.
    if AUTHOR_NOTE.search(t):
        t = " ".join(s for s in re.split(r"(?<=[.;])\s+", t) if not AUTHOR_NOTE.search(s))
    return fix_verify(t)


AUTHOR_NOTE = re.compile(r"(?i)taxonomy-role|role mapping|mapping should|knowledge files?|horizon[- ]file|career-roadmaps|career-clusters|supplied sources|sources? (information )?conflicts?")


# The author's "VERIFY" marker means different things:
#  - an unknown fee/stipend/date -> real guidance ("check the official site")
#  - a note to the author ("mapping should be VERIFY", "horizon-file output
#    unavailable") -> removed, it is not for students
#  - trailing an ordinary sentence -> just the marker removed
INTERNAL_NOTE = re.compile(r"(?i)taxonomy|knowledge file|horizon[- ]file|horizon source|career-roadmaps|supplied sources|source file|mapping should|career-clusters")
MONEY_CONTEXT = re.compile(r"(?i)fee|cost|price|pay|stipend|paid|amount|deadline|timing|edition|cycle|date|eligib|scholarship|seat|intake|cut-?off")


STRICT_MONEY = re.compile(r"(?i)\bfees?\b|stipend|price|deadline|\bdates?\b|amount|cut-?off|intake|\bseats?\b")


def fix_verify(t):
    if "VERIFY" not in t:
        return t
    if re.search(r"[.;]\s*VERIFY\.?\s*$", t):
        # A bare marker after a finished sentence: guidance only when that
        # sentence is about fees/dates ("cost estimation" is a skill, not a fee).
        t = re.sub(r"\s*VERIFY\.?\s*$", "", t)
        return t + (" Check the official site." if STRICT_MONEY.search(t) else "")
    parts = re.split(r"(?<=[.;])\s+", t)
    t = " ".join(s for s in parts if not ("VERIFY" in s and INTERNAL_NOTE.search(s)))
    t = re.sub(r"^\s*VERIFY\s*[—–-]\s*", "", t)
    if not t.strip():
        return ""
    if t.strip(" .") == "VERIFY":
        return "Check the official site"
    if MONEY_CONTEXT.search(t):
        t = re.sub(r"\bVERIFY current fee\b", "check the current fee on the official site", t)
        t = re.sub(r"\bVERIFY for the relevant cycle\b", "check the official site for the current cycle", t)
        t = re.sub(r"\bVERIFY (for )?(the )?current\b", "check the current", t)
        t = re.sub(r"\bVERIFY because\b", "check the official site, because", t)
        t = re.sub(r"\bVERIFY (the|with|on|against|directly)\b", r"check \1", t)  # "VERIFY the relevant notification"
        t = re.sub(r"\bVERIFY (pay|stipends?|fees?|dates?|timing|eligibility)\b", r"check the current \1 on the official site", t)
        t = re.sub(r"\bVERIFY\b", "check the official site", t)
    else:
        t = re.sub(r"\s*[;:,—–-]?\s*\bVERIFY\b\.?", "", t)
    t = re.sub(r"(\w)\s+check the", r"\1: check the", t)  # "current fee check..." -> "current fee: check..."
    t = re.sub(r"([.!?]\s+)check the", r"\1Check the", t)  # new sentence
    t = re.sub(r"\s{2,}", " ", t).strip()
    return t[:1].upper() + t[1:] if t[:1].islower() and t.startswith("check") else t


def first_link(el, rels):
    """URL of the first hyperlink inside an element (paragraph or cell)."""
    for h in el.iter(W + "hyperlink"):
        rid = h.get(R_ID)
        if rid and rid in rels and "hyperlink" in rels[rid].reltype:
            return clean_url(rels[rid].target_ref)
    m = LINK_ARTIFACT.search("".join(t.text or "" for t in el.iter(W + "t")))
    return clean_url(m.group(2)) if m else None


# ---------------------------------------------------------------- classification

SECTION_KINDS = [
    ("internships", r"internship"),
    ("certifications", r"certification"),
    ("careers", r"hired|careers you|jobs you|career options|job roles"),
    ("pg_india", r"postgraduate|post-graduate|\bpg\b|higher studies"),
    ("abroad", r"abroad"),
    ("growth", r"going forward|progression|career path|long-term|grow"),
    ("build", r"what to build|build the right|skill development|semester|during ug|year-by-year|foundation"),
    ("horizons", r"horizon"),
]
DROP_SECTION = re.compile(r"(?i)skill[- ]gap engine|could not verify")
DROP_LINE = re.compile(r"(?i)^(footer|largest gap)\b[^:]{0,40}:")
# Sub-headings the template uses - recognised even where a file has no bold.
KNOWN_SUBHEADS = {
    "facts", "specialisation", "specialisation options", "specialisation lanes", "government",
    "private and open-source", "government / public-sector routes", "private / open-source routes",
    "first-job titles", "adjacent roles", "application pack", "phd routes", "scholarships and fellowships",
    "scholarships/fellowships", "career horizons", "four career horizons", "skill-gap engine", "could not verify",
    "4-year honours variant", "four-year honours variant", "recommended final skill stack", "target progression",
    "career-route check", "career route check",
}
FACT_KEYS = ("Starts", "Current degree", "Course", "Timeline assumption")
# Facts that are bookkeeping or placeholders, not guidance for the student.
DROP_FACT = re.compile(r"(?i)^(desired career|career cluster|largest gap|footer|verification note|(level|category|typical duration)$)")
# Some files give the facts as a "Career Path" table (Level, Degree,
# Specialization, Target Career, ...) - read into the same fact names.
TABLE_FACT = {"degree": "Current degree", "specialization": "Course", "specialisation": "Course", "branch": "Course",
              "course": "Course", "target career": "Desired career", "career cluster": "Career cluster"}


def career_path_facts(header, rows):
    """{label: value} when a table is the roadmap's facts, else None."""
    hl = [h.strip().lower() for h in header]
    if "degree" in hl and len(rows) == 1:
        return {h: c["text"] for h, c in zip(header, rows[0])}
    if len(header) == 2 and hl[0] in ("field", "item", "parameter") and any(r and r[0]["text"].strip().lower() == "degree" for r in rows):
        return {r[0]["text"]: r[1]["text"] for r in rows if len(r) > 1}
    return None


def section_kind(heading):
    h = heading.lower()
    for kind, pat in SECTION_KINDS:
        if re.search(pat, h):
            return kind
    return "other"


def strip_heading(h):
    h = re.sub(r"^(Step\s*\d+\s*[:—\-–.]?\s*)", "", h, flags=re.I)
    h = re.sub(r"^\d+\.\s*", "", h)
    return h.strip() or "Details"


def role_from_title(title):
    t = clean_text(title)
    t = re.sub(r"(?i)^career\s+roadmap\s*[:·—\-–]\s*", "", t)
    t = re.sub(r"(?i)\s*[:·—\-–]?\s*roadmap$", "", t)
    t = re.sub(r"(?i)^roadmap\s*[:·—\-–]\s*", "", t)
    return t.strip(" :·—-–")


def is_bold(p):
    runs = [r for r in p.runs if r.text.strip()]
    return bool(runs) and all(r.bold for r in runs)


def bold_label(p):
    """('Label', 'rest') when the paragraph opens with a bold 'Label:'."""
    runs = [r for r in p.runs if r.text]
    if not runs or not runs[0].bold:
        return None
    prefix = ""
    for r in runs:
        if not r.bold:
            break
        prefix += r.text
    if ":" not in prefix:
        return None
    k, _, v = clean_text(p.text).partition(":")
    if not k or len(k) > 60:
        return None
    return k.strip(), v.strip()


def font_size(p):
    return next((r.font.size.pt for r in p.runs if r.font.size), None)


def is_title(p, text):
    size = font_size(p)
    return bool(size and size >= 16 and text)


def is_list_item(el):
    """A Word bullet/numbered paragraph - the file's own list marking."""
    return el.find(f"{W}pPr/{W}numPr") is not None


ARROW = ("↓", "→")


def flow_items(t):
    """The steps of a progression written as a chain - "A → B → C" on one
    line, or lines separated by "↓" / starting with "→" - else None."""
    lines = [x.strip() for x in t.split("\n") if x.strip()]
    if len(lines) > 1:
        if any(x in ARROW for x in lines) or sum(x.startswith("→") for x in lines) >= 2:
            items = [x.lstrip("→↓ ").strip() for x in lines if x not in ARROW]
            return items if len(items) >= 2 else None
        return None
    for sep in ("→", " > "):
        parts = [s.strip() for s in t.split(sep)]
        if len(parts) >= 3 and all(0 < len(s) <= 90 and ". " not in s for s in parts):
            parts[-1] = parts[-1].rstrip(".")
            return parts
    return None


def chain_block(t, label=None):
    """A progression ("A → B → C") or a skill stack ("A + B + C") as a flow
    block, else None."""
    items, sep = flow_items(t), "→"
    if not items:
        parts = [s.strip() for s in t.split(" + ")]
        if "\n" not in t and len(parts) >= 3 and all(0 < len(s) <= 60 and ". " not in s for s in parts):
            items, sep = parts, "+"
    if not items:
        return None
    # "With experience, the pathway can progress toward Senior X → Y": the
    # lead-in becomes the label, the chain starts at "Senior X".
    m = LEAD_IN.match(items[0]) if len(items[0].split()) > 5 else None
    if m and len(m.group(2).split()) <= 6:
        label = f"{label}: {m.group(1)}" if label else m.group(1)
        items = [m.group(2)] + items[1:]
    return {"type": "flow", "items": items, **({"sep": "+"} if sep == "+" else {}), **({"label": label} if label else {})}


LEAD_IN = re.compile(r"^(.*\b(?:towards?|into|to|from|via|is|are|as|be|becomes?|include|includes|:))\s+(\S.*)$")


# ---------------------------------------------------------------- parsing

def parse(path):
    d = docx.Document(path)
    rels = d.part.rels
    roadmaps = []
    cur = None
    section = None
    plain = []  # pending plain lines -> list or paragraphs
    last_num = 0
    uses_steps = False
    sub_num = 0  # > 0 while a numbered list restarted inside a section ("1. Excel", "2. AutoCAD", ...)
    skipping = False  # inside an ignorable part ("Skill-gap engine", "Could not verify")

    # Which roadmaps mark their lists with Word bullets (almost all). For the
    # few that don't, runs of short lines are read as lists instead.
    uses_bullets = []
    for el in d.element.body.iterchildren():
        if el.tag == W + "p":
            p = Paragraph(el, d)
            if is_title(p, clean_text(p.text)):
                uses_bullets.append(False)
            elif uses_bullets and is_list_item(el):
                uses_bullets[-1] = True

    def item(x):
        return {"text": x["text"], **({"url": x["url"]} if x.get("url") else {})}

    def para_block(x):
        return chain_block(x["text"]) or {"type": "p", **item(x)}

    def flush_plain():
        nonlocal plain
        if not plain or section is None or skipping:
            plain = []
            return
        blocks = section["blocks"]
        run = []

        def end_run(min_len):
            nonlocal run
            if len(run) >= min_len:
                blocks.append({"type": "list", "items": [item(r) for r in run]})
            else:
                blocks.extend(para_block(r) for r in run)
            run = []

        for x in plain:
            if cur["bullets"]:
                in_list = x["li"] and not chain_block(x["text"])
            else:
                # No bullets in this file: short lines run together as a list;
                # long lines, lead-ins ending in ":" and chains stand alone.
                in_list = len(x["text"]) <= 140 and not x["text"].endswith(":") and not chain_block(x["text"])
            if in_list:
                run.append(x)
            else:
                end_run(1 if cur["bullets"] else 2)
                blocks.append(para_block(x))
        end_run(1 if cur["bullets"] else 2)
        plain = []

    def new_section(heading, kind=None):
        nonlocal section, skipping
        flush_plain()
        skipping = bool(DROP_SECTION.search(heading))
        section = {"heading": strip_heading(heading), "kind": kind or section_kind(heading), "blocks": []}
        if DROP_SECTION.search(heading):
            section["drop"] = True
        cur["sections"].append(section)

    for el in d.element.body.iterchildren():
        if el.tag == W + "p":
            p = Paragraph(el, d)
            text = clean_text(p.text)
            if is_title(p, text):
                flush_plain()
                cur = {"title": text, "role": role_from_title(text), "summary": "", "facts": {}, "horizons": [], "sections": [],
                       "source": os.path.basename(path), "bullets": uses_bullets[len(roadmaps)]}
                roadmaps.append(cur)
                section, last_num, uses_steps, sub_num, skipping = None, 0, False, 0, False
                continue
            if cur is None or not text:
                continue
            if text in ARROW:
                if plain:
                    plain[-1]["chain"] = True  # the next line continues this progression
                continue
            if DROP_LINE.search(text):
                continue
            li = is_list_item(el)
            bold = is_bold(p)
            step = re.match(r"(?i)^step\s*(\d+)\b", text)
            if not bold and len(text) < 90 and (re.match(r"(?i)^step\s*\d+\s*[:—–-]", text) or (not li and text.lower() in KNOWN_SUBHEADS)):
                bold = True  # files without bold formatting
            num = re.match(r"^(\d+)\.\s+\S", text)
            if bold and step and len(text) < 90:
                uses_steps, sub_num = True, 0
                new_section(text)
                continue
            if bold and num and not li and len(text) < 90:
                n = int(num.group(1))
                if sub_num and n == sub_num + 1:
                    sub_num = n          # still inside a numbered list within this section
                elif n == last_num + 1 and not sub_num:
                    last_num = n
                    new_section(text)
                    continue
                else:
                    sub_num = n          # numbering restarted: these are sub-headings
            
            if section is None and not cur["summary"] and not bold:
                cur["summary"] = text
                continue
            lab = bold_label(p)
            if not lab and not bold and (section is not None or cur["summary"]):
                k, sep, v = text.partition(":")
                if sep and v.strip() and 2 <= len(k) <= 40 and len(k.split()) <= 5 and k[:1].isupper():
                    lab = (k.strip(), v.strip())  # "Starts: 2026", "Eligibility note: ..." in files without bold
            if lab and (section is None or section["kind"] == "facts"):
                # Some files put every fact in one paragraph with line breaks.
                for line in text.split("\n"):
                    k, sep, v = line.partition(":")
                    if sep and k.strip() and len(k) <= 60:
                        cur["facts"].setdefault(k.strip(), v.strip())
                continue
            if bold and text in ("Facts",):
                new_section("Facts", "facts")
                continue
            if bold and text.lower() in ("career horizons", "four career horizons", "career horizon"):
                new_section(text, "horizons")
                continue
            if bold and not li and not lab and len(text) <= 90 and section is not None and section["kind"] == "facts":
                # A heading after the facts ("Career-route check") opens real
                # content - it must not be dropped with the facts block.
                new_section(text)
                continue
            if section is None:
                new_section("Overview", "other")
            if lab and len(lab[1]) > 0:
                flush_plain()
                if not skipping:
                    # "0–2 years: Junior X → 2–5 years: Y → ..." is one chain, not a label
                    whole = chain_block(text) if lab[0][:1].isdigit() else None
                    section["blocks"].append(whole or chain_block(lab[1], lab[0]) or {"type": "note", "label": lab[0], "text": lab[1]})
                continue
            if bold and not li and len(text) <= 90:
                flush_plain()
                skipping = bool(DROP_SECTION.search(text))
                if not skipping:
                    # Bold is also used for emphasis: a progression, a skill
                    # stack or a whole sentence is not a sub-heading.
                    section["blocks"].append(chain_block(text) or ({"type": "p", "text": text} if text.endswith((".", "?")) or (text.endswith(":") and len(text) > 40) else {"type": "h", "text": text}))
                continue
            if skipping:
                continue
            if plain and (plain[-1].get("chain") or text.startswith("→")):
                # "A" / "↓" / "B", or "A" / "→ B": one progression
                plain[-1]["text"] += ("\n↓\n" if plain[-1].pop("chain", False) else "\n") + text
                continue
            url = first_link(el, rels)
            plain.append({"text": text, "li": li, **({"url": url} if url else {})})
        elif el.tag == W + "tbl" and cur is not None:
            flush_plain()
            t = Table(el, d)
            rows = []
            for r in t.rows:
                cells = []
                for c in r.cells:
                    txt = clean_text(c.text)
                    url = first_link(c._tc, rels)
                    cells.append({"text": txt, **({"url": url} if url else {})})
                # merged cells repeat; drop exact repeats within a row
                dedup = []
                for c in cells:
                    if dedup and c == dedup[-1]:
                        continue
                    dedup.append(c)
                rows.append(dedup)
            if not rows:
                continue
            header = [c["text"] for c in rows[0]]
            hl = " ".join(header).lower()
            if "your level" in hl and "target" in hl:
                continue  # placeholder skill-gap table
            if "period" in hl and "assessment" in hl:
                cur["horizons"] = [{"period": r[0]["text"], "question": r[1]["text"] if len(r) > 1 else "", "output": r[2]["text"] if len(r) > 2 else ""} for r in rows[1:] if r and r[0]["text"]]
                continue
            kv = career_path_facts(header, rows[1:]) if not cur["facts"] and len(cur["sections"]) <= 1 else None
            if kv:
                for k, v in kv.items():
                    if v.strip():
                        cur["facts"].setdefault(TABLE_FACT.get(k.strip().lower(), k.strip()), v.strip())
                if section is not None and section["blocks"] and section["blocks"][-1]["type"] == "h":
                    section["blocks"].pop()  # its "Career Path" heading
                continue
            if section is None:
                new_section("Overview", "other")
            if skipping:
                continue
            body = [r for r in rows[1:] if any(c["text"] for c in r)]
            section["blocks"].append({"type": "table", "header": header, "rows": body})
    flush_plain()

    for rm in roadmaps:
        raw = rm["facts"]
        rm["desired"] = raw.get("Desired career", "")
        # Plain text that sits among the facts (a progression, a note on the
        # route) is real guidance - shown as the roadmap's intro.
        rm["intro"] = [b for s in rm["sections"] if s["kind"] == "facts" and not s.get("drop") for b in s["blocks"]]
        rm["sections"] = [s for s in rm["sections"] if not s.get("drop") and s["kind"] != "facts" and s["blocks"]]
        rm["facts"] = {k: raw[k] for k in FACT_KEYS if raw.get(k)}
        # Other labelled lines in the facts block are real guidance
        # ("Career-route check: ...", "Mapping: ...") - kept as notes.
        rm["about"] = [{"label": k, "text": v} for k, v in raw.items() if v and k not in FACT_KEYS and not DROP_FACT.search(k)]
        # What the roadmap was written for, used to pick between versions of
        # the same role (e.g. Project Engineer - Electrical vs Mechanical).
        # Facts first (the stated degree/course), then the route notes and
        # the opening text, which often name the course ("For an Automobile
        # Engineering graduate, ...").
        first_texts = " ".join(b.get("text", "") for s in rm["sections"][:1] for b in s["blocks"][:3] if b.get("type") == "p")
        if not rm["summary"]:
            firsts = [b["text"] for s in rm["sections"][:2] for b in s["blocks"] if b.get("type") == "p" and len(b["text"]) > 60]
            rm["summary"] = firsts[0] if firsts else ""
        rm["context"] = " ".join([raw.get("Current degree", ""), raw.get("Course", ""), raw.get("Career cluster", ""),
                                  " ".join(a["text"][:160] for a in rm["about"]), rm["summary"][:200], first_texts[:200]]).strip()[:600]
    return roadmaps


# ---------------------------------------------------------------- matching

def norm(s):
    s = s.lower().replace("&", " and ")
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:80]


def main():
    repo, files = sys.argv[1], sys.argv[2:]
    clusters = json.load(open(os.path.join(repo, "data/graduates/career-clusters.json"), encoding="utf-8"))["clusters"]
    roles = sorted({r for c in clusters for r in c["roles"]})
    by_norm = {}
    for r in roles:
        by_norm.setdefault(norm(r), []).append(r)

    all_rm = []
    for f in files:
        all_rm.extend(parse(f))

    out_dir = os.path.join(repo, "public/roadmaps/ug")
    os.makedirs(out_dir, exist_ok=True)
    for name in os.listdir(out_dir):
        if name.endswith(".json"):
            os.remove(os.path.join(out_dir, name))

    index = {"roles": {}, "versions": {}, "roadmaps": []}
    review = []
    slug_count = {}
    seen, duplicates = set(), []
    for rm in all_rm:
        # The same roadmap pasted twice (word for word) is kept once.
        key = json.dumps([norm(rm["role"]), rm["summary"], rm["facts"], rm["sections"]], ensure_ascii=False, sort_keys=True)
        if key in seen:
            duplicates.append(rm["title"])
            continue
        seen.add(key)
        base = slugify(rm["role"])
        slug_count[base] = slug_count.get(base, 0) + 1
        slug = base if slug_count[base] == 1 else f"{base}-{slug_count[base]}"
        matched, how = by_norm.get(norm(rm["role"]), []), "exact"
        if matched and matched != [rm["role"]]:
            how = "same name, different punctuation"
        if not matched:
            # "Associate Product Manager (APM)" -> "Associate Product Manager"
            bare = re.sub(r"\s*\([^)]*\)\s*$", "", rm["role"])
            matched = by_norm.get(norm(bare), []) if bare != rm["role"] else []
            if matched:
                how = "name without the bracketed abbreviation"
        if not matched and rm.get("desired"):
            matched = by_norm.get(norm(rm["desired"]), [])
            if matched:
                how = "via the file's 'Desired career' line"
        if matched:
            for r in matched:
                index["roles"].setdefault(r, []).append(slug)
        else:
            how = "needs review"
            review.append((rm["role"], rm["title"], get_close_matches(rm["role"], roles, n=3, cutoff=0.6)))
        # "for": the degree/course the file states it was written for (weighs
        # most when picking a version); "about": the wider text around it.
        index["versions"][slug] = {"for": " ".join(v for v in (rm["facts"].get("Current degree", ""), rm["facts"].get("Course", "")) if v),
                                   "about": rm["context"]}
        index["roadmaps"].append({"slug": slug, "title": rm["title"], "role": rm["role"], "mappedTo": matched, "match": how, "source": rm["source"], "writtenFor": " · ".join(v for v in (rm["facts"].get("Current degree", ""), rm["facts"].get("Course", "")) if v)})
        with open(os.path.join(out_dir, f"{slug}.json"), "w", encoding="utf-8") as fh:
            json.dump({k: rm[k] for k in ("title", "role", "summary", "facts", "about", "intro", "horizons", "sections")}, fh, ensure_ascii=False, separators=(",", ":"))
    multi = {r: s for r, s in index["roles"].items() if len(s) > 1}

    # The report loads this small index on demand (never bundled), then the
    # one roadmap file it needs.
    with open(os.path.join(out_dir, "index.json"), "w", encoding="utf-8") as fh:
        json.dump({"roles": index["roles"], "versions": index["versions"]}, fh, ensure_ascii=False, separators=(",", ":"))
    stale = os.path.join(repo, "data/graduates/role-roadmaps-index.json")
    if os.path.exists(stale):
        os.remove(stale)

    lines = ["# UG role roadmaps - mapping review", "",
             f"Built from: {', '.join(os.path.basename(f) for f in files)}", "",
             f"- Roadmaps read: {len(all_rm)}",
             f"- Exact duplicates skipped (same roadmap twice in the files): {len(duplicates)}" + (f" - {', '.join(duplicates)}" if duplicates else ""),
             f"- Linked to dropdown roles: {sum(1 for r in index['roadmaps'] if r['mappedTo'])} roadmaps -> {len(index['roles'])} dropdown roles",
             f"- Need review (no exact role in the dropdown): {len(review)}",
             f"- Roles with more than one version (the report picks the one closest to the student's course): {len(multi)}", "",
             "## Needs review", "", "| Roadmap role | Title in file | Closest dropdown roles |", "|---|---|---|"]
    for role, title, sugg in review:
        lines.append(f"| {role} | {title} | {', '.join(sugg) or '-'} |")
    lines += ["", "## Roles with more than one version", ""]
    by_slug = {r["slug"]: r for r in index["roadmaps"]}
    for role, slugs in multi.items():
        lines.append(f"- **{role}**: " + "; ".join(f"{by_slug[s]['writtenFor'] or 'course not stated'}" for s in slugs))
    if not multi:
        lines.append("- none")
    lines += ["", "## Linked", "", "| Roadmap | Dropdown role(s) | Match |", "|---|---|---|"]
    for r in index["roadmaps"]:
        if r["mappedTo"]:
            lines.append(f"| {r['title']} | {', '.join(r['mappedTo'])} | {r['match']} |")
    with open(os.path.join(repo, "data/graduates/ROLE_ROADMAPS_REPORT.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")
    print(f"roadmaps {len(all_rm)} | duplicates skipped {len(duplicates)} | linked {sum(1 for r in index['roadmaps'] if r['mappedTo'])} | review {len(review)} | roles with several versions {len(multi)} | dropdown roles covered {len(index['roles'])}")


if __name__ == "__main__":
    main()
