import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { DataTable, type Column } from "./PatientDataTable";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { useAuth } from "../../contexts/AuthContext";
import {
  Activity,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  Heart,
} from "lucide-react";
import { formatDate } from "../../utils/formatters";
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

interface Visit {
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

interface Doctor {
  first_name: string;
  last_name: string;
}

interface VisitWithDoctor extends Visit {
  doctor_name?: string;
}

export const PatientVisits: React.FC = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState<VisitWithDoctor[]>([]);
  const { isLoading, } = useLoading();
  const { error, setError, clearError } = useError();
  const pagination = usePagination();
  const navigate = useNavigate();

  // Function to fetch doctor name by doctor_patient_id
  const fetchDoctorName = async (doctorPatientId: string) => {
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

      const doctorData: Doctor = await response.json();
      return `${doctorData.first_name} ${doctorData.last_name}`;
    } catch (err) {
      console.error("Error fetching doctor name:", err);
      return "Unknown Doctor";
    }
  };

  // Function to format visit type for display
  const formatVisitType = (visitType: string) => {
    return visitType
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Function to fetch visits data
  const fetchVisitsData = async () => {
    try {
      // startLoading();
      clearError();
      
      const response = await fetch(
        `http://localhost:8001/api/v1/visits/?skip=0&limit=100&patient_id=73b9d154-669f-4628-ad05-dae65207d12e&lang=en`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch visit history");
      }
      
      const visitsData: Visit[] = await response.json();
     
      // Enhance visits with doctor names
      const enhancedVisits = await Promise.all(
        visitsData.map(async (visit: Visit) => {
          const doctorName = await fetchDoctorName(visit.doctor_patient_id);
          return {
            ...visit,
            doctor_name: doctorName,
          };
        })
      );

      setVisits(enhancedVisits);
      pagination.setTotal(enhancedVisits.length);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to load visit history");
      } else {
        setError("Failed to load visit history");
      }
    } finally {
      // stopLoading();
    }
  };

  useEffect(() => {
    if (user?.entity_id) {
      fetchVisitsData();
    }
  }, [user, pagination.skip, pagination.limit]);

  const handleViewVisit = (visit: VisitWithDoctor) => {
    console.log("Viewing visit:", visit.visit_id);
    // Navigate to visit details if needed
    navigate(`/patient/visits/${visit.visit_id}`);
  };

  const columns: Column<VisitWithDoctor>[] = [
    {
      key: "visit_date",
      label: "Date",
      render: (visit) => formatDate(visit.visit_date),
    },
    {
      key: "doctor_name",
      label: "Doctor",
      render: (visit) => (
        <span className="capitalize">
          {visit.doctor_name || "Loading..."}
        </span>
      ),
    },
    {
      key: "visit_type",
      label: "Type",
      render: (visit) => (
        <span className="capitalize">{formatVisitType(visit.visit_type)}</span>
      ),
    },
    {
      key: "chief_complaint",
      label: "Chief Complaint",
      render: (visit) => (
        <span>
          {visit.chief_complaint || "Routine checkup"}
        </span>
      ),
    },
  ];

  // Calculate paginated data
  const paginatedVisits = visits.slice(pagination.skip, pagination.skip + pagination.limit);

  return (
    <Layout navItems={patientNavItems} title="Patient Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visit History</h2>
          <p className="text-gray-600 mt-1">
            Your medical visit records
          </p>
        </div>

        {error && <ErrorMessage message={error} onClose={clearError} />}

        <DataTable
          data={paginatedVisits}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No visit records found"
          onRowClick={handleViewVisit}
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