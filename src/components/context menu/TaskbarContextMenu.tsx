"use client";

import { motion, AnimatePresence } from "framer-motion";

interface TaskbarContextMenuProps {
  x: number;
  windowId: string;
  windowTitle: string;
  onClose: () => void;
  onCloseWindow: (id: string) => void;
}

export default function TaskbarContextMenu({ x, windowId, windowTitle, onClose, onCloseWindow }: TaskbarContextMenuProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed z-[200] w-48 border border-gray-700"
        style={{
          right: `calc(100vw - ${x}px - 20px)`,
          bottom: 60,
          backgroundColor: "#1a2332",
          borderRadius: 0,
        }}
      >
        <div className="p-1">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => {
              onCloseWindow(windowId);
              onClose();
            }}
            className="group w-full flex items-center justify-between px-3 py-1.5 text-left bg-transparent hover-accent-bg hover-dark-text transition-colors duration-150"
          >
            <span className="text-sm text-gray-200">Close</span>
            <span className="text-xs text-gray-400">{windowTitle}</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
