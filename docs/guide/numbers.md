---
description: Format decimals, percentages, units, scientific and compact notation, and ordinal or spelled-out numbers in any locale with Cosmo.
---

# Numbers

Format decimals, percentages, units, scientific and compact notation, and
spelled-out or ordinal forms — all in the locale's conventions, straight from ICU.
For currency amounts, see [Money & currency](money.md).

Every numeric method shapes its output for the instance locale: the grouping and
decimal separators, the digit set (Western `0-9`, Arabic-Indic `٠-٩`, Devanagari
`०-९`, …), and the sign and percent placement all come from CLDR. You never format
digits by hand.

## Decimals, percentages & units

=== "JavaScript"

    ```js
    new Cosmo("de").number(123400.5);               // "123.400,5"
    new Cosmo("en").percentage(0.2);                // "20%"
    new Cosmo("en").unit("digital", "gigabyte", 2.19); // "2.19 gigabytes"
    new Cosmo("tr").unit("temperature", "celsius", 26, "short"); // "26°C"
    ```

=== "Java"

    ```java
    new Cosmo("de").number(123400.5);               // "123.400,5"
    new Cosmo("en").percentage(0.2);                // "20%"
    new Cosmo("en").unit("digital", "gigabyte", 2.19); // "2.19 gigabytes"
    new Cosmo("tr").unit("temperature", "celsius", 26, "short"); // "26°C"
    ```

=== "PHP"

    ```php
    new Cosmo('de')->number(123400.5);              // "123.400,5"
    new Cosmo('en')->percentage(0.2);               // "20%"
    new Cosmo('en')->unit('digital', 'gigabyte', 2.19); // "2.19 gigabytes"
    new Cosmo('tr')->unit('temperature', 'celsius', 26, 'short'); // "26°C"
    ```

=== "Python"

    ```python
    Cosmo("de").number(123400.5)                    # "123.400,5"
    Cosmo("en").percentage(0.2)                     # "20%"
    Cosmo("en").unit("digital", "gigabyte", 2.19)   # "2.19 gigabytes"
    Cosmo("tr").unit("temperature", "celsius", 26, "short")  # "26°C"
    ```

- **`number()`** formats a plain decimal in the locale's style — note how `de`
  swaps the roles of `.` and `,`.
- **`percentage()`** takes a **fraction**, not a pre-multiplied percent: `0.2` →
  `20%`. An optional second argument sets the precision.
- **`unit()`** pairs a measurement *type* and *unit* with a value and an optional
  [width](terminology.md#core-objects) (`none` · `short` · `medium` · `long` ·
  `full`) — `short` gives `26°C`, the default `long` gives `2.19 gigabytes`. The
  type/unit names are the CLDR identifiers (`digital`/`gigabyte`,
  `temperature`/`celsius`, `length`/`meter`, …).

!!! tip "Rounding & grouping options"
    `number()`, `percentage()`, and [`money()`](money.md) accept an options bag with
    the portable keys `minimumFractionDigits`, `maximumFractionDigits`,
    `minimum`/`maximumSignificantDigits`, `roundingMode`, `roundingIncrement`, and
    `useGrouping` — identical in all four ports, with a `halfExpand` rounding
    default. (Java passes a `Map<String, Object>` with the same camelCase keys.)
    The keys stay `camelCase` even in Python so the same config travels between
    languages unchanged — see [Terminology](terminology.md#naming-conventions).

## Scientific & compact notation

=== "JavaScript"

    ```js
    new Cosmo("en").scientific(12345);    // "1.2345E4"
    new Cosmo("en").compact(1200);        // "1.2K"
    new Cosmo("en").compact(1200, "long");// "1.2 thousand"
    ```

=== "Java"

    ```java
    new Cosmo("en").scientific(12345);    // "1.2345E4"
    new Cosmo("en").compact(1200);        // "1.2K"
    new Cosmo("en").compact(1200, "long");// "1.2 thousand"
    ```

=== "PHP"

    ```php
    new Cosmo('en')->scientific(12345);   // "1.2345E4"
    new Cosmo('en')->compact(1200);       // "1.2K"
    new Cosmo('en')->compact(1200, 'long');// "1.2 thousand"
    ```

=== "Python"

    ```python
    Cosmo("en").scientific(12345)         # "1.2345E4"
    Cosmo("en").compact(1200)             # "1.2K"
    Cosmo("en").compact(1200, "long")     # "1.2 thousand"
    ```

`compact()` shortens large magnitudes — `short` (default) gives the symbol form
(`1.2K`), `long` spells the scale word (`1.2 thousand`), both localised.
`scientific()` renders exponential notation.

!!! info "`compact()` works everywhere now"
    Compact notation (`1.2K`, `1.2 thousand`) is available in **all four ports**.
    PHP reaches it through an ICU compact-notation style its `ext-intl` binding
    accepts even though it isn't exposed as a named constant; the others use the
    modern ICU `NumberFormatter`. `scientific()` is likewise universal.

## Spelled-out & ordinal numbers

=== "Java"

    ```java
    new Cosmo("en").spellout(120);    // "one hundred twenty"
    new Cosmo("en").ordinal(2);       // "2nd"
    new Cosmo("fa").symbol("decimal");// "٫"
    ```

=== "PHP"

    ```php
    new Cosmo('en')->spellout(120);   // "one hundred twenty"
    new Cosmo('en')->ordinal(2);      // "2nd"
    new Cosmo('fa')->symbol('decimal'); // "٫"
    ```

=== "Python"

    ```python
    Cosmo("en").spellout(120)         # "one hundred twenty"
    Cosmo("en").ordinal(2)            # "2nd"
    Cosmo("fa").symbol("decimal")     # "٫"
    ```

`spellout()` writes a number out in words; `ordinal()` gives the ordinal **text**
(`1st`, `2nd`, `3rd`). `symbol()` returns a single locale notation symbol by name
(`decimal`, `group`, `percent`, …) — handy when you render numbers in a custom
template.

!!! info "`spellout()` / `ordinal()` are PHP, Python & Java"
    Spelling numbers out and ordinal **text** ("1st", "2nd") come from ICU's
    rule-based number formatter (RBNF), which the JavaScript `Intl` API does not
    expose — so these three tabs omit JS. For the ordinal *plural category* (which
    JS does have), see [Messages & plurals](messages-plurals.md). `symbol()`
    likewise accepts a wider set of names in PHP/Python/Java than JS exposes.
