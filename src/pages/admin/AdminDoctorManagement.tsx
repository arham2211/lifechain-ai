import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { DataTable, type Column } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';
import { doctorService } from '../../services/doctorService';
import type { Doctor } from '../../types';
import { Activity, Users, UserCheck, Building, Plus, Edit, Trash2 } from 'lucide-react';
import { useLoading, useError } from '../../utils/hooks';

const adminNavItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/admin/patients', label: 'Patient Management', icon: <Users size={20} /> },
  { path: '/admin/doctors', label: 'Doctor Management', icon: <UserCheck size={20} /> },
  { path: '/admin/labs', label: 'Lab Management', icon: <Building size={20} /> },
];

export const AdminDoctorManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const { isLoading, withLoading } = useLoading();
  const { error, setError, clearError } = useError();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      clearError();
      await withLoading(async () => {
        const data = await doctorService.getDoctors(0, 100);
        setDoctors(data.items);
        setFilteredDoctors(data.items);
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load doctors');
    }
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredDoctors(doctors);
      return;
    }
    const filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(query.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(query.toLowerCase()) ||
      doctor.license_number?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleDelete = async (doctor: Doctor) => {
    if (!confirm(`Are you sure you want to delete doctor ${doctor.name}?`)) {
      return;
    }
    try {
      clearError();
      await withLoading(() => doctorService.deleteDoctor(doctor.doctor_id));
      await fetchDoctors();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete doctor');
    }
  };

  const columns: Column<Doctor>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (doctor) => (
        <div>
          <p className="font-medium text-gray-900">{doctor.name}</p>
          <p className="text-sm text-gray-600">{doctor.email || 'No email'}</p>
        </div>
      ),
    },
    {
      key: 'specialization',
      label: 'Specialization',
      render: (doctor) => (
        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
          {doctor.specialization}
        </span>
      ),
    },
    {
      key: 'license_number',
      label: 'License Number',
      render: (doctor) => <span className="font-mono text-sm">{doctor.license_number}</span>,
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (doctor) => doctor.phone || 'N/A',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (doctor) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(doctor);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(doctor);
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

  const specializationStats = doctors.reduce((acc, doctor) => {
    const spec = doctor.specialization || 'Unknown';
    acc[spec] = (acc[spec] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Layout navItems={adminNavItems} title="Admin Portal">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Doctor Management</h2>
            <p className="text-gray-600 mt-1">Manage all doctors in the system</p>
          </div>
          <button
            onClick={() => {
              setSelectedDoctor(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Doctor
          </button>
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6">
          <SearchBar
            placeholder="Search by name, specialization, or license number..."
            onSearch={handleSearch}
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Doctors</p>
            <p className="text-2xl font-bold text-gray-900">{doctors.length}</p>
          </div>
          {Object.entries(specializationStats).slice(0, 3).map(([spec, count]) => (
            <div key={spec} className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">{spec}</p>
              <p className="text-2xl font-bold text-primary">{count}</p>
            </div>
          ))}
        </div>

        {/* Doctors Table */}
        <div className="bg-white rounded-lg shadow">
          <DataTable
            data={filteredDoctors}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No doctors found"
          />
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedDoctor ? 'Edit Doctor' : 'Create Doctor'}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {selectedDoctor
              ? `Editing doctor: ${selectedDoctor.name}`
              : 'Create a new doctor record (Mock Mode - Changes not saved)'}
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
                alert('Mock Mode: Form functionality not implemented. Would save doctor data.');
                setShowModal(false);
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
            >
              {selectedDoctor ? 'Save Changes' : 'Create Doctor'}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

