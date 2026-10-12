/** Runtime helper for graphql-codegen TypedDocumentString document mode. */
export class TypedDocumentString<TResult, TVariables> {
  private readonly source: string;

  constructor(source: string) {
    this.source = source;
  }

  toString(): string {
    return this.source;
  }

  valueOf(): string {
    return this.source;
  }
}
