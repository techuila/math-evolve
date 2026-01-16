# MATHEVOLVE - Code Architecture

## Architecture Overview

MATHEVOLVE follows a **monorepo architecture** with separation of concerns between frontend, backend, and shared packages. The architecture prioritizes simplicity, maintainability, and type safety.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │           React App (apps/web)                     │ │
│  │  • Student Learning Interface                      │ │
│  │  • Quiz/Test Interface                             │ │
│  │  • Admin Dashboard                                 │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         │ HTTPS/REST API
                         │
┌─────────────────────────────────────────────────────────┐
│              Fastify API (apps/api)                      │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  • Authentication (Admin/Teacher)                  │ │
│  │  • Content Management                              │ │
│  │  • Quiz/Test Logic                                 │ │
│  │  • Score Recording                                 │ │
│  │  • Data Export                                     │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Supabase Client
                         │
┌─────────────────────────────────────────────────────────┐
│                Supabase (PostgreSQL)                     │
│                                                          │
│  • Students Table                                        │
│  • Tests & Quizzes                                       │
│  • Scores & Results                                      │
│  • Content (Formulas, Tutorials)                         │
│  • Admin Users                                           │
└─────────────────────────────────────────────────────────┘
```

## Directory Structure

```
math-evolve/
├── apps/
│   ├── web/                          # React frontend
│   │   ├── public/                   # Static assets
│   │   ├── src/
│   │   │   ├── components/           # React components
│   │   │   │   ├── ui/              # shadcn/ui components
│   │   │   │   ├── features/        # Feature-specific components
│   │   │   │   │   ├── quiz/        # Quiz components
│   │   │   │   │   ├── tutorial/    # Tutorial components
│   │   │   │   │   └── admin/       # Admin dashboard components
│   │   │   │   └── layout/          # Layout components
│   │   │   ├── pages/               # Page components (routes)
│   │   │   │   ├── student/         # Student-facing pages
│   │   │   │   └── admin/           # Admin pages
│   │   │   ├── hooks/               # Custom React hooks
│   │   │   ├── lib/                 # Utility functions
│   │   │   ├── services/            # API service layer
│   │   │   ├── stores/              # State management (Context/Zustand)
│   │   │   ├── types/               # TypeScript types
│   │   │   ├── App.tsx              # Root component
│   │   │   └── main.tsx             # Entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── api/                          # Fastify backend
│       ├── src/
│       │   ├── routes/               # API route handlers
│       │   │   ├── auth.ts          # Authentication routes
│       │   │   ├── content.ts       # Content CRUD
│       │   │   ├── quiz.ts          # Quiz/test routes
│       │   │   ├── scores.ts        # Score recording
│       │   │   └── export.ts        # Data export
│       │   ├── services/             # Business logic
│       │   │   ├── auth.service.ts
│       │   │   ├── quiz.service.ts
│       │   │   ├── score.service.ts
│       │   │   └── export.service.ts
│       │   ├── db/                   # Database layer
│       │   │   ├── client.ts        # Supabase client
│       │   │   ├── migrations/      # Database migrations
│       │   │   └── schema.ts        # Schema definitions
│       │   ├── middleware/           # Fastify middleware
│       │   │   ├── auth.ts          # JWT verification
│       │   │   └── validation.ts    # Request validation
│       │   ├── plugins/              # Fastify plugins
│       │   ├── utils/                # Utility functions
│       │   ├── types/                # TypeScript types
│       │   ├── app.ts                # Fastify app setup
│       │   └── server.ts             # Server entry point
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── ui/                           # Shared UI components
│   │   ├── components/              # shadcn/ui components
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── types/                        # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── student.ts
│   │   │   ├── quiz.ts
│   │   │   ├── score.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── config/                       # Shared configuration
│   │   ├── eslint/
│   │   ├── typescript/
│   │   └── package.json
│   │
│   └── utils/                        # Shared utilities
│       ├── src/
│       │   ├── validation.ts
│       │   ├── formatting.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── docs/                             # Project documentation
│   ├── PROJECT_OVERVIEW.md
│   ├── TECH_STACK.md
│   ├── CODE_ARCHITECTURE.md
│   ├── IMPLEMENTATION.md
│   ├── ISSUES_AND_FIXES.md
│   └── SKILLS.md
│
├── package.json                      # Root package.json
├── pnpm-workspace.yaml              # PNPM workspace config
├── turbo.json                        # Turbo configuration
├── .gitignore
└── README.md
```

## Frontend Architecture (React App)

### Component Organization

#### 1. UI Components (`components/ui/`)
- **Source**: shadcn/ui
- **Purpose**: Reusable, accessible base components
- **Examples**: Button, Card, Input, Dialog, Select
- **Ownership**: Copy-pasted, fully customizable

#### 2. Feature Components (`components/features/`)
- **Quiz Components**: Question display, answer input, timer, results
- **Tutorial Components**: Step-by-step guides, formula displays
- **Admin Components**: Dashboard, data tables, export buttons

#### 3. Layout Components (`components/layout/`)
- **Header**: Navigation, branding
- **Sidebar**: Topic navigation for students
- **Footer**: Credits, help
- **AdminLayout**: Admin-specific layout

### Page Structure (`pages/`)

```
pages/
├── student/
│   ├── HomePage.tsx           # Landing page for students
│   ├── TopicsPage.tsx         # Browse topics
│   ├── TutorialPage.tsx       # View tutorial for a topic
│   ├── QuizPage.tsx           # Take quiz
│   ├── PreTestPage.tsx        # Pre-test assessment
│   └── PostTestPage.tsx       # Post-test assessment
│
└── admin/
    ├── DashboardPage.tsx      # Overview, statistics
    ├── StudentsPage.tsx       # Manage student IDs
    ├── ContentPage.tsx        # Manage content (optional)
    ├── ResultsPage.tsx        # View test results
    └── ExportPage.tsx         # Export data
```

### State Management

#### Local State
- **React useState**: Component-level state
- **React useReducer**: Complex component state

#### Global State
- **React Context**: User session, theme, student ID
- **Alternative**: Zustand (if complexity grows)

#### Server State
- **React Query** or **SWR** (optional)
  - Cache API responses
  - Automatic refetching
  - Optimistic updates

### Routing

```typescript
// Example routing structure
const routes = [
  // Student routes
  { path: '/', element: <HomePage /> },
  { path: '/topics', element: <TopicsPage /> },
  { path: '/topics/:topicId/tutorial', element: <TutorialPage /> },
  { path: '/topics/:topicId/quiz', element: <QuizPage /> },
  { path: '/pre-test', element: <PreTestPage /> },
  { path: '/post-test', element: <PostTestPage /> },

  // Admin routes (protected)
  { path: '/admin', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
  { path: '/admin/students', element: <ProtectedRoute><StudentsPage /></ProtectedRoute> },
  { path: '/admin/results', element: <ProtectedRoute><ResultsPage /></ProtectedRoute> },
  { path: '/admin/export', element: <ProtectedRoute><ExportPage /></ProtectedRoute> },
];
```

### Service Layer (`services/`)

```typescript
// Example: API service
export class ApiService {
  async getTopics() { /* ... */ }
  async getTutorial(topicId: string) { /* ... */ }
  async submitQuiz(quizData: QuizSubmission) { /* ... */ }
  async submitPreTest(testData: TestSubmission) { /* ... */ }
  async submitPostTest(testData: TestSubmission) { /* ... */ }
}

// Example: Auth service
export class AuthService {
  async login(credentials: LoginCredentials) { /* ... */ }
  async logout() { /* ... */ }
  getToken() { /* ... */ }
}
```

## Backend Architecture (Fastify API)

### Route Organization

```typescript
// Example route structure
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(contentRoutes, { prefix: '/api/content' });
fastify.register(quizRoutes, { prefix: '/api/quizzes' });
fastify.register(testRoutes, { prefix: '/api/tests' });
fastify.register(scoreRoutes, { prefix: '/api/scores' });
fastify.register(exportRoutes, { prefix: '/api/export' });
```

### Service Layer Pattern

```typescript
// Example: QuizService
export class QuizService {
  constructor(private db: SupabaseClient) {}

  async getQuiz(topicId: string) {
    // Fetch quiz questions from database
  }

  async submitQuiz(studentId: string, quizId: string, answers: Answer[]) {
    // Calculate score
    // Save result
    // Return feedback
  }

  async calculateScore(answers: Answer[], correctAnswers: Answer[]) {
    // Score calculation logic
  }
}
```

### Middleware Stack

```typescript
// Example middleware order
fastify.register(cors, { /* config */ });
fastify.register(helmet); // Security headers
fastify.register(rateLimit); // Rate limiting
fastify.register(jwt); // JWT authentication

// Custom middleware
fastify.addHook('onRequest', async (request, reply) => {
  // Logging, request tracking
});
```

### Authentication Flow

```
1. Admin logs in → POST /api/auth/login
2. Backend validates credentials
3. Backend generates JWT token
4. Frontend stores token (localStorage/sessionStorage)
5. Subsequent requests include token in Authorization header
6. Backend middleware validates token
7. If valid, proceed; if invalid, return 401
```

### Student Flow (No Auth)

```
1. Student enters pseudonymous ID
2. Frontend stores ID in session/localStorage
3. All quiz/test submissions include student ID
4. Backend validates ID format (no authentication)
5. Backend records results with student ID
```

## Database Architecture (Supabase/PostgreSQL)

### Core Tables

#### Students Table
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_code VARCHAR(50) UNIQUE NOT NULL, -- Pseudonymous ID
  created_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB -- Optional: age group, section
);
```

#### Topics Table
```sql
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Content Table
```sql
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id),
  content_type VARCHAR(20), -- 'formula', 'tutorial', 'step'
  title VARCHAR(200),
  body TEXT,
  metadata JSONB,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Quizzes Table
```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id),
  title VARCHAR(200),
  quiz_type VARCHAR(20), -- 'practice', 'pre_test', 'post_test'
  questions JSONB NOT NULL, -- Array of question objects
  passing_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Quiz Attempts Table
```sql
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  quiz_id UUID REFERENCES quizzes(id),
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  time_taken INTEGER, -- seconds
  completed_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);
```

#### Test Results Table (Pre/Post Tests)
```sql
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  test_type VARCHAR(10), -- 'pre' or 'post'
  quiz_id UUID REFERENCES quizzes(id),
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(student_id, test_type) -- Each student takes pre/post once
);
```

#### Admin Users Table
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'teacher',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Row-Level Security (RLS)

```sql
-- Example: Students can only read their own results
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own results"
  ON test_results
  FOR SELECT
  USING (student_id = auth.uid());

-- Admin users can view all results
CREATE POLICY "Admins can view all results"
  ON test_results
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );
```

## API Design Patterns

### RESTful Endpoints

```
GET    /api/topics                    # List all topics
GET    /api/topics/:id                # Get topic details
GET    /api/topics/:id/content        # Get topic content

GET    /api/quizzes/:id               # Get quiz questions
POST   /api/quizzes/:id/submit        # Submit quiz answers

POST   /api/tests/pre-test            # Submit pre-test
POST   /api/tests/post-test           # Submit post-test

GET    /api/admin/results             # Get all results (admin)
GET    /api/admin/export              # Export data (admin)
POST   /api/auth/login                # Admin login
POST   /api/auth/logout               # Admin logout
```

### Request/Response Patterns

```typescript
// Request
POST /api/quizzes/:id/submit
{
  "studentId": "STUDENT_123",
  "answers": [
    { "questionId": "q1", "answer": "A" },
    { "questionId": "q2", "answer": "B" }
  ]
}

// Response
{
  "success": true,
  "data": {
    "score": 8,
    "maxScore": 10,
    "percentage": 80,
    "feedback": "Great job!"
  }
}
```

### Error Handling

```typescript
// Consistent error response format
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid student ID format",
    "details": { /* ... */ }
  }
}
```

## Security Architecture

### Defense Layers

1. **Input Validation**: Zod schemas on all inputs
2. **Authentication**: JWT for admin routes
3. **Authorization**: RLS policies in Supabase
4. **Rate Limiting**: Prevent abuse
5. **CORS**: Restrict origins
6. **HTTPS**: Encrypt data in transit
7. **SQL Injection Prevention**: Parameterized queries
8. **XSS Prevention**: Input sanitization

### Privacy Protection

- **Pseudonymous IDs**: No real names required
- **Minimal Data**: Only collect what's needed for research
- **Data Isolation**: RLS ensures students see only their data
- **Secure Export**: Admin-only, encrypted exports

## Testing Architecture

### Unit Tests
- **Services**: Test business logic in isolation
- **Utilities**: Test helper functions
- **Coverage Target**: 80%+

### Component Tests
- **React Components**: Test user interactions
- **Form Submissions**: Test validation and submission
- **Coverage Target**: 70%+

### Integration Tests
- **API Routes**: Test request/response cycles
- **Database Operations**: Test CRUD operations
- **Coverage Target**: 60%+

### E2E Tests (Optional)
- **User Flows**: Complete pre-test → learning → post-test
- **Admin Workflows**: Login → view results → export
- **Critical Paths Only**: Focus on research requirements

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Lazy load routes
- **Asset Optimization**: Compress images, minify CSS/JS
- **Caching**: Service worker for offline support (optional)

### Backend Optimization
- **Database Indexing**: Index frequently queried fields
- **Connection Pooling**: Reuse database connections
- **Response Caching**: Cache static content

### Scalability
- **Current**: Designed for 60 concurrent users
- **Future**: Can scale horizontally if needed

## Deployment Architecture

### Development
```
Local Development → Hot Reload → Turbo Dev Server
```

### Staging
```
Git Push → CI/CD → Run Tests → Deploy to Staging → Manual QA
```

### Production
```
Git Tag → CI/CD → Run Tests → Build → Deploy to Production → Monitor
```

---

**Last Updated**: 2026-01-16
**Version**: 1.0.0
**Status**: Initial Planning
