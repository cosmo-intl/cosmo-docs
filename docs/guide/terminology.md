---
description: The shared vocabulary Cosmo uses across all five ports — moment, duration, range, width — so a method name tells you what it does.
---

# Terminology & naming

Cosmo deliberately uses **one vocabulary across all five ports** (PHP, JavaScript,
Python, Java, C#). A *moment* is a moment everywhere; a *duration* never quietly means
a *range*. This page defines those words so a method name tells you what it does
before you read its signature — and so the guides can stay terse.

!!! tip "Why this matters"
    Most i18n bugs are vocabulary bugs: passing a *duration* where a *moment* is
    expected, or asking for a *range* when you meant *relative time*. The names
    below are chosen so the confusable cases stay visibly distinct.

## Naming conventions

The method names are identical in every port, with one mechanical difference:

| Convention | PHP / JavaScript / Java | Python | C# |
|---|---|---|---|
| Method casing | `camelCase` — `timeZoneName()`, `relativeDuration()` | `snake_case` — `time_zone_name()`, `relative_duration()` | `PascalCase` — `TimeZoneName()`, `RelativeDuration()` |
| Factory helpers | `fromSubtags()`, `fromAcceptLanguage()` | `from_subtags()`, `from_accept_language()` | `FromSubtags()`, `FromAcceptLanguage()` |
| Option-bag keys | `camelCase` — `minimumFractionDigits` | `camelCase` (kept identical on purpose) | `PascalCase` — `MinimumFractionDigits` (C# object initializer) |

So a guide that writes `relativeDuration()` always means `relative_duration()` in
Python and `RelativeDuration()` in C# — the same operation, never a different one.
Option-bag keys stay `camelCase` in **JS/PHP/Python/Java** so a JSON config travels
between those four ports unchanged; C# uses PascalCase typed `Options` objects.

## The temporal vocabulary

These five words are the ones most often confused. They name genuinely different
things:

| Term | What it is | Has a direction? | Typical input | Method |
|---|---|---|---|---|
| **Moment** | A single point on the timeline (a date *and* a time together) | — | native date/time value | [`moment()`](dates-times.md) |
| **Date** | The calendar-date part of a moment (year-month-day) | — | a moment | [`date()`](dates-times.md) |
| **Time** | The clock-time part of a moment (hour-minute-second) | — | a moment | [`time()`](dates-times.md) |
| **Duration** | The *magnitude* of a span — "how long", no past/future | **No** (undirected) | seconds, or a unit breakdown | [`duration()`](dates-times.md#duration) |
| **Relative duration** | A span oriented toward past or future — "3 days ago", "in 2 hours" | **Yes** (directed) | signed value + unit | [`relativeDuration()`](lists-ranges-relative.md#relative-directed-duration) |
| **Range** | The interval *between two* values | — | two endpoints | [`dateRange()`](lists-ranges-relative.md#number-money-date-ranges) |

!!! note "Moment, not 'date'"
    The argument that carries a point in time is a **moment** — it accepts your
    language's native value (a `DateTime` / `Date` / `datetime` / `java.util.Date`,
    or a Unix timestamp). Watch the unit: JavaScript counts **milliseconds**; PHP,
    Python, and Java count **seconds**; C# takes a `DateTimeOffset`. See [Dates & times](dates-times.md).

!!! note "Duration vs relative duration"
    `duration(1222060)` → `"339:27:40"` — a bare magnitude. `relativeDuration(-3,
    "day")` → `"3 days ago"` — the same idea of elapsed time, but *directed*. If you
    catch yourself wanting "ago" or "in" out of `duration()`, you want
    `relativeDuration()` instead.

## Core objects

| Term | Meaning |
|---|---|
| **Locale** | The identifier for a language + region + preferences — `en_AU`, `fa-IR`, or a full BCP-47 tag like `fa-IR-u-nu-latn-ca-buddhist`. Underscore and hyphen forms are both accepted. |
| **Instance** | A constructed `Cosmo` object, bound to one locale and its modifiers. You build it once and call methods on it. |
| **Subtags** | The pieces a locale decomposes into — `language`, `script`, `region`. You can construct from them directly with `fromSubtags()`. |
| **Modifiers** | The optional settings layered onto a locale at construction: `timeZone`, `calendar`, `currency`. An options bag in PHP/JS/Python; a typed `Modifiers` value class in Java and C#. |
| **Options bag** | A per-call settings object (e.g. rounding/grouping options on `number()`). Keys are `camelCase` in every port. |
| **Width** | The verbosity of a formatted result, one scale shared by dates, units, and more: `none` · `short` · `medium` · `long` · `full`. |

## Numbers & money

| Term | Meaning |
|---|---|
| **Number** | A locale-formatted decimal — grouping and decimal separators per locale. |
| **Percentage** | Formats a **fraction** as a percent (`0.2` → `"20%"`). |
| **Unit** | A measured quantity with its unit (`2.19 gigabytes`, `26°C`). |
| **Money** | A currency *amount*, formatted with the currency's symbol and placement. Cosmo only *formats* — it never converts between currencies. |
| **Currency** | The currency itself (its localised **name** or disambiguated **symbol**), independent of any amount. |
| **Compact** | Short magnitude notation — `1.2K`, `1.2 thousand`. |
| **Scientific** | Exponential notation — `1.2345E4`. |
| **Spellout** | A number written in words — `"one hundred twenty"`. |
| **Ordinal** | Ordinal **text** — `"2nd"`. (For the ordinal *plural category*, see [Messages & plurals](messages-plurals.md).) |
| **Symbol** | A locale's notation symbol by name — e.g. the decimal mark `"٫"` in `fa`. |

!!! warning "Money is not currency conversion"
    `money(100, "AUD")` formats *100 AUD* in the locale's style. It does **not**
    convert 100 of anything into AUD — convert the amount yourself first. See
    [Money & currency](money.md).

## Locale, text & people

| Term | Meaning |
|---|---|
| **Language / Country / Script / Calendar** | The localised *display name* of a code — `language("en")` in `fa` → `"انگلیسی"`. |
| **Direction** | The locale's text direction — `"ltr"` or `"rtl"`. |
| **Time zone** | An IANA zone (`Australia/Sydney`); `timeZoneName()` gives its localised name. |
| **Plural category** | The CLDR plural class of a number (`one`, `few`, `many`, …) used to choose message forms. See [Messages & plurals](messages-plurals.md). |
| **Collation** | Locale-correct string *ordering* (sorting) — distinct from byte order. See [Collation & text](collation-text.md). |
| **Transliterate / Romanize** | Convert text between scripts; **romanize** is the to-Latin-then-ASCII special case (good for slugs). See [Transliteration & parsing](transliteration-parsing.md). |
| **Confusable / Suspicious** | Spoof detection (UTS #39): whether two strings look alike, or one string is spoof-prone. |
| **Parse** | The **inverse** of a formatter — turn locale-formatted text back into a value (`parseNumber`, `parseMoney`, `parseDate`). |
| **Negotiation** | Choosing the best of *your* supported locales for a user, via CLDR language distance — see [Negotiation & names](negotiation-names.md). |
| **Index buckets** | Alphabetical section headers for a list (A–Z, 가나다, あかさ…). |
| **Person name** | A name formatted in the culture's order, spacing, and script. |

!!! info "Not every term is available in every port"
    The vocabulary is shared, but a few operations depend on a raw-ICU service the
    `Intl` API doesn't expose (parsing, transliteration, person names, …). Each
    guide flags its availability, and the [Feature parity](../parity.md) matrix and
    [Platform notes](../platform-notes.md) give the full picture.

## Options & enumerations quick reference

The same handful of enumerated values recur across the whole library. Keep this as
a single lookup; each row links to the guide that uses it.

| Where it's used | Argument | Accepted values |
|---|---|---|
| Dates, units, lists, calendar names | **`width`** | `none` · `short` · `medium` · `long` · `full` — see [Width](#core-objects) |
| [`number()` / `percentage()` / `money()`](numbers.md#number-formatting-options) | **number options** | `minimumIntegerDigits`, `min`/`maximumFractionDigits`, `min`/`maximumSignificantDigits`, `roundingMode`, `roundingIncrement`, `useGrouping` (+ JS-only `signDisplay`, `trailingZeroDisplay`, `roundingPriority`, `notation`, `compactDisplay`) |
| number options | **`roundingMode`** | `ceil` · `floor` · `expand` · `trunc` · `halfExpand` (default) · `halfTrunc` · `halfEven` |
| [`compare` / `sort` / `contains`](collation-text.md#collation-options) | **collation options** | `numeric` (bool), `caseFirst`: `upper` · `lower` · `false` |
| [`contains()`](collation-text.md#substring-search) | **`sensitivity`** | `base` (default) · `accent` · `case` · `variant` |
| [`join()`](lists-ranges-relative.md#lists) | **`type`** | `conjunction` (default) · `disjunction` · `unit` |
| [`relativeDuration()`](lists-ranges-relative.md#relative-directed-duration) | **`unit`** | `second` · `minute` · `hour` · `day` · `week` · `month` · `quarter` · `year` (singular) |
| [`relativeDuration()`](lists-ranges-relative.md#relative-directed-duration) | **`numeric`** | `always` · `auto` |
| [`timeZoneName()`](dates-times.md#time-zone-name) | **`style`** | `long` (default) · `short` · `shortOffset` · `longOffset` · `shortGeneric` · `longGeneric` |
| [`pluralCategory()`](messages-plurals.md#plural-category) | returns | `zero` · `one` · `two` · `few` · `many` · `other` |
| [`displayName()`](locale-metadata.md#generic-dispatcher-displayname) | **`type`** | `language` · `region` · `script` · `calendar` · `currency` |
| [`supportedValues()`](locale-metadata.md#supported-values) | **`key`** | `calendar` · `collation` · `currency` · `numberingSystem` · `timeZone` · `unit` (+ `transliterator` in PHP/Python/Java/C#; `unit` blocked in C#) |
| [`personName()`](negotiation-names.md#person-names-java-only) | **`length` / `formality`** | `short`·`medium`·`long` / `formal`·`informal` |

!!! note "Option-bag keys"
    In PHP/JavaScript/Python/Java, option keys stay `camelCase` (`minimumFractionDigits`,
    `caseFirst`, …) even in Python — only *method names* switch to `snake_case`. This
    is deliberate: one JSON config travels between those four ports unchanged. In **C#**,
    typed `Options` classes use `PascalCase` properties (`MinimumFractionDigits`,
    `Numeric`, …) to match .NET conventions.
