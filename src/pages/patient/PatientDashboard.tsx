import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { StatCard } from "../../components/common/StatCard";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import { patientService } from "../../services/patientService";
import { visitService } from "../../services/visitService";
import { labService } from "../../services/labService";
import { Activity, FileText, Calendar, TrendingUp, Users } from "lucide-react";
import type { Recommendation } from "../../types";

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

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalReports: 0,
    pendingReports: 0,
    recentRecommendations: [] as Recommendation[],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const patientId = user?.entity_id || "";

        const visitsResponse = await visitService.getVisits({
          patient_id: patientId,
        });
        const reportsResponse = await labService.getLabReports({
          patient_id: patientId,
        });
        const pendingReports = reportsResponse.items.filter(
          (r) => r.status === "pending"
        );

        let recommendations: Recommendation[] = [];
        try {
          recommendations = await patientService.getRecommendations(patientId);
        } catch (err) {
          // optional
        }

        setStats({
          totalVisits: visitsResponse.total,
          totalReports: reportsResponse.total,
          pendingReports: pendingReports.length,
          recentRecommendations: recommendations.slice(0, 3),
        });
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.entity_id) {
      fetchDashboardData();
    }
  }, [user]);

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
                {user?.name || "Patient"}
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
              <p className="text-lg font-semibold text-slate-900 mt-1">
                {user?.entity_id}
              </p>
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

        {stats.recentRecommendations.length > 0 && (
          <section className={`${glassCard} p-6`}>
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              AI Health Recommendations
            </h3>
            <div className="space-y-5">
              {stats.recentRecommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">
                        Condition
                      </p>
                      <h4 className="text-lg font-semibold text-slate-900">
                        {rec.disease_name}
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs bg-primary-50 text-primary-700 border border-primary-200 font-semibold">
                      Confidence {Math.round((rec.confidence_score ?? 0) * 100)}
                      %
                    </span>
                  </div>
                  <div className="space-y-3">
                    {rec.recommendations.slice(0, 3).map((r, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            r.priority === "high"
                              ? "bg-rose-100 text-rose-700"
                              : r.priority === "medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {r.priority}
                        </span>
                        <p className="text-sm text-slate-700">
                          {r.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${glassCard} p-6`}>
            <h3 className="text-xl font-semibold mb-4 text-slate-900">
              Health Snapshot
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Upcoming Appointments",
                  value: Math.max(1, Math.round(stats.totalVisits / 4)),
                },
                { label: "Active Prescriptions", value: 3 },
                { label: "Alerts", value: stats.pendingReports },
                { label: "Care Team", value: 4 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <p className="text-xs text-slate-500 uppercase tracking-[0.3em] font-semibold">
                    {item.label}
                  </p>
                  <p className="text-3xl font-semibold mt-2 text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={`${glassCard} p-6`}>
            <h3 className="text-xl font-semibold mb-4 text-slate-900">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Lab Reports",
                  description: "Check your latest diagnostics",
                  icon: <FileText size={24} />,
                  href: "/patient/lab-reports",
                },
                {
                  title: "Health Predictions",
                  description: "AI risk forecasting",
                  icon: <TrendingUp size={24} />,
                  href: "/patient/predictions",
                },
              ].map((action) => (
                <a
                  key={action.title}
                  href={action.href}
                  className="group p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-lg transition-all flex items-start gap-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                    {action.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {action.title}
                    </p>
                    <p className="text-sm text-slate-600">
                      {action.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};
