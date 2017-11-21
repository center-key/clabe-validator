### CLABE Validator

*JavaScript library to analyze a CLABE number for a Mexican bank account*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/clabe-validator/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/clabe-validator.svg)](https://www.npmjs.com/package/clabe-validator)
[![Known Vulnerabilities](https://snyk.io/test/github/center-key/clabe-validator/badge.svg)](https://snyk.io/test/github/center-key/clabe-validator)
[![Build Status](https://travis-ci.org/center-key/clabe-validator.svg)](https://travis-ci.org/center-key/clabe-validator)

---

Clave Bancaria Estandarizada (Spanish for "standardized banking cipher") is a banking
standard from the Mexican Bank Association (Asociación de Bancos de México &ndash; ABM) for
uniform numbering of bank accounts.

### A) Online form
Try it out:<br>
[centerkey.com/clabe](http://centerkey.com/clabe/)

### B) Include
In a web page:
```html
<script src=clabe.js></script>
```

From the jsdelivr.com CDN:
```html
<script src=https://cdn.jsdelivr.net/npm/clabe-validator@1.0/clabe.min.js></script>
```

In a Node.js project:
```shell
$ npm install clabe-validator --save
```
```javascript
var clabe = require('clabe-validator');
```

### C) Validator usage
Pass the CLABE number as an 18-character string into `clabe.validate(clabeNum)`.

#### 1. Example JavaScript code
```javascript
var clabeNum = '002010077777777771';
var clabeCheck = clabe.validate(clabeNum);
console.log(clabeCheck.error ? '¡Muy mal!' : '¡Que bueno!');
```

#### 2. Example JSON result for a valid CLABE number
```javascript
{
   error: false,
   bank:  'Banco Nacional de México',
   city:  'Aguascalientes'
}
```

#### 3. Example JSON result for an invalid CLABE number
```javascript
{
   error:   true,
   message: 'Invalid city code'
}
```

#### 4. Possible error messages
| Error message                            |
| ---------------------------------------- |
| Must be exactly 18 digits long           |
| Must be only numeric digits (no letters) |
| Invalid checksum                         |
| Invalid bank code                        |
| Invalid city code                        |

### D) Calculator usage
Pass the bank code, city code, and account number into `clabe.calculate(bankCode, cityCode, accountNumber)` and get the 18-character CLABE number back.

```javascript
var clabeNum = clabe.calculate(2, 10, 7777777777);
console.log(clabeNum === '002010077777777771');
```

### E) Notes
1. Feel free to submit questions at:
[github.com/center-key/clabe-validator/issues](https://github.com/center-key/clabe-validator/issues)
1. To be a contributor, fork the project and execute the `task-runner.sh.command` script.  Make
your edits and rerun the script to ensure all the test cases pass.  Pull requests welcome.

---
CLABE Validator code is open source under the [MIT License](LICENSE.txt),
and the documentation is published under the
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0) license.
