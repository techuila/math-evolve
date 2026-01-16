import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileCheck,
  TrendingUp,
  Download,
  BarChart3,
  ClipboardList,
} from 'lucide-react';
import type { DashboardStats } from '@mathevolve/types';
import { getDashboardStats } from '@/services/admin.service';
import { useAuth } from '@/context/AuthContext';
import { AdminLayout } from '@/components/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Spinner,
} from '@/components/ui';

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const result = await getDashboardStats();
      if (result.success && result.data) {
        setStats(result.data.stats);
      } else {
        setError(result.error || 'Failed to load dashboard stats');
      }
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout username={user?.username}>
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout username={user?.username}>
        <div className="text-center py-20">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout username={user?.username}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of MATHEVOLVE study progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
              <p className="text-xs text-muted-foreground">
                Registered in the system
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pre-Test Completed</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.preTestCompleted || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalStudents
                  ? `${Math.round((stats.preTestCompleted / stats.totalStudents) * 100)}% completion rate`
                  : 'No students yet'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Post-Test Completed</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.postTestCompleted || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalStudents
                  ? `${Math.round((stats.postTestCompleted / stats.totalStudents) * 100)}% completion rate`
                  : 'No students yet'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Pre-Test Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.averagePreScore || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Baseline assessment average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Post-Test Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.averagePostScore || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Final assessment average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Improvement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${(stats?.improvement || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(stats?.improvement || 0) >= 0 ? '+' : ''}{stats?.improvement || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Average improvement from pre to post
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link to="/admin/results">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    View Results
                  </CardTitle>
                  <CardDescription>
                    See detailed test results for all students
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/admin/export">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export Data
                  </CardTitle>
                  <CardDescription>
                    Download results in CSV or JSON format
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>

        {/* Study Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Study Progress</CardTitle>
            <CardDescription>
              Track the progress of the 60 Grade 10 students in this study
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Pre-Test Completion</span>
                  <span className="text-sm font-medium">
                    {stats?.preTestCompleted || 0} / {stats?.totalStudents || 60}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{
                      width: `${stats?.totalStudents ? (stats.preTestCompleted / stats.totalStudents) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Post-Test Completion</span>
                  <span className="text-sm font-medium">
                    {stats?.postTestCompleted || 0} / {stats?.totalStudents || 60}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{
                      width: `${stats?.totalStudents ? (stats.postTestCompleted / stats.totalStudents) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
