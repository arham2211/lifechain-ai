import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { StatCard } from '../../components/common/StatCard';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { doctorService } from '../../services/doctorService';
import { labService } from '../../services/labService';
import { Activity, Users, UserCheck, Building, FileText, Cpu, Shield } from 'lucide-react';
import { useLoading, useError } from '../../utils/hooks';

const adminNavItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/admin/patients', label: 'Patient Management', icon: <Users size={20} /> },
  { path: '/admin/doctors', label: 'Doctor Management', icon: <UserCheck size={20} /> },
  { path: '/admin/labs', label: 'Lab Management', icon: <Building size={20} /> },
];

const glassCard = 'backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-glow';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalLabs: 0,
    totalReports: 0,
  });
  const { withLoading } = useLoading();
  const { error, setError, clearError } = useError();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      clearError();
      await withLoading(async () => {
        const [patients, doctors, labs, reports] = await Promise.all([
          patientService.getPatients({ limit: 1 }),
          doctorService.getDoctors(0, 1),
          labService.getLabs(0, 1),
          labService.getLabReports({ limit: 1 }),
        ]);

        setStats({
          totalPatients: patients.total,
          totalDoctors: doctors.total,
          totalLabs: labs.total,
          totalReports: reports.total,
        });
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load dashboard data');
    }
  };

  return (
    <Layout navItems={adminNavItems} title="Admin Portal">
      <div className="space-y-8 text-white">
        <section className={`${glassCard} p-6 lg:p-10`}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Command Center</p>
              <h2 className="text-4xl lg:text-5xl font-bold mt-2">System Overview</h2>
              <p className="text-white/70 mt-3 max-w-2xl">
                Monitor medical operations, compliance, and AI performance from a single intelligence layer.
              </p>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
              <Shield className="text-teal-300" size={32} />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Security</p>
                <p className="text-lg font-semibold text-white">HIPAA • ISO 27001</p>
              </div>
            </div>
          </div>
        </section>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Total Patients" value={stats.totalPatients} icon={Users} color="primary" />
          <StatCard title="Total Doctors" value={stats.totalDoctors} icon={UserCheck} color="success" />
          <StatCard title="Lab Facilities" value={stats.totalLabs} icon={Building} color="warning" />
          <StatCard title="Lab Reports" value={stats.totalReports} icon={FileText} color="primary" />
        </div>

        <section className={`${glassCard} p-6`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Control deck</p>
              <h3 className="text-2xl font-semibold">Management Panels</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: 'Patient Registry',
                description: 'Create, certify and manage patient identities',
                action: () => navigate('/admin/patients'),
                icon: <Users size={28} />,
              },
              {
                title: 'Medical Staff',
                description: 'Onboard doctors, assign privileges, track licenses',
                action: () => navigate('/admin/doctors'),
                icon: <UserCheck size={28} />,
              },
              {
                title: 'Lab Facilities',
                description: 'Coordinate labs, requisitions and QA',
                action: () => navigate('/admin/labs'),
                icon: <Building size={28} />,
              },
            ].map((card) => (
              <button
                key={card.title}
                onClick={card.action}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left p-5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/70 to-aqua-500/70 flex items-center justify-center text-white shadow-glow">
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{card.title}</h4>
                    <p className="text-sm text-white/70 mt-1">{card.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${glassCard} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Runtime</p>
                <h3 className="text-xl font-semibold">System Health</h3>
              </div>
              <Cpu className="text-teal-300" size={28} />
            </div>
            <div className="space-y-3">
              {[
                { label: 'API Status', value: 'Operational', accent: 'text-teal-300' },
                { label: 'Database', value: 'Healthy', accent: 'text-emerald-300' },
                { label: 'ML Models', value: 'Active', accent: 'text-aqua-300' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div>
                    <p className="text-sm text-white/60">{item.label}</p>
                    <p className={`text-lg font-semibold ${item.accent}`}>{item.value}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/70 border border-white/20">
                    Real-time
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${glassCard} p-6`}>
            <h3 className="text-xl font-semibold mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {[
                'New patient registry approved',
                'Lab report pipeline synced',
                'Doctor onboarding request escalated',
                'AI model retrained with latest cohort',
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-300 mt-2 shadow-glow" />
                  <div>
                    <p className="text-sm text-white/80">{activity}</p>
                    <span className="text-xs text-white/50">Just now</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

