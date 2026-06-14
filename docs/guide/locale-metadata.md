# Locale metadata

Translate language, country, script, calendar, and currency codes into their
localised display names — and a couple of handy extras (text direction, flag
emoji). Every method falls back to the instance locale's own subtags when called
without an argument.

## Language, country, script, calendar

=== "PHP"

    ```php
    $fa = new Cosmo('fa');
    $fa->language('en');          // "انگلیسی"
    $fa->country('AU');           // "استرالیا"

    $en = new Cosmo('en');
    $en->script('Latn');          // "Latin"
    $en->calendar('buddhist');    // "Buddhist Calendar"
    ```

=== "JavaScript"

    ```js
    const fa = new Cosmo("fa");
    fa.language("en");            // "انگلیسی"
    fa.country("AU");            // "استرالیا"

    const en = new Cosmo("en");
    en.script("Latn");           // "Latin"
    en.calendar("buddhist");     // "Buddhist Calendar"
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

Called with no argument, each uses the instance locale: `new Cosmo('en_AU')`'s
`country()` returns `"Australia"`, `language()` returns `"English"`.

## Direction & flag

=== "PHP"

    ```php
    new Cosmo('fa')->direction();   // "rtl"
    new Cosmo('en')->direction();   // "ltr"
    new Cosmo('en_AU')->flag();     // "🇦🇺"
    ```

=== "JavaScript"

    ```js
    new Cosmo("fa").direction();    // "rtl"
    new Cosmo("en").direction();    // "ltr"
    new Cosmo("en-AU").flag();      // "🇦🇺"
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

`flag()` is pure Unicode codepoint math (region letters → regional-indicator
symbols), so no data table is involved. `direction()` resolves likely subtags
first, so even script-only or minority RTL languages are detected correctly.

## Currency name & symbol

=== "PHP"

    ```php
    $c = new Cosmo('en_US');
    $c->currency('AUD');            // "Australian Dollar"  (localised name)
    $c->currency('AUD', true);      // "A$"                 (disambiguated symbol)
    ```

=== "JavaScript"

    ```js
    const c = new Cosmo("en-US");
    c.currency("AUD");              // "Australian Dollar"
    c.currency("AUD", true);        // "A$"
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
    c.currency("AUD", true, false);     // "A$"   (symbol, strict)
    ```

The symbol form returns the **standard, disambiguated** symbol (`"A$"` for AUD in
`en_US`), not the ambiguous narrow `"$"`.

!!! info "Likely subtags"
    Maximising/minimising a locale (`en` ↔ `en-Latn-US`) is available in
    **JavaScript, Python, and Java** (`addLikelySubtags()` / `removeLikelySubtags()`
    — `add_likely_subtags()` / `remove_likely_subtags()` in Python). PHP's `intl`
    extension does not expose the likely-subtags algorithm, so it is the one port
    without these. See [Platform notes](../platform-notes.md).
