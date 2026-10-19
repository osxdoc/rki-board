/* ===== Atemwegserkrankungen im Überblick / Respiratory diseases at a glance =====
   Zweisprachig (DE/EN), manuell umschaltbar; Diagramme auf RKI-Offen-Daten. */
(function () {
  "use strict";
  const D = window.DASH_DATA;

  /* ---------- I18N-Wörterbuch ---------- */
  const I18N = {
    de: {
      htmlLang: "de",
      locale: "de-DE",
      "title.plain": "Atemwegserkrankungen im Überblick",
      "title.html": "Atemwegserkrankungen im<br>Überblick",
      "topbar.label": "Details:",
      "hero.pill": "Datenlage",
      "hero.text": "Klicken Sie auf die Grafiken für die Details:",
      "intro.html": "Die folgenden Grafiken zeigen die wöchentliche Aktivität von Atemwegserkrankungen in Deutschland – von <em>sehr niedrig</em> bis <em>sehr hoch</em>. Stand: <strong id=\"latestWeek\">–</strong>, Datenquelle: Robert Koch-Institut (RKI).",
      "chart.click": "Klicken für Details",
      "x.left": "vor 6 Monaten",
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
      "ariaSeason": " – Saisonverlauf ",
      "unit.are": "Erkrankte pro 100.000 Einwohner pro Woche",
      "unit.ili": "Fälle mit Fieber pro 100.000 Einwohner pro Woche",
      "unit.sari": "Krankenhaus-Einweisungen (SARI) pro 100.000 Einwohner pro Woche",
      "src.grippe": "GrippeWeb – Daten des Wochenberichts (RKI)",
      "src.sari": "SARI-Hospitalisierungsinzidenz (RKI)",
      "src.ecdc": "ECDC – Respiratory viruses weekly data (ERVISS)",
      "tab.de": "🇩🇪 Deutschland",
      "tab.eu": "🇪🇺 Europa",
      "eu.hero.pill": "Europa · ECDC",
      "eu.hero.text": "Klicken Sie auf die Grafiken für die Details:",
      "eu.title.html": "Atemwegserkrankungen<br>in Europa",
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
      "eu.badge": "Stand: {w} · Ø ILI {v} → {l}",
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
      levels: ["sehr niedrig", "niedrig", "moderat", "erhöht", "hoch", "sehr hoch"],
      months: ["Okt", "Nov", "Dez", "Jan", "Feb", "Mär"],
    },
    en: {
      htmlLang: "en",
      locale: "en-GB",
      "title.plain": "Respiratory diseases at a glance",
      "title.html": "Respiratory diseases<br>at a glance",
      "topbar.label": "Details:",
      "hero.pill": "Data overview",
      "hero.text": "Click the charts for details:",
      "intro.html": "The charts below show the weekly activity of respiratory diseases in Germany – from <em>very low</em> to <em>very high</em>. As of: <strong id=\"latestWeek\">–</strong>, data source: Robert Koch-Institut (RKI).",
      "chart.click": "Click for details",
      "x.left": "6 months ago",
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
      "ariaSeason": " – season course ",
      "unit.are": "Cases per 100,000 population per week",
      "unit.ili": "Febrile cases per 100,000 population per week",
      "unit.sari": "Hospital admissions (SARI) per 100,000 population per week",
      "src.grippe": "GrippeWeb – weekly report data (RKI)",
      "src.sari": "SARI hospitalisation incidence (RKI)",
      "src.ecdc": "ECDC – Respiratory viruses weekly data (ERVISS)",
      "tab.de": "🇩🇪 Germany",
      "tab.eu": "🇪🇺 Europe",
      "eu.hero.pill": "Europe · ECDC",
      "eu.hero.text": "Click the charts for details:",
      "eu.title.html": "Respiratory diseases<br>in Europe",
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
      "eu.badge": "As of: {w} · Ø ILI {v} → {l}",
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
    for (let i = 0; i < th.length; i++) if (v < th[i]) return { label: t("levels")[i], color: LEVEL_COLORS[i] };
    return { label: t("levels")[5], color: LEVEL_COLORS[5] };
  }

  // Saison-Wochen: KW 40..53, dann KW 1..39 (Saisonübergang)
  function seasonWeeks(season) {
    const pts = season.slice();
    const hi = pts.filter((p) => p[0] >= 40).sort((a, b) => a[0] - b[0]);
    const lo = pts.filter((p) => p[0] < 40).sort((a, b) => a[0] - b[0]);
    return hi.concat(lo);
  }

  function seasonKey(s) { return parseInt(s.split("/")[0], 10); }

  // Vergleichslinien der Vorjahre: dunkler = neuer; Strichart zusätzlich (Barrierefreiheit)
  const PREV_STYLE = [
    { stroke: "#98a0a8", dash: "none" },
    { stroke: "#b9bfc6", dash: "5 4" },
    { stroke: "#d5d9dd", dash: "2 4" },
  ];

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
  function sixMonthSeries(bySeason) {
    const all = chrono(bySeason);
    const i = all.length - 1;
    const cur = all.slice(Math.max(0, i - 25), i + 1);
    const prev = [];
    for (let k = 1; k <= 3; k++) {
      const end = i - 52 * k;
      if (end - 25 >= 0) prev.push(all.slice(end - 25, end + 1));
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

  function svgEl(name, attrs, text) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", name);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (text != null) el.textContent = text;
    return el;
  }

  function pathFrom(points, x, y) {
    return points.map((p, i) => (i ? "L" : "M") + x(p.i).toFixed(1) + " " + y(p.value).toFixed(1)).join(" ");
  }

  /* ---------- Mouseover: Hilfslinie + Tooltip mit exakten Werten ---------- */
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

    function show(i, clientY) {
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
      data.rows.forEach((r) => {
        const row = document.createElement("div");
        row.className = "tip-row" + (r.bold ? " tip-bold" : "");
        const sw = document.createElement("span");
        sw.className = "tip-sw";
        sw.style.background = r.color;
        row.appendChild(sw);
        row.appendChild(document.createTextNode(r.label + "  " + (r.value == null ? "–" : fmt.format(r.value))));
        tip.appendChild(row);
      });
      tip.hidden = false;
      const r = svg.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
      const px = r.left - wr.left + (cfg.x(i) / cfg.W) * r.width;
      const py = Math.min(Math.max(clientY - wr.top, 40), wr.height - 10);
      tip.style.left = px + "px";
      tip.style.top = py + "px";
      tip.classList.toggle("tip-flip", px > r.width * 0.55);
    }
    function hide() {
      g.setAttribute("visibility", "hidden");
      tip.hidden = true;
    }
    svg.addEventListener("pointermove", (e) => {
      const r = svg.getBoundingClientRect();
      const sx = (e.clientX - r.left) * (cfg.W / r.width);
      if (sx < cfg.mL - 6 || sx > cfg.W - cfg.mR + 6) { hide(); return; }
      const i = Math.max(0, Math.min(cfg.n - 1,
        Math.round(((sx - cfg.mL) / (cfg.W - cfg.mL - cfg.mR)) * (cfg.n - 1))));
      show(i, e.clientY);
    });
    svg.addEventListener("pointerleave", hide);
  }

  // Legende unter dem 6-Monats-Diagramm: welche Linie gehört zu welcher Saison
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
    const mk = (stroke, dash, label, cls) => {
      const sp = document.createElement("span");
      sp.className = "lg-item " + cls;
      sp.appendChild(swatch(stroke, dash));
      sp.appendChild(document.createTextNode(" " + label));
      box.appendChild(sp);
    };
    mk("#69bee0", "none", cur[cur.length - 1].season + " " + t("legend.now"), "lg-now");
    prev.forEach((pts, k) => {
      const st = PREV_STYLE[Math.min(k, PREV_STYLE.length - 1)];
      mk(st.stroke, st.dash, pts[pts.length - 1].season, "lg-prev");
    });
  }

  // Achsen-Beschriftung: Wochennummern an den Rändern + aktuell
  function renderSixMonthChart(container, key) {
    const cfg = CHARTS[key];
    const { cur, prev, latest } = sixMonthSeries(cfg.get("00+"));
    const W = 1000, H = 320, mL = 64, mR = 16, mT = 18, mB = 30;
    const n = cur.length;
    const allVals = [cur].concat(prev).flat().map((p) => p.value);
    const yMax = niceMax(Math.max.apply(null, allVals) * 1.08);
    const x = (i) => mL + (i / (n - 1)) * (W - mL - mR);
    const y = (v) => H - mB - (v / yMax) * (H - mT - mB);

    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img",
      "aria-label": t("card." + key) + t("aria6m") });

    // Horizontales Gitter
    for (let k = 0; k <= 4; k++) {
      const v = (yMax / 4) * k, yy = y(v);
      svg.appendChild(svgEl("line", { x1: mL, y1: yy, x2: W - mR, y2: yy,
        stroke: k === 0 ? "#9aa1a8" : "#e4e7ea", "stroke-width": k === 0 ? 1.4 : 1 }));
      svg.appendChild(svgEl("text", { x: mL - 8, y: yy + 4, "text-anchor": "end",
        "font-size": 12, fill: "#6a737c" }, fmt.format(Math.round(v))));
    }
    // Zeitleiste: vertikale Gitterlinien + KW-Beschriftung (alle 4 Wochen)
    for (let i = n - 1; i >= 0; i -= 4) {
      const xx = x(i);
      svg.appendChild(svgEl("line", { x1: xx, y1: mT, x2: xx, y2: H - mB,
        stroke: "#dfe3e7", "stroke-width": 1 }));
      svg.appendChild(svgEl("text", { x: xx, y: H - mB + 16,
        "text-anchor": i === n - 1 ? "end" : "middle",
        "font-size": 11, fill: "#6a737c" }, t("weekPrefix") + cur[i].week));
    }

    // Vorjahre (grau abgestuft, mit Hover-Titel "Saison")
    prev.forEach((pts, k) => {
      const st = PREV_STYLE[Math.min(k, PREV_STYLE.length - 1)];
      const indexed = pts.map((p, i) => Object.assign({ i }, p));
      const path = svgEl("path", { d: pathFrom(indexed, x, y), fill: "none",
        stroke: st.stroke, "stroke-width": 1.8, "stroke-dasharray": st.dash });
      path.appendChild(svgEl("title", {}, pts[pts.length - 1].season));
      svg.appendChild(path);
    });

    // Aktuell (blau)
    const curIdx = cur.map((p, i) => Object.assign({ i }, p));
    svg.appendChild(svgEl("path", { d: pathFrom(curIdx, x, y), fill: "none",
      stroke: "#69bee0", "stroke-width": 3.2, "stroke-linejoin": "round" }));

    // Letzter Punkt + Annotation (innen, Ecke gegenüber dem Linienende)
    const last = curIdx[curIdx.length - 1];
    const lvl = levelOf(key, latest.value);
    svg.appendChild(svgEl("circle", { cx: x(last.i), cy: y(latest.value), r: 5,
      fill: "#69bee0", stroke: "#fff", "stroke-width": 1.6 }));
    const top = y(latest.value) > mT + 48; // Linie endet tief -> Text nach oben
    const y1 = top ? mT + 16 : H - mB - 30;
    svg.appendChild(svgEl("text", { x: W - mR - 4, y: y1, "text-anchor": "end",
      "font-size": 15, "font-weight": 700, fill: lvl.color }, t("activity") + ":"));
    svg.appendChild(svgEl("text", { x: W - mR - 4, y: y1 + 20, "text-anchor": "end",
      "font-size": 15, "font-weight": 700, fill: lvl.color }, lvl.label));

    container.replaceChildren(svg);
    attachHover(svg, container, {
      W, H, mL, mR, mT, mB, n, x, y,
      rows: (i) => ({
        title: t("weekPrefix") + cur[i].week,
        rows: [{ color: "#69bee0", label: t("tip.now"), value: cur[i].value, bold: true }]
          .concat(prev.map((pts, k) => (i < pts.length
            ? { color: PREV_STYLE[k].stroke, label: pts[pts.length - 1].season, value: pts[i].value }
            : null)).filter(Boolean)),
      }),
    });

    renderSixMonthLegend(key, cur, prev);
    return { latest, lvl };
  }

  /* ---------- Saison-Diagramm (Modal) ---------- */
  function renderSeasonChart(container, bySeason, ariaLabel) {
    const seasons = Object.keys(bySeason).sort((a, b) => seasonKey(a) - seasonKey(b));
    const shown = seasons.slice(-5);

    const W = 1000, H = 340, mL = 64, mR = 24, mT = 18, mB = 26;
    const slots = 52; // KW 40..39
    const series = shown.map((s) => {
      const pts = seasonWeeks(bySeason[s]);
      return { season: s, pts: pts.map((p, i) => ({ i, value: p[1], week: p[0] })) };
    });
    const allVals = series.flatMap((s) => s.pts.map((p) => p.value));
    const yMax = niceMax(Math.max.apply(null, allVals) * 1.08);
    const x = (i) => mL + (i / (slots - 1)) * (W - mL - mR);
    const y = (v) => H - mB - (v / yMax) * (H - mT - mB);

    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": ariaLabel });
    for (let k = 0; k <= 4; k++) {
      const v = (yMax / 4) * k, yy = y(v);
      svg.appendChild(svgEl("line", { x1: mL, y1: yy, x2: W - mR, y2: yy,
        stroke: k === 0 ? "#9aa1a8" : "#e4e7ea", "stroke-width": k === 0 ? 1.4 : 1 }));
      svg.appendChild(svgEl("text", { x: mL - 8, y: yy + 4, "text-anchor": "end",
        "font-size": 12, fill: "#6a737c" }, fmt.format(Math.round(v))));
    }
    // X-Achse: Monats-Ticks (grobe Orientierung über KW-Position)
    const monthTicks = [[0, 9, 18, 27, 36, 45]];
    const monthLabels = t("months");
    monthTicks[0].forEach((i, k) => {
      svg.appendChild(svgEl("line", { x1: x(i), y1: mT, x2: x(i), y2: H - mB,
        stroke: "#dfe3e7", "stroke-width": 1 }));
      svg.appendChild(svgEl("line", { x1: x(i), y1: H - mB, x2: x(i), y2: H - mB + 4,
        stroke: "#9aa1a8" }));
      svg.appendChild(svgEl("text", { x: x(i), y: H - mB + 18, "text-anchor": "middle",
        "font-size": 12, fill: "#6a737c" }, monthLabels[k]));
    });
    const grays = ["#d3d7db", "#c2c7cc", "#b0b6bc", "#9aa1a8"];
    series.forEach((s, k) => {
      const isLast = k === series.length - 1;
      const path = svgEl("path", { d: pathFrom(s.pts, x, y), fill: "none",
        stroke: isLast ? "#69bee0" : grays[Math.min(k, grays.length - 1)],
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
            ? { color: k === series.length - 1 ? "#69bee0" : grays[Math.min(k, grays.length - 1)],
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
    document.querySelectorAll(".chart-wrap").forEach((el) => { el.title = t("chart.click"); });
    document.getElementById("modalClose").setAttribute("aria-label", t("modal.close"));
  }

  /* ---------- Initialisierung ---------- */
  const latest = D.latest;
  function setWeeks() {
    document.getElementById("latestWeek").textContent = latest;
    document.getElementById("footerWeek").textContent = latest;
    const euW = document.getElementById("euLatestWeek");
    if (euW) euW.textContent = EU_LATEST;
  }

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
  const EU = window.EUROPE_DATA || { sari: {}, ili: {}, ari: {}, pos: {}, sev: {}, latest: null };
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
                     "#17a2b8", "#b32d75", "#6a737c"];

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

  function euThKey(indKey) { return indKey.indexOf("pos") === 0 ? "pos" : indKey; }
  function euLevel(indKey, v) {
    const th = EU_THRESHOLDS[euThKey(indKey)];
    for (let i = 0; i < th.length; i++) if (v < th[i]) return { label: t("levels")[i], color: LEVEL_COLORS[i] };
    return { label: t("levels")[5], color: LEVEL_COLORS[5] };
  }

  // Ø über die Länder der letzten verfügbaren Woche (ungewichtet, Ländermittel)
  function euCountryMean(indKey, age) {
    const vals = [];
    let week = null;
    for (const c of euCountries(indKey)) {
      if (c === "EU/EEA") continue;
      const p = euLastPoint(indKey, c, age);
      if (p) {
        if (!week || p.season + p.week > week) week = p.season + p.week;
        vals.push(p.value);
      }
    }
    if (!vals.length) return null;
    return { value: vals.reduce((a, b) => a + b, 0) / vals.length, week };
  }

  /* ---------- Europa-Badge ---------- */
  function renderEuBadge() {
    const badge = document.getElementById("euBadge");
    if (!badge) return;
    const mean = euCountryMean("ili", "total");
    if (!mean) { badge.textContent = "Stand: " + EU_LATEST; badge.style.background = "#6a737c"; return; }
    const lvl = euLevel("ili", mean.value);
    badge.textContent = fill(t("eu.badge"), { w: EU_LATEST, v: fmt.format(mean.value), l: lvl.label });
    badge.style.background = lvl.color;
  }

  /* ---------- Karte 1: Aktuelle SARI-Inzidenz nach Land (Balken) ---------- */
  function renderEuBars() {
    const box = document.getElementById("chart-eu-bars");
    if (!box) return;
    const rows = [];
    for (const c of euCountries("sari")) {
      if (c === "EU/EEA") continue;
      const p = euLastPoint("sari", c, "total");
      if (p) rows.push({ country: c, value: p.value, week: p.week });
    }
    rows.sort((a, b) => b.value - a.value);
    if (!rows.length) { box.replaceChildren(); return; }

    const W = 1000, rowH = 30, mL = 190, mR = 70, mT = 8, mB = 26;
    const H = mT + rows.length * rowH + mB;
    const maxV = Math.max.apply(null, rows.map((r) => r.value));
    const xMax = niceMax(maxV * 1.05);
    const x = (v) => mL + (v / xMax) * (W - mL - mR);

    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": t("eu.card.bars") });
    // Gitter + Achse
    for (let k = 0; k <= 4; k++) {
      const v = (xMax / 4) * k, xx = x(v);
      svg.appendChild(svgEl("line", { x1: xx, y1: mT, x2: xx, y2: H - mB,
        stroke: k === 0 ? "#9aa1a8" : "#e4e7ea", "stroke-width": k === 0 ? 1.4 : 1 }));
      svg.appendChild(svgEl("text", { x: xx, y: H - mB + 16, "text-anchor": "middle",
        "font-size": 11, fill: "#6a737c" }, fmt.format(Math.round(v))));
    }
    rows.forEach((r, i) => {
      const yy = mT + i * rowH;
      const lvl = euLevel("sari", r.value);
      const label = svgEl("text", { x: mL - 10, y: yy + rowH / 2 + 4, "text-anchor": "end",
        "font-size": 13, fill: "#37474f" }, euFlag(r.country) + euName(r.country));
      svg.appendChild(label);
      const bar = svgEl("rect", { x: mL, y: yy + 5, width: Math.max(2, x(r.value) - mL),
        height: rowH - 10, rx: 3, fill: lvl.color });
      bar.appendChild(svgEl("title", {},
        euName(r.country) + ": " + fmt.format(r.value) + " · " + t("weekPrefix") + r.week));
      svg.appendChild(bar);
      svg.appendChild(svgEl("text", { x: x(r.value) + 6, y: yy + rowH / 2 + 4,
        "font-size": 12, fill: "#455a64" }, fmt.format(r.value)));
      // Klick -> Detail
      const hit = svgEl("rect", { x: 0, y: yy, width: W, height: rowH, fill: "transparent",
        style: "cursor:pointer" });
      hit.appendChild(svgEl("title", {}, euName(r.country)));
      hit.addEventListener("click", () => {
        euDetail.country = r.country;
        const sel = document.getElementById("euCountrySelect");
        if (sel) sel.value = r.country;
        renderEuDetail();
        const card = document.getElementById("card-eu-detail");
        if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
      });
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
    if (euTrend.countries.length < 2) {
      // Top 5 nach letztem Wert als sinnvolle Vorauswahl
      const ranked = pool.map((c) => ({ c, p: euLastPoint(euTrend.ind, c, "total") }))
        .filter((r) => r.p).sort((a, b) => b.p.value - a.p.value).slice(0, 5);
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
    euTrendPool().forEach((c) => {
      const on = euTrend.countries.indexOf(c) >= 0;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (on ? " active" : "");
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
    const series = euTrend.countries.map((c) => {
      const all = chrono(euSeries(euTrend.ind, c, "total"));
      return { country: c, pts: all.slice(-26) };
    }).filter((s) => s.pts.length);
    const n = Math.max.apply(null, series.map((s) => s.pts.length).concat([2]));
    const W = 1000, H = 320, mL = 64, mR = 16, mT = 18, mB = 30;
    const allVals = series.flatMap((s) => s.pts.map((p) => p.value));
    const yMax = niceMax(Math.max.apply(null, allVals.concat([1])) * 1.08);
    const x = (i) => mL + (i / (n - 1)) * (W - mL - mR);
    const y = (v) => H - mB - (v / yMax) * (H - mT - mB);

    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img",
      "aria-label": t("eu.card.trend") + t("aria6m") });
    for (let k = 0; k <= 4; k++) {
      const v = (yMax / 4) * k, yy = y(v);
      svg.appendChild(svgEl("line", { x1: mL, y1: yy, x2: W - mR, y2: yy,
        stroke: k === 0 ? "#9aa1a8" : "#e4e7ea", "stroke-width": k === 0 ? 1.4 : 1 }));
      svg.appendChild(svgEl("text", { x: mL - 8, y: yy + 4, "text-anchor": "end",
        "font-size": 12, fill: "#6a737c" }, fmt.format(Math.round(v))));
    }
    // Zeitachse: Wochen der längsten Reihe (letzte n Wochen)
    for (let i = n - 1; i >= 0; i -= 4) {
      const xx = x(i);
      svg.appendChild(svgEl("line", { x1: xx, y1: mT, x2: xx, y2: H - mB,
        stroke: "#dfe3e7", "stroke-width": 1 }));
      // Beschriftung: Woche der längsten Reihe an Position i (von rechts gezählt)
      const ref = series.map((s) => s.pts[s.pts.length - n + i]).find((p) => p);
      svg.appendChild(svgEl("text", { x: xx, y: H - mB + 16,
        "text-anchor": i === n - 1 ? "end" : "middle",
        "font-size": 11, fill: "#6a737c" }, ref ? t("weekPrefix") + ref.week : ""));
    }
    series.forEach((s, k) => {
      const color = EU_COLORS[k % EU_COLORS.length];
      const offset = n - s.pts.length; // Reihen enden in unterschiedlichen Wochen
      const idx = s.pts.map((p, i) => ({ i: i + offset, value: p.value }));
      const path = svgEl("path", { d: pathFrom(idx, x, y), fill: "none",
        stroke: color, "stroke-width": 2.4, "stroke-linejoin": "round" });
      path.appendChild(svgEl("title", {}, euName(s.country)));
      svg.appendChild(path);
      const last = s.pts[s.pts.length - 1];
      svg.appendChild(svgEl("circle", { cx: x(n - 1), cy: y(last.value), r: 4,
        fill: color, stroke: "#fff", "stroke-width": 1.4 }));
    });
    box.replaceChildren(svg);
    attachHover(svg, box, {
      W, H, mL, mR, mT, mB, n, x, y,
      rows: (i) => ({
        title: (() => {
          const ref = series.map((s) => s.pts[s.pts.length - n + i]).find((p) => p);
          return ref ? t("weekPrefix") + ref.week : "";
        })(),
        rows: series.map((s, k) => {
          const p = s.pts[s.pts.length - n + i];
          return p ? { color: EU_COLORS[k % EU_COLORS.length], label: euName(s.country), value: p.value } : null;
        }).filter(Boolean),
      }),
    });
    // Legende
    const legend = document.getElementById("legend-eu-trend");
    if (legend) {
      legend.replaceChildren();
      series.forEach((s, k) => {
        const sp = document.createElement("span");
        sp.className = "lg-item";
        const sw = document.createElement("span");
        sw.style.cssText = "display:inline-block;width:14px;height:4px;border-radius:2px;background:" +
          EU_COLORS[k % EU_COLORS.length];
        sp.appendChild(sw);
        sp.appendChild(document.createTextNode(" " + euName(s.country)));
        legend.appendChild(sp);
      });
    }
  }

  /* ---------- Karte 3: Land im Detail ---------- */
  const euDetail = { country: "Germany", ind: "sari", age: "total" };

  function renderEuControls() {
    const sel = document.getElementById("euCountrySelect");
    const indBox = document.getElementById("euDetailIndicators");
    const ageBox = document.getElementById("euDetailAges");
    if (!sel || !indBox || !ageBox) return;
    const pool = euCountries(euDetail.ind).filter((c) => c !== "EU/EEA");
    if (pool.indexOf(euDetail.country) < 0) euDetail.country = pool[0] || "Germany";
    sel.replaceChildren();
    pool.forEach((c) => {
      const o = document.createElement("option");
      o.value = c;
      o.textContent = euFlag(c) + euName(c);
      if (c === euDetail.country) o.selected = true;
      sel.appendChild(o);
    });
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
        sp.style.color = isLast ? "#2a7fb8" : "#6a737c";
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
        c: lvl.color, l: lvl.label, u2: EU_SOURCE_URL, s: t("src.ecdc"),
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
  function setView(view) {
    const eu = view === "eu";
    document.getElementById("view-de").hidden = eu;
    document.getElementById("view-eu").hidden = !eu;
    document.getElementById("viewTabDe").classList.toggle("active", !eu);
    document.getElementById("viewTabEu").classList.toggle("active", eu);
    try { localStorage.setItem("rkiview", view); } catch (e) { /* egal */ }
  }

  function initEurope() {
    euTrendFix();
    document.getElementById("euCountrySelect").addEventListener("change", (e) => {
      euDetail.country = e.target.value;
      renderEuDetail();
    });
    document.getElementById("viewTabDe").addEventListener("click", () => setView("de"));
    document.getElementById("viewTabEu").addEventListener("click", () => setView("eu"));
    let start = "de";
    try { if (localStorage.getItem("rkiview") === "eu") start = "eu"; } catch (e) { /* egal */ }
    setView(start);
    renderEurope();
  }

  /* ---------- Modal ---------- */
  const modal = document.getElementById("modal");
  const modalChart = document.getElementById("modalChart");
  const modalAges = document.getElementById("modalAges");
  const modalLegend = document.getElementById("modalLegend");
  let currentKey = null, currentAge = "00+";

  function openModal(key, age) {
    currentKey = key; currentAge = age || "00+";
    const cfg = CHARTS[key];
    document.getElementById("modalTitle").textContent = t("card." + key);
    modalAges.replaceChildren();
    cfg.ages.forEach((a) => {
      const b = document.createElement("button");
      b.textContent = a === "00+" ? t("modal.ageAll") : a;
      b.dataset.age = a;
      if (a === currentAge) b.classList.add("active");
      b.addEventListener("click", () => {
        currentAge = a;
        modalAges.querySelectorAll("button").forEach((x) => x.classList.toggle("active", x.dataset.age === a));
        drawModal();
      });
      modalAges.appendChild(b);
    });
    drawModal();
    modal.hidden = false;
    document.body.style.overflow = "hidden";
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
      sp.style.color = isLast ? "#2a7fb8" : "#6a737c";
      sp.style.fontWeight = isLast ? "700" : "400";
      sp.textContent = "▬ " + s + (isLast ? t("modal.current") : "");
      modalLegend.appendChild(sp);
    });
    const last = series[series.length - 1].pts;
    const lastPt = last[last.length - 1];
    const lvl = levelOf(currentKey, lastPt.value);
    document.getElementById("modalNote").innerHTML = fill(t("modal.note"), {
      w: latest, v: fmt.format(lastPt.value), c: lvl.color, l: lvl.label,
      u: cfg.sourceUrl, s: t(cfg.srcKey),
    });
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  /* ---------- Sprache umschalten ---------- */
  function setLang(l) {
    if (l !== "de" && l !== "en") return;
    lang = l;
    try { localStorage.setItem("rkilang", l); } catch (e) { /* egal */ }
    fmt = new Intl.NumberFormat(I18N[lang].locale, { maximumFractionDigits: 1 });
    document.getElementById("langDe").classList.toggle("active", lang === "de");
    document.getElementById("langEn").classList.toggle("active", lang === "en");
    applyStatic();
    renderCharts();
    buildDefinition();
    setWeeks();
    renderEurope();
    if (!modal.hidden) openModal(currentKey, currentAge);
  }

  document.getElementById("langDe").addEventListener("click", () => setLang("de"));
  document.getElementById("langEn").addEventListener("click", () => setLang("en"));

  document.querySelectorAll(".chart-wrap").forEach((el) => {
    if (!el.dataset.chart) return; // Europa-Karten haben eigenes Klickverhalten
    el.addEventListener("click", () => openModal(el.dataset.chart));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(el.dataset.chart); }
    });
  });
  document.getElementById("modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  /* ---------- Start ---------- */
  applyStatic();
  renderCharts();
  buildDefinition();
  setWeeks();
  initEurope();
  document.getElementById("langDe").classList.toggle("active", lang === "de");
  document.getElementById("langEn").classList.toggle("active", lang === "en");
})();
