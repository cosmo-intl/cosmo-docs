/**
 * A small, dependency-free implementation of the most commonly used subset of
 * ICU MessageFormat, backed by the standard `Intl` APIs.
 *
 * Supported:
 *  - Simple arguments:            `{name}` / `{0}`
 *  - Number arguments:            `{0, number}`, `{0, number, integer}`,
 *                                 `{0, number, percent}`
 *  - Plural / select-ordinal:     `{0, plural, offset:1 one {# item} other {# items}}`
 *                                 (`#` is replaced by the value, minus any offset)
 *  - Select:                      `{g, select, female {…} male {…} other {…}}`
 *  - Nesting of the above.
 *
 * Not supported (would require ICU internals not exposed to JavaScript): date /
 * time / spellout / duration argument types, and number skeletons. This is a
 * deliberate trade-off of the zero-dependency build.
 */
import { CosmopolitanError } from "./errors.js";
function getArg(args, name) {
    if (Array.isArray(args))
        return args[Number(name)];
    return args[name];
}
/** Parses a message pattern starting at `i`, stopping at an unescaped `}` (when nested). */
function parse(src, i, nested) {
    const nodes = [];
    let text = "";
    const flushText = () => {
        if (text)
            nodes.push({ kind: "text", value: text });
        text = "";
    };
    while (i < src.length) {
        const ch = src[i];
        if (ch === "'") {
            // ICU apostrophe escaping: '' is a literal ', 'xyz' quotes special chars.
            if (src[i + 1] === "'") {
                text += "'";
                i += 2;
                continue;
            }
            const close = src.indexOf("'", i + 1);
            if (close === -1) {
                text += src.slice(i + 1);
                i = src.length;
            }
            else {
                text += src.slice(i + 1, close);
                i = close + 1;
            }
            continue;
        }
        if (ch === "}" && nested) {
            flushText();
            return { nodes, end: i };
        }
        if (ch === "{") {
            flushText();
            const parsed = parseArgument(src, i + 1);
            nodes.push(parsed.node);
            i = parsed.end + 1; // skip closing }
            continue;
        }
        text += ch;
        i++;
    }
    flushText();
    return { nodes, end: i };
}
function parseArgument(src, i) {
    // name
    let name = "";
    while (i < src.length && src[i] !== "," && src[i] !== "}")
        name += src[i++];
    name = name.trim();
    if (src[i] === "}")
        return { node: { kind: "arg", name }, end: i };
    i++; // skip ','
    // type
    let type = "";
    while (i < src.length && src[i] !== "," && src[i] !== "}")
        type += src[i++];
    type = type.trim();
    if (type === "number") {
        let style = "";
        if (src[i] === ",") {
            i++;
            while (i < src.length && src[i] !== "}")
                style += src[i++];
        }
        return { node: { kind: "arg", name, format: { type: "number", style: style.trim() } }, end: i };
    }
    if (type === "plural" || type === "selectordinal" || type === "select") {
        i++; // skip ','
        return parseChoices(src, i, name, type);
    }
    throw new CosmopolitanError(`Unsupported ICU message argument type "${type}".`);
}
function parseChoices(src, i, name, type) {
    const options = new Map();
    let offset = 0;
    while (i < src.length && src[i] !== "}") {
        // skip whitespace
        while (i < src.length && /\s/.test(src[i]))
            i++;
        if (src[i] === "}")
            break;
        // read selector
        let selector = "";
        while (i < src.length && !/\s/.test(src[i]) && src[i] !== "{")
            selector += src[i++];
        if ((type === "plural" || type === "selectordinal") && selector.startsWith("offset:")) {
            offset = Number(selector.slice("offset:".length));
            continue;
        }
        while (i < src.length && /\s/.test(src[i]))
            i++;
        if (src[i] !== "{") {
            throw new CosmopolitanError(`Malformed ICU message: expected "{" after selector "${selector}".`);
        }
        const sub = parse(src, i + 1, true);
        options.set(selector.replace(/^=/, ""), sub.nodes);
        i = sub.end + 1; // skip closing }
    }
    const format = type === "select" ? { type, options } : { type, offset, options };
    return { node: { kind: "arg", name, format }, end: i };
}
function formatNumberArg(locale, style, value) {
    let options;
    switch (style) {
        case "":
            options = {};
            break;
        case "integer":
            options = { maximumFractionDigits: 0, useGrouping: true };
            break;
        case "percent":
            options = { style: "percent" };
            break;
        case "currency":
            options = { style: "currency", currency: "USD" };
            break;
        default:
            options = {};
    }
    return new Intl.NumberFormat(locale, options).format(value);
}
function render(locale, nodes, args, hashValue) {
    let out = "";
    for (const node of nodes) {
        if (node.kind === "text") {
            out += hashValue === undefined ? node.value : node.value.replace(/#/g, formatHash(locale, hashValue));
            continue;
        }
        out += renderArg(locale, node, args);
    }
    return out;
}
function formatHash(locale, value) {
    return new Intl.NumberFormat(locale).format(value);
}
function renderArg(locale, node, args) {
    const value = getArg(args, node.name);
    const format = node.format;
    if (!format)
        return value == null ? "" : String(value);
    if (format.type === "number") {
        return formatNumberArg(locale, format.style, Number(value));
    }
    if (format.type === "select") {
        const branch = format.options.get(String(value)) ?? format.options.get("other");
        return branch ? render(locale, branch, args) : "";
    }
    // plural / selectordinal
    const num = Number(value);
    const adjusted = num - format.offset;
    const exact = format.options.get(String(num)) ?? format.options.get(`=${num}`);
    if (exact)
        return render(locale, exact, args, adjusted);
    const category = new Intl.PluralRules(locale, {
        type: format.type === "selectordinal" ? "ordinal" : "cardinal",
    }).select(adjusted);
    const branch = format.options.get(category) ?? format.options.get("other");
    return branch ? render(locale, branch, args, adjusted) : "";
}
/**
 * Formats an ICU message pattern with the given arguments for a locale.
 */
export function formatMessage(locale, pattern, args = {}) {
    const { nodes } = parse(pattern, 0, false);
    return render(locale, nodes, args);
}
//# sourceMappingURL=message.js.map