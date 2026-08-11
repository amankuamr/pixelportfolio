"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface CmdWindowProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onClose?: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  title?: string;
  initialLines?: string[];
  zIndex?: number;
  onFocus?: () => void;
}

interface CommandHistory {
  command: string;
  output: string[];
}

export default function CmdWindow({
  initialPosition = { x: 300, y: 150 },
  initialSize = { width: 600, height: 400 },
  onClose,
  onMinimize,
  isMinimized = false,
  title = "Command Prompt",
  initialLines = [],
  zIndex = 10,
  onFocus,
}: CmdWindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: "help",
      output: [
        "Available commands:",
        "  help     - Show this help message",
        "  about    - About me",
        "  projects - View projects",
        "  skills   - View skills",
        "  contact  - Contact information",
        "  clear    - Clear terminal",
        "  whoami   - Who is this?",
      ],
    },
    {
      command: "whoami",
      output: ["Aman Kumar - Visual Designer & Developer"],
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorVisible, setCursorVisible] = useState(true);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".window-controls")) return;
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

  const processCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output: string[] = [];

    switch (trimmed) {
      case "help":
        output = [
          "Available commands:",
          "  help     - Show this help message",
          "  about    - About me",
          "  projects - View projects",
          "  skills   - View skills",
          "  contact  - Contact information",
          "  clear    - Clear terminal",
          "  whoami   - Who is this?",
        ];
        break;
      case "about":
        output = [
          "Hello! I'm Aman Kumar,",
          "a Visual Designer & Developer passionate about",
          "creating beautiful and functional user experiences.",
        ];
        break;
      case "projects":
        output = [
          "Projects:",
          "  1. Portfolio XP - Windows-style portfolio",
          "  2. More projects coming soon...",
        ];
        break;
      case "skills":
        output = [
          "Skills:",
          "  - UI/UX Design",
          "  - Frontend Development",
          "  - React, Next.js, TypeScript",
          "  - Figma, Adobe XD",
        ];
        break;
      case "contact":
        output = [
          "Contact:",
          "  Email: aman@example.com",
          "  GitHub: github.com/amankumar",
          "  LinkedIn: linkedin.com/in/amankumar",
        ];
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "whoami":
        output = ["Aman Kumar - Visual Designer & Developer"];
        break;
      case "":
        break;
      default:
        output = [`'${trimmed}' is not recognized as an internal or external command.`];
    }

    if (trimmed !== "") {
      setHistory((prev) => [...prev, { command: cmd, output }]);
      setCommandHistory((prev) => [...prev, cmd]);
    }

    setInput("");
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      processCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  const cursorClass = cursorVisible ? "opacity-100" : "opacity-0";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={
        isMinimized
          ? { opacity: 0, scale: 0.95, pointerEvents: "none" }
          : { opacity: 1, scale: 1, pointerEvents: "auto" }
      }
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute border border-gray-700 overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: initialSize.width,
        height: initialSize.height,
        zIndex,
        borderRadius: 0,
      }}
    >
      <div
        className="h-8 bg-[#1a2332] border-b border-[#D9FF00]/30 flex items-center px-3 gap-2 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="w-4 h-4 flex items-center justify-center text-gray-400">
          <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
            <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="2" />
            <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="2" />
            <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="7" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-gray-200 flex-1">{title}</span>
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

      <div className="h-[calc(100%-32px)] bg-black flex flex-col">
        <div
          ref={outputRef}
          className="flex-1 overflow-y-auto p-3 font-mono text-sm cmd-scrollbar"
          style={{
            fontFamily: '"Courier New", "Lucida Console", monospace',
          }}
        >
          <div className="text-green-400 mb-2">
            Microsoft Windows [Version 10.0.19045.3693]
          </div>
          <div className="text-green-400 mb-4">
            (c) Microsoft Corporation. All rights reserved.
          </div>
          <br />

          {initialLines.map((line, index) => (
            <div key={`init-${index}`} className="text-green-400 mb-1">
              {line}
            </div>
          ))}

          {initialLines.length > 0 && <br />}

          {history.map((item, index) => (
            <div key={index} className="mb-3">
              <div className="text-white">
                <span className="text-green-400">C:\\Users\\User&gt;</span> {item.command}
              </div>
              {item.output.map((line, lineIndex) => (
                <div
                  key={lineIndex}
                  className={`${
                    line.startsWith("Available") || line.startsWith("Skills:") || line.startsWith("Projects:") || line.startsWith("Contact:")
                      ? "text-white font-bold"
                      : "text-green-400"
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          ))}

          <div className="flex items-center text-white">
            <span className="text-green-400">C:\\Users\\User&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-white ml-1"
              style={{ fontFamily: '"Courier New", "Lucida Console", monospace' }}
              autoFocus
            />
            <span className={`inline-block w-2 h-4 bg-green-400 ml-0.5 ${cursorClass}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
