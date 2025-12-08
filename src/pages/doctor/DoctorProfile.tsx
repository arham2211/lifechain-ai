import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { Activity, Users, FileText, Mail, Phone, MapPin, UserCircle, Edit, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

const doctorNavItems = [
  { path: '/doctor/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/doctor/patients', label: 'Patients', icon: <Users size={20} /> },
  { path: '/doctor/visits', label: 'Visits', icon: <FileText size={20} /> },
];

const glassCard = 'backdrop-blur-xl bg-white/90 border border-slate-200 rounded-3xl shadow-lg';

export const DoctorProfile: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [doctorData, setDoctorData] = useState({
    first_name: '',
    last_name: '',
    cnic: '',
    specialization: '',
    license_number: '',
    phone: '',
    email: '',
    address: '',
    doctor_id: '',
    created_at: '',
    updated_at: '',
  });
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setIsLoading(true);
        setError('');

        const doctorId = user?.entity_id || '';

        // Fetch doctor profile data
        // This would normally be an API call, but we're using mock data
        setDoctorData({
          first_name: "Sarah",
          last_name: "Smith",
          cnic: "42201-1234567-8",
          specialization: "Cardiology",
          license_number: "PMC-12345",
          phone: "+92 300 9876543",
          email: "dr.sarah.smith@hospital.com",
          address: "456 Medical Center, Lahore, Pakistan",
          doctor_id: doctorId || "D001",
          created_at: "2020-01-15T08:00:00.000Z",
          updated_at: "2025-11-17T05:33:48.919Z"
        });

      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.entity_id) {
      fetchDoctorData();
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const ProfileHeader = () => (
    <section className={`${glassCard} p-6 lg:p-8`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
        <div className="w-24 h-24 md:w-28 md:h-28 relative">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg overflow-hidden">
            {doctorData.first_name && doctorData.last_name ? (
              <span className="text-3xl font-bold">
                {doctorData.first_name.charAt(0)}{doctorData.last_name.charAt(0)}
              </span>
            ) : (
              <UserCircle size={64} />
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all">
            <Edit size={14} className="text-slate-600" />
          </button>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Dr. {doctorData.first_name} {doctorData.last_name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                  {doctorData.specialization}
                </span>
                <div className="flex items-center gap-1.5">
                  <Briefcase size={14} className="text-slate-500" />
                  <span className="text-sm font-medium text-slate-600">{doctorData.license_number}</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Doctor ID</p>
              <p className="text-sm font-mono font-semibold text-slate-900 mt-1">{doctorData.doctor_id}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
            <div className="flex items-center gap-2 text-slate-600">
              <Mail size={16} className="text-blue-500" />
              <span className="text-sm truncate">{doctorData.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone size={16} className="text-blue-500" />
              <span className="text-sm">{doctorData.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin size={16} className="text-blue-500" />
              <span className="text-sm truncate">{doctorData.address}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 border-t border-slate-200 pt-5">
        <div className="flex overflow-x-auto no-scrollbar">
          {[
            { id: 'personal', label: 'Personal Information' },
            { id: 'professional', label: 'Professional Details' },
            { id: 'settings', label: 'Account Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 whitespace-nowrap text-sm font-medium relative ${
                activeTab === tab.id
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
  
  const PersonalInformationTab = () => (
    <div className={`${glassCard} p-6 mt-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">Full Name</p>
          <p className="text-slate-900 font-medium">Dr. {doctorData.first_name} {doctorData.last_name}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">National ID</p>
          <p className="text-slate-900 font-medium">{doctorData.cnic}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">Email Address</p>
          <p className="text-slate-900 font-medium">{doctorData.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">Phone Number</p>
          <p className="text-slate-900 font-medium">{doctorData.phone}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">Residential Address</p>
          <p className="text-slate-900 font-medium">{doctorData.address}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">Registered Since</p>
          <p className="text-slate-900 font-medium">{formatDate(doctorData.created_at)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">Last Updated</p>
          <p className="text-slate-900 font-medium">{formatDate(doctorData.updated_at)}</p>
        </div>
      </div>
    </div>
  );

  const ProfessionalDetailsTab = () => (
    <div className="space-y-6 mt-6">
      <div className={`${glassCard} p-6`}>
        <h2 className="text-xl font-semibold mb-4 text-slate-900">Professional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">Specialization</p>
            <p className="text-slate-900 font-medium">{doctorData.specialization}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">License Number</p>
            <p className="text-slate-900 font-medium">{doctorData.license_number}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">Years of Experience</p>
            <p className="text-slate-900 font-medium">
              {new Date().getFullYear() - new Date(doctorData.created_at).getFullYear()} years
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">Department</p>
            <p className="text-slate-900 font-medium">Cardiology Department</p>
          </div>
        </div>
      </div>
      
      <div className={`${glassCard} p-6`}>
        <h2 className="text-xl font-semibold mb-4 text-slate-900">Qualifications</h2>
        <div className="space-y-4">
          {[
            { degree: 'MBBS', institution: 'Aga Khan University', year: '2015' },
            { degree: 'FCPS (Cardiology)', institution: 'College of Physicians and Surgeons Pakistan', year: '2019' },
          ].map((qual, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-semibold text-slate-900">{qual.degree}</h4>
              <p className="text-sm text-slate-600 mt-1">{qual.institution}</p>
              <p className="text-xs text-slate-500 mt-1">Year: {qual.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const AccountSettingsTab = () => (
    <div className="space-y-6 mt-6">
      <div className={`${glassCard} p-6`}>
        <h2 className="text-xl font-semibold mb-6 text-slate-900">Account Settings</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg mb-4 text-slate-900">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-2">First Name</label>
                <input 
                  type="text" 
                  value={doctorData.first_name} 
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">Last Name</label>
                <input 
                  type="text" 
                  value={doctorData.last_name} 
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={doctorData.email} 
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={doctorData.phone} 
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                  readOnly
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:shadow-lg transition">
                Edit Profile
              </button>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-lg mb-4 text-slate-900">Security</h3>
            <div className="space-y-4">
              <button className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition flex items-center gap-2 text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Change Password
              </button>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <h4 className="font-medium text-slate-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-slate-600 mt-1">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Layout navItems={doctorNavItems} title="Doctor Profile">
        <LoadingSpinner fullScreen />
      </Layout>
    );
  }

  return (
    <Layout navItems={doctorNavItems} title="Doctor Profile">
      <div className="space-y-6">
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        
        <ProfileHeader />
        
        {activeTab === 'personal' && <PersonalInformationTab />}
        {activeTab === 'professional' && <ProfessionalDetailsTab />}
        {activeTab === 'settings' && <AccountSettingsTab />}
      </div>
    </Layout>
  );
};
