---
title: Feature parity
description: Method-by-method feature parity matrix for Cosmo across PHP, JavaScript, Python, Java, and C# — see exactly what each ICU-backed port supports.
---

# Feature parity (PHP vs JS vs Python vs Java vs C#)

This page lists method support across the five ports. For a shorter explanation
of the differences, see [Platform notes](platform-notes.md).

| Port | Package | ICU access |
|---|---|---|
| PHP | `salarmehr/cosmopolitan` (PHP 8.4+) | `ext-intl`, including `ResourceBundle` and RBNF |
| JavaScript | `@miloun/cosmo` | the runtime's standard `Intl` API |
| Python | `cosmo-intl` | PyICU bindings to ICU's C++ API |
| Java | `com.miloun:cosmo` (Java 11+) | ICU4J |
| C# | `Miloun.Cosmo` (.NET 8+) | ICU4C via P/Invoke, with bundled ICU 72 binaries |

All ports use ICU locale data rather than hardcoded tables. PHP assembles some
results from `ResourceBundle` data when `ext-intl` lacks a dedicated formatter.

Shared methods aim to accept equivalent inputs and produce equivalent results.
Naming follows each language's conventions, and parameter types vary by runtime.
The tables below note unsupported methods and differences in behaviour.

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
| `duration(seconds, withWords)` | duration formatting | ✅ | ✅ | ✅ | ✅ | ✅ | JS via `Intl.DurationFormat` (Node 23.0.0+); PHP, Py, Java & C# via RBNF `DURATION` (+`%with-words`) |
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
| `message(pattern, args)` | ICU MessageFormat | ✅ | ⚠️ | ✅ | ✅ | ✅ | JS = hand-written subset; PHP, Py & Java use full ICU `MessageFormat`; C# uses a custom parser backed by ICU plural rules and number formatting |
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
| `get(bundle, …path)` | ICU `ResourceBundle` | ✅ | ❌ | ✅ | ✅ | ❌ | **JS:** no resource access in `Intl`. **C#:** wrapper does not expose raw resource access; Java's `Bundle` constants come from ICU4J's `ICUData` |

---

## 2. What each runtime can / can't reach

**Java (ICU4J)** supports all shared methods, including the following features
that have limited support in Python:

- `weekInfo()` includes the **weekend days** (`Calendar.getWeekDataForRegion` — the API PyICU doesn't bind).
- `relativeDuration(…, "auto")` produces **word forms** (`"yesterday"`, `"last week"`).
- `supportedValues()` enumerates **all six** cross-port keys, plus `transliterator`.

The Java implementation uses deprecated ICU4J APIs for contextual script names
and RBNF duration rules. It also parses locale tags with `new ULocale()` before
canonicalising them to preserve BCP-47 `-u-` extensions such as `-u-nu-thai`.

**Python (PyICU)** supports resource access, formatting, locale matching,
transliteration, spoof detection, indexing, and parsing. It does not support
`personName()`, and has three binding limitations:

- **`week_info()` omits the weekend days.** PyICU 2.16 does not bind `Calendar::getDayOfWeekType` (or `isWeekend`); with no hardcoded fallback allowed, `week_info()` returns `first_day` + `minimal_days` only.
- **`relative_duration(numeric="auto")` falls back to the numeric form** (`"1 day ago"`, not `"yesterday"`).
- **`supported_values()` covers `timeZone`/`collation`/`numberingSystem`/`unit`/`transliterator`** but not `currency`/`calendar`.

**PHP** supports transliteration, spoof detection, and parsing through
`ext-intl`. It uses CLDR `ResourceBundle` data for `dateRange` (short/medium
only), relative durations (including `auto` word forms), and number and money
ranges. `moneyRange` does not collapse shared currency symbols.

The following methods remain unavailable in PHP:

- `addLikelySubtags` / `removeLikelySubtags` — `Locale::addLikelySubtags` / `Locale::minimizeSubtags` are not implemented in PHP, and the supplemental likely-subtags table isn't cleanly exposed.
- `bestMatch` / negotiating `fromAcceptLanguage` / `indexBuckets` — `LocaleMatcher` and `AlphabeticIndex` are not bound by `ext-intl` (`Locale::lookup` offers only RFC-4647 prefix matching, not CLDR language-distance).

**C# (ICU4C)** has the following limitations:

- `bestMatch` / negotiating `fromAcceptLanguage` — `LocaleMatcher` is C++ only; the C API exposes no equivalent.
- `indexBuckets` — `AlphabeticIndex` is C++ only.
- `personName` — `PersonNameFormatter` was added in ICU 73 C++; C# bundles ICU 72.
- `supportedValues("unit")` — `uloc_getAvailable` doesn't enumerate CLDR measure units; throws `CosmoUnsupportedException`.
- `get()` ResourceBundle — ICU4C's `ures_` API is not exposed through the Cosmo wrapper (Cosmo reads the data it needs through dedicated formatters).

Implementation details that affect results:

- PHP's `join()` looks up each list-pattern component through the locale,
  language, and root fallback chain. ICU does not merge partial sub-table overrides.
- `monthNames()` uses the locale's resolved calendar, such as Persian for `fa_IR`.
- Java uses a deprecated ICU4J API to retrieve contextual script names.

---

## 3. JavaScript limitations

The JavaScript port supports the APIs exposed by `Intl`. The following features
require ICU services that `Intl` does not expose:

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

JS v1.1.0 includes the supported `Intl` convenience methods listed in §1.
Calendar conversion and field access through `Temporal` are deferred pending
cross-runtime support.

---

## 4. The one Java-only method: `personName`

`personName()` is currently available only in Java. It uses ICU4J's
`PersonNameFormatter` to format names with locale-specific ordering, spacing,
initials, and formality.

| Method | ICU backing | PHP | JS | Py | Java | C# | Notes |
|---|---|:--:|:--:|:--:|:--:|:--:|---|
| `personName(fields, length, formality)` | `PersonNameFormatter` (ICU 73+ CLDR person-name data) | ❌ | ❌ | ❌ | ✅ | ❌ | surname-first locales (ja/zh/hu), locale-correct initials & spacing, formality variants. JS has only a TC39 proposal; `ext-intl` doesn't bind it; PyICU 2.16 doesn't expose `PersonNameFormatter`; C# bundles ICU 72 which predates the formatter. ICU still labels the API a **technology preview** — the port's method surface stays stable regardless |

(MessageFormat 2 — `com.ibm.icu.message2` — is also ICU4J-only but deliberately **not** wrapped while ICU still marks it a technology preview with an unsettled syntax.)

---

## 5. Choosing a port

Use the port for your application's language, and check §1 for the methods you
need. Java supports the widest set of methods. Python and C# have different
limitations, so neither covers every feature of the other. PHP supports most
formatting and text operations, with restrictions on ranges and locale matching.
JavaScript is limited to the services exposed by `Intl`.

---

## 6. API conventions across languages { #6-common-function-consistency-php-v3-python-java-status }

The ports share method names and argument meanings, with these language-specific
conventions:

| Area | Current API |
|---|---|
| Method names | PHP, JavaScript, and Java use `camelCase`; Python uses `snake_case`; C# uses `PascalCase`. |
| Factories | `fromSubtags()` and `fromAcceptLanguage()`, with the casing above. Python and Java also accept a supported-locales list for language-distance matching. |
| Units | `unit(category, unit, value, width)` in every port, with language-specific method casing. |
| Widths | `none`, `short`, `medium`, `long`, and `full`, where supported by the method. Date/time arguments are named `dateWidth` and `timeWidth` (`date_width` and `time_width` in Python). |
| Time zone | The modifier key is `timeZone`. Java and C# use a typed `Modifiers` object. |
| Optional arguments | Java uses overloads. C# uses optional and named parameters. PHP, JavaScript, and Python use defaults and per-call options as documented in their API references. |
| Message arguments | Named arguments use a map, dictionary, or associative array. Positional arguments use a list or array; Java and C# also provide varargs overloads. |
| Currency symbols | `currency()` returns the locale's standard symbol, such as `A$` for AUD in `en_US`. |

### Platform differences

- **Symbol names.** PHP, Python, Java, and C# accept more `symbol()` names than
  JavaScript. Names supported by JavaScript resolve to the same symbols in the
  other ports.
- **Currency inference.** PHP, Python, Java, and C# can infer currency from the
  locale's region. JavaScript requires a currency code or modifier; `money()`
  returns an empty string when neither is supplied.
- **Formatting options.** PHP, JavaScript, Python, and Java use `camelCase` keys
  in arrays, objects, dictionaries, or maps. C# uses typed classes such as
  `NumberOptions` and `CollationOptions` with `PascalCase` properties.

### Upgrading from PHP v2

PHP v3 renamed `createFromSubtags()` to `fromSubtags()` and `createFromHttp()` to
`fromAcceptLanguage()`. The old factory names remain as deprecated aliases.

Parameter names also changed: `unit()` uses `category`, `unit`, `value`, and
`width`; date and time methods use `dateWidth`, `timeWidth`, or `width`.
Single-letter width aliases (`n`, `s`, `m`, `l`, `f`) are no longer accepted.
The time-zone modifier is `timeZone`; `timezone` remains an alias.

The `money()` parameter order changed, and `message()` now allows the argument
array to be omitted. Check the [PHP API reference](https://salarmehr.github.io/cosmopolitan/)
when updating positional calls or PHP named arguments.
