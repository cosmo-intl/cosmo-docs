---
description: Locale-aware comparison, sorting, substring search, segmentation, truncation, case mapping, and quotation with Cosmo's ICU-backed text tools — full options reference.
---

# Collation & text

Locale-aware comparison, sorting, substring search, word/sentence segmentation,
truncation, case mapping, and quotation — all backed by ICU's collator and break
iterators. These replace the byte-order operations (`<`, `strcmp`, `sort`,
`strpos`, `strtoupper`) that quietly mis-order or mis-match non-English text.

| Method | Use it for |
|---|---|
| `compare(a, b, options?)` | A locale-correct comparator for sorting two strings |
| `sort(items, key?, options?)` | Sort a whole list (optionally by a field) |
| `contains(haystack, needle, sensitivity?, options?)` | Accent/case-insensitive substring search |
| `splitWords` / `splitSentences` / `splitGraphemes` | Break text on the locale's boundaries |
| `ellipsize(text, max, ellipsis?)` | Grapheme-safe truncation |
| `upper(text)` / `lower(text)` | Locale-aware case mapping |
| `quote(text)` | Wrap in the locale's quotation marks |

!!! info "Availability"
    Everything on this page works identically in JavaScript, PHP, Python, Java,
    and C# — except `quote()`, which is JS-blocked (see the last section). (The
    collation and segmentation methods landed in PHP in v3.)

## Compare & sort

`compare()` returns a negative number, `0`, or a positive number — exactly what a
sort callback wants. `sort()` does the whole list for you and returns a **new**
array (it never mutates the input).

=== "JavaScript"

    ```js
    const sv = new Cosmo("sv");
    sv.compare("a", "b");                  // -1
    sv.sort(["år", "zebra", "ar"]);        // ["ar", "zebra", "år"]  (å sorts last in Swedish)

    // sort objects by a field with the key accessor:
    sv.sort(people, (p) => p.name);
    ```

=== "PHP"

    ```php
    $sv = new Cosmo('sv');                 // Swedish
    $sv->compare('a', 'b');                // -1
    $sv->sort(['år', 'zebra', 'ar']);      // ['ar', 'zebra', 'år']  (å sorts last)

    // sort objects by a field with the key accessor:
    $sv->sort($people, fn($p) => $p->name);
    ```

=== "Python"

    ```python
    sv = Cosmo("sv")
    sv.compare("a", "b")                   # -1
    sv.sort(["år", "zebra", "ar"])         # ["ar", "zebra", "år"]

    # sort objects by a field with the key accessor:
    sv.sort(people, key=lambda p: p.name)
    ```

=== "Java"

    ```java
    Cosmo sv = new Cosmo("sv");
    sv.compare("a", "b");                                      // -1
    sv.sort(List.of("år", "zebra", "ar"));                     // [ar, zebra, år]

    // key accessor — sort objects/maps by a field:
    sv.sort(people, p -> p.getName());
    ```

=== "C#"

    ```csharp
    var sv = new Cosmo("sv");
    sv.Compare("a", "b");                  // -1
    sv.Sort(new List<string> { "år", "zebra", "ar" }); // ["ar", "zebra", "år"]

    // key accessor — sort objects by a field:
    sv.Sort(people, p => p.Name);
    ```

The same input sorts differently per locale — `å` is a distinct letter sorting last
in Swedish, but an accented `a` in German. That is the whole reason to use a
collator instead of byte order.

### Collation options

Both `compare()` and `sort()` (and `contains()`) take a final **options bag** to
tailor the collator:

| Key | Values | What it does |
|---|---|---|
| `numeric` | `true` / `false` | Sort embedded numbers by value, so `"file2"` < `"file10"` (natural sort). |
| `caseFirst` | `upper` · `lower` · `false` | Whether upper- or lower-case sorts first within a letter. |

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    c.sort(["file10", "file2", "file1"], undefined, { numeric: true });
    // ["file1", "file2", "file10"]
    c.sort(["b", "B", "a", "A"], undefined, { caseFirst: "upper" });
    // ["A", "a", "B", "b"]
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $c->sort(['file10', 'file2', 'file1'], null, ['numeric' => true]);
    // ['file1', 'file2', 'file10']
    $c->sort(['b', 'B', 'a', 'A'], null, ['caseFirst' => 'upper']);
    // ['A', 'a', 'B', 'b']
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    c.sort(["file10", "file2", "file1"], options={"numeric": True})
    # ["file1", "file2", "file10"]
    c.sort(["b", "B", "a", "A"], options={"caseFirst": "upper"})
    # ["A", "a", "B", "b"]
    ```

=== "C#"

    ```csharp
    var c = new Cosmo("en");
    c.Sort(new List<string> { "file10", "file2", "file1" },
           options: new CollationOptions { Numeric = true });
    // ["file1", "file2", "file10"]
    c.Sort(new List<string> { "b", "B", "a", "A" },
           options: new CollationOptions { CaseFirst = "upper" });
    // ["A", "a", "B", "b"]
    ```

## Substring search

Collation-aware `contains()` can ignore case and accents — so a search box matches
"café" when the user types "cafe". The **`sensitivity`** argument controls how
forgiving the match is:

| `sensitivity` | Ignores | `contains("Café", needle)` matches |
|---|---|---|
| `base` (default) | case **and** accents | `"cafe"`, `"CAFÉ"`, `"café"` |
| `accent` | case only | `"café"`, `"CAFÉ"` — but not `"cafe"` |
| `case` | accents only | `"cafe"`, `"café"` — but not `"CAFÉ"` |
| `variant` | nothing (exact) | `"Café"` only |

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    c.contains("Café society", "cafe");               // true  (base)
    c.contains("Café", "cafe", "variant");            // false (exact)
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $c->contains('Café society', 'cafe');             // true  (base: ignore case & accent)
    $c->contains('Café', 'cafe', 'variant');          // false (exact)
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    c.contains("Café society", "cafe")                # True
    c.contains("Café", "cafe", "variant")             # False
    ```

=== "Java"

    ```java
    Cosmo c = new Cosmo("en");
    c.contains("Café society", "cafe");               // true
    c.contains("Café", "cafe", "variant");            // false
    ```

=== "C#"

    ```csharp
    var c = new Cosmo("en");
    c.Contains("Café society", "cafe");               // true
    c.Contains("Café", "cafe", "variant");            // false
    ```

The search is grapheme-aware, so it never matches across a combining sequence. An
empty needle returns `true` (every string contains the empty string).

## Word & sentence segmentation

Splitting on whitespace fails for Thai, Japanese, and Chinese, which don't put
spaces between words. ICU's break iterators handle every script correctly.

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    c.splitWords("Hello, world! foo");         // ['Hello', 'world', 'foo']
    c.splitSentences("Hi there. How are you?"); // ['Hi there.', 'How are you?']
    new Cosmo("ja").splitWords("私は学生です");  // ['私', 'は', '学生', 'です']
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $c->splitWords('Hello, world! foo');       // ['Hello', 'world', 'foo']
    $c->splitSentences('Hi there. How are you?'); // ['Hi there.', 'How are you?']
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

=== "C#"

    ```csharp
    var c = new Cosmo("en");
    c.SplitWords("Hello, world! foo");          // ["Hello", "world", "foo"]
    c.SplitSentences("Hi there. How are you?"); // ["Hi there.", "How are you?"]
    ```

- **`splitWords()`** keeps only word-like segments — whitespace and punctuation are
  dropped. Ideal for a word count or building a search index.
- **`splitSentences()`** breaks on sentence boundaries (knows that "Mr." isn't the
  end of a sentence in English).
- **`splitGraphemes()`** breaks on user-perceived characters, so an emoji ZWJ
  sequence (`👨‍👩‍👧`) or a combining accent stays a single element — the correct way
  to count or reverse "characters".

## Grapheme-safe truncation

`ellipsize()` truncates to at most N **graphemes**, prefers to break on a word
boundary, and appends an ellipsis. The ellipsis counts toward the budget and
defaults to `…` (pass your own as the third argument).

=== "JavaScript"

    ```js
    new Cosmo("en").ellipsize("The quick brown fox", 12);     // "The quick…"
    new Cosmo("en").ellipsize("The quick brown fox", 12, "..."); // "The..."
    ```

=== "PHP"

    ```php
    new Cosmo('en')->ellipsize('The quick brown fox', 12);  // "The quick…"
    ```

=== "Python"

    ```python
    Cosmo("en").ellipsize("The quick brown fox", 12)        # "The quick…"
    ```

=== "Java"

    ```java
    new Cosmo("en").ellipsize("The quick brown fox", 12);   // "The quick…"
    ```

=== "C#"

    ```csharp
    new Cosmo("en").Ellipsize("The quick brown fox", 12);   // "The quick…"
    ```

Because it counts graphemes (not bytes or UTF-16 code units), it never cuts a
multi-byte character or an emoji in half. Text that already fits is returned
unchanged.

## Locale-aware case

=== "JavaScript"

    ```js
    new Cosmo("tr").upper("istanbul");    // "İSTANBUL"
    new Cosmo("en").upper("istanbul");    // "ISTANBUL"
    new Cosmo("en").lower("HELLO");       // "hello"
    ```

=== "PHP"

    ```php
    new Cosmo('tr')->upper('istanbul');   // "İSTANBUL"  (Turkish dotted I)
    new Cosmo('en')->upper('istanbul');   // "ISTANBUL"
    new Cosmo('en')->lower('HELLO');      // "hello"
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

=== "C#"

    ```csharp
    new Cosmo("tr").Upper("istanbul");    // "İSTANBUL"
    new Cosmo("en").Upper("istanbul");    // "ISTANBUL"
    new Cosmo("en").Lower("HELLO");       // "hello"
    ```

Unlike a plain `strtoupper`/`toUpperCase`, these honour locale rules — Turkish
dotted/dotless I, German ß, Lithuanian accents, and so on. Always upper/lower-case
in the **content's** locale, not the UI's, or you'll mangle Turkish names.

## Quotation marks

Wrap text in the locale's own quotation marks, straight from CLDR delimiter data —
no need to hardcode `”…”` vs `„…”` vs `« … »`.

=== “C#”

    ```csharp
    new Cosmo(“en”).Quote(“hello”);    // “”hello””
    new Cosmo(“de”).Quote(“hallo”);    // “„hallo””
    new Cosmo(“fr”).Quote(“bonjour”);  // “« bonjour »”
    ```

=== “C#”

    ```csharp
    new Cosmo(“en”).Quote(“hello”);    // “”hello””
    new Cosmo(“de”).Quote(“hallo”);    // “„hallo””
    new Cosmo(“fr”).Quote(“bonjour”);  // “« bonjour »”
    ```

=== “C#”

    ```csharp
    new Cosmo(“en”).Quote(“hello”);    // “”hello””
    new Cosmo(“de”).Quote(“hallo”);    // “„hallo””
    new Cosmo(“fr”).Quote(“bonjour”);  // “« bonjour »”
    ```

=== “C#”

    ```csharp
    new Cosmo(“en”).Quote(“hello”);    // “”hello””
    new Cosmo(“de”).Quote(“hallo”);    // “„hallo””
    new Cosmo(“fr”).Quote(“bonjour”);  // “« bonjour »”
    ```

!!! info “`quote()` is PHP, Python, Java & C#”
    The CLDR delimiter data isn't exposed by the JavaScript `Intl` API, so `quote()`
    is omitted there (these tabs show no JS). See
    [Platform notes](../platform-notes.md).

## Practical examples

**A natural-sorted file list.** Combine the `numeric` collation option with a key
accessor so versioned filenames order the way a human reads them:

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    const files = [{ name: "img12.png" }, { name: "img2.png" }, { name: "img1.png" }];
    c.sort(files, (f) => f.name, { numeric: true }).map((f) => f.name);
    // ["img1.png", "img2.png", "img12.png"]
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    files = [{"name": "img12.png"}, {"name": "img2.png"}, {"name": "img1.png"}]
    [f["name"] for f in c.sort(files, key=lambda f: f["name"], options={"numeric": True})]
    # ["img1.png", "img2.png", "img12.png"]
    ```

=== "C#"

    ```csharp
    var c = new Cosmo("en");
    var files = new[] {
        new { Name = "img12.png" }, new { Name = "img2.png" }, new { Name = "img1.png" }
    };
    c.Sort(files.ToList(), f => f.Name, new CollationOptions { Numeric = true })
     .Select(f => f.Name);
    // ["img1.png", "img2.png", "img12.png"]
    ```

**An accent-insensitive autocomplete filter.** `base` sensitivity matches across
accents and case in one call:

=== "JavaScript"

    ```js
    const c = new Cosmo("fr");
    const cities = ["Orléans", "Orange", "Paris"];
    cities.filter((city) => c.contains(city, "orle"));   // ["Orléans"]
    ```

=== "PHP"

    ```php
    $c = new Cosmo('fr');
    $cities = ['Orléans', 'Orange', 'Paris'];
    array_filter($cities, fn($city) => $c->contains($city, 'orle')); // ['Orléans']
    ```

=== "Python"

    ```python
    c = Cosmo("fr")
    cities = ["Orléans", "Orange", "Paris"]
    [city for city in cities if c.contains(city, "orle")]   # ["Orléans"]
    ```

=== "C#"

    ```csharp
    var c = new Cosmo("fr");
    var cities = new[] { "Orléans", "Orange", "Paris" };
    cities.Where(city => c.Contains(city, "orle")).ToList();  // ["Orléans"]
    ```
