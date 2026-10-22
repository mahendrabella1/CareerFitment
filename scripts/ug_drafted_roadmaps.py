"""Drafted UG role roadmaps - for dropdown roles that no Word-file batch covers.

The roadmaps from the Word files (scripts/build-ug-role-roadmaps.py) are
researched documents. For the roles still without one, data/graduates/
drafted-roadmaps.json holds a shorter, structured draft per role (what the
role does, a plan per year of the student's degree, skills, tools,
internships, certifications, higher study, progression), written with AI
assistance from the existing roadmaps and general knowledge. This module
expands each draft into the same roadmap format and adds it to
public/roadmaps/ug/ (files, index.json, catalog.json).

Rules:
- A Word-file roadmap always wins: a draft is only added for a role that has
  no roadmap, so a researched one sent later replaces the draft by itself.
- Every drafted roadmap says so on screen (its first "about" note) and is
  marked "drafted" in its file and in the index.
- Run by the main build at the end, or alone:
    python scripts/build-ug-role-roadmaps.py <repo> --drafts-only
"""
import json
import os
import re

SOURCE = "data/graduates/drafted-roadmaps.json"
REPORT = "data/graduates/DRAFTED_ROADMAPS.md"
DRAFT_NOTE = ("This roadmap was drafted with AI assistance from OneGrasp's related roadmaps and is awaiting expert review. "
              "Check fees, dates, eligibility and exam patterns on the official websites before you rely on them.")
STAGES = ["Entry-level", "Early career", "Mid-level", "Senior", "Leadership", "Advanced"]


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:80]


def _list(items):
    return {"type": "list", "items": [{"text": t} for t in items]}


def expand(d, cluster):
    """One draft -> the roadmap file format (lib/report/roleRoadmapGrad.tsx RoleRoadmap)."""
    role = d["role"]
    sections = []
    overview = [{"type": "p", "text": d["overview"]}, {"type": "h", "text": f"What a {role} does"}, _list(d["duties"])]
    if d.get("workplaces"):
        overview += [{"type": "p", "text": "Where they work:"}, _list(d["workplaces"])]
    sections.append({"heading": "Career Overview", "kind": "other", "blocks": overview})

    if d.get("progression"):
        rows = [[{"text": STAGES[min(i, len(STAGES) - 1)]}, {"text": t}] for i, t in enumerate(d["progression"])]
        sections.append({"heading": "Career Horizons", "kind": "horizons", "blocks": [{"type": "table", "header": ["Career stage", "Typical role"], "rows": rows}]})

    plan = []
    for label, theme, items in d["plan"]:
        plan += [{"type": "h", "text": f"{label}: {theme}"}, _list(items)]
    if d.get("plan_note"):
        plan.append({"type": "note", "label": "Note", "text": d["plan_note"]})
    sections.append({"heading": "Year-by-Year Learning Roadmap", "kind": "build", "blocks": plan})

    skills = d.get("skills", {})
    skill_rows = [[{"text": s}, {"text": "Technical"}] for s in skills.get("technical", [])] + [[{"text": s}, {"text": "Professional"}] for s in skills.get("soft", [])]
    if skill_rows:
        sections.append({"heading": "Essential Skills", "kind": "build", "blocks": [{"type": "table", "header": ["Skill", "Type"], "rows": skill_rows}]})
    if d.get("tools"):
        sections.append({"heading": "Tools and Technologies to Learn", "kind": "build", "blocks": [_list(d["tools"])]})
    if d.get("internships"):
        sections.append({"heading": "Internships and Practical Experience", "kind": "internships", "blocks": [_list(d["internships"])]})
    if d.get("certifications"):
        sections.append({"heading": "Certifications and Additional Training", "kind": "certifications", "blocks": [
            _list(d["certifications"]),
            {"type": "note", "label": "Before you enrol", "text": "Check the current syllabus, fees and eligibility on the certifying body's official website."},
        ]})
    higher = []
    if d.get("higher"):
        higher += [{"type": "p", "text": "Options after your degree:"}, _list(d["higher"])]
    if d.get("exams"):
        higher += [{"type": "p", "text": "Entrance exams and tests to know:"}, _list(d["exams"])]
    if higher:
        sections.append({"heading": "Higher Education Options in India", "kind": "pg_india", "blocks": higher})
    if d.get("abroad"):
        sections.append({"heading": "Study Abroad Options", "kind": "abroad", "blocks": [_list(d["abroad"])]})
    if d.get("related"):
        sections.append({"heading": "Career Opportunities", "kind": "careers", "blocks": [{"type": "p", "text": f"Roles a {role} can grow into or move across to:"}, _list(d["related"])]})
    if d.get("progression"):
        sections.append({"heading": "Recommended Career Progression", "kind": "growth", "blocks": [{"type": "flow", "items": d["progression"]}]})

    about = [{"label": "About this roadmap", "text": DRAFT_NOTE}]
    if d.get("note"):
        about.append({"label": "Important", "text": d["note"]})
    return {
        "title": f"Career Roadmap: {role}",
        "role": role,
        "summary": f"Career Domain: {cluster} · Qualification Pathway: {d['degree'].split(' (')[0]} – {d['course']} · Target Career: {role}",
        "facts": {"Current degree": d["degree"], "Course": d["course"]},
        "about": about,
        "intro": [],
        "horizons": [],
        "sections": sections,
        "drafted": True,
    }


def merge_drafts(repo, write_catalog):
    """Add every draft whose role has no roadmap yet; returns (added, skipped)."""
    out_dir = os.path.join(repo, "public/roadmaps/ug")
    index_path = os.path.join(out_dir, "index.json")
    index = json.load(open(index_path, encoding="utf-8"))
    # Drafts from an earlier run go first, so this run decides afresh.
    old = {s for s, v in index["versions"].items() if v.get("drafted")}
    for s in old:
        index["versions"].pop(s, None)
        p = os.path.join(out_dir, f"{s}.json")
        if os.path.exists(p):
            os.remove(p)
    index["roles"] = {r: [s for s in sl if s not in old] for r, sl in index["roles"].items()}
    index["roles"] = {r: sl for r, sl in index["roles"].items() if sl}

    src = os.path.join(repo, SOURCE)
    drafts = json.load(open(src, encoding="utf-8"))["roadmaps"] if os.path.exists(src) else []
    clusters = json.load(open(os.path.join(repo, "data/graduates/career-clusters.json"), encoding="utf-8"))["clusters"]
    cluster_of = {}
    for c in clusters:
        for r in c["roles"]:
            cluster_of.setdefault(r, c["name"])

    # The sheet's UG rows (row N = item N-1): a draft names its row, and its
    # degree, course and role are taken from there exactly.
    sheet = [(m["degree"], m["course"], r) for m in json.load(open(os.path.join(repo, "data/graduates/career-clusters.json"), encoding="utf-8"))["masterRows"]
             if (m.get("level") or "UG") == "UG" for r in m["roles"]]
    researched = set(index["roles"])  # roles with a Word-file roadmap
    added, skipped, unknown = [], [], []
    for d in drafts:
        if d.get("row"):
            degree, course, sheet_role = sheet[d["row"] - 1]
            if d.get("role") and d["role"] != sheet_role:
                raise SystemExit(f"{SOURCE}: row {d['row']} is {sheet_role!r}, not {d['role']!r}")
            d = {**d, "role": sheet_role, "degree": degree, "course": course}
        role = d["role"]
        if role not in cluster_of:
            unknown.append(role)
            continue
        if role in researched:
            skipped.append(role)
            continue
        base = slugify(role)
        slug, n = base, 1
        while slug in index["versions"] or os.path.exists(os.path.join(out_dir, f"{slug}.json")):
            n += 1
            slug = f"{base}-{n}"
        rm = expand(d, cluster_of[role])
        with open(os.path.join(out_dir, f"{slug}.json"), "w", encoding="utf-8") as fh:
            json.dump(rm, fh, ensure_ascii=False, separators=(",", ":"))
        index["roles"].setdefault(role, []).append(slug)
        index["versions"][slug] = {"for": f"{d['degree']} {d['course']}", "course": d["course"], "about": f"{cluster_of[role]} {d['overview']}",
                                   "level": "ug", "drafted": True}
        added.append((role, d["degree"].split(" (")[0], d["course"], slug))
    if unknown:
        raise SystemExit(f"{SOURCE}: not dropdown roles (fix the names): {', '.join(unknown)}")

    with open(index_path, "w", encoding="utf-8") as fh:
        json.dump({"roles": index["roles"], "versions": index["versions"]}, fh, ensure_ascii=False, separators=(",", ":"))
    write_catalog(repo)

    lines = ["# Drafted UG role roadmaps", "",
             "Roles that no Word-file batch covers get a shorter roadmap drafted with AI assistance",
             f"(`{SOURCE}`, expanded by `scripts/ug_drafted_roadmaps.py`). Each one says on screen that it",
             "awaits expert review. A researched roadmap for the same role replaces the draft automatically.", "",
             f"- Drafted roadmaps added: {len(added)}",
             f"- Drafts skipped because a researched roadmap now exists: {len(skipped)}" + (f" - {', '.join(skipped)}" if skipped else ""), "",
             "| Role | Written for | File |", "|---|---|---|"]
    lines += [f"| {r} | {deg} - {course} | `{slug}.json` |" for r, deg, course, slug in added]
    with open(os.path.join(repo, REPORT), "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")
    return added, skipped
