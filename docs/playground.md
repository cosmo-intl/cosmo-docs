---
title: Playground
description: Try Cosmo live in your browser — format money, dates, numbers, and more across locales with the interactive JavaScript playground.
---

# Playground

This page runs the **real** `@miloun/cosmo` JS port (vendored under
`javascripts/cosmopolitan/`) entirely in your browser. Because the library is
built on the standard `Intl` API, every value below comes straight from **your
own browser's ICU** — there is no server, and no results are precomputed.

Pick a locale (or type any BCP-47 tag), optionally set a time zone and currency,
and the table updates live. Methods your runtime can't back simply show the
error in place, so you can see exactly what `Intl` exposes where you are.

!!! info "Other ports"
    The PHP, Python, Java, and C# ports produce the **same** output (ICU is the
    common engine); only the call syntax differs — and they add the raw-ICU methods
    `Intl` can't reach (parsing, transliteration, `spellout`, …). See the
    [API reference](api-reference.md) and [Feature parity](parity.md) for the
    cross-language picture.

<div id="cosmo-playground">
  <noscript>The playground needs JavaScript enabled.</noscript>
</div>
