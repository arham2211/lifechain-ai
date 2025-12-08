// import React, { useEffect, useState } from 'react';
// import { Layout } from '../../components/Layout';
// import { ErrorMessage } from '../../components/common/ErrorMessage';
// import { LoadingSpinner } from '../../components/common/LoadingSpinner';
// import { useAuth } from '../../contexts/AuthContext';
// import { Activity, FileText, Calendar, TrendingUp, Users, Heart, AlertTriangle, Network, PieChart, User, Stethoscope, ChevronRight, Clock, Layers } from 'lucide-react';
// import { formatDate } from '../../utils/formatters';

// const patientNavItems = [
//   { path: '/patient/dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
//   { path: '/patient/lab-reports', label: 'Lab Reports', icon: <FileText size={20} /> },
//   { path: '/patient/visits', label: 'Visit History', icon: <Calendar size={20} /> },
//   { path: '/patient/timeline', label: 'Disease Timeline', icon: <TrendingUp size={20} /> },
//   { path: '/patient/family-history', label: 'Family History', icon: <Users size={20} /> },
//   { path: '/patient/predictions', label: 'Health Predictions', icon: <TrendingUp size={20} /> },
//   { path: '/patient/recommendations', label: 'AI Recommendations', icon: <Heart size={20} /> },
// ];

// interface FamilyMemberDiagnosis {
//   disease_name: string;
//   diagnosis_date: string;
//   confidence_score: number;
//   ml_model_used: string;
//   status: string;
//   notes: string | null;
//   diagnosed_at: string;
//   source: string;
// }

// interface FamilyMember {
//   patient_id: string;
//   name: string;
//   cnic: string;
//   date_of_birth: string;
//   gender: string;
//   relationship_path: string[];
//   relationship_to_searched_patient: string;
//   depth: number;
//   relationship_type: string;
//   total_diseases: number;
//   disease_names: string[];
//   diagnoses: FamilyMemberDiagnosis[];
// }

// interface CompleteFamilyTree {
//   patient_id: string;
//   patient_name: string;
//   total_blood_relatives: number;
//   max_depth: number;
//   relatives_with_diseases: number;
//   relatives_without_diseases: number;
//   family_tree: FamilyMember[];
// }

// export const PatientFamilyHistory: React.FC = () => {
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [familyTree, setFamilyTree] = useState<CompleteFamilyTree | null>(null);
//   const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());
//   const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

//   useEffect(() => {
//     fetchFamilyTree();
//   }, [user]);

//   const fetchFamilyTree = async () => {
//     try {
//       setIsLoading(true);
//       setError('');

//       if (!user?.entity_id) {
//         throw new Error('User not authenticated');
//       }

//       const response = await fetch(
//         `http://localhost:8001/api/v1/patients/00f49e86-3d79-4cc0-af69-17b8a047df37/family-disease-history?max_depth=10&lang=en`,
//         {
//           method: "GET",
//           headers: {
//             accept: "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch family history');
//       }

//       const data: CompleteFamilyTree = await response.json();
//       setFamilyTree(data);

//       // Auto-expand the first few members
//       if (data.family_tree.length > 0) {
//         const initialExpanded = new Set<string>();
//         data.family_tree.slice(0, 3).forEach(member => {
//           initialExpanded.add(member.patient_id);
//         });
//         setExpandedMembers(initialExpanded);
//         setSelectedMember(data.family_tree[0]);
//       }
//     } catch (err: any) {
//       setError(err.message || 'Failed to load family history');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleMemberExpansion = (memberId: string) => {
//     const newExpanded = new Set(expandedMembers);
//     if (newExpanded.has(memberId)) {
//       newExpanded.delete(memberId);
//     } else {
//       newExpanded.add(memberId);
//     }
//     setExpandedMembers(newExpanded);
//   };

//   const getRelationshipColor = (relationshipType: string) => {
//     switch (relationshipType.toLowerCase()) {
//       case 'parent': return 'bg-blue-100 text-blue-800';
//       case 'child': return 'bg-green-100 text-green-800';
//       case 'sibling': return 'bg-purple-100 text-purple-800';
//       case 'spouse': return 'bg-pink-100 text-pink-800';
//       case 'grandparent': return 'bg-indigo-100 text-indigo-800';
//       case 'grandchild': return 'bg-teal-100 text-teal-800';
//       default: return 'bg-slate-100 text-slate-800';
//     }
//   };

//   const getGenderColor = (gender: string) => {
//     return gender.toLowerCase() === 'male'
//       ? 'bg-blue-50 text-blue-700 border border-blue-200'
//       : 'bg-pink-50 text-pink-700 border border-pink-200';
//   };

//   const getDepthStyle = (depth: number) => {
//     const baseMargin = 4;
//     const margin = depth * baseMargin;
//     return {
//       marginLeft: `${margin}px`,
//       borderLeft: depth > 0 ? '2px solid #e5e7eb' : 'none',
//       paddingLeft: depth > 0 ? '1rem' : '0',
//     };
//   };

//   const calculateAge = (dateOfBirth: string) => {
//     const birthDate = new Date(dateOfBirth);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
//     return age;
//   };

//   const formatConfidenceScore = (score: number) => {
//     return `${(score * 100).toFixed(1)}%`;
//   };

//   if (isLoading) {
//     return (
//       <Layout navItems={patientNavItems} title="Patient Portal">
//         <LoadingSpinner fullScreen />
//       </Layout>
//     );
//   }

//   return (
//     <Layout navItems={patientNavItems} title="Patient Portal">
//       <div className="space-y-6">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-900">Family Medical History</h2>
//           <p className="text-slate-600 mt-1">View your family tree and genetic risk assessment</p>
//         </div>

//         {error && <ErrorMessage message={error} onClose={() => setError('')} />}

//         {familyTree && (
//           <>
//             {/* Summary Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
//                 <div className="flex items-center">
//                   <div className="p-2 bg-blue-100 rounded-lg">
//                     <Users className="h-5 w-5 text-blue-600" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-slate-600">Total Relatives</p>
//                     <p className="text-2xl font-bold text-slate-900">{familyTree.total_blood_relatives}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
//                 <div className="flex items-center">
//                   <div className="p-2 bg-green-100 rounded-lg">
//                     <AlertTriangle className="h-5 w-5 text-green-600" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-slate-600">With Diseases</p>
//                     <p className="text-2xl font-bold text-slate-900">{familyTree.relatives_with_diseases}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
//                 <div className="flex items-center">
//                   <div className="p-2 bg-slate-100 rounded-lg">
//                     <Stethoscope className="h-5 w-5 text-slate-600" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-slate-600">Healthy Relatives</p>
//                     <p className="text-2xl font-bold text-slate-900">{familyTree.relatives_without_diseases}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
//                 <div className="flex items-center">
//                   <div className="p-2 bg-purple-100 rounded-lg">
//                     <Layers className="h-5 w-5 text-purple-600" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-slate-600">Family Depth</p>
//                     <p className="text-2xl font-bold text-slate-900">{familyTree.max_depth} levels</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Family Tree List */}
//               <div className="lg:col-span-2">
//                 <div className="bg-white rounded-lg shadow p-6">
//                   <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
//                     <Network className="text-slate-600" size={20} />
//                     Family Tree
//                   </h3>
//                   <div className="space-y-3">
//                     {familyTree.family_tree.map((member) => (
//                       <div
//                         key={member.patient_id}
//                         className={`border rounded-lg transition-all duration-200 ${
//                           selectedMember?.patient_id === member.patient_id
//                             ? 'border-blue-300 bg-blue-50'
//                             : 'border-gray-200 hover:bg-slate-50'
//                         }`}
//                         style={getDepthStyle(member.depth)}
//                       >
//                         <div
//                           className="p-4 cursor-pointer"
//                           onClick={() => {
//                             setSelectedMember(member);
//                             toggleMemberExpansion(member.patient_id);
//                           }}
//                         >
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-3">
//                               <div className={`p-2 rounded-lg ${getRelationshipColor(member.relationship_type)}`}>
//                                 <Users size={16} />
//                               </div>
//                               <div>
//                                 <h4 className="font-medium text-slate-900">{member.name}</h4>
//                                 <div className="flex items-center gap-2 mt-1">
//                                   <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRelationshipColor(member.relationship_type)}`}>
//                                     {member.relationship_type}
//                                   </span>
//                                   <span className={`px-2 py-0.5 rounded text-xs font-medium ${getGenderColor(member.gender)}`}>
//                                     {member.gender}
//                                   </span>
//                                   {member.date_of_birth && (
//                                     <span className="text-xs text-slate-600 flex items-center gap-1">
//                                       <Clock size={12} />
//                                       Age: {calculateAge(member.date_of_birth)}
//                                     </span>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               {member.total_diseases > 0 ? (
//                                 <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                   {member.total_diseases} disease{member.total_diseases > 1 ? 's' : ''}
//                                 </span>
//                               ) : (
//                                 <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                   Healthy
//                                 </span>
//                               )}
//                               <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${
//                                 expandedMembers.has(member.patient_id) ? 'rotate-90' : ''
//                               }`} />
//                             </div>
//                           </div>
//                         </div>

//                         {expandedMembers.has(member.patient_id) && member.total_diseases > 0 && (
//                           <div className="px-4 pb-4 border-t border-gray-200">
//                             <div className="mt-3">
//                               <h5 className="text-sm font-medium text-slate-700 mb-2">Diagnosed Conditions:</h5>
//                               <div className="space-y-2">
//                                 {member.diagnoses.map((diagnosis, idx) => (
//                                   <div key={idx} className="bg-slate-50 rounded p-3">
//                                     <div className="flex justify-between items-start">
//                                       <div>
//                                         <span className="font-medium text-slate-900 capitalize">
//                                           {diagnosis.disease_name}
//                                         </span>
//                                         {diagnosis.diagnosis_date && (
//                                           <p className="text-xs text-slate-600 mt-1">
//                                             Diagnosed: {formatDate(diagnosis.diagnosis_date)}
//                                           </p>
//                                         )}
//                                       </div>
//                                       <div className="text-right">
//                                         <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                           Confidence: {formatConfidenceScore(diagnosis.confidence_score)}
//                                         </span>
//                                         <p className="text-xs text-slate-600 mt-1 capitalize">
//                                           Status: {diagnosis.status}
//                                         </p>
//                                       </div>
//                                     </div>
//                                     {diagnosis.ml_model_used && (
//                                       <p className="text-xs text-slate-500 mt-2">
//                                         AI Model: {diagnosis.ml_model_used}
//                                       </p>
//                                     )}
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Selected Member Details & Stats */}
//               <div className="space-y-6">
//                 <div className="bg-white rounded-lg shadow p-6">
//                   <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
//                     <User className="text-slate-600" size={20} />
//                     Member Details
//                   </h3>
//                   {selectedMember ? (
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-3">
//                         <div className={`p-3 rounded-lg ${getRelationshipColor(selectedMember.relationship_type)}`}>
//                           <Users size={20} />
//                         </div>
//                         <div>
//                           <h4 className="font-bold text-lg text-slate-900">{selectedMember.name}</h4>
//                           <p className="text-sm text-slate-600">ID: {selectedMember.patient_id}</p>
//                         </div>
//                       </div>

//                       <div className="space-y-3">
//                         <div>
//                           <p className="text-sm font-medium text-slate-700">Relationship</p>
//                           <p className="text-sm text-slate-900 capitalize">{selectedMember.relationship_type}</p>
//                         </div>

//                         <div>
//                           <p className="text-sm font-medium text-slate-700">Gender</p>
//                           <span className={`px-2 py-1 rounded text-xs font-medium ${getGenderColor(selectedMember.gender)}`}>
//                             {selectedMember.gender}
//                           </span>
//                         </div>

//                         {selectedMember.date_of_birth && (
//                           <div>
//                             <p className="text-sm font-medium text-slate-700">Date of Birth</p>
//                             <p className="text-sm text-slate-900">
//                               {formatDate(selectedMember.date_of_birth)}
//                               <span className="ml-2 text-blue-600">
//                                 ({calculateAge(selectedMember.date_of_birth)} years)
//                               </span>
//                             </p>
//                           </div>
//                         )}

//                         {selectedMember.cnic && (
//                           <div>
//                             <p className="text-sm font-medium text-slate-700">CNIC</p>
//                             <p className="text-sm text-slate-900 font-mono">{selectedMember.cnic}</p>
//                           </div>
//                         )}

//                         <div>
//                           <p className="text-sm font-medium text-slate-700">Family Depth</p>
//                           <p className="text-sm text-slate-900">Level {selectedMember.depth}</p>
//                         </div>

//                         <div>
//                           <p className="text-sm font-medium text-slate-700">Health Status</p>
//                           {selectedMember.total_diseases > 0 ? (
//                             <div>
//                               <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                 {selectedMember.total_diseases} condition{selectedMember.total_diseases > 1 ? 's' : ''}
//                               </span>
//                               <div className="mt-2 space-y-1">
//                                 {selectedMember.disease_names.map((disease, idx) => (
//                                   <div key={idx} className="flex items-center">
//                                     <AlertTriangle className="h-3 w-3 text-red-500 mr-2" />
//                                     <span className="text-sm text-slate-900 capitalize">{disease}</span>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           ) : (
//                             <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                               No diagnosed conditions
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-center py-8 text-slate-500">
//                       <User className="mx-auto h-12 w-12 text-slate-300 mb-3" />
//                       <p>Select a family member to view details</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Family Health Overview */}
//                 {familyTree.relatives_with_diseases > 0 && (
//                   <div className="bg-white rounded-lg shadow p-6">
//                     <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
//                       <PieChart className="text-slate-600" size={20} />
//                       Family Health Overview
//                     </h3>
//                     <div className="space-y-4">
//                       <div>
//                         <div className="flex justify-between text-sm mb-1">
//                           <span className="text-slate-700">With Diseases:</span>
//                           <span className="font-medium text-red-600">
//                             {familyTree.relatives_with_diseases} ({Math.round((familyTree.relatives_with_diseases / familyTree.total_blood_relatives) * 100)}%)
//                           </span>
//                         </div>
//                         <div className="w-full bg-slate-200 rounded-full h-2">
//                           <div
//                             className="bg-red-600 h-2 rounded-full"
//                             style={{ width: `${(familyTree.relatives_with_diseases / familyTree.total_blood_relatives) * 100}%` }}
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <div className="flex justify-between text-sm mb-1">
//                           <span className="text-slate-700">Healthy Relatives:</span>
//                           <span className="font-medium text-green-600">
//                             {familyTree.relatives_without_diseases} ({Math.round((familyTree.relatives_without_diseases / familyTree.total_blood_relatives) * 100)}%)
//                           </span>
//                         </div>
//                         <div className="w-full bg-slate-200 rounded-full h-2">
//                           <div
//                             className="bg-green-600 h-2 rounded-full"
//                             style={{ width: `${(familyTree.relatives_without_diseases / familyTree.total_blood_relatives) * 100}%` }}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Genetic Risk Assessment */}
//                     {familyTree.relatives_with_diseases > 0 && (
//                       <div className="mt-6 pt-6 border-t border-gray-200">
//                         <h4 className="font-medium text-slate-900 mb-3">Genetic Risk Insight</h4>
//                         <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                           <div className="flex items-start gap-2">
//                             <AlertTriangle className="text-yellow-600 mt-0.5" size={16} />
//                             <p className="text-sm text-yellow-800">
//                               {familyTree.relatives_with_diseases} out of {familyTree.total_blood_relatives} blood relatives have medical conditions.
//                               Regular screening is recommended for early detection.
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </Layout>
//   );
// };

import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import {
  Activity,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  AlertTriangle,
  Network,
  PieChart,
  User,
  Stethoscope,
  ChevronRight,
  Clock,
  Layers,
} from "lucide-react";
import { formatDate } from "../../utils/formatters";

const patientNavItems = [
  {
    path: "/patient/dashboard",
    label: "Dashboard",
    icon: <Activity size={20} />,
  },
  {
    path: "/patient/lab-reports",
    label: "Lab Reports",
    icon: <FileText size={20} />,
  },
  {
    path: "/patient/visits",
    label: "Visit History",
    icon: <Calendar size={20} />,
  },
  {
    path: "/patient/timeline",
    label: "Disease Timeline",
    icon: <TrendingUp size={20} />,
  },
  {
    path: "/patient/family-history",
    label: "Family History",
    icon: <Users size={20} />,
  },
];

interface FamilyMemberDiagnosis {
  disease_name: string;
  diagnosis_date: string;
  confidence_score: number;
  ml_model_used: string;
  status: string;
  notes: string | null;
  diagnosed_at: string;
  source: string;
}

interface FamilyMember {
  patient_id: string;
  name: string;
  cnic: string;
  date_of_birth: string;
  gender: string;
  relationship_path: string[];
  relationship_to_searched_patient: string;
  depth: number;
  relationship_type: string;
  total_diseases: number;
  disease_names: string[];
  diagnoses: FamilyMemberDiagnosis[];
}

interface CompleteFamilyTree {
  patient_id: string;
  patient_name: string;
  total_blood_relatives: number;
  max_depth: number;
  relatives_with_diseases: number;
  relatives_without_diseases: number;
  family_tree: FamilyMember[];
}

// Dummy data with 2 relatives with diseases and depth of 3
const dummyFamilyData: CompleteFamilyTree = {
  patient_id: "00f49e86-3d79-4cc0-af69-17b8a047df37",
  patient_name: "Mudassir Huzaifa",
  total_blood_relatives: 6,
  max_depth: 3,
  relatives_with_diseases: 2,
  relatives_without_diseases: 4,
  family_tree: [
    {
      patient_id: "45daab9f-8d48-47ce-bf0c-71cbbbc61142",
      name: "Muneeb Mustafa",
      cnic: "42101-4195480-7",
      date_of_birth: "1950-12-01",
      gender: "male",
      relationship_path: ["parent"],
      relationship_to_searched_patient: "parent",
      depth: 1,
      relationship_type: "parent",
      total_diseases: 1,
      disease_names: ["diabetes"],
      diagnoses: [
        {
          disease_name: "diabetes",
          diagnosis_date: "2025-08-08T22:59:53",
          confidence_score: 0.7445482681400702,
          ml_model_used: "xgb_diabetes_v1",
          status: "confirmed",
          notes: "Type 2 diabetes diagnosed with high blood sugar levels",
          diagnosed_at: "2025-08-08T22:59:53",
          source: "diagnosis",
        },
      ],
    },
    {
      patient_id: "78e1b9c3-2a45-4d89-b6f1-9c3b7a8d4e5f",
      name: "Fatima Ahmed",
      cnic: "42101-5192378-9",
      date_of_birth: "1952-05-15",
      gender: "female",
      relationship_path: ["parent"],
      relationship_to_searched_patient: "parent",
      depth: 1,
      relationship_type: "parent",
      total_diseases: 0,
      disease_names: [],
      diagnoses: [],
    },
    {
      patient_id: "92c3a7d1-5b68-4f29-a3e7-8c1b2d9e4f6a",
      name: "Abdul Rahman",
      cnic: "42101-3194852-3",
      date_of_birth: "1945-03-22",
      gender: "male",
      relationship_path: ["parent", "parent"],
      relationship_to_searched_patient: "grandparent",
      depth: 2,
      relationship_type: "grandparent",
      total_diseases: 1,
      disease_names: ["hypertension", "heart_disease"],
      diagnoses: [
        {
          disease_name: "hypertension",
          diagnosis_date: "2020-06-15T10:30:00",
          confidence_score: 0.9123456789,
          ml_model_used: "hypertension_model_v2",
          status: "confirmed",
          notes: "Stage 2 hypertension with consistent high readings",
          diagnosed_at: "2020-06-15T10:30:00",
          source: "diagnosis",
        },
        {
          disease_name: "heart_disease",
          diagnosis_date: "2021-11-20T14:45:00",
          confidence_score: 0.856743219,
          ml_model_used: "cardio_model_v3",
          status: "confirmed",
          notes: "Coronary artery disease detected",
          diagnosed_at: "2021-11-20T14:45:00",
          source: "diagnosis",
        },
      ],
    },
    {
      patient_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      name: "Aisha Khan",
      cnic: "42101-2193784-5",
      date_of_birth: "1948-07-30",
      gender: "female",
      relationship_path: ["parent", "parent"],
      relationship_to_searched_patient: "grandparent",
      depth: 2,
      relationship_type: "grandparent",
      total_diseases: 0,
      disease_names: [],
      diagnoses: [],
    },
    {
      patient_id: "b2c3d4e5-f6a7-8901-bcde-f23456789012",
      name: "Ahmed Ali",
      cnic: "42101-6198432-7",
      date_of_birth: "1975-09-12",
      gender: "male",
      relationship_path: ["sibling"],
      relationship_to_searched_patient: "sibling",
      depth: 1,
      relationship_type: "sibling",
      total_diseases: 0,
      disease_names: [],
      diagnoses: [],
    },
    {
      patient_id: "c3d4e5f6-a7b8-9012-cdef-345678901234",
      name: "Sara Ahmed",
      cnic: "42101-7193265-1",
      date_of_birth: "1980-11-25",
      gender: "female",
      relationship_path: ["sibling"],
      relationship_to_searched_patient: "sibling",
      depth: 1,
      relationship_type: "sibling",
      total_diseases: 0,
      disease_names: [],
      diagnoses: [],
    },
    {
      patient_id: "d4e5f6a7-b8c9-0123-defg-456789012345",
      name: "Zainab Mustafa",
      cnic: "42101-8194753-9",
      date_of_birth: "2005-02-14",
      gender: "female",
      relationship_path: ["child"],
      relationship_to_searched_patient: "child",
      depth: 1,
      relationship_type: "child",
      total_diseases: 0,
      disease_names: [],
      diagnoses: [],
    },
    {
      patient_id: "e5f6a7b8-c9d0-1234-efgh-567890123456",
      name: "Omar Khan",
      cnic: "42101-9193268-3",
      date_of_birth: "1920-04-05",
      gender: "male",
      relationship_path: ["parent", "parent", "parent"],
      relationship_to_searched_patient: "great-grandparent",
      depth: 3,
      relationship_type: "great-grandparent",
      total_diseases: 0,
      disease_names: [],
      diagnoses: [],
    },
  ],
};

export const PatientFamilyHistory: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [familyTree, setFamilyTree] = useState<CompleteFamilyTree | null>(null);
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(
    new Set()
  );
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(
    null
  );

  useEffect(() => {
    fetchFamilyTree();
  }, [user]);

  const fetchFamilyTree = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!user?.entity_id) {
        throw new Error("User not authenticated");
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Use dummy data instead of API call for now
      setFamilyTree(dummyFamilyData);

      // Auto-expand the first few members
      if (dummyFamilyData.family_tree.length > 0) {
        const initialExpanded = new Set<string>();
        // Expand members with diseases by default
        dummyFamilyData.family_tree
          .filter((member) => member.total_diseases > 0)
          .slice(0, 2)
          .forEach((member) => {
            initialExpanded.add(member.patient_id);
          });
        setExpandedMembers(initialExpanded);
        // Select the first member with diseases, or first member if none
        const firstMemberWithDisease =
          dummyFamilyData.family_tree.find(
            (member) => member.total_diseases > 0
          ) || dummyFamilyData.family_tree[0];
        setSelectedMember(firstMemberWithDisease);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load family history");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMemberExpansion = (memberId: string) => {
    const newExpanded = new Set(expandedMembers);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedMembers(newExpanded);
  };

  const getRelationshipColor = (relationshipType: string) => {
    switch (relationshipType.toLowerCase()) {
      case "parent":
        return "bg-blue-100 text-blue-800";
      case "child":
        return "bg-green-100 text-green-800";
      case "sibling":
        return "bg-purple-100 text-purple-800";
      case "spouse":
        return "bg-pink-100 text-pink-800";
      case "grandparent":
        return "bg-indigo-100 text-indigo-800";
      case "great-grandparent":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getGenderColor = (gender: string) => {
    return gender.toLowerCase() === "male"
      ? "bg-blue-50 text-blue-700 border border-blue-200"
      : "bg-pink-50 text-pink-700 border border-pink-200";
  };

  const getDepthStyle = (depth: number) => {
    const baseMargin = 20;
    const margin = depth * baseMargin;
    return {
      marginLeft: `${margin}px`,
      borderLeft: depth > 0 ? "2px solid #e5e7eb" : "none",
      paddingLeft: depth > 0 ? "1rem" : "0",
    };
  };

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatConfidenceScore = (score: number) => {
    return `${(score * 100).toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <Layout navItems={patientNavItems} title="Patient Portal">
        <LoadingSpinner fullScreen />
      </Layout>
    );
  }

  return (
    <Layout navItems={patientNavItems} title="Patient Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Family Medical History
          </h2>
          <p className="text-slate-600 mt-1">
            View your family tree and genetic risk assessment
          </p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError("")} />}

        {familyTree && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-slate-600">Total Relatives</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {familyTree.total_blood_relatives}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-slate-600">With Diseases</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {familyTree.relatives_with_diseases}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Stethoscope className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-slate-600">Healthy Relatives</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {familyTree.relatives_without_diseases}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Layers className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-slate-600">Family Depth</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {familyTree.max_depth} levels
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Family Tree List */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Network className="text-slate-600" size={20} />
                      Family Tree (Depth: {familyTree.max_depth})
                    </h3>
                    <div className="text-sm text-slate-500">
                      {familyTree.family_tree.length} members
                    </div>
                  </div>
                  <div className="space-y-3">
                    {familyTree.family_tree.map((member) => (
                      <div
                        key={member.patient_id}
                        className={`border rounded-lg transition-all duration-200 ${
                          selectedMember?.patient_id === member.patient_id
                            ? "border-blue-300 bg-blue-50"
                            : "border-gray-200 hover:bg-slate-50"
                        }`}
                        style={getDepthStyle(member.depth)}
                      >
                        <div
                          className="p-4 cursor-pointer"
                          onClick={() => {
                            setSelectedMember(member);
                            toggleMemberExpansion(member.patient_id);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-lg ${getRelationshipColor(
                                  member.relationship_type
                                )}`}
                              >
                                <Users size={16} />
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-900">
                                  {member.name}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs font-medium ${getRelationshipColor(
                                      member.relationship_type
                                    )}`}
                                  >
                                    {member.relationship_type
                                      .charAt(0)
                                      .toUpperCase() +
                                      member.relationship_type
                                        .slice(1)
                                        .replace("-", " ")}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs font-medium ${getGenderColor(
                                      member.gender
                                    )}`}
                                  >
                                    {member.gender}
                                  </span>
                                  {member.date_of_birth && (
                                    <span className="text-xs text-slate-600 flex items-center gap-1">
                                      <Clock size={12} />
                                      Age: {calculateAge(member.date_of_birth)}
                                    </span>
                                  )}
                                  <span className="text-xs text-slate-500">
                                    Depth: {member.depth}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {member.total_diseases > 0 ? (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  {member.total_diseases} disease
                                  {member.total_diseases > 1 ? "s" : ""}
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Healthy
                                </span>
                              )}
                              <ChevronRight
                                className={`h-4 w-4 text-slate-400 transition-transform ${
                                  expandedMembers.has(member.patient_id)
                                    ? "rotate-90"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>
                        </div>

                        {expandedMembers.has(member.patient_id) &&
                          member.total_diseases > 0 && (
                            <div className="px-4 pb-4 border-t border-gray-200">
                              <div className="mt-3">
                                <h5 className="text-sm font-medium text-slate-700 mb-2">
                                  Diagnosed Conditions:
                                </h5>
                                <div className="space-y-2">
                                  {member.diagnoses.map((diagnosis, idx) => (
                                    <div
                                      key={idx}
                                      className="bg-slate-50 rounded p-3"
                                    >
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <span className="font-medium text-slate-900 capitalize">
                                            {diagnosis.disease_name.replace(
                                              "_",
                                              " "
                                            )}
                                          </span>
                                          {diagnosis.diagnosis_date && (
                                            <p className="text-xs text-slate-600 mt-1">
                                              Diagnosed:{" "}
                                              {formatDate(
                                                diagnosis.diagnosis_date
                                              )}
                                            </p>
                                          )}
                                          {diagnosis.notes && (
                                            <p className="text-xs text-slate-500 mt-1">
                                              {diagnosis.notes}
                                            </p>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Confidence:{" "}
                                            {formatConfidenceScore(
                                              diagnosis.confidence_score
                                            )}
                                          </span>
                                          <p className="text-xs text-slate-600 mt-1 capitalize">
                                            Status: {diagnosis.status}
                                          </p>
                                        </div>
                                      </div>
                                      {diagnosis.ml_model_used && (
                                        <p className="text-xs text-slate-500 mt-2">
                                          AI Model: {diagnosis.ml_model_used}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Member Details & Stats */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="text-slate-600" size={20} />
                    Member Details
                  </h3>
                  {selectedMember ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-3 rounded-lg ${getRelationshipColor(
                            selectedMember.relationship_type
                          )}`}
                        >
                          <Users size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-slate-900">
                            {selectedMember.name}
                          </h4>
                          <p className="text-sm text-slate-600">
                            ID: {selectedMember.patient_id}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Relationship
                          </p>
                          <p className="text-sm text-slate-900 capitalize">
                            {selectedMember.relationship_type
                              .charAt(0)
                              .toUpperCase() +
                              selectedMember.relationship_type
                                .slice(1)
                                .replace("-", " ")}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Gender
                          </p>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getGenderColor(
                              selectedMember.gender
                            )}`}
                          >
                            {selectedMember.gender}
                          </span>
                        </div>

                        {selectedMember.date_of_birth && (
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              Date of Birth
                            </p>
                            <p className="text-sm text-slate-900">
                              {formatDate(selectedMember.date_of_birth)}
                              <span className="ml-2 text-blue-600">
                                ({calculateAge(selectedMember.date_of_birth)}{" "}
                                years)
                              </span>
                            </p>
                          </div>
                        )}

                        {selectedMember.cnic && (
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              CNIC
                            </p>
                            <p className="text-sm text-slate-900 font-mono">
                              {selectedMember.cnic}
                            </p>
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Family Depth
                          </p>
                          <p className="text-sm text-slate-900">
                            Level {selectedMember.depth}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Health Status
                          </p>
                          {selectedMember.total_diseases > 0 ? (
                            <div>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {selectedMember.total_diseases} condition
                                {selectedMember.total_diseases > 1 ? "s" : ""}
                              </span>
                              <div className="mt-2 space-y-1">
                                {selectedMember.disease_names.map(
                                  (disease, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center"
                                    >
                                      <AlertTriangle className="h-3 w-3 text-red-500 mr-2" />
                                      <span className="text-sm text-slate-900 capitalize">
                                        {disease.replace("_", " ")}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              No diagnosed conditions
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <User className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                      <p>Select a family member to view details</p>
                    </div>
                  )}
                </div>

                {/* Family Health Overview */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <PieChart className="text-slate-600" size={20} />
                    Family Health Overview
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700">With Diseases:</span>
                        <span className="font-medium text-red-600">
                          {familyTree.relatives_with_diseases} (
                          {Math.round(
                            (familyTree.relatives_with_diseases /
                              familyTree.total_blood_relatives) *
                              100
                          )}
                          %)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (familyTree.relatives_with_diseases /
                                familyTree.total_blood_relatives) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700">
                          Healthy Relatives:
                        </span>
                        <span className="font-medium text-green-600">
                          {familyTree.relatives_without_diseases} (
                          {Math.round(
                            (familyTree.relatives_without_diseases /
                              familyTree.total_blood_relatives) *
                              100
                          )}
                          %)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (familyTree.relatives_without_diseases /
                                familyTree.total_blood_relatives) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Genetic Risk Assessment */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-slate-900 mb-3">
                      Genetic Risk Insight
                    </h4>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          className="text-yellow-600 mt-0.5"
                          size={16}
                        />
                        <div>
                          <p className="text-sm text-yellow-800">
                            <strong>Family History Alert:</strong>{" "}
                            {familyTree.relatives_with_diseases} out of{" "}
                            {familyTree.total_blood_relatives}
                            blood relatives have medical conditions.
                          </p>
                          <p className="text-sm text-yellow-700 mt-1">
                            <strong>Conditions Detected:</strong> Diabetes
                            (parent), Hypertension & Heart Disease (grandparent)
                          </p>
                          <p className="text-sm text-yellow-600 mt-2">
                            <strong>Recommendation:</strong> Regular screening
                            for diabetes and cardiovascular health is
                            recommended for early detection.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};
