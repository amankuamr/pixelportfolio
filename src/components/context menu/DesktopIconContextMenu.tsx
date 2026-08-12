"use client";

import { motion, AnimatePresence } from "framer-motion";

interface DesktopIconContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onOpen: () => void;
  onCopy: () => void;
  onRename: () => void;
  onProperties: () => void;
}

export default function DesktopIconContextMenu({ x, y, onClose, onOpen, onCopy, onRename, onProperties }: DesktopIconContextMenuProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed z-[200] w-44 border border-gray-700"
        style={{
          left: x,
          top: y,
          backgroundColor: "#1a2332",
          borderRadius: 0,
        }}
      >
        <div className="p-1">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => { onOpen(); onClose(); }}
            className="group w-full flex items-center justify-between px-3 py-1.5 text-left bg-transparent hover:bg-[#D9FF00] hover:text-[#151F27] transition-colors duration-150"
          >
            <span className="text-sm text-gray-200 group-hover:text-[#151F27]">Open</span>
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => { onCopy(); onClose(); }}
            className="group w-full flex items-center justify-between px-3 py-1.5 text-left bg-transparent hover:bg-[#D9FF00] hover:text-[#151F27] transition-colors duration-150"
          >
            <span className="text-sm text-gray-200 group-hover:text-[#151F27]">Copy</span>
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => { onRename(); onClose(); }}
            className="group w-full flex items-center justify-between px-3 py-1.5 text-left bg-transparent hover:bg-[#D9FF00] hover:text-[#151F27] transition-colors duration-150"
          >
            <span className="text-sm text-gray-200 group-hover:text-[#151F27]">Rename</span>
          </button>
          <div className="my-1 border-t border-gray-700" />
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => { onProperties(); onClose(); }}
            className="group w-full flex items-center justify-between px-3 py-1.5 text-left bg-transparent hover:bg-[#D9FF00] hover:text-[#151F27] transition-colors duration-150"
          >
            <span className="text-sm text-gray-200 group-hover:text-[#151F27]">Properties</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
