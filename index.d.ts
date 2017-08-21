/// <reference types="jest"/>

type DiffOptions = {
  expand?: boolean,
  colors?: boolean,
  contextLines?: number,
};

declare namespace jest {
  interface Matchers<R> {
    toMatchDiffSnapshot(valueB: any, options?: DiffOptions): R
  }
}

declare module 'snapshot-diff' {
  function diff(a: any, b: any, options?: DiffOptions): string;
  namespace diff {}
  export = diff;
}
