"""
Splits SE kennels into 25% partner list + 75% outreach list.
Only considers entries not already sent (skickat != 'skickat') and with email.
"""
import csv
import random
from pathlib import Path

random.seed(42)  # reproducible

BASE = Path(r"C:\dev\flocken-website\scripts\hunddagis-dataset\data")
SRC = BASE / "hunddagis_se_kennels_master_filtered_final.csv"

with open(SRC, encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f)
    rows = list(reader)
    fields = reader.fieldnames

eligible = [r for r in rows if r["skickat"].strip().lower() != "skickat" and r["email"].strip()]
already_sent = [r for r in rows if r["skickat"].strip().lower() == "skickat"]
no_email = [r for r in rows if not r["email"].strip() and r["skickat"].strip().lower() != "skickat"]

random.shuffle(eligible)
n_partner = round(len(eligible) * 0.25)
partner = eligible[:n_partner]
outreach = eligible[n_partner:]

def write(path, rows_):
    with open(path, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows_)

write(BASE / "hunddagis_se_kennels_partner.csv", partner)
write(BASE / "hunddagis_se_kennels_outreach.csv", outreach)
write(BASE / "hunddagis_se_kennels_no_email.csv", no_email)

print(f"Totalt SE kennels: {len(rows)}")
print(f"  Redan skickat:      {len(already_sent)}")
print(f"  Saknar email:       {len(no_email)}  -> no_email.csv")
print(f"  Kvalificerade:      {len(eligible)}")
print(f"    → Partner (25%):  {len(partner)}  -> partner.csv")
print(f"    → Outreach (75%): {len(outreach)} -> outreach.csv")
