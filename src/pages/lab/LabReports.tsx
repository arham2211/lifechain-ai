import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { DataTable, type Column } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import type { LabReport } from '../../types';
import { Activity, FileText, AlertCircle, List, Download, Eye, Upload, Edit } from 'lucide-react';
import { formatDate, getStatusColor } from '../../utils/formatters';
import { useLoading, useError } from '../../utils/hooks';

const labNavItems = [
  { path: '/lab/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/lab/create-report', label: 'Create Lab Report', icon: <FileText size={20} /> },
  { path: '/lab/upload-report', label: 'Upload Report', icon: <Upload size={20} /> },
  { path: '/lab/reports', label: 'All Reports', icon: <List size={20} /> },
  { path: '/lab/abnormal', label: 'Abnormal Results', icon: <AlertCircle size={20} /> },
];

// Hardcoded lab ID as specified
const HARDCODED_LAB_ID = 'f7147fcf-e65a-465e-afee-c1fe482cbd10';

// Type for patient data from API
interface PatientData {
  id: string;
  first_name: string;
  last_name: string;
  cnic: string;
  phone: string;
  // Add other fields as needed based on your API response
}

export const LabReports: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<LabReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<LabReport[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [, setPatientDataMap] = useState<Record<string, PatientData>>({});
  const { isLoading, withLoading } = useLoading();
  const { error, setError, clearError } = useError();



  // Function to fetch patient data
  const fetchPatientData = async (patientId: string): Promise<PatientData | null> => {
    try {
      const response = await fetch(
        `http://0.0.0.0:8001/api/v1/patients/${patientId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${yourToken}`,
          },
        }
      );

      if (!response.ok) {
        console.warn(`Failed to fetch patient data for ID: ${patientId}`);
        return null;
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching patient data:', err);
      return null;
    }
  };

  // Function to fetch all patient data for the reports
  const fetchAllPatientData = async (reportData: any[]) => {
    const patientIds = Array.from(new Set(reportData.map(item => item.patient_id)));
    const patientMap: Record<string, PatientData> = {};
    
    // Fetch patient data for each unique patient ID
    for (const patientId of patientIds) {
      const patientData = await fetchPatientData(patientId);
      if (patientData) {
        patientMap[patientId] = patientData;
      }
    }
    
    setPatientDataMap(patientMap);
    return patientMap;
  };

  const fetchReports = async () => {
    try {
      clearError();
      await withLoading(async () => {
        // Use the provided API endpoint directly
        const response = await fetch(
          `http://0.0.0.0:8001/api/v1/labs/reports?skip=0&limit=100&lab_id=${HARDCODED_LAB_ID}&lang=en`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Add authorization header if needed
              // 'Authorization': `Bearer ${yourToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Fetch patient data for all reports
        const patientMap = await fetchAllPatientData(data);
        
        // Transform the API response to match the LabReport type
        const transformedReports = data.map((item: any) => {
          const patientData = patientMap[item.patient_id];
          
          return {
            report_id: item.report_id,
            patient_id: item.patient_id,
            lab_id: item.lab_id,
            visit_id: item.visit_id,
            report_date: item.report_date,
            report_type: item.report_type,
            status: item.status,
            file_path: item.pdf_url, // Map pdf_url to file_path
            test_name: item.test_name,
            created_at: item.created_at,
            updated_at: item.updated_at,
            patient: patientData ? {
              name: `${patientData.first_name} ${patientData.last_name}`.trim(),
              cnic: patientData.cnic || 'N/A',
              first_name: patientData.first_name || '',
              last_name: patientData.last_name || '',
            } : {
              name: `Patient ${item.patient_id.slice(0, 8)}`,
              cnic: 'N/A',
              first_name: 'Patient',
              last_name: '',
            }
          };
        });

        setReports(transformedReports);
        setFilteredReports(transformedReports);
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load reports from API');
      console.error('Error fetching reports:', err);
    }
  };

  const filterReports = () => {
    if (selectedStatus === 'all') {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter(r => r.status === selectedStatus));
    }
  };

  const handleSearch = (query: string) => {
    if (!query) {
      filterReports();
      return;
    }
    const filtered = reports.filter(report => {
      const patientName = report.patient?.name?.toLowerCase() || '';
      const patientFirstName = report.patient?.first_name?.toLowerCase() || '';
      const patientLastName = report.patient?.last_name?.toLowerCase() || '';
      const patientCNIC = report.patient?.cnic?.toLowerCase() || '';
      const reportType = report.report_type?.toLowerCase() || '';
      const reportId = report.report_id?.toLowerCase() || '';
      
      return (
        patientName.includes(query.toLowerCase()) ||
        patientFirstName.includes(query.toLowerCase()) ||
        patientLastName.includes(query.toLowerCase()) ||
        patientCNIC.includes(query.toLowerCase()) ||
        reportType.includes(query.toLowerCase()) ||
        reportId.includes(query.toLowerCase())
      );
    });
    setFilteredReports(filtered);
  };

  // Function to truncate report ID to show only half
  const truncateReportId = (reportId: string): string => {
    if (!reportId) return '';
    const halfLength = Math.ceil(reportId.length / 2);
    return `${reportId.substring(0, halfLength)}...`;
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [selectedStatus, reports]);

  const handleDownloadReport = (reportId: string) => {
    const report = reports.find(r => r.report_id === reportId);
    if (report?.file_path) {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = report.file_path;
      link.download = `report_${reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No PDF URL available for this report');
    }
  };

  const handleViewReport = (reportId: string) => {
    const report = reports.find(r => r.report_id === reportId);
    if (report?.file_path) {
      // Open the PDF in a new tab
      window.open(report.file_path, '_blank');
    } else {
      alert('No PDF URL available to view this report');
    }
  };

  const columns: Column<LabReport>[] = [
    {
      key: 'report_id',
      label: 'Report ID',
      render: (report) => (
        <span className="font-mono text-sm text-gray-600" title={report.report_id}>
          {truncateReportId(report.report_id)}
        </span>
      ),
    },
    {
      key: 'report_date',
      label: 'Date',
      render: (report) => formatDate(report.report_date),
    },
    {
      key: 'patient',
      label: 'Patient',
      render: (report) => (
        <div>
          <p className="font-medium">{report.patient?.name || 'N/A'}</p>
          <p className="text-sm text-gray-600">{report.patient?.cnic || 'N/A'}</p>
        </div>
      ),
    },
    {
      key: 'report_type',
      label: 'Type',
      render: (report) => (
        <span className="capitalize px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
          {report.report_type}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (report) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
          {report.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (report) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/lab/update-report/${report.report_id}`);
            }}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            title="Update Report"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewReport(report.report_id);
            }}
            className="p-2 text-primary hover:bg-blue-50 rounded transition-colors"
            title="View Report"
          >
            <Eye size={18} />
          </button>
          {report.file_path && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadReport(report.report_id);
              }}
              className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Download Report"
            >
              <Download size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout navItems={labNavItems} title="Lab Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Lab Reports</h2>
          <p className="text-gray-600 mt-1">View and manage all laboratory reports</p>
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Reports
              </label>
              <SearchBar
        placeholder="Search by patient name, CNIC, report type, or ID..."
        onSearch={handleSearch}
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Status
      </label>
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="w-full h-[42px] px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
      >
        <option value="all">All Reports</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  </div>
</div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Reports</p>
            <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {reports.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {reports.filter(r => r.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow">
          <DataTable
            data={filteredReports}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No reports found"
          />
        </div>
      </div>
    </Layout>
  );
};