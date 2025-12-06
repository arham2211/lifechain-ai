import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { StatCard } from '../../components/common/StatCard';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { DataTable, type Column } from '../../components/common/DataTable';
import { useNavigate } from 'react-router-dom';
import { labService } from '../../services/labService';
import type { LabReport } from '../../types';
import { Activity, FileText, AlertCircle, CheckCircle, Clock, List, Upload } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useLoading, useError } from '../../utils/hooks';

const labNavItems = [
  { path: '/lab/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/lab/create-report', label: 'Create Lab Report', icon: <FileText size={20} /> },
  { path: '/lab/upload-report', label: 'Upload Report', icon: <Upload size={20} /> },
  { path: '/lab/reports', label: 'All Reports', icon: <List size={20} /> },
  { path: '/lab/abnormal', label: 'Abnormal Results', icon: <AlertCircle size={20} /> },
];

const glassCard = 'backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-glow';

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
    { key: 'patient', label: 'Patient', render: (report) => report.patient?.name || 'N/A' },
    { key: 'report_type', label: 'Type', render: (report) => <span className="capitalize">{report.report_type}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (report) => (
        <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/20 text-white/80 capitalize">
          {report.status}
        </span>
      ),
    },
  ];

  return (
    <Layout navItems={labNavItems} title="Lab Portal">
      <div className="space-y-8 text-white">
        <section className={`${glassCard} p-6`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Diagnostics network</p>
              <h2 className="text-3xl font-bold mt-2">Lab Intelligence</h2>
              <p className="text-white/70 mt-2 max-w-2xl">
                Monitor test throughput, quality metrics, and abnormal alerts across the entire laboratory pipeline.
              </p>
            </div>
            <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Queue</p>
              <p className="text-lg font-semibold">{stats.pending} Pending Samples</p>
            </div>
          </div>
        </section>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Pending Reports" value={stats.pending} icon={Clock} color="warning" />
          <StatCard title="Completed Reports" value={stats.completed} icon={CheckCircle} color="success" />
          <StatCard title="Abnormal Results" value={stats.abnormal} icon={AlertCircle} color="danger" />
        </div>

        <section className={`${glassCard} p-6`}>
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Create Lab Report', description: 'Start a new report workflow', icon: <FileText size={24} />, action: () => navigate('/lab/create-report') },
              { label: 'Upload Report', description: 'Attach PDF or imaging', icon: <Upload size={24} />, action: () => navigate('/lab/upload-report') },
              { label: 'Review Abnormal', description: 'Quality control triage', icon: <AlertCircle size={24} />, action: () => navigate('/lab/abnormal') },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-start gap-3 text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500/60 to-aqua-500/60 flex items-center justify-center text-white shadow-glow">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-white">{item.label}</p>
                  <p className="text-sm text-white/70">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Recent Reports</h3>
            <button
              onClick={() => navigate('/lab/reports')}
              className="text-sm text-white/70 hover:text-white flex items-center gap-2"
            >
              View all <List size={16} />
            </button>
          </div>
          <DataTable
            data={recentReports}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No reports found"
            onRowClick={() => navigate(`/lab/reports`)}
          />
        </section>
      </div>
    </Layout>
  );
};

