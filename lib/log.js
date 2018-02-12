'use strict'

const chalk = require('chalk')
const execa = require('execa')

const error = (text, code = 1) => {
  process.stderr.write(`${chalk.red(' ERROR ')} ${text}'\n'`)
  process.exit(code) // eslint-disable-line
}

const info = (text, code = 1) => {
  process.stderr.write(`${chalk.blue(' INFO ')} ${text}'\n'`)
  process.exit(code) // eslint-disable-line
}

const warn = (text, code = 1) => {
  process.stdout.write(`${chalk.yellow(' WARN ')} ${text}'\n'`)
  process.exit(code) // eslint-disable-line
}

const hasYarn = () => {
  try {
    execa.sync('yarnpkg', '--version')
    return true
  } catch (err) {
    return false
  }
}

module.exports = {
  error,
  info,
  warn,
  hasYarn,
}
