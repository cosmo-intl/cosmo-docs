---
description: Transliterate between scripts, detect spoofed look-alike text, and parse locale-formatted numbers, money, and dates back into values with Cosmo — ids, options, and recipes.
---

# Transliteration & parsing

The "inverse and transform" half of ICU: convert text between scripts, detect
spoofed look-alike strings, and **parse** locale-formatted numbers, money, and
dates back into values.

| Method | Use it for |
|---|---|
| `transliterate(text, id)` | Run any ICU transform (script conversion, decomposition) |
| `romanize(text)` | The common "to ASCII Latin" case — slugs, search keys |
| `confusable(a, b)` | Are these two strings visually confusable? |
| `suspicious(text)` | Is this single string spoof-prone (mixed-script)? |
| `parseNumber` / `parseMoney` / `parseDate` / `parseMoment` | The inverse of the formatters |

!!! info "Availability"
    Everything on this page needs a raw-ICU service — `Transliterator`,
    `SpoofChecker`, or a parser — that the `Intl` API does not expose. So these
    methods exist in **PHP, Python, Java, and C#**; the tabs below omit JS. See
    [Platform notes](../platform-notes.md).

## Transliterate & romanize

`transliterate(text, id)` runs any ICU transform. The **id** is a transform
specification — a source/target pair, optionally chained with `;`:

| id | Effect |
|---|---|
| `Greek-Latin` | Greek script → Latin |
| `Any-Latin` | any script → Latin (best-effort) |
| `Latin-ASCII` | strip Latin diacritics to plain ASCII |
| `Any-Latin; Latin-ASCII` | the chain most slugs want |
| `Any-Hangul`, `Cyrillic-Latin`, `Han-Latin`, … | other script pairs |

`romanize(text)` is the pre-chained common case (`Any-Latin; Latin-ASCII`) — to
Latin, then stripped to ASCII — ideal for slugs and search keys.

=== "Java"

    ```java
    Cosmo c = new Cosmo("en");
    c.romanize("Москва");                                // "Moskva"
    c.transliterate("Λάμδα", "Greek-Latin");             // "Lámda"
    c.transliterate("Łódź café", "Any-Latin; Latin-ASCII"); // "Lodz cafe"
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $c->romanize('Москва');                              // "Moskva"
    $c->transliterate('Λάμδα', 'Greek-Latin');           // "Lámda"
    $c->transliterate('Łódź café', 'Any-Latin; Latin-ASCII'); // "Lodz cafe"
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    c.romanize("Москва")                                 # "Moskva"
    c.transliterate("Λάμδα", "Greek-Latin")              # "Lámda"
    c.transliterate("Łódź café", "Any-Latin; Latin-ASCII") # "Lodz cafe"
    ```

=== "C#"

    ```csharp
    var c = new Cosmo("en");
    c.Romanize("Москва");                                // "Moskva"
    c.Transliterate("Λάμδα", "Greek-Latin");             // "Lámda"
    c.Transliterate("Łódź café", "Any-Latin; Latin-ASCII"); // "Lodz cafe"
    ```

An unknown transform id throws. The full list of ids available on your runtime
comes from [`supportedValues("transliterator")`](locale-metadata.md#supported-values)
— the one `supportedValues` key beyond the standard six.

## Spoof detection

`confusable(a, b)` asks whether two strings are visually confusable (e.g. a Cyrillic
look-alike of a Latin brand). `suspicious(text)` flags a single string as
spoof-prone — typically because it mixes scripts that shouldn't appear together.

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

=== "C#"

    ```csharp
    var c = new Cosmo("en");
    c.Confusable("paypal", "раураl");    // true
    c.Confusable("hello", "world");      // false
    c.Suspicious("pаypal");              // true
    c.Suspicious("paypal");              // false
    ```

Use these to defend account names, domains, and brand mentions against homograph
attacks — `suspicious()` on signup to reject mixed-script usernames, `confusable()`
to flag a new name that mimics an existing one.

## Parsing (inverse formatters)

`Intl` can only format, never parse — but ICU's parsers are available in the other
four non-JS ports. Each is the exact inverse of a formatter on this site:

| Parser | Inverts | Returns |
|---|---|---|
| `parseNumber(text)` | [`number()`](numbers.md) | a float |
| `parseMoney(text)` | [`money()`](money.md) | amount **and** currency |
| `parseDate(text, width?)` | [`date()`](dates-times.md) | a native date (width defaults to `short`) |
| `parseMoment(text, pattern)` | [`formatMoment()`](dates-times.md#arbitrary-patterns-ranges) | a native date from a raw pattern |

=== "Java"

    ```java
    new Cosmo("de").parseNumber("1.234,56");         // 1234.56  (German grouping)
    new Cosmo("en").parseNumber("1,234.56");         // 1234.56
    new Cosmo("en_US").parseMoney("$12.30");         // CurrencyAmount(12.30, USD)

    Cosmo utc = new Cosmo("en_US", new Modifiers(null, null, "UTC"));
    utc.parseDate("February 2, 2020", "long");       // java.util.Date
    utc.parseMoment("2020-02-02", "yyyy-MM-dd");     // java.util.Date
    ```

=== "PHP"

    ```php
    new Cosmo('de')->parseNumber('1.234,56');        // 1234.56  (German grouping)
    new Cosmo('en')->parseNumber('1,234.56');        // 1234.56
    new Cosmo('en_US')->parseMoney('$12.30');        // ['amount' => 12.3, 'currency' => 'USD']

    $utc = new Cosmo('en_US', ['timeZone' => 'UTC']);
    $utc->parseDate('February 2, 2020', 'long');     // DateTimeImmutable
    $utc->parseMoment('2020-02-02', 'yyyy-MM-dd');   // DateTimeImmutable
    ```

=== "Python"

    ```python
    Cosmo("de").parse_number("1.234,56")             # 1234.56  (German grouping)
    Cosmo("en").parse_number("1,234.56")             # 1234.56
    Cosmo("en_US").parse_money("$12.30")             # {"amount": 12.3, "currency": "USD"}

    utc = Cosmo("en_US", {"timeZone": "UTC"})
    utc.parse_date("February 2, 2020", "long")       # datetime
    utc.parse_moment("2020-02-02", "yyyy-MM-dd")     # datetime
    ```

=== "C#"

    ```csharp
    new Cosmo("de").ParseNumber("1.234,56");          // 1234.56  (German grouping)
    new Cosmo("en").ParseNumber("1,234.56");          // 1234.56
    new Cosmo("en-US").ParseMoney("$12.30");          // (12.3, "USD")

    var utc = new Cosmo("en-US", new Modifiers(timeZone: "UTC"));
    utc.ParseDate("February 2, 2020", "long");        // DateTimeOffset
    utc.ParseMoment("2020-02-02", "yyyy-MM-dd");      // DateTimeOffset
    ```

A few things worth knowing:

- The locale **matters** — `parseNumber("1.234,56")` reads `1234.56` in `de` but
  would read `1.234` in `en`. Parse in the same locale you formatted (or the user's
  input locale).
- `parseDate()`'s `width` must match how the text was produced — a `"long"` string
  won't parse with the `short` skeleton. Set a `timeZone` modifier so the resulting
  moment is anchored, not shifted by the runtime zone.
- `parseMoney()` returns the amount **and** the recognised currency (an array/dict
  in PHP/Python, an ICU `CurrencyAmount` in Java, a `(double, string)` tuple in C#).
- **Text that doesn't parse throws** rather than returning 0 — so you can reliably
  distinguish a real `"0"` from unparseable input. Wrap user input in a try/catch.

## Practical examples

**A URL slug generator.** Romanize to ASCII, lower-case, then squeeze
non-alphanumerics to hyphens:

=== "PHP"

    ```php
    function slug(Cosmo $c, string $title): string {
      $ascii = $c->lower($c->romanize($title));
      return trim(preg_replace('/[^a-z0-9]+/', '-', $ascii), '-');
    }
    slug(new Cosmo('en'), 'Café Déjà Vu');   // "cafe-deja-vu"
    slug(new Cosmo('en'), 'Москва 2024');    // "moskva-2024"
    ```

=== "Python"

    ```python
    import re
    def slug(c, title):
        ascii_text = c.lower(c.romanize(title))
        return re.sub(r"[^a-z0-9]+", "-", ascii_text).strip("-")

    slug(Cosmo("en"), "Café Déjà Vu")   # "cafe-deja-vu"
    slug(Cosmo("en"), "Москва 2024")    # "moskva-2024"
    ```

=== "C#"

    ```csharp
    string Slug(Cosmo c, string title) {
        string ascii = c.Lower(c.Romanize(title));
        return System.Text.RegularExpressions.Regex.Replace(ascii, "[^a-z0-9]+", "-").Trim('-');
    }
    Slug(new Cosmo("en"), "Café Déjà Vu");  // "cafe-deja-vu"
    Slug(new Cosmo("en"), "Москва 2024");   // "moskva-2024"
    ```

**Safely importing a user-entered amount.** Parse in the user's locale and treat a
throw as "invalid", not zero:

=== "Python"

    ```python
    def read_amount(c, text):
        try:
            return c.parse_money(text)          # {"amount": …, "currency": …}
        except Exception:
            return None                         # genuinely unparseable

    read_amount(Cosmo("en_US"), "$1,299.00")    # {"amount": 1299.0, "currency": "USD"}
    read_amount(Cosmo("en_US"), "n/a")          # None
    ```

=== "PHP"

    ```php
    function readAmount(Cosmo $c, string $text): ?array {
      try {
        return $c->parseMoney($text);
      } catch (\Throwable $e) {
        return null;
      }
    }
    readAmount(new Cosmo('en_US'), '$1,299.00'); // ['amount' => 1299.0, 'currency' => 'USD']
    readAmount(new Cosmo('en_US'), 'n/a');       // null
    ```
