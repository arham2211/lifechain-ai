import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import {
  Calendar,
  Stethoscope,
  AlertCircle,
  FileText,
  ArrowLeft,
  Activity,
  TrendingUp,
  Users,
  Heart,
  Clock,
} from "lucide-react";
import { formatDate } from "../../utils/formatters";
import { useError, useLoading } from "../../utils/hooks";
import { useNavigate, useLocation } from "react-router-dom";

const patientNavItems = [
  {
    path: "/patient/dashboard",
    label: "Dashboard",
    icon: <Activity size={20} />,
  },
  {
    path: "/patient/lab-reports",
    label: "Lab Reports",
    icon: <FileText size={20} />,
  },
  {
    path: "/patient/visits",
    label: "Visit History",
    icon: <Calendar size={20} />,
  },
  {
    path: "/patient/timeline",
    label: "Disease Timeline",
    icon: <TrendingUp size={20} />,
  },
  {
    path: "/patient/family-history",
    label: "Family History",
    icon: <Users size={20} />,
  },
  {
    path: "/patient/predictions",
    label: "Health Predictions",
    icon: <TrendingUp size={20} />,
  },
  {
    path: "/patient/recommendations",
    label: "AI Recommendations",
    icon: <Heart size={20} />,
  },
];

interface Symptom {
  id: string;
  visit_id: string;
  symptom_name: string;
  severity: number;
  duration_days: number;
  notes: string;
  created_at: string;
}

interface Diagnosis {
  diagnosis_id: string;
  visit_id: string;
  disease_name: string;
  diagnosis_date: string;
  confidence_score: number;
  ml_model_used: string;
  status: string;
  notes: string | null;
  created_at: string;
}

interface VisitDetails {
  visit_id: string;
  visit_date: string;
  visit_type: string;
  chief_complaint: string;
  doctor_patient_id: string;
  patient_id: string;
  doctor_notes: string;
  vital_signs: any;
  created_at: string;
  updated_at: string;
}

interface DoctorInfo {
  first_name: string;
  last_name: string;
}

export const PatientVisitDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visit, setVisit] = useState<VisitDetails | null>(null);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo | null>(null);
  const { isLoading, setIsLoading } = useLoading();
  const { error, setError, clearError } = useError();

  // Extract visit ID from URL
  const extractVisitIdFromUrl = (): string | null => {
    const hash = location.pathname;
    if (hash.includes('/visits/')) {
      const parts = hash.split('/');
      const visitIndex = parts.indexOf('visits') + 1;
      if (visitIndex < parts.length) {
        const id = parts[visitIndex];
        return id.split('?')[0].split('#')[0];
      }
    }
    return null;
  };

  const visitId = extractVisitIdFromUrl();
  console.log('Extracted Visit ID:', visitId);

  // Function to fetch visit details
  const fetchVisitDetails = async () => {
    if (!visitId) return;
    
    try {
      setIsLoading(true);
      clearError();
      
      const response = await fetch(
        `http://localhost:8001/api/v1/visits/${visitId}?lang=en`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch visit details");
      }
      
      const visitData: VisitDetails = await response.json();
      setVisit(visitData);
      
      // Fetch doctor info
      await fetchDoctorInfo(visitData.doctor_patient_id);
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to load visit details");
      } else {
        setError("Failed to load visit details");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch doctor information
  const fetchDoctorInfo = async (doctorPatientId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8001/api/v1/doctors/${doctorPatientId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch doctor information");
      }

      const doctorData: DoctorInfo = await response.json();
      setDoctorInfo(doctorData);
    } catch (err) {
      console.error("Error fetching doctor info:", err);
    }
  };

  // Function to fetch symptoms
  const fetchSymptoms = async () => {
    if (!visitId) return;
    
    try {
      const response = await fetch(
        `http://localhost:8001/api/v1/visits/${visitId}/symptoms?lang=en`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch symptoms");
      }
      
      const symptomsData: Symptom[] = await response.json();
      setSymptoms(symptomsData);
    } catch (err: unknown) {
      console.error("Error fetching symptoms:", err);
    }
  };

  // Function to fetch diagnoses
  const fetchDiagnoses = async () => {
    if (!visitId) return;
    
    try {
      const response = await fetch(
        `http://localhost:8001/api/v1/visits/${visitId}/diagnoses?lang=en`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch diagnoses");
      }
      
      const diagnosesData: Diagnosis[] = await response.json();
      setDiagnoses(diagnosesData);
    } catch (err: unknown) {
      console.error("Error fetching diagnoses:", err);
    }
  };

  // Format visit type for display
  const formatVisitType = (visitType: string) => {
    return visitType
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get severity color based on severity level (1-10)
  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return "bg-green-100 text-green-800";
    if (severity <= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Get severity label
  const getSeverityLabel = (severity: number) => {
    if (severity <= 3) return "Mild";
    if (severity <= 6) return "Moderate";
    return "Severe";
  };

  // Get diagnosis status color
  const getDiagnosisStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "ruled_out":
        return "bg-slate-100 text-slate-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Format confidence score to percentage
  const formatConfidenceScore = (score: number) => {
    return `${(score * 100).toFixed(1)}%`;
  };

  const goBack = () => {
    navigate("/patient/visits");
  };

  useEffect(() => {
    if (visitId) {
      fetchVisitDetails();
      fetchSymptoms();
      fetchDiagnoses();
    }
  }, [visitId]);

  if (!visitId) {
    return (
      <Layout navItems={patientNavItems} title="Patient Portal">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message="Visit ID is missing" onClose={() => navigate("/patient/visits")} />
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout navItems={patientNavItems} title="Patient Portal">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!visit) {
    return (
      <Layout navItems={patientNavItems} title="Patient Portal">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-lg font-medium text-slate-900">
              Visit not found
            </h3>
            <p className="mt-1 text-slate-500">
              The requested visit could not be found.
            </p>
            <button
              onClick={goBack}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Visits
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout navItems={patientNavItems} title="Patient Portal">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={goBack}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Visits
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Visit Details</h1>
          <p className="text-slate-600 mt-2">
            Detailed information about your medical visit
          </p>
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        <div className="space-y-6">
          {/* Visit Overview Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {formatVisitType(visit.visit_type)}
                  </h3>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Date & Time</p>
                      <p className="text-sm text-slate-900">{formatDate(visit.visit_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Doctor</p>
                      <p className="text-sm text-slate-900">
                        {doctorInfo ? `Dr. ${doctorInfo.first_name} ${doctorInfo.last_name}` : "Loading..."}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Visit Type</p>
                      <p className="text-sm text-slate-900">{formatVisitType(visit.visit_type)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Chief Complaint</p>
                      <p className="text-sm text-slate-900">
                        {visit.chief_complaint || "Routine checkup"}
                      </p>
                    </div>
                  </div>
                  {visit.doctor_notes && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-700">Doctor's Notes</p>
                      <p className="text-sm text-slate-900 mt-1">{visit.doctor_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Symptoms Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-slate-900">Reported Symptoms</h3>
                <span className="ml-auto px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                  {symptoms.length} symptoms
                </span>
              </div>

              {symptoms.length === 0 ? (
                <div className="text-center py-6 text-slate-500">
                  No symptoms recorded for this visit
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Symptom
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Severity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {symptoms.map((symptom) => (
                        <tr key={symptom.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900">
                              {symptom.symptom_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                                {getSeverityLabel(symptom.severity)} ({symptom.severity}/10)
                              </div>
                              <div className="ml-3 w-32 bg-slate-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${symptom.severity * 10}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900 flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-slate-400" />
                              {symptom.duration_days} days
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900 max-w-xs">
                              {symptom.notes || "No additional notes"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Diagnoses Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Stethoscope className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-slate-900">Diagnoses</h3>
                <span className="ml-auto px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                  {diagnoses.length} diagnoses
                </span>
              </div>

              {diagnoses.length === 0 ? (
                <div className="text-center py-6 text-slate-500">
                  No diagnoses recorded for this visit
                </div>
              ) : (
                <div className="space-y-4">
                  {diagnoses.map((diagnosis) => (
                    <div key={diagnosis.diagnosis_id} className="border border-gray-200 rounded-lg p-4 hover:bg-slate-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-md font-semibold text-slate-900">
                            {diagnosis.disease_name}
                          </h4>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm font-medium text-slate-700">Diagnosis Date</p>
                              <p className="text-sm text-slate-900">{formatDate(diagnosis.diagnosis_date)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700">Confidence Score</p>
                              <p className="text-sm font-semibold text-slate-900">
                                {formatConfidenceScore(diagnosis.confidence_score)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700">Status</p>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDiagnosisStatusColor(diagnosis.status)}`}>
                                {diagnosis.status.charAt(0).toUpperCase() + diagnosis.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          {diagnosis.ml_model_used && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-slate-700">AI Model Used</p>
                              <p className="text-sm text-slate-900">{diagnosis.ml_model_used}</p>
                            </div>
                          )}
                          {diagnosis.notes && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-slate-700">Notes</p>
                              <p className="text-sm text-slate-900">{diagnosis.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          
        </div>
      </div>
    </Layout>
  );
};