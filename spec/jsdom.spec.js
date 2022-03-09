// CLABE Validator
// Mocha Specification Suite
//
// Run:
//    $ cd clabe-validator
//    $ npm test

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';

// Setup
const mode =       { type: 'Minified', file: 'dist/clabe.min.js' };
const filename =   import.meta.url.replace(/.*\//, '');  //jshint ignore:line
const dom =        new JSDOM('', { runScripts: 'outside-only' });
const scripts =    [mode.file];
const loadScript = (file) => dom.window.eval(readFileSync(file).toString());  //jshint ignore:line
scripts.forEach(loadScript);
const { clabe } =  dom.window;

// Specification suite
describe(`Specifications: ${filename} - ${mode.type} (${mode.file})`, () => {

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Library version number', () => {

   it('follows semantic version formatting', () => {
      const semVerPattern = /\d+[.]\d+[.]\d+/;
      const actual =   { version: clabe.version, valid: semVerPattern.test(clabe.version) };
      const expected = { version: clabe.version, valid: true };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('List of CLABE banks', () => {

   const bankCodes = Object.keys(clabe.banksMap);

   it('contains only uppercase bank tags', () => {
      const checkTagCase = (bankCode) => {  //example: 21: { tag: 'HSBC', name: 'HSBC México' },
         const bank = clabe.banksMap[bankCode];
         const actual =   { code: bankCode, tag: bank.tag,               name: bank.name };
         const expected = { code: bankCode, tag: bank.tag.toUpperCase(), name: bank.name };
         assertDeepStrictEqual(actual, expected);
         };
      bankCodes.forEach(checkTagCase);
      });

   it('contains no duplicate tags', () => {
      const allowedDuplicateTags = ['SKANDIA', 'STP'];  //list of permitted exceptions
      const tags =                 bankCodes.map(bankCode => clabe.banksMap[bankCode].tag);
      const duplicateTags =        tags.sort().filter((v, i, a) => i > 0 && v === a[i - 1]);
      const problemTags =          duplicateTags.filter(tag => !allowedDuplicateTags.includes(tag));
      const makeCodeBankPair =     code => [code, clabe.banksMap[code]];
      const tagIsDuplicate =       pair => problemTags.includes(pair[1].tag);
      const problemBanks =         bankCodes.map(makeCodeBankPair).filter(tagIsDuplicate);
      const actual =   { duplicates: duplicateTags,        tags: problemTags, banks: problemBanks };
      const expected = { duplicates: allowedDuplicateTags, tags: [],          banks: [] };
      assertDeepStrictEqual(actual, expected);
      });

   it('contains the correct code to look up a bank tag', () => {
      const dataSet = [
         { input: '002', expected: 'BANAMEX' },
         { input: '640', expected: 'CB JPMORGAN' },
         { input: '652', expected: 'CREDICAPITAL' },
         ];
      const evalData = (data) => {
         const actual =   { code: data.input, tag: clabe.banksMap[parseInt(data.input)].tag };
         const expected = { code: data.input, tag: data.expected };
         assertDeepStrictEqual(actual, expected);
         };
      dataSet.forEach(evalData);
      });

   it('contains the correct code to look up a bank name', () => {
      const dataSet = [
         { input: '002', expected: 'Banco Nacional de México' },
         { input: '640', expected: 'J.P. Morgan Casa de Bolsa' },
         { input: '652', expected: 'Solución Asea, Sociedad Financiera Popular' },
         ];
      const evalData = (data) => {
         const actual =   { code: data.input, name: clabe.banksMap[parseInt(data.input)].name };
         const expected = { code: data.input, name: data.expected };
         assertDeepStrictEqual(actual, expected);
         };
      dataSet.forEach(evalData);
      });

   it('has a default "N/A" bank name and tag for code 999', () => {
      const actual =   { code: 999, tag: clabe.banksMap[999].tag, name: clabe.banksMap[999].name };
      const expected = { code: 999, tag: 'N/A',                   name: 'N/A' };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('List of CLABE cities', () => {
   const cityState =    (city) => city[2] ? city[1] + ' ' + city[2] : city[1];
   const entries =      clabe.cities.map(city => [cityState(city), city[0]]);
   const cityNamesMap = Object.fromEntries(entries);  //{ 'Aguascalientes MX-AGU': 10, 'Asientos MX-AGU': 11, ... }

   it('is in numerical order', () => {
      const checkOrder = (city, i) => {  //example city: [10, 'Aguascalientes MX-AGU']
         const priorCode = i > 0 ? clabe.cities[i - 1][0] : 0;
         const ordered = city[0] >= priorCode;
         const actual =   { city: city[1], code: city[0], prior: priorCode, ordered: ordered };
         const expected = { city: city[1], code: city[0], prior: priorCode, ordered: true };
         assertDeepStrictEqual(actual, expected);
         };
      clabe.cities.forEach(checkOrder);
      });

   it('contains the correct code for a city', () => {
      const dataSet = [
         { input: 'Tecate MX-BCN',                  expected: '027' },
         { input: 'La Mesa',                        expected: '028' },
         { input: 'Playas de Rosarito MX-BCN',      expected: '028' },
         { input: 'Jerez de Garcia Salinas MX-ZAC', expected: '936' },
         ];
      const evalData = (data) => {
         const actual =   { city: data.input, code: cityNamesMap[data.input] };
         const expected = { city: data.input, code: parseInt(data.expected) };
         assertDeepStrictEqual(actual, expected);
         };
      dataSet.forEach(evalData);
      });

   it('has no duplicate city names', () => {
      const allowedDuplicateCities = [28, 550];
      const checkForDuplicate = (city) => {
         const code = cityNamesMap[cityState(city)];
         const unique = city[0] === code || allowedDuplicateCities.includes(code);
         const actual =   { city: city, unique: unique, duplicate: code };
         const expected = { city: city, unique: true,   duplicate: code };
         assertDeepStrictEqual(actual, expected);
         };
      clabe.cities.forEach(checkForDuplicate);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The computeChecksum() function', () => {

   it('returns null if the checksum cannot be computed', () => {
      const dataSet = [
         '1234567890123456',
         '1234567890123456789',
         '12345678901234567x',
         'bogus',
         NaN,
         undefined,
         0,
         null,
         ];
      const evalData = (data) => {
         const actual =   { input: data, checksum: clabe.computeChecksum(data) };
         const expected = { input: data, checksum: null };
         assertDeepStrictEqual(actual, expected);
         };
      dataSet.forEach(evalData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('CLABE validator', () => {

   it('rejects an invalid CLABE number', () => {
      const dataSet = [
         { input: '12345678901234567',  expected: [false, 'invalid-length',     'Must be exactly 18 digits long'] },
         { input: '00000000000000000a', expected: [false, 'invalid-characters', 'Must be only numeric digits (no letters)'] },
         { input: '002010077777777779', expected: [false, 'invalid-checksum',   'Invalid checksum, last digit should be: 1'] },
         { input: '000000000000000000', expected: [true,  'invalid-bank',       'Invalid bank code: 000'] },
         { input: '002539016003269411', expected: [true,  'invalid-city',       'Invalid city code: 539'] },
         ];
      const evalData = (data) => {
         const result = clabe.validate(data.input);
         const actual = {
            clabe:   data.input,
            ok:      result.ok,
            format:  result.formatOk,
            error:   result.error,
            message: result.message,
            };
         const expected = {
            clabe:   data.input,
            ok:      false,
            format:  data.expected[0],
            error:   data.expected[1],
            message: data.expected[2],
            };
         assertDeepStrictEqual(actual, expected);
         };
      dataSet.forEach(evalData);
      });

   it('accepts a valid CLABE number', () => {
      const dataSet = [
         '002010077777777771',
         '032180000118359719',
         '014027000005555558',
         '014028000005555557',
         ];
      const evalData = (data) => {
         const result = clabe.validate(data);
         const actual = {
            clabe:    data,
            ok:       result.ok,
            format:   result.formatOk,
            error:    result.error,
            msg:      result.message,
            checksum: result.checksum,
            };
         const expected = {
            clabe:    data,
            ok:       true,
            format:   true,
            error:    null,
            msg:      'Valid',
            checksum: parseInt(data[17]),
            };
         assertDeepStrictEqual(actual, expected);
         };
      dataSet.forEach(evalData);
      });

   it('accepts a valid CLABE number that has a checksum of 0', () => {
      const data = '002010777777777770';  //case where the last compute checksum modulus rolls over
      const result = clabe.validate(data);
      const actual = {
         clabe:    data,
         ok:       result.ok,
         format:   result.formatOk,
         error:    result.error,
         msg:      result.message,
         checksum: result.checksum,
         };
      const expected = {
         clabe:    data,
         ok:       true,
         format:   true,
         error:    null,
         msg:      'Valid',
         checksum: 0,
         };
      assertDeepStrictEqual(actual, expected);
      });

   it('extracts the bank tag, bank name, and city', () => {
      const clabeCheck = clabe.validate('002010077777777771');
      const actual =   {
         tag:      clabeCheck.tag,
         bank:     clabeCheck.bank,
         city:     clabeCheck.city,
         multiple: clabeCheck.multiple,
         total:    clabeCheck.total,
         };
      const expected = {
         tag:      'BANAMEX',
         bank:     'Banco Nacional de México',
         city:     'Aguascalientes MX-AGU',
         multiple: false,
         total:    1,
         };
      assertDeepStrictEqual(actual, expected);
      });

   it('extracts the bank code, city code, and account number', () => {
      const clabeCheck = clabe.validate('002010077777777771');
      const actual =   {
         bank:    clabeCheck.code.bank,
         city:    clabeCheck.code.city,
         account: clabeCheck.account,
         };
      const expected = {
         bank:    '002',
         city:    '010',
         account: '07777777777',
         };
      assertDeepStrictEqual(actual, expected);
      });

   it('correctly identifies a CLABE number that maps to multiple cities', () => {
      const actual = clabe.validate('032180000118359719');
      const expected = {
         ok:       true,
         formatOk: true,
         error:    null,
         message: 'Valid',
         clabe:   '032180000118359719',
         tag:     'IXE',
         bank:    'IXE Banco',
         city:    'Atizapan, Chalco, Ciudad de México MX-CMX, Coacalco, Cuautitlán Izcalli, Ecatepec, Huehuetoca, Huixquilucan, Ixtapaluca, Los Reyes la Paz, Naucalpan, Nezahualcóyotl, Tecamac, Teotihuacán, Texcoco, Tlalnepantla',
         multiple: true,
         total:    16,
         account: '00011835971',
         code:     { bank: '032', city: '180' },
         checksum: 9,
         };
      assertDeepStrictEqual(actual, expected);
      });

   it('returns nulls for properly formatted CLABE number with invalid bank and city codes', () => {
      const actual = clabe.validate('000000077777777770');
      const expected = {
         ok:       false,
         formatOk: true,
         error:    'invalid-bank',
         message:  'Invalid bank code: 000',
         clabe:    null,
         tag:      null,
         bank:     null,
         city:     null,
         multiple: false,
         total:    0,
         account:  '07777777777',
         code:     { bank: '000', city: '000' },
         checksum: 0,
         };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('CLABE calculator', () => {

   it('builds the correct CLABE number', () => {
      const dataSet = [
         { input: { bank:  2, city:  10, acct: 7777777777 }, expected: '002010077777777771' },
         { input: { bank: 32, city: 180, acct:   11835971 }, expected: '032180000118359719' },
         { input: { bank: 14, city:  27, acct:     555555 }, expected: '014027000005555558' },
         { input: { bank: 14, city:  28, acct:     555555 }, expected: '014028000005555557' },
         ];
      const evalData = (data) => {
         const clabeNum = clabe.calculate(data.input.bank, data.input.city, data.input.acct);
         const actual =   { details: data.input, clabe: clabeNum };
         const expected = { details: data.input, clabe: data.expected };
         assertDeepStrictEqual(actual, expected);
         };
      dataSet.forEach(evalData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
});
