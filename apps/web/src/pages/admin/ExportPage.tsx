import { useState } from 'react';
import { FileSpreadsheet, FileJson, Download, CheckCircle } from 'lucide-react';
import { exportCSV, exportJSON } from '@/services/admin.service';
import { useAuth } from '@/context/AuthContext';
import { AdminLayout } from '@/components/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from '@/components/ui';

export function ExportPage() {
  const { user } = useAuth();
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingJSON, setIsExportingJSON] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExportCSV = async () => {
    setError(null);
    setSuccess(null);
    setIsExportingCSV(true);

    const result = await exportCSV();

    if (result.success) {
      setSuccess('CSV file downloaded successfully!');
    } else {
      setError(result.error || 'Failed to export CSV');
    }

    setIsExportingCSV(false);
  };

  const handleExportJSON = async () => {
    setError(null);
    setSuccess(null);
    setIsExportingJSON(true);

    const result = await exportJSON();

    if (result.success) {
      setSuccess('JSON file downloaded successfully!');
    } else {
      setError(result.error || 'Failed to export JSON');
    }

    setIsExportingJSON(false);
  };

  return (
    <AdminLayout username={user?.username}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Export Data</h1>
          <p className="text-muted-foreground">Download student test results for analysis</p>
        </div>

        {/* Alerts */}
        {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

        {success && (
          <div className="p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {success}
          </div>
        )}

        {/* Export Options */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* CSV Export */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileSpreadsheet className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>CSV Export</CardTitle>
                  <CardDescription>Excel-compatible spreadsheet format</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>The CSV file includes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Student codes</li>
                  <li>Pre-test scores (percentage)</li>
                  <li>Post-test scores (percentage)</li>
                  <li>Score difference</li>
                  <li>Improvement percentage</li>
                  <li>Test completion dates</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleExportCSV} disabled={isExportingCSV} className="w-full">
                {isExportingCSV ? (
                  'Exporting...'
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* JSON Export */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileJson className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>JSON Export</CardTitle>
                  <CardDescription>Structured data format</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>The JSON file includes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Export metadata and summary</li>
                  <li>Complete student list</li>
                  <li>All test results with raw scores</li>
                  <li>Processed student results</li>
                  <li>Timestamps for all records</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleExportJSON}
                disabled={isExportingJSON}
                variant="outline"
                className="w-full"
              >
                {isExportingJSON ? (
                  'Exporting...'
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download JSON
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Usage Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Data Export Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">For Research Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Use the CSV format for importing into statistical software like SPSS, Excel, or
                Google Sheets. The data is formatted with headers for easy analysis.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">For Data Backup</h3>
              <p className="text-sm text-muted-foreground">
                Use the JSON format for complete data backup. This format preserves all metadata and
                can be used for data migration or archival purposes.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Privacy Notice</h3>
              <p className="text-sm text-muted-foreground">
                Exported data contains only pseudonymous student codes (e.g., STUDENT_001). No
                personally identifiable information (PII) is included in the exports.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
