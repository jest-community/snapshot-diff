test('public api', () => {
  const index = require('../src/index');

  expect(index).toBeInstanceOf(Function);
  expect(index.snapshotDiff).toBe(index);
  expect(index.toMatchDiffSnapshot).toBeInstanceOf(Function);

  const { snapshotDiff, toMatchDiffSnapshot } = require('../src/index');

  expect(snapshotDiff).toBe(index);
  expect(toMatchDiffSnapshot).toBe(index.toMatchDiffSnapshot);
});
