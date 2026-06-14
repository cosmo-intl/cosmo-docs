# API reference

Every method lives on a `Cosmo` instance (or its static factories). Names are
**camelCase in PHP/JavaScript** and **snake_case in Python**
(`splitWords` → `split_words`, `timeZoneName` → `time_zone_name`, …).

Width arguments are `none` · `short` · `medium` · `long` · `full`.
Legend: ✅ available · ❌ not available · ⚠️ partial. See
[Platform notes](platform-notes.md) for the why.

## Construction

| Signature | PHP | JS | Py |
|---|:--:|:--:|:--:|
| `new Cosmo(locale?, modifiers?)` | ✅ | ✅ | ✅ |
| `fromSubtags(subtags, modifiers?)` | ✅ | ✅ | ✅ |
| `fromAcceptLanguage(header, modifiers?)` | ✅ | ✅ | ✅ |

Modifiers: `calendar`, `currency`, `timeZone`.

## Locale metadata

| Method | Purpose | PHP | JS | Py |
|---|---|:--:|:--:|:--:|
| `language(code?)` | localised language name | ✅ | ✅ | ✅ |
| `country(code?)` | localised country/region name | ✅ | ✅ | ✅ |
| `script(code?)` | localised script name | ✅ | ✅ | ✅ |
| `calendar(code)` | localised calendar name | ✅ | ✅ | ✅ |
| `direction(lang?)` | `"rtl"` / `"ltr"` | ✅ | ✅ | ✅ |
| `flag(country?)` | region → emoji flag | ✅ | ✅ | ✅ |
| `currency(code?, symbol?, strict?)` | currency name or symbol | ✅ | ⚠️ | ✅ |
| `displayName(type, code)` | generic display-name lookup | ✅ | ✅ | ✅ |
| `supportedValues(key)` | enumerate supported calendars/zones/… | ⚠️ | ✅ | ⚠️ |
| `addLikelySubtags()` | maximise (`en` → `en-Latn-US`) | ✅ | ✅ | ✅ |
| `removeLikelySubtags()` | minimise | ✅ | ✅ | ✅ |

## Numbers & money

| Method | Purpose | PHP | JS | Py |
|---|---|:--:|:--:|:--:|
| `number(value, options?)` | locale decimal format | ✅ | ✅ | ✅ |
| `percentage(value, precision?, options?)` | fraction → percent | ✅ | ✅ | ✅ |
| `money(value, code?, …)` | currency amount | ✅ | ⚠️ | ✅ |
| `unit(category, unit, value, width?)` | measurement + unit | ✅ | ✅ | ✅ |
| `symbol(name)` | named number symbol | ✅ | ⚠️ | ✅ |
| `scientific(value)` | scientific notation | ✅ | ✅ | ✅ |
| `compact(value, width?)` | compact notation (`1.2K`) | ❌ | ✅ | ✅ |
| `ordinal(number)` | ordinal text (`"2nd"`) | ✅ | ❌ | ✅ |
| `spellout(number)` | spelled-out number | ✅ | ❌ | ✅ |

`number` / `percentage` / `money` accept an `options` bag. The portable options —
`minimumIntegerDigits`, `minimumFractionDigits`, `maximumFractionDigits`,
`minimumSignificantDigits`, `maximumSignificantDigits`, `roundingMode`,
`roundingIncrement`, `useGrouping` — behave identically in all three ports. The full
`Intl.NumberFormat` surface is also accepted, but the extras (`signDisplay`,
`trailingZeroDisplay`, `roundingPriority`, `notation`, `compactDisplay`) take effect
in the **JS port only** — the PHP/Python ports have no equivalent in their legacy ICU
formatters and silently ignore them (use the dedicated `compact()` / `scientific()`
methods there instead).

## Dates & times

| Method | Purpose | PHP | JS | Py |
|---|---|:--:|:--:|:--:|
| `moment(value, dateWidth?, timeWidth?, calendar?)` | date + time | ✅ | ✅ | ✅ |
| `date(value, width?)` | date only | ✅ | ✅ | ✅ |
| `time(value, width?)` | time only | ✅ | ✅ | ✅ |
| `duration(seconds \| parts, withWords?)` | undirected span (scalar seconds or a unit breakdown) | ✅ | ✅ | ✅ |
| `timeZoneName(style?)` | time-zone display name | ✅ | ✅ | ✅ |
| `monthNames(width?)` | localised month names | ✅ | ✅ | ✅ |
| `weekdayNames(width?)` | localised weekday names (Sun-first) | ✅ | ✅ | ✅ |
| `weekInfo()` | first day / weekend / minimal days | ✅ | ✅ | ⚠️ |
| `formatMoment(value, pattern, calendar?)` | raw ICU pattern | ✅ | ❌ | ✅ |
| `dateRange(start, end, dateWidth?, timeWidth?)` | date range | ❌ | ✅ | ✅ |

## Collation & text

| Method | Purpose | PHP | JS | Py |
|---|---|:--:|:--:|:--:|
| `compare(a, b, options?)` | locale comparison | ✅ | ✅ | ✅ |
| `sort(items, key?, options?)` | locale sort | ✅ | ✅ | ✅ |
| `contains(haystack, needle, sensitivity?, options?)` | collation-aware search | ✅ | ✅ | ✅ |
| `splitWords(text)` | word segmentation | ✅ | ✅ | ✅ |
| `splitSentences(text)` | sentence segmentation | ✅ | ✅ | ✅ |
| `splitGraphemes(text)` | grapheme-cluster segmentation | ✅ | ✅ | ✅ |
| `ellipsize(text, max, ellipsis?)` | grapheme-safe truncation | ✅ | ✅ | ✅ |
| `upper(text)` / `lower(text)` | locale case mapping | ✅ | ✅ | ✅ |

`compare` / `sort` / `contains` accept collation tailoring via `options`
(`numeric`, `caseFirst`).

## Messages, plurals & lists

| Method | Purpose | PHP | JS | Py |
|---|---|:--:|:--:|:--:|
| `message(pattern, args?)` | ICU MessageFormat | ✅ | ⚠️ | ✅ |
| `pluralCategory(value, ordinal?)` | LDML plural category | ✅ | ✅ | ✅ |
| `join(items, type?, width?)` | locale list join | ✅ | ✅ | ✅ |

## Ranges & relative time

| Method | Purpose | PHP | JS | Py |
|---|---|:--:|:--:|:--:|
| `numberRange(start, end)` | numeric range | ❌ | ✅ | ✅ |
| `moneyRange(start, end, code?)` | currency range | ❌ | ✅ | ✅ |
| `relativeDuration(amount, unit, numeric?)` | directed duration | ❌ | ✅ | ⚠️ |
| `relativeDurationBetween(target, reference?, numeric?)` | relative between moments | ❌ | ✅ | ⚠️ |

## Raw ICU (PHP & Python)

| Method | Purpose | PHP | JS | Py |
|---|---|:--:|:--:|:--:|
| `get(bundle, ...path)` | raw `ResourceBundle` lookup | ✅ | ❌ | ✅ |
| `quote(text)` | locale quotation marks | ✅ | ❌ | ✅ |
