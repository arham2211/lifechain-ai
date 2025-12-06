import apiClient from './api';
import {
  type Visit,
  type VitalSign,
  type Symptom,
  type Diagnosis,
  type Prescription,
  type PaginatedResponse,
  type VisitFilters,
  type CreateVisitForm,
  type CreateVitalSignsForm,
  type CreateSymptomForm,
  type CreateDiagnosisForm,
  type CreatePrescriptionForm,
} from '../types';
import { MOCK_MODE, mockVisits } from './mockData';

export const visitService = {
  // Visits
  getVisits: async (filters: VisitFilters = {}): Promise<PaginatedResponse<Visit>> => {
    if (MOCK_MODE) {
      return {
        items: mockVisits,
        total: mockVisits.length,
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
    const response = await apiClient.get(`/visits?${params}`);
    return response.data;
  },

  getVisitById: async (visitId: string): Promise<Visit> => {
    if (MOCK_MODE) {
      return mockVisits.find(v => v.visit_id === visitId) || mockVisits[0];
    }
    const response = await apiClient.get(`/visits/${visitId}`);
    return response.data;
  },

  createVisit: async (data: CreateVisitForm): Promise<Visit> => {
    const response = await apiClient.post('/visits', data);
    return response.data;
  },

  updateVisit: async (visitId: string, data: Partial<CreateVisitForm>): Promise<Visit> => {
    const response = await apiClient.put(`/visits/${visitId}`, data);
    return response.data;
  },

  deleteVisit: async (visitId: string): Promise<void> => {
    await apiClient.delete(`/visits/${visitId}`);
  },

  // Vital Signs
  getVitalSigns: async (visitId: string): Promise<VitalSign[]> => {
    const response = await apiClient.get(`/visits/${visitId}/vitals`);
    return response.data;
  },

  createVitalSigns: async (visitId: string, data: CreateVitalSignsForm): Promise<VitalSign> => {
    const response = await apiClient.post(`/visits/${visitId}/vitals`, data);
    return response.data;
  },

  // Symptoms
  getSymptoms: async (visitId: string): Promise<Symptom[]> => {
    const response = await apiClient.get(`/visits/${visitId}/symptoms`);
    return response.data;
  },

  createSymptom: async (visitId: string, data: CreateSymptomForm): Promise<Symptom> => {
    const response = await apiClient.post(`/visits/${visitId}/symptoms`, data);
    return response.data;
  },

  deleteSymptom: async (visitId: string, symptomId: string): Promise<void> => {
    await apiClient.delete(`/visits/${visitId}/symptoms/${symptomId}`);
  },

  // Diagnoses
  getDiagnoses: async (visitId: string): Promise<Diagnosis[]> => {
    const response = await apiClient.get(`/visits/${visitId}/diagnoses`);
    return response.data;
  },

  createDiagnosis: async (visitId: string, data: CreateDiagnosisForm): Promise<Diagnosis> => {
    const response = await apiClient.post(`/visits/${visitId}/diagnoses`, data);
    return response.data;
  },

  deleteDiagnosis: async (visitId: string, diagnosisId: string): Promise<void> => {
    await apiClient.delete(`/visits/${visitId}/diagnoses/${diagnosisId}`);
  },

  // Prescriptions
  getPrescriptions: async (visitId: string): Promise<Prescription[]> => {
    const response = await apiClient.get(`/visits/${visitId}/prescriptions`);
    return response.data;
  },

  createPrescription: async (visitId: string, data: CreatePrescriptionForm): Promise<Prescription> => {
    const response = await apiClient.post(`/visits/${visitId}/prescriptions`, data);
    return response.data;
  },

  deletePrescription: async (visitId: string, prescriptionId: string): Promise<void> => {
    await apiClient.delete(`/visits/${visitId}/prescriptions/${prescriptionId}`);
  },
};

