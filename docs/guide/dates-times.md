---
description: Format dates, times, durations, and time-zone names in the locale's calendar and conventions with Cosmo — width levels, calendar overrides, and raw ICU patterns.
---

# Dates & times

Format dates, times, durations, and calendar metadata using the locale's own
calendar and conventions. The single most important control is **width** — the
verbosity level shared across the whole library:

| `width` | `date()` in `en-GB` | `time()` in `en-GB` |
|---|---|---|
| `none` | *(omits this part)* | *(omits this part)* |
| `short` | `02/02/2020` | `09:25` |
| `medium` | `2 Feb 2020` | `09:25:30` |
| `long` | `2 February 2020` | `09:25:30 GMT` |
| `full` | `Sunday, 2 February 2020` | `09:25:30 Greenwich Mean Time` |

!!! note "What's a *moment*?"
    The date/time argument is a **moment** — a single point on the timeline. It
    accepts your language's native value:

    - **PHP** — a `DateTimeInterface`, `IntlCalendar`, Unix **seconds**, or `localtime()` array.
    - **JavaScript** — a `Date` or Unix **milliseconds**.
    - **Python** — a `datetime`, `date`, or POSIX **seconds**.
    - **Java** — a `java.util.Date` or `java.time.Instant`.
    - **C#** — a `DateTimeOffset`.

    Note the JS **millisecond** convention vs the PHP/Python **second** convention.
    See [Terminology](terminology.md#the-temporal-vocabulary) for *moment* vs
    *duration* vs *range*.

## Date, time, and both

`moment()` formats a date **and** a time; `date()` and `time()` are thin shortcuts
that set the other width to `none`.

| Method | Parameters | Defaults |
|---|---|---|
| `moment(value, dateWidth, timeWidth, calendar?)` | both widths + optional calendar | `short`, `short` |
| `date(value, width)` | date width only | `short` |
| `time(value, width)` | time width only | `short` |

=== "JavaScript"

    ```js
    const c = new Cosmo("en-GB", { timeZone: "Europe/London" });
    const d = new Date("2020-02-02T09:25:30");

    c.date(d, "full");        // "Sunday, 2 February 2020"
    c.time(d, "short");       // "09:25"
    c.moment(d);              // date + time, both 'short'
    c.moment(d, "long", "none"); // long date, no time
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

=== "Java"

    ```java
    Cosmo c = new Cosmo("en_GB", new Modifiers(null, null, "Europe/London"));
    Date d = Date.from(Instant.parse("2020-02-02T09:25:30Z"));

    c.date(d, "full");           // "Sunday, 2 February 2020"
    c.time(d, "short");          // "09:25"
    c.moment(d, "short", "short"); // date + time (Java needs both widths)
    ```

=== "C#"

    ```csharp
    var c = new Cosmo("en-GB", new Modifiers(timeZone: "Europe/London"));
    var d = new DateTimeOffset(2020, 2, 2, 9, 25, 30, TimeSpan.Zero);

    c.Date(d, "full");           // "Sunday, 2 February 2020"
    c.Time(d, "short");          // "09:25"
    c.Moment(d, "short", "short"); // date + time (both widths required)
    ```

### Calendars

The calendar follows the locale automatically — `fa_IR` renders in the Persian
calendar, `th` can render Buddhist. Two ways to control it:

- set the **`calendar` modifier** on the instance (`{ calendar: "buddhist" }`), or
- pass a calendar to `moment()` for a one-off.

Pass the special value `"gregorian"` to force the proleptic Gregorian calendar even
when the locale would imply another:

=== "JavaScript"

    ```js
    const fa = new Cosmo("fa-IR");
    fa.date(new Date("2020-02-02"), "long");               // Persian calendar
    fa.moment(new Date("2020-02-02"), "long", "none", "gregorian"); // forced Gregorian
    new Cosmo("en", { calendar: "buddhist" }).date(d, "full");
    ```

=== "PHP"

    ```php
    $fa = new Cosmo('fa_IR');
    $fa->date(new DateTime('2020-02-02'), 'long');         // Persian calendar
    $fa->moment(new DateTime('2020-02-02'), 'long', 'none', 'gregorian'); // forced
    new Cosmo('en', ['calendar' => 'buddhist'])->date($d, 'full');
    ```

=== "Python"

    ```python
    fa = Cosmo("fa_IR")
    fa.date(d, "long")                                     # Persian calendar
    fa.moment(d, "long", "none", "gregorian")              # forced Gregorian
    Cosmo("en", {"calendar": "buddhist"}).date(d, "full")
    ```

=== "C#"

    ```csharp
    var fa = new Cosmo("fa-IR");
    fa.Date(d, "long");                                    // Persian calendar
    fa.Moment(d, "long", "none", "gregorian");             // forced Gregorian
    new Cosmo("en", new Modifiers(calendar: "buddhist")).Date(d, "full");
    ```

## Duration

`duration()` formats an **undirected** span — magnitude only, no past/future. For
"3 days ago" you want the directed [relative time](lists-ranges-relative.md#relative-directed-duration).

It takes either a **scalar number of seconds** or a **unit breakdown**, and a
`withWords` flag that switches between the digital-clock form and the spelled form:

| Input | `withWords` | Result |
|---|---|---|
| `1222060` (seconds) | `false` (default) | `"339:27:40"` |
| `1222060` (seconds) | `true` | `"339 hours, 27 minutes, 40 seconds"` |
| `{hours: 3, minutes: 5}` | `false` | `"3 hr, 5 min"` |
| `{hours: 3, minutes: 5}` | `true` | `"3 hours, 5 minutes"` |

=== "JavaScript"

    ```js
    new Cosmo("en").duration(1222060);              // "339:27:40"
    new Cosmo("en").duration(1222060, true);        // spelled-out form
    new Cosmo("en").duration({ hours: 3, minutes: 5 }); // unit breakdown
    ```

=== "PHP"

    ```php
    new Cosmo('en')->duration(1222060);             // "339:27:40"
    new Cosmo('en')->duration(1222060, true);       // spelled-out form
    new Cosmo('en')->duration(['hours' => 3, 'minutes' => 5]);
    ```

=== "Python"

    ```python
    Cosmo("en").duration(1222060)                   # "339:27:40"
    Cosmo("en").duration(1222060, True)             # spelled-out form
    Cosmo("en").duration({"hours": 3, "minutes": 5})
    ```

=== "Java"

    ```java
    new Cosmo("en").duration(1222060);              // "339:27:40"
    new Cosmo("en").duration(1222060, true);        // spelled-out form
    new Cosmo("en").duration(Map.of("hours", 3, "minutes", 5));
    ```

=== "C#"

    ```csharp
    new Cosmo("en").Duration(1222060);              // "339:27:40"
    new Cosmo("en").Duration(1222060, withWords: true); // spelled-out form
    new Cosmo("en").Duration(new Dictionary<string, double> { ["hours"] = 3, ["minutes"] = 5 });
    ```

The breakdown keys are `years`, `months`, `weeks`, `days`, `hours`, `minutes`,
`seconds`, `milliseconds` (a `Dictionary<string, double>` in C#, a `Map` in Java). Scalar input is always interpreted as
seconds and split into the hours/minutes/seconds clock form.

!!! note "Runtime requirement (JS)"
    In JavaScript `duration()` requires `Intl.DurationFormat` (Node 22+). PHP,
    Python, Java, and C# use ICU's RBNF `DURATION` ruleset and have no version gate.

## Time-zone name

`timeZoneName()` returns the localised display name of the instance's `timeZone`
modifier (falling back to the runtime zone). The `style` chooses the form:

| `style` | Example (`Australia/Sydney`, `en`) |
|---|---|
| `long` (default) | `Australian Eastern Standard Time` |
| `short` | `AEST` |
| `shortOffset` | `GMT+10` |
| `longOffset` | `GMT+10:00` |
| `shortGeneric` | `Sydney Time` |
| `longGeneric` | `Australian Eastern Time` |

=== "JavaScript"

    ```js
    const c = new Cosmo("en", { timeZone: "Australia/Sydney" });
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

=== "Java"

    ```java
    Cosmo c = new Cosmo("en", new Modifiers(null, null, "Australia/Sydney"));
    c.timeZoneName();                // "Australian Eastern Standard Time"
    c.timeZoneName("shortOffset");   // "GMT+10"
    ```

=== "C#"

    ```csharp
    var c = new Cosmo("en", new Modifiers(timeZone: "Australia/Sydney"));
    c.TimeZoneName();                // "Australian Eastern Standard Time"
    c.TimeZoneName("shortOffset");   // "GMT+10"
    ```

The generic styles drop the standard/daylight distinction (good for labelling a
zone in settings); the offset styles reflect the offset **at the current instant**,
so they swing with daylight saving.

## Calendar names

Localised month and weekday names, aligned to the active calendar. Both take a
[width](#date-time-and-both): `full` (default), `long`, `medium`, `short`.
Weekdays are **Sunday-first** (ICU symbol order) regardless of the locale's first
day — use [`weekInfo()`](#week-information) to find where the week actually starts.

=== "JavaScript"

    ```js
    new Cosmo("en").monthNames()[0];         // "January"
    new Cosmo("en").weekdayNames("medium");  // ["Sun", "Mon", … "Sat"]
    new Cosmo("fa-IR").monthNames()[0];      // "فروردین"
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

=== "Java"

    ```java
    new Cosmo("en").monthNames().get(0);          // "January"
    new Cosmo("en").weekdayNames("medium");       // ["Sun", "Mon", … "Sat"]
    new Cosmo("fa_IR").monthNames().get(0);       // "فروردین"
    ```

=== "C#"

    ```csharp
    new Cosmo("en").MonthNames()[0];          // "January"
    new Cosmo("en").WeekdayNames("medium");   // ["Sun", "Mon", … "Sat"]
    new Cosmo("fa-IR").MonthNames()[0];       // "فروردین"
    ```

### Week information

`weekInfo()` returns the locale's week conventions — the first day of the week and
the minimal-days-in-first-week rule, plus the weekend days:

=== "JavaScript"

    ```js
    new Cosmo("en-US").weekInfo();  // { firstDay: 7, weekend: [6, 7], minimalDays: 1 }
    new Cosmo("fr-FR").weekInfo();  // { firstDay: 1, weekend: [6, 7], ... }
    ```

=== "PHP"

    ```php
    new Cosmo('en_US')->weekInfo(); // ['firstDay' => 7, 'weekend' => [6, 7], 'minimalDays' => 1]
    ```

=== "Python"

    ```python
    Cosmo("en_US").week_info()      # {"firstDay": 7, "minimalDays": 1}  (no weekend — see notes)
    ```

=== "C#"

    ```csharp
    var w = new Cosmo("en-US").WeekInfo();
    // w.FirstDay = 7, w.MinimalDays = 1, w.Weekend = [6, 7]
    ```

Days are `1 = Monday … 7 = Sunday`. PHP, Java, and C# include `weekend`; **Python omits
the weekend** — see [Platform notes](../platform-notes.md).

## Arbitrary patterns & ranges

When the width presets aren't enough, two more tools cover the edges:

- **`formatMoment(value, pattern)`** renders a moment with a raw ICU date/time
  pattern (`yyyy-MM-dd`, `EEEE, d MMM`, …) — exact control for filenames, ISO
  output, or bespoke layouts. **PHP, Python, Java & C# only** (`Intl` has no
  raw-pattern API).
- **`dateRange(start, end, dateWidth?, timeWidth?)`** formats an interval, collapsing
  the shared parts (`"Feb 2 – 5, 2020"`). Available everywhere.

=== "JavaScript"

    ```js
    // formatMoment() is unavailable — Intl has no raw-pattern API.
    new Cosmo("en").dateRange(start, end);            // "Feb 2 – 5, 2020"
    new Cosmo("en").dateRange(start, end, "long");    // "February 2 – 5, 2020"
    ```

=== "PHP"

    ```php
    new Cosmo('en')->formatMoment($d, 'yyyy-MM-dd');  // "2020-02-02"
    new Cosmo('en')->formatMoment($d, 'EEEE, d MMM'); // "Sunday, 2 Feb"
    new Cosmo('en')->dateRange($start, $end);         // "Feb 2 – 5, 2020"  (short/medium)
    ```

=== "Python"

    ```python
    Cosmo("en").format_moment(d, "yyyy-MM-dd")        # "2020-02-02"
    Cosmo("en").format_moment(d, "EEEE, d MMM")       # "Sunday, 2 Feb"
    Cosmo("en").date_range(start, end)                # "Feb 2 – 5, 2020"
    ```

=== "Java"

    ```java
    new Cosmo("en").formatMoment(d, "yyyy-MM-dd");    // "2020-02-02"
    new Cosmo("en").formatMoment(d, "EEEE, d MMM");   // "Sunday, 2 Feb"
    new Cosmo("en").dateRange(start, end);            // "Feb 2 – 5, 2020"
    ```

=== "C#"

    ```csharp
    new Cosmo("en").FormatMoment(d, "yyyy-MM-dd");    // "2020-02-02"
    new Cosmo("en").FormatMoment(d, "EEEE, d MMM");   // "Sunday, 2 Feb"
    new Cosmo("en").DateRange(start, end);            // "Feb 2 – 5, 2020"
    ```

Common pattern letters: `y` year · `M` month (`MMM`/`MMMM` for names) · `d` day ·
`E` weekday · `H`/`h` hour · `m` minute · `s` second · `a` AM/PM · `z`/`Z` zone.
Literal text goes in single quotes (`'on' d MMM`).

!!! info "Two availability notes here"
    - **`formatMoment()`** — **PHP, Python, Java & C#**; `Intl` has no raw-pattern
      API, so it's the one JS can't do.
    - **`dateRange()`** — available **everywhere**, but PHP supports `short`/`medium`
      widths only (it reconstructs intervals from CLDR data; long/full skeletons
      aren't reachable). Python, JavaScript, Java, and C# support all widths.

    See [Platform notes](../platform-notes.md).

## Practical examples

**A "last seen" label that degrades gracefully.** Use relative time for recent
moments and an absolute date for older ones:

=== "JavaScript"

    ```js
    function lastSeen(c, when) {
      const ageDays = (Date.now() - when.getTime()) / 86_400_000;
      return ageDays < 7
        ? c.relativeDurationBetween(when)        // "3 days ago"
        : c.date(when, "medium");                // "2 Feb 2020"
    }
    ```

=== "Python"

    ```python
    import datetime
    def last_seen(c, when):
        age_days = (datetime.datetime.now() - when).days
        return (c.relative_duration_between(when) if age_days < 7
                else c.date(when, "medium"))
    ```

=== "C#"

    ```csharp
    string LastSeen(Cosmo c, DateTimeOffset when) {
        double ageDays = (DateTimeOffset.UtcNow - when).TotalDays;
        return ageDays < 7
            ? c.RelativeDurationBetween(when)    // "3 days ago"
            : c.Date(when, "medium");            // "2 Feb 2020"
    }
    ```

**A sortable log filename, then a friendly header.** `formatMoment()` for the
machine name, the width presets for the human label:

=== "PHP"

    ```php
    $c = new Cosmo('en_GB', ['timeZone' => 'UTC']);
    $name   = $c->formatMoment($d, "yyyy-MM-dd'T'HH-mm-ss") . '.log'; // 2020-02-02T09-25-30.log
    $header = $c->moment($d, 'full', 'short');                        // "Sunday, 2 February 2020 at 09:25"
    ```

=== "Python"

    ```python
    c = Cosmo("en_GB", {"timeZone": "UTC"})
    name   = c.format_moment(d, "yyyy-MM-dd'T'HH-mm-ss") + ".log"  # 2020-02-02T09-25-30.log
    header = c.moment(d, "full", "short")                         # "Sunday, 2 February 2020 at 09:25"
    ```

=== "C#"

    ```csharp
    var c = new Cosmo("en-GB", new Modifiers(timeZone: "UTC"));
    string name   = c.FormatMoment(d, "yyyy-MM-dd'T'HH-mm-ss") + ".log"; // 2020-02-02T09-25-30.log
    string header = c.Moment(d, "full", "short");                        // "Sunday, 2 February 2020 at 09:25"
    ```
