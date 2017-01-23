### CLABE Validator

*JavaScript library to analyze a CLABE number for a Mexican bank account*

---
Current release: **v0.0.3**

Clave Bancaria Estandarizada (Spanish for "standardized banking cipher") is a banking
standard from the Mexican Bank Association (Asociación de Bancos de México &ndash; ABM) for
uniform numbering of bank accounts.

### 1. Online form
Try it out:<br>
[centerkey.com/clabe](http://centerkey.com/clabe/)

### 2. Include
In a web page:
```html
<script src=clabe.js></script>
```

In a Node.js project:
```javascript
var clabe = require('./clabe.js');
```

### 3. Usage
Pass the CLABE number as an 18-character string into `clabe.validate(clabeNum)`.

#### a) Example JavaScript code
```javascript
var clabeNum = '002010077777777771';
var clabeCheck = clabe.validate(clabeNum);
console.log(clabeCheck.error ? '¡Muy mal!' : '¡Que bueno!');
```

#### b) Example JSON result for valid CLABE number
```javascript
{
   error: false,
   bank:  'Banco Nacional de México',
   city:  'Aguascalientes'
}
```

#### c) Example JSON result for invalid CLABE number
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

### 4. Questions
Feel free to submit a question at:<br>
[github.com/center-key/clabe-validator/issues](https://github.com/center-key/clabe-validator/issues)

===
CLABE Validator code is open source under the
[MIT license](https://github.com/center-key/clabe-validator/blob/master/LICENSE.txt),
and the documentation is published under the
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0) license.
