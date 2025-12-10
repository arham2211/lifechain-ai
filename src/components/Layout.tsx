import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, X, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface LayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
}

interface PatientData {
  patient_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  navItems,
  title,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Only fetch if user is patient and has entity_id
        if (user?.role === 'patient' && user.entity_id) {
          const patientId = user.entity_id;

          // Fetch patient data
          const patientResponse = await fetch(`http://0.0.0.0:8001/api/v1/patients/${patientId}`);
          if (patientResponse.ok) {
            const fetchedPatientData = await patientResponse.json();
            setPatientData(fetchedPatientData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch patient data:", error);
      }
    };

    fetchPatientData();
  }, [user]);
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-primary-200/40 to-secondary-200/40 rounded-full blur-[100px] opacity-70 -top-32 -left-10 animate-blob" />
        <div className="absolute w-[400px] h-[400px] bg-gradient-to-l from-purple-200/30 to-blue-200/30 rounded-full blur-[100px] opacity-50 bottom-0 right-0 animate-blob animation-delay-2000" />
        <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-emerald-200/30 to-teal-200/30 rounded-full blur-[100px] opacity-40 top-1/3 left-1/2 -translate-x-1/2 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ${isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
            } w-72`}
        >
          <div className="h-full glass-card border-r border-slate-200 shadow-xl">
            <div className="p-6 border-b border-slate-200">
              <p className="text-sm text-slate-500 font-medium">Welcome back</p>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">{title}</h1>
              <p className="text-xs text-slate-400 mt-2">{user?.email}</p>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isActive
                        ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                  >
                    <span className={isActive ? "text-white" : "text-slate-500"}>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "lg:ml-72" : "ml-0"
            }`}
        >
          {/* Header */}
          <header className="flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-slate-200 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-slate-600 hover:text-slate-900 transition-colors lg:hidden"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span className="uppercase tracking-wide text-xs font-semibold">Role</span>
                <span className="px-3 py-1 rounded-full border border-primary-200 bg-primary-50 text-primary-700 font-semibold capitalize">
                  {user?.role?.replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="px-6 py-3 flex items-center gap-4">
              {/* User Avatar */}
              <Link to="/profile" >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <User size={26} className="text-white" />
                  </div>

                  {/* User Info */}
                  <div>
                    <h1 className="text-lg font-semibold text-slate-900 capitalize">
                      {patientData ? `${patientData.first_name} ${patientData.last_name}` : user?.name || "User"}
                    </h1>
                  </div>
                </div>
              </Link>
            </div>
          </header>

          <main className="p-6 lg:p-10">
            <div className="space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};
