// CLABE Validator
// Mocha Specifications Cases
//
// Run:
//    $ cd clabe-validator
//    $ npm test

// Imports
const assert = require('assert').strict;
const clabe =  require('./clabe.js');

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Library version number', () => {

   it('follows semantic version formatting', () => {
      const semVerPattern = /\d+[.]\d+[.]\d+/;
      const actual =   { valid: semVerPattern.test(clabe.version) };
      const expected = { valid: true };
      assert.deepEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('List of CLABE banks', () => {

   it('contains the correct code to look up a bank tag', () => {
      const dataSet = [
         { input: '002', expected: 'BANAMEX' },
         { input: '640', expected: 'JP MORGAN C.B.' },
         { input: '652', expected: 'ASEA' }
         ];
      function evalData(data) {
         const actual =   { code: data.input, tag: clabe.banksMap[parseInt(data.input)].bankShortName };
         const expected = { code: data.input, tag: data.expected };
         assert.deepEqual(actual, expected);
         }
      dataSet.forEach(evalData);
      });

   it('contains the correct code to look up a bank name', () => {
      const dataSet = [
         { input: '002', expected: 'Banco Nacional de México, S.A.' },
         { input: '640', expected: 'J.P. Morgan Casa de Bolsa, S.A. de C.V.' },
         { input: '652', expected: 'Solución Asea, S.A. de C.V., Sociedad Financiera Popular' }
         ];
      function evalData(data) {
         const actual =   { code: data.input, name: clabe.banksMap[parseInt(data.input)].bankName };
         const expected = { code: data.input, name: data.expected };
         assert.deepEqual(actual, expected);
         }
      dataSet.forEach(evalData);
      });

   it('has a default "N/A" bank name and tag for code 999', () => {
      const bank = clabe.banksMap[999];
      const actual =   { code: 999, name: bank.bankName, shortName: bank.bankShortName };
      const expected = { code: 999, name: 'N/A',         shortName: 'N/A' };
      assert.deepEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('List of CLABE cities', () => {
   const cityNamesMap = {};  //{ Aguascalientes: 10, Calvillo: 12, ... }
   function addCity(city) { cityNamesMap[city[1]] = city[0]; }
   clabe.cities.forEach(addCity);

   it('is in numerical order', () => {
      function checkOrder(city, i) {  //example city: [10, 'Aguascalientes']
         const priorCode = i > 0 ? clabe.cities[i - 1][0] : 0;
         const ordered = city[0] >= priorCode;
         const actual =   { city: city[1], code: city[0], prior: priorCode, ordered: ordered };
         const expected = { city: city[1], code: city[0], prior: priorCode, ordered: true };
         assert.deepEqual(actual, expected);
         }
      clabe.cities.forEach(checkOrder);
      });

   it('contains the correct code for a city', () => {
      const dataSet = [
         { input: 'Tecate',              expected: '027' },
         { input: 'La Mesa',             expected: '028' },
         { input: 'Rosarito',            expected: '028' },
         { input: 'Jerez de G. Salinas', expected: '936' }
         ];
      function evalData(data) {
         const actual =   { city: data.input, code: cityNamesMap[data.input] };
         const expected = { city: data.input, code: parseInt(data.expected) };
         assert.deepEqual(actual, expected);
         }
      dataSet.forEach(evalData);
      });

   it('has no duplicate city names', () => {
      function checkForDuplicate(city) {
         const code = cityNamesMap[city[1]];
         const unique = city[0] === code || city[1] === 'N/A';
         const actual =   { city: city[1], code1: city[0], code2: code, unique: unique };
         const expected = { city: city[1], code1: city[0], code2: code, unique: true };
         assert.deepEqual(actual, expected);
         }
      clabe.cities.forEach(checkForDuplicate);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('CLABE validator', () => {

   it('rejects an invalid CLABE number', () => {
      const dataSet = [
         { input: '002010077777777779', expected: 'Invalid checksum, last digit should be: 1' },
         { input: '000000000000000000', expected: 'Invalid bank code' },
         { input: '002115016003269411', expected: 'Invalid city code' }
         ];
      function evalData(data) {
         const result = clabe.validate(data.input);
         const actual =   { clabe: data.input, error: result.error, message: result.message };
         const expected = { clabe: data.input, error: true,         message: data.expected };
         assert.deepEqual(actual, expected);
         }
      dataSet.forEach(evalData);
      });

   it('accepts a valid CLABE number', () => {
      const dataSet = [
         '002010077777777771',
         '032180000118359719',
         '014027000005555558',
         '014028000005555557'
         ];
      function evalData(data) {
         const result = clabe.validate(data);
         const valid = /^Valid:/.test(result.message);
         const actual =   { clabe: data, error: result.error, valid: valid };
         const expected = { clabe: data, error: false,        valid: true };
         assert.deepEqual(actual, expected);
         }
      dataSet.forEach(evalData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('CLABE calculator', () => {

   it('builds the correct CLABE number', () => {
      const dataSet = [
         { input: { bank:  2, city:  10, acct: 7777777777 }, expected: '002010077777777771' },
         { input: { bank: 32, city: 180, acct:   11835971 }, expected: '032180000118359719' },
         { input: { bank: 14, city:  27, acct:     555555 }, expected: '014027000005555558' },
         { input: { bank: 14, city:  28, acct:     555555 }, expected: '014028000005555557' }
         ];
      function evalData(data) {
         const clabeNum = clabe.calculate(data.input.bank, data.input.city, data.input.acct);
         const actual =   { details: data.input, clabe: clabeNum };
         const expected = { details: data.input, clabe: data.expected };
         assert.deepEqual(actual, expected);
         }
      dataSet.forEach(evalData);
      });

   });
