import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { Activity, TrendingUp, AlertCircle, CheckCircle, Info, Clock, BarChart3 } from 'lucide-react';
import { 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  ZAxis
} from 'recharts';

const patientNavItems = [
  { path: '/patient/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/patient/lab-reports', label: 'Lab Reports', icon: <BarChart3 size={20} /> },
  { path: '/patient/visits', label: 'Visit History', icon: <Clock size={20} /> },
  { path: '/patient/timeline', label: 'Disease Timeline', icon: <TrendingUp size={20} /> },
  { path: '/patient/predictions', label: 'Health Predictions', icon: <TrendingUp size={20} /> },
];

interface ProgressionEntry {
  date: string;
  progression_stage: string;
  severity_score: number;
  confidence_score: number;
  notes: string;
  visit_date: string | null;
  visit_type: string | null;
  doctor_notes: string | null;
}

interface DiseaseProgressionReport {
  patient_id: string;
  patient_name: string;
  disease_name: string;
  progression_timeline: ProgressionEntry[];
  current_stage: string;
  risk_factors: string[];
  recommendations: string[];
  predicted_progression: string;
  confidence_score: number;
  generated_at: string;
}

const DISEASE_OPTIONS = [
  { value: 'ckd', label: 'Chronic Kidney Disease' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'anemia', label: 'Anemia' }
];

const STAGE_COLORS: Record<string, string> = {
  'Stage 1': '#4CAF50',
  'Stage 2': '#8BC34A',
  'Stage 3a': '#FFC107',
  'Stage 3b': '#FF9800',
  'Stage 4': '#FF5722',
  'Stage 5': '#D32F2F',
  'ESRD': '#9C27B0',
  'Improving': '#2196F3',
  'Stable': '#00BCD4',
  'Worsening': '#F44336',
  'Normal': '#4CAF50'
};

const SEVERITY_COLORS = [
  '#4CAF50', // 0-2: Green
  '#8BC34A', // 2-4
  '#FFC107', // 4-6: Yellow
  '#FF9800', // 6-8: Orange
  '#F44336'  // 8-10: Red
];

// API Client function
// const fetchProgressionReportFromAPI = async (patientId: string, diseaseName: string) => {
//   try {
//     const response = await fetch(`https://41a48310e4fa.ngrok-free.app/api/v1/reports/patient/${patientId}/progression-report?disease_name=${diseaseName}&months_back=13`, {
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true'
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`API Error: ${response.status} ${response.statusText}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('API Error:', error);
//     throw error;
//   }
// };

export const PatientTimeline: React.FC = () => {
  const { user } = useAuth();
  const [report, setReport] = useState<DiseaseProgressionReport | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<string>('ckd');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.entity_id) {
      fetchProgressionReport();
    }
  }, [user, selectedDisease]);

  const fetchProgressionReport = async () => {
    if (!user?.entity_id) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Use sample data for demo - remove this and uncomment the API call for real data
      const sampleReport: DiseaseProgressionReport = {
        patient_id: user.entity_id,
        patient_name: user.name || "Bhoomika Anwar",
        disease_name: selectedDisease,
        progression_timeline: [
          {
            date: "2024-12-07T20:35:46.744900",
            progression_stage: "Stage 3a",
            severity_score: 4,
            confidence_score: 0.91,
            notes: "Moderate decrease in kidney function",
            visit_date: null,
            visit_type: null,
            doctor_notes: null
          },
          {
            date: "2025-03-07T20:35:46.744900",
            progression_stage: "Stage 3a",
            severity_score: 4,
            confidence_score: 0.89,
            notes: "Started ACE inhibitor therapy",
            visit_date: null,
            visit_type: null,
            doctor_notes: null
          },
          {
            date: "2025-06-10T20:35:46.744900",
            progression_stage: "Stage 3b",
            severity_score: 5.5,
            confidence_score: 0.93,
            notes: "Further decline despite treatment",
            visit_date: null,
            visit_type: null,
            doctor_notes: null
          },
          {
            date: "2025-08-09T20:35:46.744900",
            progression_stage: "Stage 3b",
            severity_score: 5.5,
            confidence_score: 0.9,
            notes: "Referral to nephrologist",
            visit_date: null,
            visit_type: null,
            doctor_notes: null
          },
          {
            date: "2025-10-08T20:35:46.744900",
            progression_stage: "Stage 4",
            severity_score: 7.5,
            confidence_score: 0.94,
            notes: "Severe kidney function loss - dialysis planning",
            visit_date: null,
            visit_type: null,
            doctor_notes: null
          },
          {
            date: "2025-11-07T20:35:46.744900",
            progression_stage: "Stage 4",
            severity_score: 7.5,
            confidence_score: 0.92,
            notes: "Pre-dialysis education completed",
            visit_date: null,
            visit_type: null,
            doctor_notes: null
          },
          {
            date: "2025-11-30T20:35:46.744900",
            progression_stage: "ESRD",
            severity_score: 10,
            confidence_score: 0.96,
            notes: "End-stage renal disease - dialysis initiated",
            visit_date: null,
            visit_type: null,
            doctor_notes: null
          },
          {
            date: "2026-08-16T20:55:30",
            progression_stage: "Improving",
            severity_score: 5,
            confidence_score: 0.8621063996605203,
            notes: "Final assessment: Improving",
            visit_date: "2026-08-16T20:55:30",
            visit_type: "consultation",
            doctor_notes: "Patient with polycystic kidney disease showing progressive decline in kidney function. CKD stage 3b. Genetic counseling and family screening recommended."
          }
        ],
        current_stage: "Improving",
        risk_factors: [],
        recommendations: [
          "Schedule a follow-up appointment with your healthcare provider",
          "Maintain regular health monitoring and checkups",
          "Follow prescribed treatment plans consistently",
          "Adopt healthy lifestyle habits including balanced diet and regular exercise",
          "Keep track of your symptoms and report any changes to your doctor"
        ],
        predicted_progression: "Normal",
        confidence_score: 0.8299329876899719,
        generated_at: "2025-12-07T21:30:56.032437"
      };
      
      setReport(sampleReport);
      
      // UNCOMMENT THIS FOR REAL API CALL:
      // const data = await fetchProgressionReportFromAPI(user.entity_id, selectedDisease);
      // setReport(data);
      
    } catch (err: any) {
      setError(err.message || 'Failed to load progression report');
      console.error('Error fetching report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatChartData = () => {
    if (!report?.progression_timeline) return [];

    return report.progression_timeline.map(entry => {
      const date = new Date(entry.date);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        fullDate: entry.date,
        severity: entry.severity_score,
        confidence: entry.confidence_score,
        stage: entry.progression_stage,
        notes: entry.notes,
        color: STAGE_COLORS[entry.progression_stage] || '#666'
      };
    });
  };

  const getStageColor = (stage: string) => {
    return STAGE_COLORS[stage] || '#666';
  };

  const getSeverityColor = (score: number) => {
    if (score <= 2) return SEVERITY_COLORS[0];
    if (score <= 4) return SEVERITY_COLORS[1];
    if (score <= 6) return SEVERITY_COLORS[2];
    if (score <= 8) return SEVERITY_COLORS[3];
    return SEVERITY_COLORS[4];
  };

  const getStatusIcon = (stage: string) => {
    if (stage.toLowerCase().includes('improving')) return <CheckCircle className="text-green-500" />;
    if (stage.toLowerCase().includes('worsening') || stage.includes('ESRD')) return <AlertCircle className="text-red-500" />;
    if (stage.toLowerCase().includes('stable')) return <Info className="text-blue-500" />;
    return <Info className="text-gray-500" />;
  };

  if (isLoading) {
    return (
      <Layout navItems={patientNavItems} title="Patient Portal">
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner fullScreen />
        </div>
      </Layout>
    );
  }

  const chartData = formatChartData();

  return (
    <Layout navItems={patientNavItems} title="Patient Portal">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Disease Progression Timeline</h2>
              <p className="text-gray-600 mt-1">Track disease progression and severity over time</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Disease</label>
                <select
                  value={selectedDisease}
                  onChange={(e) => setSelectedDisease(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
                >
                  {DISEASE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {report && (
                <div className="px-4 py-2 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Report Generated</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(report.generated_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} onClose={() => setError(null)} />
          </div>
        )}

        {report ? (
          <>
            {/* Current Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(report.current_stage)}
                    <span className="font-medium text-gray-900">Current Stage</span>
                  </div>
                  <div 
                    className="text-2xl font-bold py-2 px-3 rounded"
                    style={{ 
                      backgroundColor: `${getStageColor(report.current_stage)}20`,
                      color: getStageColor(report.current_stage)
                    }}
                  >
                    {report.current_stage}
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="text-purple-500" />
                    <span className="font-medium text-gray-900">Predicted Progression</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 py-2">
                    {report.predicted_progression}
                  </div>
                  <div className="text-sm text-gray-600">
                    Confidence: {(report.confidence_score * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="text-orange-500" />
                    <span className="font-medium text-gray-900">Severity Score</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div 
                      className="text-2xl font-bold py-2 px-4 rounded"
                      style={{ 
                        backgroundColor: `${getSeverityColor(report.progression_timeline[report.progression_timeline.length - 1]?.severity_score || 0)}20`,
                        color: getSeverityColor(report.progression_timeline[report.progression_timeline.length - 1]?.severity_score || 0)
                      }}
                    >
                      {report.progression_timeline[report.progression_timeline.length - 1]?.severity_score.toFixed(1) || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">
                      Scale: 0-10 (10 = most severe)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progression Timeline</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      name="Date"
                      tick={{ fill: '#666' }}
                      axisLine={{ stroke: '#ddd' }}
                    />
                    <YAxis 
                      dataKey="severity" 
                      name="Severity Score"
                      domain={[0, 10]}
                      tick={{ fill: '#666' }}
                      axisLine={{ stroke: '#ddd' }}
                      label={{ 
                        value: 'Severity Score', 
                        angle: -90, 
                        position: 'insideLeft',
                        offset: -10,
                        style: { textAnchor: 'middle', fill: '#666' }
                      }}
                    />
                    <ZAxis dataKey="confidence" range={[100, 500]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-semibold text-gray-900">{data.date}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Stage:</span>{' '}
                                <span style={{ color: data.color }}>{data.stage}</span>
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Severity:</span> {data.severity}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Confidence:</span> {(data.confidence * 100).toFixed(0)}%
                              </p>
                              {data.notes && (
                                <p className="text-sm text-gray-600 mt-2 italic">"{data.notes}"</p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Scatter
                      name="Progression Points"
                      data={chartData}
                      fill="#8884d8"
                      shape={(props: any) => {
                        const { cx, cy, payload } = props;
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={8 + (payload.confidence * 3)}
                            fill={payload.color}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        );
                      }}
                    />
                    <Line
                      type="monotone"
                      data={chartData}
                      dataKey="severity"
                      stroke="#8884d8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Trend Line"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Progression Timeline Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Progression History</h3>
              <div className="space-y-4">
                {report.progression_timeline.map((entry, index) => (
                  <div key={index} className="relative pl-8 pb-6 last:pb-0">
                    {/* Timeline line */}
                    {index < report.progression_timeline.length - 1 && (
                      <div className="absolute left-[15px] top-[24px] bottom-0 w-0.5 bg-gray-200" />
                    )}
                    
                    {/* Timeline dot */}
                    <div 
                      className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: getStageColor(entry.progression_stage) }}
                    />
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span 
                              className="px-3 py-1 rounded-full text-sm font-medium text-white"
                              style={{ backgroundColor: getStageColor(entry.progression_stage) }}
                            >
                              {entry.progression_stage}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(entry.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-sm text-gray-600">Severity</div>
                            <div 
                              className="text-lg font-bold"
                              style={{ color: getSeverityColor(entry.severity_score) }}
                            >
                              {entry.severity_score.toFixed(1)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600">Confidence</div>
                            <div className="text-lg font-bold text-blue-600">
                              {(entry.confidence_score * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{entry.notes}</p>
                      
                      {entry.doctor_notes && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded">
                          <p className="text-sm font-medium text-blue-900 mb-1">Doctor's Notes:</p>
                          <p className="text-sm text-blue-800">{entry.doctor_notes}</p>
                        </div>
                      )}
                      
                      {entry.visit_date && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={14} />
                          <span>Visit: {new Date(entry.visit_date).toLocaleDateString()}</span>
                          {entry.visit_type && (
                            <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                              {entry.visit_type}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                    <p className="text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Factors (if any) */}
            {report.risk_factors && report.risk_factors.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors</h3>
                <div className="flex flex-wrap gap-2">
                  {report.risk_factors.map((factor, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No progression data available for {selectedDisease}</p>
            <button
              onClick={fetchProgressionReport}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load Report
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};