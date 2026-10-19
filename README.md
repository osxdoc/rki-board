# Atemwegserkrankungen im Überblick (RKI-Board)

Zweisprachige (DE/EN) Nachbildung des RKI-Dashboards „Atemwegserkrankungen im
Überblick“ auf Basis der offenen RKI-Daten – als statische Website mit
automatischer Datenaktualisierung.

## Live

- GitHub Pages: `https://<user>.github.io/<repo>/` (einmal unter
  *Settings → Pages → Deploy from a branch → `main` / `(root)`* aktivieren)

## Aufbau

| Pfad | Zweck |
| --- | --- |
| `index.html` | Seite (statische Texte via `data-i18n`) |
| `assets/app.js` | Diagramme (SVG, Vanilla JS) + I18N (DE/EN, manuell umschaltbar) |
| `assets/style.css` | Layout im RKI-Stil |
| `assets/data.js` | `window.DASH_DATA` – generiert, nicht von Hand editieren |
| `data/dashboard_data.json` | Dieselben Daten als JSON (generiert) |
| `data/*.tsv` | Rohdaten der RKI-Quellen (Stand des letzten Commits) |
| `scripts/build_data.py` | Daten-Pipeline: lädt RKI-TSVs, baut `data.js`/JSON |
| `.github/workflows/update.yml` | Cron-Job: aktualisiert die Daten wöchentlich |

## Automatische Aktualisierung

Der Workflow [`update.yml`](.github/workflows/update.yml) läuft jeden Freitag
08:00 UTC (und manuell über *Actions → RKI-Daten aktualisieren → Run workflow*):

1. Lädt die aktuellen TSVs von den RKI-GitHub-Repos (GrippeWeb, SARI,
   ARE-Konsultationsinzidenz).
2. Baut `data/dashboard_data.json` und `assets/data.js` neu.
3. Committet und pusht bei Änderungen → GitHub Pages zeigt automatisch die
   neuen Daten.

Lokal (ohne GitHub):

```sh
python3 scripts/build_data.py            # lädt aktuelle Daten aus dem Netz
python3 scripts/build_data.py --dir data # nutzt die TSVs im Repo
```

Erfordert nur Python-Standardbibliothek.

## Datenquellen (Robert Koch-Institut, offene Daten, CC BY 4.0)

- [GrippeWeb – Daten des Wochenberichts](https://github.com/robert-koch-institut/GrippeWeb_Daten_des_Wochenberichts) · [Zenodo 10.5281/zenodo.23387473](https://doi.org/10.5281/zenodo.23387473)
- [SARI-Hospitalisierungsinzidenz](https://github.com/robert-koch-institut/SARI-Hospitalisierungsinzidenz) · [Zenodo 10.5281/zenodo.23387480](https://doi.org/10.5281/zenodo.23387480)
- [ARE-Konsultationsinzidenz](https://github.com/robert-koch-institut/ARE-Konsultationsinzidenz)
- [RKI-Dashboard: Akute respiratorische Erkrankungen](https://www.rki.de/DE/Themen/Infektionskrankheiten/Akute-respiratorische-Erkrankungen/Dashboard_Daten.html)

Die Aktivitäts-Schwellen (sehr niedrig … sehr hoch) sind eine Näherung und
kalibriert auf die Einstufungen des abgebildeten Original-Dashboards.

Diese Seite ist eine unabhängige Nachbildung und kein Angebot des RKI.
