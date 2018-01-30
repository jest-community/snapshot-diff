// @flow

const React = require('react');
const snapshotDiff = require('../src/index');

const a = `
    some
    some
    some
    some
    some
    some
    some
    not
    very
    long
    script
`;
const b = `
    some
    some
    some
    some
    some
    some
    some
    not
    so
    very
    long
    script
`;

class Component extends React.Component {
  render() {
    return (
      <div>
        <span />
        <span />
        <span />
        <span>{this.props.test}</span>
        <span>{this.props.test}</span>
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span>{this.props.test}</span>
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    );
  }
}

test('collapses diffs and strips ansi by default', () => {
  expect(snapshotDiff(a, b)).toMatchSnapshot();
});

test('can expand diff', () => {
  expect(snapshotDiff(a, b, { expand: true })).toMatchSnapshot();
});

test('can colorize diff', () => {
  expect(snapshotDiff(a, b, { colors: true })).toMatchSnapshot();
});

test('can use contextLines on diff', () => {
  expect(snapshotDiff(a, b, { contextLines: 0 })).toMatchSnapshot();
});

test('diffs short strings', () => {
  const x = `
  abcx
  `;
  const y = `
  abcy
  `;
  expect(snapshotDiff(x, y)).toMatchSnapshot();
});

test('detects React components', () => {
  expect(
    snapshotDiff(<Component test="say" />, <Component test="my name" />)
  ).toMatchSnapshot();
});

test('can use contextLines with React components', () => {
  expect(
    snapshotDiff(<Component test="say" />, <Component test="my name" />, {
      contextLines: 0,
    })
  ).toMatchSnapshot();
});

describe('failed optional deps', () => {
  beforeEach(() => {
    jest.mock('react-test-renderer', () => {
      // $FlowFixMe -- this is intended.
      require('non-existent-module-for-testing'); // eslint-disable-line
    });
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('throws with sensible message on missing react-test-renderer', () => {
    const testComponentA = <Component test="a" />;
    const testComponentB = <Component test="b" />;
    try {
      snapshotDiff(testComponentA, testComponentB);
    } catch (error) {
      expect(error.message).toMatchSnapshot();
    }
  });
});
