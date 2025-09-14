import React from 'react';
import { createPortal } from 'react-dom';
import { HiOutlineX, HiOutlineSwitchHorizontal } from 'react-icons/hi';
import MultiCityComparison from './MultiCityComparison';

const CompareModal = ({ isOpen, onClose, onCityAdded = null }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm hover:cursor-pointer"
        onClick={onClose}
      />

      {/* Centered glass card */}
      <div className="relative z-[101] w-[92%] md:w-[85%] lg:w-[75%] max-w-6xl max-h-[86vh] overflow-hidden rounded-3xl border border-white/20 bg-white/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        {/* Card header */}
        <div className="sticky top-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-white/70 backdrop-blur-xl border-b border-white/30">
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <HiOutlineSwitchHorizontal />
            <span>Compare Cities</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-sm hover:shadow transition-all hover:cursor-pointer"
            aria-label="Close compare"
            title="Close"
          >
            <HiOutlineX size={18} />
          </button>
        </div>

        {/* Content area */}
        <div className="overflow-y-auto max-h-[calc(86vh-56px)] p-4 sm:p-6">
          <MultiCityComparison isInModal={true} onCityAdded={onCityAdded} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CompareModal;