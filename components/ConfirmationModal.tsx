import React from 'react';
import { XIcon } from './icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonClass?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  confirmButtonClass = 'bg-brand-gold hover:opacity-90',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <h2 id="modal-title" className="text-2xl font-serif font-bold text-brand-blue mb-4">{title}</h2>
        <p className="text-gray-600 mb-8">{message}</p>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            {cancelButtonText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-6 py-2 rounded-lg font-bold text-white transition-opacity ${confirmButtonClass}`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeIn 0.3s ease-out, fadeInUp 0.3s ease-out;
        }
       `}</style>
    </div>
  );
};
