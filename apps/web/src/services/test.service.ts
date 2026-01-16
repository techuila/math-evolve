import { api } from './api';
import type { Quiz, QuizQuestion, TestResult, Answer, TestType } from '@mathevolve/types';

interface TestQuizResponse {
  quiz: Quiz & { questions: Omit<QuizQuestion, 'correctAnswer' | 'explanation'>[] };
}

interface TestStatusResponse {
  hasTaken: boolean;
  result: {
    score: number;
    maxScore: number;
    percentage: number;
    completedAt: string;
  } | null;
}

interface TestSubmitResponse {
  result: TestResult;
  score: {
    score: number;
    maxScore: number;
    percentage: number;
  };
}

export async function getPreTest(): Promise<{
  success: boolean;
  data?: TestQuizResponse;
  error?: string;
}> {
  try {
    const response = await api.get<TestQuizResponse>('/tests/pre-test');

    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error?.message || 'Failed to fetch pre-test' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function getPostTest(): Promise<{
  success: boolean;
  data?: TestQuizResponse;
  error?: string;
}> {
  try {
    const response = await api.get<TestQuizResponse>('/tests/post-test');

    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error?.message || 'Failed to fetch post-test' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function getTestStatus(
  testType: TestType,
  studentId: string
): Promise<{
  success: boolean;
  data?: TestStatusResponse;
  error?: string;
}> {
  try {
    const response = await api.get<TestStatusResponse>(
      `/api/tests/${testType}/status/${studentId}`
    );

    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error?.message || 'Failed to fetch test status' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function submitPreTest(
  studentId: string,
  answers: Answer[]
): Promise<{
  success: boolean;
  data?: TestSubmitResponse;
  error?: string;
}> {
  try {
    const response = await api.post<TestSubmitResponse>('/tests/pre-test/submit', {
      studentId,
      answers,
    });

    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error?.message || 'Failed to submit pre-test' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function submitPostTest(
  studentId: string,
  answers: Answer[]
): Promise<{
  success: boolean;
  data?: TestSubmitResponse;
  error?: string;
}> {
  try {
    const response = await api.post<TestSubmitResponse>('/tests/post-test/submit', {
      studentId,
      answers,
    });

    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error?.message || 'Failed to submit post-test' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}
