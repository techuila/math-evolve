# MATHEVOLVE - Issues & Fixes

## Purpose
This document serves as a knowledge base for issues, bugs, and their solutions encountered during development and deployment of MATHEVOLVE. When similar issues arise, refer to this document for proven solutions.

---

## How to Use This Document

### Adding New Issues
When you encounter an issue:
1. Document the problem with clear symptoms
2. Note the context (environment, conditions, steps to reproduce)
3. Document the investigation process
4. Record the solution and why it works
5. Add prevention tips if applicable

### Issue Template
```markdown
## [Category] Issue Title

**Date**: YYYY-MM-DD
**Severity**: Critical | High | Medium | Low
**Status**: Resolved | In Progress | Investigating

### Symptoms
- What went wrong?
- What error messages appeared?

### Context
- When did this occur?
- What environment? (dev/staging/production)
- What actions triggered it?

### Root Cause
- What was the underlying problem?

### Solution
- How was it fixed?
- What code changes were made?

### Prevention
- How to avoid this in the future?

### Related Issues
- Links to similar problems
```

---

## Issues Log

### Setup & Configuration Issues

---

## [Build] Turbo Cache Not Working

**Date**: 2026-01-16
**Severity**: Low
**Status**: Template (No actual issue yet)

### Symptoms
- Turbo rebuilds packages even when nothing changed
- Build times are slower than expected
- Cache hits are 0%

### Context
- Happens in development environment
- After running `turbo build` multiple times

### Root Cause
- `.turbo` directory not in `.gitignore`
- Or: Turbo cache configuration incorrect in `turbo.json`

### Solution
1. Add `.turbo` to `.gitignore`
2. Verify `turbo.json` has correct cache configuration:
```json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/**", ".next/**"]
    }
  }
}
```
3. Clear cache: `turbo run build --force`

### Prevention
- Always verify Turbo configuration during setup
- Check cache directory is properly excluded from Git

---

## [TypeScript] Cannot Import Shared Types

**Date**: 2026-01-16
**Severity**: Medium
**Status**: Template

### Symptoms
- Import errors in apps when trying to use `@mathevolve/types`
- TypeScript can't find module
- Build fails with "Cannot find module" error

### Context
- After creating shared types package
- In development environment

### Root Cause
- Package not properly exported in `package.json`
- Or: TypeScript paths not configured
- Or: Package not built before being imported

### Solution
1. Verify `packages/types/package.json` has proper exports:
```json
{
  "name": "@mathevolve/types",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  }
}
```

2. Build the types package first:
```bash
cd packages/types
pnpm build
```

3. In consuming app, ensure dependency is listed:
```json
{
  "dependencies": {
    "@mathevolve/types": "workspace:*"
  }
}
```

### Prevention
- Always build shared packages before consuming
- Set up Turbo pipeline to build dependencies first
- Add `turbo.json` dependency configuration

---

### Database & Supabase Issues

---

## [Supabase] RLS Preventing Data Access

**Date**: 2026-01-16
**Severity**: High
**Status**: Template

### Symptoms
- API returns empty results even though data exists
- No error messages, just empty arrays
- Direct SQL queries in Supabase work, but API doesn't

### Context
- After enabling Row-Level Security (RLS)
- Queries work in Supabase SQL editor but not from API

### Root Cause
- RLS policies are too restrictive
- Service role key not being used in backend
- Missing policy for the operation type

### Solution
1. **Option A**: Use service role key in backend (bypasses RLS)
```typescript
// Use service role key, not anon key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Not ANON key
);
```

2. **Option B**: Add proper RLS policy
```sql
-- Allow service role to access all data
CREATE POLICY "Service role can do anything"
  ON table_name
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

3. **Option C**: Adjust policy for specific use case
```sql
-- Example: Allow public read access
CREATE POLICY "Anyone can read topics"
  ON topics
  FOR SELECT
  USING (true);
```

### Prevention
- Document which operations require which keys
- Test API endpoints after enabling RLS
- Use service role key for backend operations
- Use anon key only for client-side operations with proper RLS

---

## [Database] Unique Constraint Violation on Test Submission

**Date**: 2026-01-16
**Severity**: High
**Status**: Template

### Symptoms
- Error when student tries to submit test: "duplicate key value violates unique constraint"
- Student has already completed pre-test or post-test
- Submission fails

### Context
- Student attempts to submit pre-test or post-test for second time
- Unique constraint: `UNIQUE(student_id, test_type)`

### Root Cause
- Student trying to retake test that should only be taken once
- Frontend not checking if test was already completed
- No API validation before submission

### Solution
1. **Frontend**: Check if test completed before allowing access
```typescript
const checkTestCompleted = async (studentId: string, testType: 'pre' | 'post') => {
  const { data } = await supabase
    .from('test_results')
    .select('id')
    .eq('student_id', studentId)
    .eq('test_type', testType)
    .single();

  return !!data; // true if completed
};
```

2. **Backend**: Validate before insert
```typescript
// Check if already completed
const existing = await supabase
  .from('test_results')
  .select('id')
  .eq('student_id', studentId)
  .eq('test_type', testType);

if (existing.data?.length > 0) {
  throw new Error('Test already completed');
}
```

3. **UX**: Show message "You have already completed this test"

### Prevention
- Always check constraints before allowing submission
- Add frontend guards for one-time actions
- Show clear messaging to users

---

### Authentication & Security Issues

---

## [Auth] JWT Token Expired Error

**Date**: 2026-01-16
**Severity**: Medium
**Status**: Template

### Symptoms
- Admin gets "Token expired" error
- Logged out unexpectedly
- API returns 401 Unauthorized

### Context
- After admin is logged in for extended period
- JWT tokens have expiration time

### Root Cause
- JWT token has expired (default: 1 hour)
- No token refresh mechanism
- Frontend not handling token expiration

### Solution
1. **Increase token expiration** (if appropriate):
```typescript
const token = fastify.jwt.sign(
  { userId: user.id, role: user.role },
  { expiresIn: '8h' } // Instead of default 1h
);
```

2. **Add token refresh endpoint**:
```typescript
fastify.post('/api/auth/refresh', async (request, reply) => {
  const oldToken = request.headers.authorization?.split(' ')[1];
  const decoded = fastify.jwt.verify(oldToken, { ignoreExpiration: true });

  const newToken = fastify.jwt.sign({
    userId: decoded.userId,
    role: decoded.role
  });

  return { token: newToken };
});
```

3. **Frontend: Auto-refresh before expiration**:
```typescript
// Check token expiration and refresh if needed
const refreshTokenIfNeeded = async () => {
  const token = getToken();
  const decoded = jwtDecode(token);
  const expiresIn = decoded.exp * 1000 - Date.now();

  if (expiresIn < 5 * 60 * 1000) { // Less than 5 minutes
    await refreshToken();
  }
};
```

### Prevention
- Set appropriate token expiration for use case
- Implement token refresh mechanism from start
- Add token expiration handling in frontend

---

## [Security] CORS Error in Production

**Date**: 2026-01-16
**Severity**: Critical
**Status**: Template

### Symptoms
- Frontend can't connect to API in production
- Browser console shows CORS error
- Error: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

### Context
- Works fine in development
- Breaks after deployment to production
- Frontend and backend on different domains

### Root Cause
- CORS not configured for production domain
- Only localhost allowed in CORS settings

### Solution
1. **Update CORS configuration in backend**:
```typescript
fastify.register(cors, {
  origin: [
    'http://localhost:5173', // Development
    'https://mathevolve.vercel.app', // Production frontend
    'https://math-evolve.com' // Custom domain
  ],
  credentials: true
});
```

2. **Or use environment variable**:
```typescript
fastify.register(cors, {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
  credentials: true
});
```

3. **Set environment variable in deployment**:
```
ALLOWED_ORIGINS=https://mathevolve.vercel.app,https://math-evolve.com
```

### Prevention
- Configure CORS properly from the start
- Use environment variables for different environments
- Test in production-like environment before deployment

---

### Frontend Issues

---

## [React] State Not Updating After API Call

**Date**: 2026-01-16
**Severity**: Medium
**Status**: Template

### Symptoms
- API call succeeds but UI doesn't update
- Need to refresh page to see changes
- State appears stale

### Context
- After submitting a form or quiz
- Using React state management

### Root Cause
- Forgetting to update state after API call
- Or: State mutation instead of creating new object/array
- Or: Async state update timing issue

### Solution
1. **Ensure state is updated after API call**:
```typescript
// Bad
const submitQuiz = async (answers) => {
  await api.submitQuiz(answers);
  // State not updated!
};

// Good
const submitQuiz = async (answers) => {
  const result = await api.submitQuiz(answers);
  setQuizResult(result);
  setIsCompleted(true);
};
```

2. **Don't mutate state directly**:
```typescript
// Bad
results.push(newResult); // Mutation
setResults(results);

// Good
setResults([...results, newResult]); // New array
```

3. **Use functional updates for dependent state**:
```typescript
// Good for updates based on previous state
setCount(prevCount => prevCount + 1);
```

### Prevention
- Always update state after async operations
- Never mutate state directly
- Use React DevTools to debug state issues

---

## [Performance] Slow Quiz Page Load

**Date**: 2026-01-16
**Severity**: Medium
**Status**: Template

### Symptoms
- Quiz page takes 3+ seconds to load
- Large bundle size
- Slow initial render

### Context
- Production build
- All quiz questions loaded at once

### Root Cause
- Loading all quizzes/questions upfront
- No code splitting
- Large dependencies bundled together

### Solution
1. **Implement lazy loading**:
```typescript
// Lazy load quiz page
const QuizPage = lazy(() => import('./pages/QuizPage'));

// In router
<Route path="/quiz/:id" element={
  <Suspense fallback={<LoadingSpinner />}>
    <QuizPage />
  </Suspense>
} />
```

2. **Load questions on demand**:
```typescript
// Don't load all questions upfront
// Load only current quiz
const { data: quiz } = await api.getQuiz(quizId);
```

3. **Optimize bundle**:
```bash
# Analyze bundle
npx vite-bundle-visualizer

# Remove unused dependencies
pnpm remove unused-package
```

### Prevention
- Implement code splitting from the start
- Monitor bundle size during development
- Load data on demand, not upfront

---

### Quiz & Testing Issues

---

## [Quiz] Score Calculation Incorrect

**Date**: 2026-01-16
**Severity**: Critical
**Status**: Template

### Symptoms
- Quiz score doesn't match expected result
- Students getting wrong scores
- Math doesn't add up

### Context
- After quiz submission
- Score calculation logic in backend

### Root Cause
- Incorrect score calculation algorithm
- Not handling partial credit properly
- Or: Comparing answers case-sensitively when shouldn't

### Solution
1. **Review and fix scoring logic**:
```typescript
// Bad: Case-sensitive comparison
const isCorrect = studentAnswer === correctAnswer;

// Good: Normalize answers
const isCorrect = studentAnswer.trim().toLowerCase() ===
                  correctAnswer.trim().toLowerCase();
```

2. **Add tests for scoring**:
```typescript
describe('Quiz Scoring', () => {
  it('should calculate correct score for all correct answers', () => {
    const answers = [
      { questionId: '1', answer: 'A' },
      { questionId: '2', answer: 'B' }
    ];
    const correctAnswers = [
      { questionId: '1', correctAnswer: 'A' },
      { questionId: '2', correctAnswer: 'B' }
    ];

    const score = calculateScore(answers, correctAnswers);
    expect(score).toBe(100);
  });

  it('should handle partial credit', () => {
    // Test partial credit scenarios
  });
});
```

3. **Add validation**:
```typescript
// Validate score is between 0 and maxScore
if (score < 0 || score > maxScore) {
  throw new Error('Invalid score calculated');
}
```

### Prevention
- Write comprehensive tests for scoring logic
- Test edge cases (all wrong, all correct, partial)
- Have someone else review scoring algorithm
- **Critical: Get Codex to review all scoring logic**

---

### Data & Export Issues

---

## [Export] CSV Export Missing Data

**Date**: 2026-01-16
**Severity**: High
**Status**: Template

### Symptoms
- CSV export doesn't include all students
- Some rows are missing
- Data incomplete

### Context
- Admin exports test results
- Not all 60 students appear in export

### Root Cause
- Query limit (e.g., default LIMIT 50)
- Pagination not handled
- Or: Filter applied unintentionally

### Solution
1. **Remove query limits for exports**:
```typescript
// Bad: Limited results
const { data } = await supabase
  .from('test_results')
  .select('*')
  .limit(50); // Oops!

// Good: All results
const { data } = await supabase
  .from('test_results')
  .select('*');
  // No limit for exports
```

2. **Handle pagination if needed**:
```typescript
async function getAllResults() {
  let allResults = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const { data } = await supabase
      .from('test_results')
      .select('*')
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (!data || data.length === 0) break;

    allResults = [...allResults, ...data];
    if (data.length < pageSize) break;
    page++;
  }

  return allResults;
}
```

3. **Validate export before sending**:
```typescript
// Check expected vs actual count
const totalStudents = await getTotalStudentCount();
if (exportData.length !== totalStudents) {
  console.warn(`Expected ${totalStudents} but got ${exportData.length}`);
}
```

### Prevention
- Always remove limits for data exports
- Validate export completeness
- Test export with full dataset
- Log export statistics

---

### Deployment Issues

---

## [Deployment] Environment Variables Not Loading

**Date**: 2026-01-16
**Severity**: Critical
**Status**: Template

### Symptoms
- API calls fail in production
- "Undefined" errors for environment variables
- Works in development, breaks in production

### Context
- After deploying to Vercel/production
- Environment variables used in code

### Root Cause
- Environment variables not set in hosting platform
- Wrong variable names
- Or: Variables not prefixed correctly for Vite

### Solution
1. **Verify variables are set in hosting platform**:
   - Vercel: Project Settings → Environment Variables
   - Add all required variables

2. **Check variable naming for Vite** (frontend):
```typescript
// Bad: Won't work in Vite
const apiUrl = process.env.API_URL;

// Good: Must use VITE_ prefix
const apiUrl = import.meta.env.VITE_API_URL;
```

3. **Add fallbacks for critical variables**:
```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
if (!apiUrl) {
  throw new Error('VITE_API_URL is not defined');
}
```

4. **Verify in build logs**:
   - Check deployment logs for variable loading
   - Add debug log to confirm variables are loaded

### Prevention
- Document all required environment variables
- Create `.env.example` file
- Validate environment variables on app startup
- Use typed env variables (Zod schema)

---

## Template for Future Issues

```markdown
## [Category] Issue Title

**Date**: YYYY-MM-DD
**Severity**: Critical | High | Medium | Low
**Status**: Resolved | In Progress

### Symptoms
- [What went wrong]

### Context
- [When/where it occurred]

### Root Cause
- [Why it happened]

### Solution
- [How it was fixed]
- [Code examples]

### Prevention
- [How to avoid in future]

### Related Issues
- [Links to similar issues]
```

---

## Categories Reference

Use these categories for organizing issues:

- **[Build]** - Build system, Turbo, bundling
- **[TypeScript]** - Type errors, configuration
- **[Database]** - Supabase, SQL, queries
- **[Auth]** - Authentication, authorization
- **[Security]** - CORS, XSS, security vulnerabilities
- **[React]** - React-specific issues
- **[Performance]** - Speed, optimization
- **[Quiz]** - Quiz logic, scoring
- **[Export]** - Data export functionality
- **[Deployment]** - Production deployment issues
- **[UX]** - User experience issues
- **[Data]** - Data integrity, validation

---

**Last Updated**: 2026-01-16
**Version**: 1.0.0
**Status**: Template - To be populated as issues arise
