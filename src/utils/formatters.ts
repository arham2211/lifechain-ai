// Date formatting utilities
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateISO = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Number formatting utilities
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

export const formatConfidenceScore = (score: number): string => {
  return `${(score * 100).toFixed(0)}%`;
};

// Text utilities
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// UUID validation
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// CNIC validation (Pakistani National ID)
export const isValidCNIC = (cnic: string): boolean => {
  const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
  return cnicRegex.test(cnic);
};

// Phone validation
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Risk level utilities
export const getRiskLevelColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case 'low':
      return 'text-green-600 bg-green-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'high':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Status utilities
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'resolved':
    case 'active':
      return 'text-green-600 bg-green-100';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'chronic':
      return 'text-orange-600 bg-orange-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

