"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, FolderOpen, Briefcase, Mail } from "lucide-react";

export default function StartMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: User, label: "About Me" },
    { icon: FolderOpen, label: "Projects" },
    { icon: Briefcase, label: "Skills" },
    { icon: Mail, label: "Contact" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 flex items-center justify-center border border-gray-900/40 hover:bg-black/10 transition-colors"
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <rect x="2" y="2" width="9" height="9" fill="#f25022" />
            <rect x="13" y="2" width="9" height="9" fill="#00a4ef" />
            <rect x="2" y="13" width="9" height="9" fill="#7fba00" />
            <rect x="13" y="13" width="9" height="9" fill="#ffb900" />
          </svg>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-14 left-1/2 -translate-x-1/2 w-72 bg-[#1a1a1a]/95 backdrop-blur-md border border-gray-700 p-3 origin-bottom-left"
            style={{ borderRadius: 0 }}
          >
            <div className="p-3 border-b border-gray-700 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-100">User</p>
                  <p className="text-xs text-gray-400">user@example.com</p>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <motion.button
                  key={item.label}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:border-[#D9FF00] hover:bg-[#D9FF00]/10 border border-transparent transition-colors text-left"
                >
                  <div className="w-8 h-8 flex items-center justify-center border border-gray-600">
                    <item.icon className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-sm text-gray-100 font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
