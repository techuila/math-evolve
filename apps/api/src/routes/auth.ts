import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { loginSchema, type LoginInput, type TokenPayload } from '../schemas/auth.schema.js';
import { verifyLogin, getAdminUserById } from '../services/auth.service.js';
import { authMiddleware } from '../middleware/auth.js';

export async function authRoutes(app: FastifyInstance) {
  // POST /api/auth/login - Login endpoint
  app.post<{ Body: LoginInput }>(
    '/api/auth/login',
    async (request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) => {
      try {
        // Validate input
        const result = loginSchema.safeParse(request.body);
        if (!result.success) {
          return reply.code(400).send({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid input',
              details: result.error.flatten().fieldErrors,
            },
          });
        }

        const { username, password } = result.data;

        // Verify credentials
        const authResult = await verifyLogin(username, password);

        if (!authResult.success || !authResult.user) {
          return reply.code(401).send({
            success: false,
            error: {
              code: 'INVALID_CREDENTIALS',
              message: authResult.error || 'Invalid username or password',
            },
          });
        }

        // Generate JWT token
        const token = app.jwt.sign(
          {
            id: authResult.user.id,
            username: authResult.user.username,
            role: authResult.user.role,
          },
          { expiresIn: '7d' }
        );

        return reply.send({
          success: true,
          data: {
            token,
            user: authResult.user,
          },
        });
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An error occurred during login',
          },
        });
      }
    }
  );

  // GET /api/auth/me - Get current user
  app.get(
    '/api/auth/me',
    { preHandler: authMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const tokenUser = request.user as TokenPayload | undefined;
        if (!tokenUser) {
          return reply.code(401).send({
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Not authenticated',
            },
          });
        }

        const user = await getAdminUserById(tokenUser.id);

        if (!user) {
          return reply.code(404).send({
            success: false,
            error: {
              code: 'USER_NOT_FOUND',
              message: 'User not found',
            },
          });
        }

        return reply.send({
          success: true,
          data: { user },
        });
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An error occurred',
          },
        });
      }
    }
  );

  // POST /api/auth/logout - Logout (client-side token removal)
  app.post(
    '/api/auth/logout',
    { preHandler: authMiddleware },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      // JWT tokens are stateless, so logout is handled client-side
      // This endpoint just confirms the token was valid
      return reply.send({
        success: true,
        data: { message: 'Logged out successfully' },
      });
    }
  );

  // POST /api/auth/verify - Verify token validity
  app.post(
    '/api/auth/verify',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const token = request.headers.authorization?.replace('Bearer ', '');

        if (!token) {
          return reply.code(401).send({
            success: false,
            error: {
              code: 'NO_TOKEN',
              message: 'No token provided',
            },
          });
        }

        const decoded = await request.jwtVerify();

        return reply.send({
          success: true,
          data: { valid: true, payload: decoded },
        });
      } catch (error) {
        return reply.send({
          success: true,
          data: { valid: false },
        });
      }
    }
  );
}
