# CLAUDE.md - AI Assistant Context File

This file provides context and guidelines for AI assistants (Claude Code, GitHub Copilot, Cursor, etc.) working on the MATHEVOLVE project.

---

## Project Quick Reference

**Project Name**: MATHEVOLVE
**Purpose**: Web-based learning tool for Grade 10 Mathematics
**Tech Stack**: React + Fastify + Supabase + Turbo (Monorepo)
**Study Site**: Don Pablo Lorenzo Memorial High School
**Participants**: 60 Grade 10 students (ages 15-16)

---

## Documentation Structure

All project documentation is located in the `/docs` folder. Read these files to understand the project context:

### Core Documentation

1. **[docs/PROJECT_OVERVIEW.md](./docs/PROJECT_OVERVIEW.md)**
   - Project goals, scope, and research methodology
   - Target audience and study parameters
   - Privacy and data handling policies
   - MVP scope and success criteria
   - **Read this first** to understand the project's purpose

2. **[docs/TECH_STACK.md](./docs/TECH_STACK.md)**
   - Complete technology stack with rationale
   - Frontend: React, shadcn/ui, Tailwind CSS
   - Backend: Fastify, Supabase (PostgreSQL)
   - Build system: Turborepo, pnpm
   - Dependencies and their purposes

3. **[docs/CODE_ARCHITECTURE.md](./docs/CODE_ARCHITECTURE.md)**
   - System architecture and design patterns
   - Directory structure and organization
   - Database schema and tables
   - API design patterns
   - Security architecture
   - Component and service layer patterns

4. **[docs/IMPLEMENTATION.md](./docs/IMPLEMENTATION.md)**
   - Phase-by-phase implementation guide (11 phases)
   - Feature development workflow
   - Testing checklist before merge
   - Code review protocol
   - Risk management and success metrics

5. **[docs/ISSUES_AND_FIXES.md](./docs/ISSUES_AND_FIXES.md)**
   - Knowledge base for issues and solutions
   - Common problems and their fixes
   - **Add new issues here** when you solve them
   - Template for documenting future issues

6. **[docs/SKILLS.md](./docs/SKILLS.md)**
   - Coding standards and best practices
   - TypeScript, React, Fastify guidelines
   - Security best practices
   - Testing guidelines
   - Code review checklist
   - **Follow these standards** for all code

---

## How to Use This File

### When Starting a New Task

1. **Read relevant documentation**:
   - PROJECT_OVERVIEW.md → Understand the "why"
   - CODE_ARCHITECTURE.md → Understand the "how"
   - SKILLS.md → Follow coding standards
   - IMPLEMENTATION.md → See where the task fits in the roadmap

2. **Check existing patterns**:
   - Look at existing code in the same area
   - Follow established patterns for consistency

3. **Review similar issues**:
   - Check ISSUES_AND_FIXES.md for similar problems
   - Learn from previous solutions

### When Writing Code

1. **Follow SKILLS.md** coding standards
2. **Use shared types** from `@mathevolve/types`
3. **Write tests** for critical logic (especially scoring)
4. **Validate inputs** on both frontend and backend
5. **Think privacy-first**: Use pseudonymous student IDs

### When Solving Issues

1. **Document the solution** in ISSUES_AND_FIXES.md
2. **Use the issue template** provided in that file
3. **Include root cause and prevention tips**

### Before Merging Code

1. **Self-review** using the checklist in SKILLS.md
2. **Run all tests** (`pnpm test`)
3. **Lint code** (`pnpm lint`)
4. **Get code review** from Codex (see below)
5. **Update documentation** if needed

---

## Codex MCP (Model Context Protocol)

Codex is an AI-powered code review and testing assistant integrated via MCP. Use Codex to ensure code quality, security, and correctness.

### When to Use Codex

**Required Use Cases** (Must use Codex):

- Creating unit tests for new features
- Security audits for authentication/authorization code
- Reviewing quiz scoring logic (critical for research accuracy)
- Validating database schema changes
- Discuss with Codex: "I plan to implement [feature] by [approach]. Does this align with our architecture? Any concerns?"

**Recommended Use Cases** (Should use Codex):

- Discussing implementation approaches before coding
- Reviewing API endpoint designs
- Optimizing database queries
- Reviewing error handling patterns

**Optional Use Cases** (Can use Codex):

- Getting suggestions for code improvements
- Asking about best practices
- Debugging complex issues

### How to Use Codex

**Before Implementing a Feature**:

```
1. Read relevant documentation (docs/)
2. Sketch out your approach
3. Discuss with Codex: "I plan to implement [feature] by [approach].
   Does this align with our architecture? Any concerns?"
4. Get approval before proceeding
```

**After Implementing a Feature**:

```
1. Complete your implementation
2. Self-review using SKILLS.md checklist
3. Request Codex review: "Please review this [feature] implementation.
   Focus on: correctness, security, performance, maintainability"
4. Codex will review and create unit tests
5. Address any feedback
6. Merge after approval
```

**For Critical Code** (Quiz Scoring, Authentication, Data Export):

```
1. Implement the feature
2. Write initial tests yourself
3. Request comprehensive Codex review: "This is critical [feature].
   Please thoroughly review for edge cases, security, and accuracy"
4. Codex creates additional tests
5. Review all feedback carefully
6. Do NOT merge until Codex approves
```

### Codex Response Protocol

When Codex provides feedback:

1. **Read thoroughly** - Don't skip security warnings
2. **Address all points** - Even "minor" suggestions
3. **Ask for clarification** if feedback is unclear
4. **Update docs** if Codex identifies missing information
5. **Thank Codex** and confirm when issues are resolved

### Codex and Testing

**Unit Tests**:

- Codex will create tests for new features
- Review generated tests for completeness
- Add edge cases Codex might have missed
- Ensure 80%+ coverage for services

**Integration Tests**:

- Request Codex to review integration test coverage
- Focus on critical paths (pre-test → post-test flow)

**Security Tests**:

- Codex will check for common vulnerabilities
- MUST review: SQL injection, XSS, CSRF, authentication
- Follow all security recommendations

---

## Project-Specific Guidelines

### Privacy & Security (CRITICAL)

- **Never collect real names** - Use pseudonymous student IDs only
- **Validate all inputs** - Both frontend and backend
- **Use RLS in Supabase** - Protect student data
- **Service role key in backend only** - Never expose to frontend
- **HTTPS in production** - Encrypt all data in transit

### Quiz Scoring (CRITICAL FOR RESEARCH)

- **All scoring logic must be reviewed by Codex**
- **Write comprehensive tests** for all scoring functions
- **Test edge cases**: all correct, all wrong, partial, empty answers
- **Case-insensitive comparison** - Normalize answers
- **Whitespace trimming** - Don't penalize for extra spaces

### Data Export (CRITICAL FOR RESEARCH)

- **Must export all student records** - No pagination limits
- **Verify completeness** - Log expected vs actual count
- **CSV format must be valid** - Escape quotes, commas
- **Include all required fields** - Student ID, scores, dates
- **Test with full dataset** - Don't just test with 5 records

### Student Data Flow

```
Student enters ID → Stored in localStorage → Included in all API calls
                  ↓
            No authentication required
                  ↓
      Backend validates ID format only
                  ↓
     Results saved with pseudonymous ID
```

### Admin Data Flow

```
Admin logs in → JWT token generated → Token in Authorization header
             ↓
    Protected routes require valid token
             ↓
        RLS policies enforce access control
```

---

## Common Tasks Quick Reference

### Adding a New Page (Frontend)

1. Create page component in `apps/web/src/pages/`
2. Add route in `App.tsx`
3. Update navigation if needed
4. Follow existing page structure
5. Use shared types from `@mathevolve/types`

### Adding a New API Endpoint (Backend)

1. Create route file in `apps/api/src/routes/`
2. Create service in `apps/api/src/services/`
3. Add validation schema (Zod)
4. Register route in `app.ts`
5. Test with all edge cases
6. Get Codex review before merging

### Adding a Shared Type

1. Update `packages/types/src/index.ts`
2. Rebuild: `pnpm --filter @mathevolve/types build`
3. Import in apps: `import { Type } from '@mathevolve/types'`

### Fixing a Bug

1. Reproduce the bug locally
2. Check ISSUES_AND_FIXES.md for similar issues
3. Identify root cause
4. Fix the bug
5. Write test to prevent regression
6. Document in ISSUES_AND_FIXES.md using template
7. Get Codex review

### Adding Tests

1. Create test file next to source file (`.test.ts`)
2. Write tests using Vitest
3. Test edge cases and error conditions
4. Run tests: `pnpm test`
5. Ensure coverage is adequate
6. Get Codex to review test coverage

---

## Development Workflow

### Daily Workflow

```
1. Pull latest changes
2. Read any updated documentation
3. Review current phase in IMPLEMENTATION.md
4. Implement feature following SKILLS.md
5. Self-review using checklist
6. Get Codex review
7. Address feedback
8. Merge after approval
9. Update IMPLEMENTATION.md checklist
```

### Feature Development Workflow

```
1. Understand requirements (PROJECT_OVERVIEW.md)
2. Review architecture (CODE_ARCHITECTURE.md)
3. Discuss approach with Codex
4. Implement following SKILLS.md standards
5. Write tests (with Codex)
6. Self-review
7. Codex review
8. Address all feedback
9. Merge with clear commit message
10. Update documentation if needed
```

### Code Review Workflow (with Codex)

```
1. Submit code for review
2. Codex reviews for:
   - Correctness
   - Security vulnerabilities
   - Performance issues
   - Code quality
   - Test coverage
3. Codex creates unit tests
4. You review Codex feedback
5. Address all points
6. Confirm with Codex
7. Merge when approved
```

---

## Important Reminders

### For All AI Assistants

✅ **Always**:

- Read docs/ before starting work
- Follow SKILLS.md coding standards
- Use shared types from @mathevolve/types
- Validate all inputs
- Think privacy-first
- Write tests for critical logic
- Get Codex review before merging
- Document issues in ISSUES_AND_FIXES.md

❌ **Never**:

- Collect real student names
- Skip input validation
- Merge without Codex review (for significant changes)
- Over-engineer beyond MVP scope
- Break existing patterns without discussion
- Commit secrets or API keys
- Use `any` type in TypeScript

### Critical Code Paths (Require Codex Review)

1. **Quiz Scoring Logic** - Directly affects research validity
2. **Test Submission** - Pre/post test data must be accurate
3. **Data Export** - Must export complete, valid data
4. **Authentication** - Security-critical
5. **Student ID Handling** - Privacy-critical
6. **Database Schema Changes** - Can break existing data

### Non-Critical Changes (Codex Optional)

- UI styling tweaks
- Copy/text changes
- Adding comments
- Formatting (use Prettier instead)
- Documentation updates

---

## Getting Started Checklist

When you first start working on this project:

- [ ] Read PROJECT_OVERVIEW.md (understand the "why")
- [ ] Read TECH_STACK.md (understand the tools)
- [ ] Read CODE_ARCHITECTURE.md (understand the structure)
- [ ] Read SKILLS.md (understand coding standards)
- [ ] Skim IMPLEMENTATION.md (understand roadmap)
- [ ] Bookmark ISSUES_AND_FIXES.md (for reference)
- [ ] Understand Codex MCP usage (this file)
- [ ] Set up local environment (.env files)
- [ ] Run `pnpm install` and `pnpm dev`
- [ ] Verify health check: http://localhost:3000/health
- [ ] Verify frontend loads: http://localhost:5173

---

## Project Goals Reminder

**Primary Goal**: Create a working learning tool that enables research on pre-test vs post-test scores for 60 Grade 10 students.

**Success Criteria**:

- Students can learn Math 10 topics
- Students can take pre-test and post-test
- System accurately records scores
- Admin can export complete, valid data for analysis
- 95%+ students complete both tests
- System is privacy-conscious and secure

**Not the Goal**:

- Building a comprehensive LMS
- Gamification (beyond MVP)
- Social features
- Mobile apps (web-first)
- AI tutoring
- Complex analytics

Keep it simple, focused, and implementable.

---

## Questions?

If you're unsure about anything:

1. **Check documentation** in docs/
2. **Look for similar code** in the codebase
3. **Check ISSUES_AND_FIXES.md** for similar problems
4. **Discuss with Codex** before implementing
5. **Ask the user** if still unclear

---

## Summary for AI Assistants

**You are working on MATHEVOLVE**, a Grade 10 Mathematics learning tool for research purposes.

**Your responsibilities**:

1. Follow coding standards in docs/SKILLS.md
2. Use shared types and utilities
3. Write tests for critical logic
4. Get Codex review before merging
5. Document issues you solve
6. Keep code simple and maintainable
7. Protect student privacy

**Key principle**: **Simple, secure, privacy-first, research-focused.**

---

**Last Updated**: 2026-01-16
**Version**: 1.0.0
**Status**: Initial Setup Complete
