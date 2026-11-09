---
description: The vocabulary Cosmo uses — moment, duration, range, width — so a method name tells you what it does.
---

# Terminology & naming

This page defines the values, arguments, and naming conventions used in the guides.

## Naming conventions

{% if language == 'python' %}
Methods use snake_case, such as `time_zone_name()` and `relative_duration()`.
Option keys use camelCase, such as `minimumFractionDigits`.
{% elif language == 'csharp' %}
Methods use PascalCase, such as `TimeZoneName()` and `RelativeDuration()`.
Options use typed objects with PascalCase properties, such as
`new NumberOptions { MinimumFractionDigits = 2 }`.
{% else %}
Methods and option keys use camelCase, such as `timeZoneName()`,
`relativeDuration()`, and `minimumFractionDigits`.
{% endif %}

## The temporal vocabulary

The date and time methods use these terms:

| Term | What it is | Has a direction? | Typical input | Method |
|---|---|---|---|---|
| **Moment** | A single point on the timeline (a date *and* a time together) | — | native date/time value | [`moment()`](dates-times.md) |
| **Date** | The calendar-date part of a moment (year-month-day) | — | a moment | [`date()`](dates-times.md) |
| **Time** | The clock-time part of a moment (hour-minute-second) | — | a moment | [`time()`](dates-times.md) |
| **Duration** | The *magnitude* of a span — "how long", no past/future | **No** (undirected) | seconds, or a unit breakdown | [`duration()`](dates-times.md#duration) |
| **Relative duration** | A span oriented toward past or future — "3 days ago", "in 2 hours" | **Yes** (directed) | signed value + unit | [`relativeDuration()`](lists-ranges-relative.md#relative-directed-duration) |
| **Range** | The interval *between two* values | — | two endpoints | [`dateRange()`](lists-ranges-relative.md#number-money-date-ranges) |

!!! note "Moment values"
    See [Dates & times](dates-times.md) for accepted native values and timestamp units.

!!! note "Duration vs relative duration"
    `duration(1222060)` → `"339:27:40"` — a bare magnitude. `relativeDuration(-3,
    "day")` → `"3 days ago"` — the same idea of elapsed time, but *directed*. If you
    catch yourself wanting "ago" or "in" out of `duration()`, you want
    `relativeDuration()` instead.

## Core objects

| Term | Meaning |
|---|---|
| **Locale** | The identifier for a language + region + preferences — `en_AU`, `fa-IR`, or a full BCP-47 tag like `fa-IR-u-nu-latn-ca-buddhist`. {% if language != 'javascript' %}Underscore and hyphen forms are both accepted.{% else %}Use hyphens between subtags.{% endif %} |
| **Instance** | A constructed `Cosmo` object, bound to one locale and its modifiers. You build it once and call methods on it. |
| **Subtags** | The pieces a locale decomposes into — `language`, `script`, `region`. You can construct from them directly with `fromSubtags()`. |
| **Modifiers** | The optional settings layered onto a locale at construction: `timeZone`, `calendar`, `currency`. {% if language in ['java', 'csharp'] %}A typed `Modifiers` object.{% else %}A settings object or dictionary.{% endif %} |
| **Options bag** | A per-call settings object (e.g. rounding/grouping options on `number()`). {% if language == 'csharp' %}Uses typed objects with PascalCase properties.{% else %}Keys use camelCase.{% endif %} |
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
{% if language != 'javascript' %}
| **Spellout** | A number written in words — `"one hundred twenty"`. |
{% endif %}
{% if language != 'javascript' %}
| **Ordinal** | Ordinal **text** — `"2nd"`. (For the ordinal *plural category*, see [Messages & plurals](messages-plurals.md).) |
{% endif %}
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
{% if language != 'javascript' %}
| **Transliterate / Romanize** | Convert text between scripts; **romanize** is the to-Latin-then-ASCII special case (good for slugs). See [Transliteration & parsing](transliteration-parsing.md). |
{% endif %}
{% if language != 'javascript' %}
| **Confusable / Suspicious** | Spoof detection (UTS #39): whether two strings look alike, or one string is spoof-prone. |
{% endif %}
{% if language != 'javascript' %}
| **Parse** | The **inverse** of a formatter — turn locale-formatted text back into a value (`parseNumber`, `parseMoney`, `parseDate`). |
{% endif %}
{% if language in ['python', 'java'] %}
| **Negotiation** | Choosing the best of *your* supported locales for a user, via CLDR language distance — see [Negotiation & names](negotiation-names.md). |
{% endif %}
{% if language in ['python', 'java'] %}
| **Index buckets** | Alphabetical section headers for a list (A–Z, 가나다, あかさ…). |
{% endif %}
{% if language == 'java' %}
| **Person name** | A name formatted in the culture's order, spacing, and script. |
{% endif %}

## Options & enumerations quick reference

These values recur across the library. Each row links to the relevant guide.

| Where it's used | Argument | Accepted values |
|---|---|---|
| Dates, units, lists, calendar names | **`width`** | `none` · `short` · `medium` · `long` · `full` — see [Width](#core-objects) |
| [`number()` / `percentage()` / `money()`](numbers.md#number-formatting-options) | **number options** | `minimumIntegerDigits`, `min`/`maximumFractionDigits`, `min`/`maximumSignificantDigits`, `roundingMode`, `roundingIncrement`, `useGrouping` {% if language == 'javascript' %}(plus `signDisplay`, `trailingZeroDisplay`, `roundingPriority`, `notation`, `compactDisplay`){% endif %} |
| number options | **`roundingMode`** | `ceil` · `floor` · `expand` · `trunc` · `halfExpand` (default) · `halfTrunc` · `halfEven` |
| [`compare` / `sort` / `contains`](collation-text.md#collation-options) | **collation options** | `numeric` (bool), `caseFirst`: `upper` · `lower` · `false` |
| [`contains()`](collation-text.md#substring-search) | **`sensitivity`** | `base` (default) · `accent` · `case` · `variant` |
| [`join()`](lists-ranges-relative.md#lists) | **`type`** | `conjunction` (default) · `disjunction` · `unit` |
| [`relativeDuration()`](lists-ranges-relative.md#relative-directed-duration) | **`unit`** | `second` · `minute` · `hour` · `day` · `week` · `month` · `quarter` · `year` (singular) |
| [`relativeDuration()`](lists-ranges-relative.md#relative-directed-duration) | **`numeric`** | `always` · `auto` |
| [`timeZoneName()`](dates-times.md#time-zone-name) | **`style`** | `long` (default) · `short` · `shortOffset` · `longOffset` · `shortGeneric` · `longGeneric` |
| [`pluralCategory()`](messages-plurals.md#plural-category) | returns | `zero` · `one` · `two` · `few` · `many` · `other` |
| [`displayName()`](locale-metadata.md#generic-dispatcher-displayname) | **`type`** | `language` · `region` · `script` · `calendar` · `currency` |
| [`supportedValues()`](locale-metadata.md#supported-values) | **`key`** | {% if language == 'php' %}`timeZone` · `currency` · `transliterator`{% elif language == 'python' %}`timeZone` · `collation` · `numberingSystem` · `unit` · `transliterator`{% elif language == 'csharp' %}`calendar` · `collation` · `currency` · `numberingSystem` · `timeZone` · `transliterator`{% else %}`calendar` · `collation` · `currency` · `numberingSystem` · `timeZone` · `unit`{% if language == 'java' %} · `transliterator`{% endif %}{% endif %} |
{% if language == 'java' %}
| [`personName()`](negotiation-names.md#person-names-java-only) | **`length` / `formality`** | `short`·`medium`·`long` / `formal`·`informal` |
{% endif %}
