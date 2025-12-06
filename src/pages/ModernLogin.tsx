import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Activity, ArrowLeft, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export const ModernLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Redirect based on role
      switch (user.role) {
        case 'patient':
          navigate('/patient/dashboard');
          break;
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'lab_staff':
          navigate('/lab/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-aqua-900 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-teal-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-aqua-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
        <div className="absolute w-64 h-64 bg-teal-400/10 rounded-full blur-2xl top-1/3 right-1/4 animate-pulse delay-500"></div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/70 hover:text-white transition-colors backdrop-blur-sm bg-white/5 px-4 py-2 rounded-lg border border-white/10"
      >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </button>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <button
          onClick={() => navigate('/signup')}
          className="absolute top-6 right-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/5 px-4 py-2 rounded-lg border border-white/10"
        >
          Don't have an account? <span className="font-semibold">Sign Up</span>
        </button>
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-teal rounded-2xl mb-4 shadow-glow">
                <Activity className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-white/70">Sign in to your medical dashboard</p>
            </div>

            {error && (
              <div className="mb-6">
                <ErrorMessage message={error} onClose={() => setError('')} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-white/50" size={20} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-white/50" size={20} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                    placeholder="Enter your password"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-teal text-white rounded-xl font-semibold hover:shadow-glow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl">
              <p className="text-xs text-white/50 mb-3 text-center font-medium">DEMO CREDENTIALS (Mock Mode)</p>
              <div className="space-y-2 text-xs text-white/70">
                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                  <span className="font-medium text-white/80">Patient:</span>
                  <span className="font-mono">patient@test.com</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                  <span className="font-medium text-white/80">Doctor:</span>
                  <span className="font-mono">doctor@test.com</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                  <span className="font-medium text-white/80">Lab Staff:</span>
                  <span className="font-mono">lab@test.com</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                  <span className="font-medium text-white/80">Admin:</span>
                  <span className="font-mono">admin@test.com</span>
                </div>
                <p className="text-center pt-2 text-white/50">Password: <span className="font-mono">password</span></p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-white/50 text-sm">
            <p>Protected by enterprise-grade encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
};

