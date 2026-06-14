# Numbers & money

All number formatting follows the locale's conventions — decimal and grouping
separators, digit shaping, currency placement — straight from ICU.

## Decimals, percentages, units

=== "PHP"

    ```php
    new Cosmo('de')->number(123400.5);              // "123.400,5"
    new Cosmo('en')->percentage(0.2);               // "20%"
    new Cosmo('en')->unit('digital', 'gigabyte', 2.19); // "2.19 gigabytes"
    new Cosmo('tr')->unit('temperature', 'celsius', 26, 'short'); // "26°C"
    ```

=== "JavaScript"

    ```js
    new Cosmo("de").number(123400.5);               // "123.400,5"
    new Cosmo("en").percentage(0.2);                // "20%"
    new Cosmo("en").unit("digital", "gigabyte", 2.19); // "2.19 gigabytes"
    new Cosmo("tr").unit("temperature", "celsius", 26, "short"); // "26°C"
    ```

=== "Python"

    ```python
    Cosmo("de").number(123400.5)                    # "123.400,5"
    Cosmo("en").percentage(0.2)                     # "20%"
    Cosmo("en").unit("digital", "gigabyte", 2.19)   # "2.19 gigabytes"
    Cosmo("tr").unit("temperature", "celsius", 26, "short")  # "26°C"
    ```

=== "Java"

    ```java
    new Cosmo("de").number(123400.5);               // "123.400,5"
    new Cosmo("en").percentage(0.2);                // "20%"
    new Cosmo("en").unit("digital", "gigabyte", 2.19); // "2.19 gigabytes"
    new Cosmo("tr").unit("temperature", "celsius", 26, "short"); // "26°C"
    ```

`percentage()` takes a fraction (`0.2` → `20%`) and an optional precision.
`unit()` width is one of `none`, `short`, `medium`, `long`, `full`.

!!! tip "Rounding & grouping options"
    `number()`, `percentage()`, and `money()` accept an options bag with the
    portable keys `minimumFractionDigits`, `maximumFractionDigits`,
    `minimum`/`maximumSignificantDigits`, `roundingMode`, `roundingIncrement`, and
    `useGrouping` — identical in all four ports, with a `halfExpand` rounding
    default. (Java passes a `Map<String, Object>` with the same camelCase keys.)

## Money

=== "PHP"

    ```php
    new Cosmo('en_US')->money(12.3, 'AUD');   // "A$12.30"
    new Cosmo('en_AU')->money(1234.5);        // "$1,234.50"  (inferred from region)
    ```

=== "JavaScript"

    ```js
    new Cosmo("en-US").money(12.3, "AUD");    // "A$12.30"
    new Cosmo("en-AU").money(1234.5, "AUD");  // "$1,234.50"  (code required)
    ```

=== "Python"

    ```python
    Cosmo("en_US").money(12.3, "AUD")         # "A$12.30"
    Cosmo("en_AU").money(1234.5)              # "$1,234.50"  (inferred from region)
    ```

=== "Java"

    ```java
    new Cosmo("en_US").money(12.3, "AUD");    // "A$12.30"
    new Cosmo("en_AU").money(1234.5);         // "$1,234.50"  (inferred from region)
    ```

!!! warning "Region → currency inference differs"
    **PHP, Python, and Java infer** the currency from the locale's region when you
    omit a code (`Cosmo("en_AU").money(100)` → `$100.00`). **JavaScript does not** —
    its `Intl`-only design forbids a region→currency mapping, so `money()` returns
    `""` unless you pass a code or set the `currency` modifier. Convert the amount to
    the target currency yourself; this only formats it.

## Scientific & compact notation

=== "PHP"

    ```php
    new Cosmo('en')->scientific(12345);   // "1.2345E4"
    new Cosmo('en')->compact(1200);       // "1.2K"
    new Cosmo('en')->compact(1200, 'long');// "1.2 thousand"
    ```

=== "JavaScript"

    ```js
    new Cosmo("en").scientific(12345);    // "1.2345E4"
    new Cosmo("en").compact(1200);        // "1.2K"
    new Cosmo("en").compact(1200, "long");// "1.2 thousand"
    ```

=== "Python"

    ```python
    Cosmo("en").scientific(12345)         # "1.2345E4"
    Cosmo("en").compact(1200)             # "1.2K"
    Cosmo("en").compact(1200, "long")     # "1.2 thousand"
    ```

=== "Java"

    ```java
    new Cosmo("en").scientific(12345);    // "1.2345E4"
    new Cosmo("en").compact(1200);        // "1.2K"
    new Cosmo("en").compact(1200, "long");// "1.2 thousand"
    ```

!!! info "`compact()` works everywhere now"
    Compact notation (`1.2K`, `1.2 thousand`) is available in **all four ports**.
    PHP reaches it through an ICU compact-notation style its `ext-intl` binding
    accepts even though it isn't exposed as a named constant; the others use the
    modern ICU `NumberFormatter`. `scientific()` is likewise universal.

## Spelled-out & ordinal numbers

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

=== "Java"

    ```java
    new Cosmo("en").spellout(120);    // "one hundred twenty"
    new Cosmo("en").ordinal(2);       // "2nd"
    new Cosmo("fa").symbol("decimal");// "٫"
    ```

!!! info "`spellout()` / `ordinal()` are PHP, Python & Java"
    Spelling numbers out and ordinal **text** ("1st", "2nd") come from ICU's
    rule-based number formatter (RBNF), which the JavaScript `Intl` API does not
    expose — so these three tabs omit JS. For the ordinal *plural category* (which
    JS does have), see [Messages & plurals](messages-plurals.md). `symbol()`
    likewise accepts a wider set of names in PHP/Python/Java than JS exposes.
