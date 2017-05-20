// CLABE Validator
// Mocha Specifications Cases
//
// Run:
//    $ cd clabe-validator
//    $ npm test

const assert = require('assert');
const clabe =  require('./clabe.js');

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('List of CLABE banks', () => {

   it('contains the correct code to look up a bank name', () => {
      const dataSet = [
         { input: '002', expected: 'Banco Nacional de México' },
         { input: '640', expected: 'J.P. Morgan Casa de Bolsa' }
         ];
      function evalData(data) {
         assert.equal(clabe.bank[parseInt(data.input)], data.expected);
         }
      dataSet.forEach(evalData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('List of CLABE cities', () => {
   let cityMap = {};
   function addCity(city) { cityMap[city[1]] = city[0]; }
   clabe.cities.forEach(addCity);

   it('contains the correct code for a city', () => {
      const dataSet = [
         { input: 'Tecate',              expected: '027' },
         { input: 'La Mesa',             expected: '028' },
         { input: 'Rosarito',            expected: '028' },
         { input: 'Jerez de G. Salinas', expected: '936' }
         ];
      function evalData(data) {
         assert.equal(cityMap[data.input], parseInt(data.expected));
         }
      dataSet.forEach(evalData);
      });

   it('has no duplicate city names', () => {
      function checkForDuplicate(city) {
         if (cityMap[city[1]] !== city[0])
            assert.equal(city, 'unique -- see: ' + cityMap[city[1]]);
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
         assert.equal(clabe.validate(data.input).message, data.expected);
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
         assert.equal(clabe.validate(data).message.substr(0, 6), 'Valid:');
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
         assert.equal(clabeNum, data.expected);
         }
      dataSet.forEach(evalData);
      });

   });
