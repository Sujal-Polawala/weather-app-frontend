import React from 'react';
import { createPortal } from 'react-dom';
import { HiOutlineX } from 'react-icons/hi';
import MultiCityComparison from './MultiCityComparison';

const CompareModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto mx-4 rounded-3xl border border-white/20 bg-white/80 backdrop-blur-xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/70 hover:bg-white/90 text-gray-700 shadow-md hover:shadow-lg transition-all"
          aria-label="Close compare"
          title="Close"
        >
          <HiOutlineX size={20} />
        </button>
        <MultiCityComparison />
      </div>
    </div>,
    document.body
  );
};

export default CompareModal;