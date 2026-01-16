import { api } from './api';
import type { Student } from '@mathevolve/types';

const STUDENT_KEY = 'student_code';

export interface StudentProgress {
  studentId: string;
  preTestCompleted: boolean;
  postTestCompleted: boolean;
  preTestScore?: number;
  postTestScore?: number;
}

export interface StudentData {
  student: Student;
  progress: StudentProgress;
}

export async function enterWithStudentCode(
  studentCode: string
): Promise<{ success: boolean; data?: StudentData; error?: string }> {
  const response = await api.post<StudentData>('/students/enter', { studentCode });

  if (response.success && response.data) {
    localStorage.setItem(STUDENT_KEY, studentCode);
    return { success: true, data: response.data };
  }

  return {
    success: false,
    error: response.error?.message || 'Failed to enter',
  };
}

export async function getStudentByCode(
  code: string
): Promise<{ success: boolean; data?: StudentData; error?: string }> {
  const response = await api.get<StudentData>(`/students/${code}`);

  if (response.success && response.data) {
    return { success: true, data: response.data };
  }

  return {
    success: false,
    error: response.error?.message || 'Student not found',
  };
}

export async function getStudentProgress(
  code: string
): Promise<{ success: boolean; progress?: StudentProgress; error?: string }> {
  const response = await api.get<{ progress: StudentProgress }>(
    `/students/${code}/progress`
  );

  if (response.success && response.data) {
    return { success: true, progress: response.data.progress };
  }

  return {
    success: false,
    error: response.error?.message || 'Failed to get progress',
  };
}

export function getStoredStudentCode(): string | null {
  return localStorage.getItem(STUDENT_KEY);
}

export function clearStoredStudentCode(): void {
  localStorage.removeItem(STUDENT_KEY);
}

export function isValidStudentCode(code: string): boolean {
  return /^STUDENT_\d{3}$/.test(code);
}
