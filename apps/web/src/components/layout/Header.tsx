import { Link, useLocation } from 'react-router-dom';
import { BookOpen, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  studentCode?: string;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export function Header({ studentCode, isAdmin, onLogout }: HeaderProps) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto px-8">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">MATHEVOLVE</span>
          </Link>
        </div>

        <nav className="flex flex-1 items-center space-x-4">
          {!isAdminRoute && studentCode && (
            <>
              <Link to="/topics">
                <Button variant={location.pathname === '/topics' ? 'secondary' : 'ghost'} size="sm">
                  Topics
                </Button>
              </Link>
              <Link to="/pre-test">
                <Button
                  variant={location.pathname === '/pre-test' ? 'secondary' : 'ghost'}
                  size="sm"
                >
                  Pre-Test
                </Button>
              </Link>
              <Link to="/post-test">
                <Button
                  variant={location.pathname === '/post-test' ? 'secondary' : 'ghost'}
                  size="sm"
                >
                  Post-Test
                </Button>
              </Link>
            </>
          )}

          {isAdminRoute && isAdmin && (
            <>
              <Link to="/admin">
                <Button variant={location.pathname === '/admin' ? 'secondary' : 'ghost'} size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link to="/admin/results">
                <Button
                  variant={location.pathname === '/admin/results' ? 'secondary' : 'ghost'}
                  size="sm"
                >
                  Results
                </Button>
              </Link>
              <Link to="/admin/export">
                <Button
                  variant={location.pathname === '/admin/export' ? 'secondary' : 'ghost'}
                  size="sm"
                >
                  Export
                </Button>
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-2">
          {studentCode && !isAdminRoute && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{studentCode}</span>
            </div>
          )}
          {isAdmin && isAdminRoute && onLogout && (
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
