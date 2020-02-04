// @flow

'use strict';

const diff = require('jest-diff').default;
const snapshot = require('jest-snapshot');
const reactSerializer = require('./react-serializer');

type Options = {|
  expand?: boolean,
  colors?: boolean,
  contextLines?: number,
  stablePatchmarks?: boolean,
  aAnnotation?: string,
  bAnnotation?: string,
|};

const defaultOptions = {
  expand: false,
  colors: false,
  contextLines: -1, // Forces to use default from Jest
  stablePatchmarks: false,
  aAnnotation: 'First value',
  bAnnotation: 'Second value',
};

const SNAPSHOT_TITLE = 'Snapshot Diff:\n';

const identity = value => value;
const defaultSerializers = [reactSerializer];
let serializers = defaultSerializers;

const snapshotDiff = (valueA: any, valueB: any, options?: Options): string => {
  let difference;
  const mergedOptions = { ...defaultOptions, ...options };

  const matchingSerializer = serializers.find(
    ({ test }) => test(valueA) && test(valueB)
  );

  if (matchingSerializer) {
    const { print, diffOptions } = matchingSerializer;
    const serializerOptions = diffOptions
      ? diffOptions(valueA, valueB) || undefined
      : undefined;
    difference = diffStrings(print(valueA, identity), print(valueB, identity), {
      ...mergedOptions,
      ...serializerOptions,
    });
  } else {
    difference = diffStrings(valueA, valueB, mergedOptions);
  }

  if (!mergedOptions.colors) {
    const stripAnsi = require('strip-ansi');

    difference = stripAnsi(difference);
  }

  if (mergedOptions.stablePatchmarks && !mergedOptions.expand) {
    difference = difference.replace(
      /^@@ -[0-9]+,[0-9]+ \+[0-9]+,[0-9]+ @@$/gm,
      '@@ --- --- @@'
    );
  }

  return SNAPSHOT_TITLE + difference;
};

function diffStrings(valueA: any, valueB: any, options: Options) {
  return diff(valueA, valueB, {
    expand: options.expand,
    contextLines: options.contextLines,
    aAnnotation: options.aAnnotation,
    bAnnotation: options.bAnnotation,
  });
}

function toMatchDiffSnapshot(
  valueA: any,
  valueB: any,
  options?: Options,
  testName?: string
) {
  const difference = snapshotDiff(valueA, valueB, options);

  return snapshot.toMatchSnapshot.call(this, difference, testName || '');
}

function getSnapshotDiffSerializer() {
  return {
    test(value: any) {
      return typeof value === 'string' && value.indexOf(SNAPSHOT_TITLE) === 0;
    },
    print(value: any) {
      return value;
    },
  };
}

function setSerializers(customSerializers) {
  serializers = customSerializers;
}

module.exports = snapshotDiff;
module.exports.snapshotDiff = snapshotDiff;
module.exports.toMatchDiffSnapshot = toMatchDiffSnapshot;
module.exports.getSnapshotDiffSerializer = getSnapshotDiffSerializer;
module.exports.setSerializers = setSerializers;
module.exports.defaultSerializers = defaultSerializers;
