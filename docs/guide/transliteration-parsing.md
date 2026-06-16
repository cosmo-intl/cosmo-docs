---
description: Transliterate between scripts, detect spoofed look-alike text, and parse locale-formatted numbers, money, and dates back into values with Cosmo.
---

# Transliteration & parsing

The "inverse and transform" half of ICU: convert text between scripts, detect
spoofed look-alike strings, and **parse** locale-formatted numbers, money, and
dates back into values.

!!! info "Availability"
    Everything on this page needs a raw-ICU service — `Transliterator`,
    `SpoofChecker`, or a parser — that the `Intl` API does not expose. So these
    methods exist in **PHP, Python, and Java only**; the tabs below omit JS. See
    [Platform notes](../platform-notes.md).

## Transliterate & romanize

`transliterate(text, id)` runs any ICU transform (`"Greek-Latin"`,
`"Any-Hangul"`, `"Any-Latin; Latin-ASCII"`, …). `romanize(text)` is the common
case — to Latin, then stripped to ASCII — ideal for slugs and search keys.

=== "Java"

    ```java
    Cosmo c = new Cosmo("en");
    c.romanize("Москва");                                // "Moskva"
    c.transliterate("Łódź café", "Any-Latin; Latin-ASCII"); // "Lodz cafe"
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $c->romanize('Москва');                              // "Moskva"
    $c->transliterate('Łódź café', 'Any-Latin; Latin-ASCII'); // "Lodz cafe"
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    c.romanize("Москва")                                 # "Moskva"
    c.transliterate("Łódź café", "Any-Latin; Latin-ASCII") # "Lodz cafe"
    ```

An unknown transform id throws. The full list of available ids comes from
`supportedValues("transliterator")` (the one `supportedValues` key beyond the
standard six).

## Spoof detection

`confusable(a, b)` asks whether two strings are visually confusable (e.g. a
Cyrillic look-alike of a Latin brand). `suspicious(text)` flags a single string as
spoof-prone — typically mixed-script.

!!! note "Backed by UTS #39"
    Both checks implement [Unicode Technical Standard #39, *Unicode Security
    Mechanisms*](https://www.unicode.org/reports/tr39/) — the standard that defines
    the confusable-character data and mixed-script detection rules — through ICU's
    `SpoofChecker`.

=== "Java"

    ```java
    Cosmo c = new Cosmo("en");
    c.confusable("paypal", "раураl");    // true
    c.confusable("hello", "world");      // false
    c.suspicious("pаypal");              // true
    c.suspicious("paypal");              // false
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $c->confusable('paypal', 'раураl');  // true   (Cyrillic look-alike)
    $c->confusable('hello', 'world');    // false
    $c->suspicious('pаypal');            // true   (mixed Latin/Cyrillic)
    $c->suspicious('paypal');            // false
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    c.confusable("paypal", "раураl")     # True
    c.confusable("hello", "world")       # False
    c.suspicious("pаypal")               # True
    c.suspicious("paypal")               # False
    ```

Use these to defend account names, domains, and brand mentions against homograph
attacks.

## Parsing (inverse formatters)

`Intl` can only format, never parse — but ICU's parsers are available in the other
three ports. Each is the inverse of a formatter on this site.

=== "Java"

    ```java
    new Cosmo("de").parseNumber("1.234,56");         // 1234.56
    new Cosmo("en").parseNumber("1,234.56");         // 1234.56
    new Cosmo("en_US").parseMoney("$12.30");         // CurrencyAmount(12.30, USD)

    Cosmo utc = new Cosmo("en_US", new Modifiers(null, null, "UTC"));
    utc.parseDate("February 2, 2020", "long");       // java.util.Date
    utc.parseMoment("2020-02-02", "yyyy-MM-dd");     // java.util.Date
    ```

=== "PHP"

    ```php
    new Cosmo('de')->parseNumber('1.234,56');       // 1234.56
    new Cosmo('en')->parseNumber('1,234.56');        // 1234.56
    new Cosmo('en_US')->parseMoney('$12.30');        // ['amount' => 12.3, 'currency' => 'USD']

    $utc = new Cosmo('en_US', ['timeZone' => 'UTC']);
    $utc->parseDate('February 2, 2020', 'long');     // DateTimeImmutable
    $utc->parseMoment('2020-02-02', 'yyyy-MM-dd');   // DateTimeImmutable
    ```

=== "Python"

    ```python
    Cosmo("de").parse_number("1.234,56")             # 1234.56
    Cosmo("en").parse_number("1,234.56")             # 1234.56
    Cosmo("en_US").parse_money("$12.30")             # {"amount": 12.3, "currency": "USD"}

    utc = Cosmo("en_US", {"timeZone": "UTC"})
    utc.parse_date("February 2, 2020", "long")       # datetime
    utc.parse_moment("2020-02-02", "yyyy-MM-dd")     # datetime
    ```

`parseMoney()` returns the amount **and** the recognised currency (an array/dict in
PHP/Python, an ICU `CurrencyAmount` in Java). Text that doesn't parse throws, so
you can distinguish "0" from "unparseable".
