import { diff } from 'jest-diff';
import type { MatcherState } from 'expect';
import { toMatchSnapshot } from 'jest-snapshot';
import { reactSerializer } from './react-serializer';
import type { DiffOptions, DiffSerializer } from './types';

export type { DiffSerializer } from './types';

export interface Options extends DiffOptions {
  colors?: boolean;
}

const defaultOptions: Options = {
  expand: false,
  colors: false,
  contextLines: -1, // Forces to use default from Jest
  stablePatchmarks: false,
  aAnnotation: 'First value',
  bAnnotation: 'Second value',
};

const SNAPSHOT_TITLE = 'Snapshot Diff:\n';

const identity = <T>(value: T): T => value;
export const defaultSerializers = [reactSerializer];
let serializers = defaultSerializers;

export const snapshotDiff = (
  valueA: unknown,
  valueB: unknown,
  options?: Options
): string => {
  let difference: string | null;
  const mergedOptions = { ...defaultOptions, ...options };

  const matchingSerializer = serializers.find(
    ({ test }) => test(valueA) && test(valueB)
  );

  if (matchingSerializer) {
    const { print, diffOptions } = matchingSerializer;
    const serializerOptions = diffOptions?.(valueA, valueB) || undefined;
    // @ts-expect-error
    difference = diffStrings(print(valueA, identity), print(valueB, identity), {
      ...mergedOptions,
      ...serializerOptions,
    });
  } else {
    difference = diffStrings(valueA, valueB, mergedOptions);
  }

  if (difference && mergedOptions.stablePatchmarks && !mergedOptions.expand) {
    difference = difference.replace(
      /^@@ -[0-9]+,[0-9]+ \+[0-9]+,[0-9]+ @@$/gm,
      '@@ --- --- @@'
    );
  }

  return SNAPSHOT_TITLE + difference;
};

// https://github.com/facebook/jest/tree/d81464622dc8857ba995ed04e121af2b3e8e33bc/packages/jest-diff#example-of-options-for-no-colors
const noDiffColors = {
  aColor: identity,
  bColor: identity,
  changeColor: identity,
  commonColor: identity,
  patchColor: identity,
};

function diffStrings(valueA: unknown, valueB: unknown, options: Options) {
  return diff(valueA, valueB, {
    expand: options.expand,
    contextLines: options.contextLines,
    aAnnotation: options.aAnnotation,
    bAnnotation: options.bAnnotation,
    ...(!options.colors ? noDiffColors : {}),
  });
}

export function toMatchDiffSnapshot(
  this: MatcherState,
  valueA: unknown,
  valueB: unknown,
  options?: Options,
  ...rest: unknown[]
) {
  const difference = snapshotDiff(valueA, valueB, options);

  // @ts-expect-error
  return toMatchSnapshot.call(this, difference, ...rest);
}

export function getSnapshotDiffSerializer() {
  return {
    test(value: any) {
      return typeof value === 'string' && value.indexOf(SNAPSHOT_TITLE) === 0;
    },
    print(value: any) {
      return value;
    },
  };
}

export function setSerializers(customSerializers: Array<DiffSerializer>) {
  serializers = customSerializers;
}
