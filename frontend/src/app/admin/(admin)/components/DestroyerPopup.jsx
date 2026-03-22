"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; // Required for teleporting
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX } from 'react-icons/hi';
import { CgSpinner } from 'react-icons/cg';

export default function DestroyerPopup({ isOpen, onClose, title, children, primaryAction, actionText, loading }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Don't render on server-side
  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={loading ? null : onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.4 }}
            className="relative w-full max-h-[90vh] overflow-y-auto lg:max-w-[50%] max-w-[97%] bg-white  shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] p-8 md:p-10 z-[100000]"
          >
            {!loading && (
              <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all"
              >
                <HiOutlineX size={20} />
              </button>
            )}

            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{title}</h3>
              <div className="text-slate-600 mb-8 leading-relaxed">
                {children}
              </div>

              <div className="flex gap-4">
                <button
                  disabled={loading}
                  onClick={onClose}
                  className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  onClick={primaryAction}
                  className="flex-1 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <CgSpinner className="animate-spin" size={20} /> : actionText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // This sends the HTML to the bottom of the body tag
  return createPortal(modalContent, document.body);
}