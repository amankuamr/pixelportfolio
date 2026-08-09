"use client";

import { ReactNode } from "react";

interface DesktopIconProps {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

export default function DesktopIcon({ label, icon, onClick }: DesktopIconProps) {
  return (
    <div
      className="flex flex-col items-center gap-2 p-2 cursor-pointer transition-colors w-24 group"
      onClick={onClick}
    >
      <div className="w-16 h-16 flex items-center justify-center border border-gray-400 group-hover:border-[#D9FF00] transition-colors">
        <div className="w-12 h-12 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <span className="text-xs text-white text-center drop-shadow-md leading-tight line-clamp-2 font-medium">
        {label}
      </span>
    </div>
  );
}
