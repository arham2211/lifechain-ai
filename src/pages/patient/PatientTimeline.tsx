import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { visitService } from '../../services/visitService';
import type { Visit, Diagnosis } from '../../types';
import { Activity, FileText, Calendar, TrendingUp, Users, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDate } from '../../utils/formatters';
import { useLoading, useError } from '../../utils/hooks';

const patientNavItems = [
  { path: '/patient/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/patient/lab-reports', label: 'Lab Reports', icon: <FileText size={20} /> },
  { path: '/patient/visits', label: 'Visit History', icon: <Calendar size={20} /> },
  { path: '/patient/timeline', label: 'Disease Timeline', icon: <TrendingUp size={20} /> },
  { path: '/patient/family-history', label: 'Family History', icon: <Users size={20} /> },
  { path: '/patient/predictions', label: 'Health Predictions', icon: <TrendingUp size={20} /> },
  { path: '/patient/recommendations', label: 'AI Recommendations', icon: <Heart size={20} /> },
];

export const PatientTimeline: React.FC = () => {
  const { user } = useAuth();
  const [_visits, setVisits] = useState<Visit[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<string>('all');
  const [diseases, setDiseases] = useState<string[]>([]);
  const { isLoading, withLoading } = useLoading();
  const { error, setError, clearError } = useError();

  useEffect(() => {
    fetchTimelineData();
  }, [user]);

  const fetchTimelineData = async () => {
    try {
      clearError();
      await withLoading(async () => {
        const visitsData = await visitService.getVisits({
          patient_id: user?.entity_id || '',
          limit: 100,
        });
        setVisits(visitsData.items);

        // Fetch diagnoses for all visits
        const allDiagnoses: Diagnosis[] = [];
        for (const visit of visitsData.items) {
          try {
            const visitDiagnoses = await visitService.getDiagnoses(visit.visit_id);
            allDiagnoses.push(...visitDiagnoses);
          } catch (err) {
            // Skip if no diagnoses
          }
        }
        setDiagnoses(allDiagnoses);

        // Extract unique diseases
        const uniqueDiseases = Array.from(new Set(allDiagnoses.map(d => d.disease_name)));
        setDiseases(uniqueDiseases);
        if (uniqueDiseases.length > 0 && selectedDisease === 'all') {
          setSelectedDisease(uniqueDiseases[0]);
        }
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load timeline data');
    }
  };

  const getTimelineData = () => {
    const filtered = selectedDisease === 'all' 
      ? diagnoses 
      : diagnoses.filter(d => d.disease_name === selectedDisease);

    return filtered
      .sort((a, b) => new Date(a.diagnosed_date).getTime() - new Date(b.diagnosed_date).getTime())
      .map(d => ({
        date: new Date(d.diagnosed_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        severity: d.severity || 'N/A',
        disease: d.disease_name,
        status: d.status,
      }));
  };

  if (isLoading) {
    return (
      <Layout navItems={patientNavItems} title="Patient Portal">
        <LoadingSpinner fullScreen />
      </Layout>
    );
  }

  const timelineData = getTimelineData();

  return (
    <Layout navItems={patientNavItems} title="Patient Portal">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Disease Timeline</h2>
            <p className="text-gray-600 mt-1">Track your health conditions over time</p>
          </div>
          {diseases.length > 0 && (
            <div>
              <label className="text-sm text-gray-600 mr-2">Select Disease:</label>
              <select
                value={selectedDisease}
                onChange={(e) => setSelectedDisease(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                <option value="all">All Diseases</option>
                {diseases.map((disease) => (
                  <option key={disease} value={disease}>
                    {disease}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        {timelineData.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No diagnosis data available yet</p>
          </div>
        ) : (
          <>
            {/* Timeline Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progression Timeline</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="severity"
                      stroke="#1767B2"
                      strokeWidth={2}
                      name="Severity"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Diagnosis History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Diagnosis History</h3>
              <div className="space-y-3">
                {diagnoses
                  .filter(d => selectedDisease === 'all' || d.disease_name === selectedDisease)
                  .sort((a, b) => new Date(b.diagnosed_date).getTime() - new Date(a.diagnosed_date).getTime())
                  .map((diagnosis, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{diagnosis.disease_name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Diagnosed: {formatDate(diagnosis.diagnosed_date)}
                          </p>
                          {diagnosis.severity && (
                            <p className="text-sm text-gray-600">Severity: {diagnosis.severity}</p>
                          )}
                          {diagnosis.notes && (
                            <p className="text-sm text-gray-600 mt-2">{diagnosis.notes}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          diagnosis.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                          diagnosis.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {diagnosis.status}
                        </span>
                      </div>
                      {diagnosis.ml_confidence_score && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-sm text-gray-600">AI Confidence:</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-xs">
                            <div
                              className="h-2 bg-primary rounded-full"
                              style={{ width: `${diagnosis.ml_confidence_score * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {(diagnosis.ml_confidence_score * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

