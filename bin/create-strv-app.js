#!/usr/bin/env node
'use strict'

const args = require('args')
const path = require('path')
const fs = require('fs-extra')
const execa = require('execa')
const ora = require('ora')
const { prompt } = require('inquirer')
const ms = require('ms')
const chalk = require('chalk')

const { hasYarn, error } = require('../lib/log')

args
  .option('npm', 'Use npm to install dependencies', false)
  .example(
    'create-strv-app next my-awesome-app',
    'Create app based on Next.js template'
  )
  .example('create-strv-app list', 'List all available templates')

const flags = args.parse(process.argv, {
  name: 'create-strv-app',
  value: '<template> <name>',
})

const main = async () => {
  const start = Date.now()
  let template = args.sub[0] && args.sub[0].toLowerCase()
  let projectName = args.sub[1]

  const templatesPath = path.resolve(__dirname, '../templates')
  const dir = await fs.readdir(templatesPath)
  const templates = dir
    .filter(tmp => tmp !== 'config')
    .map(tmp => (tmp === 'cra' ? tmp.toUpperCase() : tmp))

  if (!template) {
    const res = await prompt({
      type: 'list',
      name: 'template',
      message: 'Choose a template:',
      choices: templates,
    })

    template = res.template
  }

  if (!templates.includes(template)) {
    return error("Template doesn't exists")
  }

  if (!projectName) {
    const res = await prompt({
      name: 'projectName',
      message: 'Enter you project name',
    })

    projectName = res.projectName
  }

  const templatePath = path.resolve(templatesPath, template)
  const configPath = path.resolve(__dirname, '../templates/config')
  const projectPath = path.resolve(process.cwd(), projectName)

  if (fs.existsSync(projectPath)) {
    return error('Directory already exists')
  }

  let spinner = ora(`Creating project in ${chalk.blue(projectPath)}`).start()

  await fs.copy(templatePath, projectPath)
  await fs.copy(configPath, projectPath)

  spinner.succeed(`Project created in ${chalk.blue(projectPath)}`)

  spinner = ora({
    text: 'Installing dependencies, it can take a while.',
    spinner: 'earth',
  }).start()

  const cmd = hasYarn() && !flags.npm ? 'yarn' : 'npm'
  await execa(cmd, ['install'], { cwd: projectPath })

  spinner.succeed(`Installed in ${ms(Date.now() - start)} ⏱`)

  console.log('💡 For more info about project setup visit README', '\n')
  console.log('❓ Questions? Feedback? Please let me know!')
  console.log(
    `${chalk.green('https://github.com/prichodko/create-strv-app/issues')}`,
    '\n'
  )
}

main().catch(err => error(err))
