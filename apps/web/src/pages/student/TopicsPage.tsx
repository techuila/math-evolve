import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, ArrowRight } from 'lucide-react';
import type { Topic } from '@mathevolve/types';
import { getAllTopics } from '@/services/content.service';
import { useStudent } from '@/context/StudentContext';
import { StudentLayout } from '@/components/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Spinner,
  Badge,
} from '@/components/ui';

export function TopicsPage() {
  const { student, progress } = useStudent();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      const result = await getAllTopics();
      if (result.success && result.topics) {
        setTopics(result.topics);
      } else {
        setError(result.error || 'Failed to load topics');
      }
      setIsLoading(false);
    };

    fetchTopics();
  }, []);

  if (isLoading) {
    return (
      <StudentLayout
        studentCode={student?.studentCode}
        preTestCompleted={progress?.preTestCompleted}
        postTestCompleted={progress?.postTestCompleted}
      >
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout
        studentCode={student?.studentCode}
        preTestCompleted={progress?.preTestCompleted}
        postTestCompleted={progress?.postTestCompleted}
      >
        <div className="text-center py-20">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout
      studentCode={student?.studentCode}
      preTestCompleted={progress?.preTestCompleted}
      postTestCompleted={progress?.postTestCompleted}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Topics</h1>
          <p className="text-muted-foreground">
            Explore Grade 10 Mathematics topics and learn at your own pace
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, index) => (
            <Card key={topic.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Topic {index + 1}</Badge>
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="mt-2">{topic.name}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-3 flex flex-col">
                <Link to={`/topics/${topic.id}/tutorial`}>
                  <Button variant="default" className="w-full">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Start Learning
                  </Button>
                </Link>
                <Link to={`/topics/${topic.id}/quiz`}>
                  <Button variant="outline" className="w-full">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Take Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {!progress?.postTestCompleted && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Ready for the Post-Test?</CardTitle>
              <CardDescription>
                After studying all topics, take the post-test to measure your improvement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/post-test">
                <Button>Start Post-Test</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </StudentLayout>
  );
}
