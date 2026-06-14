# Collation & text

Locale-aware comparison, sorting, substring search, word/sentence segmentation,
truncation, case mapping, and quotation — all backed by ICU's collator and break
iterators.

!!! info "Availability"
    Everything on this page works identically in PHP, JavaScript, Python, and Java
    — except `quote()`, which is JS-blocked (see the last section). (The collation
    and segmentation methods landed in PHP in v3.)

## Compare & sort

=== "PHP"

    ```php
    $sv = new Cosmo('sv');                 // Swedish
    $sv->compare('a', 'b');                // -1
    $sv->sort(['år', 'zebra', 'ar']);      // ['ar', 'zebra', 'år']  (å sorts last)
    ```

=== "JavaScript"

    ```js
    const sv = new Cosmo("sv");
    sv.compare("a", "b");                  // -1
    sv.sort(["år", "zebra", "ar"]);        // ["ar", "zebra", "år"]
    ```

=== "Python"

    ```python
    sv = Cosmo("sv")
    sv.compare("a", "b")                   # -1
    sv.sort(["år", "zebra", "ar"])         # ["ar", "zebra", "år"]
    ```

=== "Java"

    ```java
    Cosmo sv = new Cosmo("sv");
    sv.compare("a", "b");                            // -1
    sv.sort(List.of("år", "zebra", "ar"));           // [ar, zebra, år]
    ```

`sort()` takes an optional `key` accessor (Python) for sorting objects/dicts by a
field; Java uses the collator directly as a `Comparator`. Pass `options` with
`numeric` (so `"file2"` < `"file10"`) or `caseFirst` to tailor collation in any port.

## Substring search

Collation-aware `contains()` can ignore case and accents.

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $c->contains('Café society', 'cafe');             // true  (base: ignore case & accent)
    $c->contains('Café', 'cafe', 'variant');          // false (exact)
    ```

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    c.contains("Café society", "cafe");               // true
    c.contains("Café", "cafe", "variant");            // false
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    c.contains("Café society", "cafe")                # true
    c.contains("Café", "cafe", "variant")             # false
    ```

=== "Java"

    ```java
    Cosmo c = new Cosmo("en");
    c.contains("Café society", "cafe");               // true
    c.contains("Café", "cafe", "variant");            // false
    ```

Sensitivity: `base` (ignore case & accents, default), `accent`, `case`, `variant`.

## Word & sentence segmentation

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $c->splitWords('Hello, world! foo');       // ['Hello', 'world', 'foo']
    $c->splitSentences('Hi there. How are you?'); // ['Hi there.', 'How are you?']
    ```

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    c.splitWords("Hello, world! foo");         // ['Hello', 'world', 'foo']
    c.splitSentences("Hi there. How are you?"); // ['Hi there.', 'How are you?']
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    c.split_words("Hello, world! foo")         # ['Hello', 'world', 'foo']
    c.split_sentences("Hi there. How are you?") # ['Hi there.', 'How are you?']
    ```

=== "Java"

    ```java
    Cosmo c = new Cosmo("en");
    c.splitWords("Hello, world! foo");          // [Hello, world, foo]
    c.splitSentences("Hi there. How are you?"); // [Hi there., How are you?]
    ```

`splitWords()` keeps only word-like segments (drops whitespace and punctuation),
following the locale's boundary rules — essential for languages without spaces.
`splitGraphemes()` breaks on user-perceived characters (emoji/ZWJ sequences stay
whole).

## Grapheme-safe truncation

=== "PHP"

    ```php
    new Cosmo('en')->ellipsize('The quick brown fox', 12);  // "The quick…"
    ```

=== "JavaScript"

    ```js
    new Cosmo("en").ellipsize("The quick brown fox", 12);   // "The quick…"
    ```

=== "Python"

    ```python
    Cosmo("en").ellipsize("The quick brown fox", 12)        # "The quick…"
    ```

=== "Java"

    ```java
    new Cosmo("en").ellipsize("The quick brown fox", 12);   // "The quick…"
    ```

Truncates to at most N graphemes, breaking on a word boundary and never splitting
a combining sequence.

## Locale-aware case

=== "PHP"

    ```php
    new Cosmo('tr')->upper('istanbul');   // "İSTANBUL"  (Turkish dotted I)
    new Cosmo('en')->upper('istanbul');   // "ISTANBUL"
    new Cosmo('en')->lower('HELLO');      // "hello"
    ```

=== "JavaScript"

    ```js
    new Cosmo("tr").upper("istanbul");    // "İSTANBUL"
    new Cosmo("en").upper("istanbul");    // "ISTANBUL"
    new Cosmo("en").lower("HELLO");       // "hello"
    ```

=== "Python"

    ```python
    Cosmo("tr").upper("istanbul")         # "İSTANBUL"
    Cosmo("en").upper("istanbul")         # "ISTANBUL"
    Cosmo("en").lower("HELLO")            # "hello"
    ```

=== "Java"

    ```java
    new Cosmo("tr").upper("istanbul");    // "İSTANBUL"
    new Cosmo("en").upper("istanbul");    // "ISTANBUL"
    new Cosmo("en").lower("HELLO");       // "hello"
    ```

Unlike a plain `strtoupper`/`toUpperCase`, these honour locale rules — Turkish
dotted/dotless I, German ß, Lithuanian accents, and so on.

## Quotation marks

Wrap text in the locale's own quotation marks, straight from CLDR delimiter data.

=== "PHP"

    ```php
    new Cosmo('en')->quote('hello');   // "“hello”"
    new Cosmo('de')->quote('hallo');   // "„hallo“"
    new Cosmo('fr')->quote('bonjour'); // "« bonjour »"
    ```

=== "Python"

    ```python
    Cosmo("en").quote("hello")         # "“hello”"
    Cosmo("de").quote("hallo")         # "„hallo“"
    Cosmo("fr").quote("bonjour")       # "« bonjour »"
    ```

=== "Java"

    ```java
    new Cosmo("en").quote("hello");    // "“hello”"
    new Cosmo("de").quote("hallo");    // "„hallo“"
    new Cosmo("fr").quote("bonjour");  // "« bonjour »"
    ```

!!! info "`quote()` is PHP, Python & Java"
    The CLDR delimiter data isn't exposed by the JavaScript `Intl` API, so `quote()`
    is omitted there (these tabs show no JS). See
    [Platform notes](../platform-notes.md).
