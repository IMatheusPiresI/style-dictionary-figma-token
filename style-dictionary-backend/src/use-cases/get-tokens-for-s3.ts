import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface GetTokensForS3UseCaseRequest {
  key: string;
}

export interface GetTokensForS3UseCaseResponse {
  url: string;
}

export class GetTokensForS3UseCase {
  private readonly s3Client: S3Client;
  constructor(s3Client: S3Client) {
    this.s3Client = s3Client;
  }

  async execute({ key }: GetTokensForS3UseCaseRequest): Promise<GetTokensForS3UseCaseResponse> {
    const command = new GetObjectCommand({
      Bucket: 'dictionary-platform',
      Key: key,
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 900 });

    return { url };
  }
}
