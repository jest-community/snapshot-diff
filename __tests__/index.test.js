test('public api', () => {
  const index = require('../src/index');

  expect(index).toBeInstanceOf(Function);
  expect(index.snapshotDiff).toBe(index);
  expect(index.toMatchDiffSnapshot).toBeInstanceOf(Function);
  expect(index.setDefaultOptions).toBeInstanceOf(Function);
  expect(index.getSnapshotDiffSerializer).toBeInstanceOf(Function);

  const {
    snapshotDiff,
    setDefaultOptions,
    toMatchDiffSnapshot,
    getSnapshotDiffSerializer,
  } = require('../src/index');

  expect(snapshotDiff).toBe(index);
  expect(setDefaultOptions).toBe(index.setDefaultOptions);
  expect(toMatchDiffSnapshot).toBe(index.toMatchDiffSnapshot);
  expect(getSnapshotDiffSerializer).toBe(index.getSnapshotDiffSerializer);
});
