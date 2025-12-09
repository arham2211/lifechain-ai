import React, { useState } from "react";
import { Layout } from "../../components/Layout";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { SearchBar } from "../../components/common/SearchBar";
import { useNavigate } from "react-router-dom";
import type { Patient } from "../../types";
import {
  Activity,
  FileText,
  AlertCircle,
  CheckCircle,
  List,
  Upload,
  Search,
  UserCircle,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import { useLoading, useError } from "../../utils/hooks";
import { DataTable, type Column } from "../../components/common/DataTable";
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

type FormStep = "select-patient" | "report-info" | "add-tests" | "complete";

const glassCard =
  "glass-card rounded-3xl shadow-lg border border-slate-100 bg-white/80 backdrop-blur-md";

// Hardcoded Lab ID as requested
const HARDCODED_LAB_ID = "f7147fcf-e65a-465e-afee-c1fe482cbd10";
const API_BASE_URL = "http://0.0.0.0:8001/api/v1";

interface TestResultForm {
  test_name: string;
  test_value: string; // Keep as string for input, convert to number on submit
  unit: string;
  reference_range_min: string;
  reference_range_max: string;
  is_abnormal: boolean;
}

export const LabCreateReport: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FormStep>("select-patient");

  // Patient Search State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Report State
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reportType, setReportType] = useState("blood_test");
  const [reportTitle, setReportTitle] = useState("");
  const [reportId, setReportId] = useState<string>("");

  // Test Results State
  const [testResults, setTestResults] = useState<TestResultForm[]>([]);

  const { isLoading, withLoading } = useLoading();
  const { error, setError, clearError } = useError();

  const handleSearch = async (query?: string) => {
    const searchValue = query !== undefined ? query : searchQuery;
    if (!searchValue.trim()) {
      setPatients([]);
      setShowSearchResults(false);
      return;
    }

    try {
      clearError();
      await withLoading(async () => {
        const response = await fetch(
          `${API_BASE_URL}/patients/?skip=0&limit=100&search=${encodeURIComponent(
            searchValue
          )}`
        );
        if (!response.ok) throw new Error("Failed to search patients");
        const data = await response.json();

        const mappedResults = data.map((patient: any) => ({
          ...patient,
          name: `${patient.first_name} ${patient.last_name}`,
          // Ensure all required Patient fields are present
          patient_id: patient.patient_id || patient.id || "",
          first_name: patient.first_name || "",
          last_name: patient.last_name || "",
          cnic: patient.cnic || "",
          date_of_birth: patient.date_of_birth || "",
          gender: patient.gender || "other",
          phone: patient.phone || "",
        }));
        setPatients(mappedResults);
        setShowSearchResults(true);
      });
    } catch (err: any) {
      setError(err.message || "Failed to search patients");
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentStep("report-info");
  };

  const handleCreateReport = async () => {
    if (!selectedPatient) return;
    try {
      clearError();
      await withLoading(async () => {
        // Get current date/time for created_at/updated_at
        // const now = new Date();
        // // Format as ISO string without timezone (replace 'Z' with empty string)
        // const naiveDateTime = now.toISOString().replace('Z', '');

        // Construct payload according to USER_REQUEST
        const payload = {
          patient_id: selectedPatient.patient_id,
          lab_id: HARDCODED_LAB_ID,
          visit_id: "e79f5412-c555-418b-b3f1-7f26f89d3505", // Placeholder optional ID as per schema example
          report_date: reportDate,
          report_type: reportType,
          status: "pending",
          pdf_url:
            "https://lab-reports.com/report_e79f5412-c555-418b-b3f1-7f26f89d3505.pdf",
          test_name: reportTitle || "Lab Report", // Mapping title/desc to test_name field in report creation
        };

        const response = await fetch(`${API_BASE_URL}/labs/reports`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || "Failed to create report");
        }

        const data = await response.json();
        setReportId(data.report_id || data.id); // Handle potential ID field name differences
        setCurrentStep("add-tests");
      });
    } catch (err: any) {
      setError(err.message || "Failed to create report");
    }
  };

  const handleAddTestResultRow = () => {
    setTestResults([
      ...testResults,
      {
        test_name: "",
        test_value: "",
        unit: "",
        reference_range_min: "0",
        reference_range_max: "0",
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
    setTestResults(newTests);
  };

  const handleSaveTests = async () => {
    if (!reportId) return;

    try {
      clearError();
      await withLoading(async () => {
        const validTests = testResults.filter(
          (t) => t.test_name && t.test_value
        );

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
            `${API_BASE_URL}/labs/reports/${reportId}/test-results`,
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
      });
      setCurrentStep("complete");
    } catch (err: any) {
      setError(err.message || "Failed to save test results");
    }
  };

  const columns: Column<Patient>[] = [
    {
      key: "name",
      label: "Name",
      render: (patient) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <UserCircle size={20} />
          </div>
          <span className="font-medium text-slate-900">
            {patient.first_name} {patient.last_name}
          </span>
        </div>
      ),
    },
    { key: "cnic", label: "CNIC" },
    {
      key: "date_of_birth",
      label: "Date of Birth",
      render: (patient) => formatDate(patient.date_of_birth),
    },
    {
      key: "gender",
      label: "Gender",
      render: (patient) => (
        <span className="capitalize px-2 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
          {patient.gender}
        </span>
      ),
    },
  ];

  return (
    <Layout navItems={labNavItems} title="Lab Portal">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className={`${glassCard} p-6 lg:p-8`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold mb-2">
                New Report
              </p>
              <h2 className="text-3xl font-bold text-slate-900">
                Create Lab Report
              </h2>
              <p className="text-slate-600 mt-2">
                Generate and manage diagnostic reports for patients.
              </p>
            </div>

            {/* Stepper */}
            <div className="flex items-center bg-slate-50 rounded-xl p-2 border border-slate-200">
              {["Select Patient", "Report Info", "Add Tests", "Complete"].map(
                (label, index) => {
                  const steps: FormStep[] = [
                    "select-patient",
                    "report-info",
                    "add-tests",
                    "complete",
                  ];
                  const stepIndex = steps.indexOf(currentStep);
                  const isCompleted = index < stepIndex;
                  const isCurrent = index === stepIndex;

                  return (
                    <div key={label} className="flex items-center">
                      <div
                        className={`
                           flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                           ${
                             isCurrent
                               ? "bg-white shadow-sm text-slate-900 font-semibold"
                               : ""
                           }
                           ${isCompleted ? "text-green-600" : ""}
                           ${!isCurrent && !isCompleted ? "text-slate-400" : ""}
                        `}
                      >
                        <div
                          className={`
                             w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                             ${isCurrent ? "bg-indigo-600 text-white" : ""}
                             ${isCompleted ? "bg-green-100 text-green-600" : ""}
                             ${
                               !isCurrent && !isCompleted
                                 ? "bg-slate-200 text-slate-500"
                                 : ""
                             }
                           `}
                        >
                          {isCompleted ? <CheckCircle size={14} /> : index + 1}
                        </div>
                        <span className="text-sm hidden sm:block">{label}</span>
                      </div>
                      {index < 3 && (
                        <div className="w-4 h-0.5 bg-slate-200 mx-1"></div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        <div className={`${glassCard} p-6 lg:p-8 min-h-[400px]`}>
          {/* STEP 1: SELECT PATIENT */}
          {currentStep === "select-patient" && (
            <div className="space-y-6">
              <div className="max-w-xl mx-auto text-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Search for a Patient
                </h3>
                <p className="text-slate-500">
                  Enter patient name or CNIC to begin creating a report.
                </p>
              </div>

              <div className="flex gap-4 max-w-2xl mx-auto">
                <div className="flex-1">
                  <SearchBar
                    placeholder="Search by name, CNIC..."
                    onSearch={(val) => setSearchQuery(val)}
                    loading={isLoading}
                  />
                </div>
                <button
                  onClick={() => handleSearch()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Search size={20} /> Search
                </button>
              </div>

              {showSearchResults && (
                <div className="mt-8">
                  <DataTable
                    data={patients}
                    columns={columns}
                    isLoading={isLoading}
                    onRowClick={handleSelectPatient}
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 2: REPORT INFO */}
          {currentStep === "report-info" && selectedPatient && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <UserCircle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-900 text-lg">
                    {selectedPatient.name}
                  </h4>
                  <div className="flex gap-4 text-sm text-indigo-700 mt-1">
                    <span>CNIC: {selectedPatient.cnic}</span>
                    <span>
                      DOB: {formatDate(selectedPatient.date_of_birth)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentStep("select-patient")}
                  className="ml-auto text-sm text-indigo-600 hover:text-indigo-800 underline"
                >
                  Change
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Report Date
                  </label>
                  <input
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Report Type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white"
                  >
                    <option value="blood_test">Blood Test</option>
                    <option value="biochemistry">Biochemistry</option>
                    <option value="hematology">Hematology</option>
                    <option value="radiology">Radiology</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Report Title / Test Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Complete Blood Count (CBC)"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setCurrentStep("select-patient")}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateReport}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                >
                  Create & Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ADD TESTS */}
          {currentStep === "add-tests" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Test Results
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Add detailed results for this report ID:{" "}
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">
                      {reportId}
                    </span>
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
                      className="flex flex-col lg:flex-row gap-4 items-start p-4 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      {/* Grid container for inputs */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 w-full">
                        {/* Test Parameter - Full width on mobile, 3 columns on lg */}
                        <div className="lg:col-span-3">
                          <input
                            placeholder="Test Parameter"
                            value={test.test_name}
                            onChange={(e) =>
                              updateTestResult(
                                index,
                                "test_name",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 bg-white"
                          />
                        </div>

                        {/* Value and Unit - 4 columns on lg */}
                        <div className="lg:col-span-4">
                          <div className="flex gap-2">
                            <input
                              placeholder="Value"
                              type="number"
                              value={test.test_value}
                              onChange={(e) =>
                                updateTestResult(
                                  index,
                                  "test_value",
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 bg-white"
                            />
                            <input
                              placeholder="Unit"
                              value={test.unit}
                              onChange={(e) =>
                                updateTestResult(index, "unit", e.target.value)
                              }
                              className="w-20 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 bg-white"
                            />
                          </div>
                        </div>

                        {/* Reference Range - 3 columns on lg */}
                        <div className="lg:col-span-3">
                          <div className="flex gap-2 items-center">
                            <input
                              placeholder="Min Ref"
                              type="number"
                              value={test.reference_range_min}
                              onChange={(e) =>
                                updateTestResult(
                                  index,
                                  "reference_range_min",
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 bg-white"
                            />
                            <span className="text-slate-400">-</span>
                            <input
                              placeholder="Max Ref"
                              type="number"
                              value={test.reference_range_max}
                              onChange={(e) =>
                                updateTestResult(
                                  index,
                                  "reference_range_max",
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 bg-white"
                            />
                          </div>
                        </div>

                        {/* Abnormal checkbox - 2 columns on lg */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center gap-3 h-full">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={test.is_abnormal}
                                onChange={(e) =>
                                  updateTestResult(
                                    index,
                                    "is_abnormal",
                                    e.target.checked
                                  )
                                }
                                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                              />
                              <span
                                className={`text-sm font-medium ${
                                  test.is_abnormal
                                    ? "text-red-600"
                                    : "text-slate-600"
                                }`}
                              >
                                Abnormal
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => handleRemoveTestResultRow(index)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-center lg:self-start"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button
                  onClick={handleSaveTests}
                  disabled={testResults.length === 0}
                  className="ml-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save size={18} /> Save & Finish
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: COMPLETE */}
          {currentStep === "complete" && (
            <div className="text-center py-12 max-w-lg mx-auto">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Report Created Successfully!
              </h3>
              <p className="text-slate-600 mb-8">
                The lab report has been generated and test results have been
                saved to the patient's record.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/lab/dashboard")}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={() => {
                    // Reset state
                    setCurrentStep("select-patient");
                    setTestResults([]);
                    setReportTitle("");
                    setReportId("");
                    setSelectedPatient(null);
                    setPatients([]);
                    setSearchQuery("");
                  }}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg"
                >
                  Create Another Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
