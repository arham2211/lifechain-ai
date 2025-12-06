import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { patientService } from '../../services/patientService';
import type { CompleteFamilyTree } from '../../types';
import { Activity, FileText, Calendar, TrendingUp, Users, Heart, AlertTriangle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const patientNavItems = [
  { path: '/patient/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/patient/lab-reports', label: 'Lab Reports', icon: <FileText size={20} /> },
  { path: '/patient/visits', label: 'Visit History', icon: <Calendar size={20} /> },
  { path: '/patient/timeline', label: 'Disease Timeline', icon: <TrendingUp size={20} /> },
  { path: '/patient/family-history', label: 'Family History', icon: <Users size={20} /> },
  { path: '/patient/predictions', label: 'Health Predictions', icon: <TrendingUp size={20} /> },
  { path: '/patient/recommendations', label: 'AI Recommendations', icon: <Heart size={20} /> },
];

export const PatientFamilyHistory: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [familyTree, setFamilyTree] = useState<CompleteFamilyTree | null>(null);

  useEffect(() => {
    fetchFamilyTree();
  }, [user]);

  const fetchFamilyTree = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await patientService.getCompleteFamilyTree(user?.entity_id || '');
      setFamilyTree(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load family history');
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
          <h2 className="text-2xl font-bold text-gray-900">Family Medical History</h2>
          <p className="text-gray-600 mt-1">View your family tree and genetic risk assessment</p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        {familyTree && (
          <>
            {/* Genetic Risk Assessment */}
            {familyTree.genetic_risks && familyTree.genetic_risks.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-yellow-600" size={20} />
                  Genetic Risk Assessment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {familyTree.genetic_risks.map((risk, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{risk.disease_name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          risk.risk_score >= 0.7 ? 'bg-red-100 text-red-800' :
                          risk.risk_score >= 0.4 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          Risk: {(risk.risk_score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {risk.affected_relatives} affected relative{risk.affected_relatives !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Family Members */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Members</h3>
              <div className="space-y-4">
                {familyTree.family_members.map((member, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-gray-900">{member.name}</h4>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium capitalize">
                            {member.relationship}
                          </span>
                          {member.is_blood_relative && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              Blood Relative
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          DOB: {formatDate(member.date_of_birth)} • {member.gender}
                        </p>
                      </div>
                    </div>
                    {member.diseases && member.diseases.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Medical Conditions:</p>
                        <div className="flex flex-wrap gap-2">
                          {member.diseases.map((disease, i) => (
                            <span key={i} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs">
                              {disease}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Family Tree Visualization */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Tree Visualization</h3>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Users className="mx-auto text-gray-400 mb-4" size={64} />
                <p className="text-gray-600">
                  Interactive family tree visualization coming soon
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This will show a visual tree with relationships and health status
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

