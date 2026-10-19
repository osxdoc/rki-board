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
| `index.html` | Page (static texts via `data-i18n`) |
| `assets/app.js` | Charts (SVG, vanilla JS) + I18N (DE/EN, manual toggle; browser language as default) |
| `assets/style.css` | Layout in RKI style |
| `assets/data.js` | `window.DASH_DATA` – generated, do not edit by hand |
| `data/dashboard_data.json` | Same data as JSON (generated) |
| `data/*.tsv` | Raw data of the RKI sources (state of the last commit) |
| `scripts/build_data.py` | Data pipeline: downloads RKI TSVs, builds `data.js`/JSON |
| `.github/workflows/update.yml` | Cron job: updates the data weekly |

## Automatic updates

The workflow [`update.yml`](.github/workflows/update.yml) runs every Friday at
08:00 UTC (and manually via *Actions → RKI-Daten aktualisieren → Run workflow*):

1. Downloads the current TSVs from the RKI GitHub repositories (GrippeWeb,
   SARI, ARE consultation incidence).
2. Rebuilds `data/dashboard_data.json` and `assets/data.js`.
3. Commits and pushes on change → GitHub Pages automatically shows the new data.

Locally (without GitHub):

```sh
python3 scripts/build_data.py            # downloads current data from the web
python3 scripts/build_data.py --dir data # uses the TSVs in this repo
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
  `assets/data.js` and `data/dashboard_data.json`) are licensed under
  **CC BY 4.0** — see [`LICENSE_DATA.md`](LICENSE_DATA.md).

## Data sources (Robert Koch-Institut, open data, CC BY 4.0)

- [GrippeWeb – Daten des Wochenberichts](https://github.com/robert-koch-institut/GrippeWeb_Daten_des_Wochenberichts) · [Zenodo 10.5281/zenodo.23387473](https://doi.org/10.5281/zenodo.23387473)
- [SARI-Hospitalisierungsinzidenz](https://github.com/robert-koch-institut/SARI-Hospitalisierungsinzidenz) · [Zenodo 10.5281/zenodo.23387480](https://doi.org/10.5281/zenodo.23387480)
- [ARE-Konsultationsinzidenz](https://github.com/robert-koch-institut/ARE-Konsultationsinzidenz)
- [RKI-Dashboard: Akute respiratorische Erkrankungen](https://www.rki.de/DE/Themen/Infektionskrankheiten/Akute-respiratorische-Erkrankungen/Dashboard_Daten.html)

The activity thresholds (very low … very high) are an approximation, calibrated
to the classifications of the original dashboard shown.

This site is an independent recreation and not an offer of the RKI.
