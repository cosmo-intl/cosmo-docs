# Lists, ranges & relative time

Joining lists, formatting ranges, and directed ("relative") durations. As of
**PHP v3** these all work in every port — PHP reconstructs the few formatters
`ext-intl` doesn't bind from live CLDR data (with two small caveats, noted below).

## Lists

Join items with the locale's list conventions. Available in **all four ports**.

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

Type: `conjunction` (and, default), `disjunction` (or), or `unit`.

## Number, money & date ranges

=== "JavaScript"

    ```js
    new Cosmo("en").numberRange(3, 5);              // "3–5"
    new Cosmo("en-US").moneyRange(3, 5, "USD");     // "$3.00 – $5.00"
    new Cosmo("en").dateRange(start, end);          // "Feb 2 – 5, 2020"
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
    new Cosmo('en')->dateRange($start, $end);       // "Feb 2 – 5, 2020"
    ```

=== "Python"

    ```python
    Cosmo("en").number_range(3, 5)                  # "3–5"
    Cosmo("en_US").money_range(3, 5, "USD")         # "$3.00 – $5.00"
    Cosmo("en").date_range(start, end)              # "Feb 2 – 5, 2020"
    ```

!!! info "Two PHP caveats"
    `numberRange` / `moneyRange` / `dateRange` use ICU's `formatRange` in JS,
    Python, and Java. PHP reconstructs them from CLDR data, with two differences:

    - **`moneyRange()` is approximate** — it doesn't collapse the shared currency
      symbol or pad the separator (`$3.00–$5.00` vs ICU's `$3.00 – $5.00`).
    - **`dateRange()` supports `short`/`medium` only** (long/full interval skeletons
      aren't reachable from `ext-intl`).

## Relative / directed duration

A **directed** duration carries a past/future orientation — the counterpart of the
undirected [`duration()`](dates-times.md#duration).

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    c.relativeDuration(-3, "day");       // "3 days ago"
    c.relativeDuration(2, "hour");       // "in 2 hours"
    c.relativeDuration(-1, "day", "auto"); // "yesterday"

    c.relativeDurationBetween(target, reference);  // e.g. "in 5 days"
    ```

=== "Java"

    ```java
    Cosmo c = new Cosmo("en");
    c.relativeDuration(-3, "day");       // "3 days ago"
    c.relativeDuration(2, "hour");       // "in 2 hours"
    c.relativeDuration(-1, "day", "auto"); // "yesterday"

    c.relativeDurationBetween(target, reference);  // e.g. "in 5 days"
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $c->relativeDuration(-3, 'day');       // "3 days ago"
    $c->relativeDuration(2, 'hour');       // "in 2 hours"
    $c->relativeDuration(-1, 'day', 'auto'); // "yesterday"  (word form)

    $c->relativeDurationBetween($target, $reference);  // e.g. "in 5 days"
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    c.relative_duration(-3, "day")       # "3 days ago"
    c.relative_duration(2, "hour")       # "in 2 hours"
    c.relative_duration(-1, "day", "auto") # "1 day ago"  (numeric — see note)

    c.relative_duration_between(target, reference)  # e.g. "in 5 days"
    ```

!!! info "Port notes"
    `relativeDuration` / `relativeDurationBetween` are in **all four ports**.
    ICU/`Intl` produce **single-unit** relative text only (no "3 days, 5 hours
    ago"). The `numeric: "auto"` word-forms ("yesterday", "last week") work in PHP,
    JavaScript, and Java; **Python falls back to the numeric form** (`"1 day ago"`)
    because PyICU doesn't cleanly expose them — always correct, just not colloquial.
    **PHP accepts only singular unit names** (`"day"`, `"hour"`, …) — plural forms
    (`"days"`) are not accepted, consistent with the Python and Java ports.
    For an undirected span, use [`duration()`](dates-times.md#duration).
