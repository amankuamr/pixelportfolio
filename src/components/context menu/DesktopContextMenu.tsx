"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContextMenuProps {
  x: number;
  y: number;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onCheckVersion: () => void;
  onPersonalize?: () => void;
  onPaste?: () => void;
  showPaste?: boolean;
}

interface MenuItem {
  label: string;
  shortcut?: string;
  submenu?: MenuItem[];
  active?: boolean;
}

interface SeparatorItem {
  type: "separator";
}

type ContextMenuItem = MenuItem | SeparatorItem;

export default function DesktopContextMenu({ x, y, isFullscreen, onToggleFullscreen, onCheckVersion, onPersonalize, onPaste, showPaste }: ContextMenuProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const menuItems: ContextMenuItem[] = [
    { label: "Refresh", shortcut: "F5" },
    { label: "Arrange icons by", submenu: [
      { label: "Ascending" },
      { label: "Descending" },
    ]},
    ...(showPaste ? [{ label: "Paste" }] : []),
    { label: "Check version" },
    { type: "separator" as const },
    { label: "Full screen", active: isFullscreen },
    { label: "Personalize" },
  ];

  const isSeparator = (item: ContextMenuItem): item is SeparatorItem => {
    return (item as SeparatorItem).type === "separator";
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        ref={menuRef}
        className="fixed z-[200] w-64 border border-gray-700"
        style={{
          left: x,
          top: y,
          backgroundColor: "#1a2332",
          borderRadius: 0,
        }}
      >
        <div className="p-1">
          {menuItems.map((item, index) => {
            if (isSeparator(item)) {
              return (
                <div
                  key={`sep-${index}`}
                  className="my-1 border-t border-gray-700"
                />
              );
            }

            const hasSubmenu = item.submenu && item.submenu.length > 0;

            return (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                  }
                  hoverTimeoutRef.current = window.setTimeout(() => {
                    setOpenSubmenu(item.label);
                  }, 1000);
                }}
                onMouseLeave={() => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                    hoverTimeoutRef.current = null;
                  }
                  closeTimeoutRef.current = window.setTimeout(() => {
                    setOpenSubmenu(null);
                  }, 1000);
                }}
              >
                <button
                  onClick={item.label === "Full screen" ? onToggleFullscreen : item.label === "Check version" ? onCheckVersion : item.label === "Personalize" && onPersonalize ? onPersonalize : item.label === "Paste" && onPaste ? onPaste : undefined}
                  className="group w-full flex items-center justify-between px-3 py-1.5 text-left bg-transparent hover:bg-[#D9FF00] hover:text-[#151F27] transition-colors duration-150"
                >
                  <span className="text-sm text-gray-200 group-hover:text-[#151F27]">{item.label}</span>
                  <div className="flex items-center gap-2">
                    {item.shortcut && (
                      <span className="text-xs text-gray-400 group-hover:text-[#151F27]">{item.shortcut}</span>
                    )}
                    {hasSubmenu && (
                      <svg className="w-3 h-3 text-gray-400 group-hover:text-[#151F27]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    )}
                    {item.active && (
                      <svg className="w-3 h-3 text-[#D9FF00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {hasSubmenu && openSubmenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="absolute left-full top-0 w-48 border border-gray-700"
                      style={{
                        backgroundColor: "#1a2332",
                        borderRadius: 0,
                        marginLeft: "8px",
                        zIndex: 300,
                      }}
                      onMouseEnter={() => {
                        if (closeTimeoutRef.current) {
                          clearTimeout(closeTimeoutRef.current);
                          closeTimeoutRef.current = null;
                        }
                      }}
                      onMouseLeave={() => {
                        setOpenSubmenu(null);
                      }}
                    >
                      <div className="p-1">
                        {item.submenu!.map((subItem, subIndex) => (
                          <button
                            key={subIndex}
                            className="group w-full flex items-center justify-between px-3 py-1.5 text-left bg-transparent hover:bg-[#D9FF00] hover:text-[#151F27] transition-colors duration-150"
                          >
                            <span className="text-sm text-gray-200 group-hover:text-[#151F27]">{subItem.label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
