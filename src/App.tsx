import "./index.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { ModernLogin } from "./pages/ModernLogin";
import { ModernSignup } from "./pages/ModernSignup";
import { Unauthorized } from "./pages/Unauthorized";

// Patient Pages
import { PatientDashboard } from "./pages/patient/PatientDashboard";
import { PatientLabReports } from "./pages/patient/PatientLabReports";
import { PatientVisits } from "./pages/patient/PatientVisits";
import { PatientFamilyHistory } from "./pages/patient/PatientFamilyHistory";
import { PatientTimeline } from "./pages/patient/PatientTimeline";
import { PatientReportDetails } from "./pages/patient/PatientReportDetails";
import { PatientVisitDetails } from "./pages/patient/PatientVisitsDetails";

// Doctor Pages
import { DoctorDashboard } from "./pages/doctor/DoctorDashboard";
import { DoctorCreateVisit } from "./pages/doctor/DoctorCreateVisit";
import { DoctorPatientView } from "./pages/doctor/DoctorPatientView";

// Lab Pages
import { LabDashboard } from "./pages/lab/LabDashboard";
import { LabCreateReport } from "./pages/lab/LabCreateReport";
import { LabReports } from "./pages/lab/LabReports";
import { LabAbnormalResults } from "./pages/lab/LabAbnormalResults";
import { LabUploadReport } from "./pages/lab/LabUploadReport";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminPatientManagement } from "./pages/admin/AdminPatientManagement";
import { AdminDoctorManagement } from "./pages/admin/AdminDoctorManagement";
import { AdminLabManagement } from "./pages/admin/AdminLabManagement";

// Profile Page
import { Profile } from "./pages/profile/Profile";

import { useEffect, useState } from 'react';


function App() {
  const [, setBasePath] = useState('');

  useEffect(() => {
    // Handle GitHub Pages base path
    const path = window.location.pathname;
    const repoMatch = path.match(/^\/([^\/]+)\//);
    if (repoMatch && repoMatch[1] && !repoMatch[1].includes('.')) {
      setBasePath(`/${repoMatch[1]}`);
    }
  }, []);
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<ModernLogin />} />
          <Route path="/signup" element={<ModernSignup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Patient Routes */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/lab-reports"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientLabReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/lab-reports/:report_id"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientReportDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/visits"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientVisits />
              </ProtectedRoute>
            }
          />
           <Route
            path="/patient/visits/:visit_id"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientVisitDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/timeline"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientTimeline />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/family-history"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientFamilyHistory />
              </ProtectedRoute>
            }
          />
      
          {/* Doctor Routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patients"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patient-view"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorPatientView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/visits"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/create-visit"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorCreateVisit />
              </ProtectedRoute>
            }
          />

          {/* Lab Routes */}
          <Route
            path="/lab/dashboard"
            element={
              <ProtectedRoute allowedRoles={["lab_staff"]}>
                <LabDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab/create-report"
            element={
              <ProtectedRoute allowedRoles={["lab_staff"]}>
                <LabCreateReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab/upload-report"
            element={
              <ProtectedRoute allowedRoles={["lab_staff"]}>
                <LabUploadReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab/reports"
            element={
              <ProtectedRoute allowedRoles={["lab_staff"]}>
                <LabReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab/abnormal"
            element={
              <ProtectedRoute allowedRoles={["lab_staff"]}>
                <LabAbnormalResults />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPatientManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDoctorManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/labs"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLabManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                allowedRoles={["patient", "doctor", "lab_staff", "admin"]}
              >
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
