/* global expect */
const { toMatchDiffSnapshot, toMatchInlineDiffSnapshot } = require('./build/');

expect.extend({ toMatchDiffSnapshot, toMatchInlineDiffSnapshot });
