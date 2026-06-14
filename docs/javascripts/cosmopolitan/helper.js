import { Cosmo } from "./cosmo.js";
/**
 * Convenience factory for constructing a {@link Cosmo} instance.
 * @example cosmo("en").percentage(0.2) // "20%"
 */
export function cosmo(locale, modifiers = {}) {
    return new Cosmo(locale, modifiers);
}
//# sourceMappingURL=helper.js.map