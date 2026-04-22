"""
Adds `friendly_name` column to marked CSVs using rule-based extraction.
Output: *_final.csv with friendly_name populated. Review/tweak manually.
"""
import csv
import re
from pathlib import Path

BASE = Path(r"C:\dev\flocken-website\scripts\hunddagis-dataset\data")

# Suffixes to drop from the end of names (case-insensitive whole-word match)
DROP_SUFFIXES = [
    "hunddagis", "hundagis", "hunddaghem",
    "hundpensionat", "hundepensjonat", "hundepension", "hundpension",
    "hundhotell", "hundhotel", "hundehotell",
    "djurpensionat", "djurhotell",
    "hundebarnehage", "hundepass", "hundepasning",
    "ab", "as", "aps", "i/s",
    "kennel & kurser",  # multi-word first (greedy match)
    "kennel och kurser",
    "kennel",       # only drops if not the only distinctive word
    "& kurser",
    "och kurser",
    "& foder",
    "avel & foder",
    "avel",
]

# If stripping would leave one of these generic words alone, keep the suffix
GENERIC_AFTER_STRIP = set([
    "uppsala", "stockholm", "göteborg", "malmö", "oslo", "bergen",
    "köbenhavn", "københavn", "danish", "norsk", "svenska",
    "the", "my", "our",
])

def fix_apostrophes(s: str) -> str:
    return s.replace("`", "'").replace("´", "'").replace("’", "'")

def strip_leading_address(s: str) -> str:
    # "Hestsjøvegen 92 , Kennel Izzari" -> "Kennel Izzari"
    m = re.match(r"^[A-Za-zÅÄÖåäöøæÆØ\-\.]+\s+\d+[a-zA-Z]?\s*,\s*(.+)$", s)
    return m.group(1).strip() if m else s

def drop_trailing_suffix(s: str) -> str:
    # Repeatedly strip drop suffixes (trailing or parenthetical)
    changed = True
    while changed:
        changed = False
        lower = s.lower().strip()
        for suf in DROP_SUFFIXES:
            # trailing match: optional preceding space/punct
            m = re.match(rf"^(.+?)(?:[\s,\-/&]+|\s*\()\s*{re.escape(suf)}s?\s*\)?\.?$", s, re.IGNORECASE)
            if m:
                candidate = m.group(1).strip(" ,-/&.\"'")
                if not candidate or candidate.lower() in GENERIC_AFTER_STRIP:
                    continue
                s = candidate
                changed = True
                break
    return s

def remove_inline_suffix(s: str) -> str:
    # "Hundra hundar hunddagis Hammarbyallén" -> "Hundra hundar Hammarbyallén"
    # But don't strip if it leaves an orphan conjunction ("& Kurser", "och X").
    for suf in DROP_SUFFIXES:
        pattern = rf"\s+{re.escape(suf)}s?\s+"
        def _sub(m):
            # If replacement would produce leading "& ", "och ", "and ", "/ ", skip
            start, end = m.start(), m.end()
            after = s[end:].lstrip().lower()
            if after.startswith(("&", "och ", "and ", "/", "+", ",")):
                return m.group(0)  # keep original
            return " "
        s_new = re.sub(pattern, _sub, s, flags=re.IGNORECASE)
        if s_new != s:
            s = s_new
    return re.sub(r"\s{2,}", " ", s).strip()

def clean_possessive(s: str) -> str:
    # "Min Gård's" -> "Min Gårds" (remove apostrophe in possessive when it looks awkward)
    # Keep: "R4's" (short/alphanumeric+'s is fine)
    return s  # keep apostrophes; this one is judgment-heavy

def strip_genitive_s(s: str) -> str:
    """Remove Swedish genitive trailing 's' after stripping suffixes.
    'Drömgårdens' -> 'Drömgården', 'Guldkullens' -> 'Guldkullen'.
    Only for compound Swedish place/property words — NOT short nicknames."""
    if not s:
        return s
    # Only consider last word
    parts = s.rsplit(" ", 1)
    last = parts[-1] if len(parts) > 1 else s
    prefix = parts[0] + " " if len(parts) > 1 else ""
    if len(last) < 6 or not last.endswith("s"):
        return s
    without_s = last[:-1]
    # Only strip 's' from clearly compound Swedish words (place/farm names)
    compound_endings = (
        "gården", "gärdet", "berget", "kullen", "åsen", "ängen",
        "backen", "dalen", "holmen", "udden", "lunden", "hagen",
        "tången", "fältet", "torget", "lyckan", "höjden", "stigen",
        "farmen", "huset", "stugan", "tallen", "bäcken", "sjön",
        "eken", "spången",
    )
    if without_s.lower().endswith(compound_endings):
        return prefix + without_s
    return s

def friendly(name: str) -> str:
    s = fix_apostrophes(name).strip()
    s = strip_leading_address(s)
    s = remove_inline_suffix(s)
    s = drop_trailing_suffix(s)
    s = clean_possessive(s)
    # Strip genitive 's' if the name had a suffix removed (compare to original)
    if s != fix_apostrophes(name).strip():
        s = strip_genitive_s(s)
    # Collapse double spaces
    s = re.sub(r"\s+", " ", s).strip(" ,-/&.\"'")
    return s or name  # fallback to original if we stripped everything

def process(path_in: Path):
    out = path_in.with_name(path_in.stem.replace("_marked", "") + "_final.csv")
    with open(path_in, encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fields = reader.fieldnames

    # Insert friendly_name right after namn
    new_fields = ["namn", "friendly_name"] + [f for f in fields if f != "namn"]
    with open(out, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=new_fields)
        writer.writeheader()
        for r in rows:
            r["friendly_name"] = friendly(r["namn"])
            writer.writerow({k: r.get(k, "") for k in new_fields})
    print(f"  {path_in.name} -> {out.name}")

def main():
    files = [
        "hunddagis_sverige_master_marked.csv",
        "hunddagis_no_master_marked.csv",
        "hunddagis_dk_master_marked.csv",
        "hunddagis_se_kennels_master_filtered_marked.csv",
        "hunddagis_no_kennels_master_filtered_marked.csv",
        "hunddagis_dk_kennels_master_filtered_marked.csv",
    ]
    for f in files:
        process(BASE / f)

if __name__ == "__main__":
    main()
