### CLABE Validator

*JavaScript library to analyze a CLABE number for a Mexican bank account*

---
Current release: **v0.0.1**

Clave Bancaria Estandarizada (Spanish for "standardized banking cipher") is a banking
standard from the Mexican Bank Association (Asociación de Bancos de México &ndash; ABM) for
uniform numbering of bank accounts.

### 1. Online form

Try it out:<br>
[centerkey.com/clabe](http://centerkey.com/clabe/)

### 2. JavaScript usage

Include both `clabe.js` and `clabe-codes.js` (or just the minified `clabe.min.js`) in your project
and then pass the CLABE number as an 18-character string into `clabe.validator.check(clabeNum)`.

#### a) Example code
```javascript
var clabeNum = '002010077777777771';
var clabeCheck = clabe.validator.check(clabeNum);
```

#### b) Example result for valid CLABE number

```javascript
{
   bank: 'Banco Nacional de México',
   city: 'Aguascalientes'
}
```

#### c) Example result for invalid CLABE number

```javascript
{
   error:   true,
   message: 'Invalid city code'
}
```

#### d) Possible error messages

| Error message                            |
| ---------------------------------------- |
| Must be exactly 18 digits long           |
| Must be only numeric digits (no letters) |
| Invalid checksum                         |
| Invalid bank code                        |
| Invalid city code                        |

### Questions

Feel free to submit a questions at:<br>
https://github.com/center-key/clabe-validator/issues

===
CLABE Validator code is open source under the
[MIT license](https://github.com/center-key/clabe-validator/blob/master/LICENSE.txt),
and the documentation is published under the
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0) license.
