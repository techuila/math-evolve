# MATHEVOLVE

A web-based learning tool designed to strengthen Grade 10 students' understanding of Mathematics 10.

## Project Overview

MATHEVOLVE is a research-focused educational platform that provides interactive learning materials, quizzes, and assessments for Grade 10 Mathematics students. The project facilitates research evaluation by comparing pre-test vs post-test scores to measure learning effectiveness.

**Study Site**: Don Pablo Lorenzo Memorial High School
**Participants**: 60 Grade 10 students (ages 15-16)

## Tech Stack

- **Frontend**: React.js + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend**: Fastify + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Monorepo**: Turborepo + pnpm

## Project Structure

```
math-evolve/
├── apps/
│   ├── web/          # React frontend
│   └── api/          # Fastify backend
├── packages/
│   ├── ui/           # Shared UI components
│   ├── types/        # Shared TypeScript types
│   ├── utils/        # Shared utilities
│   └── config/       # Shared configuration
├── docs/             # Project documentation
│   ├── PROJECT_OVERVIEW.md
│   ├── TECH_STACK.md
│   ├── CODE_ARCHITECTURE.md
│   ├── IMPLEMENTATION.md
│   ├── ISSUES_AND_FIXES.md
│   └── SKILLS.md
└── README.md
```

## Documentation

### For AI Assistants (Claude, Copilot, Cursor, etc.)

**Start here**: [CLAUDE.md](./CLAUDE.md) - Central context file with guidelines for AI assistants working on this project.

### For Developers

Comprehensive project documentation is in the `/docs` directory:

- **[docs/PROJECT_OVERVIEW.md](./docs/PROJECT_OVERVIEW.md)** - Project goals, scope, and research methodology
- **[docs/TECH_STACK.md](./docs/TECH_STACK.md)** - Technology choices and rationale
- **[docs/CODE_ARCHITECTURE.md](./docs/CODE_ARCHITECTURE.md)** - System architecture and design patterns
- **[docs/IMPLEMENTATION.md](./docs/IMPLEMENTATION.md)** - Step-by-step implementation guide
- **[docs/ISSUES_AND_FIXES.md](./docs/ISSUES_AND_FIXES.md)** - Common issues and solutions
- **[docs/SKILLS.md](./docs/SKILLS.md)** - Coding standards and best practices

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Run development servers
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## Development Workflow

1. **Create a feature branch** from `main`
2. **Implement the feature** following the coding standards in `SKILLS.md`
3. **Write tests** for your code
4. **Get code review** (preferably from Codex or another developer)
5. **Merge** after approval

## Topics Covered

1. Algebra
2. Patterns & Sequences
3. Arithmetic Sequence
4. Geometric Sequence
5. Problem-Solving Sequences
6. Polynomial Division
7. Mathematical Theorems (Remainder, Factor, Rational Root)

## Features

### For Students
- Browse learning topics
- View formulas and tutorials
- Take practice quizzes
- Complete pre-test and post-test assessments

### For Teachers/Admins
- View student results
- Export data for research analysis
- Manage content (optional)

## Privacy & Security

- **Pseudonymous student IDs**: No personal information collected
- **Minimal data collection**: Only what's needed for research
- **Secure authentication**: Admin/teacher access protected
- **Row-level security**: Database access controls

## Contributing

### For AI Assistants

1. **Read [CLAUDE.md](./CLAUDE.md)** - Your guide to working on this project
2. Follow the Codex MCP protocol for code reviews
3. Document solved issues in `docs/ISSUES_AND_FIXES.md`

### For Human Developers

1. Read the documentation in `/docs` directory
2. Follow coding standards in `docs/SKILLS.md`
3. Get code review from Codex (via MCP) before merging
4. Write tests for critical logic
5. Keep it simple and focused on the MVP

## License

[To be determined]

## Contact

[To be filled in]

---

**Version**: 1.0.0
**Status**: In Development
