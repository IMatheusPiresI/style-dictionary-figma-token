import fs from 'fs';
import { env } from '../config/env';
import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';

export interface UploadTokensForS3UseCaseRequest {
  filePath: string;
  key: string;
  platform: 'web' | 'mobile';
  contentType: 'text/css' | 'application/json';
}

export class UploadTokensForS3UseCase {
  private readonly s3Client: S3Client;

  constructor(s3Client: S3Client) {
    this.s3Client = s3Client;
  }

  async execute({ filePath, key, contentType }: UploadTokensForS3UseCaseRequest): Promise<void> {
    const fileContent = fs.readFileSync(filePath);

    const uploadParams: PutObjectCommandInput = {
      Bucket: env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(uploadParams);

    await this.s3Client.send(command);

    console.log(`✅ Arquivo enviado para o S3: ${key}`);
  }
}
