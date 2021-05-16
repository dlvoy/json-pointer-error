const JsonPointerError = require('./json-pointer-error')
const fs = require('fs')

const demoJSONPath = `${__dirname}/demo.json`
const demoJsonString = fs.readFileSync(demoJSONPath).toString()

new JsonPointerError().displayJsonParsingError(
  'Found some error in file:',
  demoJSONPath
)

const errorSource = new JsonPointerError().setSource(demoJsonString)

errorSource.displayErrorAtPointer(
  'this is not pointer at all',
  'Invalid JSON pointer'
)

errorSource.displayErrorAtPointer(
  '/0/balance',
  'Pointing at property "balance"'
)

errorSource.displayErrorAtPointer(
  '/2/about',
  'Pointing at property "about" - shortening output'
)

errorSource.displayErrorAtPointer(
  '/1/friends/2/name',
  'Pointing at deep property "name"'
)

errorSource.displayErrorAtPointer(
  '/4',
  'Pointing at whole root level object - shortening output'
)

errorSource.displayErrorAtPointer(
  '/3/friends/2',
  'Pointing at whole sub-object'
)

errorSource
  .setPlainConsole()
  .displayErrorAtPointer('/3/friends/2', 'Disabled colour output')

let myOutput = []

errorSource
  .setOutputHandler(line => myOutput.push(line))
  .displayErrorAtPointer('/3/friends/2', 'Custom output handler')

console.log(`Intercepted ${myOutput.length} lines of error log`)
console.log('==== ' + myOutput.join('\n==== '))
