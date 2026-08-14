"use client";

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

export default function ProjectsFileManager({
  selectedCategory,
  openedFolder,
  onCategoryClick,
  onFolderClick,
}: ProjectsFileManagerProps) {
  const currentCategory = categories.find((c) => c.name === selectedCategory) || categories[0];

  return (
    <div className="flex h-full">
      <div className="w-52 bg-[#0f1924] border-r border-gray-700 overflow-y-auto p-1.5 shrink-0">
        {categories.map((category) => {
          const isActive = selectedCategory === category.name;
          return (
            <button
              key={category.name}
              onClick={() => onCategoryClick(category.name)}
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
                {category.icon}
              </div>
              <span className="text-sm truncate">{category.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-[#151F27]">
        <div className="flex-1 overflow-auto p-4">
          {!openedFolder ? (
            <div className="grid grid-cols-4 gap-4">
              {currentCategory.folders.map((folder) => (
                <button
                  key={folder.name}
                  onClick={() => onFolderClick(folder.name)}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget;
                    target.style.borderColor = "var(--accent-border)";
                    target.style.backgroundColor = "var(--accent-dim)";
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    target.style.borderColor = "transparent";
                    target.style.backgroundColor = "transparent";
                  }}
                  className="flex flex-col items-center gap-2 p-3 border border-transparent transition-colors group"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-yellow-500 group-hover:scale-110 transition-transform">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" fill="rgba(234,179,8,0.15)" />
                  </svg>
                  <span className="text-sm text-gray-200 text-center break-words w-full">{folder.name}</span>
                  <span className="text-xs text-gray-500">{folder.items} items</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: currentCategory.folders.find((f) => f.name === openedFolder)?.items || 0 }).map((_, i) => (
                  <div
                    key={i}
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
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
