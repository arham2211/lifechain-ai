import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { DataTable, type Column } from "./PatientDataTable";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { useAuth } from "../../contexts/AuthContext";
import type { LabReport } from "../../types";
import { Activity, FileText, Calendar, TrendingUp, Users } from "lucide-react";
import { formatDate, getStatusColor } from "../../utils/formatters";
import { usePagination, useError, useLoading } from "../../utils/hooks";
import { useNavigate } from "react-router-dom";

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

export const PatientLabReports: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<LabReport[]>([]);
  const [, setSelectedReport] = useState<LabReport | null>(null);
  const { isLoading } = useLoading();
  const { error, setError, clearError } = useError();
  const pagination = usePagination();
  const navigate = useNavigate();

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

  // Function to fetch reports data
  const fetchReportsData = async () => {
    try {
      clearError();

      const response = await fetch(
        `http://localhost:8001/api/v1/labs/reports?skip=0&limit=100&patient_id=73b9d154-669f-4628-ad05-dae65207d12e&lang=en`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch lab reports");
      }

      const reportsData = await response.json();

      // Enhance reports with lab names
      const enhancedReports = await Promise.all(
        reportsData.map(async (report: Omit<LabReport, "lab">) => {
          const labName = await fetchLabName(report.lab_id);
          return {
            ...report,
            lab: { name: labName },
            report_date: report.report_date,
            report_type: report.report_type,
            status: report.status,
          };
        })
      );

      setReports(enhancedReports);
      pagination.setTotal(enhancedReports.length);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to load lab reports");
      } else {
        setError("Failed to load lab reports");
      }
    }
  };

  useEffect(() => {
    if (user?.entity_id) {
      fetchReportsData();
    }
  }, [user, pagination.skip, pagination.limit]);

  const handleViewReport = async (report: LabReport) => {
    try {
      setSelectedReport(report);
      console.log("Selected Report:", report.report_id);
      navigate(`/patient/lab-reports/${report.report_id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load test results");
    }
  };

  const columns: Column<LabReport>[] = [
    {
      key: "report_date",
      label: "Date",
      render: (report) => formatDate(report.report_date),
    },
    {
      key: "report_type",
      label: "Type",
      render: (report) => (
        <span className="capitalize">{report.report_type}</span>
      ),
    },
    {
      key: "lab",
      label: "Lab",
      render: (report) => report.lab?.name || "N/A",
    },
    {
      key: "status",
      label: "Status",
      render: (report) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            report.status
          )}`}
        >
          {report.status}
        </span>
      ),
    },
  ];

  // Calculate paginated data
  const paginatedReports = reports.slice(
    pagination.skip,
    pagination.skip + pagination.limit
  );

  return (
    <Layout navItems={patientNavItems} title="Patient Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Lab Reports</h2>
          <p className="text-slate-600 mt-1">
            View your laboratory test results
          </p>
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        <DataTable
          data={paginatedReports}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No lab reports found"
          onRowClick={handleViewReport}
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            onNextPage: pagination.nextPage,
            onPrevPage: pagination.prevPage,
          }}
        />
      </div>
    </Layout>
  );
};
