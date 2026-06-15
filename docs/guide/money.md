# Money & currency

A *money* value is an amount plus a currency. `money()` formats the pair using the
locale's symbol, placement, grouping, and — crucially — the **currency's own minor
units**: most currencies show two fraction digits, JPY shows none, and a few (e.g.
BHD) show three. Cosmo only *formats* a value; it never converts between currencies.
For plain numbers, percentages, and units, see [Numbers](numbers.md).

## Formatting an amount

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
[options bag](numbers.md#decimals-percentages-units) applies here too.

!!! info "Region → currency inference differs"
    **PHP, Python, and Java infer** the currency from the locale's region when you
    omit a code (`Cosmo("en_AU").money(100)` → `$100.00`). **JavaScript does not** —
    its `Intl`-only design forbids a region→currency mapping, so `money()` returns
    `""` unless you pass a code or set the `currency` modifier. This is a capability
    difference, not an error; see [Platform notes](../platform-notes.md).

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

`currency()` is part of the wider [locale metadata](locale-metadata.md#currency-name-symbol)
family (alongside `language()`, `country()`, and friends) — that page covers it in
full, including the strict-symbol behaviour.
