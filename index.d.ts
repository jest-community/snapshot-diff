/// <reference types="jest"/>

import type { Options } from './build';

declare namespace jest {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<R, T> {
    /**
     * Compare the difference between the actual in the `expect()`
     * vs the object inside `valueB` with some extra options.
     */
    toMatchDiffSnapshot(valueB: any, options?: Options, testName?: string): R;
  }
}
