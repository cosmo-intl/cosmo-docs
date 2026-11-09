---
description: Runtime requirements, supported ICU services, and formatting limitations.
---

# Platform notes

These notes describe runtime support and limitations.

{% if language == 'javascript' %}
## JavaScript limitations

`Intl` is a curated **formatting** subset of ICU — it has no parser, transform
engine, spoof checker, locale matcher, or resource access. The following methods
are unavailable:

- `spellout()` — spell a number out ("one hundred twenty") — needs RBNF
- `ordinal()` — ordinal **text** ("1st", "2nd") *(the ordinal plural **category** is available via [`pluralCategory()`](guide/messages-plurals.md#plural-category))*
- `quote()` — wrap text in the locale's quotation marks (CLDR delimiter data)
- `get()` — raw ICU `ResourceBundle` access
- `formatMoment()` — arbitrary ICU date/time patterns
- `transliterate()` / `romanize()` — script conversion & ASCII slugs (needs `Transliterator`)
- `confusable()` / `suspicious()` — spoof detection (needs `SpoofChecker`)
- `parseNumber()` / `parseMoney()` / `parseDate()` / `parseMoment()` — `Intl` is format-only
- `bestMatch()` / negotiating `fromAcceptLanguage()` — needs `LocaleMatcher`
- `indexBuckets()` — needs `AlphabeticIndex`

JavaScript also **does not infer a currency from the region**: `money()` requires
an explicit currency code or the `currency` modifier.
{% endif %}

{% if language == 'php' %}
## PHP limitations

PHP v3 supports `compact()`, `relativeDuration()`, `numberRange()`, `moneyRange()`,
and `dateRange()`. Where `ext-intl` lacks a formatter, Cosmo reads CLDR
`ResourceBundle` data to assemble the result. Two limitations apply:

- `dateRange()` supports **`short`/`medium` only** (CLDR ships no long/full interval
  skeletons that `ext-intl` can reach); it throws on long/full.
- `moneyRange()` is **approximate** — it fills the CLDR range pattern but doesn't
  collapse the shared currency symbol the way native ICU does.

The following methods are unavailable in PHP because `ext-intl` does not expose
the required APIs:

- `addLikelySubtags()` / `removeLikelySubtags()` — no likely-subtags algorithm
- `bestMatch()` / negotiating `fromAcceptLanguage()` — no `LocaleMatcher` binding
- `indexBuckets()` — no `AlphabeticIndex` binding
{% endif %}

{% if language == 'python' %}
## Python limitations

PyICU 2.16 has three binding limitations, also documented in the Python README:

- **`week_info()` omits the weekend days.** PyICU doesn't bind ICU's
  `getDayOfWeekType` / `isWeekend`, and the no-hardcoded-data rule forbids a
  fallback table — so it returns `first_day` + `minimal_days` only.
- **`relative_duration(numeric="auto")` returns the numeric form** (`"1 day ago"`,
  not `"yesterday"`) — PyICU doesn't cleanly expose ICU's "auto" word-forms. The
  `numeric="auto"` option therefore has no effect.
- **`supported_values()` covers `timeZone`/`collation`/`numberingSystem`/`unit`/`transliterator`**
  but not `currency`/`calendar`.
{% endif %}

{% if language == 'csharp' %}
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
{% endif %}

{% if language == 'java' %}
## ICU4J support

The library supports weekend metadata, relative-time word forms, supported-value
enumeration, locale matching, and person-name formatting through ICU4J.

`personName()` uses `PersonNameFormatter` (ICU 73+) for name order, initials,
spacing, and formality. See [Negotiation & names](guide/negotiation-names.md).
{% endif %}

## Locale data

Cosmo reads locale data from ICU instead of maintaining hardcoded tables.
{% if language == 'php' %}
Where a dedicated formatter is unavailable, the library assembles the result
from ICU `ResourceBundle` data.
{% endif %}
Data updates follow the runtime or bundled ICU version. Updating Cosmo alone
does not necessarily update locale data.
