import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, ClipboardCheck, Settings } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { useStudent } from '@/context/StudentContext';

export function HomePage() {
  const { student, progress } = useStudent();

  return (
    <div className="min-h-screen bg-background flex justify-center items-center">
      <div className="container py-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">MATHEVOLVE</h1>
          <p className="text-xl text-muted-foreground mt-2">Grade 10 Mathematics Learning Tool</p>
        </div>

        {!student ? (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Get Started</CardTitle>
                <CardDescription>Enter your student code to begin learning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/enter">
                  <Button className="w-full" size="lg">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Enter as Student
                  </Button>
                </Link>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                <Link to="/admin/login">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Welcome, {student.studentCode}</CardTitle>
                <CardDescription>Continue your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        progress?.preTestCompleted ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    />
                    <span>Pre-Test: {progress?.preTestCompleted ? 'Completed' : 'Pending'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        progress?.postTestCompleted ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    />
                    <span>Post-Test: {progress?.postTestCompleted ? 'Completed' : 'Pending'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              {!progress?.preTestCompleted ? (
                <Card>
                  <CardHeader>
                    <ClipboardCheck className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Pre-Test</CardTitle>
                    <CardDescription>
                      Take the pre-test to assess your current knowledge
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/pre-test">
                      <Button className="w-full">Start Pre-Test</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <BookOpen className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Topics</CardTitle>
                      <CardDescription>Learn Grade 10 Mathematics topics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to="/topics">
                        <Button className="w-full">Browse Topics</Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {!progress?.postTestCompleted && (
                    <Card>
                      <CardHeader>
                        <GraduationCap className="h-8 w-8 text-primary mb-2" />
                        <CardTitle>Post-Test</CardTitle>
                        <CardDescription>Take the post-test when you're ready</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link to="/post-test">
                          <Button className="w-full" variant="secondary">
                            Start Post-Test
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
