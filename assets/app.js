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
      "footer.html": "Daten: Robert Koch-Institut (RKI) · GrippeWeb · SARI-Sentinel · Stand: <span id=\"footerWeek\">–</span> · Diese Seite ist eine Nachbildung auf Basis der offenen RKI-Daten.",
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
      "footer.html": "Data: Robert Koch-Institut (RKI) · GrippeWeb · SARI sentinel · As of: <span id=\"footerWeek\">–</span> · This page is a replica based on open RKI data.",
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
    renderSixMonthLegend(key, cur, prev);
    return { latest, lvl };
  }

  /* ---------- Saison-Diagramm (Modal) ---------- */
  function renderSeasonChart(container, key, age) {
    const cfg = CHARTS[key];
    const bySeason = cfg.get(age) || {};
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

    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img",
      "aria-label": t("card." + key) + t("ariaSeason") + age });
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
    const { series, shown } = renderSeasonChart(modalChart, currentKey, currentAge);
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
    if (!modal.hidden) openModal(currentKey, currentAge);
  }

  document.getElementById("langDe").addEventListener("click", () => setLang("de"));
  document.getElementById("langEn").addEventListener("click", () => setLang("en"));

  document.querySelectorAll(".chart-wrap").forEach((el) => {
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
  document.getElementById("langDe").classList.toggle("active", lang === "de");
  document.getElementById("langEn").classList.toggle("active", lang === "en");
})();
