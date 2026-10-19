# Respiratory Diseases at a Glance (RKI Board)

Bilingual (DE/EN) recreation of the Robert Koch Institute (RKI) dashboard
„Atemwegserkrankungen im Überblick" based on open RKI data — as a static
website with automatic weekly data updates.

## Live

- **Website:** <https://osxdoc.github.io/rki-board/>
- **Repository:** <https://github.com/osxdoc/rki-board>
- Pages must be enabled once: *Settings → Pages → Deploy from a branch → `main` / `(root)`*

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Page (static texts via `data-i18n`; DE view + Europe view via tabs) |
| `assets/app.js` | Charts (SVG, vanilla JS) + I18N (DE/EN, manual toggle; browser language as default) + Europe module (ECDC) |
| `assets/style.css` | Layout in RKI style |
| `assets/data.js` | `window.DASH_DATA` – generated, do not edit by hand |
| `assets/europe_data.js` | `window.EUROPE_DATA` – generated (ECDC ERVISS), do not edit by hand |
| `data/dashboard_data.json` | Same data as JSON (generated) |
| `data/europe_data.json` | Same Europe data as JSON (generated) |
| `data/*.tsv` | Raw data of the RKI sources (state of the last commit) |
| `data/*.csv` | Raw data of the ECDC ERVISS sources (state of the last commit) |
| `scripts/build_data.py` | Data pipeline: downloads RKI TSVs + ECDC CSVs, builds `data.js`/`europe_data.js`/JSON |
| `.github/workflows/update.yml` | Cron job: updates the data weekly |

## Automatic updates

The workflow [`update.yml`](.github/workflows/update.yml) runs every Friday at
08:00 UTC (and manually via *Actions → RKI-Daten aktualisieren → Run workflow*):

1. Downloads the current TSVs from the RKI GitHub repositories (GrippeWeb,
   SARI, ARE consultation incidence) and the current ECDC ERVISS CSVs from
   [EU-ECDC/Respiratory_viruses_weekly_data](https://github.com/EU-ECDC/Respiratory_viruses_weekly_data).
2. Rebuilds `data/dashboard_data.json` + `assets/data.js` (Germany) and
   `data/europe_data.json` + `assets/europe_data.js` (Europe).
3. Commits and pushes on change → GitHub Pages automatically shows the new data.

Locally (without GitHub):

```sh
python3 scripts/build_data.py            # downloads current data from the web
python3 scripts/build_data.py --dir data # uses the TSVs/CSVs in this repo
```

Requires the Python standard library only.

## Language

The site starts in the browser language (anything starting with `en` → English,
otherwise German). The DE/EN toggle in the header overrides this permanently
(saved in `localStorage`).

## License

- **Code** (this repository's source files: HTML, CSS, JS, Python) is licensed
  under the **MIT License** — see [`LICENSE`](LICENSE).
- **Data and content** (RKI source data in `data/`, generated files in
  `assets/data.js`, `assets/europe_data.js`, `data/dashboard_data.json` and
  `data/europe_data.json`) are licensed under **CC BY 4.0** — see
  [`LICENSE_DATA.md`](LICENSE_DATA.md). The ECDC raw data itself is EUPL-1.2.

## Data sources (Robert Koch-Institut, open data, CC BY 4.0)

- [GrippeWeb – Daten des Wochenberichts](https://github.com/robert-koch-institut/GrippeWeb_Daten_des_Wochenberichts) · [Zenodo 10.5281/zenodo.23387473](https://doi.org/10.5281/zenodo.23387473)
- [SARI-Hospitalisierungsinzidenz](https://github.com/robert-koch-institut/SARI-Hospitalisierungsinzidenz) · [Zenodo 10.5281/zenodo.23387480](https://doi.org/10.5281/zenodo.23387480)
- [ARE-Konsultationsinzidenz](https://github.com/robert-koch-institut/ARE-Konsultationsinzidenz)
- [RKI-Dashboard: Akute respiratorische Erkrankungen](https://www.rki.de/DE/Themen/Infektionskrankheiten/Akute-respiratorische-Erkrankungen/Dashboard_Daten.html)

## Europe data sources (ECDC, open data, EUPL-1.2)

- [ECDC – Respiratory viruses weekly data (GitHub)](https://github.com/EU-ECDC/Respiratory_viruses_weekly_data) – raw CSVs behind ERVISS
- [ECDC: European Respiratory Virus Surveillance Summary (ERVISS)](https://www.ecdc.europa.eu/en/publications-data/european-respiratory-virus-surveillance-summary-erviss)
- [erviss.org](https://erviss.org/) – interactive ECDC dashboard

The Europe activity thresholds (very low … very high) are EU-wide values
calibrated on the ECDC dataset; ECDC itself defines intensity levels per
country. Cross-country comparisons should be read with care (differing
case definitions, testing strategies and reporting delays).

The activity thresholds (very low … very high) are an approximation, calibrated
to the classifications of the original dashboard shown.

This site is an independent recreation and not an offer of the RKI.
