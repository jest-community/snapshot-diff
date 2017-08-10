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
};

const defaultOptions = {
  expand: false,
  colors: false,
  contextLines: -1, // Forces to use default from Jest
};

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
    return stripAnsi(difference);
  }

  return difference;
};

const isReactComponent = (value: any) =>
  value && value.$$typeof === reactElement;

function diffStrings(valueA: any, valueB: any, options: Options) {
  return diff(valueA, valueB, {
    expand: options.expand,
    contextLines: options.contextLines,
    aAnnotation: 'First value',
    bAnnotation: 'Second value',
  });
}

function diffReactComponents(valueA: any, valueB: any, options: Options) {
  const renderer = require('react-test-renderer');
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

function toMatchDiffSnapshot(valueA: any, valueB: any, options: Options) {
  const difference = snapshotDiff(valueA, valueB, options);

  return snapshot.toMatchSnapshot.call(this, difference);
}

module.exports = snapshotDiff;
module.exports.snapshotDiff = snapshotDiff;
module.exports.toMatchDiffSnapshot = toMatchDiffSnapshot;
