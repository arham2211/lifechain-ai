import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="backdrop-blur-lg bg-rose-500/10 border border-rose-400/30 rounded-2xl p-4 flex items-start gap-3 text-white">
      <AlertCircle className="text-rose-300 flex-shrink-0 mt-0.5" size={20} />
      <div className="flex-1">
        <p className="text-sm text-white/90">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-rose-200 hover:text-white flex-shrink-0 transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

