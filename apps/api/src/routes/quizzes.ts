import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import {
  getQuizByTopicId,
  getQuizById,
  submitQuizAttempt,
  getStudentQuizAttempts,
} from '../services/quiz.service.js';
import { getStudentById } from '../services/student.service.js';
import type { Answer } from '@mathevolve/types';

const submitQuizSchema = z.object({
  studentId: z.string().uuid(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
    })
  ),
  timeTaken: z.number().optional(),
});

type SubmitQuizInput = z.infer<typeof submitQuizSchema>;

export async function quizRoutes(app: FastifyInstance) {
  // GET /api/quizzes/topic/:topicId - Get quiz for a topic
  app.get<{ Params: { topicId: string } }>(
    '/api/quizzes/topic/:topicId',
    async (
      request: FastifyRequest<{ Params: { topicId: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { topicId } = request.params;

        const quiz = await getQuizByTopicId(topicId);

        if (!quiz) {
          return reply.code(404).send({
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Quiz not found for this topic',
            },
          });
        }

        // Don't include correct answers in the response
        const sanitizedQuiz = {
          ...quiz,
          questions: quiz.questions.map((q) => ({
            id: q.id,
            questionText: q.questionText,
            options: q.options,
          })),
        };

        return reply.send({
          success: true,
          data: { quiz: sanitizedQuiz },
        });
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to fetch quiz',
          },
        });
      }
    }
  );

  // GET /api/quizzes/:id - Get quiz by ID
  app.get<{ Params: { id: string } }>(
    '/api/quizzes/:id',
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { id } = request.params;

        const quiz = await getQuizById(id);

        if (!quiz) {
          return reply.code(404).send({
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Quiz not found',
            },
          });
        }

        // Don't include correct answers in the response
        const sanitizedQuiz = {
          ...quiz,
          questions: quiz.questions.map((q) => ({
            id: q.id,
            questionText: q.questionText,
            options: q.options,
          })),
        };

        return reply.send({
          success: true,
          data: { quiz: sanitizedQuiz },
        });
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to fetch quiz',
          },
        });
      }
    }
  );

  // POST /api/quizzes/:id/submit - Submit quiz answers
  app.post<{ Params: { id: string }; Body: SubmitQuizInput }>(
    '/api/quizzes/:id/submit',
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: SubmitQuizInput }>,
      reply: FastifyReply
    ) => {
      try {
        const { id } = request.params;

        // Validate input
        const result = submitQuizSchema.safeParse(request.body);
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

        const { studentId, answers, timeTaken } = result.data;

        // Verify student exists
        const student = await getStudentById(studentId);
        if (!student) {
          return reply.code(400).send({
            success: false,
            error: {
              code: 'INVALID_STUDENT',
              message: 'Student not found',
            },
          });
        }

        // Submit quiz
        const submitResult = await submitQuizAttempt(
          studentId,
          id,
          answers as Answer[],
          timeTaken
        );

        if (!submitResult.success) {
          return reply.code(400).send({
            success: false,
            error: {
              code: 'SUBMISSION_ERROR',
              message: submitResult.error || 'Failed to submit quiz',
            },
          });
        }

        return reply.send({
          success: true,
          data: {
            attempt: submitResult.attempt,
            result: submitResult.result,
          },
        });
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to submit quiz',
          },
        });
      }
    }
  );

  // GET /api/quizzes/:id/attempts/:studentId - Get student's attempts for a quiz
  app.get<{ Params: { id: string; studentId: string } }>(
    '/api/quizzes/:id/attempts/:studentId',
    async (
      request: FastifyRequest<{ Params: { id: string; studentId: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { id, studentId } = request.params;

        const attempts = await getStudentQuizAttempts(studentId, id);

        return reply.send({
          success: true,
          data: { attempts },
        });
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to fetch attempts',
          },
        });
      }
    }
  );
}
