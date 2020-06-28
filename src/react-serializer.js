// @flow

'use strict';

const prettyFormat = require('pretty-format');
const snapshot = require('jest-snapshot');

const defaultSerializers = snapshot.getSerializers();
let serializers = defaultSerializers;

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
  return (value) =>
    prettyFormat(renderer.create(value).toJSON(), { plugins: serializers });
}

function setSerializers(customSerializers) {
  serializers = customSerializers;
}

const reactSerializer = {
  test: (value: any) => value && value.$$typeof === reactElement,
  print: (value: any, _serializer?: (any) => any) => {
    const reactComponentSerializer = getReactComponentSerializer();
    return reactComponentSerializer(value);
  },
  diffOptions: (valueA: any, valueB: any) => {
    const prettyFormatOptions = { plugins: serializers, min: true };
    return {
      aAnnotation: prettyFormat(valueA, prettyFormatOptions),
      bAnnotation: prettyFormat(valueB, prettyFormatOptions),
    };
  },
  setSerializers,
  defaultSerializers,
};

module.exports = reactSerializer;
