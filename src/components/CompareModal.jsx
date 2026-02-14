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

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

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
          : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop with blur */}
      <div
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleBackdropClick}
      />

      {/* Modal Card */}
      <div 
        className={`relative z-[101] w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-2xl transition-all duration-300 transform ${
          isAnimating 
            ? 'translate-y-0 scale-100 opacity-100' 
            : 'translate-y-8 scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-900 text-white">
              <HiOutlineSwitchHorizontal size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">City Comparison</h2>
              <p className="text-xs text-slate-500">Compare weather across multiple cities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all duration-200 hover:cursor-pointer"
            aria-label="Close compare"
            title="Close (Esc)"
          >
            <HiOutlineX size={18} />
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