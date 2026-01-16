import { Navigate, useLocation } from 'react-router-dom';
import { useStudent } from '@/context/StudentContext';
import { Spinner } from '@/components/ui';

interface StudentRouteProps {
  children: React.ReactNode;
  requirePreTest?: boolean;
}

export function StudentRoute({ children, requirePreTest = false }: StudentRouteProps) {
  const { student, progress, isLoading } = useStudent();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!student) {
    return <Navigate to="/enter" state={{ from: location }} replace />;
  }

  if (requirePreTest && !progress?.preTestCompleted) {
    return <Navigate to="/pre-test" replace />;
  }

  return <>{children}</>;
}
