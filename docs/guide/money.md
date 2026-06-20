---
description: Format money as amount-plus-currency with the locale's symbol, placement, grouping, and correct minor units using Cosmo's money() — full options and currency-resolution reference.
---

# Money & currency

A *money* value is an amount plus a currency. `money()` formats the pair using the
locale's symbol, placement, grouping, and — crucially — the **currency's own minor
units**: most currencies show two fraction digits, JPY shows none, and a few (e.g.
BHD) show three. Cosmo only *formats* a value; it never converts between currencies.
For plain numbers, percentages, and units, see [Numbers](numbers.md).

!!! warning "Money is not currency conversion"
    `money(100, "AUD")` formats *100 AUD* in the locale's style. It does **not**
    convert 100 of anything into AUD — do the conversion yourself first, then format
    the result. Cosmo bundles no exchange-rate data.

## `money()` at a glance

| Argument | Default | Meaning |
|---|---|---|
| `value` | — | The numeric amount (already in the target currency). |
| `code` / `currency` | the `currency` modifier | ISO 4217 code, e.g. `"AUD"`, `"JPY"`. |
| `precision` | currency's minor units | Override fraction digits (sets both min and max). |
| `strict` | `false` | Throw instead of returning `""` when no currency is resolved. |
| `options` | `{}` | Any [number-formatting option](numbers.md#number-formatting-options). |

In PHP the signature is positional —
`money($value, $currency, $precision, $strict, $pattern, $options)` — and adds a
raw ICU `$pattern` string. In JS/Python `precision` and `strict` live **inside** the
options object; in Java they are passed through the options `Map`. In C# they are
separate named parameters: `Money(value, code, precision, strict, options)`.

## Formatting an amount

=== "JavaScript"

    ```js
    new Cosmo("en-US").money(12.3, "AUD");    // "A$12.30"
    new Cosmo("en-AU").money(1234.5, "AUD");  // "$1,234.50"  (code required)
    new Cosmo("ja-JP").money(1234.5, "JPY");  // "￥1,235"     (no minor units)
    ```

=== "Java"

    ```java
    new Cosmo("en_US").money(12.3, "AUD");    // "A$12.30"
    new Cosmo("en_AU").money(1234.5);         // "$1,234.50"  (inferred from region)
    new Cosmo("ja_JP").money(1234.5, "JPY");  // "￥1,235"
    ```

=== "PHP"

    ```php
    new Cosmo('en_US')->money(12.3, 'AUD');   // "A$12.30"
    new Cosmo('en_AU')->money(1234.5);        // "$1,234.50"  (inferred from region)
    new Cosmo('ja_JP')->money(1234.5, 'JPY'); // "￥1,235"
    ```

=== "Python"

    ```python
    Cosmo("en_US").money(12.3, "AUD")         # "A$12.30"
    Cosmo("en_AU").money(1234.5)              # "$1,234.50"  (inferred from region)
    Cosmo("ja_JP").money(1234.5, "JPY")       # "￥1,235"
    ```

=== "C#"

    ```csharp
    new Cosmo("en-US").Money(12.3, "AUD");    // "A$12.30"
    new Cosmo("en-AU").Money(1234.5);         // "$1,234.50"  (inferred from region)
    new Cosmo("ja-JP").Money(1234.5, "JPY");  // "￥1,235"
    ```

### How the currency is resolved

`money()` looks for a currency in this order, taking the first that is set:

1. an **explicit code** passed to the call;
2. the **`currency` modifier** set on the instance at construction;
3. (PHP, Python, Java, C# only) the locale's **region**, mapped to its currency.

The symbol is always the locale's *disambiguated* form — `en_US` writes Australian
dollars as `A$`, not the ambiguous `$` — so amounts in different currencies never
collide visually. Amounts are rounded to the currency's minor units with the
`halfExpand` default.

!!! info "Region → currency inference differs"
    **PHP, Python, Java, and C# infer** the currency from the locale's region when you
    omit a code (`Cosmo("en_AU").money(100)` → `$100.00`). **JavaScript does not** —
    its `Intl`-only design forbids a region→currency mapping, so `money()` returns
    `""` unless you pass a code or set the `currency` modifier. This is a capability
    difference, not a bug; see [Platform notes](../platform-notes.md).

### Setting a default currency once

If every amount in a context uses the same currency, set it as a modifier and drop
the per-call code:

=== "JavaScript"

    ```js
    const eur = new Cosmo("de-DE", { currency: "EUR" });
    eur.money(1234.5);       // "1.234,50 €"
    eur.money(99);           // "99,00 €"
    ```

=== "PHP"

    ```php
    $eur = new Cosmo('de_DE', ['currency' => 'EUR']);
    $eur->money(1234.5);     // "1.234,50 €"
    $eur->money(99);         // "99,00 €"
    ```

=== "Python"

    ```python
    eur = Cosmo("de_DE", {"currency": "EUR"})
    eur.money(1234.5)        # "1.234,50 €"
    eur.money(99)            # "99,00 €"
    ```

=== "C#"

    ```csharp
    var eur = new Cosmo("de-DE", new Modifiers(currency: "EUR"));
    eur.Money(1234.5);       // "1.234,50 €"
    eur.Money(99);           // "99,00 €"
    ```

### Overriding precision and grouping

`precision` overrides the currency's natural minor units; the rest of the
[number options](numbers.md#number-formatting-options) apply too. A common case is
showing a whole-dollar summary without cents:

=== "JavaScript"

    ```js
    const c = new Cosmo("en-US");
    c.money(1234.5, "USD", { precision: 0 });            // "$1,235"
    c.money(1234.5, "USD", { useGrouping: false });      // "$1234.50"
    c.money(-50, "USD", { signDisplay: "always" });      // "-$50.00" (JS option)
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en_US');
    $c->money(1234.5, 'USD', 0);                         // "$1,235"  (precision arg)
    $c->money(1234.5, 'USD', null, false, '', ['useGrouping' => false]); // "$1234.50"
    ```

=== "Python"

    ```python
    c = Cosmo("en_US")
    c.money(1234.5, "USD", {"precision": 0})             # "$1,235"
    c.money(1234.5, "USD", {"useGrouping": False})       # "$1234.50"
    ```

=== "C#"

    ```csharp
    var c = new Cosmo("en-US");
    c.Money(1234.5, "USD", precision: 0);                // "$1,235"
    c.Money(1234.5, "USD", options: new NumberOptions { UseGrouping = false }); // "$1234.50"
    ```

### Strict mode: failing loudly on a missing currency

By default `money()` returns `""` when it cannot resolve a currency — handy in a
template, dangerous in a payment path. Pass `strict` to turn the silent empty
string into a thrown [`InvalidArgumentException`](../platform-notes.md):

=== "JavaScript"

    ```js
    new Cosmo("en").money(10);                        // ""  (no currency anywhere)
    new Cosmo("en").money(10, null, { strict: true }); // throws InvalidArgumentError
    ```

=== "PHP"

    ```php
    new Cosmo('en')->money(10);                       // ""
    new Cosmo('en')->money(10, null, null, true);     // throws InvalidArgumentException
    ```

=== "Python"

    ```python
    Cosmo("en").money(10)                             # ""
    Cosmo("en").money(10, {"strict": True})           # raises InvalidArgumentError
    ```

=== "C#"

    ```csharp
    new Cosmo("en").Money(10);                        // ""  (no currency anywhere)
    new Cosmo("en").Money(10, strict: true);          // throws CosmoArgumentException
    ```

## Currency names & symbols

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

=== "C#"

    ```csharp
    var c = new Cosmo("en-US");
    c.Currency("AUD");              // "Australian Dollar"
    c.Currency("AUD", symbol: true);// "A$"
    ```

`currency()` is part of the wider [locale metadata](locale-metadata.md#currency-name-symbol)
family (alongside `language()`, `country()`, and friends) — that page covers it in
full, including the strict-symbol behaviour. For a low-to-high **money range**
(`"$3.00 – $5.00"`), see [`moneyRange()`](lists-ranges-relative.md#number-money-date-ranges).

## Practical examples

**An invoice line.** Format the unit price, quantity, and line total with one
currency-bound instance, and show the currency name in the footer:

=== "JavaScript"

    ```js
    const c = new Cosmo("en-AU", { currency: "AUD" });
    const qty = 3, unitPrice = 19.95;
    const line = `${qty} × ${c.money(unitPrice)} = ${c.money(qty * unitPrice)}`;
    // "3 × $19.95 = $59.85"
    const footer = `All prices in ${c.currency("AUD")}.`;
    // "All prices in Australian Dollar."
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en_AU', ['currency' => 'AUD']);
    $qty = 3; $unitPrice = 19.95;
    $line = "$qty × {$c->money($unitPrice)} = {$c->money($qty * $unitPrice)}";
    // "3 × $19.95 = $59.85"
    $footer = "All prices in {$c->currency('AUD')}.";
    // "All prices in Australian Dollar."
    ```

=== "Python"

    ```python
    c = Cosmo("en_AU", {"currency": "AUD"})
    qty, unit_price = 3, 19.95
    line = f"{qty} × {c.money(unit_price)} = {c.money(qty * unit_price)}"
    # "3 × $19.95 = $59.85"
    footer = f"All prices in {c.currency('AUD')}."
    # "All prices in Australian Dollar."
    ```

=== "C#"

    ```csharp
    var c = new Cosmo("en-AU", new Modifiers(currency: "AUD"));
    int qty = 3; double unitPrice = 19.95;
    string line = $"{qty} × {c.Money(unitPrice)} = {c.Money(qty * unitPrice)}";
    // "3 × $19.95 = $59.85"
    string footer = $"All prices in {c.Currency("AUD")}.";
    // "All prices in Australian Dollar."
    ```

**Round-trip with the parser.** `money()` formats; [`parseMoney()`](transliteration-parsing.md#parsing-inverse-formatters)
(PHP/Python/Java/C#) reads a formatted string back into amount + currency — useful for
importing user-entered values.
