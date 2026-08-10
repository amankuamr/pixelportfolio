"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, FolderOpen, Briefcase, Mail, FileText, Image } from "lucide-react";
import { AboutMeImageIcon, ProjectsImageIcon, SkillsImageIcon, ContactImageIcon } from "@/components/WindowsIcons";

export default function StartMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllApps, setShowAllApps] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowAllApps(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const menuItems = [
    { icon: User, label: "About Me" },
    { icon: FolderOpen, label: "Projects" },
    { icon: Briefcase, label: "Skills" },
    { icon: Mail, label: "Contact" },
    { icon: FileText, label: "Resume" },
    { icon: Image, label: "Gallery" },
  ];

  const allApps = [
    { icon: User, label: "About Me" },
    { icon: FolderOpen, label: "Projects" },
    { icon: Briefcase, label: "Skills" },
    { icon: Mail, label: "Contact" },
    { icon: FileText, label: "Resume" },
    { icon: Image, label: "Gallery" },
  ];

  const tiles = [
    { title: "About Me", icon: <AboutMeImageIcon className="w-full h-full" />, size: "wide" },
    { title: "Projects", icon: <ProjectsImageIcon className="w-full h-full" />, size: "tall" },
    { title: "Skills", icon: <SkillsImageIcon className="w-full h-full" />, size: "small" },
    { title: "Contact", icon: <ContactImageIcon className="w-full h-full" />, size: "small" },
    { title: "Resume", icon: <span className="text-lg">📄</span>, size: "small" },
    { title: "Gallery", icon: <span className="text-lg">🖼️</span>, size: "wide" },
    { title: "Settings", icon: <span className="text-lg">⚙️</span>, size: "tall" },
    { title: "Help", icon: <span className="text-lg">❓</span>, size: "small" },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center border border-gray-600 hover:border-[#D9FF00] hover:bg-[#D9FF00]/10 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <rect x="2" y="2" width="9" height="9" fill="#f25022" />
          <rect x="13" y="2" width="9" height="9" fill="#00a4ef" />
          <rect x="2" y="13" width="9" height="9" fill="#7fba00" />
          <rect x="13" y="13" width="9" height="9" fill="#ffb900" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
             className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[700px] max-h-[560px] flex origin-bottom"
            style={{
              backgroundColor: "#151F27",
              borderRadius: 0,
              border: "1px solid #2a3a4a",
            }}
          >
            <div className="w-48 flex flex-col border-r border-gray-700">
              <div className="px-3 py-2.5 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-700 flex items-center justify-center shrink-0">
                    <span className="text-base">👤</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-100 truncate">User</p>
                    <p className="text-xs text-gray-400 truncate">user@example.com</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 py-2 px-2 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#D9FF00]/10 border border-transparent hover:border-[#D9FF00] transition-colors text-left"
                  >
                    <div className="w-7 h-7 flex items-center justify-center border border-gray-600 shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-gray-300" />
                    </div>
                    <span className="text-sm text-gray-100 font-medium truncate">{item.label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="relative border-t border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowAllApps(!showAllApps)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#D9FF00]/10 border border-transparent hover:border-[#D9FF00] transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 flex items-center justify-center border border-gray-600 shrink-0">
                      <span className="text-xs text-gray-300">⋯</span>
                    </div>
                    <span className="text-sm text-gray-100 font-medium">All Apps</span>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </motion.button>

                <AnimatePresence>
                  {showAllApps && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="absolute left-full bottom-0 w-48 border border-gray-700"
                      style={{
                        backgroundColor: "#151F27",
                        borderRadius: 0,
                        marginLeft: "4px",
                        marginBottom: "4px",
                        zIndex: 300,
                      }}
                    >
                      <div className="p-1">
                        {allApps.map((app) => (
                          <motion.button
                            key={app.label}
                            whileHover={{ scale: 1.01 }}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#D9FF00]/10 border border-transparent hover:border-[#D9FF00] transition-colors text-left"
                          >
                            <div className="w-6 h-6 flex items-center justify-center border border-gray-600 shrink-0">
                              <app.icon className="w-3 h-3 text-gray-300" />
                            </div>
                            <span className="text-sm text-gray-100 font-medium truncate">{app.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t border-gray-700">
                <div className="p-3 pt-2">
                  <div className="grid grid-cols-4 gap-2">
                    {["📋", "📊", "⚙️", "🔍"].map((icon, i) => (
                      <div
                        key={i}
                        className="aspect-square flex items-center justify-center border border-gray-600 hover:border-[#D9FF00] hover:bg-[#D9FF00]/10 transition-colors cursor-pointer"
                      >
                        <span className="text-lg">{icon}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 p-4">
                <div className="grid grid-cols-4 grid-rows-3 gap-2 h-full">
                  {tiles.map((tile) => (
                    <motion.button
                      key={tile.title}
                      whileHover={{ scale: 1.05 }}
                      className={`border border-gray-600 flex flex-col items-center justify-center gap-1 hover:border-[#D9FF00] hover:bg-[#D9FF00]/10 transition-colors h-full w-full ${
                        tile.size === "wide" ? "col-span-2 row-span-1" :
                        tile.size === "tall" ? "col-span-1 row-span-2" :
                        "col-span-1 row-span-1"
                      }`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        {tile.icon}
                      </div>
                      <span className="text-xs text-gray-300 truncate px-1">{tile.title}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
