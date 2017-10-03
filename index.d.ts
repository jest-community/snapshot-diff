/// <reference types="jest"/>

type DiffOptions = {
  expand?: boolean
  colors?: boolean
  contextLines?: number
}

declare namespace jest {
  interface Matchers<R> {
    /**
     * Compare the difference between the actual in the `expect()`
     * vs the object inside `valueB` with some extra options.
     */
    toMatchDiffSnapshot(valueB: any, options?: DiffOptions): R
  }
}

declare module "snapshot-diff" {
  interface SnapshotDiff {
    /**
     * Compare the changes from a, to b
     */
    (a: any, b: any, options?: DiffOptions): string
    /**
     * Allows you to pull out toMatchDiffSnapshot and
     * make it available via `expect.extend({ toMatchDiffSnapshot })`.
     */
    toMatchDiffSnapshot: (newObject: any) => void
  }
  const diff: SnapshotDiff
  export = diff
}
