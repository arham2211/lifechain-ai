import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable, type Column } from '../../components/common/DataTable';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import type { Patient } from '../../types';
import { Activity, Users, FileText, ClipboardList, Search } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useLoading, useError } from '../../utils/hooks';

const doctorNavItems = [
  { path: '/doctor/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/doctor/create-visit', label: 'Create Visit', icon: <ClipboardList size={20} /> },
];

const glassCard = 'backdrop-blur-xl bg-black/80 border border-white/20 rounded-3xl shadow-glow';

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
      render: (patient) => `${patient.first_name} ${patient.last_name}`
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
      render: (patient) => <span className="capitalize">{patient.gender}</span>,
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
                <h3 className="text-2xl font-semibold mt-2">
                  {selectedPatient.first_name} {selectedPatient.last_name}
                </h3>
                <p className="text-white/70 mt-1">CNIC: {selectedPatient.cnic}</p>
                <p className="text-white/70">DOB: {formatDate(selectedPatient.date_of_birth)}</p>
                <p className="text-white/70">Gender: {selectedPatient.gender}</p>
                <p className="text-white/70">Phone: {selectedPatient.phone || 'N/A'}</p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/doctor/create-visit')}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-aqua-500 font-semibold text-white shadow-glow hover:shadow-glow-lg transition-all"
                >
                  Create Visit
                </button>
                <button
                  onClick={() => {
                    setSelectedPatient(null);
                    localStorage.removeItem('selectedPatient');
                  }}
                  className="px-5 py-3 rounded-2xl border border-white/20 font-semibold text-white hover:bg-white/5 transition-all"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        <section className={`${glassCard} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Patient Search</h3>
            <div className="text-sm text-white/60">
              Found {patients.length} patient{patients.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <SearchBar 
                placeholder="Search by name or CNIC..." 
                onSearch={handleInputChange}
                loading={isLoading}
                // value={searchQuery}
                // onChange={handleInputChange}
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={!searchQuery.trim() || isLoading}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-aqua-500 font-semibold text-white shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Search size={20} />
              Search
            </button>
          </div>
          
          {error && (
            <div className="mt-4">
              <ErrorMessage message={error} onClose={clearError} />
            </div>
          )}
          
          {showSearchResults && patients.length > 0 ? (
            <div className="mt-4">
              <DataTable
                data={patients}
                columns={columns}
                isLoading={isLoading}
                onRowClick={handleSelectPatient}
                // selectedRow={selectedPatient?.patient_id}
              />
            </div>
          ) : showSearchResults && patients.length === 0 ? (
            <div className="mt-8 text-center py-8 border border-white/10 rounded-2xl">
              <p className="text-white/60">No patients found. Try searching by name, CNIC, or phone number.</p>
              <p className="text-sm text-white/40 mt-2">Example: Kenneth, 42103-2282167-4, 03014425988</p>
            </div>
          ) : !showSearchResults && searchQuery.trim() ? (
            <div className="mt-8 text-center py-8 border border-white/10 rounded-2xl">
              <p className="text-white/60">Click the Search button to find patients</p>
            </div>
          ) : (
            <div className="mt-8 text-center py-8 border border-white/10 rounded-2xl">
              <p className="text-white/60">Enter search criteria and click Search button</p>
            </div>
          )}
        </section>

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
                action: () => selectedPatient?.patient_id && navigate(`/doctor/patient/${selectedPatient.patient_id}`),
              },
              {
                title: 'Create New Visit',
                description: 'Record patient visit',
                icon: <ClipboardList size={24} />,
                action: () => navigate('/doctor/create-visit'),
              },
              {
                title: 'Patient Family Tree',
                description: 'View patient fmaily history',
                icon: <FileText size={24} />,
                action: () => selectedPatient?.patient_id && navigate(`/doctor/patient/${selectedPatient.patient_id}/records`),
              },
            ].map((item) => (
              <button
                key={item.title}
                onClick={() => item.action()}
                disabled={!selectedPatient && item.title !== 'Create New Visit'}
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