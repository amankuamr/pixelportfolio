"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutList, Plus, ChevronDown, ExternalLink } from "lucide-react";

interface Folder {
  name: string;
  items: number;
}

interface Category {
  name: string;
  icon: React.ReactNode;
  folders: Folder[];
}

const categories: Category[] = [
  {
    name: "Graphics Design",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
    folders: [
      { name: "Logo Design", items: 8 },
      { name: "Branding", items: 5 },
      { name: "Illustrations", items: 12 },
      { name: "Posters", items: 6 },
      { name: "Social Media", items: 10 },
      { name: "Packaging", items: 4 },
    ],
  },
  {
    name: "Web Dev",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    folders: [
      { name: "E-commerce", items: 7 },
      { name: "Portfolio", items: 3 },
      { name: "Dashboard", items: 5 },
      { name: "Landing Pages", items: 9 },
      { name: "Blogs", items: 4 },
    ],
  },
  {
    name: "UI/UX Designer",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    folders: [
      { name: "Mobile Apps", items: 11 },
      { name: "Web Apps", items: 8 },
      { name: "Design Systems", items: 6 },
      { name: "Wireframes", items: 14 },
      { name: "Prototypes", items: 7 },
    ],
  },
];

interface ProjectsFileManagerProps {
  selectedCategory: string;
  openedFolder: string | null;
  onCategoryClick: (name: string) => void;
  onFolderClick: (folderName: string) => void;
}

interface FolderDetail {
  title: string;
  duration: string;
  type: string;
  description: string;
  liveUrl?: string;
}

const folderDetails: Record<string, FolderDetail> = {
  "Logo Design": {
    title: "Brand Identity System",
    duration: "2 Weeks",
    type: "Client",
    description: "Complete logo and visual identity design including color palette, typography, and brand guidelines for a modern tech startup.",
    liveUrl: "https://example.com/logo-design",
  },
  Branding: {
    title: "Luxury Brand Refresh",
    duration: "1 Month",
    type: "Project",
    description: "End-to-end branding for a luxury fashion house, covering stationery, packaging, and digital assets.",
    liveUrl: "https://example.com/branding",
  },
  Illustrations: {
    title: "Children's Book Illustrations",
    duration: "3 Weeks",
    type: "Self",
    description: "A series of playful, story-driven illustrations for an educational children's book series.",
    liveUrl: "https://example.com/illustrations",
  },
  Posters: {
    title: "Event Poster Campaign",
    duration: "5 Days",
    type: "Client",
    description: "High-impact poster designs for a music festival with bold typography and vibrant gradients.",
    liveUrl: "https://example.com/posters",
  },
  "Social Media": {
    title: "Social Media Kit",
    duration: "1 Week",
    type: "Project",
    description: "Templates and creative assets for consistent social media presence across multiple platforms.",
    liveUrl: "https://example.com/social-media",
  },
  Packaging: {
    title: "Product Packaging Design",
    duration: "2 Weeks",
    type: "Client",
    description: "Structural and visual packaging design for an organic skincare line with eco-friendly materials.",
    liveUrl: "https://example.com/packaging",
  },
  Ecommerce: {
    title: "E-commerce Platform UI",
    duration: "1 Month",
    type: "Client",
    description: "Full product browsing, checkout, and account experience for a multi-vendor marketplace.",
    liveUrl: "https://example.com/ecommerce",
  },
  Portfolio: {
    title: "Developer Portfolio",
    duration: "1 Week",
    type: "Self",
    description: "Minimal dark-themed portfolio with smooth transitions and project storytelling.",
    liveUrl: "https://example.com/portfolio",
  },
  Dashboard: {
    title: "Analytics Dashboard",
    duration: "3 Weeks",
    type: "Project",
    description: "Data-rich dashboard with charts, filters, and role-based views for SaaS operators.",
    liveUrl: "https://example.com/dashboard",
  },
  "Landing Pages": {
    title: "SaaS Landing Page",
    duration: "4 Days",
    type: "Client",
    description: "Conversion-focused landing page with hero, features, pricing, and FAQ sections.",
    liveUrl: "https://example.com/landing-pages",
  },
  Blogs: {
    title: "Editorial Blog Layout",
    duration: "1 Week",
    type: "Self",
    description: "Clean typography-first blog template optimized for readability and content sharing.",
    liveUrl: "https://example.com/blogs",
  },
  "Mobile Apps": {
    title: "Fitness Mobile App",
    duration: "1 Month",
    type: "Project",
    description: "Mobile UX for workout tracking, nutrition logging, and progress insights.",
    liveUrl: "https://example.com/mobile-apps",
  },
  "Web Apps": {
    title: "Project Management Tool",
    duration: "1 Month",
    type: "Client",
    description: "Task boards, timelines, and collaboration features for distributed teams.",
    liveUrl: "https://example.com/web-apps",
  },
  "Design Systems": {
    title: "Component Design System",
    duration: "2 Months",
    type: "Client",
    description: "Reusable UI components, tokens, and documentation for consistent product design.",
    liveUrl: "https://example.com/design-systems",
  },
  Wireframes: {
    title: "Banking App Wireframes",
    duration: "2 Weeks",
    type: "Project",
    description: "Low-fidelity wireframes exploring user flows for transfers, statements, and card management.",
    liveUrl: "https://example.com/wireframes",
  },
  Prototypes: {
    title: "Travel App Prototype",
    duration: "3 Weeks",
    type: "Self",
    description: "Interactive prototype validating booking flows and destination discovery interactions.",
    liveUrl: "https://example.com/prototypes",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 } as const,
  },
} as const;

const detailsVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 } as const,
  },
  exit: {
    opacity: 0,
    x: 30,
    transition: { duration: 0.15 } as const,
  },
} as const;

export default function ProjectsFileManager({
  selectedCategory,
  openedFolder,
  onCategoryClick,
  onFolderClick,
}: ProjectsFileManagerProps) {
  const [showDetails, setShowDetails] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const currentCategory = categories.find((c) => c.name === selectedCategory) || categories[0];
  const opened = currentCategory.folders.find((f) => f.name === openedFolder);
  const detailItems = opened
    ? Array.from({ length: opened.items }, (_, i) => ({
        name: `File ${i + 1}`,
        type: "File",
        dateModified: "2025-08-14",
        size: `${((i * 7 + 3) % 10 + 1).toFixed(1)} MB`,
      }))
    : [];

  const handleFolderClick = (name: string) => {
    setSelectedFolder(name);
  };

  const handleFolderDoubleClick = (name: string) => {
    onFolderClick(name);
  };

  const selectedDetail = selectedFolder ? folderDetails[selectedFolder] : null;

  return (
    <div className="flex h-full">
      <div className="w-52 bg-[#0f1924] border-r border-gray-700 overflow-y-auto p-1.5 shrink-0">
        {categories.map((category) => {
          const isActive = selectedCategory === category.name;
          return (
            <motion.button
              key={category.name}
              onClick={() => onCategoryClick(category.name)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 mb-0.5 transition-colors text-left"
              style={{
                backgroundColor: isActive ? "var(--accent-dim)" : "transparent",
                color: isActive ? "var(--accent)" : "#d1d5db",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
                {category.icon}
              </div>
              <span className="text-sm truncate">{category.name}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-[#151F27]">
        <div className="h-9 bg-[#1a2332] border-b border-gray-700 flex items-center px-2 gap-2">
          <div className="flex items-center gap-2 px-2 py-1 border border-gray-600 bg-[#0f1924] flex-1 max-w-xl">
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-200 placeholder:text-gray-500"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 flex items-center justify-center border border-gray-600 hover:text-gray-200 transition-colors"
              style={{ borderRadius: 0 }}
              title="New"
            >
              <Plus className="w-3.5 h-3.5 text-gray-400" />
            </motion.button>
            <div className="relative">
              <motion.button
                onClick={() => setSortOpen((v) => !v)}
                className="h-7 px-2 flex items-center justify-center gap-1 border border-gray-600 hover:text-gray-200 transition-colors"
                style={{ borderRadius: 0 }}
                title="Sort by"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xs text-gray-400">Sort by</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </motion.button>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full mt-1 w-40 bg-[#1a2332] border border-gray-700 shadow-lg z-50"
                  style={{ borderRadius: 0 }}
                >
                  {["Name", "Date modified", "Size", "Type"].map((item) => (
                    <motion.button
                      key={item}
                      className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-[#0f1924] transition-colors"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {item}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
            <motion.button
              onClick={() => setShowDetails((v) => !v)}
              className={`w-7 h-7 flex items-center justify-center border transition-colors ${
                showDetails ? "accent-border bg-[#151F27] accent-text" : "border-gray-600 text-gray-400 hover:text-gray-200"
              }`}
              style={{ borderRadius: 0 }}
              title="Details pane"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <LayoutList className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          <motion.div
            className="flex-1 overflow-auto p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {!openedFolder ? (
              <motion.div
                className="grid grid-cols-4 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={selectedCategory}
              >
                {currentCategory.folders.map((folder) => (
                  <motion.button
                    key={folder.name}
                    onClick={() => handleFolderClick(folder.name)}
                    onDoubleClick={() => handleFolderDoubleClick(folder.name)}
                    variants={itemVariants}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="flex flex-col items-center gap-2 p-3 border border-transparent transition-colors group"
                    style={{
                      borderColor: selectedFolder === folder.name ? "var(--accent-border)" : undefined,
                    }}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget;
                      target.style.borderColor = "var(--accent-border)";
                      target.style.backgroundColor = "var(--accent-dim)";
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget;
                      if (selectedFolder !== folder.name) {
                        target.style.borderColor = "transparent";
                        target.style.backgroundColor = "transparent";
                      } else {
                        target.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-yellow-500 group-hover:scale-110 transition-transform">
                      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" fill="rgba(234,179,8,0.15)" />
                    </svg>
                    <span className="text-sm text-gray-200 text-center break-words w-full">{folder.name}</span>
                    <span className="text-xs text-gray-500">{folder.items} items</span>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                key={`${selectedCategory}-${openedFolder}`}
              >
                {Array.from({ length: currentCategory.folders.find((f) => f.name === openedFolder)?.items || 0 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03, type: "spring", stiffness: 260, damping: 20 }}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget;
                      target.style.borderColor = "var(--accent-border)";
                      target.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget;
                      target.style.borderColor = "";
                      target.style.color = "";
                    }}
                    className="flex flex-col items-center gap-2 p-3 border border-dashed border-gray-600 text-gray-500 cursor-pointer transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span className="text-xs">File {i + 1}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                key="details-panel"
                className="w-56 bg-[#0f1924] border-l border-gray-700 overflow-y-auto shrink-0"
                variants={detailsVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="p-2 border-b border-gray-700">
                  <div className="flex items-center gap-2 px-2 py-1">
                    <LayoutList className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Details</span>
                  </div>
                </div>
                <motion.div
                  className="p-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {!selectedFolder ? (
                    <div className="text-xs text-gray-500 px-1">Select a folder to view details.</div>
                  ) : selectedDetail ? (
                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div>
                        <div className="text-xs font-semibold text-gray-400 mb-1">Title</div>
                        <div className="text-xs text-gray-200">{selectedDetail.title}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-400 mb-1">Duration</div>
                        <div className="text-xs text-gray-200">{selectedDetail.duration}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-400 mb-1">Type</div>
                        <div className="text-xs text-gray-200">{selectedDetail.type}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-400 mb-1">Description</div>
                        <div className="text-xs text-gray-300 leading-relaxed">{selectedDetail.description}</div>
                      </div>
                      {selectedDetail.liveUrl && (
                        <a
                          href={selectedDetail.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs text-gray-200 transition-colors"
                          style={{ borderRadius: 0, borderColor: "var(--accent-border)", backgroundColor: "transparent" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--accent-dim)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live</span>
                        </a>
                      )}
                    </motion.div>
                  ) : (
                    <div className="text-xs text-gray-500 px-1">No details available.</div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
