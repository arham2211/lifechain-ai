import React, { useEffect, useState, useMemo } from "react";
import { Layout } from "../../components/Layout";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import type { FamilyMember, CompleteFamilyTree } from "../../types";
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
  Search,
  Filter,
  Heart,
  Shield,
  Eye,
  EyeOff,
  Download,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp,
  Activity as HealthActivity,
  Thermometer,
  Dna,
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

const DISEASE_CATEGORIES = {

  Diabetes: {
    diseases: ["diabetes"],
    icon: Thermometer,
    color: "bg-orange-100 text-orange-800 border-orange-200",
    iconColor: "text-orange-600",
  },
  CKD: {
    diseases: ["chronic_kidney_disease"],
    icon: HealthActivity,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    iconColor: "text-blue-600",
  },
  anemia: {
    diseases: ["anemia", "iron_deficiency_anemia"],
    icon: Heart,
    color: "bg-pink-100 text-pink-800 border-pink-200",
    iconColor: "text-pink-600",
  }
};

// type ViewMode = "list" | "tree" | "cards";
type FilterType = "all" | "withDiseases" | "healthy" | "byRelationship";
type SortBy = "name" | "depth" | "diseaseCount";

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
  // const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortBy>("depth");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [selectedDiseaseCategory, setSelectedDiseaseCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchFamilyTree();
    console.log(user?.entity_id)
  }, [user]);

  const fetchFamilyTree = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!user?.entity_id) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(
        `http://0.0.0.0:8001/api/v1/patients/${user.entity_id}/family-disease-history?max_depth=10&lang=en`
      );

      if (!response.ok) {
        throw new Error("Failed to load family history");
      }

      const data: CompleteFamilyTree = await response.json();
      setFamilyTree(data);

      // Auto-expand the first few members
      if (data.family_tree && data.family_tree.length > 0) {
        const initialExpanded = new Set<string>();
        // Expand members with diseases by default
        data.family_tree
          .filter((member) => member.total_diseases > 0)
          .slice(0, 3)
          .forEach((member) => {
            initialExpanded.add(member.patient_id);
          });
        setExpandedMembers(initialExpanded);
        // Select the first member with diseases, or first member if none
        const firstMemberWithDisease =
          data.family_tree.find(
            (member) => member.total_diseases > 0
          ) || data.family_tree[0];
        setSelectedMember(firstMemberWithDisease);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load family history");
      console.error("Error fetching family history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort family members
  const filteredAndSortedMembers = useMemo(() => {
    if (!familyTree) return [];

    let members = [...familyTree.family_tree];

    // Apply search filter
    if (searchTerm) {
      members = members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.relationship_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.disease_names.some(disease =>
            disease.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply health status filter
    switch (filterType) {
      case "withDiseases":
        members = members.filter(m => m.total_diseases > 0);
        break;
      case "healthy":
        members = members.filter(m => m.total_diseases === 0);
        break;
      case "byRelationship":
        // Group by relationship type
        break;
    }

    // Apply disease category filter
    if (selectedDiseaseCategory && DISEASE_CATEGORIES[selectedDiseaseCategory as keyof typeof DISEASE_CATEGORIES]) {
      const category = DISEASE_CATEGORIES[selectedDiseaseCategory as keyof typeof DISEASE_CATEGORIES];
      members = members.filter(member =>
        member.disease_names.some(disease =>
          category.diseases.some(catDisease => disease.toLowerCase().includes(catDisease.toLowerCase()))
        )
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "name":
        members.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "depth":
        members.sort((a, b) => a.depth - b.depth);
        break;
      case "diseaseCount":
        members.sort((a, b) => b.total_diseases - a.total_diseases);
        break;
    }

    return members;
  }, [familyTree, searchTerm, filterType, sortBy, selectedDiseaseCategory]);

  // Calculate statistics
  const diseaseStats = useMemo((): Array<[string, number]> => {
    if (!familyTree) return [];  // ✅ return array, not {}

    const stats: Record<string, number> = {};

    familyTree.family_tree.forEach(member => {
      member.disease_names.forEach(disease => {
        const normalizedDisease = disease.toLowerCase().replace(/_/g, ' ');
        stats[normalizedDisease] = (stats[normalizedDisease] || 0) + 1;
      });
    });

    return Object.entries(stats); // ✅ converts object → array of [key, value]
  }, [familyTree]);

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
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "child":
        return "bg-green-100 text-green-800 border-green-200";
      case "sibling":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "spouse":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "grandparent":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "great-grandparent":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
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
    if (!dateOfBirth) return null;
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

  const getDiseaseCategory = (diseaseName: string) => {
    const normalizedDisease = diseaseName.toLowerCase();
    for (const [category, data] of Object.entries(DISEASE_CATEGORIES)) {
      if (data.diseases.some(d => normalizedDisease.includes(d))) {
        return category;
      }
    }
    return "other";
  };

  const exportFamilyTree = () => {
    if (!familyTree) return;

    const data = {
      exportedAt: new Date().toISOString(),
      patient: familyTree.patient_name,
      ...familyTree
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family-history-${familyTree.patient_name}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Family Medical History
            </h2>
            <p className="text-slate-600 mt-1">
              View your family tree and genetic risk assessment
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportFamilyTree}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              {showSensitiveInfo ? <EyeOff size={16} /> : <Eye size={16} />}
              {showSensitiveInfo ? "Hide Info" : "Show Info"}
            </button>
            <button
              onClick={fetchFamilyTree}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError("")} />}

        {familyTree && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow p-4 border border-blue-100">
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
              <div className="bg-gradient-to-br from-red-50 to-white rounded-lg shadow p-4 border border-red-100">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-slate-600">With Conditions</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {familyTree.relatives_with_diseases}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {((familyTree.relatives_with_diseases / familyTree.total_blood_relatives) * 100).toFixed(1)}% of family
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow p-4 border border-green-100">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Heart className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-slate-600">Healthy Relatives</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {familyTree.relatives_without_diseases}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {((familyTree.relatives_without_diseases / familyTree.total_blood_relatives) * 100).toFixed(1)}% of family
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg shadow p-4 border border-purple-100">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Dna className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-slate-600">Family Depth</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {familyTree.max_depth} generations
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Multi-generational view
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Disease Categories */}
            <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Filter size={20} />
                Disease Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedDiseaseCategory(null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedDiseaseCategory === null
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                >
                  All Categories
                </button>
                {Object.entries(DISEASE_CATEGORIES).map(([category, data]) => (
                  <button
                    key={category}
                    onClick={() => setSelectedDiseaseCategory(
                      selectedDiseaseCategory === category ? null : category
                    )}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all flex items-center gap-2 ${selectedDiseaseCategory === category
                      ? `${data.color} border-2`
                      : "border-transparent hover:border-slate-300"
                      }`}
                  >
                    <data.icon size={14} className={data.iconColor} />
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
              <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search by name, relationship, or condition..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as FilterType)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="all">All Members</option>
                    <option value="withDiseases">With Conditions</option>
                    <option value="healthy">Healthy</option>
                    <option value="byRelationship">By Relationship</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="depth">By Generation</option>
                    <option value="name">By Name</option>
                    <option value="diseaseCount">By Condition Count</option>
                  </select>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                      className="p-2 hover:bg-slate-100 rounded-lg"
                    >
                      <ZoomOut size={18} />
                    </button>
                    <span className="text-sm font-medium">{zoomLevel}%</span>
                    <button
                      onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                      className="p-2 hover:bg-slate-100 rounded-lg"
                    >
                      <ZoomIn size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Family Tree List */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Network className="text-slate-600" size={20} />
                      Family Tree ({filteredAndSortedMembers.length} members)
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">
                        Showing {filteredAndSortedMembers.length} of {familyTree.family_tree.length}
                      </span>
                      <button
                        onClick={() => {
                          const allExpanded = new Set(filteredAndSortedMembers.map(m => m.patient_id));
                          setExpandedMembers(allExpanded);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Expand All
                      </button>
                      <button
                        onClick={() => setExpandedMembers(new Set())}
                        className="text-sm text-slate-600 hover:text-slate-800"
                      >
                        Collapse All
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3" style={{ zoom: `${zoomLevel}%` }}>
                    {filteredAndSortedMembers.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                        <p className="text-slate-500">No family members match your search criteria</p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setFilterType("all");
                            setSelectedDiseaseCategory(null);
                          }}
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Clear filters
                        </button>
                      </div>
                    ) : (
                      filteredAndSortedMembers.map((member) => (
                        <div
                          key={member.patient_id}
                          className={`border rounded-lg transition-all duration-200 hover:shadow-md ${selectedMember?.patient_id === member.patient_id
                            ? "border-blue-300 bg-gradient-to-r from-blue-50 to-white ring-2 ring-blue-100"
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
                                <div className="relative">
                                  <div
                                    className={`p-2 rounded-lg border ${getRelationshipColor(
                                      member.relationship_type
                                    )}`}
                                  >
                                    <Users size={18} />
                                  </div>
                                  {member.total_diseases > 0 && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-bold text-white">
                                        {member.total_diseases}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-slate-900 truncate">
                                      {member.name}
                                    </h4>
                                    {member.depth === 0 && (
                                      <span className="px-1.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span
                                      className={`px-2 py-0.5 rounded text-xs font-medium border ${getRelationshipColor(
                                        member.relationship_type
                                      )}`}
                                    >
                                      {member.relationship_type
                                        .charAt(0)
                                        .toUpperCase() +
                                        member.relationship_type
                                          .slice(1)
                                          .replace(/_/g, " ")}
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
                                        {calculateAge(member.date_of_birth)} years
                                      </span>
                                    )}
                                    <span className="text-xs text-slate-500">
                                      Gen {member.depth + 1}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {member.total_diseases > 0 ? (
                                  <div className="flex flex-col items-end">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-100 to-orange-100 text-red-800">
                                      {member.total_diseases} condition{member.total_diseases > 1 ? "s" : ""}
                                    </span>
                                    <div className="flex gap-1 mt-1">
                                      {member.disease_names.slice(0, 2).map((disease, idx) => (
                                        <span
                                          key={idx}
                                          className="px-1.5 py-0.5 text-xs bg-slate-100 text-slate-700 rounded capitalize truncate max-w-[80px]"
                                          title={disease.replace(/_/g, " ")}
                                        >
                                          {disease.replace(/_/g, " ").substring(0, 10)}...
                                        </span>
                                      ))}
                                      {member.total_diseases > 2 && (
                                        <span className="px-1.5 py-0.5 text-xs bg-slate-200 text-slate-700 rounded">
                                          +{member.total_diseases - 2}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                                    <Heart size={12} className="inline mr-1" />
                                    Healthy
                                  </span>
                                )}
                                <ChevronRight
                                  className={`h-5 w-5 text-slate-400 transition-transform ${expandedMembers.has(member.patient_id)
                                    ? "rotate-90"
                                    : ""
                                    }`}
                                />
                              </div>
                            </div>
                          </div>

                          {expandedMembers.has(member.patient_id) &&
                            member.total_diseases > 0 && (
                              <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                                <h5 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                  <Stethoscope size={16} />
                                  Medical Conditions
                                </h5>
                                <div className="space-y-3">
                                  {member.diagnoses.map((diagnosis, idx) => {
                                    const category = getDiseaseCategory(diagnosis.disease_name);
                                    const categoryData = DISEASE_CATEGORIES[category as keyof typeof DISEASE_CATEGORIES] || {
                                      icon: AlertTriangle,
                                      color: "bg-slate-100 text-slate-800",
                                      iconColor: "text-slate-600"
                                    };
                                    const IconComponent = categoryData.icon;

                                    return (
                                      <div
                                        key={idx}
                                        className="bg-white border rounded-lg p-3 hover:border-slate-300 transition-colors"
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${categoryData.color}`}>
                                              <IconComponent size={18} className={categoryData.iconColor} />
                                            </div>
                                            <div>
                                              <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-900 capitalize">
                                                  {diagnosis.disease_name.replace(/_/g, " ")}
                                                </span>
                                                {diagnosis.progression_stage && (
                                                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded border border-blue-200">
                                                    {diagnosis.progression_stage}
                                                  </span>
                                                )}
                                              </div>
                                              <div className="mt-2 space-y-1">
                                                {/* {diagnosis.diagnosis_date && (
                                                  <p className="text-xs text-slate-600">
                                                    <Clock size={12} className="inline mr-1" />
                                                    Diagnosed: {formatDate(diagnosis.diagnosis_date)}
                                                  </p>
                                                )} */}
                                                {diagnosis.assessed_date && (
                                                  <p className="text-xs text-slate-600">
                                                    <Calendar size={12} className="inline mr-1" />
                                                    Last assessed: {formatDate(diagnosis.assessed_date)}
                                                  </p>
                                                )}
                                                {diagnosis.notes && (
                                                  <p className="text-xs text-slate-500">
                                                    <Info size={12} className="inline mr-1" />
                                                    {diagnosis.notes}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <div className="inline-flex flex-col items-end gap-1">
                                              <div className="flex items-center gap-1">
                                                <div className="w-24 bg-slate-200 rounded-full h-2">
                                                  <div
                                                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                                                    style={{
                                                      width: `${diagnosis.confidence_score * 100}%`,
                                                    }}
                                                  />
                                                </div>
                                                <span className="text-xs font-medium text-slate-700">
                                                  {formatConfidenceScore(diagnosis.confidence_score)}
                                                </span>
                                              </div>
                                              <span className="text-xs text-slate-500">
                                                AI confidence
                                              </span>
                                              {diagnosis.ml_model_used && (
                                                <span className="text-xs text-slate-400">
                                                  Model: {diagnosis.ml_model_used.replace(/_/g, " ")}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar with Details and Stats */}
              <div className="space-y-6">
                {/* Selected Member Details */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <User className="text-slate-600" size={20} />
                      Member Details
                    </h3>
                    {selectedMember && (
                      <button
                        onClick={() => toggleMemberExpansion(selectedMember.patient_id)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        {expandedMembers.has(selectedMember.patient_id) ? (
                          <>
                            <ChevronUp size={16} />
                            Collapse
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} />
                            Expand
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {selectedMember ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div
                          className={`p-3 rounded-lg border ${getRelationshipColor(
                            selectedMember.relationship_type
                          )}`}
                        >
                          <Users size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-slate-900">
                            {selectedMember.name}
                          </h4>
                          <p className="text-sm text-slate-600">
                            ID: {selectedMember.patient_id.substring(0, 8)}...
                          </p>
                        </div>
                        {selectedMember.total_diseases > 0 && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-600">
                              {selectedMember.total_diseases}
                            </div>
                            <div className="text-xs text-slate-500">Conditions</div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-slate-500">Relationship</p>
                          <p className="text-sm font-medium text-slate-900 capitalize">
                            {selectedMember.relationship_type.replace(/_/g, " ")}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-slate-500">Gender</p>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getGenderColor(
                              selectedMember.gender
                            )}`}
                          >
                            {selectedMember.gender}
                          </span>
                        </div>
                        {selectedMember.date_of_birth && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500">Age</p>
                            <p className="text-sm font-medium text-slate-900">
                              {calculateAge(selectedMember.date_of_birth)} years
                            </p>
                          </div>
                        )}
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-slate-500">Generation</p>
                          <p className="text-sm font-medium text-slate-900">
                            Level {selectedMember.depth + 1}
                          </p>
                        </div>
                      </div>

                      {showSensitiveInfo && selectedMember.cnic && (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-xs font-medium text-slate-500 mb-1">CNIC</p>
                          <p className="text-sm font-mono text-slate-900">
                            {selectedMember.cnic}
                          </p>
                        </div>
                      )}

                      {selectedMember.total_diseases > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-slate-700">Conditions</p>
                            <span className="text-xs text-slate-500">
                              {selectedMember.disease_names.length} total
                            </span>
                          </div>
                          <div className="space-y-2">
                            {selectedMember.disease_names.map((disease, idx) => {
                              const category = getDiseaseCategory(disease);
                              const categoryData = DISEASE_CATEGORIES[category as keyof typeof DISEASE_CATEGORIES] || {
                                color: "bg-slate-100"
                              };
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2 bg-white border rounded-lg"
                                >
                                  <span className="text-sm capitalize">
                                    {disease.replace(/_/g, " ")}
                                  </span>
                                  <span className={`px-2 py-0.5 text-xs rounded ${categoryData.color}`}>
                                    {category}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <User className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                      <p>Select a family member to view details</p>
                    </div>
                  )}
                </div>

                {/* Family Health Stats */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <PieChart className="text-slate-600" size={20} />
                    Health Statistics
                  </h3>

                  {/* Disease Distribution */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Common Conditions</h4>
                    <div className="space-y-2">
                      {diseaseStats.map(([disease, count]) => (
                        <div key={disease} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{disease}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                                style={{
                                  width: `${(count / familyTree.relatives_with_diseases) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium text-slate-700 w-8 text-right">
                              {count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-slate-700">Genetic Risk Insight</h4>
                      <Shield className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="text-blue-600 mt-0.5" size={16} />
                        <div>
                          <p className="text-sm text-blue-800">
                            <strong>Family History Alert:</strong>{" "}
                            {familyTree.relatives_with_diseases} out of{" "}
                            {familyTree.total_blood_relatives} relatives have medical conditions.
                          </p>
                          <p className="text-sm text-blue-700 mt-2">
                            <strong>Most Common:</strong>{" "}
                            {diseaseStats.slice(0, 2).map(([disease]) => disease).join(", ")}
                          </p>
                          <div className="mt-2 p-2 bg-white rounded border border-blue-100">
                            <p className="text-xs font-medium text-slate-900 mb-1">
                              Recommended Screenings:
                            </p>
                            <ul className="text-xs text-slate-600 space-y-1">
                              <li className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                Annual diabetes screening
                              </li>
                              <li className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                Regular blood pressure monitoring
                              </li>
                              <li className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                Kidney function tests
                              </li>
                            </ul>
                          </div>
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