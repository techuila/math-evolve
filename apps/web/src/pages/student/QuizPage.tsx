import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
} from 'lucide-react';
import type { Quiz, QuizQuestion, Answer, QuizResult } from '@mathevolve/types';
import { getQuizByTopic, submitQuiz } from '@/services/quiz.service';
import { getTopicById } from '@/services/content.service';
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
} from '@/components/ui';

type QuestionWithoutAnswer = Omit<QuizQuestion, 'correctAnswer' | 'explanation'>;

export function QuizPage() {
  const { id: topicId } = useParams<{ id: string }>();
  const { student, progress } = useStudent();

  const [topicName, setTopicName] = useState<string>('');
  const [quiz, setQuiz] = useState<(Quiz & { questions: QuestionWithoutAnswer[] }) | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchData = async () => {
      if (!topicId) return;

      // Fetch topic name
      const topicResult = await getTopicById(topicId);
      if (topicResult.success && topicResult.topic) {
        setTopicName(topicResult.topic.name);
      }

      // Fetch quiz
      const quizResult = await getQuizByTopic(topicId);
      if (quizResult.success && quizResult.data) {
        setQuiz(quizResult.data.quiz);
      } else {
        setError(quizResult.error || 'Failed to load quiz');
      }
      setIsLoading(false);
    };

    fetchData();
  }, [topicId]);

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
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    const answerArray: Answer[] = Array.from(answers.entries()).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    const submitResult = await submitQuiz(quiz.id, student.id, answerArray, timeTaken);

    if (submitResult.success && submitResult.data) {
      setResult(submitResult.data.result);
    } else {
      setError(submitResult.error || 'Failed to submit quiz');
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <StudentLayout
        studentCode={student?.studentCode}
        preTestCompleted={progress?.preTestCompleted}
        postTestCompleted={progress?.postTestCompleted}
      >
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </StudentLayout>
    );
  }

  if (error && !result) {
    return (
      <StudentLayout
        studentCode={student?.studentCode}
        preTestCompleted={progress?.preTestCompleted}
        postTestCompleted={progress?.postTestCompleted}
      >
        <div className="text-center py-20">
          <p className="text-destructive">{error}</p>
          <Link to="/topics">
            <Button className="mt-4">Back to Topics</Button>
          </Link>
        </div>
      </StudentLayout>
    );
  }

  if (!quiz) {
    return (
      <StudentLayout
        studentCode={student?.studentCode}
        preTestCompleted={progress?.preTestCompleted}
        postTestCompleted={progress?.postTestCompleted}
      >
        <div className="text-center py-20">
          <p className="text-muted-foreground">No quiz available for this topic.</p>
          <Link to="/topics">
            <Button className="mt-4">Back to Topics</Button>
          </Link>
        </div>
      </StudentLayout>
    );
  }

  // Show results if quiz is completed
  if (result) {
    const passed = result.passed ?? result.percentage >= (quiz.passingScore || 60);

    return (
      <StudentLayout
        studentCode={student?.studentCode}
        preTestCompleted={progress?.preTestCompleted}
        postTestCompleted={progress?.postTestCompleted}
      >
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {passed ? (
                  <Trophy className="h-16 w-16 text-yellow-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-destructive" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {passed ? 'Congratulations!' : 'Keep Practicing!'}
              </CardTitle>
              <CardDescription>
                {passed
                  ? 'You passed the quiz!'
                  : "You didn't pass this time, but don't give up!"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{result.score}</p>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{result.maxScore}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{result.percentage}%</p>
                  <p className="text-sm text-muted-foreground">Score</p>
                </div>
              </div>

              {result.feedback && (
                <p className="text-center text-muted-foreground">{result.feedback}</p>
              )}

              <div className="text-center text-sm text-muted-foreground">
                Passing score: {quiz.passingScore || 60}%
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Link to={`/topics/${topicId}/tutorial`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Review Tutorial
                </Button>
              </Link>
              <Link to="/topics" className="flex-1">
                <Button className="w-full">Back to Topics</Button>
              </Link>
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
    <StudentLayout
      studentCode={student?.studentCode}
      preTestCompleted={progress?.preTestCompleted}
      postTestCompleted={progress?.postTestCompleted}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              to={`/topics/${topicId}/tutorial`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Tutorial
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">{quiz.title}</h1>
            <p className="text-muted-foreground">{topicName}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <Timer startTime={startTime} />
            </Badge>
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
              {selectedAnswer && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
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
                onClick={handleSubmit}
                disabled={isSubmitting || answeredCount < totalQuestions}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
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
