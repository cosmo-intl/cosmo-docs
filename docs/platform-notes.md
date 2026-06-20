---
description: What each Cosmo port can and cannot do, and why — how PHP, JavaScript, Python, Java, and C# reach ICU and where their feature sets differ.
---

# Platform notes

The five ports share one API but reach ICU through different doors, so their
feature sets differ slightly at the edges. This page is the quick "what can I use
where" reference; for the exhaustive matrix, see [Feature parity](parity.md).

## The short version

| | Reaches ICU via | Completeness |
|---|---|---|
| **Java** | ICU4J (the reference ICU implementation) | **most complete** — blocked on nothing |
| **C#** | ICU4C (native ICU C library, P/Invoke, bundled ICU 72) | near-Java — four C-API surface gaps |
| **Python** | PyICU (ICU C++ bindings) | near-complete — three small binding quirks |
| **PHP** | `ext-intl` (+ raw `ResourceBundle`, RBNF) | v3 reaches everything except likely-subtags & the matcher/index family |
| **JavaScript** | the standard `Intl` API | everything `Intl` exposes; raw-ICU features omitted by design |

Everything in the **[Guide](guide/locale-metadata.md)** without a callout works in
all five ports. The exceptions are below.

## JavaScript can't do (not in `Intl`)

`Intl` is a curated **formatting** subset of ICU — it has no parser, transform
engine, spoof checker, locale matcher, or resource access. Those raw-ICU features
are **intentionally omitted, not faked**. All are available in PHP, Python, Java,
and C# (unless noted):

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

## PHP can't do (no `ext-intl` API)

PHP v3 closed most of its old gaps by **reconstructing the missing formatters from
CLDR `ResourceBundle` data** (no hardcoded tables) — `compact()`, `relativeDuration()`,
`numberRange()`/`moneyRange()`, and `dateRange()` now all work. Two caveats:

- `dateRange()` supports **`short`/`medium` only** (CLDR ships no long/full interval
  skeletons that `ext-intl` can reach); it throws on long/full.
- `moneyRange()` is **approximate** — it fills the CLDR range pattern but doesn't
  collapse the shared currency symbol the way native ICU does.

Genuinely **still blocked** in PHP (no `ext-intl` API, not cleanly reconstructable
— all available in Python and Java):

- `addLikelySubtags()` / `removeLikelySubtags()` — no likely-subtags algorithm
- `bestMatch()` / negotiating `fromAcceptLanguage()` — no `LocaleMatcher` binding
- `indexBuckets()` — no `AlphabeticIndex` binding

## Three Python quirks

Python is near-complete, but PyICU 2.16's bindings leave three small gaps
(documented in the Python README):

- **`week_info()` omits the weekend days.** PyICU doesn't bind ICU's
  `getDayOfWeekType` / `isWeekend`, and the no-hardcoded-data rule forbids a
  fallback table — so it returns `first_day` + `minimal_days` only. (PHP, Java,
  and C# return the weekend too.)
- **`relative_duration(numeric="auto")` returns the numeric form** (`"1 day ago"`,
  not `"yesterday"`) — PyICU doesn't cleanly expose ICU's "auto" word-forms. The
  result is always correct, just not colloquial. (PHP, Java, and C# produce the words.)
- **`supported_values()` covers `timeZone`/`collation`/`numberingSystem`/`unit`/`transliterator`**
  but not `currency`/`calendar`.

## Four C# gaps (ICU4C C-API limits)

C# wraps ICU4C via P/Invoke with bundled ICU 72 native binaries. The four gaps
are C-API surface limits, not missing ICU data:

- **`indexBuckets()`** — `AlphabeticIndex` has no C API (C++ only).
- **`bestMatch()` / negotiating `fromAcceptLanguage()`** — `LocaleMatcher` has no
  C API. The non-negotiating `FromAcceptLanguage(header)` (no supported list) works.
- **`personName()`** — `PersonNameFormatter` was added in ICU 73 C++; the bundled
  ICU is version 72.
- **`supportedValues("unit")`** — `uloc_getAvailable` doesn't enumerate CLDR
  measure units; throws `CosmoUnsupportedException`.

Everything else — RBNF (`spellout`/`ordinal`), CLDR delimiters (`quote`),
transliteration, spoof detection, locale-aware parsing, likely-subtags,
`formatMoment`, `dateRange` (all widths), relative-duration word forms, weekend
days in `weekInfo`, and most `supportedValues` keys — works fully in C#.

## Java's one exclusive — and what it doesn't block

Java (ICU4J) is blocked on **nothing**: weekend days, `auto` word forms, and the
full `supportedValues` set (plus `transliterator`) all work. It also carries the
one method no other port can reach:

- **`personName()`** — locale-correct person-name formatting (surname-first locales,
  initials, formality variants) via ICU 73+'s `PersonNameFormatter`. JS has only a
  TC39 proposal, `ext-intl` doesn't bind it, PyICU 2.16 doesn't expose it, and C#
  bundles ICU 72 which predates the formatter. See
  [Negotiation & names](guide/negotiation-names.md).

## Why omit instead of polyfill?

Every port follows the same rule: **if its runtime's ICU can't produce a result,
the feature is left out — never reimplemented from a hardcoded table.** (PHP's v3
CLDR reconstructions are the one nuance — they still read live ICU `ResourceBundle`
data, so nothing is hardcoded.) That's what keeps all five ports correct and
maintenance-free as CLDR/ICU data evolves, and it's why the gaps above are
by-design boundaries rather than bugs or backlog.
