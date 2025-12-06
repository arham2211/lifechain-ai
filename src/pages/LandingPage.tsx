// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Activity,
//   Heart,
//   Brain,
//   Shield,
//   TrendingUp,
//   Users,
//   Clock,
//   Award,
//   Play,
//   ChevronRight,
//   Search,
//   Menu,
//   X,
// } from 'lucide-react';

// export const LandingPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

//   const stats = [
//     { label: 'Active Patients', value: '10K+', icon: Users },
//     { label: 'Accuracy Rate', value: '99.8%', icon: Award },
//     { label: 'Response Time', value: '<2s', icon: Clock },
//     { label: 'Health Records', value: '50K+', icon: Activity },
//   ];

//   const features = [
//     {
//       icon: Brain,
//       title: 'AI-Powered Diagnostics',
//       description: 'Advanced machine learning algorithms for accurate health predictions',
//       color: 'from-teal-400 to-teal-600',
//     },
//     {
//       icon: Heart,
//       title: 'Real-Time Monitoring',
//       description: 'Continuous vital signs tracking with instant alerts',
//       color: 'from-aqua-400 to-aqua-600',
//     },
//     {
//       icon: Shield,
//       title: 'Secure & Private',
//       description: 'Enterprise-grade encryption protecting your medical data',
//       color: 'from-teal-500 to-aqua-500',
//     },
//     {
//       icon: TrendingUp,
//       title: 'Predictive Analytics',
//       description: 'Forecast health trends and prevent complications',
//       color: 'from-aqua-500 to-teal-600',
//     },
//   ];

//   const trustedBrands = [
//     'Healthcare Inc',
//     'MedTech Solutions',
//     'Global Health',
//     'Care Plus',
//     'HealthFirst',
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-aqua-900 overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute w-96 h-96 bg-teal-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
//         <div className="absolute w-96 h-96 bg-aqua-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
//         <div className="absolute w-64 h-64 bg-teal-400/10 rounded-full blur-2xl top-1/3 right-1/4 animate-pulse delay-500"></div>
//       </div>

//       {/* Navigation Bar */}
//       <nav className="relative z-50 backdrop-blur-lg bg-white/5 border-b border-white/10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             {/* Logo */}
//             <div className="flex items-center gap-2">
//               <div className="w-10 h-10 bg-gradient-teal rounded-lg flex items-center justify-center shadow-glow">
//                 <Activity className="text-white" size={24} />
//               </div>
//               <span className="text-xl font-bold text-white">LifeChainAI</span>
//             </div>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center space-x-8">
//               <a href="#home" className="text-white/90 hover:text-white transition-colors">Home</a>
//               <a href="#services" className="text-white/90 hover:text-white transition-colors">Services</a>
//               <a href="#about" className="text-white/90 hover:text-white transition-colors">About Us</a>
//               <a href="#products" className="text-white/90 hover:text-white transition-colors">Products</a>
//               <a href="#contact" className="text-white/90 hover:text-white transition-colors">Contact</a>
//             </div>

//             {/* Search & CTA */}
//             <div className="hidden md:flex items-center gap-4">
//               <button className="p-2 text-white/70 hover:text-white transition-colors">
//                 <Search size={20} />
//               </button>
//               <button
//                 onClick={() => navigate('/signup')}
//                 className="px-5 py-2 rounded-lg border border-white/30 text-white/90 hover:bg-white/10 transition-all"
//               >
//                 Sign Up
//               </button>
//               <button
//                 onClick={() => navigate('/login')}
//                 className="px-6 py-2 bg-gradient-teal text-white rounded-lg font-medium hover:shadow-glow transition-all"
//               >
//                 Sign In
//               </button>
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="md:hidden p-2 text-white"
//             >
//               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden backdrop-blur-xl bg-slate-900/95 border-t border-white/10">
//             <div className="px-4 py-4 space-y-3">
//               <a href="#home" className="block text-white/90 hover:text-white py-2">Home</a>
//               <a href="#services" className="block text-white/90 hover:text-white py-2">Services</a>
//               <a href="#about" className="block text-white/90 hover:text-white py-2">About Us</a>
//               <a href="#products" className="block text-white/90 hover:text-white py-2">Products</a>
//               <a href="#contact" className="block text-white/90 hover:text-white py-2">Contact</a>
//               <button
//                 onClick={() => navigate('/signup')}
//                 className="w-full px-6 py-2 border border-white/30 text-white rounded-lg font-medium mt-2"
//               >
//                 Sign Up
//               </button>
//               <button
//                 onClick={() => navigate('/login')}
//                 className="w-full px-6 py-2 bg-gradient-teal text-white rounded-lg font-medium mt-2"
//               >
//                 Sign In
//               </button>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Hero Section */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
//         <div className="grid md:grid-cols-2 gap-12 items-center">
//           {/* Left Side - Content */}
//           <div className="space-y-8">
//             {/* Badge */}
//             <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
//               <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
//               <span className="text-sm text-white/90">AI-Powered Healthcare Platform</span>
//             </div>

//             {/* Headline */}
//             <div className="space-y-4">
//               <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
//                 Smarter AI
//                 <br />
//                 <span className="bg-gradient-to-r from-teal-300 via-aqua-300 to-teal-400 bg-clip-text text-transparent">
//                   Healthcare
//                 </span>
//                 <br />
//                 Starts Here
//               </h1>
//               <p className="text-xl text-white/70 max-w-xl">
//                 Transform medical data into actionable insights with our advanced AI platform.
//                 Empowering healthcare professionals with real-time analytics and predictive intelligence.
//               </p>
//             </div>

//             {/* CTA Buttons */}
//             <div className="flex flex-wrap gap-4">
//               <button
//                 onClick={() => navigate('/login')}
//                 className="px-8 py-4 bg-gradient-teal text-white rounded-xl font-semibold hover:shadow-glow-lg transition-all flex items-center gap-2 group"
//               >
//                 Book a Free Consultation
//                 <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
//               </button>
//               <button className="px-8 py-4 backdrop-blur-lg bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center gap-2">
//                 <Play size={20} />
//                 Watch Demo
//               </button>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
//               {stats.map((stat, idx) => (
//                 <div key={idx} className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
//                   <stat.icon className="text-teal-400 mb-2" size={24} />
//                   <div className="text-2xl font-bold text-white">{stat.value}</div>
//                   <div className="text-xs text-white/60">{stat.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right Side - Dashboard Preview */}
//           <div className="relative">
//             {/* Floating Dashboard Cards */}
//             <div className="relative space-y-4">
//               {/* Main Dashboard Card */}
//               <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-white">Health Dashboard</h3>
//                   <div className="px-3 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-xs text-teal-300">
//                     Live
//                   </div>
//                 </div>

//                 {/* Progress Rings */}
//                 <div className="grid grid-cols-3 gap-4 mb-6">
//                   {[
//                     { label: 'Heart Rate', value: 72, color: 'text-pink-400' },
//                     { label: 'Blood Pressure', value: 120, color: 'text-teal-400' },
//                     { label: 'Oxygen', value: 98, color: 'text-aqua-400' },
//                   ].map((metric, idx) => (
//                     <div key={idx} className="text-center">
//                       <div className="relative inline-flex items-center justify-center">
//                         <svg className="w-20 h-20 transform -rotate-90">
//                           <circle
//                             cx="40"
//                             cy="40"
//                             r="32"
//                             stroke="currentColor"
//                             strokeWidth="8"
//                             fill="none"
//                             className="text-white/10"
//                           />
//                           <circle
//                             cx="40"
//                             cy="40"
//                             r="32"
//                             stroke="currentColor"
//                             strokeWidth="8"
//                             fill="none"
//                             strokeDasharray={`${(metric.value / 100) * 200} 200`}
//                             className={metric.color}
//                           />
//                         </svg>
//                         <span className="absolute text-lg font-bold text-white">{metric.value}</span>
//                       </div>
//                       <p className="text-xs text-white/70 mt-2">{metric.label}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Chart Preview */}
//                 <div className="h-32 flex items-end justify-between gap-2">
//                   {[40, 65, 50, 80, 60, 90, 70, 85].map((height, idx) => (
//                     <div
//                       key={idx}
//                       className="flex-1 bg-gradient-to-t from-teal-500/50 to-aqua-500/30 rounded-t-lg"
//                       style={{ height: `${height}%` }}
//                     ></div>
//                   ))}
//                 </div>
//               </div>

//               {/* Floating Vitals Card */}
//               <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 shadow-xl animate-pulse">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 bg-gradient-teal rounded-lg flex items-center justify-center">
//                     <Heart className="text-white" size={24} />
//                   </div>
//                   <div>
//                     <p className="text-sm text-white/70">Daily Progress</p>
//                     <p className="text-2xl font-bold text-white">87%</p>
//                   </div>
//                   <div className="ml-auto text-teal-400">+12%</div>
//                 </div>
//               </div>

//               {/* Medical Professional Illustration */}
//               <div className="absolute -right-12 top-0 w-64 h-64 opacity-50">
//                 <div className="w-full h-full bg-gradient-to-br from-teal-400/20 to-aqua-400/20 rounded-full backdrop-blur-sm border border-white/10 flex items-center justify-center">
//                   <Users className="text-white/30" size={120} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
//           <p className="text-white/70 max-w-2xl mx-auto">
//             Advanced AI technology meets healthcare excellence
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {features.map((feature, idx) => (
//             <div
//               key={idx}
//               className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:shadow-glow group"
//             >
//               <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-glow`}>
//                 <feature.icon className="text-white" size={28} />
//               </div>
//               <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
//               <p className="text-white/70 text-sm">{feature.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Trusted By Section */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
//         <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8">
//           <p className="text-center text-white/50 text-sm mb-6">Trusted by leading healthcare providers</p>
//           <div className="flex flex-wrap items-center justify-center gap-8">
//             {trustedBrands.map((brand, idx) => (
//               <div
//                 key={idx}
//                 className="text-white/30 font-semibold text-lg hover:text-white/50 transition-colors"
//               >
//                 {brand}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState } from "react";
import {
  Activity,
  X,
  Menu,
  Users,
  Send,
  ArrowRight,
  ChevronRight,
  Play,
  Sparkles,
  Star,
  Fingerprint,
  GitBranch,
  Globe,
  CheckCircle,
  Heart,
  Brain,
  Database,
  Lock,
  Zap,
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const features = [
    {
      icon: <Fingerprint className="w-10 h-10" />,
      title: "Unique Patient ID",
      description: "Universal identifier linking all medical records from birth throughout life.",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      icon: <Brain className="w-10 h-10" />,
      title: "AI Data Extraction",
      description: "Advanced OCR & NLP models extract structured data from medical reports.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <GitBranch className="w-10 h-10" />,
      title: "Family Genetics",
      description: "Identify hereditary risks through comprehensive family tree analysis.",
      gradient: "from-green-500 to-emerald-400"
    },
    {
      icon: <Globe className="w-10 h-10" />,
      title: "Global Access",
      description: "Access records worldwide with real-time medical translation.",
      gradient: "from-orange-500 to-amber-400"
    },
    {
      icon: <Activity className="w-10 h-10" />,
      title: "Health Monitoring",
      description: "AI-powered tracking for chronic conditions with predictive insights.",
      gradient: "from-red-500 to-rose-400"
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: "Dental Detection",
      description: "Deep learning models for dental disease identification from imaging.",
      gradient: "from-indigo-500 to-violet-400"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Enhanced Header with Glass Effect */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-7 h-7 text-gradient-to-r from-blue-600 to-cyan-500" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                  LifeChain AI
                </h1>
                <p className="text-xs text-gray-500 font-medium">Healthcare Ecosystem</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {["Home", "Features", "About", "Team", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2.5 font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-4">
              <button className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                <span className="relative flex items-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="px-4 py-6 space-y-1">
              {["Home", "Features", "About", "Team", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 px-4">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Floating Elements */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-100">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  AI-Powered Healthcare Revolution
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                <span className="block text-gray-900">Your Lifelong</span>
                <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-gradient">
                  Health Companion
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Unifying your entire medical journey into a single, secure, and intelligent 
                digital ecosystem—from birth to beyond.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                  <span className="relative flex items-center justify-center space-x-3">
                    <span>Start Your Journey</span>
                    <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                
                <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-3 group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-blue-600" />
                  </div>
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>

            {/* Right Side - Interactive Preview */}
            <div className="relative">
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 animate-float z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-2xl shadow-blue-500/10 border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Smart AI</h4>
                      <p className="text-sm text-gray-500">Real-time Analysis</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl shadow-blue-500/5 border border-gray-100 p-8 transform hover:scale-[1.02] transition-transform duration-500">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-2xl">
                      <Activity className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        LifeChain AI
                      </h2>
                      <p className="text-gray-600 mt-2">Secure • Intelligent • Unified</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Floating Element */}
              <div className="absolute -bottom-6 -left-6 animate-float-delayed z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-2xl shadow-cyan-500/10 border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center shadow-lg">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Secure</h4>
                      <p className="text-sm text-gray-500">HIPAA Compliant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Revolutionary Features
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Unified Healthcare
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Ecosystem
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              A comprehensive platform connecting all your medical data into one intelligent, 
              secure ecosystem powered by cutting-edge AI.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 border border-gray-100 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 flex items-center justify-center shadow-lg`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button className="text-sm font-semibold text-blue-600 hover:text-cyan-500 flex items-center space-x-2 group/btn">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Visual Card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-blue-500/5 rounded-3xl p-1">
                <div className="bg-white rounded-3xl p-12 shadow-xl">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-2xl">
                      <Database className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        LifeChain AI
                      </h3>
                      <p className="text-gray-600 mt-3">Final Year Project</p>
                      <p className="text-sm text-gray-500">FAST University, Karachi</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4">
                <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-full shadow-lg">
                  Research Project
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full mb-6">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  About Our Vision
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                Redefining
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Healthcare Access
                </span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                In today's fragmented healthcare landscape, critical medical information remains 
                siloed across disparate systems. LifeChain AI bridges these gaps, creating a 
                seamless, intelligent ecosystem for lifelong health management.
              </p>

              <div className="space-y-6">
                {[
                  "Consolidate lifelong medical records into one secure platform",
                  "Enable global healthcare access with AI translation",
                  "Identify hereditary risks through family analysis",
                  "Monitor health with predictive AI insights"
                ].map((goal, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                      {goal}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                <p className="text-gray-700 italic">
                  "Supervised by Dr. Shahbaz Siddiqui, Department of Computer Science"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full mb-6">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Patient Stories
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Trusted by
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Patients Worldwide
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "LifeChain AI saved my life during an emergency abroad. Doctors accessed my complete medical history instantly.",
                name: "Maria Johnson",
                role: "Chronic Diabetes Patient",
                initials: "MJ",
                color: "from-blue-500 to-cyan-400"
              },
              {
                quote: "The family tree analysis revealed hereditary heart conditions we never knew about. Early detection made all the difference.",
                name: "Robert Chen",
                role: "Family History Analysis",
                initials: "RC",
                color: "from-purple-500 to-pink-400"
              },
              {
                quote: "No more carrying stacks of medical reports. Everything is digitized and organized with complete health picture.",
                name: "Sarah Ahmed",
                role: "International Patient",
                initials: "SA",
                color: "from-green-500 to-emerald-400"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                
                <p className="text-gray-600 italic text-lg leading-relaxed mb-8">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center pt-6 border-t border-gray-100">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${testimonial.color} flex items-center justify-center shadow-lg`}>
                    <span className="font-bold text-white text-lg">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full mb-6">
                <Send className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Get in Touch
                </span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                Let's Transform
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Healthcare Together
                </span>
              </h2>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-12">
                Whether you're a healthcare provider, researcher, or patient, 
                we're here to help you revolutionize medical record management.
              </p>

              {/* Contact Info Cards */}
              <div className="space-y-6">
                {[
                  {
                    icon: <Activity className="w-6 h-6" />,
                    title: "Project Support",
                    details: ["FAST National University", "Karachi, Pakistan"]
                  },
                  {
                    icon: <Users className="w-6 h-6" />,
                    title: "Supervisor Contact",
                    details: ["Dr. Shahbaz Siddiqui", "Computer Science Department"]
                  },
                  {
                    icon: <Globe className="w-6 h-6" />,
                    title: "Email Us",
                    details: ["support@lifechainai.com", "research@lifechainai.com"]
                  }
                ].map((info, index) => (
                  <div
                    key={index}
                    className="group flex items-start space-x-4 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <div className="text-white">{info.icon}</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{info.title}</h4>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl shadow-blue-500/5 border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">
                Send us a Message
              </h3>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Inquiry Type
                  </label>
                  <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none">
                    <option>General Information</option>
                    <option>Technical Support</option>
                    <option>Research Collaboration</option>
                    <option>Healthcare Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Logo + Description */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">LifeChain AI</span>
                  <p className="text-xs text-gray-400">Healthcare Ecosystem</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Unifying global healthcare through intelligent, secure medical 
                record management and predictive analytics.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {["Home", "Features", "About", "Team", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Resources</h3>
              <ul className="space-y-3">
                {["Documentation", "Privacy Policy", "Terms of Service", "FAQ"].map((item) => (
                  <li key={item}>
                    <a className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 cursor-pointer">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Subscribe for project updates and healthcare insights.
              </p>
              <div className="flex group">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-l-xl border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
                <button className="px-6 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-r-xl hover:shadow-lg transition-shadow duration-300">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} LifeChain AI. Final Year Project — FAST National University.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Redefining healthcare, one record at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};