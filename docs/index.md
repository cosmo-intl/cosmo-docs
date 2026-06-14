---
title: Cosmopolitan
---

# Cosmopolitan

**Ergonomic application localisation, built on ICU — for PHP, JavaScript, and Python.**

As long as you display data, you need to present it in a format your users will
understand. Cosmopolitan is a thin, ergonomic layer over **ICU**: set the locale
(`language_COUNTRY`) and time zone, and your app is ready for its audience —
currencies, dates, numbers, units, plurals, collation, and more.

One library, three languages, the **same API**:

=== "PHP"

    ```php
    use Salarmehr\Cosmopolitan\Cosmo;

    $c = new Cosmo('es_ES');
    $c->money(11000.4, 'EUR');   // "11.000,40 €"
    $c->percentage(0.2);         // "20%"
    ```

=== "JavaScript"

    ```js
    import { Cosmo } from "cosmopolitan";

    const c = new Cosmo("es-ES");
    c.money(11000.4, "EUR");     // "11.000,40 €"
    c.percentage(0.2);           // "20%"
    ```

=== "Python"

    ```python
    from cosmopolitan import Cosmo

    c = Cosmo("es_ES")
    c.money(11000.4, "EUR")      # "11.000,40 €"
    c.percentage(0.2)            # "20%"
    ```

!!! tip "Pick your language once"
    Use the tabs above to choose PHP, JavaScript, or Python. Every code sample
    across the whole site switches to match — so you only ever read your own
    language.

## Why ICU, and nothing but ICU

Everything comes straight from the runtime's **ICU** data — it covers every
country, language, script, calendar, and time zone. Cosmopolitan bundles **no
locale data of its own**: there are no hardcoded tables to drift out of date.

The three ports reach ICU through different doors, which is the only reason their
feature sets differ at the edges:

| Port | ICU access | Notes |
|---|---|---|
| **PHP** | `ext-intl` (+ raw `ResourceBundle`, RBNF) | the original library |
| **JavaScript** | the standard `Intl` API | strictly `Intl`-only; raw-ICU features are omitted, not faked |
| **Python** | [PyICU](https://gitlab.pyicu.org/main/pyicu) (ICU C++ bindings) | the most complete — effectively the union of PHP and JS |

See **[Feature parity](parity.md)** for the full method-by-method matrix and
**[Platform notes](platform-notes.md)** for what each port can and cannot do.

## Next steps

<div class="grid cards" markdown>

- :material-rocket-launch: **[Getting started](getting-started.md)** — install and your first formatted value
- :material-book-open-variant: **[Guide](guide/locale-metadata.md)** — every feature, with side-by-side examples
- :material-table: **[API reference](api-reference.md)** — the complete method list
- :material-scale-balance: **[Feature parity](parity.md)** — what's available where

</div>
