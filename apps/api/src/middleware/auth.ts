import { FastifyRequest, FastifyReply } from 'fastify';
import type { TokenPayload } from '../schemas/auth.schema.js';

// Extend FastifyRequest to add typed user property
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: TokenPayload;
    user: TokenPayload;
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return reply.code(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    await request.jwtVerify();
  } catch {
    return reply.code(401).send({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      },
    });
  }
}

export async function adminOnlyMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await authMiddleware(request, reply);

  if (reply.sent) return;

  const user = request.user as TokenPayload;
  if (user?.role !== 'admin') {
    return reply.code(403).send({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Admin access required',
      },
    });
  }
}
