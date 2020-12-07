import { execSync } from 'child_process'
import { getObjects } from './aws'

/**
 * # hide run
 * 
 * Retrieves all secrets from the cloud, and decrypts them.
 * 
 * It spawns a shell to run the provided command with all secrets provided as environment variables.
 * 
 * If any output from the command contains a secret value, it is cleared from the logs.
 * 
 * ```sh
 * hide run env
 * ```
 */
export async function run (command: string) {
  const secrets = await getObjects()
  const env = secrets.reduce<{ [key: string]: string }>((env, secret) => {
    env[secret.Key] = String(secret.Body)
    return env
  }, {})
  execSync(command, {
    stdio: 'inherit',
    env: {
      HIDE: '1',
      ...env
    }
  })
}