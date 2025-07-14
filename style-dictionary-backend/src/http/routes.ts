import { FastifyInstance } from 'fastify';
import { uploadTokensController } from './controllers/upload-tokens.controller';
import { tokensController } from './controllers/tokens.controller';

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/upload-tokens', uploadTokensController);
  app.get('/tokens', tokensController);
};
