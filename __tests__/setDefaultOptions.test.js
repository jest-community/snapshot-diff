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

test('uses default options', () => {
  expect(snapshotDiff(a, b)).toMatchSnapshot();
});

test('uses the updated default options', () => {
  snapshotDiff.setDefaultOptions({
    colors: true,
    contextLines: 0,
    aAnnotation: 'First string',
    bAnnotation: 'Second string',
  });

  expect(snapshotDiff(a, b)).toMatchSnapshot();
});
