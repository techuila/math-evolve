import { supabase } from '../db/client.js';
import type { Student } from '@mathevolve/types';

export interface StudentProgress {
  studentId: string;
  preTestCompleted: boolean;
  postTestCompleted: boolean;
  preTestScore?: number;
  postTestScore?: number;
}

export async function getOrCreateStudent(
  studentCode: string
): Promise<{ success: boolean; student?: Student; error?: string }> {
  try {
    // First, try to find existing student
    const { data: existingStudent, error: findError } = await supabase
      .from('students')
      .select('id, student_code, created_at, metadata')
      .eq('student_code', studentCode)
      .single();

    if (existingStudent && !findError) {
      return {
        success: true,
        student: {
          id: existingStudent.id,
          studentCode: existingStudent.student_code,
          createdAt: new Date(existingStudent.created_at),
          metadata: existingStudent.metadata,
        },
      };
    }

    // If not found, create new student
    const { data: newStudent, error: createError } = await supabase
      .from('students')
      .insert({ student_code: studentCode })
      .select('id, student_code, created_at, metadata')
      .single();

    if (createError) {
      // Handle unique constraint violation (concurrent creation)
      if (createError.code === '23505') {
        const { data: retryStudent } = await supabase
          .from('students')
          .select('id, student_code, created_at, metadata')
          .eq('student_code', studentCode)
          .single();

        if (retryStudent) {
          return {
            success: true,
            student: {
              id: retryStudent.id,
              studentCode: retryStudent.student_code,
              createdAt: new Date(retryStudent.created_at),
              metadata: retryStudent.metadata,
            },
          };
        }
      }
      throw createError;
    }

    return {
      success: true,
      student: {
        id: newStudent.id,
        studentCode: newStudent.student_code,
        createdAt: new Date(newStudent.created_at),
        metadata: newStudent.metadata,
      },
    };
  } catch (error) {
    console.error('Get or create student error:', error);
    return {
      success: false,
      error: 'Failed to process student',
    };
  }
}

export async function getStudentByCode(
  studentCode: string
): Promise<Student | null> {
  try {
    const { data: student, error } = await supabase
      .from('students')
      .select('id, student_code, created_at, metadata')
      .eq('student_code', studentCode)
      .single();

    if (error || !student) {
      return null;
    }

    return {
      id: student.id,
      studentCode: student.student_code,
      createdAt: new Date(student.created_at),
      metadata: student.metadata,
    };
  } catch (error) {
    console.error('Get student error:', error);
    return null;
  }
}

export async function getStudentById(id: string): Promise<Student | null> {
  try {
    const { data: student, error } = await supabase
      .from('students')
      .select('id, student_code, created_at, metadata')
      .eq('id', id)
      .single();

    if (error || !student) {
      return null;
    }

    return {
      id: student.id,
      studentCode: student.student_code,
      createdAt: new Date(student.created_at),
      metadata: student.metadata,
    };
  } catch (error) {
    console.error('Get student error:', error);
    return null;
  }
}

export async function getStudentProgress(
  studentId: string
): Promise<StudentProgress | null> {
  try {
    const { data: preTest, error: preError } = await supabase
      .from('test_results')
      .select('score, max_score')
      .eq('student_id', studentId)
      .eq('test_type', 'pre')
      .single();

    const { data: postTest, error: postError } = await supabase
      .from('test_results')
      .select('score, max_score')
      .eq('student_id', studentId)
      .eq('test_type', 'post')
      .single();

    return {
      studentId,
      preTestCompleted: !preError && !!preTest,
      postTestCompleted: !postError && !!postTest,
      preTestScore: preTest?.score,
      postTestScore: postTest?.score,
    };
  } catch (error) {
    console.error('Get student progress error:', error);
    return null;
  }
}

export async function getAllStudents(): Promise<Student[]> {
  try {
    const { data: students, error } = await supabase
      .from('students')
      .select('id, student_code, created_at, metadata')
      .order('created_at', { ascending: true });

    if (error || !students) {
      return [];
    }

    return students.map((s) => ({
      id: s.id,
      studentCode: s.student_code,
      createdAt: new Date(s.created_at),
      metadata: s.metadata,
    }));
  } catch (error) {
    console.error('Get all students error:', error);
    return [];
  }
}
