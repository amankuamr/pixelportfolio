"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface WindowProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onClose?: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

export default function Window({
  title,
  icon,
  children,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 400, height: 300 },
  onClose,
  onMinimize,
  isMinimized = false,
}: WindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".window-controls")) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isMinimized ? { opacity: 0, scale: 0.95, pointerEvents: "none" } : { opacity: 1, scale: 1, pointerEvents: "auto" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute bg-[#151F27]/95 backdrop-blur-sm border border-gray-700 overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: initialSize.width,
        height: initialSize.height,
        zIndex: isDragging ? 1000 : 10,
        borderRadius: 0,
      }}
    >
      <div
        className="h-10 bg-[#1a2332] border-b border-[#D9FF00]/30 flex items-center px-3 gap-2 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="w-4 h-4 flex items-center justify-center text-gray-400">
          {icon}
        </div>
        <span className="text-sm font-semibold text-gray-200 flex-1">{title}</span>
        <div className="window-controls flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMinimize}
            className="w-5 h-5 flex items-center justify-center"
            style={{ borderRadius: 0, backgroundColor: "#22c55e" }}
          >
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center"
            style={{ borderRadius: 0, backgroundColor: "#ef4444" }}
          >
          </motion.button>
        </div>
      </div>
      <div className="p-4 h-[calc(100%-40px)] overflow-auto">{children}</div>
    </motion.div>
  );
}
