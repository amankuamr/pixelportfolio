"use client";

import { useState, useEffect } from "react";
import Background from "@/components/Background";
import Taskbar from "@/components/Taskbar";
import Window from "@/components/Window";
import FileManagerWindow from "@/components/FileManagerWindow";
import DesktopIcon from "@/components/DesktopIcon";
import LoginScreen from "@/components/LoginScreen";
import DesktopContextMenu from "@/components/context menu/DesktopContextMenu";
import TaskbarContextMenu from "@/components/context menu/TaskbarContextMenu";
import CmdWindow from "@/components/CmdWindow";
import StartButtonContextMenu from "@/components/context menu/StartButtonContextMenu";
import { SkillsImageIcon, AboutMeImageIcon, ProjectsImageIcon, ContactImageIcon, ResumeImageIcon } from "@/components/WindowsIcons";
import { ChevronLeft, ChevronRight, ChevronUp, Search } from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [taskbarContextMenu, setTaskbarContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [startButtonContextMenuOpen, setStartButtonContextMenuOpen] = useState(false);

  const handleStartButtonContextMenuSelect = (item: string) => {
    switch (item) {
      case "about":
        toggleWindow("about");
        break;
      case "projects":
        toggleWindow("projects");
        break;
      case "version":
        toggleWindow("cmd");
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

  const [windows, setWindows] = useState({
    about: { isOpen: false, isMinimized: false },
    projects: { isOpen: false, isMinimized: false },
    skills: { isOpen: false, isMinimized: false },
    contact: { isOpen: false, isMinimized: false },
    resume: { isOpen: false, isMinimized: false },
    cmd: { isOpen: false, isMinimized: false },
  });

  const toggleWindow = (name: keyof typeof windows) => {
    setWindows((prev) => ({
      ...prev,
      [name]: { ...prev[name], isOpen: !prev[name].isOpen, isMinimized: false },
    }));
  };

  const closeWindow = (name: string) => {
    setWindows((prev) => ({
      ...prev,
      [name as keyof typeof windows]: { ...prev[name as keyof typeof windows], isOpen: false, isMinimized: false },
    }));
  };

  const toggleMinimize = (name: string) => {
    setWindows((prev) => ({
      ...prev,
      [name]: { ...prev[name as keyof typeof prev], isMinimized: !prev[name as keyof typeof prev].isMinimized },
    }));
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
    };

    if (contextMenu || taskbarContextMenu || startButtonContextMenuOpen) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [contextMenu, taskbarContextMenu, startButtonContextMenuOpen]);

  const taskbarWindows = [
    { id: "about" as const, title: "About Me", icon: <AboutMeImageIcon className="w-full h-full" />, isOpen: windows.about.isOpen, isMinimized: windows.about.isMinimized },
    { id: "projects" as const, title: "Projects", icon: <ProjectsImageIcon className="w-full h-full" />, isOpen: windows.projects.isOpen, isMinimized: windows.projects.isMinimized },
    { id: "skills" as const, title: "Skills", icon: <SkillsImageIcon className="w-full h-full" />, isOpen: windows.skills.isOpen, isMinimized: windows.skills.isMinimized },
    { id: "contact" as const, title: "Contact", icon: <ContactImageIcon className="w-full h-full" />, isOpen: windows.contact.isOpen, isMinimized: windows.contact.isMinimized },
    { id: "resume" as const, title: "Resume", icon: <ResumeImageIcon className="w-full h-full" />, isOpen: windows.resume.isOpen, isMinimized: windows.resume.isMinimized },
    { id: "cmd" as const, title: "Version", icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <rect x="3" y="3" width="18" height="18" stroke="#D9FF00" strokeWidth="2" />
        <line x1="7" y1="8" x2="17" y2="8" stroke="#D9FF00" strokeWidth="2" />
        <line x1="7" y1="12" x2="17" y2="12" stroke="#D9FF00" strokeWidth="2" />
        <line x1="7" y1="16" x2="13" y2="16" stroke="#D9FF00" strokeWidth="2" />
      </svg>
    ), isOpen: windows.cmd.isOpen, isMinimized: windows.cmd.isMinimized },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Background />

      <div className="relative z-10 w-full h-full pb-12" onContextMenu={handleContextMenu}>
        <div className="relative w-full h-full">
          <DesktopIcon label="About Me" icon={<AboutMeImageIcon className="w-full h-full" />} onClick={() => toggleWindow("about")} position={iconPositions.about} onDragEnd={(pos) => handleIconDragEnd("about", pos)} />
          <DesktopIcon label="Projects" icon={<ProjectsImageIcon className="w-full h-full" />} onClick={() => toggleWindow("projects")} position={iconPositions.projects} onDragEnd={(pos) => handleIconDragEnd("projects", pos)} />
          <DesktopIcon label="Skills" icon={<SkillsImageIcon className="w-full h-full" />} onClick={() => toggleWindow("skills")} position={iconPositions.skills} onDragEnd={(pos) => handleIconDragEnd("skills", pos)} />
          <DesktopIcon label="Contact" icon={<ContactImageIcon className="w-full h-full" />} onClick={() => toggleWindow("contact")} position={iconPositions.contact} onDragEnd={(pos) => handleIconDragEnd("contact", pos)} />
          <DesktopIcon label="Resume" icon={<ResumeImageIcon className="w-full h-full" />} onClick={() => toggleWindow("resume")} position={iconPositions.resume} onDragEnd={(pos) => handleIconDragEnd("resume", pos)} />
        </div>

        {windows.about.isOpen && (
          <FileManagerWindow
            title="About Me"
            icon={<AboutMeImageIcon className="w-4 h-4" />}
            initialPosition={{ x: 300, y: 150 }}
            initialSize={{ width: 850, height: 550 }}
            onClose={() => toggleWindow("about")}
            onMinimize={() => toggleMinimize("about")}
            isMinimized={windows.about.isMinimized}
            sidebarItems={[
              { label: "Home", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, active: true },
              { label: "Desktop", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg> },
              { label: "Downloads", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg> },
            ]}
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#D9FF00]">Hello, I&apos;m a Designer</h2>
              <p className="text-gray-300 font-light">
                I create beautiful and functional user experiences. Welcome to my portfolio!
              </p>
            </div>
          </FileManagerWindow>
        )}

        {windows.projects.isOpen && (
          <FileManagerWindow
            title="Projects"
            icon={<ProjectsImageIcon className="w-4 h-4" />}
            initialPosition={{ x: 500, y: 200 }}
            initialSize={{ width: 850, height: 550 }}
            onClose={() => toggleWindow("projects")}
            onMinimize={() => toggleMinimize("projects")}
            isMinimized={windows.projects.isMinimized}
            sidebarItems={[
              { label: "Home", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
              { label: "Projects", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" /></svg>, active: true },
              { label: "Recent", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
            ]}
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#D9FF00]">My Projects</h2>
              <p className="text-gray-300 font-light">Check out my latest work here.</p>
            </div>
          </FileManagerWindow>
        )}

        {windows.skills.isOpen && (
          <FileManagerWindow
            title="Skills"
            icon={<SkillsImageIcon className="w-4 h-4" />}
            initialPosition={{ x: 400, y: 180 }}
            initialSize={{ width: 850, height: 550 }}
            onClose={() => toggleWindow("skills")}
            onMinimize={() => toggleMinimize("skills")}
            isMinimized={windows.skills.isMinimized}
            sidebarItems={[
              { label: "Home", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
              { label: "Skills", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>, active: true },
              { label: "Technologies", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg> },
            ]}
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#D9FF00]">Skills</h2>
              <p className="text-gray-300 font-light">My technical and design skills.</p>
            </div>
          </FileManagerWindow>
        )}

        {windows.contact.isOpen && (
          <FileManagerWindow
            title="Contact"
            icon={<ContactImageIcon className="w-4 h-4" />}
            initialPosition={{ x: 350, y: 220 }}
            initialSize={{ width: 850, height: 550 }}
            onClose={() => toggleWindow("contact")}
            onMinimize={() => toggleMinimize("contact")}
            isMinimized={windows.contact.isMinimized}
            sidebarItems={[
              { label: "Home", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
              { label: "Contact", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>, active: true },
              { label: "Social", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg> },
            ]}
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#D9FF00]">Contact</h2>
              <p className="text-gray-300 font-light">Get in touch with me.</p>
            </div>
          </FileManagerWindow>
        )}

        {windows.resume.isOpen && (
          <FileManagerWindow
            title="Resume"
            icon={<ResumeImageIcon className="w-4 h-4" />}
            initialPosition={{ x: 450, y: 160 }}
            initialSize={{ width: 850, height: 550 }}
            onClose={() => toggleWindow("resume")}
            onMinimize={() => toggleMinimize("resume")}
            isMinimized={windows.resume.isMinimized}
            sidebarItems={[
              { label: "Home", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
              { label: "Experience", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>, active: true },
              { label: "Education", icon: <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg> },
            ]}
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#D9FF00]">Resume</h2>
              <p className="text-gray-300 font-light">My resume and work experience.</p>
            </div>
          </FileManagerWindow>
        )}

        {windows.cmd.isOpen && (
          <CmdWindow
            initialPosition={{ x: 250, y: 150 }}
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
            onClose={() => toggleWindow("cmd")}
            onMinimize={() => toggleMinimize("cmd")}
            isMinimized={windows.cmd.isMinimized}
          />
        )}
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
            toggleWindow("cmd");
            setContextMenu(null);
          }}
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
