# -*- coding: utf-8 -*-
"""Make the attention-to-detail item actually test attention to detail.

The item was not broken — three options read 987654, one read 987564, and the
key pointed at the odd one. But three LITERALLY IDENTICAL options mean a student
never compares digits: the different one is visible at a glance by its shape
alone. It was the easiest item in the section while being marked medium, and it
measured shape-spotting rather than the careful reading it claims to.

Rewritten as pair matching. Every option now looks distinct, so the only way to
answer is to actually read each pair and compare it against itself:

    Which pair does NOT match?
      987654 / 987564   <- the odd pair, 5 and 6 transposed
      456789 / 456789
      123456 / 123456
      987654 / 987654

Same skill, same difficulty band, but the shortcut is gone.

The answer stays at option A so the section's answer-key spread (A x3, B x3,
C x2, D x2) is untouched — that spread exists to stop a student scoring by
guessing one letter throughout, and reshuffling this item would disturb it.

Usage:  python scripts/fix_attention_to_detail_item.py [--dry-run]
"""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

BANK = Path(__file__).resolve().parent.parent / "data" / "aptitude-questions.json"
STAGE, SET = "9-10", "Set 1"

OLD_TEXT = "Which of the following numbers is different?"
NEW = {
    "text": "Which pair does NOT match?",
    "options": [
        "987654  /  987564",
        "456789  /  456789",
        "123456  /  123456",
        "987654  /  987654",
    ],
    "correct": 0,
}


def main(dry_run: bool) -> None:
    bank = json.loads(BANK.read_text(encoding="utf-8"))
    qs = bank[STAGE][SET]

    target = next((q for q in qs if q["text"] == OLD_TEXT), None)
    if target is None:
        if any(q["text"] == NEW["text"] for q in qs):
            print("already applied — nothing to do")
            return
        raise SystemExit(f"could not find an item with text {OLD_TEXT!r}")

    before_key = Counter(chr(65 + q["correct"]) for q in qs)
    print(f"{target['q']}  {target['domain']} / {target['difficulty']}")
    print("  was:")
    for i, o in enumerate(target["options"]):
        print(f"     {chr(65 + i)} {o}{'   <- answer' if i == target['correct'] else ''}")

    target["text"] = NEW["text"]
    target["options"] = list(NEW["options"])
    target["correct"] = NEW["correct"]

    print("  now:")
    for i, o in enumerate(target["options"]):
        print(f"     {chr(65 + i)} {o}{'   <- answer' if i == target['correct'] else ''}")

    # Every option must now be distinct, which is the whole point.
    if len(set(target["options"])) != len(target["options"]):
        raise SystemExit("options are still not all distinct")
    # And exactly one pair may mismatch, or there is more than one right answer.
    mismatched = [i for i, o in enumerate(target["options"])
                  if len({p.strip() for p in o.split("/")}) > 1]
    if mismatched != [target["correct"]]:
        raise SystemExit(f"expected exactly one mismatched pair at the key, got {mismatched}")

    after_key = Counter(chr(65 + q["correct"]) for q in qs)
    print(f"\n  answer key  before {dict(sorted(before_key.items()))}"
          f"  after {dict(sorted(after_key.items()))}")
    if before_key != after_key:
        raise SystemExit("the answer-key spread changed — refusing to write")

    if dry_run:
        print("\n--dry-run: nothing written")
        return
    BANK.write_text(json.dumps(bank, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\nwrote {BANK.name}")


if __name__ == "__main__":
    main("--dry-run" in sys.argv)
