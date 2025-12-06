import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
// import { StatCard } from '../../components/common/StatCard';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
// import { patientService } from '../../services/patientService';
// import { visitService } from '../../services/visitService';
// import { labService } from '../../services/labService';
import { Activity, FileText, Calendar, TrendingUp, Users, Heart, Mail, Phone, MapPin, Droplet, UserCircle, Edit } from 'lucide-react';
// import type { Recommendation } from '../../types';
import { format } from 'date-fns';

const patientNavItems = [
  { path: '/patient/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/patient/lab-reports', label: 'Lab Reports', icon: <FileText size={20} /> },
  { path: '/patient/visits', label: 'Visit History', icon: <Calendar size={20} /> },
  { path: '/patient/timeline', label: 'Disease Timeline', icon: <TrendingUp size={20} /> },
  { path: '/patient/family-history', label: 'Family History', icon: <Users size={20} /> },
  { path: '/patient/predictions', label: 'Health Predictions', icon: <TrendingUp size={20} /> },
  { path: '/patient/recommendations', label: 'AI Recommendations', icon: <Heart size={20} /> },
];

const glassCard = 'backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-glow';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [patientData, setPatientData] = useState({
    first_name: '',
    last_name: '',
    cnic: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    phone: '',
    email: '',
    address: '',
    patient_id: '',
    created_at: '',
    updated_at: '',
  });
  // const [stats, setStats] = useState({
  //   totalVisits: 0,
  //   totalReports: 0,
  //   pendingReports: 0,
  //   recentRecommendations: [] as Recommendation[],
  // });
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError('');

        const patientId = user?.entity_id || '';

        // Fetch patient profile data
        // This would normally be an API call, but we're using the mock data provided
        setPatientData({
          first_name: "John",
          last_name: "Doe",
          cnic: "10017-7730287-3",
          date_of_birth: "1985-05-15",
          gender: "male",
          blood_group: "O+",
          phone: "+92 300 1234567",
          email: "john.doe@example.com",
          address: "123 Medical Plaza, Islamabad, Pakistan",
          patient_id: patientId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          created_at: "2025-11-17T05:33:48.919Z",
          updated_at: "2025-11-17T05:33:48.919Z"
        });


      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.entity_id) {
      fetchDashboardData();
    }
  }, [user]);

  const getAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

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
          <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-500/80 to-aqua-500/80 flex items-center justify-center text-white shadow-glow overflow-hidden">
            {patientData.first_name && patientData.last_name ? (
              <span className="text-3xl font-bold">
                {patientData.first_name.charAt(0)}{patientData.last_name.charAt(0)}
              </span>
            ) : (
              <UserCircle size={64} />
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all">
            <Edit size={14} />
          </button>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {patientData.first_name} {patientData.last_name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-aqua-500/20 text-aqua-200 border border-aqua-500/30">
                  {patientData.gender === 'male' ? 'Male' : patientData.gender === 'female' ? 'Female' : patientData.gender}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/20">
                  {getAge(patientData.date_of_birth)} years
                </span>
                <div className="flex items-center gap-1.5">
                  <Droplet size={14} className="text-red-400" />
                  <span className="text-sm font-medium">{patientData.blood_group}</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Patient ID</p>
              <p className="text-sm font-mono font-semibold text-white mt-1">{patientData.patient_id.split('-')[0]}...{patientData.patient_id.slice(-8)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
            <div className="flex items-center gap-2 text-white/80">
              <Mail size={16} className="text-aqua-400" />
              <span className="text-sm truncate">{patientData.email}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Phone size={16} className="text-aqua-400" />
              <span className="text-sm">{patientData.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <MapPin size={16} className="text-aqua-400" />
              <span className="text-sm truncate">{patientData.address}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 border-t border-white/10 pt-5">
        <div className="flex overflow-x-auto no-scrollbar">
          {[
            { id: 'personal', label: 'Personal Information' },
            { id: 'health', label: 'Health Records' },
            { id: 'settings', label: 'Account Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 whitespace-nowrap text-sm font-medium relative ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-aqua-400 to-teal-400 rounded-full"></span>
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
        <h2 className="text-xl font-semibold">Personal Information</h2>
        {/* <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition flex items-center gap-2 text-sm">
          <Edit size={16} />
          Edit Information
        </button> */}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">Full Name</p>
          <p className="text-white font-medium">{patientData.first_name} {patientData.last_name}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">Date of Birth</p>
          <p className="text-white font-medium">{formatDate(patientData.date_of_birth)} ({getAge(patientData.date_of_birth)} years)</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">National ID</p>
          <p className="text-white font-medium">{patientData.cnic}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">Gender</p>
          <p className="text-white font-medium capitalize">{patientData.gender}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">Blood Group</p>
          <p className="text-white font-medium">{patientData.blood_group}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">Email Address</p>
          <p className="text-white font-medium">{patientData.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">Phone Number</p>
          <p className="text-white font-medium">{patientData.phone}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">Residential Address</p>
          <p className="text-white font-medium">{patientData.address}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">Patient Since</p>
          <p className="text-white font-medium">{formatDate(patientData.created_at)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">Last Updated</p>
          <p className="text-white font-medium">{formatDate(patientData.updated_at)}</p>
        </div>
      </div>
      
      {/* <div className="mt-8 pt-6 border-t border-white/10">
        <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row justify-between">
          <div>
            <p className="text-sm text-white/60 mb-1">Name</p>
            <p className="font-medium">Sarah Doe</p>
          </div>
          <div className="mt-3 sm:mt-0">
            <p className="text-sm text-white/60 mb-1">Relationship</p>
            <p className="font-medium">Spouse</p>
          </div>
          <div className="mt-3 sm:mt-0">
            <p className="text-sm text-white/60 mb-1">Phone</p>
            <p className="font-medium">+92 300 7654321</p>
          </div>
        </div>
      </div> */}
    </div>
  );

  const HealthRecordsTab = () => (
    <div className="space-y-6 mt-6">
      <div className={`${glassCard} p-6`}>
        <h2 className="text-xl font-semibold mb-4">Health Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-xs text-white/60 uppercase tracking-[0.1em]">Height</p>
            <p className="text-2xl font-semibold mt-2 text-white">178 cm</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-xs text-white/60 uppercase tracking-[0.1em]">Weight</p>
            <p className="text-2xl font-semibold mt-2 text-white">75 kg</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-xs text-white/60 uppercase tracking-[0.1em]">BMI</p>
            <p className="text-2xl font-semibold mt-2 text-white">23.7</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-xs text-white/60 uppercase tracking-[0.1em]">Blood Pressure</p>
            <p className="text-2xl font-semibold mt-2 text-white">120/80</p>
          </div>
        </div>
      </div>
      
      <div className={`${glassCard} p-6`}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Current Medications</h2>
          <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition text-sm">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {[
            { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', purpose: 'Diabetes Management' },
            { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', purpose: 'Blood Pressure' },
          ].map((med, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row justify-between">
              <div className="mb-2 sm:mb-0">
                <h4 className="font-semibold">{med.name}</h4>
                <p className="text-sm text-white/70">{med.purpose}</p>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-white/60">Dosage</p>
                  <p className="text-sm font-medium">{med.dosage}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60">Frequency</p>
                  <p className="text-sm font-medium">{med.frequency}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={`${glassCard} p-6`}>
        <h2 className="text-xl font-semibold mb-4">Allergies & Conditions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <h3 className="text-lg font-medium mb-3">Allergies</h3>
            <div className="space-y-2">
              {['Penicillin', 'Peanuts'].map((allergy, idx) => (
                <div key={idx} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="font-medium">{allergy}</p>
                </div>
              ))}
              {['Penicillin', 'Peanuts'].length === 0 && (
                <p className="text-white/60 italic">No known allergies</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Chronic Conditions</h3>
            <div className="space-y-2">
              {['Type 2 Diabetes', 'Hypertension'].map((condition, idx) => (
                <div key={idx} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="font-medium">{condition}</p>
                </div>
              ))}
              {['Type 2 Diabetes', 'Hypertension'].length === 0 && (
                <p className="text-white/60 italic">No chronic conditions</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const AccountSettingsTab = () => (
    <div className="space-y-6 mt-6">
      <div className={`${glassCard} p-6`}>
        <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg mb-4">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">First Name</label>
                <input 
                  type="text" 
                  value={patientData.first_name} 
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-aqua-400/60"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Last Name</label>
                <input 
                  type="text" 
                  value={patientData.last_name} 
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-aqua-400/60"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={patientData.email} 
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-aqua-400/60"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={patientData.phone} 
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-aqua-400/60"
                  readOnly
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-aqua-500 text-white font-medium hover:shadow-lg transition">
                Edit Profile
              </button>
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/10">
            <h3 className="text-lg mb-4">Security</h3>
            <div className="space-y-4">
              <button className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 transition flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Change Password
              </button>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-white/60 mt-1">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aqua-500"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/10">
            <h3 className="text-lg mb-4">Notifications</h3>
            <div className="space-y-3">
              {[
                { name: 'Appointment Reminders', desc: 'Get notified about upcoming appointments' },
                { name: 'Lab Results', desc: 'Receive notifications when new lab results are available' },
                { name: 'Health Recommendations', desc: 'Get AI-generated health recommendations' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-white/60 mt-1">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aqua-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Layout navItems={patientNavItems} title="Patient Profile">
        <LoadingSpinner fullScreen />
      </Layout>
    );
  }

  return (
    <Layout navItems={patientNavItems} title="Patient Profile">
      <div className="space-y-6 text-white">
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        
        <ProfileHeader />
        
        {activeTab === 'personal' && <PersonalInformationTab />}
        {activeTab === 'health' && <HealthRecordsTab />}
        {activeTab === 'settings' && <AccountSettingsTab />}
      </div>
    </Layout>
  );
};