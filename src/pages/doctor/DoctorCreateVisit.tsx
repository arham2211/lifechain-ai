import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { visitService } from '../../services/visitService';
import type { Patient, CreateSymptomForm, CreateDiagnosisForm, CreatePrescriptionForm } from '../../types';
import { Activity, ClipboardList, CheckCircle2 } from 'lucide-react';

const doctorNavItems = [
  { path: '/doctor/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/doctor/create-visit', label: 'Create Visit', icon: <ClipboardList size={20} /> },
];

const glassCard = "glass-card rounded-3xl shadow-lg border border-slate-100";

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
      setCurrentStep('symptoms');
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
      navigate('/doctor/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save prescriptions');
    }
  };

  const steps = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'symptoms', label: 'Symptoms' },
    { key: 'diagnosis', label: 'Diagnosis' },
    { key: 'prescriptions', label: 'Prescriptions' },
  ];

  return (
    <Layout navItems={doctorNavItems} title="Doctor Portal">
      <div className="max-w-4xl mx-auto space-y-6">
        <section className={`${glassCard} p-6 lg:p-8`}>
            <div className="flex items-center justify-between">
                <div>
                <h2 className="text-2xl font-bold text-slate-900">Create Visit Record</h2>
                <p className="text-slate-600 mt-1">
                    {selectedPatient ? (
                        <span className="flex items-center gap-2">
                             Patient: <span className="font-semibold text-blue-600">{selectedPatient.first_name} {selectedPatient.last_name}</span>
                        </span>
                    ) : 'No patient selected'}
                </p>
                </div>
                <div className="text-sm text-slate-500">
                    Visit ID: {visitId || 'New'}
                </div>
            </div>
        </section>

        {/* Progress Steps */}
        <div className={`${glassCard} p-6`}>
          <div className="relative flex justify-between">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2 rounded-full"></div>
            {steps.map((step, index) => {
                const isActive = step.key === currentStep;
                const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
                
                return (
              <div key={step.key} className="flex flex-col items-center bg-white px-2">
                <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive ? 'bg-slate-900 text-white shadow-lg scale-110' : 
                        isCompleted ? 'bg-green-500 text-white' : 
                        'bg-slate-100 text-slate-400'
                    }`}
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : index + 1}
                </div>
                <p className={`text-xs mt-2 font-medium ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{step.label}</p>
              </div>
            )})}
          </div>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {/* Form Content */}
        <div className={`${glassCard} p-6 lg:p-8 min-h-[400px]`}>
          {currentStep === 'basic' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Basic Visit Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Visit Date</label>
                    <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50/50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Visit Type</label>
                    <input
                    type="text"
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value)}
                    placeholder="e.g., Follow-up, Initial Consultation"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50/50"
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Chief Complaint</label>
                <input
                  type="text"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="Main reason for visit"
                   className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                   className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50/50 resize-none"
                />
              </div>
              <div className="pt-4">
                <button
                    onClick={handleCreateBasicVisit}
                    disabled={!selectedPatient}
                    className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-lg shadow-slate-900/10"
                >
                    Create Visit & Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 'symptoms' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="text-lg font-bold text-slate-900">Symptoms</h3>
                <button
                  onClick={handleAddSymptom}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors text-sm"
                >
                  + Add Symptom
                </button>
              </div>
              
              {symptoms.length === 0 && (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-slate-500">No symptoms added yet. Click "Add Symptom" to begin.</p>
                  </div>
              )}

              {symptoms.map((symptom, index) => (
                <div key={index} className="p-5 border border-slate-200 rounded-xl space-y-4 bg-slate-50/50 relative group hover:bg-white transition-colors">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSymptoms(symptoms.filter((_, i) => i !== index))}
                        className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"
                      >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Symptom name"
                    value={symptom.symptom_name}
                    onChange={(e) => {
                      const newSymptoms = [...symptoms];
                      newSymptoms[index].symptom_name = e.target.value;
                      setSymptoms(newSymptoms);
                    }}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Severity (e.g., Mild, Moderate, Severe)"
                      value={symptom.severity}
                      onChange={(e) => {
                        const newSymptoms = [...symptoms];
                        newSymptoms[index].severity = e.target.value;
                        setSymptoms(newSymptoms);
                      }}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                       className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setCurrentStep('basic')}
                   className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveSymptoms}
                   className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 'diagnosis' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="text-lg font-bold text-slate-900">Diagnosis</h3>
                <button
                  onClick={handleAddDiagnosis}
                   className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors text-sm"
                >
                  + Add Diagnosis
                </button>
              </div>

               {diagnoses.length === 0 && (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-slate-500">No diagnosis added.</p>
                  </div>
              )}

              {diagnoses.map((diagnosis, index) => (
                <div key={index} className="p-5 border border-slate-200 rounded-xl space-y-4 bg-slate-50/50 hover:bg-white transition-colors relative group">
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setDiagnoses(diagnoses.filter((_, i) => i !== index))}
                        className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"
                      >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Disease name"
                    value={diagnosis.disease_name}
                    onChange={(e) => {
                      const newDiagnoses = [...diagnoses];
                      newDiagnoses[index].disease_name = e.target.value;
                      setDiagnoses(newDiagnoses);
                    }}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={diagnosis.status}
                      onChange={(e) => {
                        const newDiagnoses = [...diagnoses];
                        newDiagnoses[index].status = e.target.value as 'active' | 'resolved' | 'chronic';
                        setDiagnoses(newDiagnoses);
                      }}
                       className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
                       className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setCurrentStep('symptoms')}
                   className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveDiagnoses}
                   className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                >
                  Save & Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 'prescriptions' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="text-lg font-bold text-slate-900">Prescriptions</h3>
                <button
                  onClick={handleAddPrescription}
                   className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors text-sm"
                >
                  + Add Prescription
                </button>
              </div>

               {prescriptions.length === 0 && (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-slate-500">No prescriptions added.</p>
                  </div>
              )}

              {prescriptions.map((prescription, index) => (
                <div key={index} className="p-5 border border-slate-200 rounded-xl space-y-4 bg-slate-50/50 hover:bg-white transition-colors relative group">
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setPrescriptions(prescriptions.filter((_, i) => i !== index))}
                        className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"
                      >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Medication name"
                    value={prescription.medication_name}
                    onChange={(e) => {
                      const newPrescriptions = [...prescriptions];
                      newPrescriptions[index].medication_name = e.target.value;
                      setPrescriptions(newPrescriptions);
                    }}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Dosage"
                      value={prescription.dosage}
                      onChange={(e) => {
                        const newPrescriptions = [...prescriptions];
                        newPrescriptions[index].dosage = e.target.value;
                        setPrescriptions(newPrescriptions);
                      }}
                       className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                       className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                       className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setCurrentStep('diagnosis')}
                   className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSavePrescriptions}
                   className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all shadow-md"
                >
                  Finish & Complete Visit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
