import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { DataTable, type Column } from '../../components/common/DataTable';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useAuth } from '../../contexts/AuthContext';
import { visitService } from '../../services/visitService';
import type { Visit } from '../../types';
import { Activity, FileText, Calendar, TrendingUp, Users, Heart } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { usePagination, useError, useLoading } from '../../utils/hooks';

const patientNavItems = [
  { path: '/patient/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/patient/lab-reports', label: 'Lab Reports', icon: <FileText size={20} /> },
  { path: '/patient/visits', label: 'Visit History', icon: <Calendar size={20} /> },
  { path: '/patient/timeline', label: 'Disease Timeline', icon: <TrendingUp size={20} /> },
  { path: '/patient/family-history', label: 'Family History', icon: <Users size={20} /> },
  { path: '/patient/predictions', label: 'Health Predictions', icon: <TrendingUp size={20} /> },
  { path: '/patient/recommendations', label: 'AI Recommendations', icon: <Heart size={20} /> },
];

export const PatientVisits: React.FC = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const { isLoading, withLoading } = useLoading();
  const { error, setError, clearError } = useError();
  const pagination = usePagination();

  useEffect(() => {
    fetchVisits();
  }, [user, pagination.skip, pagination.limit]);

  const fetchVisits = async () => {
    try {
      clearError();
      const data = await withLoading(() =>
        visitService.getVisits({
          patient_id: user?.entity_id || '',
          skip: pagination.skip,
          limit: pagination.limit,
        })
      );
      setVisits(data.items);
      pagination.setTotal(data.total);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load visits');
    }
  };

  const columns: Column<Visit>[] = [
    {
      key: 'visit_date',
      label: 'Date',
      render: (visit) => formatDate(visit.visit_date),
    },
    {
      key: 'doctor',
      label: 'Doctor',
      render: (visit) => visit.doctor?.name || 'N/A',
    },
    {
      key: 'visit_type',
      label: 'Type',
      render: (visit) => visit.visit_type || 'General',
    },
    {
      key: 'chief_complaint',
      label: 'Chief Complaint',
      render: (visit) => visit.chief_complaint || 'N/A',
    },
  ];

  return (
    <Layout navItems={patientNavItems} title="Patient Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visit History</h2>
          <p className="text-gray-600 mt-1">Your medical visit records</p>
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        <DataTable
          data={visits}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No visits found"
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            onNextPage: pagination.nextPage,
            onPrevPage: pagination.prevPage,
          }}
        />
      </div>
    </Layout>
  );
};

