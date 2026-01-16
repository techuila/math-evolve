-- MATHEVOLVE Seed Data
-- Run this after schema.sql to populate initial data

-- ============================================
-- SEED TOPICS (7 Grade 10 Mathematics Topics)
-- Based on DepEd K-12 Curriculum
-- ============================================

INSERT INTO topics (name, slug, description, order_index) VALUES
(
    'Sequences and Series',
    'sequences-series',
    'Learn about arithmetic and geometric sequences, finding terms, and calculating sums of series.',
    1
),
(
    'Polynomials',
    'polynomials',
    'Understand polynomial expressions, operations, factoring, and the remainder and factor theorems.',
    2
),
(
    'Polynomial Equations',
    'polynomial-equations',
    'Solve polynomial equations of varying degrees and understand their roots and solutions.',
    3
),
(
    'Circles',
    'circles',
    'Explore circle geometry including chords, arcs, central and inscribed angles, and tangent lines.',
    4
),
(
    'Coordinate Geometry',
    'coordinate-geometry',
    'Apply the distance formula, midpoint formula, and understand equations of circles and lines.',
    5
),
(
    'Combinatorics',
    'combinatorics',
    'Learn counting principles, permutations, and combinations for problem-solving.',
    6
),
(
    'Probability',
    'probability',
    'Understand probability concepts, compound events, and solve probability problems.',
    7
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED CONTENT (Sample tutorials for each topic)
-- ============================================

-- Sequences and Series Content
INSERT INTO content (topic_id, content_type, title, body, order_index)
SELECT id, 'tutorial', 'Introduction to Sequences',
'# What is a Sequence?

A **sequence** is an ordered list of numbers that follow a specific pattern or rule.

## Types of Sequences

1. **Arithmetic Sequence**: Each term differs by a constant value (common difference)
2. **Geometric Sequence**: Each term is multiplied by a constant value (common ratio)

## Examples

- Arithmetic: 2, 5, 8, 11, 14, ... (common difference = 3)
- Geometric: 3, 6, 12, 24, ... (common ratio = 2)', 1
FROM topics WHERE slug = 'sequences-series';

INSERT INTO content (topic_id, content_type, title, body, order_index)
SELECT id, 'formula', 'Arithmetic Sequence Formulas',
'# Arithmetic Sequence Formulas

## nth Term Formula
$$a_n = a_1 + (n-1)d$$

Where:
- $a_n$ = nth term
- $a_1$ = first term
- $n$ = term position
- $d$ = common difference

## Sum of First n Terms
$$S_n = \frac{n}{2}(a_1 + a_n)$$

or

$$S_n = \frac{n}{2}[2a_1 + (n-1)d]$$', 2
FROM topics WHERE slug = 'sequences-series';

INSERT INTO content (topic_id, content_type, title, body, order_index)
SELECT id, 'formula', 'Geometric Sequence Formulas',
'# Geometric Sequence Formulas

## nth Term Formula
$$a_n = a_1 \cdot r^{n-1}$$

Where:
- $a_n$ = nth term
- $a_1$ = first term
- $r$ = common ratio
- $n$ = term position

## Sum of First n Terms
$$S_n = a_1 \cdot \frac{1-r^n}{1-r}$$ (when $r \neq 1$)', 3
FROM topics WHERE slug = 'sequences-series';

-- Polynomials Content
INSERT INTO content (topic_id, content_type, title, body, order_index)
SELECT id, 'tutorial', 'Understanding Polynomials',
'# What is a Polynomial?

A **polynomial** is an expression consisting of variables and coefficients, using only addition, subtraction, multiplication, and non-negative integer exponents.

## Standard Form
$$P(x) = a_nx^n + a_{n-1}x^{n-1} + ... + a_1x + a_0$$

## Degree
The highest power of the variable determines the degree:
- Linear (degree 1): $3x + 2$
- Quadratic (degree 2): $x^2 - 4x + 3$
- Cubic (degree 3): $2x^3 + x^2 - 5x + 1$', 1
FROM topics WHERE slug = 'polynomials';

INSERT INTO content (topic_id, content_type, title, body, order_index)
SELECT id, 'tutorial', 'Factoring Polynomials',
'# Factoring Techniques

## 1. Common Factor
Factor out the greatest common factor (GCF)
$$6x^2 + 9x = 3x(2x + 3)$$

## 2. Difference of Squares
$$a^2 - b^2 = (a+b)(a-b)$$

## 3. Perfect Square Trinomials
$$a^2 + 2ab + b^2 = (a+b)^2$$
$$a^2 - 2ab + b^2 = (a-b)^2$$

## 4. Quadratic Trinomials
$$x^2 + bx + c = (x + p)(x + q)$$
Where $p + q = b$ and $pq = c$', 2
FROM topics WHERE slug = 'polynomials';

INSERT INTO content (topic_id, content_type, title, body, order_index)
SELECT id, 'formula', 'Remainder and Factor Theorems',
'# Important Theorems

## Remainder Theorem
When a polynomial $P(x)$ is divided by $(x - c)$, the remainder is $P(c)$.

## Factor Theorem
$(x - c)$ is a factor of $P(x)$ if and only if $P(c) = 0$.

## Example
For $P(x) = x^3 - 2x^2 - 5x + 6$:
- $P(1) = 1 - 2 - 5 + 6 = 0$
- Therefore, $(x - 1)$ is a factor', 3
FROM topics WHERE slug = 'polynomials';

-- Circles Content
INSERT INTO content (topic_id, content_type, title, body, order_index)
SELECT id, 'tutorial', 'Circle Basics',
'# Circle Fundamentals

## Key Terms
- **Radius**: Distance from center to any point on the circle
- **Diameter**: Distance across the circle through the center ($d = 2r$)
- **Chord**: Line segment with both endpoints on the circle
- **Arc**: Part of the circumference
- **Sector**: Region bounded by two radii and an arc

## Important Formulas
- Circumference: $C = 2\pi r = \pi d$
- Area: $A = \pi r^2$', 1
FROM topics WHERE slug = 'circles';

INSERT INTO content (topic_id, content_type, title, body, order_index)
SELECT id, 'formula', 'Circle Angle Theorems',
'# Angle Theorems in Circles

## Central Angle
A central angle equals the measure of its intercepted arc.

## Inscribed Angle
An inscribed angle is half the measure of its intercepted arc.
$$\text{Inscribed Angle} = \frac{1}{2} \times \text{Arc}$$

## Angle in a Semicircle
An angle inscribed in a semicircle is always 90 degrees.

## Tangent-Chord Angle
The angle between a tangent and a chord equals half the intercepted arc.', 2
FROM topics WHERE slug = 'circles';

-- Coordinate Geometry Content
INSERT INTO content (topic_id, content_type, title, body, order_index)
SELECT id, 'tutorial', 'The Coordinate Plane',
'# Coordinate Geometry Basics

## The Cartesian Plane
The coordinate plane consists of two perpendicular number lines:
- **x-axis**: horizontal line
- **y-axis**: vertical line
- **Origin**: point (0, 0) where axes intersect

## Quadrants
- Quadrant I: (+, +)
- Quadrant II: (-, +)
- Quadrant III: (-, -)
- Quadrant IV: (+, -)', 1
FROM topics WHERE slug = 'coordinate-geometry';

INSERT INTO content (topic_id, content_type, title, body, order_index)
SELECT id, 'formula', 'Distance and Midpoint Formulas',
'# Essential Formulas

## Distance Formula
Distance between points $(x_1, y_1)$ and $(x_2, y_2)$:
$$d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$$

## Midpoint Formula
Midpoint of a line segment:
$$M = \left(\frac{x_1+x_2}{2}, \frac{y_1+y_2}{2}\right)$$

## Equation of a Circle
With center $(h, k)$ and radius $r$:
$$(x-h)^2 + (y-k)^2 = r^2$$', 2
FROM topics WHERE slug = 'coordinate-geometry';

-- Combinatorics Content
INSERT INTO content (topic_id, content_type, title, body, order_index)
SELECT id, 'tutorial', 'Counting Principles',
'# Fundamental Counting Principles

## Multiplication Principle
If one event can occur in $m$ ways and another in $n$ ways, both events can occur in $m \times n$ ways.

## Addition Principle
If one event can occur in $m$ ways OR another in $n$ ways (but not both), the total ways is $m + n$.

## Example
Choosing an outfit with 3 shirts and 4 pants:
- Total combinations = $3 \times 4 = 12$', 1
FROM topics WHERE slug = 'combinatorics';

INSERT INTO content (topic_id, content_type, title, body, order_index)
SELECT id, 'formula', 'Permutations and Combinations',
'# Permutations and Combinations

## Permutations (Order Matters)
$$P(n,r) = \frac{n!}{(n-r)!}$$

## Combinations (Order Does Not Matter)
$$C(n,r) = \binom{n}{r} = \frac{n!}{r!(n-r)!}$$

## Factorial
$$n! = n \times (n-1) \times (n-2) \times ... \times 2 \times 1$$

## Examples
- Arranging 3 books from 5: $P(5,3) = 60$
- Choosing 3 books from 5: $C(5,3) = 10$', 2
FROM topics WHERE slug = 'combinatorics';

-- Probability Content
INSERT INTO content (topic_id, content_type, title, body, order_index)
SELECT id, 'tutorial', 'Introduction to Probability',
'# Probability Basics

## What is Probability?
Probability measures the likelihood of an event occurring.

$$P(E) = \frac{\text{Number of favorable outcomes}}{\text{Total number of possible outcomes}}$$

## Key Properties
- $0 \leq P(E) \leq 1$
- $P(\text{certain event}) = 1$
- $P(\text{impossible event}) = 0$
- $P(E) + P(\text{not } E) = 1$', 1
FROM topics WHERE slug = 'probability';

INSERT INTO content (topic_id, content_type, title, body, order_index)
SELECT id, 'formula', 'Probability Rules',
'# Probability Rules

## Addition Rule (OR)
For mutually exclusive events:
$$P(A \text{ or } B) = P(A) + P(B)$$

For non-mutually exclusive:
$$P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B)$$

## Multiplication Rule (AND)
For independent events:
$$P(A \text{ and } B) = P(A) \times P(B)$$

## Conditional Probability
$$P(A|B) = \frac{P(A \text{ and } B)}{P(B)}$$', 2
FROM topics WHERE slug = 'probability';

-- ============================================
-- SEED PRE-TEST AND POST-TEST QUIZZES
-- ============================================

-- Pre-Test Quiz (covers all topics)
INSERT INTO quizzes (title, quiz_type, passing_score, questions) VALUES
(
    'Pre-Test Assessment',
    'pre_test',
    60,
    '[
        {
            "id": "pre-q1",
            "questionText": "What is the 10th term of the arithmetic sequence 3, 7, 11, 15, ...?",
            "options": ["39", "43", "35", "47"],
            "correctAnswer": "39",
            "explanation": "Using a_n = a_1 + (n-1)d: a_10 = 3 + (10-1)(4) = 3 + 36 = 39"
        },
        {
            "id": "pre-q2",
            "questionText": "What is the common ratio of the geometric sequence 2, 6, 18, 54, ...?",
            "options": ["2", "3", "4", "6"],
            "correctAnswer": "3",
            "explanation": "Common ratio r = 6/2 = 18/6 = 54/18 = 3"
        },
        {
            "id": "pre-q3",
            "questionText": "Factor completely: x² - 9",
            "options": ["(x-3)(x-3)", "(x+3)(x-3)", "(x+9)(x-1)", "Cannot be factored"],
            "correctAnswer": "(x+3)(x-3)",
            "explanation": "This is a difference of squares: a² - b² = (a+b)(a-b)"
        },
        {
            "id": "pre-q4",
            "questionText": "If P(x) = x³ - 2x² - 5x + 6, what is P(1)?",
            "options": ["0", "1", "-1", "6"],
            "correctAnswer": "0",
            "explanation": "P(1) = 1 - 2 - 5 + 6 = 0, so (x-1) is a factor"
        },
        {
            "id": "pre-q5",
            "questionText": "An inscribed angle in a circle intercepts an arc of 80 degrees. What is the measure of the inscribed angle?",
            "options": ["40 degrees", "80 degrees", "160 degrees", "20 degrees"],
            "correctAnswer": "40 degrees",
            "explanation": "An inscribed angle is half the intercepted arc: 80 / 2 = 40 degrees"
        },
        {
            "id": "pre-q6",
            "questionText": "What is the distance between points (1, 2) and (4, 6)?",
            "options": ["5", "7", "25", "3"],
            "correctAnswer": "5",
            "explanation": "d = sqrt[(4-1)² + (6-2)²] = sqrt[9 + 16] = sqrt(25) = 5"
        },
        {
            "id": "pre-q7",
            "questionText": "How many ways can 5 people be arranged in a line?",
            "options": ["5", "25", "120", "60"],
            "correctAnswer": "120",
            "explanation": "5! = 5 x 4 x 3 x 2 x 1 = 120"
        },
        {
            "id": "pre-q8",
            "questionText": "In how many ways can you choose 3 students from 10 for a committee?",
            "options": ["120", "720", "30", "1000"],
            "correctAnswer": "120",
            "explanation": "C(10,3) = 10!/(3! x 7!) = 120"
        },
        {
            "id": "pre-q9",
            "questionText": "If you roll a fair die, what is the probability of getting an even number?",
            "options": ["1/6", "1/3", "1/2", "2/3"],
            "correctAnswer": "1/2",
            "explanation": "Even numbers: 2, 4, 6 (3 outcomes). P = 3/6 = 1/2"
        },
        {
            "id": "pre-q10",
            "questionText": "What is the midpoint of the segment with endpoints (2, 4) and (8, 10)?",
            "options": ["(5, 7)", "(6, 14)", "(10, 14)", "(3, 3)"],
            "correctAnswer": "(5, 7)",
            "explanation": "M = ((2+8)/2, (4+10)/2) = (5, 7)"
        }
    ]'::jsonb
);

-- Post-Test Quiz (same difficulty, different questions)
INSERT INTO quizzes (title, quiz_type, passing_score, questions) VALUES
(
    'Post-Test Assessment',
    'post_test',
    60,
    '[
        {
            "id": "post-q1",
            "questionText": "What is the 8th term of the arithmetic sequence 5, 9, 13, 17, ...?",
            "options": ["33", "37", "29", "41"],
            "correctAnswer": "33",
            "explanation": "Using a_n = a_1 + (n-1)d: a_8 = 5 + (8-1)(4) = 5 + 28 = 33"
        },
        {
            "id": "post-q2",
            "questionText": "What is the 5th term of the geometric sequence 3, 6, 12, 24, ...?",
            "options": ["48", "96", "36", "72"],
            "correctAnswer": "48",
            "explanation": "Using a_n = a_1 x r^(n-1): a_5 = 3 x 2^4 = 3 x 16 = 48"
        },
        {
            "id": "post-q3",
            "questionText": "Factor completely: x² - 16",
            "options": ["(x-4)(x-4)", "(x+4)(x-4)", "(x+8)(x-2)", "Cannot be factored"],
            "correctAnswer": "(x+4)(x-4)",
            "explanation": "This is a difference of squares: x² - 16 = (x+4)(x-4)"
        },
        {
            "id": "post-q4",
            "questionText": "If P(x) = x³ - 6x² + 11x - 6, what is P(2)?",
            "options": ["0", "2", "-2", "6"],
            "correctAnswer": "0",
            "explanation": "P(2) = 8 - 24 + 22 - 6 = 0, so (x-2) is a factor"
        },
        {
            "id": "post-q5",
            "questionText": "A central angle in a circle measures 120 degrees. What is the measure of its intercepted arc?",
            "options": ["60 degrees", "120 degrees", "240 degrees", "180 degrees"],
            "correctAnswer": "120 degrees",
            "explanation": "A central angle equals its intercepted arc"
        },
        {
            "id": "post-q6",
            "questionText": "What is the distance between points (0, 0) and (3, 4)?",
            "options": ["5", "7", "12", "1"],
            "correctAnswer": "5",
            "explanation": "d = sqrt[(3-0)² + (4-0)²] = sqrt[9 + 16] = sqrt(25) = 5"
        },
        {
            "id": "post-q7",
            "questionText": "How many ways can 4 people be arranged in a row?",
            "options": ["4", "16", "24", "12"],
            "correctAnswer": "24",
            "explanation": "4! = 4 x 3 x 2 x 1 = 24"
        },
        {
            "id": "post-q8",
            "questionText": "In how many ways can you choose 2 students from 8 for a pair?",
            "options": ["16", "28", "56", "64"],
            "correctAnswer": "28",
            "explanation": "C(8,2) = 8!/(2! x 6!) = 28"
        },
        {
            "id": "post-q9",
            "questionText": "If you flip two fair coins, what is the probability of getting two heads?",
            "options": ["1/2", "1/4", "1/3", "3/4"],
            "correctAnswer": "1/4",
            "explanation": "P(HH) = P(H) x P(H) = 1/2 x 1/2 = 1/4"
        },
        {
            "id": "post-q10",
            "questionText": "What is the center of the circle (x-3)² + (y+2)² = 25?",
            "options": ["(3, -2)", "(-3, 2)", "(3, 2)", "(-3, -2)"],
            "correctAnswer": "(3, -2)",
            "explanation": "Standard form (x-h)² + (y-k)² = r², center is (h, k) = (3, -2)"
        }
    ]'::jsonb
);

-- ============================================
-- SEED PRACTICE QUIZZES (One per topic)
-- ============================================

-- Sequences Practice Quiz
INSERT INTO quizzes (topic_id, title, quiz_type, passing_score, questions)
SELECT id, 'Sequences and Series Practice', 'practice', 70,
'[
    {
        "id": "seq-p1",
        "questionText": "What is the common difference of 4, 7, 10, 13?",
        "options": ["2", "3", "4", "5"],
        "correctAnswer": "3",
        "explanation": "d = 7 - 4 = 3"
    },
    {
        "id": "seq-p2",
        "questionText": "Find the 6th term of the sequence 2, 4, 8, 16, ...",
        "options": ["32", "64", "128", "48"],
        "correctAnswer": "64",
        "explanation": "This is a geometric sequence with r=2. a_6 = 2 x 2^5 = 64"
    },
    {
        "id": "seq-p3",
        "questionText": "What is the sum of the first 5 terms of 1, 2, 3, 4, 5?",
        "options": ["10", "15", "20", "25"],
        "correctAnswer": "15",
        "explanation": "S_5 = 5(1+5)/2 = 5(6)/2 = 15"
    }
]'::jsonb
FROM topics WHERE slug = 'sequences-series';

-- Polynomials Practice Quiz
INSERT INTO quizzes (topic_id, title, quiz_type, passing_score, questions)
SELECT id, 'Polynomials Practice', 'practice', 70,
'[
    {
        "id": "poly-p1",
        "questionText": "What is the degree of 3x⁴ - 2x² + 5x - 1?",
        "options": ["1", "2", "3", "4"],
        "correctAnswer": "4",
        "explanation": "The highest power of x is 4"
    },
    {
        "id": "poly-p2",
        "questionText": "Factor: x² + 5x + 6",
        "options": ["(x+2)(x+3)", "(x+1)(x+6)", "(x-2)(x-3)", "(x+2)(x-3)"],
        "correctAnswer": "(x+2)(x+3)",
        "explanation": "Find two numbers that add to 5 and multiply to 6: 2 and 3"
    },
    {
        "id": "poly-p3",
        "questionText": "If (x-2) is a factor of P(x), then P(2) equals:",
        "options": ["2", "0", "-2", "1"],
        "correctAnswer": "0",
        "explanation": "By the Factor Theorem, if (x-c) is a factor, then P(c) = 0"
    }
]'::jsonb
FROM topics WHERE slug = 'polynomials';

-- Circles Practice Quiz
INSERT INTO quizzes (topic_id, title, quiz_type, passing_score, questions)
SELECT id, 'Circles Practice', 'practice', 70,
'[
    {
        "id": "circ-p1",
        "questionText": "If a circle has radius 7, what is its diameter?",
        "options": ["7", "14", "21", "49"],
        "correctAnswer": "14",
        "explanation": "Diameter = 2 x radius = 2 x 7 = 14"
    },
    {
        "id": "circ-p2",
        "questionText": "An angle inscribed in a semicircle measures:",
        "options": ["45 degrees", "60 degrees", "90 degrees", "180 degrees"],
        "correctAnswer": "90 degrees",
        "explanation": "An angle inscribed in a semicircle is always a right angle (90 degrees)"
    },
    {
        "id": "circ-p3",
        "questionText": "A central angle of 60 degrees intercepts an arc of:",
        "options": ["30 degrees", "60 degrees", "120 degrees", "180 degrees"],
        "correctAnswer": "60 degrees",
        "explanation": "A central angle equals its intercepted arc"
    }
]'::jsonb
FROM topics WHERE slug = 'circles';

-- Coordinate Geometry Practice Quiz
INSERT INTO quizzes (topic_id, title, quiz_type, passing_score, questions)
SELECT id, 'Coordinate Geometry Practice', 'practice', 70,
'[
    {
        "id": "coord-p1",
        "questionText": "The point (-3, 4) is in which quadrant?",
        "options": ["I", "II", "III", "IV"],
        "correctAnswer": "II",
        "explanation": "Quadrant II has negative x and positive y"
    },
    {
        "id": "coord-p2",
        "questionText": "What is the radius of the circle (x-1)² + (y-2)² = 9?",
        "options": ["3", "9", "4.5", "81"],
        "correctAnswer": "3",
        "explanation": "r² = 9, so r = 3"
    },
    {
        "id": "coord-p3",
        "questionText": "Find the midpoint of (0, 0) and (6, 8).",
        "options": ["(3, 4)", "(6, 8)", "(12, 16)", "(2, 3)"],
        "correctAnswer": "(3, 4)",
        "explanation": "M = ((0+6)/2, (0+8)/2) = (3, 4)"
    }
]'::jsonb
FROM topics WHERE slug = 'coordinate-geometry';

-- Combinatorics Practice Quiz
INSERT INTO quizzes (topic_id, title, quiz_type, passing_score, questions)
SELECT id, 'Combinatorics Practice', 'practice', 70,
'[
    {
        "id": "comb-p1",
        "questionText": "What is 4!?",
        "options": ["4", "8", "16", "24"],
        "correctAnswer": "24",
        "explanation": "4! = 4 x 3 x 2 x 1 = 24"
    },
    {
        "id": "comb-p2",
        "questionText": "P(5,2) = ?",
        "options": ["10", "20", "25", "30"],
        "correctAnswer": "20",
        "explanation": "P(5,2) = 5!/(5-2)! = 5!/3! = 5 x 4 = 20"
    },
    {
        "id": "comb-p3",
        "questionText": "C(6,2) = ?",
        "options": ["12", "15", "30", "36"],
        "correctAnswer": "15",
        "explanation": "C(6,2) = 6!/(2! x 4!) = 30/2 = 15"
    }
]'::jsonb
FROM topics WHERE slug = 'combinatorics';

-- Probability Practice Quiz
INSERT INTO quizzes (topic_id, title, quiz_type, passing_score, questions)
SELECT id, 'Probability Practice', 'practice', 70,
'[
    {
        "id": "prob-p1",
        "questionText": "A bag has 3 red and 5 blue balls. P(red) = ?",
        "options": ["3/8", "5/8", "3/5", "1/2"],
        "correctAnswer": "3/8",
        "explanation": "P(red) = 3/(3+5) = 3/8"
    },
    {
        "id": "prob-p2",
        "questionText": "If P(A) = 0.3, then P(not A) = ?",
        "options": ["0.3", "0.7", "0.6", "1.3"],
        "correctAnswer": "0.7",
        "explanation": "P(not A) = 1 - P(A) = 1 - 0.3 = 0.7"
    },
    {
        "id": "prob-p3",
        "questionText": "For independent events A and B with P(A)=1/2 and P(B)=1/3, P(A and B) = ?",
        "options": ["1/6", "5/6", "1/2", "1/3"],
        "correctAnswer": "1/6",
        "explanation": "P(A and B) = P(A) x P(B) = 1/2 x 1/3 = 1/6"
    }
]'::jsonb
FROM topics WHERE slug = 'probability';

-- ============================================
-- SEED DEFAULT ADMIN USER
-- Password: admin123 (change in production!)
-- ============================================

-- Note: The password hash below is for 'admin123' using bcrypt with 10 rounds
-- IMPORTANT: Change this password in production!
INSERT INTO admin_users (username, password_hash, role) VALUES
('admin', '$2b$10$FYp.1.kw1W1wyadEV0gmqu7YGhpI9MPlDf4H.hQuJeHZNjxdPrRU.', 'admin')
ON CONFLICT (username) DO NOTHING;
