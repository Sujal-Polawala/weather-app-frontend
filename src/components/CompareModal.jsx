import React from 'react';
import { createPortal } from 'react-dom';
import { HiOutlineX, HiOutlineSwitchHorizontal } from 'react-icons/hi';
import MultiCityComparison from './MultiCityComparison';

const CompareModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Full-screen container */}
      <div className="relative h-full w-full flex flex-col">
        {/* Sticky header */}
        <div className="sticky top-0 z-[101] flex items-center justify-between px-4 sm:px-6 py-3 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <HiOutlineSwitchHorizontal />
            Compare Cities
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm hover:shadow transition-all"
            aria-label="Close compare"
            title="Close"
          >
            <HiOutlineX size={18} />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <MultiCityComparison />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CompareModal;