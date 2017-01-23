// CLABE Validator

var clabe = require('./clabe.js');

describe('List of CLABE banks', () => {
   it('contains the correct code to look up a bank name', () => {
      var dataSet = [
         { input: '002', expected: 'Banco Nacional de México' },
         { input: '640', expected: 'J.P. Morgan Casa de Bolsa' }
         ];
      function evalData(data) {
         expect(clabe.bank[parseInt(data.input)]).toBe(data.expected);
         }
      dataSet.forEach(evalData);
      });
   });

describe('List of CLABE cities', () => {
   var cityMap = {};
   function addCity(city) { cityMap[city[1]] = city[0]; }
   clabe.cities.forEach(addCity);
   it('contains the correct code for a city', () => {
      var dataSet = [
         { input: 'Tecate',              expected: '027' },
         { input: 'La Mesa',             expected: '028' },
         { input: 'Rosarito',            expected: '028' },
         { input: 'Jerez de G. Salinas', expected: '936' }
         ];
      function evalData(data) {
         expect(cityMap[data.input]).toBe(parseInt(data.expected));
         }
      dataSet.forEach(evalData);
      });
   it('has no duplicate city names', () => {
      function checkForDuplicate(city) {
         if (cityMap[city[1]] !== city[0])
            expect(city).toBe('unique -- see: ' + cityMap[city[1]]);
         }
      clabe.cities.forEach(checkForDuplicate);
      });
   });

describe('CLABE validator', () => {
   it('rejects an invalid CLABE number', () => {
      var dataSet = [
         { input: '002010077777777779', expected: 'Invalid checksum, last digit should be: 1' },
         { input: '000000000000000000', expected: 'Invalid bank code' },
         { input: '002115016003269411', expected: 'Invalid city code' }
         ];
      function evalData(data) {
         expect(clabe.validate(data.input).message).toBe(data.expected);
         }
      dataSet.forEach(evalData);
      });
   it('accepts a valid CLABE number', () => {
      var dataSet = [
         '002010077777777771',
         '032180000118359719',
         '014027000005555558',
         '014028000005555557'
         ];
      function evalData(data) {
         expect(clabe.validate(data).message.substr(0, 6)).toBe('Valid:');
         }
      dataSet.forEach(evalData);
      });
   });
