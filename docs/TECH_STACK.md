# MATHEVOLVE - Technology Stack

## Overview
MATHEVOLVE uses a modern JavaScript-based monorepo architecture optimized for maintainability, developer experience, and research requirements.

## Monorepo Architecture

### Build System
- **Turbo** (Turborepo)
  - Fast, incremental builds
  - Efficient task orchestration
  - Shared dependency management
  - Caching for faster development

### Repository Structure
```
math-evolve/
├── apps/
│   ├── web/          # React frontend application
│   └── api/          # Fastify backend application
├── packages/
│   ├── ui/           # Shared UI components (shadcn/ui)
│   ├── config/       # Shared configuration
│   └── types/        # Shared TypeScript types
└── docs/             # Project documentation
```

## Frontend Stack

### Core Framework
- **React.js**
  - **Why**: Component-based architecture, large ecosystem, excellent for interactive UIs
  - **Version**: Latest stable (18+)
  - **Use Case**: Building student-facing learning interface and admin dashboard

### UI Components
- **shadcn/ui**
  - **Why**: Accessible, customizable, not a library but components you own
  - **Components**: Pre-built accessible UI components
  - **Styling**: Tailwind CSS-based
  - **Benefits**: Copy-paste components, full control, excellent a11y

### Styling
- **Tailwind CSS**
  - **Why**: Utility-first CSS, rapid development, small bundle size
  - **Integration**: Works seamlessly with shadcn/ui
  - **Responsive**: Mobile-first approach for accessibility

### State Management
- **React Context + Hooks** (built-in)
  - **Why**: Sufficient for MVP scope, no additional dependencies
  - **Alternative**: Consider Zustand if complexity grows

### Form Handling
- **React Hook Form**
  - **Why**: Performant, minimal re-renders, great validation support
  - **Use Case**: Quiz forms, admin forms, student ID entry

### Routing
- **React Router** or **TanStack Router**
  - **Why**: Standard routing solution for React SPAs
  - **Use Case**: Navigate between topics, quizzes, admin pages

## Backend Stack

### Core Framework
- **Fastify**
  - **Why**: Fast, low overhead, excellent TypeScript support
  - **Performance**: ~20-30% faster than Express
  - **Plugin System**: Modular architecture
  - **Validation**: Built-in schema validation

### API Architecture
- **RESTful API**
  - **Why**: Simple, well-understood, sufficient for CRUD operations
  - **Alternative**: Could add GraphQL later if needed

### Authentication
- **Fastify JWT** or **Fastify Auth**
  - **Why**: Minimal authentication for admin/teacher access
  - **Approach**: Simple token-based auth
  - **Student Access**: Pseudonymous ID-based (no authentication required)

### Validation
- **Zod** or **Ajv** (JSON Schema)
  - **Why**: Type-safe validation, shared between frontend/backend
  - **Use Case**: Validate quiz submissions, admin inputs

## Database & Backend Services

### Database
- **Supabase** (PostgreSQL)
  - **Why**: Open-source Firebase alternative, PostgreSQL-based
  - **Features**:
    - PostgreSQL database (relational, robust)
    - Built-in authentication (for admin)
    - Real-time subscriptions (optional)
    - Row-Level Security (RLS) for privacy
    - Auto-generated REST API
    - Built-in storage (if needed for content)

### Database Client
- **Supabase JavaScript Client**
  - **Why**: Official client, typed, works with TypeScript
  - **Use Case**: Connect both frontend and backend to Supabase

### ORM/Query Builder (Optional)
- **Drizzle ORM** or **Kysely**
  - **Why**: Type-safe queries, lightweight, PostgreSQL support
  - **When**: If direct SQL queries become complex

## Development Tools

### Language
- **TypeScript**
  - **Why**: Type safety, better DX, catch errors early
  - **Coverage**: 100% TypeScript across frontend and backend

### Package Manager
- **pnpm**
  - **Why**: Fast, efficient, perfect for monorepos
  - **Benefits**: Saves disk space, faster installs

### Code Quality
- **ESLint**
  - **Why**: Catch code issues, enforce standards
  - **Config**: Shared across monorepo

- **Prettier**
  - **Why**: Consistent code formatting
  - **Integration**: Works with ESLint

- **Husky + lint-staged**
  - **Why**: Pre-commit hooks for quality checks
  - **Use Case**: Run linting/formatting before commits

### Testing

#### Unit Testing
- **Vitest**
  - **Why**: Fast, Vite-native, Jest-compatible API
  - **Use Case**: Test utility functions, business logic

#### Component Testing
- **React Testing Library**
  - **Why**: Test components as users interact with them
  - **Use Case**: Test quiz components, form submissions

#### E2E Testing (Optional)
- **Playwright**
  - **Why**: Reliable, fast, multi-browser support
  - **Use Case**: Test complete user flows (pre-test → post-test)

## Infrastructure & Deployment

### Hosting Options

#### Option 1: Vercel (Recommended for MVP)
- **Frontend**: Vercel (automatic deployments)
- **Backend**: Vercel Serverless Functions or separate deployment
- **Database**: Supabase (hosted)
- **Why**: Easy setup, free tier, great DX

#### Option 2: Self-Hosted
- **Frontend**: Nginx/static hosting
- **Backend**: PM2/Docker on VPS
- **Database**: Supabase (hosted) or self-hosted PostgreSQL

### Environment Management
- **dotenv**
  - **Why**: Manage environment variables
  - **Use Case**: API keys, database URLs, secrets

## Security Considerations

### Data Protection
- **Supabase RLS** (Row-Level Security)
  - Protect student data
  - Ensure data isolation

### Input Validation
- **Schema Validation** (Zod/Ajv)
  - Prevent injection attacks
  - Validate all inputs

### Authentication
- **JWT Tokens** (for admin)
  - Secure token storage
  - HTTPS-only in production

### HTTPS
- **Enforced in Production**
  - All data transmitted over HTTPS
  - Protect student privacy

## Content Management

### Content Storage Options

#### Option 1: Database (Recommended)
- Store tutorials, formulas in PostgreSQL
- Easy to update and version

#### Option 2: Markdown Files
- Store content as .md files
- Version control with Git
- Parse and render in frontend

#### Option 3: Headless CMS (Future)
- Strapi or Payload CMS
- If non-technical users need to update content

## Analytics & Monitoring (Optional)

### Error Tracking
- **Sentry** (optional)
  - Track runtime errors
  - Monitor performance

### Usage Analytics
- **Privacy-Focused Analytics** (Plausible/Umami)
  - No personal data collection
  - Understand usage patterns

## Development Workflow

### Version Control
- **Git** + **GitHub/GitLab**
  - Feature branches
  - Pull request reviews
  - CI/CD integration

### CI/CD
- **GitHub Actions** or **GitLab CI**
  - Automated testing
  - Lint checks
  - Automated deployments

## Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Build** | Turbo | Monorepo orchestration |
| **Frontend** | React.js | UI framework |
| **UI Components** | shadcn/ui | Component library |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Backend** | Fastify | API server |
| **Database** | Supabase (PostgreSQL) | Data storage |
| **Language** | TypeScript | Type safety |
| **Package Manager** | pnpm | Dependency management |
| **Testing** | Vitest + RTL | Unit & component tests |
| **Deployment** | Vercel + Supabase | Hosting |

## Dependencies Overview

### Frontend Dependencies
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x",
  "react-hook-form": "^7.x",
  "@supabase/supabase-js": "^2.x",
  "zod": "^3.x",
  "tailwindcss": "^3.x"
}
```

### Backend Dependencies
```json
{
  "fastify": "^4.x",
  "@fastify/cors": "^8.x",
  "@fastify/jwt": "^7.x",
  "@supabase/supabase-js": "^2.x",
  "zod": "^3.x"
}
```

## Rationale for Choices

### Why React?
- Large community, extensive resources
- Perfect for interactive learning interfaces
- Students/teachers likely familiar with it

### Why Fastify?
- Performance matters for 60+ concurrent users
- Great TypeScript support
- Simple, minimal overhead

### Why Supabase?
- PostgreSQL reliability for research data
- Built-in auth reduces complexity
- Row-level security for privacy
- Free tier sufficient for MVP

### Why shadcn/ui?
- Components you own (not locked into a library)
- Excellent accessibility out of the box
- Tailwind-based for easy customization

### Why Monorepo?
- Share types between frontend/backend
- Consistent tooling and standards
- Easier to maintain as one project

---

**Last Updated**: 2026-01-16
**Version**: 1.0.0
**Status**: Initial Planning
