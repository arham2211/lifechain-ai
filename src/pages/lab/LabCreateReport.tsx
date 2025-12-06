import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { SearchBar } from '../../components/common/SearchBar';
import { useNavigate } from 'react-router-dom';
import { labService } from '../../services/labService';
import { patientService } from '../../services/patientService';
import type { Patient, Lab, CreateTestResultForm } from '../../types';
import { Activity, FileText, AlertCircle, CheckCircle, List, Upload } from 'lucide-react';
import { useLoading, useError } from '../../utils/hooks';

const labNavItems = [
  { path: '/lab/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/lab/create-report', label: 'Create Lab Report', icon: <FileText size={20} /> },
  { path: '/lab/upload-report', label: 'Upload Report', icon: <Upload size={20} /> },
  { path: '/lab/reports', label: 'All Reports', icon: <List size={20} /> },
  { path: '/lab/abnormal', label: 'Abnormal Results', icon: <AlertCircle size={20} /> },
];

type FormStep = 'select-patient' | 'report-info' | 'add-tests' | 'complete';

export const LabCreateReport: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FormStep>('select-patient');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedLab, setSelectedLab] = useState<string>('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportType, setReportType] = useState('biochemistry');
  const [reportId, setReportId] = useState<string>('');
  const [testResults, setTestResults] = useState<CreateTestResultForm[]>([]);
  const { withLoading } = useLoading();
  const { error, setError, clearError } = useError();

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const data = await labService.getLabs();
      setLabs(data.items);
      if (data.items.length > 0) {
        setSelectedLab(data.items[0].lab_id);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load labs');
    }
  };

  const handleSearchPatients = async (query: string) => {
    if (!query) {
      setPatients([]);
      return;
    }
    try {
      clearError();
      const results = await patientService.searchPatients(query);
      setPatients(results);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to search patients');
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentStep('report-info');
  };

  const handleCreateReport = async () => {
    try {
      clearError();
      const report = await withLoading(() =>
        labService.createLabReport({
          patient_id: selectedPatient!.patient_id,
          lab_id: selectedLab,
          report_date: reportDate,
          report_type: reportType,
        })
      );
      setReportId(report.report_id);
      setCurrentStep('add-tests');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create report');
    }
  };

  const handleAddTestResult = () => {
    setTestResults([...testResults, {
      test_name: '',
      test_value: '',
      unit: '',
      reference_range: '',
      is_abnormal: false,
    }]);
  };

  const handleSaveTests = async () => {
    try {
      clearError();
      await withLoading(async () => {
        for (const test of testResults.filter(t => t.test_name && t.test_value)) {
          await labService.createTestResult(reportId, test);
        }
      });
      setCurrentStep('complete');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save test results');
    }
  };

  const handleCompleteReport = async () => {
    try {
      clearError();
      await withLoading(() => labService.completeLabReport(reportId));
      navigate('/lab/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to complete report');
    }
  };

  return (
    <Layout navItems={labNavItems} title="Lab Portal">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create Lab Report</h2>
          <p className="text-gray-600 mt-1">Workflow: Select Patient → Report Info → Add Tests → Complete</p>
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between">
            {['Select Patient', 'Report Info', 'Add Tests', 'Complete'].map((label, index) => {
              const steps: FormStep[] = ['select-patient', 'report-info', 'add-tests', 'complete'];
              const currentIndex = steps.indexOf(currentStep);
              return (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index <= currentIndex ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <p className="text-xs mt-2">{label}</p>
                  </div>
                  {index < 3 && <div className="w-16 h-0.5 bg-gray-200 mx-2"></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {currentStep === 'select-patient' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Search Patient</h3>
              <SearchBar
                placeholder="Search by name or CNIC..."
                onSearch={handleSearchPatients}
              />
              {patients.length > 0 && (
                <div className="mt-4 space-y-2">
                  {patients.map((patient) => (
                    <div
                      key={patient.patient_id}
                      onClick={() => handleSelectPatient(patient)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-600">CNIC: {patient.cnic}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 'report-info' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Report Information</h3>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Patient</p>
                <p className="font-medium">{selectedPatient?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lab Facility</label>
                <select
                  value={selectedLab}
                  onChange={(e) => setSelectedLab(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                  {labs.map((lab) => (
                    <option key={lab.lab_id} value={lab.lab_id}>
                      {lab.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Date</label>
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="biochemistry">Biochemistry</option>
                  <option value="hematology">Hematology</option>
                  <option value="radiology">Radiology</option>
                  <option value="pathology">Pathology</option>
                  <option value="microbiology">Microbiology</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep('select-patient')}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateReport}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Next: Add Test Results
                </button>
              </div>
            </div>
          )}

          {currentStep === 'add-tests' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add Test Results</h3>
                <button
                  onClick={handleAddTestResult}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Add Test
                </button>
              </div>
              {testResults.map((test, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <input
                    type="text"
                    placeholder="Test name (e.g., Glucose, HbA1c)"
                    value={test.test_name}
                    onChange={(e) => {
                      const newTests = [...testResults];
                      newTests[index].test_name = e.target.value;
                      setTestResults(newTests);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Value"
                      value={test.test_value}
                      onChange={(e) => {
                        const newTests = [...testResults];
                        newTests[index].test_value = e.target.value;
                        setTestResults(newTests);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Unit (e.g., mg/dL)"
                      value={test.unit}
                      onChange={(e) => {
                        const newTests = [...testResults];
                        newTests[index].unit = e.target.value;
                        setTestResults(newTests);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Reference range"
                      value={test.reference_range}
                      onChange={(e) => {
                        const newTests = [...testResults];
                        newTests[index].reference_range = e.target.value;
                        setTestResults(newTests);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={test.is_abnormal}
                      onChange={(e) => {
                        const newTests = [...testResults];
                        newTests[index].is_abnormal = e.target.checked;
                        setTestResults(newTests);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Mark as abnormal</span>
                  </label>
                </div>
              ))}
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep('report-info')}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveTests}
                  disabled={testResults.filter(t => t.test_name && t.test_value).length === 0}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Save Tests
                </button>
              </div>
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="space-y-4 text-center">
              <CheckCircle className="mx-auto text-green-600" size={64} />
              <h3 className="text-lg font-semibold">Test Results Saved!</h3>
              <p className="text-gray-600">Mark this report as complete or add more tests.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep('add-tests')}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Add More Tests
                </button>
                <button
                  onClick={handleCompleteReport}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Complete Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

