import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable, type Column } from '../../components/common/DataTable';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import type { Patient } from '../../types';
import { Activity, Users, FileText, ClipboardList, Search, UserCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useLoading, useError } from '../../utils/hooks';

const doctorNavItems = [
  { path: '/doctor/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/doctor/create-visit', label: 'Create Visit', icon: <ClipboardList size={20} /> },
];

const glassCard = "glass-card rounded-3xl shadow-lg border border-slate-100";

export const DoctorDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { isLoading, withLoading } = useLoading();
  const { error, setError, clearError } = useError();
  const navigate = useNavigate();

  const handleSearch = async (query?: string) => {
    const searchValue = query !== undefined ? query : searchQuery;

    if (!searchValue.trim()) {
      setPatients([]);
      setSelectedPatient(null);
      setShowSearchResults(false);
      return;
    }

    try {
      clearError();
      const results = await withLoading(async () => {
        const response = await fetch(
          `http://0.0.0.0:8001/api/v1/patients/?skip=0&limit=100&search=${encodeURIComponent(searchValue)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        return data.map((patient: any) => ({
          ...patient,
          name: `${patient.first_name} ${patient.last_name}`,
          // Ensure all required Patient fields are present
          patient_id: patient.patient_id || patient.id || '',
          first_name: patient.first_name || '',
          last_name: patient.last_name || '',
          cnic: patient.cnic || '',
          date_of_birth: patient.date_of_birth || '',
          gender: patient.gender || 'other',
          phone: patient.phone || '',
        }));
      });

      setPatients(results);
      setShowSearchResults(true);

      // Auto-select the first patient if available
      if (results.length > 0) {
        const firstPatient = results[0];
        setSelectedPatient(firstPatient);
        localStorage.setItem('selectedPatient', JSON.stringify(firstPatient));
      } else {
        setSelectedPatient(null);
        localStorage.removeItem('selectedPatient');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search patients');
      setPatients([]);
      setShowSearchResults(false);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setShowSearchResults(false);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    localStorage.setItem('selectedPatient', JSON.stringify(patient));
  };

  const columns: Column<Patient>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (patient) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <UserCircle size={20} />
          </div>
          <span className="font-medium text-slate-900">{patient.first_name} {patient.last_name}</span>
        </div>
      )
    },
    { key: 'cnic', label: 'CNIC' },
    {
      key: 'date_of_birth',
      label: 'Date of Birth',
      render: (patient) => formatDate(patient.date_of_birth),
    },
    {
      key: 'gender',
      label: 'Gender',
      render: (patient) => <span className="capitalize px-2 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">{patient.gender}</span>,
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (patient) => patient.phone || 'N/A',
    },
  ];

  // Load selected patient from localStorage on initial render
  React.useEffect(() => {
    const savedPatient = localStorage.getItem('selectedPatient');
    if (savedPatient) {
      try {
        const parsedPatient = JSON.parse(savedPatient);
        setSelectedPatient(parsedPatient);
      } catch (err) {
        console.error('Failed to parse saved patient:', err);
        localStorage.removeItem('selectedPatient');
      }
    }
  }, []);

  return (
    <Layout navItems={doctorNavItems} title="Doctor Portal">
      <div className="space-y-8">
        <section className={`${glassCard} p-6 lg:p-10 `}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold mb-2">Clinical Cockpit</p>
              <h2 className="text-4xl font-bold text-slate-900">Patient Intelligence</h2>
              <p className="text-slate-600 mt-3 max-w-2xl text-lg">
                Surface real-time vitals, case histories, and AI-assisted triage to streamline every consultation.
              </p>
            </div>
            <div className="px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">Today</p>
              <p className="text-xl font-bold text-slate-900 mt-1">8 scheduled visits</p>
            </div>
          </div>
        </section>

        {selectedPatient && (
          <div className={`${glassCard} p-6 border-l-4 border-l-primary-500`}>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                  <UserCircle size={32} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">Selected Patient</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    {selectedPatient.first_name} {selectedPatient.last_name}
                  </h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      CNIC: {selectedPatient.cnic}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      DOB: {formatDate(selectedPatient.date_of_birth)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      {selectedPatient.gender}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/doctor/create-visit')}
                  className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  <ClipboardList size={18} />
                  Create Visit
                </button>
                <button
                  onClick={() => {
                    setSelectedPatient(null);
                    localStorage.removeItem('selectedPatient');
                  }}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        <section className={`${glassCard} p-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Patient Search</h3>
              <p className="text-slate-500 text-sm mt-1">Found {patients.length} patient{patients.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <SearchBar
                placeholder="Search by name, CNIC, or phone..."
                onSearch={handleInputChange}
                loading={isLoading}
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={!searchQuery.trim() || isLoading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Search size={20} />
              Search
            </button>
          </div>

          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} onClose={clearError} />
            </div>
          )}

          {showSearchResults && patients.length > 0 ? (
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <DataTable
                data={patients}
                columns={columns}
                isLoading={isLoading}
                onRowClick={handleSelectPatient}
              />
            </div>
          ) : showSearchResults && patients.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-slate-400" />
              </div>
              <p className="text-slate-900 font-medium">No patients found</p>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your search terms</p>
            </div>
          ) : !showSearchResults && searchQuery.trim() ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              <p className="text-slate-500">Click the Search button to find patients</p>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-slate-400" />
              </div>
              <p className="text-slate-900 font-medium">Patient Search</p>
              <p className="text-sm text-slate-500 mt-1 mb-2">Enter search criteria above to find patient records</p>
              <p className="text-xs text-slate-400 bg-white inline-block px-3 py-1 rounded-full border border-slate-200">Example: Kenneth, 42103-2282167-4</p>
            </div>
          )}
        </section>

        <section className={`${glassCard} p-6`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
            {!selectedPatient && (
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Select a patient first
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'View Patient Dashboard',
                description: 'Complete medical history & reports',
                icon: <Users size={24} />,
                action: () => selectedPatient?.patient_id && navigate(`/doctor/patient/${selectedPatient.patient_id}`),
                color: 'from-blue-500 to-indigo-600'
              },
              {
                title: 'Create New Visit',
                description: 'Record patient symptoms & diagnosis',
                icon: <ClipboardList size={24} />,
                action: () => navigate('/doctor/create-visit'),
                color: 'from-emerald-500 to-teal-600'
              },
              {
                title: 'Patient Family Tree',
                description: 'View genetic history analysis',
                icon: <FileText size={24} />,
                action: () => selectedPatient?.patient_id && navigate(`/doctor/patient/${selectedPatient.patient_id}/family-history`),
                color: 'from-purple-500 to-violet-600'
              },
            ].map((item) => (
              <button
                key={item.title}
                onClick={() => item.action()}
                disabled={!selectedPatient && item.title !== 'Create New Visit'}
                className="group p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</p>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};