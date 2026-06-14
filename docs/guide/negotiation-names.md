# Negotiation & names

Pick the **best** of *your* supported locales for a user, build alphabetical index
buckets for a contact list, and format person names the way each culture expects.

!!! info "Availability"
    - `bestMatch()` / negotiating `fromAcceptLanguage()` and `indexBuckets()` need
      ICU's `LocaleMatcher` / `AlphabeticIndex`, which only **Python and Java** bind
      (PHP's `ext-intl` and JS's `Intl` expose neither).
    - `personName()` needs ICU 73+'s `PersonNameFormatter` — **Java only** across all
      four ports.

    See [Platform notes](../platform-notes.md).

## Best-match locale negotiation

`fromAcceptLanguage(header)` alone just parses the header. Pass your **supported**
locales and the port runs CLDR *language distance* — not crude prefix matching — to
choose the closest one, falling back to the first supported locale if nothing is
close.

=== "Python"

    ```python
    # Which of MY locales best serves this user?
    Cosmo("en_AU").best_match(["en-US", "en-GB", "fr"])   # "en-GB"  (closer than en-US)
    Cosmo("ja").best_match(["fr", "de"])                  # "fr"     (fallback: first)

    # Negotiate straight from an Accept-Language header:
    c = Cosmo.from_accept_language("fr-CH, en;q=0.9", supported=["en-US", "fr-FR"])
    c.locale                                              # "fr_FR"
    Cosmo.from_accept_language("", supported=["en-US", "fr-FR"]).locale  # "en_US"
    ```

=== "Java"

    ```java
    // Which of MY locales best serves this user?
    new Cosmo("en_AU").bestMatch(List.of("en-US", "en-GB", "fr")); // "en-GB"
    new Cosmo("ja").bestMatch(List.of("fr", "de"));                // "fr" (fallback)

    // Negotiate straight from an Accept-Language header:
    Cosmo c = Cosmo.fromAcceptLanguage("fr-CH, en;q=0.9", List.of("en-US", "fr-FR"));
    c.locale; // "fr_FR"  (public final field)
    ```

This is the right tool behind a language switcher: `en_AU` is served better by
`en-GB` than `en-US`; `sr-Latn` maps to `hr` over `sr-Cyrl`. An empty supported
list throws.

## Alphabetical index buckets

`indexBuckets(names)` groups strings into the locale's index headers (A–Z, but
가나다 in Korean, あかさ in Japanese, …) with each bucket collation-ordered — the
section headers you'd put down the side of a contact list. Empty buckets are
omitted.

=== "Python"

    ```python
    buckets = Cosmo("en").index_buckets(["banana", "apple", "Cherry", "avocado"])
    list(buckets)          # ["A", "B", "C"]
    buckets["A"]           # ["apple", "avocado"]
    ```

=== "Java"

    ```java
    Map<String, List<String>> buckets =
        new Cosmo("en").indexBuckets(List.of("banana", "apple", "Cherry", "avocado"));
    buckets.keySet();      // [A, B, C]
    buckets.get("A");      // [apple, avocado]
    ```

The buckets are returned in index order (an ordered map / `LinkedHashMap`), so you
can iterate straight into your UI.

## Person names (Java only)

`personName(fields)` formats a name with the locale's ordering, spacing, and
script conventions — surname-first where appropriate, no space in CJK, locale-aware
initials. The optional `length` (`short`/`medium`/`long`) and `formality`
(`formal`/`informal`) refine it. Field keys include `given`, `surname`, `title`,
`given2`, `surname2`, `generation`, `credentials`, and a special `locale` key
giving the *name's own* locale (so a Japanese name renders correctly even from an
`en` formatter).

```java
import java.util.Map;

// Western order:
new Cosmo("en").personName(Map.of("given", "John", "surname", "Smith"));
// "John Smith"

// Japanese: surname first, no separating space — driven by the name's own locale:
new Cosmo("ja").personName(Map.of(
    "given", "太郎", "surname", "山田", "locale", "ja"));
// "山田太郎"
```

!!! note "Technology preview"
    ICU still labels `PersonNameFormatter` a *technology preview*, but Cosmo's
    `personName` **method surface stays stable** regardless — only the underlying
    formatting could shift as the CLDR data matures. JavaScript has only a TC39
    proposal, and neither `ext-intl` nor PyICU 2.16 binds the formatter, which is
    why this one method is Java-exclusive.
