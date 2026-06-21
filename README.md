# CLABE Validator
<img src=https://centerkey.com/graphics/center-key-logo.svg align=right width=200 alt=logo>

_JavaScript library to analyze or create a CLABE number for a Mexican bank account_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/clabe-validator/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/clabe-validator.svg)](https://www.npmjs.com/package/clabe-validator)
[![Hits](https://data.jsdelivr.com/v1/package/npm/clabe-validator/badge?style=rounded)](https://www.jsdelivr.com/package/npm/clabe-validator)
[![Build](https://github.com/center-key/clabe-validator/actions/workflows/run-spec-on-push.yaml/badge.svg)](https://github.com/center-key/clabe-validator/actions/workflows/run-spec-on-push.yaml)
[![Publish Website](https://github.com/center-key/clabe-validator/actions/workflows/publish-website.yaml/badge.svg)](https://github.com/center-key/clabe-validator/actions/workflows/publish-website.yaml)

CLABE (Clave Bancaria Estandarizada &mdash; Spanish for "standardized banking code") is a banking
standard from the Mexican Bank Association (Asociación de Bancos de México &mdash; ABM) for
uniform numbering of bank accounts.&nbsp; CLABE numbers are 18 digits long.&nbsp;
See: https://en.wikipedia.org/wiki/CLABE

## A) Online Form
Try it out:<br>
[https://centerkey.com/clabe](https://centerkey.com/clabe/)

## B) Setup
### Web browser
Include in a web page:
```html
<script src=clabe.min.js></script>
```
or from the [jsdelivr.com CDN](https://www.jsdelivr.com/package/npm/clabe-validator):
```html
<script src=https://cdn.jsdelivr.net/npm/clabe-validator@3.2/dist/clabe.min.js></script>
```
### Node.js server
Install package for node:
```shell
$ npm install clabe-validator
```
Import package:
```javascript
import { clabe } from 'clabe-validator';
```

## C) Validator Usage
Pass the CLABE number as an 18-character string into `clabe.validate(clabeNum)`.

### 1. Example JavaScript code
```javascript
const clabeNum =   '002010077777777771';
const clabeCheck = clabe.validate(clabeNum);
console.info(clabeCheck.ok ? '¡Que bueno!' : '¡Muy mal!');
console.info('Your bank: ' + clabeCheck.bank);
```

### 2. Example JSON result for a valid CLABE number
```javascript
{
   clabe:     '002010077777777771',
   ok:        true,
   valid: {
      format: true,
      bank:   true,
      city:   true,
      },
   error:     null,
   message:   'Valid',
   tag:       'BANAMEX',
   bank:      'Banco Nacional de México',
   city:      'Aguascalientes MX-AGU',
   cities:    1,
   account:   '07777777777',
   code: {
      bank:   '002',
      city:   '010',
      },
   checksum:  1,
}
```

### 3. Example JSON result for an invalid CLABE number
```javascript
{
   clabe:     '002000077777777778',
   ok:        false,
   valid: {
      format: true,
      bank:   true,
      city:   false,
      },
   error:     'invalid-city',
   message:   'Invalid city code: 000',
}
```
The `valid.format` field indicates if the CLABE's length and checksum are both valid (even if the bank
code or city code are unknown).

### 4. Possible errors
| Error code           | Error message                                   | Valid Format |
| -------------------- | ----------------------------------------------- | ------------ |
| `invalid-length`     | Must be exactly 18 digits long                  | `false`      |
| `invalid-characters` | Must be only numeric digits (no letters)        | `false`      |
| `invalid-checksum`   | Invalid checksum, last digit should be: [DIGIT] | `false`      |
| `invalid-bank`       | Invalid bank code: [CODE]                       | `true`       |
| `invalid-city`       | Invalid city code: [CODE]                       | `true`       |

## D) Calculator Usage
Pass the bank code, city code, and account number into
`clabe.calculate(bankCode, cityCode, accountNumber)`
and get the 18-character CLABE number back.

```javascript
const clabeNum = clabe.calculate(2, 10, 7777777777);
console.info(clabeNum === '002010077777777771');  //true
```

## E) TypeScript Declarations
See the TypeScript declarations at the top of the [clabe.ts](src/clabe.ts) file.

The `clabe.validate(clabeNum: string)` function returns a `ClabeCheck` object:
```typescript
type ClabeCheck = {
   clabe:     string | null,  //full 18-digit number
   ok:        boolean,        //todo está bien
   valid: {
      format: boolean,        //correct length and checksum
      bank:   boolean,        //known bank code
      city:   boolean,        //known city code
      },
   error:     string | null,  //failure code, example: 'invalid-city'
   message:   string,         //displayable status information
   tag:       string | null,  //bank short name, example: 'BANAMEX'
   bank:      string | null,  //bank long name, example: 'Banco Nacional'
   city:      string | null,  //branch or plaza name
   cities:    number,         //number of cities
   account:   string,         //11-digit zero-padded bank account number
   code: {
      bank:   string,         //3-digit bank code
      city:   string,         //3-digit city code
      },
   checksum:  number | null,  //control digit (0 to 9)
```

Example TypeScript usage with explicit types:
```typescript
import { clabe, ClabeCheck } from 'clabe-validator';

const clabeNum:   string =     '002010077777777771';
const clabeCheck: ClabeCheck = clabe.validate(clabeNum);  //{ ok: true, error: null, ... }
const bankCode:   string =     clabeCheck.code.bank;      //'002'
```

## F) Contributor Notes
To be a contributor, **fork** the project and run the commands `npm install` and `npm test` on your local clone.&nbsp;
Make your edits and rerun the tests.

Pull requests welcome.&nbsp;
Since the pacakge version number is updated during the release process, **leave the version number unchanged.**

## G) Genesis
The origin of this project goes back to when the project founder needed to send money to
Guanajuato, Mexico to pay nurses who were providing medical care for a family member.&nbsp;
The founder was initially unable to transfer funds because the money transfer service reported that
the CLABE number he supplied was invalid.&nbsp;
Through a little sleuthing and a lot of luck, he discovered that a financial services company had
accidentally omitted the very last modulo math operation in the CLABE checksum calculation.&nbsp;
The result was that valid Mexican bank account numbers with certain combinations of digits were
erroneously rejected.

This project was created to fix the checksum bug.&nbsp;
It is an open source community project and not funded by any company.

<br>

---
CLABE Validator code is open source under the [MIT License](LICENSE.txt),
and the documentation is published under the
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) license.

[🛡️ npm Security Aggregator](https://center-key.github.io/npm-security-aggregator/?package=clabe-validator)

See the `runScriptsConfig` section of [`package.json`](package.json) for a clean way to organize build tasks:
   - 🎋 [`add-dist-header`](https://github.com/center-key/add-dist-header) &mdash;&nbsp; _Prepend a one-line banner comment (with license notice) to distribution files_
   - 📄 [`copy-file-util`](https://github.com/center-key/copy-file-util) &mdash;&nbsp; _Copy or rename a file with optional package version number_
   - 📂 [`copy-folder-util`](https://github.com/center-key/copy-folder-util) &mdash;&nbsp; _Recursively copy files from one folder to another folder_
   - 🪺 [`recursive-exec`](https://github.com/center-key/recursive-exec) &mdash;&nbsp; _Run a command on each file in a folder and its subfolders_
   - 🔍 [`replacer-util`](https://github.com/center-key/replacer-util) &mdash;&nbsp; _Find and replace strings or template outputs in text files_
   - 🔢 [`rev-web-assets`](https://github.com/center-key/rev-web-assets) &mdash;&nbsp; _Revision web asset filenames with cache busting content hash fingerprints_
   - 🚆 [`run-scripts-util`](https://github.com/center-key/run-scripts-util) &mdash;&nbsp; _Organize npm package.json scripts into groups of easy-to-manage commands_
   - 🚦 [`w3c-html-validator`](https://github.com/center-key/w3c-html-validator) &mdash;&nbsp; _Check the markup validity of HTML files using the W3C validator_
