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
  expect(a).toMatchDiffSnapshot(b);
});

[{ expand: true }, { contextLines: 0 }].forEach((options) => {
  test(`proxies "${Object.keys(options).join(', ')}" option(s)`, () => {
    expect(a).toMatchDiffSnapshot(b, options);
  });
});

test('works with custom name', () => {
  expect(a).toMatchDiffSnapshot(b, {}, 'slim');
});
