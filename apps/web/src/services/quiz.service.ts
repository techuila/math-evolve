import { api } from './api';
import type { Quiz, QuizQuestion, QuizAttempt, QuizResult, Answer } from '@mathevolve/types';

interface QuizResponse {
  quiz: Quiz & { questions: Omit<QuizQuestion, 'correctAnswer' | 'explanation'>[] };
}

interface SubmitResponse {
  attempt: QuizAttempt;
  result: QuizResult;
}

interface AttemptsResponse {
  attempts: QuizAttempt[];
}

export async function getQuizByTopic(topicId: string): Promise<{
  success: boolean;
  data?: QuizResponse;
  error?: string;
}> {
  try {
    const response = await api.get<QuizResponse>(`/quizzes/topic/${topicId}`);

    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error?.message || 'Failed to fetch quiz' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function getQuizById(quizId: string): Promise<{
  success: boolean;
  data?: QuizResponse;
  error?: string;
}> {
  try {
    const response = await api.get<QuizResponse>(`/quizzes/${quizId}`);

    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error?.message || 'Failed to fetch quiz' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function submitQuiz(
  quizId: string,
  studentId: string,
  answers: Answer[],
  timeTaken?: number
): Promise<{
  success: boolean;
  data?: SubmitResponse;
  error?: string;
}> {
  try {
    const response = await api.post<SubmitResponse>(`/quizzes/${quizId}/submit`, {
      studentId,
      answers,
      timeTaken,
    });

    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error?.message || 'Failed to submit quiz' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function getQuizAttempts(
  quizId: string,
  studentId: string
): Promise<{
  success: boolean;
  data?: AttemptsResponse;
  error?: string;
}> {
  try {
    const response = await api.get<AttemptsResponse>(`/quizzes/${quizId}/attempts/${studentId}`);

    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error?.message || 'Failed to fetch attempts' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}
