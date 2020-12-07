import * as globby from 'globby'
import { basename } from 'path'
import { readFile, remove } from 'fs-extra'
import { error } from './error'
import { putObjects } from './aws'
import { secretsDirectory } from './fs'

/**
 * # hide
 * 
 * Encrypts and backs up all secret files to the cloud, and removes them.
 * 
 * ```sh
 * hide
 * ```
 */
export async function hide () {
  const secrets = await globby(['.secrets/*', '!.secrets/.gitignore'])
  if (secrets.length === 0) throw error(`No files found in ${secretsDirectory()}`)
  await putObjects(secrets.map(secret => ({ Key: basename(secret), Body: readFile(secret, 'utf-8') })))
  await remove(secretsDirectory())
}
