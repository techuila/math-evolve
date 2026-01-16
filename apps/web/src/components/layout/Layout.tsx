import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useStudent } from '@/context/StudentContext';

interface LayoutProps {
  noHeader?: boolean;
  children: React.ReactNode;
  studentCode?: string;
  isAdmin?: boolean;
  onLogout: () => void;
  showSidebar?: boolean;
  preTestCompleted?: boolean;
  postTestCompleted?: boolean;
}

export function Layout({
  noHeader,
  children,
  studentCode,
  isAdmin,
  onLogout,
  showSidebar = false,
  preTestCompleted,
  postTestCompleted,
}: LayoutProps) {
  const { logout: clearAuth } = useAuth();
  const { exit } = useStudent();

  const handleLogout = () => {
    clearAuth();
    exit();
    onLogout();
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {!noHeader && <Header studentCode={studentCode} isAdmin={isAdmin} onLogout={onLogout} />}

      <div className="flex-1 flex">
        {showSidebar && (
          <Sidebar
            onLogout={handleLogout}
            studentCode={studentCode}
            preTestCompleted={preTestCompleted}
            postTestCompleted={postTestCompleted}
          />
        )}

        <main className={`flex-1 container ${isAdmin ? 'mx-auto' : ''} p-6`}>{children}</main>
      </div>

      <Footer isAdmin />
    </div>
  );
}

export function AdminLayout({
  children,
  username,
}: {
  children: React.ReactNode;
  username?: string;
}) {
  const navigate = useNavigate();
  return (
    <Layout isAdmin onLogout={() => onLogout(navigate)} studentCode={username}>
      {children}
    </Layout>
  );
}

export function StudentLayout({
  children,
  studentCode,
  preTestCompleted,
  postTestCompleted,
}: {
  children: React.ReactNode;
  studentCode?: string;
  preTestCompleted?: boolean;
  postTestCompleted?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <Layout
      noHeader
      studentCode={studentCode}
      showSidebar={!!studentCode}
      preTestCompleted={preTestCompleted}
      postTestCompleted={postTestCompleted}
      onLogout={() => onLogout(navigate)}
    >
      {children}
    </Layout>
  );
}

function onLogout(navigate: NavigateFunction) {
  localStorage.clear();
  navigate('/');
}
