"use client";

import { useState, useEffect } from "react";
import Background from "@/components/Background";
import Taskbar from "@/components/Taskbar";
import Window from "@/components/Window";
import DesktopIcon from "@/components/DesktopIcon";
import LoginScreen from "@/components/LoginScreen";
import DesktopContextMenu from "@/components/context menu/DesktopContextMenu";
import TaskbarContextMenu from "@/components/context menu/TaskbarContextMenu";
import CmdWindow from "@/components/CmdWindow";
import StartButtonContextMenu from "@/components/context menu/StartButtonContextMenu";
import { SkillsImageIcon, AboutMeImageIcon, ProjectsImageIcon, ContactImageIcon, ResumeImageIcon } from "@/components/WindowsIcons";

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
          <Window
            title="About Me"
            icon={<AboutMeImageIcon className="w-4 h-4" />}
            initialPosition={{ x: 300, y: 150 }}
            initialSize={{ width: 500, height: 400 }}
            onClose={() => toggleWindow("about")}
            onMinimize={() => toggleMinimize("about")}
            isMinimized={windows.about.isMinimized}
          >
            <div className="space-y-4 font-normal">
              <h2 className="text-2xl font-bold text-gray-800">Hello, I&apos;m a Designer</h2>
              <p className="text-gray-600 font-light">
                I create beautiful and functional user experiences. Welcome to my portfolio!
              </p>
            </div>
          </Window>
        )}

        {windows.projects.isOpen && (
          <Window
            title="Projects"
            icon={<ProjectsImageIcon className="w-4 h-4" />}
            initialPosition={{ x: 500, y: 200 }}
            initialSize={{ width: 500, height: 400 }}
            onClose={() => toggleWindow("projects")}
            onMinimize={() => toggleMinimize("projects")}
            isMinimized={windows.projects.isMinimized}
          >
            <div className="space-y-4 font-normal">
              <h2 className="text-2xl font-bold text-gray-800">My Projects</h2>
              <p className="text-gray-600 font-light">Check out my latest work here.</p>
            </div>
          </Window>
        )}

        {windows.skills.isOpen && (
          <Window
            title="Skills"
            icon={<SkillsImageIcon className="w-4 h-4" />}
            initialPosition={{ x: 400, y: 180 }}
            initialSize={{ width: 450, height: 350 }}
            onClose={() => toggleWindow("skills")}
            onMinimize={() => toggleMinimize("skills")}
            isMinimized={windows.skills.isMinimized}
          >
            <div className="space-y-4 font-normal">
              <h2 className="text-2xl font-bold text-gray-800">Skills</h2>
              <p className="text-gray-600 font-light">My technical and design skills.</p>
            </div>
          </Window>
        )}

        {windows.contact.isOpen && (
          <Window
            title="Contact"
            icon={<ContactImageIcon className="w-4 h-4" />}
            initialPosition={{ x: 350, y: 220 }}
            initialSize={{ width: 450, height: 350 }}
            onClose={() => toggleWindow("contact")}
            onMinimize={() => toggleMinimize("contact")}
            isMinimized={windows.contact.isMinimized}
          >
            <div className="space-y-4 font-normal">
              <h2 className="text-2xl font-bold text-gray-800">Contact</h2>
              <p className="text-gray-600 font-light">Get in touch with me.</p>
            </div>
          </Window>
        )}

        {windows.resume.isOpen && (
          <Window
            title="Resume"
            icon={<ResumeImageIcon className="w-4 h-4" />}
            initialPosition={{ x: 450, y: 160 }}
            initialSize={{ width: 500, height: 400 }}
            onClose={() => toggleWindow("resume")}
            onMinimize={() => toggleMinimize("resume")}
            isMinimized={windows.resume.isMinimized}
          >
            <div className="space-y-4 font-normal">
              <h2 className="text-2xl font-bold text-gray-800">Resume</h2>
              <p className="text-gray-600 font-light">My resume and work experience.</p>
            </div>
          </Window>
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
