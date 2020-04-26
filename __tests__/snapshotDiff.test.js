// @flow

/* eslint-disable react/no-multi-comp */

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
const noIndentA = `
@some
@some
@some
@some
@some
@foo
@some
@some
@some
@some
@some
@some
@some
@some
@some
@some
@not
@very
@long
@script
`;
const noIndentB = `
@some
@some
@some
@some
@some
@bar
@some
@some
@some
@some
@some
@some
@some
@some
@some
@some
@not
@so
@very
@long
@script
`;

type Props = {
  test: string,
};

class Component extends React.Component<Props> {
  render() {
    return (
      <div>
        <span />
        <span />
        <span />
        <span
          onBlur={() => {}}
          onClick={jest.fn()}
          onFocus={jest.fn().mockName('test-mock-name')}
        >
          {this.props.test}
        </span>
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

class FragmentComponent extends React.Component<Props> {
  render() {
    return (
      <>
        <div>First</div>
        {this.props.withSecond ? <div>Second</div> : null}
      </>
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

test('shows diff when comparing React fragments of varying length', () => {
  expect(
    snapshotDiff(<FragmentComponent />, <FragmentComponent withSecond />)
  ).toMatchSnapshot();
});

test('can use stablePatchmarks on diff', () => {
  expect(
    snapshotDiff(noIndentA, noIndentB, { stablePatchmarks: true })
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
    expect(() =>
      snapshotDiff(testComponentA, testComponentB)
    ).toThrowErrorMatchingSnapshot();
  });
});
