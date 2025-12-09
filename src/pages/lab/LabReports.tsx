import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { DataTable, type Column } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { labService } from '../../services/labService';
import type { LabReport } from '../../types';
import { Activity, FileText, AlertCircle, List, Download, Eye, Upload } from 'lucide-react';
import { formatDate, getStatusColor } from '../../utils/formatters';
import { useLoading, useError } from '../../utils/hooks';

const labNavItems = [
  { path: '/lab/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/lab/create-report', label: 'Create Lab Report', icon: <FileText size={20} /> },
  { path: '/lab/upload-report', label: 'Upload Report', icon: <Upload size={20} /> },
  { path: '/lab/reports', label: 'All Reports', icon: <List size={20} /> },
  { path: '/lab/abnormal', label: 'Abnormal Results', icon: <AlertCircle size={20} /> },
];

export const LabReports: React.FC = () => {
  const [reports, setReports] = useState<LabReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<LabReport[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const { isLoading, withLoading } = useLoading();
  const { error, setError, clearError } = useError();

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [selectedStatus, reports]);

  const fetchReports = async () => {
    try {
      clearError();
      await withLoading(async () => {
        const data = await labService.getLabReports({ limit: 100 });
        setReports(data.items);
        setFilteredReports(data.items);
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load reports');
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
    const filtered = reports.filter(report => 
      report.patient?.first_name.toLowerCase().includes(query.toLowerCase()) ||
      report.report_type.toLowerCase().includes(query.toLowerCase()) ||
      report.report_id.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredReports(filtered);
  };

  const handleDownloadReport = (reportId: string) => {
    // Mock download - in real app, this would download the actual file
    console.log('Downloading report:', reportId);
    alert(`Downloading report ${reportId} (Mock Mode - No actual file)`);
  };

  const handleViewReport = (reportId: string) => {
    // Navigate to report details or show modal
    console.log('Viewing report:', reportId);
    alert(`Viewing report ${reportId} details (Mock Mode)`);
  };

  const columns: Column<LabReport>[] = [
    {
      key: 'report_id',
      label: 'Report ID',
      render: (report) => (
        <span className="font-mono text-sm text-gray-600">{report.report_id}</span>
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
          <p className="text-sm text-gray-600">{report.patient?.cnic}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchBar
              placeholder="Search by patient name, report type, or ID..."
              onSearch={handleSearch}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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

