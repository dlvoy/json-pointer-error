# json-pointer-error

Highligts error in JSON file pointed by given JSON Pointer (RFC 6901)

This utility is usefull to higlight errors inside JSON file, when error location is given as JSON Pointer. It can be used together with tools like [ajv](https://ajv.js.org/) to parse and match JSON against schema, and display validation errors in more human-frendly maner

```
+-----------------------------------------------------------
| Property "name" is invalid!
+-----------------------------------------------------------
  83 |       {
  84 |         "id": 2,
> 85 |         "name": "Perez Hunt"
  86 |       }
```

## Installation

[node.js](http://nodejs.org)

```bash
$ npm install json-pointer-error
```

## Examples & Demo

All examples are in `demo.js` file

You can run that demo with command:

```bash
$ npm run demo
```

## API

```Javascript
const JsonPointerError = require('json-pointer-error')

const errorSource = new JsonPointerError()
        .setSource('[\n{\n"field1":"ok",\n"field2":"error"\n}\n]')
        .displayErrorAtPointer('/0/field2', 'this field is invalid')
```

Each method in JsonPointerError return `this` to allow method chaining

### .setSource(string)

Sets referenced JSON string and preprocess it (parses and maps all JSON pointers inside)
Call this before `displayErrorAtPointer` to set referenced JSON

### .displayErrorAtPointer(jsonPointerString, errorMessage)

Display error message from `errorMessage` pointing at part of JSON pointed with given `jsonPointerString`

### .displayJsonParsingError(errorMessage, filePath)

Display header usefull for JSON parsing errors, with error message from `errorMessage` and line pointing at JSON file as given by `filePath`

## Acknowledgments

Demo JSON data generated with: https://www.json-generator.com

## License

This software is licensed under MIT license:

Copyright 2021 Dominik Dzienia (dominik.dzienia@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
