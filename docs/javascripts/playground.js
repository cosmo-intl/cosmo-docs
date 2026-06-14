// Live playground for the Playground page. Runs the real cosmopolitan-js
// (vendored under ./cosmopolitan/) entirely in the browser — it's built on Intl,
// so the reader's own ICU produces the results. No-ops on every other page.
import { Cosmo } from "./cosmopolitan/index.js";

// A few representative locales for the quick-pick; the text box accepts any BCP-47 tag.
const LOCALES = [
  ["en-US", "English (US)"],
  ["en-GB", "English (UK)"],
  ["en-AU", "English (Australia)"],
  ["de-DE", "German"],
  ["fr-FR", "French"],
  ["es-ES", "Spanish"],
  ["pt-BR", "Portuguese (Brazil)"],
  ["it-IT", "Italian"],
  ["ru-RU", "Russian"],
  ["tr-TR", "Turkish"],
  ["sv-SE", "Swedish"],
  ["ar-EG", "Arabic (Egypt)"],
  ["fa-IR", "Persian (Iran)"],
  ["hi-IN", "Hindi"],
  ["zh-CN", "Chinese (Simplified)"],
  ["ja-JP", "Japanese"],
  ["ko-KR", "Korean"],
];

// Stable sample moment so date/time rows don't drift between renders.
const SAMPLE = new Date("2020-02-02T09:25:30Z");

// Each row: a label, the call as written, and a function returning the result.
// `ctx` carries the live inputs (currency code, etc.). Everything is wrapped in
// try/catch at render time, so a missing/unsupported method never breaks the page.
const GROUPS = [
  ["Locale metadata", [
    ["language('en')", (c) => c.language("en")],
    ["country()", (c) => c.country() || "—"],
    ["script('Latn')", (c) => c.script("Latn")],
    ["flag()", (c) => c.flag() || "—"],
    ["direction()", (c) => c.direction()],
    ["currency(code)", (c, x) => c.currency(x.currency)],
  ]],
  ["Numbers & money", [
    ["number(123400.5)", (c) => c.number(123400.5)],
    ["percentage(0.2)", (c) => c.percentage(0.2)],
    ["money(12.3, code)", (c, x) => c.money(12.3, x.currency)],
    ["scientific(12345)", (c) => c.scientific(12345)],
    ["compact(1200)", (c) => c.compact(1200)],
    ["unit('digital','gigabyte',2.19)", (c) => c.unit("digital", "gigabyte", 2.19)],
    ["numberRange(3, 5)", (c) => c.numberRange(3, 5)],
  ]],
  ["Dates & times", [
    ["date(d, 'full')", (c) => c.date(SAMPLE, "full")],
    ["time(d, 'medium')", (c) => c.time(SAMPLE, "medium")],
    ["moment(d)", (c) => c.moment(SAMPLE)],
    ["duration(1222060)", (c) => c.duration(1222060)],
    ["relativeDuration(-3, 'day')", (c) => c.relativeDuration(-3, "day")],
    ["timeZoneName()", (c) => c.timeZoneName()],
    ["monthNames()[0]", (c) => c.monthNames()[0]],
    ["weekdayNames()[0]", (c) => c.weekdayNames()[0]],
  ]],
  ["Collation, text & lists", [
    ["upper('istanbul')", (c) => c.upper("istanbul")],
    ["lower('HELLO')", (c) => c.lower("HELLO")],
    ["ellipsize('The quick brown fox', 12)", (c) => c.ellipsize("The quick brown fox", 12)],
    ["pluralCategory(2)", (c) => String(c.pluralCategory(2))],
    ["join(['Mon','Tue','Wed'])", (c) => c.join(["Mon", "Tue", "Wed"])],
  ]],
];

function init(root) {
  root.innerHTML = `
    <div class="cp-controls">
      <label>Locale
        <input id="cp-locale" type="text" value="fa-IR" spellcheck="false" autocomplete="off">
      </label>
      <label>Quick-pick
        <select id="cp-pick"></select>
      </label>
      <label>Time zone
        <input id="cp-tz" type="text" value="Asia/Tehran" spellcheck="false" autocomplete="off">
      </label>
      <label>Currency
        <input id="cp-ccy" type="text" value="EUR" spellcheck="false" autocomplete="off" size="6">
      </label>
    </div>
    <p id="cp-status" class="cp-status"></p>
    <div id="cp-results"></div>
  `;

  const pick = root.querySelector("#cp-pick");
  for (const [tag, name] of LOCALES) {
    const opt = document.createElement("option");
    opt.value = tag;
    opt.textContent = `${name} — ${tag}`;
    if (tag === "fa-IR") opt.selected = true;
    pick.appendChild(opt);
  }

  const localeInput = root.querySelector("#cp-locale");
  const tzInput = root.querySelector("#cp-tz");
  const ccyInput = root.querySelector("#cp-ccy");

  pick.addEventListener("change", () => { localeInput.value = pick.value; render(); });
  for (const el of [localeInput, tzInput, ccyInput]) el.addEventListener("input", render);

  render();

  function render() {
    const locale = localeInput.value.trim() || "en";
    const timeZone = tzInput.value.trim() || undefined;
    const currency = (ccyInput.value.trim() || "EUR").toUpperCase();
    const status = root.querySelector("#cp-status");
    const results = root.querySelector("#cp-results");

    let c;
    try {
      c = new Cosmo(locale, { timeZone });
      status.textContent = `Cosmo("${c.locale}"${timeZone ? `, { timeZone: "${timeZone}" }` : ""}) — results from your browser's ICU`;
      status.classList.remove("cp-error");
    } catch (e) {
      status.textContent = `Invalid locale "${locale}": ${e.message}`;
      status.classList.add("cp-error");
      return;
    }

    const ctx = { currency };
    let html = "";
    for (const [group, rows] of GROUPS) {
      html += `<table class="cp-table"><thead><tr><th colspan="2">${group}</th></tr></thead><tbody>`;
      for (const [call, fn] of rows) {
        let value, cls = "";
        try {
          value = fn(c, ctx);
        } catch (e) {
          value = e.message;
          cls = "cp-na";
        }
        html += `<tr><td class="cp-call"><code>${esc(call)}</code></td><td class="cp-val ${cls}">${esc(String(value))}</td></tr>`;
      }
      html += "</tbody></table>";
    }
    results.innerHTML = html;
  }
}

function esc(s) {
  return s.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
}

// Mount once everything above is initialised (LOCALES/GROUPS are `const`s, so the
// call must come after their declarations, not at the top of the module).
// No-ops on every page that lacks the playground mount point.
const root = document.getElementById("cosmo-playground");
if (root) init(root);
