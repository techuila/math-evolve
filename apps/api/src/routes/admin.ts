import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authMiddleware } from '../middleware/auth.js';
import { getDashboardStats, getAllStudentResults } from '../services/admin.service.js';
import { exportToCSV, exportToJSON } from '../services/export.service.js';

export async function adminRoutes(app: FastifyInstance) {
  // All admin routes require authentication
  app.addHook('preHandler', authMiddleware);

  // GET /api/admin/stats - Get dashboard statistics
  app.get('/api/admin/stats', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const stats = await getDashboardStats();

      return reply.send({
        success: true,
        data: { stats },
      });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch dashboard stats',
        },
      });
    }
  });

  // GET /api/admin/results - Get all student results
  app.get('/api/admin/results', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const results = await getAllStudentResults();

      return reply.send({
        success: true,
        data: { results },
      });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch results',
        },
      });
    }
  });

  // GET /api/admin/export/csv - Export results as CSV
  app.get('/api/admin/export/csv', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await exportToCSV();

      if (!result.success || !result.data) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'EXPORT_ERROR',
            message: result.error || 'Failed to export data',
          },
        });
      }

      reply.header('Content-Type', result.contentType || 'text/csv');
      reply.header('Content-Disposition', `attachment; filename="${result.filename}"`);

      return reply.send(result.data);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to export data',
        },
      });
    }
  });

  // GET /api/admin/export/json - Export results as JSON
  app.get('/api/admin/export/json', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await exportToJSON();

      if (!result.success || !result.data) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'EXPORT_ERROR',
            message: result.error || 'Failed to export data',
          },
        });
      }

      reply.header('Content-Type', result.contentType || 'application/json');
      reply.header('Content-Disposition', `attachment; filename="${result.filename}"`);

      return reply.send(result.data);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to export data',
        },
      });
    }
  });
}
