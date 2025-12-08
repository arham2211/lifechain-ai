import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Activity, ArrowLeft, Lock, Mail, Eye, EyeOff, Dna, Fingerprint, Heart, Shield} from 'lucide-react';
import { motion } from 'framer-motion';
import "../index.css"


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
    <div className="min-h-screen bg-slate-50 overflow-hidden relative font-sans text-slate-900">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 -z-20" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-200/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors backdrop-blur-sm bg-white/60 px-4 py-2.5 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md"
      >
        <ArrowLeft size={18} />
        <span className="font-medium text-sm">Back to Home</span>
      </button>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Panel - The "Cool" 3D Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="hidden lg:flex relative h-[600px] w-full flex-col items-center justify-center perspective-1000"
          >
            {/* 3D Scene Container */}
            <div className="relative w-[500px] h-[500px] preserve-3d">
              
              {/* Central Glowing Core */}
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(14, 165, 233, 0.2)",
                    "0 0 60px rgba(14, 165, 233, 0.6)",
                    "0 0 20px rgba(14, 165, 233, 0.2)"
                  ] 
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-tr from-primary-500 to-cyan-400 z-10 flex items-center justify-center shadow-lg"
              >
                <Activity className="text-white w-10 h-10" />
              </motion.div>

              {/* Ring 1 - Fast Horizontal Spinner */}
              <motion.div
                animate={{ rotateX: [70, 70], rotateZ: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-[3px] border-primary-400/30 border-t-primary-500 shadow-[0_0_15px_rgba(14,165,233,0.3)] preserve-3d"
              />

              {/* Ring 2 - Vertical Tilted Spinner */}
              <motion.div
                animate={{ rotateY: [60, 60], rotateZ: [360, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-[2px] border-dashed border-purple-400/40 preserve-3d"
              >
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50" />
              </motion.div>

              {/* Ring 3 - Large Slow Orbit */}
              <motion.div
                animate={{ rotateX: [45, 45], rotateY: [45, 45], rotateZ: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-[1px] border-slate-300/30 preserve-3d"
              >
                 <div className="absolute bottom-[10%] right-[15%] w-6 h-6 bg-emerald-400/20 backdrop-blur-md rounded-full border border-emerald-400 flex items-center justify-center shadow-lg">
                    <Shield size={12} className="text-emerald-600" />
                 </div>
              </motion.div>

              {/* Floating Glass Card 1 - Top Left */}
              <motion.div
                animate={{ y: [-15, 15, -15], rotateX: 5, rotateY: -5 }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-0 w-48 bg-white/70 backdrop-blur-xl border border-white/40 p-4 rounded-2xl shadow-xl z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                    <Heart size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Heart Rate</p>
                    <p className="text-sm font-bold text-slate-800">72 BPM</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    animate={{ width: ["60%", "75%", "60%"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full bg-rose-500 rounded-full"
                  />
                </div>
              </motion.div>

              {/* Floating Glass Card 2 - Bottom Right */}
              <motion.div
                animate={{ y: [20, -20, 20], rotateX: -5, rotateY: 5 }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 right-0 w-52 bg-white/70 backdrop-blur-xl border border-white/40 p-4 rounded-2xl shadow-xl z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Dna size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Genomic Sequence</p>
                    <p className="text-sm font-bold text-slate-800">Matching...</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: ["10px", "24px", "10px"] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1.5 bg-blue-500 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>

              {/* Floating Particles/Data Points */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-slate-400/50 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -40, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}

            </div>
            
            {/* Text Under Graphic */}
            <div className="mt-12 text-center relative z-10">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-2">
                LifeChain AI
              </h1>
              <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                The next generation of secure, decentralized healthcare management.
              </p>
            </div>
          </motion.div>

          {/* Right Panel - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 relative overflow-hidden">
              
              {/* Decorative Header Blob */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500" />
              
              <div className="mb-8">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 text-primary-600">
                  <Fingerprint size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                <p className="text-slate-500 mt-1">Sign in to access your portal</p>
              </div>

              {error && (
                <div className="mb-6">
                  <ErrorMessage message={error} onClose={() => setError('')} />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent block w-full pl-11 p-3.5 transition-all hover:bg-slate-100/50"
                      placeholder="name@hospital.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent block w-full pl-11 pr-11 p-3.5 transition-all hover:bg-slate-100/50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <a href="#" className="text-xs font-medium text-primary-600 hover:text-primary-700">Forgot password?</a>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowLeft className="rotate-180 ml-2" size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-center cursor-help" title="Use patient@test.com">
                    <span className="block text-slate-400 mb-1">Patient</span>
                    <span className="font-mono font-medium text-slate-700">patient@test.com</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-center cursor-help" title="Use doctor@test.com">
                    <span className="block text-slate-400 mb-1">Doctor</span>
                    <span className="font-mono font-medium text-slate-700">doctor@test.com</span>
                  </div>
                   <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-center cursor-help" title="Use patient@test.com">
                    <span className="block text-slate-400 mb-1">Lab</span>
                    <span className="font-mono font-medium text-slate-700">lab@test.com</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-center cursor-help" title="Use doctor@test.com">
                    <span className="block text-slate-400 mb-1">Admin</span>
                    <span className="font-mono font-medium text-slate-700">admin@test.com</span>
                  </div>
                </div>
                <p className="text-center text-xs text-slate-400 mt-4">
                  Password for all accounts: <span className="font-mono text-slate-600">password</span>
                </p>
              </div>

              <div className="mt-6 text-center">
                 <p className="text-sm text-slate-500">
                    New to LifeChain? <button onClick={() => navigate('/signup')} className="font-semibold text-primary-600 hover:text-primary-500">Create account</button>
                 </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};