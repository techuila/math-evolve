import { getAllStudentResults, getExportData } from './admin.service.js';
import { sanitizeCSV } from '@mathevolve/utils';

export interface ExportResult {
  success: boolean;
  data?: string;
  filename?: string;
  contentType?: string;
  error?: string;
}

// Export student results to CSV
export async function exportToCSV(): Promise<ExportResult> {
  try {
    const results = await getAllStudentResults();

    if (results.length === 0) {
      return { success: false, error: 'No data to export' };
    }

    // Define CSV headers
    const headers = [
      'Student Code',
      'Pre-Test Score (%)',
      'Post-Test Score (%)',
      'Score Difference',
      'Improvement (%)',
      'Pre-Test Date',
      'Post-Test Date',
    ];

    // Convert data to CSV rows
    const rows = results.map(r => [
      sanitizeCSV(r.studentCode),
      r.preTestScore !== undefined ? String(r.preTestScore) : 'N/A',
      r.postTestScore !== undefined ? String(r.postTestScore) : 'N/A',
      r.scoreDifference !== undefined ? String(r.scoreDifference) : 'N/A',
      r.improvementPercentage !== undefined ? String(r.improvementPercentage) : 'N/A',
      r.preTestDate ? r.preTestDate.toISOString() : 'N/A',
      r.postTestDate ? r.postTestDate.toISOString() : 'N/A',
    ]);

    // Build CSV string
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    const timestamp = new Date().toISOString().split('T')[0];

    return {
      success: true,
      data: csvContent,
      filename: `mathevolve-results-${timestamp}.csv`,
      contentType: 'text/csv',
    };
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return { success: false, error: 'Failed to export data' };
  }
}

// Export student results to JSON
export async function exportToJSON(): Promise<ExportResult> {
  try {
    const exportData = await getExportData();

    if (exportData.students.length === 0) {
      return { success: false, error: 'No data to export' };
    }

    const results = await getAllStudentResults();

    const jsonData = {
      exportDate: new Date().toISOString(),
      summary: {
        totalStudents: exportData.students.length,
        totalTestResults: exportData.testResults.length,
        preTestCount: exportData.testResults.filter(r => r.testType === 'pre').length,
        postTestCount: exportData.testResults.filter(r => r.testType === 'post').length,
      },
      students: exportData.students,
      testResults: exportData.testResults,
      studentResults: results.map(r => ({
        studentCode: r.studentCode,
        preTestScore: r.preTestScore ?? null,
        postTestScore: r.postTestScore ?? null,
        scoreDifference: r.scoreDifference ?? null,
        improvementPercentage: r.improvementPercentage ?? null,
        preTestDate: r.preTestDate?.toISOString() ?? null,
        postTestDate: r.postTestDate?.toISOString() ?? null,
      })),
    };

    const timestamp = new Date().toISOString().split('T')[0];

    return {
      success: true,
      data: JSON.stringify(jsonData, null, 2),
      filename: `mathevolve-results-${timestamp}.json`,
      contentType: 'application/json',
    };
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    return { success: false, error: 'Failed to export data' };
  }
}
