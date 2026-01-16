import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Latex from 'react-latex-next';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calculator,
  ListOrdered,
} from 'lucide-react';
import type { Topic, Content } from '@mathevolve/types';
import { getTopicContent } from '@/services/content.service';
import { useStudent } from '@/context/StudentContext';
import { StudentLayout } from '@/components/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Spinner,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui';

const contentTypeIcons = {
  tutorial: FileText,
  formula: Calculator,
  step: ListOrdered,
};

const contentTypeLabels = {
  tutorial: 'Tutorial',
  formula: 'Formula',
  step: 'Steps',
};

export function TutorialPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { student, progress } = useStudent();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [content, setContent] = useState<Content[]>([]);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;

      const result = await getTopicContent(id);
      if (result.success && result.data) {
        setTopic(result.data.topic);
        setContent(result.data.content);
      } else {
        setError(result.error || 'Failed to load content');
      }
      setIsLoading(false);
    };

    fetchContent();
  }, [id]);

  const handleNext = () => {
    if (activeContentIndex < content.length - 1) {
      setActiveContentIndex(activeContentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (activeContentIndex > 0) {
      setActiveContentIndex(activeContentIndex - 1);
    }
  };

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

  if (error || !topic) {
    return (
      <StudentLayout
        studentCode={student?.studentCode}
        preTestCompleted={progress?.preTestCompleted}
        postTestCompleted={progress?.postTestCompleted}
      >
        <div className="text-center py-20">
          <p className="text-destructive">{error || 'Topic not found'}</p>
          <Link to="/topics">
            <Button className="mt-4">Back to Topics</Button>
          </Link>
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/topics"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Topics
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{topic.name}</h1>
            <p className="text-muted-foreground">{topic.description}</p>
          </div>
          <Link to={`/topics/${id}/quiz`}>
            <Button>Take Quiz</Button>
          </Link>
        </div>

        {content.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No content available for this topic yet.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Content Navigation Tabs */}
            <Tabs
              defaultValue="0"
              value={String(activeContentIndex)}
              onValueChange={(value: string) => setActiveContentIndex(Number(value))}
            >
              <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
                {content.map((c, index) => {
                  const Icon = contentTypeIcons[c.contentType];
                  return (
                    <TabsTrigger key={c.id} value={String(index)}>
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">{contentTypeLabels[c.contentType]}</span>
                      <span className="sm:hidden">{index + 1}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {content.map((c, index) => (
                <TabsContent key={c.id} value={String(index)}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{contentTypeLabels[c.contentType]}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {index + 1} of {content.length}
                        </span>
                      </div>
                      <CardTitle>{c.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <Latex>{formatMarkdown(c.body)}</Latex>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={activeContentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                {activeContentIndex + 1} / {content.length}
              </span>

              {activeContentIndex < content.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={() => navigate(`/topics/${id}/quiz`)}>
                  Take Quiz
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </StudentLayout>
  );
}

// Simple markdown formatter (basic implementation)
function formatMarkdown(text: string): string {
  return (
    text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(
        /\$\$([\s\S]*?)\$\$/g,
        '<div class="my-4 p-4 bg-muted rounded-lg font-mono text-center overflow-x-auto">$&</div>'
      )
      // .replace(/\$(.*?)\$/gim, '<code class="px-1 py-0.5 bg-muted rounded">$&</code>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mt-4">')
      .replace(/\n/g, '<br />')
  );
}
