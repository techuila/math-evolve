import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { StudentProvider } from '@/context/StudentContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StudentRoute } from '@/components/StudentRoute';

// Pages
import { HomePage } from '@/pages/HomePage';
import { StudentEntryPage } from '@/pages/student/StudentEntryPage';
import { TopicsPage } from '@/pages/student/TopicsPage';
import { TutorialPage } from '@/pages/student/TutorialPage';
import { QuizPage } from '@/pages/student/QuizPage';
import { PreTestPage } from '@/pages/student/PreTestPage';
import { PostTestPage } from '@/pages/student/PostTestPage';
import { LoginPage } from '@/pages/admin/LoginPage';
import { DashboardPage as AdminDashboardPage } from '@/pages/admin/DashboardPage';
import { ResultsPage as AdminResultsPage } from '@/pages/admin/ResultsPage';
import { ExportPage as AdminExportPage } from '@/pages/admin/ExportPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StudentProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/enter" element={<StudentEntryPage />} />

            {/* Student routes */}
            <Route
              path="/topics"
              element={
                <StudentRoute requirePreTest>
                  <TopicsPage />
                </StudentRoute>
              }
            />
            <Route
              path="/topics/:id/tutorial"
              element={
                <StudentRoute requirePreTest>
                  <TutorialPage />
                </StudentRoute>
              }
            />
            <Route
              path="/topics/:id/quiz"
              element={
                <StudentRoute requirePreTest>
                  <QuizPage />
                </StudentRoute>
              }
            />
            <Route
              path="/pre-test"
              element={
                <StudentRoute>
                  <PreTestPage />
                </StudentRoute>
              }
            />
            <Route
              path="/post-test"
              element={
                <StudentRoute requirePreTest>
                  <PostTestPage />
                </StudentRoute>
              }
            />

            {/* Admin routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/results"
              element={
                <ProtectedRoute>
                  <AdminResultsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/export"
              element={
                <ProtectedRoute>
                  <AdminExportPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </StudentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
