import { ensureDir, writeFile } from 'fs-extra'
import { join } from 'path'
import { getObjects } from './aws'
import { error } from './error'
import { secretsDirectory } from './fs'

/**
 * # hide show
 * 
 * Retrieves all secrets from the cloud, and decrypts them.
 * 
 * ```sh
 * hide show
 * ```
 */
export async function show () {
  const secrets = await getObjects()
  if (secrets.length === 0) throw error('Nothing to show. No secrets found.')
  await ensureDir(secretsDirectory())
  await writeFile(join(secretsDirectory(), '.gitignore'), '*')
  await Promise.all(secrets.map(secret => writeFile(join(secretsDirectory(), secret.Key), secret.Body)))
}
