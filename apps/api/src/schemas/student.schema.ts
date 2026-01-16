import { z } from 'zod';

export const studentCodeSchema = z
  .string()
  .regex(
    /^STUDENT_\d{3}$/,
    'Student code must be in format STUDENT_XXX (e.g., STUDENT_001)'
  );

export const createStudentSchema = z.object({
  studentCode: studentCodeSchema,
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
