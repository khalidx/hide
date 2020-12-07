import { SSM, S3 } from 'aws-sdk'
import { v4 as uuid } from 'uuid'
import { error } from './error'

const ssm = new SSM()
const s3 = new S3()

export async function putObjects (objects: Array<{ Key: string, Body: Promise<string> }>) {
  const Bucket = await getOrCreateBucketName()
  return Promise.all(objects.map(async object => s3.putObject({ Bucket, Key: object.Key, Body: await object.Body }).promise()))
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
      s3.createBucket({ Bucket: name }).promise(),
      ssm.putParameter({ ...getParameterName(), Value: name, Type: 'String' }).promise()
    ])
    return name
  }
}

async function getBucketName () {
  return getParameterValue()
}

async function getParameterValue () {
  const parameterName = getParameterName()
  const parameter = await ssm.getParameter(parameterName).promise()
  const value = parameter.Parameter?.Value
  if (!value) throw error(`Missing AWS SSM parameter value for ${parameterName}`)
  return value
}

function getParameterName () {
  return { Name: '/hide/bucket' }
}
