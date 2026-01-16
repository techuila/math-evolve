# MATHEVOLVE - Skills & Best Practices

## Purpose
This document serves as a guide for developers (including AI assistants) working on MATHEVOLVE. It outlines coding standards, best practices, and skills that should be applied throughout the project.

---

## Core Development Principles

### 1. Simplicity First
- **KISS Principle**: Keep It Simple, Stupid
- Prefer simple, readable code over clever solutions
- Don't over-engineer for hypothetical future requirements
- If a feature isn't needed for the MVP, don't build it

### 2. Type Safety
- Use TypeScript everywhere (100% coverage)
- Avoid `any` type - use `unknown` if truly unknown
- Define interfaces for all data structures
- Share types between frontend and backend via `@mathevolve/types`

### 3. Privacy & Security First
- Minimize data collection (only what's needed for research)
- Use pseudonymous student IDs, not real names
- Validate all inputs (frontend and backend)
- Never trust client-side data
- Use parameterized queries to prevent SQL injection

### 4. Test-Driven Mindset
- Write tests for critical logic (especially scoring)
- Test before shipping, not after bugs appear
- Aim for 80%+ coverage on services
- Use meaningful test descriptions

### 5. Code Review Culture
- All code should be reviewed (by Codex or another developer)
- Review for: correctness, security, performance, maintainability
- Don't merge without approval
- Learn from feedback

---

## TypeScript Best Practices

### Type Definitions

```typescript
// ✅ Good: Clear, specific types
interface Student {
  id: string;
  studentCode: string;
  createdAt: Date;
}

interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

// ❌ Bad: Using 'any'
function processData(data: any) {
  // Don't do this
}

// ✅ Good: Use proper types
function processQuizResult(result: QuizResult): ProcessedResult {
  // Type-safe
}
```

### Shared Types

```typescript
// packages/types/src/student.ts
export interface Student {
  id: string;
  studentCode: string;
  createdAt: Date;
}

export interface TestResult {
  studentId: string;
  testType: 'pre' | 'post';
  score: number;
  maxScore: number;
  completedAt: Date;
}

// Use in both frontend and backend
import { Student, TestResult } from '@mathevolve/types';
```

### Type Guards

```typescript
// ✅ Good: Type guards for runtime validation
function isValidTestType(type: string): type is 'pre' | 'post' {
  return type === 'pre' || type === 'post';
}

if (isValidTestType(testType)) {
  // TypeScript knows testType is 'pre' | 'post'
}
```

---

## React Best Practices

### Component Structure

```typescript
// ✅ Good: Clear component structure
import { useState } from 'react';
import type { Quiz } from '@mathevolve/types';

interface QuizCardProps {
  quiz: Quiz;
  onStart: (quizId: string) => void;
}

export function QuizCard({ quiz, onStart }: QuizCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3>{quiz.title}</h3>
      <button onClick={() => onStart(quiz.id)}>
        Start Quiz
      </button>
    </div>
  );
}
```

### Custom Hooks

```typescript
// ✅ Good: Extract reusable logic into hooks
function useStudent() {
  const [studentId, setStudentId] = useState<string | null>(
    localStorage.getItem('studentId')
  );

  const saveStudentId = (id: string) => {
    setStudentId(id);
    localStorage.setItem('studentId', id);
  };

  const clearStudentId = () => {
    setStudentId(null);
    localStorage.removeItem('studentId');
  };

  return { studentId, saveStudentId, clearStudentId };
}

// Use in components
function StudentIdPage() {
  const { studentId, saveStudentId } = useStudent();
  // ...
}
```

### State Management

```typescript
// ✅ Good: Context for global state
interface AuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setUser(response.user);
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## Fastify Best Practices

### Route Structure

```typescript
// ✅ Good: Clear route organization with types
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

// Schema validation
const quizSubmissionSchema = z.object({
  studentId: z.string().uuid(),
  quizId: z.string().uuid(),
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.string()
  }))
});

type QuizSubmission = z.infer<typeof quizSubmissionSchema>;

export async function quizRoutes(fastify: FastifyInstance) {
  // Submit quiz
  fastify.post<{ Body: QuizSubmission }>(
    '/quizzes/:id/submit',
    async (request, reply) => {
      // Validate
      const submission = quizSubmissionSchema.parse(request.body);

      // Process
      const result = await quizService.submitQuiz(submission);

      // Return
      return { success: true, data: result };
    }
  );
}
```

### Error Handling

```typescript
// ✅ Good: Consistent error handling
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

// Error handler
fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    });
  }

  // Log unexpected errors
  fastify.log.error(error);

  return reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
});

// Usage
if (!quiz) {
  throw new AppError(404, 'QUIZ_NOT_FOUND', 'Quiz not found');
}
```

### Service Layer

```typescript
// ✅ Good: Separate business logic into services
export class QuizService {
  constructor(private supabase: SupabaseClient) {}

  async getQuiz(quizId: string): Promise<Quiz> {
    const { data, error } = await this.supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (error) throw new AppError(404, 'QUIZ_NOT_FOUND', 'Quiz not found');
    return data;
  }

  async submitQuiz(submission: QuizSubmission): Promise<QuizResult> {
    const quiz = await this.getQuiz(submission.quizId);
    const score = this.calculateScore(submission.answers, quiz.questions);

    // Save result
    await this.saveQuizAttempt({
      studentId: submission.studentId,
      quizId: submission.quizId,
      score,
      maxScore: quiz.questions.length
    });

    return { score, maxScore: quiz.questions.length };
  }

  private calculateScore(answers: Answer[], questions: Question[]): number {
    let correct = 0;
    for (const answer of answers) {
      const question = questions.find(q => q.id === answer.questionId);
      if (question && this.isCorrectAnswer(answer.answer, question.correctAnswer)) {
        correct++;
      }
    }
    return correct;
  }

  private isCorrectAnswer(studentAnswer: string, correctAnswer: string): boolean {
    // Normalize and compare
    return studentAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  }
}
```

---

## Database Best Practices

### Query Patterns

```typescript
// ✅ Good: Type-safe queries with proper error handling
async function getTestResults(studentId: string) {
  const { data, error } = await supabase
    .from('test_results')
    .select(`
      id,
      test_type,
      score,
      max_score,
      completed_at
    `)
    .eq('student_id', studentId)
    .order('completed_at', { ascending: false });

  if (error) {
    throw new AppError(500, 'DB_ERROR', 'Failed to fetch test results');
  }

  return data;
}
```

### Transactions

```typescript
// ✅ Good: Use transactions for multi-step operations
async function submitPreTest(studentId: string, answers: Answer[]) {
  const { data, error } = await supabase.rpc('submit_pre_test', {
    p_student_id: studentId,
    p_answers: JSON.stringify(answers),
    p_score: calculateScore(answers)
  });

  if (error) throw new AppError(500, 'SUBMISSION_FAILED', error.message);
  return data;
}

// In database (Supabase SQL Editor):
CREATE OR REPLACE FUNCTION submit_pre_test(
  p_student_id UUID,
  p_answers JSONB,
  p_score INTEGER
) RETURNS JSONB AS $$
DECLARE
  v_result_id UUID;
BEGIN
  -- Check if already completed
  IF EXISTS (
    SELECT 1 FROM test_results
    WHERE student_id = p_student_id AND test_type = 'pre'
  ) THEN
    RAISE EXCEPTION 'Pre-test already completed';
  END IF;

  -- Insert result
  INSERT INTO test_results (student_id, test_type, score, answers)
  VALUES (p_student_id, 'pre', p_score, p_answers)
  RETURNING id INTO v_result_id;

  RETURN jsonb_build_object('id', v_result_id, 'score', p_score);
END;
$$ LANGUAGE plpgsql;
```

---

## Security Best Practices

### Input Validation

```typescript
// ✅ Good: Validate all inputs with Zod
import { z } from 'zod';

const studentIdSchema = z.string().regex(/^STUDENT_\d{3}$/, 'Invalid student ID format');
const emailSchema = z.string().email();
const scoreSchema = z.number().int().min(0).max(100);

// Validate
const validateStudentId = (id: string) => {
  return studentIdSchema.safeParse(id);
};

// In API route
const result = studentIdSchema.safeParse(request.body.studentId);
if (!result.success) {
  throw new AppError(400, 'INVALID_INPUT', result.error.message);
}
```

### Authentication Middleware

```typescript
// ✅ Good: Protect admin routes
export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify(); // Fastify JWT plugin
  } catch (error) {
    throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
  }
}

// Use in routes
fastify.get('/admin/results',
  { preHandler: [requireAuth] },
  async (request, reply) => {
    // Only authenticated admins can access
  }
);
```

### SQL Injection Prevention

```typescript
// ❌ Bad: String concatenation (SQL injection risk)
const query = `SELECT * FROM students WHERE student_code = '${studentCode}'`;

// ✅ Good: Use parameterized queries (Supabase does this automatically)
const { data } = await supabase
  .from('students')
  .select('*')
  .eq('student_code', studentCode); // Safe!
```

### XSS Prevention

```typescript
// ✅ Good: React escapes by default, but sanitize user input
import DOMPurify from 'isomorphic-dompurify';

// Only if you need to render HTML
function SafeContent({ html }: { html: string }) {
  const sanitized = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// Better: Just use text content
function SafeContent({ text }: { text: string }) {
  return <div>{text}</div>; // React auto-escapes
}
```

---

## Testing Best Practices

### Unit Tests

```typescript
// ✅ Good: Test business logic
import { describe, it, expect } from 'vitest';
import { calculateScore } from './quiz.service';

describe('Quiz Score Calculation', () => {
  it('should return 100% for all correct answers', () => {
    const answers = [
      { questionId: '1', answer: 'A' },
      { questionId: '2', answer: 'B' }
    ];
    const questions = [
      { id: '1', correctAnswer: 'A' },
      { id: '2', correctAnswer: 'B' }
    ];

    const score = calculateScore(answers, questions);
    expect(score).toBe(2);
  });

  it('should return 0% for all incorrect answers', () => {
    const answers = [
      { questionId: '1', answer: 'B' },
      { questionId: '2', answer: 'A' }
    ];
    const questions = [
      { id: '1', correctAnswer: 'A' },
      { id: '2', correctAnswer: 'B' }
    ];

    const score = calculateScore(answers, questions);
    expect(score).toBe(0);
  });

  it('should be case-insensitive', () => {
    const answers = [{ questionId: '1', answer: 'a' }];
    const questions = [{ id: '1', correctAnswer: 'A' }];

    const score = calculateScore(answers, questions);
    expect(score).toBe(1);
  });

  it('should trim whitespace', () => {
    const answers = [{ questionId: '1', answer: '  A  ' }];
    const questions = [{ id: '1', correctAnswer: 'A' }];

    const score = calculateScore(answers, questions);
    expect(score).toBe(1);
  });
});
```

### Component Tests

```typescript
// ✅ Good: Test user interactions
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizQuestion } from './QuizQuestion';

describe('QuizQuestion', () => {
  it('should render question and options', () => {
    const question = {
      id: '1',
      questionText: 'What is 2 + 2?',
      options: ['3', '4', '5']
    };

    render(<QuizQuestion question={question} onAnswer={vi.fn()} />);

    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('should call onAnswer when option is selected', () => {
    const onAnswer = vi.fn();
    const question = {
      id: '1',
      questionText: 'What is 2 + 2?',
      options: ['3', '4', '5']
    };

    render(<QuizQuestion question={question} onAnswer={onAnswer} />);

    fireEvent.click(screen.getByText('4'));

    expect(onAnswer).toHaveBeenCalledWith('1', '4');
  });
});
```

---

## Code Review Checklist

When reviewing code (AI assistants: use this as a guide):

### Correctness
- [ ] Code does what it's supposed to do
- [ ] No logical errors
- [ ] Edge cases handled
- [ ] Error handling implemented

### Security
- [ ] Input validation present
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Authentication/authorization correct
- [ ] Sensitive data not logged

### Type Safety
- [ ] No `any` types (unless absolutely necessary)
- [ ] Types are accurate and specific
- [ ] Shared types used from `@mathevolve/types`

### Performance
- [ ] No unnecessary re-renders (React)
- [ ] Database queries optimized
- [ ] No N+1 query problems
- [ ] Large lists virtualized if needed

### Maintainability
- [ ] Code is readable and clear
- [ ] Functions are single-purpose
- [ ] Magic numbers replaced with constants
- [ ] Comments explain "why", not "what"

### Testing
- [ ] Critical logic has tests
- [ ] Tests actually test the right thing
- [ ] Good test coverage

### Documentation
- [ ] Complex logic is commented
- [ ] API endpoints documented
- [ ] README updated if needed

---

## AI Assistant Best Practices (for Codex and others)

### Before Writing Code
1. **Understand the context**: Read relevant docs (PROJECT_OVERVIEW, CODE_ARCHITECTURE)
2. **Check existing patterns**: Look at how similar things are done
3. **Ask clarifying questions**: Don't assume requirements

### When Writing Code
1. **Follow existing patterns**: Consistency matters
2. **Write tests**: Especially for scoring/critical logic
3. **Think about security**: Validate inputs, prevent injection
4. **Use shared types**: Import from `@mathevolve/types`
5. **Handle errors**: Don't let errors crash the app

### After Writing Code
1. **Self-review**: Check your own code first
2. **Run tests**: Make sure nothing broke
3. **Update docs**: If you changed something significant
4. **Document issues**: Add to ISSUES_AND_FIXES.md if you solved something

### Code Review
1. **Be thorough**: Check correctness, security, performance
2. **Create tests**: Write unit tests for new features
3. **Suggest improvements**: Point out potential issues
4. **Approve only when ready**: Don't rush

---

## Git Workflow

### Commit Messages

```
# ✅ Good commit messages
feat: add quiz submission endpoint
fix: correct score calculation for partial answers
refactor: extract scoring logic into service
docs: update API documentation
test: add tests for quiz scoring

# ❌ Bad commit messages
update stuff
fixed bug
WIP
asdf
```

### Branch Naming

```
# ✅ Good branch names
feature/quiz-submission
fix/score-calculation
refactor/auth-service
docs/api-documentation

# ❌ Bad branch names
my-branch
test
fix
```

---

## Performance Guidelines

### Frontend Performance
- Lazy load routes
- Virtualize long lists (if >100 items)
- Memoize expensive computations
- Debounce user input
- Optimize images (compress, lazy load)

### Backend Performance
- Add database indexes for frequently queried fields
- Use connection pooling
- Cache static content
- Implement rate limiting
- Monitor query performance

### Database Performance
```sql
-- ✅ Good: Add indexes
CREATE INDEX idx_test_results_student_id ON test_results(student_id);
CREATE INDEX idx_quiz_attempts_student_quiz ON quiz_attempts(student_id, quiz_id);

-- ✅ Good: Analyze query performance
EXPLAIN ANALYZE SELECT * FROM test_results WHERE student_id = '...';
```

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance
- Ensure color contrast ratio ≥ 4.5:1
- All interactive elements keyboard accessible
- Proper ARIA labels
- Semantic HTML
- Alt text for images

### Example
```typescript
// ✅ Good: Accessible button
<button
  aria-label="Submit quiz"
  onClick={handleSubmit}
>
  Submit
</button>

// ✅ Good: Accessible form
<form onSubmit={handleSubmit}>
  <label htmlFor="student-id">Student ID</label>
  <input
    id="student-id"
    type="text"
    aria-required="true"
    aria-describedby="student-id-help"
  />
  <span id="student-id-help">Enter your assigned student ID</span>
</form>
```

---

**Last Updated**: 2026-01-16
**Version**: 1.0.0
**Status**: Living Document - To be updated as project evolves
