# snapshot-diff
[![npm version](https://badge.fury.io/js/snapshot-diff.svg)](https://badge.fury.io/js/snapshot-diff)

Diffing snapshot utility for Jest. Takes two values, and return their difference as a string, ready to be snapshoted with `toMatchSnapshot()`.
Especially helpful when testing the difference between different states of a React component.

## Installation
```bash
yarn add --dev snapshot-diff
```

## Usage

```js
const { snapshotDiff, toMatchDiffSnapshot } = require('snapshot-diff');

// register custom matcher (optional)
expect.extend({ toMatchDiffSnapshot });

test('snapshot difference between 2 strings', () => {
  // use default jest snapshot matcher
  expect(snapshotDiff(a, b)).toMatchSnapshot();
    
  // or use custom diff snapshot matcher
  expect(a).toMatchDiffSnapshot(b);
});

const React = require('react');
const Component = require('./Component');

test('snapshot difference between 2 React components state', () => {
  // use default jest matcher
  expect(
    snapshotDiff(
      <Component test="say" />,
      <Component test="my name" />
    )
  ).toMatchSnapshot();
  
  // or use custom diff snapshot matcher
  expect(
    <Component test="say" />
  ).toMatchDiffSnapshot(
    <Component test="my name" />
  );    
});
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

## API

```js
type Options = {
  expand?: boolean,
  colors?: boolean
};

// default export
snapshotDiff(valueA: any, valueB: any, options?: Options) => string
```

### Options
* `expand: boolean` (default: `false`) – expand the diff, so the whole information is preserved
* `colors: boolean` (default: `false`) – preserve color information from Jest diff
* `contextLines: number` (default: 5) - number of context lines to be shown at the beginning and at the end of a snapshot

---

Project is MIT-licensed. Pull Requests welcome!
