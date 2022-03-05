// CLABE Validator
// Mocha Specification Suite
//
// Run:
//    $ cd clabe-validator
//    $ npm test

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { readdirSync } from 'fs';

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The "dist" folder', () => {

   it('contains the correct files', () => {
      const actual =   readdirSync('dist').sort();
      const expected = ['clabe.d.ts', 'clabe.dev.js', 'clabe.js', 'clabe.min.js', 'clabe.umd.cjs'];
      assertDeepStrictEqual(actual, expected);
      });

   });
