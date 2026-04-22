"""
Retroaktivt filter för kennel-CSV:ar.
Tar bort rader som inte ser ut som riktiga kennlar/avelsverksamheter.

Användning:
    python filter_kennels_csv.py data/hunddagis_se_kennels_master.csv
    python filter_kennels_csv.py data/hunddagis_no_kennels_master.csv
"""

import csv
import sys
from pathlib import Path

# Same criterion as in build_hunddagis_dataset.py:
# If a kennel/breeding word is in the NAME, it's a kennel. Simple & reliable.
_KENNEL_NAME_KEYWORDS = [
    "kennel",       # kennel, kennels, kennelklubb, etc.
    "avel",         # avel, avlskennel, avlshund
    "uppfödning",
    "uppfödare",
    "valpkull",
    # Norwegian
    "oppdrett",
    "oppdretter",
    "avlshund",
    # Danish
    "opdræt",
    "opdrætter",
]


def is_kennel(row: dict) -> bool:
    name = row.get("namn", "").lower()
    return any(kw in name for kw in _KENNEL_NAME_KEYWORDS)


def filter_file(path: Path):
    rows = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            rows.append(row)

    kept = [r for r in rows if is_kennel(r)]
    removed = len(rows) - len(kept)

    out_path = path.with_name(path.stem + "_filtered.csv")
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(kept)

    print(f"Input:   {len(rows)} rader  ({path.name})")
    print(f"Borttagna: {removed} rader som inte är kennlar/avel")
    print(f"Kvar:    {len(kept)} rader")
    print(f"Output:  {out_path.name}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Användning: python filter_kennels_csv.py <csv-fil>")
        sys.exit(1)
    filter_file(Path(sys.argv[1]))
