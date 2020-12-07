#!/usr/bin/env ts-node-script

import { hide, show, run } from './index'
import { ApplicationError, error } from './error'

async function cli (args: string[]) {
  const command = args.shift()
  if (command === undefined) return hide()
  if (command === 'show') return show()
  if (command === 'run') return run(args.join(' '))
  throw error('Invalid command')
}

cli(process.argv.slice(2)).catch(error => {
  if (error instanceof ApplicationError) console.error(error.message)
  else console.error(error)
  process.exit(1)
})