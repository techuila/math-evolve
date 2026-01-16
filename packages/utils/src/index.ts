import type { Answer, QuizQuestion } from '@mathevolve/types';

/**
 * Calculate quiz score based on answers
 */
export function calculateScore(
  studentAnswers: Answer[],
  questions: QuizQuestion[]
): { score: number; maxScore: number; percentage: number } {
  const maxScore = questions.length;
  let score = 0;

  for (const studentAnswer of studentAnswers) {
    const question = questions.find(q => q.id === studentAnswer.questionId);
    if (question && isCorrectAnswer(studentAnswer.answer, question.correctAnswer)) {
      score++;
    }
  }

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return { score, maxScore, percentage };
}

/**
 * Compare student answer with correct answer
 * (case-insensitive, trimmed)
 */
export function isCorrectAnswer(studentAnswer: string, correctAnswer: string): boolean {
  return studentAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Generate a pseudonymous student ID
 */
export function generateStudentCode(index: number): string {
  return `STUDENT_${String(index).padStart(3, '0')}`;
}

/**
 * Validate student code format
 */
export function isValidStudentCode(code: string): boolean {
  return /^STUDENT_\d{3}$/.test(code);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Calculate score difference
 */
export function calculateScoreDifference(preScore: number, postScore: number): number {
  return postScore - preScore;
}

/**
 * Calculate improvement percentage
 */
export function calculateImprovement(preScore: number, postScore: number): number {
  if (preScore === 0) return postScore > 0 ? 100 : 0;
  return Math.round(((postScore - preScore) / preScore) * 100);
}

/**
 * Sanitize string for CSV export
 */
export function sanitizeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // Escape double quotes and wrap in quotes if contains comma, quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Convert array of objects to CSV string
 */
export function arrayToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: (keyof T)[]
): string {
  const headerRow = headers.map(h => sanitizeCSV(String(h))).join(',');
  const rows = data.map(row =>
    headers.map(header => sanitizeCSV(row[header] as string | number)).join(',')
  );
  return [headerRow, ...rows].join('\n');
}

/**
 * Sleep utility for async delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | undefined;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
