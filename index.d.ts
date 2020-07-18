/// <reference types="jest"/>

type DiffOptions = {
  expand?: boolean;
  colors?: boolean;
  contextLines?: number;
  stablePatchmarks?: boolean;
  aAnnotation?: string;
  bAnnotation?: string;
};

declare namespace jest {
  interface Matchers<R, T> {
    /**
     * Compare the difference between the actual in the `expect()`
     * vs the object inside `valueB` with some extra options.
     */
    toMatchDiffSnapshot(
      valueB: any,
      options?: DiffOptions,
      testName?: string
    ): R;
  }
}

interface Serializer {
  test: (value: any) => boolean;
  print: (value: any, _serializer?: any) => any;
  diffOptions?: (valueA: any, valueB: any) => DiffOptions;
  setSerializers?: (serializers: Array<Serializer>) => void;
  defaultSerializers?: Array<Serializer>;
}

declare module 'snapshot-diff' {
  interface SnapshotDiff {
    /**
     * Compare the changes from a, to b
     */
    (a: any, b: any, options?: DiffOptions): string;
    /**
     * Allows you to pull out toMatchDiffSnapshot and
     * make it available via `expect.extend({ toMatchDiffSnapshot })`.
     */
    toMatchDiffSnapshot: jest.CustomMatcher;
    /**
     * By default Jest adds extra quotes around strings so it makes diff
     * snapshots of objects too noisy. To fix this – snapshot-diff comes
     * with custom serializer.
     */
    getSnapshotDiffSerializer: () => jest.SnapshotSerializerPlugin;
    /**
     * Add new serializers for unsupported data types, or to set a different
     * serializer for React components. If you want to keep the default React
     * serializer in place, don't forget to add the default serializers to your
     * list of serializers.
     */
    setSerializers: (serializers: Array<Serializer>) => void;
    defaultSerializers: Array<Serializer>;
    reactSerializer: Serializer;
  }
  const diff: SnapshotDiff;
  export = diff;
}
