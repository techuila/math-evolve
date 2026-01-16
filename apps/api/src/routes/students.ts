import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  createStudentSchema,
  studentCodeSchema,
  type CreateStudentInput,
} from '../schemas/student.schema.js';
import {
  getOrCreateStudent,
  getStudentByCode,
  getStudentProgress,
} from '../services/student.service.js';

export async function studentRoutes(app: FastifyInstance) {
  // POST /api/students/enter - Student enters with their code
  app.post<{ Body: CreateStudentInput }>(
    '/api/students/enter',
    async (
      request: FastifyRequest<{ Body: CreateStudentInput }>,
      reply: FastifyReply
    ) => {
      try {
        // Validate input
        const result = createStudentSchema.safeParse(request.body);
        if (!result.success) {
          return reply.code(400).send({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid student code format',
              details: result.error.flatten().fieldErrors,
            },
          });
        }

        const { studentCode } = result.data;

        // Get or create student
        const studentResult = await getOrCreateStudent(studentCode);

        if (!studentResult.success || !studentResult.student) {
          return reply.code(500).send({
            success: false,
            error: {
              code: 'STUDENT_ERROR',
              message: studentResult.error || 'Failed to process student',
            },
          });
        }

        // Get student progress
        const progress = await getStudentProgress(studentResult.student.id);

        return reply.send({
          success: true,
          data: {
            student: studentResult.student,
            progress: progress || {
              studentId: studentResult.student.id,
              preTestCompleted: false,
              postTestCompleted: false,
            },
          },
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

  // GET /api/students/:code - Get student by code
  app.get<{ Params: { code: string } }>(
    '/api/students/:code',
    async (
      request: FastifyRequest<{ Params: { code: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { code } = request.params;

        // Validate code format
        const result = studentCodeSchema.safeParse(code);
        if (!result.success) {
          return reply.code(400).send({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid student code format',
            },
          });
        }

        const student = await getStudentByCode(code);

        if (!student) {
          return reply.code(404).send({
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Student not found',
            },
          });
        }

        const progress = await getStudentProgress(student.id);

        return reply.send({
          success: true,
          data: {
            student,
            progress: progress || {
              studentId: student.id,
              preTestCompleted: false,
              postTestCompleted: false,
            },
          },
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

  // GET /api/students/:code/progress - Get student progress
  app.get<{ Params: { code: string } }>(
    '/api/students/:code/progress',
    async (
      request: FastifyRequest<{ Params: { code: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { code } = request.params;

        const student = await getStudentByCode(code);

        if (!student) {
          return reply.code(404).send({
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Student not found',
            },
          });
        }

        const progress = await getStudentProgress(student.id);

        return reply.send({
          success: true,
          data: {
            progress: progress || {
              studentId: student.id,
              preTestCompleted: false,
              postTestCompleted: false,
            },
          },
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
}
