# Getting started

## Requirements

=== "PHP"

    - **PHP 8.4+** with the `intl` extension (`php -m | grep intl`).

=== "JavaScript"

    - **Node 20+** (Node 22+ for `duration()`, which uses `Intl.DurationFormat`).
    - A modern browser works too — everything is built on the standard `Intl` API.

=== "Python"

    - **Python 3.9+** and the system ICU development libraries (e.g. `libicu-dev`
      on Debian/Ubuntu, `icu4c` on macOS). [PyICU](https://gitlab.pyicu.org/main/pyicu)
      is installed as a dependency.

## Install

=== "PHP"

    ```bash
    composer require salarmehr/cosmopolitan
    ```

=== "JavaScript"

    ```bash
    npm install cosmopolitan
    ```

=== "Python"

    ```bash
    pip install cosmopolitan
    ```

## Quick start

Construct with a locale (and optional time zone / calendar / currency
modifiers), then call methods on it.

=== "PHP"

    ```php
    use Salarmehr\Cosmopolitan\Cosmo;

    $c = new Cosmo('en_AU', ['timeZone' => 'Australia/Sydney']);

    $c->country();          // "Australia"
    $c->money(1234.5);      // "$1,234.50"  (currency inferred from region)
    $c->number(1234567.89); // "1,234,567.89"
    $c->flag();             // "🇦🇺"
    ```

    PHP 8.4 lets you call a method directly on `new Cosmo(...)` without wrapping
    parentheses, or use the `cosmo()` helper: `cosmo('en_AU')->country()`.

=== "JavaScript"

    ```js
    import { Cosmo } from "cosmopolitan";

    const c = new Cosmo("en-AU", { timeZone: "Australia/Sydney" });

    c.country();            // "Australia"
    c.money(1234.5, "AUD"); // "$1,234.50"  (JS needs an explicit currency)
    c.number(1234567.89);   // "1,234,567.89"
    c.flag();               // "🇦🇺"
    ```

=== "Python"

    ```python
    from cosmopolitan import Cosmo

    c = Cosmo("en_AU", {"timeZone": "Australia/Sydney"})

    c.country()             # "Australia"
    c.money(1234.5)         # "$1,234.50"  (currency inferred from region)
    c.number(1234567.89)    # "1,234,567.89"
    c.flag()                # "🇦🇺"
    ```

!!! note "Locale format"
    Underscore locales (`en_AU`) and BCP-47 tags (`en-AU`), including Unicode
    extensions like `fa-IR-u-nu-latn-ca-buddhist`, are all accepted. JavaScript
    prefers the hyphenated form; PHP and Python accept either.

## Constructing without a string

Both factory helpers exist in every port (`snake_case` in Python):

=== "PHP"

    ```php
    Cosmo::fromSubtags(['language' => 'en', 'region' => 'AU']);
    Cosmo::fromAcceptLanguage($_SERVER['HTTP_ACCEPT_LANGUAGE']);
    ```

=== "JavaScript"

    ```js
    Cosmo.fromSubtags({ language: "en", region: "AU" });
    Cosmo.fromAcceptLanguage(req.headers["accept-language"]);
    ```

=== "Python"

    ```python
    Cosmo.from_subtags({"language": "en", "region": "AU"})
    Cosmo.from_accept_language(request.headers["accept-language"])
    ```

Ready for the details? Head to the **[Guide](guide/locale-metadata.md)**.
