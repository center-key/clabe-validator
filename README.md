# CLABE Validator
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=200 alt=logo>

_JavaScript library to analyze or create a CLABE number for a Mexican bank account_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/clabe-validator/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/clabe-validator.svg)](https://www.npmjs.com/package/clabe-validator)
[![Vulnerabilities](https://snyk.io/test/github/center-key/clabe-validator/badge.svg)](https://snyk.io/test/github/center-key/clabe-validator)
[![Hits](https://data.jsdelivr.com/v1/package/npm/clabe-validator/badge?style=rounded)](https://www.jsdelivr.com/package/npm/clabe-validator)
[![Build](https://travis-ci.org/center-key/clabe-validator.svg)](https://travis-ci.org/center-key/clabe-validator)

CLABE (Clave Bancaria Estandarizada &mdash; Spanish for "standardized banking code") is a banking
standard from the Mexican Bank Association (Asociación de Bancos de México &mdash; ABM) for
uniform numbering of bank accounts.&nbsp; CLABE numbers are 18 digits long.&nbsp;
See: https://en.wikipedia.org/wiki/CLABE

### A) Online form
Try it out:<br>
[https://centerkey.com/clabe](https://centerkey.com/clabe/)

### B) Setup
#### Web browser
Include in a web page:
```html
<script src=clabe.min.js></script>
```
or from the [jsdelivr.com CDN](https://www.jsdelivr.com/package/npm/clabe-validator):
```html
<script src=https://cdn.jsdelivr.net/npm/clabe-validator@1.5/dist/clabe.min.js></script>
```
#### Node.js server
Install package for node:
```shell
$ npm install clabe-validator
```
Import package:
```javascript
const clabe = require('clabe-validator');
```

**Note:** _Release v1.4.0 contains a significant number of bank and city code additions plus
updates to reflect financial institution mergers and name changes._

### C) Validator usage
Pass the CLABE number as an 18-character string into `clabe.validate(clabeNum)`.

#### 1. Example JavaScript code
```javascript
const clabeNum = '002010077777777771';
const clabeCheck = clabe.validate(clabeNum);
console.log(clabeCheck.ok ? '¡Que bueno!' : '¡Muy mal!');
console.log('Your bank: ' + clabeCheck.bank);
```

#### 2. Example JSON result for a valid CLABE number
```javascript
{
   ok:       true,
   error:    null,
   formatOk: true,
   tag:      'BANAMEX',
   bank:     'Banco Nacional de México, S.A.',
   city:     'Aguascalientes MX-AGU',
   account:  '07777777777'
}
```

#### 3. Example JSON result for an invalid CLABE number
```javascript
{
   ok:       false,
   formatOk: true,
   error:    'invalid-city',
   message:  'Invalid city code: 000'
}
```
The `formatOk` field indicates if the CLABE's length and checksum are both valid (even if the bank
code or city code are invalid).

#### 4. Possible errors
| Error code           | Error message                                   | Format Ok |
| -------------------- | ----------------------------------------------- | ----------|
| `invalid-length`     | Must be exactly 18 digits long                  | `false`   |
| `invalid-characters` | Must be only numeric digits (no letters)        | `false`   |
| `invalid-checksum`   | Invalid checksum, last digit should be: [DIGIT] | `false`   |
| `invalid-bank`       | Invalid bank code: [CODE]                       | `true`    |
| `invalid-city`       | Invalid city code: [CODE]                       | `true`    |

### D) Calculator usage
Pass the bank code, city code, and account number into
`clabe.calculate(bankCode, cityCode, accountNumber)`
and get the 18-character CLABE number back.

```javascript
const clabeNum = clabe.calculate(2, 10, 7777777777);
console.log(clabeNum === '002010077777777771');  //true
```

### E) Contributor Notes
To be a contributor, fork the project and run the commands `npm install` and `npm test` on your
local clone.&nbsp; Make your edits and rerun the tests.&nbsp; Pull requests welcome.

Pull requests (PRs) should not update the `version` number in **package.json** or any files in the
`dist` folder.&nbsp; The `version` number and `dist` files are all updated as part of the release
process.

<br>

---
Feel free to submit questions at:<br>
[github.com/center-key/clabe-validator/issues](https://github.com/center-key/clabe-validator/issues)

CLABE Validator code is open source under the [MIT License](LICENSE.txt),
and the documentation is published under the
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) license.
