"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteConfirmationPopupProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationPopup({ onClose, onConfirm }: DeleteConfirmationPopupProps) {
  const [yesScreenPos, setYesScreenPos] = useState<{ x: number; y: number } | null>(null);

  const moveYesButton = () => {
    const margin = 100;
    const maxX = window.innerWidth - margin * 2;
    const maxY = window.innerHeight - margin * 2;
    const newX = margin + Math.random() * maxX;
    const newY = margin + Math.random() * maxY;
    setYesScreenPos({ x: newX, y: newY });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed z-[300] w-[500px] border border-gray-700"
        style={{
          left: "calc(50% - 250px)",
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "#1a2332",
          borderRadius: 0,
        }}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center bg-red-500/20 border border-red-500/40">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-red-400">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200">Delete Icon</h3>
              <p className="text-xs text-gray-400">Are you sure you want to delete this icon?</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-8">
            <div className="relative w-40 h-12">
              {yesScreenPos ? (
                <motion.button
                  key="yes-moving"
                  initial={{ left: 0, top: 0 }}
                  animate={{ left: yesScreenPos.x, top: yesScreenPos.y }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 20,
                  }}
                  onMouseEnter={moveYesButton}
                  onClick={onConfirm}
                  className="fixed px-4 py-1.5 text-sm text-white bg-red-500 border border-red-500 transition-colors"
                  style={{ zIndex: 301 }}
                >
                  Yes
                </motion.button>
              ) : (
                <button
                  key="yes-static"
                  onMouseEnter={moveYesButton}
                  onClick={onConfirm}
                  className="px-4 py-1.5 text-sm text-white bg-red-500 border border-red-500 transition-colors"
                >
                  Yes
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-sm text-gray-300 hover:bg-gray-700 transition-colors border border-gray-600 hover:border-gray-500"
            >
              No
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}