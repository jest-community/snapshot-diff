// @flow

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

beforeAll(() => {
  expect.extend({ toMatchDiffSnapshot: snapshotDiff.toMatchDiffSnapshot });
});

test('works with default options', () => {
  // $FlowFixMe
  expect(a).toMatchDiffSnapshot(b);
});

[{ expand: true }, { colors: true }, { contextLines: 0 }].forEach(
  (options: any) => {
    test(`proxies "${Object.keys(options).join(', ')}" option(s)`, () => {
      // $FlowFixMe
      expect(a).toMatchDiffSnapshot(b, options);
    });
  }
);

test('works with custom name', () => {
  // $FlowFixMe
  expect(a).toMatchDiffSnapshot(b, {}, 'slim');
});
