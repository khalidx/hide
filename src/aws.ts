import { SSM, S3 } from 'aws-sdk'
import { v4 as uuid } from 'uuid'
import { error } from './error'

const ssm = new SSM()
const s3 = new S3()

export async function putObjects (objects: Array<{ Key: string, Body: Promise<string> }>) {
  const Bucket = await getOrCreateBucketName()
  return Promise.all(objects.map(async object => s3.putObject({
    Bucket,
    Key: object.Key,
    Body: await object.Body,
    ServerSideEncryption: 'AES256',
    BucketKeyEnabled: true
  }).promise()))
}

export async function getObjects () {
  const Bucket = await getBucketName()
  const objects = (await s3.listObjectsV2({ Bucket }).promise()).Contents || []
  return Promise.all(objects.map(async object => ({
    Key: object.Key!,
    Body: (await s3.getObject({ Bucket, Key: object.Key! }).promise()).Body
  })))
}

async function getOrCreateBucketName () {
  try {
    return await getBucketName()
  } catch (error) {
    if (error.code !== 'ParameterNotFound') throw error
    const name = `hide-bucket-${uuid()}`
    await Promise.all([
      s3.createBucket({ Bucket: name, ACL: 'private' }).promise(),
      ssm.putParameter({ ...getParameterName(), Value: name, Type: 'String' }).promise()
    ])
    await s3.putPublicAccessBlock({
      Bucket: name,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true
      }
    }).promise()
    await s3.putBucketEncryption({
      Bucket: name,
      ServerSideEncryptionConfiguration: {
        Rules: [
          {
            BucketKeyEnabled: true,
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: 'AES256'
            }
          }
        ]
      }
    }).promise()
    await s3.putBucketPolicy({
      Bucket: name,
      Policy: JSON.stringify({
        "Version": "2012-10-17",
        "Id": "PutObjectPolicy",
        "Statement": [
          {
            "Sid": "DenyIncorrectEncryptionHeader",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:PutObject",
            "Resource": `arn:aws:s3:::${name}/*`,
            "Condition": {
              "StringNotEquals": {
                "s3:x-amz-server-side-encryption": "AES256"
              }
            }
          },
          {
            "Sid": "DenyUnencryptedObjectUploads",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:PutObject",
            "Resource": `arn:aws:s3:::${name}/*`,
            "Condition": {
              "Null": {
                "s3:x-amz-server-side-encryption": "true"
              }
            }
          }
        ]
      })
    }).promise()
    await s3.putBucketVersioning({
      Bucket: name,
      VersioningConfiguration: {
        Status: 'Enabled'
      }
    }).promise()
    return name
  }
}

export async function getBucketName () {
  return getParameterValue()
}

async function getParameterValue () {
  const parameterName = getParameterName()
  const parameter = await ssm.getParameter(parameterName).promise()
  const value = parameter.Parameter?.Value
  if (!value) throw error(`Missing AWS SSM parameter value for ${parameterName}`)
  return value
}

export function getParameterName () {
  return { Name: '/hide/bucket' }
}

export async function deleteBucketAndBucketContents (name: string) {
  const versions = await s3.listObjectVersions({ Bucket: name }).promise()
  await Promise.all((versions.Versions || []).concat(versions.DeleteMarkers || []).map(version => {
    return (version.Key && version.VersionId)
      ? s3.deleteObject({ Bucket: name, Key: version.Key, VersionId: version.VersionId }).promise()
      : undefined
  }))
  return await s3.deleteBucket({ Bucket: name }).promise()
}

export async function deleteParameter (name: string) {
  return await ssm.deleteParameter({ Name: name }).promise()
}
