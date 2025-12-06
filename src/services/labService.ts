import apiClient from './api';
import {
  type Lab,
  type LabReport,
  type TestResult,
  type PaginatedResponse,
  type LabReportFilters,
  type CreateLabForm,
  type CreateLabReportForm,
  type CreateTestResultForm,
} from '../types';
import { MOCK_MODE, mockLabReports, mockTestResults, mockLabs } from './mockData';

export const labService = {
  // Labs
  getLabs: async (skip: number = 0, limit: number = 100): Promise<PaginatedResponse<Lab>> => {
    if (MOCK_MODE) {
      return {
        items: mockLabs,
        total: mockLabs.length,
        skip: skip,
        limit: limit,
      };
    }
    const response = await apiClient.get(`/labs?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  getLabById: async (labId: string): Promise<Lab> => {
    const response = await apiClient.get(`/labs/${labId}`);
    return response.data;
  },

  createLab: async (data: CreateLabForm): Promise<Lab> => {
    const response = await apiClient.post('/labs', data);
    return response.data;
  },

  updateLab: async (labId: string, data: Partial<CreateLabForm>): Promise<Lab> => {
    const response = await apiClient.put(`/labs/${labId}`, data);
    return response.data;
  },

  deleteLab: async (labId: string): Promise<void> => {
    await apiClient.delete(`/labs/${labId}`);
  },

  // Lab Reports
  getLabReports: async (filters: LabReportFilters = {}): Promise<PaginatedResponse<LabReport>> => {
    if (MOCK_MODE) {
      return {
        items: mockLabReports,
        total: mockLabReports.length,
        skip: filters.skip || 0,
        limit: filters.limit || 100,
      };
    }
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    const response = await apiClient.get(`/labs/reports?${params}`);
    return response.data;
  },

  getLabReportById: async (reportId: string): Promise<LabReport> => {
    if (MOCK_MODE) {
      return mockLabReports.find(r => r.report_id === reportId) || mockLabReports[0];
    }
    const response = await apiClient.get(`/labs/reports/${reportId}`);
    return response.data;
  },

  createLabReport: async (data: CreateLabReportForm): Promise<LabReport> => {
    const response = await apiClient.post('/labs/reports', data);
    return response.data;
  },

  updateLabReport: async (reportId: string, data: Partial<CreateLabReportForm>): Promise<LabReport> => {
    const response = await apiClient.put(`/labs/reports/${reportId}`, data);
    return response.data;
  },

  deleteLabReport: async (reportId: string): Promise<void> => {
    await apiClient.delete(`/labs/reports/${reportId}`);
  },

  completeLabReport: async (reportId: string): Promise<LabReport> => {
    const response = await apiClient.patch(`/labs/reports/${reportId}/complete`);
    return response.data;
  },

  // Test Results
  getTestResults: async (reportId: string): Promise<TestResult[]> => {
    const response = await apiClient.get(`/labs/reports/${reportId}/tests`);
    return response.data;
  },

  createTestResult: async (reportId: string, data: CreateTestResultForm): Promise<TestResult> => {
    const response = await apiClient.post(`/labs/reports/${reportId}/tests`, data);
    return response.data;
  },

  deleteTestResult: async (reportId: string, testId: string): Promise<void> => {
    await apiClient.delete(`/labs/reports/${reportId}/tests/${testId}`);
  },

  // Abnormal Results
  getAbnormalResults: async (): Promise<TestResult[]> => {
    if (MOCK_MODE) {
      return mockTestResults;
    }
    const response = await apiClient.get('/labs/tests/abnormal');
    return response.data;
  },
};

