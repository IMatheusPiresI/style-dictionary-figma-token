import Fastify from 'fastify';
import { env } from './config/env';

export const app = Fastify({ logger: true });
