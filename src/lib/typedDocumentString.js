/** Runtime helper for graphql-codegen TypedDocumentString document mode. */
export class TypedDocumentString {
    constructor(source) {
        Object.defineProperty(this, "source", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.source = source;
    }
    toString() {
        return this.source;
    }
    valueOf() {
        return this.source;
    }
}
