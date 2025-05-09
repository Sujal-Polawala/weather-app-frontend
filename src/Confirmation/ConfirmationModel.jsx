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
            className="relative bg-white/80 backdrop-blur-lg text-gray-800 rounded-2xl shadow-2xl w-full max-w-md px-6 py-8"
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
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 shadow transition transform hover:scale-105 hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow transition transform hover:scale-105 hover:cursor-pointer"
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
