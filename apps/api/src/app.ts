import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import { authRoutes } from './routes/auth';
import { studentRoutes } from './routes/students';
import { topicRoutes } from './routes/topics';
import { quizRoutes } from './routes/quizzes';
import { testRoutes } from './routes/tests';
import { adminRoutes } from './routes/admin';

export async function createApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Security plugins
  await app.register(helmet);

  // CORS
  await app.register(cors, {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
    credentials: true,
  });

  // Rate limiting
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '15 minutes',
  });

  // JWT
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'change-this-secret-in-production',
  });

  // Health check
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API routes
  app.get('/api', async () => {
    return {
      name: 'MATHEVOLVE API',
      version: '1.0.0',
      status: 'running',
    };
  });

  // Register routes
  await app.register(authRoutes);
  await app.register(studentRoutes);
  await app.register(topicRoutes);
  await app.register(quizRoutes);
  await app.register(testRoutes);
  await app.register(adminRoutes);

  // 404 handler
  app.setNotFoundHandler((_request, reply) => {
    reply.code(404).send({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    });
  });

  // Error handler
  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);

    const err = error as { statusCode?: number; code?: string; message?: string };
    reply.code(err.statusCode || 500).send({
      success: false,
      error: {
        code: err.code || 'INTERNAL_ERROR',
        message: err.message || 'An unexpected error occurred',
      },
    });
  });

  return app;
}
