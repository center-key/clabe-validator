// CLABE Validator
// Mocha Specification Suite
//
// Run:
//    $ cd clabe-validator
//    $ npm test

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { clabe } from '../dist/clabe.js';
import fs from 'fs';

////////////////////////////////////////////////////////////////////////////////
describe('The "dist" folder', () => {

   it('contains the correct files', () => {
      const actual = fs.readdirSync('dist').sort();
      const expected = [
         'clabe.d.ts',
         'clabe.dev.js',
         'clabe.js',
         'clabe.min.js',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Current number of banks and cities', () => {

   const numBanks =  Object.keys(clabe.banksMap).length;
   const numCities = clabe.cities.length;
   const counts =    `(${numBanks} banks, ${numCities} cities)`;

   it('is correct ' + counts, () => {
      const actual =   { banks: numBanks, cities: numCities };
      const expected = { banks: 138,      cities: 884 };  //update this line when adding a new bank or city
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Newly added or modified banks and cities', () => {

   const newBanks = [  //insert any new or changed banks below
      { code: 152, tag: 'BANCREA',         name: 'Banco Bancrea, Institución de Banca Múltiple' },
      { code: 159, tag: 'BANK OF CHINA',   name: 'Bank of China México' },
      { code: 602, tag: 'MASARI',          name: 'Masari Casa de Bolsa' },
      { code: 638, tag: 'NU MEXICO',       name: 'Nu México Financiera (Nubank)' },
      { code: 661, tag: 'ALTERNATIVOS',    name: 'Servicios Financieros Alternativos (Klar)' },
      { code: 674, tag: 'AXA',             name: 'AXA Seguros' },
      { code: 677, tag: 'CAJA POP MEXICA', name: 'Caja Popular Mexicana' },
      { code: 679, tag: 'FND',             name: 'Financiera Nacional De Desarrollo Agropecuario' },
      { code: 688, tag: 'CREDICLUB',       name: 'Crediclub' },
      { code: 699, tag: 'FONDEADORA',      name: 'Fondea Technologies' },
      { code: 703, tag: 'TESORED',         name: 'Tesored' },
      { code: 706, tag: 'ARCUS',           name: 'Arcus Financial Intelligence' },
      { code: 710, tag: 'NVIO',            name: 'NVIO Pagos México' },
      { code: 721, tag: 'ALBO',            name: 'albo' },
      { code: 722, tag: 'MERCADO PAGO W',  name: 'Mercado Pago W' },
      { code: 723, tag: 'CUENCA',          name: 'Cuenca' },
      { code: 728, tag: 'SPIN',            name: 'SPIN by OXXO' },
      { code: 846, tag: 'STP',             name: 'Sistema de Transferencias y Pagos STP' },
      ];
   const newCities = [  //insert any new or changed cities below
      { code: 198, name: 'Santa Maria del Oro MX-DUR' },
      { code: 382, name: 'San Julian MX-JAL' },
      { code: 660, name: 'Huejotzingo MX-PUE' },
      { code: 960, name: 'Victor Rosales MX-ZAC' },
      { code: 969, name: 'Ciudad de México MX-CMX' },
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
            total:    1,
            account:  mockAcct.padStart(11, '0'),
            checksum: Number(clabeNum.slice(-1)),
            };
         assertDeepStrictEqual(actual, expected);
         };
      const checkBank = (bank) => newCities.forEach((city) => checkBankAndCity(bank, city));
      newBanks.forEach(checkBank);
      });

   });
