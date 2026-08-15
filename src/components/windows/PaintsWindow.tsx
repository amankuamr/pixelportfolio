"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Paintbrush,
  Eraser,
  Trash2,
  Download,
  Palette,
  Square,
  Circle,
  Type,
  Pipette,
  Undo2,
  Redo2,
  Minus,
} from "lucide-react";

interface PaintsWindowProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isMinimized?: boolean;
  isMaximized?: boolean;
  zIndex?: number;
  onFocus?: () => void;
}

type Tool = "brush" | "eraser" | "rectangle" | "circle" | "line" | "fill" | "text" | "picker";
type BrushShape = "round" | "square" | "spray";

interface HistoryState {
  imageData: ImageData;
}

const COLORS = [
  "#D9FF00",
  "#ffffff",
  "#000000",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ff6600",
  "#8B4513",
  "#FF1493",
  "#00CED1",
  "#FF4500",
  "#32CD32",
];

export default function PaintsWindow({
  initialPosition = { x: 80, y: 40 },
  initialSize = { width: 1100, height: 720 },
  onClose,
  onMinimize,
  onMaximize,
  isMinimized = false,
  isMaximized = false,
  zIndex = 10,
  onFocus,
}: PaintsWindowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [tool, setTool] = useState<Tool>("brush");
  const [brushSize, setBrushSize] = useState(4);
  const [currentColor, setCurrentColor] = useState("#D9FF00");
  const [brushShape, setBrushShape] = useState<BrushShape>("round");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  useEffect(() => {
    const taskbarHeight = 52;
    if (isMaximized) {
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight - taskbarHeight });
    } else {
      setPosition(initialPosition);
      setSize(initialSize);
    }
  }, [isMaximized, initialPosition, initialSize]);

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ imageData });
      if (newHistory.length > 40) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 39));
  }, [historyIndex]);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = Math.floor(parent.clientWidth);
    const h = Math.floor(parent.clientHeight);
    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = "#151F27";
    ctx.fillRect(0, 0, w, h);
    saveHistory();
  }, [saveHistory]);

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initCanvas]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      ctx.putImageData(history[newIndex].imageData, 0, 0);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      ctx.putImageData(history[newIndex].imageData, 0, 0);
    }
  }, [history, historyIndex]);

  const floodFill = useCallback((startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const sx = Math.floor(startX);
    const sy = Math.floor(startY);
    if (sx < 0 || sy < 0 || sx >= w || sy >= h) return;

    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    const targetIdx = (sy * w + sx) * 4;
    const targetR = data[targetIdx];
    const targetG = data[targetIdx + 1];
    const targetB = data[targetIdx + 2];
    const targetA = data[targetIdx + 3];

    const hex = fillColor.replace("#", "");
    const fr = parseInt(hex.substring(0, 2), 16);
    const fg = parseInt(hex.substring(2, 4), 16);
    const fb = parseInt(hex.substring(4, 6), 16);

    if (targetR === fr && targetG === fg && targetB === fb) return;

    const stack: [number, number][] = [[sx, sy]];
    const visited = new Uint8Array(w * h);

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const idx = y * w + x;
      if (visited[idx]) continue;
      const pi = idx * 4;
      if (
        Math.abs(data[pi] - targetR) > 30 ||
        Math.abs(data[pi + 1] - targetG) > 30 ||
        Math.abs(data[pi + 2] - targetB) > 30 ||
        Math.abs(data[pi + 3] - targetA) > 30
      )
        continue;

      visited[idx] = 1;
      data[pi] = fr;
      data[pi + 1] = fg;
      data[pi + 2] = fb;
      data[pi + 3] = 255;

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    ctx.putImageData(imageData, 0, 0);
    saveHistory();
  }, [saveHistory]);

  const drawBrush = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.fillStyle = tool === "eraser" ? "#151F27" : currentColor;
      if (brushShape === "round") {
        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (brushShape === "square") {
        ctx.fillRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
      } else if (brushShape === "spray") {
        const density = brushSize * 2;
        for (let i = 0; i < density; i++) {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * brushSize;
          const px = x + Math.cos(angle) * radius;
          const py = y + Math.sin(angle) * radius;
          ctx.fillRect(px, py, 1, 1);
        }
      }
    },
    [tool, currentColor, brushSize, brushShape]
  );

  const drawShapePreview = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      if (!snapshot || !startPos) return;
      ctx.putImageData(snapshot, 0, 0);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "square";
      ctx.lineJoin = "miter";
      const sx = startPos.x;
      const sy = startPos.y;

      if (tool === "rectangle") {
        const rx = Math.min(sx, x);
        const ry = Math.min(sy, y);
        const rw = Math.abs(x - sx);
        const rh = Math.abs(y - sy);
        ctx.strokeRect(rx, ry, rw, rh);
      } else if (tool === "circle") {
        const radiusX = Math.abs(x - sx) / 2;
        const radiusY = Math.abs(y - sy) / 2;
        const centerX = Math.min(sx, x) + radiusX;
        const centerY = Math.min(sy, y) + radiusY;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (tool === "line") {
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    },
    [snapshot, startPos, currentColor, brushSize, tool]
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isResizing || isDragging) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { x, y } = getCanvasCoords(e);

      if (tool === "picker") {
        const pi = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const hex =
          "#" +
          [imageData.data[pi], imageData.data[pi + 1], imageData.data[pi + 2]]
            .map((v) => v.toString(16).padStart(2, "0"))
            .join("");
        setCurrentColor(hex);
        setTool("brush");
        return;
      }

      if (tool === "fill") {
        floodFill(x, y, currentColor);
        return;
      }

      setIsDrawing(true);
      setStartPos({ x, y });
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setSnapshot(img);

      if (tool === "brush" || tool === "eraser") {
        ctx.beginPath();
        ctx.moveTo(x, y);
        drawBrush(ctx, x, y);
      }
    },
    [tool, getCanvasCoords, drawBrush, floodFill, isResizing, isDragging, currentColor]
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { x, y } = getCanvasCoords(e);

      if (tool === "brush" || tool === "eraser") {
        drawBrush(ctx, x, y);
      } else if (tool === "rectangle" || tool === "circle" || tool === "line") {
        drawShapePreview(ctx, x, y);
      }
    },
    [isDrawing, tool, getCanvasCoords, drawBrush, drawShapePreview]
  );

  const handleCanvasMouseUp = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      setStartPos(null);
      setSnapshot(null);
      saveHistory();
    }
  }, [isDrawing, saveHistory]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#151F27";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistory();
  }, [saveHistory]);

  const downloadCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `paints-${Date.now()}.png`;
    link.href = url;
    link.click();
  }, []);

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".window-controls")) return;
    if ((e.target as HTMLElement).closest(".resize-handle")) return;
    if (isMaximized) return;
    onFocus?.();
    setIsDragging(true);
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY, w: size.width, h: size.height });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
      if (isResizing && resizeStart) {
        const newW = Math.max(700, resizeStart.w + (e.clientX - resizeStart.x));
        const newH = Math.max(500, resizeStart.h + (e.clientY - resizeStart.y));
        setSize({ width: newW, height: newH });
      }
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeStart(null);
    };
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, size]);

  const tools: { id: Tool; icon: React.ReactNode }[] = [
    { id: "brush", icon: <Paintbrush className="w-4 h-4" /> },
    { id: "eraser", icon: <Eraser className="w-4 h-4" /> },
    { id: "rectangle", icon: <Square className="w-4 h-4" /> },
    { id: "circle", icon: <Circle className="w-4 h-4" /> },
    { id: "line", icon: <Minus className="w-4 h-4" /> },
    { id: "fill", icon: <span className="text-xs font-bold">F</span> },
    { id: "text", icon: <Type className="w-4 h-4" /> },
    { id: "picker", icon: <Pipette className="w-4 h-4" /> },
  ];

  const brushShapes: { id: BrushShape; label: string }[] = [
    { id: "round", label: "Round" },
    { id: "square", label: "Square" },
    { id: "spray", label: "Spray" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        opacity: isMinimized ? 0 : 1,
        scale: isMinimized ? 0.95 : 1,
        pointerEvents: isMinimized ? "none" : "auto",
      }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute bg-[#151F27] border border-gray-700 overflow-hidden flex flex-col"
      style={{ zIndex, borderRadius: 0 }}
    >
      <div
        className="h-10 bg-[#1a2332] flex items-center px-3 gap-2 cursor-move select-none border-b border-gray-700 shrink-0"
        onMouseDown={handleHeaderMouseDown}
      >
        <div className="w-5 h-5 flex items-center justify-center text-gray-400">
          <Palette className="w-4 h-4" />
        </div>
        <span className="text-sm font-semibold text-gray-200 flex-1">Paints</span>
        <div className="window-controls flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMaximize}
            className="w-5 h-5 flex items-center justify-center border border-yellow-400/60"
            style={{ borderRadius: 0, backgroundColor: "rgba(250,204,21,0.15)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-yellow-400">
              {isMaximized ? (
                <>
                  <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="2" />
                  <path d="M9 9h6v6H9z" fill="currentColor" />
                </>
              ) : (
                <>
                  <rect x="5" y="5" width="14" height="14" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 8h8v8H8z" fill="currentColor" />
                </>
              )}
            </svg>
          </motion.button>
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

      <div className="flex flex-1 min-h-0">
        <div
          ref={containerRef}
          className="w-52 bg-[#0f1924] border-r border-gray-700 p-2 flex flex-col gap-2 shrink-0 overflow-y-auto"
        >
          <div>
            <div className="text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">Brush Shape</div>
            <div className="grid grid-cols-3 gap-1">
              {brushShapes.map((shape) => (
                <motion.button
                  key={shape.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setBrushShape(shape.id)}
                  className={`h-7 border text-[10px] transition-colors ${
                    brushShape === shape.id ? "accent-border bg-[#151F27] accent-text" : "border-gray-700 text-gray-400 hover:text-gray-200"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {shape.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">
              Size: {brushSize}px
            </div>
            <input
              type="range"
              min="1"
              max="40"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full h-1 bg-gray-700 appearance-none cursor-pointer accent-[#D9FF00]"
              style={{ borderRadius: 0 }}
            />
          </div>

          <div>
            <div className="text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">
              Colors
            </div>
            <div className="grid grid-cols-5 gap-1">
              {COLORS.map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setCurrentColor(color); setTool("brush"); }}
                  className={`w-7 h-7 border transition-colors ${
                    currentColor === color && tool === "brush" ? "accent-border" : "border-gray-700"
                  }`}
                  style={{ borderRadius: 0, backgroundColor: color }}
                />
              ))}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <input
                type="color"
                value={currentColor}
                onChange={(e) => { setCurrentColor(e.target.value); setTool("brush"); }}
                className="w-full h-7 cursor-pointer border border-gray-700"
                style={{ borderRadius: 0 }}
              />
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={undo}
                className="h-8 border border-gray-700 text-gray-300 text-[11px] flex items-center justify-center gap-1 hover:bg-[#151F27] transition-colors"
                style={{ borderRadius: 0 }}
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={redo}
                className="h-8 border border-gray-700 text-gray-300 text-[11px] flex items-center justify-center gap-1 hover:bg-[#151F27] transition-colors"
                style={{ borderRadius: 0 }}
              >
                <Redo2 className="w-3.5 h-3.5" />
                <span>Redo</span>
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearCanvas}
              className="w-full h-8 border border-red-400/60 text-red-400 text-[11px] flex items-center justify-center gap-1.5 hover:bg-red-400/10 transition-colors"
              style={{ borderRadius: 0 }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadCanvas}
              className="w-full h-8 border border-gray-700 text-gray-200 text-[11px] flex items-center justify-center gap-1.5 hover:bg-[#0f1924] transition-colors"
              style={{ borderRadius: 0 }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save</span>
            </motion.button>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 bg-[#151F27]">
          <div className="flex-1 overflow-hidden relative">
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              className="w-full h-full cursor-crosshair"
              style={{ borderRadius: 0, backgroundColor: "#151F27", display: "block" }}
            />
          </div>

          <div className="h-10 bg-[#1a2332] border-t border-gray-700 flex items-center px-2 gap-1 shrink-0">
            {tools.map((t) => (
              <motion.button
                key={t.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTool(t.id)}
                className={`w-8 h-8 border flex items-center justify-center transition-colors ${
                  tool === t.id ? "accent-border bg-[#151F27] accent-text" : "border-gray-700 text-gray-400 hover:text-gray-200"
                }`}
                style={{ borderRadius: 0 }}
                title={t.id}
              >
                {t.icon}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {!isMaximized && (
        <div
          className="resize-handle absolute bottom-0 right-0 w-5 h-5 cursor-se-resize z-20"
          onMouseDown={handleResizeMouseDown}
          style={{
            borderLeft: "1px solid var(--accent-border)",
            borderTop: "1px solid var(--accent-border)",
            backgroundColor: "rgba(21,31,39,0.8)",
          }}
        />
      )}
    </motion.div>
  );
}
