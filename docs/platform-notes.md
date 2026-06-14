# Platform notes

The three ports share one API but reach ICU through different doors, so their
feature sets differ slightly at the edges. This page is the quick "what can I use
where" reference; for the exhaustive matrix, see [Feature parity](parity.md).

## The short version

| | Reaches ICU via | Completeness |
|---|---|---|
| **Python** | PyICU (ICU C++ bindings) | **most complete** — union of PHP + JS |
| **PHP** | `ext-intl` (+ raw `ResourceBundle`, RBNF) | everything except 4 newer ICU formatters |
| **JavaScript** | the standard `Intl` API | everything except 5 raw-ICU features |

Everything in the **[Guide](guide/locale-metadata.md)** without a callout works in
all three. The exceptions are below.

## PHP can't do (no `ext-intl` API)

These rely on newer ICU formatters PHP's extension never surfaced. All are
available in **JavaScript and Python**:

- `compact()` — compact notation (`1.2K`)
- `numberRange()` / `moneyRange()` / `dateRange()` — range formatting
- `relativeDuration()` / `relativeDurationBetween()` — directed/relative durations

(`addLikelySubtags()` / `removeLikelySubtags()` used to be on this list: `ext-intl`
lacks them too, but the PHP port reimplements the CLDR likely-subtags algorithm
over ICU's own `likelySubtags` resource table, so all three ports now have them.)

## JavaScript can't do (not in `Intl`)

`Intl` is a curated subset of ICU, so the raw-ICU features are **intentionally
omitted, not faked**. All are available in **PHP and Python**:

- `spellout()` — spell a number out ("one hundred twenty")
- `ordinal()` — ordinal **text** ("1st", "2nd") *(the ordinal plural **category** is available everywhere via [`pluralCategory()`](guide/messages-plurals.md#plural-category))*
- `quote()` — wrap text in the locale's quotation marks
- `get()` — raw ICU `ResourceBundle` access
- `formatMoment()` — arbitrary ICU date/time patterns

JavaScript also **does not infer a currency from the region**: `money()` requires
an explicit currency code or the `currency` modifier (PHP and Python infer it).

## Two Python quirks

Python is the most complete port, but PyICU's bindings have two small limitations
(documented in the Python README):

- **`week_info()` omits the weekend days.** PyICU 2.16 doesn't bind ICU's
  `getDayOfWeekType` / `isWeekend`, and the no-hardcoded-data rule forbids a
  fallback table — so it returns `first_day` + `minimal_days` only. (PHP returns
  the weekend too.)
- **`relative_duration(numeric="auto")` returns the numeric form** (`"1 day ago"`,
  not `"yesterday"`) — PyICU doesn't cleanly expose ICU's "auto" word-forms. The
  result is always correct, just not colloquial.

## Why omit instead of polyfill?

Every port follows the same rule: **if its runtime's ICU can't produce a result,
the feature is left out — never reimplemented from a hardcoded table.** That's
what keeps all three correct and maintenance-free as CLDR/ICU data evolves, and
it's why the gaps above are by-design boundaries rather than bugs or backlog.
