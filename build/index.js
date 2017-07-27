'use strict';

var diff = require('jest-diff');
var prettyFormat = require('pretty-format');
var ReactElement = prettyFormat.plugins.ReactElement;

var reactElement = Symbol.for('react.element');

var defaultOptions = {
  expand: false,
  colors: false
};

var snapshotDiff = function snapshotDiff(valueA, valueB) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultOptions;

  var difference = void 0;

  if (isReactComponent(valueA) && isReactComponent(valueB)) {
    difference = diffReactComponents(valueA, valueB, options);
  } else {
    difference = diffStrings(valueA, valueB, options);
  }

  if (!options.colors) {
    var stripAnsi = require('strip-ansi');
    return stripAnsi(difference);
  }

  return difference;
};

var isReactComponent = function isReactComponent(valueA) {
  return valueA && valueA.$$typeof === reactElement;
};

function diffStrings(valueA, valueB, options) {
  return diff(valueA, valueB, {
    expand: options.expand,
    aAnnotation: 'First value',
    aAnnotation: 'Second value'
  });
}

function diffReactComponents(valueA, valueB, options) {
  var renderer = require('react-test-renderer');
  var reactValueA = renderer.create(valueA).toJSON();
  var reactValueB = renderer.create(valueB).toJSON();
  var aAnnotation = valueA.type.displayName || valueA.type.name || 'Unknown';
  var bAnnotation = valueB.type.displayName || valueB.type.name || 'Unknown';
  var prettyFormatOptions = { plugins: [ReactElement], min: true };

  return diff(reactValueA, reactValueB, {
    expand: options.expand,
    aAnnotation: prettyFormat(valueA, prettyFormatOptions),
    bAnnotation: prettyFormat(valueB, prettyFormatOptions)
  });
}

module.exports = snapshotDiff;