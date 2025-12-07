import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { useAuth } from "../../contexts/AuthContext";
import type { LabReport, TestResult } from "../../types";
import {
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Download,
  Printer,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Activity,
  TrendingUp,
  Users, Heart,
} from "lucide-react";
import { formatDate, getStatusColor } from "../../utils/formatters";
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

export const PatientReportDetails: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState<LabReport | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [loadingTestResults, setLoadingTestResults] = useState<boolean>(false);
  const { isLoading, setIsLoading } = useLoading();
  const { error, setError, clearError } = useError();

  // Alternative method to extract report ID from hash URL
  const extractReportIdFromUrl = (): string | null => {
    
    // Fallback: Extract from hash URL
    const hash = location.pathname;
    if (hash.includes('/lab-reports/')) {
      const parts = hash.split('/');
      const reportIndex = parts.indexOf('lab-reports') + 1;
      if (reportIndex < parts.length) {
        const id = parts[reportIndex];
        // Remove any query parameters or fragments
        return id.split('?')[0].split('#')[0];
      }
    }
    
    return null;
  };

  const reportId = extractReportIdFromUrl();
  console.log('Extracted Report ID:', reportId);


  // Function to fetch lab name by lab_id
  const fetchLabName = async (labId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8001/api/v1/labs/${labId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch lab name");
      }

      const labData = await response.json();
      return labData.lab_name || "Unknown Lab";
    } catch (err) {
      console.error("Error fetching lab name:", err);
      return "Unknown Lab";
    }
  };

  // Function to fetch test results for the specific report
  const fetchTestResults = async () => {
    if (!reportId) return;
    
    try {
      setLoadingTestResults(true);
      clearError();
      
      const response = await fetch(
        `http://localhost:8001/api/v1/labs/reports/${reportId}/test-results?lang=en`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch test results");
      }
      
      const resultsData = await response.json();
      setTestResults(resultsData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to load test results");
      } else {
        setError("Failed to load test results");
      }
    } finally {
      setLoadingTestResults(false);
    }
  };

  // Function to fetch specific report data
  const fetchReportData = async () => {
    if (!reportId) return;
    
    try {
      setIsLoading(true);
      clearError();
      
      const response = await fetch(
        `http://localhost:8001/api/v1/labs/reports/${reportId}?lang=en`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch lab report");
      }
      
      const reportData = await response.json();
      
      // Enhance report with lab name
      const labName = await fetchLabName(reportData.lab_id);
      const enhancedReport = {
        ...reportData,
        lab: { name: labName },
        report_date: reportData.report_date,
        report_type: reportData.report_type,
        status: reportData.status,
      };

      setReport(enhancedReport);
      
      // Automatically fetch test results for this report
      await fetchTestResults();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to load lab report");
      } else {
        setError("Failed to load lab report");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleResultsExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const downloadReport = () => {
    if (!report) return;
    console.log("Downloading report:", report.report_id);
    // Implement download functionality
  };

  const printReport = () => {
    window.print();
  };

  const goBack = () => {
    navigate("/patient/lab-reports");
  };

  useEffect(() => {
    if (reportId) {
      fetchReportData();
    }
  }, [reportId]);

  if (!reportId) {
    return (
      <Layout navItems={patientNavItems} title="Patient Portal">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message="Report ID is missing" onClose={() => navigate("/patient/lab-reports")} />
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

  if (!report) {
    return (
      <Layout navItems={patientNavItems} title="Patient Portal">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Report not found
            </h3>
            <p className="mt-1 text-gray-500">
              The requested lab report could not be found.
            </p>
            <button
              onClick={goBack}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const abnormalCount = testResults.filter(r => r.is_abnormal).length;

  return (
    <Layout navItems={patientNavItems} title="Patient Portal">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={goBack}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Reports
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Lab Report Details</h1>
          <p className="text-gray-600 mt-2">
            Detailed view of your laboratory test report
          </p>
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          {/* Report Header */}
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {report.report_type || "Laboratory Report"}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      <span className="inline-flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(report.report_date)}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>{report.lab?.name || "Unknown Lab"}</span>
                      <span className="text-gray-400">•</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status || "Unknown"}
                      </span>
                      {abnormalCount > 0 && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="inline-flex items-center text-red-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {abnormalCount} abnormal result{abnormalCount > 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Report ID:</p>
                    <p className="text-gray-600">{report.report_id}</p>
                  </div>
                  <div>
                    <p className="font-medium">Lab ID:</p>
                    <p className="text-gray-600">{report.lab_id}</p>
                  </div>
                  {report.patient_id && (
                    <div>
                      <p className="font-medium">Patient ID:</p>
                      <p className="text-gray-600">{report.patient_id}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={downloadReport}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Download Report"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={printReport}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Print Report"
                >
                  <Printer className="h-5 w-5" />
                </button>
                <button
                  onClick={toggleResultsExpansion}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title={isExpanded ? "Collapse Results" : "View Results"}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Test Results Section */}
          {isExpanded && (
            <div className="border-t border-gray-200 bg-gray-50">
              <div className="p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  Test Results
                </h4>
                
                {loadingTestResults ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : testResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No test results available for this report
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Test Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Result
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Reference Range
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Unit
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {testResults.map((result) => (
                          <tr 
                            key={result.result_id}
                            className={result.is_abnormal ? "bg-red-50" : "hover:bg-gray-50"}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {result.test_name?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {result.result_id}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm font-semibold ${result.is_abnormal ? 'text-red-700' : 'text-gray-900'}`}>
                                {result.test_value}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {result.reference_range_min} - {result.reference_range_max}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {result.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                result.is_abnormal 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {result.is_abnormal ? (
                                  <>
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Abnormal
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Normal
                                  </>
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {testResults.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Total Tests:</span> {testResults.length}
                        {abnormalCount > 0 && (
                          <span className="ml-4 text-red-600">
                            <span className="font-medium">Abnormal:</span> {abnormalCount}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Generated: {formatDate(testResults[0]?.created_at)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};