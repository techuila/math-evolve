import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import type { Quiz, QuizQuestion, Answer } from '@mathevolve/types';
import { getPreTest, submitPreTest, getTestStatus } from '@/services/test.service';
import { useStudent } from '@/context/StudentContext';
import { StudentLayout } from '@/components/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Spinner,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui';

type QuestionWithoutAnswer = Omit<QuizQuestion, 'correctAnswer' | 'explanation'>;

export function PreTestPage() {
  const navigate = useNavigate();
  const { student, progress, refreshProgress } = useStudent();

  const [quiz, setQuiz] = useState<(Quiz & { questions: QuestionWithoutAnswer[] }) | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      if (!student) return;

      // Check if already completed
      const statusResult = await getTestStatus('pre', student.id);
      if (statusResult.success && statusResult.data?.hasTaken) {
        setIsCompleted(true);
        setIsLoading(false);
        return;
      }

      // Fetch quiz
      const quizResult = await getPreTest();
      if (quizResult.success && quizResult.data) {
        setQuiz(quizResult.data.quiz);
      } else {
        setError(quizResult.error || 'Failed to load pre-test');
      }
      setIsLoading(false);
    };

    checkStatus();
  }, [student]);

  const handleStartTest = () => {
    setShowInstructions(false);
    setStartTime(Date.now());
  };

  const handleSelectAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      newAnswers.set(questionId, answer);
      return newAnswers;
    });
  }, []);

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz || !student) return;

    setIsSubmitting(true);
    setShowConfirmSubmit(false);

    const answerArray: Answer[] = Array.from(answers.entries()).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    const submitResult = await submitPreTest(student.id, answerArray);

    if (submitResult.success) {
      await refreshProgress();
      navigate('/topics');
    } else {
      setError(submitResult.error || 'Failed to submit pre-test');
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <StudentLayout studentCode={student?.studentCode}>
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </StudentLayout>
    );
  }

  if (isCompleted) {
    return (
      <StudentLayout studentCode={student?.studentCode} preTestCompleted postTestCompleted={progress?.postTestCompleted}>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <FileCheck className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Pre-Test Already Completed</CardTitle>
              <CardDescription>
                You have already completed the pre-test. You can now proceed to learn the topics.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button onClick={() => navigate('/topics')}>Go to Topics</Button>
            </CardFooter>
          </Card>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout studentCode={student?.studentCode}>
        <div className="text-center py-20">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => navigate('/enter')} className="mt-4">
            Go Back
          </Button>
        </div>
      </StudentLayout>
    );
  }

  if (!quiz) {
    return (
      <StudentLayout studentCode={student?.studentCode}>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Pre-test not available.</p>
        </div>
      </StudentLayout>
    );
  }

  // Show instructions
  if (showInstructions) {
    return (
      <StudentLayout studentCode={student?.studentCode}>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-16 w-16 text-yellow-500" />
              </div>
              <CardTitle className="text-2xl">Pre-Test Instructions</CardTitle>
              <CardDescription>Please read carefully before starting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <p className="font-medium">Important Information:</p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>This pre-test assesses your current knowledge of Grade 10 Mathematics</li>
                  <li>You can only take this test once</li>
                  <li>There are <strong>{quiz.questions.length} questions</strong> in total</li>
                  <li>Answer all questions to the best of your ability</li>
                  <li>Your score will NOT be shown after completion</li>
                  <li>After completing, you can access the learning materials</li>
                </ul>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> This is a pre-test to measure your initial knowledge.
                  Don't worry if you don't know some answers. The goal is to learn and improve!
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button onClick={handleStartTest} className="w-full">
                I Understand, Start Pre-Test
              </Button>
              <Button variant="outline" onClick={() => navigate('/enter')} className="w-full">
                Go Back
              </Button>
            </CardFooter>
          </Card>
        </div>
      </StudentLayout>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedAnswer = answers.get(currentQuestion.id);
  const answeredCount = answers.size;
  const totalQuestions = quiz.questions.length;

  return (
    <StudentLayout studentCode={student?.studentCode}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pre-Test Assessment</h1>
            <p className="text-muted-foreground">Grade 10 Mathematics</p>
          </div>
          <div className="flex items-center gap-4">
            {startTime && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <Timer startTime={startTime} />
              </Badge>
            )}
            <Badge variant={answeredCount === totalQuestions ? 'default' : 'secondary'}>
              {answeredCount}/{totalQuestions} answered
            </Badge>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">Question {currentQuestionIndex + 1}</Badge>
              {selectedAnswer && <CheckCircle className="h-5 w-5 text-green-500" />}
            </div>
            <CardTitle className="text-lg">{currentQuestion.questionText}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(currentQuestion.id, option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === option
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        selectedAnswer === option
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Question Navigation */}
        <div className="flex flex-wrap gap-2 justify-center">
          {quiz.questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                index === currentQuestionIndex
                  ? 'bg-primary text-primary-foreground'
                  : answers.has(q.id)
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestionIndex < totalQuestions - 1 ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => setShowConfirmSubmit(true)}
                disabled={isSubmitting || answeredCount < totalQuestions}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Pre-Test'}
              </Button>
            )}
          </div>
        </div>

        {answeredCount < totalQuestions && (
          <p className="text-center text-sm text-muted-foreground">
            Please answer all questions before submitting.
          </p>
        )}
      </div>

      {/* Confirm Submit Dialog */}
      <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Pre-Test?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your pre-test? You cannot change your answers after submission.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmSubmit(false)}>
              Review Answers
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StudentLayout>
  );
}

// Timer component
function Timer({ startTime }: { startTime: number }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <span>
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </span>
  );
}
