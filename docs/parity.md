---
title: Feature parity
description: Method-by-method feature parity matrix for Cosmo across PHP, JavaScript, Python, Java, and C# — see exactly what each ICU-backed port supports.
---

# Feature parity (PHP vs JS vs Python vs Java vs C#)

!!! note
    This page mirrors `compare.md` in the project root — the authoritative,
    method-by-method matrix maintained alongside the code. For the user-facing
    summary of what works where and why, see [Platform notes](platform-notes.md).

All five libraries are thin, locale-aware wrappers over **ICU**:

- **`cosmo-php`** (`salarmehr/cosmopolitan`, requires `ext-intl`, PHP ≥ 8.4) reaches ICU through PHP's `intl` extension, which exposes ICU **directly** — including raw ICU services like `ResourceBundle` and RBNF.
- **`cosmo-js`** is the TypeScript/ESM port. Hard design rule: **every feature must be backed by the runtime's ICU via the standard `Intl` API — no hardcoded locale/language data tables.** If `Intl` can't produce it, the feature is omitted, not faked.
- **`cosmo-python`** is the Python port (snake_case API), backed by **PyICU** (`import icu`). PyICU binds ICU's C++ API, so it reaches the **raw ICU** PHP can (`ResourceBundle`, RBNF) **and** the modern ICU formatters PHP's `ext-intl` never surfaced (`NumberRangeFormatter` ranges, `DateIntervalFormat`, `RelativeDateTimeFormatter`, likely-subtags). It follows the same **no-hardcoded-data** rule as JS.
- **`cosmo-java`** (`com.miloun:cosmo`, Java ≥ 11) sits on **ICU4J** — the *reference* ICU implementation in Java, maintained by the ICU project itself. Nothing is curated away and nothing is left unbound, so Java is the **most complete port**: it implements the full shared surface with none of PyICU's binding quirks (weekend days ✅, relative-time word forms ✅, full `supportedValues` ✅) **plus** the only truly cross-port-exclusive method, `personName` (§4). The richer extras it pioneered — locale negotiation, transliteration, spoof detection, index buckets, locale-aware parsing — have since landed in the Python and (where `ext-intl` allows) PHP ports too, so they now live in the §1 table. Same **no-hardcoded-data** rule.
- **`cosmo-csharp`** (`Miloun.Cosmo`, .NET 8+, NuGet) wraps **ICU4C** — the canonical C library — via P/Invoke with bundled native ICU 72 binaries. It reaches almost everything Java does through the C API: RBNF (`spellout`/`ordinal`), CLDR delimiters (`quote`), transliteration, spoof detection, locale-aware parsing, likely-subtags, and `formatMoment`. Its four gaps are C-API limits: `AlphabeticIndex` is C++ only (no `indexBuckets`); `LocaleMatcher` is C++ only (no `bestMatch` / negotiating `fromAcceptLanguage`); `PersonNameFormatter` first appeared in ICU 73 C++ (bundled ICU 72, no `personName`); and `uloc_getAvailable` doesn't expose the `unit` key (no `supportedValues("unit")`). Same **no-hardcoded-data** rule.

Because `Intl` is a curated subset of ICU, the JS port *cannot* expose some raw-ICU features (RBNF spellout/ordinal text, CLDR delimiters, `ResourceBundle`). PHP's `intl` extension, conversely, does **not** bind several newer ICU formatters (`RelativeDateTimeFormatter`, `DateIntervalFormat`, `NumberRangeFormatter`, locale maximize/minimize); PHP reconstructs most of these from CLDR `ResourceBundle` data instead (`relativeDuration`, `numberRange`/`moneyRange`, and `dateRange` for short/medium — §1, §2), leaving only likely-subtags and the locale-matcher/index family genuinely blocked. **Python (PyICU) is blocked by almost nothing** — three binding-level quirks remain (§2). **Java (ICU4J) is blocked by nothing at all.** **C# (ICU4C) is blocked by four C-API surface gaps** (see above), otherwise matching Java's capability.

> **What "parity" means here:** the ports behave like the same library in five languages — same method **name** (modulo PHP/JS/Java camelCase vs Python snake_case vs C# PascalCase), same **signature** (params, order, accepted values), and same **observable output** for the same input. It does *not* require the same implementation: JS goes through `Intl`, PHP through `ext-intl`/raw ICU, Python through PyICU's C++ bindings, Java through ICU4J's native classes, C# through ICU4C P/Invoke — and sometimes the same result is reached by different doors. Where a runtime *cannot* produce a result, the feature is **omitted, not faked** — that is the only sanctioned way to diverge.

> **Naming & types per port.** The table uses the canonical camelCase names; Python uses the snake_case equivalent (`splitWords`→`split_words`, `weekInfo`→`week_info`, …); C# uses PascalCase (`splitWords`→`SplitWords`, …). The `Moment` argument is a `datetime`/`date`/POSIX-**seconds** value in Python, Unix **milliseconds** in JS, a `java.util.Date` (or `java.time.Instant`) in Java, and a `DateTimeOffset` in C#. Java has no keyword/optional arguments, so optional parameters become **overloads**; C# uses optional parameters and named arguments. The options bags are `Map<String, Object>` (Java) / `camelCase` dicts (PHP/Python/JS) / typed objects with PascalCase properties (C#, e.g. `new NumberOptions { MinimumFractionDigits = 2 }`).

---

## 1. Implemented features — side by side

Legend: ✅ implemented · ❌ not present (platform-blocked) · ⚠️ partial / different shape

| Feature | ICU / Intl backing | PHP | JS | Py | Java | C# | Notes |
|---|---|:--:|:--:|:--:|:--:|:--:|---|
| **Locale metadata** |
| `language(code)` | `Locale::getDisplayLanguage` | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `country(code)` | `Locale::getDisplayRegion` | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `script(code)` | CLDR `Scripts` table | ✅ | ✅ | ✅ | ✅ | ✅ | all five return the **contextual** name ("Simplified"); ICU4J only exposes that table via the deprecated `getDisplayScriptInContext` |
| `calendar(code)` | calendar display name | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `direction(lang)` | script-based RTL detection | ✅ | ✅ | ✅ | ✅ | ✅ | likely-subtags → script → RTL in all five; Java is a one-liner: `ULocale.isRightToLeft()` |
| `flag(country)` | region → emoji flag | ✅ | ✅ | ✅ | ✅ | ✅ | pure codepoint math, no data table |
| `currency(code, …)` | `Locale`/`NumberFormatter` currency | ✅ | ⚠️ | ✅ | ✅ | ✅ | JS needs an **explicit** code (no region→currency inference); PHP, Py, Java & C# infer from region |
| `fromSubtags(subtags)` | build locale from parts | ✅ | ✅ | ✅ | ✅ | ✅ | PHP `Locale::composeLocale`; Py/Java `LocaleBuilder`/`ULocale.Builder`; C# `uloc_` string builder |
| `fromAcceptLanguage(header)` | locale negotiation | ✅ | ✅ | ✅ | ✅ | ✅ | PHP `Locale::acceptFromHttp`; JS/Py/Java/C# hand-parse the header; **Java adds a CLDR-negotiating overload** against a supported-locales list (§4) |
| `displayName(type, code)` | `Intl.DisplayNames` / dedicated lookups | ✅ | ✅ | ✅ | ✅ | ✅ | generic entry point over language/region/script/calendar/currency |
| **Numbers** |
| `number(value)` | `NumberFormatter::DECIMAL` | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `precision(value, fractionDigits?)` | decimal w/ min=max fraction digits | ✅ | ✅ | ✅ | ✅ | ✅ | always exactly N fraction digits (default 2; `1`→`"1.00"`, `1.002`→`"1.00"`) |
| `percentage(value, precision)` | `NumberFormatter::PERCENT` | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `money(value, …)` | `NumberFormatter::CURRENCY` | ✅ | ⚠️ | ✅ | ✅ | ✅ | JS requires explicit currency code/modifier; PHP, Py, Java & C# infer from region |
| number rounding/grouping options | `NumberFormat` rounding attrs / `Intl.NumberFormat` opts | ✅ | ✅ | ✅ | ✅ | ✅ | optional `roundingMode`/`roundingIncrement`/`min`·`maxFractionDigits`/`useGrouping`; portable set in all five (halfExpand default); C# uses PascalCase typed `NumberOptions` |
| `symbol(name)` | named symbol lookup | ✅ | ⚠️ | ✅ | ✅ | ✅ | PHP, Py, Java & C# accept a superset of names; JS exposes only the `Intl`-reachable set |
| `unit(category, unit, value, width)` | `MeasureFormat` / `Intl.NumberFormat unit` | ✅ | ✅ | ✅ | ✅ | ✅ | Py/Java use `MeasureFormat`; C# uses `unum_formatDecimal` with unit skeleton |
| `scientific(value)` | `NumberFormatter::SCIENTIFIC` | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `compact(value, width)` | compact/short notation | ✅ | ✅ | ✅ | ✅ | ✅ | PHP uses `NumberFormatter` style 14/15; C# uses ICU4C compact notation |
| `ordinal(number)` → "1st" | **RBNF** (`SPELLOUT`/ordinal) | ✅ | ❌ | ✅ | ✅ | ✅ | **JS-blocked** (RBNF not in `Intl`) |
| `spellout(number)` → "one hundred" | **RBNF** | ✅ | ❌ | ✅ | ✅ | ✅ | **JS-blocked** (RBNF not in `Intl`) |
| **Dates & times** |
| `moment(value, …)` | `IntlDateFormatter` | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `date(value, width)` | date-only | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `time(value, width)` | time-only | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `formatMoment(value, pattern)` | arbitrary ICU date **pattern** | ✅ | ❌ | ✅ | ✅ | ✅ | **JS-blocked** (`Intl` has no raw pattern API) |
| `duration(seconds, withWords)` | duration formatting | ✅ | ✅ | ✅ | ✅ | ✅ | JS via `Intl.DurationFormat` (Node 22+); PHP, Py, Java & C# via RBNF `DURATION` (+`%with-words`) |
| `duration(parts, …)` — multi-unit | `Intl.DurationFormat` / `MeasureFormat` | ✅ | ✅ | ✅ | ✅ | ✅ | a unit breakdown (`{hours, minutes, …}`) → "3 hours, 5 minutes"; C# accepts `Dictionary<string, double>` |
| `timeZoneName(style)` | `timeZoneName` field | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `dateRange(start, end, …)` | `DateTimeFormat.formatRange` | ⚠️ | ✅ | ✅ | ✅ | ✅ | PHP has no `DateIntervalFormat` binding (CLDR `ResourceBundle` fallback, short/medium only). C# uses `udtitvfmt_` C API — all widths supported |
| **Collation & text segmentation** |
| `compare(a, b)` | `Collator::compare` | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `sort(items, key?)` | `Collator` + sort | ✅ | ✅ | ✅ | ✅ | ✅ | C# accepts `IList<T>` + optional `Func<T,string>` key |
| `contains(haystack, needle, …)` | `Collator` + grapheme window | ✅ | ✅ | ✅ | ✅ | ✅ | |
| collation tailoring (`numeric`, `caseFirst`) | `Collator` attributes | ✅ | ✅ | ✅ | ✅ | ✅ | C# uses `CollationOptions { Numeric, CaseFirst }` (PascalCase typed options) |
| `splitWords(text)` | word `BreakIterator` / `Segmenter` | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `splitSentences(text)` | sentence `BreakIterator` / `Segmenter` | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `splitGraphemes(text)` | grapheme `BreakIterator` / `Segmenter` | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `ellipsize(text, max, …)` | grapheme-safe truncation | ✅ | ✅ | ✅ | ✅ | ✅ | |
| `upper(text)` / `lower(text)` | locale case mapping | ✅ | ✅ | ✅ | ✅ | ✅ | C# via ICU4C `u_strToUpper`/`u_strToLower` with locale |
| **Messages & plurals** |
| `message(pattern, args)` | ICU MessageFormat | ✅ | ⚠️ | ✅ | ✅ | ✅ | JS = hand-written subset; PHP, Py & Java use full ICU `MessageFormat`; C# uses a faithful hand-written parser backed by ICU plural rules and number formatting |
| `pluralCategory(value, ordinal?)` | `PluralRules::select` | ✅ | ✅ | ✅ | ✅ | ✅ | JS uses `Intl.PluralRules`; Java uses real ordinal `PluralRules`; C# via `uplrules_` C API |
| `join(items, type, width)` | `ListFormatter` / `Intl.ListFormat` | ✅ | ✅ | ✅ | ✅ | ✅ | PHP assembles from CLDR `listPattern`; C# via `ulistfmt_` C API |
| `quote(text)` | CLDR delimiter data | ✅ | ❌ | ✅ | ✅ | ✅ | **JS-blocked** (CLDR delimiters not in `Intl`); PHP, Py, Java & C# read from ICU resource data |
| **Relative / range / likely-subtags** |
| `relativeDuration(value, unit, …)` | `Intl.RelativeTimeFormat` / `RelativeDateTimeFormatter` | ✅ | ✅ | ⚠️ | ✅ | ✅ | Py: `numeric:"auto"` isn't cleanly reachable → always numeric. PHP, Java & C# support `auto` word-forms ("yesterday") |
| `relativeDurationBetween(target, ref?)` | same | ✅ | ✅ | ✅ | ✅ | ✅ | single-unit only; C# computes diff → picks unit → formats |
| `numberRange(start, end)` | `NumberFormat.formatRange` | ✅ | ✅ | ✅ | ✅ | ✅ | PHP fills the CLDR `range` pattern; C# via `unumrf_` C API |
| `moneyRange(start, end, code?)` | `NumberFormat.formatRange` | ⚠️ | ✅ | ✅ | ✅ | ✅ | PHP is approximate (no symbol collapsing); C# is full fidelity |
| `addLikelySubtags()` / `removeLikelySubtags()` | `Intl.Locale.maximize`/`minimize` | ❌ | ✅ | ✅ | ✅ | ✅ | **PHP-blocked** (absent on 8.4.21 / ICU 70.1); C# via `uloc_addLikelySubtags` |
| **Calendar metadata** |
| `monthNames(width)` / `weekdayNames(width)` | calendar symbols | ✅ | ✅ | ✅ | ✅ | ✅ | calendar-aware; weekdays Sunday-first |
| `weekInfo()` | `Intl.Locale.getWeekInfo` / week data | ✅ | ✅ | ⚠️ | ✅ | ✅ | **Py omits `weekend`** (PyICU binds no weekend API); PHP, Java & C# include weekend days |
| `supportedValues(key)` | `Intl.supportedValuesOf` / ICU enumerations | ⚠️ | ✅ | ⚠️ | ✅ | ⚠️ | **JS:** all 6 keys. **Java:** all 6 + `transliterator`. **Py:** `timeZone`/`collation`/`numberingSystem`/`unit`/`transliterator`. **PHP:** `timeZone`/`currency`/`transliterator`. **C#:** `calendar`/`collation`/`currency`/`numberingSystem`/`timeZone`/`transliterator` (not `unit` — absent from ICU C API) |
| **Transliteration & spoof detection** |
| `transliterate(text, id)` / `romanize(text)` | `Transliterator` | ✅ | ❌ | ✅ | ✅ | ✅ | **JS-blocked** (`Intl` exposes no `Transliterator`); C# via `utrans_` C API |
| `confusable(a, b)` / `suspicious(text)` | `SpoofChecker` (UTS #39) | ✅ | ❌ | ✅ | ✅ | ✅ | **JS-blocked** (no `SpoofChecker` in `Intl`); C# via `uspoof_` C API |
| **Locale-aware parsing** (inverse formatters) |
| `parseNumber(text)` | `NumberFormat::parse` | ✅ | ❌ | ✅ | ✅ | ✅ | **JS-blocked** — `Intl` cannot parse at all |
| `parseMoney(text)` → amount + currency | `NumberFormat::parseCurrency` | ✅ | ❌ | ✅ | ✅ | ✅ | **JS-blocked**; C# returns a `(double, string)` tuple |
| `parseDate(text, width)` / `parseMoment(text, pattern)` | `DateFormat::parse` | ✅ | ❌ | ✅ | ✅ | ✅ | **JS-blocked**; C# returns `DateTimeOffset` |
| **Locale negotiation & indexing** |
| `bestMatch(supported)` + negotiating `fromAcceptLanguage(header, supported)` | `LocaleMatcher` (CLDR distance) | ❌ | ❌ | ✅ | ✅ | ❌ | **PHP-, JS- & C#-blocked** (`LocaleMatcher` is C++ only — no C API) |
| `indexBuckets(names)` | `AlphabeticIndex` | ❌ | ❌ | ✅ | ✅ | ❌ | **PHP-, JS- & C#-blocked** (`AlphabeticIndex` is C++ only — no C API) |
| `personName(fields, …)` | `PersonNameFormatter` (ICU 73+) | ❌ | ❌ | ❌ | ✅ | ❌ | **Java-only across all five ports** — C# bundles ICU 72; see §4 |
| **Raw ICU services** |
| `get(bundle, …path)` | ICU `ResourceBundle` | ✅ | ❌ | ✅ | ✅ | ❌ | **JS- & C#-blocked** (no `ResourceBundle` in `Intl` or C API); Java's `Bundle` constants come from ICU4J's `ICUData` |

---

## 2. What each runtime can / can't reach

**Java (ICU4J) is blocked on nothing.** ICU4J *is* ICU, so every shared method is implemented at full fidelity, and each of Python's three binding quirks disappears:

- `weekInfo()` includes the **weekend days** (`Calendar.getWeekDataForRegion` — the API PyICU doesn't bind).
- `relativeDuration(…, "auto")` produces the real **word forms** (`"yesterday"`, `"last week"`).
- `supportedValues()` enumerates **all six** cross-port keys, plus `transliterator`.

Two ICU4J wrinkles are implementation detail, not capability gaps (both documented in the source): the contextual script name and the RBNF duration ruleset are only reachable through APIs ICU marks deprecated, so the port suppresses those two warnings deliberately; and ICU4J's `ULocale.createCanonical(String)` mangles BCP-47 `-u-` extensions (the constructor parses with `new ULocale()` first to keep `-u-nu-thai` working).

**Python (PyICU) is blocked on essentially nothing.** It binds both the raw-ICU services PHP uses *and* the modern ICU formatters PHP lacks — including everything Java pioneered except `personName` (PyICU exposes `LocaleMatcher`, `SpoofChecker`, `Transliterator`, `AlphabeticIndex`, and the parsing methods, so `best_match`, `transliterate`/`romanize`, `confusable`/`suspicious`, `index_buckets`, and `parse_*` are all implemented). Its only gaps are three binding-level quirks, documented in the Python README:

- **`week_info()` omits the weekend days.** PyICU 2.16 does not bind `Calendar::getDayOfWeekType` (or `isWeekend`); with no hardcoded fallback allowed, `week_info()` returns `first_day` + `minimal_days` only.
- **`relative_duration(numeric="auto")` falls back to the numeric form** (`"1 day ago"`, not `"yesterday"`).
- **`supported_values()` covers `timeZone`/`collation`/`numberingSystem`/`unit`/`transliterator`** but not `currency`/`calendar`.

**PHP** reached parity in **v3** on every shared method `ext-intl` surfaces, and `ext-intl` *does* bind `Transliterator`, `Spoofchecker`, and the `parse*` formatters — so `transliterate`/`romanize`, `confusable`/`suspicious`, and `parseNumber`/`parseMoney`/`parseDate`/`parseMoment` are all implemented in PHP too. Several methods whose ICU formatter `ext-intl` does *not* bind are nonetheless implemented by **reconstructing from CLDR `ResourceBundle` data** (no hardcoded tables): `dateRange` (from `intervalFormats`, short/medium only — §1), `relativeDuration`/`relativeDurationBetween` (from `fields`, with full `auto` word-form support), and `numberRange`/`moneyRange` (from the `range` pattern; `moneyRange` is approximate — no symbol collapsing). **Still blocked in PHP** (no `ext-intl` API and not cleanly reconstructable — all *are* available in Python and Java):

- `addLikelySubtags` / `removeLikelySubtags` — `Locale::addLikelySubtags` / `Locale::minimizeSubtags` are not implemented in PHP, and the supplemental likely-subtags table isn't cleanly exposed.
- `bestMatch` / negotiating `fromAcceptLanguage` / `indexBuckets` — `LocaleMatcher` and `AlphabeticIndex` are not bound by `ext-intl` (`Locale::lookup` offers only RFC-4647 prefix matching, not CLDR language-distance).

**C# (ICU4C) has four C-API surface gaps** compared to Java, but otherwise matches Java's capability:

- `bestMatch` / negotiating `fromAcceptLanguage` — `LocaleMatcher` is C++ only; the C API exposes no equivalent.
- `indexBuckets` — `AlphabeticIndex` is C++ only.
- `personName` — `PersonNameFormatter` was added in ICU 73 C++; C# bundles ICU 72.
- `supportedValues("unit")` — `uloc_getAvailable` doesn't enumerate CLDR measure units; throws `CosmoUnsupportedException`.
- `get()` ResourceBundle — ICU4C's `ures_` API is not exposed through the Cosmo wrapper (no client demand; the CLDR data Cosmo needs is fetched through the dedicated formatters).

> Implementation gotchas worth remembering, all ICU resource subtleties: **(1) `join`** (PHP) — ICU resource fallback does *not* merge partial sub-table overrides, so each piece must be looked up through the full locale→language→root fallback path (Py/Java sidestep this with native `ListFormatter`). **(2) `monthNames`** — the month names must follow the locale's *resolved* calendar (`fa_IR` → Persian), or non-Gregorian calendars come out rotated. **(3) `script`** (Java) — see §2 above: the contextual `Scripts` table hides behind a deprecated ICU4J entry point.

---

## 3. ICU features that can still be ADDED to **JS**

The JS port is gated by what `Intl` exposes. Genuinely **blocked** (raw-ICU, no `Intl` equivalent — *intentionally* dropped, not TODOs; all of these are available in PHP and/or Python **and Java**):

- `spellout()` / numeric `ordinal()` text ("1st") — needs **RBNF**.
- `quote()` — needs CLDR **delimiter** data.
- `get()` ResourceBundle access — no `Intl` equivalent.
- arbitrary ICU **date patterns** (`formatMoment`) — `Intl.DateTimeFormat` only takes option bags, not skeletons/patterns.
- region → currency **inference** for `money()`/`currency()` — would require a bundled mapping table.
- `transliterate()` / `romanize()` — needs `Transliterator` (not in `Intl`).
- `confusable()` / `suspicious()` — needs `SpoofChecker` (not in `Intl`).
- `parseNumber()` / `parseMoney()` / `parseDate()` / `parseMoment()` — **`Intl` is format-only; it cannot parse.**
- `bestMatch()` / negotiating `fromAcceptLanguage()` — needs `LocaleMatcher` (not in `Intl`).
- `indexBuckets()` — needs `AlphabeticIndex` (not in `Intl`).

The data-free `Intl` conveniences that were once "could add" have all **shipped (JS v1.1.0)** and exist in every port (see §1). The only remaining data-free candidate is `Temporal` (calendar conversion/fields), still `undefined` in Node 24 — deferred until it ships cross-runtime. Everything else above is permanently out of scope: `Intl` is a *formatting* API with no parser, no transform engine, no resource access.

---

## 4. The one Java-only method: `personName`

Most of the methods Java first pioneered on ICU4J have since been ported wherever the platform's ICU binding allows (see the bottom four sections of the §1 table): `transliterate`/`romanize`, `confusable`/`suspicious`, and the `parse*` family reached **PHP, Python, Java, and C#** (JS-blocked — `Intl` has no transform/spoof/parse APIs); `bestMatch`/negotiating `fromAcceptLanguage` and `indexBuckets` reached **Python and Java** (PHP-, JS- & C#-blocked — neither `LocaleMatcher` nor `AlphabeticIndex` is in the ICU C API).

That leaves exactly one method **no other port can reach**:

| Method | ICU backing | PHP | JS | Py | Java | C# | Notes |
|---|---|:--:|:--:|:--:|:--:|:--:|---|
| `personName(fields, length, formality)` | `PersonNameFormatter` (ICU 73+ CLDR person-name data) | ❌ | ❌ | ❌ | ✅ | ❌ | surname-first locales (ja/zh/hu), locale-correct initials & spacing, formality variants. JS has only a TC39 proposal; `ext-intl` doesn't bind it; PyICU 2.16 doesn't expose `PersonNameFormatter`; C# bundles ICU 72 which predates the formatter. ICU still labels the API a **technology preview** — the port's method surface stays stable regardless |

(MessageFormat 2 — `com.ibm.icu.message2` — is also ICU4J-only but deliberately **not** wrapped while ICU still marks it a technology preview with an unsettled syntax.)

---

## 5. Summary

- **Java (ICU4J) is the most complete port** — a strict superset of all others: every shared method at full fidelity (weekend days, `auto` word forms, full `supportedValues`), plus the one cross-port-exclusive method `personName` (§4).
- **C# (ICU4C)** is a near-Java equal — everything Java supports through the shared surface except the four C-API gaps: `indexBuckets`, negotiating `bestMatch`/`fromAcceptLanguage`, `personName`, `supportedValues("unit")`, and `get()`. It is a **strict superset of Python and PHP** on the shared surface, matching Java on all other methods.
- **Python (PyICU)** is now nearly Java's and C#'s equal — the **union of PHP and JS** plus the LocaleMatcher / SpoofChecker / Transliterator / AlphabeticIndex / parsing methods — short only of `personName` and the three documented binding quirks (§2).
- **PHP** adopted every newly-shared method `ext-intl` can back (`transliterate`/`romanize`, `confusable`/`suspicious`, the `parse*` family), and is otherwise at **parity with JS on every shared method both runtimes can back with ICU** (as of **PHP v3 / JS v1.1.0**); their remaining differences are platform-blocked in opposite directions:
  - **PHP-only** (JS can't reach raw ICU): `spellout`, numeric `ordinal` text, `quote`, `get`, `formatMoment`, region→currency inference.
  - **JS-only** (PHP's `intl` exposes no equivalent and CLDR reconstruction isn't clean): `addLikelySubtags`/`removeLikelySubtags`. (`relativeDuration`/`relativeDurationBetween` and `numberRange`/`moneyRange` were once here but PHP now reconstructs them from CLDR data — §2.)
- **JS** is the most constrained: `Intl` is a formatting API with no parser, transform engine, spoof checker, locale matcher, or resource access — so the §3 list is permanently out of scope, not a backlog.
- None of these sets is a backlog — each is the cost of the platform's ICU surface. Python and C# barely pay it; Java doesn't pay it at all.

---

## 6. Common-function consistency (PHP **v3** / Python / Java) — status

> `cosmo-php` is a **released** library, so the breaking renames below were batched into the major **v3** bump, each keeping the old name as a `#[\Deprecated]` alias. This section covers only the **common functions**; the raw-ICU methods (`get`, `quote`, `spellout`, `ordinal`, `formatMoment`) are out of scope — though Python and Java implement all of them too.

All of the planned alignments below **shipped in v3**, and **Python and Java were built to the same target shape from the start** (Python in snake_case; Java in camelCase with overloads standing in for optional parameters):

| # | Area | Target shape (JS) | PHP before | Status in PHP v3 | Python | Java | C# |
|---|---|---|---|---|---|---|---|
| A | **Static factories** | `fromSubtags()`, `fromAcceptLanguage()` | `createFromSubtags()`, `createFromHttp()` | ✅ renamed; old names deprecated aliases | ✅ `from_subtags()` / `from_accept_language()` | ✅ same names (+ negotiating overload, §4) | ✅ `FromSubtags()` / `FromAcceptLanguage()` (PascalCase) |
| B | **`unit()` param names** | `unit(category, unit, value, width)` | `unit($unit, $scale, $value, $type)` | ✅ renamed | ✅ | ✅ | ✅ `Unit(category, unit, value, width)` |
| C | **Width param naming** | `dateWidth` / `timeWidth` / `width` | `$dateType` / `$timeType` / `$type` | ✅ renamed | ✅ | ✅ | ✅ |
| D | **Width aliases** | none/short/medium/long/full only | also accepted `n/s/m/l/f` | ✅ aliases dropped | ✅ | ✅ | ✅ |
| E | **timezone modifier key** | `modifiers.timeZone` (camelCase) | `modifiers['timezone']` | ✅ canonical + alias | ✅ canonical + alias | ✅ `Modifiers` field is `timeZone` (typed class — no alias needed) | ✅ `new Modifiers(timeZone: "…")` |
| F | **`money()` signature** | `money(value, code?, {precision?, strict?})` | `money($value, $currency, $pattern, $precision, $strict)` | ✅ reordered | ✅ `money(value, code?, precision?, strict?)` | ✅ overloads `money(v)`…`money(v, code, precision, strict, options)` | ✅ `Money(value, code?, precision?, strict?)` optional params |
| G | **`message()` args** | `message(pattern, args = {})` | `message($message, array $args)` (required) | ✅ default added | ✅ dict or list | ✅ `Map` (named) or varargs (positional) overloads | ✅ `Dictionary<string,object?>` (named) or `params object?[]` (positional) |
| H | **`currency()` symbol style** | standard disambiguated symbol (`"A$"`) | standard symbol (`get(0)`) | ✅ | ✅ | ✅ `Currency.SYMBOL_NAME` | ✅ |

**Still a deliberate, documented divergence:**

- **I — `symbol()` accepted names.** PHP, Python, Java **and C#** keep the superset (any `DecimalFormatSymbols` name); JS exposes only the small `Intl`-reachable set. The JS names resolve to the same symbols everywhere, so portable code works.
- **Region → currency inference.** PHP, Python, Java **and C#** auto-fill the `currency` modifier from the locale's region (ICU-backed, not a table); JS deliberately does not, because `Intl` exposes no such API. Cross-port callers should know `money()` with no code is a no-op in JS.
- **Options bag shape.** PHP/JS/Python/Java use `camelCase` string-keyed dicts/maps. C# uses typed classes (`NumberOptions`, `CollationOptions`) with PascalCase property names — the same logical options, different .NET-idiomatic shape.

### Already consistent (no change needed)

`language`, `country`, `script`, `calendar`, `direction`, `flag`, `number`, `percentage`, `duration` (seconds in, `withWords` flag), and the width→display mapping for units (`short`→narrow, `medium`→short, `long`/`full`→long) all match in signature and behaviour across all five ports. The `Sentinel::Unset` (PHP) / default-arg (JS/Py/C#) / overload (Java) pattern for the locale-lookup methods is an internal detail — the observable behaviour (`method()` → instance locale, `method(null)`/`method("")` → `""`) is the same everywhere.
