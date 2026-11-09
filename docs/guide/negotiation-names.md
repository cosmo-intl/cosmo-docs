---
description: Negotiate the best supported locale for a user, build alphabetical index buckets, and format person names per culture with Cosmo — fields, options, and recipes.
---

# Negotiation & names

Choose the closest supported locale for a user and build alphabetical indexes
for contact lists.
{% if language == 'java' %}
You can also format person names with locale-specific ordering and spacing.
{% endif %}

| Method | Use it for |
|---|---|
| `bestMatch(supported)` | Choose the closest supported locale |
| `fromAcceptLanguage(header, supported)` | Negotiate from an HTTP header |
| `indexBuckets(names)` | Build alphabetical section headers |
{% if language == 'java' %}
| `personName(fields)` | Format a person's name |
{% endif %}

## Best-match locale negotiation

`fromAcceptLanguage(header)` *alone* just parses the header and picks the
highest-quality tag. Passing your **supported** locales enables CLDR
language-distance matching. This chooses the
closest supported locale, falling back to the **first** entry when none is close.

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

Why language distance beats prefix matching: `en_AU` is served better by `en-GB`
than `en-US` (closer English variant); `sr-Latn` maps to `hr` over `sr-Cyrl`
(shared script wins); `nn` (Nynorsk) falls back to `nb` (Bokmål). These matches use language and script relationships that prefix matching cannot
express. An empty `supported` list throws.

!!! tip "Order your supported list by preference"
    The first entry is the fallback when nothing matches, so put your default locale
    first. Everything after it is reachable only when it's genuinely the closest.

## Alphabetical index buckets

`indexBuckets(names)` groups strings under the locale's index headers — A–Z in
English, but 가나다 in Korean, あかさ in Japanese, А–Я in Russian — with each bucket
collation-ordered. These are the section headers you'd run down the side of a
contact list. Empty buckets are omitted.

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

The buckets come back in **index order** (an ordered map / `LinkedHashMap`), so you
can iterate straight into your UI without re-sorting. Names that don't fit any
letter bucket land in an overflow bucket (often `#`).

{% if language == 'java' %}
## Person names { #person-names-java-only }

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
    ICU labels `PersonNameFormatter` a technology preview. Formatting may change
    as its CLDR data evolves.

{% endif %}

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

{% if language == 'python' %}
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
{% endif %}
