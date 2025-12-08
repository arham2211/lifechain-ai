import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { DataTable, type Column } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';
import { patientService } from '../../services/patientService';
import type { Patient } from '../../types';
import { Activity, Users, UserCheck, Building, Plus, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useLoading, useError } from '../../utils/hooks';

const adminNavItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/admin/patients', label: 'Patient Management', icon: <Users size={20} /> },
  { path: '/admin/doctors', label: 'Doctor Management', icon: <UserCheck size={20} /> },
  { path: '/admin/labs', label: 'Lab Management', icon: <Building size={20} /> },
];

export const AdminPatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { isLoading, withLoading } = useLoading();
  const { error, setError, clearError } = useError();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      clearError();
      await withLoading(async () => {
        const data = await patientService.getPatients({ limit: 100 });
        setPatients(data.items);
        setFilteredPatients(data.items);
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load patients');
    }
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredPatients(patients);
      return;
    }
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.cnic.includes(query) ||
      patient.email?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleDelete = async (patient: Patient) => {
    if (!confirm(`Are you sure you want to delete patient ${patient.name}?`)) {
      return;
    }
    try {
      clearError();
      await withLoading(() => patientService.deletePatient(patient.patient_id));
      await fetchPatients();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete patient');
    }
  };

  const columns: Column<Patient>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (patient) => (
        <div>
          <p className="font-medium text-gray-900">{patient.name}</p>
          <p className="text-sm text-gray-600">{patient.email || 'No email'}</p>
        </div>
      ),
    },
    {
      key: 'cnic',
      label: 'CNIC',
      render: (patient) => <span className="font-mono text-sm">{patient.cnic}</span>,
    },
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
    {
      key: 'blood_group',
      label: 'Blood Type',
      render: (patient) => patient.blood_group || 'N/A',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (patient) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(patient);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(patient);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout navItems={adminNavItems} title="Admin Portal">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
            <p className="text-gray-600 mt-1">Manage all patients in the system</p>
          </div>
          <button
            onClick={() => {
              setSelectedPatient(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Patient
          </button>
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <SearchBar
            placeholder="Search by name, CNIC, or email..."
            onSearch={handleSearch}
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Patients</p>
            <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Male</p>
            <p className="text-2xl font-bold text-blue-600">
              {patients.filter(p => p.gender === 'male').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Female</p>
            <p className="text-2xl font-bold text-pink-600">
              {patients.filter(p => p.gender === 'female').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">With Email</p>
            <p className="text-2xl font-bold text-green-600">
              {patients.filter(p => p.email).length}
            </p>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-lg shadow">
          <DataTable
            data={filteredPatients}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No patients found"
          />
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedPatient ? 'Edit Patient' : 'Create Patient'}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {selectedPatient
              ? `Editing patient: ${selectedPatient.name}`
              : 'Create a new patient record (Mock Mode - Changes not saved)'}
          </p>
          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                alert('Mock Mode: Form functionality not implemented. Would save patient data.');
                setShowModal(false);
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
            >
              {selectedPatient ? 'Save Changes' : 'Create Patient'}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

