import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PatientProfile } from '../patient/PatientProfile';
import { DoctorProfile } from '../doctor/DoctorProfile';
import { Layout } from '../../components/Layout';
import { UserCircle } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'patient') {
    return <PatientProfile />;
  }

  if (user?.role === 'doctor') {
    return <DoctorProfile />;
  }

  // Fallback for other roles (admin, lab_staff) or unauthenticated state
  // ideally we should have profiles for them too, or redirect
  return (
     <Layout navItems={[]} title="Profile">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <UserCircle size={64} className="mb-4 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-700">Profile Not Available</h2>
        <p className="mt-2 text-slate-500">Profile view for role '{user?.role}' is not implemented yet.</p>
      </div>
    </Layout>
  );
};