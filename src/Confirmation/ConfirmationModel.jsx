import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

const ConfirmModal = ({ show, onCancel, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="bg-gradient-to-br from-blue-100/90 via-white/90 to-purple-100/90 border border-blue-200 rounded-2xl shadow-xl p-8"
          >
            {/* Close Icon */}
            <button
              onClick={onCancel}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 transition text-xl hover:cursor-pointer"
            >
              <FaTimes />
            </button>

            {/* Header */}
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="text-red-500 text-2xl mr-3" />
              <h2 className="text-2xl font-semibold">{title}</h2>
            </div>

            {/* Message */}
            <p className="text-gray-700 mb-6 leading-relaxed">{message}</p>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={onCancel}
                className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white font-semibold py-2 px-6 rounded-xl shadow transition-all duration-300 hover:scale-105 hover:shadow-xl hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white font-semibold py-2 px-6 rounded-xl shadow transition-all duration-300 hover:scale-105 hover:shadow-xl hover:cursor-pointer"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
