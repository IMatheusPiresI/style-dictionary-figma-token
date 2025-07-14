import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { GetTokensForS3UseCase } from '../../use-cases/get-tokens-for-s3';
import { s3 } from '../../lib/s3';

export async function tokensController(request: FastifyRequest, reply: FastifyReply) {
  const WEB_TOKEN_KEY = 'web/tokens.css';
  const MOBILE_TOKEN_KEY = 'mobile/tokens.json';
  const query = request.query;

  const tokensSchema = z.object({
    platform: z.enum(['web', 'mobile']),
  });

  const { platform } = tokensSchema.parse(query);

  try {
    const getTokensForS3UseCase = new GetTokensForS3UseCase(s3);

    const { url } = await getTokensForS3UseCase.execute({
      key: platform === 'web' ? WEB_TOKEN_KEY : MOBILE_TOKEN_KEY,
    });

    return reply.status(200).send({
      url,
    });
  } catch (err) {
    console.log(err);
    return reply.status(500).send({
      message: 'Internal server error',
    });
  }
}
