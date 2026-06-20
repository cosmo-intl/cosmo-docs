---
description: Turn language, country, script, calendar, and currency codes into localised display names — plus text direction, flag emoji, supported values, and likely subtags — with Cosmo.
---

# Locale metadata

Translate language, country, script, calendar, and currency codes into their
localised display names — and reach a handful of related lookups (text direction,
flag emoji, the runtime's supported values, likely-subtags expansion). Every
display method **falls back to the instance locale's own subtags** when called
without an argument, which makes "describe *this* locale" a no-argument call.

| Method | Returns | Default argument |
|---|---|---|
| `language(code?)` | localised language name | the instance language |
| `country(code?)` | localised region/country name | the instance region |
| `script(code?)` | localised script name | the instance script |
| `calendar(code)` | localised calendar name | — |
| `currency(code?, symbol?, strict?)` | currency name or symbol | the `currency` modifier |
| `displayName(type, code)` | any of the above, by type | — |
| `direction(language?)` | `"ltr"` / `"rtl"` | the instance locale |
| `flag(region?)` | country flag emoji | the instance region |
| `supportedValues(key)` | values the runtime's ICU supports | — |
| `addLikelySubtags()` / `removeLikelySubtags()` | a new `Cosmo` with subtags expanded/collapsed | — |

## Language, country, script, calendar

Each takes a code and returns its name **in the instance locale's language** — so a
`fa` instance describes everything in Persian.

=== "JavaScript"

    ```js
    const fa = new Cosmo("fa");
    fa.language("en");           // "انگلیسی"
    fa.country("AU");            // "استرالیا"

    const en = new Cosmo("en");
    en.script("Latn");           // "Latin"
    en.calendar("buddhist");     // "Buddhist Calendar"
    ```

=== "PHP"

    ```php
    $fa = new Cosmo('fa');
    $fa->language('en');          // "انگلیسی"
    $fa->country('AU');           // "استرالیا"

    $en = new Cosmo('en');
    $en->script('Latn');          // "Latin"
    $en->calendar('buddhist');    // "Buddhist Calendar"
    ```

=== "Python"

    ```python
    fa = Cosmo("fa")
    fa.language("en")            # "انگلیسی"
    fa.country("AU")             # "استرالیا"

    en = Cosmo("en")
    en.script("Latn")            # "Latin"
    en.calendar("buddhist")      # "Buddhist Calendar"
    ```

=== "Java"

    ```java
    Cosmo fa = new Cosmo("fa");
    fa.language("en");           // "انگلیسی"
    fa.country("AU");            // "استرالیا"

    Cosmo en = new Cosmo("en");
    en.script("Latn");           // "Latin"
    en.calendar("buddhist");     // "Buddhist Calendar"
    ```

=== "C#"

    ```csharp
    var fa = new Cosmo("fa");
    fa.Language("en");           // "انگلیسی"
    fa.Country("AU");            // "استرالیا"

    var en = new Cosmo("en");
    en.Script("Latn");           // "Latin"
    en.Calendar("buddhist");     // "Buddhist Calendar"
    ```

Called with no argument, each uses the instance locale: `new Cosmo('en_AU')`'s
`country()` returns `"Australia"`, `language()` returns `"English"`. `language()`
and `country()` also accept a **full locale** and pull the right subtag out of it,
so `language("pt-BR")` → `"Portuguese"` and `country("pt-BR")` → `"Brazil"`.

### Generic dispatcher: `displayName()`

When the category is itself a variable (say, you're rendering a settings row by
type), `displayName(type, code)` is the single entry point over all of the above:

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    c.displayName("language", "fr");   // "French"
    c.displayName("region", "JP");     // "Japan"
    c.displayName("currency", "EUR");  // "Euro"
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $c->displayName('language', 'fr');  // "French"
    $c->displayName('region', 'JP');    // "Japan"
    $c->displayName('currency', 'EUR'); // "Euro"
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    c.display_name("language", "fr")    # "French"
    c.display_name("region", "JP")      # "Japan"
    c.display_name("currency", "EUR")   # "Euro"
    ```

=== "Java"

    ```java
    Cosmo c = new Cosmo("en");
    c.displayName("language", "fr");   // "French"
    c.displayName("region", "JP");     // "Japan"
    c.displayName("currency", "EUR");  // "Euro"
    ```

=== "C#"

    ```csharp
    var c = new Cosmo("en");
    c.DisplayName("language", "fr");   // "French"
    c.DisplayName("region", "JP");     // "Japan"
    c.DisplayName("currency", "EUR");  // "Euro"
    ```

`type` is one of `language`, `region`, `script`, `calendar`, `currency`. An unknown
type throws.

## Currency name & symbol

`currency()` is the metadata view of a currency — its localised **name** (default)
or **symbol** — independent of any amount (for amounts, see [Money](money.md)).

| Argument | Default | Meaning |
|---|---|---|
| `code` | the `currency` modifier | ISO 4217 code |
| `symbol` | `false` | `true` → the disambiguated symbol, not the name |
| `strict` | `false` | throw on an unknown code instead of echoing it back |

=== "JavaScript"

    ```js
    const c = new Cosmo("en-US");
    c.currency("AUD");              // "Australian Dollar"
    c.currency("AUD", true);        // "A$"
    c.currency("ZZZ", false, true); // throws — unknown currency, strict
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en_US');
    $c->currency('AUD');            // "Australian Dollar"  (localised name)
    $c->currency('AUD', true);      // "A$"                 (disambiguated symbol)
    ```

=== "Python"

    ```python
    c = Cosmo("en_US")
    c.currency("AUD")               # "Australian Dollar"
    c.currency("AUD", True)         # "A$"
    ```

=== "Java"

    ```java
    Cosmo c = new Cosmo("en_US");
    c.currency("AUD");                  // "Australian Dollar"
    c.currency("AUD", true, false);     // "A$"   (symbol, non-strict)
    ```

=== "C#"

    ```csharp
    var c = new Cosmo("en-US");
    c.Currency("AUD");                  // "Australian Dollar"
    c.Currency("AUD", symbol: true);    // "A$"
    ```

The symbol form returns the **standard, disambiguated** symbol (`"A$"` for AUD in
`en_US`), not the ambiguous narrow `"$"` — so a price list mixing AUD, USD, and CAD
stays unambiguous. Without `strict`, an unrecognised code is echoed back uppercased
(handy for graceful UIs); with `strict`, it throws so you catch bad data early.

## Direction & flag

=== "JavaScript"

    ```js
    new Cosmo("fa").direction();    // "rtl"
    new Cosmo("en").direction();    // "ltr"
    new Cosmo("en-AU").flag();      // "🇦🇺"
    ```

=== "PHP"

    ```php
    new Cosmo('fa')->direction();   // "rtl"
    new Cosmo('en')->direction();   // "ltr"
    new Cosmo('en_AU')->flag();     // "🇦🇺"
    ```

=== "Python"

    ```python
    Cosmo("fa").direction()         # "rtl"
    Cosmo("en").direction()         # "ltr"
    Cosmo("en_AU").flag()           # "🇦🇺"
    ```

=== "Java"

    ```java
    new Cosmo("fa").direction();    // "rtl"
    new Cosmo("en").direction();    // "ltr"
    new Cosmo("en_AU").flag();      // "🇦🇺"
    ```

=== "C#"

    ```csharp
    new Cosmo("fa").Direction();    // "rtl"
    new Cosmo("en").Direction();    // "ltr"
    new Cosmo("en-AU").Flag();      // "🇦🇺"
    ```

`direction()` is what you bind to an HTML `dir` attribute. It resolves likely
subtags first, so even a script-only or minority RTL language (`ku`, `ckb`) is
detected correctly; pass a language/locale to test one other than the instance.
`flag()` is pure Unicode codepoint math (region letters → regional-indicator
symbols), so **no data table is involved** — it returns `""` for anything that
isn't a two-letter region.

## Supported values

`supportedValues(key)` lists everything the *runtime's ICU* can handle for a given
category — useful to populate a dropdown without hardcoding a list that drifts from
the engine:

| `key` | Yields |
|---|---|
| `calendar` | `gregory`, `persian`, `buddhist`, … |
| `collation` | `standard`, `phonebook`, `pinyin`, … |
| `currency` | every ISO 4217 code |
| `numberingSystem` | `latn`, `arab`, `deva`, … |
| `timeZone` | every IANA zone |
| `unit` | every formattable unit |

=== "JavaScript"

    ```js
    new Cosmo("en").supportedValues("currency").length;  // e.g. 300+
    new Cosmo("en").supportedValues("calendar");         // ["buddhist", "chinese", …]
    ```

=== "PHP"

    ```php
    count(new Cosmo('en')->supportedValues('currency'));  // e.g. 300+
    new Cosmo('en')->supportedValues('calendar');         // ['buddhist', 'chinese', …]
    ```

=== "Python"

    ```python
    len(Cosmo("en").supported_values("currency"))         # e.g. 300+
    Cosmo("en").supported_values("calendar")              # ["buddhist", "chinese", …]
    ```

=== "C#"

    ```csharp
    new Cosmo("en").SupportedValues("currency").Count;    // e.g. 300+
    new Cosmo("en").SupportedValues("calendar");          // ["buddhist", "chinese", …]
    // "unit" throws CosmoUnsupportedException — not exposed in the ICU C API
    ```

PHP/Python/Java/C# also accept `transliterator` here (see
[Transliteration](transliteration-parsing.md)). An unknown key throws; in JS the
method needs `Intl.supportedValuesOf` (Node 18+). C# does not support the `"unit"`
key (the ICU C API exposes no unit enumeration).

## Likely subtags

ICU can expand a terse locale to its most likely full form and back —
`addLikelySubtags()` returns a **new** `Cosmo` with the script/region filled in,
`removeLikelySubtags()` strips the redundant ones:

=== "JavaScript"

    ```js
    new Cosmo("en").addLikelySubtags().locale;          // "en-Latn-US"
    new Cosmo("en-Latn-US").removeLikelySubtags().locale; // "en"
    ```

=== "Python"

    ```python
    Cosmo("en").add_likely_subtags().locale             # "en-Latn-US"
    Cosmo("en-Latn-US").remove_likely_subtags().locale  # "en"
    ```

=== "Java"

    ```java
    new Cosmo("en").addLikelySubtags().locale;          // "en_Latn_US"
    new Cosmo("en_Latn_US").removeLikelySubtags().locale; // "en"
    ```

=== "C#"

    ```csharp
    new Cosmo("en").AddLikelySubtags().Locale;          // "en_Latn_US"
    new Cosmo("en_Latn_US").RemoveLikelySubtags().Locale; // "en"
    ```

!!! info "Likely subtags are JS, Python, Java & C#"
    PHP's `intl` extension does not expose the likely-subtags algorithm, so it is
    the one port without `addLikelySubtags()` / `removeLikelySubtags()`. See
    [Platform notes](../platform-notes.md).

## Practical examples

**A language switcher.** Render each supported locale's *endonym* (its name in its
own language) alongside its flag and direction:

=== "JavaScript"

    ```js
    const supported = ["en-US", "fr-FR", "ar-EG", "ja-JP"];
    const menu = supported.map((tag) => {
      const c = new Cosmo(tag);
      return { tag, label: c.language(), flag: c.flag(), dir: c.direction() };
    });
    // { tag: "ar-EG", label: "العربية", flag: "🇪🇬", dir: "rtl" }, …
    ```

=== "PHP"

    ```php
    $supported = ['en-US', 'fr-FR', 'ar-EG', 'ja-JP'];
    $menu = array_map(function ($tag) {
      $c = new Cosmo($tag);
      return ['tag' => $tag, 'label' => $c->language(), 'flag' => $c->flag(), 'dir' => $c->direction()];
    }, $supported);
    ```

=== "Python"

    ```python
    supported = ["en-US", "fr-FR", "ar-EG", "ja-JP"]
    menu = [
        {"tag": t, "label": (c := Cosmo(t)).language(), "flag": c.flag(), "dir": c.direction()}
        for t in supported
    ]
    ```

=== "C#"

    ```csharp
    var supported = new[] { "en-US", "fr-FR", "ar-EG", "ja-JP" };
    var menu = supported.Select(tag => {
        var c = new Cosmo(tag);
        return new { tag, label = c.Language(), flag = c.Flag(), dir = c.Direction() };
    }).ToList();
    // { tag: "ar-EG", label: "العربية", flag: "🇪🇬", dir: "rtl" }, …
    ```

**A native-name picker, sorted for the user.** Build names in the *user's* locale,
then [`sort()`](collation-text.md#compare-sort) them with that locale's collator so
the list reads naturally.
