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

Every IANA zone your runtime's ICU knows, grouped by region. (You can also fetch
this list at runtime with `supportedValues('timeZone')`.)

??? note "Africa (52)"

    Africa/Abidjan, Africa/Accra, Africa/Addis_Ababa, Africa/Algiers, Africa/Asmera, Africa/Bamako, Africa/Bangui, Africa/Banjul, Africa/Bissau, Africa/Blantyre, Africa/Brazzaville, Africa/Bujumbura, Africa/Cairo, Africa/Casablanca, Africa/Ceuta, Africa/Conakry, Africa/Dakar, Africa/Dar_es_Salaam, Africa/Djibouti, Africa/Douala, Africa/El_Aaiun, Africa/Freetown, Africa/Gaborone, Africa/Harare, Africa/Johannesburg, Africa/Juba, Africa/Kampala, Africa/Khartoum, Africa/Kigali, Africa/Kinshasa, Africa/Lagos, Africa/Libreville, Africa/Lome, Africa/Luanda, Africa/Lubumbashi, Africa/Lusaka, Africa/Malabo, Africa/Maputo, Africa/Maseru, Africa/Mbabane, Africa/Mogadishu, Africa/Monrovia, Africa/Nairobi, Africa/Ndjamena, Africa/Niamey, Africa/Nouakchott, Africa/Ouagadougou, Africa/Porto-Novo, Africa/Sao_Tome, Africa/Tripoli, Africa/Tunis, Africa/Windhoek

??? note "America (144)"

    America/Adak, America/Anchorage, America/Anguilla, America/Antigua, America/Araguaina, America/Argentina/La_Rioja, America/Argentina/Rio_Gallegos, America/Argentina/Salta, America/Argentina/San_Juan, America/Argentina/San_Luis, America/Argentina/Tucuman, America/Argentina/Ushuaia, America/Aruba, America/Asuncion, America/Bahia, America/Bahia_Banderas, America/Barbados, America/Belem, America/Belize, America/Blanc-Sablon, America/Boa_Vista, America/Bogota, America/Boise, America/Buenos_Aires, America/Cambridge_Bay, America/Campo_Grande, America/Cancun, America/Caracas, America/Catamarca, America/Cayenne, America/Cayman, America/Chicago, America/Chihuahua, America/Ciudad_Juarez, America/Coral_Harbour, America/Cordoba, America/Costa_Rica, America/Coyhaique, America/Creston, America/Cuiaba, America/Curacao, America/Danmarkshavn, America/Dawson, America/Dawson_Creek, America/Denver, America/Detroit, America/Dominica, America/Edmonton, America/Eirunepe, America/El_Salvador, America/Fort_Nelson, America/Fortaleza, America/Glace_Bay, America/Godthab, America/Goose_Bay, America/Grand_Turk, America/Grenada, America/Guadeloupe, America/Guatemala, America/Guayaquil, America/Guyana, America/Halifax, America/Havana, America/Hermosillo, America/Indiana/Knox, America/Indiana/Marengo, America/Indiana/Petersburg, America/Indiana/Tell_City, America/Indiana/Vevay, America/Indiana/Vincennes, America/Indiana/Winamac, America/Indianapolis, America/Inuvik, America/Iqaluit, America/Jamaica, America/Jujuy, America/Juneau, America/Kentucky/Monticello, America/Kralendijk, America/La_Paz, America/Lima, America/Los_Angeles, America/Louisville, America/Lower_Princes, America/Maceio, America/Managua, America/Manaus, America/Marigot, America/Martinique, America/Matamoros, America/Mazatlan, America/Mendoza, America/Menominee, America/Merida, America/Metlakatla, America/Mexico_City, America/Miquelon, America/Moncton, America/Monterrey, America/Montevideo, America/Montserrat, America/Nassau, America/New_York, America/Nome, America/Noronha, America/North_Dakota/Beulah, America/North_Dakota/Center, America/North_Dakota/New_Salem, America/Ojinaga, America/Panama, America/Paramaribo, America/Phoenix, America/Port-au-Prince, America/Port_of_Spain, America/Porto_Velho, America/Puerto_Rico, America/Punta_Arenas, America/Rankin_Inlet, America/Recife, America/Regina, America/Resolute, America/Rio_Branco, America/Santarem, America/Santiago, America/Santo_Domingo, America/Sao_Paulo, America/Scoresbysund, America/Sitka, America/St_Barthelemy, America/St_Johns, America/St_Kitts, America/St_Lucia, America/St_Thomas, America/St_Vincent, America/Swift_Current, America/Tegucigalpa, America/Thule, America/Tijuana, America/Toronto, America/Tortola, America/Vancouver, America/Whitehorse, America/Winnipeg, America/Yakutat

??? note "Antarctica (11)"

    Antarctica/Casey, Antarctica/Davis, Antarctica/DumontDUrville, Antarctica/Macquarie, Antarctica/Mawson, Antarctica/McMurdo, Antarctica/Palmer, Antarctica/Rothera, Antarctica/Syowa, Antarctica/Troll, Antarctica/Vostok

??? note "Arctic (1)"

    Arctic/Longyearbyen

??? note "Asia (82)"

    Asia/Aden, Asia/Almaty, Asia/Amman, Asia/Anadyr, Asia/Aqtau, Asia/Aqtobe, Asia/Ashgabat, Asia/Atyrau, Asia/Baghdad, Asia/Bahrain, Asia/Baku, Asia/Bangkok, Asia/Barnaul, Asia/Beirut, Asia/Bishkek, Asia/Brunei, Asia/Calcutta, Asia/Chita, Asia/Colombo, Asia/Damascus, Asia/Dhaka, Asia/Dili, Asia/Dubai, Asia/Dushanbe, Asia/Famagusta, Asia/Gaza, Asia/Hebron, Asia/Hong_Kong, Asia/Hovd, Asia/Irkutsk, Asia/Jakarta, Asia/Jayapura, Asia/Jerusalem, Asia/Kabul, Asia/Kamchatka, Asia/Karachi, Asia/Katmandu, Asia/Khandyga, Asia/Krasnoyarsk, Asia/Kuala_Lumpur, Asia/Kuching, Asia/Kuwait, Asia/Macau, Asia/Magadan, Asia/Makassar, Asia/Manila, Asia/Muscat, Asia/Nicosia, Asia/Novokuznetsk, Asia/Novosibirsk, Asia/Omsk, Asia/Oral, Asia/Phnom_Penh, Asia/Pontianak, Asia/Pyongyang, Asia/Qatar, Asia/Qostanay, Asia/Qyzylorda, Asia/Rangoon, Asia/Riyadh, Asia/Saigon, Asia/Sakhalin, Asia/Samarkand, Asia/Seoul, Asia/Shanghai, Asia/Singapore, Asia/Srednekolymsk, Asia/Taipei, Asia/Tashkent, Asia/Tbilisi, Asia/Tehran, Asia/Thimphu, Asia/Tokyo, Asia/Tomsk, Asia/Ulaanbaatar, Asia/Urumqi, Asia/Ust-Nera, Asia/Vientiane, Asia/Vladivostok, Asia/Yakutsk, Asia/Yekaterinburg, Asia/Yerevan

??? note "Atlantic (10)"

    Atlantic/Azores, Atlantic/Bermuda, Atlantic/Canary, Atlantic/Cape_Verde, Atlantic/Faeroe, Atlantic/Madeira, Atlantic/Reykjavik, Atlantic/South_Georgia, Atlantic/St_Helena, Atlantic/Stanley

??? note "Australia (11)"

    Australia/Adelaide, Australia/Brisbane, Australia/Broken_Hill, Australia/Darwin, Australia/Eucla, Australia/Hobart, Australia/Lindeman, Australia/Lord_Howe, Australia/Melbourne, Australia/Perth, Australia/Sydney

??? note "Europe (58)"

    Europe/Amsterdam, Europe/Andorra, Europe/Astrakhan, Europe/Athens, Europe/Belgrade, Europe/Berlin, Europe/Bratislava, Europe/Brussels, Europe/Bucharest, Europe/Budapest, Europe/Busingen, Europe/Chisinau, Europe/Copenhagen, Europe/Dublin, Europe/Gibraltar, Europe/Guernsey, Europe/Helsinki, Europe/Isle_of_Man, Europe/Istanbul, Europe/Jersey, Europe/Kaliningrad, Europe/Kiev, Europe/Kirov, Europe/Lisbon, Europe/Ljubljana, Europe/London, Europe/Luxembourg, Europe/Madrid, Europe/Malta, Europe/Mariehamn, Europe/Minsk, Europe/Monaco, Europe/Moscow, Europe/Oslo, Europe/Paris, Europe/Podgorica, Europe/Prague, Europe/Riga, Europe/Rome, Europe/Samara, Europe/San_Marino, Europe/Sarajevo, Europe/Saratov, Europe/Simferopol, Europe/Skopje, Europe/Sofia, Europe/Stockholm, Europe/Tallinn, Europe/Tirane, Europe/Ulyanovsk, Europe/Vaduz, Europe/Vatican, Europe/Vienna, Europe/Vilnius, Europe/Volgograd, Europe/Warsaw, Europe/Zagreb, Europe/Zurich

??? note "Indian (11)"

    Indian/Antananarivo, Indian/Chagos, Indian/Christmas, Indian/Cocos, Indian/Comoro, Indian/Kerguelen, Indian/Mahe, Indian/Maldives, Indian/Mauritius, Indian/Mayotte, Indian/Reunion

??? note "Pacific (38)"

    Pacific/Apia, Pacific/Auckland, Pacific/Bougainville, Pacific/Chatham, Pacific/Easter, Pacific/Efate, Pacific/Enderbury, Pacific/Fakaofo, Pacific/Fiji, Pacific/Funafuti, Pacific/Galapagos, Pacific/Gambier, Pacific/Guadalcanal, Pacific/Guam, Pacific/Honolulu, Pacific/Kiritimati, Pacific/Kosrae, Pacific/Kwajalein, Pacific/Majuro, Pacific/Marquesas, Pacific/Midway, Pacific/Nauru, Pacific/Niue, Pacific/Norfolk, Pacific/Noumea, Pacific/Pago_Pago, Pacific/Palau, Pacific/Pitcairn, Pacific/Ponape, Pacific/Port_Moresby, Pacific/Rarotonga, Pacific/Saipan, Pacific/Tahiti, Pacific/Tarawa, Pacific/Tongatapu, Pacific/Truk, Pacific/Wake, Pacific/Wallis

