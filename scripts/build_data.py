#!/usr/bin/env python3
"""RKI-Board Daten-Pipeline: holt die aktuellen RKI-Offen-Daten und baut
data/dashboard_data.json + assets/data.js (window.DASH_DATA).

Quellen (GitHub, Robert Koch-Institut, werden wöchentlich aktualisiert):
  - GrippeWeb_Daten_des_Wochenberichts  (ARE-/ILI-Inzidenz)
  - SARI-Hospitalisierungsinzidenz      (Krankenhaus-Einweisungen)
  - ARE-Konsultationsinzidenz           (Praxis-Sentinel)

Europa-Teil (ECDC ERVISS, GitHub EU-ECDC/Respiratory_viruses_weekly_data):
  - ILIARIRates.csv                     (ILI-/ARI-Konsultationsraten je Land)
  - SARIRates.csv                       (SARI-Raten je Land)
   - SARITestsDetectionsPositivity.csv   (Tests/Positivität je Land & Erreger)
  → data/europe_data.json + assets/europe_data.js (window.EUROPE_DATA)

Lokal testen ohne Netz:  python3 scripts/build_data.py --dir data
Im CI (GitHub Actions):  python3 scripts/build_data.py   (lädt per HTTP)
"""
import csv
import io
import json
import os
import sys
import urllib.request

SOURCES = {
    "grippe": "https://raw.githubusercontent.com/robert-koch-institut/GrippeWeb_Daten_des_Wochenberichts/main/GrippeWeb_Daten_des_Wochenberichts.tsv",
    "sari":   "https://raw.githubusercontent.com/robert-koch-institut/SARI-Hospitalisierungsinzidenz/main/SARI-Hospitalisierungsinzidenz.tsv",
    "are":    "https://raw.githubusercontent.com/robert-koch-institut/ARE-Konsultationsinzidenz/main/ARE-Konsultationsinzidenz.tsv",
}

ECDC_BASE = "https://raw.githubusercontent.com/EU-ECDC/Respiratory_viruses_weekly_data/main/data/"
ECDC_SOURCES = {
    "ILIARIRates": ECDC_BASE + "ILIARIRates.csv",
    "SARIRates": ECDC_BASE + "SARIRates.csv",
    "SARITestsDetectionsPositivity": ECDC_BASE + "SARITestsDetectionsPositivity.csv",
}

ECDC_POS_TYPES = {"Influenza", "Influenza A", "Influenza B", "RSV", "SARS-CoV-2"}

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def fetch(key, local_dir=None):
    if local_dir:
        path = os.path.join(local_dir, key + ".tsv")
        if not os.path.exists(path):
            path = os.path.join(local_dir, os.path.basename(SOURCES[key]))
        with open(path, encoding="utf-8") as f:
            return f.read()
    with urllib.request.urlopen(SOURCES[key], timeout=60) as r:
        return r.read().decode("utf-8")


def fetch_csv(key, local_dir=None):
    if local_dir:
        path = os.path.join(local_dir, key + ".csv")
        if os.path.exists(path):
            with open(path, encoding="utf-8") as f:
                return f.read()
    with urllib.request.urlopen(ECDC_SOURCES[key], timeout=120) as r:
        return r.read().decode("utf-8")


def rows(text):
    lines = text.splitlines()
    header = lines[0].split("\t")
    for line in lines[1:]:
        if line.strip():
            yield dict(zip(header, line.split("\t")))


def csv_rows(text):
    return csv.DictReader(io.StringIO(text))


def num(s):
    v = float(s)
    return int(v) if v.is_integer() else v


def week_of(kw):           # "2026-W41" -> 41
    return int(kw.split("-W")[1])


def as_tuple(kw):          # "2026-W41" -> (2026, 41)
    y, w = kw.split("-W")
    return (int(y), int(w))


def season_of(kw):         # "2026-W41" -> "2026/27" (Saison ab KW 40)
    y, w = as_tuple(kw)
    if w >= 40:
        return "%d/%02d" % (y, (y + 1) % 100)
    return "%d/%02d" % (y - 1, y % 100)


def add(store, age, season, week, value):
    store.setdefault(age, {}).setdefault(season, []).append((week, value))


def build(local_dir=None):
    data = {"grippe": {"ARE": {}, "ILI": {}}, "sari": {}, "are": {}, "latest": None}
    latest_pool = []  # rohe Kalenderwoche-Strings für die latest-Bestimmung

    # --- GrippeWeb: ARE / ILI, nur Bundesweit ---
    for r in rows(fetch("grippe", local_dir)):
        if r["Region"] != "Bundesweit":
            continue
        add(data["grippe"][r["Erkrankung"]], r["Altersgruppe"], r["Saison"],
            week_of(r["Kalenderwoche"]), num(r["Inzidenz"]))
        if r["Erkrankung"] == "ARE" and r["Altersgruppe"] == "00+":
            latest_pool.append(r["Kalenderwoche"])

    # --- SARI: nach Erreger-Spalte (Gesamt, COVID-19, Influenza, RSV) ---
    for r in rows(fetch("sari", local_dir)):
        add(data["sari"].setdefault(r["SARI"], {}), r["Altersgruppe"], r["Saison"],
            week_of(r["Kalenderwoche"]), num(r["Hospitalisierungsinzidenz"]))
        if r["SARI"] == "Gesamt" and r["Altersgruppe"] == "00+":
            latest_pool.append(r["Kalenderwoche"])

    # --- ARE-Konsultationsinzidenz: nur Bundesweit ---
    for r in rows(fetch("are", local_dir)):
        if r["Bundesland"] != "Bundesweit":
            continue
        add(data["are"], r["Altersgruppe"], r["Saison"],
            week_of(r["Kalenderwoche"]), num(r["ARE_Konsultationsinzidenz"]))

    # Wochen sortieren, Saisons aufsteigend, Punkte als [KW, Wert]
    def finish(store):
        out = {}
        for age, seasons in store.items():
            out[age] = {s: sorted(seasons[s]) for s in sorted(seasons)}
        return out

    for key in ("ARE", "ILI"):
        data["grippe"][key] = finish(data["grippe"][key])
    data["sari"] = {k: finish(v) for k, v in sorted(data["sari"].items())}
    data["are"] = finish(data["are"])

    # latest = höchste Kalenderwoche (Jahr, KW) aus GrippeWeb-ARE 00+ und
    # SARI-Gesamt 00+ – direkt aus den rohen "JJJJ-WKW"-Strings der TSVs.
    data["latest"] = max(latest_pool, key=as_tuple)

    return data


# ---------------------------------------------------------------------------
# Europa: ECDC ERVISS
# ---------------------------------------------------------------------------

def ecdc_add(store, country, age, season, week, value):
    """Pro Land/Altersgruppe/Saison Wochen zu einem dict verdichten
    (doppelte Wochen: letzter Wert gewinnt), damit die JSON-Kompaktierung
    sauber sortiert ist."""
    leaf = store.setdefault(country, {}).setdefault(age, {}).setdefault(season, {})
    leaf[week] = value


def ecdc_finish(store):
    out = {}
    for country, ages in store.items():
        out[country] = {}
        for age, seasons in ages.items():
            out[country][age] = {s: sorted(seasons[s].items()) for s in sorted(seasons)}
    return out


def build_europe(local_dir=None):
    eu = {"sari": {}, "ili": {}, "ari": {}, "pos": {}, "latest": None}
    latest_pool = []

    def fnum(s):
        try:
            v = float(s)
        except (TypeError, ValueError):
            return None
        return int(v) if v.is_integer() else v

    # --- SARI-Raten (pro 100.000 Einwohner / Woche) ---
    for r in csv_rows(fetch_csv("SARIRates", local_dir)):
        v = fnum(r["value"])
        if v is None:
            continue
        ecdc_add(eu["sari"], r["countryname"], r["age"],
                 season_of(r["yearweek"]), week_of(r["yearweek"]), v)
        latest_pool.append(r["yearweek"])

    # --- ILI- und ARI-Konsultationsraten ---
    for r in csv_rows(fetch_csv("ILIARIRates", local_dir)):
        v = fnum(r["value"])
        if v is None:
            continue
        key = "ili" if r["indicator"] == "ILIconsultationrate" else "ari"
        ecdc_add(eu[key], r["countryname"], r["age"],
                 season_of(r["yearweek"]), week_of(r["yearweek"]), v)
        latest_pool.append(r["yearweek"])

    # --- Positivität (Tests, Altersgruppe total) je Erreger-Typ ---
    for r in csv_rows(fetch_csv("SARITestsDetectionsPositivity", local_dir)):
        if r["indicator"] != "positivity" or r["age"] != "total":
            continue
        if r["pathogentype"] not in ECDC_POS_TYPES:
            continue
        v = fnum(r["value"])
        if v is None:
            continue
        ecdc_add(eu["pos"], r["countryname"], r["pathogentype"],
                 season_of(r["yearweek"]), week_of(r["yearweek"]), v)

    eu["sari"] = ecdc_finish(eu["sari"])
    eu["ili"] = ecdc_finish(eu["ili"])
    eu["ari"] = ecdc_finish(eu["ari"])
    eu["pos"] = ecdc_finish(eu["pos"])

    eu["latest"] = max(latest_pool, key=as_tuple)
    return eu


def main():
    local_dir = None
    if len(sys.argv) >= 3 and sys.argv[1] == "--dir":
        local_dir = sys.argv[2]

    data = build(local_dir)
    europe = build_europe(local_dir)

    json_path = os.path.join(ROOT, "data", "dashboard_data.json")
    js_path = os.path.join(ROOT, "assets", "data.js")
    eu_json_path = os.path.join(ROOT, "data", "europe_data.json")
    eu_js_path = os.path.join(ROOT, "assets", "europe_data.js")
    os.makedirs(os.path.dirname(json_path), exist_ok=True)
    os.makedirs(os.path.dirname(js_path), exist_ok=True)

    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    with open(json_path, "w", encoding="utf-8") as f:
        f.write(payload + "\n")
    with open(js_path, "w", encoding="utf-8") as f:
        f.write("window.DASH_DATA = " + payload + ";\n")

    eu_payload = json.dumps(europe, ensure_ascii=False, separators=(",", ":"))
    with open(eu_json_path, "w", encoding="utf-8") as f:
        f.write(eu_payload + "\n")
    with open(eu_js_path, "w", encoding="utf-8") as f:
        f.write("window.EUROPE_DATA = " + eu_payload + ";\n")

    print("latest:", data["latest"])
    print("grippe ARE 00+ letzte Saison:",
          list(data["grippe"]["ARE"]["00+"])[-1],
          data["grippe"]["ARE"]["00+"][list(data["grippe"]["ARE"]["00+"])[-1]][-3:])
    print("sari Gesamt 00+ letzte Saison:",
          list(data["sari"]["Gesamt"]["00+"])[-1],
          data["sari"]["Gesamt"]["00+"][list(data["sari"]["Gesamt"]["00+"])[-1]][-3:])
    print("europa latest:", europe["latest"],
          "| SARI-Länder:", len(europe["sari"]),
          "| ILI-Länder:", len(europe["ili"]),
          "| ARI-Länder:", len(europe["ari"]),
          "| Positivitäts-Länder:", len(europe["pos"]))
    print("geschrieben:", json_path, "und", js_path)
    print("geschrieben:", eu_json_path, "und", eu_js_path)


if __name__ == "__main__":
    main()
