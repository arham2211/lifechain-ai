import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, Mail, Lock, User, Briefcase, Eye, EyeOff } from 'lucide-react';

const roles = [
  { label: 'Patient', value: 'patient' },
  { label: 'Doctor', value: 'doctor' },
  { label: 'Lab Staff', value: 'lab_staff' },
  { label: 'Admin', value: 'admin' },
];

export const ModernSignup: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('patient');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      alert('Mock Mode: Sign up is not enabled. Please use demo credentials to sign in.');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-aqua-900 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[30rem] h-[30rem] bg-teal-500/20 rounded-full blur-3xl -top-52 -left-32 animate-pulse" />
        <div className="absolute w-[28rem] h-[28rem] bg-aqua-500/20 rounded-full blur-3xl -bottom-60 -right-20 animate-pulse delay-700" />
        <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl top-1/3 right-1/4 animate-pulse delay-500" />
      </div>

      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/70 hover:text-white transition-colors backdrop-blur-sm bg-white/5 px-4 py-2 rounded-lg border border-white/10"
      >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </button>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 text-white">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-aqua-500 rounded-2xl mb-4 shadow-glow">
                <Activity className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold">Create your account</h1>
              <p className="text-white/70 mt-2">Join the smarter AI healthcare experience</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="text-white/50" size={20} />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-white/50" size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Select Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => setRole(option.value)}
                      className={`p-3 rounded-2xl border transition-all flex items-center gap-2 ${
                        role === option.value
                          ? 'border-teal-300 bg-teal-500/20 text-white shadow-glow'
                          : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <Briefcase size={18} className="opacity-70" />
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-white/50" size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-white/50" size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter your password"
                    className="w-full pl-12 pr-12 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-aqua-500 text-white rounded-2xl font-semibold hover:shadow-glow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-white/60 text-sm mt-6">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="text-white hover:underline font-semibold">
                Sign in instead
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

