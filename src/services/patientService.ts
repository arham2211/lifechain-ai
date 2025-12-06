import apiClient from './api';
import type { Patient, PaginatedResponse, PatientFilters, CreatePatientForm, CompleteFamilyTree, ProgressionPrediction, Recommendation } from '../types';
import { MOCK_MODE, mockPatients, mockFamilyHistory } from './mockData';

export const patientService = {
  getPatients: async (filters: PatientFilters = {}): Promise<PaginatedResponse<Patient>> => {
    if (MOCK_MODE) {
      return {
        items: mockPatients,
        total: mockPatients.length,
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
    const response = await apiClient.get(`/patients?${params}`);
    return response.data;
  },

  getPatientById: async (patientId: string): Promise<Patient> => {
    if (MOCK_MODE) {
      return mockPatients.find(p => p.patient_id === patientId) || mockPatients[0];
    }
    const response = await apiClient.get(`/patients/${patientId}`);
    return response.data;
  },

  createPatient: async (data: CreatePatientForm): Promise<Patient> => {
    const response = await apiClient.post('/patients', data);
    return response.data;
  },

  updatePatient: async (patientId: string, data: Partial<CreatePatientForm>): Promise<Patient> => {
    const response = await apiClient.put(`/patients/${patientId}`, data);
    return response.data;
  },

  deletePatient: async (patientId: string): Promise<void> => {
    await apiClient.delete(`/patients/${patientId}`);
  },

  searchPatients: async (query: string): Promise<Patient[]> => {
    const response = await apiClient.get(`/patients/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  getCompleteFamilyTree: async (patientId: string): Promise<CompleteFamilyTree> => {
    if (MOCK_MODE) {
      return {
        patient: mockPatients[0],
        family_members: mockFamilyHistory as any,
      } as CompleteFamilyTree;
    }
    const response = await apiClient.get(`/patients/${patientId}/complete-family-tree`);
    return response.data;
  },

  predictProgression: async (patientId: string, monthsAhead: number = 6): Promise<ProgressionPrediction[]> => {
    if (MOCK_MODE) {
      return [] as ProgressionPrediction[];
    }
    const response = await apiClient.post(`/reports/patient/${patientId}/predict-progression?months_ahead=${monthsAhead}`);
    return response.data;
  },

  getRecommendations: async (patientId: string): Promise<Recommendation[]> => {
    if (MOCK_MODE) {
      return [] as Recommendation[]; // Empty for now since we don't have mock recommendations in correct format
    }
    const response = await apiClient.get(`/reports/patient/${patientId}/recommendations`);
    return response.data;
  },
};

