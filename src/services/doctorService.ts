import apiClient from './api';
import type {  Doctor, PaginatedResponse, CreateDoctorForm } from '../types';
import { MOCK_MODE, mockDoctors } from './mockData';

export const doctorService = {
  getDoctors: async (skip: number = 0, limit: number = 100): Promise<PaginatedResponse<Doctor>> => {
    if (MOCK_MODE) {
      return {
        items: mockDoctors,
        total: mockDoctors.length,
        skip: skip,
        limit: limit,
      };
    }
    const response = await apiClient.get(`/doctors?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  getDoctorById: async (doctorId: string): Promise<Doctor> => {
    const response = await apiClient.get(`/doctors/${doctorId}`);
    return response.data;
  },

  createDoctor: async (data: CreateDoctorForm): Promise<Doctor> => {
    const response = await apiClient.post('/doctors', data);
    return response.data;
  },

  updateDoctor: async (doctorId: string, data: Partial<CreateDoctorForm>): Promise<Doctor> => {
    const response = await apiClient.put(`/doctors/${doctorId}`, data);
    return response.data;
  },

  deleteDoctor: async (doctorId: string): Promise<void> => {
    await apiClient.delete(`/doctors/${doctorId}`);
  },

  searchDoctors: async (query: string): Promise<Doctor[]> => {
    const response = await apiClient.get(`/doctors/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};

