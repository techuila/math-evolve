import { supabase } from '../db/client.js';
import type { Quiz, QuizQuestion, Answer, TestResult, TestType } from '@mathevolve/types';
import { calculateScore } from '@mathevolve/utils';

interface TestSubmitResult {
  success: boolean;
  result?: TestResult;
  score?: {
    score: number;
    maxScore: number;
    percentage: number;
  };
  error?: string;
}

// Get the pre-test or post-test quiz
export async function getTestQuiz(testType: TestType): Promise<Quiz | null> {
  const quizType = testType === 'pre' ? 'pre_test' : 'post_test';

  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('quiz_type', quizType)
    .single();

  if (error || !data) {
    console.error('Error fetching test quiz:', error);
    return null;
  }

  return {
    id: data.id,
    topicId: data.topic_id,
    title: data.title,
    quizType: data.quiz_type,
    questions: data.questions as QuizQuestion[],
    passingScore: data.passing_score,
  };
}

// Check if student has already taken this test
export async function hasStudentTakenTest(
  studentId: string,
  testType: TestType
): Promise<boolean> {
  const { data, error } = await supabase
    .from('test_results')
    .select('id')
    .eq('student_id', studentId)
    .eq('test_type', testType)
    .maybeSingle();

  if (error) {
    console.error('Error checking test status:', error);
    return false;
  }

  return !!data;
}

// Get student's test result
export async function getStudentTestResult(
  studentId: string,
  testType: TestType
): Promise<TestResult | null> {
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('student_id', studentId)
    .eq('test_type', testType)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    studentId: data.student_id,
    testType: data.test_type,
    quizId: data.quiz_id,
    score: data.score,
    maxScore: data.max_score,
    answers: data.answers as Answer[],
    completedAt: new Date(data.completed_at),
  };
}

// Submit a test
export async function submitTest(
  studentId: string,
  testType: TestType,
  quizId: string,
  answers: Answer[]
): Promise<TestSubmitResult> {
  // Check if student already took this test
  const alreadyTaken = await hasStudentTakenTest(studentId, testType);
  if (alreadyTaken) {
    return {
      success: false,
      error: `You have already completed the ${testType === 'pre' ? 'pre' : 'post'}-test`,
    };
  }

  // Get the quiz to calculate score
  const quiz = await getTestQuiz(testType);
  if (!quiz) {
    return {
      success: false,
      error: 'Test not found',
    };
  }

  // Calculate score
  const scoreResult = calculateScore(answers, quiz.questions);

  // Insert test result
  const { data, error } = await supabase
    .from('test_results')
    .insert({
      student_id: studentId,
      test_type: testType,
      quiz_id: quizId,
      score: scoreResult.score,
      max_score: scoreResult.maxScore,
      answers: answers,
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting test:', error);
    // Check for unique constraint violation
    if (error.code === '23505') {
      return {
        success: false,
        error: `You have already completed the ${testType === 'pre' ? 'pre' : 'post'}-test`,
      };
    }
    return {
      success: false,
      error: 'Failed to submit test',
    };
  }

  return {
    success: true,
    result: {
      id: data.id,
      studentId: data.student_id,
      testType: data.test_type,
      quizId: data.quiz_id,
      score: data.score,
      maxScore: data.max_score,
      answers: data.answers as Answer[],
      completedAt: new Date(data.completed_at),
    },
    score: scoreResult,
  };
}

// Get all test results (for admin)
export async function getAllTestResults(): Promise<TestResult[]> {
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .order('completed_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching test results:', error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    studentId: row.student_id,
    testType: row.test_type,
    quizId: row.quiz_id,
    score: row.score,
    maxScore: row.max_score,
    answers: row.answers as Answer[],
    completedAt: new Date(row.completed_at),
  }));
}
