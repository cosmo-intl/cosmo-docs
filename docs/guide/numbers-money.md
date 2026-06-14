# Numbers & money

All number and currency formatting follows the locale's conventions — decimal and
grouping separators, digit shaping, currency placement — straight from ICU. This
page has two halves: plain [**Numbers**](#numbers) (decimals, percentages, units,
notation, and spelled-out forms) and [**Money and currency**](#money-and-currency).

## Numbers

Every numeric method shapes its output for the instance locale: the grouping and
decimal separators, the digit set (Western `0-9`, Arabic-Indic `٠-٩`, Devanagari
`०-९`, …), and the sign and percent placement all come from CLDR. You never format
digits by hand.

### Decimals, percentages & units

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
    `number()`, `percentage()`, and `money()` accept an options bag with the
    portable keys `minimumFractionDigits`, `maximumFractionDigits`,
    `minimum`/`maximumSignificantDigits`, `roundingMode`, `roundingIncrement`, and
    `useGrouping` — identical in all four ports, with a `halfExpand` rounding
    default. (Java passes a `Map<String, Object>` with the same camelCase keys.)
    The keys stay `camelCase` even in Python so the same config travels between
    languages unchanged — see [Terminology](terminology.md#naming-conventions).

### Scientific & compact notation

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

### Spelled-out & ordinal numbers

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

## Money and currency

A *money* value is an amount plus a currency. `money()` formats the pair using the
locale's symbol, placement, grouping, and — crucially — the **currency's own minor
units**: most currencies show two fraction digits, JPY shows none, and a few (e.g.
BHD) show three. Cosmo only *formats* a value; it never converts between currencies.

### Formatting an amount

=== "JavaScript"

    ```js
    new Cosmo("en-US").money(12.3, "AUD");    // "A$12.30"
    new Cosmo("en-AU").money(1234.5, "AUD");  // "$1,234.50"  (code required)
    ```

=== "Java"

    ```java
    new Cosmo("en_US").money(12.3, "AUD");    // "A$12.30"
    new Cosmo("en_AU").money(1234.5);         // "$1,234.50"  (inferred from region)
    ```

=== "PHP"

    ```php
    new Cosmo('en_US')->money(12.3, 'AUD');   // "A$12.30"
    new Cosmo('en_AU')->money(1234.5);        // "$1,234.50"  (inferred from region)
    ```

=== "Python"

    ```python
    Cosmo("en_US").money(12.3, "AUD")         # "A$12.30"
    Cosmo("en_AU").money(1234.5)              # "$1,234.50"  (inferred from region)
    ```

The currency is resolved in this order: an **explicit code** passed to `money()`,
then the **`currency` modifier** set on the instance, then (where supported) the
locale **region**. The symbol is the locale's disambiguated form — `en_US` writes
Australian dollars as `A$`, not the ambiguous `$`. Amounts are rounded to the
currency's minor units (`halfExpand` by default), and the rounding/grouping
[options bag](#decimals-percentages-units) applies here too.

!!! info "Region → currency inference differs"
    **PHP, Python, and Java infer** the currency from the locale's region when you
    omit a code (`Cosmo("en_AU").money(100)` → `$100.00`). **JavaScript does not** —
    its `Intl`-only design forbids a region→currency mapping, so `money()` returns
    `""` unless you pass a code or set the `currency` modifier. This is a capability
    difference, not an error; see [Platform notes](../platform-notes.md).

### Currency names & symbols

To display a currency on its own — its localised **name** or **symbol**, with no
amount attached — use `currency()`:

=== "JavaScript"

    ```js
    const c = new Cosmo("en-US");
    c.currency("AUD");              // "Australian Dollar"
    c.currency("AUD", true);        // "A$"
    ```

=== "Java"

    ```java
    Cosmo c = new Cosmo("en_US");
    c.currency("AUD");                  // "Australian Dollar"
    c.currency("AUD", true, false);     // "A$"   (symbol, strict)
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en_US');
    $c->currency('AUD');            // "Australian Dollar"
    $c->currency('AUD', true);      // "A$"   (disambiguated symbol)
    ```

=== "Python"

    ```python
    c = Cosmo("en_US")
    c.currency("AUD")               # "Australian Dollar"
    c.currency("AUD", True)         # "A$"
    ```

`currency()` is part of the wider [locale metadata](locale-metadata.md#currency-name-symbol)
family (alongside `language()`, `country()`, and friends) — that page covers it in
full, including the strict-symbol behaviour.
