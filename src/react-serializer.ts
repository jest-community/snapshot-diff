import { format as prettyFormat, OptionsReceived } from 'pretty-format';
import { getSerializers } from 'jest-snapshot';
import type { DiffSerializer } from './types';

const serializers = getSerializers();

const reactElement = Symbol.for('react.element');

function getReactComponentSerializer() {
  let renderer: typeof import('react-test-renderer');
  try {
    renderer = require('react-test-renderer'); // eslint-disable-line import/no-extraneous-dependencies
  } catch (error: any) {
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
  return (value: any) =>
    prettyFormat(renderer.create(value), { plugins: serializers });
}

export const reactSerializer: DiffSerializer = {
  test: (value) => value && value.$$typeof === reactElement,
  print: (value: any) => {
    const reactComponentSerializer = getReactComponentSerializer();
    return reactComponentSerializer(value);
  },
  diffOptions: (valueA, valueB) => {
    const prettyFormatOptions: OptionsReceived = {
      plugins: serializers,
      min: true,
    };
    return {
      aAnnotation: prettyFormat(valueA, prettyFormatOptions),
      bAnnotation: prettyFormat(valueB, prettyFormatOptions),
    };
  },
};
