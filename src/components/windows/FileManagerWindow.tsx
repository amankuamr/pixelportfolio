"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronUp, Search } from "lucide-react";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  children?: SidebarItem[];
}

interface FileManagerWindowProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  sidebarItems?: SidebarItem[];
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onClose?: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  zIndex?: number;
  onFocus?: () => void;
}

export default function FileManagerWindow({
  title,
  icon,
  children,
  sidebarItems = [],
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 850, height: 550 },
  onClose,
  onMinimize,
  isMinimized = false,
  zIndex = 10,
  onFocus,
}: FileManagerWindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [searchFocused, setSearchFocused] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".window-controls")) return;
    if ((e.target as HTMLElement).closest("input")) return;
    onFocus?.();
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={
        isMinimized
          ? { opacity: 0, scale: 0.95, pointerEvents: "none" }
          : { opacity: 1, scale: 1, pointerEvents: "auto" }
      }
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute bg-[#151F27] border border-gray-700 overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: initialSize.width,
        height: initialSize.height,
        zIndex,
        borderRadius: 0,
      }}
    >
      <div
        className="h-10 bg-[#1a2332] border-b border-[#D9FF00]/30 flex items-center px-3 gap-2 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="w-5 h-5 flex items-center justify-center text-gray-400">
          {icon}
        </div>
        <span className="text-sm font-semibold text-gray-200 flex-1">{title}</span>
        <div className="window-controls flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMinimize}
            className="w-5 h-5 flex items-center justify-center border border-green-400/60"
            style={{ borderRadius: 0, backgroundColor: "rgba(34,197,94,0.15)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-green-400">
              <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#ef4444" }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center border border-red-400/60"
            style={{ borderRadius: 0, backgroundColor: "rgba(239,68,68,0.25)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-red-400">
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" />
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </motion.button>
        </div>
      </div>

      <div className="h-10 bg-[#1a2332] border-b border-gray-700 flex items-center px-2 gap-1">
        <div className="flex items-center gap-0.5">
          <button className="w-7 h-7 flex items-center justify-center hover:bg-[#D9FF00]/10 transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-300" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center hover:bg-[#D9FF00]/10 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center hover:bg-[#D9FF00]/10 transition-colors">
            <ChevronUp className="w-4 h-4 text-gray-300" />
          </button>
        </div>
        <div className="flex-1 max-w-xl">
          <div className={`flex items-center gap-2 px-3 py-1 border transition-colors ${searchFocused ? "border-[#D9FF00] bg-[#151F27]" : "border-gray-600 bg-[#0f1924]"
            }`}>
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-200 placeholder:text-gray-500"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100%-84px)]">
        {sidebarItems.length > 0 && (
          <div className="w-44 bg-[#0f1924] border-r border-gray-700 overflow-y-auto p-1.5 shrink-0">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 mb-0.5 transition-colors text-left ${item.active
                    ? "bg-[#D9FF00]/15 text-[#D9FF00]"
                    : "hover:bg-[#D9FF00]/10 text-gray-300"
                  }`}
              >
                <div className={`w-5 h-5 flex items-center justify-center shrink-0 ${item.active ? "text-[#D9FF00]" : "text-gray-400"}`}>
                  {item.icon}
                </div>
                <span className="text-sm truncate">{item.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0 bg-[#151F27]">
          <div className="flex-1 overflow-auto p-4">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
