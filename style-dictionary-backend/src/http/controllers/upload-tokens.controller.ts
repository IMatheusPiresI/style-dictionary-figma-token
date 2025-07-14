import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { BuildTokensUseCase } from '../../use-cases/build-tokens-use-case';
import { UploadTokensForS3UseCase } from '../../use-cases/upload-tokens-for-s3';
import { s3 } from '../../lib/s3';
import { ConvertFigmaTokensToDictionaryFormatUseCase } from '../../use-cases/convert-figma-tokens-to-dictionary-format';

export async function uploadTokensController(request: FastifyRequest, reply: FastifyReply) {
  const WEB_TOKEN_PATH = './src/style-dictionary/config/config.web.json';
  const MOBILE_TOKEN_PATH = './src/style-dictionary/config/config.mobile.json';
  const WEB_TOKEN_KEY = 'web/tokens.css';
  const MOBILE_TOKEN_KEY = 'mobile/tokens.json';
  const WEB_S3_TOKEN_PATH = 'dist/web/tokens.css';
  const MOBILE_S3_TOKEN_PATH = 'dist/mobile/tokens.json';

  try {
    const buildTokensUseCase = new BuildTokensUseCase(WEB_TOKEN_PATH, MOBILE_TOKEN_PATH);
    const uploadTokensForS3UseCase = new UploadTokensForS3UseCase(s3);
    const convertFigmaTokensToDictionaryFormatUseCase =
      new ConvertFigmaTokensToDictionaryFormatUseCase();

    await convertFigmaTokensToDictionaryFormatUseCase.execute();
    await buildTokensUseCase.execute();

    await uploadTokensForS3UseCase.execute({
      filePath: WEB_S3_TOKEN_PATH,
      key: WEB_TOKEN_KEY,
      platform: 'web',
      contentType: 'text/css',
    });

    await uploadTokensForS3UseCase.execute({
      filePath: MOBILE_S3_TOKEN_PATH,
      key: MOBILE_TOKEN_KEY,
      platform: 'mobile',
      contentType: 'application/json',
    });

    return reply.status(200).send({
      message: 'Tokens uploaded to S3',
    });
  } catch (err) {
    console.log(err);
    return reply.status(500).send({
      message: 'Internal server error',
    });
  }
}
