"use client";

import { Search } from "lucide-react";
import StartMenu from "./StartMenu";
import { motion } from "framer-motion";

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
}

export default function Taskbar({ windows, onToggleMinimize }: TaskbarProps) {
  const openWindows = windows.filter((w) => w.isOpen);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed bottom-0 left-0 right-0 h-[52px] flex items-center px-4 z-50"
      style={{ backgroundColor: "#D9FF00" }}
    >
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
        <StartMenu />
        <button className="w-8 h-8 flex items-center justify-center border border-gray-900/40 hover:bg-black/10 transition-colors">
          <Search className="w-5 h-5 text-gray-900" />
        </button>
        {openWindows.map((win) => (
          <button
            key={win.id}
            onClick={() => onToggleMinimize(win.id)}
            className={`h-8 w-8 flex items-center justify-center border transition-colors ${
              win.isMinimized ? "border-gray-900/40 bg-transparent" : "border-[#D9FF00] bg-black/10"
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">{win.icon}</div>
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center">
        <div className="text-sm text-gray-900 font-medium">
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </motion.div>
  );
}
