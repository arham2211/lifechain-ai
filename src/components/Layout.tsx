import React, { useState } from "react";
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

export const Layout: React.FC<LayoutProps> = ({
  children,
  navItems,
  title,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen bg-teal-950 text-white overflow-hidden">
      {/* <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[30rem] h-[30rem] bg-teal-500/20 blur-[120px] -top-32 -left-10 animate-pulse" />
        <div className="absolute w-[25rem] h-[25rem] bg-aqua-500/20 blur-[120px] bottom-0 right-0 animate-pulse delay-700" />
        <div className="absolute w-72 h-72 bg-white/5 blur-[100px] top-1/3 left-1/2 -translate-x-1/2" />
      </div> */}

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          } w-72`}
        >
          <div className="h-full backdrop-blur-2xl bg-white/10 border-r border-white/10 shadow-glow">
            <div className="p-6 border-b border-white/10">
              <p className="text-sm text-white/70">Welcome back</p>
              <h1 className="text-2xl font-bold text-white mt-1">{title}</h1>
              <p className="text-xs text-white/50 mt-2">{user?.email}</p>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                      isActive
                        ? "bg-white/20 border border-white/30 shadow-glow"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="text-white">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors text-white/80"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-72" : "ml-0"
          }`}
        >
          {/* Header */}
          <header className="flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-white/5 border-b border-white/10">
            <div className="flex items-center justify-between px-6 py-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-white/70 hover:text-white transition-colors lg:hidden"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <span className="uppercase tracking-wide text-xs">Role</span>
                <span className="px-3 py-1 rounded-full border border-white/20 bg-white/5 text-white font-semibold capitalize">
                  {user?.role?.replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="px-6 py-3 flex items-center gap-4">
              {/* User Avatar */}
            <Link to="/profile" >
              <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <User size={26} className="text-white/80" />
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-lg font-semibold text-white capitalize">
                  {user?.name || "User"}
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
