import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStudent } from '@/context/StudentContext';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui';
import { BookOpen, UserCircle } from 'lucide-react';

const studentCodeSchema = z.object({
  studentCode: z
    .string()
    .regex(/^STUDENT_\d{3}$/, 'Student code must be in format STUDENT_XXX (e.g., STUDENT_001)'),
});

type StudentCodeFormValues = z.infer<typeof studentCodeSchema>;

export function StudentEntryPage() {
  const { enter } = useStudent();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StudentCodeFormValues>({
    resolver: zodResolver(studentCodeSchema),
    defaultValues: {
      studentCode: '',
    },
  });

  const onSubmit = async (values: StudentCodeFormValues) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await enter(values.studentCode);

      if (result.success) {
        navigate('/topics');
      } else {
        setError(result.error || 'Failed to enter');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to MATHEVOLVE</CardTitle>
          <CardDescription>Enter your student code to begin learning</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}

              <FormField
                control={form.control}
                name="studentCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="STUDENT_001"
                        {...field}
                        onChange={e => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your assigned student code (e.g., STUDENT_001)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  'Entering...'
                ) : (
                  <>
                    <UserCircle className="mr-2 h-4 w-4" />
                    Enter
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>

        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-muted-foreground mt-1">Grade 10 Mathematics Learning Tool</p>
        </div>
      </Card>
    </div>
  );
}
