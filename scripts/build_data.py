#!/usr/bin/env python3
"""RKI-Board Daten-Pipeline: holt die aktuellen RKI-Offen-Daten und baut
data/dashboard_data.json + assets/data.js (window.DASH_DATA).

Quellen (GitHub, Robert Koch-Institut, werden wöchentlich aktualisiert):
  - GrippeWeb_Daten_des_Wochenberichts  (ARE-/ILI-Inzidenz)
  - SARI-Hospitalisierungsinzidenz      (Krankenhaus-Einweisungen)
  - ARE-Konsultationsinzidenz           (Praxis-Sentinel)

Lokal testen ohne Netz:  python3 scripts/build_data.py --dir data
Im CI (GitHub Actions):  python3 scripts/build_data.py   (lädt per HTTP)
"""
import json
import os
import sys
import urllib.request

SOURCES = {
    "grippe": "https://raw.githubusercontent.com/robert-koch-institut/GrippeWeb_Daten_des_Wochenberichts/main/GrippeWeb_Daten_des_Wochenberichts.tsv",
    "sari":   "https://raw.githubusercontent.com/robert-koch-institut/SARI-Hospitalisierungsinzidenz/main/SARI-Hospitalisierungsinzidenz.tsv",
    "are":    "https://raw.githubusercontent.com/robert-koch-institut/ARE-Konsultationsinzidenz/main/ARE-Konsultationsinzidenz.tsv",
}

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


def rows(text):
    lines = text.splitlines()
    header = lines[0].split("\t")
    for line in lines[1:]:
        if line.strip():
            yield dict(zip(header, line.split("\t")))


def num(s):
    v = float(s)
    return int(v) if v.is_integer() else v


def week_of(kw):           # "2026-W41" -> 41
    return int(kw.split("-W")[1])


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
    def as_tuple(kw):
        y, w = kw.split("-W")
        return (int(y), int(w))

    data["latest"] = max(latest_pool, key=as_tuple)

    return data


def main():
    local_dir = None
    if len(sys.argv) >= 3 and sys.argv[1] == "--dir":
        local_dir = sys.argv[2]

    data = build(local_dir)

    json_path = os.path.join(ROOT, "data", "dashboard_data.json")
    js_path = os.path.join(ROOT, "assets", "data.js")
    os.makedirs(os.path.dirname(json_path), exist_ok=True)
    os.makedirs(os.path.dirname(js_path), exist_ok=True)

    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    with open(json_path, "w", encoding="utf-8") as f:
        f.write(payload + "\n")
    with open(js_path, "w", encoding="utf-8") as f:
        f.write("window.DASH_DATA = " + payload + ";\n")

    print("latest:", data["latest"])
    print("grippe ARE 00+ letzte Saison:",
          list(data["grippe"]["ARE"]["00+"])[-1],
          data["grippe"]["ARE"]["00+"][list(data["grippe"]["ARE"]["00+"])[-1]][-3:])
    print("sari Gesamt 00+ letzte Saison:",
          list(data["sari"]["Gesamt"]["00+"])[-1],
          data["sari"]["Gesamt"]["00+"][list(data["sari"]["Gesamt"]["00+"])[-1]][-3:])
    print("geschrieben:", json_path, "und", js_path)


if __name__ == "__main__":
    main()
