import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HiOutlineX, HiOutlineSwitchHorizontal } from 'react-icons/hi';
import MultiCityComparison from './MultiCityComparison';

const CompareModal = ({ isOpen, onClose, onCityAdded = null }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isVisible) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating 
          ? 'opacity-100' 
          : 'opacity-0'
      }`}
    >
      {/* Backdrop with fade-in */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-purple-900/80 backdrop-blur-md hover:cursor-pointer transition-all duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleBackdropClick}
      />

      {/* Modal Card with fade-in */}
      <div 
        className={`relative z-[101] w-full max-w-7xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-xl shadow-2xl transition-all duration-300 transform ${
          isAnimating 
            ? 'translate-y-0 scale-100 opacity-100' 
            : 'translate-y-8 scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between gap-4 px-6 py-4 bg-gradient-to-r from-blue-50/80 via-white/80 to-purple-50/80 backdrop-blur-xl border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
              <HiOutlineSwitchHorizontal size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">City Comparison</h2>
              <p className="text-sm text-gray-600">Compare weather across multiple cities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-xl bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 shadow-md hover:shadow-lg transition-all duration-200 hover:cursor-pointer border border-white/20 hover:scale-105"
            aria-label="Close compare"
            title="Close"
          >
            <HiOutlineX size={20} />
          </button>
        </div>

        {/* Content area */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <MultiCityComparison isInModal={true} onCityAdded={onCityAdded} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CompareModal;