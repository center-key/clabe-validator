// CLABE Validator
// Mocha Specification Suite
//
// Run:
//    $ cd clabe-validator
//    $ npm test

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { readdirSync } from 'fs';
import { clabe } from '../dist/clabe.js';

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The "dist" folder', () => {

   it('contains the correct files', () => {
      const actual =   readdirSync('dist').sort();
      const expected = ['clabe.d.ts', 'clabe.dev.js', 'clabe.js', 'clabe.min.js', 'clabe.umd.cjs'];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Current number of banks and cities', () => {

   const numBanks =  Object.keys(clabe.banksMap).length;
   const numCities = clabe.cities.length;
   const counts =    `(${numBanks} banks, ${numCities} cities)`;

   it('is correct ' + counts, () => {
      const actual =   { banks: numBanks, cities: numCities };
      const expected = { banks: 124,      cities: 882 };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Newly added or modified banks and cities', () => {

   const newBanks = [
      { code: 152, tag: 'BANCREA',         name: 'Banco Bancrea, Institución de Banca Múltiple' },
      { code: 602, tag: 'MASARI',          name: 'Masari Casa de Bolsa' },
      { code: 674, tag: 'AXA',             name: 'AXA Seguros' },
      { code: 677, tag: 'CAJA POP MEXICA', name: 'Caja Popular Mexicana' },
      { code: 679, tag: 'FND',             name: 'Financiera Nacional De Desarrollo Agropecuario' },
      { code: 846, tag: 'STP',             name: 'Sistema de Transferencias y Pagos STP' },
      ];
   const newCities = [
      { code: 198, name: 'Santa Maria del Oro MX-DUR' },
      { code: 382, name: 'San Julian MX-JAL' },
      { code: 660, name: 'Huejotzingo MX-PUE' },
      { code: 960, name: 'Victor Rosales MX-ZAC' },
      ];
   const counts = `(${newBanks.length} banks, ${newCities.length} cities)`;

   it('work in the calculator and validator ' + counts, () => {
      const mockAcct = '1234567';
      const checkBankAndCity = (bank, city) => {
         const pad =      (code) => code.toString().padStart(3, '0');
         const clabeNum = clabe.calculate(bank.code, city.code, mockAcct);
         const actual =   clabe.validate(clabeNum);
         const expected = {
            ok:       true,
            formatOk: true,
            error:    null,
            message:  'Valid',
            clabe:    clabeNum,
            code:     { bank: pad(bank.code), city: pad(city.code) },
            tag:      bank.tag,
            bank:     bank.name,
            city:     city.name,
            multiple: false,
            account:  mockAcct.padStart(11, '0'),
            checksum: parseInt(clabeNum.slice(-1)),
            };
         assertDeepStrictEqual(actual, expected);
         };
      const checkBank = (bank) => newCities.forEach((city) => checkBankAndCity(bank, city));
      newBanks.forEach(checkBank);
      });

   });
