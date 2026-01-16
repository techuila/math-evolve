import { api } from './api';
import type { DashboardStats, StudentResult } from '@mathevolve/types';

interface StatsResponse {
  stats: DashboardStats;
}

interface ResultsResponse {
  results: StudentResult[];
}

export async function getDashboardStats(): Promise<{
  success: boolean;
  data?: StatsResponse;
  error?: string;
}> {
  try {
    const response = await api.get<StatsResponse>('/admin/stats');

    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error?.message || 'Failed to fetch stats' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function getStudentResults(): Promise<{
  success: boolean;
  data?: ResultsResponse;
  error?: string;
}> {
  try {
    const response = await api.get<ResultsResponse>('/admin/results');

    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error?.message || 'Failed to fetch results' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function exportCSV(): Promise<{ success: boolean; error?: string }> {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch('/api/admin/export/csv', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to export CSV' };
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get('Content-Disposition');
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : `mathevolve-results-${new Date().toISOString().split('T')[0]}.csv`;

    // Download the file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

export async function exportJSON(): Promise<{ success: boolean; error?: string }> {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch('/api/admin/export/json', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to export JSON' };
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get('Content-Disposition');
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : `mathevolve-results-${new Date().toISOString().split('T')[0]}.json`;

    // Download the file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}
