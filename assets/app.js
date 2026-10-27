/* ===== Atemwegserkrankungen im Überblick / Respiratory diseases at a glance =====
   Zweisprachig (DE/EN), manuell umschaltbar; Diagramme auf RKI-Offen-Daten. */
(function () {
  "use strict";
  const D = window.DASH_DATA;
  // Datenstand als ISO-Datum (Veraltet-Warnung); ältere Daten-Dateien nutzen generated_at
  const RAW_STAMP = (D && D.meta && D.meta.updated_iso) || (D && D.generated_at) || "";
  const LATEST_ISO = RAW_STAMP ? String(RAW_STAMP).replace(" ", "T") : "";
  const BUILD_INFO = (D && D.meta && D.meta.build_iso) || "";

  if (!D || !D.grippe || !D.sari) {
    // Robustheit: ohne Daten keine leere Seite, sondern ein Hinweis
    document.querySelectorAll("main.column").forEach((m) => {
      const p = document.createElement("p");
      p.className = "nodata";
      p.textContent = "Die Daten (assets/data.js) konnten nicht geladen werden – " +
        "bitte die Seite neu laden. / The data file (assets/data.js) could not be " +
        "loaded – please reload the page.";
      m.replaceChildren(p);
    });
    return;
  }

  /* ---------- I18N-Wörterbuch ---------- */
  const I18N = {
    de: {
      htmlLang: "de",
      locale: "de-DE",
      "title.plain": "Atemwegserkrankungen im Überblick",
      "title.html": "Atemwegserkrankungen im<br> Überblick",
      "topbar.label": "Details:",
      "hero.pill": "Datenlage",
      "hero.text": "Klicken Sie auf die Grafiken für die Details:",
      "intro.html": "Die folgenden Grafiken zeigen die wöchentliche Aktivität von Atemwegserkrankungen in Deutschland – von <em>sehr niedrig</em> bis <em>sehr hoch</em>. Stand: <strong id=\"latestWeek\">–</strong>, Datenquelle: Robert Koch-Institut (RKI).",
      "chart.click": "Klicken für Details",
      "x.leftN": "vor {n} Monaten",
      "x.right": "aktuell",
      "legend.now": "(aktuell)",
      "tip.now": "Aktuell",
      "card.are": "Erkrankungen der Atemwege",
      "card.ili": "Fälle mit Fieber",
      "card.sari": "Fälle im Krankenhaus",
      "cap.are": "ARE-Inzidenz (GrippeWeb): Erkrankte pro 100.000 Einwohner pro Woche, alle Altersgruppen. Quelle: RKI",
      "cap.ili": "ILI-Inzidenz (GrippeWeb): Fälle mit grippeähnlicher Symptomatik inkl. Fieber pro 100.000 Einwohner pro Woche. Quelle: RKI",
      "cap.sari": "SARI-Hospitalisierungsinzidenz: Einweisungen wegen schwerer akuter respiratorischer Infektionen pro 100.000 Einwohner pro Woche. Quelle: RKI",
      "def.summary": "Wie ist sehr niedrige bis sehr hohe Aktivität definiert?",
      "def.intro": "Dargestellt wird die wöchentliche Inzidenz pro 100.000 Einwohner. Die Einstufung folgt diesen Schwellenbereichen:",
      "def.th": "Aktivitätslevel",
      "def.from": "ab ",
      "def.metric.are": "Erkrankungen der Atemwege (ARE, GrippeWeb)",
      "def.metric.ili": "Fälle mit Fieber (ILI, GrippeWeb)",
      "def.metric.sari": "Fälle im Krankenhaus (SARI)",
      "def.note": "Stand: {w} – Einstufung: ARE „{a}“, Fieber „{i}“, Krankenhaus „{s}“.",
      "sources.h3": "Quellen",
      "sources.li1": "<a href=\"https://github.com/robert-koch-institut/GrippeWeb_Daten_des_Wochenberichts\" target=\"_blank\" rel=\"noopener\">GrippeWeb – Daten des Wochenberichts (GitHub, RKI)</a> – wöchentliche ARE-/ILI-Inzidenzen; <a href=\"https://doi.org/10.5281/zenodo.23387473\" target=\"_blank\" rel=\"noopener\">Zenodo DOI 10.5281/zenodo.23387473</a>",
      "sources.li2": "<a href=\"https://github.com/robert-koch-institut/SARI-Hospitalisierungsinzidenz\" target=\"_blank\" rel=\"noopener\">SARI-Hospitalisierungsinzidenz (GitHub, RKI)</a> – wöchentliche Krankenhaus-Einweisungen; <a href=\"https://doi.org/10.5281/zenodo.23387480\" target=\"_blank\" rel=\"noopener\">Zenodo DOI 10.5281/zenodo.23387480</a>",
      "sources.li3": "<a href=\"https://github.com/robert-koch-institut/ARE-Konsultationsinzidenz\" target=\"_blank\" rel=\"noopener\">ARE-Konsultationsinzidenz (GitHub, RKI)</a> – ambulante Konsultationen aus dem ARE-Praxis-Sentinel",
      "sources.li4": "<a href=\"https://www.rki.de/DE/Themen/Infektionskrankheiten/Akute-respiratorische-Erkrankungen/Dashboard_Daten.html\" target=\"_blank\" rel=\"noopener\">RKI-Dashboard: Akute respiratorische Erkrankungen – ARE-Dashboard und weitere Daten</a>",
      "footer.html": "Daten: Robert Koch-Institut (RKI) · GrippeWeb · SARI-Sentinel · ECDC (ERVISS) · Stand: <span id=\"footerWeek\">–</span> · Diese Seite ist eine Nachbildung auf Basis der offenen RKI- und ECDC-Daten.",
      "modal.close": "Schließen",
      "modal.xleft": "Saisonbeginn (KW\u00a040)",
      "modal.ageLabel": "Altersgruppe: ",
      "modal.ageAll": "alle",
      "modal.current": " (aktuell)",
      "modal.note": "Letzter Wert ({w}): <strong>{v} pro 100.000</strong> → Aktivität: <strong style='color:{c}'>{l}</strong>. Quelle: <a href='{u}' target='_blank' rel='noopener'>{s}</a>",
      "activity": "Aktivität",
      "weekPrefix": "KW ",
      "aria6m": " – Inzidenz der letzten 6 Monate",
      "aria6mN": " – Inzidenz der letzten {n} Monate",
      "ariaSeason": " – Saisonverlauf ",
      "unit.are": "Erkrankte pro 100.000 Einwohner pro Woche",
      "unit.ili": "Fälle mit Fieber pro 100.000 Einwohner pro Woche",
      "unit.sari": "Krankenhaus-Einweisungen (SARI) pro 100.000 Einwohner pro Woche",
      "src.grippe": "GrippeWeb – Daten des Wochenberichts (RKI)",
      "src.sari": "SARI-Hospitalisierungsinzidenz (RKI)",
      "src.ecdc": "ECDC – Respiratory viruses weekly data (ERVISS)",
      "chart.tap": "Tippen für Details",
      "modal.kbd": "Tipp: Diagramm fokussieren und mit ←/→ die Wochenwerte ansagen; mit ▲/▼ die Altersgruppe wechseln.",
      "chart.unit": "pro 100.000",
      "stale": "Achtung: Der letzte Datenstand ist {d} Tage alt. Der RKI-Wochenbericht erscheint mittwochs.",
      "build": "Datensatz erzeugt: {ts}",
      "jump.label": "Direkt zu den Diagrammen",
      "jump.are": "Erkrankungen",
      "jump.ili": "Fieberfälle",
      "jump.sari": "Krankenhaus",
      "jump.def": "Level erklärt",
      "sticky.stand": "Stand",
      "tab.de.short": "DE",
      "tab.eu.short": "EU",
      "eu.search.label": "Land suchen:",
      "eu.search.ph": "Name oder Code, z. B. dä / DEU",
      "eu.search.none": "Kein Land passt zur Suche – Auswahl oben ist weiterhin sichtbar.",
      "lang.label": "Sprache",
      "view.tabs": "Ansicht wählen",
      "nav.top": "Nach oben",
      "footer.stand": "Stand der Daten:",
      "trend.up": "▲ steigend",
      "trend.down": "▼ fallend",
      "trend.flat": "→ gleich",
      "legend.toggle": "Legende: Vorjahre ein-/ausblenden",
      "period.label": "Zeitraum:",
      "period.3": "3 Monate",
      "period.6": "6 Monate",
      "period.12": "12 Monate",
      "ages.label": "Altersgruppe (Anzeige):",
      "tab.de": "🇩🇪 Deutschland",

      "tab.eu": "🇪🇺 Europa",
      "eu.hero.pill": "Europa · ECDC",
      "eu.hero.text": "Klicken Sie auf die Grafiken für die Details:",
      "eu.title.html": "Atemwegserkrankungen<br> in Europa",
      "eu.intro.html": "Die Grafiken zeigen die wöchentliche Aktivität von Atemwegserkrankungen in Europa – von <em>sehr niedrig</em> bis <em>sehr hoch</em>. Stand: <strong id=\"euLatestWeek\">–</strong>, Datenquelle: ECDC (ERVISS). Ländervergleiche sind wegen unterschiedlicher Falldefinitionen, Teststrategien und Meldequoten mit Vorsicht zu interpretieren.",
      "eu.card.bars": "Aktuelle SARI-Inzidenz nach Land",
      "eu.cap.bars": "SARI-Rate der zuletzt gemeldeten Woche pro 100.000 Einwohner. Klick auf ein Land öffnet das Detail darunter. Quelle: ECDC",
      "eu.card.trend": "6-Monats-Vergleich der Länder",
      "eu.cap.trend": "Letzte 26 Wochen je Land. Quelle: ECDC",
      "eu.def.summary": "Wie sind die Aktivitätslevel in der Europa-Ansicht definiert?",
      "eu.def.intro": "Dargestellt wird die Wochenrate pro 100.000 Einwohner (Positivität in Prozent). Die Einstufung folgt eigenen, an den ECDC-Baselines orientierten Schwellenbereichen:",
      "eu.def.th": "Aktivitätslevel",
      "eu.def.metric.ili": "Fälle mit Fieber (ILI)",
      "eu.def.metric.sari": "Fälle im Krankenhaus (SARI)",
      "eu.def.metric.ari": "Atemwegserkrankungen (ARI)",
      "eu.def.metric.pos": "Labor-Positivität (%)",
      "eu.def.note": "Stand: {w} – Einstufung Europa (Ø): ILI „{i}“, SARI „{s}“, Influenza-Positivität „{p}“.",
      "eu.card.detail": "Land im Detail",
      "eu.detail.country": "Land:",
      "eu.cap.detail": "Letzte Saisons je Altersgruppe. Quelle: ECDC",
      "eu.sources.li1": "<a href=\"https://github.com/EU-ECDC/Respiratory_viruses_weekly_data\" target=\"_blank\" rel=\"noopener\">ECDC – Respiratory viruses weekly data (GitHub, EU-ECDC)</a> – Rohdaten zu ERVISS (EUPL-1.2)",
      "eu.sources.li2": "<a href=\"https://www.ecdc.europa.eu/en/publications-data/european-respiratory-virus-surveillance-summary-erviss\" target=\"_blank\" rel=\"noopener\">ECDC: European Respiratory Virus Surveillance Summary (ERVISS)</a>",
      "eu.sources.li3": "<a href=\"https://erviss.org/\" target=\"_blank\" rel=\"noopener\">erviss.org – interaktives ECDC-Dashboard</a>",
      "eu.badge": "Stand: {w} · Ø ILI {v} ({n} Länder) → {l}",
      "eu.badgeAsof": "Stand: {w}",
      "eu.trend.ind": "Indikator:",
      "eu.trend.countries": "Länder:",
      "eu.detail.ages": "Altersgruppe:",
      "eu.ind.ili": "Fälle mit Fieber (ILI)",
      "eu.ind.sari": "Fälle im Krankenhaus (SARI)",
      "eu.ind.ari": "Atemwegserkrankungen (ARI)",
      "eu.ind.pos-flu": "Influenza-Positivität",
      "eu.ind.pos-rsv": "RSV-Positivität",
      "eu.ind.pos-cov": "SARS-CoV-2-Positivität",
      "eu.unit.sari": "SARI-Rate pro 100.000 Einwohner pro Woche",
      "eu.unit.ili": "ILI-Konsultationsrate pro 100.000 Einwohner pro Woche",
      "eu.unit.ari": "ARI-Konsultationsrate pro 100.000 Einwohner pro Woche",
      "eu.unit.pos": "Labor-Positivität in Prozent",
      "eu.age.total": "alle",
      "eu.country.eu": "Europa (Ø der Länder)",
      "eu.note": "Letzter Wert ({w}): <strong>{v} {u}</strong> → Aktivität: <strong style='color:{c}'>{l}</strong>. Quelle: <a href='{u2}' target='_blank' rel='noopener'>{s}</a>",
      "eu.nodata": "Für dieses Land liegen zu diesem Indikator keine Daten vor.",
      "eu.bar.open": "Detail öffnen",
      "eu.bars.stale": "✱ Meldeverzug: der zuletzt gemeldete Wert dieses Landes stammt aus einer früheren Woche.",
      "view.de": "Deutschland-Ansicht",
      "view.eu": "Europa-Ansicht",
      levels: ["sehr niedrig", "niedrig", "moderat", "erhöht", "hoch", "sehr hoch"],
      months: ["Okt", "Nov", "Dez", "Jan", "Feb", "Mär"],
    },
    en: {
      htmlLang: "en",
      locale: "en-GB",
      "title.plain": "Respiratory diseases at a glance",
      "title.html": "Respiratory diseases<br> at a glance",
      "topbar.label": "Details:",
      "hero.pill": "Data overview",
      "hero.text": "Click the charts for details:",
      "intro.html": "The charts below show the weekly activity of respiratory diseases in Germany – from <em>very low</em> to <em>very high</em>. As of: <strong id=\"latestWeek\">–</strong>, data source: Robert Koch-Institut (RKI).",
      "chart.click": "Click for details",
      "x.leftN": "{n} months ago",
      "x.right": "current",
      "legend.now": "(current)",
      "tip.now": "Current",
      "card.are": "Respiratory diseases",
      "card.ili": "Cases with fever",
      "card.sari": "Hospitalised cases",
      "cap.are": "ARE incidence (GrippeWeb): people with acute respiratory illness per 100,000 population per week, all age groups. Source: RKI",
      "cap.ili": "ILI incidence (GrippeWeb): cases with influenza-like illness incl. fever per 100,000 population per week. Source: RKI",
      "cap.sari": "SARI hospitalisation incidence: admissions for severe acute respiratory infection per 100,000 population per week. Source: RKI",
      "def.summary": "How are very low to very high activity levels defined?",
      "def.intro": "Shown is the weekly incidence per 100,000 population. The classification follows these thresholds:",
      "def.th": "Activity level",
      "def.from": "from ",
      "def.metric.are": "Respiratory diseases (ARE, GrippeWeb)",
      "def.metric.ili": "Cases with fever (ILI, GrippeWeb)",
      "def.metric.sari": "Hospitalised cases (SARI)",
      "def.note": "As of: {w} – Levels: ARE “{a}”, fever “{i}”, hospital “{s}”.",
      "sources.h3": "Sources",
      "sources.li1": "<a href=\"https://github.com/robert-koch-institut/GrippeWeb_Daten_des_Wochenberichts\" target=\"_blank\" rel=\"noopener\">GrippeWeb – weekly report data (GitHub, RKI)</a> – weekly ARE/ILI incidences; <a href=\"https://doi.org/10.5281/zenodo.23387473\" target=\"_blank\" rel=\"noopener\">Zenodo DOI 10.5281/zenodo.23387473</a>",
      "sources.li2": "<a href=\"https://github.com/robert-koch-institut/SARI-Hospitalisierungsinzidenz\" target=\"_blank\" rel=\"noopener\">SARI hospitalisation incidence (GitHub, RKI)</a> – weekly hospital admissions; <a href=\"https://doi.org/10.5281/zenodo.23387480\" target=\"_blank\" rel=\"noopener\">Zenodo DOI 10.5281/zenodo.23387480</a>",
      "sources.li3": "<a href=\"https://github.com/robert-koch-institut/ARE-Konsultationsinzidenz\" target=\"_blank\" rel=\"noopener\">ARE consultation incidence (GitHub, RKI)</a> – outpatient consultations from the ARE practice sentinel",
      "sources.li4": "<a href=\"https://www.rki.de/DE/Themen/Infektionskrankheiten/Akute-respiratorische-Erkrankungen/Dashboard_Daten.html\" target=\"_blank\" rel=\"noopener\">RKI dashboard: Acute respiratory diseases – ARE dashboard and further data</a>",
      "footer.html": "Data: Robert Koch-Institut (RKI) · GrippeWeb · SARI sentinel · ECDC (ERVISS) · As of: <span id=\"footerWeek\">–</span> · This page is a replica based on open RKI and ECDC data.",
      "modal.close": "Close",
      "modal.xleft": "Season start (W\u00a040)",
      "modal.ageLabel": "Age group: ",
      "modal.ageAll": "all",
      "modal.current": " (current)",
      "modal.note": "Latest value ({w}): <strong>{v} per 100,000</strong> → Activity: <strong style='color:{c}'>{l}</strong>. Source: <a href='{u}' target='_blank' rel='noopener'>{s}</a>",
      "activity": "Activity",
      "weekPrefix": "W ",
      "aria6m": " – incidence over the last 6 months",
      "aria6mN": " – incidence over the last {n} months",
      "ariaSeason": " – season course ",
      "unit.are": "Cases per 100,000 population per week",
      "unit.ili": "Febrile cases per 100,000 population per week",
      "unit.sari": "Hospital admissions (SARI) per 100,000 population per week",
      "src.grippe": "GrippeWeb – weekly report data (RKI)",
      "src.sari": "SARI hospitalisation incidence (RKI)",
      "src.ecdc": "ECDC – Respiratory viruses weekly data (ERVISS)",
      "chart.tap": "Tap for details",
      "modal.kbd": "Tip: focus the chart and press left/right to hear weekly values; up/down switches the age group.",
      "chart.unit": "per 100,000",
      "stale": "Note: The latest data is {d} days old. The RKI weekly report is published on Wednesdays.",
      "build": "Dataset generated: {ts}",
      "jump.label": "Jump to the charts",
      "jump.are": "Illness",
      "jump.ili": "Fever",
      "jump.sari": "Hospital",
      "jump.def": "Levels",
      "sticky.stand": "As of",
      "tab.de.short": "DE",
      "tab.eu.short": "EU",
      "eu.search.label": "Find country:",
      "eu.search.ph": "name or code, e.g. ger / DEU",
      "eu.search.none": "No country matches the search – the selection above is still shown.",
      "lang.label": "Language",
      "view.tabs": "Choose view",
      "nav.top": "Back to top",
      "footer.stand": "Data as of:",
      "trend.up": "▲ rising",
      "trend.down": "▼ falling",
      "trend.flat": "→ steady",
      "legend.toggle": "Legend: toggle previous years",
      "period.label": "Period:",
      "period.3": "3 months",
      "period.6": "6 months",
      "period.12": "12 months",
      "ages.label": "Age group (display):",
      "tab.de": "🇩🇪 Germany",

      "tab.eu": "🇪🇺 Europe",
      "eu.hero.pill": "Europe · ECDC",
      "eu.hero.text": "Click the charts for details:",
      "eu.title.html": "Respiratory diseases<br> in Europe",
      "eu.intro.html": "The charts show the weekly activity of respiratory diseases in Europe – from <em>very low</em> to <em>very high</em>. As of: <strong id=\"euLatestWeek\">–</strong>, data source: ECDC (ERVISS). Country comparisons must be interpreted with caution due to differing case definitions, testing strategies and reporting rates.",
      "eu.card.bars": "Current SARI incidence by country",
      "eu.cap.bars": "SARI rate of the latest reported week per 100,000 population. Click a country to open its detail below. Source: ECDC",
      "eu.card.trend": "6-month country comparison",
      "eu.cap.trend": "Last 26 weeks per country. Source: ECDC",
      "eu.def.summary": "How are the activity levels in the Europe view defined?",
      "eu.def.intro": "Shown is the weekly rate per 100,000 population (positivity in percent). The classification follows custom thresholds inspired by the ECDC baselines:",
      "eu.def.th": "Activity level",
      "eu.def.metric.ili": "Cases with fever (ILI)",
      "eu.def.metric.sari": "Hospitalised cases (SARI)",
      "eu.def.metric.ari": "Respiratory diseases (ARI)",
      "eu.def.metric.pos": "Lab positivity (%)",
      "eu.def.note": "As of: {w} – Europe (Ø) levels: ILI “{i}”, SARI “{s}”, influenza positivity “{p}”.",
      "eu.card.detail": "Country detail",
      "eu.detail.country": "Country:",
      "eu.cap.detail": "Recent seasons by age group. Source: ECDC",
      "eu.sources.li1": "<a href=\"https://github.com/EU-ECDC/Respiratory_viruses_weekly_data\" target=\"_blank\" rel=\"noopener\">ECDC – Respiratory viruses weekly data (GitHub, EU-ECDC)</a> – ERVISS raw data (EUPL-1.2)",
      "eu.sources.li2": "<a href=\"https://www.ecdc.europa.eu/en/publications-data/european-respiratory-virus-surveillance-summary-erviss\" target=\"_blank\" rel=\"noopener\">ECDC: European Respiratory Virus Surveillance Summary (ERVISS)</a>",
      "eu.sources.li3": "<a href=\"https://erviss.org/\" target=\"_blank\" rel=\"noopener\">erviss.org – interactive ECDC dashboard</a>",
      "eu.badge": "As of: {w} · Ø ILI {v} ({n} countries) → {l}",
      "eu.badgeAsof": "As of {w}",
      "eu.trend.ind": "Indicator:",
      "eu.trend.countries": "Countries:",
      "eu.detail.ages": "Age group:",
      "eu.ind.ili": "Cases with fever (ILI)",
      "eu.ind.sari": "Hospitalised cases (SARI)",
      "eu.ind.ari": "Respiratory diseases (ARI)",
      "eu.ind.pos-flu": "Influenza positivity",
      "eu.ind.pos-rsv": "RSV positivity",
      "eu.ind.pos-cov": "SARS-CoV-2 positivity",
      "eu.unit.sari": "SARI rate per 100,000 population per week",
      "eu.unit.ili": "ILI consultation rate per 100,000 population per week",
      "eu.unit.ari": "ARI consultation rate per 100,000 population per week",
      "eu.unit.pos": "Lab positivity in percent",
      "eu.age.total": "all",
      "eu.country.eu": "Europe (average of countries)",
      "eu.note": "Latest value ({w}): <strong>{v} {u}</strong> → Activity: <strong style='color:{c}'>{l}</strong>. Source: <a href='{u2}' target='_blank' rel='noopener'>{s}</a>",
      "eu.nodata": "No data available for this country and indicator.",
      "eu.bar.open": "open detail",
      "eu.bars.stale": "✱ Reporting lag: the latest value for this country is from an earlier week.",
      "view.de": "Germany view",
      "view.eu": "Europe view",
      levels: ["very low", "low", "moderate", "elevated", "high", "very high"],
      months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    },
  };

  let lang = "de";
  try {
    const saved = localStorage.getItem("rkilang");
    lang = (saved === "en" || saved === "de")
      ? saved
      : ((navigator.language || "de").toLowerCase().indexOf("en") === 0 ? "en" : "de");
  } catch (e) { /* localStorage nicht verfügbar */ }

  const t = (key) => I18N[lang][key];
  const fill = (tpl, map) => tpl.replace(/\{(\w+)\}/g, (m, k) => (k in map ? map[k] : m));
  let fmt = new Intl.NumberFormat(I18N[lang].locale, { maximumFractionDigits: 1 });

  /* ---------- Konstanten ---------- */
  const LEVEL_COLORS = ["#00a651", "#a6c80a", "#ea8338", "#e8541e", "#d1231b", "#8e0e0e"];
  // Dieselben Level als Textfarbe auf Weiß (Kontrast >= 4.5:1) für Annotationen,
  // Notes und Level-Text; LEVEL_COLORS bleiben die Flächenfarben der Diagramme
  const LEVEL_INK = ["#087a3d", "#5d7800", "#a35614", "#c2410c", "#c11a13", "#8e0e0e"];


  // Schwellenwerte (Inzidenz pro 100.000 EW / Woche) – kalibriert auf die
  // Aktivitätseinstufung des abgebildeten RKI-Dashboards.
  const THRESHOLDS = {
    are:  [1000, 2500, 7500, 12500, 20000],
    ili:  [250, 1500, 3000, 6000, 10000],
    sari: [10, 25, 50, 100, 200],
  };

  const CHARTS = {
    are:  { get: (age) => D.grippe.ARE[age],  ages: ["00+", "0-4", "5-14", "15-34", "35-59", "60+"],
            sourceUrl: "https://github.com/robert-koch-institut/GrippeWeb_Daten_des_Wochenberichts",
            srcKey: "src.grippe" },
    ili:  { get: (age) => D.grippe.ILI[age],  ages: ["00+", "0-4", "5-14", "15-34", "35-59", "60+"],
            sourceUrl: "https://github.com/robert-koch-institut/GrippeWeb_Daten_des_Wochenberichts",
            srcKey: "src.grippe" },
    sari: { get: (age) => D.sari.Gesamt[age], ages: ["00+", "0-4", "5-14", "15-34", "35-59", "60-79", "80+"],
            sourceUrl: "https://github.com/robert-koch-institut/SARI-Hospitalisierungsinzidenz",
            srcKey: "src.sari" },
  };

  function levelOf(key, v) {
    const th = THRESHOLDS[key];
    for (let i = 0; i < th.length; i++)
      if (v < th[i]) return { label: t("levels")[i], color: LEVEL_COLORS[i], ink: LEVEL_INK[i], i: i };
    return { label: t("levels")[5], color: LEVEL_COLORS[5], ink: LEVEL_INK[5], i: 5 };
  }

  // Saison-Wochen: KW 40..53, dann KW 1..39 (Saisonübergang)
  function seasonWeeks(season) {
    const pts = season.slice();
    const hi = pts.filter((p) => p[0] >= 40).sort((a, b) => a[0] - b[0]);
    const lo = pts.filter((p) => p[0] < 40).sort((a, b) => a[0] - b[0]);
    return hi.concat(lo);
  }

  function seasonKey(s) { return parseInt(s.split("/")[0], 10); }

  // Kalender-Reihenfolge einer Woche (fortlaufend, auch über den Saisonwechsel
  // KW 39 -> KW 40 hinweg): Kalenderjahr * 53 + KW
  function weekOrder(p) {
    const calYear = p.week >= 40 ? seasonKey(p.season) : seasonKey(p.season) + 1;
    return calYear * 53 + p.week;
  }

  // Vergleichslinien der Vorjahre: dunkler = neuer; Strichart zusätzlich (Barrierefreiheit)
  const PREV_STYLE = [
    { stroke: "#7d858d", dash: "none" },
    { stroke: "#a2a9b0", dash: "5 4" },
    { stroke: "#c3c8cd", dash: "2 4" },
  ];
  // "Aktuell"-Linie: Kontrast auf Weiß >= 3:1 (auch für Screenreader/Deuteranopie)
  const CUR_LINE = "#1a8fc4";

  // Chronologische Punkteliste über alle Saisons: [{season, week, value}]
  function chrono(bySeason) {
    const seasons = Object.keys(bySeason).sort((a, b) => seasonKey(a) - seasonKey(b));
    const out = [];
    for (const s of seasons)
      for (const [w, v] of seasonWeeks(bySeason[s]))
        out.push({ season: s, week: w, value: v });
    return out;
  }

  /* ---------- 6-Monats-Diagramm (wie im Foto) ---------- */
  function sixMonthSeries(bySeason, win) {
    const all = chrono(bySeason);
    const i = all.length - 1;
    const w = win || 26;
    const cur = all.slice(Math.max(0, i - w + 1), i + 1);

    // Vorjahresfenster über dieselben Kalenderwochen (nicht Index −52):
    // Saisons mit 53 Wochen (z. B. 2015/16, 2020/21) würden die
    // Vergleichslinien sonst um eine Woche verschieben.
    const calYear = (p) => (p.week >= 40 ? seasonKey(p.season) : seasonKey(p.season) + 1);
    const map = {};
    all.forEach((p) => { map[calYear(p) * 100 + p.week] = p; });
    const prev = [];
    for (let k = 1; k <= 3; k++) {
      const pts = cur.map((p) => {
        const q = map[(calYear(p) - k) * 100 + p.week];
        return q ? { value: q.value, season: q.season } : null;
      });
      const hit = pts.filter((q) => q);
      if (!hit.length) continue;
      // Label = Saison des letzten Treffers (endet am selben KW-Punkt wie cur)
      prev.push({ pts: pts.map((q) => (q ? q.value : null)),
        label: hit[hit.length - 1].season });
    }
    return { cur, prev, latest: all[i] };
  }

  function niceMax(v) {
    if (v <= 0) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    const n = v / p;
    const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
    return m * p;
  }

  /* ---------- Responsive Maße ----------
     Die Diagramme werden in echter Containerbreite gezeichnet (viewBox = Pixelmaß),
     damit Achsen- und Beschriftungstexte immer in CSS-Pixeln bleiben und auf dem
     Handy nicht auf 3–4 px schrumpfen. */
  function chartW(el, minW) {
    const w = el && el.clientWidth ? el.clientWidth : 0;
    return Math.max(minW || 300, Math.round(w || 1000));
  }
  const narrow = (W) => W < 520;
  function axisFmt(v, narrowW) {
    if (narrowW && Math.abs(v) >= 1000) return fmt.format(Math.round(v / 100) / 10) + "k";
    return fmt.format(Math.round(v));
  }
  // Helle oder dunkle Schrift auf einer Level-Farbe (Badge/Chip), bester Kontrast
  function bestTextOn(bg) {
    const lum = (h) => {
      const f = (i) => {
        const v = parseInt(h.slice(i, i + 2), 16) / 255;
        return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(1) + 0.7152 * f(3) + 0.0722 * f(5);
    };
    const ratio = (fg) => {
      const a = lum(fg), b = lum(bg);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    };
    return ratio("#ffffff") >= ratio("#12212e") ? "#ffffff" : "#12212e";
  }
  // SVG mit viewBox == Pixelmaß: Skala 1:1, Schriftgrößen sind CSS-Pixel
  function svgBox(W, H, attrs) {
    const a = { viewBox: `0 0 ${W} ${H}`, width: W, height: H };
    for (const k in attrs) a[k] = attrs[k];
    return svgEl("svg", a);
  }
  // Neu zeichnen, wenn sich die Containerbreite ändert (nur dann)
  function onResize(el, fn) {
    if (!el) return;
    let last = el.clientWidth, tm = null;
    const fire = () => {
      const w = el.clientWidth;
      if (w === last || w === 0) return;
      last = w;
      clearTimeout(tm);
      tm = setTimeout(fn, 120);
    };
    if (window.ResizeObserver) new ResizeObserver(fire).observe(el);
    else window.addEventListener("resize", fire);
  }

  function svgEl(name, attrs, text) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", name);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (text != null) el.textContent = text;
    return el;
  }

  function pathFrom(points, x, y) {
    // Lücken (value == null) unterbrechen die Linie, statt sie zu verbinden
    let d = "", pen = false;
    points.forEach((p) => {
      if (!p || p.value == null) { pen = false; return; }
      d += (pen ? "L" : "M") + x(p.i).toFixed(1) + " " + y(p.value).toFixed(1) + " ";
      pen = true;
    });
    return d.trim();
  }

  /* ---------- Tooltip: Maus, Touch und Tastatur (Pfeiltasten) ---------- */
  const liveRegion = document.getElementById("chartLive");

  function attachHover(svg, wrap, cfg) {
    const g = svgEl("g", { visibility: "hidden", "pointer-events": "none" });
    const guide = svgEl("line", { y1: cfg.mT, y2: cfg.H - cfg.mB,
      stroke: "#7d858d", "stroke-width": 1, "stroke-dasharray": "3 3" });
    g.appendChild(guide);
    svg.appendChild(g);
    const tip = document.createElement("div");
    tip.className = "chart-tip";
    tip.hidden = true;
    wrap.appendChild(tip);
    let idx = -1;

    function fmtDelta(d) {
      const sign = d > 0 ? "+" : d < 0 ? "−" : "";
      return sign + fmt.format(Math.round(Math.abs(d) * 10) / 10);
    }

    function show(i, clientY) {
      idx = i;
      const data = cfg.rows(i);
      guide.setAttribute("x1", cfg.x(i));
      guide.setAttribute("x2", cfg.x(i));
      const dots = data.rows.filter((r) => r.value != null)
        .map((r) => svgEl("circle", { cx: cfg.x(i), cy: cfg.y(r.value), r: 4.5,
          fill: r.color, stroke: "#fff", "stroke-width": 1.4 }));
      g.replaceChildren(guide, ...dots);
      g.setAttribute("visibility", "visible");
      tip.replaceChildren();
      const title = document.createElement("div");
      title.className = "tip-title";
      title.textContent = data.title;
      tip.appendChild(title);
      const spoken = [data.title];
      data.rows.forEach((r) => {
        const row = document.createElement("div");
        row.className = "tip-row" + (r.bold ? " tip-bold" : "");
        const sw = document.createElement("span");
        sw.className = "tip-sw";
        sw.style.background = r.color;
        row.appendChild(sw);
        const val = r.value == null ? "–" : fmt.format(r.value);
        row.appendChild(document.createTextNode(
          r.label + "  " + val + (r.delta != null ? "  Δ " + fmtDelta(r.delta) : "")));
        tip.appendChild(row);
        spoken.push(r.label + " " + val);
      });
      tip.hidden = false;
      const r = svg.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
      const px = r.left - wr.left + (cfg.x(i) / cfg.W) * r.width;
      const first = data.rows.filter((q) => q.value != null)[0];
      const anchor = clientY == null
        ? r.top - wr.top + cfg.y(first ? first.value : 0)
        : clientY;
      const py = Math.min(Math.max(anchor - wr.top, 40), wr.height - 10);
      tip.style.left = px + "px";
      tip.style.top = py + "px";
      tip.classList.toggle("tip-flip", px > r.width * 0.55);
      if (liveRegion) liveRegion.textContent = spoken.join(", ");
    }
    function hide() {
      g.setAttribute("visibility", "hidden");
      tip.hidden = true;
    }
    svg.addEventListener("pointermove", (e) => {
      const r = svg.getBoundingClientRect();
      const sx = (e.clientX - r.left) * (cfg.W / r.width);
      if (sx < cfg.mL - 6 || sx > cfg.W - cfg.mR + 6) { hide(); return; }
      show(Math.max(0, Math.min(cfg.n - 1,
        Math.round(((sx - cfg.mL) / (cfg.W - cfg.mL - cfg.mR)) * (cfg.n - 1)))), e.clientY);
    });
    svg.addEventListener("pointerleave", hide);
    /* Tastatur: Diagramm mit Tab fokussieren, Wochen mit ←/→ (Home/End) ansagen */
    if (wrap.getAttribute("tabindex") == null) wrap.setAttribute("tabindex", "0");
    if (!wrap.getAttribute("aria-describedby") && liveRegion)
      wrap.setAttribute("aria-describedby", liveRegion.id);
    wrap.addEventListener("focus", () => { show(cfg.n - 1, null); });
    wrap.addEventListener("blur", () => { idx = -1; hide(); });
    wrap.addEventListener("keydown", (e) => {
      let i = idx < 0 ? cfg.n - 1 : idx;
      if (e.key === "ArrowLeft") i -= 1;
      else if (e.key === "ArrowRight") i += 1;
      else if (e.key === "Home") i = 0;
      else if (e.key === "End") i = cfg.n - 1;
      else if (e.key === "Escape") { idx = -1; hide(); return; }
      else return;
      e.preventDefault();
      show(Math.max(0, Math.min(cfg.n - 1, i)), null);
    });
  }

  // Legende: Vorjahres-Linien per Klick/Tastatur ein- und ausblenden
  const legendOn = { are: [true, true, true], ili: [true, true, true], sari: [true, true, true] };

  function swatch(stroke, dash) {
    const s = svgEl("svg", { viewBox: "0 0 26 8", width: "26", height: "8", "aria-hidden": "true" });
    const attrs = { x1: 0, y1: 4, x2: 26, y2: 4, stroke, "stroke-width": 2.6 };
    if (dash !== "none") attrs["stroke-dasharray"] = dash;
    s.appendChild(svgEl("line", attrs));
    return s;
  }
  function renderSixMonthLegend(key, cur, prev) {
    const box = document.getElementById("legend-" + key);
    if (!box) return;
    box.replaceChildren();
    const mk = (stroke, dash, label, cls, on, k) => {
      const sp = document.createElement("button");
      sp.type = "button";
      sp.className = "lg-item " + cls + (on ? "" : " lg-off");
      sp.setAttribute("aria-pressed", String(!!on));
      sp.appendChild(swatch(stroke, dash));
      sp.appendChild(document.createTextNode(" " + label));
      if (k == null) sp.setAttribute("aria-disabled", "true");
      else sp.addEventListener("click", () => {
        legendOn[key][k] = !legendOn[key][k];
        renderSixMonthChart(document.getElementById("chart-" + key), key);
      });
      box.appendChild(sp);
    };
    mk(CUR_LINE, "none", cur[cur.length - 1].season + " " + t("legend.now"), "lg-now", true, null);
    prev.forEach((pr, k) => {
      const st = PREV_STYLE[Math.min(k, PREV_STYLE.length - 1)];
      mk(st.stroke, st.dash, pr.label, "lg-prev", legendOn[key][k] !== false, k);
    });
    const hint = document.createElement("span");
    hint.className = "lg-hint";
    hint.textContent = t("legend.toggle");
    box.appendChild(hint);
  }

  // Screenreader-Info fuer Steuer-Elemente (Zeitraum, Altersgruppe)
  function announce(text) {
    const live = document.getElementById("chartLive");
    if (!live) return;
    live.textContent = "";
    window.setTimeout(() => { live.textContent = text; }, 40);
  }

  // Zeitraum-Umschalter je DE-Karte (3 / 6 / 12 Monate)
  const PERIODS = [{ n: 13, m: 3, key: "period.3" }, { n: 26, m: 6, key: "period.6" },
                   { n: 52, m: 12, key: "period.12" }];
  function monthsOf(weeks) {
    const p = PERIODS.filter((q) => q.n === weeks)[0];
    return p ? p.m : 6;
  }
  function renderPeriodChips(key) {
    const box = document.getElementById("period-" + key);
    if (!box) return;
    box.replaceChildren();
    const lbl = document.createElement("span");
    lbl.className = "chip-group-label";
    lbl.textContent = t("period.label");
    box.appendChild(lbl);
    const sel = dePeriod[key] || 26;
    PERIODS.forEach((p) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (sel === p.n ? " active" : "");
      b.setAttribute("aria-pressed", String(sel === p.n));
      b.textContent = t(p.key);
      b.addEventListener("click", () => {
        dePeriod[key] = p.n;
        renderSixMonthChart(document.getElementById("chart-" + key), key);
        announce(t("card." + key) + ": " + t(p.key));
      });
      box.appendChild(b);
    });
  }

  // Altersgruppen-Chips je DE-Karte (Anzeige; Kennzahlen bleiben 00+)
  function renderAgeChips(key) {
    const box = document.getElementById("ages-" + key);
    if (!box) return;
    box.replaceChildren();
    const lbl = document.createElement("span");
    lbl.className = "chip-group-label";
    lbl.textContent = t("ages.label");
    box.appendChild(lbl);
    CHARTS[key].ages.forEach((a) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (deAge[key] === a ? " active" : "");
      b.setAttribute("aria-pressed", String(deAge[key] === a));
      b.textContent = a === "00+" ? t("modal.ageAll") + " (00+)" : a;
      b.addEventListener("click", () => {
        deAge[key] = a;
        renderSixMonthChart(document.getElementById("chart-" + key), key);
        announce(t("card." + key) + " · " + t("ages.label") + " " + (a === "00+" ? t("modal.ageAll") : a));
      });
      box.appendChild(b);
    });
  }

  // Achsen-Beschriftung: Wochennummern an den Rändern + aktuell
  function renderSixMonthChart(container, key, age, weeks) {
    const cfg = CHARTS[key];
    const a = age || deAge[key] || "00+";
    const win = weeks || dePeriod[key] || 26;
    const { cur, prev, latest } = sixMonthSeries(cfg.get(a), win);
    const W = chartW(container, 300), narrowW = narrow(W);
    const H = narrowW ? 250 : 320, mL = narrowW ? 44 : 64, mR = 12, mT = 18, mB = 30;
    const n = cur.length;
    const shownPrev = prev.filter((pr, k) => legendOn[key][k] !== false);
    const allVals = cur.map((p) => p.value)
      .concat(shownPrev.flatMap((pr) => pr.pts)).filter((v) => v != null);
    const yMax = niceMax(Math.max.apply(null, allVals.concat([1])) * 1.08);
    const x = (i) => mL + (i / (n - 1)) * (W - mL - mR);
    const y = (v) => H - mB - (v / yMax) * (H - mT - mB);

    const months = monthsOf(win);
    const svg = svgBox(W, H, { role: "img",
      "aria-label": t("card." + key) + fill(t("aria6mN"), { n: months }) });

    // Level-Bänder: Schwellenbereiche als dezente Streifen im Hintergrund
    const bands = THRESHOLDS[key];
    for (let b = 0; b < bands.length; b++) {
      const lo = b === 0 ? 0 : bands[b - 1];
      if (lo >= yMax) break;
      const hi = Math.min(bands[b], yMax);
      svg.appendChild(svgEl("rect", { x: mL, y: y(hi), width: W - mL - mR,
        height: Math.max(0, y(lo) - y(hi)), fill: LEVEL_COLORS[b], "fill-opacity": 0.09 }));
    }

    // Horizontales Gitter
    for (let k = 0; k <= 4; k++) {
      const v = (yMax / 4) * k, yy = y(v);
      svg.appendChild(svgEl("line", { x1: mL, y1: yy, x2: W - mR, y2: yy,
        stroke: k === 0 ? "#9aa1a8" : "#e4e7ea", "stroke-width": k === 0 ? 1.4 : 1 }));
      svg.appendChild(svgEl("text", { x: mL - 7, y: yy + 4, "text-anchor": "end",
        "font-size": narrowW ? 11 : 12, fill: "#6a737c" }, axisFmt(v, narrowW)));
    }
    // Zeitleiste: vertikale Gitterlinien + KW-Beschriftung (Dichte je nach Breite)
    const wkStep = W < 430 ? 8 : narrowW ? 6 : 4;
    for (let i = n - 1; i >= 0; i -= wkStep) {
      const xx = x(i);
      svg.appendChild(svgEl("line", { x1: xx, y1: mT, x2: xx, y2: H - mB,
        stroke: "#dfe3e7", "stroke-width": 1 }));
      svg.appendChild(svgEl("text", { x: xx, y: H - mB + 16,
        "text-anchor": i === n - 1 ? "end" : "middle",
        "font-size": 11, fill: "#6a737c" }, t("weekPrefix") + cur[i].week));
    }

    // Vorjahre (grau abgestuft, gleiche Kalenderwochen, Lücken = keine Meldung)
    shownPrev.forEach((pr) => {
      const k = prev.indexOf(pr);
      const st = PREV_STYLE[Math.min(k, PREV_STYLE.length - 1)];
      const pts = pr.pts.map((v, i) => ({ i, value: v }));
      const path = svgEl("path", { d: pathFrom(pts, x, y), fill: "none",
        stroke: st.stroke, "stroke-width": 1.8, "stroke-dasharray": st.dash });
      path.appendChild(svgEl("title", {}, pr.label));
      svg.appendChild(path);
    });

    // Aktuell (blau)
    const curIdx = cur.map((p, i) => Object.assign({ i }, p));
    svg.appendChild(svgEl("path", { d: pathFrom(curIdx, x, y), fill: "none",
      stroke: CUR_LINE, "stroke-width": 3.2, "stroke-linejoin": "round" }));

    // Letzter Punkt + Annotation (innen, Ecke gegenüber dem Linienende)
    const last = curIdx[curIdx.length - 1];
    const lvl = levelOf(key, latest.value);
    svg.appendChild(svgEl("circle", { cx: x(last.i), cy: y(latest.value), r: 5,
      fill: CUR_LINE, stroke: "#fff", "stroke-width": 1.6 }));
    const top = y(latest.value) > mT + 48; // Linie endet tief -> Text nach oben
    const fs = narrowW ? 13 : 15, dy = narrowW ? 17 : 20;
    const y1 = top ? mT + 16 : H - mB - (fs + dy);
    // Annotation in abgedunkelter Level-Farbe (Kontrast auf Weiß >= 4.5:1)
    svg.appendChild(svgEl("text", { x: W - mR - 4, y: y1, "text-anchor": "end",
      "font-size": fs, "font-weight": 700, fill: lvl.ink }, t("activity") + ":"));
    svg.appendChild(svgEl("text", { x: W - mR - 4, y: y1 + dy, "text-anchor": "end",
      "font-size": fs, "font-weight": 700, fill: lvl.ink }, lvl.label));

    container.replaceChildren(svg);
    // Zeitleisten-Beschriftung links an den gewaehlten Zeitraum anpassen
    const xhost = container.parentNode;
    const xleft = xhost ? xhost.querySelector(".chart-xlabels .x-left") : null;
    if (xleft) xleft.textContent = fill(t("x.leftN"), { n: months });
    attachHover(svg, container, {
      W, H, mL, mR, mT, mB, n, x, y,
      rows: (i) => ({
        title: t("weekPrefix") + cur[i].week,
        rows: [{ color: CUR_LINE, label: t("tip.now"), value: cur[i].value, bold: true,
                 delta: i > 0 ? cur[i].value - cur[i - 1].value : null }]
          .concat(shownPrev.map((pr, k) => ({
            color: PREV_STYLE[Math.min(prev.indexOf(pr), PREV_STYLE.length - 1)].stroke,
            label: pr.label, value: pr.pts[i] }))),
      }),
    });

    renderSixMonthLegend(key, cur, prev);
    renderPeriodChips(key);
    renderAgeChips(key);
    return { latest, lvl };
  }

  /* ---------- Saison-Diagramm (Modal) ---------- */
  function renderSeasonChart(container, bySeason, ariaLabel) {
    const seasons = Object.keys(bySeason).sort((a, b) => seasonKey(a) - seasonKey(b));
    const shown = seasons.slice(-5);

    const W = chartW(container, 320), narrowW = narrow(W);
    const H = narrowW ? 250 : 340, mL = narrowW ? 44 : 64, mR = 14, mT = 18, mB = 26;
    // 53 Slots: KW 40..53 (0..13) + KW 1..39 (14..52); Saisons ohne KW 53
    // lassen Slot 13 einfach aus
    const slotOf = (wk) => (wk >= 40 ? wk - 40 : 14 + wk - 1);
    const slots = 53;
    const series = shown.map((s) => {
      const pts = seasonWeeks(bySeason[s]);
      return { season: s, pts: pts.map((p) => ({ i: slotOf(p[0]), value: p[1], week: p[0] })) };
    });
    const allVals = series.flatMap((s) => s.pts.map((p) => p.value));
    const yMax = niceMax(Math.max.apply(null, allVals) * 1.08);
    const x = (i) => mL + (i / (slots - 1)) * (W - mL - mR);
    const y = (v) => H - mB - (v / yMax) * (H - mT - mB);

    const svg = svgBox(W, H, { role: "img", "aria-label": ariaLabel });
    for (let k = 0; k <= 4; k++) {
      const v = (yMax / 4) * k, yy = y(v);
      svg.appendChild(svgEl("line", { x1: mL, y1: yy, x2: W - mR, y2: yy,
        stroke: k === 0 ? "#9aa1a8" : "#e4e7ea", "stroke-width": k === 0 ? 1.4 : 1 }));
      svg.appendChild(svgEl("text", { x: mL - 7, y: yy + 4, "text-anchor": "end",
        "font-size": narrowW ? 11 : 12, fill: "#6a737c" }, axisFmt(v, narrowW)));
    }
    // X-Achse: Monatsanfang auf der KW-40-bis-39-Achse
    // Okt = KW 40 (i 0), Nov ≈ KW 44 (4), Dez ≈ KW 48 (8), Jan ≈ KW 1 (14),
    // Feb ≈ KW 5 (18), Mär ≈ KW 9 (22)
    const monthTicks = narrowW ? [0, 8, 14, 22] : [0, 4, 8, 14, 18, 22];
    const tickIx = narrowW ? [0, 2, 3, 5] : [0, 1, 2, 3, 4, 5];
    const monthLabels = t("months");
    monthTicks.forEach((i, k) => {
      svg.appendChild(svgEl("line", { x1: x(i), y1: mT, x2: x(i), y2: H - mB,
        stroke: "#dfe3e7", "stroke-width": 1 }));
      svg.appendChild(svgEl("line", { x1: x(i), y1: H - mB, x2: x(i), y2: H - mB + 4,
        stroke: "#9aa1a8" }));
      svg.appendChild(svgEl("text", { x: x(i), y: H - mB + (narrowW ? 16 : 18),
        "text-anchor": "middle",
        "font-size": narrowW ? 11 : 12, fill: "#6a737c" }, monthLabels[tickIx[k]]));
    });
    const grays = ["#b9bfc6", "#98a0a8", "#7d858d", "#626b73"];
    series.forEach((s, k) => {
      const isLast = k === series.length - 1;
      const path = svgEl("path", { d: pathFrom(s.pts, x, y), fill: "none",
        stroke: isLast ? CUR_LINE : grays[Math.min(k, grays.length - 1)],
        "stroke-width": isLast ? 3.2 : 1.7, "stroke-linejoin": "round" });
      path.appendChild(svgEl("title", {}, s.season));
      svg.appendChild(path);
    });

    container.replaceChildren(svg);
    attachHover(svg, container, {
      W, H, mL, mR, mT, mB, n: slots, x, y,
      rows: (i) => {
        const wk = series.map((s) => s.pts[i]).find((p) => p);
        return {
          title: wk ? t("weekPrefix") + wk.week : "",
          rows: series.map((s, k) => (i < s.pts.length
            ? { color: k === series.length - 1 ? CUR_LINE : grays[Math.min(k, grays.length - 1)],
                label: s.season + (k === series.length - 1 ? t("modal.current") : ""),
                value: s.pts[i].value }
            : null)).filter(Boolean),
        };
      },
    });

    return { series, shown };
  }

  /* ---------- Statische Texte ---------- */
  function applyStatic() {
    document.documentElement.lang = I18N[lang].htmlLang;
    document.title = t("title.plain");
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.dataset.i18nAria));
    });
    document.querySelectorAll(".chart-wrap[data-chart]").forEach((el) => {
      el.title = t("chart.tap");
      const hint = el.querySelector(".chart-cta");
      if (hint) hint.textContent = t("chart.tap");
    });
    document.getElementById("modalClose").setAttribute("aria-label", t("modal.close"));
    const jump = document.getElementById("jumpLinks");
    if (jump) jump.setAttribute("aria-label", t("jump.label"));
    const lg = document.getElementById("langLabel");
    if (lg) lg.setAttribute("aria-label", t("lang.label"));
    const vt = document.getElementById("viewTabs");
    if (vt) vt.setAttribute("aria-label", t("view.tabs"));
    const deTab = document.getElementById("viewTabDe"), euTab = document.getElementById("viewTabEu");
    if (deTab) deTab.setAttribute("aria-label", t("view.de"));
    if (euTab) euTab.setAttribute("aria-label", t("view.eu"));
    const sl = document.getElementById("stickyLang");
    if (sl) sl.setAttribute("aria-label", t("lang.label"));
    const sb = document.getElementById("stickyBack");
    if (sb) sb.textContent = t("nav.top");
    const tapHint = document.getElementById("chartTapHint");
    if (tapHint) tapHint.textContent = t("chart.tap");

  }

  /* ---------- Initialisierung ---------- */
  const latest = D.latest;
  function setWeeks() {
    document.getElementById("latestWeek").textContent = latest;
    document.getElementById("footerWeek").textContent = latest;
    const lwf = document.getElementById("latestWeekFooter");
    if (lwf) lwf.textContent = latest;
    const sbw = document.getElementById("stickyWeek");
    if (sbw) sbw.textContent = latest;
    const euW = document.getElementById("euLatestWeek");
    if (euW) euW.textContent = EU_LATEST;
    checkStaleness();
  }

  // Datenstand: Warnung, wenn der Wochenbericht überfällig ist
  function checkStaleness() {
    const box = document.getElementById("staleNote");
    if (box) {
      const t0 = LATEST_ISO ? Date.parse(LATEST_ISO) : NaN;
      if (isNaN(t0)) box.hidden = true;
      else {
        const days = Math.floor((Date.now() - t0) / 864e5);
        box.hidden = days <= 9;
        if (!box.hidden) box.textContent = fill(t("stale"), { d: days });
      }
    }
    const bi = document.getElementById("buildInfo");
    if (bi && BUILD_INFO) bi.textContent = fill(t("build"), { ts: BUILD_INFO });
  }

  // DE-Ansicht: Altersgruppe (Anzeige) und Zeitraum je Karte
  const deAge = { are: "00+", ili: "00+", sari: "00+" };
  const dePeriod = { are: 26, ili: 26, sari: 26 };

  const results = {};
  function renderCharts() {
    for (const key of Object.keys(CHARTS)) {
      const box = document.getElementById("chart-" + key);
      results[key] = renderSixMonthChart(box, key);
    }
    // Zentrale Badge = Einstufung der ARE-Aktivität (wie im Foto)
    const overall = results.are.lvl;
    const badge = document.getElementById("overallBadge");
    badge.textContent = t("activity") + ": " + overall.label;
    badge.style.background = overall.color;
    badge.style.color = bestTextOn(overall.color); // helle oder dunkle Schrift je Level
    // Kartenwert in abgedunkelter Level-Farbe + Tipp-Hinweis
    document.querySelectorAll(".card[data-chart]").forEach((card) => {
      const v = card.dataset.chart;
      const valEl = card.querySelector(".value");
      if (valEl && results[v]) {
        valEl.textContent = (results[v].latest.value == null ? "–"
          : fmt.format(results[v].latest.value)) + " " + t("chart.unit");
        valEl.style.color = results[v].lvl.ink;
      }
      const cta = card.querySelector(".card-cta");
      if (cta) cta.textContent = t("chart.tap");
    });
  }

  /* ---------- Definitions-Tabelle ---------- */
  function buildDefinition() {
    const rows = [];
    for (const key of ["are", "ili", "sari"]) {
      const th = THRESHOLDS[key];
      const ranges = [];
      for (let i = 0; i < 6; i++) {
        const lo = i === 0 ? 0 : th[i - 1];
        const hi = i === 5 ? null : th[i];
        ranges.push(hi === null ? t("def.from") + fmt.format(lo) : fmt.format(lo) + " – " + fmt.format(hi));
      }
      rows.push({ name: t("def.metric." + key), ranges });
    }
    let html = "<p>" + t("def.intro") + "</p><table><tr><th>" + t("def.th") + "</th>" +
      rows.map((r) => "<th>" + r.name + "</th>").join("") + "</tr>";
    for (let i = 0; i < 6; i++) {
      html += "<tr><td><span class='lvl-dot' style='background:" + LEVEL_COLORS[i] + "'></span>" +
        t("levels")[i] + "</td>" +
        rows.map((r) => "<td>" + r.ranges[i] + "</td>").join("") + "</tr>";
    }
    html += "</table><p class='chart-caption'>" + fill(t("def.note"), {
      w: latest, a: results.are.lvl.label, i: results.ili.lvl.label, s: results.sari.lvl.label,
    }) + "</p>";
    document.getElementById("definitionBody").innerHTML = html;
  }

  /* ---------- Europa: ECDC ERVISS ---------- */
  const EU = window.EUROPE_DATA || { sari: {}, ili: {}, ari: {}, pos: {}, latest: null };
  const EU_LATEST = EU.latest || "–";
  const EU_SOURCE_URL = "https://github.com/EU-ECDC/Respiratory_viruses_weekly_data";

  const EU_THRESHOLDS = {
    sari: [5, 15, 30, 60, 120],
    ili: [26.9, 100, 300, 600, 1200],
    ari: [500, 1000, 2000, 4000, 8000],
    pos: [1, 5, 10, 25, 50],
  };

  const EU_INDICATORS = [
    { key: "sari", store: "sari", rates: true },
    { key: "ili", store: "ili", rates: true },
    { key: "ari", store: "ari", rates: true },
    { key: "pos-flu", store: "pos", path: "Influenza", rates: false },
    { key: "pos-rsv", store: "pos", path: "RSV", rates: false },
    { key: "pos-cov", store: "pos", path: "SARS-CoV-2", rates: false },
  ];
  const EU_AGES = ["total", "0-4", "5-14", "15-64", "65+"];
  const EU_COLORS = ["#1f77b4", "#d62728", "#2ca02c", "#9467bd", "#e0701e",
                     "#147f92", "#b32d75", "#5f676f"];

  const EU_NAMES_DE = {
    Austria: "Österreich", Belgium: "Belgien", Bulgaria: "Bulgarien", Croatia: "Kroatien",
    Cyprus: "Zypern", Czechia: "Tschechien", Denmark: "Dänemark", Estonia: "Estland",
    Finland: "Finnland", France: "Frankreich", Germany: "Deutschland", Greece: "Griechenland",
    Hungary: "Ungarn", Iceland: "Island", Ireland: "Irland", Italy: "Italien",
    Latvia: "Lettland", Liechtenstein: "Liechtenstein", Lithuania: "Litauen",
    Luxembourg: "Luxemburg", Malta: "Malta", Netherlands: "Niederlande", Norway: "Norwegen",
    Poland: "Polen", Portugal: "Portugal", Romania: "Rumänien", Slovakia: "Slowakei",
    Slovenia: "Slowenien", Spain: "Spanien", Sweden: "Schweden", "EU/EEA": "EU/EWR",
  };
  const EU_FLAGS = {
    Austria: "🇦🇹", Belgium: "🇧🇪", Bulgaria: "🇧🇬", Croatia: "🇭🇷", Cyprus: "🇨🇾",
    Czechia: "🇨🇿", Denmark: "🇩🇰", Estonia: "🇪🇪", Finland: "🇫🇮", France: "🇫🇷",
    Germany: "🇩🇪", Greece: "🇬🇷", Hungary: "🇭🇺", Iceland: "🇮🇸", Ireland: "🇮🇪",
    Italy: "🇮🇹", Latvia: "🇱🇻", Liechtenstein: "🇱🇮", Lithuania: "🇱🇹",
    Luxembourg: "🇱🇺", Malta: "🇲🇹", Netherlands: "🇳🇱", Norway: "🇳🇴", Poland: "🇵🇱",
    Portugal: "🇵🇹", Romania: "🇷🇴", Slovakia: "🇸🇰", Slovenia: "🇸🇮", Spain: "🇪🇸",
    Sweden: "🇸🇪", "EU/EEA": "🇪🇺",
  };
  const euName = (c) => (lang === "de" && EU_NAMES_DE[c] ? EU_NAMES_DE[c] : c);
  const euFlag = (c) => (EU_FLAGS[c] ? EU_FLAGS[c] + " " : "");

  function euInd(key) {
    for (const i of EU_INDICATORS) if (i.key === key) return i;
    return EU_INDICATORS[0];
  }

  // Saison-Datensatz {saison: [[KW, Wert]]} für Land/Indikator/Altersgruppe
  function euSeries(indKey, country, age) {
    const ind = euInd(indKey);
    const c = EU[ind.store] && EU[ind.store][country];
    if (!c) return {};
    return (ind.rates ? c[age] : c[ind.path]) || {};
  }

  // Länder, die zu einem Indikator Daten haben (EU/EEA-Aggregat mitführen)
  function euCountries(indKey) {
    const ind = euInd(indKey);
    const store = EU[ind.store] || {};
    return Object.keys(store).sort((a, b) => euName(a).localeCompare(euName(b), I18N[lang].locale));
  }

  // Letzter Punkt einer chronologischen Reihe
  function euLastPoint(indKey, country, age) {
    const all = chrono(euSeries(indKey, country, age));
    return all.length ? all[all.length - 1] : null;
  }

  // Neueste Kalenderwoche ({cy, week}), die irgendein Land dieses Indikators
  // in den letzten Wochen gemeldet hat
  function euLastWeekAcross(indKey) {
    let best = null;
    for (const c of euCountries(indKey)) {
      const p = euLastPoint(indKey, c, "total");
      if (!p) continue;
      const w = { o: weekOrder(p), cy: p.week >= 40 ? seasonKey(p.season) : seasonKey(p.season) + 1, week: p.week };
      if (!best || w.o > best.o) best = w;
    }
    if (!best) return null;
    const cutoff = { o: best.o - 6 };
    let cut = null;
    for (const c of euCountries(indKey)) {
      const p = euLastPoint(indKey, c, "total");
      if (!p) continue;
      const w = { o: weekOrder(p), cy: p.week >= 40 ? seasonKey(p.season) : seasonKey(p.season) + 1, week: p.week };
      if (w.o < cutoff.o) continue;
      if (!cut || w.o > cut.o) cut = w;
    }
    return cut || best;
  }

  // n Kalender-Kacheln (Jahr*100+KW) endend bei {cy, week}, älteste zuerst
  function isoWeeksInYear(y) {
    const a = new Date(Date.UTC(y, 0, 1)).getUTCDay();
    const b = new Date(Date.UTC(y, 11, 31)).getUTCDay();
    return (a === 4 || b === 4) ? 53 : 52;
  }
  function euCalendarWeeks(end, n) {
    const out = [];
    let cy = end.cy, wk = end.week;
    for (let i = 0; i < n; i++) {
      out.push(cy * 100 + wk);
      wk -= 1;
      if (wk === 0) { cy -= 1; wk = isoWeeksInYear(cy); }
    }
    return out.reverse();
  }

  function euThKey(indKey) { return indKey.indexOf("pos") === 0 ? "pos" : indKey; }
  function euLevel(indKey, v) {
    const th = EU_THRESHOLDS[euThKey(indKey)];
    for (let i = 0; i < th.length; i++)
      if (v < th[i]) return { label: t("levels")[i], color: LEVEL_COLORS[i], ink: LEVEL_INK[i], i: i };
    return { label: t("levels")[5], color: LEVEL_COLORS[5], ink: LEVEL_INK[5], i: 5 };
  }

  // Ø über die Länder (ungewichtetes Ländermittel). Länder, deren letzter
  // Wert mehr als 6 Wochen zurückliegt, bleiben aussen vor – sonst verfälschen
  // Meldeverzüge (teils ganze Saisons alt) die europäische Einstufung.
  const EU_RECENT = 6;
  function euCountryMean(indKey, age) {
    const pts = [];
    for (const c of euCountries(indKey)) {
      if (c === "EU/EEA") continue;
      const p = euLastPoint(indKey, c, age);
      if (p) pts.push({ o: weekOrder(p), v: p.value, week: p.week, season: p.season });
    }
    if (!pts.length) return null;
    const best = Math.max.apply(null, pts.map((p) => p.o));
    const use = pts.filter((p) => p.o >= best - EU_RECENT);
    const top = pts.filter((p) => p.o === best)[0];
    return {
      value: use.reduce((a, p) => a + p.v, 0) / use.length,
      n: use.length,
      week: { o: best, t: t("weekPrefix") + top.week + " " + top.season },
      skipped: pts.length - use.length,
    };
  }

  /* ---------- Europa-Badge ---------- */
  function renderEuBadge() {
    const badge = document.getElementById("euBadge");
    if (!badge) return;
    const mean = euCountryMean("ili", "total");
    if (!mean) { badge.textContent = fill(t("eu.badgeAsof"), { w: EU_LATEST }); badge.style.background = "#6a737c"; badge.style.color = bestTextOn("#6a737c"); return; }
    const lvl = euLevel("ili", mean.value);
    badge.textContent = fill(t("eu.badge"), { w: EU_LATEST, v: fmt.format(mean.value), n: mean.n, l: lvl.label });
    badge.style.background = lvl.color;
    badge.style.color = bestTextOn(lvl.color);
  }

  // Land aus der Balkenansicht auswählen (Klick, Tastatur, später Suchfeld)
  function selectEuCountry(country) {
    euDetail.country = country;
    const sel = document.getElementById("euCountrySelect");
    if (sel) sel.value = country;
    renderEuDetail();
    const card = document.getElementById("card-eu-detail");
    if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- Karte 1: Aktuelle SARI-Inzidenz nach Land (Balken) ---------- */
  function renderEuBars() {
    const box = document.getElementById("chart-eu-bars");
    if (!box) return;
    const rows = [];
    for (const c of euCountries("sari")) {
      if (c === "EU/EEA") continue;
      const p = euLastPoint("sari", c, "total");
      if (p) rows.push({ country: c, value: p.value, week: p.week, o: weekOrder(p), season: p.season });
    }
    const best = rows.length ? Math.max.apply(null, rows.map((r) => r.o)) : 0;
    rows.forEach((r) => { r.stale = r.o < best - EU_RECENT; });
    rows.sort((a, b) => b.value - a.value);
    const noteEl = document.getElementById("euBarsStale");
    if (noteEl) {
      noteEl.hidden = !rows.some((r) => r.stale);
      noteEl.textContent = t("eu.bars.stale");
    }
    if (!rows.length) { box.replaceChildren(); return; }

    const W = chartW(box, 300), narrowW = narrow(W);
    const rowH = narrowW ? 28 : 30, mL = narrowW ? 96 : 190, mR = narrowW ? 44 : 70;
    const mT = 8, mB = 26;
    const H = mT + rows.length * rowH + mB;
    const maxV = Math.max.apply(null, rows.map((r) => r.value));
    const xMax = niceMax(maxV * 1.05);
    const x = (v) => mL + (v / xMax) * (W - mL - mR);
    const xTicks = narrowW ? 3 : 4;

    const svg = svgBox(W, H, { role: "img", "aria-label": t("eu.card.bars") });
    // Gitter + Achse
    for (let k = 0; k <= xTicks; k++) {
      const v = (xMax / xTicks) * k, xx = x(v);
      svg.appendChild(svgEl("line", { x1: xx, y1: mT, x2: xx, y2: H - mB,
        stroke: k === 0 ? "#9aa1a8" : "#e4e7ea", "stroke-width": k === 0 ? 1.4 : 1 }));
      svg.appendChild(svgEl("text", { x: xx, y: H - mB + 16, "text-anchor": "middle",
        "font-size": 11, fill: "#6a737c" }, axisFmt(v, narrowW)));
    }
    rows.forEach((r, i) => {
      const yy = mT + i * rowH;
      const lvl = euLevel("sari", r.value);
      const nm = narrowW ? euName(r.country) : euFlag(r.country) + euName(r.country);
      const cut = narrowW ? 13 : 24;
      const label = svgEl("text", { x: mL - 10, y: yy + rowH / 2 + 4, "text-anchor": "end",
        "font-size": narrowW ? 12 : 13, fill: "#37474f" },
        nm.length > cut ? nm.slice(0, cut - 1) + "…" : nm);
      label.appendChild(svgEl("title", {}, euName(r.country)));
      svg.appendChild(label);
      const bar = svgEl("rect", { x: mL, y: yy + 5, width: Math.max(2, x(r.value) - mL),
        height: rowH - 10, rx: 3, fill: lvl.color,
        stroke: lvl.ink, "stroke-width": 1.4 });
      bar.appendChild(svgEl("title", {},
        euName(r.country) + ": " + fmt.format(r.value) + " · " + t("weekPrefix") + r.week));
      svg.appendChild(bar);
      const vt = svgEl("text", { x: x(r.value) + 6, y: yy + rowH / 2 + 4,
        "font-size": narrowW ? 11 : 12, fill: r.stale ? "#8a9199" : "#455a64" },
        fmt.format(r.value) + (r.stale ? " ✱" : ""));
      if (r.stale) vt.appendChild(svgEl("title", {}, t("weekPrefix") + r.week + " " + r.season));
      svg.appendChild(vt);
      // Klick/Tastatur -> Detail (Zeile ist als Button fokussierbar)
      const pick = () => selectEuCountry(r.country);
      const hit = svgEl("rect", { x: 0, y: yy, width: W, height: rowH, fill: "transparent",
        style: "cursor:pointer", class: "eu-hit", role: "button", tabindex: "0",
        "aria-label": euName(r.country) + ": " + fmt.format(r.value) + " · " +
          t("weekPrefix") + r.week + " " + r.season + (r.stale ? " · " + t("eu.bars.stale") : "") +
          " – " + t("eu.bar.open") });
      hit.appendChild(svgEl("title", {}, euName(r.country)));
      hit.addEventListener("click", pick);
      hit.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); pick(); }
      });
      hit.addEventListener("focus", () => bar.setAttribute("class", "eu-bar-focus"));
      hit.addEventListener("blur", () => bar.removeAttribute("class"));
      svg.appendChild(hit);
    });
    box.replaceChildren(svg);
  }

  /* ---------- Karte 2: 6-Monats-Vergleich (Länder-Chips) ---------- */
  const euTrend = { ind: "ili", countries: [] };

  function euTrendPool() {
    return euCountries(euTrend.ind).filter((c) => c !== "EU/EEA");
  }
  function euTrendFix() {
    const pool = euTrendPool();
    euTrend.countries = euTrend.countries.filter((c) => pool.indexOf(c) >= 0);
    if (euTrend.countries.length === 0) {
      // Top 5 nach letztem Wert – aber nur Länder, die in den letzten
      // Wochen gemeldet haben, sonst dominiert eine veraltete Serie
      const cand = pool.map((c) => ({ c, p: euLastPoint(euTrend.ind, c, "total") }))
        .filter((r) => r.p);
      const best = Math.max.apply(null, cand.map((r) => weekOrder(r.p)));
      const recent = cand.filter((r) => weekOrder(r.p) >= best - 6);
      const ranked = (recent.length ? recent : cand)
        .sort((a, b) => b.p.value - a.p.value).slice(0, 5);
      euTrend.countries = ranked.map((r) => r.c);
    }
  }

  function renderEuTrendChips() {
    const indBox = document.getElementById("euTrendIndicators");
    const cBox = document.getElementById("euTrendCountries");
    if (!indBox || !cBox) return;
    indBox.replaceChildren();
    const lbl = document.createElement("span");
    lbl.className = "chip-group-label";
    lbl.textContent = t("eu.trend.ind");
    indBox.appendChild(lbl);
    EU_INDICATORS.forEach((ind) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (euTrend.ind === ind.key ? " active" : "");
      b.setAttribute("aria-pressed", String(euTrend.ind === ind.key));
      b.textContent = t("eu.ind." + ind.key);
      b.addEventListener("click", () => {
        euTrend.ind = ind.key;
        euTrendFix();
        renderEurope();
      });
      indBox.appendChild(b);
    });
    cBox.replaceChildren();
    const lbl2 = document.createElement("span");
    lbl2.className = "chip-group-label";
    lbl2.textContent = t("eu.trend.countries");
    cBox.appendChild(lbl2);
    const visible = euTrendPool().filter(euMatches);
    if (!visible.length) {
      const n = document.createElement("span");
      n.className = "chip-group-label eu-search-none";
      n.textContent = t("eu.search.none");
      cBox.appendChild(n);
    }
    visible.forEach((c) => {
      const on = euTrend.countries.indexOf(c) >= 0;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (on ? " active" : "");
      b.setAttribute("aria-pressed", String(on));
      b.style.setProperty("--chip-color", on ? EU_COLORS[euTrend.countries.indexOf(c) % EU_COLORS.length] : "#90a4ae");
      b.textContent = euFlag(c) + euName(c);

      b.addEventListener("click", () => {
        const i = euTrend.countries.indexOf(c);
        if (i >= 0) { if (euTrend.countries.length > 1) euTrend.countries.splice(i, 1); }
        else if (euTrend.countries.length < EU_COLORS.length) euTrend.countries.push(c);
        renderEurope();
      });
      cBox.appendChild(b);
    });
  }

  function renderEuTrend() {
    const box = document.getElementById("chart-eu-trend");
    if (!box) return;
    // Kalender-Kacheln: letzte 26 KWs (KW 40..53, dann 1..39 der laufenden Saison)
    const last = euLastWeekAcross(euTrend.ind);
    const weeks = last ? euCalendarWeeks(last, 26) : [];
    const n = weeks.length || 2;
    const W = chartW(box, 300), narrowW = narrow(W);
    const H = narrowW ? 250 : 320, mL = narrowW ? 44 : 64, mR = 12, mT = 18, mB = 30;
    const series = euTrend.countries.map((c) => {
      const map = {};
      chrono(euSeries(euTrend.ind, c, "total"))
        .forEach((p) => { map[(p.week >= 40 ? seasonKey(p.season) : seasonKey(p.season) + 1) * 100 + p.week] = p.value; });
      return { country: c, vals: weeks.map((k) => (map[k] == null ? null : map[k])) };
    }).filter((s) => s.vals.some((v) => v != null));
    const allVals = series.flatMap((s) => s.vals).filter((v) => v != null);
    const yMax = niceMax(Math.max.apply(null, allVals.concat([1])) * 1.08);
    const x = (i) => mL + (i / (n - 1)) * (W - mL - mR);
    const y = (v) => H - mB - (v / yMax) * (H - mT - mB);

    const svg = svgBox(W, H, { role: "img", "aria-label": t("eu.card.trend") + t("aria6m") });
    for (let k = 0; k <= 4; k++) {
      const v = (yMax / 4) * k, yy = y(v);
      svg.appendChild(svgEl("line", { x1: mL, y1: yy, x2: W - mR, y2: yy,
        stroke: k === 0 ? "#9aa1a8" : "#e4e7ea", "stroke-width": k === 0 ? 1.4 : 1 }));
      svg.appendChild(svgEl("text", { x: mL - 7, y: yy + 4, "text-anchor": "end",
        "font-size": narrowW ? 11 : 12, fill: "#6a737c" }, axisFmt(v, narrowW)));
    }
    // Zeitachse: Beschriftung alle 4 Wochen (KW der Kalender-Kachel), dünner wenn schmal
    for (let i = n - 1; i >= 0; i -= (W < 430 ? 8 : narrowW ? 6 : 4)) {
      const xx = x(i);
      svg.appendChild(svgEl("line", { x1: xx, y1: mT, x2: xx, y2: H - mB,
        stroke: "#dfe3e7", "stroke-width": 1 }));
      svg.appendChild(svgEl("text", { x: xx, y: H - mB + 16,
        "text-anchor": i === n - 1 ? "end" : "middle",
        "font-size": 11, fill: "#6a737c" }, weeks[i] ? t("weekPrefix") + (weeks[i] % 100) : ""));
    }
    series.forEach((s, k) => {
      const color = EU_COLORS[k % EU_COLORS.length];
      const pts = s.vals.map((v, i) => ({ i, value: v }));
      const path = svgEl("path", { d: pathFrom(pts, x, y), fill: "none",
        stroke: color, "stroke-width": 2.4, "stroke-linejoin": "round" });
      path.appendChild(svgEl("title", {}, euName(s.country)));
      svg.appendChild(path);
      let li = -1;
      s.vals.forEach((v, i) => { if (v != null) li = i; });
      if (li >= 0) {
        svg.appendChild(svgEl("circle", { cx: x(li), cy: y(s.vals[li]), r: 4,
          fill: color, stroke: "#fff", "stroke-width": 1.4 }));
      }
    });
    box.replaceChildren(svg);
    attachHover(svg, box, {
      W, H, mL, mR, mT, mB, n, x, y,
      rows: (i) => ({
        title: weeks[i] ? t("weekPrefix") + (weeks[i] % 100) : "",
        rows: series.map((s, k) => ({
          color: EU_COLORS[k % EU_COLORS.length], label: euName(s.country),
          value: s.vals[i] })),
      }),
    });
    // Legende (Farbbezeichnung + Kontrast wie im deutschen Board)
    const legend = document.getElementById("legend-eu-trend");
    if (legend) {
      legend.replaceChildren();
      series.forEach((s, k) => {
        const isLast = k === series.length - 1;
        const sp = document.createElement("span");
        sp.className = "lg-item " + (isLast ? "lg-now" : "lg-prev");
        const sw = document.createElement("span");
        sw.style.cssText = "display:inline-block;width:14px;height:4px;border-radius:2px;background:" +
          EU_COLORS[k % EU_COLORS.length];
        sp.appendChild(sw);
        sp.appendChild(document.createTextNode(" " + euFlag(s.country) + euName(s.country)));
        legend.appendChild(sp);
      });
    }

  }

  /* ---------- Karte 3: Land im Detail ---------- */
  const euDetail = { country: "Germany", ind: "sari", age: "total" };
  let euSearch = "";
  function euMatches(c) {
    if (!euSearch) return true;
    return (euName(c) + " " + c).toLowerCase().indexOf(euSearch) >= 0;
  }

  function renderEuControls() {
    const sel = document.getElementById("euCountrySelect");
    const indBox = document.getElementById("euDetailIndicators");
    const ageBox = document.getElementById("euDetailAges");
    if (!sel || !indBox || !ageBox) return;
    const pool = euCountries(euDetail.ind).filter((c) => c !== "EU/EEA");
    if (pool.indexOf(euDetail.country) < 0) euDetail.country = pool[0] || "Germany";
    sel.replaceChildren();
    const shown = pool.filter(euMatches);
    if (shown.indexOf(euDetail.country) < 0) {
      const o = document.createElement("option");
      o.value = euDetail.country;
      o.textContent = euFlag(euDetail.country) + euName(euDetail.country);
      o.selected = true;
      sel.appendChild(o);
    }
    shown.forEach((c) => {
      const o = document.createElement("option");
      o.value = c;
      o.textContent = euFlag(c) + euName(c);
      if (c === euDetail.country) o.selected = true;
      sel.appendChild(o);
    });
    sel.setAttribute("aria-label", t("eu.detail.country"));

    indBox.replaceChildren();
    const lbl = document.createElement("span");
    lbl.className = "chip-group-label";
    lbl.textContent = t("eu.trend.ind");
    indBox.appendChild(lbl);
    EU_INDICATORS.forEach((ind) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (euDetail.ind === ind.key ? " active" : "");
      b.textContent = t("eu.ind." + ind.key);
      b.addEventListener("click", () => { euDetail.ind = ind.key; renderEurope(); });
      indBox.appendChild(b);
    });
    ageBox.replaceChildren();
    const ind = euInd(euDetail.ind);
    if (ind.rates) {
      const lbl2 = document.createElement("span");
      lbl2.className = "chip-group-label";
      lbl2.textContent = t("eu.detail.ages");
      ageBox.appendChild(lbl2);
      EU_AGES.forEach((a) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "chip" + (euDetail.age === a ? " active" : "");
        b.textContent = a === "total" ? t("eu.age.total") : a;
        b.addEventListener("click", () => { euDetail.age = a; renderEuDetail(); });
        ageBox.appendChild(b);
      });
    }
  }

  function renderEuDetail() {
    renderEuControls();
    const box = document.getElementById("chart-eu-detail");
    const note = document.getElementById("euDetailNote");
    const legend = document.getElementById("euDetailLegend");
    if (!box) return;
    const age = euInd(euDetail.ind).rates ? euDetail.age : "total";
    const bySeason = euSeries(euDetail.ind, euDetail.country, age);
    if (!Object.keys(bySeason).length) {
      box.replaceChildren();
      box.appendChild(document.createTextNode(t("eu.nodata")));
      if (legend) legend.replaceChildren();
      if (note) note.textContent = "";
      return;
    }
    const { series, shown } = renderSeasonChart(box, bySeason,
      t("eu.ind." + euDetail.ind) + t("ariaSeason") + euName(euDetail.country));
    if (legend) {
      legend.replaceChildren();
      shown.forEach((s, k) => {
        const isLast = k === shown.length - 1;
        const sp = document.createElement("span");
        sp.style.color = isLast ? "#2472a8" : "#5f676f";
        sp.style.fontWeight = isLast ? "700" : "400";
        sp.textContent = "▬ " + s + (isLast ? t("modal.current") : "");
        legend.appendChild(sp);
      });
    }
    const last = series[series.length - 1].pts;
    const lastPt = last[last.length - 1];
    const lvl = euLevel(euDetail.ind, lastPt.value);
    const unit = euThKey(euDetail.ind) === "pos" ? t("eu.unit.pos") : t("eu.unit." + euDetail.ind);
    if (note) {
      note.innerHTML = fill(t("eu.note"), {
        w: t("weekPrefix") + lastPt.week, v: fmt.format(lastPt.value), u: unit,
        c: lvl.ink, l: lvl.label, u2: EU_SOURCE_URL, s: t("src.ecdc"),
      });
    }
  }

  /* ---------- Europa-Definitionstabelle ---------- */
  function buildEuDefinition() {
    const body = document.getElementById("euDefinitionBody");
    if (!body) return;
    const rows = [];
    for (const key of ["ili", "sari", "ari", "pos"]) {
      const th = EU_THRESHOLDS[key];
      const ranges = [];
      for (let i = 0; i < 6; i++) {
        const lo = i === 0 ? 0 : th[i - 1];
        const hi = i === 5 ? null : th[i];
        ranges.push(hi === null ? t("def.from") + fmt.format(lo) : fmt.format(lo) + " – " + fmt.format(hi));
      }
      rows.push({ name: t("eu.def.metric." + key), ranges });
    }
    let html = "<p>" + t("eu.def.intro") + "</p><table><tr><th>" + t("eu.def.th") + "</th>" +
      rows.map((r) => "<th>" + r.name + "</th>").join("") + "</tr>";
    for (let i = 0; i < 6; i++) {
      html += "<tr><td><span class='lvl-dot' style='background:" + LEVEL_COLORS[i] + "'></span>" +
        t("levels")[i] + "</td>" +
        rows.map((r) => "<td>" + r.ranges[i] + "</td>").join("") + "</tr>";
    }
    html += "</table>";
    const mIli = euCountryMean("ili", "total");
    const mSari = euCountryMean("sari", "total");
    const euPos = EU.pos["EU/EEA"] && EU.pos["EU/EEA"].Influenza;
    let pFlu = null;
    if (euPos) {
      const seasons = Object.keys(euPos).sort();
      const pts = euPos[seasons[seasons.length - 1]];
      if (pts && pts.length) pFlu = pts[pts.length - 1][1];
    }
    html += "<p class='chart-caption'>" + fill(t("eu.def.note"), {
      w: EU_LATEST,
      i: mIli ? euLevel("ili", mIli.value).label : "–",
      s: mSari ? euLevel("sari", mSari.value).label : "–",
      p: pFlu != null ? euLevel("pos-flu", pFlu).label : "–",
    }) + "</p>";
    body.innerHTML = html;
  }

  /* ---------- Europa gesamt rendern ---------- */
  function renderEurope() {
    euTrendFix();
    renderEuBadge();
    renderEuBars();
    renderEuTrendChips();
    renderEuTrend();
    renderEuDetail();
    buildEuDefinition();
  }

  /* ---------- Ansicht umschalten ---------- */
  function setView(view, opts) {
    const eu = view === "eu";
    document.getElementById("view-de").hidden = eu;
    document.getElementById("view-eu").hidden = !eu;
    document.getElementById("viewTabDe").classList.toggle("active", !eu);
    document.getElementById("viewTabEu").classList.toggle("active", eu);
    document.getElementById("viewTabDe").setAttribute("aria-selected", String(!eu));
    document.getElementById("viewTabEu").setAttribute("aria-selected", String(eu));
    document.getElementById("viewTabDe").setAttribute("tabindex", eu ? "-1" : "0");
    document.getElementById("viewTabEu").setAttribute("tabindex", eu ? "0" : "-1");
    try { localStorage.setItem("rkiview", view); } catch (e) { /* egal */ }
    // Ausgeblendete Ansichten haben Breite 0: Diagramme beim Einblenden neu zeichnen
    if (opts && opts.noRender) return;
    if (eu) renderEurope(); else renderCharts();
  }

  function initEurope() {
    euTrendFix();
    const sel = document.getElementById("euCountrySelect");
    sel.addEventListener("change", (e) => {
      euDetail.country = e.target.value;
      renderEuDetail();
      renderEuTrendChips();
    });
    // Tastatur: ▲▼ wechseln im Landlisten-Feld (bei gefilterter Liste)
    sel.addEventListener("keydown", (e) => {
      const opts = Array.prototype.map.call(sel.options, (o) => o.value).filter((v) => v);
      const i = opts.indexOf(sel.value);
      if (i < 0) return;
      let j = -1;
      if (e.key === "ArrowUp") j = Math.max(0, i - 1);
      else if (e.key === "ArrowDown") j = Math.min(opts.length - 1, i + 1);
      else return;
      e.preventDefault();
      sel.value = opts[j];
      euDetail.country = opts[j];
      renderEuDetail();
      renderEuTrendChips();
    });
    const search = document.getElementById("euSearch");
    if (search) search.addEventListener("input", () => {
      euSearch = search.value.trim().toLowerCase();
      renderEurope();
    });
    const tabs = [[document.getElementById("viewTabDe"), "de"],
                  [document.getElementById("viewTabEu"), "eu"]];
    tabs.forEach((pair, i) => {
      pair[0].addEventListener("click", () => setView(pair[1]));
      // Tablist: Pfeiltasten schalten zwischen Deutschland / Europa
      pair[0].addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const other = tabs[i === 0 ? 1 : 0];
        setView(other[1]);
        other[0].focus();
      });
    });
    let start = "de";
    try { if (localStorage.getItem("rkiview") === "eu") start = "eu"; } catch (e) { /* egal */ }
    if (location.hash === "#eu" || location.hash === "#europe") start = "eu";
    setView(start, { noRender: true });
    renderEurope();
    // Responsive: Diagramme neu zeichnen, wenn sich die Containerbreite ändert
    onResize(document.getElementById("chart-eu-bars"), renderEuBars);
    onResize(document.getElementById("chart-eu-trend"), renderEuTrend);
    onResize(document.getElementById("chart-eu-detail"), renderEuDetail);
  }

  /* ---------- Modal ---------- */
  const modal = document.getElementById("modal");
  const modalChart = document.getElementById("modalChart");
  const modalAges = document.getElementById("modalAges");
  const modalLegend = document.getElementById("modalLegend");
  let currentKey = null, currentAge = "00+";
  let lastFocus = null;

  function focusableIn(root) {
    return Array.prototype.filter.call(
      root.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])'),
      (el) => !el.hidden && el.offsetParent !== null);
  }
  // Fokus-Falle: Tab springt innerhalb des offenen Dialogs
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || modal.hidden) return;
    const items = focusableIn(modal);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  function openModal(key, age) {
    currentKey = key; currentAge = age || "00+";
    const cfg = CHARTS[key];
    document.getElementById("modalTitle").textContent = t("card." + key);
    modalAges.replaceChildren();
    cfg.ages.forEach((a) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = a === "00+" ? t("modal.ageAll") + " (00+)" : a;
      b.dataset.age = a;
      b.setAttribute("aria-pressed", String(a === currentAge));
      if (a === currentAge) b.classList.add("active");
      b.addEventListener("click", () => {
        currentAge = a;
        modalAges.querySelectorAll("button").forEach((x) => {
          x.classList.toggle("active", x.dataset.age === a);
          x.setAttribute("aria-pressed", String(x.dataset.age === a));
        });
        drawModal();
      });
      modalAges.appendChild(b);
    });
    drawModal();
    const wasHidden = modal.hidden;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    if (wasHidden) {
      lastFocus = document.activeElement;
      document.getElementById("modalClose").focus();
    }
  }

  // Altersgruppe einer DE-Karte wechseln (Pfeiltasten auf der Grafik)
  function openAge(key, delta) {
    const ages = CHARTS[key].ages;
    let i = ages.indexOf(deAge[key]);
    if (i < 0) i = 0;
    i = Math.max(0, Math.min(ages.length - 1, i + delta));
    deAge[key] = ages[i];
    renderSixMonthChart(document.getElementById("chart-" + key), key);
  }

  function drawModal() {
    const cfg = CHARTS[currentKey];
    const { series, shown } = renderSeasonChart(modalChart, CHARTS[currentKey].get(currentAge) || {},
      t("card." + currentKey) + t("ariaSeason") + currentAge);
    document.getElementById("modalSub").textContent =
      t("unit." + currentKey) + " · " + t("modal.ageLabel") +
      (currentAge === "00+" ? t("modal.ageAll") + " (00+)" : currentAge);
    modalLegend.replaceChildren();
    shown.forEach((s, k) => {
      const isLast = k === shown.length - 1;
      const sp = document.createElement("span");
      sp.style.color = isLast ? "#2472a8" : "#5f676f";
      sp.style.fontWeight = isLast ? "700" : "400";
      sp.textContent = "▬ " + s + (isLast ? t("modal.current") : "");
      modalLegend.appendChild(sp);
    });
    const last = series[series.length - 1].pts;
    const lastPt = last[last.length - 1];
    const prevPt = last.length > 1 ? last[last.length - 2] : null;
    const lvl = levelOf(currentKey, lastPt.value);
    const dir = !prevPt ? ""
      : lastPt.value > prevPt.value ? t("trend.up")
      : lastPt.value < prevPt.value ? t("trend.down") : t("trend.flat");
    document.getElementById("modalNote").innerHTML = fill(t("modal.note"), {
      w: latest, v: fmt.format(lastPt.value), c: lvl.ink, l: lvl.label, d: dir,
      u: cfg.sourceUrl, s: t(cfg.srcKey),
    });
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }

  /* ---------- Sprache + URL-Zustand ---------- */
  function syncUrl() {
    if (!history.replaceState) return;
    const eu = !document.getElementById("view-eu").hidden;
    try {
      history.replaceState(null, "",
        location.pathname + location.search + "#" + (eu ? "eu" : "de") + "?lang=" + lang);
    } catch (e) { /* file:-Schema: kein History-API */ }
  }

  function setLang(l) {
    if (l !== "de" && l !== "en") return;
    lang = l;
    try { localStorage.setItem("rkilang", l); } catch (e) { /* egal */ }
    fmt = new Intl.NumberFormat(I18N[lang].locale, { maximumFractionDigits: 1 });
    document.querySelectorAll("[data-lang]").forEach((b) =>
      b.classList.toggle("active", (b.dataset.lang || "") === lang));
    applyStatic();
    renderCharts();
    buildDefinition();
    setWeeks();
    renderEurope();
    syncStickyBar();
    syncUrl();
    if (!modal.hidden) openModal(currentKey, currentAge);
  }

  document.querySelectorAll("[data-lang]").forEach((b) =>
    b.addEventListener("click", () => setLang(b.dataset.lang)));

  document.querySelectorAll(".chart-wrap").forEach((el) => {
    if (!el.dataset.chart) return; // Europa-Karten haben eigenes Klickverhalten
    el.addEventListener("click", () => openModal(el.dataset.chart));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(el.dataset.chart); }
      else if (e.key === "ArrowUp") { e.preventDefault(); openAge(el.dataset.chart, 1); }
      else if (e.key === "ArrowDown") { e.preventDefault(); openAge(el.dataset.chart, -1); }
    });
  });
  document.getElementById("modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  /* ---------- Leiste: Badge, Stand und Tabs beim Scrollen fixieren ---------- */
  const sticky = document.getElementById("stickyBar");
  const stickyBadge = document.getElementById("stickyBadge");
  const stickyWeek = document.getElementById("stickyWeek");
  const stickyViewDe = document.getElementById("stickyViewDe");
  const stickyViewEu = document.getElementById("stickyViewEu");

  function euStickyLevel() {
    const mean = euCountryMean("ili", "total");
    return mean ? euLevel("ili", mean.value) : { label: "–", color: "#6a737c" };
  }

  function syncStickyBar() {
    if (!sticky) return;
    const eu = !document.getElementById("view-eu").hidden;
    const lvl = eu ? euStickyLevel() : results.are.lvl;
    stickyBadge.textContent = lvl.label;
    stickyBadge.style.background = lvl.color;
    stickyBadge.style.color = bestTextOn(lvl.color);
    stickyWeek.textContent = eu ? EU_LATEST : latest;
    stickyViewDe.classList.toggle("active", !eu);
    stickyViewEu.classList.toggle("active", eu);
    sticky.setAttribute("aria-hidden", "false");
  }

  function initStickyBar() {
    if (!sticky) return;
    stickyViewDe.addEventListener("click", () => setView("de"));
    stickyViewEu.addEventListener("click", () => setView("eu"));
    const sentinel = document.getElementById("sentinel");
    if (sentinel && window.IntersectionObserver) {
      new IntersectionObserver((es) => {
        sticky.classList.toggle("show", !es[0].isIntersecting);
      }).observe(sentinel);
    }
    const back = document.getElementById("stickyBack");
    if (back) back.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }));
    syncStickyBar();
  }

  // Alle DE-Diagramme neu zeichnen (Responsive, Badge-Update, Definitionsnotiz)
  function renderAll() {
    renderCharts();
    buildDefinition();
    syncStickyBar();
  }

  /* ---------- Start ---------- */
  applyStatic();
  renderCharts();
  buildDefinition();
  setWeeks();
  initEurope();
  initStickyBar();
  Object.keys(CHARTS).forEach((k) =>
    onResize(document.getElementById("chart-" + k), renderAll));
  onResize(modalChart, () => { if (!modal.hidden) drawModal(); });
  document.querySelectorAll("[data-lang]").forEach((b) =>
    b.classList.toggle("active", (b.dataset.lang || "") === lang));
  // Sprungmenü: sanftes Scrollen zu den Karten
  document.querySelectorAll("#jumpLinks a").forEach((a) => {
    a.addEventListener("click", (ev) => {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      ev.preventDefault();
      const det = el.tagName === "DETAILS" ? el : el.querySelector("details");
      if (det) det.open = true;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();

