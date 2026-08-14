"use client";

import { motion } from "framer-motion";

interface BackgroundProps {
  src: string;
}

export default function Background({ src }: BackgroundProps) {
  const isVideo = src.endsWith(".mp4");

  return (
    <div className="fixed inset-0 z-0">
      {isVideo ? (
        <video
          key={src}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={src} type="video/mp4" suppressHydrationWarning />
        </video>
      ) : (
        <img
          key={src}
          src={src}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
          suppressHydrationWarning
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-black/20"
      />
    </div>
  );
}
