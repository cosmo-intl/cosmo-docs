---
description: Format ICU MessageFormat strings with placeholders, plurals, ordinals, and gender/word selection in Cosmo — full pattern syntax and per-port argument reference.
---

# Messages & plurals

Format ICU MessageFormat strings — placeholders, numbers, and especially
**pluralisation** and **gender/word selection** — without hardcoding any language's
grammar rules. A single pattern adapts: English needs one/other, Arabic needs six
categories, and `message()` picks the right branch from CLDR for you.

## The pattern language

A pattern is plain text with `{…}` placeholders. There are four placeholder shapes:

| Shape | Example | Renders |
|---|---|---|
| **Simple** | `Hello, {name}!` | substitutes the argument as-is |
| **Number** | `{n, number}` · `{n, number, integer}` · `{n, number, percent}` | locale-formatted number |
| **Plural** | `{n, plural, one {# item} other {# items}}` | picks a branch by plural category; `#` is the value |
| **Select** | `{g, select, female {her} male {his} other {their}}` | picks a branch by exact string match |

Inside a `plural`/`selectordinal` branch, `#` is replaced by the (locale-formatted)
number. Two refinements:

- **Exact matches** — `=0 {none} one {# item} other {# items}` uses the `=0` branch
  when the value is exactly 0, before falling back to the category.
- **`offset:n`** — `{n, plural, offset:1 =0 {nobody} one {you and # other} other {you and # others}}`
  subtracts `n` from `#` (for "you and 2 others" style phrasing).

An `other` branch is **required** in every `plural`/`selectordinal`/`select` — it's
the fallback when no category matches. Escape a literal brace or `#` by wrapping it
in single quotes: `'{'`, `'#'`, and `''` for a literal apostrophe.

## Messages

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    c.message("{count, plural, one {# file} other {# files}}", { count: 3 });
    // "3 files"
    c.message("{n, number} of {m, number}", { n: 4560, m: 0.2 });
    // "4,560 of 0.2"
    c.message("{g, select, female {She} male {He} other {They}} replied", { g: "female" });
    // "She replied"
    ```

=== "Java"

    ```java
    Cosmo c = new Cosmo("en");
    c.message("{0, plural, one {# file} other {# files}}", 3); // varargs (positional)
    // "3 files"
    c.message("{0,number,integer} of {1,number}", 4560, 0.2);
    // "4,560 of 0.2"
    c.message("{0, select, female {She} male {He} other {They}} replied", "female");
    // "She replied"
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $c->message('{0, plural, one {# file} other {# files}}', [3]);
    // "3 files"
    $c->message('{0,number,integer} of {1,number}', [4560, 0.2]);
    // "4,560 of 0.2"
    $c->message('{g, select, female {She} male {He} other {They}} replied', ['g' => 'female']);
    // "She replied"
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    c.message("{0, plural, one {# file} other {# files}}", [3])
    # "3 files"
    c.message("{0,number,integer} of {1,number}", [4560, 0.2])
    # "4,560 of 0.2"
    c.message("{g, select, female {She} male {He} other {They}} replied", {"g": "female"})
    # "She replied"
    ```

=== "C#"

    ```csharp
    var c = new Cosmo("en");
    c.Message("{count, plural, one {# file} other {# files}}",
              new Dictionary<string, object?> { ["count"] = 3 });
    // "3 files"
    c.Message("{n, number} of {m, number}",
              new Dictionary<string, object?> { ["n"] = 4560, ["m"] = 0.2 });
    // "4,560 of 0.2"
    // Positional (params array):
    c.Message("{0, plural, one {# file} other {# files}}", 3);
    // "3 files"
    ```

### Named vs positional arguments

How you pass arguments depends on the port:

| Port | Positional | Named |
|---|---|---|
| JavaScript | array — `["…"]`, refer to `{0}` | object — `{ name }`, refer to `{name}` |
| Python | list — `[…]`, refer to `{0}` | dict — `{"name": …}`, refer to `{name}` |
| Java | varargs — `c.message(p, a, b)`, refer to `{0}` | `Map` — refer to `{name}` |
| PHP | list — `[…]`, refer to `{0}` | assoc array — `['name' => …]` |
| C# | `params object?[]` — `c.Message(p, a, b)`, refer to `{0}` | `Dictionary<string, object?>` — refer to `{name}` |

!!! info "One subset, four full implementations"
    **PHP, Python, Java, and C#** use ICU's full `MessageFormat` (every argument type,
    including `date`/`time`/`spellout`, plus number skeletons). **JavaScript** ships
    a hand-written subset over `Intl.PluralRules`/`Intl.NumberFormat`: it supports
    simple args, `number` (with `integer`/`percent`/`currency` styles), `plural`,
    `selectordinal`, `select`, `offset:`, `=N` exact matches, and nesting — but
    **not** the `date`/`time`/`spellout` argument types or number skeletons, which
    need ICU internals JS doesn't expose. For a date inside a sentence in JS, format
    it with [`date()`](dates-times.md) and pass the string as a simple argument.
    C# uses a faithful hand-written parser (backed by ICU plural rules and number
    formatting) that covers the same feature set as the full ICU `MessageFormat`.

## Ordinals in messages

`selectordinal` works like `plural` but uses **ordinal** categories — the
"1st / 2nd / 3rd" wording rules:

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    const p = "{n, selectordinal, one {#st} two {#nd} few {#rd} other {#th}} place";
    c.message(p, { n: 1 });  // "1st place"
    c.message(p, { n: 22 }); // "22nd place"
    c.message(p, { n: 4 });  // "4th place"
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $p = '{n, selectordinal, one {#st} two {#nd} few {#rd} other {#th}} place';
    $c->message($p, ['n' => 1]);  // "1st place"
    $c->message($p, ['n' => 22]); // "22nd place"
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    p = "{n, selectordinal, one {#st} two {#nd} few {#rd} other {#th}} place"
    c.message(p, {"n": 1})   # "1st place"
    c.message(p, {"n": 22})  # "22nd place"
    ```

=== "C#"

    ```csharp
    var c = new Cosmo("en");
    string p = "{n, selectordinal, one {#st} two {#nd} few {#rd} other {#th}} place";
    c.Message(p, new Dictionary<string, object?> { ["n"] = 1 });  // "1st place"
    c.Message(p, new Dictionary<string, object?> { ["n"] = 22 }); // "22nd place"
    ```

For pre-built ordinal **text** (`"22nd"` in one call, without writing the branches),
use [`ordinal()`](numbers.md#spelled-out-ordinal-numbers) in PHP/Python/Java/C#.

## Plural category

Sometimes you want the raw decision rather than a formatted message — e.g. to pick
an image or a CSS class. `pluralCategory()` returns the LDML category a number falls
into for the locale, the same choice `message()` makes internally.

=== "JavaScript"

    ```js
    const en = new Cosmo("en");
    en.pluralCategory(1);           // "one"
    en.pluralCategory(2);           // "other"
    en.pluralCategory(2, true);     // "two"   (ordinal rules)
    new Cosmo("ar").pluralCategory(0); // "zero"
    ```

=== "Java"

    ```java
    Cosmo en = new Cosmo("en");
    en.pluralCategory(1);           // "one"
    en.pluralCategory(2);           // "other"
    en.pluralCategory(2, true);     // "two"
    new Cosmo("ar").pluralCategory(0); // "zero"
    ```

=== "PHP"

    ```php
    $en = new Cosmo('en');
    $en->pluralCategory(1);         // "one"
    $en->pluralCategory(2);         // "other"
    $en->pluralCategory(2, true);   // "two"   (ordinal)
    new Cosmo('ar')->pluralCategory(0); // "zero"
    ```

=== "Python"

    ```python
    en = Cosmo("en")
    en.plural_category(1)           # "one"
    en.plural_category(2)           # "other"
    en.plural_category(2, True)     # "two"
    Cosmo("ar").plural_category(0)  # "zero"
    ```

=== "C#"

    ```csharp
    var en = new Cosmo("en");
    en.PluralCategory(1);           // "one"
    en.PluralCategory(2);           // "other"
    en.PluralCategory(2, ordinal: true); // "two"
    new Cosmo("ar").PluralCategory(0);   // "zero"
    ```

Returns one of `zero`, `one`, `two`, `few`, `many`, `other`. Pass `ordinal = true`
for ordinal rules instead of cardinal. (Java uses real ordinal `PluralRules`; PHP
and Python derive the ordinal category through a `selectordinal` trick — same
result.)

!!! tip "Which categories does a locale use?"
    The set varies wildly: English has `one`/`other` (cardinal), Arabic has all six,
    Japanese has only `other`. Write every `plural` branch you reference, but always
    keep `other` — it covers any category you didn't spell out.

## Practical examples

**A notification badge sentence.** One pattern handles zero, singular, and plural
without branching in your code:

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    const p = "{n, plural, =0 {No new messages} one {# new message} other {# new messages}}";
    c.message(p, { n: 0 });   // "No new messages"
    c.message(p, { n: 1 });   // "1 new message"
    c.message(p, { n: 5 });   // "5 new messages"
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $p = '{n, plural, =0 {No new messages} one {# new message} other {# new messages}}';
    $c->message($p, ['n' => 0]); // "No new messages"
    $c->message($p, ['n' => 5]); // "5 new messages"
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    p = "{n, plural, =0 {No new messages} one {# new message} other {# new messages}}"
    c.message(p, {"n": 0})   # "No new messages"
    c.message(p, {"n": 5})   # "5 new messages"
    ```

=== "C#"

    ```csharp
    var c = new Cosmo("en");
    string p = "{n, plural, =0 {No new messages} one {# new message} other {# new messages}}";
    c.Message(p, new Dictionary<string, object?> { ["n"] = 0 }); // "No new messages"
    c.Message(p, new Dictionary<string, object?> { ["n"] = 5 }); // "5 new messages"
    ```

**"You and N others" with `offset`.** The offset keeps the displayed `#` one less
than the real count:

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    const p = "{n, plural, offset:1 =1 {You liked this} one {You and # other liked this}"
            + " other {You and # others liked this}}";
    c.message(p, { n: 1 });  // "You liked this"
    c.message(p, { n: 3 });  // "You and 2 others liked this"
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    p = ("{n, plural, offset:1 =1 {You liked this} one {You and # other liked this}"
         " other {You and # others liked this}}")
    c.message(p, {"n": 1})   # "You liked this"
    c.message(p, {"n": 3})   # "You and 2 others liked this"
    ```

=== "C#"

    ```csharp
    var c = new Cosmo("en");
    string p = "{n, plural, offset:1 =1 {You liked this} one {You and # other liked this}"
             + " other {You and # others liked this}}";
    c.Message(p, new Dictionary<string, object?> { ["n"] = 1 }); // "You liked this"
    c.Message(p, new Dictionary<string, object?> { ["n"] = 3 }); // "You and 2 others liked this"
    ```
