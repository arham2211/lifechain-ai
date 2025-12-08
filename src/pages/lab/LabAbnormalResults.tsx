import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { DataTable, type Column } from '../../components/common/DataTable';
import { labService } from '../../services/labService';
import type { TestResult } from '../../types';
import { Activity, FileText, AlertCircle, List, AlertTriangle, Upload } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useLoading, useError } from '../../utils/hooks';

const labNavItems = [
  { path: '/lab/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/lab/create-report', label: 'Create Lab Report', icon: <FileText size={20} /> },
  { path: '/lab/upload-report', label: 'Upload Report', icon: <Upload size={20} /> },
  { path: '/lab/reports', label: 'All Reports', icon: <List size={20} /> },
  { path: '/lab/abnormal', label: 'Abnormal Results', icon: <AlertCircle size={20} /> },
];

export const LabAbnormalResults: React.FC = () => {
  const [abnormalResults, setAbnormalResults] = useState<TestResult[]>([]);
  const [groupedBySeverity, setGroupedBySeverity] = useState<{
    critical: TestResult[];
    moderate: TestResult[];
    mild: TestResult[];
  }>({ critical: [], moderate: [], mild: [] });
  const { isLoading, withLoading } = useLoading();
  const { error, setError, clearError } = useError();

  useEffect(() => {
    fetchAbnormalResults();
  }, []);

  const fetchAbnormalResults = async () => {
    try {
      clearError();
      await withLoading(async () => {
        const results = await labService.getAbnormalResults();
        setAbnormalResults(results);
        
        // Mock severity grouping (in real app, this would come from backend)
        const grouped = {
          critical: results.filter((_, idx) => idx % 3 === 0),
          moderate: results.filter((_, idx) => idx % 3 === 1),
          mild: results.filter((_, idx) => idx % 3 === 2),
        };
        setGroupedBySeverity(grouped);
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load abnormal results');
    }
  };

  const getSeverityBadge = (testName: string) => {
    // Mock severity calculation - in real app, this would be based on actual values
    const idx = abnormalResults.findIndex(t => t.test_name === testName);
    if (idx % 3 === 0) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Critical</span>;
    } else if (idx % 3 === 1) {
      return <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">Moderate</span>;
    } else {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Mild</span>;
    }
  };

  const columns: Column<TestResult>[] = [
    {
      key: 'test_name',
      label: 'Test Name',
      render: (result) => (
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-600" size={16} />
          <span className="font-medium">{result.test_name}</span>
        </div>
      ),
    },
    {
      key: 'test_value',
      label: 'Value',
      render: (result) => (
        <span className="font-mono text-red-600 font-semibold">
          {result.test_value} {result.unit}
        </span>
      ),
    },
    {
      key: 'reference_range',
      label: 'Reference Range',
      render: (result) => (
        <span className="text-gray-600">{result.reference_range_min || 'N/A'}</span>
      ),
    },
    {
      key: 'severity',
      label: 'Severity',
      render: (result) => getSeverityBadge(result.test_name),
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (result) => formatDate(result.created_at),
    },
  ];

  return (
    <Layout navItems={labNavItems} title="Lab Portal">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertCircle className="text-red-600" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Abnormal Test Results</h2>
            <p className="text-gray-600 mt-1">Critical quality control review</p>
          </div>
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-gray-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Total Abnormal</p>
                <p className="text-2xl font-bold text-gray-900">{abnormalResults.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-600" size={24} />
              <div>
                <p className="text-sm text-red-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">{groupedBySeverity.critical.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-orange-600" size={24} />
              <div>
                <p className="text-sm text-orange-600">Moderate</p>
                <p className="text-2xl font-bold text-orange-600">{groupedBySeverity.moderate.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-yellow-600" size={24} />
              <div>
                <p className="text-sm text-yellow-600">Mild</p>
                <p className="text-2xl font-bold text-yellow-600">{groupedBySeverity.mild.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-red-900">Quality Control Alert</p>
            <p className="text-sm text-red-700 mt-1">
              These test results are outside the normal reference range and require immediate attention. 
              Please review and verify all abnormal results before finalizing reports.
            </p>
          </div>
        </div>

        {/* Critical Results */}
        {groupedBySeverity.critical.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
              <h3 className="text-lg font-semibold text-red-900 flex items-center gap-2">
                <AlertTriangle size={20} />
                Critical Results (Immediate Action Required)
              </h3>
            </div>
            <DataTable
              data={groupedBySeverity.critical}
              columns={columns}
              isLoading={isLoading}
              emptyMessage="No critical results"
            />
          </div>
        )}

        {/* All Abnormal Results */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Abnormal Results</h3>
          </div>
          <DataTable
            data={abnormalResults}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No abnormal results found"
          />
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Review Guidelines</h4>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Verify all critical results immediately and notify relevant physicians</li>
            <li>Double-check specimen collection and testing procedures</li>
            <li>Consider repeat testing for significantly abnormal values</li>
            <li>Document all follow-up actions in the lab report notes</li>
            <li>Ensure proper communication with clinical staff</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

