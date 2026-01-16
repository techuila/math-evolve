import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import {
  getTestQuiz,
  hasStudentTakenTest,
  getStudentTestResult,
  submitTest,
} from '../services/test.service.js';
import { getStudentById } from '../services/student.service.js';
import type { Answer, TestType } from '@mathevolve/types';

const submitTestSchema = z.object({
  studentId: z.string().uuid(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
    })
  ),
});

type SubmitTestInput = z.infer<typeof submitTestSchema>;

export async function testRoutes(app: FastifyInstance) {
  // GET /api/tests/pre-test - Get pre-test quiz
  app.get('/api/tests/pre-test', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const quiz = await getTestQuiz('pre');

      if (!quiz) {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Pre-test not found',
          },
        });
      }

      // Remove correct answers from response
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
          message: 'Failed to fetch pre-test',
        },
      });
    }
  });

  // GET /api/tests/post-test - Get post-test quiz
  app.get('/api/tests/post-test', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const quiz = await getTestQuiz('post');

      if (!quiz) {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Post-test not found',
          },
        });
      }

      // Remove correct answers from response
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
          message: 'Failed to fetch post-test',
        },
      });
    }
  });

  // GET /api/tests/:testType/status/:studentId - Check if student has taken test
  app.get<{ Params: { testType: string; studentId: string } }>(
    '/api/tests/:testType/status/:studentId',
    async (
      request: FastifyRequest<{ Params: { testType: string; studentId: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { testType, studentId } = request.params;

        if (testType !== 'pre' && testType !== 'post') {
          return reply.code(400).send({
            success: false,
            error: {
              code: 'INVALID_TEST_TYPE',
              message: 'Test type must be "pre" or "post"',
            },
          });
        }

        const hasTaken = await hasStudentTakenTest(studentId, testType as TestType);
        const result = hasTaken ? await getStudentTestResult(studentId, testType as TestType) : null;

        return reply.send({
          success: true,
          data: {
            hasTaken,
            result: result
              ? {
                  score: result.score,
                  maxScore: result.maxScore,
                  percentage: Math.round((result.score / result.maxScore) * 100),
                  completedAt: result.completedAt,
                }
              : null,
          },
        });
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to check test status',
          },
        });
      }
    }
  );

  // POST /api/tests/pre-test/submit - Submit pre-test
  app.post<{ Body: SubmitTestInput }>(
    '/api/tests/pre-test/submit',
    async (
      request: FastifyRequest<{ Body: SubmitTestInput }>,
      reply: FastifyReply
    ) => {
      try {
        // Validate input
        const result = submitTestSchema.safeParse(request.body);
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

        const { studentId, answers } = result.data;

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

        // Get quiz ID
        const quiz = await getTestQuiz('pre');
        if (!quiz) {
          return reply.code(404).send({
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Pre-test not found',
            },
          });
        }

        // Submit test
        const submitResult = await submitTest(studentId, 'pre', quiz.id, answers as Answer[]);

        if (!submitResult.success) {
          return reply.code(400).send({
            success: false,
            error: {
              code: 'SUBMISSION_ERROR',
              message: submitResult.error || 'Failed to submit pre-test',
            },
          });
        }

        return reply.send({
          success: true,
          data: {
            result: submitResult.result,
            score: submitResult.score,
          },
        });
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to submit pre-test',
          },
        });
      }
    }
  );

  // POST /api/tests/post-test/submit - Submit post-test
  app.post<{ Body: SubmitTestInput }>(
    '/api/tests/post-test/submit',
    async (
      request: FastifyRequest<{ Body: SubmitTestInput }>,
      reply: FastifyReply
    ) => {
      try {
        // Validate input
        const result = submitTestSchema.safeParse(request.body);
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

        const { studentId, answers } = result.data;

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

        // Check if student has completed pre-test
        const hasPreTest = await hasStudentTakenTest(studentId, 'pre');
        if (!hasPreTest) {
          return reply.code(400).send({
            success: false,
            error: {
              code: 'PRE_TEST_REQUIRED',
              message: 'You must complete the pre-test before taking the post-test',
            },
          });
        }

        // Get quiz ID
        const quiz = await getTestQuiz('post');
        if (!quiz) {
          return reply.code(404).send({
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Post-test not found',
            },
          });
        }

        // Submit test
        const submitResult = await submitTest(studentId, 'post', quiz.id, answers as Answer[]);

        if (!submitResult.success) {
          return reply.code(400).send({
            success: false,
            error: {
              code: 'SUBMISSION_ERROR',
              message: submitResult.error || 'Failed to submit post-test',
            },
          });
        }

        return reply.send({
          success: true,
          data: {
            result: submitResult.result,
            score: submitResult.score,
          },
        });
      } catch (error) {
        app.log.error(error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to submit post-test',
          },
        });
      }
    }
  );
}
