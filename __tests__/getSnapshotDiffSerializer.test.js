const { snapshotDiff, getSnapshotDiffSerializer } = require('../src/index');
// $FlowFixMe – wrong type declaration in flow-typed/jest@20.x.x
expect.addSnapshotSerializer(getSnapshotDiffSerializer());

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
