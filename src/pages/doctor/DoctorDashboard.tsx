import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable, type Column } from '../../components/common/DataTable';
import { StatCard } from '../../components/common/StatCard';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import type { Patient } from '../../types';
import { Activity, Users, Calendar, FileText, ClipboardList } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useLoading, useError } from '../../utils/hooks';

const doctorNavItems = [
  { path: '/doctor/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/doctor/patients', label: 'Patient Search', icon: <Users size={20} /> },
  { path: '/doctor/visits', label: 'Visit Management', icon: <Calendar size={20} /> },
  { path: '/doctor/create-visit', label: 'Create Visit', icon: <ClipboardList size={20} /> },
];

const glassCard = 'backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-glow';

export const DoctorDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const stats = { todayVisits: 8, patientsSeen: 23, pendingReports: 5 };
  const { isLoading, withLoading } = useLoading();
  const { error, setError, clearError } = useError();
  const navigate = useNavigate();

  const handleSearch = async (query: string) => {
    if (!query) {
      setPatients([]);
      return;
    }

    try {
      clearError();
      const results = await withLoading(() => patientService.searchPatients(query));
      setPatients(results);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to search patients');
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    localStorage.setItem('selectedPatient', JSON.stringify(patient));
  };

  const columns: Column<Patient>[] = [
    { key: 'name', label: 'Name' },
    { key: 'cnic', label: 'CNIC' },
    {
      key: 'date_of_birth',
      label: 'Date of Birth',
      render: (patient) => formatDate(patient.date_of_birth),
    },
    {
      key: 'gender',
      label: 'Gender',
      render: (patient) => <span className="capitalize">{patient.gender}</span>,
    },
  ];

  return (
    <Layout navItems={doctorNavItems} title="Doctor Portal">
      <div className="space-y-8 text-white">
        <section className={`${glassCard} p-6`}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Clinical cockpit</p>
              <h2 className="text-3xl font-bold mt-2">Patient Intelligence</h2>
              <p className="text-white/70 mt-2 max-w-2xl">
                Surface real-time vitals, case histories, and AI-assisted triage to streamline every consultation.
              </p>
            </div>
            <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Today</p>
              <p className="text-lg font-semibold">8 scheduled visits</p>
            </div>
          </div>
        </section>

        {selectedPatient && (
          <div className={`${glassCard} p-6`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Selected patient</p>
                <h3 className="text-2xl font-semibold mt-2">{selectedPatient.name}</h3>
                <p className="text-white/70 mt-1">CNIC: {selectedPatient.cnic}</p>
                <p className="text-white/70">DOB: {formatDate(selectedPatient.date_of_birth)}</p>
              </div>
              <button
                onClick={() => navigate('/doctor/create-visit')}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-aqua-500 font-semibold text-white shadow-glow hover:shadow-glow-lg transition-all"
              >
                Create Visit
              </button>
            </div>
          </div>
        )}

        <section className={`${glassCard} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Patient Search</h3>
          </div>
          <SearchBar placeholder="Search by name or CNIC..." onSearch={handleSearch} />
          {error && (
            <div className="mt-4">
              <ErrorMessage message={error} onClose={clearError} />
            </div>
          )}
          {patients.length > 0 && (
            <div className="mt-4">
              <DataTable
                data={patients}
                columns={columns}
                isLoading={isLoading}
                onRowClick={handleSelectPatient}
                emptyMessage="No patients found"
              />
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Today's Visits" value={stats.todayVisits} icon={Calendar} color="primary" />
          <StatCard title="Patients Seen" value={stats.patientsSeen} icon={Users} color="success" />
          <StatCard title="Pending Reports" value={stats.pendingReports} icon={FileText} color="warning" />
        </div>

        <section className={`${glassCard} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Quick Actions</h3>
            {!selectedPatient && (
              <p className="text-sm text-white/70">
                Search and select a patient to unlock patient-specific workflows.
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'View Patient Dashboard',
                description: 'Complete medical history',
                icon: <Users size={24} />,
                action: () => navigate('/doctor/patient-view'),
              },
              {
                title: 'Create New Visit',
                description: 'Record patient visit',
                icon: <ClipboardList size={24} />,
                action: () => navigate('/doctor/create-visit'),
              },
              {
                title: 'Medical Records',
                description: 'View diagnostics & documents',
                icon: <FileText size={24} />,
                action: () => navigate('/doctor/patient-view'),
              },
            ].map((item) => (
              <button
                key={item.title}
                onClick={() => selectedPatient && item.action()}
                disabled={!selectedPatient}
                className="group p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-start gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500/60 to-aqua-500/60 flex items-center justify-center text-white shadow-glow">
                  {item.icon}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-white/70">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

