import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Home,
  FileText,
  User,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  studentCode?: string;
  preTestCompleted?: boolean;
  postTestCompleted?: boolean;
  onLogout?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export function Sidebar({
  studentCode,
  preTestCompleted = false,
  postTestCompleted = false,
  onLogout,
}: SidebarProps) {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      title: 'Home',
      href: '/',
      icon: Home,
    },
    {
      title: 'Pre-Test',
      href: '/pre-test',
      icon: ClipboardCheck,
      disabled: !studentCode || preTestCompleted,
    },
    {
      title: 'Topics',
      href: '/topics',
      icon: BookOpen,
      disabled: !studentCode || !preTestCompleted,
    },
    {
      title: 'Post-Test',
      href: '/post-test',
      icon: GraduationCap,
      disabled: !studentCode || !preTestCompleted || postTestCompleted,
    },
  ];

  return (
    <aside className="w-64 border-r bg-background">
      <div className="flex h-full flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">MATHEVOLVE</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map(item => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} to={item.disabled ? '#' : item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    item.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  disabled={item.disabled}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </nav>

        {studentCode && (
          <div className="border-t p-4">
            <p className="text-xs text-muted-foreground">Logged in as</p>
            <div className="flex gap-1 mt-2">
              <User className="h-4 w-4" />
              <p className="font-medium text-sm">{studentCode}</p>
              <LogOut className="cursor-pointer h-4 w-4 text-red-600 ml-2" onClick={onLogout} />
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-xs">
                <span
                  className={cn(
                    'mr-2 h-2 w-2 rounded-full',
                    preTestCompleted ? 'bg-green-500' : 'bg-yellow-500'
                  )}
                />
                Pre-Test: {preTestCompleted ? 'Completed' : 'Pending'}
              </div>
              <div className="flex items-center text-xs">
                <span
                  className={cn(
                    'mr-2 h-2 w-2 rounded-full',
                    postTestCompleted ? 'bg-green-500' : 'bg-yellow-500'
                  )}
                />
                Post-Test: {postTestCompleted ? 'Completed' : 'Pending'}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
