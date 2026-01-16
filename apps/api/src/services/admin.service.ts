import { supabase } from '../db/client.js';
import type { DashboardStats, StudentResult } from '@mathevolve/types';

// Get dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  // Get total students
  const { count: totalStudents } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true });

  // Get pre-test completions
  const { count: preTestCompleted } = await supabase
    .from('test_results')
    .select('*', { count: 'exact', head: true })
    .eq('test_type', 'pre');

  // Get post-test completions
  const { count: postTestCompleted } = await supabase
    .from('test_results')
    .select('*', { count: 'exact', head: true })
    .eq('test_type', 'post');

  // Get average pre-test score
  const { data: preTestData } = await supabase
    .from('test_results')
    .select('score, max_score')
    .eq('test_type', 'pre');

  const averagePreScore =
    preTestData && preTestData.length > 0
      ? Math.round(
          preTestData.reduce((sum, r) => sum + (r.score / r.max_score) * 100, 0) /
            preTestData.length
        )
      : 0;

  // Get average post-test score
  const { data: postTestData } = await supabase
    .from('test_results')
    .select('score, max_score')
    .eq('test_type', 'post');

  const averagePostScore =
    postTestData && postTestData.length > 0
      ? Math.round(
          postTestData.reduce((sum, r) => sum + (r.score / r.max_score) * 100, 0) /
            postTestData.length
        )
      : 0;

  // Calculate improvement
  const improvement = averagePostScore - averagePreScore;

  return {
    totalStudents: totalStudents || 0,
    preTestCompleted: preTestCompleted || 0,
    postTestCompleted: postTestCompleted || 0,
    averagePreScore,
    averagePostScore,
    improvement,
  };
}

// Get all student results with their test scores
export async function getAllStudentResults(): Promise<StudentResult[]> {
  // Get all students
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('id, student_code, created_at')
    .order('student_code');

  if (studentsError || !students) {
    console.error('Error fetching students:', studentsError);
    return [];
  }

  // Get all test results
  const { data: testResults, error: resultsError } = await supabase
    .from('test_results')
    .select('student_id, test_type, score, max_score, completed_at');

  if (resultsError) {
    console.error('Error fetching test results:', resultsError);
    return [];
  }

  // Map results to students
  const results: StudentResult[] = students.map((student) => {
    const preTest = testResults?.find(
      (r) => r.student_id === student.id && r.test_type === 'pre'
    );
    const postTest = testResults?.find(
      (r) => r.student_id === student.id && r.test_type === 'post'
    );

    const preTestScore = preTest
      ? Math.round((preTest.score / preTest.max_score) * 100)
      : undefined;
    const postTestScore = postTest
      ? Math.round((postTest.score / postTest.max_score) * 100)
      : undefined;

    return {
      studentCode: student.student_code,
      preTestScore,
      postTestScore,
      scoreDifference:
        preTestScore !== undefined && postTestScore !== undefined
          ? postTestScore - preTestScore
          : undefined,
      improvementPercentage:
        preTestScore !== undefined && postTestScore !== undefined && preTestScore > 0
          ? Math.round(((postTestScore - preTestScore) / preTestScore) * 100)
          : undefined,
      preTestDate: preTest ? new Date(preTest.completed_at) : undefined,
      postTestDate: postTest ? new Date(postTest.completed_at) : undefined,
    };
  });

  return results;
}

// Get raw test data for export
export async function getExportData(): Promise<{
  students: Array<{
    studentCode: string;
    createdAt: string;
  }>;
  testResults: Array<{
    studentCode: string;
    testType: string;
    score: number;
    maxScore: number;
    percentage: number;
    completedAt: string;
  }>;
}> {
  // Get all students
  const { data: students } = await supabase
    .from('students')
    .select('id, student_code, created_at')
    .order('student_code');

  // Get all test results
  const { data: testResults } = await supabase
    .from('test_results')
    .select('student_id, test_type, score, max_score, completed_at')
    .order('completed_at');

  // Create student ID to code mapping
  const studentMap = new Map<string, string>();
  students?.forEach((s) => studentMap.set(s.id, s.student_code));

  return {
    students:
      students?.map((s) => ({
        studentCode: s.student_code,
        createdAt: s.created_at,
      })) || [],
    testResults:
      testResults?.map((r) => ({
        studentCode: studentMap.get(r.student_id) || 'Unknown',
        testType: r.test_type,
        score: r.score,
        maxScore: r.max_score,
        percentage: Math.round((r.score / r.max_score) * 100),
        completedAt: r.completed_at,
      })) || [],
  };
}
