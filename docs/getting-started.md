---
description: Install Cosmo and format your first locale-aware value in JavaScript, PHP, Python, Java, or C# — requirements, package names, and a quick first example.
---

# Getting started

## Requirements

=== "JavaScript"

    - **Node.js:** 20+ with ICU data for the locales you use. `duration()` additionally
      requires `Intl.DurationFormat`, available in Node.js 23.0.0+.
    - **Browsers:** native ES modules and ES2022 support, plus the `Intl` APIs used
      by the methods you call. For all methods in the JavaScript port, the API
      requirements give these minimum versions:

    | Browser | Minimum version |
    |---|---|
    | Chrome / Edge | 129 |
    | Firefox | 153 |
    | Safari / iOS Safari | 16.4 |

    For method-specific requirements, see [Older browser support](#older-browser-support).

=== "PHP"

    - **PHP 8.4+** with the `intl` extension (`php -m | grep intl`).

=== "Python"

    - **Python 3.9+** and the system ICU development libraries (e.g. `libicu-dev`
      on Debian/Ubuntu, `icu4c` on macOS). [PyICU](https://gitlab.pyicu.org/main/pyicu)
      is installed as a dependency.

=== "Java"

    - **Java 11+**. [ICU4J](https://unicode-org.github.io/icu/userguide/icu4j/)
      (`com.ibm.icu:icu4j`) is pulled in transitively — it bundles its own ICU
      data, so there is no system library to install.

=== "C#"

    - **.NET 8+**. The NuGet package bundles the ICU4C native libraries, so
      there is no system-level ICU to install.

## Install

=== "JavaScript"

    ```bash
    npm install @miloun/cosmo
    ```

=== "PHP"

    ```bash
    composer require salarmehr/cosmopolitan
    ```

    !!! note "Package name vs namespace"
        For a smooth v2 → v3 upgrade the Composer package keeps its long-standing
        name `salarmehr/cosmopolitan`; only the **namespace** rebrands to
        `Miloun\Cosmo`. Existing users bump the constraint to `^3.0` and run a
        `Salarmehr\Cosmopolitan` → `Miloun\Cosmo` find/replace.

=== "Python"

    ```bash
    pip install cosmo-intl
    ```

    The distribution is `cosmo-intl`; the **import** name is `cosmo`
    (`from cosmo import Cosmo`), decoupled like `beautifulsoup4` → `bs4`.

=== "Java"

    ```xml
    <dependency>
      <groupId>com.miloun</groupId>
      <artifactId>cosmo</artifactId>
      <version>1.0.0</version>
    </dependency>
    ```

    Gradle: `implementation("com.miloun:cosmo:1.0.0")`.

=== "C#"

    ```bash
    dotnet add package Miloun.Cosmo
    ```

## Quick start

Construct with a [locale](locales.md) (and an optional
[time zone](locales.md#time-zones), calendar, or currency modifier), then call
methods on it. New to these codes? See **[Locales & time zones](locales.md)**.

=== "JavaScript"

    ```js
    import { Cosmo } from "@miloun/cosmo";

    const c = new Cosmo("en-AU", { timeZone: "Australia/Sydney" });

    c.country();            // "Australia"
    c.money(1234.5, "AUD"); // "$1,234.50"  (JS needs an explicit currency)
    c.number(1234567.89);   // "1,234,567.89"
    c.flag();               // "🇦🇺"
    ```

=== "PHP"

    ```php
    use Miloun\Cosmo\Cosmo;

    $c = new Cosmo('en_AU', ['timeZone' => 'Australia/Sydney']);

    $c->country();          // "Australia"
    $c->money(1234.5);      // "$1,234.50"  (currency inferred from region)
    $c->number(1234567.89); // "1,234,567.89"
    $c->flag();             // "🇦🇺"
    ```

    PHP 8.4 lets you call a method directly on `new Cosmo(...)` without wrapping
    parentheses, or use the `cosmo()` helper: `cosmo('en_AU')->country()`.

=== "Python"

    ```python
    from cosmo import Cosmo

    c = Cosmo("en_AU", {"timeZone": "Australia/Sydney"})

    c.country()             # "Australia"
    c.money(1234.5)         # "$1,234.50"  (currency inferred from region)
    c.number(1234567.89)    # "1,234,567.89"
    c.flag()                # "🇦🇺"
    ```

=== "Java"

    ```java
    import com.miloun.cosmo.Cosmo;
    import com.miloun.cosmo.Modifiers;

    // Modifiers(calendar, currency, timeZone) — any field may be null.
    Cosmo c = new Cosmo("en_AU", new Modifiers(null, null, "Australia/Sydney"));

    c.country();            // "Australia"
    c.money(1234.5);        // "$1,234.50"  (currency inferred from region)
    c.number(1234567.89);   // "1,234,567.89"
    c.flag();               // "🇦🇺"
    ```

=== "C#"

    ```csharp
    using Miloun.Cosmo;

    // Modifiers(calendar, currency, timeZone) — any field may be null.
    var c = new Cosmo("en-AU", new Modifiers(timeZone: "Australia/Sydney"));

    c.Country();            // "Australia"
    c.Money(1234.5);        // "$1,234.50"  (currency inferred from region)
    c.Number(1234567.89);   // "1,234,567.89"
    c.Flag();               // "🇦🇺"
    ```

!!! note "Locale format"
    Underscore locales (`en_AU`) and BCP-47 tags (`en-AU`), including Unicode
    extensions like `fa-IR-u-nu-latn-ca-buddhist`, are all accepted. JavaScript
    prefers the hyphenated form; PHP, Python, Java, and C# accept either. See
    **[Locales & time zones](locales.md)** for the format explained and how to
    find yours.

## Constructing without a string

Both factory helpers exist in every port (`snake_case` in Python; typed
`Subtags`/`Modifiers` value classes in Java and C#):

=== "JavaScript"

    ```js
    Cosmo.fromSubtags({ language: "en", region: "AU" });
    Cosmo.fromAcceptLanguage(req.headers["accept-language"]);
    ```

=== "PHP"

    ```php
    Cosmo::fromSubtags(['language' => 'en', 'region' => 'AU']);
    Cosmo::fromAcceptLanguage($_SERVER['HTTP_ACCEPT_LANGUAGE']);
    ```

=== "Python"

    ```python
    Cosmo.from_subtags({"language": "en", "region": "AU"})
    Cosmo.from_accept_language(request.headers["accept-language"])
    ```

=== "Java"

    ```java
    // Subtags(language, script, region)
    Cosmo.fromSubtags(new Subtags("en", null, "AU"));
    Cosmo.fromAcceptLanguage(request.getHeader("Accept-Language"));

    // Java adds a CLDR-negotiating overload against your supported locales:
    Cosmo.fromAcceptLanguage(header, List.of("en-GB", "fr-FR", "de-DE"));
    ```

=== "C#"

    ```csharp
    // Subtags(language, script, region)
    Cosmo.FromSubtags(new Subtags("en", "", "AU"));
    Cosmo.FromAcceptLanguage(request.Headers["Accept-Language"]);
    ```

!!! tip "Negotiating against your own locales"
    Python and Java can pick the **best** of *your* supported locales for a user
    (CLDR language distance, not prefix matching) — see
    [Negotiation & names](guide/negotiation-names.md).

## Migrating existing localisation code

If your app already has custom formatting helpers or locale tables, you can use
this prompt with a coding assistant that has access to your project:

```text
Migrate this project's custom localisation code to Cosmo.

Read https://cosmo.miloun.com/getting-started/ and the API reference for
this project's language at https://cosmo.miloun.com/api-reference/.
Check https://cosmo.miloun.com/parity/ for platform limitations.

Inspect the project to identify its language, runtime versions, locale and
time-zone settings, and existing localisation helpers. Find custom code for
number, currency, date, time, unit, list, plural, and text formatting, along
with any hardcoded locale data that Cosmo can replace.

Install the appropriate Cosmo package and migrate supported operations using
the documented API for this language. Reuse the app's locale, time zone,
calendar, and currency settings. Keep business rules, currency conversion,
and translation catalogue management in place unless a documented Cosmo
feature covers the existing behaviour.

Preserve public interfaces where practical. Check timestamp units, rounding,
currency precision, plural rules, and error handling at each migrated call
site. If ICU formatting changes the displayed output, explain the difference
rather than assuming it is equivalent. Keep unsupported operations working
and identify why they could not be migrated.

Update or add tests for representative supported locales and important edge
cases, then run the relevant checks. Remove obsolete helpers and locale tables
once their callers have been migrated. Summarise the changes, output differences,
and any remaining custom localisation code.
```

Review the resulting changes, especially where existing output is part of a
public API or an exact string comparison. Locale conventions and ICU versions
can affect spacing, punctuation, and wording.

Ready for the details? Head to the **[Guide](guide/locale-metadata.md)**.

## Older browser support

Older browsers can run methods whose required APIs they support:

| Cosmo methods | Required API | Chrome / Edge | Firefox | Safari |
|---|---|---|---|---|
| `contains()`, `splitWords()`, `splitSentences()`, `splitGraphemes()`, `ellipsize()` | `Intl.Segmenter` | 87+ | 125+ | 14.1+ |
| `numberRange()`, `moneyRange()` | `Intl.NumberFormat.prototype.formatRange` | 106+ | 116+ | 15.4+ |
| `duration()` | `Intl.DurationFormat` | 129+ | 136+ | 16.4+ |
| `weekInfo()` | `Intl.Locale.prototype.getWeekInfo()` or the older `weekInfo` accessor | 99+ | 153+ | 15.4+ |
| `direction()` | `Intl.Locale.prototype.getTextInfo()` or the older `textInfo` accessor | 99+ | 153+ | 15.4+ |

These version requirements are derived from the APIs used by Cosmo and
[MDN browser compatibility data](https://github.com/mdn/browser-compat-data/tree/main/javascript/builtins/Intl);
they are not a browser test matrix. The runtime must also include data for
your requested locales. Cosmo does not bundle polyfills or locale data.
