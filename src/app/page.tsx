"use client";

import { useState, useEffect } from "react";
import Background from "@/components/Background";
import Taskbar from "@/components/Taskbar";
import Window from "@/components/Window";
import FileManagerWindow from "@/components/windows/FileManagerWindow";
import DesktopIcon from "@/components/DesktopIcon";
import LoginScreen from "@/components/LoginScreen";
import DesktopContextMenu from "@/components/context menu/DesktopContextMenu";
import TaskbarContextMenu from "@/components/context menu/TaskbarContextMenu";
import CmdWindow from "@/components/CmdWindow";
import StartButtonContextMenu from "@/components/context menu/StartButtonContextMenu";
import DesktopIconContextMenu from "@/components/context menu/DesktopIconContextMenu";
import DeleteConfirmationPopup from "@/components/popups/DeleteConfirmationPopup";
import OperaAbout from "@/components/windows/OperaAbout";
import PersonalizationWindow from "@/components/windows/PersonalizationWindow";
import ProjectsFileManager from "@/components/windows/ProjectsFileManager";
import { SkillsImageIcon, AboutMeImageIcon, ProjectsImageIcon, ContactImageIcon, ResumeImageIcon } from "@/components/WindowsIcons";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [taskbarContextMenu, setTaskbarContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [startButtonContextMenuOpen, setStartButtonContextMenuOpen] = useState(false);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [copiedIcon, setCopiedIcon] = useState<{ id: string; label: string; icon: React.ReactNode; windowId: string } | null>(null);
  const [iconContextMenu, setIconContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; x: number; y: number } | null>(null);
  const [projectsState, setProjectsState] = useState<Record<string, { selectedCategory: string; openedFolder: string | null; path: string }>>({});

  interface DesktopIconData {
    id: string;
    label: string;
    icon: React.ReactNode;
    windowId: string;
    position: { x: number; y: number };
  }

  const [desktopIcons, setDesktopIcons] = useState<DesktopIconData[]>([
    { id: "about", label: "About Me", icon: <AboutMeImageIcon className="w-full h-full" />, windowId: "about", position: { x: 20, y: 20 } },
    { id: "projects", label: "Projects", icon: <ProjectsImageIcon className="w-full h-full" />, windowId: "projects", position: { x: 20, y: 120 } },
    { id: "skills", label: "Skills", icon: <SkillsImageIcon className="w-full h-full" />, windowId: "skills", position: { x: 20, y: 220 } },
    { id: "contact", label: "Contact", icon: <ContactImageIcon className="w-full h-full" />, windowId: "contact", position: { x: 20, y: 320 } },
    { id: "resume", label: "Resume", icon: <ResumeImageIcon className="w-full h-full" />, windowId: "resume", position: { x: 20, y: 420 } },
  ]);

  const handleWindowFocus = (id: string) => {
    setActiveWindow(id);
  };

  const handleIconContextMenu = (id: string, x: number, y: number) => {
    setIconContextMenu({ id, x, y });
  };

  const handleIconOpen = (id: string) => {
    const icon = desktopIcons.find((i) => i.id === id);
    if (icon) {
      openWindow(icon.windowId);
    }
  };

  const handleIconCopy = (id: string) => {
    const icon = desktopIcons.find((i) => i.id === id);
    if (icon) {
      setCopiedIcon({ id: icon.id, label: icon.label, icon: icon.icon, windowId: icon.windowId });
    }
  };

  const handleIconRename = (id: string) => {
    const icon = desktopIcons.find((i) => i.id === id);
    if (icon) {
      setRenamingId(id);
      setRenameValue(icon.label);
    }
  };

  const handleIconDelete = (id: string) => {
    const icon = desktopIcons.find((i) => i.id === id);
    if (icon) {
      setDeleteConfirm({ id: icon.id, x: icon.position.x + 100, y: icon.position.y + 100 });
    }
    if (renamingId === id) {
      setRenamingId(null);
      setRenameValue("");
    }
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setDesktopIcons((prev) => prev.filter((icon) => icon.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  const handleRenameSubmit = () => {
    if (renamingId && renameValue.trim()) {
      setDesktopIcons((prev) =>
        prev.map((icon) =>
          icon.id === renamingId ? { ...icon, label: renameValue.trim() } : icon
        )
      );
    }
    setRenamingId(null);
    setRenameValue("");
  };

  const handlePasteIcon = () => {
    if (!copiedIcon) return;
    const copyCount = desktopIcons.filter((i) => i.label.startsWith(copiedIcon.label + " - Copy")).length + 1;
    const baseX = contextMenu ? contextMenu.x : 20;
    const baseY = contextMenu ? contextMenu.y : 20;
    const newIcon: DesktopIconData = {
      id: `${copiedIcon.id}-copy-${Date.now()}`,
      label: `${copiedIcon.label} - Copy (${copyCount})`,
      icon: copiedIcon.icon,
      windowId: copiedIcon.windowId,
      position: { x: baseX, y: baseY },
    };
    setDesktopIcons((prev) => [...prev, newIcon]);
    setCopiedIcon(null);
    setContextMenu(null);
  };

  const handleStartButtonContextMenuSelect = (item: string) => {
    switch (item) {
      case "about":
        openWindow("about");
        break;
      case "projects":
        openWindow("projects");
        break;
      case "version":
        openWindow("cmd");
        break;
      default:
        break;
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  interface WindowInstance {
    id: string;
    type: string;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    positionOffset: number;
  }

  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [windowIdCounter, setWindowIdCounter] = useState(0);

  const openWindow = (type: string) => {
    const id = `${type}-${windowIdCounter}`;
    setWindowIdCounter((prev) => prev + 1);
    const existingCount = windows.filter((w) => w.type === type).length;
    const positionOffsets: Record<string, { x: number; y: number }> = {
      about: { x: 300, y: 150 },
      projects: { x: 500, y: 200 },
      skills: { x: 400, y: 180 },
      contact: { x: 350, y: 220 },
      resume: { x: 450, y: 160 },
      cmd: { x: 250, y: 150 },
      personalization: { x: 400, y: 150 },
    };
    const basePos = positionOffsets[type] || { x: 300, y: 150 };
    const newWindow: WindowInstance = {
      id,
      type,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      positionOffset: existingCount * 30,
    };
    setWindows((prev) => [...prev, newWindow]);
    handleWindowFocus(id);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const toggleMinimize = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w))
    );
  };

  const toggleMaximize = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const handlePersonalize = () => {
    openWindow("personalization");
    setContextMenu(null);
  };

  const [selectedBackground, setSelectedBackground] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selected-background") || "/wallpaper/wallpaper2.mp4";
    }
      return "/wallpaper/wallpaper1.mp4";
  });

  const handleBackgroundSelect = (src: string) => {
    setSelectedBackground(src);
    localStorage.setItem("selected-background", src);
  };

  const [iconPositions, setIconPositions] = useState<{ [key: string]: { x: number; y: number } }>({
    about: { x: 20, y: 20 },
    projects: { x: 20, y: 120 },
    skills: { x: 20, y: 220 },
    contact: { x: 20, y: 320 },
    resume: { x: 20, y: 420 },
  });

  const handleIconDragEnd = (name: string, position: { x: number; y: number }) => {
    setIconPositions((prev) => ({
      ...prev,
      [name]: position,
    }));
  };

  useEffect(() => {
    const handleClick = () => {
      if (contextMenu) {
        setContextMenu(null);
      }
      if (taskbarContextMenu) {
        setTaskbarContextMenu(null);
      }
      if (startButtonContextMenuOpen) {
        setStartButtonContextMenuOpen(false);
      }
      if (iconContextMenu) {
        setIconContextMenu(null);
      }
      if (deleteConfirm) {
        setDeleteConfirm(null);
      }
    };

    if (contextMenu || taskbarContextMenu || startButtonContextMenuOpen || iconContextMenu || deleteConfirm) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [contextMenu, taskbarContextMenu, startButtonContextMenuOpen, iconContextMenu, deleteConfirm]);

  const taskbarWindows = windows.map((w) => {
    const titles: Record<string, string> = {
      about: "About Me",
      projects: "Projects",
      skills: "Skills",
      contact: "Contact",
      resume: "Resume",
      cmd: "Version",
    };
    const icons: Record<string, React.ReactNode> = {
      about: <AboutMeImageIcon className="w-full h-full" />,
      projects: <ProjectsImageIcon className="w-full h-full" />,
      skills: <SkillsImageIcon className="w-full h-full" />,
      contact: <ContactImageIcon className="w-full h-full" />,
      resume: <ResumeImageIcon className="w-full h-full" />,
      cmd: (
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <rect x="3" y="3" width="18" height="18" stroke="var(--accent)" strokeWidth="2" />
          <line x1="7" y1="8" x2="17" y2="8" stroke="var(--accent)" strokeWidth="2" />
          <line x1="7" y1="12" x2="17" y2="12" stroke="var(--accent)" strokeWidth="2" />
          <line x1="7" y1="16" x2="13" y2="16" stroke="var(--accent)" strokeWidth="2" />
        </svg>
      ),
    };
    return {
      id: w.id,
      title: titles[w.type] || w.type,
      icon: icons[w.type] || null,
      isOpen: w.isOpen,
      isMinimized: w.isMinimized,
    };
  });

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Background key={selectedBackground} src={selectedBackground} />

      <div className="relative z-10 w-full h-full pb-12" onContextMenu={handleContextMenu}>
        <div className="relative w-full h-full">
          {desktopIcons.map((iconData) => (
            <DesktopIcon
              key={iconData.id}
              label={iconData.label}
              icon={iconData.icon}
              onDoubleClick={() => handleIconOpen(iconData.id)}
              position={iconData.position}
              onDragEnd={(pos) => {
                setDesktopIcons((prev) =>
                  prev.map((icon) => (icon.id === iconData.id ? { ...icon, position: pos } : icon))
                );
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleIconContextMenu(iconData.id, e.clientX, e.clientY);
              }}
              isRenaming={renamingId === iconData.id}
              renameValue={renameValue}
              onRenameChange={setRenameValue}
              onRenameSubmit={handleRenameSubmit}
            />
          ))}
        </div>

        {windows.map((win) => {
          const basePosition: Record<string, { x: number; y: number }> = {
            about: { x: 300, y: 150 },
            projects: {
              x: Math.max(0, (typeof window !== "undefined" ? window.innerWidth : 1920) - 1050) / 2,
              y: Math.max(0, (typeof window !== "undefined" ? window.innerHeight : 1080) - 650) / 2,
            },
            skills: { x: 400, y: 180 },
            contact: { x: 350, y: 220 },
            resume: { x: 450, y: 160 },
            cmd: { x: 250, y: 150 },
          };
          const basePos = basePosition[win.type] || { x: 300, y: 150 };
          const offset = win.positionOffset || 0;
          const position = { x: basePos.x + offset, y: basePos.y + offset };

          if (win.type === "cmd") {
            return (
              <CmdWindow
                key={win.id}
                initialPosition={position}
                initialSize={{ width: 620, height: 420 }}
                title="Version"
                initialLines={[
                  "Portfolio XP [Version 1.0.0]",
                  "(c) Aman Kumar. All rights reserved.",
                  "",
                  "This Windows-style portfolio was built with:",
                  "  - Next.js 16",
                  "  - React 19",
                  "  - Tailwind CSS v4",
                  "  - Framer Motion",
                  "  - TypeScript",
                  "",
                  "Designed & Developed by Aman Kumar",
                  "Visual Designer & Developer",
                ]}
                onClose={() => closeWindow(win.id)}
                onMinimize={() => toggleMinimize(win.id)}
                isMinimized={win.isMinimized}
                zIndex={activeWindow === win.id ? 100 : 10}
                onFocus={() => handleWindowFocus(win.id)}
              />
            );
          }

          const iconMap: Record<string, React.ReactNode> = {
            about: <AboutMeImageIcon className="w-4 h-4" />,
            projects: <ProjectsImageIcon className="w-4 h-4" />,
            skills: <SkillsImageIcon className="w-4 h-4" />,
            contact: <ContactImageIcon className="w-4 h-4" />,
            resume: <ResumeImageIcon className="w-4 h-4" />,
          };

          const titles: Record<string, string> = {
            about: "About Me",
            projects: "Projects",
            skills: "Skills",
            contact: "Contact",
            resume: "Resume",
            cmd: "Version",
          };

          const sidebarItemsMap: Record<string, Array<{ label: string; icon: React.ReactNode; active?: boolean }>> = {
            about: [
              { label: "Home", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, active: true },
              { label: "Desktop", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg> },
              { label: "Downloads", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg> },
            ],
            projects: [],
            skills: [
              { label: "Home", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
              { label: "Skills", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>, active: true },
              { label: "Technologies", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg> },
            ],
            contact: [
              { label: "Home", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
              { label: "Contact", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>, active: true },
              { label: "Social", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg> },
            ],
            resume: [
              { label: "Home", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
              { label: "Experience", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>, active: true },
              { label: "Education", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg> },
            ],
          };

          const contentMap: Record<string, React.ReactNode> = {
            about: (
              <div className="p-4 space-y-4">
                <h2 className="text-2xl font-bold accent-text">Hello, I&apos;m a Designer</h2>
                <p className="text-gray-300 font-light">
                  I create beautiful and functional user experiences. Welcome to my portfolio!
                </p>
              </div>
            ),
            projects: (
              <ProjectsFileManager
                selectedCategory={projectsState[win.id]?.selectedCategory || "Graphics Design"}
                openedFolder={projectsState[win.id]?.openedFolder || null}
                onCategoryClick={(name) =>
                  setProjectsState((prev) => ({
                    ...prev,
                    [win.id]: { selectedCategory: name, openedFolder: null, path: `Projects > ${name}` },
                  }))
                }
                onFolderClick={(folderName) =>
                  setProjectsState((prev) => ({
                    ...prev,
                    [win.id]: {
                      ...prev[win.id],
                      openedFolder: folderName,
                      path: `Projects > ${prev[win.id]?.selectedCategory || "Graphics Design"} > ${folderName}`,
                    },
                  }))
                }
              />
            ),
            skills: (
              <div className="p-4 space-y-4">
                <h2 className="text-2xl font-bold accent-text">Skills</h2>
                <p className="text-gray-300 font-light">My technical and design skills.</p>
              </div>
            ),
            contact: (
              <div className="p-4 space-y-4">
                <h2 className="text-2xl font-bold accent-text">Contact</h2>
                <p className="text-gray-300 font-light">Get in touch with me.</p>
              </div>
            ),
            resume: (
              <div className="p-4 space-y-4">
                <h2 className="text-2xl font-bold accent-text">Resume</h2>
                <p className="text-gray-300 font-light">My resume and work experience.</p>
              </div>
            ),
          };

          if (win.type === "cmd") {
            return null; // already handled above
          }

          if (win.type === "about") {
            return (
              <OperaAbout
                key={win.id}
                initialPosition={position}
                initialSize={{ width: 900, height: 600 }}
                onClose={() => closeWindow(win.id)}
                onMinimize={() => toggleMinimize(win.id)}
                onMaximize={() => toggleMaximize(win.id)}
                isMinimized={win.isMinimized}
                isMaximized={win.isMaximized}
                zIndex={activeWindow === win.id ? 100 : 10}
                onFocus={() => handleWindowFocus(win.id)}
              />
            );
          }

          if (win.type === "personalization") {
            return (
              <PersonalizationWindow
                key={win.id}
                initialPosition={position}
                initialSize={{ width: 850, height: 550 }}
                onClose={() => closeWindow(win.id)}
                onMinimize={() => toggleMinimize(win.id)}
                isMinimized={win.isMinimized}
                zIndex={activeWindow === win.id ? 100 : 10}
                onFocus={() => handleWindowFocus(win.id)}
                selectedBackground={selectedBackground}
                onBackgroundSelect={handleBackgroundSelect}
              />
            );
          }

          const isFileManager = !["cmd", "about", "personalization"].includes(win.type);

          return (
            <FileManagerWindow
              key={win.id}
              title={titles[win.type] || win.type}
              icon={iconMap[win.type] || null}
              initialPosition={position}
              initialSize={
                win.type === "projects"
                  ? { width: 1050, height: 650 }
                  : { width: 850, height: 550 }
              }
              onClose={() => closeWindow(win.id)}
              onMinimize={() => toggleMinimize(win.id)}
              onMaximize={() => toggleMaximize(win.id)}
              isMinimized={win.isMinimized}
              isMaximized={isFileManager ? win.isMaximized : undefined}
              zIndex={activeWindow === win.id ? 100 : 10}
              onFocus={() => handleWindowFocus(win.id)}
              sidebarItems={sidebarItemsMap[win.type] || []}
              addressPath={win.type === "projects" ? (projectsState[win.id]?.path || "Projects") : undefined}
              onBack={win.type === "projects" ? () => setProjectsState((prev) => ({ ...prev, [win.id]: { ...prev[win.id], openedFolder: null, path: `Projects > ${prev[win.id]?.selectedCategory || "Graphics Design"}` } })) : undefined}
              onForward={undefined}
              onUp={win.type === "projects" ? () => setProjectsState((prev) => ({ ...prev, [win.id]: { ...prev[win.id], openedFolder: null, path: `Projects > ${prev[win.id]?.selectedCategory || "Graphics Design"}` } })) : undefined}
              showSearchBar={win.type !== "projects"}
            >
              {contentMap[win.type] || null}
            </FileManagerWindow>
          );
        })}
      </div>

      <Taskbar
        windows={taskbarWindows}
        onToggleMinimize={toggleMinimize}
        onTaskbarContextMenu={(id, x) => setTaskbarContextMenu({ id, x, y: 0 })}
        onStartButtonContextMenu={() => setStartButtonContextMenuOpen((prev) => !prev)}
        startButtonContextMenuOpen={startButtonContextMenuOpen}
      />

      {contextMenu && (
        <DesktopContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onCheckVersion={() => {
            openWindow("cmd");
            setContextMenu(null);
          }}
          onPersonalize={handlePersonalize}
          onPaste={handlePasteIcon}
          showPaste={!!copiedIcon}
        />
      )}

      {taskbarContextMenu && (
        <TaskbarContextMenu
          x={taskbarContextMenu.x}
          windowId={taskbarContextMenu.id}
          windowTitle={taskbarWindows.find((w) => w.id === taskbarContextMenu.id)?.title || ""}
          onClose={() => setTaskbarContextMenu(null)}
          onCloseWindow={closeWindow}
        />
      )}

      {iconContextMenu && (
        <DesktopIconContextMenu
          x={iconContextMenu.x}
          y={iconContextMenu.y}
          onClose={() => setIconContextMenu(null)}
          onOpen={() => handleIconOpen(iconContextMenu.id)}
          onCopy={() => handleIconCopy(iconContextMenu.id)}
          onRename={() => handleIconRename(iconContextMenu.id)}
          onDelete={() => handleIconDelete(iconContextMenu.id)}
          onProperties={() => {}}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmationPopup
          onClose={() => setDeleteConfirm(null)}
          onConfirm={confirmDelete}
        />
      )}

      {startButtonContextMenuOpen && (
        <StartButtonContextMenu
          onClose={() => setStartButtonContextMenuOpen(false)}
          onSelect={handleStartButtonContextMenuSelect}
        />
      )}

      {!isLoggedIn && (
        <LoginScreen onLogin={async () => {
          await toggleFullscreen();
          setIsLoggedIn(true);
        }} />
      )}
    </div>
  );
}
