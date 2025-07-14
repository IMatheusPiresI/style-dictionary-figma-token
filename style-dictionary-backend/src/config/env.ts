import 'dotenv/config';

export const env = {
  AWS_REGION: process.env.AWS_REGION!,
  AWS_S3_ACCESS_KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID!,
  AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME!,
};
