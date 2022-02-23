import { writeFile } from 'fs-extra'
import { join } from 'path'
import { getObjects } from './aws'
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
  console.log(`Found ${secrets.length} ${secrets.length === 1 ? 'secret' : 'secrets'}`)
  await secretsDirectory.ensure()
  await writeFile(join(secretsDirectory.path, '.gitignore'), '*')
  await Promise.all(secrets.map(secret => writeFile(join(secretsDirectory.path, secret.Key), secret.Body)))
}
