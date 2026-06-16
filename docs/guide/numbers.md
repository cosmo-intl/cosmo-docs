---
description: Format decimals, percentages, units, scientific and compact notation, and ordinal or spelled-out numbers in any locale with Cosmo — with a full reference for the rounding and grouping options.
---

# Numbers

Format decimals, percentages, units, scientific and compact notation, and
spelled-out or ordinal forms — all in the locale's conventions, straight from ICU.
For currency amounts, see [Money & currency](money.md).

Every numeric method shapes its output for the instance locale: the grouping and
decimal separators, the digit set (Western `0-9`, Arabic-Indic `٠-٩`, Devanagari
`०-९`, …), and the sign and percent placement all come from CLDR. **You never
format digits by hand** — that is the whole point. The job of this page is to show
you which method to reach for, and exactly which knobs each one exposes.

## Method overview

| Method | Use it for | Returns |
|---|---|---|
| `number(value, options?)` | A plain decimal in the locale's style | `"123.400,5"` |
| `percentage(value, precision?, options?)` | A **fraction** rendered as a percent | `"20%"` |
| `unit(category, unit, value, width?)` | A measurement with its localised unit | `"2.19 gigabytes"` |
| `compact(value, width?)` | A short magnitude for large numbers | `"1.2K"` / `"1.2 thousand"` |
| `scientific(value)` | Exponential notation | `"1.2345E4"` |
| `spellout(value)` | A number written out in words | `"one hundred twenty"` |
| `ordinal(value)` | Ordinal **text** | `"2nd"` |
| `symbol(name)` | A single locale notation symbol | `"٫"` (Persian decimal mark) |

All of `number()`, `percentage()`, and [`money()`](money.md) accept the same
[options bag](#number-formatting-options); the rest take simple positional
arguments described inline.

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

**`number()`** formats a plain decimal in the locale's style — note how `de` swaps
the roles of `.` and `,`. Pass the [options bag](#number-formatting-options) to
control rounding, fraction digits, and grouping.

**`percentage()`** takes a **fraction**, not a pre-multiplied percent: `0.2` →
`20%`. The optional second argument is the maximum fraction digits (default `3`),
so `percentage(0.1234, 1)` → `"12.3%"`. Anything you can pass `number()` you can
also pass as a third options argument; an explicit `maximumFractionDigits` there
overrides the `precision` shortcut.

**`unit()`** pairs a measurement *type* and *unit* with a value and an optional
[width](terminology.md#core-objects). The type/unit names are the CLDR identifiers
(`digital`/`gigabyte`, `temperature`/`celsius`, `length`/`meter`, …). The width
selects verbosity:

| `width` | Example (`celsius`, 26) | Notes |
|---|---|---|
| `none` / `long` / `full` | `26 degrees Celsius` | Spelled-out unit name (the default is `full`/`long`) |
| `medium` | `26°C` | "short" ICU display |
| `short` | `26°C` | "narrow" ICU display — tightest |

!!! tip "Finding valid unit identifiers"
    `unit()` accepts the ECMA-402 sanctioned units only. List the ones your runtime
    supports with [`supportedValues("unit")`](locale-metadata.md) and pass them as
    the `unit` argument. The `category` argument (`"digital"`, `"temperature"`, …)
    is descriptive grouping — ICU does not require it to match, but keeping it
    accurate documents intent.

### Number-formatting options

`number()`, `percentage()`, and [`money()`](money.md) accept an **options bag** —
the same keys in every port, even `camelCase` in Python, so one JSON config travels
between languages unchanged (see [Terminology](terminology.md#naming-conventions)).
Java passes a `Map<String, Object>` with the same camelCase keys.

The default rounding mode is `halfExpand` (round half away from zero — the everyday
"round 0.5 up" rule) in all four ports.

| Key | Type / values | What it does |
|---|---|---|
| `minimumIntegerDigits` | int | Zero-pads the whole part (`5` → `"005"` at `3`). |
| `minimumFractionDigits` | int | Pads the fraction with trailing zeros up to N places. |
| `maximumFractionDigits` | int | Rounds the fraction to at most N places. |
| `minimumSignificantDigits` | int | Keep at least N significant digits. |
| `maximumSignificantDigits` | int | Round to at most N significant digits. |
| `roundingMode` | `ceil` · `floor` · `expand` · `trunc` · `halfExpand` · `halfTrunc` · `halfEven` | How the last kept digit is rounded. Portable across all ports. |
| `roundingIncrement` | `1,2,5,10,20,25,50,100,…,5000` | Round to a multiple (e.g. `25` → nearest 0.25 with 2 fraction digits — "nickel rounding"). |
| `useGrouping` | `always` · `auto` · `min2` · `true`/`false` | Thousands separators. PHP/Python coerce any truthy value to "on"; JS honours the full set. |

!!! note "Significant vs fraction digits"
    ICU treats significant-digit limits and fraction-digit limits as **mutually
    exclusive**. Set one *or* the other, not both — significant digits win where
    both are supplied.

The following keys are **JavaScript-only**. The PHP and Python ports use a legacy
ICU formatter that has no equivalent attribute, so they accept the keys silently
but ignore them. Use the dedicated [`compact()`](#compact-scientific-notation) /
[`scientific()`](#compact-scientific-notation) methods for those notations in
every port.

| Key (JS only) | Values | What it does |
|---|---|---|
| `signDisplay` | `auto` · `always` · `exceptZero` · `negative` · `never` | When to show the sign. |
| `trailingZeroDisplay` | `auto` · `stripIfInteger` | Drop `.00` on whole values. |
| `roundingPriority` | `auto` · `morePrecision` · `lessPrecision` | Resolve fraction vs significant conflicts. |
| `notation` | `standard` · `scientific` · `engineering` · `compact` | Inline notation switch. |
| `compactDisplay` | `short` · `long` | Only with `notation: "compact"`. |

#### Options in practice

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    c.number(1234.5, { minimumFractionDigits: 2 });          // "1,234.50"
    c.number(1234.567, { maximumFractionDigits: 2 });        // "1,234.57"
    c.number(2.005, { maximumFractionDigits: 2,
                      roundingMode: "halfEven" });           // "2"  (banker's)
    c.number(1234.5, { useGrouping: false });                // "1234.5"
    c.percentage(0.1234, 1);                                 // "12.3%"
    ```

=== "Java"

    ```java
    Cosmo c = new Cosmo("en");
    c.number(1234.5, Map.of("minimumFractionDigits", 2));    // "1,234.50"
    c.number(1234.567, Map.of("maximumFractionDigits", 2));  // "1,234.57"
    c.number(2.005, Map.of("maximumFractionDigits", 2,
                           "roundingMode", "halfEven"));      // "2"
    c.number(1234.5, Map.of("useGrouping", false));          // "1234.5"
    c.percentage(0.1234, 1);                                 // "12.3%"
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $c->number(1234.5, ['minimumFractionDigits' => 2]);      // "1,234.50"
    $c->number(1234.567, ['maximumFractionDigits' => 2]);    // "1,234.57"
    $c->number(2.005, ['maximumFractionDigits' => 2,
                       'roundingMode' => 'halfEven']);        // "2"
    $c->number(1234.5, ['useGrouping' => false]);            // "1234.5"
    $c->percentage(0.1234, 1);                               // "12.3%"
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    c.number(1234.5, {"minimumFractionDigits": 2})           # "1,234.50"
    c.number(1234.567, {"maximumFractionDigits": 2})         # "1,234.57"
    c.number(2.005, {"maximumFractionDigits": 2,
                     "roundingMode": "halfEven"})             # "2"
    c.number(1234.5, {"useGrouping": False})                 # "1234.5"
    c.percentage(0.1234, 1)                                  # "12.3%"
    ```

## Compact & scientific notation

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

`compact()` shortens large magnitudes for dashboards, social counters, and tight
columns. The width chooses between the **symbol** form (`short`, the default —
`1.2K`) and the **spelled scale word** (`long`/`full` — `1.2 thousand`), both
fully localised (German `1,2 Tsd.`, Japanese `1.2万`). `scientific()` renders
exponential notation at full double precision.

!!! info "`compact()` and `scientific()` work everywhere"
    Both are available in **all four ports**. PHP reaches compact notation through
    an ICU compact-notation style its `ext-intl` binding accepts even though it
    isn't a named constant; the others use the modern ICU `NumberFormatter`.

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

`spellout()` writes a number out in words (cheques, accessibility, voice UIs);
`ordinal()` gives the ordinal **text** (`1st`, `2nd`, `3rd`, localised). `symbol()`
returns a single locale notation symbol by name (`decimal`, `group`, `percent`,
`minusSign`, `plusSign`, `nan`, `infinity`, `currency`) — useful when you compose a
number inside a custom template and need just the separator.

!!! info "`spellout()` / `ordinal()` are PHP, Python & Java"
    Spelling numbers out and ordinal **text** ("1st", "2nd") come from ICU's
    rule-based number formatter (RBNF), which the JavaScript `Intl` API does not
    expose — so these three tabs omit JS. For the ordinal *plural category* (which
    JS does have, e.g. to pick "1st" vs "2nd" wording yourself), see
    [Messages & plurals](messages-plurals.md). `symbol()` likewise accepts a wider
    set of names in PHP/Python/Java than the JS `Intl`-exposed set.

## Practical examples

**A file-size display.** Pick the unit by magnitude, then format with the
`digital` category at a tight width:

=== "JavaScript"

    ```js
    function fileSize(c, bytes) {
      if (bytes < 1024) return c.unit("digital", "byte", bytes, "short");
      const mb = bytes / 1_048_576;
      return c.unit("digital", "megabyte", Number(mb.toFixed(1)), "short");
    }
    fileSize(new Cosmo("en"), 5_242_880);   // "5 MB"
    ```

=== "PHP"

    ```php
    function fileSize(Cosmo $c, int $bytes): string {
      if ($bytes < 1024) return $c->unit('digital', 'byte', $bytes, 'short');
      $mb = round($bytes / 1048576, 1);
      return $c->unit('digital', 'megabyte', $mb, 'short');
    }
    fileSize(new Cosmo('en'), 5242880);     // "5 MB"
    ```

=== "Python"

    ```python
    def file_size(c, num_bytes):
        if num_bytes < 1024:
            return c.unit("digital", "byte", num_bytes, "short")
        mb = round(num_bytes / 1_048_576, 1)
        return c.unit("digital", "megabyte", mb, "short")

    file_size(Cosmo("en"), 5_242_880)       # "5 MB"
    ```

**A percentage with a guaranteed decimal.** Combine the `precision` shortcut with
an options bag to also pin a minimum:

=== "JavaScript"

    ```js
    new Cosmo("en").percentage(0.5, 2, { minimumFractionDigits: 2 }); // "50.00%"
    ```

=== "PHP"

    ```php
    new Cosmo('en')->percentage(0.5, 2, ['minimumFractionDigits' => 2]); // "50.00%"
    ```

=== "Python"

    ```python
    Cosmo("en").percentage(0.5, 2, {"minimumFractionDigits": 2})  # "50.00%"
    ```

**"Nickel rounding" with `roundingIncrement`.** Round a price to the nearest 0.05:

=== "JavaScript"

    ```js
    new Cosmo("en").number(2.13, { maximumFractionDigits: 2,
                                   roundingIncrement: 5,
                                   minimumFractionDigits: 2 });  // "2.15"
    ```

=== "PHP"

    ```php
    new Cosmo('en')->number(2.13, ['maximumFractionDigits' => 2,
                                   'roundingIncrement' => 5,
                                   'minimumFractionDigits' => 2]); // "2.15"
    ```

=== "Python"

    ```python
    Cosmo("en").number(2.13, {"maximumFractionDigits": 2,
                              "roundingIncrement": 5,
                              "minimumFractionDigits": 2})  # "2.15"
    ```