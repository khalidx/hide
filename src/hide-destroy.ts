import * as readline from 'readline'
import { getObjects, getParameterName, getBucketName, deleteBucketAndBucketContents, deleteParameter } from './aws'
import { secretsDirectory } from './fs'

/**
 * # hide
 * 
 * Deletes all stored secrets along with the AWS resources that `hide` uses.
 * 
 * ```sh
 * hide destroy
 * hide destroy --force
 * 
 */
export async function destroy (args: string[]) {
  const secrets = await getObjects()
  const bucket = await getBucketName()
  const parameter = getParameterName()
  console.log('This is a destructive operation. All your secrets will be deleted.')
  console.log('This operation will:')
  console.log(`- delete the local ${secretsDirectory.path} directory and all files in it`)
  console.log(`- delete the remote ${bucket} AWS S3 bucket and the ${secrets.length} secrets in it`)
  console.log(`- delete the remote ${parameter.Name} AWS SSM parameter`)
  if (!args.includes('--force')) {
    console.log('Are you sure you want to proceed?')
    await promptBucketName(bucket)
  }
  // delete everything
  await secretsDirectory.delete()
  await deleteBucketAndBucketContents(bucket)
  await deleteParameter(parameter.Name)
}

async function promptBucketName (expectedBucketName: string) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return await new Promise<void>((resolve, reject) => {
    rl.question('Type the AWS S3 bucket name (above) to continue:\n', async function (bucketName) {
      if (bucketName && bucketName === expectedBucketName) {
        resolve()
      } else {
        reject(new Error('Invalid bucket name. Doing nothing.'))
      }
    })
  }).finally(() => {
    rl.close()
  })
}
