"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  onMaximize?: () => void;
  isMinimized?: boolean;
  isMaximized?: boolean;
  zIndex?: number;
  onFocus?: () => void;
  addressPath?: string;
  onAddressChange?: (path: string) => void;
  onBack?: () => void;
  onForward?: () => void;
  onUp?: () => void;
  showSearchBar?: boolean;
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
  onMaximize,
  isMinimized = false,
  isMaximized = false,
  zIndex = 10,
  onFocus,
  addressPath = "",
  onAddressChange,
  onBack,
  onForward,
  onUp,
  showSearchBar = true,
}: FileManagerWindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isClosing, setIsClosing] = useState(false);

  const initialPositionRef = useRef(initialPosition);
  const initialSizeRef = useRef(initialSize);

  useEffect(() => {
    if (isMaximized) {
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
    } else {
      setPosition(initialPositionRef.current);
      setSize(initialSizeRef.current);
    }
  }, [isMaximized]);

  const toggleMaximize = useCallback(() => {
    onMaximize?.();
  }, [onMaximize]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
  }, []);

  const handleMinimize = useCallback(() => {
    onMinimize?.();
  }, [onMinimize]);

  const handleAnimationComplete = useCallback(() => {
    if (isClosing && onClose) {
      onClose();
    }
  }, [isClosing, onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".window-controls")) return;
    if ((e.target as HTMLElement).closest("input")) return;
    if (isMaximized || isClosing) return;
    onFocus?.();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isClosing) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging && !isClosing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, isClosing]);

  const isHidden = isMinimized || isClosing;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        opacity: isHidden ? 0 : 1,
        scale: isClosing ? 0.95 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute bg-[#151F27] border border-gray-700 overflow-hidden"
      style={{
        zIndex,
        borderRadius: 0,
      }}
      onAnimationComplete={handleAnimationComplete}
    >
      <div
        className="h-10 bg-[#1a2332] flex items-center px-3 gap-2 cursor-move select-none"
        style={{ borderBottom: `1px solid var(--accent-border)` }}
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
            onClick={toggleMaximize}
            className="w-5 h-5 flex items-center justify-center border border-yellow-400/60"
            style={{ borderRadius: 0, backgroundColor: "rgba(250,204,21,0.15)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-yellow-400">
              {isMaximized ? (
                <>
                  <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="2" />
                  <path d="M9 9h6v6H9z" fill="currentColor" />
                </>
              ) : (
                <>
                  <rect x="5" y="5" width="14" height="14" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 8h8v8H8z" fill="currentColor" />
                </>
              )}
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleMinimize}
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
            onClick={handleClose}
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
          <button
            onClick={onBack}
            className="w-7 h-7 flex items-center justify-center transition-colors"
            style={{ backgroundColor: "var(--accent-dim)", color: "var(--accent)", border: "1px solid transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onForward}
            className="w-7 h-7 flex items-center justify-center transition-colors"
            style={{ backgroundColor: "var(--accent-dim)", color: "var(--accent)", border: "1px solid transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onUp}
            className="w-7 h-7 flex items-center justify-center transition-colors"
            style={{ backgroundColor: "var(--accent-dim)", color: "var(--accent)", border: "1px solid transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex items-center gap-2 px-2 py-1 border border-gray-600 bg-[#0f1924] ml-1">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-gray-400 shrink-0">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            type="text"
            value={addressPath}
            onChange={(e) => onAddressChange?.(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-200 min-w-0"
          />
        </div>

        {showSearchBar && (
          <div className="flex items-center gap-2 px-2 py-1 border border-gray-600 bg-[#0f1924] w-36 shrink-0">
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-200 placeholder:text-gray-500"
            />
          </div>
        )}
      </div>

      <div className="flex h-[calc(100%-84px)]">
        {sidebarItems.length > 0 && (
          <div className="w-52 bg-[#0f1924] border-r border-gray-700 overflow-y-auto p-1.5 shrink-0">
            {sidebarItems.map((item, index) => {
              const isActive = item.active;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 mb-0.5 transition-colors text-left"
                  style={{
                    backgroundColor: isActive ? "var(--accent-dim)" : "transparent",
                    color: isActive ? "var(--accent)" : "#d1d5db",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "var(--accent-dim)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0" style={{ color: isActive ? "var(--accent)" : "#9ca3af" }}>
                    {item.icon}
                  </div>
                  <span className="text-sm truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0 bg-[#151F27]">
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
