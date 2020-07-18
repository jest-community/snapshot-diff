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

By default, `snapshot-diff` uses a built in React component serializer based on `react-test-renderer`. The serializers
used can be set by calling `setSerializers` with an array of serializers to use. The order of serializers in this array
may be important to you as serializers are tested in order until a match is found.

`setSerializers` can be used to add new serializers for unsupported data types, or to set a different serializer for
React components. If you want to keep the default React component serializer in place, don't forget to add the default
serializers to your list of serializers!

ℹ️ **Note:** Serializers are independent; once a serializer is matched no further serializers will be run for that
input. This would be expected when adding a different serializer for React components (e.g. enzyme's serializer instead
of the built in React component serializer) or adding a new serializer for unsupported data types. It may not be as
expected when you need serializers to work together (e.g. rendering a React component which makes use of CSS-in-JS, like
Emotion). If you need a serializer to work with the existing React component serializer, see the "_Enhancing the React
component serializer_" section below.

### Adding a new custom serializer

```js
const snapshotDiff = require('snapshot-diff');
const myCustomSerializer = require('./my-custom-serializer');

snapshotDiff.setSerializers([
                                      // Use the default React component serializer. Don't forget to add this if you
  ...snapshotDiff.defaultSerializers, // want to continue to serialize React components
  myCustomSerializer
]);
```

### Serializing React components with a different serializer

You can replace the default React component serializer by omitting it from the serializer list. The following uses
Enzyme's `to-json` serializer instead:

```js
const snapshotDiff = require('snapshot-diff');
const enzymeToJson = require('enzyme-to-json/serializer');
const myCustomSerializer = require('./my-custom-serializer');

snapshotDiff.setSerializers([
                                      // Use Enzyme's React component serializer. Add this instead of the default React
  enzymeToJson,                       // component serializer if you want to replace how React components are serialized
  myCustomSerializer
]);
```

## Enhancing the React component serializer

`snapshot-diff` uses a built in React component serializer based on `react-test-renderer`. Internally, this makes use of
the default Jest serializers which are passed to `pretty-format`. However, you may wish to use a different configuration
of internal serializers when serializing a React component, e.g. Adding a new internal serializer to deal with using a
CSS-in-JS solution, such as Emotion.

The React component serializer is exposed at `snapshotDiff.reactSerializer`

The API for adding new internal serializers to the React component serializer is similar to how top level serializers
are added to  `snapshot-diff`. The React component serializer has a `setSerializers` function which can be used to
change the internal serializers used for serializing a React component. If you want to keep using the default internal
serializers, don't forget to add them too!

ℹ️ **Note:** Internal serializers added to the React component serializer are only used by the React component
serializer. i.e.
 - `snapshotDiff.setSerializers` is **not** the same as `snapshotDiff.reactSerializer.setSerializers`
 - `snapshotDiff.defaultSerializers` is **not** the same as `snapshotDiff.reactSerializer.defaultSerializers`

### Adding a new serializer

```js
const snapshotDiff = require('snapshot-diff');
const emotionSerializer = require('jest-emotion');

snapshotDiff.reactSerializer.setSerializers([
  emotionSerializer,
  ...snapshotDiff.reactSerializer.defaultSerializers
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
