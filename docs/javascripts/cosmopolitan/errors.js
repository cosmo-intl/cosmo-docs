/**
 * Base error for everything Cosmopolitan throws. Catch this to handle any
 * library error; catch a subclass to distinguish the cause.
 */
export class CosmopolitanError extends Error {
    constructor(message, options) {
        super(message, options);
        this.name = "CosmopolitanError";
    }
}
/**
 * A caller passed an invalid argument — a typo'd option key, an unknown currency
 * code, an unsupported width/unit, a bad enum value, … This signals a bug to fix
 * in the calling code, not a condition to catch and recover from.
 */
export class InvalidArgumentError extends CosmopolitanError {
    constructor(message, options) {
        super(message, options);
        this.name = "InvalidArgumentError";
    }
}
/**
 * The runtime lacks an `Intl` capability the operation needs (e.g.
 * `Intl.DurationFormat` on Node < 22). This is environmental — reasonable to
 * catch and degrade gracefully.
 */
export class UnsupportedError extends CosmopolitanError {
    constructor(message, options) {
        super(message, options);
        this.name = "UnsupportedError";
    }
}
//# sourceMappingURL=errors.js.map