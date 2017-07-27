// @flow
'use strict';

const diff = require('jest-diff');
const prettyFormat = require('pretty-format');
const {ReactElement} = prettyFormat.plugins;
const reactElement = Symbol.for('react.element');

type Options = {
  expand?: boolean,
  colors?: boolean
};

const defaultOptions = {
  expand: false,
  colors: false
};

const snapshotDiff = (
  valueA: any,
  valueB: any,
  options?: Options = defaultOptions
) => {
  let difference;

  if (isReactComponent(valueA) && isReactComponent(valueB)) {
    difference = diffReactComponents(valueA, valueB, options);
  } else {
    difference = diffStrings(valueA, valueB, options);
  }

  if (!options.colors) {
    const stripAnsi = require('strip-ansi');
    return stripAnsi(difference);
  }

  return difference;
};

const isReactComponent = valueA => valueA && valueA.$$typeof === reactElement;

function diffStrings(valueA, valueB, options) {
  return diff(valueA, valueB, {
    expand: options.expand,
    aAnnotation: 'First value',
    aAnnotation: 'Second value'
  });
}

function diffReactComponents(valueA, valueB, options) {
  const renderer = require('react-test-renderer');
  const reactValueA = renderer.create(valueA).toJSON();
  const reactValueB = renderer.create(valueB).toJSON();
  const aAnnotation = valueA.type.displayName || valueA.type.name || 'Unknown';
  const bAnnotation = valueB.type.displayName || valueB.type.name || 'Unknown';
  const prettyFormatOptions = {plugins: [ReactElement], min: true};

  return diff(reactValueA, reactValueB, {
    expand: options.expand,
    aAnnotation: prettyFormat(valueA, prettyFormatOptions),
    bAnnotation: prettyFormat(valueB, prettyFormatOptions)
  });
}

module.exports = snapshotDiff;
