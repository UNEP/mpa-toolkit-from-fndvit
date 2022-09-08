import crypto from 'crypto';
import { S3 } from '@aws-sdk/client-s3';
import { logger } from '@mpa/log';
import mime from 'mime-types';
import { env } from '$lib/env';

const log = logger('S3');

const region = env.AWS_REGION ?? 'eu-west-1';

if (!env.AWS_REGION) {
  log.warn(`AWS_REGION is not set. Defaulting to ${region}`);
}

const s3 = new S3({ region });

const fileToHash = async (file: File): Promise<string> => {
  const hash = crypto.createHash('sha256');
  const buf = await file.arrayBuffer();
  hash.update(Buffer.from(buf));
  return hash.digest('hex');
};

const doesKeyExist = async (key: string): Promise<boolean> => {
  return s3
    .headObject({
      Bucket: env.AWS_S3_UPLOAD_BUCKET,
      Key: key
    })
    .then(() => true)
    .catch(() => false);
};

export async function uploadAsset(file: File, dir = 'assets'): Promise<string> {
  const hash = await fileToHash(file);
  const mimeExt = mime.extension(file.type);
  const filenameHasExt = file.name.includes('.');
  const ext = mimeExt === 'bin' && filenameHasExt ? file.name.split('.').pop() : mimeExt;
  const key = `${dir}/${hash}.${ext}`;
  if (await doesKeyExist(key)) {
    log.info(`File already exists: ${key}`);
  } else {
    const filesize = Math.round(file.size / 1000).toLocaleString();
    log.info(`Uploading file to s3: ${env.AWS_S3_UPLOAD_BUCKET} ${key} (${filesize} KB)`);
    await s3.putObject({
      Bucket: env.AWS_S3_UPLOAD_BUCKET,
      Key: key,

      Body: Buffer.from(await file.arrayBuffer()),
      CacheControl: 'max-age=31536000',
      ContentType: file.type
    });
    log.info('Uploaded successfully');
  }
  return key;
}
