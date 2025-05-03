// src/components/ConfirmationModal.tsx
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'warning' | 'info' | 'success';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning',
}) => {
  if (!isOpen) return null;

  // Define colors based on type
  let headerColor = 'bg-[#F1C40F]'; // warning (yellow)
  let confirmBtnColor = 'bg-[#F1C40F] hover:bg-[#F39C12]';

  if (type === 'info') {
    headerColor = 'bg-[#1ABC9C]'; // info (teal - matching app's primary color)
    confirmBtnColor = 'bg-[#1ABC9C] hover:bg-[#16a085]';
  } else if (type === 'success') {
    headerColor = 'bg-[#2ECC71]'; // success (green)
    confirmBtnColor = 'bg-[#2ECC71] hover:bg-[#27AE60]';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden animate-slideIn">
        <div className={`${headerColor} px-6 py-4`}>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all border border-gray-300 hover:shadow-md"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg font-semibold transition-all hover:shadow-md ${confirmBtnColor}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
