#!/usr/bin/env node
'use strict'

const path = require('path')
const fs = require('fs-extra')
const execa = require('execa')
const ora = require('ora')
const ms = require('ms')
const chalk = require('chalk')

const args = process.argv.slice(2)

const P_NAME = 'proj'

const proj = path.resolve(process.cwd(), P_NAME)
fs.removeSync(proj)

const help = () => `
  Usage:
    create-strv-app [template] [project-name]
`

const hasYarn = () => {
  try {
    execa.sync('yarnpkg', '--version')
    return true
  } catch (e) {
    return false
  }
}

const useYarn = hasYarn()

const install = async cwd => {
  const cmd = useYarn ? 'yarn' : 'npm'
  return await execa(cmd, ['install'], { cwd }).stdout.pipe(process.stdout)
}

const template = args[0]
const projectName = args[1]

const templatesPath = path.resolve(__dirname, '../templates')
const templatePath = path.resolve(templatesPath, template)
const projectPath = path.resolve(process.cwd(), projectName)

let spinner

const main = async () => {
  const start = Date.now()
  console.log()
  console.log('🕹  ', `Creating a new app in ${chalk.green(projectPath)}.\n`)

  await fs.copy(templatePath, projectName)
  const pkgPath = path.resolve(projectPath, 'package.json')
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'))

  const dependencies = Object.keys(pkg.dependencies)
    .map(dep => chalk.red(dep))
    .sort()
    .join(' ')

  const cmd = useYarn ? 'yarn' : 'npm'
  spinner = ora({
    text: ` Installing dependencies using ${cmd}, it can take a while.`,
    spinner: 'earth'
  }).start()
  await execa(cmd, ['install'], { cwd: projectPath })
  spinner.stopAndPersist({
    text: `Installed: ${dependencies}\n`,
    symbol: '🎉  '
  })
  console.log('⏱  ', `Done in ${ms(Date.now() - start)}`)

  const { scripts } = pkg
  const c = useYarn ? 'yarn' : 'npm run'
  console.log(`${chalk.green('Awesome!')}`, '\n')
  console.log(
    '🏃‍️  Change directory:',
    `\n ${chalk.blue(`cd ${projectName}`)}`,
    '\n'
  )
  console.log(
    '🤖  Start a local server for development:',
    `\n ${chalk.blue(`${c} start`)}`,
    '\n'
  )
  console.log(`💡  For more info about project setup visit:`)
  console.log(
    `${chalk.green(
      `https://github.com/prichodko/create-strv-app/tree/master/templates/${template}/readme.md`
    )}`,
    '\n'
  )
  console.log('❓  Questions? Feedback? Please let me know!')
  console.log(
    `${chalk.green('https://github.com/prichodko/create-strv-app/issues')}`,
    '\n'
  )
}

main().catch(err => {
  console.warn(err)
  spinner.fail('Something went wrong')
  process.exit(1)
})
