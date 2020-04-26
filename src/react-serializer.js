// @flow

'use strict';

const prettyFormat = require('pretty-format');
const snapshot = require('jest-snapshot');

const serializers = snapshot.getSerializers();

const { ReactElement } = prettyFormat.plugins;
const reactElement = Symbol.for('react.element');

function getReactComponentSerializer() {
  let renderer;
  try {
    renderer = require('react-test-renderer'); // eslint-disable-line import/no-extraneous-dependencies
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
  return value =>
    prettyFormat(renderer.create(value), { plugins: serializers });
}

const reactSerializer = {
  test: (value: any) => value && value.$$typeof === reactElement,
  print: (value: any, _serializer?: any => any) => {
    const reactComponentSerializer = getReactComponentSerializer();
    return reactComponentSerializer(value);
  },
  diffOptions: (valueA: any, valueB: any) => {
    const prettyFormatOptions = { plugins: [ReactElement], min: true };
    return {
      aAnnotation: prettyFormat(valueA, prettyFormatOptions),
      bAnnotation: prettyFormat(valueB, prettyFormatOptions),
    };
  },
};

module.exports = reactSerializer;
