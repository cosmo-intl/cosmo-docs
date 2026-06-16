---
title: Locales & time zones
description: Plain-language guide to the locale identifier (language-REGION) Cosmo uses, how to find yours, and the full list of IANA time-zone names.
---

# Locales & time zones

Cosmo is driven by two short codes: a **locale** (who your user is) and an
optional **time zone** (where they are in time). This page explains both in plain
language and links to the full lists.

## What a locale looks like

A locale identifier is a small code like `en-US` or `fa-IR`. It has up to three
parts — only the first is required:

| Part | What it is | Examples |
|---|---|---|
| **Language** *(required)* | 2–3 lowercase letters | `en`, `fr`, `ar`, `zh`, `fa` |
| **Region** *(recommended)* | 2 uppercase letters — a country | `US`, `GB`, `AU`, `BR`, `IR` |
| **Script** *(rare)* | 4 letters, capitalised — only when a language uses more than one writing system | `Hans`, `Hant`, `Cyrl`, `Latn` |

Put together:

- `en` — English, no country (Cosmo falls back to sensible defaults)
- `en-US` — English, United States ($, `MM/DD/YYYY`, 12-hour clock)
- `en-GB` — English, United Kingdom (£, `DD/MM/YYYY`)
- `pt-BR` — Portuguese, Brazil
- `zh-Hans-CN` — Chinese, Simplified script, mainland China

!!! tip "The region matters more than you think"
    The **region** decides the currency, the date order, number grouping
    (`1,000.5` vs `1.000,5`), measurement units, and the first day of the week.
    Set only the language and you get *that language's* default region — which may
    not be your user's. When in doubt, include a country: `en-CA`, not just `en`.

### Hyphen or underscore?

Both work. `en-US` (the BCP-47 web standard) and `en_US` (POSIX style) are
accepted in PHP, Python, and Java; JavaScript prefers the hyphen form. Case is
normalised for you, but the convention is **lowercase language, Titlecase script,
UPPERCASE region**.

## How to find the right one

You almost always want **your language + your country**, e.g. `en-CA`, `de-AT`,
`es-MX`.

- **In a browser:** `navigator.language` (or the `navigator.languages` list).
- **From a web request:** the `Accept-Language` header — Cosmo reads it directly
  with `fromAcceptLanguage(...)` (see [Getting started](getting-started.md)).
- **Try it live:** type any tag into the [Playground](playground.md) and watch the
  output change instantly.
- **Browse every option:** there is no single fixed "list of all locales" — a
  locale is any valid *language × region* combination. The authoritative sources
  are the [IANA language subtag registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)
  (every language, script, and region code) and the
  [Unicode CLDR charts](https://www.unicode.org/cldr/charts/latest/).

### Common locales

| Locale | Language — region |
|---|---|
| `en-US` | English — United States |
| `en-GB` | English — United Kingdom |
| `en-AU` | English — Australia |
| `en-CA` | English — Canada |
| `fr-FR` | French — France |
| `de-DE` | German — Germany |
| `es-ES` | Spanish — Spain |
| `es-MX` | Spanish — Mexico |
| `pt-BR` | Portuguese — Brazil |
| `it-IT` | Italian — Italy |
| `nl-NL` | Dutch — Netherlands |
| `ru-RU` | Russian — Russia |
| `tr-TR` | Turkish — Türkiye |
| `ar-EG` | Arabic — Egypt |
| `fa-IR` | Persian — Iran |
| `hi-IN` | Hindi — India |
| `zh-Hans-CN` | Chinese (Simplified) — China |
| `zh-Hant-TW` | Chinese (Traditional) — Taiwan |
| `ja-JP` | Japanese — Japan |
| `ko-KR` | Korean — South Korea |

### Going further: Unicode extensions

You can pin a calendar, numbering system, and more directly in the tag with a
`-u-` extension — e.g. `fa-IR-u-ca-persian-nu-latn` (Persian calendar, Latin
digits). These are optional and advanced; most apps never need them.

## Time zones

A time zone is a **separate** setting from the locale — it's *where in time* your
user is, and it only affects dates and times. Cosmo uses **IANA time-zone names**,
which look like `Area/Location`:

- `America/New_York`
- `Europe/London`
- `Asia/Tehran`
- `Australia/Sydney`

Set it with the `timeZone` modifier when you build a Cosmo (see
[Getting started](getting-started.md)). `UTC` is always valid; if you leave it
out, the runtime's default zone is used.

!!! tip "Use a city, not an offset"
    Prefer `Europe/Paris` over a fixed `+01:00`. Named zones carry the
    daylight-saving rules, so your times stay correct all year round.

### The full list

There are several hundred IANA zones. Rather than reproduce them here, see the
complete, regularly-updated reference:

- [List of tz database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) — every zone, with UTC offsets and notes.
- [IANA Time Zone Database](https://www.iana.org/time-zones) — the authoritative source.

You can also enumerate exactly what your runtime supports at any time with
`supportedValues('timeZone')`.
