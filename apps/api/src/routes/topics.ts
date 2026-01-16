import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  getAllTopics,
  getTopicById,
  getTopicBySlug,
  getContentByTopicId,
} from '../services/content.service.js';

export async function topicRoutes(app: FastifyInstance) {
  // GET /api/topics - List all topics
  app.get('/api/topics', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const topics = await getAllTopics();

      return reply.send({
        success: true,
        data: { topics },
      });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch topics',
        },
      });
    }
  });

  // GET /api/topics/:id - Get topic by ID
  app.get<{ Params: { id: string } }>(
    '/api/topics/:id',
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { id } = request.params;

        // Try to find by ID first, then by slug
        let topic = await getTopicById(id);
        if (!topic) {
          topic = await getTopicBySlug(id);
        }

        if (!topic) {
          return reply.code(404).send({
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Topic not found',
            },
          });
        }

        return reply.send({
          success: true,
          data: { topic },
        });
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to fetch topic',
          },
        });
      }
    }
  );

  // GET /api/topics/:id/content - Get content for a topic
  app.get<{ Params: { id: string } }>(
    '/api/topics/:id/content',
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { id } = request.params;

        // Try to find topic by ID first, then by slug
        let topic = await getTopicById(id);
        if (!topic) {
          topic = await getTopicBySlug(id);
        }

        if (!topic) {
          return reply.code(404).send({
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Topic not found',
            },
          });
        }

        const content = await getContentByTopicId(topic.id);

        return reply.send({
          success: true,
          data: {
            topic,
            content,
          },
        });
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to fetch content',
          },
        });
      }
    }
  );
}
