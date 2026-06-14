# Dates & times

Format dates, times, and durations using the locale's calendar and conventions.
Width is one of `none`, `short`, `medium`, `long`, `full`.

!!! note "What's a *moment*?"
    The date/time argument accepts your language's native value and:

    - **PHP** — a `DateTimeInterface`, `IntlCalendar`, Unix **seconds**, or `localtime()` array.
    - **JavaScript** — a `Date` or Unix **milliseconds**.
    - **Python** — a `datetime`, `date`, or POSIX **seconds**.

    Note the JS millisecond convention vs the PHP/Python second convention.

## Date, time, and both

=== "PHP"

    ```php
    $c = new Cosmo('en_GB', ['timeZone' => 'Europe/London']);
    $d = new DateTime('2020-02-02 09:25:30');

    $c->date($d, 'full');     // "Sunday, 2 February 2020"
    $c->time($d, 'short');    // "09:25"
    $c->moment($d);           // date + time, both 'short'
    ```

=== "JavaScript"

    ```js
    const c = new Cosmo("en-GB", { timeZone: "Europe/London" });
    const d = new Date("2020-02-02T09:25:30");

    c.date(d, "full");        // "Sunday, 2 February 2020"
    c.time(d, "short");       // "09:25"
    c.moment(d);              // date + time, both 'short'
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

=== "PHP"

    ```php
    new Cosmo('en')->duration(1222060);        // "339:27:40"
    new Cosmo('en')->duration(1222060, true);  // spelled-out form
    ```

=== "JavaScript"

    ```js
    new Cosmo("en").duration(1222060);         // "339:27:40"
    new Cosmo("en").duration(1222060, true);   // spelled-out form
    ```

=== "Python"

    ```python
    Cosmo("en").duration(1222060)              # "339:27:40"
    Cosmo("en").duration(1222060, True)        # spelled-out form
    ```

!!! note
    In JavaScript `duration()` requires `Intl.DurationFormat` (Node 22+).

## Time-zone name

=== "PHP"

    ```php
    $c = new Cosmo('en', ['timeZone' => 'Australia/Sydney']);
    $c->timeZoneName();              // "Australian Eastern Standard Time"
    $c->timeZoneName('shortOffset'); // "GMT+10"  (or +11 during daylight time)
    ```

=== "JavaScript"

    ```js
    const c = new Cosmo("en", { timeZone: "Australia/Sydney" });
    c.timeZoneName();                // "Australian Eastern Standard Time"
    c.timeZoneName("shortOffset");   // "GMT+10"
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

=== "PHP"

    ```php
    new Cosmo('en')->monthNames()[0];        // "January"
    new Cosmo('en')->weekdayNames('medium'); // ["Sun", "Mon", … "Sat"]
    new Cosmo('fa_IR')->monthNames()[0];     // "فروردین"  (Persian calendar)
    ```

=== "JavaScript"

    ```js
    new Cosmo("en").monthNames()[0];         // "January"
    new Cosmo("en").weekdayNames("medium");  // ["Sun", "Mon", … "Sat"]
    new Cosmo("fa-IR").monthNames()[0];      // "فروردین"
    ```

=== "Python"

    ```python
    Cosmo("en").month_names()[0]             # "January"
    Cosmo("en").weekday_names("medium")      # ["Sun", "Mon", … "Sat"]
    Cosmo("fa_IR").month_names()[0]          # "فروردین"
    ```

## Arbitrary patterns & ranges

=== "PHP"

    ```php
    // Raw ICU date pattern (PHP & Python only):
    new Cosmo('en')->formatMoment($d, 'yyyy-MM-dd');  // "2020-02-02"
    ```

=== "Python"

    ```python
    # Raw ICU date pattern (PHP & Python only):
    Cosmo("en").format_moment(d, "yyyy-MM-dd")        # "2020-02-02"

    # Date ranges (JavaScript & Python only):
    Cosmo("en").date_range(start, end)                # "Feb 2 – 5, 2020"
    ```

=== "JavaScript"

    ```js
    // Date ranges (JavaScript & Python only):
    new Cosmo("en").dateRange(start, end);            // "Feb 2 – 5, 2020"
    ```

!!! info "Two split availabilities here"
    - **`formatMoment()` / `format_moment()`** (arbitrary ICU patterns) — **PHP &
      Python only**; `Intl` has no raw-pattern API.
    - **`dateRange()` / `date_range()`** — **JavaScript & Python only**; PHP's
      `IntlDateFormatter` exposes no range formatter.

    Python has both. See [Platform notes](../platform-notes.md).
