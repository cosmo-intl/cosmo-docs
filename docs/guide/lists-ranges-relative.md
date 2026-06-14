# Lists, ranges & relative time

The newer conveniences: joining lists, formatting ranges, and directed
("relative") durations. Availability varies — see the callouts.

## Lists

Join items with the locale's list conventions. Available in **all three ports**.

=== "PHP"

    ```php
    $en = new Cosmo('en');
    $en->join(['A', 'B', 'C']);                 // "A, B, and C"
    $en->join(['A', 'B', 'C'], 'disjunction');  // "A, B, or C"
    new Cosmo('es')->join(['uno', 'dos', 'tres']); // "uno, dos y tres"
    ```

=== "JavaScript"

    ```js
    const en = new Cosmo("en");
    en.join(["A", "B", "C"]);                   // "A, B, and C"
    en.join(["A", "B", "C"], "disjunction");    // "A, B, or C"
    new Cosmo("es").join(["uno", "dos", "tres"]); // "uno, dos y tres"
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

=== "Python"

    ```python
    Cosmo("en").number_range(3, 5)                  # "3–5"
    Cosmo("en_US").money_range(3, 5, "USD")         # "$3.00 – $5.00"
    Cosmo("en").date_range(start, end)              # "Feb 2 – 5, 2020"
    ```

!!! info "Ranges are JavaScript & Python only"
    `numberRange` / `moneyRange` / `dateRange` use ICU's `formatRange`, which PHP's
    `ext-intl` does not bind. (Python reaches it through PyICU.)

## Relative / directed duration

A **directed** duration carries a past/future orientation — the counterpart of the
undirected [`duration()`](dates-times.md#duration).

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    c.relativeDuration(-3, "day");       // "3 days ago"
    c.relativeDuration(2, "hour");       // "in 2 hours"

    // Largest sensible unit between two moments:
    c.relativeDurationBetween(target, reference);  // e.g. "in 5 days"
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    c.relative_duration(-3, "day")       # "3 days ago"
    c.relative_duration(2, "hour")       # "in 2 hours"

    # Largest sensible unit between two moments:
    c.relative_duration_between(target, reference)  # e.g. "in 5 days"
    ```

!!! info "Relative time is JavaScript & Python only"
    `relativeDuration` / `relativeDurationBetween` wrap ICU's relative-time
    formatter, which PHP's `ext-intl` does not expose. ICU/`Intl` produce
    **single-unit** relative text only (no "3 days, 5 hours ago"). For an
    undirected span available everywhere, use [`duration()`](dates-times.md#duration).
