"use client";

import { ReactNode, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";

interface DesktopIconProps {
  label: string;
  icon: ReactNode;
  onDoubleClick?: () => void;
  position: { x: number; y: number };
  onDragEnd: (position: { x: number; y: number }) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  isRenaming?: boolean;
  renameValue?: string;
  onRenameChange?: (value: string) => void;
  onRenameSubmit?: () => void;
}

const GRID_SIZE = 100;

function snapToGrid(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export default function DesktopIcon({ label, icon, onDoubleClick, position, onDragEnd, onContextMenu, isRenaming, renameValue, onRenameChange, onRenameSubmit }: DesktopIconProps) {
  const [pos, setPos] = useState(position);
  const dragStart = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  const handleDragStart = useCallback(() => {
    dragStart.current = { ...pos };
    hasDragged.current = false;
  }, [pos]);

  const handleDrag = useCallback((_: unknown, info: { offset: { x: number; y: number } }) => {
    if (Math.abs(info.offset.x) > 2 || Math.abs(info.offset.y) > 2) {
      hasDragged.current = true;
    }
  }, []);

  const handleDragEnd = useCallback((_: unknown, info: { offset: { x: number; y: number } }) => {
    const snappedX = snapToGrid(dragStart.current.x + info.offset.x);
    const snappedY = snapToGrid(dragStart.current.y + info.offset.y);
    const newPos = { x: snappedX, y: snappedY };
    setPos(newPos);
    onDragEnd(newPos);
    setTimeout(() => {
      hasDragged.current = false;
    }, 0);
  }, [onDragEnd]);

  const handleDoubleClick = useCallback(() => {
    if (!hasDragged.current && onDoubleClick) {
      onDoubleClick();
    }
  }, [onDoubleClick]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (onContextMenu) {
      onContextMenu(e);
    }
  }, [onContextMenu]);

  const handleRenameKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onRenameSubmit?.();
    } else if (e.key === "Escape") {
      onRenameSubmit?.();
    }
  }, [onRenameSubmit]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute flex flex-col items-center gap-2 p-2 cursor-pointer transition-colors w-24 group select-none"
      style={{ left: 0, top: 0 }}
    >
      <div className="w-16 h-16 flex items-center justify-center border border-gray-400 group-hover:border-[#D9FF00] transition-colors">
        <div className="w-12 h-12 flex items-center justify-center">
          {icon}
        </div>
      </div>
      {isRenaming ? (
        <input
          type="text"
          value={renameValue}
          onChange={(e) => onRenameChange?.(e.target.value)}
          onKeyDown={handleRenameKeyDown}
          onBlur={onRenameSubmit}
          autoFocus
          className="text-xs text-white text-center drop-shadow-md leading-tight line-clamp-2 font-medium bg-transparent border border-[#D9FF00] outline-none px-1 w-full"
        />
      ) : (
        <span className="text-xs text-white text-center drop-shadow-md leading-tight line-clamp-2 font-medium">
          {label}
        </span>
      )}
    </motion.div>
  );
}
