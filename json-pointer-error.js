const chalk = require('chalk')
const jsonMap = require('json-source-map')

class JsonPointerError {
  constructor(options = {}) {
    // from: https://github.com/chalk/ansi-regex/blob/main/index.js
    const pattern = [
      '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
      '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
    ].join('|')

    this.ansiRegex = new RegExp(pattern, 'g')

    this.skipMoreThan = options.skipMoreThan || 4
    this.skipMoreErrorThan = options.skipMoreErrorThan || 8
    this.setColorConsole()
    if (options.outputHanler) {
      this.onOutputLine = line => {
        options.outputHanler(stripAnsi(line))
      }
    }
  }

  // from: https://github.com/chalk/strip-ansi
  stripAnsi(txt) {
    return txt.replace(this.ansiRegex, '')
  }

  setColorConsole() {
    this.onOutputLine = line => {
      console.log(line)
    }
    return this
  }

  setPlainConsole() {
    this.onOutputLine = line => {
      console.log(this.stripAnsi(line))
    }
    return this
  }

  setOutputHandler(handler) {
    this.onOutputLine = line => {
      handler(this.stripAnsi(line))
    }
    return this
  }

  setSource(sourceCode) {
    this.sourceCode = sourceCode
    this.dataStrLines = sourceCode.split('\n')
    this.mapped = jsonMap.parse(sourceCode)
    // console.log('Pointers:', mapped.pointers)
    return this
  }

  padDigits(value, len) {
    const data = `${value}`
    return ' '.repeat(len).substring(0, len - data.length) + data
  }

  log(message) {
    this.onOutputLine(message)
  }

  displayJsonParsingError(message, fileName) {
    this.onOutputLine(
      chalk.red(
        '+--------------------------------------------------------------------------'
      )
    )
    this.onOutputLine(chalk.red('| ') + message)
    this.onOutputLine(chalk.red('| ') + chalk.blue(fileName))
    this.onOutputLine(
      chalk.red(
        '+--------------------------------------------------------------------------'
      )
    )

    return this
  }

  displayErrorAtPointer(errorJsonPointer, errorMessage = false) {
    const place = this.mapped.pointers[errorJsonPointer]

    if (errorMessage) {
      this.onOutputLine(
        chalk.red(
          '+--------------------------------------------------------------------------'
        )
      )
      this.onOutputLine(chalk.red('| ') + errorMessage)
      this.onOutputLine(
        chalk.red(
          '+--------------------------------------------------------------------------'
        )
      )
    }
    if (place) {
      let fullPath = errorJsonPointer.split('/')
      fullPath.pop()
      const parent = fullPath.join('/')
      const parentPlace = this.mapped.pointers[parent]

      let errorStart = this.dataStrLines.length
      let errorEnd = 0

      const firstLine = parentPlace.value.line
      const lastLine = parentPlace.valueEnd.line

      const digitsWidth = Math.max(`${firstLine}`.length, `${lastLine}`.length)

      if (place.key) errorStart = Math.min(errorStart, place.key.line)
      if (place.value) errorStart = Math.min(errorStart, place.value.line)
      if (place.keyEnd) errorEnd = Math.max(errorEnd, place.keyEnd.line)
      if (place.valueEnd) errorEnd = Math.max(errorEnd, place.valueEnd.line)

      let topSkipStart = this.dataStrLines.length + 1
      let topSkipEnd = -1
      let bottomSkip = this.dataStrLines.length + 1

      // prettier-ignore
      if (errorStart - firstLine >  1 + this.skipMoreThan * 2) {
        topSkipStart = firstLine + this.skipMoreThan;
        topSkipEnd = errorStart - this.skipMoreThan;
      }

      if (lastLine - errorEnd > this.skipMoreThan) {
        bottomSkip = errorEnd + this.skipMoreThan
      }

      let errorSkipStart = this.dataStrLines.length + 1
      let errorSkipEnd = -1
      if (errorEnd - errorStart > 1 + this.skipMoreErrorThan * 2) {
        errorSkipStart = errorStart + this.skipMoreErrorThan
        errorSkipEnd = errorEnd - this.skipMoreErrorThan
      }

      for (let lineNo = firstLine; lineNo <= lastLine; lineNo++) {
        if (lineNo == topSkipStart) {
          this.onOutputLine(
            chalk.gray('              '.substring(0, digitsWidth - 1)) +
              chalk.gray('............'.substring(0, digitsWidth)) +
              '   ' +
              chalk.yellow('-- // --')
          )
        }
        if (
          (lineNo >= topSkipStart && lineNo < topSkipEnd) ||
          lineNo > bottomSkip
        ) {
          continue
        }
        if (lineNo < errorStart || lineNo > errorEnd) {
          this.onOutputLine(
            chalk.gray('  ') +
              chalk.gray(this.padDigits(lineNo, digitsWidth)) +
              chalk.gray(' | ') +
              chalk.white(this.dataStrLines[lineNo])
          )
        } else {
          if (lineNo == errorSkipStart) {
            this.onOutputLine(
              chalk.gray('              '.substring(0, digitsWidth - 1)) +
                chalk.gray('............'.substring(0, digitsWidth))
            )
          }

          if (lineNo >= errorSkipStart && lineNo < errorSkipEnd) {
            continue
          }

          this.onOutputLine(
            chalk.red.bold('> ') +
              chalk.red.bold(this.padDigits(lineNo, digitsWidth)) +
              chalk.gray(' | ') +
              chalk.red(this.dataStrLines[lineNo])
          )
        }
      }
    } else {
      this.onOutputLine(
        chalk.red('cannot find pointer ') +
          chalk.red.bold(errorJsonPointer) +
          chalk.red(' in sourcecode')
      )
    }

    return this
  }
}

module.exports = JsonPointerError
