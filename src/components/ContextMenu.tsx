"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export default function ContextMenu({ x, y, onClose }: ContextMenuProps) {
  const menuItems = [
    { label: "Refresh", shortcut: "F5" },
    { label: "Arrange icons by" },
    { label: "Check version" },
    { type: "separator" as const },
    { label: "Full screen" },
    { label: "Personalize" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed z-[200] w-64 border border-gray-700 overflow-hidden"
        style={{
          left: x,
          top: y,
          backgroundColor: "#1a2332",
          borderRadius: 0,
        }}
        onMouseLeave={onClose}
      >
        <div className="p-1">
          {menuItems.map((item, index) => {
            if (item.type === "separator") {
              return (
                <div
                  key={`sep-${index}`}
                  className="my-1 border-t border-gray-700"
                />
              );
            }

            return (
              <button
                key={index}
                className="group w-full flex items-center justify-between px-3 py-1.5 text-left bg-transparent hover:bg-[#D9FF00] hover:text-[#151F27] transition-colors duration-150"
              >
                <span className="text-sm text-gray-200 group-hover:text-[#151F27]">{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-gray-400 group-hover:text-[#151F27]">{item.shortcut}</span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
