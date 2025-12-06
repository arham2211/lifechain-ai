import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { StatCard } from '../../components/common/StatCard';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { DataTable, type Column } from '../../components/common/DataTable';
import { useNavigate } from 'react-router-dom';
import { visitService } from '../../services/visitService';
import { labService } from '../../services/labService';
import type { Patient, Visit, LabReport } from '../../types';
import { Activity, Users, Calendar, ClipboardList, FileText, TrendingUp, Heart, Clock } from 'lucide-react';
import { formatDate, getStatusColor } from '../../utils/formatters';
import { useLoading, useError } from '../../utils/hooks';

const doctorNavItems = [
  { path: '/doctor/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/doctor/patients', label: 'Patient Search', icon: <Users size={20} /> },
  { path: '/doctor/visits', label: 'Visit Management', icon: <Calendar size={20} /> },
  { path: '/doctor/create-visit', label: 'Create Visit', icon: <ClipboardList size={20} /> },
];

export const DoctorPatientView: React.FC = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'visits' | 'labs' | 'timeline' | 'predictions' | 'recommendations'>('overview');
  const { isLoading, withLoading } = useLoading();
  const { error, setError, clearError } = useError();
  const navigate = useNavigate();

  useEffect(() => {
    // Load selected patient from localStorage
    const storedPatient = localStorage.getItem('selectedPatient');
    if (storedPatient) {
      const patientData = JSON.parse(storedPatient);
      setPatient(patientData);
      fetchPatientData(patientData.patient_id);
    } else {
      navigate('/doctor/dashboard');
    }
  }, [navigate]);

  const fetchPatientData = async (patientId: string) => {
    try {
      clearError();
      await withLoading(async () => {
        const [visitsData, labsData] = await Promise.all([
          visitService.getVisits({ patient_id: patientId, limit: 100 }),
          labService.getLabReports({ patient_id: patientId, limit: 100 }),
        ]);
        setVisits(visitsData.items);
        setLabReports(labsData.items);
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load patient data');
    }
  };

  if (!patient) {
    return null;
  }

  const visitColumns: Column<Visit>[] = [
    {
      key: 'visit_date',
      label: 'Date',
      render: (visit) => formatDate(visit.visit_date),
    },
    {
      key: 'visit_type',
      label: 'Type',
      render: (visit) => <span className="capitalize">{visit.visit_type || 'General'}</span>,
    },
    {
      key: 'chief_complaint',
      label: 'Chief Complaint',
      render: (visit) => visit.chief_complaint || 'N/A',
    },
    {
      key: 'diagnosis',
      label: 'Diagnosis',
      render: (visit) => visit.diagnosis || 'Pending',
    },
  ];

  const labColumns: Column<LabReport>[] = [
    {
      key: 'report_date',
      label: 'Date',
      render: (report) => formatDate(report.report_date),
    },
    {
      key: 'report_type',
      label: 'Type',
      render: (report) => <span className="capitalize">{report.report_type}</span>,
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

  const timelineEvents = [
    ...visits.map((visit) => ({
      id: `visit-${visit.visit_id}`,
      type: 'visit' as const,
      date: visit.visit_date,
      title: visit.chief_complaint || 'Patient visit',
      subtitle: visit.visit_type || 'General consultation',
      description: visit.diagnosis,
    })),
    ...labReports.map((report) => ({
      id: `lab-${report.report_id}`,
      type: 'lab' as const,
      date: report.report_date,
      title: `Lab Report: ${report.report_type}`,
      subtitle: report.status,
      description: undefined,
    })),
  ].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Layout navItems={doctorNavItems} title="Doctor Portal">
      <div className="space-y-6">
        {/* Patient Header */}
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold">{patient.name}</h2>
              <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm opacity-90">
                <div>
                  <span className="opacity-75">CNIC:</span> {patient.cnic}
                </div>
                <div>
                  <span className="opacity-75">Gender:</span> <span className="capitalize">{patient.gender}</span>
                </div>
                <div>
                  <span className="opacity-75">DOB:</span> {formatDate(patient.date_of_birth)}
                </div>
                <div>
                  <span className="opacity-75">Blood Type:</span> {patient.blood_type || 'N/A'}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/doctor/create-visit')}
              className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Create New Visit
            </button>
          </div>
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { key: 'overview', label: 'Overview', icon: Activity },
                { key: 'visits', label: 'Visits', icon: Calendar },
                { key: 'labs', label: 'Lab Reports', icon: FileText },
                { key: 'timeline', label: 'Timeline', icon: Clock },
                { key: 'predictions', label: 'Predictions', icon: TrendingUp },
                { key: 'recommendations', label: 'Recommendations', icon: Heart },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    title="Total Visits"
                    value={visits.length}
                    icon={Calendar}
                  />
                  <StatCard
                    title="Lab Reports"
                    value={labReports.length}
                    icon={FileText}
                  />
                  <StatCard
                    title="Pending Reports"
                    value={labReports.filter(r => r.status === 'pending').length}
                    icon={Clock}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {visits.slice(0, 3).map((visit) => (
                      <div key={visit.visit_id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{visit.chief_complaint}</p>
                            <p className="text-sm text-gray-600 mt-1">{formatDate(visit.visit_date)}</p>
                          </div>
                          <span className="text-sm text-gray-500 capitalize">{visit.visit_type || 'General'}</span>
                        </div>
                      </div>
                    ))}
                    {visits.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No visits recorded</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Visits Tab */}
            {activeTab === 'visits' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Patient Visits</h3>
                  <button
                    onClick={() => navigate('/doctor/create-visit')}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Create Visit
                  </button>
                </div>
                <DataTable
                  data={visits}
                  columns={visitColumns}
                  isLoading={isLoading}
                  emptyMessage="No visits found"
                />
              </div>
            )}

            {/* Lab Reports Tab */}
            {activeTab === 'labs' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Lab Reports</h3>
                <DataTable
                  data={labReports}
                  columns={labColumns}
                  isLoading={isLoading}
                  emptyMessage="No lab reports found"
                />
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Timeline</h3>
                <div className="relative">
                  {timelineEvents.length > 0 ? (
                    timelineEvents.slice(0, 10).map((event) => (
                      <div key={event.id} className="relative pl-8 pb-8 border-l-2 border-gray-200 last:border-0">
                        <div className="absolute left-0 top-0 w-4 h-4 bg-primary rounded-full -translate-x-[9px]"></div>
                        <div className="bg-white p-4 rounded-lg shadow">
                          <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                          <p className="font-medium text-gray-900 mt-1">{event.title}</p>
                          {event.subtitle && (
                            <p className="text-xs uppercase tracking-wide text-gray-400 mt-1">{event.subtitle}</p>
                          )}
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No timeline events</p>
                  )}
                </div>
              </div>
            )}

            {/* Predictions Tab */}
            {activeTab === 'predictions' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Risk Predictions</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    Risk predictions are available in Mock Mode but require backend ML model integration for real data.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900">Cardiovascular Disease</h4>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-orange-600">72%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">High risk - Recommend follow-up</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Recommendations</h3>
                <div className="space-y-3">
                  {[
                    'Regular cardiovascular exercise (30 minutes daily)',
                    'Reduce sodium intake (< 2300mg per day)',
                    'Monitor blood pressure daily',
                    'Follow up with cardiologist within 3 months',
                  ].map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Heart className="text-primary flex-shrink-0 mt-0.5" size={20} />
                      <p className="text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

