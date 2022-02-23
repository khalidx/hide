import { resolve } from 'path'
import { getObjects, getBucketName, getParameterName } from './aws'
import { secretsDirectory } from './fs'

/**
 * # hide info
 * 
 * Shows metadata that `hide` uses, like the local secrets directory and the remote S3 bucket.
 * 
 * ```sh
 * hide info
 * ```
 */
export async function info () {
  const secrets = await getObjects()
  console.log({
    hide: {
      secretsCount: secrets.length,
      secretsDirectory: resolve(secretsDirectory.path),
      ssmParameter: getParameterName().Name,
      s3Bucket: await getBucketName()
    }
  })
}
