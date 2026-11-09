from pathlib import Path
import unittest

from hooks.languages import LANGUAGES, AVAILABILITY, render, select_examples, local_links, SOURCES, api_links

ROOT = Path(__file__).resolve().parents[1]


class LanguagePages(unittest.TestCase):
    def test_examples_never_fall_back_to_another_language(self):
        source = '=== "PHP"\n\n    ```php\n    echo 1;\n    ```\n\n=== "Python"\n\n    ```python\n    print(1)\n    ```\n\n## Next section\n'
        python = select_examples(source, 'Python')
        self.assertIn('```python\nprint(1)', python)
        self.assertNotIn('echo', python)
        self.assertNotIn('===', python)
        java = select_examples(source, 'Java')
        self.assertNotIn('```', java)
        self.assertIn('## Next section', java)

    def test_icu_placeholders_are_not_template_comments(self):
        source = 'Pattern: `{n, plural, one {# item} other {# items}}`.\n'
        self.assertEqual(render(source, 'php'), source)

    def test_language_sections_have_independent_content(self):
        source = (ROOT / 'docs/guide/negotiation-names.md').read_text()
        python = render(source, 'python')
        java = render(source, 'java')
        self.assertNotIn('## Person names', python)
        self.assertIn('## Person names', java)
        self.assertNotIn('```java', python)
        self.assertNotIn('```python', java)

    def test_runtime_notes_and_tables_follow_the_language(self):
        source = (ROOT / 'docs/guide/locale-metadata.md').read_text()
        php = render(source, 'php')
        csharp = render(source, 'csharp')
        self.assertNotIn('## Likely subtags', php)
        self.assertNotIn('| `unit` | every formattable unit', csharp)
        self.assertIn('## Likely subtags', csharp)
        self.assertIn('`SupportedValues(key)`', csharp)

    def test_method_names_preserve_public_anchors(self):
        source = '## `relativeDuration()`\n\nUse `relativeDuration(1, "day")`.\n'
        python = render(source, 'python')
        self.assertIn('`relative_duration()` { #relativeduration }', python)
        self.assertIn('`relative_duration(1, "day")`', python)

    def test_all_authored_templates_render_in_each_language(self):
        for path in (ROOT / 'docs').rglob('*.md'):
            if 'javascripts' in path.parts or path.name in {'index.md', 'parity.md'}:
                continue
            for language in LANGUAGES:
                with self.subTest(page=path.name, language=language):
                    text = render(path.read_text(), language)
                    self.assertNotIn('{% ', text)
                    self.assertNotIn('=== "', text)
                    self.assertEqual(sum(line.lstrip().startswith('```') for line in text.splitlines()) % 2, 0)

    def test_api_links_open_the_selected_reference_directly(self):
        html = '<a href="../../api-reference/" class="md-nav__link">API reference</a><a href="../numbers/">Numbers</a>'
        result = api_links(html, 'python')
        self.assertIn('href="https://cosmo-intl.github.io/cosmo-python/"', result)
        self.assertIn('target="_blank" rel="noopener noreferrer"', result)
        self.assertIn('<a href="../numbers/">Numbers</a>', result)

    def test_navigation_availability(self):
        self.assertNotIn('javascript', AVAILABILITY['guide/transliteration-parsing.md'])
        self.assertEqual(AVAILABILITY['guide/negotiation-names.md'], {'python', 'java'})
        self.assertEqual(AVAILABILITY['playground.md'], {'javascript'})

    def test_relative_links_keep_language_and_fragments(self):
        before = dict(SOURCES)
        try:
            SOURCES.update({'guide/numbers.md': '', 'parity.md': '', 'guide/negotiation-names.md': '', 'platform-notes.md': ''})
            text = '[Numbers](numbers.md#rounding) [Compare](../parity.md) [Names](negotiation-names.md)'
            actual = local_links(text, 'guide/money.md', 'php', 'php/guide/money.md')
            self.assertIn('(numbers.md#rounding)', actual)
            self.assertIn('(../../parity.md)', actual)
            self.assertIn('(../platform-notes.md)', actual)
        finally:
            SOURCES.clear(); SOURCES.update(before)


if __name__ == '__main__':
    unittest.main()
