// import React from 'react';
// 
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
  MessageSquare,
  MapPin,
  Mail,
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
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  interface Feature {
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    color: string;
    title: string;
    description: string;
    delay: number;
  }

  const features: Feature[] = [
    {
      icon: <Fingerprint className="w-8 h-8" />,
      title: "Unique Patient ID",
      description:
        "Universal identifier linking all medical records from birth throughout life securely.",
      color: "bg-blue-50 text-blue-600",
      delay: 0,
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Extraction",
      description:
        "Advanced OCR & NLP models instantly extract structured data from messy medical reports.",
      color: "bg-purple-50 text-purple-600",
      delay: 0.1,
    },
    {
      icon: <GitBranch className="w-8 h-8" />,
      title: "Family Genetics",
      description:
        "Identify hereditary risks through automated, comprehensive family tree analysis.",
      color: "bg-emerald-50 text-emerald-600",
      delay: 0.2,
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Access",
      description:
        "Travel with confidence. Access records worldwide with real-time medical translation.",
      color: "bg-orange-50 text-orange-600",
      delay: 0.3,
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Vitals Monitoring",
      description:
        "AI-powered tracking for chronic conditions with predictive health insights.",
      color: "bg-rose-50 text-rose-600",
      delay: 0.4,
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Dental AI",
      description:
        "Early detection deep learning models for dental diseases from standard imaging.",
      color: "bg-indigo-50 text-indigo-600",
      delay: 0.5,
    },
  ];
  const testimonials = [
    {
      quote:
        "LifeChain AI saved my life during an emergency abroad. Doctors accessed my complete medical history instantly despite the language barrier.",
      name: "Maria Johnson",
      role: "Diabetes Patient",
      initials: "MJ",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      quote:
        "The family tree analysis revealed hereditary heart conditions we never knew about. Early detection made all the difference for my children.",
      name: "Robert Chen",
      role: "Parent",
      initials: "RC",
      gradient: "from-purple-500 to-pink-400",
    },
    {
      quote:
        "Finally, a system that makes sense. No more carrying stacks of paper reports. Everything is digitized, secure, and always with me.",
      name: "Sarah Ahmed",
      role: "Frequent Traveler",
      initials: "SA",
      gradient: "from-emerald-500 to-teal-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Enhanced Header with Glass Effect */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent">
                  LifeChain AI
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Healthcare Ecosystem
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {["Home", "Features", "About", "Team", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-200"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-4">
              <button  onClick={() => navigate('/login')} className="cursor-pointer group relative px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
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
          <div className="lg:hidden bg-white/80 backdrop-blur-xl border-t border-gray-100 shadow-2xl">
            <div className="px-4 py-6 space-y-2">
              {["Home", "Features", "About", "Team", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="group flex items-center px-4 py-3 text-slate-700 font-semibold rounded-xl transition-all duration-300 relative overflow-hidden"
                >
                  {/* Hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Text */}
                  <span className="relative z-10 group-hover:text-primary-600 transition-colors">
                    {item}
                  </span>
                </a>
              ))}

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4"></div>

              {/* CTA Button */}
              <div className="pt-2 px-1">
                <button className="w-full group relative px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl overflow-hidden shadow-lg hover:shadow-primary-500/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Floating Elements */}
      <section
        id="home"
        className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden"
      >
        {/* Dynamic Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-primary-200/40 to-secondary-200/40 rounded-full blur-[100px] opacity-70 animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-gradient-to-l from-purple-200/30 to-blue-200/30 rounded-full blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-200/30 to-teal-200/30 rounded-full blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2.5 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-primary-100 shadow-sm"
              >
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
                </div>
                <span className="text-sm font-semibold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                  Revolutionizing Patient Care
                </span>
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Your Lifelong
                <span className="block mt-2 bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  Health Companion
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Unified medical records, AI-powered diagnostics, and genetic
                insights in one secure ecosystem. From birth to beyond,
                LifeChain AI travels with you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                <button className="group relative px-8 py-4 bg-slate-900 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 overflow-hidden ring-1 ring-slate-900">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                  <span className="relative flex items-center justify-center space-x-3">
                    <span>Start Your Journey</span>
                    <ChevronRight className="w-5 h-5" />
                  </span>
                </button>

                <button className="px-8 py-4 bg-white/50 backdrop-blur-sm text-slate-700 font-semibold rounded-2xl border border-white hover:border-primary-200 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 flex items-center justify-center space-x-3 group">
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 text-primary-600 fill-current" />
                  </div>
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm font-medium text-slate-500">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
                    >
                      <img
                        src={`https://picsum.photos/100/100?random=${i}`}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-50 flex items-center justify-center text-xs text-primary-700">
                    +2k
                  </div>
                </div>
                <p>Trusted by doctors & patients.</p>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:h-[600px] flex items-center justify-center"
            >
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-10 right-10 lg:right-0 z-20"
              >
                <div className="glass-card rounded-2xl p-4 shadow-xl shadow-primary-500/10 max-w-[200px]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-400 flex items-center justify-center shadow-md">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        AI Analysis
                      </h4>
                      <p className="text-xs text-slate-500">
                        Processing vitals...
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="w-[70%] h-full bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full"></div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [15, -15, 15] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-20 left-4 lg:-left-12 z-20"
              >
                <div className="glass-card rounded-2xl p-4 shadow-xl shadow-secondary-500/10 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500 to-primary-400 flex items-center justify-center shadow-lg">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">HIPAA Secure</h4>
                    <p className="text-xs text-green-600 font-semibold flex items-center mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                      Verified Protection
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Main Centerpiece */}
              <div className="relative w-full aspect-square max-w-[500px]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl transform rotate-12"></div>
                <div className="relative h-full w-full bg-white rounded-[3rem] shadow-2xl shadow-primary-900/10 border border-slate-100 overflow-hidden">
                  <div className="absolute top-0 w-full h-full bg-[url('https://picsum.photos/800/800?grayscale')] bg-cover opacity-5"></div>
                  <div className="relative h-full flex flex-col items-center justify-center p-8 text-center space-y-8">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center shadow-2xl shadow-primary-500/30 transform rotate-3 hover:rotate-6 transition-transform duration-500">
                      <Activity className="w-16 h-16 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">
                        LifeChain AI
                      </h2>
                      <p className="text-slate-500 mt-2 font-medium">
                        Universal Health Identity
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                      <span className="h-1.5 w-8 rounded-full bg-primary-500"></span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 px-3 py-1 bg-white rounded-full border border-slate-200 mb-6 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Capabilities
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
            >
              Unified Healthcare
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                Ecosystem Features
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600"
            >
              Connecting disparate medical data into one intelligent, secure,
              and accessible platform.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                className="group relative bg-white rounded-3xl p-8 hover:shadow-2xl hover:shadow-primary-900/5 border border-slate-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  {React.cloneElement(feature.icon, {
                    className: "w-32 h-32",
                  })}
                </div>

                <div
                  className={`relative w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-slate-500 leading-relaxed mb-6">
                  {feature.description}
                </p>

                <div className="flex items-center text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors cursor-pointer">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-slate-50 to-transparent -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary-500 to-secondary-400 rounded-[2.5rem] opacity-20 blur-2xl transform rotate-3"></div>
              <div className="relative bg-white rounded-[2rem] p-2 shadow-2xl border border-slate-100">
                <img
                  src="https://picsum.photos/800/600?medical"
                  alt="Medical Doctor using Tablet"
                  className="rounded-[1.8rem] w-full object-cover h-[400px]"
                />

                {/* Floating Stats */}
                <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-50 max-w-xs animate-float-delayed hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Database className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">
                        Data Points Processed
                      </p>
                      <h4 className="text-2xl font-bold text-slate-900">
                        1.2M+
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-50 text-primary-600 rounded-full mb-6">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Our Vision
                </span>
              </div>

              <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Redefining Healthcare <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                  Through Innovation
                </span>
              </h2>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                In today's fragmented healthcare landscape, critical medical
                information remains siloed. LifeChain AI bridges these gaps,
                creating a seamless, intelligent ecosystem.
              </p>

              <div className="space-y-4">
                {[
                  "Consolidated lifelong medical records",
                  "Real-time AI translation for global access",
                  "Hereditary risk identification",
                  "Predictive health monitoring insights",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-1 border-l-4 border-primary-500 rounded-full"></div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">
                      Supervised By
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      Dr. Shahbaz Siddiqui
                    </p>
                    <p className="text-sm text-slate-500">
                      Department of Computer Science
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Trusted by Patients
            </h2>
            <p className="text-lg text-slate-600">
              Real stories from people whose lives have been transformed by our
              unified ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col h-full"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>

                <blockquote className="flex-grow text-slate-700 leading-relaxed mb-8 italic">
                  "{t.quote}"
                </blockquote>

                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-50">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-lg shadow-md`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 text-primary-600 rounded-full mb-6">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  Get in Touch
                </span>
              </div>

              <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Let's Transform {" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                  Healthcare Together
                </span>
              </h2>

              <p className="text-lg text-slate-600 mb-12">
                Whether you're a healthcare provider, researcher, or patient,
                we're here to answer your questions.
              </p>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Visit Us
                    </h4>
                    <p className="text-slate-600">
                      FAST National University
                      <br />
                      Karachi, Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center text-secondary-600 flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Email Us
                    </h4>
                    <p className="text-slate-600">research@lifechainai.com</p>
                    <p className="text-slate-600">support@lifechainai.com</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-3xl p-8 lg:p-10 shadow-lg border border-slate-100"
            >
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2">
                  <span>Send Message</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Logo + Description */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">
                    LifeChain AI
                  </span>
                  <p className="text-xs text-slate-400">Healthcare Ecosystem</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Unifying global healthcare through intelligent, secure medical
                record management and predictive analytics.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {["Home", "Features", "About", "Team", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase()}`}
                        className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">
                Resources
              </h3>
              <ul className="space-y-3">
                {[
                  "Documentation",
                  "Privacy Policy",
                  "Terms of Service",
                  "FAQ",
                ].map((item) => (
                  <li key={item}>
                    <a className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 cursor-pointer">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">
                Stay Updated
              </h3>
              <p className="text-slate-400 leading-relaxed mb-4">
                Subscribe for project updates and healthcare insights.
              </p>
              <div className="flex group">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-l-xl border border-gray-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
                <button className="px-6 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-r-xl hover:shadow-lg transition-shadow duration-300">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} LifeChain AI. Final Year Project —
              FAST National University.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
