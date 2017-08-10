/// <reference types="jest"/>

type DiffOptions = {
  expand?: boolean,
  colors?: boolean,
  contextLines?: number,
};

declare namespace jest {
  interface Matchers {
    toMatchDiffSnapshot(valueB: any, options?: DiffOptions): boolean
  }
}