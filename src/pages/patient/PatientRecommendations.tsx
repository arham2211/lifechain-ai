import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { patientService } from '../../services/patientService';
import type { Recommendation } from '../../types';
import { Activity, FileText, Calendar, TrendingUp, Users, Heart, AlertCircle } from 'lucide-react';

const patientNavItems = [
  { path: '/patient/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/patient/lab-reports', label: 'Lab Reports', icon: <FileText size={20} /> },
  { path: '/patient/visits', label: 'Visit History', icon: <Calendar size={20} /> },
  { path: '/patient/timeline', label: 'Disease Timeline', icon: <TrendingUp size={20} /> },
  { path: '/patient/family-history', label: 'Family History', icon: <Users size={20} /> },
  { path: '/patient/predictions', label: 'Health Predictions', icon: <TrendingUp size={20} /> },
  { path: '/patient/recommendations', label: 'AI Recommendations', icon: <Heart size={20} /> },
];

export const PatientRecommendations: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await patientService.getRecommendations(user?.entity_id || '');
      setRecommendations(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load recommendations. Make sure you have recent medical data.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout navItems={patientNavItems} title="Patient Portal">
        <LoadingSpinner fullScreen />
      </Layout>
    );
  }

  return (
    <Layout navItems={patientNavItems} title="Patient Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Health Recommendations</h2>
          <p className="text-gray-600 mt-1">Personalized health guidance based on your medical data</p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {recommendations.length === 0 && !error ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Heart className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No recommendations available yet. Keep updating your medical records!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{rec.disease_name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Based on: {rec.based_on_data}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Confidence</p>
                    <p className="text-lg font-semibold text-primary">
                      {(rec.confidence_score * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {rec.recommendations.map((r, i) => {
                    const priorityColors = {
                      high: 'border-red-300 bg-red-50',
                      medium: 'border-yellow-300 bg-yellow-50',
                      low: 'border-green-300 bg-green-50',
                    };

                    const priorityIcons = {
                      high: 'bg-red-100 text-red-800',
                      medium: 'bg-yellow-100 text-yellow-800',
                      low: 'bg-green-100 text-green-800',
                    };

                    return (
                      <div
                        key={i}
                        className={`p-4 rounded-lg border ${priorityColors[r.priority]}`}
                      >
                        <div className="flex items-start gap-3">
                          {r.priority === 'high' && <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${priorityIcons[r.priority]}`}>
                                {r.priority.toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-600 capitalize">{r.category}</span>
                            </div>
                            <p className="text-gray-900">{r.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

