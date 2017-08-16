// @flow

const snapshotDiff = require('../src/index');

expect.addSnapshotSerializer(snapshotDiff.getSnapshotDiffSerializer());

test('serialize text diff output', () => {
  expect(
    snapshotDiff(
      ['foo', 'bar', 'baz'].join('\n'),
      ['foo', 'baz', 'quoz'].join('\n')
    )
  ).toMatchSnapshot();
});

test('serialize array diff output', () => {
  expect(
    snapshotDiff(['foo', 'bar', 'baz'], ['foo', 'baz', 'quoz'])
  ).toMatchSnapshot();
});

test('serialize object diff output', () => {
  expect(snapshotDiff({ foo: 'bar' }, { foo: 'baz' })).toMatchSnapshot();
});
