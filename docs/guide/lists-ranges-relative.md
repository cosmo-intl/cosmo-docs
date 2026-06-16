---
description: Join lists, format number/money/date ranges, and produce relative ("3 days ago") durations across all four Cosmo ports — with type, width, and direction options.
---

# Lists, ranges & relative time

Joining lists, formatting ranges, and directed ("relative") durations. As of
**PHP v3** these all work in every port — PHP reconstructs the few formatters
`ext-intl` doesn't bind from live CLDR data (with two small caveats, noted below).

| Method | Use it for |
|---|---|
| `join(items, type?, width?)` | "A, B, and C" with the locale's list grammar |
| `numberRange` / `moneyRange` / `dateRange` | A low–high interval (`"3–5"`, `"$3 – $5"`) |
| `relativeDuration(amount, unit, numeric?)` | "3 days ago" / "in 2 hours" from a signed amount |
| `relativeDurationBetween(target, reference?, numeric?)` | The same, computed between two moments |

## Lists

`join()` glues items with the locale's list conventions — and crucially the *type*
of list changes the connector word ("and" vs "or"):

| `type` | English | Spanish |
|---|---|---|
| `conjunction` (default) | `A, B, and C` | `A, B y C` |
| `disjunction` | `A, B, or C` | `A, B o C` |
| `unit` | `A, B, C` (no connector — for measurements) | `A, B, C` |

The `width` argument (`full`/`long`, `medium`/`short`, `short`/`narrow`) controls
spacing and the connector's verbosity.

=== "JavaScript"

    ```js
    const en = new Cosmo("en");
    en.join(["A", "B", "C"]);                   // "A, B, and C"
    en.join(["A", "B", "C"], "disjunction");    // "A, B, or C"
    new Cosmo("es").join(["uno", "dos", "tres"]); // "uno, dos y tres"
    ```

=== "Java"

    ```java
    Cosmo en = new Cosmo("en");
    en.join(List.of("A", "B", "C"));                  // "A, B, and C"
    en.join(List.of("A", "B", "C"), "disjunction");   // "A, B, or C"
    new Cosmo("es").join(List.of("uno", "dos", "tres")); // "uno, dos y tres"
    ```

=== "PHP"

    ```php
    $en = new Cosmo('en');
    $en->join(['A', 'B', 'C']);                 // "A, B, and C"
    $en->join(['A', 'B', 'C'], 'disjunction');  // "A, B, or C"
    new Cosmo('es')->join(['uno', 'dos', 'tres']); // "uno, dos y tres"
    ```

=== "Python"

    ```python
    en = Cosmo("en")
    en.join(["A", "B", "C"])                    # "A, B, and C"
    en.join(["A", "B", "C"], "disjunction")     # "A, B, or C"
    Cosmo("es").join(["uno", "dos", "tres"])    # "uno, dos y tres"
    ```

Available in **all four ports**.

## Number, money & date ranges

A range formats two endpoints as a single interval, collapsing the shared parts
(`"Feb 2 – 5, 2020"`, not "Feb 2, 2020 – Feb 5, 2020"). Each mirrors a single-value
formatter on this site:

| Method | Mirrors | Signature |
|---|---|---|
| `numberRange(start, end)` | [`number()`](numbers.md) | two numbers |
| `moneyRange(start, end, code?)` | [`money()`](money.md) | two amounts + currency |
| `dateRange(start, end, dateWidth?, timeWidth?)` | [`date()`](dates-times.md) | two moments + widths |

`dateRange()` defaults to **`medium`** date width (short numeric dates read poorly
as a range) and `none` time width.

=== "JavaScript"

    ```js
    new Cosmo("en").numberRange(3, 5);              // "3–5"
    new Cosmo("en-US").moneyRange(3, 5, "USD");     // "$3.00 – $5.00"
    new Cosmo("en").dateRange(start, end);          // "Feb 2 – 5, 2020"
    new Cosmo("en").dateRange(start, end, "long");  // "February 2 – 5, 2020"
    ```

=== "Java"

    ```java
    new Cosmo("en").numberRange(3, 5);              // "3–5"
    new Cosmo("en_US").moneyRange(3, 5, "USD");     // "$3.00 – $5.00"
    new Cosmo("en").dateRange(start, end);          // "Feb 2 – 5, 2020"
    ```

=== "PHP"

    ```php
    new Cosmo('en')->numberRange(3, 5);             // "3–5"
    new Cosmo('en_US')->moneyRange(3, 5, 'USD');    // "$3.00–$5.00"  (approximate)
    new Cosmo('en')->dateRange($start, $end);       // "Feb 2 – 5, 2020"  (short/medium)
    ```

=== "Python"

    ```python
    Cosmo("en").number_range(3, 5)                  # "3–5"
    Cosmo("en_US").money_range(3, 5, "USD")         # "$3.00 – $5.00"
    Cosmo("en").date_range(start, end)              # "Feb 2 – 5, 2020"
    ```

Like [`money()`](money.md), `moneyRange()` returns `""` when no currency is
resolved and takes the currency from the `currency` modifier if you omit the code.

!!! info "Two PHP caveats"
    `numberRange` / `moneyRange` / `dateRange` use ICU's `formatRange` in JS,
    Python, and Java. PHP reconstructs them from CLDR data, with two differences:

    - **`moneyRange()` is approximate** — it doesn't collapse the shared currency
      symbol or pad the separator (`$3.00–$5.00` vs ICU's `$3.00 – $5.00`).
    - **`dateRange()` supports `short`/`medium` only** (long/full interval skeletons
      aren't reachable from `ext-intl`).

## Relative / directed duration

A **directed** duration carries a past/future orientation — the counterpart of the
undirected [`duration()`](dates-times.md#duration). There are two entry points:

- **`relativeDuration(amount, unit, numeric?)`** — you supply the signed amount and
  unit.
- **`relativeDurationBetween(target, reference?, numeric?)`** — you supply two
  moments; it computes the difference and picks the largest sensible unit.

The **sign** sets the direction: negative is past (`"… ago"`), positive is future
(`"in …"`). The **`unit`** is one of `second`, `minute`, `hour`, `day`, `week`,
`month`, `quarter`, `year` (singular only). The **`numeric`** option chooses between
numeric and colloquial phrasing:

| `numeric` | `relativeDuration(-1, "day", …)` |
|---|---|
| `always` (default for `relativeDuration`) | `"1 day ago"` |
| `auto` (default for `relativeDurationBetween`) | `"yesterday"` |

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    c.relativeDuration(-3, "day");         // "3 days ago"
    c.relativeDuration(2, "hour");         // "in 2 hours"
    c.relativeDuration(-1, "day", "auto"); // "yesterday"

    c.relativeDurationBetween(target);             // vs now → "in 5 days"
    c.relativeDurationBetween(target, reference);   // vs a given moment
    ```

=== "Java"

    ```java
    Cosmo c = new Cosmo("en");
    c.relativeDuration(-3, "day");         // "3 days ago"
    c.relativeDuration(2, "hour");         // "in 2 hours"
    c.relativeDuration(-1, "day", "auto"); // "yesterday"

    c.relativeDurationBetween(target, reference);  // e.g. "in 5 days"
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $c->relativeDuration(-3, 'day');         // "3 days ago"
    $c->relativeDuration(2, 'hour');         // "in 2 hours"
    $c->relativeDuration(-1, 'day', 'auto'); // "yesterday"  (word form)

    $c->relativeDurationBetween($target, $reference);  // e.g. "in 5 days"
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    c.relative_duration(-3, "day")         # "3 days ago"
    c.relative_duration(2, "hour")         # "in 2 hours"
    c.relative_duration(-1, "day", "auto") # "1 day ago"  (numeric — see note)

    c.relative_duration_between(target, reference)  # e.g. "in 5 days"
    ```

`relativeDurationBetween()` computes `target − reference` (with `reference`
defaulting to **now**), then walks up the unit scale — seconds, minutes, hours,
days, weeks, months, years — and formats at the first unit where the amount is
below the next threshold. So a 5-day gap renders as "in 5 days", a 40-day gap as
"in 2 months".

!!! info "Port notes"
    `relativeDuration` / `relativeDurationBetween` are in **all four ports**.
    ICU/`Intl` produce **single-unit** relative text only (no "3 days, 5 hours
    ago"). The `numeric: "auto"` word-forms ("yesterday", "last week") work in PHP,
    JavaScript, and Java; **Python falls back to the numeric form** (`"1 day ago"`)
    because PyICU doesn't cleanly expose them — always correct, just not colloquial.
    **All non-JS ports accept only singular unit names** (`"day"`, not `"days"`).
    For an undirected span, use [`duration()`](dates-times.md#duration).

## Practical examples

**A "posted X ago" timestamp.** Let `relativeDurationBetween()` choose the unit and
the colloquial wording:

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    c.relativeDurationBetween(new Date(Date.now() - 90_000));  // "2 minutes ago"
    c.relativeDurationBetween(new Date(Date.now() - 86_400_000)); // "yesterday"
    ```

=== "Python"

    ```python
    import datetime
    c = Cosmo("en")
    ago = datetime.datetime.now() - datetime.timedelta(minutes=90)
    c.relative_duration_between(ago)   # "2 hours ago"  (numeric form in Python)
    ```

**A localised "and N more" tag list.** Join the visible tags, then append an
overflow phrase built from a plural [message](messages-plurals.md):

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    const tags = ["news", "sport", "tech", "travel", "food"];
    const shown = tags.slice(0, 3);
    const rest = tags.length - shown.length;
    let label = c.join(shown);
    if (rest > 0) {
      label += " " + c.message("and {n, plural, one {# more} other {# more}}", { n: rest });
    }
    // "news, sport, and tech and 2 more"
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $tags = ['news', 'sport', 'tech', 'travel', 'food'];
    $shown = array_slice($tags, 0, 3);
    $rest = count($tags) - count($shown);
    $label = $c->join($shown);
    if ($rest > 0) {
      $label .= ' ' . $c->message('and {n, plural, one {# more} other {# more}}', ['n' => $rest]);
    }
    // "news, sport, and tech and 2 more"
    ```
