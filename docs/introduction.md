---
title: Introduction
description: How Cosmo uses ICU for locale-aware formatting without maintaining locale tables.
---

# Introduction

Cosmo formats money, dates, numbers, units, and text using the conventions of a
[locale](locales.md). Set a locale and, for date and time formatting, a
[time zone](locales.md#time-zones), then call the formatter you need.

Cosmo uses ICU for locale data and formatting:

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

## Locale data from ICU

Cosmo reads locale data from ICU rather than maintaining its own tables.
{% if language == 'javascript' %}
The library accesses ICU through the standard `Intl` API. Parsing,
transliteration, and rule-based number formatting are not exposed by that API.
{% elif language == 'php' %}
The library uses `ext-intl`, including `ResourceBundle` data where a dedicated
formatter is unavailable.
{% elif language == 'python' %}
The library uses [PyICU](https://gitlab.pyicu.org/main/pyicu), which binds ICU's C++ API.
{% elif language == 'java' %}
The library uses [ICU4J](https://unicode-org.github.io/icu/userguide/icu4j/).
{% else %}
The library calls ICU4C through P/Invoke and bundles ICU 72 native binaries.
{% endif %}

See [Platform notes](platform-notes.md) for supported features and limitations.

## Next steps

<div class="grid cards" markdown>

- :material-rocket-launch: **[Getting started](getting-started.md)** — install and your first formatted value
- :material-book-open-variant: **[Guide](guide/locale-metadata.md)** — every feature, with side-by-side examples
- :material-table: **[API reference](api-reference.md)** — the complete method list
- :material-scale-balance: **[Feature parity](parity.md)** — what's available where

</div>
