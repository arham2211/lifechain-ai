import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { visitService } from '../../services/visitService';
import type { Patient, CreateSymptomForm, CreateDiagnosisForm, CreatePrescriptionForm } from '../../types';
import { Activity,ClipboardList } from 'lucide-react';

const doctorNavItems = [
  { path: '/doctor/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/doctor/create-visit', label: 'Create Visit', icon: <ClipboardList size={20} /> },
];

type FormStep = 'basic' | 'symptoms' | 'diagnosis' | 'prescriptions';

export const DoctorCreateVisit: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [visitId, setVisitId] = useState<string>('');

  // Form states
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [visitType, setVisitType] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [notes, setNotes] = useState('');

  // const [vitals, setVitals] = useState<CreateVitalSignsForm>({}); // Removed
  const [symptoms, setSymptoms] = useState<CreateSymptomForm[]>([]);
  const [diagnoses, setDiagnoses] = useState<CreateDiagnosisForm[]>([]);
  const [prescriptions, setPrescriptions] = useState<CreatePrescriptionForm[]>([]);

  useEffect(() => {
    const patientStr = localStorage.getItem('selectedPatient');
    if (patientStr) {
      setSelectedPatient(JSON.parse(patientStr));
    } else {
      setError('Please select a patient first from the dashboard');
    }
  }, []);

  const handleCreateBasicVisit = async () => {
    try {
      setError('');
      const visit = await visitService.createVisit({
        patient_id: selectedPatient!.patient_id,
        doctor_id: user!.entity_id,
        visit_date: visitDate,
        visit_type: visitType,
        chief_complaint: chiefComplaint,
        notes: notes,
      });
      setVisitId(visit.visit_id);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create visit');
    }
  };


  const handleAddSymptom = () => {
    setSymptoms([...symptoms, { symptom_name: '', severity: '', duration: '', notes: '' }]);
  };

  const handleSaveSymptoms = async () => {
    try {
      setError('');
      for (const symptom of symptoms.filter(s => s.symptom_name)) {
        await visitService.createSymptom(visitId, symptom);
      }
      setCurrentStep('diagnosis');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save symptoms');
    }
  };

  const handleAddDiagnosis = () => {
    setDiagnoses([...diagnoses, {
      disease_name: '',
      diagnosed_date: visitDate,
      severity: '',
      status: 'active',
      notes: '',
    }]);
  };

  const handleSaveDiagnoses = async () => {
    try {
      setError('');
      for (const diagnosis of diagnoses.filter(d => d.disease_name)) {
        await visitService.createDiagnosis(visitId, diagnosis);
      }
      setCurrentStep('prescriptions');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save diagnoses');
    }
  };

  const handleAddPrescription = () => {
    setPrescriptions([...prescriptions, {
      medication_name: '',
      dosage: '',
      frequency: '',
      duration: '',
      notes: '',
    }]);
  };

  const handleSavePrescriptions = async () => {
    try {
      setError('');
      for (const prescription of prescriptions.filter(p => p.medication_name)) {
        await visitService.createPrescription(visitId, prescription);
      }
      navigate('/doctor/visits');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save prescriptions');
    }
  };

  const steps = [
    { key: 'basic', label: 'Basic Info' },
    // { key: 'vitals', label: 'Vital Signs' }, // Not supported in current API
    { key: 'symptoms', label: 'Symptoms' },
    { key: 'diagnosis', label: 'Diagnosis' },
    { key: 'prescriptions', label: 'Prescriptions' },
  ];

  return (
    <Layout navItems={doctorNavItems} title="Doctor Portal">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create Visit</h2>
          <p className="text-gray-600 mt-1">
            {selectedPatient ? `Patient: ${selectedPatient.name}` : 'No patient selected'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-black rounded-lg shadow p-6">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div className={`flex flex-col items-center ${index < steps.findIndex(s => s.key === currentStep) ? 'opacity-50' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.key === currentStep ? 'bg-primary text-black' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <p className="text-xs mt-2">{step.label}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 h-0.5 bg-gray-200 mx-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {currentStep === 'basic' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Basic Visit Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visit Date</label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visit Type</label>
                <input
                  type="text"
                  value={visitType}
                  onChange={(e) => setVisitType(e.target.value)}
                  placeholder="e.g., Follow-up, Initial Consultation"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chief Complaint</label>
                <input
                  type="text"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="Main reason for visit"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <button
                onClick={handleCreateBasicVisit}
                disabled={!selectedPatient}
                className="w-full bg-primary text-black py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Next: Add Symptoms
              </button>
            </div>
          )}

          {currentStep === 'symptoms' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Symptoms (Optional)</h3>
                <button
                  onClick={handleAddSymptom}
                  className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-blue-700 text-sm"
                >
                  Add Symptom
                </button>
              </div>
              {symptoms.map((symptom, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <input
                    type="text"
                    placeholder="Symptom name"
                    value={symptom.symptom_name}
                    onChange={(e) => {
                      const newSymptoms = [...symptoms];
                      newSymptoms[index].symptom_name = e.target.value;
                      setSymptoms(newSymptoms);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Severity (e.g., Mild, Moderate, Severe)"
                      value={symptom.severity}
                      onChange={(e) => {
                        const newSymptoms = [...symptoms];
                        newSymptoms[index].severity = e.target.value;
                        setSymptoms(newSymptoms);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., 2 days)"
                      value={symptom.duration}
                      onChange={(e) => {
                        const newSymptoms = [...symptoms];
                        newSymptoms[index].duration = e.target.value;
                        setSymptoms(newSymptoms);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep('basic')}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveSymptoms}
                  className="flex-1 bg-primary text-black py-2 rounded-lg hover:bg-blue-700"
                >
                  Next: Add Diagnosis
                </button>
              </div>
            </div>
          )}

          {currentStep === 'diagnosis' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Diagnosis</h3>
                <button
                  onClick={handleAddDiagnosis}
                  className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-blue-700 text-sm"
                >
                  Add Diagnosis
                </button>
              </div>
              {diagnoses.map((diagnosis, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <input
                    type="text"
                    placeholder="Disease name"
                    value={diagnosis.disease_name}
                    onChange={(e) => {
                      const newDiagnoses = [...diagnoses];
                      newDiagnoses[index].disease_name = e.target.value;
                      setDiagnoses(newDiagnoses);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={diagnosis.status}
                      onChange={(e) => {
                        const newDiagnoses = [...diagnoses];
                        newDiagnoses[index].status = e.target.value as 'active' | 'resolved' | 'chronic';
                        setDiagnoses(newDiagnoses);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="active">Active</option>
                      <option value="chronic">Chronic</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Severity"
                      value={diagnosis.severity}
                      onChange={(e) => {
                        const newDiagnoses = [...diagnoses];
                        newDiagnoses[index].severity = e.target.value;
                        setDiagnoses(newDiagnoses);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep('symptoms')}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveDiagnoses}
                  className="flex-1 bg-primary text-black py-2 rounded-lg hover:bg-blue-700"
                >
                  Next: Add Prescriptions
                </button>
              </div>
            </div>
          )}

          {currentStep === 'prescriptions' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Prescriptions (Optional)</h3>
                <button
                  onClick={handleAddPrescription}
                  className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-blue-700 text-sm"
                >
                  Add Prescription
                </button>
              </div>
              {prescriptions.map((prescription, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <input
                    type="text"
                    placeholder="Medication name"
                    value={prescription.medication_name}
                    onChange={(e) => {
                      const newPrescriptions = [...prescriptions];
                      newPrescriptions[index].medication_name = e.target.value;
                      setPrescriptions(newPrescriptions);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Dosage"
                      value={prescription.dosage}
                      onChange={(e) => {
                        const newPrescriptions = [...prescriptions];
                        newPrescriptions[index].dosage = e.target.value;
                        setPrescriptions(newPrescriptions);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Frequency"
                      value={prescription.frequency}
                      onChange={(e) => {
                        const newPrescriptions = [...prescriptions];
                        newPrescriptions[index].frequency = e.target.value;
                        setPrescriptions(newPrescriptions);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Duration"
                      value={prescription.duration}
                      onChange={(e) => {
                        const newPrescriptions = [...prescriptions];
                        newPrescriptions[index].duration = e.target.value;
                        setPrescriptions(newPrescriptions);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep('diagnosis')}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSavePrescriptions}
                  className="flex-1 bg-green-600 text-black py-2 rounded-lg hover:bg-green-700"
                >
                  Complete Visit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

