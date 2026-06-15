# API reference

The API reference is **per language**, and each one is **generated directly from
that port's source** — so the signatures, parameter types, return types, and notes
are always exactly what the code documents. Pick your language:

<div class="grid cards" markdown>

-   :material-language-javascript: **[JavaScript / TypeScript →](https://cosmo-intl.github.io/cosmo-js/)**

    ---

    Generated with **TypeDoc** from the TypeScript sources.

-   :material-language-java: **[Java →](https://cosmo-intl.github.io/cosmo-java/)**

    ---

    Generated with **Javadoc** from the ICU4J-backed sources.

-   :fontawesome-brands-php: **[PHP →](https://salarmehr.github.io/cosmopolitan/)**

    ---

    Generated with **phpDocumentor** from the `ext-intl` sources.

-   :material-language-python: **[Python →](https://cosmo-intl.github.io/cosmo-python/)**

    ---

    Generated with **pdoc** from the PyICU-backed sources.

</div>

!!! info "Why per-language?"
    Most people work in one language, and the call surface genuinely differs between
    ports — `money()` is an options-bag in JavaScript, positional in PHP/Python, and
    four overloads in Java; `personName()` exists only in Java. A single merged table
    would flatten that away, so each reference shows its own port faithfully, straight
    from the doc blocks.

For runnable, cross-language **examples**, see the [Guide](guide/terminology.md)
(every snippet is shown in all four languages). For a side-by-side view of **what
works where** and the ICU machinery behind it, see [Feature parity](parity.md).
