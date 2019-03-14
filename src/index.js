// @flow

'use strict';

const diff = require('jest-diff');
const snapshot = require('jest-snapshot');
const prettyFormat = require('pretty-format');

const { ReactElement } = prettyFormat.plugins;
const reactElement = Symbol.for('react.element');

type Options = {
  expand?: boolean,
  colors?: boolean,
  contextLines?: number,
  aAnnotation?: string,
  bAnnotation?: string,
};

const defaultOptions = {
  expand: false,
  colors: false,
  contextLines: -1, // Forces to use default from Jest
  omitPatchMarks: false,
  aAnnotation: 'First value',
  bAnnotation: 'Second value',
};

const SNAPSHOT_TITLE = 'Snapshot Diff:\n';

const snapshotDiff = (valueA: any, valueB: any, options?: Options): string => {
  let difference;
  const mergedOptions = Object.assign({}, defaultOptions, options);

  if (isReactComponent(valueA) && isReactComponent(valueB)) {
    difference = diffReactComponents(valueA, valueB, mergedOptions);
  } else {
    difference = diffStrings(valueA, valueB, mergedOptions);
  }

  if (!mergedOptions.colors) {
    const stripAnsi = require('strip-ansi');

    difference = stripAnsi(difference);
  }

  if (mergedOptions.omitPatchMarks) {
    difference = difference.replace(/^@.*/gm, '-------------')
  }

  return SNAPSHOT_TITLE + difference;
};

const isReactComponent = (value: any) =>
  value && value.$$typeof === reactElement;

function diffStrings(valueA: any, valueB: any, options: Options) {
  return diff(valueA, valueB, {
    expand: options.expand,
    contextLines: options.contextLines,
    aAnnotation: options.aAnnotation,
    bAnnotation: options.bAnnotation,
  });
}

function requireReactTestRenderer() {
  try {
    return require('react-test-renderer'); // eslint-disable-line import/no-extraneous-dependencies
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        `Failed to load optional module "react-test-renderer". ` +
          `If you need to compare React elements, please add "react-test-renderer" to your ` +
          `project's dependencies.\n` +
          `${error.message}`
      );
    }
    throw error;
  }
}

function diffReactComponents(valueA: any, valueB: any, options: Options) {
  const renderer = requireReactTestRenderer();
  const reactValueA = renderer.create(valueA).toJSON();
  const reactValueB = renderer.create(valueB).toJSON();
  const prettyFormatOptions = { plugins: [ReactElement], min: true };

  return diff(reactValueA, reactValueB, {
    expand: options.expand,
    contextLines: options.contextLines,
    aAnnotation: prettyFormat(valueA, prettyFormatOptions),
    bAnnotation: prettyFormat(valueB, prettyFormatOptions),
  });
}

function toMatchDiffSnapshot(
  valueA: any,
  valueB: any,
  options?: Options,
  testName?: string
) {
  const difference = snapshotDiff(valueA, valueB, options);

  return snapshot.toMatchSnapshot.call(this, difference, testName);
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

module.exports = snapshotDiff;
module.exports.snapshotDiff = snapshotDiff;
module.exports.toMatchDiffSnapshot = toMatchDiffSnapshot;
module.exports.getSnapshotDiffSerializer = getSnapshotDiffSerializer;
