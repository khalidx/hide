#!/usr/bin/env node

import { hide, show, list, run, info, destroy } from './index'
import { error, isApplicationError } from './error'

async function cli (args: string[]) {
  const command = args.shift()
  if (command === undefined) return hide()
  if (command === 'show') return show()
  if (command === 'list') return list(args)
  if (command === 'run') return run(args.join(' '))
  if (command === 'info') return info()
  if (command === 'destroy') return destroy(args)
  throw error('Invalid command')
}

cli(process.argv.slice(2)).catch(error => {
  if (error instanceof ApplicationError) console.error(error.message)
  else console.error(error)
  process.exit(1)
})