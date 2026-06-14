# Dates & times

Format dates, times, and durations using the locale's calendar and conventions.
Width is one of `none`, `short`, `medium`, `long`, `full`.

!!! note "What's a *moment*?"
    The date/time argument accepts your language's native value and:

    - **PHP** — a `DateTimeInterface`, `IntlCalendar`, Unix **seconds**, or `localtime()` array.
    - **JavaScript** — a `Date` or Unix **milliseconds**.
    - **Python** — a `datetime`, `date`, or POSIX **seconds**.
    - **Java** — a `java.util.Date` or `java.time.Instant`.

    Note the JS millisecond convention vs the PHP/Python second convention.

## Date, time, and both

=== "JavaScript"

    ```js
    const c = new Cosmo("en-GB", { timeZone: "Europe/London" });
    const d = new Date("2020-02-02T09:25:30");

    c.date(d, "full");        // "Sunday, 2 February 2020"
    c.time(d, "short");       // "09:25"
    c.moment(d);              // date + time, both 'short'
    ```

=== "Java"

    ```java
    Cosmo c = new Cosmo("en_GB", new Modifiers(null, null, "Europe/London"));
    Date d = Date.from(Instant.parse("2020-02-02T09:25:30Z"));

    c.date(d, "full");           // "Sunday, 2 February 2020"
    c.time(d, "short");          // "09:25"
    c.moment(d, "short", "short"); // date + time (Java needs both widths)
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en_GB', ['timeZone' => 'Europe/London']);
    $d = new DateTime('2020-02-02 09:25:30');

    $c->date($d, 'full');     // "Sunday, 2 February 2020"
    $c->time($d, 'short');    // "09:25"
    $c->moment($d);           // date + time, both 'short'
    ```

=== "Python"

    ```python
    import datetime
    c = Cosmo("en_GB", {"timeZone": "Europe/London"})
    d = datetime.datetime(2020, 2, 2, 9, 25, 30)

    c.date(d, "full")         # "Sunday, 2 February 2020"
    c.time(d, "short")        # "09:25"
    c.moment(d)               # date + time, both 'short'
    ```

The calendar follows the locale (e.g. `fa_IR` → Persian). Pass `"gregorian"` as
the calendar argument to `moment()` to force the Gregorian calendar.

## Duration

`duration()` formats an **undirected** span given in **seconds** — magnitude
only, no past/future. For "3 days ago" see [relative time](lists-ranges-relative.md).

=== "JavaScript"

    ```js
    new Cosmo("en").duration(1222060);         // "339:27:40"
    new Cosmo("en").duration(1222060, true);   // spelled-out form
    ```

=== "Java"

    ```java
    new Cosmo("en").duration(1222060);         // "339:27:40"
    new Cosmo("en").duration(1222060, true);   // spelled-out form
    ```

=== "PHP"

    ```php
    new Cosmo('en')->duration(1222060);        // "339:27:40"
    new Cosmo('en')->duration(1222060, true);  // spelled-out form
    ```

=== "Python"

    ```python
    Cosmo("en").duration(1222060)              # "339:27:40"
    Cosmo("en").duration(1222060, True)        # spelled-out form
    ```

You can also pass a **unit breakdown** (`{hours, minutes, …}`) instead of scalar
seconds — `duration({hours: 3, minutes: 5})` → "3 hours, 5 minutes" — in any port
(a `Map` in Java).

!!! note
    In JavaScript `duration()` requires `Intl.DurationFormat` (Node 22+). PHP,
    Python, and Java use ICU's RBNF `DURATION` ruleset.

## Time-zone name

=== "JavaScript"

    ```js
    const c = new Cosmo("en", { timeZone: "Australia/Sydney" });
    c.timeZoneName();                // "Australian Eastern Standard Time"
    c.timeZoneName("shortOffset");   // "GMT+10"
    ```

=== "Java"

    ```java
    Cosmo c = new Cosmo("en", new Modifiers(null, null, "Australia/Sydney"));
    c.timeZoneName();                // "Australian Eastern Standard Time"
    c.timeZoneName("shortOffset");   // "GMT+10"
    ```

=== "PHP"

    ```php
    $c = new Cosmo('en', ['timeZone' => 'Australia/Sydney']);
    $c->timeZoneName();              // "Australian Eastern Standard Time"
    $c->timeZoneName('shortOffset'); // "GMT+10"  (or +11 during daylight time)
    ```

=== "Python"

    ```python
    c = Cosmo("en", {"timeZone": "Australia/Sydney"})
    c.time_zone_name()               # "Australian Eastern Standard Time"
    c.time_zone_name("shortOffset")  # "GMT+10"
    ```

Styles: `long` (default), `short`, `shortOffset`, `longOffset`, `shortGeneric`,
`longGeneric`.

## Calendar names

Localised month and weekday names, aligned to the active calendar. Weekdays are
**Sunday-first** (ICU symbol order).

=== "JavaScript"

    ```js
    new Cosmo("en").monthNames()[0];         // "January"
    new Cosmo("en").weekdayNames("medium");  // ["Sun", "Mon", … "Sat"]
    new Cosmo("fa-IR").monthNames()[0];      // "فروردین"
    ```

=== "Java"

    ```java
    new Cosmo("en").monthNames().get(0);          // "January"
    new Cosmo("en").weekdayNames("medium");       // ["Sun", "Mon", … "Sat"]
    new Cosmo("fa_IR").monthNames().get(0);       // "فروردین"
    ```

=== "PHP"

    ```php
    new Cosmo('en')->monthNames()[0];        // "January"
    new Cosmo('en')->weekdayNames('medium'); // ["Sun", "Mon", … "Sat"]
    new Cosmo('fa_IR')->monthNames()[0];     // "فروردین"  (Persian calendar)
    ```

=== "Python"

    ```python
    Cosmo("en").month_names()[0]             # "January"
    Cosmo("en").weekday_names("medium")      # ["Sun", "Mon", … "Sat"]
    Cosmo("fa_IR").month_names()[0]          # "فروردین"
    ```

`weekInfo()` returns the locale's first day of the week and minimal-days rule in
every port (plus the weekend days in PHP and Java; Python omits the weekend — see
[Platform notes](../platform-notes.md)).

## Arbitrary patterns & ranges

=== "JavaScript"

    ```js
    // Date ranges:
    new Cosmo("en").dateRange(start, end);            // "Feb 2 – 5, 2020"
    // formatMoment() is unavailable — Intl has no raw-pattern API.
    ```

=== "Java"

    ```java
    // Raw ICU date pattern (PHP, Python & Java):
    new Cosmo("en").formatMoment(d, "yyyy-MM-dd");    // "2020-02-02"

    // Date ranges:
    new Cosmo("en").dateRange(start, end);            // "Feb 2 – 5, 2020"
    ```

=== "PHP"

    ```php
    // Raw ICU date pattern (PHP, Python & Java):
    new Cosmo('en')->formatMoment($d, 'yyyy-MM-dd');  // "2020-02-02"

    // Date ranges (short/medium only in PHP):
    new Cosmo('en')->dateRange($start, $end);         // "Feb 2 – 5, 2020"
    ```

=== "Python"

    ```python
    # Raw ICU date pattern (PHP, Python & Java):
    Cosmo("en").format_moment(d, "yyyy-MM-dd")        # "2020-02-02"

    # Date ranges:
    Cosmo("en").date_range(start, end)                # "Feb 2 – 5, 2020"
    ```

!!! info "Two availability notes here"
    - **`formatMoment()`** (arbitrary ICU patterns) — **PHP, Python & Java**;
      `Intl` has no raw-pattern API, so it's the one JS can't do.
    - **`dateRange()`** — available **everywhere**, but PHP supports `short`/`medium`
      widths only (it reconstructs intervals from CLDR data; long/full skeletons
      aren't reachable). Python, JavaScript, and Java support all widths.

    See [Platform notes](../platform-notes.md).
