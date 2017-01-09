// CLABE Validator v0.0.1
// https://github.com/center-key/clabe-validator
// MIT License

var clabe = clabe || {};

clabe.validator = {
   check: function(clabeNum) {
      if (typeof clabeNum !== 'string')
         throw 'clabe.validator.check(clabeNum) -- Parameter must be a string';
      var bankCode = clabeNum.substr(0, 3);
      var cityCode = clabeNum.substr(3, 3);
      var checksum = parseInt(clabeNum.substr(17, 1));
      function makeCityMap() {
         clabe.city = {};
         function prefix(code) { return clabe.city[code] ? clabe.city[code] + ', ' : ''; }
         function addCity(city) { clabe.city[city[0]] = prefix(city[0]) + city[1]; }  //0: code, 1: name
         clabe.cities.forEach(addCity);
         }
      if (!clabe.city)
         makeCityMap();
      var bank = clabe.bank[parseInt(bankCode)];
      var city = clabe.city[parseInt(cityCode)];
      function calcCheckSum() {
         var sum = 0;
         var weights = [3,7,1];
         function add(digit, index) { sum += (parseInt(digit) * weights[index % 3]) % 10; }
         clabeNum.split('').slice(0, 17).forEach(add);
         return (10 - (sum % 10)) % 10;
         }
      function getErrorMessage() {
         return (
            clabeNum.length !== 18 ?       'Must be exactly 18 digits long' :
            !/[0-9]{18}/.test(clabeNum) ?  'Must be only numeric digits (no letters)' :
            calcCheckSum() !== checksum ?  'Invalid checksum, last digit should be: ' + calcCheckSum() :
            !bank ?                        'Invalid bank code' :
            !city ?                        'Invalid city code' :
            false
            );
         }
      var error = getErrorMessage();
      return {
         error:   !!error,
         message: error || 'Valid: ' + bank + ' (' + city + ')',
         bank:    bank,
         city:    city
         };
      },
   checkInput: function(elem) {
      var message = clabe.validator.check(elem.val()).message;
      elem.closest('form').find('.message').text(message).stop().hide().fadeIn();
      }
   };
