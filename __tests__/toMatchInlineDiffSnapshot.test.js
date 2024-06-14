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
  expect.extend({
    toMatchInlineDiffSnapshot: snapshotDiff.toMatchInlineDiffSnapshot,
  });
});

test('works with default options', () => {
  expect(a).toMatchInlineDiffSnapshot(
    b,
    `
    "Snapshot Diff:
    - First value
    + Second value

    @@ -5,9 +5,10 @@
          some
          some
          some
          some
          not
    +     so
          very
          long
          script
    "
  `
  );
});

test('works with non-default options', () => {
  expect(a).toMatchInlineDiffSnapshot(
    b,
    { stablePatchmarks: true },
    `
    "Snapshot Diff:
    - First value
    + Second value

    @@ --- --- @@
          some
          some
          some
          some
          not
    +     so
          very
          long
          script
    "
  `
  );
});
