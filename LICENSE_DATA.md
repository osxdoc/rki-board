# Data & Content License — CC BY 4.0

The **data and content** of this repository — in particular

- the RKI source data in `data/` (`.tsv` files),
- the ECDC ERVISS source data in `data/` (`.csv` files),
- the generated data files `assets/data.js`, `assets/europe_data.js`,
  `data/dashboard_data.json` and `data/europe_data.json`,
- chart values, labels and derived statistics shown on the website

— are licensed under **Creative Commons Attribution 4.0 International
(CC BY 4.0)**:
<https://creativecommons.org/licenses/by/4.0/legalcode>

The underlying German data originates from the Robert Koch-Institut (RKI), which
publishes them as open data under CC BY 4.0:

- GrippeWeb – Daten des Wochenberichts
  <https://github.com/robert-koch-institut/GrippeWeb_Daten_des_Wochenberichts>
  · DOI [10.5281/zenodo.23387473](https://doi.org/10.5281/zenodo.23387473)
- SARI-Hospitalisierungsinzidenz
  <https://github.com/robert-koch-institut/SARI-Hospitalisierungsinzidenz>
  · DOI [10.5281/zenodo.23387480](https://doi.org/10.5281/zenodo.23387480)
- ARE-Konsultationsinzidenz
  <https://github.com/robert-koch-institut/ARE-Konsultationsinzidenz>

The underlying European data originates from the European Centre for Disease
Prevention and Control (ECDC), published as open data under **EUPL-1.2**
(the ECDC raw data itself remains subject to the EUPL; the derived files of
this repository are offered under CC BY 4.0):

- Respiratory viruses weekly data (ERVISS raw data)
  <https://github.com/EU-ECDC/Respiratory_viruses_weekly_data>
- European Respiratory Virus Surveillance Summary (ERVISS)
  <https://www.ecdc.europa.eu/en/publications-data/european-respiratory-virus-surveillance-summary-erviss>

## Attribution

When reusing the data, please credit the source as:

> Data: Robert Koch-Institut (RKI), CC BY 4.0
> (<https://www.rki.de/DE/Themen/Infektionskrankheiten/Akute-respiratorische-Erkrankungen/Dashboard_Daten.html>)

and, for the European data:

> Data: ECDC (ERVISS), EUPL-1.2
> (<https://github.com/EU-ECDC/Respiratory_viruses_weekly_data>)

and, if you use the derived files of this repository, additionally:

> Derived data: osxdoc/rki-board, CC BY 4.0
> <https://github.com/osxdoc/rki-board>

When distributing modified data, the changes must be indicated (see CC BY 4.0
§3(a)(3)).

## Relation to the code license

The source code of this repository (HTML, CSS, JavaScript, Python) is licensed
separately under the MIT License (see `LICENSE`). MIT and CC BY 4.0 are
compatible in this arrangement because code and data are kept as separate
works: shipping the MIT-licensed code together with CC-BY-licensed data
requires only that the attribution for the data is preserved.
