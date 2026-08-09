"use client";

import { useState, useEffect } from "react";
import Background from "@/components/Background";
import Taskbar from "@/components/Taskbar";
import Window from "@/components/Window";
import DesktopIcon from "@/components/DesktopIcon";
import LoginScreen from "@/components/LoginScreen";
import ContextMenu from "@/components/ContextMenu";
import { SkillsImageIcon, AboutMeImageIcon, ProjectsImageIcon, ContactImageIcon, ResumeImageIcon } from "@/components/WindowsIcons";
import { motion } from "framer-motion";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

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

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const [windows, setWindows] = useState({
    about: { isOpen: false, isMinimized: false },
    projects: { isOpen: false, isMinimized: false },
    skills: { isOpen: false, isMinimized: false },
    contact: { isOpen: false, isMinimized: false },
    resume: { isOpen: false, isMinimized: false },
  });

  const toggleWindow = (name: keyof typeof windows) => {
    setWindows((prev) => ({
      ...prev,
      [name]: { ...prev[name], isOpen: !prev[name].isOpen, isMinimized: false },
    }));
  };

  const toggleMinimize = (name: string) => {
    setWindows((prev) => ({
      ...prev,
      [name]: { ...prev[name as keyof typeof prev], isMinimized: !prev[name as keyof typeof prev].isMinimized },
    }));
  };

  useEffect(() => {
    const handleClick = () => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [contextMenu]);

  const taskbarWindows = [
    { id: "about" as const, title: "About Me", icon: <AboutMeImageIcon className="w-full h-full" />, isOpen: windows.about.isOpen, isMinimized: windows.about.isMinimized },
    { id: "projects" as const, title: "Projects", icon: <ProjectsImageIcon className="w-full h-full" />, isOpen: windows.projects.isOpen, isMinimized: windows.projects.isMinimized },
    { id: "skills" as const, title: "Skills", icon: <SkillsImageIcon className="w-full h-full" />, isOpen: windows.skills.isOpen, isMinimized: windows.skills.isMinimized },
    { id: "contact" as const, title: "Contact", icon: <ContactImageIcon className="w-full h-full" />, isOpen: windows.contact.isOpen, isMinimized: windows.contact.isMinimized },
    { id: "resume" as const, title: "Resume", icon: <ResumeImageIcon className="w-full h-full" />, isOpen: windows.resume.isOpen, isMinimized: windows.resume.isMinimized },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Background />

      <div className="relative z-10 w-full h-full pb-12" onContextMenu={handleContextMenu}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="flex flex-col items-start gap-2 p-4"
        >
          <DesktopIcon label="About Me" icon={<AboutMeImageIcon className="w-full h-full" />} onClick={() => toggleWindow("about")} />
          <DesktopIcon label="Projects" icon={<ProjectsImageIcon className="w-full h-full" />} onClick={() => toggleWindow("projects")} />
          <DesktopIcon label="Skills" icon={<SkillsImageIcon className="w-full h-full" />} onClick={() => toggleWindow("skills")} />
          <DesktopIcon label="Contact" icon={<ContactImageIcon className="w-full h-full" />} onClick={() => toggleWindow("contact")} />
          <DesktopIcon label="Resume" icon={<ResumeImageIcon className="w-full h-full" />} onClick={() => toggleWindow("resume")} />
        </motion.div>

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
      </div>

      <Taskbar windows={taskbarWindows} onToggleMinimize={toggleMinimize} />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
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
