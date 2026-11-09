"""Build language-specific documentation from shared Markdown and code examples."""
from copy import copy
import posixpath
import re

from jinja2 import Environment, StrictUndefined
from mkdocs.structure.files import File, InclusionLevel
from mkdocs.structure.nav import Navigation, Section
from mkdocs.utils import get_relative_url

LANGUAGES = {'javascript': 'JavaScript', 'php': 'PHP', 'python': 'Python', 'java': 'Java', 'csharp': 'C#'}
SHARED = {'index.md', 'parity.md'}
AVAILABILITY = {
    'guide/transliteration-parsing.md': {'php', 'python', 'java', 'csharp'},
    'guide/negotiation-names.md': {'python', 'java'},
    'playground.md': {'javascript'},
}
ENV = Environment(trim_blocks=True, lstrip_blocks=True, undefined=StrictUndefined, variable_start_string='[[', variable_end_string=']]', comment_start_string='{#DOC', comment_end_string='DOC#}', keep_trailing_newline=True)
SOURCES = {}
FILES = None


def select_examples(markdown, label):
    """Unwrap the selected example; never substitute another language's code."""
    lines = markdown.splitlines(keepends=True)
    output = []
    i = 0
    while i < len(lines):
        match = re.fullmatch(r'=== "([^"]+)"\s*\n?', lines[i])
        if not match:
            output.append(lines[i])
            i += 1
            continue
        choices = {}
        while i < len(lines):
            match = re.fullmatch(r'=== "([^"]+)"\s*\n?', lines[i])
            if not match:
                break
            name = match[1]
            i += 1
            body = []
            while i < len(lines) and (not lines[i].strip() or lines[i].startswith('    ')):
                body.append(lines[i][4:] if lines[i].startswith('    ') else lines[i])
                i += 1
            choices[name] = ''.join(body).strip('\n')
        if label in choices:
            output.append(choices[label] + '\n\n')
        else:
            # Drop the introduction to a recipe when it has no example in this language.
            prefix = ''.join(output).rstrip()
            previous, separator, paragraph = prefix.rpartition('\n\n')
            if paragraph.startswith('**'):
                output = [previous + '\n\n']
    text = ''.join(output)
    return re.sub(r'## Practical examples\s*\Z', '', text)



METHODS = set('''fromSubtags fromAcceptLanguage language country script calendar direction flag
currency displayName number precision percentage money symbol unit scientific compact
ordinal spellout moment date time formatMoment duration timeZoneName dateRange compare
sort contains splitWords splitSentences splitGraphemes ellipsize upper lower message
pluralCategory join quote relativeDuration relativeDurationBetween numberRange moneyRange
addLikelySubtags removeLikelySubtags monthNames weekdayNames weekInfo supportedValues
transliterate romanize confusable suspicious parseNumber parseMoney parseDate parseMoment
bestMatch indexBuckets personName get'''.split())


def method_names(markdown, language):
    """Use native method casing in prose without changing examples or anchor IDs."""
    if language not in {'python', 'csharp'}:
        return markdown
    def name(match):
        value = match[0]
        if value not in METHODS:
            return value
        if language == 'csharp':
            return value[0].upper() + value[1:]
        return re.sub(r'([a-z])([A-Z])', r'\1_\2', value).lower()
    def inline(match):
        text = match[1]
        # A bare lower-case word can also be an option key or modifier.
        if text in METHODS and text.islower():
            return match[0]
        return '`' + re.sub(r'\b[A-Za-z]+(?=\(|$)', name, text) + '`'
    lines = []
    fence = False
    for line in markdown.splitlines(keepends=True):
        if re.match(r'^\s*```', line):
            fence = not fence
        if not fence and not line.lstrip().startswith('```'):
            changed = re.sub(r'`([^`\n]+)`', inline, line)
            if changed != line and line.startswith('#') and '{ #' not in line:
                from markdown.extensions.toc import slugify
                heading = re.sub(r'^#+\s+', '', line).strip().replace('`', '').replace('*', '')
                changed = changed.rstrip() + ' { #' + slugify(heading, '-') + ' }\n'
            line = changed
        lines.append(line)
    return ''.join(lines)


def render(source, language):
    text = ENV.from_string(source).render(language=language, language_name=LANGUAGES[language])
    return method_names(select_examples(text, LANGUAGES[language]), language)


def available(source, language):
    return language in AVAILABILITY.get(source, LANGUAGES)


def route(source, language):
    return source if source in SHARED else f'{language}/{source}'


def local_links(text, source, language, destination):
    def link(match):
        target = match[1]
        path, sep, fragment = target.partition('#')
        resolved = posixpath.normpath(posixpath.join(posixpath.dirname(source), path))
        if resolved not in SOURCES:
            return match[0]
        if not available(resolved, language):
            resolved = 'platform-notes.md'
            sep = fragment = ''
        relative = posixpath.relpath(route(resolved, language), posixpath.dirname(destination) or '.')
        return '](' + relative + (sep + fragment if sep else '') + ')'
    return re.sub(r'\]\(([^)\s]+\.md(?:#[^)\s]*)?)\)', link, text)


def on_files(files, config):
    global FILES
    FILES = files
    SOURCES.clear()
    originals = [f for f in files.documentation_pages() if f.inclusion.is_included()]
    SOURCES.update({f.src_uri: f.content_string for f in originals})
    for original in originals:
        source = original.src_uri
        if source in SHARED:
            continue
        for language in LANGUAGES:
            destination = route(source, language)
            if available(source, language):
                content = render(SOURCES[source], language)
            else:
                title = re.search(r'^# (.+)$', SOURCES[source], re.M)[1]
                notes = posixpath.relpath('platform-notes.md', posixpath.dirname(source) or '.')
                content = f'# {title}\n\nThis topic is not available for {LANGUAGES[language]}. See [Platform notes]({notes}) for supported features.\n'
            content = local_links(content, source, language, destination)
            files.append(File.generated(config, destination, content=content, inclusion=InclusionLevel.NOT_IN_NAV))
        # Preserve old URLs as working JavaScript pages. The script redirects them
        # to the reader's chosen language, retaining query parameters and anchors.
        original.content_string = local_links(render(SOURCES[source], 'javascript'), source, 'javascript', source)
    for language in LANGUAGES:
        destination = f'{language}/index.md'
        content = SOURCES['index.md']
        files.append(File.generated(config, destination, content=content, inclusion=InclusionLevel.NOT_IN_NAV))
    return files


def page_identity(page):
    parts = page.file.src_uri.split('/', 1)
    if parts[0] in LANGUAGES:
        return parts[0], parts[1]
    return 'javascript', page.file.src_uri


def on_page_markdown(markdown, page, config, files):
    language, source = page_identity(page)
    page.meta['doc_language'] = language
    page.meta['doc_source'] = source
    page.meta['doc_legacy'] = source not in SHARED and page.file.src_uri == source
    if page.meta['doc_legacy'] or page.file.src_uri == f'{language}/index.md' or not available(source, language):
        page.meta['search'] = {'exclude': True}
    elif source not in SHARED:
        page.meta['title'] = f'{page.title} · {LANGUAGES[language]}'
    return markdown


def on_page_context(context, page, config, nav):
    files = FILES
    language, source = page_identity(page)
    choices = []
    for key, label in LANGUAGES.items():
        target_source = source if available(source, key) and source != 'index.md' else 'getting-started.md'
        target = files.get_file_from_path(route(target_source, key))
        choice_url = get_relative_url(target.url, page.url)
        if source == 'parity.md':
            choice_url += f'?lang={key}'
        choices.append({'key': key, 'label': label, 'url': choice_url})
    context['doc_languages'] = choices
    context['doc_language'] = language
    context['doc_shared'] = source in SHARED
    context['doc_source'] = source

    pages = []
    def items(entries, parent=None):
        result = []
        for entry in entries:
            if entry.is_section:
                section = Section(entry.title, [])
                section.parent = parent
                section.children = items(entry.children, section)
                section.active = any(child.active for child in section.children)
                if section.children:
                    result.append(section)
            elif entry.is_page:
                original_source = entry.file.src_uri
                if source not in SHARED and not available(original_source, language):
                    continue
                target = files.get_file_from_path(route(original_source, language)).page
                item = copy(target)
                item.parent = parent
                item.title = entry.title
                item.active = original_source == source
                item.children = []
                pages.append(item)
                result.append(item)
            else:
                result.append(entry)
        return result
    context['nav'] = Navigation(items(nav.items), pages)
    context['nav'].homepage = next((p for p in pages if p.file.src_uri == 'index.md'), None)
    for i, item in enumerate(pages):
        if item.active:
            page.previous_page = pages[i - 1] if i else None
            page.next_page = pages[i + 1] if i + 1 < len(pages) else None
    return context


API_URLS = {
    'javascript': 'https://cosmo-intl.github.io/cosmo-js/',
    'php': 'https://salarmehr.github.io/cosmopolitan/',
    'python': 'https://cosmo-intl.github.io/cosmo-python/',
    'java': 'https://cosmo-intl.github.io/cosmo-java/',
    'csharp': 'https://cosmo-intl.github.io/cosmo-csharp/',
}


def api_links(html, language):
    """Open API links directly, including sidebar and in-content references."""
    from urllib.parse import urlsplit

    def replace(match):
        href = match[2]
        parsed = urlsplit(href)
        internal_api = not parsed.scheme and not parsed.netloc and parsed.path.rstrip('/').split('/')[-1] == 'api-reference'
        if not internal_api and href not in API_URLS.values():
            return match[0]
        tag = match[1] + API_URLS[language] + match[3]
        tag = re.sub(r'\s(?:target|rel)="[^"]*"', '', tag)
        return tag[:-1] + ' target="_blank" rel="noopener noreferrer" data-api-reference>'

    return re.sub(r'(<a\b[^>]*\bhref=")([^"]+)("[^>]*>)', replace, html)


def on_post_page(output, page, config):
    language, _ = page_identity(page)
    return api_links(output, language)
