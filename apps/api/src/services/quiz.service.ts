import { supabase } from '../db/client.js';
import type { Quiz, QuizQuestion, Answer, QuizAttempt, QuizResult } from '@mathevolve/types';
import { calculateScore, isCorrectAnswer } from '@mathevolve/utils';

export async function getQuizByTopicId(topicId: string): Promise<Quiz | null> {
  try {
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select('id, topic_id, title, quiz_type, questions, passing_score')
      .eq('topic_id', topicId)
      .eq('quiz_type', 'practice')
      .single();

    if (error || !quiz) {
      return null;
    }

    return {
      id: quiz.id,
      topicId: quiz.topic_id,
      title: quiz.title,
      quizType: quiz.quiz_type as 'practice' | 'pre_test' | 'post_test',
      questions: quiz.questions as QuizQuestion[],
      passingScore: quiz.passing_score,
    };
  } catch (error) {
    console.error('Get quiz by topic error:', error);
    return null;
  }
}

export async function getQuizById(quizId: string): Promise<Quiz | null> {
  try {
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select('id, topic_id, title, quiz_type, questions, passing_score')
      .eq('id', quizId)
      .single();

    if (error || !quiz) {
      return null;
    }

    return {
      id: quiz.id,
      topicId: quiz.topic_id,
      title: quiz.title,
      quizType: quiz.quiz_type as 'practice' | 'pre_test' | 'post_test',
      questions: quiz.questions as QuizQuestion[],
      passingScore: quiz.passing_score,
    };
  } catch (error) {
    console.error('Get quiz by id error:', error);
    return null;
  }
}

export async function getTestQuiz(testType: 'pre_test' | 'post_test'): Promise<Quiz | null> {
  try {
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select('id, topic_id, title, quiz_type, questions, passing_score')
      .eq('quiz_type', testType)
      .single();

    if (error || !quiz) {
      return null;
    }

    return {
      id: quiz.id,
      topicId: quiz.topic_id,
      title: quiz.title,
      quizType: quiz.quiz_type as 'practice' | 'pre_test' | 'post_test',
      questions: quiz.questions as QuizQuestion[],
      passingScore: quiz.passing_score,
    };
  } catch (error) {
    console.error('Get test quiz error:', error);
    return null;
  }
}

export interface SubmitQuizResult {
  success: boolean;
  attempt?: QuizAttempt;
  result?: QuizResult;
  error?: string;
}

export async function submitQuizAttempt(
  studentId: string,
  quizId: string,
  answers: Answer[],
  timeTaken?: number
): Promise<SubmitQuizResult> {
  try {
    const quiz = await getQuizById(quizId);
    if (!quiz) {
      return { success: false, error: 'Quiz not found' };
    }

    // Calculate score
    const result = calculateScore(answers, quiz.questions);
    const passed = quiz.passingScore ? result.percentage >= quiz.passingScore : undefined;

    // Create quiz attempt
    const { data: attempt, error } = await supabase
      .from('quiz_attempts')
      .insert({
        student_id: studentId,
        quiz_id: quizId,
        answers: answers,
        score: result.score,
        max_score: result.maxScore,
        time_taken: timeTaken,
      })
      .select('id, student_id, quiz_id, answers, score, max_score, time_taken, completed_at')
      .single();

    if (error) {
      throw error;
    }

    // Generate feedback for each question
    const feedback = quiz.questions
      .map(q => {
        const studentAnswer = answers.find(a => a.questionId === q.id);
        const isCorrect = studentAnswer
          ? isCorrectAnswer(studentAnswer.answer, q.correctAnswer)
          : false;
        return isCorrect ? null : q.explanation;
      })
      .filter(Boolean)
      .join(' ');

    return {
      success: true,
      attempt: {
        id: attempt.id,
        studentId: attempt.student_id,
        quizId: attempt.quiz_id,
        answers: attempt.answers as Answer[],
        score: attempt.score,
        maxScore: attempt.max_score,
        timeTaken: attempt.time_taken,
        completedAt: new Date(attempt.completed_at),
      },
      result: {
        score: result.score,
        maxScore: result.maxScore,
        percentage: result.percentage,
        passed,
        feedback: feedback || 'Great job!',
      },
    };
  } catch (error) {
    console.error('Submit quiz attempt error:', error);
    return { success: false, error: 'Failed to submit quiz' };
  }
}

export async function getStudentQuizAttempts(
  studentId: string,
  quizId?: string
): Promise<QuizAttempt[]> {
  try {
    let query = supabase
      .from('quiz_attempts')
      .select('id, student_id, quiz_id, answers, score, max_score, time_taken, completed_at')
      .eq('student_id', studentId)
      .order('completed_at', { ascending: false });

    if (quizId) {
      query = query.eq('quiz_id', quizId);
    }

    const { data: attempts, error } = await query;

    if (error || !attempts) {
      return [];
    }

    return attempts.map(a => ({
      id: a.id,
      studentId: a.student_id,
      quizId: a.quiz_id,
      answers: a.answers as Answer[],
      score: a.score,
      maxScore: a.max_score,
      timeTaken: a.time_taken,
      completedAt: new Date(a.completed_at),
    }));
  } catch (error) {
    console.error('Get student quiz attempts error:', error);
    return [];
  }
}
