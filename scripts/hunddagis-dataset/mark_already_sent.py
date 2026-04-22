"""
Marks entries in new master CSVs that were already contacted via Make.
Adds `skickat`, `datum`, `tid` columns based on matches from Make's sent lists.
"""
import csv
from pathlib import Path

BASE = Path(r"C:\dev\flocken-website\scripts\hunddagis-dataset\data")
DOWNLOADS = Path(r"C:\Users\torbj\Downloads")

MAKE_DAGIS = DOWNLOADS / "hunddagis_sverige_master - sista-gratis_hunddagis_sverige_master.csv"
MAKE_KENNELS = DOWNLOADS / "kennlar_ren_lista - bara_email_kennlar_ren_lista.csv"

def norm(s): return (s or "").strip().lower()

def load_sent(path):
    sent = {}  # normalized name -> (skickat, datum, tid)
    with open(path, encoding="utf-8") as f:
        # File has trailing unnamed columns; read raw
        reader = csv.reader(f)
        header = next(reader)
        for row in reader:
            row = row + [""] * (9 - len(row))
            name, stad = row[0], row[1]
            # kennels file has col idx: 0=namn, 1=stad, 2=email, 3=hemsida, 4=fb, 5=skickat, 6=datum, 7=tid
            # dagis file has: 0=namn, 1=stad, 2=email_name, 3=email, 4=hemsida, 5=fb, 6=skickat, 7=datum, 8=tid
            if "email_name" in header:
                skickat, datum, tid = row[6], row[7], row[8]
            else:
                skickat, datum, tid = row[5], row[6], row[7]
            if skickat.strip().lower() == "skickat":
                sent[norm(name)] = (skickat, datum, tid)
    return sent

def process(input_csv, sent_map, output_csv):
    with open(input_csv, encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fields = reader.fieldnames

    new_fields = fields + ["skickat", "datum", "tid"]
    matched = 0
    with open(output_csv, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=new_fields)
        writer.writeheader()
        for r in rows:
            key = norm(r["namn"])
            if key in sent_map:
                s, d, t = sent_map[key]
                r["skickat"], r["datum"], r["tid"] = s, d, t
                matched += 1
            else:
                r["skickat"] = r["datum"] = r["tid"] = ""
            writer.writerow(r)
    print(f"  {input_csv.name}: {matched}/{len(rows)} markerade som skickade -> {output_csv.name}")

def main():
    dagis_sent = load_sent(MAKE_DAGIS)
    kennels_sent = load_sent(MAKE_KENNELS)
    print(f"Make dagis-lista: {len(dagis_sent)} skickade")
    print(f"Make kennels-lista: {len(kennels_sent)} skickade\n")

    mappings = [
        (BASE / "hunddagis_sverige_master.csv",                dagis_sent),
        (BASE / "hunddagis_no_master.csv",                     dagis_sent),
        (BASE / "hunddagis_dk_master.csv",                     dagis_sent),
        (BASE / "hunddagis_se_kennels_master_filtered.csv",    kennels_sent),
        (BASE / "hunddagis_no_kennels_master_filtered.csv",    kennels_sent),
        (BASE / "hunddagis_dk_kennels_master_filtered.csv",    kennels_sent),
    ]
    for src, sent in mappings:
        out = src.with_name(src.stem + "_marked.csv")
        process(src, sent, out)

if __name__ == "__main__":
    main()
