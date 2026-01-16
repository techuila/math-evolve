-- MATHEVOLVE Database Schema
-- Run this script in Supabase SQL Editor to create all required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STUDENTS TABLE
-- Stores pseudonymous student identifiers
-- ============================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Index for faster student code lookups
CREATE INDEX IF NOT EXISTS idx_students_student_code ON students(student_code);

-- ============================================
-- TOPICS TABLE
-- 7 Grade 10 Mathematics topics
-- ============================================
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for ordering topics
CREATE INDEX IF NOT EXISTS idx_topics_order ON topics(order_index);

-- ============================================
-- CONTENT TABLE
-- Tutorials, formulas, and step-by-step guides
-- ============================================
CREATE TABLE IF NOT EXISTS content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('formula', 'tutorial', 'step')),
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fetching content by topic
CREATE INDEX IF NOT EXISTS idx_content_topic ON content(topic_id);
CREATE INDEX IF NOT EXISTS idx_content_order ON content(topic_id, order_index);

-- ============================================
-- QUIZZES TABLE
-- Practice quizzes and pre/post tests
-- Questions stored as JSONB array
-- ============================================
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    quiz_type VARCHAR(20) NOT NULL CHECK (quiz_type IN ('practice', 'pre_test', 'post_test')),
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    passing_score INTEGER DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fetching quizzes by topic and type
CREATE INDEX IF NOT EXISTS idx_quizzes_topic ON quizzes(topic_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_type ON quizzes(quiz_type);

-- ============================================
-- QUIZ_ATTEMPTS TABLE
-- Records all quiz attempts by students
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 0,
    time_taken INTEGER, -- in seconds
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fetching attempts by student
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_completed ON quiz_attempts(completed_at);

-- ============================================
-- TEST_RESULTS TABLE
-- Pre-test and post-test results
-- Each student can only take each test type once
-- ============================================
CREATE TABLE IF NOT EXISTS test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    test_type VARCHAR(10) NOT NULL CHECK (test_type IN ('pre', 'post')),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 0,
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure each student can only take each test type once
    CONSTRAINT unique_student_test UNIQUE (student_id, test_type)
);

-- Index for fetching test results
CREATE INDEX IF NOT EXISTS idx_test_results_student ON test_results(student_id);
CREATE INDEX IF NOT EXISTS idx_test_results_type ON test_results(test_type);
CREATE INDEX IF NOT EXISTS idx_test_results_completed ON test_results(completed_at);

-- ============================================
-- ADMIN_USERS TABLE
-- Teacher and admin accounts
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'teacher' CHECK (role IN ('teacher', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for login lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for topics and content (anyone can read)
CREATE POLICY "Public read access for topics" ON topics
    FOR SELECT USING (true);

CREATE POLICY "Public read access for content" ON content
    FOR SELECT USING (true);

CREATE POLICY "Public read access for quizzes" ON quizzes
    FOR SELECT USING (true);

-- Students can be created by anyone (anonymous student ID entry)
CREATE POLICY "Anyone can create students" ON students
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access for students" ON students
    FOR SELECT USING (true);

-- Quiz attempts can be created by anyone (students taking quizzes)
CREATE POLICY "Anyone can create quiz attempts" ON quiz_attempts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access for quiz attempts" ON quiz_attempts
    FOR SELECT USING (true);

-- Test results can be created by anyone (students submitting tests)
CREATE POLICY "Anyone can create test results" ON test_results
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access for test results" ON test_results
    FOR SELECT USING (true);

-- Admin users can only be accessed with service role key
-- The backend uses service role key, so RLS doesn't apply
-- But we add policies for documentation purposes
CREATE POLICY "Service role access for admin_users" ON admin_users
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get student progress
CREATE OR REPLACE FUNCTION get_student_progress(p_student_code VARCHAR)
RETURNS TABLE (
    student_id UUID,
    pre_test_completed BOOLEAN,
    post_test_completed BOOLEAN,
    pre_test_score INTEGER,
    post_test_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        EXISTS(SELECT 1 FROM test_results tr WHERE tr.student_id = s.id AND tr.test_type = 'pre'),
        EXISTS(SELECT 1 FROM test_results tr WHERE tr.student_id = s.id AND tr.test_type = 'post'),
        (SELECT tr.score FROM test_results tr WHERE tr.student_id = s.id AND tr.test_type = 'pre'),
        (SELECT tr.score FROM test_results tr WHERE tr.student_id = s.id AND tr.test_type = 'post')
    FROM students s
    WHERE s.student_code = p_student_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
    total_students BIGINT,
    pre_test_completed BIGINT,
    post_test_completed BIGINT,
    avg_pre_score NUMERIC,
    avg_post_score NUMERIC,
    avg_improvement NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM students),
        (SELECT COUNT(DISTINCT student_id) FROM test_results WHERE test_type = 'pre'),
        (SELECT COUNT(DISTINCT student_id) FROM test_results WHERE test_type = 'post'),
        (SELECT COALESCE(AVG(score::NUMERIC / NULLIF(max_score, 0) * 100), 0) FROM test_results WHERE test_type = 'pre'),
        (SELECT COALESCE(AVG(score::NUMERIC / NULLIF(max_score, 0) * 100), 0) FROM test_results WHERE test_type = 'post'),
        (
            SELECT COALESCE(AVG(post.score::NUMERIC / NULLIF(post.max_score, 0) * 100 - pre.score::NUMERIC / NULLIF(pre.max_score, 0) * 100), 0)
            FROM test_results pre
            JOIN test_results post ON pre.student_id = post.student_id
            WHERE pre.test_type = 'pre' AND post.test_type = 'post'
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE students IS 'Stores pseudonymous student identifiers. No real names or PII.';
COMMENT ON TABLE topics IS 'Grade 10 Mathematics topics (7 topics total)';
COMMENT ON TABLE content IS 'Educational content: tutorials, formulas, and step-by-step guides';
COMMENT ON TABLE quizzes IS 'Quiz definitions including practice quizzes and pre/post tests';
COMMENT ON TABLE quiz_attempts IS 'Records of student quiz attempts for practice quizzes';
COMMENT ON TABLE test_results IS 'Pre-test and post-test results for research data collection';
COMMENT ON TABLE admin_users IS 'Teacher and admin accounts for the dashboard';

COMMENT ON COLUMN students.student_code IS 'Format: STUDENT_XXX (e.g., STUDENT_001)';
COMMENT ON COLUMN quizzes.questions IS 'JSON array of QuizQuestion objects';
COMMENT ON COLUMN test_results.test_type IS 'Either "pre" for pre-test or "post" for post-test';
