# node-mongoose-validator

[![Build Status](https://travis-ci.org/SamVerschueren/node-mongoose-validator.svg)](https://travis-ci.org/SamVerschueren/node-mongoose-validator)
[![Dependency Status](https://david-dm.org/samverschueren/node-mongoose-validator.svg)](https://david-dm.org/samverschueren/node-mongoose-validator)
[![devDependency Status](https://david-dm.org/samverschueren/node-mongoose-validator/dev-status.svg)](https://david-dm.org/samverschueren/node-mongoose-validator#info=devDependencies)

A library for mongoose schema path validations.

## Installation

```bash
npm install node-mongoose-validator
```

## Usage

The validation library can be used an a couple of different ways. The first way is by adding a validator for each path as you can see in the snippet below.

```JavaScript
var mongoose = require('mongoose'),
    validator = require('node-mongoose-validator');

var Schema = mongoose.Schema;

UserSchema = new Schema({
    name:       {type: String, required: true},
    email:      {type: String, required: true}
});

// Validations
UserSchema.path('name').validate(validator.notEmpty(), 'Please provide a name.');
UserSchema.path('email').validate(validator.isEmail(), 'Please provide a valid email address');

mongoose.model('User', UserSchema);
```

Instead of creating a validator function, it is also possible to create a validator object by adding a ```$``` in front of the method name.

```JavaScript
UserSchema.path('name').validate(validator.$notEmpty());
UserSchema.path('email').validate(validator.$isEmail());
```

If you want to change the error message by using this way of validating the path, you can add an extra option object.

```JavaScript
UserSchema.path('name').validate(validator.$notEmpty({msg: 'Please provide a name.'}));
UserSchema.path('email').validate(validator.$isEmail({msg: 'Please provide a valid email address'}));
```

A third way of validating a property is by adding a validator object directly in the schema.

```JavaScript
UserSchema = new Schema({
    name:       {type: String, required: true, validate: validator.$notEmpty({msg: 'Please provide a name.'})},
    email:      {type: String, required: true: validate: validator.$isEmail()}
});
```

## Validators

This library uses the [validator](https://github.com/chriso/validator.js) library. So all the methods used over there can be used to validate mongoose properties.

- **equals(comparison)** - check if the string matches the comparison.
- **contains(seed)** - check if the string contains the seed.
- **matches(pattern [, modifiers])** - check if string matches the pattern. Either `matches('foo', /foo/i)` or `matches('foo', 'foo', 'i')`.
- **isEmail([options])** - check if the string is an email. `options` is an object which defaults to `{ allow_display_name: false }`. If `allow_display_name` is set to true, the validator will also match `Display Name <email-address>`.
- **isURL([options])** - check if the string is an URL. `options` is an object which defaults to `{ protocols: ['http','https','ftp'], require_tld: true, require_protocol: false, allow_underscores: false, host_whitelist: false, host_blacklist: false, allow_trailing_dot: false, allow_protocol_relative_urls: false }`.
- **isFQDN([options])** - check if the string is a fully qualified domain name (e.g. domain.com). `options` is an object which defaults to `{ require_tld: true, allow_underscores: false, allow_trailing_dot: false }`.
- **isIP([version])** - check if the string is an IP (version 4 or 6).
- **isAlpha()** - check if the string contains only letters (a-zA-Z).
- **isNumeric()** - check if the string contains only numbers.
- **isAlphanumeric()** - check if the string contains only letters and numbers.
- **isBase64()** - check if a string is base64 encoded.
- **isHexadecimal()** - check if the string is a hexadecimal number.
- **isHexColor()** - check if the string is a hexadecimal color.
- **isLowercase()** - check if the string is lowercase.
- **isUppercase()** - check if the string is uppercase.
- **isInt()** - check if the string is an integer.
- **isFloat()** - check if the string is a float.
- **isDivisibleBy(number)** - check if the string is a number that's divisible by another.
- **isNull()** - check if the string is null.
- **isLength(min [, max])** - check if the string's length falls in a range. Note: this function takes into account surrogate pairs.
- **isByteLength(min [, max])** - check if the string's length (in bytes) falls in a range.
- **isUUID([version])** - check if the string is a UUID (version 3, 4 or 5).
- **isDate()** - check if the string is a date.
- **isAfter([date])** - check if the string is a date that's after the specified date (defaults to now).
- **isBefore([date])** - check if the string is a date that's before the specified date.
- **isIn(values)** - check if the string is in a array of allowed values.
- **isCreditCard()** - check if the string is a credit card.
- **isISBN([version])** - check if the string is an ISBN (version 10 or 13).
- **isMobilePhone(locale)** - check if the string is a mobile phone number, (locale is one of `['zh-CN', 'en-ZA', 'en-AU', 'en-HK', 'pt-PT', 'fr-FR', 'el-GR']`).
- **isJSON()** - check if the string is valid JSON (note: uses JSON.parse).
- **isMultibyte()** - check if the string contains one or more multibyte chars.
- **isAscii()** - check if the string contains ASCII chars only.
- **isFullWidth()** - check if the string contains any full-width chars.
- **isHalfWidth()** - check if the string contains any half-width chars.
- **isVariableWidth()** - check if the string contains a mixture of full and half-width chars.
- **isSurrogatePair()** - check if the string contains any surrogate pairs chars.
- **isMongoId()** - check if the string is a valid hex-encoded representation of a [MongoDB ObjectId](http://docs.mongodb.org/manual/reference/object-id/).

There are extra validators added that can come in handy.

- **notEmpty()** - check if the string at least has a length of 1.
- **in(arr)** - check if the string is present in the array.

### Extending

You can add your own validators as well by extending the validators.

```JavaScript
validator.extend('isArray', function(arg) {
    return Array.isArray(arg);
});
```

This will create a ```isArray()``` and a ```$isArray()``` validator for you to use.

## Tests

Running the tests is as simple as

```
npm test
```

## Release notes

Should add more tests in the near future.

## Contributors

- Sam Verschueren [<sam.verschueren@gmail.com>]

## License (MIT)

```
Copyright (c) 2015 Sam Verschueren <sam.verschueren@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
