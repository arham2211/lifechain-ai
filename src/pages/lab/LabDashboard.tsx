import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { DataTable, type Column } from '../../components/common/DataTable';
import { useNavigate } from 'react-router-dom';
import { labService } from '../../services/labService';
import type { LabReport } from '../../types';
import { Activity, FileText, AlertCircle, CheckCircle, Clock, List, Upload, TrendingUp } from 'lucide-react';
import { formatDate, getStatusColor } from '../../utils/formatters';
import { useLoading, useError } from '../../utils/hooks';

const labNavItems = [
  { path: '/lab/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/lab/create-report', label: 'Create Lab Report', icon: <FileText size={20} /> },
  { path: '/lab/upload-report', label: 'Upload Report', icon: <Upload size={20} /> },
  { path: '/lab/reports', label: 'All Reports', icon: <List size={20} /> },
 
];

const glassCard = 'glass-card rounded-3xl shadow-lg border border-slate-100 bg-white/80 backdrop-blur-md';

export const LabDashboard: React.FC = () => {
  const [stats, setStats] = useState({ pending: 0, completed: 0, abnormal: 0 });
  const [recentReports, setRecentReports] = useState<LabReport[]>([]);
  const { isLoading, withLoading } = useLoading();
  const { error, setError, clearError } = useError();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      clearError();
      await withLoading(async () => {
        const allReports = await labService.getLabReports({ limit: 100 });
        const pendingCount = allReports.items.filter((r) => r.status === 'pending').length;
        const completedCount = allReports.items.filter((r) => r.status === 'completed').length;
        const abnormalResults = await labService.getAbnormalResults();

        setStats({
          pending: pendingCount,
          completed: completedCount,
          abnormal: abnormalResults.length,
        });

        setRecentReports(allReports.items.slice(0, 5));
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load dashboard data');
    }
  };

  const columns: Column<LabReport>[] = [
    { key: 'report_date', label: 'Date', render: (report) => formatDate(report.report_date) },
    { 
      key: 'patient', 
      label: 'Patient', 
      render: (report) => (
        <div>
          <p className="font-medium text-slate-900">{report.patient?.name || 'N/A'}</p>
          <p className="text-sm text-slate-600">{report.patient?.cnic || ''}</p>
        </div>
      )
    },
    { 
      key: 'report_type', 
      label: 'Type', 
      render: (report) => (
        <span className="capitalize px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
          {report.report_type}
        </span>
      )
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
  ];

  return (
    <Layout navItems={labNavItems} title="Lab Portal">
      <div className="space-y-6">
        {/* Header Section */}
        <section className={`${glassCard} p-6 lg:p-8`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold mb-2">
                Laboratory Dashboard
              </p>
              <h2 className="text-3xl font-bold text-slate-900">
                Lab Intelligence
              </h2>
              <p className="text-slate-600 mt-2 max-w-2xl">
                Monitor test throughput, quality metrics, and abnormal alerts across the entire laboratory pipeline.
              </p>
            </div>
            <div className="px-6 py-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-600 font-semibold mb-1">
                Queue Status
              </p>
              <p className="text-2xl font-bold text-indigo-900">{stats.pending}</p>
              <p className="text-sm text-indigo-700">Pending Samples</p>
            </div>
          </div>
        </section>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Clock size={24} className="text-yellow-600" />
              </div>
              <TrendingUp size={20} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-600 font-medium">Pending Reports</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <TrendingUp size={20} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-600 font-medium">Completed Reports</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.completed}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <TrendingUp size={20} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-600 font-medium">Abnormal Results</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.abnormal}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <section className={`${glassCard} p-6 lg:p-8`}>
          <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { 
                label: 'Create Lab Report', 
                description: 'Start a new report workflow', 
                icon: <FileText size={24} />, 
                action: () => navigate('/lab/create-report'),
                color: 'indigo'
              },
              { 
                label: 'Upload Report', 
                description: 'Attach PDF or imaging', 
                icon: <Upload size={24} />, 
                action: () => navigate('/lab/upload-report'),
                color: 'blue'
              },
              { 
                label: 'Review Abnormal', 
                description: 'Quality control triage', 
                icon: <AlertCircle size={24} />, 
                action: () => navigate('/lab/abnormal'),
                color: 'red'
              },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:shadow-md transition-all flex items-start gap-4 text-left group"
              >
                <div className={`w-12 h-12 rounded-xl bg-${item.color}-100 flex items-center justify-center text-${item.color}-600 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{item.label}</p>
                  <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Reports */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Recent Reports</h3>
            <button
              onClick={() => navigate('/lab/reports')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
            >
              View all <List size={16} />
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <DataTable
              data={recentReports}
              columns={columns}
              isLoading={isLoading}
              emptyMessage="No reports found"
              onRowClick={() => navigate(`/lab/reports`)}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
};

