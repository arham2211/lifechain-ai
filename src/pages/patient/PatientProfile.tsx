import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import {
  Activity,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  Heart,
  Mail,
  Phone,
  MapPin,
  Droplet,
  UserCircle,
  Edit,
  Shield,
  Fingerprint,
  Sparkles,
  ChevronRight,
  Lock
} from 'lucide-react';
import { format } from 'date-fns';
import type { Patient } from '../../types';

const patientNavItems = [
  { path: '/patient/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
  { path: '/patient/lab-reports', label: 'Lab Reports', icon: <FileText size={20} /> },
  { path: '/patient/visits', label: 'Visit History', icon: <Calendar size={20} /> },
  { path: '/patient/timeline', label: 'Disease Timeline', icon: <TrendingUp size={20} /> },
  { path: '/patient/family-history', label: 'Family History', icon: <Users size={20} /> },
];

const glassCard = 'glass-card rounded-3xl shadow-lg border border-slate-100 bg-white/80 backdrop-blur-xl';

export const PatientProfile: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user || !user.entity_id) {
          setError("User session not found");
          return;
        }

        setIsLoading(true);
        setError('');

        // Using the specific URL requested by the user
        const response = await fetch(`http://0.0.0.0:8001/api/v1/patients/${user.entity_id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }

        const data: Patient = await response.json();
        setPatientData(data);

      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const getAge = (dateString: string) => {
    try {
      const today = new Date();
      const birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 0;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const ProfileHeader = () => {
    if (!patientData) return null;

    return (
      <section className={`${glassCard} p-6 lg:p-8 relative overflow-hidden`}>
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="group relative">
            <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full p-1 bg-gradient-to-br from-primary-500 to-secondary-500 shadow-xl shadow-primary-500/20">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {patientData.first_name ? (
                  <span className="text-4xl font-bold bg-gradient-to-br from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    {patientData.first_name.charAt(0)}
                  </span>
                ) : (
                  <UserCircle size={64} className="text-slate-300" />
                )}
              </div>
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-primary-600 transition-all shadow-lg border-4 border-white">
              <Edit size={16} />
            </button>
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                  {patientData.first_name} {patientData.last_name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100 flex items-center gap-1.5 capitalize">
                    {patientData.gender}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    {getAge(patientData.date_of_birth)} years
                  </span>
                  {patientData.blood_group && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                      <Droplet size={12} className="fill-rose-700" />
                      <span>{patientData.blood_group}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="px-5 py-3 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Fingerprint size={14} className="text-primary-400" />
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Universal ID</p>
                  </div>
                  <p className="text-lg font-mono font-bold tracking-wide">
                    {patientData.patient_id.split('-')[0]}...{patientData.patient_id.slice(-4)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Email Address</p>
                  <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px]">{patientData.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Phone</p>
                  <p className="text-sm font-semibold text-slate-900">{patientData.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Location</p>
                  <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px]">{patientData.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'personal', label: 'Personal Information', icon: UserCircle },
            { id: 'health', label: 'Health Snapshot', icon: Activity },
            { id: 'settings', label: 'Security & Settings', icon: Shield },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${isActive
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
              >
                <tab.icon size={18} className={isActive ? 'text-primary-400' : 'text-slate-400'} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>
    );
  };

  const PersonalInformationTab = () => {
    if (!patientData) return null;

    return (
      <div className={`${glassCard} p-6 mt-6`}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              Personal Details
            </h2>
            <p className="text-slate-500 text-sm mt-1">Manage your personal information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {[
            { label: 'Full Name', value: patientData.first_name + ' ' + patientData.last_name },
            { label: 'Date of Birth', value: `${formatDate(patientData.date_of_birth)} (${getAge(patientData.date_of_birth)} years)` },
            { label: 'National ID (CNIC)', value: patientData.cnic },
            { label: 'Gender', value: patientData.gender, capitalize: true },
            { label: 'Blood Type', value: patientData.blood_group },
            { label: 'Email', value: patientData.email },
            { label: 'Phone', value: patientData.phone },
            { label: 'Address', value: patientData.address },
            { label: 'Registered Since', value: formatDate(patientData.created_at) },
            { label: 'Last Updated', value: formatDate(patientData.updated_at) },
          ].map((item, idx) => (
            <div key={idx} className="group">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">{item.label}</p>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 group-hover:border-primary-100 transition-colors">
                <p className={`text-slate-900 font-medium ${item.capitalize ? 'capitalize' : ''}`}>
                  {item.value || 'Not provided'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  };

  const HealthSnapshotTab = () => (
    <div className="space-y-6 mt-6">
      <div className={`${glassCard} p-6`}>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Activity size={18} className="text-primary-600" />
          Health Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Height', value: '178 cm', color: 'bg-blue-50 text-blue-700' },
            { label: 'Weight', value: '75 kg', color: 'bg-emerald-50 text-emerald-700' },
            { label: 'BMI', value: '23.7', color: 'bg-purple-50 text-purple-700' },
            { label: 'BP', value: '120/80', color: 'bg-rose-50 text-rose-700' },
          ].map((metric, idx) => (
            <div key={idx} className={`p-4 rounded-2xl ${metric.color} flex flex-col items-center justify-center text-center`}>
              <p className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-1">{metric.label}</p>
              <p className="text-xl font-bold">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`${glassCard} p-6`}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Heart size={18} className="text-rose-500" />
            Current Medications
          </h2>
          <button className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-semibold transition-colors">
            View History
          </button>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', purpose: 'Diabetes Management' },
            { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', purpose: 'Blood Pressure' },
          ].map((med, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900">{med.name}</h4>
                <p className="text-sm text-slate-500 font-medium mt-1">{med.purpose}</p>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Dosage</p>
                  <p className="text-sm font-semibold text-slate-700">{med.dosage}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Frequency</p>
                  <p className="text-sm font-semibold text-slate-700">{med.frequency}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AccountSettingsTab = () => (
    <div className="space-y-6 mt-6">
      <div className={`${glassCard} p-6`}>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Shield size={18} className="text-slate-600" />
          Security & Privacy
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-primary-200 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                  <Lock size={18} className="text-slate-600 group-hover:text-primary-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">Change Password</p>
                  <p className="text-xs text-slate-500">Last changed 30 days ago</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-primary-200 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                  <Shield size={18} className="text-slate-600 group-hover:text-primary-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">2FA Authentication</p>
                  <p className="text-xs text-slate-500">Enabled</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Notifications</h3>
            <div className="space-y-3">
              {[
                { name: 'Appointment Reminders', desc: 'Get notified about upcoming appointments' },
                { name: 'Lab Results', desc: 'Receive notifications when new lab results are available' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
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
      <div className="space-y-6">
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}

        <ProfileHeader />

        {activeTab === 'personal' && <PersonalInformationTab />}
        {activeTab === 'health' && <HealthSnapshotTab />}
        {activeTab === 'settings' && <AccountSettingsTab />}
      </div>
    </Layout>
  );
};  