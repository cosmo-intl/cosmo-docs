# API reference

Every method lives on a `Cosmo` instance (or its static factories). Names are
**camelCase in PHP/JavaScript/Java** and **snake_case in Python**
(`splitWords` → `split_words`, `timeZoneName` → `time_zone_name`, …). Java has no
keyword/optional arguments, so optional parameters become **overloads**, and the
options bags are `Map<String, Object>` with the same camelCase keys as JS.

Width arguments are `none` · `short` · `medium` · `long` · `full`.
Legend: ✅ available · ❌ not available · ⚠️ partial / different shape. See
[Platform notes](platform-notes.md) for the why.

## Construction

| Signature | PHP | JS | Py | Java |
|---|:--:|:--:|:--:|:--:|
| `new Cosmo(locale?, modifiers?)` | ✅ | ✅ | ✅ | ✅ |
| `fromSubtags(subtags, modifiers?)` | ✅ | ✅ | ✅ | ✅ |
| `fromAcceptLanguage(header, modifiers?)` | ✅ | ✅ | ✅ | ✅ |
| `fromAcceptLanguage(header, supported, …)` — CLDR-negotiating | ❌ | ❌ | ✅ | ✅ |

Modifiers: `calendar`, `currency`, `timeZone`.

## Locale metadata

| Method | Purpose | PHP | JS | Py | Java |
|---|---|:--:|:--:|:--:|:--:|
| `language(code?)` | localised language name | ✅ | ✅ | ✅ | ✅ |
| `country(code?)` | localised country/region name | ✅ | ✅ | ✅ | ✅ |
| `script(code?)` | localised script name | ✅ | ✅ | ✅ | ✅ |
| `calendar(code)` | localised calendar name | ✅ | ✅ | ✅ | ✅ |
| `direction(lang?)` | `"rtl"` / `"ltr"` | ✅ | ✅ | ✅ | ✅ |
| `flag(country?)` | region → emoji flag | ✅ | ✅ | ✅ | ✅ |
| `currency(code?, symbol?, strict?)` | currency name or symbol | ✅ | ⚠️ | ✅ | ✅ |
| `displayName(type, code)` | generic display-name lookup | ✅ | ✅ | ✅ | ✅ |
| `supportedValues(key)` | enumerate supported calendars/zones/… | ⚠️ | ✅ | ⚠️ | ✅ |
| `addLikelySubtags()` | maximise (`en` → `en-Latn-US`) | ❌ | ✅ | ✅ | ✅ |
| `removeLikelySubtags()` | minimise | ❌ | ✅ | ✅ | ✅ |

## Numbers & money

| Method | Purpose | PHP | JS | Py | Java |
|---|---|:--:|:--:|:--:|:--:|
| `number(value, options?)` | locale decimal format | ✅ | ✅ | ✅ | ✅ |
| `percentage(value, precision?, options?)` | fraction → percent | ✅ | ✅ | ✅ | ✅ |
| `money(value, code?, …)` | currency amount | ✅ | ⚠️ | ✅ | ✅ |
| `unit(category, unit, value, width?)` | measurement + unit | ✅ | ✅ | ✅ | ✅ |
| `symbol(name)` | named number symbol | ✅ | ⚠️ | ✅ | ✅ |
| `scientific(value)` | scientific notation | ✅ | ✅ | ✅ | ✅ |
| `compact(value, width?)` | compact notation (`1.2K`) | ✅ | ✅ | ✅ | ✅ |
| `ordinal(number)` | ordinal text (`"2nd"`) | ✅ | ❌ | ✅ | ✅ |
| `spellout(number)` | spelled-out number | ✅ | ❌ | ✅ | ✅ |

`number` / `percentage` / `money` accept an `options` bag. The portable options —
`minimumIntegerDigits`, `minimumFractionDigits`, `maximumFractionDigits`,
`minimumSignificantDigits`, `maximumSignificantDigits`, `roundingMode`,
`roundingIncrement`, `useGrouping` — behave identically in all four ports, with a
`halfExpand` rounding default everywhere. The full `Intl.NumberFormat` surface is
also accepted, but the extras (`signDisplay`, `trailingZeroDisplay`,
`roundingPriority`, `notation`, `compactDisplay`) take effect in the **JS port
only** — the other ports' ICU formatters have no equivalent and silently ignore
them (use the dedicated `compact()` / `scientific()` methods there instead).

## Dates & times

| Method | Purpose | PHP | JS | Py | Java |
|---|---|:--:|:--:|:--:|:--:|
| `moment(value, dateWidth?, timeWidth?, calendar?)` | date + time | ✅ | ✅ | ✅ | ✅ |
| `date(value, width?)` | date only | ✅ | ✅ | ✅ | ✅ |
| `time(value, width?)` | time only | ✅ | ✅ | ✅ | ✅ |
| `duration(seconds \| parts, withWords?)` | undirected span (scalar seconds or a unit breakdown) | ✅ | ✅ | ✅ | ✅ |
| `timeZoneName(style?)` | time-zone display name | ✅ | ✅ | ✅ | ✅ |
| `monthNames(width?)` | localised month names | ✅ | ✅ | ✅ | ✅ |
| `weekdayNames(width?)` | localised weekday names (Sun-first) | ✅ | ✅ | ✅ | ✅ |
| `weekInfo()` | first day / weekend / minimal days | ✅ | ✅ | ⚠️ | ✅ |
| `formatMoment(value, pattern, calendar?)` | raw ICU pattern | ✅ | ❌ | ✅ | ✅ |
| `dateRange(start, end, dateWidth?, timeWidth?)` | date range | ⚠️ | ✅ | ✅ | ✅ |

`weekInfo()` omits the weekend in Python; `dateRange()` is `short`/`medium` only in
PHP. See [Platform notes](platform-notes.md).

## Collation & text

| Method | Purpose | PHP | JS | Py | Java |
|---|---|:--:|:--:|:--:|:--:|
| `compare(a, b, options?)` | locale comparison | ✅ | ✅ | ✅ | ✅ |
| `sort(items, key?, options?)` | locale sort | ✅ | ✅ | ✅ | ✅ |
| `contains(haystack, needle, sensitivity?, options?)` | collation-aware search | ✅ | ✅ | ✅ | ✅ |
| `splitWords(text)` | word segmentation | ✅ | ✅ | ✅ | ✅ |
| `splitSentences(text)` | sentence segmentation | ✅ | ✅ | ✅ | ✅ |
| `splitGraphemes(text)` | grapheme-cluster segmentation | ✅ | ✅ | ✅ | ✅ |
| `ellipsize(text, max, ellipsis?)` | grapheme-safe truncation | ✅ | ✅ | ✅ | ✅ |
| `upper(text)` / `lower(text)` | locale case mapping | ✅ | ✅ | ✅ | ✅ |

`compare` / `sort` / `contains` accept collation tailoring via `options`
(`numeric`, `caseFirst`). The `key` accessor on `sort` is Python-only; Java passes
the collator as a `Comparator`.

## Messages, plurals & lists

| Method | Purpose | PHP | JS | Py | Java |
|---|---|:--:|:--:|:--:|:--:|
| `message(pattern, args?)` | ICU MessageFormat | ✅ | ⚠️ | ✅ | ✅ |
| `pluralCategory(value, ordinal?)` | LDML plural category | ✅ | ✅ | ✅ | ✅ |
| `join(items, type?, width?)` | locale list join | ✅ | ✅ | ✅ | ✅ |
| `quote(text)` | locale quotation marks | ✅ | ❌ | ✅ | ✅ |

JS `message()` is a hand-written subset (arguments, `number`, `plural`, `select`);
PHP, Python, and Java use full ICU `MessageFormat` (named **and** positional args).

## Ranges & relative time

| Method | Purpose | PHP | JS | Py | Java |
|---|---|:--:|:--:|:--:|:--:|
| `numberRange(start, end)` | numeric range | ✅ | ✅ | ✅ | ✅ |
| `moneyRange(start, end, code?)` | currency range | ⚠️ | ✅ | ✅ | ✅ |
| `relativeDuration(amount, unit, numeric?)` | directed duration | ✅ | ✅ | ⚠️ | ✅ |
| `relativeDurationBetween(target, reference?, numeric?)` | relative between moments | ✅ | ✅ | ✅ | ✅ |

PHP reconstructs these from CLDR data (so `moneyRange` is approximate); Python's
`relativeDuration(numeric="auto")` falls back to the numeric form.

## Transliteration & spoof detection

| Method | Purpose | PHP | JS | Py | Java |
|---|---|:--:|:--:|:--:|:--:|
| `transliterate(text, id)` | ICU `Transliterator` transform | ✅ | ❌ | ✅ | ✅ |
| `romanize(text)` | to Latin/ASCII (`"Any-Latin; Latin-ASCII"`) | ✅ | ❌ | ✅ | ✅ |
| `confusable(a, b)` | UTS #39 confusable-skeleton match | ✅ | ❌ | ✅ | ✅ |
| `suspicious(text)` | flag mixed-script / spoof-prone text | ✅ | ❌ | ✅ | ✅ |

## Locale-aware parsing (inverse formatters)

| Method | Purpose | PHP | JS | Py | Java |
|---|---|:--:|:--:|:--:|:--:|
| `parseNumber(text)` | locale string → number | ✅ | ❌ | ✅ | ✅ |
| `parseMoney(text)` | → amount + currency | ✅ | ❌ | ✅ | ✅ |
| `parseDate(text, width?)` | inverse of `date()` | ✅ | ❌ | ✅ | ✅ |
| `parseMoment(text, pattern)` | inverse of `formatMoment()` | ✅ | ❌ | ✅ | ✅ |

`Intl` is format-only, so the whole parsing family is JS-blocked.

## Negotiation, indexing & names

| Method | Purpose | PHP | JS | Py | Java |
|---|---|:--:|:--:|:--:|:--:|
| `bestMatch(supported)` | CLDR-distance pick of *your* locales | ❌ | ❌ | ✅ | ✅ |
| `indexBuckets(names)` | `AlphabeticIndex` section headers | ❌ | ❌ | ✅ | ✅ |
| `personName(fields, length?, formality?)` | locale-correct person names | ❌ | ❌ | ❌ | ✅ |

## Raw ICU services

| Method | Purpose | PHP | JS | Py | Java |
|---|---|:--:|:--:|:--:|:--:|
| `get(bundle, ...path)` | raw `ResourceBundle` lookup | ✅ | ❌ | ✅ | ✅ |
