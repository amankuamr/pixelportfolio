"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Brush, Eraser, Trash2, Download, Palette } from "lucide-react";

interface PaintsWindowProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onClose?: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  zIndex?: number;
  onFocus?: () => void;
}

const COLORS = [
  "#D9FF00", "#ffffff", "#000000", "#ff0000", "#00ff00",
  "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ff6600",
];

export default function PaintsWindow({
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 900, height: 600 },
  onClose,
  onMinimize,
  isMinimized = false,
  zIndex = 10,
  onFocus,
}: PaintsWindowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(4);
  const [currentColor, setCurrentColor] = useState("#D9FF00");
  const [tool, setTool] = useState<"brush" | "eraser">("brush");

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  }, [getCanvasCoords]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = tool === "eraser" ? "#151F27" : currentColor;
    ctx.lineWidth = tool === "eraser" ? brushSize * 4 : brushSize;
    ctx.lineCap = "square";
    ctx.stroke();
  }, [isDrawing, getCanvasCoords, tool, currentColor, brushSize]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#151F27";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const downloadCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "paints-drawing.png";
    link.href = url;
    link.click();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = initialSize.width - 208;
    canvas.height = initialSize.height - 84;
    ctx.fillStyle = "#151F27";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [initialSize]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: isMinimized ? 0 : 1,
        scale: isMinimized ? 0.95 : 1,
        pointerEvents: isMinimized ? "none" : "auto",
      }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
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
        className="h-10 bg-[#1a2332] flex items-center px-3 gap-2 cursor-move select-none border-b border-gray-700"
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest(".window-controls")) return;
          onFocus?.();
        }}
      >
        <div className="w-5 h-5 flex items-center justify-center text-gray-400">
          <Palette className="w-4 h-4" />
        </div>
        <span className="text-sm font-semibold text-gray-200 flex-1">Paints</span>
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

      <div className="flex h-[calc(100%-40px)]">
        <div className="w-48 bg-[#0f1924] border-r border-gray-700 p-3 flex flex-col gap-3 shrink-0 overflow-y-auto">
          <div>
            <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Tools</div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTool("brush")}
                className={`flex-1 h-10 border flex items-center justify-center transition-colors ${
                  tool === "brush" ? "accent-border bg-[#151F27]" : "border-gray-600 hover:border-gray-400"
                }`}
                style={{ borderRadius: 0 }}
                title="Brush"
              >
                <Brush className={`w-4 h-4 ${tool === "brush" ? "accent-text" : "text-gray-400"}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTool("eraser")}
                className={`flex-1 h-10 border flex items-center justify-center transition-colors ${
                  tool === "eraser" ? "accent-border bg-[#151F27]" : "border-gray-600 hover:border-gray-400"
                }`}
                style={{ borderRadius: 0 }}
                title="Eraser"
              >
                <Eraser className={`w-4 h-4 ${tool === "eraser" ? "accent-text" : "text-gray-400"}`} />
              </motion.button>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Brush Size</div>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full h-1 bg-gray-600 appearance-none cursor-pointer accent-[#D9FF00]"
              style={{ borderRadius: 0 }}
            />
            <div className="text-xs text-gray-500 mt-1 text-center">{brushSize}px</div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Colors</div>
            <div className="grid grid-cols-5 gap-1.5">
              {COLORS.map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setCurrentColor(color); setTool("brush"); }}
                  className={`w-7 h-7 border transition-colors ${
                    currentColor === color && tool === "brush" ? "accent-border" : "border-gray-600"
                  }`}
                  style={{ borderRadius: 0, backgroundColor: color }}
                />
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <input
                type="color"
                value={currentColor}
                onChange={(e) => { setCurrentColor(e.target.value); setTool("brush"); }}
                className="w-full h-8 cursor-pointer border border-gray-600"
                style={{ borderRadius: 0 }}
              />
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearCanvas}
              className="w-full h-9 border border-red-400/60 text-red-400 text-xs flex items-center justify-center gap-2 hover:bg-red-400/10 transition-colors"
              style={{ borderRadius: 0 }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadCanvas}
              className="w-full h-9 border border-gray-600 text-gray-200 text-xs flex items-center justify-center gap-2 hover:bg-[#0f1924] transition-colors"
              style={{ borderRadius: 0 }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save</span>
            </motion.button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-[#151F27] p-2 overflow-auto">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="border border-gray-700 cursor-crosshair"
            style={{ borderRadius: 0, backgroundColor: "#151F27" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
