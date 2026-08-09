"use client";

import Image from "next/image";

export function PcIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <rect x="8" y="4" width="32" height="24" rx="2" fill="#0078d4" stroke="#005a9e" strokeWidth="1.5" />
      <rect x="12" y="8" width="24" height="16" fill="#005a9e" />
      <rect x="14" y="10" width="20" height="12" fill="#1e90ff" />
      <rect x="16" y="28" width="16" height="2" fill="#5c5c5c" />
      <rect x="20" y="30" width="8" height="6" fill="#5c5c5c" />
      <rect x="18" y="36" width="12" height="2" fill="#5c5c5c" />
      <rect x="22" y="38" width="4" height="2" fill="#5c5c5c" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <path d="M12 8C12 6.9 12.9 6 14 6H34C35.1 6 36 6.9 36 8V40C36 41.1 35.1 42 34 42H14C12.9 42 12 41.1 12 40V8Z" fill="#e74856" stroke="#c50f1f" strokeWidth="1.5" />
      <path d="M18 8V6H30V8" fill="#c50f1f" />
      <path d="M20 14L22 38H26L28 14H20Z" fill="white" opacity="0.9" />
      <rect x="20" y="18" width="8" height="2" fill="#c50f1f" opacity="0.5" />
      <rect x="20" y="24" width="8" height="2" fill="#c50f1f" opacity="0.5" />
      <rect x="20" y="30" width="8" height="2" fill="#c50f1f" opacity="0.5" />
    </svg>
  );
}

export function ProjectsImageIcon({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className || ""}`}>
      <Image src="/desktopico/projects.png" alt="Projects" width={48} height={48} className="w-full h-full object-contain" />
    </div>
  );
}

export function FolderIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <path d="M4 10C4 8.9 4.9 8 6 8H18L22 12H42C43.1 12 44 12.9 44 14V38C44 39.1 43.1 40 42 40H6C4.9 40 4 39.1 4 38V10Z" fill="#ffb900" stroke="#d4920a" strokeWidth="1.5" />
      <path d="M4 14H44V38C44 39.1 43.1 40 42 40H6C4.9 40 4 39.1 4 38V14Z" fill="#fcd116" />
      <path d="M4 14H44V16H4V14Z" fill="#d4920a" />
    </svg>
  );
}

export function ContactImageIcon({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className || ""}`}>
      <Image src="/desktopico/contact.png" alt="Contact" width={48} height={48} className="w-full h-full object-contain" />
    </div>
  );
}

export function ContactIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <rect x="4" y="8" width="40" height="32" rx="3" fill="#0078d4" stroke="#005a9e" strokeWidth="1.5" />
      <path d="M4 14L24 24L44 14" stroke="white" strokeWidth="2.5" fill="none" />
      <circle cx="14" cy="32" r="3" fill="white" opacity="0.6" />
      <circle cx="34" cy="32" r="3" fill="white" opacity="0.6" />
      <rect x="4" y="14" width="40" height="22" fill="url(#contactGrad)" opacity="0.3" />
      <defs>
        <linearGradient id="contactGrad" x1="4" y1="14" x2="44" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="#0078d4" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ResumeImageIcon({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className || ""}`}>
      <Image src="/desktopico/resume.png" alt="Resume" width={48} height={48} className="w-full h-full object-contain" />
    </div>
  );
}

export function DocumentIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <path d="M12 4H28L38 14V42H12V4Z" fill="white" stroke="#a0a0a0" strokeWidth="1.5" />
      <path d="M28 4V14H38" fill="#f0f0f0" stroke="#a0a0a0" strokeWidth="1.5" />
      <rect x="16" y="22" width="20" height="3" rx="1" fill="#0078d4" opacity="0.7" />
      <rect x="16" y="28" width="16" height="3" rx="1" fill="#0078d4" opacity="0.5" />
      <rect x="16" y="34" width="18" height="3" rx="1" fill="#0078d4" opacity="0.3" />
    </svg>
  );
}

export function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <rect x="8" y="14" width="32" height="24" rx="3" fill="#ff8c00" stroke="#c55a00" strokeWidth="1.5" />
      <rect x="14" y="10" width="20" height="6" rx="2" fill="#ff8c00" stroke="#c55a00" strokeWidth="1.5" />
      <rect x="20" y="14" width="8" height="10" fill="#c55a00" />
      <circle cx="24" cy="19" r="2" fill="#ff8c00" />
      <rect x="12" y="28" width="24" height="2" fill="#c55a00" opacity="0.5" />
      <rect x="12" y="32" width="24" height="2" fill="#c55a00" opacity="0.5" />
    </svg>
  );
}

export function SkillsImageIcon({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className || ""}`}>
      <Image src="/desktopico/skills.png" alt="Skills" width={48} height={48} className="w-full h-full object-contain" />
    </div>
  );
}

export function AboutMeImageIcon({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className || ""}`}>
      <Image src="/desktopico/Aboutme.png" alt="About Me" width={48} height={48} className="w-full h-full object-contain" />
    </div>
  );
}
