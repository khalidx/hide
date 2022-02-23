import { basename } from 'path'
import { readFile } from 'fs-extra'
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
  const secrets = await secretsDirectory.list()
  if (secrets.length === 0) throw error(`No files found in ${secretsDirectory.path}`)
  await putObjects(secrets.map(secret => ({ Key: basename(secret), Body: readFile(secret, 'utf-8') })))
  await secretsDirectory.delete()
}
