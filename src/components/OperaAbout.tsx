"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, FolderOpen, Briefcase, Mail, Star, ChevronLeft, ChevronRight, Search, Share2, Download, Settings2 } from "lucide-react";
import Image from "next/image";

interface OperaAboutProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onClose?: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  zIndex?: number;
  onFocus?: () => void;
}

interface Tab {
  id: string;
  label: string;
  type?: "about" | "wiki";
  icon?: React.ReactNode;
}

export default function OperaAbout({
  initialPosition = { x: 300, y: 150 },
  initialSize = { width: 900, height: 600 },
  onClose,
  onMinimize,
  isMinimized = false,
  zIndex = 10,
  onFocus,
}: OperaAboutProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("about");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tabSources, setTabSources] = useState<Record<string, string>>({});

  const [tabs, setTabs] = useState<Tab[]>([
    { id: "about", label: "About", type: "about" },
    { id: "wiki-1", label: "Wikipedia", type: "wiki" },
  ]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".window-controls")) return;
    if ((e.target as HTMLElement).closest("button") && !(e.target as HTMLElement).closest(".tab-bar")) return;
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

  const MAX_TABS = 6;

  const closeTab = (tabId: string) => {
    if (tabId === "about") return;
    setTabs((prev) => {
      const newTabs = prev.filter((t) => t.id !== tabId);
      if (activeTab === tabId && newTabs.length > 0) {
        setActiveTab(newTabs[newTabs.length - 1].id);
      }
      return newTabs;
    });
  };

  const addTab = () => {
    if (tabs.length >= MAX_TABS) return;
    const id = `wiki-${Date.now()}`;
    setTabs((prev) => [...prev, { id, label: "Wikipedia", type: "wiki" }]);
    setActiveTab(id);
  };

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;

    const currentTab = tabs.find((t) => t.id === activeTab);
    if (currentTab?.type === "wiki") {
      const url = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;
      setTabSources((prev) => ({ ...prev, [activeTab]: url }));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="h-full overflow-auto" style={{ backgroundColor: "#151F27" }}>
            <div className="flex flex-col items-center pt-10 pb-6">
              <h1 className="text-5xl font-bold text-[#D9FF00] mb-8" style={{ fontFamily: "var(--font-agern), Arial, sans-serif", letterSpacing: "-1px" }}>
                Aman Kumar
              </h1>

              <div className="w-full max-w-2xl px-4 mb-10">
                <div
                  className="flex items-center gap-3 px-4 py-3 border transition-colors"
                  style={{
                    backgroundColor: searchFocused ? "#1a2332" : "#0f1924",
                    borderColor: searchFocused ? "#D9FF00" : "#374151",
                    borderRadius: 0,
                  }}
                >
                  <Search className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="flex-1 bg-transparent border-none outline-none text-base text-gray-200 placeholder:text-gray-500"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search..."
                  />
                  <button onClick={handleSearch} className="w-8 h-8 flex items-center justify-center bg-[#D9FF00] hover:bg-[#c2e600] transition-colors shrink-0" style={{ borderRadius: 0 }}>
                    <Search className="w-4 h-4 text-[#151F27]" />
                  </button>
                </div>
              </div>

              <div className="w-full max-w-3xl px-4 space-y-6">
                <div className="border border-gray-700 p-5" style={{ borderRadius: 0, backgroundColor: "#1a2332" }}>
                  <div className="flex gap-5">
                    <div className="w-28 h-28 shrink-0 border border-gray-600 overflow-hidden" style={{ borderRadius: 0 }}>
                      <Image src="/desktopico/Aboutme.png" alt="Aman Kumar" width={112} height={112} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-[#D9FF00] mb-1">Aman Kumar</h2>
                      <p className="text-sm text-gray-400 mb-3">Visual Designer & Developer</p>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        Passionate about creating beautiful and functional user experiences. Specializes in UI/UX design, frontend development, and building seamless digital products with modern aesthetics.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Achievements</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border border-gray-700 p-4 hover:border-[#D9FF00]/50 transition-colors" style={{ borderRadius: 0, backgroundColor: "#1a2332" }}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 border border-gray-600 flex items-center justify-center shrink-0" style={{ borderRadius: 0 }}>
                          <span className="text-lg">🏆</span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#D9FF00]">Best Portfolio</h4>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Awarded for outstanding UI/UX design and technical implementation.
                      </p>
                    </div>

                    <div className="border border-gray-700 p-4 hover:border-[#D9FF00]/50 transition-colors" style={{ borderRadius: 0, backgroundColor: "#1a2332" }}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 border border-gray-600 flex items-center justify-center shrink-0" style={{ borderRadius: 0 }}>
                          <span className="text-lg">⭐</span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#D9FF00]">Top Rated</h4>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Consistently delivered high-quality projects with excellent client satisfaction.
                      </p>
                    </div>

                    <div className="border border-gray-700 p-4 hover:border-[#D9FF00]/50 transition-colors" style={{ borderRadius: 0, backgroundColor: "#1a2332" }}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 border border-gray-600 flex items-center justify-center shrink-0" style={{ borderRadius: 0 }}>
                          <span className="text-lg">🚀</span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#D9FF00]">Open Source</h4>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Active contributor to open source projects with 1000+ GitHub stars.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "google":
      case "wiki-1":
      default: {
        const currentTab = tabs.find((t) => t.id === activeTab);
        if (currentTab?.type !== "wiki") {
          return null;
        }
        const src = tabSources[activeTab] || "";
        return (
          <div className="h-full w-full" style={{ backgroundColor: "#151F27" }}>
            {src ? (
              <iframe
                src={src}
                title="Search Results"
                className="w-full h-full border border-gray-700"
                style={{
                  borderRadius: 0,
                  backgroundColor: "#fff",
                }}
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            ) : (
              <div className="w-full h-full border border-gray-700 flex items-center justify-center" style={{ borderRadius: 0, backgroundColor: "#1a2332" }}>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">Wikipedia Search</p>
                  <p className="text-xs text-gray-500">
                    Use the address bar above to search. Results will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      }
    }
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
      className="absolute border border-gray-700 overflow-hidden flex"
      style={{
        left: position.x,
        top: position.y,
        width: initialSize.width,
        height: initialSize.height,
        zIndex,
        borderRadius: 0,
      }}
    >
      {/* Left Sidebar */}
      <div className="w-12 bg-[#0f1924] border-r border-gray-700 flex flex-col items-center py-2 gap-1 shrink-0">
        <div className="w-8 h-8 flex items-center justify-center mb-2">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <circle cx="12" cy="12" r="10" stroke="#D9FF00" strokeWidth="2" />
            <path d="M12 8v8M8 12h8" stroke="#D9FF00" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <button className="w-8 h-8 flex items-center justify-center border border-transparent hover:border-gray-600 hover:bg-gray-700/30 transition-colors" style={{ borderRadius: 0 }}>
          <Home className="w-4 h-4 text-gray-300" />
        </button>

        <button className="w-8 h-8 flex items-center justify-center border border-transparent hover:border-gray-600 hover:bg-gray-700/30 transition-colors" style={{ borderRadius: 0 }}>
          <Star className="w-4 h-4 text-gray-300" />
        </button>

        <button className="w-8 h-8 flex items-center justify-center border border-transparent hover:border-gray-600 hover:bg-gray-700/30 transition-colors" style={{ borderRadius: 0 }}>
          <FolderOpen className="w-4 h-4 text-gray-300" />
        </button>

        <button className="w-8 h-8 flex items-center justify-center border border-transparent hover:border-gray-600 hover:bg-gray-700/30 transition-colors" style={{ borderRadius: 0 }}>
          <Briefcase className="w-4 h-4 text-gray-300" />
        </button>

        <button className="w-8 h-8 flex items-center justify-center border border-transparent hover:border-gray-600 hover:bg-gray-700/30 transition-colors" style={{ borderRadius: 0 }}>
          <Mail className="w-4 h-4 text-gray-300" />
        </button>

        <div className="flex-1" />

        <button className="w-8 h-8 flex items-center justify-center border border-transparent hover:border-gray-600 hover:bg-gray-700/30 transition-colors" style={{ borderRadius: 0 }}>
          <Settings2 className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Title Bar / Tab Bar */}
        <div
          className="tab-bar h-10 bg-[#1a2332] border-b border-gray-700 flex items-center px-2 gap-1 cursor-move select-none"
          onMouseDown={handleMouseDown}
        >
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`group flex items-center gap-2 px-3 py-1.5 border transition-colors cursor-pointer ${activeTab === tab.id ? "border-[#D9FF00]/30 bg-[#D9FF00]/5" : "border-transparent hover:border-gray-600 hover:bg-gray-700/20"}`}
              style={{ borderRadius: 0 }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon && <span className="text-gray-400">{tab.icon}</span>}
              <span className={`text-sm font-medium ${activeTab === tab.id ? "text-[#D9FF00]" : "text-gray-300"}`}>
                {tab.label}
              </span>
              {tabs.length > 1 && (
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="w-5 h-5 flex items-center justify-center hover:bg-[#D9FF00]/20 transition-colors"
                  style={{ borderRadius: 0 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-gray-400 hover:text-[#D9FF00]">
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" />
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.5" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addTab}
            disabled={tabs.length >= MAX_TABS}
            className="w-6 h-6 flex items-center justify-center border border-gray-600 hover:border-[#D9FF00] hover:bg-[#D9FF00]/10 transition-colors text-gray-400 hover:text-[#D9FF00] disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ borderRadius: 0 }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" />
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </button>

          <div className="ml-auto flex items-center gap-1">
            <button className="w-6 h-6 flex items-center justify-center hover:bg-[#D9FF00]/10 transition-colors" style={{ borderRadius: 0 }}>
              <Share2 className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <button className="w-6 h-6 flex items-center justify-center hover:bg-[#D9FF00]/10 transition-colors" style={{ borderRadius: 0 }}>
              <Download className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <div className="window-controls flex items-center gap-0.5 ml-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onMinimize}
                className="w-5 h-5 flex items-center justify-center border border-green-400/60 hover:border-green-400"
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
                className="w-5 h-5 flex items-center justify-center border border-red-400/60 hover:border-red-400"
                style={{ borderRadius: 0, backgroundColor: "rgba(239,68,68,0.25)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-red-400">
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" />
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.5" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="h-9 bg-[#1a2332] border-b border-gray-700 flex items-center px-2 gap-1">
          <div className="flex items-center gap-0.5">
            <button className="w-7 h-7 flex items-center justify-center hover:bg-[#D9FF00]/10 transition-colors" style={{ borderRadius: 0 }}>
              <ChevronLeft className="w-4 h-4 text-gray-300" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-[#D9FF00]/10 transition-colors" style={{ borderRadius: 0 }}>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center hover:bg-[#D9FF00]/10 transition-colors" style={{ borderRadius: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-gray-300">
                <path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="flex-1 max-w-xl">
            <div className={`flex items-center gap-2 px-3 py-1 border transition-colors ${searchFocused ? "border-[#D9FF00] bg-[#151F27]" : "border-gray-600 bg-[#0f1924]"}`} style={{ borderRadius: 0 }}>
              <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tabs.find((t) => t.id === activeTab)?.type === "wiki") {
                    handleSearch();
                  }
                }}
                placeholder={
                  tabs.find((t) => t.id === activeTab)?.type === "wiki"
                    ? "Search Wikipedia or type a URL"
                    : "Search or enter address"
                }
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-200 placeholder:text-gray-500"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </motion.div>
  );
}
