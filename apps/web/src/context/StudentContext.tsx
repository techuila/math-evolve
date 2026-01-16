import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Student } from '@mathevolve/types';
import * as studentService from '@/services/student.service';

interface StudentProgress {
  studentId: string;
  preTestCompleted: boolean;
  postTestCompleted: boolean;
  preTestScore?: number;
  postTestScore?: number;
}

interface StudentContextType {
  student: Student | null;
  progress: StudentProgress | null;
  isLoading: boolean;
  enter: (studentCode: string) => Promise<{ success: boolean; error?: string }>;
  exit: () => void;
  refreshProgress: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initStudent = async () => {
      const storedCode = studentService.getStoredStudentCode();

      if (storedCode && studentService.isValidStudentCode(storedCode)) {
        const result = await studentService.getStudentByCode(storedCode);
        if (result.success && result.data) {
          setStudent(result.data.student);
          setProgress(result.data.progress);
        } else {
          studentService.clearStoredStudentCode();
        }
      }

      setIsLoading(false);
    };

    initStudent();
  }, []);

  const enter = useCallback(async (studentCode: string) => {
    const result = await studentService.enterWithStudentCode(studentCode);

    if (result.success && result.data) {
      setStudent(result.data.student);
      setProgress(result.data.progress);
      return { success: true };
    }

    return { success: false, error: result.error };
  }, []);

  const exit = useCallback(() => {
    studentService.clearStoredStudentCode();
    setStudent(null);
    setProgress(null);
  }, []);

  const refreshProgress = useCallback(async () => {
    if (!student) return;

    const result = await studentService.getStudentProgress(student.studentCode);
    if (result.success && result.progress) {
      setProgress(result.progress);
    }
  }, [student]);

  const value: StudentContextType = {
    student,
    progress,
    isLoading,
    enter,
    exit,
    refreshProgress,
  };

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
