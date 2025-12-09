// Mock data for testing without backend
import type { Visit, LabReport, Patient, Doctor, User, TestResult, Lab } from '../types';

export const MOCK_MODE = true; // Set to false when backend is ready

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'patient@test.com',
    name: 'John Doe',
    role: 'patient',
    entity_id: 'P001',
  },
  {
    id: '2',
    email: 'doctor@test.com',
    name: 'Dr. Sarah Smith',
    role: 'doctor',
    entity_id: 'D001',
  },
  {
    id: '3',
    email: 'lab@test.com',
    name: 'Lab Technician',
    role: 'lab_staff',
    entity_id: 'L001',
  },
  {
    id: '4',
    email: 'admin@test.com',
    name: 'Admin User',
    role: 'admin',
    entity_id: 'A001',
  },
];

// Mock Patients
export const mockPatients: Patient[] = [
  {
    patient_id: 'P001',
    cnic: '12345-1234567-1',
    first_name: 'John',
    last_name: 'Doe',
    date_of_birth: '1990-05-15',
    gender: 'male',
    phone: '555-0101',
    address: '123 Main St, City, State',
    email: 'patient@test.com',
    blood_group: 'O+',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    patient_id: 'P002',
    cnic: '12345-1234567-2',
    first_name: 'Jane',
    last_name: 'Smith',
    date_of_birth: '1985-08-22',
    gender: 'female',
    phone: '555-0201',
    address: '456 Oak Ave, City, State',
    email: 'jane.smith@test.com',
    blood_group: 'A+',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Doctors
export const mockDoctors: Doctor[] = [
  {
    doctor_id: 'D001',
    name: 'Dr. Sarah Smith',
    specialization: 'Cardiology',
    license_number: 'MD12345',
    phone: '555-0301',
    email: 'doctor@test.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Labs
export const mockLabs: Lab[] = [
  {
    lab_id: 'L001',
    name: 'Central Medical Laboratory',
    location: '123 Medical Plaza, City Center',
    phone: '555-0401',
    email: 'lab@central.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    lab_id: 'L002',
    name: 'Advanced Diagnostics Lab',
    location: '456 Health Street, Downtown',
    phone: '555-0402',
    email: 'info@advanceddiag.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Visits
export const mockVisits: Visit[] = [
  {
    visit_id: 'V001',
    patient_id: 'P001',
    doctor_id: 'D001',
    visit_date: new Date().toISOString().split('T')[0],
    visit_type: 'checkup',
    chief_complaint: 'Routine checkup and blood pressure monitoring',
    diagnosis: 'Hypertension - Stage 1',
    notes: 'Patient reports occasional headaches. Blood pressure elevated. Recommended dietary changes and prescribed medication.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    patient: mockPatients[0],
    doctor: mockDoctors[0],
  },
  {
    visit_id: 'V002',
    patient_id: 'P001',
    doctor_id: 'D001',
    visit_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    visit_type: 'follow-up',
    chief_complaint: 'Follow-up visit for hypertension',
    diagnosis: 'Hypertension - improving',
    notes: 'Blood pressure showing improvement. Patient compliant with medication.',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    patient: mockPatients[0],
    doctor: mockDoctors[0],
  },
];

// Mock Lab Reports
export const mockLabReports: LabReport[] = [
  {
    report_id: 'R001',
    patient_id: 'P001',
    lab_id: 'L001',
    visit_id: 'V001',
    report_date: new Date().toISOString().split('T')[0],
    report_type: 'Complete Blood Count',
    status: 'completed',
    file_path: '/uploads/reports/R001_cbc.pdf',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    patient: mockPatients[0],
  },
  {
    report_id: 'R002',
    patient_id: 'P001',
    lab_id: 'L001',
    visit_id: 'V001',
    report_date: new Date().toISOString().split('T')[0],
    report_type: 'Lipid Panel',
    status: 'completed',
    file_path: '/uploads/reports/R002_lipid.pdf',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    patient: mockPatients[0],
  },
  {
    report_id: 'R003',
    patient_id: 'P002',
    lab_id: 'L001',
    visit_id: undefined,
    report_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    report_type: 'Hematology',
    status: 'pending',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    patient: mockPatients[1],
  },
  {
    report_id: 'R004',
    patient_id: 'P001',
    lab_id: 'L001',
    visit_id: 'V002',
    report_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    report_type: 'Biochemistry',
    status: 'completed',
    file_path: '/uploads/reports/R004_biochem.pdf',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    patient: mockPatients[0],
  },
];

// Mock Test Results (for abnormal results page)
export const mockTestResults: TestResult[] = [
  {
    result_id: 'TR001',
    test_id: 'T001',
    report_id: 'R001',
    test_name: 'Hemoglobin',
    test_value: '8.5',
    unit: 'g/dL',
    reference_range_min: '12.0',
    reference_range_max: '16.0',
    is_abnormal: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    result_id: 'TR002',
    test_id: 'T002',
    report_id: 'R001',
    test_name: 'White Blood Cells',
    test_value: '15.2',
    unit: 'x10^9/L',
    reference_range_min: '4.0',
    reference_range_max: '11.0',
    is_abnormal: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    result_id: 'TR003',
    test_id: 'T003',
    report_id: 'R002',
    test_name: 'Total Cholesterol',
    test_value: '280',
    unit: 'mg/dL',
    reference_range_min: '0',
    reference_range_max: '200',
    is_abnormal: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    result_id: 'TR004',
    test_id: 'T004',
    report_id: 'R002',
    test_name: 'LDL Cholesterol',
    test_value: '180',
    unit: 'mg/dL',
    reference_range_min: '0',
    reference_range_max: '100',
    is_abnormal: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    result_id: 'TR005',
    test_id: 'T005',
    report_id: 'R004',
    test_name: 'Blood Glucose',
    test_value: '220',
    unit: 'mg/dL',
    reference_range_min: '70',
    reference_range_max: '100',
    is_abnormal: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    result_id: 'TR006',
    test_id: 'T006',
    report_id: 'R004',
    test_name: 'Creatinine',
    test_value: '2.5',
    unit: 'mg/dL',
    reference_range_min: '0.7',
    reference_range_max: '1.3',
    is_abnormal: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Family History
export const mockFamilyHistory: Patient[] = [
  {
    patient_id: 'P003',
    cnic: '12345-1234567-3',
    first_name: 'Robert',
    last_name: "Doe",
    date_of_birth: '1960-03-10',
    gender: 'male',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    patient_id: 'P004',
    cnic: '12345-1234567-4',
    first_name: 'Mary',
    last_name: "Doe",
    date_of_birth: '1962-07-15',
    gender: 'female',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Dashboard Stats
export const mockDashboardStats = {
  patient: {
    totalVisits: 12,
    upcomingAppointments: 2,
    pendingLabReports: 1,
    activeAlerts: 3,
  },
  doctor: {
    totalPatients: 45,
    todayAppointments: 8,
    pendingReports: 5,
    completedToday: 3,
  },
  lab: {
    pendingTests: 12,
    completedToday: 8,
    urgentTests: 3,
    totalPatients: 150,
  },
  admin: {
    totalUsers: 200,
    activePatients: 150,
    activeDoctors: 25,
    totalVisitsThisMonth: 340,
  },
};
