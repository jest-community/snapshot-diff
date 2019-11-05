# snapshot-diff

[![Greenkeeper badge](https://badges.greenkeeper.io/jest-community/snapshot-diff.svg)](https://greenkeeper.io/)
[![npm version](https://badge.fury.io/js/snapshot-diff.svg)](https://badge.fury.io/js/snapshot-diff)

Diffing snapshot utility for Jest. Takes two values, and return their difference as a string, ready to be snapshotted with `toMatchSnapshot()`.
Especially helpful when testing the difference between different React component states.

## Installation

```bash
yarn add --dev snapshot-diff
```

## Usage

#### With default jest matcher

```js
const snapshotDiff = require('snapshot-diff');

test('snapshot difference between 2 strings', () => {
  expect(snapshotDiff(a, b)).toMatchSnapshot();
});

const React = require('react');
const Component = require('./Component');

test('snapshot difference between 2 React components state', () => {
  expect(
    snapshotDiff(<Component test="say" />, <Component test="my name" />)
  ).toMatchSnapshot();
});
```

#### With custom matcher

```js
const { toMatchDiffSnapshot } = require('snapshot-diff');

expect.extend({ toMatchDiffSnapshot });

test('snapshot difference between 2 strings', () => {
  expect(a).toMatchDiffSnapshot(b);
});

const React = require('react');
const Component = require('./Component');

test('snapshot difference between 2 React components state', () => {
  expect(<Component test="say" />).toMatchDiffSnapshot(
    <Component test="my name" />
  );
});
```

... alternatively import it once, for instance in your [tests setup file](https://jestjs.io/docs/en/configuration.html#setupfilesafterenv-array):

```js
require('snapshot-diff/extend-expect');
```

Produced snapshot:

```diff
exports[`snapshot difference between 2 strings 1`] = `
"- First value
+ Second value


-  abcx
+  abcy
   "
`;

exports[`snapshot difference between 2 React components state 1`] = `
"- <Component test=\\"say\\" />
+ <Component test=\\"my name\\" />

@@ -27,11 +27,11 @@
   <span />
   <span />
   <span />
   <span />
   <span>
-    say
+    my name
   </span>
   <span />
   <span />
   <span />
   <span />"
`;
```

## Custom serializers

By default, `snapshot-diff` uses a built in React serializer based on `react-test-renderer`. The
[serializers](https://jestjs.io/docs/en/configuration#snapshotserializers-array-string) used can be set by calling
`setSerializers` with an array of serializers to use. The order of serializers in this array may be important to you as
serializers are tested in order until a match is found.

`setSerializers` can be used to add new serializers for unsupported data types, or to set a different serializer
for React components. If you want to keep the default React serializer in place, don't forget to add the default
serializers to your list of serializers!

### Adding a new custom serializer

```js
const snapshotDiff = require('snapshot-diff');
const myCustomSerializer = require('./my-custom-serializer');

snapshotDiff.setSerializers([
  ...snapshotDiff.defaultSerializers, // use default React serializer - add this if you want to serialise React components!
  myCustomSerializer
]);
```

### Serializing React components with a different serializer

You can replace the default React serializer by omitting it from the serializer list. The following uses enzymes to-json
serializer instead:

```js
const snapshotDiff = require('snapshot-diff');
const enzymeToJson = require('enzyme-to-json/serializer');
const myCustomSerializer = require('./my-custom-serializer');

snapshotDiff.setSerializers([
  enzymeToJson, // using enzymes serializer instead
  myCustomSerializer
]);
```

## Snapshot serializer

By default Jest adds extra quotes around strings so it makes diff snapshots of objects too noisy.
To fix this – `snapshot-diff` comes with custom serializer, which you can add directly in your tests or in `setupFiles` script:

```js
const snapshotDiff = require('snapshot-diff');

expect.addSnapshotSerializer(snapshotDiff.getSnapshotDiffSerializer());

test('snapshot difference between 2 objects', () => {
  expect(snapshotDiff({ foo: 'bar' }, { foo: 'baz' })).toMatchSnapshot();
});
```

...or add it globally to your jest config:

```js
// jest.config.js
module.exports = {
  snapshotSerializers: [
    require.resolve('snapshot-diff/serializer.js'),
  ],
};
```

## API

```js
type Options = {
  expand?: boolean,
  colors?: boolean,
  contextLines?: number
};

// default export
snapshotDiff(valueA: any, valueB: any, options?: Options) => string
// custom matcher
expect(valueA: any).toMatchDiffSnapshot(valueB: any, options?: Options, testName?: string) => void
```

### Options

- `expand: boolean` (default: `false`) – expand the diff, so the whole information is preserved
- `colors: boolean` (default: `false`) – preserve color information from Jest diff
- `contextLines: number` (default: 5) - number of context lines to be shown at the beginning and at the end of a snapshot
- `stablePatchmarks: boolean` (default: `false`) - prevent line number patch marks from appearing in
diffs. This can be helpful when diffs are breaking only because of the patch marks. Changes `@@ -1,1 +1,2 @@` to `@@ --- --- @@`.
- `aAnnotation: string` (default: `'First Value'`) - the annotation indicating from which serialization the `-` lines are
- `bAnnotation: string` (default: `'Second Value'`) - the annotation indicating from which serialization the `+` lines are

---

Project is MIT-licensed. Pull Requests welcome!
