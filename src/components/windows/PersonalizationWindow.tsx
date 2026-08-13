"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronUp, Search, ImageIcon, Palette, Brush, Lock, Keyboard, LayoutGrid, Monitor, Type } from "lucide-react";

interface PersonalizationWindowProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onClose?: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  zIndex?: number;
  onFocus?: () => void;
}

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { label: "Background", icon: <ImageIcon className="w-4 h-4" />, active: true },
  { label: "Colors", icon: <Palette className="w-4 h-4" /> },
  { label: "Themes", icon: <Brush className="w-4 h-4" /> },
  { label: "Lock screen", icon: <Lock className="w-4 h-4" /> },
  { label: "Touch keyboard", icon: <Keyboard className="w-4 h-4" /> },
  { label: "Start", icon: <LayoutGrid className="w-4 h-4" /> },
  { label: "Taskbar", icon: <Monitor className="w-4 h-4" /> },
  { label: "Fonts", icon: <Type className="w-4 h-4" /> },
];

const wallpaperOptions = [
  { id: "default", name: "Windows Spotlight", color: "#0078d4" },
  { id: "solid", name: "Solid color", color: "#151F27" },
  { id: "slideshow", name: "Slideshow", color: "#1a2332" },
  { id: "custom", name: "Custom picture", color: "#2a3a4a" },
];

const themeOptions = [
  { id: "light", name: "Light", color: "#ffffff" },
  { id: "dark", name: "Dark", color: "#151F27" },
  { id: "custom", name: "Custom", color: "#1a2332" },
];

export default function PersonalizationWindow({
  initialPosition = { x: 300, y: 150 },
  initialSize = { width: 850, height: 550 },
  onClose,
  onMinimize,
  isMinimized = false,
  zIndex = 10,
  onFocus,
}: PersonalizationWindowProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeSection, setActiveSection] = useState("Background");
  const [selectedWallpaper, setSelectedWallpaper] = useState("default");
  const [selectedTheme, setSelectedTheme] = useState("dark");

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".window-controls")) return;
    if ((e.target as HTMLElement).closest("input")) return;
    onFocus?.();
  };

  const handleSectionClick = (label: string) => {
    setActiveSection(label);
  };

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
        left: initialPosition.x,
        top: initialPosition.y,
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
          <Brush className="w-4 h-4" />
        </div>
        <span className="text-sm font-semibold text-gray-200 flex-1">Personalization</span>
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
          <div className={`flex items-center gap-2 px-3 py-1 border transition-colors ${searchFocused ? "border-[#D9FF00] bg-[#151F27]" : "border-gray-600 bg-[#0f1924]"}`}>
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Find a setting"
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-200 placeholder:text-gray-500"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100%-84px)]">
        <div className="w-52 bg-[#0f1924] border-r border-gray-700 overflow-y-auto p-1.5 shrink-0">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSectionClick(item.label)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 mb-0.5 transition-colors text-left ${activeSection === item.label
                  ? "bg-[#D9FF00]/15 text-[#D9FF00]"
                  : "hover:bg-[#D9FF00]/10 text-gray-300"
                }`}
            >
              <div className={`w-5 h-5 flex items-center justify-center shrink-0 ${activeSection === item.label ? "text-[#D9FF00]" : "text-gray-400"}`}>
                {item.icon}
              </div>
              <span className="text-sm truncate">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col min-w-0 bg-[#151F27]">
          <div className="flex-1 overflow-auto p-6">
            {activeSection === "Background" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#D9FF00]">Background</h2>
                <p className="text-sm text-gray-400">Background image, color, slideshow</p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  {wallpaperOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedWallpaper(option.id)}
                      className={`border p-4 transition-colors text-left ${selectedWallpaper === option.id
                          ? "border-[#D9FF00] bg-[#D9FF00]/10"
                          : "border-gray-700 hover:border-[#D9FF00]/50"
                        }`}
                      style={{ borderRadius: 0, backgroundColor: selectedWallpaper === option.id ? "rgba(217,255,0,0.05)" : option.color }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 border border-gray-600"
                          style={{ borderRadius: 0, backgroundColor: option.color }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-200">{option.name}</p>
                          {selectedWallpaper === option.id && (
                            <p className="text-xs text-[#D9FF00] mt-1">Selected</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "Colors" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#D9FF00]">Colors</h2>
                <p className="text-sm text-gray-400">Accent color, transparency effects, color theme</p>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Choose your color mode</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {themeOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedTheme(option.id)}
                        className={`border p-4 transition-colors text-left ${selectedTheme === option.id
                            ? "border-[#D9FF00] bg-[#D9FF00]/10"
                            : "border-gray-700 hover:border-[#D9FF00]/50"
                          }`}
                        style={{ borderRadius: 0, backgroundColor: option.color }}
                      >
                        <p className="text-sm font-semibold text-gray-200">{option.name}</p>
                        {selectedTheme === option.id && (
                          <p className="text-xs text-[#D9FF00] mt-1">Selected</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Accent color</h3>
                  <div className="flex flex-wrap gap-2">
                    {["#D9FF00", "#0078d4", "#e81123", "#00b7c3", "#e3008c", "#ff8c00"].map((color) => (
                      <button
                        key={color}
                        className="w-10 h-10 border border-gray-600 hover:border-[#D9FF00] transition-colors"
                        style={{ borderRadius: 0, backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "Themes" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#D9FF00]">Themes</h2>
                <p className="text-sm text-gray-400">Install, create, manage</p>

                <div className="mt-6 border border-gray-700 p-8 text-center" style={{ borderRadius: 0, backgroundColor: "#1a2332" }}>
                  <Brush className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-300 mb-1">No themes installed</p>
                  <p className="text-xs text-gray-500">Browse the Store for themes to personalize your device.</p>
                </div>
              </div>
            )}

            {activeSection === "Lock screen" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#D9FF00]">Lock screen</h2>
                <p className="text-sm text-gray-400">Lock screen images, apps, animations</p>

                <div className="mt-6 border border-gray-700 p-8 text-center" style={{ borderRadius: 0, backgroundColor: "#1a2332" }}>
                  <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-300 mb-1">Lock screen settings</p>
                  <p className="text-xs text-gray-500">Customize your lock screen experience.</p>
                </div>
              </div>
            )}

            {activeSection === "Touch keyboard" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#D9FF00]">Touch keyboard</h2>
                <p className="text-sm text-gray-400">Themes, size</p>

                <div className="mt-6 border border-gray-700 p-8 text-center" style={{ borderRadius: 0, backgroundColor: "#1a2332" }}>
                  <Keyboard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-300 mb-1">Touch keyboard settings</p>
                  <p className="text-xs text-gray-500">Customize your touch keyboard appearance.</p>
                </div>
              </div>
            )}

            {activeSection === "Start" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#D9FF00]">Start</h2>
                <p className="text-sm text-gray-400">Recent apps and items, folders</p>

                <div className="mt-6 border border-gray-700 p-8 text-center" style={{ borderRadius: 0, backgroundColor: "#1a2332" }}>
                  <LayoutGrid className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-300 mb-1">Start menu settings</p>
                  <p className="text-xs text-gray-500">Customize your Start menu layout and behavior.</p>
                </div>
              </div>
            )}

            {activeSection === "Taskbar" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#D9FF00]">Taskbar</h2>
                <p className="text-sm text-gray-400">Taskbar behaviors, system pins</p>

                <div className="mt-6 border border-gray-700 p-8 text-center" style={{ borderRadius: 0, backgroundColor: "#1a2332" }}>
                  <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-300 mb-1">Taskbar settings</p>
                  <p className="text-xs text-gray-500">Customize taskbar appearance and behavior.</p>
                </div>
              </div>
            )}

            {activeSection === "Fonts" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#D9FF00]">Fonts</h2>
                <p className="text-sm text-gray-400">Install, manage</p>

                <div className="mt-6 border border-gray-700 p-8 text-center" style={{ borderRadius: 0, backgroundColor: "#1a2332" }}>
                  <Type className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-300 mb-1">Font settings</p>
                  <p className="text-xs text-gray-500">Browse and install fonts for your system.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
