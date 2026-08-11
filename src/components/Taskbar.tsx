"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, Shield, ChevronUp, Info } from "lucide-react";
import StartMenu from "./StartMenu";
import { motion, AnimatePresence } from "framer-motion";

interface TaskbarWindow {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
}

interface TaskbarProps {
  windows: TaskbarWindow[];
  onToggleMinimize: (id: string) => void;
  onTaskbarContextMenu: (id: string, x: number) => void;
  onStartButtonContextMenu: () => void;
  startButtonContextMenuOpen: boolean;
}

interface TrayPopupItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface TrayCategory {
  title: string;
  items: TrayPopupItem[];
}

const volumePopupCategories: TrayCategory[] = [
  {
    title: "Audio",
    items: [
      { label: "Speaker", icon: <Volume2 className="w-4 h-4" />, active: true },
      { label: "Headphones", icon: <Volume2 className="w-4 h-4" /> },
    ],
  },
];

const defenderPopupCategories: TrayCategory[] = [
  {
    title: "Security",
    items: [
      { label: "Virus & threat protection", icon: <Shield className="w-4 h-4" />, active: true },
      { label: "Firewall & network", icon: <Shield className="w-4 h-4" /> },
    ],
  },
];

const arrowPopupCategories: TrayCategory[] = [
  {
    title: "System",
    items: [
      { label: "Network", icon: <Shield className="w-4 h-4" /> },
      { label: "Volume", icon: <Volume2 className="w-4 h-4" /> },
      { label: "Defender", icon: <Shield className="w-4 h-4" />, active: true },
    ],
  },
];

export default function Taskbar({ windows, onToggleMinimize, onTaskbarContextMenu, onStartButtonContextMenu }: TaskbarProps) {
  const openWindows = windows.filter((w) => w.isOpen);
  const [openPopup, setOpenPopup] = useState<string | null>(null);
  const popupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [showInfoTooltip, setShowInfoTooltip] = useState(true);
  const [infoMoved, setInfoMoved] = useState(false);

  const handleTogglePopup = (name: string) => {
    setOpenPopup((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button[data-popup]');

      if (button) {
        const popupName = button.getAttribute('data-popup');
        if (popupName === openPopup) {
          return;
        }
        setOpenPopup(null);
      } else if (openPopup) {
        setOpenPopup(null);
      }
    };

    if (openPopup) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openPopup]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInfoTooltip(false);
      setInfoMoved(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const renderPopup = (categories: TrayCategory[]) => (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute bottom-14 right-0 w-72 border border-gray-700 z-[60]"
      style={{ backgroundColor: "#151F27", borderRadius: 0 }}
    >
      <div className="p-2">
        {categories.map((category, catIndex) => (
          <div key={category.title}>
            {catIndex > 0 && (
              <div className="my-1 border-t border-gray-700" />
            )}
            <div className="px-2 py-1">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                {category.title}
              </p>
              <div className="space-y-0.5">
                {category.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenPopup(null);
                    }}
                    className="group w-full flex items-center gap-3 px-2 py-1.5 hover:bg-[#D9FF00]/10 border border-transparent hover:border-[#D9FF00] transition-colors text-left"
                  >
                    <div className="w-6 h-6 flex items-center justify-center text-gray-300 group-hover:text-[#D9FF00]">
                      {item.icon}
                    </div>
                    <span className="text-xs text-gray-200 group-hover:text-[#D9FF00] font-medium flex-1">
                      {item.label}
                    </span>
                    {item.active && (
                      <svg className="w-3 h-3 text-[#D9FF00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed bottom-0 left-0 right-0 h-[52px] flex items-center px-4 z-50 border-t border-gray-700"
      style={{ backgroundColor: "#1a2332" }}
    >
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            onStartButtonContextMenu();
          }}
        >
          <StartMenu />
        </div>
        {openWindows.map((win) => (
          <button
            key={win.id}
            onClick={() => onToggleMinimize(win.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              onTaskbarContextMenu(win.id, e.clientX);
            }}
            className={`h-10 w-10 flex items-center justify-center border transition-colors relative ${win.isMinimized ? "border-gray-600 bg-transparent hover:border-[#D9FF00] hover:bg-[#D9FF00]/10" : "border-[#D9FF00] bg-white/10 hover:bg-[#D9FF00]/20"
              } ${win.isMinimized ? "shadow-[0_2px_0_#22c55e]" : ""}`}
          >
            <div className="w-6 h-6 flex items-center justify-center">{win.icon}</div>
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-1">
        {!infoMoved && (
          <div className="relative">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-8 h-8 flex items-center justify-center border border-[#D9FF00] bg-[#D9FF00]/10 hover:bg-[#D9FF00]/20 transition-colors"
            >
              <Info className="w-4 h-4 text-[#D9FF00]" />
            </motion.button>
            <AnimatePresence>
              {showInfoTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute bottom-14 right-0 w-72 border border-[#D9FF00] z-[60]"
                  style={{ backgroundColor: "#151F27", borderRadius: 0 }}
                >
                  <div className="p-3">
                    <p className="text-sm font-bold text-[#D9FF00] mb-2">Welcome to Pixel Portfolio by Aman Kumar</p>
                    <ul className="space-y-1 mb-2">
                      <li className="text-xs text-gray-200 flex items-start gap-2">
                        <span className="text-[#D9FF00] mt-0.5">•</span>
                        <span>Click desktop icons to open windows and explore sections</span>
                      </li>
                      <li className="text-xs text-gray-200 flex items-start gap-2">
                        <span className="text-[#D9FF00] mt-0.5">•</span>
                        <span>Drag windows by their title bar to rearrange them</span>
                      </li>
                    </ul>
                    <div className="border-t border-gray-700 pt-2">
                      <p className="text-[10px] text-gray-400">Right click on desktop to see more options</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {infoMoved && (
          <div className="relative">
            <button
              data-popup="info"
              onClick={(e) => {
                e.stopPropagation();
                handleTogglePopup("info");
              }}
              className="w-8 h-8 flex items-center justify-center border border-gray-600 hover:border-[#D9FF00] hover:bg-[#D9FF00]/10 transition-colors"
            >
              <Info className="w-4 h-4 text-gray-300" />
            </button>
            <AnimatePresence>
              {openPopup === "info" && (
                <motion.div
                  onMouseDown={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute bottom-14 right-0 w-72 border border-gray-700 z-[60]"
                  style={{ backgroundColor: "#151F27", borderRadius: 0 }}
                >
                  <div className="p-3">
                    <p className="text-sm font-bold text-[#D9FF00] mb-2">Welcome to Pixel Portfolio by Aman Kumar</p>
                    <ul className="space-y-1 mb-2">
                      <li className="text-xs text-gray-200 flex items-start gap-2">
                        <span className="text-[#D9FF00] mt-0.5">•</span>
                        <span>Click desktop icons to open windows and explore sections</span>
                      </li>
                      <li className="text-xs text-gray-200 flex items-start gap-2">
                        <span className="text-[#D9FF00] mt-0.5">•</span>
                        <span>Drag windows by their title bar to rearrange them</span>
                      </li>
                    </ul>
                    <div className="border-t border-gray-700 pt-2">
                      <p className="text-[10px] text-gray-400">Right click on desktop to see more options</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="relative">
          <button
            data-popup="arrow"
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePopup("arrow");
            }}
            className="w-8 h-8 flex items-center justify-center border border-gray-600 hover:border-[#D9FF00] hover:bg-[#D9FF00]/10 transition-colors"
          >
            <ChevronUp className="w-4 h-4 text-gray-300" />
          </button>
          <AnimatePresence>
            {openPopup === "arrow" && (
              <div
                ref={(el) => { popupRefs.current["arrow"] = el; }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {renderPopup(arrowPopupCategories)}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            data-popup="defender"
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePopup("defender");
            }}
            className="w-8 h-8 flex items-center justify-center border border-gray-600 hover:border-[#D9FF00] hover:bg-[#D9FF00]/10 transition-colors"
          >
            <Shield className="w-4 h-4 text-gray-300" />
          </button>
          <AnimatePresence>
            {openPopup === "defender" && (
              <div
                ref={(el) => { popupRefs.current["defender"] = el; }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {renderPopup(defenderPopupCategories)}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            data-popup="volume"
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePopup("volume");
            }}
            className="w-8 h-8 flex items-center justify-center border border-gray-600 hover:border-[#D9FF00] hover:bg-[#D9FF00]/10 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-gray-300" />
          </button>
          <AnimatePresence>
            {openPopup === "volume" && (
              <div
                ref={(el) => { popupRefs.current["volume"] = el; }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {renderPopup(volumePopupCategories)}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-sm text-gray-300 font-medium ml-2">
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </motion.div>
  );
}
