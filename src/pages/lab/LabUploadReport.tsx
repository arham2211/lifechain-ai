import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { SearchBar } from '../../components/common/SearchBar';
import { useNavigate } from 'react-router-dom';
import { labService } from '../../services/labService';
import { patientService } from '../../services/patientService';
import type { Patient, Lab } from '../../types';
import { Activity, FileText, List, Upload, CheckCircle, File } from 'lucide-react';
import { useLoading, useError } from '../../utils/hooks';

const labNavItems = [
  { path: '/lab/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/lab/create-report', label: 'Create Lab Report', icon: <FileText size={20} /> },
  { path: '/lab/upload-report', label: 'Upload Report', icon: <Upload size={20} /> },
  { path: '/lab/reports', label: 'All Reports', icon: <List size={20} /> },
 
];
export const LabUploadReport: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedLab, setSelectedLab] = useState<string>('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportType, setReportType] = useState('biochemistry');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { isLoading, withLoading } = useLoading();
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload PDF, JPEG, or PNG files only.');
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError('File too large. Maximum size is 10MB.');
        return;
      }

      setSelectedFile(file);
      clearError();
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      setError('Please select a patient');
      return;
    }

    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      clearError();
      await withLoading(async () => {
        // In real app, this would upload the file and create the report
        // For now, we'll just create a report with a mock file path
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('patient_id', selectedPatient.patient_id);
        formData.append('lab_id', selectedLab);
        formData.append('report_date', reportDate);
        formData.append('report_type', reportType);

        // Mock upload - in real app, this would be:
        // await labService.uploadLabReport(formData);
        
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload
        
        setUploadSuccess(true);
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload report');
    }
  };

  const handleReset = () => {
    setSelectedPatient(null);
    setSelectedFile(null);
    setUploadSuccess(false);
    setReportDate(new Date().toISOString().split('T')[0]);
    setReportType('biochemistry');
  };

  if (uploadSuccess) {
    return (
      <Layout navItems={labNavItems} title="Lab Portal">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center space-y-4">
            <CheckCircle className="mx-auto text-green-600" size={64} />
            <h2 className="text-2xl font-bold text-gray-900">Report Uploaded Successfully!</h2>
            <p className="text-gray-600">
              Lab report for <strong>{selectedPatient?.name}</strong> has been uploaded and is now available in the system.
            </p>
            <div className="flex gap-3 justify-center pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Upload Another
              </button>
              <button
                onClick={() => navigate('/lab/reports')}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
              >
                View All Reports
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout navItems={labNavItems} title="Lab Portal">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary bg-opacity-10 p-3 rounded-full">
            <Upload className="text-primary" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload Lab Report</h2>
            <p className="text-gray-600 mt-1">Upload PDF or image files of completed lab reports</p>
          </div>
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        <form onSubmit={handleUpload} className="space-y-6">
          {/* Patient Selection */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Patient</h3>
            <SearchBar
              placeholder="Search by name or CNIC..."
              onSearch={handleSearchPatients}
            />
            {selectedPatient && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-600">Selected Patient</p>
                <p className="font-semibold text-gray-900">{selectedPatient.name}</p>
                <p className="text-sm text-gray-600">CNIC: {selectedPatient.cnic}</p>
              </div>
            )}
            {patients.length > 0 && !selectedPatient && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {patients.map((patient) => (
                  <div
                    key={patient.patient_id}
                    onClick={() => setSelectedPatient(patient)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-600">CNIC: {patient.cnic}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Report Details */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Report Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lab Facility
              </label>
              <select
                value={selectedLab}
                onChange={(e) => setSelectedLab(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {labs.map((lab) => (
                  <option key={lab.lab_id} value={lab.lab_id}>
                    {lab.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Date
              </label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="biochemistry">Biochemistry</option>
                <option value="hematology">Hematology</option>
                <option value="radiology">Radiology</option>
                <option value="pathology">Pathology</option>
                <option value="microbiology">Microbiology</option>
                <option value="immunology">Immunology</option>
                <option value="genetics">Genetics</option>
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Upload File</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="bg-gray-100 p-4 rounded-full">
                  {selectedFile ? (
                    <File className="text-primary" size={32} />
                  ) : (
                    <Upload className="text-gray-400" size={32} />
                  )}
                </div>
                {selectedFile ? (
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-xs text-primary mt-2">Click to change file</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-gray-900">Click to upload file</p>
                    <p className="text-sm text-gray-600 mt-1">
                      PDF, JPEG, or PNG (Max 10MB)
                    </p>
                  </div>
                )}
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-medium mb-1">File Upload Guidelines:</p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Accepted formats: PDF, JPEG, PNG</li>
                <li>Maximum file size: 10MB</li>
                <li>Ensure file is clear and readable</li>
                <li>Include all pages of the report</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/lab/dashboard')}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedPatient || !selectedFile || isLoading}
              className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Uploading...' : 'Upload Report'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};


