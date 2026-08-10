"use client";

import { ReactNode, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface DesktopIconProps {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  position: { x: number; y: number };
  onDragEnd: (position: { x: number; y: number }) => void;
}

const GRID_SIZE = 100;

function snapToGrid(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export default function DesktopIcon({ label, icon, onClick, position, onDragEnd }: DesktopIconProps) {
  const dragStart = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  const handleDragStart = useCallback(() => {
    dragStart.current = { ...position };
    hasDragged.current = false;
  }, [position]);

  const handleDrag = useCallback((_: unknown, info: { offset: { x: number; y: number } }) => {
    if (Math.abs(info.offset.x) > 2 || Math.abs(info.offset.y) > 2) {
      hasDragged.current = true;
    }
  }, []);

  const handleDragEnd = useCallback((_: unknown, info: { offset: { x: number; y: number } }) => {
    const snappedX = snapToGrid(dragStart.current.x + info.offset.x);
    const snappedY = snapToGrid(dragStart.current.y + info.offset.y);
    onDragEnd({ x: snappedX, y: snappedY });
    setTimeout(() => {
      hasDragged.current = false;
    }, 0);
  }, [onDragEnd]);

  const handleClick = useCallback(() => {
    if (!hasDragged.current && onClick) {
      onClick();
    }
  }, [onClick]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute flex flex-col items-center gap-2 p-2 cursor-pointer transition-colors w-24 group select-none"
      style={{ left: 0, top: 0 }}
    >
      <div className="w-16 h-16 flex items-center justify-center border border-gray-400 group-hover:border-[#D9FF00] transition-colors">
        <div className="w-12 h-12 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <span className="text-xs text-white text-center drop-shadow-md leading-tight line-clamp-2 font-medium">
        {label}
      </span>
    </motion.div>
  );
}
