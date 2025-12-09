import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { StatCard } from "../../components/common/StatCard";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
// import { useAuth } from "../../contexts/AuthContext";
import { Activity, FileText, Calendar, TrendingUp, Users, Clock } from "lucide-react";
import type { Visit, LabReport, Patient } from "../../types";
import { formatDate } from "../../utils/formatters";

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
];

const glassCard = "glass-card rounded-3xl shadow-lg border border-slate-100";

interface ActivityItem {
  type: 'visit' | 'lab_report';
  date: string;
  title: string;
  description: string;
  status?: string;
}

export const PatientDashboard: React.FC = () => {
  // const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalReports: 0,
    pendingReports: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Hardcoded patient ID
        const patientId = "4351c0c0-4336-4598-ad0e-0cdf4ef02490";

        // Fetch patient data
        const patientResponse = await fetch(`http://0.0.0.0:8001/api/v1/patients/${patientId}`);
        const fetchedPatientData = await patientResponse.json();
        setPatientData(fetchedPatientData);

        // Fetch visits
        const visitsResponse = await fetch(
          `http://0.0.0.0:8001/api/v1/visits/?skip=0&limit=100&patient_id=${patientId}&lang=en`
        );
        const visitsData: Visit[] = await visitsResponse.json();

        // Fetch lab reports
        const reportsResponse = await fetch(
          `http://0.0.0.0:8001/api/v1/labs/reports?skip=0&limit=100&patient_id=${patientId}&lang=en`
        );
        const reportsData: LabReport[] = await reportsResponse.json();

        // Calculate stats using array length
        const pendingReports = reportsData.filter(
          (r: LabReport) => r.status === "pending"
        );

        setStats({
          totalVisits: visitsData.length,
          totalReports: reportsData.length,
          pendingReports: pendingReports.length,
        });

        // Combine visits and reports for recent activity
        const activities: ActivityItem[] = [];
        
        // Add recent visits to activity
        visitsData.slice(0, 3).forEach((visit: Visit) => {
          activities.push({
            type: 'visit',
            date: visit.visit_date,
            title: 'Doctor Visit',
            description: visit.visit_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            status: 'completed'
          });
        });

        // Add recent lab reports to activity
        reportsData.slice(0, 3).forEach((report: LabReport) => {
          activities.push({
            type: 'lab_report',
            date: report.report_date,
            title: 'Lab Report',
            description: report.report_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            status: report.status
          });
        });

        // Sort by date (most recent first)
        activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentActivity(activities.slice(0, 5));

      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <Layout navItems={patientNavItems} title="Patient Portal">
        <LoadingSpinner fullScreen />
      </Layout>
    );
  }

  return (
    <Layout navItems={patientNavItems} title="Patient Portal">
      <div className="space-y-8">
        <section className={`${glassCard} p-6 lg:p-10`}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">
                Welcome back
              </p>
              <h2 className="text-4xl font-bold mt-2 text-slate-900">
                {patientData?.first_name} {patientData?.last_name}
              </h2>
              <p className="text-slate-600 mt-3 max-w-2xl">
                Your personalized health hub with AI insights, lab intelligence,
                and actionable care recommendations.
              </p>
            </div>
            <div className="px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">
                Patient ID
              </p>
                {patientData?.patient_id?.slice(0, 8)} ...
            </div>
          </div>
        </section>

        {error && <ErrorMessage message={error} onClose={() => setError("")} />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Visits"
            value={stats.totalVisits}
            icon={Calendar}
            color="primary"
          />
          <StatCard
            title="Lab Reports"
            value={stats.totalReports}
            icon={FileText}
            color="success"
          />
          <StatCard
            title="Pending Reports"
            value={stats.pendingReports}
            icon={Activity}
            color="warning"
          />
        </div>

        <section className="grid">
          {/* Recent Activity */}
          <div className={`${glassCard} p-6`}>
            <h3 className="text-xl font-semibold mb-4 text-slate-900">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-white transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activity.type === 'visit' 
                          ? 'bg-blue-100' 
                          : 'bg-green-100'
                      }`}>
                        {activity.type === 'visit' ? (
                          <Calendar size={20} className="text-blue-600" />
                        ) : (
                          <FileText size={20} className="text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-slate-900">
                            {activity.title}
                          </p>
                          {activity.status && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              activity.status === 'completed' 
                                ? 'bg-green-100 text-green-700'
                                : activity.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {activity.status}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock size={12} />
                          {formatDate(activity.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Activity size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};