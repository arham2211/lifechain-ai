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
    // Use getPatients with name filter as search endpoint is not provided
    const response = await patientService.getPatients({ name: query });
    return response.items;
  },

  getCompleteFamilyTree: async (patientId: string): Promise<CompleteFamilyTree> => {
    if (MOCK_MODE) {
      return {
        patient: mockPatients[0],
        family_members: mockFamilyHistory as any,
      } as CompleteFamilyTree;
    }
    const response = await apiClient.get(`/patients/with-family-tree/list?patient_id=${patientId}`);
    // The previous implementation assumed a specific single-patient endpoint for family tree
    // The API list has /api/v1/patients/with-family-tree/list which implies a list or filter
    // We'll assume it returns the tree structure for the patient or we might need to fetch family-disease-history
    return response.data;
  },

  getFamilyDiseaseHistory: async (patientId: string): Promise<any> => {
     const response = await apiClient.get(`/patients/${patientId}/family-disease-history`);
     return response.data;
  },

  predictProgression: async (): Promise<ProgressionPrediction[]> => {
    if (MOCK_MODE) {
      return [] as ProgressionPrediction[];
    }
    return [] as ProgressionPrediction[];
    /* Endpoint not available in provided list
    const response = await apiClient.post(`/reports/patient/${patientId}/predict-progression?months_ahead=${monthsAhead}`);
    return response.data;
    */
  },

  getRecommendations: async (): Promise<Recommendation[]> => {
    if (MOCK_MODE) {
      return [] as Recommendation[]; // Empty for now since we don't have mock recommendations in correct format
    }
    return [] as Recommendation[];
    /* Endpoint not available in provided list
    const response = await apiClient.get(`/reports/patient/${patientId}/recommendations`);
    return response.data;
    */
  },
};

