/* global expect */
const { toMatchDiffSnapshot } = require('./build/');

expect.extend({ toMatchDiffSnapshot });
