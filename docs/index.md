---
title: Cosmo
---

# Cosmo

**Ergonomic application localisation, built on ICU — for PHP, JavaScript, Python, and Java.**

As long as you display data, you need to present it in a format your users will
understand. Cosmo is a thin, ergonomic layer over **ICU**: set the locale
(`language_COUNTRY`) and time zone, and your app is ready for its audience —
currencies, dates, numbers, units, plurals, collation, and more.

One library, four languages, the **same API**:

=== "PHP"

    ```php
    use Miloun\Cosmo\Cosmo;

    $c = new Cosmo('es_ES');
    $c->money(11000.4, 'EUR');   // "11.000,40 €"
    $c->percentage(0.2);         // "20%"
    ```

=== "JavaScript"

    ```js
    import { Cosmo } from "@miloun/cosmo";

    const c = new Cosmo("es-ES");
    c.money(11000.4, "EUR");     // "11.000,40 €"
    c.percentage(0.2);           // "20%"
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

!!! tip "Pick your language once"
    Use the tabs above to choose PHP, JavaScript, Python, or Java. Every code
    sample across the whole site switches to match — so you only ever read your
    own language.

## Why ICU, and nothing but ICU

Everything comes straight from the runtime's **ICU** data — it covers every
country, language, script, calendar, and time zone. Cosmo bundles **no locale
data of its own**: there are no hardcoded tables to drift out of date. If the
runtime's ICU can't produce a result, the feature is **omitted, not faked**.

The four ports reach ICU through different doors, which is the only reason their
feature sets differ at the edges:

| Port | ICU access | Notes |
|---|---|---|
| **PHP** | `ext-intl` (+ raw `ResourceBundle`, RBNF) | the original library; v3 reconstructs the few newer formatters `ext-intl` lacks from CLDR data |
| **JavaScript** | the standard `Intl` API | strictly `Intl`-only; raw-ICU features (RBNF, parsing, transliteration, …) are omitted, not faked |
| **Python** | [PyICU](https://gitlab.pyicu.org/main/pyicu) (ICU C++ bindings) | the union of PHP and JS, plus the matcher / spoof / parsing family |
| **Java** | [ICU4J](https://unicode-org.github.io/icu/userguide/icu4j/) (the reference ICU implementation) | the **most complete** port — nothing curated away, nothing left unbound |

See **[Feature parity](parity.md)** for the full method-by-method matrix and
**[Platform notes](platform-notes.md)** for what each port can and cannot do.

## Next steps

<div class="grid cards" markdown>

- :material-rocket-launch: **[Getting started](getting-started.md)** — install and your first formatted value
- :material-book-open-variant: **[Guide](guide/locale-metadata.md)** — every feature, with side-by-side examples
- :material-table: **[API reference](api-reference.md)** — the complete method list
- :material-scale-balance: **[Feature parity](parity.md)** — what's available where

</div>
