// Student Types
export interface Student {
  id: string;
  studentCode: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

// Topic Types
export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string;
  orderIndex: number;
}

// Content Types
export type ContentType = 'formula' | 'tutorial' | 'step';

export interface Content {
  id: string;
  topicId: string;
  contentType: ContentType;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
  orderIndex: number;
}

// Quiz Types
export type QuizType = 'practice' | 'pre_test' | 'post_test';

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Quiz {
  id: string;
  topicId?: string;
  title: string;
  quizType: QuizType;
  questions: QuizQuestion[];
  passingScore?: number;
}

export interface Answer {
  questionId: string;
  answer: string;
}

export interface QuizSubmission {
  studentId: string;
  quizId: string;
  answers: Answer[];
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  answers: Answer[];
  score: number;
  maxScore: number;
  timeTaken?: number;
  completedAt: Date;
}

export interface QuizResult {
  score: number;
  maxScore: number;
  percentage: number;
  passed?: boolean;
  feedback?: string;
}

// Test Types
export type TestType = 'pre' | 'post';

export interface TestSubmission {
  studentId: string;
  testType: TestType;
  quizId: string;
  answers: Answer[];
}

export interface TestResult {
  id: string;
  studentId: string;
  testType: TestType;
  quizId: string;
  score: number;
  maxScore: number;
  answers: Answer[];
  completedAt: Date;
}

// Admin Types
export interface AdminUser {
  id: string;
  username: string;
  role: 'teacher' | 'admin';
  createdAt: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Statistics Types
export interface DashboardStats {
  totalStudents: number;
  preTestCompleted: number;
  postTestCompleted: number;
  averagePreScore: number;
  averagePostScore: number;
  improvement: number;
}

export interface StudentResult {
  studentCode: string;
  preTestScore?: number;
  postTestScore?: number;
  scoreDifference?: number;
  improvementPercentage?: number;
  preTestDate?: Date;
  postTestDate?: Date;
}

// Export Data Types
export interface ExportOptions {
  format: 'csv' | 'json';
  testType?: TestType | 'both';
  startDate?: Date;
  endDate?: Date;
}
