---
description: What each Cosmo port can and cannot do, and why — how JavaScript, PHP, Python, Java, and C# reach ICU and where their feature sets differ.
---

# Platform notes

Cosmo's available features depend on how each language exposes ICU. This page
summarises the differences; [Feature parity](parity.md) lists support for each method.

## ICU access by language

| | Reaches ICU via | Completeness |
|---|---|---|
| **Java** | ICU4J (the reference ICU implementation) | all shared methods, plus `personName()` |
| **C#** | ICU4C (native ICU C library, P/Invoke, bundled ICU 72) | some methods unavailable through the wrapper or bundled ICU version |
| **Python** | PyICU (ICU C++ bindings) | three binding limitations; no `personName()` |
| **PHP** | `ext-intl` (+ raw `ResourceBundle`, RBNF) | v3 reaches everything except likely-subtags & the matcher/index family |
| **JavaScript** | the standard `Intl` API | everything `Intl` exposes; raw-ICU features omitted by design |

Everything in the **[Guide](guide/locale-metadata.md)** without a callout works in
all five ports. The exceptions are below.

## JavaScript limitations

`Intl` is a curated **formatting** subset of ICU — it has no parser, transform
engine, spoof checker, locale matcher, or resource access. Cosmo therefore does not offer the following methods in
JavaScript. The other ports support them unless noted:

- `spellout()` — spell a number out ("one hundred twenty") — needs RBNF
- `ordinal()` — ordinal **text** ("1st", "2nd") *(the ordinal plural **category** is available everywhere via [`pluralCategory()`](guide/messages-plurals.md#plural-category))*
- `quote()` — wrap text in the locale's quotation marks (CLDR delimiter data)
- `get()` — raw ICU `ResourceBundle` access *(PHP, Python & Java only)*
- `formatMoment()` — arbitrary ICU date/time patterns
- `transliterate()` / `romanize()` — script conversion & ASCII slugs (needs `Transliterator`)
- `confusable()` / `suspicious()` — spoof detection (needs `SpoofChecker`)
- `parseNumber()` / `parseMoney()` / `parseDate()` / `parseMoment()` — `Intl` is format-only
- `bestMatch()` / negotiating `fromAcceptLanguage()` — needs `LocaleMatcher` *(Python & Java only)*
- `indexBuckets()` — needs `AlphabeticIndex` *(Python & Java only)*

JavaScript also **does not infer a currency from the region**: `money()` requires
an explicit currency code or the `currency` modifier (PHP, Python, Java, and C#
infer it).

## PHP limitations

PHP v3 supports `compact()`, `relativeDuration()`, `numberRange()`, `moneyRange()`,
and `dateRange()`. Where `ext-intl` lacks a formatter, Cosmo reads CLDR
`ResourceBundle` data to assemble the result. Two limitations apply:

- `dateRange()` supports **`short`/`medium` only** (CLDR ships no long/full interval
  skeletons that `ext-intl` can reach); it throws on long/full.
- `moneyRange()` is **approximate** — it fills the CLDR range pattern but doesn't
  collapse the shared currency symbol the way native ICU does.

The following methods are unavailable in PHP because `ext-intl` does not expose
the required APIs. Python and Java support all three:

- `addLikelySubtags()` / `removeLikelySubtags()` — no likely-subtags algorithm
- `bestMatch()` / negotiating `fromAcceptLanguage()` — no `LocaleMatcher` binding
- `indexBuckets()` — no `AlphabeticIndex` binding

## Python limitations

PyICU 2.16 has three binding limitations, also documented in the Python README:

- **`week_info()` omits the weekend days.** PyICU doesn't bind ICU's
  `getDayOfWeekType` / `isWeekend`, and the no-hardcoded-data rule forbids a
  fallback table — so it returns `first_day` + `minimal_days` only. (PHP, Java,
  and C# return the weekend too.)
- **`relative_duration(numeric="auto")` returns the numeric form** (`"1 day ago"`,
  not `"yesterday"`) — PyICU doesn't cleanly expose ICU's "auto" word-forms. The
  `numeric="auto"` option therefore has no effect. (PHP, Java, and C# produce the words.)
- **`supported_values()` covers `timeZone`/`collation`/`numberingSystem`/`unit`/`transliterator`**
  but not `currency`/`calendar`.

## C# limitations

C# wraps ICU4C via P/Invoke and bundles ICU 72 native binaries. The following
methods are unavailable:

- **`indexBuckets()`** — `AlphabeticIndex` has no C API (C++ only).
- **`bestMatch()` / negotiating `fromAcceptLanguage()`** — `LocaleMatcher` has no
  C API. The non-negotiating `FromAcceptLanguage(header)` (no supported list) works.
- **`personName()`** — `PersonNameFormatter` was added in ICU 73 C++; the bundled
  ICU is version 72.
- **`supportedValues("unit")`** — `uloc_getAvailable` doesn't enumerate CLDR
  measure units; throws `CosmoUnsupportedException`.
- **`get()`** — the wrapper does not expose raw `ResourceBundle` access.

Supported features include RBNF (`spellout`/`ordinal`), CLDR delimiters (`quote`),
transliteration, spoof detection, locale-aware parsing, likely-subtags,
`formatMoment`, `dateRange` (all widths), relative-duration word forms, weekend
days in `weekInfo`, and most `supportedValues` keys.

## Java support

Java uses ICU4J and supports all methods in the shared API, including weekend
days, relative-time word forms, and the full `supportedValues` set. It is also
the only port that supports `personName()`:

- **`personName()`** — locale-correct person-name formatting (surname-first locales,
  initials, formality variants) via ICU 73+'s `PersonNameFormatter`. JS has only a
  TC39 proposal, `ext-intl` doesn't bind it, PyICU 2.16 doesn't expose it, and C#
  bundles ICU 72 which predates the formatter. See
  [Negotiation & names](guide/negotiation-names.md).

## Locale data policy

Cosmo does not maintain hardcoded locale tables. Each port uses the ICU APIs
available to it. PHP also assembles some formatted results from ICU
`ResourceBundle` data where a dedicated formatter is unavailable.

Locale data updates follow the runtime or bundled ICU version. Updating Cosmo
alone does not necessarily update that data.
