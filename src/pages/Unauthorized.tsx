import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-6 rounded-full">
            <ShieldAlert className="text-red-600" size={64} />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-8">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

