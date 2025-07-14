import fastifyStatic from '@fastify/static';
import { app } from './app';
import { appRoutes } from './http/routes';
import path from 'path';
import fastifyCors from '@fastify/cors';

app.register(fastifyCors);

app.register(appRoutes, { prefix: '/api/v1' });

app.register(fastifyStatic, {
  root: path.resolve('/Users/mathz/Desktop/poc/style-dictionary-backend/dist/web'),
  prefix: '/cdn/', // url base: http://localhost:3000/cdn/
});

app.listen({ port: 3000 }).then(() => {
  console.log('🚀 Server rodando em http://localhost:3000');
});
