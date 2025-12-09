import React, { useState, useEffect } from "react";
import { Layout } from "../../components/Layout";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { useNavigate, useParams } from "react-router-dom";
import {
  Activity,
  FileText,
  AlertCircle,
  List,
  Upload,
  Plus,
  Trash2,
  Save,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { useLoading, useError } from "../../utils/hooks";
import { formatDate } from "../../utils/formatters";

const labNavItems = [
  { path: "/lab/dashboard", label: "Dashboard", icon: <Activity size={20} /> },
  {
    path: "/lab/create-report",
    label: "Create Lab Report",
    icon: <FileText size={20} />,
  },
  {
    path: "/lab/upload-report",
    label: "Upload Report",
    icon: <Upload size={20} />,
  },
  { path: "/lab/reports", label: "All Reports", icon: <List size={20} /> },
  {
    path: "/lab/abnormal",
    label: "Abnormal Results",
    icon: <AlertCircle size={20} />,
  },
];

const glassCard =
  "glass-card rounded-3xl shadow-lg border border-slate-100 bg-white/80 backdrop-blur-md";

const API_BASE_URL = "http://0.0.0.0:8001/api/v1";

interface SupportedTest {
  test_name: string;
  unit: string;
  description: string;
  reference_range_min: number;
  reference_range_max: number;
  gender_specific: boolean;
  male_range?: { min: number; max: number };
  female_range?: { min: number; max: number };
}

interface TestResultForm {
  test_name: string;
  test_value: string;
  unit: string;
  reference_range_min: string;
  reference_range_max: string;
  is_abnormal: boolean;
}

interface ReportDetails {
  report_id: string;
  patient_id: string;
  visit_id?: string;
  report_date: string;
  report_type: string;
  test_name: string;
  status: string;
  pdf_url?: string;
  patient?: {
    name: string;
    cnic: string;
    gender: string;
  };
}

export const LabUpdateReport: React.FC = () => {
  const navigate = useNavigate();
  const { report_id } = useParams<{ report_id: string }>();
  
  const [reportDetails, setReportDetails] = useState<ReportDetails | null>(null);
  const [testResults, setTestResults] = useState<TestResultForm[]>([]);
  const [supportedTests, setSupportedTests] = useState<SupportedTest[]>([]);
  const [showTestDropdown, setShowTestDropdown] = useState<number | null>(null);

  const { isLoading, withLoading } = useLoading();
  const { error, setError, clearError } = useError();

  // Fetch report details and supported tests on mount
  useEffect(() => {
    if (report_id) {
      fetchReportDetails();
      fetchSupportedTests();
    }
  }, [report_id]);

  const fetchReportDetails = async () => {
    try {
      await withLoading(async () => {
        const response = await fetch(
          `${API_BASE_URL}/labs/reports/${report_id}?lang=en`
        );
        if (!response.ok) throw new Error("Failed to fetch report details");
        const data = await response.json();
        
        // Fetch patient data
        const patientResponse = await fetch(
          `${API_BASE_URL}/patients/${data.patient_id}`
        );
        let patientData = null;
        if (patientResponse.ok) {
          patientData = await patientResponse.json();
        }
        
        setReportDetails({
          ...data,
          patient: patientData ? {
            name: `${patientData.first_name} ${patientData.last_name}`,
            cnic: patientData.cnic,
            gender: patientData.gender,
          } : undefined,
        });
      });
    } catch (err: any) {
      setError(err.message || "Failed to load report details");
    }
  };

  const fetchSupportedTests = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/labs/tests/supported?lang=en`
      );
      if (!response.ok) throw new Error("Failed to fetch supported tests");
      const data = await response.json();
      setSupportedTests(data.supported_tests || []);
    } catch (err) {
      console.error("Error fetching supported tests:", err);
    }
  };

  const handleAddTestResultRow = () => {
    setTestResults([
      ...testResults,
      {
        test_name: "",
        test_value: "",
        unit: "",
        reference_range_min: "",
        reference_range_max: "",
        is_abnormal: false,
      },
    ]);
  };

  const handleRemoveTestResultRow = (index: number) => {
    const newTests = [...testResults];
    newTests.splice(index, 1);
    setTestResults(newTests);
  };

  const updateTestResult = (
    index: number,
    field: keyof TestResultForm,
    value: any
  ) => {
    const newTests = [...testResults];
    newTests[index] = { ...newTests[index], [field]: value };
    
    // If test_name is being updated and matches a supported test, auto-fill other fields
    if (field === "test_name") {
      const matchedTest = supportedTests.find(
        (test) => test.test_name === value
      );
      if (matchedTest) {
        // Get appropriate reference range based on patient gender
        let minRange = matchedTest.reference_range_min;
        let maxRange = matchedTest.reference_range_max;
        
        if (matchedTest.gender_specific && reportDetails?.patient) {
          if (reportDetails.patient.gender === "male" && matchedTest.male_range) {
            minRange = matchedTest.male_range.min;
            maxRange = matchedTest.male_range.max;
          } else if (reportDetails.patient.gender === "female" && matchedTest.female_range) {
            minRange = matchedTest.female_range.min;
            maxRange = matchedTest.female_range.max;
          }
        }
        
        newTests[index] = {
          ...newTests[index],
          unit: matchedTest.unit,
          reference_range_min: minRange.toString(),
          reference_range_max: maxRange.toString(),
        };
      }
    }
    
    setTestResults(newTests);
  };

  const handleTestSearchChange = (value: string, index: number) => {
    updateTestResult(index, "test_name", value);
  };

  const handleSelectTest = (testName: string, index: number) => {
    updateTestResult(index, "test_name", testName);
    setShowTestDropdown(null);
  };

  const handleSaveTests = async () => {
    if (!report_id || !reportDetails) return;

    try {
      clearError();
      await withLoading(async () => {
        const validTests = testResults.filter(
          (t) => t.test_name && t.test_value
        );

        // Save all test results
        for (const test of validTests) {
          const payload = {
            test_name: test.test_name,
            test_value: parseFloat(test.test_value) || 0,
            unit: test.unit,
            reference_range_min: parseFloat(test.reference_range_min) || 0,
            reference_range_max: parseFloat(test.reference_range_max) || 0,
            is_abnormal: test.is_abnormal,
          };

          const response = await fetch(
            `${API_BASE_URL}/labs/reports/${report_id}/test-results`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(
              errData.detail || `Failed to save test: ${test.test_name}`
            );
          }
        }
        
        // Update report status to completed
        const updatePayload = {
          visit_id: reportDetails.visit_id || "e79f5412-c555-418b-b3f1-7f26f89d3505",
          report_date: reportDetails.report_date,
          report_type: reportDetails.report_type,
          status: "completed",
          pdf_url: reportDetails.pdf_url || "https://lab-reports.com/report.pdf",
        };

        const updateResponse = await fetch(
          `${API_BASE_URL}/labs/reports/${report_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatePayload),
          }
        );

        if (!updateResponse.ok) {
          const errData = await updateResponse.json().catch(() => ({}));
          throw new Error(
            errData.detail || "Failed to update report status"
          );
        }
        
        // Navigate back to reports list after successful save
        navigate("/lab/reports");
      });
    } catch (err: any) {
      setError(err.message || "Failed to save test results");
    }
  };

  // Filter tests based on search query
  const getFilteredTests = (query: string) => {
    if (!query.trim()) return supportedTests.slice(0, 5);
    
    return supportedTests.filter(test =>
      test.test_name.toLowerCase().includes(query.toLowerCase()) ||
      test.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
  };

  if (!report_id) {
    return (
      <Layout navItems={labNavItems} title="Lab Portal">
        <div className="text-center py-12">
          <p className="text-slate-600">Invalid report ID</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout navItems={labNavItems} title="Lab Portal">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className={`${glassCard} p-6 lg:p-8`}>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/lab/reports")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div className="flex-1">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold mb-2">
                Update Report
              </p>
              <h2 className="text-3xl font-bold text-slate-900">
                Add Test Results
              </h2>
            </div>
          </div>

          {reportDetails && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-indigo-600 font-medium">Patient</p>
                  <p className="text-lg font-bold text-indigo-900">
                    {reportDetails.patient?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-indigo-700">
                    CNIC: {reportDetails.patient?.cnic || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-indigo-600 font-medium">Report Details</p>
                  <p className="text-sm text-indigo-900">
                    <span className="font-semibold">Type:</span> {reportDetails.report_type}
                  </p>
                  <p className="text-sm text-indigo-900">
                    <span className="font-semibold">Date:</span> {formatDate(reportDetails.report_date)}
                  </p>
                  <p className="text-sm text-indigo-900">
                    <span className="font-semibold">Test Name:</span> {reportDetails.test_name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        <div className={`${glassCard} p-6 lg:p-8`}>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Test Results
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Add detailed test results for this report
                </p>
                <p className="text-xs text-indigo-600 mt-1">
                  Select from {supportedTests.length} supported tests
                </p>
              </div>
              <button
                onClick={handleAddTestResultRow}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-100 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus size={18} /> Add Row
              </button>
            </div>

            <div className="space-y-4">
              {testResults.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                  <p className="text-slate-500">
                    No test results added yet. Click "Add Row" to start.
                  </p>
                </div>
              ) : (
                testResults.map((test, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <div className="space-y-4">
                      {/* Test Parameter - Full width */}
                      <div className="relative">
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Test Parameter
                        </label>
                        <div className="relative">
                          <input
                            placeholder="Search test parameter..."
                            value={test.test_name}
                            onChange={(e) => handleTestSearchChange(e.target.value, index)}
                            onFocus={() => setShowTestDropdown(index)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 bg-white pr-10"
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400">
                            <ChevronDown size={16} />
                          </div>
                        </div>
                        
                        {/* Test Dropdown */}
                        {showTestDropdown === index && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {getFilteredTests(test.test_name).map((supportedTest) => (
                              <div
                                key={supportedTest.test_name}
                                onClick={() => handleSelectTest(supportedTest.test_name, index)}
                                className="px-3 py-2 hover:bg-indigo-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                              >
                                <div className="font-medium text-slate-900">
                                  {supportedTest.test_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </div>
                                <div className="text-xs text-slate-500 truncate">
                                  {supportedTest.description}
                                </div>
                                <div className="text-xs text-indigo-600 mt-1">
                                  Ref: {supportedTest.reference_range_min}-{supportedTest.reference_range_max} {supportedTest.unit}
                                </div>
                              </div>
                            ))}
                            {getFilteredTests(test.test_name).length === 0 && (
                              <div className="px-3 py-4 text-center text-slate-500">
                                No tests found
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Value and Unit - Side by side */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Value
                          </label>
                          <input
                            placeholder="Value"
                            type="number"
                            value={test.test_value}
                            onChange={(e) =>
                              updateTestResult(index, "test_value", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Unit
                          </label>
                          <input
                            placeholder="Unit"
                            value={test.unit}
                            onChange={(e) =>
                              updateTestResult(index, "unit", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 bg-white"
                            readOnly={!!test.unit}
                            style={{ backgroundColor: test.unit ? '#f8fafc' : 'white' }}
                          />
                        </div>
                      </div>

                      {/* Reference Range */}
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Reference Range
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            placeholder="Min"
                            type="number"
                            value={test.reference_range_min}
                            onChange={(e) =>
                              updateTestResult(index, "reference_range_min", e.target.value)
                            }
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 bg-white"
                            readOnly={!!test.reference_range_min}
                            style={{ backgroundColor: test.reference_range_min ? '#f8fafc' : 'white' }}
                          />
                          <span className="text-slate-400">-</span>
                          <input
                            placeholder="Max"
                            type="number"
                            value={test.reference_range_max}
                            onChange={(e) =>
                              updateTestResult(index, "reference_range_max", e.target.value)
                            }
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 bg-white"
                            readOnly={!!test.reference_range_max}
                            style={{ backgroundColor: test.reference_range_max ? '#f8fafc' : 'white' }}
                          />
                        </div>
                      </div>

                      {/* Abnormal checkbox and Delete button */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={test.is_abnormal}
                            onChange={(e) =>
                              updateTestResult(index, "is_abnormal", e.target.checked)
                            }
                            className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                          />
                          <span
                            className={`text-sm font-medium ${
                              test.is_abnormal ? "text-red-600" : "text-slate-600"
                            }`}
                          >
                            Abnormal Result
                          </span>
                        </label>
                        
                        <button
                          onClick={() => handleRemoveTestResultRow(index)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove test"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-100">
              <button
                onClick={() => navigate("/lab/reports")}
                className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 flex items-center gap-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTests}
                disabled={testResults.length === 0 || isLoading}
                className="ml-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save size={18} /> Save Test Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
