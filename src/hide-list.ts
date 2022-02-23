import { getObjects } from './aws'

/**
 * # hide list
 * 
 * Retrieves all secrets from the cloud, decrypts them, and lists them on the terminal.
 * 
 * ```sh
 * hide list
 * hide list --json
 * hide list --count
 * ```
 */
export async function list (args: string[]) {
  const secrets = await getObjects()
  const env = secrets.reduce<{ [key: string]: string }>((env, secret) => {
    env[secret.Key] = String(secret.Body)
    return env
  }, {})
  if (args.includes('--json')) {
    console.log(env)
  } else if (args.includes('--count')) {
    console.log(`Found ${secrets.length} ${secrets.length === 1 ? 'secret' : 'secrets'}`)
  } else {
    Object.entries(env).forEach((entry, index) => {
      console.log(`${index + 1} | ${entry[0]}: ${JSON.stringify(entry[1])}`)
    })
  }
}