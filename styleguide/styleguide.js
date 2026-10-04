/* =========================================================================
   styleguide.js — the editable, Figma-ish living style sheet.
   Live token editing + preset themes + a coolors-style palette generator
   (harmony, lock, shuffle, add/delete) + assign-to-role + Save to tokens.css.
   No build step, no framework.
   ========================================================================= */
(function () {
  "use strict";
  var root = document.documentElement;
  var DRAFT_KEY = "styleguide.draft.v1";
  var PAL_KEY = "styleguide.palette.v1";

  /* ---- full token set (mirrors tokens.css) ---- */
  var SCHEMA = [
    { group: "Brand", ui: "palette", items: [
      ["--c-brand", "Brand", "color"], ["--c-brand-deep", "Brand deep", "color"],
      ["--c-accent", "Accent", "color"], ["--c-accent-ink", "Accent text", "color"] ] },
    { group: "Surfaces & lines", ui: "palette", items: [
      ["--c-bg", "Background", "color"], ["--c-surface", "Surface", "color"], ["--c-cream", "Cream", "color"],
      ["--c-border", "Border", "color"], ["--c-border-soft", "Border soft", "color"], ["--c-hairline", "Hairline", "color"],
      ["--nav-bg", "Nav background", "color"], ["--card-bg", "Card background", "color"], ["--footer-bg", "Footer background", "color"], ["--input-bg", "Input background", "color"] ] },
    { group: "Text", ui: "palette", items: [
      ["--c-ink", "Ink", "color"], ["--c-body", "Body", "color"], ["--c-muted", "Muted", "color"], ["--c-muted-2", "Muted 2", "color"], ["--c-on-brand", "On-brand text", "color"], ["--c-placeholder", "Placeholder", "color"] ] },
    { group: "Links & focus", ui: "palette", items: [
      ["--c-link", "Link", "color"], ["--c-link-hover", "Link hover", "color"], ["--c-ring", "Focus ring", "color"], ["--c-selection", "Selection", "color"] ] },
    { group: "Status", ui: "palette", items: [
      ["--c-planning", "Planning", "color"], ["--c-planning-bg", "Planning bg", "color"],
      ["--c-build", "In build", "color"], ["--c-build-bg", "In build bg", "color"],
      ["--c-idea", "Idea", "color"], ["--c-idea-bg", "Idea bg", "color"],
      ["--c-live", "Live", "color"], ["--c-live-bg", "Live bg", "color"],
      ["--c-success", "Success", "color"], ["--c-success-bg", "Success bg", "color"],
      ["--c-warning", "Warning", "color"], ["--c-warning-bg", "Warning bg", "color"],
      ["--c-error", "Error", "color"], ["--c-error-bg", "Error bg", "color"],
      ["--c-info", "Info", "color"], ["--c-info-bg", "Info bg", "color"] ] },
    { group: "Typography", ui: "type", items: [
      ["--font-heading", "Heading font", "font"], ["--font-body", "Body font", "font"], ["--font-mono", "Mono font", "font"],
      ["--fw-heading", "Heading weight", "weight"], ["--fw-body", "Body weight", "weight"],
      ["--fs-display", "Display size", "text"], ["--fs-heading", "Heading size", "text"], ["--fs-card", "Card size", "text"],
      ["--fs-body", "Body size", "text"], ["--fs-small", "Small size", "text"], ["--fs-caption", "Caption size", "text"],
      ["--lh-heading", "Heading line-height", "text"], ["--lh-body", "Body line-height", "text"],
      ["--tracking", "Heading tracking", "text"], ["--measure", "Text max width", "text"], ["--prose", "Prose max width", "text"], ["--type-ratio", "Type scale ratio", "text"] ] },
    { group: "Buttons", ui: "buttons", items: [
      ["--btn-radius", "Button radius", "text"], ["--btn-py", "Padding Y", "text"], ["--btn-px", "Padding X", "text"],
      ["--btn-weight", "Font weight", "weight"], ["--btn-bw", "Outline width", "text"],
      ["--btn-tracking", "Letter spacing", "text"], ["--btn-transform", "Text case", "transform"] ] },
    { group: "Line weight", ui: "foundation", items: [
      ["--bw", "Line weight", "text"], ["--bw-thick", "Line weight thick", "text"] ] },
    { group: "Radius", ui: "foundation", items: [
      ["--radius-sm", "Radius small", "text"], ["--radius-md", "Radius medium", "text"], ["--radius-lg", "Radius large", "text"], ["--radius-pill", "Radius pill", "text"] ] },
    { group: "Elevation", ui: "foundation", items: [
      ["--shadow-sm", "Shadow small", "shadow"], ["--shadow", "Shadow", "shadow"], ["--shadow-lg", "Shadow large", "shadow"] ] },
    { group: "Layout", ui: "foundation", items: [
      ["--container", "Container width", "text"], ["--section-y", "Section padding", "text"], ["--hero-y", "Hero padding", "text"], ["--gutter", "Page gutter", "text"], ["--gap", "Grid gap", "text"], ["--space", "Base space", "text"] ] },
    { group: "Spacing scale", ui: "foundation", items: [
      ["--space-xs", "Space xs", "text"], ["--space-sm", "Space sm", "text"], ["--space-md", "Space md", "text"], ["--space-lg", "Space lg", "text"], ["--space-xl", "Space xl", "text"] ] },
    { group: "Components", ui: "component", items: [
      ["--card-pad", "Card padding", "text"], ["--card-radius", "Card radius", "text"], ["--card-bw", "Card border", "text"], ["--badge-radius", "Badge radius", "text"],
      ["--input-bw", "Input border", "text"], ["--input-py", "Input padding Y", "text"], ["--input-px", "Input padding X", "text"], ["--input-radius", "Input radius", "text"],
      ["--nav-h", "Nav height", "text"], ["--icon-size", "Icon size", "text"] ] },
    { group: "States, motion & effects", ui: "fx", items: [
      ["--hover-bright", "Hover brightness", "text"], ["--disabled-opacity", "Disabled opacity", "text"],
      ["--ring-width", "Focus ring width", "text"], ["--ring-offset", "Focus ring offset", "text"],
      ["--dur", "Transition duration", "text"], ["--dur-fast", "Duration fast", "text"], ["--dur-slow", "Duration slow", "text"], ["--ease", "Easing", "ease"],
      ["--grad", "Brand gradient", "text"], ["--backdrop-blur", "Backdrop blur", "text"], ["--overlay", "Overlay opacity", "text"], ["--scrim", "Scrim (modal backdrop)", "text"] ] }
  ];

  // Curated Google Fonts (all loadable). Add any other with "Add a Google Font…".
  var FONTS = [
    "Inter", "Plus Jakarta Sans", "Outfit", "Manrope", "Sora", "Space Grotesk", "Work Sans", "DM Sans",
    "Geist", "Onest", "Albert Sans", "Hanken Grotesk", "Schibsted Grotesk", "Instrument Sans", "Bricolage Grotesque",
    "Be Vietnam Pro", "Epilogue", "Lexend", "Mulish", "Nunito Sans", "Rubik", "Poppins", "Montserrat", "Karla",
    "Public Sans", "Red Hat Display", "Urbanist", "Figtree", "Familjen Grotesk", "Syne", "Unbounded", "Big Shoulders Display",
    "Fraunces", "Lora", "Playfair Display", "DM Serif Display", "Source Serif 4", "Spectral", "Libre Baskerville",
    "Cormorant", "EB Garamond", "Newsreader", "Bitter", "Crimson Pro", "Domine", "Instrument Serif",
    "JetBrains Mono", "IBM Plex Mono", "Geist Mono", "Space Mono", "Fira Code", "DM Mono"];
  var WEIGHTS = ["300", "400", "500", "600", "700", "800"];

  // Named shadow levels (so the raw CSS is hidden behind a simple picker)
  var EASES = [["Standard", "cubic-bezier(0.4, 0, 0.2, 1)"], ["Ease", "ease"], ["Ease in-out", "ease-in-out"], ["Ease out", "ease-out"], ["Snappy", "cubic-bezier(0.2, 0, 0, 1)"], ["Spring", "cubic-bezier(0.34, 1.56, 0.64, 1)"], ["Linear", "linear"]];
  var SHADOWS = {
    "--shadow-sm": [
      ["None", "none"],
      ["Faint", "0 1px 2px rgba(13,40,25,0.05)"],
      ["Subtle", "0 1px 3px rgba(13,40,25,0.07)"],
      ["Soft", "0 2px 6px rgba(13,40,25,0.09)"]
    ],
    "--shadow": [
      ["None", "none"],
      ["Subtle", "0 1px 2px rgba(13,40,25,0.06), 0 1px 3px rgba(13,40,25,0.05)"],
      ["Soft", "0 2px 6px rgba(13,40,25,0.08), 0 1px 2px rgba(13,40,25,0.05)"],
      ["Medium", "0 4px 12px rgba(13,40,25,0.10), 0 2px 4px rgba(13,40,25,0.06)"],
      ["Strong", "0 8px 20px rgba(13,40,25,0.12), 0 3px 6px rgba(13,40,25,0.07)"]
    ],
    "--shadow-lg": [
      ["None", "none"],
      ["Soft", "0 10px 24px rgba(13,40,25,0.10)"],
      ["Medium", "0 18px 40px rgba(13,40,25,0.14)"],
      ["Strong", "0 24px 50px rgba(13,40,25,0.18)"],
      ["Dramatic", "0 32px 70px rgba(13,40,25,0.24)"]
    ]
  };

  /* ---- preset themes (apply a whole look at once) ---- */
  var THEMES = {
    Earthy:    { fontHeading: "Inter", fontBody: "Inter", c: { "--c-brand": "#1f7a4d", "--c-brand-deep": "#0c3b25", "--c-accent": "#b5803a", "--c-accent-ink": "#ffffff", "--c-bg": "#f4f5f1", "--c-surface": "#ffffff", "--c-cream": "#f3f1e9", "--c-border": "#e4e6e0", "--c-border-soft": "#eef0ea", "--c-hairline": "#d8dcd3", "--c-ink": "#11241b", "--c-body": "#2f3a33", "--c-muted": "#6b746c", "--c-muted-2": "#9aa39b", "--c-on-brand": "#f3f7f3" } },
    Cool:      { fontHeading: "Plus Jakarta Sans", fontBody: "Inter", c: { "--c-brand": "#2563eb", "--c-brand-deep": "#0b2a66", "--c-accent": "#06b6d4", "--c-accent-ink": "#06262e", "--c-bg": "#f5f7fb", "--c-surface": "#ffffff", "--c-cream": "#eef2f9", "--c-border": "#e3e8f0", "--c-border-soft": "#eef2f8", "--c-hairline": "#d6deea", "--c-ink": "#0f172a", "--c-body": "#334155", "--c-muted": "#64748b", "--c-muted-2": "#94a3b8", "--c-on-brand": "#f0f5ff" } },
    Warm:      { fontHeading: "Fraunces", fontBody: "Inter", c: { "--c-brand": "#c2410c", "--c-brand-deep": "#5a1e08", "--c-accent": "#d97706", "--c-accent-ink": "#2a1405", "--c-bg": "#faf6f1", "--c-surface": "#fffdfb", "--c-cream": "#f6ede2", "--c-border": "#ecdfd2", "--c-border-soft": "#f3eadf", "--c-hairline": "#e0cdba", "--c-ink": "#2a1a12", "--c-body": "#4a3a30", "--c-muted": "#8a7563", "--c-muted-2": "#b3a193", "--c-on-brand": "#fff5ee" } },
    Corporate: { fontHeading: "Libre Franklin", fontBody: "Inter", c: { "--c-brand": "#1e3a5f", "--c-brand-deep": "#0d1f33", "--c-accent": "#2f6f9e", "--c-accent-ink": "#ffffff", "--c-bg": "#f6f8fa", "--c-surface": "#ffffff", "--c-cream": "#eef2f6", "--c-border": "#e2e8f0", "--c-border-soft": "#eef2f6", "--c-hairline": "#d4dde6", "--c-ink": "#111827", "--c-body": "#374151", "--c-muted": "#6b7280", "--c-muted-2": "#9aa6b2", "--c-on-brand": "#eef4fb" } },
    Vibrant:   { fontHeading: "Space Grotesk", fontBody: "Inter", c: { "--c-brand": "#7c3aed", "--c-brand-deep": "#3b1d73", "--c-accent": "#ec4899", "--c-accent-ink": "#ffffff", "--c-bg": "#faf7ff", "--c-surface": "#ffffff", "--c-cream": "#f2ecfb", "--c-border": "#e8e0f5", "--c-border-soft": "#f1ebfa", "--c-hairline": "#ddd0f0", "--c-ink": "#1b1330", "--c-body": "#3b3354", "--c-muted": "#6d6586", "--c-muted-2": "#9a93ad", "--c-on-brand": "#f7f2ff" } },
    Mono:      { fontHeading: "Inter", fontBody: "Inter", c: { "--c-brand": "#18181b", "--c-brand-deep": "#09090b", "--c-accent": "#52525b", "--c-accent-ink": "#ffffff", "--c-bg": "#fafafa", "--c-surface": "#ffffff", "--c-cream": "#f4f4f5", "--c-border": "#e4e4e7", "--c-border-soft": "#efeff1", "--c-hairline": "#d4d4d8", "--c-ink": "#18181b", "--c-body": "#3f3f46", "--c-muted": "#71717a", "--c-muted-2": "#a1a1aa", "--c-on-brand": "#fafafa" } }
  };
  // Where a generated swatch can be sent.
  var ROLES = [["", "Use as…"], ["--c-brand", "Brand"], ["--c-brand-deep", "Brand deep"], ["--c-accent", "Accent"], ["--c-bg", "Background"], ["--c-surface", "Surface"], ["--c-ink", "Ink"], ["--c-body", "Body"]];

  /* ---- state ---- */
  var values = {}, base = {}, dirty = false, fileHandle = null;
  var palette = [];          // generator swatches: {hex, locked}

  /* ---- responsive (desktop / mobile) ---- */
  var MODE = "desktop";            // which breakpoint you're editing
  var mobileVals = {}, baseMobile = {};
  var MOBILE_KEY = "styleguide.mobile.v1";

  /* ---- change requests (structural notes Claude applies) ---- */
  var notes = "", NOTES_KEY = "styleguide.notes.v1";
  function loadNotes() { try { notes = localStorage.getItem(NOTES_KEY) || ""; } catch (e) { notes = ""; } }
  function initNotes() { var ta = document.getElementById("change-notes"); if (!ta) return; ta.value = notes; ta.addEventListener("input", function () { notes = ta.value; try { notes.trim() ? localStorage.setItem(NOTES_KEY, notes) : localStorage.removeItem(NOTES_KEY); } catch (e) {} markDirty(); }); }
  // tokens that can have a mobile override (type + spacing); others are shared
  var RESPONSIVE = { "--fs-display": 1, "--fs-heading": 1, "--fs-card": 1, "--fs-body": 1, "--fs-small": 1, "--fs-caption": 1,
    "--lh-heading": 1, "--lh-body": 1, "--tracking": 1, "--measure": 1, "--section-y": 1, "--gap": 1, "--container": 1 };
  function curVal(v) { return (MODE === "mobile" && RESPONSIVE[v] && mobileVals[v] != null) ? mobileVals[v] : values[v]; }
  function saveMobile() { try { Object.keys(mobileVals).length ? localStorage.setItem(MOBILE_KEY, JSON.stringify(mobileVals)) : localStorage.removeItem(MOBILE_KEY); } catch (e) {} }
  function loadMobile() { var raw; try { raw = JSON.parse(localStorage.getItem(MOBILE_KEY) || "null"); } catch (e) { raw = null; } mobileVals = raw || {}; baseMobile = clone(mobileVals); }
  var genScheme = "analogous";

  /* ---- helpers ---- */
  function clone(o) { var n = {}; Object.keys(o).forEach(function (k) { n[k] = o[k]; }); return n; }
  function stripQuotes(s) { return (s || "").replace(/^["']|["']$/g, "").trim(); }
  function expandHex(h) { h = (h || "").trim(); if (/^#([0-9a-f]{3})$/i.test(h)) return "#" + h.slice(1).split("").map(function (c) { return c + c; }).join(""); return h; }
  function isHex(h) { return /^#([0-9a-f]{6})$/i.test(expandHex(h)); }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---- colour maths ---- */
  function hexToHsl(hex) {
    hex = expandHex(hex).replace("#", "");
    var r = parseInt(hex.substr(0, 2), 16) / 255, g = parseInt(hex.substr(2, 2), 16) / 255, b = parseInt(hex.substr(4, 2), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), h = 0, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else { var d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0); else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h /= 6; }
    return [h * 360, s * 100, l * 100];
  }
  function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360 / 360; s = clamp(s, 0, 100) / 100; l = clamp(l, 0, 100) / 100;
    var r, g, b;
    if (s === 0) { r = g = b = l; }
    else { var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; r = hue(p, q, h + 1 / 3); g = hue(p, q, h); b = hue(p, q, h - 1 / 3); }
    return "#" + [r, g, b].map(function (x) { return ("0" + Math.round(x * 255).toString(16)).slice(-2); }).join("");
  }
  function hue(p, q, t) { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; }

  function genPalette(baseHex, scheme, count) {
    var hsl = hexToHsl(baseHex), h = hsl[0], s = clamp(hsl[1], 35, 80), out = [], i;
    var ramp = function (n) { var a = []; for (i = 0; i < n; i++) a.push(86 - (66 / Math.max(1, n - 1)) * i); return a; }; // light→dark L
    if (scheme === "monochrome") { ramp(count).forEach(function (l) { out.push(hslToHex(h, s, l)); }); }
    else if (scheme === "analogous") { var Ls = ramp(count); for (i = 0; i < count; i++) out.push(hslToHex(h + (i - (count - 1) / 2) * 26, s, Ls[i])); }
    else if (scheme === "complementary") { var c = count, half = Math.ceil(c / 2); for (i = 0; i < half; i++) out.push(hslToHex(h, s, 80 - (50 / Math.max(1, half - 1)) * i)); for (i = 0; i < c - half; i++) out.push(hslToHex(h + 180, s, 66 - (28 / Math.max(1, c - half)) * i)); }
    else if (scheme === "triadic") { var hs = [h, h + 120, h + 240]; for (i = 0; i < count; i++) out.push(hslToHex(hs[i % 3], s, 74 - (40 / Math.max(1, count - 1)) * i)); }
    else { for (i = 0; i < count; i++) out.push(hslToHex(h + (i - (count - 1) / 2) * 26, s, 84 - (60 / Math.max(1, count - 1)) * i)); }
    return out;
  }

  /* ---- read / apply / persist ---- */
  function readInitial() { var cs = getComputedStyle(root); eachToken(function (v) { values[v] = (cs.getPropertyValue(v) || "").trim(); }); base = clone(values); }
  function eachToken(fn) { SCHEMA.forEach(function (g) { g.items.forEach(function (it) { fn(it[0]); }); }); }
  var CLAMP = { "--overlay": [0, 1], "--disabled-opacity": [0, 1], "--hover-bright": [0.5, 2], "--type-ratio": [1, 2], "--lh-heading": [0.8, 3], "--lh-body": [0.8, 3], "--backdrop-blur": [0, 60] };
  function clampVal(name, val) { var c = CLAMP[name]; if (!c) return val; var n = parseFloat(val); if (isNaN(n)) return val; var m = String(val).match(/[a-z%]+$/i), u = m ? m[0] : ""; return Math.max(c[0], Math.min(c[1], n)) + u; }
  function sanitizeValues() { Object.keys(CLAMP).forEach(function (k) { if (values[k] != null) { var nv = clampVal(k, values[k]); if (nv !== values[k]) { values[k] = nv; root.style.setProperty(k, nv); } } if (mobileVals[k] != null) mobileVals[k] = clampVal(k, mobileVals[k]); }); }
  function setVar(name, val) {
    val = clampVal(name, val);
    if (MODE === "mobile" && RESPONSIVE[name]) {
      if (val === values[name]) delete mobileVals[name]; else mobileVals[name] = val;
      applyToPreview(name, val); saveMobile(); markDirty(); return;   // preview is at mobile width
    }
    values[name] = val; root.style.setProperty(name, val); applyToPreview(name, val); saveDraft(); markDirty();
  }
  function setMode(m) {
    MODE = m;
    document.querySelectorAll("[data-mode]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-mode") === m); });
    var hint = document.getElementById("ms-hint"); if (hint) hint.textContent = m === "mobile" ? "Type, line-height, spacing & container changes save as mobile overrides" : "";
    var f = pvFrame(); if (f) f.style.maxWidth = m === "mobile" ? "390px" : "none";
    document.querySelectorAll("[data-device]").forEach(function (b) { var d = b.getAttribute("data-device"); b.classList.toggle("on", (m === "mobile" && d === "390") || (m === "desktop" && d === "full")); });
    render(); applyAllToPreview();
  }
  function baseSig() { return JSON.stringify(base); }   // signature of the tokens.css this draft was made against
  function saveDraft() { var diff = {}; Object.keys(values).forEach(function (k) { if (values[k] !== base[k]) diff[k] = values[k]; }); try { Object.keys(diff).length ? localStorage.setItem(DRAFT_KEY, JSON.stringify({ sig: baseSig(), vars: diff })) : localStorage.removeItem(DRAFT_KEY); } catch (e) {} }
  function loadDraft() {
    var raw; try { raw = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch (e) { raw = null; }
    if (!raw) return;
    // If tokens.css changed since the draft was saved (new design / Claude rebuilt it), discard the draft.
    if (!raw.sig || raw.sig !== baseSig()) { try { localStorage.removeItem(DRAFT_KEY); } catch (e) {} return; }
    Object.keys(raw.vars || {}).forEach(function (k) { if (k in base) { values[k] = raw.vars[k]; root.style.setProperty(k, raw.vars[k]); } });
    if (Object.keys(raw.vars || {}).length) dirty = true;
  }
  function markDirty() { dirty = true; updateStatus(); }
  function markSaved() { dirty = false; updateStatus(); }
  function updateStatus() { var el = document.getElementById("sg-status"); var link = fileHandle ? " · linked to " + (fileHandle.name || "tokens.css") : ""; el.textContent = (dirty ? "Unsaved changes" : "Saved") + link; el.className = "status" + (dirty ? " dirty" : ""); }

  /* ---- fonts ---- */
  var loadedFonts = {};
  function loadFont(name) { name = stripQuotes(name); if (!name || loadedFonts[name]) return; loadedFonts[name] = true; var link = document.createElement("link"); link.rel = "stylesheet"; link.href = "https://fonts.googleapis.com/css2?family=" + name.replace(/ /g, "+") + ":wght@300;400;500;600;700;800&display=swap"; document.head.appendChild(link); }

  /* ---- themes ---- */
  function applyTheme(name) {
    var t = THEMES[name]; if (!t) return;
    Object.keys(t.c).forEach(function (v) { setVar(v, t.c[v]); });
    if (t.fontHeading) { loadFont(t.fontHeading); setVar("--font-heading", '"' + t.fontHeading + '"'); }
    if (t.fontBody) { loadFont(t.fontBody); setVar("--font-body", '"' + t.fontBody + '"'); }
    render(); toast("Applied “" + name + "” theme");
  }

  /* ---- generator palette ---- */
  function savePalette() { try { localStorage.setItem(PAL_KEY, JSON.stringify(palette)); } catch (e) {} }
  function loadPalette() { var raw; try { raw = JSON.parse(localStorage.getItem(PAL_KEY) || "null"); } catch (e) { raw = null; } palette = (raw && raw.length) ? raw : genPalette(values["--c-brand"] || "#1f7a4d", "analogous", 5).map(function (h) { return { hex: h, locked: false }; }); }
  function regen(randomBase) {
    var seed = randomBase ? hslToHex(Math.random() * 360, 55 + Math.random() * 20, 50) : (firstLocked() || values["--c-brand"] || "#1f7a4d");
    var fresh = genPalette(seed, genScheme, palette.length);
    palette = palette.map(function (sw, i) { return sw.locked ? sw : { hex: fresh[i], locked: false }; });
    savePalette(); renderGenerator(); markDirty();
  }
  function firstLocked() { for (var i = 0; i < palette.length; i++) if (palette[i].locked) return palette[i].hex; return null; }

  /* ---- render ---- */
  function render() { renderThemes(); renderGenerator(); renderPresets(); renderPalette(); renderTypeControls(); renderTypeScale(); renderButtonControls(); renderComponentControls(); renderFoundationControls(); renderFxControls(); bindEditors(); }

  function renderThemes() {
    var el = document.getElementById("themes"); if (!el) return;
    el.innerHTML = '<div class="theme-row">' + Object.keys(THEMES).map(function (name) {
      var c = THEMES[name].c;
      return '<button type="button" class="theme-chip" data-theme="' + name + '"><span class="dots"><span style="background:' + c["--c-brand"] + '"></span><span style="background:' + c["--c-accent"] + '"></span><span style="background:' + c["--c-bg"] + '"></span></span>' + esc(name) + "</button>";
    }).join("") + "</div>";
    el.querySelectorAll("[data-theme]").forEach(function (b) { b.addEventListener("click", function () { applyTheme(b.getAttribute("data-theme")); }); });
  }

  function renderGenerator() {
    var el = document.getElementById("generator"); if (!el) return;
    var schemes = ["analogous", "complementary", "triadic", "monochrome"];
    el.innerHTML =
      '<div class="gen-bar">' +
        '<label class="gen-seed">Base<span class="chip-mini" style="background:' + (values["--c-brand"] || "#1f7a4d") + '"><input type="color" id="gen-base" value="' + (isHex(values["--c-brand"]) ? expandHex(values["--c-brand"]) : "#1f7a4d") + '"></span></label>' +
        '<select id="gen-scheme">' + schemes.map(function (s) { return '<option value="' + s + '"' + (s === genScheme ? " selected" : "") + ">" + s + "</option>"; }).join("") + "</select>" +
        '<button type="button" class="btn-bar" id="gen-go">Generate</button>' +
        '<button type="button" class="btn-bar" id="gen-rand">✦ Surprise me</button>' +
        '<button type="button" class="btn-bar" id="gen-add">+ Add colour</button>' +
        '<span class="gen-tip">Lock the ones you like, then Generate again.</span>' +
      "</div>" +
      '<div class="gen-strip">' + palette.map(genSwatch).join("") + "</div>";
    bindGenerator(el);
  }
  function genSwatch(sw, i) {
    var dark = isDark(sw.hex);
    return '<div class="gen-sw"><div class="col" style="background:' + esc(sw.hex) + '">' +
      '<input type="color" data-gcol="' + i + '" value="' + (isHex(sw.hex) ? expandHex(sw.hex) : "#000000") + '">' +
      '<div class="tools" style="color:' + (dark ? "#fff" : "#111") + '">' +
        '<button type="button" class="tbtn lock' + (sw.locked ? " on" : "") + '" data-glock="' + i + '" title="Lock">' + (sw.locked ? "🔒" : "🔓") + "</button>" +
        '<button type="button" class="tbtn" data-gcopy="' + i + '" title="Copy">⧉</button>' +
        '<button type="button" class="tbtn" data-gdel="' + i + '" title="Delete">✕</button>' +
      "</div></div>" +
      '<div class="foot"><input class="hex" type="text" data-ghex="' + i + '" value="' + esc(sw.hex) + '" spellcheck="false">' +
        '<select class="use" data-guse="' + i + '">' + ROLES.map(function (r) { return '<option value="' + r[0] + '">' + esc(r[1]) + "</option>"; }).join("") + "</select></div></div>";
  }
  function bindGenerator(el) {
    var base = el.querySelector("#gen-base"); if (base) base.addEventListener("input", function () { setVar("--c-brand", base.value); var seed = el.querySelector(".gen-seed .chip-mini"); if (seed) seed.style.background = base.value; });
    el.querySelector("#gen-scheme").addEventListener("change", function (e) { genScheme = e.target.value; });
    el.querySelector("#gen-go").addEventListener("click", function () { regen(false); });
    el.querySelector("#gen-rand").addEventListener("click", function () { regen(true); });
    el.querySelector("#gen-add").addEventListener("click", function () { palette.push({ hex: hslToHex(Math.random() * 360, 55, 60), locked: false }); savePalette(); renderGenerator(); });
    el.querySelectorAll("[data-gcol]").forEach(function (inp) { inp.addEventListener("input", function () { var i = +inp.getAttribute("data-gcol"); palette[i].hex = inp.value; savePalette(); var sw = inp.closest(".gen-sw"); sw.querySelector(".col").style.background = inp.value; sw.querySelector(".hex").value = inp.value; }); });
    el.querySelectorAll("[data-ghex]").forEach(function (inp) { inp.addEventListener("input", function () { var i = +inp.getAttribute("data-ghex"); if (isHex(inp.value)) { palette[i].hex = expandHex(inp.value); savePalette(); inp.closest(".gen-sw").querySelector(".col").style.background = palette[i].hex; } }); });
    el.querySelectorAll("[data-glock]").forEach(function (b) { b.addEventListener("click", function () { var i = +b.getAttribute("data-glock"); palette[i].locked = !palette[i].locked; savePalette(); renderGenerator(); }); });
    el.querySelectorAll("[data-gcopy]").forEach(function (b) { b.addEventListener("click", function () { copyText(palette[+b.getAttribute("data-gcopy")].hex); }); });
    el.querySelectorAll("[data-gdel]").forEach(function (b) { b.addEventListener("click", function () { if (palette.length <= 1) return; palette.splice(+b.getAttribute("data-gdel"), 1); savePalette(); renderGenerator(); }); });
    el.querySelectorAll("[data-guse]").forEach(function (sel) { sel.addEventListener("change", function () { var i = +sel.getAttribute("data-guse"); if (sel.value) { setVar(sel.value, palette[i].hex); toast("Set " + roleLabel(sel.value)); render(); } }); });
  }
  function roleLabel(v) { for (var i = 0; i < ROLES.length; i++) if (ROLES[i][0] === v) return ROLES[i][1]; return v; }

  /* ---- palette / type / foundation controls ---- */
  function renderPalette() {
    var openByDefault = { "Brand": 1, "Surfaces & lines": 1, "Text": 1 };
    document.getElementById("palette").innerHTML = SCHEMA.filter(function (g) { return g.ui === "palette"; }).map(function (g) {
      return '<details class="pal-group"' + (openByDefault[g.group] ? " open" : "") + '><summary>' + esc(g.group) + '<span class="count">' + g.items.length + ' colours</span></summary><div class="sw-grid">' + g.items.map(swatch).join("") + "</div></details>";
    }).join("");
  }
  function renderTypeControls() { document.getElementById("type-controls").innerHTML = group("Typography").items.map(ctrl).join(""); }
  function renderButtonControls() { var el = document.getElementById("button-controls"); if (el) el.innerHTML = group("Buttons").items.map(ctrl).join(""); }
  function renderComponentControls() { var el = document.getElementById("component-controls"); if (el) el.innerHTML = group("Components").items.map(ctrl).join(""); }
  function renderFxControls() { var el = document.getElementById("fx-controls"); if (el) el.innerHTML = group("States, motion & effects").items.map(ctrl).join(""); }
  function renderFoundationControls() { document.getElementById("foundation-controls").innerHTML = group("Line weight").items.map(ctrl).join("") + group("Radius").items.map(ctrl).join("") + group("Elevation").items.map(ctrl).join("") + group("Layout").items.map(ctrl).join("") + group("Spacing scale").items.map(ctrl).join(""); }
  function renderTypeScale() {
    var el = document.getElementById("typescale"); if (!el) return;
    var ratios = [["Minor 3rd", "1.2"], ["Major 3rd", "1.25"], ["Perfect 4th", "1.333"], ["Aug 4th", "1.414"], ["Golden", "1.618"]];
    var cur = (values["--type-ratio"] || "").trim();
    el.innerHTML = '<div class="preset-group"><div class="pg-label">Type scale — recompute sizes from body × ratio</div><div class="preset-btns">' +
      ratios.map(function (r) { return '<button type="button" class="preset-btn' + (r[1] === cur ? " on" : "") + '" data-ratio="' + r[1] + '">' + esc(r[0]) + " · " + r[1] + "</button>"; }).join("") + "</div></div>";
    el.querySelectorAll("[data-ratio]").forEach(function (b) { b.addEventListener("click", function () { applyTypeScale(parseFloat(b.getAttribute("data-ratio"))); }); });
  }
  function applyTypeScale(ratio) {
    var bp = parseNum(values["--fs-body"]); var base = bp ? bp.num : 16; var unit = bp ? bp.unit : "px";
    var rnd = function (n) { return Math.round(n) + unit; };
    setVar("--type-ratio", String(ratio));
    setVar("--fs-caption", rnd(base / (ratio * ratio)));
    setVar("--fs-small", rnd(base / ratio));
    setVar("--fs-body", base + unit);
    setVar("--fs-card", rnd(base * ratio));
    setVar("--fs-heading", rnd(base * ratio * ratio));
    setVar("--fs-display", rnd(base * ratio * ratio * ratio));
    render(); toast("Type scale · ratio " + ratio);
  }
  function group(name) { return SCHEMA.filter(function (g) { return g.group === name; })[0]; }

  function swatch(it) {
    var v = it[0], label = it[1], val = expandHex(values[v]), colorVal = isHex(val) ? val : "#000000";
    return '<div class="sw"><div class="chip" style="background:var(' + v + ')"><input type="color" data-color="' + v + '" value="' + colorVal + '" aria-label="' + esc(label) + '"></div>' +
      '<div class="meta"><div class="nm">' + esc(label) + '</div><div class="hexrow"><input type="text" data-hex="' + v + '" value="' + esc(values[v]) + '" spellcheck="false" aria-label="' + esc(label) + ' hex"></div></div></div>';
  }
  function ctrl(it) {
    var v = it[0], label = it[1], type = it[2], inner;
    var resp = (MODE === "mobile" && RESPONSIVE[v]) ? ' data-resp="1"' : "";
    if (type === "font") { var cur = stripQuotes(values[v]); var opts = FONTS.slice(); if (opts.indexOf(cur) < 0 && cur) opts.unshift(cur); inner = '<select data-font="' + v + '">' + opts.map(function (f) { return '<option' + (f === cur ? " selected" : "") + ' style="font-family:\'' + esc(f) + "'\">" + esc(f) + "</option>"; }).join("") + '<option value="__custom__">＋ Add a Google Font…</option></select>'; }
    else if (type === "weight") { var cw = (values[v] || "").trim(); inner = '<select data-text="' + v + '">' + WEIGHTS.map(function (w) { return '<option' + (w === cw ? " selected" : "") + ">" + w + "</option>"; }).join("") + "</select>"; }
    else if (type === "transform") { var ct = (values[v] || "none").trim(); inner = '<select data-text="' + v + '">' + ["none", "uppercase", "capitalize", "lowercase"].map(function (t) { return '<option' + (t === ct ? " selected" : "") + ">" + t + "</option>"; }).join("") + "</select>"; }
    else if (type === "shadow") { var lv = SHADOWS[v] || [], cv = (values[v] || "").trim(), matched = false; var o2 = lv.map(function (o) { var sel = o[1] === cv; if (sel) matched = true; return '<option value="' + esc(o[1]) + '"' + (sel ? " selected" : "") + ">" + esc(o[0]) + "</option>"; }).join(""); if (!matched) o2 = '<option value="' + esc(cv) + '" selected>Custom</option>' + o2; inner = '<select data-text="' + v + '">' + o2 + "</select>"; }
    else if (type === "ease") { var ce = (values[v] || "").trim(), em = false; var oe = EASES.map(function (o) { var sel = o[1] === ce; if (sel) em = true; return '<option value="' + esc(o[1]) + '"' + (sel ? " selected" : "") + ">" + esc(o[0]) + "</option>"; }).join(""); if (!em) oe = '<option value="' + esc(ce) + '" selected>Custom</option>' + oe; inner = '<select data-text="' + v + '">' + oe + "</select>"; }
    else { inner = '<input type="text" data-text="' + v + '"' + resp + ' value="' + esc(curVal(v)) + '" spellcheck="false">'; }
    return '<div class="ctrl' + (resp ? " is-resp" : "") + '"><label>' + esc(label) + (resp ? ' <span class="resp-tag">mobile</span>' : "") + "</label>" + inner + demoFor(v) + "</div>";
  }
  // tiny inline preview for tokens whose effect isn't obvious from a number
  function demoFor(v) {
    switch (v) {
      case "--hover-bright": return '<div class="fxd"><span class="fxd-hover">hover me</span></div>';
      case "--disabled-opacity": return '<div class="fxd"><span class="fxd-dis">disabled</span></div>';
      case "--dur": case "--ease": return '<div class="fxd"><div class="fxd-motion"><i></i></div></div>';
      case "--dur-fast": case "--dur-slow": return '<div class="fxd"><div class="fxd-motion"><i style="animation-duration:var(' + v + ')"></i></div></div>';
      case "--font-mono": return '<div class="fxd"><span class="fxd-mono">£1,234.56</span></div>';
      case "--ring-width": case "--ring-offset": return '<div class="fxd"><span class="fxd-ring">focus</span></div>';
      case "--scrim": return '<div class="fxd"><div class="fxd-stage fxd-scrim"><span>scrim</span></div></div>';
      case "--icon-size": return '<div class="fxd"><span class="fxd-icon"></span></div>';
      case "--grad": return '<div class="fxd"><div class="fxd-grad"></div></div>';
      case "--backdrop-blur": return '<div class="fxd"><div class="fxd-stage"><span class="fxd-glass">blur</span></div></div>';
      case "--overlay": return '<div class="fxd"><div class="fxd-stage fxd-ov"><span>overlay</span></div></div>';
      case "--shadow-sm": case "--shadow": case "--shadow-lg": return '<div class="fxd"><div class="fxd-shadow" style="box-shadow:var(' + v + ')"></div></div>';
      default: return "";
    }
  }

  function bindEditors() {
    document.querySelectorAll("[data-color]").forEach(function (inp) { inp.addEventListener("input", function () { var v = inp.getAttribute("data-color"); setVar(v, inp.value); var hex = document.querySelector('[data-hex="' + v + '"]'); if (hex) hex.value = inp.value; }); });
    document.querySelectorAll("[data-hex]").forEach(function (inp) { inp.addEventListener("input", function () { var v = inp.getAttribute("data-hex"), val = inp.value.trim(); if (isHex(val)) { var e = expandHex(val); setVar(v, e); var c = document.querySelector('[data-color="' + v + '"]'); if (c) c.value = e; } else if (val) setVar(v, val); }); });
    document.querySelectorAll("[data-text]").forEach(function (inp) { inp.addEventListener(inp.tagName === "SELECT" ? "change" : "input", function () { setVar(inp.getAttribute("data-text"), inp.value); }); if (inp.tagName !== "SELECT") bindScrub(inp); });
    document.querySelectorAll("[data-font]").forEach(function (sel) { sel.addEventListener("change", function () {
      var v = sel.getAttribute("data-font");
      if (sel.value === "__custom__") { var name = (window.prompt("Google Font name (exactly as on fonts.google.com):") || "").trim(); if (name) { if (FONTS.indexOf(name) < 0) FONTS.push(name); loadFont(name); setVar(v, '"' + name + '"'); } render(); return; }
      loadFont(sel.value); setVar(v, '"' + sel.value + '"');
    }); });
  }

  /* ---- Figma-style scrub: drag or scroll over a number field to change it ---- */
  function parseNum(v) { var m = String(v).trim().match(/^(-?\d*\.?\d+)\s*([a-z%]*)$/i); return m ? { num: parseFloat(m[1]), unit: m[2] } : null; }
  function stepFor(u) { u = (u || "").toLowerCase(); if (u === "em" || u === "rem") return 0.01; if (u === "") return 0.1; return 1; }
  function applyScrub(inp, steps) {
    var p = parseNum(inp.value); if (!p) return;
    var s = stepFor(p.unit), nv = parseFloat((Math.round((p.num + steps * s) / s) * s).toFixed(3));
    if (p.unit && p.unit.toLowerCase() !== "em" && p.unit.toLowerCase() !== "rem" && nv < 0) nv = 0;
    var name = inp.getAttribute("data-text"), c = CLAMP[name];
    if (c) { if (nv < c[0]) nv = c[0]; if (nv > c[1]) nv = c[1]; }
    inp.value = nv + p.unit;
    setVar(name, inp.value);
  }
  function bindScrub(inp) {
    inp.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 || !parseNum(inp.value)) return;
      var lastX = e.clientX, moved = false, acc = 0;
      function mv(ev) {
        acc += ev.clientX - lastX; lastX = ev.clientX;
        if (!moved && Math.abs(acc) < 4) return;
        if (!moved) { moved = true; document.body.style.cursor = "ew-resize"; document.body.style.userSelect = "none"; }
        var st = (acc > 0 ? 1 : -1) * Math.floor(Math.abs(acc) / 2);
        if (st) { applyScrub(inp, st); acc -= st * 2; }
      }
      function up() { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); if (moved) { document.body.style.cursor = ""; document.body.style.userSelect = ""; } }
      window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
    });
    inp.addEventListener("wheel", function (e) { if (!parseNum(inp.value)) return; if (document.activeElement !== inp && !inp.matches(":hover")) return; e.preventDefault(); applyScrub(inp, e.deltaY < 0 ? 1 : -1); }, { passive: false });
  }

  function isDark(hex) { if (!isHex(hex)) return false; var h = expandHex(hex).replace("#", ""); var r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16); return (0.299 * r + 0.587 * g + 0.114 * b) < 150; }

  /* ---- generate tokens.css ---- */
  function generate() {
    var pad = function (s) { return (s + "                ").slice(0, 18); };
    var lines = [];
    if (notes.trim()) {
      lines.push("/* === CHANGE REQUESTS — Claude: apply these to the site, then delete this block ===");
      notes.trim().split("\n").forEach(function (l) { lines.push("   " + l.replace(/\*\//g, "* /")); });
      lines.push("=== */"); lines.push("");
    }
    lines.push("/* tokens.css — single source of truth. Edited via the style sheet page. */");
    lines.push(":root {");
    SCHEMA.forEach(function (g) { lines.push("  /* " + g.group + " */"); g.items.forEach(function (it) { lines.push("  " + pad(it[0] + ":") + " " + (values[it[0]] || "") + ";"); }); lines.push(""); });
    if (palette.length) { lines.push("  /* Generated palette */"); palette.forEach(function (sw, i) { lines.push("  " + pad("--c-pal-" + (i + 1) + ":") + " " + sw.hex + ";"); }); lines.push(""); }
    if (lines[lines.length - 1] === "") lines.pop();
    lines.push("}");
    var mk = Object.keys(mobileVals);
    if (mk.length) { lines.push(""); lines.push("/* Mobile overrides */"); lines.push("@media (max-width: 640px) {"); lines.push("  :root {"); mk.forEach(function (k) { lines.push("    " + pad(k + ":") + " " + mobileVals[k] + ";"); }); lines.push("  }"); lines.push("}"); }
    lines.push("");
    return lines.join("\n");
  }

  /* ---- save / export ---- */
  function toast(msg) { var t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2400); }
  function afterSave() { base = clone(values); baseMobile = clone(mobileVals); try { localStorage.removeItem(DRAFT_KEY); } catch (e) {} markSaved(); }
  function download() { var b = new Blob([generate()], { type: "text/css" }); var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "tokens.css"; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000); toast("tokens.css downloaded"); }
  function copyText(text) { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast("Copied " + text); }, fb); else fb(); function fb() { var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); toast("Copied"); } catch (e) {} ta.remove(); } }
  function copyCSS() { copyText(generate()); }
  /* remember the linked file across reloads (IndexedDB) */
  function idb() { return new Promise(function (res, rej) { var r = indexedDB.open("styleguide", 1); r.onupgradeneeded = function () { r.result.createObjectStore("kv"); }; r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); }; }); }
  function idbGet(k) { return idb().then(function (db) { return new Promise(function (res) { var t = db.transaction("kv", "readonly").objectStore("kv").get(k); t.onsuccess = function () { res(t.result || null); }; t.onerror = function () { res(null); }; }); }).catch(function () { return null; }); }
  function idbSet(k, v) { return idb().then(function (db) { return new Promise(function (res) { var t = db.transaction("kv", "readwrite").objectStore("kv").put(v, k); t.onsuccess = function () { res(true); }; t.onerror = function () { res(false); }; }); }).catch(function () { return false; }); }
  function ensurePerm(h) { if (!h.queryPermission) return Promise.resolve(true); return h.queryPermission({ mode: "readwrite" }).then(function (p) { return p === "granted" ? true : h.requestPermission({ mode: "readwrite" }).then(function (q) { return q === "granted"; }); }); }
  function writeHandle(handle, css) {
    return ensurePerm(handle).then(function (ok) { if (!ok) throw new Error("denied"); return handle.createWritable(); })
      .then(function (w) { return w.write(css).then(function () { return w.close(); }); })
      .then(function () { fileHandle = handle; idbSet("fileHandle", handle); afterSave(); toast("Saved to " + (handle.name || "tokens.css")); });
  }
  function saveToFile() {
    var css = generate();
    if (typeof window.showSaveFilePicker !== "function") { download(); return; }
    var pick = function () { return window.showSaveFilePicker({ suggestedName: "tokens.css", types: [{ description: "CSS", accept: { "text/css": [".css"] } }] }).then(function (h) { return writeHandle(h, css); }); };
    if (fileHandle) { writeHandle(fileHandle, css).catch(function () { pick().catch(err); }); } else { pick().catch(err); }
    function err(e) { if (e && e.name === "AbortError") return; toast("Save cancelled — downloading"); download(); }
  }
  function restoreFileHandle() { if (typeof indexedDB === "undefined") return; idbGet("fileHandle").then(function (h) { if (h) { fileHandle = h; updateStatus(); } }); }
  function reset() { if (dirty && !confirm("Discard unsaved changes and revert to the saved tokens?")) return; Object.keys(base).forEach(function (k) { values[k] = base[k]; root.style.setProperty(k, base[k]); }); mobileVals = clone(baseMobile); saveMobile(); try { localStorage.removeItem(DRAFT_KEY); } catch (e) {} markSaved(); render(); applyAllToPreview(); toast("Reverted to saved"); }

  /* ---- presets (one-click shapes & feels) ---- */
  var PRESETS = [
    { label: "Button shape", opts: [
      { name: "Pill", shape: "999px", set: { "--btn-radius": "999px" } },
      { name: "Rounded", shape: "10px", set: { "--btn-radius": "12px" } },
      { name: "Soft", shape: "6px", set: { "--btn-radius": "8px" } },
      { name: "Square", shape: "0", set: { "--btn-radius": "0px" } } ] },
    { label: "Corners", opts: [
      { name: "Sharp", set: { "--radius-sm": "2px", "--radius-md": "4px", "--radius-lg": "8px" } },
      { name: "Soft", set: { "--radius-sm": "8px", "--radius-md": "14px", "--radius-lg": "22px" } },
      { name: "Round", set: { "--radius-sm": "14px", "--radius-md": "22px", "--radius-lg": "32px" } } ] },
    { label: "Shadows", opts: [
      { name: "Flat", set: { "--shadow": "none", "--shadow-lg": "none" } },
      { name: "Subtle", set: { "--shadow": "0 1px 2px rgba(13,40,25,0.06), 0 1px 3px rgba(13,40,25,0.05)", "--shadow-lg": "0 12px 28px rgba(13,40,25,0.10)" } },
      { name: "Elevated", set: { "--shadow": "0 2px 6px rgba(13,40,25,0.08), 0 1px 2px rgba(13,40,25,0.05)", "--shadow-lg": "0 24px 50px rgba(13,40,25,0.18)" } } ] },
    { label: "Line weight", opts: [
      { name: "Hairline", set: { "--bw": "1px", "--bw-thick": "1.5px" } },
      { name: "Standard", set: { "--bw": "1px", "--bw-thick": "2px" } },
      { name: "Bold", set: { "--bw": "2px", "--bw-thick": "3px" } } ] }
  ];
  function renderPresets() {
    var el = document.getElementById("presets"); if (!el) return;
    el.innerHTML = PRESETS.map(function (p, gi) {
      return '<div class="preset-group"><div class="pg-label">' + esc(p.label) + '</div><div class="preset-btns">' + p.opts.map(function (o, oi) {
        var sh = o.shape != null ? '<span class="shape" style="border-radius:' + o.shape + '"></span>' : "";
        return '<button type="button" class="preset-btn" data-preset="' + gi + "-" + oi + '">' + sh + esc(o.name) + "</button>";
      }).join("") + "</div></div>";
    }).join("");
    el.querySelectorAll("[data-preset]").forEach(function (b) {
      b.addEventListener("click", function () {
        var ix = b.getAttribute("data-preset").split("-"), o = PRESETS[+ix[0]].opts[+ix[1]];
        Object.keys(o.set).forEach(function (v) { setVar(v, o.set[v]); });
        render(); toast(PRESETS[+ix[0]].label + ": " + o.name);
      });
    });
  }

  /* ---- live split-screen preview (the real local page in an iframe) ---- */
  var BRIDGE = '<script>\n' +
    "window.addEventListener('message',function(e){var d=e.data;if(!d||d.source!=='studio-styleguide')return;var r=document.documentElement;" +
    "if(d.type==='all'&&d.vars){for(var k in d.vars)r.style.setProperty(k,d.vars[k]);}else if(d.type==='set'){r.style.setProperty(d.name,d.value);}" +
    "if(d.fonts)d.fonts.forEach(function(f){if(!document.querySelector('link[data-f=\"'+f+'\"]')){var l=document.createElement('link');l.rel='stylesheet';l.setAttribute('data-f',f);l.href='https://fonts.googleapis.com/css2?family='+f.replace(/ /g,'+')+':wght@300;400;500;600;700;800&display=swap';document.head.appendChild(l);}});});" +
    '\n</' + 'script>';

  function pvFrame() { return document.getElementById("pv-frame"); }
  function pushFontLink(name) {
    var f = pvFrame(); if (!f) return; name = stripQuotes(name); if (!name) return;
    try { var d = f.contentDocument; if (d && d.head && !d.querySelector('link[data-f="' + name + '"]')) { var l = d.createElement("link"); l.rel = "stylesheet"; l.setAttribute("data-f", name); l.href = "https://fonts.googleapis.com/css2?family=" + name.replace(/ /g, "+") + ":wght@300;400;500;600;700;800&display=swap"; d.head.appendChild(l); } } catch (e) {}
  }
  function applyToPreview(name, val) {
    var f = pvFrame(); if (!f) return;
    try { var d = f.contentDocument; if (d && d.documentElement) d.documentElement.style.setProperty(name, val); } catch (e) {}
    try { f.contentWindow.postMessage({ source: "studio-styleguide", type: "set", name: name, value: val }, "*"); } catch (e) {}
    if (name.indexOf("--font") === 0) { pushFontLink(val); try { f.contentWindow.postMessage({ source: "studio-styleguide", fonts: [stripQuotes(val)] }, "*"); } catch (e) {} }
  }
  function applyAllToPreview() {
    var f = pvFrame(); if (!f) return;
    var fonts = Object.keys(loadedFonts);
    var merged = clone(values);
    if (MODE === "mobile") Object.keys(mobileVals).forEach(function (k) { merged[k] = mobileVals[k]; });
    try { var d = f.contentDocument; if (d && d.documentElement) { Object.keys(merged).forEach(function (k) { d.documentElement.style.setProperty(k, merged[k]); }); } } catch (e) {}
    fonts.forEach(pushFontLink);
    try { f.contentWindow.postMessage({ source: "studio-styleguide", type: "all", vars: merged, fonts: fonts }, "*"); } catch (e) {}
  }
  function initPreview() {
    var f = pvFrame(); if (!f) return;
    f.addEventListener("load", applyAllToPreview);
    var url = document.getElementById("pv-url");
    if (url) url.addEventListener("change", function () { f.src = url.value.trim() || "preview.html"; });
    var reload = document.getElementById("pv-reload");
    if (reload) reload.addEventListener("click", function () { var s = f.getAttribute("src"); f.setAttribute("src", s); });
    document.querySelectorAll("[data-device]").forEach(function (b) {
      b.addEventListener("click", function () {
        document.querySelectorAll("[data-device]").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        var w = b.getAttribute("data-device"); f.style.maxWidth = (w === "full") ? "none" : w + "px";
      });
    });
    var snip = document.getElementById("bridge-snippet"); if (snip) snip.textContent = BRIDGE;
    var cb = document.getElementById("copy-bridge"); if (cb) cb.addEventListener("click", function () { copyText(BRIDGE); });
  }


  /* ---- boot ---- */
  readInitial();
  loadFont(values["--font-heading"]); loadFont(values["--font-body"]);
  loadDraft();
  loadPalette();
  loadMobile();
  loadNotes();
  sanitizeValues();
  render();
  initPreview();
  initNotes();
  restoreFileHandle();
  updateStatus();
  document.getElementById("sg-save").addEventListener("click", saveToFile);
  document.getElementById("sg-download").addEventListener("click", download);
  document.getElementById("sg-copy").addEventListener("click", copyCSS);
  document.getElementById("sg-reset").addEventListener("click", reset);
  document.querySelectorAll("[data-mode]").forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); }); });
  if (Object.keys(mobileVals).length) markDirty();
  window.addEventListener("beforeunload", function (e) { if (dirty) { e.preventDefault(); e.returnValue = ""; } });
})();
