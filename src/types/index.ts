// User and Authentication Types
export type UserRole = 'patient' | 'doctor' | 'lab_staff' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  entity_id: string; // patient_id, doctor_id, etc.
}

export interface ActivityItem {
  type: 'visit' | 'lab_report';
  date: string;
  title: string;
  description: string;
  status?: string;
}

export interface FamilyMemberDiagnosis {
  disease_name: string;
  // diagnosis_date: string;
  confidence_score: number;
  ml_model_used: string;
  // status: string;
  notes: string | null;
  // diagnosed_at: string;
  source: string;
  progression_stage?: string;
  assessed_date?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Patient Types
export interface Patient {
  patient_id: string;
  cnic: string;
  name?: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  phone?: string;
  address?: string;
  email?: string;
  blood_group?: string;
  father_id?: string;
  mother_id?: string;
  created_at: string;
  updated_at: string;
}

// Doctor Types
export interface Doctor {
  doctor_id: string;
  name: string;
  specialization: string;
  license_number: string;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

// Lab Types
export interface Lab {
  lab_id: string;
  name: string;
  location?: string;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface LabReport {
  report_id: string;
  patient_id: string;
  lab_id: string;
  visit_id?: string;
  report_date: string;
  report_type: string;
  status: 'pending' | 'completed';
  file_path?: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  lab?: Lab;
}

export interface TestResult {
  test_id: string;
  report_id: string;
  test_name: string;
  test_value: string;
  unit: string;
  reference_range_min: string;
  reference_range_max: string;
  result_id: string;
  is_abnormal: boolean;
  created_at: string;
  updated_at: string;
}

// Visit Types
export interface Visit {
  visit_id: string;
  visit_date: string;
  visit_type: string;
  chief_complaint: string;
  doctor_patient_id: string;
  patient_id: string;
  doctor_notes: string;
  vital_signs: any;
  created_at: string;
  updated_at: string;
}


export interface VitalSign {
  vital_id: string;
  visit_id: string;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  heart_rate?: number;
  temperature?: number;
  respiratory_rate?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  created_at: string;
  updated_at: string;
}

export interface Symptom {
  id: string;
  visit_id: string;
  symptom_name: string;
  severity: number;
  duration_days: number;
  notes: string;
  created_at: string;
}

// Diagnosis Types
export interface Diagnosis {
  diagnosis_id: string;
  visit_id: string;
  disease_name: string;
  diagnosis_date: string;
  confidence_score: number;
  ml_model_used: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface Prescription {
  prescription_id: string;
  visit_id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration_days: number;
  instructions: string;
  created_at: string;
}

export interface VisitDetails {
  visit_id: string;
  visit_date: string;
  visit_type: string;
  chief_complaint: string;
  doctor_patient_id: string;
  patient_id: string;
  doctor_notes: string;
  vital_signs: any;
  created_at: string;
  updated_at: string;
}

// Disease and Prediction Types
export interface DiseaseInfo {
  disease_id: string;
  disease_name: string;
  description?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressionPrediction {
  disease_name: string;
  predictions: {
    date: string;
    predicted_severity: number;
    confidence: number;
  }[];
  current_status: string;
  risk_level: 'low' | 'medium' | 'high';
}

export interface Recommendation {
  disease_name: string;
  recommendations: {
    category: string;
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  confidence_score: number;
  based_on_data: string;
}

// Family History Types
export interface FamilyRelationship {
  relationship_id: string;
  patient_id: string;
  relative_id: string;
  relationship_type: string;
  created_at: string;
  updated_at: string;
  relative?: Patient;
}

export interface FamilyMember {
  patient_id: string;
  name: string;
  cnic: string;
  date_of_birth: string;
  gender: string;
  relationship_path: string[];
  relationship_to_searched_patient: string;
  depth: number;
  relationship_type: string;
  total_diseases: number;
  disease_names: string[];
  diagnoses: FamilyMemberDiagnosis[];
}

export interface CompleteFamilyTree {
  patient_id: string;
  patient_name: string;
  total_blood_relatives: number;
  max_depth: number;
  relatives_with_diseases: number;
  relatives_without_diseases: number;
  family_tree: FamilyMember[];
}

// API Response Types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface APIError {
  detail: string;
}

// Filter Types
export interface PatientFilters {
  name?: string;
  cnic?: string;
  skip?: number;
  limit?: number;
}

export interface VisitFilters {
  patient_id?: string;
  doctor_id?: string;
  start_date?: string;
  end_date?: string;
  skip?: number;
  limit?: number;
}

export interface LabReportFilters {
  patient_id?: string;
  lab_id?: string;
  status?: 'pending' | 'completed';
  start_date?: string;
  end_date?: string;
  skip?: number;
  limit?: number;
}

// Form Types
export interface CreatePatientForm {
  cnic: string;
  name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  phone?: string;
  address?: string;
  email?: string;
  blood_type?: string;
  father_id?: string;
  mother_id?: string;
}

export interface CreateVisitForm {
  patient_id: string;
  doctor_id: string;
  visit_date: string;
  visit_type?: string;
  chief_complaint?: string;
  notes?: string;
}

export interface CreateVitalSignsForm {
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  heart_rate?: number;
  temperature?: number;
  respiratory_rate?: number;
  weight?: number;
  height?: number;
}

export interface CreateSymptomForm {
  symptom_name: string;
  severity: number; // Changed from string to number (1-5 scale)
  duration_days: number; // Changed from string duration to number of days
  notes?: string; // Made optional
}

export interface CreateDiagnosisForm {
  disease_name: string;
  diagnosis_date?: string; // Optional, will default to visit date
  confidence_score?: number; // For AI diagnoses
  ml_model_used?: string; // For AI diagnoses
  status: "active" | "resolved" | "chronic" | "confirmed"; // Added "confirmed"
  notes?: string;
}

export interface CreatePrescriptionForm {
  medication_name: string;
  dosage: string;
  frequency: string;
  duration_days: number;
  instructions: string;
}

export interface CreateLabReportForm {
  patient_id: string;
  lab_id: string;
  visit_id?: string;
  report_date: string;
  report_type: string;
}

export interface CreateTestResultForm {
  test_name: string;
  test_value: string;
  unit: string;
  reference_range?: string;
  is_abnormal: boolean;
}

export interface CreateDoctorForm {
  name: string;
  specialization: string;
  license_number: string;
  phone?: string;
  email?: string;
}

export interface CreateLabForm {
  name: string;
  location?: string;
  phone?: string;
  email?: string;
}

