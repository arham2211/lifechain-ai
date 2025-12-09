import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { StatCard } from '../../components/common/StatCard';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { DataTable, type Column } from '../../components/common/DataTable';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Patient, Visit, LabReport } from '../../types';
import { 
  Activity, 
  Calendar, 
  ClipboardList, 
  FileText, 
  TrendingUp, 
  Heart, 
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatDate, getStatusColor } from '../../utils/formatters';
import { useLoading, useError } from '../../utils/hooks';
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

const doctorNavItems = [
  { path: '/doctor/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/doctor/create-visit', label: 'Create Visit', icon: <ClipboardList size={20} /> },
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

// Mock data for demonstration - replace with actual API call
const mockProgressionReport: DiseaseProgressionReport = {
  patient_id: '12345',
  patient_name: 'Bhoomika Anwar',
  disease_name: 'ckd',
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
      confidence_score: 0.86,
      notes: "Patient showing improvement post-treatment",
      visit_date: "2026-08-16T20:55:30",
      visit_type: "consultation",
      doctor_notes: "Patient with polycystic kidney disease showing progressive decline in kidney function. CKD stage 3b. Genetic counseling and family screening recommended."
    }
  ],
  current_stage: "Improving",
  risk_factors: ["Family History", "Hypertension", "Diabetes"],
  recommendations: [
    "Schedule a follow-up appointment with your healthcare provider",
    "Maintain regular health monitoring and checkups",
    "Follow prescribed treatment plans consistently",
    "Adopt healthy lifestyle habits including balanced diet and regular exercise",
    "Keep track of your symptoms and report any changes to your doctor"
  ],
  predicted_progression: "Normal",
  confidence_score: 0.83,
  generated_at: "2025-12-07T21:30:56.032437"
};

const glassCard = "glass-card rounded-3xl shadow-lg border border-slate-100 bg-white/50 backdrop-blur-md";

export const DoctorPatientView: React.FC = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [progressionReport, setProgressionReport] = useState<DiseaseProgressionReport | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<string>('ckd');
  const [activeTab, setActiveTab] = useState<'overview' | 'visits' | 'labs' | 'timeline' | 'recommendations'>('overview');
  const [expandedEntries, setExpandedEntries] = useState<number[]>([]);
  const { isLoading, withLoading } = useLoading();
  const { error, setError, clearError } = useError();
  const navigate = useNavigate();
  const location = useLocation();

  let patientId: string | null = null;

  const extractPatientIdFromUrl = (): string | null => {
    const hash = location.pathname;
    if (hash.includes('/patient/')) {
      const parts = hash.split('/');
      const partIndex = parts.indexOf('patient') + 1;
      if (partIndex < parts.length) {
        const id = parts[partIndex];
        return id.split('?')[0].split('#')[0];
      }
    }
    return null;
  };

  const fetchPatientData = async (patientId: string) => {
    try {
      clearError();
      await withLoading(async () => {
        // Fetch patient details, visits, and lab reports concurrently
        const [patientResponse, visitsResponse, labsResponse] = await Promise.all([
          fetch(
            `http://localhost:8001/api/v1/patients/${patientId}`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            }
          ),
          fetch(
            `http://localhost:8001/api/v1/visits/?skip=0&limit=100&patient_id=${patientId}&lang=en`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            }
          ),
          fetch(
            `http://localhost:8001/api/v1/labs/reports?skip=0&limit=100&patient_id=${patientId}&lang=en`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            }
          ),
        ]);

        // Check if patient fetch was successful
        if (!patientResponse.ok) {
          throw new Error(`Failed to fetch patient: ${patientResponse.statusText}`);
        }

        const patientData = await patientResponse.json();
        setPatient(patientData);

        // Check if visits fetch was successful
        if (!visitsResponse.ok) {
          throw new Error(`Failed to fetch visits: ${visitsResponse.statusText}`);
        }
        if (!labsResponse.ok) {
          throw new Error(`Failed to fetch Lab Reports: ${visitsResponse.statusText}`);
        }

        const visitsData: Visit[] = await visitsResponse.json();
        setVisits(visitsData);

        const labsResponseData: LabReport[] = await labsResponse.json();
        setLabReports(labsResponseData);

        // Set mock progression data - replace with API call
        setProgressionReport(mockProgressionReport);
      });
    } catch (err: any) {
      console.error('Error fetching patient data:', err);
      setError(err.message || 'Failed to load patient data');
    }
  };
  
  useEffect(() => {
    patientId = extractPatientIdFromUrl();
    console.log('Extracted patient ID:', patientId);
    if (patientId) {
      fetchPatientData(patientId);
    } else {
      console.error('No patient ID provided in URL');
      navigate('/doctor/dashboard');
    }
  }, [navigate]);

  const formatChartData = () => {
    if (!progressionReport?.progression_timeline) return [];

    return progressionReport.progression_timeline.map(entry => {
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
    return <Info className="text-slate-500" />;
  };

  const toggleEntryExpansion = (index: number) => {
    setExpandedEntries(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  if (isLoading) {
    return (
      <Layout navItems={doctorNavItems} title="Doctor Portal">
        <div className="flex justify-center items-center h-64 text-slate-500">
          <p>Loading patient data...</p>
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout navItems={doctorNavItems} title="Doctor Portal">
        <div className="flex justify-center items-center h-64">
          <ErrorMessage 
            message="Patient not found or failed to load patient data" 
            onClose={() => navigate('/doctor/dashboard')} 
          />
        </div>
      </Layout>
    );
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

  const chartData = formatChartData();

  return (
    <Layout navItems={doctorNavItems} title="Doctor Portal">
      <div className="space-y-6">
        {/* Patient Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl shadow-lg p-6 lg:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-bold">{patient.first_name} {patient.last_name}</h2>
              <div className="mt-3 flex flex-wrap gap-4 text-sm opacity-90">
                <span className="bg-white/10 px-3 py-1 rounded-full">CNIC: {patient.cnic}</span>
                <span className="bg-white/10 px-3 py-1 rounded-full">Gender: <span className="capitalize">{patient.gender}</span></span>
                <span className="bg-white/10 px-3 py-1 rounded-full">DOB: {formatDate(patient.date_of_birth)}</span>
                <span className="bg-white/10 px-3 py-1 rounded-full">Blood Type: {patient.blood_group || 'N/A'}</span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/doctor/create-visit?patientId=${patientId}`)}
              className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-50 hover:scale-105 transition-all"
            >
              Create New Visit
            </button>
          </div>
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        {/* Tab Navigation */}
        <div className={`${glassCard}`}>
          <div className="border-b border-slate-100">
            <nav className="flex overflow-x-auto no-scrollbar">
              {[
                { key: 'overview', label: 'Overview', icon: Activity },
                { key: 'visits', label: 'Visits', icon: Calendar },
                { key: 'labs', label: 'Lab Reports', icon: FileText },
                { key: 'timeline', label: 'Disease Timeline', icon: TrendingUp },
                { key: 'recommendations', label: 'Recommendations', icon: Heart },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'border-b-2 border-primary text-primary bg-slate-50/50'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50/30'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6 lg:p-8">
            {/* Timeline Tab - Updated with Disease Progression */}
            {activeTab === 'timeline' && progressionReport && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header with Disease Selector */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Disease Progression Timeline</h3>
                    <p className="text-slate-500 mt-1">Track disease progression and severity over time</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Select Disease</label>
                      <select
                        value={selectedDisease}
                        onChange={(e) => setSelectedDisease(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px] bg-slate-50"
                      >
                        {DISEASE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="px-5 py-2 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Report Generated</p>
                      <p className="text-sm font-bold text-blue-900">
                        {new Date(progressionReport.generated_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(progressionReport.current_stage)}
                      <span className="font-medium text-slate-900">Current Stage</span>
                    </div>
                    <div 
                      className="text-2xl font-bold py-2 px-3 rounded-lg inline-block"
                      style={{ 
                        backgroundColor: `${getStageColor(progressionReport.current_stage)}20`,
                        color: getStageColor(progressionReport.current_stage)
                      }}
                    >
                      {progressionReport.current_stage}
                    </div>
                  </div>

                  <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="text-purple-500" />
                      <span className="font-medium text-slate-900">Predicted Progression</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 py-2">
                      {progressionReport.predicted_progression}
                    </div>
                    <div className="text-sm text-slate-500">
                      Confidence: {(progressionReport.confidence_score * 100).toFixed(1)}%
                    </div>
                  </div>

                  <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="text-orange-500" />
                      <span className="font-medium text-slate-900">Severity Score</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div 
                        className="text-2xl font-bold py-2 px-4 rounded-lg"
                        style={{ 
                          backgroundColor: `${getSeverityColor(progressionReport.progression_timeline[progressionReport.progression_timeline.length - 1]?.severity_score || 0)}20`,
                          color: getSeverityColor(progressionReport.progression_timeline[progressionReport.progression_timeline.length - 1]?.severity_score || 0)
                        }}
                      >
                        {progressionReport.progression_timeline[progressionReport.progression_timeline.length - 1]?.severity_score.toFixed(1) || 'N/A'}
                      </div>
                      <div className="text-sm text-slate-500">
                        Scale: 0-10 (10 = most severe)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progression Timeline Chart */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:p-8">
                  <h4 className="text-lg font-bold text-slate-900 mb-6">Progression Timeline</h4>
                  <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="date" 
                          name="Date"
                          tick={{ fill: '#64748b' }}
                          axisLine={{ stroke: '#cbd5e1' }}
                        />
                        <YAxis 
                          dataKey="severity" 
                          name="Severity Score"
                          domain={[0, 10]}
                          tick={{ fill: '#64748b' }}
                          axisLine={{ stroke: '#cbd5e1' }}
                          label={{ 
                            value: 'Severity Score', 
                            angle: -90, 
                            position: 'insideLeft',
                            offset: -10,
                            style: { textAnchor: 'middle', fill: '#64748b' }
                          }}
                        />
                        <ZAxis dataKey="confidence" range={[100, 500]} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xl">
                                  <p className="font-bold text-slate-900">{data.date}</p>
                                  <p className="text-sm text-slate-600 mt-2">
                                    <span className="font-medium">Stage:</span>{' '}
                                    <span style={{ color: data.color }}>{data.stage}</span>
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    <span className="font-medium">Severity:</span> {data.severity}
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    <span className="font-medium">Confidence:</span> {(data.confidence * 100).toFixed(0)}%
                                  </p>
                                  {data.notes && (
                                    <p className="text-sm text-slate-500 mt-2 italic border-t border-slate-100 pt-2">"{data.notes}"</p>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Scatter
                          name="Progression Points"
                          data={chartData}
                          fill="#3b82f6"
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
                                style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))' }}
                              />
                            );
                          }}
                        />
                        <Line
                          type="monotone"
                          data={chartData}
                          dataKey="severity"
                          stroke="#94a3b8"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                          name="Trend Line"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detailed Progression History */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:p-8">
                  <h4 className="text-lg font-bold text-slate-900 mb-6">Detailed Progression History</h4>
                  <div className="space-y-4">
                    {progressionReport.progression_timeline.map((entry, index) => (
                      <div key={index} className="relative pl-8 pb-6 last:pb-0">
                        {/* Timeline line */}
                        {index < progressionReport.progression_timeline.length - 1 && (
                          <div className="absolute left-[15px] top-[24px] bottom-0 w-0.5 bg-slate-200" />
                        )}
                        
                        {/* Timeline dot */}
                        <div 
                          className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white shadow-md z-10"
                          style={{ backgroundColor: getStageColor(entry.progression_stage) }}
                        />
                        
                        <div className="bg-slate-50 rounded-xl p-5 hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-slate-100"
                             onClick={() => toggleEntryExpansion(index)}>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <span 
                                  className="px-3 py-1 rounded-full text-sm font-bold text-white shadow-sm"
                                  style={{ backgroundColor: getStageColor(entry.progression_stage) }}
                                >
                                  {entry.progression_stage}
                                </span>
                                <span className="text-sm text-slate-500 font-medium">
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
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Severity</div>
                                <div 
                                  className="text-lg font-bold"
                                  style={{ color: getSeverityColor(entry.severity_score) }}
                                >
                                  {entry.severity_score.toFixed(1)}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Confidence</div>
                                <div className="text-lg font-bold text-blue-600">
                                  {(entry.confidence_score * 100).toFixed(0)}%
                                </div>
                              </div>
                              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                {expandedEntries.includes(index) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-slate-700 leading-relaxed">{entry.notes}</p>
                          
                          {expandedEntries.includes(index) && (
                            <div className="mt-4 space-y-3 animate-in fade-in duration-300">
                              {entry.doctor_notes && (
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                  <p className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
                                    <ClipboardList size={16} /> Doctor's Notes
                                  </p>
                                  <p className="text-sm text-blue-800">{entry.doctor_notes}</p>
                                </div>
                              )}
                              
                              {entry.visit_date && (
                                <div className="flex items-center gap-2 text-sm text-slate-600 bg-white p-2 rounded-lg border border-slate-100 inline-block">
                                  <Clock size={16} className="text-slate-400" />
                                  <span>Visit: {new Date(entry.visit_date).toLocaleDateString()}</span>
                                  {entry.visit_type && (
                                    <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded text-xs font-medium text-slate-600 uppercase">
                                      {entry.visit_type}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


                {/* Risk Factors Section */}
                {progressionReport.risk_factors && progressionReport.risk_factors.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                    <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="text-red-500" /> Risk Factors
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {progressionReport.risk_factors.map((factor, index) => (
                        <span key={index} className="px-4 py-2 bg-red-50 text-red-700 border border-red-100 rounded-full text-sm font-medium">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    title="Total Visits"
                    value={visits.length}
                    icon={Calendar}
                    color="primary"
                  />
                  <StatCard
                    title="Lab Reports"
                    value={labReports.length}
                    icon={FileText}
                     color="success"
                  />
                  <StatCard
                    title="Pending Reports"
                    value={labReports.filter(r => r.status === 'pending').length}
                    icon={Clock}
                     color="warning"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {visits.slice(0, 3).map((visit) => (
                      <div key={visit.visit_id} className="p-5 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-slate-900">{visit.chief_complaint}</p>
                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                <Calendar size={14} />
                                {formatDate(visit.visit_date)}
                            </p>
                          </div>
                          <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg capitalize">{visit.visit_type || 'General'}</span>
                        </div>
                      </div>
                    ))}
                    {visits.length === 0 && (
                        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-500">No recent activity found.</p>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Visits Tab */}
            {activeTab === 'visits' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Visit History</h3>
                </div>
                {visits.length > 0 ? (
                    <div className="rounded-2xl border border-slate-200 overflow-hidden">
                        <DataTable
                            data={visits}
                            columns={visitColumns}
                            isLoading={isLoading}
                        />
                    </div>
                ) : (
                     <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <ClipboardList size={32} className="text-slate-400" />
                        </div>
                        <p className="text-slate-900 font-medium">No visits recorded</p>
                    </div>
                )}
              </div>
            )}

            {/* Lab Reports Tab */}
            {activeTab === 'labs' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Lab Reports</h3>
                </div>
                {labReports.length > 0 ? (
                    <div className="rounded-2xl border border-slate-200 overflow-hidden">
                         <DataTable
                            data={labReports}
                            columns={labColumns}
                            isLoading={isLoading}
                        />
                    </div>
                ) : (
                     <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <FileText size={32} className="text-slate-400" />
                        </div>
                        <p className="text-slate-900 font-medium">No lab reports available</p>
                    </div>
                )}
              </div>
            )}
            
            {activeTab === 'recommendations' && progressionReport?.recommendations && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <h3 className="text-xl font-bold text-slate-900 mb-6">AI Recommendations</h3>
                     <div className="grid gap-4">
                         {progressionReport.recommendations.map((rec, index) => (
                             <div key={index} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-4 hover:border-blue-200 transition-colors">
                                 <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                     <CheckCircle size={18} />
                                 </div>
                                 <p className="text-slate-700 font-medium leading-relaxed">{rec}</p>
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