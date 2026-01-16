import { useState, useEffect } from 'react';
import {
  ArrowUpDown,
  Check,
  X,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import type { StudentResult } from '@mathevolve/types';
import { getStudentResults } from '@/services/admin.service';
import { useAuth } from '@/context/AuthContext';
import { AdminLayout } from '@/components/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Spinner,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Input,
} from '@/components/ui';

type SortField = 'studentCode' | 'preTestScore' | 'postTestScore' | 'scoreDifference';
type SortDirection = 'asc' | 'desc';

export function ResultsPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<StudentResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<StudentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('studentCode');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    const fetchResults = async () => {
      const result = await getStudentResults();
      if (result.success && result.data) {
        setResults(result.data.results);
        setFilteredResults(result.data.results);
      } else {
        setError(result.error || 'Failed to load results');
      }
      setIsLoading(false);
    };

    fetchResults();
  }, []);

  useEffect(() => {
    let filtered = results.filter((r) =>
      r.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let aVal: number | string | undefined;
      let bVal: number | string | undefined;

      switch (sortField) {
        case 'studentCode':
          aVal = a.studentCode;
          bVal = b.studentCode;
          break;
        case 'preTestScore':
          aVal = a.preTestScore ?? -1;
          bVal = b.preTestScore ?? -1;
          break;
        case 'postTestScore':
          aVal = a.postTestScore ?? -1;
          bVal = b.postTestScore ?? -1;
          break;
        case 'scoreDifference':
          aVal = a.scoreDifference ?? -999;
          bVal = b.scoreDifference ?? -999;
          break;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    setFilteredResults(filtered);
  }, [results, searchTerm, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-8 p-0 font-medium hover:bg-transparent"
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

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

  const completedBoth = results.filter(
    (r) => r.preTestScore !== undefined && r.postTestScore !== undefined
  ).length;

  return (
    <AdminLayout username={user?.username}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Test Results</h1>
            <p className="text-muted-foreground">
              View and analyze student test performance
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Both Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedBoth}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {results.length > 0
                  ? Math.round((completedBoth / results.length) * 100)
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search by student code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <span className="text-sm text-muted-foreground">
            Showing {filteredResults.length} of {results.length} students
          </span>
        </div>

        {/* Results Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortButton field="studentCode">Student Code</SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field="preTestScore">Pre-Test</SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field="postTestScore">Post-Test</SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field="scoreDifference">Difference</SortButton>
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <p className="text-muted-foreground">No results found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResults.map((result) => (
                    <TableRow key={result.studentCode}>
                      <TableCell className="font-medium">
                        {result.studentCode}
                      </TableCell>
                      <TableCell>
                        {result.preTestScore !== undefined ? (
                          <span>{result.preTestScore}%</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {result.postTestScore !== undefined ? (
                          <span>{result.postTestScore}%</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {result.scoreDifference !== undefined ? (
                          <span
                            className={`flex items-center gap-1 ${
                              result.scoreDifference > 0
                                ? 'text-green-600'
                                : result.scoreDifference < 0
                                ? 'text-red-600'
                                : ''
                            }`}
                          >
                            {result.scoreDifference > 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : result.scoreDifference < 0 ? (
                              <TrendingDown className="h-4 w-4" />
                            ) : null}
                            {result.scoreDifference > 0 ? '+' : ''}
                            {result.scoreDifference}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {result.preTestScore !== undefined &&
                        result.postTestScore !== undefined ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <Check className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        ) : result.preTestScore !== undefined ? (
                          <Badge variant="secondary">
                            Pre-Test Done
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <X className="h-3 w-3 mr-1" />
                            Not Started
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
