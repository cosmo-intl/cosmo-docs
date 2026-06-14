# Messages & plurals

Format ICU MessageFormat strings — placeholders, numbers, dates, and especially
**pluralisation** and **gender/word selection** — without hardcoding any
language's grammar rules.

## Messages

=== "PHP"

    ```php
    $c = new Cosmo('en');
    $c->message('{0, plural, one {# file} other {# files}}', [3]);
    // "3 files"
    $c->message('{0,number,integer} of {1,number}', [4560, 0.2]);
    // "4,560 of 0.2"
    ```

=== "JavaScript"

    ```js
    const c = new Cosmo("en");
    c.message("{count, plural, one {# file} other {# files}}", { count: 3 });
    // "3 files"
    c.message("{n, number} of {m, number}", { n: 4560, m: 0.2 });
    // "4,560 of 0.2"
    ```

=== "Python"

    ```python
    c = Cosmo("en")
    c.message("{0, plural, one {# file} other {# files}}", [3])
    # "3 files"
    c.message("{0,number,integer} of {1,number}", [4560, 0.2])
    # "4,560 of 0.2"
    ```

=== "Java"

    ```java
    Cosmo c = new Cosmo("en");
    c.message("{0, plural, one {# file} other {# files}}", 3); // varargs (positional)
    // "3 files"
    c.message("{0,number,integer} of {1,number}", 4560, 0.2);
    // "4,560 of 0.2"
    ```

!!! info "One subset, three full implementations"
    **PHP, Python, and Java** use ICU's full `MessageFormat` (all argument types,
    `plural`, `selectordinal`, `select`, named **and** positional args).
    **JavaScript** ships a hand-written subset over
    `Intl.PluralRules`/`Intl.NumberFormat` (arguments, `number`, `plural`,
    `select`) — because it bundles no data, the algorithm is allowed but the
    surface is slightly smaller. Python accepts a list (positional) or dict
    (named); Java takes a `Map` (named) or varargs (positional).

## Plural category

Ask which LDML plural category a number falls into for the locale — the same
decision ICU's `MessageFormat` makes internally.

=== "PHP"

    ```php
    $en = new Cosmo('en');
    $en->pluralCategory(1);         // "one"
    $en->pluralCategory(2);         // "other"
    $en->pluralCategory(2, true);   // "two"   (ordinal: "2nd")
    new Cosmo('ar')->pluralCategory(0); // "zero"
    ```

=== "JavaScript"

    ```js
    const en = new Cosmo("en");
    en.pluralCategory(1);           // "one"
    en.pluralCategory(2);           // "other"
    en.pluralCategory(2, true);     // "two"
    new Cosmo("ar").pluralCategory(0); // "zero"
    ```

=== "Python"

    ```python
    en = Cosmo("en")
    en.plural_category(1)           # "one"
    en.plural_category(2)           # "other"
    en.plural_category(2, True)     # "two"
    Cosmo("ar").plural_category(0)  # "zero"
    ```

=== "Java"

    ```java
    Cosmo en = new Cosmo("en");
    en.pluralCategory(1);           // "one"
    en.pluralCategory(2);           // "other"
    en.pluralCategory(2, true);     // "two"
    new Cosmo("ar").pluralCategory(0); // "zero"
    ```

Returns one of `zero`, `one`, `two`, `few`, `many`, `other`. Pass `ordinal = true`
for ordinal rules (1st / 2nd / 3rd …) instead of cardinal. (Java uses real ordinal
`PluralRules`; PHP and Python derive the ordinal category through a `selectordinal`
trick — same result.)
