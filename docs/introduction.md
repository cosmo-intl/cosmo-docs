---
title: Introduction
description: How Cosmo works — an ICU-backed library with no bundled locale data and a shared API across JavaScript, PHP, Python, Java, and C#.
---

# Introduction

Cosmo formats money, dates, numbers, units, and text using the conventions of a
[locale](locales.md). Set a locale and, for date and time formatting, a
[time zone](locales.md#time-zones), then call the formatter you need.

The library uses ICU and provides a shared API in JavaScript, PHP, Python, Java,
and C#:

=== "JavaScript"

    ```js
    import { Cosmo } from "@miloun/cosmo";

    const c = new Cosmo("es-ES");
    c.money(11000.4, "EUR");     // "11.000,40 €"
    c.percentage(0.2);           // "20%"
    ```

=== "PHP"

    ```php
    use Miloun\Cosmo\Cosmo;

    $c = new Cosmo('es_ES');
    $c->money(11000.4, 'EUR');   // "11.000,40 €"
    $c->percentage(0.2);         // "20%"
    ```

=== "Python"

    ```python
    from cosmo import Cosmo

    c = Cosmo("es_ES")
    c.money(11000.4, "EUR")      # "11.000,40 €"
    c.percentage(0.2)            # "20%"
    ```

=== "Java"

    ```java
    import com.miloun.cosmo.Cosmo;

    Cosmo c = new Cosmo("es_ES");
    c.money(11000.4, "EUR");     // "11.000,40 €"
    c.percentage(0.2);           // "20%"
    ```

=== "C#"

    ```csharp
    using Miloun.Cosmo;

    var c = new Cosmo("es-ES");
    c.Money(11000.4, "EUR");     // "11.000,40 €"
    c.Percentage(0.2);           // "20%"
    ```

Selecting a language tab changes the examples throughout the site.

## Locale data from ICU

Cosmo reads locale data from the runtime's ICU rather than maintaining its own
tables. Available features depend on the ICU APIs exposed by each language:

| Port | ICU access | Notes |
|---|---|---|
| **JavaScript** | the standard `Intl` API | supports the features exposed by `Intl`; no RBNF, parsing, or transliteration |
| **PHP** | `ext-intl` (+ raw `ResourceBundle`, RBNF) | the original library; v3 reconstructs the few newer formatters `ext-intl` lacks from CLDR data |
| **Python** | [PyICU](https://gitlab.pyicu.org/main/pyicu) (ICU C++ bindings) | supports formatting, parsing, locale matching, and spoof detection |
| **Java** | [ICU4J](https://unicode-org.github.io/icu/userguide/icu4j/) (the reference ICU implementation) | supports all methods in the shared API, plus `personName()` |
| **C#** | ICU4C (native ICU C library via P/Invoke) | bundles ICU 72; see [Platform notes](platform-notes.md) for API limitations |

See **[Feature parity](parity.md)** for the full method-by-method matrix and
**[Platform notes](platform-notes.md)** for what each port can and cannot do.

## Next steps

<div class="grid cards" markdown>

- :material-rocket-launch: **[Getting started](getting-started.md)** — install and your first formatted value
- :material-book-open-variant: **[Guide](guide/locale-metadata.md)** — every feature, with side-by-side examples
- :material-table: **[API reference](api-reference.md)** — the complete method list
- :material-scale-balance: **[Feature parity](parity.md)** — what's available where

</div>
