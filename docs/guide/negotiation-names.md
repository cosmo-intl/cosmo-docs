---
description: Negotiate the best supported locale for a user, build alphabetical index buckets, and format person names per culture with Cosmo — fields, options, and recipes.
---

# Negotiation & names

Pick the **best** of *your* supported locales for a user, build alphabetical index
buckets for a contact list, and format person names the way each culture expects.

| Method | Use it for | Ports |
|---|---|---|
| `bestMatch(supported)` | Choose the closest of your locales for this user | Python, Java |
| `fromAcceptLanguage(header, supported)` | The same, negotiated straight from an HTTP header | Python, Java |
| `indexBuckets(names)` | Alphabetical section headers for a list | Python, Java |
| `personName(fields)` | A name in the culture's order/spacing/script | Java |

!!! info "Availability"
    - `bestMatch()` / negotiating `fromAcceptLanguage()` and `indexBuckets()` need
      ICU's `LocaleMatcher` / `AlphabeticIndex`, which only **Python and Java** bind
      (PHP's `ext-intl`, JS's `Intl`, and C#'s ICU4C C API expose neither). All five
      ports still parse `fromAcceptLanguage()` without a `supported` list — they just
      don't negotiate.
    - `personName()` needs ICU 73+'s `PersonNameFormatter` — **Java only** across all
      five ports (C# bundles ICU4C 72, which predates the C++ formatter).

    See [Platform notes](../platform-notes.md).

## Best-match locale negotiation

`fromAcceptLanguage(header)` *alone* just parses the header and picks the
highest-quality tag — that works in every port. The negotiation power comes from
passing your **supported** locales: the port then runs CLDR *language distance* —
not crude prefix matching — to choose the closest one, falling back to the **first**
supported locale when nothing is close.

=== "Java"

    ```java
    // Which of MY locales best serves this user?
    new Cosmo("en_AU").bestMatch(List.of("en-US", "en-GB", "fr")); // "en-GB"
    new Cosmo("ja").bestMatch(List.of("fr", "de"));                // "fr" (fallback)

    // Negotiate straight from an Accept-Language header:
    Cosmo c = Cosmo.fromAcceptLanguage("fr-CH, en;q=0.9", List.of("en-US", "fr-FR"));
    c.locale; // "fr_FR"  (public final field)
    ```

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

Why language distance beats prefix matching: `en_AU` is served better by `en-GB`
than `en-US` (closer English variant); `sr-Latn` maps to `hr` over `sr-Cyrl`
(shared script wins); `nn` (Nynorsk) falls back to `nb` (Bokmål). A plain
"longest-prefix" match gets all three wrong. An empty `supported` list throws — it's
a programming error, not a fallback.

!!! tip "Order your supported list by preference"
    The first entry is the fallback when nothing matches, so put your default locale
    first. Everything after it is reachable only when it's genuinely the closest.

## Alphabetical index buckets

`indexBuckets(names)` groups strings under the locale's index headers — A–Z in
English, but 가나다 in Korean, あかさ in Japanese, А–Я in Russian — with each bucket
collation-ordered. These are the section headers you'd run down the side of a
contact list. Empty buckets are omitted.

=== "Java"

    ```java
    Map<String, List<String>> buckets =
        new Cosmo("en").indexBuckets(List.of("banana", "apple", "Cherry", "avocado"));
    buckets.keySet();      // [A, B, C]
    buckets.get("A");      // [apple, avocado]
    ```

=== "Python"

    ```python
    buckets = Cosmo("en").index_buckets(["banana", "apple", "Cherry", "avocado"])
    list(buckets)          # ["A", "B", "C"]
    buckets["A"]           # ["apple", "avocado"]
    ```

The buckets come back in **index order** (an ordered map / `LinkedHashMap`), so you
can iterate straight into your UI without re-sorting. Names that don't fit any
letter bucket land in an overflow bucket (often `#`).

## Person names (Java only)

`personName(fields)` formats a name with the locale's ordering, spacing, and script
conventions — surname-first where appropriate, no space in CJK, locale-aware
initials. You pass a map of name parts; two optional keys refine the output.

**Field keys:**

| Key | Meaning |
|---|---|
| `given` | Given (first) name |
| `given2` | Middle name(s) |
| `surname` | Family name |
| `surname2` | Second family name (e.g. Spanish) |
| `title` | Honorific (Dr., Ms.) |
| `generation` | Jr., Sr., III |
| `credentials` | Post-nominals (PhD, MD) |
| `locale` | The **name's own** locale — so a Japanese name renders correctly even from an `en` formatter |

**Refinement options** (pass alongside the fields):

| Option | Values | Effect |
|---|---|---|
| `length` | `short` · `medium` · `long` | How many parts to include |
| `formality` | `formal` · `informal` | Full name vs familiar form |

```java
import java.util.Map;

// Western order:
new Cosmo("en").personName(Map.of("given", "John", "surname", "Smith"));
// "John Smith"

// Japanese: surname first, no separating space — driven by the name's own locale:
new Cosmo("ja").personName(Map.of(
    "given", "太郎", "surname", "山田", "locale", "ja"));
// "山田太郎"

// Informal, given name only:
new Cosmo("en").personName(Map.of(
    "given", "John", "surname", "Smith", "formality", "informal", "length", "short"));
// "John"
```

!!! note "Technology preview"
    ICU still labels `PersonNameFormatter` a *technology preview*, but Cosmo's
    `personName` **method surface stays stable** regardless — only the underlying
    formatting could shift as the CLDR data matures. JavaScript has only a TC39
    proposal, and neither `ext-intl` nor PyICU 2.16 binds the formatter, which is
    why this one method is Java-exclusive.

## Practical examples

**An HTTP request handler that picks the right locale.** Negotiate once, then build
every formatter from the chosen locale:

=== "Python"

    ```python
    SUPPORTED = ["en-US", "fr-FR", "de-DE", "ja-JP"]  # first = default

    def handle(request):
        header = request.headers.get("Accept-Language", "")
        c = Cosmo.from_accept_language(header, supported=SUPPORTED)
        return render(greeting=c.message("Welcome to {app}", {"app": "Acme"}),
                      lang=c.locale, direction=c.direction())
    ```

=== "Java"

    ```java
    static final List<String> SUPPORTED = List.of("en-US", "fr-FR", "de-DE", "ja-JP");

    Response handle(Request request) {
        String header = request.header("Accept-Language");
        Cosmo c = Cosmo.fromAcceptLanguage(header, SUPPORTED);
        return render(c.message("Welcome to {0}", "Acme"), c.locale, c.direction());
    }
    ```

**A jump-list contact index.** Feed the display names to `indexBuckets()` and render
each key as a sticky header:

```python
contacts = ["Álvarez", "Adams", "Brown", "Çelik", "Zhang"]
for header, names in Cosmo("en").index_buckets(contacts).items():
    print(header, "→", ", ".join(names))
# A → Adams, Álvarez
# B → Brown
# C → Çelik
# Z → Zhang
```
