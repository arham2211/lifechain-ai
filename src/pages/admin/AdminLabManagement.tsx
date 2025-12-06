import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { DataTable, type Column } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';
import { labService } from '../../services/labService';
import type { Lab } from '../../types';
import { Activity, Users, UserCheck, Building, Plus, Edit, Trash2 } from 'lucide-react';
import { useLoading, useError } from '../../utils/hooks';

const adminNavItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/admin/patients', label: 'Patient Management', icon: <Users size={20} /> },
  { path: '/admin/doctors', label: 'Doctor Management', icon: <UserCheck size={20} /> },
  { path: '/admin/labs', label: 'Lab Management', icon: <Building size={20} /> },
];

export const AdminLabManagement: React.FC = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<Lab[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const { isLoading, withLoading } = useLoading();
  const { error, setError, clearError } = useError();

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      clearError();
      await withLoading(async () => {
        const data = await labService.getLabs(0, 100);
        setLabs(data.items);
        setFilteredLabs(data.items);
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load labs');
    }
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredLabs(labs);
      return;
    }
    const filtered = labs.filter(lab =>
      lab.name.toLowerCase().includes(query.toLowerCase()) ||
      lab.location?.toLowerCase().includes(query.toLowerCase()) ||
      lab.email?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredLabs(filtered);
  };

  const handleEdit = (lab: Lab) => {
    setSelectedLab(lab);
    setShowModal(true);
  };

  const handleDelete = async (lab: Lab) => {
    if (!confirm(`Are you sure you want to delete lab ${lab.name}?`)) {
      return;
    }
    try {
      clearError();
      await withLoading(() => labService.deleteLab(lab.lab_id));
      await fetchLabs();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete lab');
    }
  };

  const columns: Column<Lab>[] = [
    {
      key: 'name',
      label: 'Lab Name',
      render: (lab) => (
        <div>
          <p className="font-medium text-gray-900">{lab.name}</p>
          <p className="text-sm text-gray-600">{lab.email || 'No email'}</p>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (lab) => lab.location || 'N/A',
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (lab) => lab.phone || 'N/A',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (lab) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(lab);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(lab);
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
            <h2 className="text-2xl font-bold text-gray-900">Lab Management</h2>
            <p className="text-gray-600 mt-1">Manage all laboratory facilities</p>
          </div>
          <button
            onClick={() => {
              setSelectedLab(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Lab
          </button>
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6">
          <SearchBar
            placeholder="Search by name, location, or email..."
            onSearch={handleSearch}
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Labs</p>
            <p className="text-2xl font-bold text-gray-900">{labs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">With Location</p>
            <p className="text-2xl font-bold text-green-600">
              {labs.filter(l => l.location).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">With Contact</p>
            <p className="text-2xl font-bold text-blue-600">
              {labs.filter(l => l.phone || l.email).length}
            </p>
          </div>
        </div>

        {/* Labs Table */}
        <div className="bg-white rounded-lg shadow">
          <DataTable
            data={filteredLabs}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No labs found"
          />
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedLab ? 'Edit Lab' : 'Create Lab'}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {selectedLab
              ? `Editing lab: ${selectedLab.name}`
              : 'Create a new lab facility (Mock Mode - Changes not saved)'}
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
                alert('Mock Mode: Form functionality not implemented. Would save lab data.');
                setShowModal(false);
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
            >
              {selectedLab ? 'Save Changes' : 'Create Lab'}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

