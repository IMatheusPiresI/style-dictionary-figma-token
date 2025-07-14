import { PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import { s3 } from '../lib/s3';
import { env } from '../config/env';

export async function uploadFileToS3(filePath: string, key: string) {
  const fileContent = fs.readFileSync(filePath);

  const uploadParams = {
    Bucket: env.AWS_S3_BUCKET_NAME!,
    Key: key, // ex: 'web/variables.css'
    Body: fileContent,
    ContentType: 'text/css', // ajuste conforme o arquivo
  };

  const command = new PutObjectCommand(uploadParams);

  await s3.send(command);

  console.log(`✅ Arquivo enviado para o S3: ${key}`);
}
