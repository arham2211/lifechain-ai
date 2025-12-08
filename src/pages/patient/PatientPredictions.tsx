import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { patientService } from '../../services/patientService';
import type { ProgressionPrediction } from '../../types';
import { Activity, FileText, Calendar, TrendingUp, Users, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getRiskLevelColor } from '../../utils/formatters';

const patientNavItems = [
  { path: '/patient/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/patient/lab-reports', label: 'Lab Reports', icon: <FileText size={20} /> },
  { path: '/patient/visits', label: 'Visit History', icon: <Calendar size={20} /> },
  { path: '/patient/timeline', label: 'Disease Timeline', icon: <TrendingUp size={20} /> },
  { path: '/patient/family-history', label: 'Family History', icon: <Users size={20} /> },
  { path: '/patient/predictions', label: 'Health Predictions', icon: <TrendingUp size={20} /> },
  { path: '/patient/recommendations', label: 'AI Recommendations', icon: <Heart size={20} /> },
];

export const PatientPredictions: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [predictions, setPredictions] = useState<ProgressionPrediction[]>([]);
  const [selectedMonths, setSelectedMonths] = useState(6);

  useEffect(() => {
    fetchPredictions();
  }, [user, selectedMonths]);

  const fetchPredictions = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await patientService.predictProgression(user?.entity_id || '', selectedMonths);
      setPredictions(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load predictions. Make sure you have sufficient medical history.');
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Health Predictions</h2>
            <p className="text-slate-600 mt-1">AI-powered progression forecasts</p>
          </div>
          <div>
            <label className="text-sm text-slate-600 mr-2">Forecast Period:</label>
            <select
              value={selectedMonths}
              onChange={(e) => setSelectedMonths(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
              <option value={12}>12 Months</option>
              <option value={24}>24 Months</option>
            </select>
          </div>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {predictions.length === 0 && !error ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-slate-600">No prediction data available. Please check back after you have more medical history.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {predictions.map((prediction, index) => {
              const chartData = prediction.predictions.map(p => ({
                date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                severity: p.predicted_severity,
                confidence: p.confidence,
              }));

              return (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{prediction.disease_name}</h3>
                      <p className="text-sm text-slate-600 mt-1">Current Status: {prediction.current_status}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(prediction.risk_level)}`}>
                      {prediction.risk_level} Risk
                    </span>
                  </div>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis label={{ value: 'Severity', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="severity"
                          stroke="#1767B2"
                          strokeWidth={2}
                          name="Predicted Severity"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

