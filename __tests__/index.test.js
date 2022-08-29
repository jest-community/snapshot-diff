test('public api', () => {
  const index = require('../build/index');

  expect(index.snapshotDiff).toBeInstanceOf(Function);
  expect(index.toMatchDiffSnapshot).toBeInstanceOf(Function);
  expect(index.getSnapshotDiffSerializer).toBeInstanceOf(Function);

  const {
    toMatchDiffSnapshot,
    getSnapshotDiffSerializer,
  } = require('../build/index');

  expect(toMatchDiffSnapshot).toBe(index.toMatchDiffSnapshot);
  expect(getSnapshotDiffSerializer).toBe(index.getSnapshotDiffSerializer);
});
